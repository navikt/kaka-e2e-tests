import { expect, test } from '@playwright/test';
import { UI_DOMAIN, getParsedUrl } from './functions';

const KVALITETSVURDERING_REGEX = /^https:\/\/kaka.intern.dev.nav.no\/kvalitetsvurderinger\/[\d\w-]+$/;
const KVALITETSVURDERINGER_REGEX = /^https:\/\/kaka.intern.dev.nav.no\/kvalitetsvurderinger#?$/;

test.describe('Kvalitetsvurderinger', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${UI_DOMAIN}/kvalitetsvurderinger`);
  });

  test('"Kvalitetsvurderinger" loads incomplete kvalitetsvurderinger', async ({ page }) => {
    const url = getParsedUrl(page.url());
    expect(url.pathname).toBe('/kvalitetsvurderinger');
    await page.waitForSelector('data-testid=paabegynte-vurderinger-table-loaded', { timeout: 10000 });
  });

  test('"Kvalitetsvurderinger" loads complete kvalitetsvurderinger', async ({ page }) => {
    const url = getParsedUrl(page.url());
    expect(url.pathname).toBe('/kvalitetsvurderinger');
    await page.waitForSelector('data-testid=fullfoerte-vurderinger-table-loaded', { timeout: 10000 });
  });

  test('Create and delete a new kvalitetsvurdering', async ({ page }) => {
    const url = getParsedUrl(page.url());
    expect(url.pathname).toBe('/kvalitetsvurderinger');

    // Create a new kvalitetsvurdering.
    await page.click('data-testid=new-kvalitetsvurdering-button', { timeout: 10000 });
    await page.waitForURL(KVALITETSVURDERING_REGEX, { timeout: 10000 });
    const urlAfterClick = getParsedUrl(page.url());
    const [, , id] = urlAfterClick.pathname.split('/');

    // Go back to list page.
    await page.goBack();
    await page.waitForURL(KVALITETSVURDERINGER_REGEX, { timeout: 10000 });

    // Check that the new kvalitetsvurdering is in the list.
    const paabegyntRow = await page.waitForSelector(
      `[data-testid="paabegynte-vurderinger-row"][data-saksdata-id="${id}"]`,
      { timeout: 2000 },
    );

    // Open the new kvalitetsvurdering.
    const openButton = await paabegyntRow.$(`[data-testid="kvalitetsvurderinger-open-link"][data-saksdata-id="${id}"]`);
    expect(openButton).not.toBeNull();

    if (openButton !== null) {
      await openButton.click();
    }

    // Check that the new kvalitetsvurdering is open.
    expect(urlAfterClick.pathname).toBe(`/kvalitetsvurderinger/${id}`);

    // Delete the new kvalitetsvurdering.
    await page.click('data-testid=delete-button');
    await page.waitForURL('https://kaka.intern.dev.nav.no/kvalitetsvurderinger', { timeout: 3000 });
  });
});
