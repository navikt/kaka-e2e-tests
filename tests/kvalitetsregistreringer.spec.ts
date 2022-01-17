import { expect, test } from '@playwright/test';
import { getParsedUrl } from './functions';
import { getLoggedInPage } from './helpers';
import { userSaksbehandler } from './users';

test.describe('Kvalitetsregistreringer', () => {
  test.beforeEach(async ({ page }) => {
    await getLoggedInPage(page, userSaksbehandler, '/kvalitetsregistreringer');
  });

  test('"Kvalitetsregistreringer" loads incomplete kvalitetsregistreringer', async ({ page }) => {
    const url = getParsedUrl(page.url());
    expect(url.pathname).toBe('/kvalitetsregistreringer');
    await page.waitForSelector('data-testid=paabegynte-registreringer-table-loaded', { timeout: 10000 });
  });

  test('"Kvalitetsregistreringer" loads complete kvalitetsregistreringer', async ({ page }) => {
    const url = getParsedUrl(page.url());
    expect(url.pathname).toBe('/kvalitetsregistreringer');
    await page.waitForSelector('data-testid=fullfoerte-registreringer-table-loaded', { timeout: 10000 });
  });

  test('Create and delete a new kvalitetsvurdering', async ({ page }) => {
    const url = getParsedUrl(page.url());
    expect(url.pathname).toBe('/kvalitetsregistreringer');

    // Create a new kvalitetsvurdering.
    await page.click('data-testid=new-kvalitetsvurdering-button', { timeout: 10000 });
    await page.waitForURL(/^https:\/\/kaka.dev.nav.no\/kvalitetsregistreringer\/[\d\w-]+$/, { timeout: 10000 });
    const urlAfterClick = getParsedUrl(page.url());
    const [, , id] = urlAfterClick.pathname.split('/');

    // Go back to list page.
    await page.goBack();
    await page.waitForURL(/^https:\/\/kaka.dev.nav.no\/kvalitetsregistreringer#?$/, { timeout: 10000 });

    // Check that the new kvalitetsvurdering is in the list.
    const paabegyntRow = await page.waitForSelector(
      `[data-testid="paabegynte-registreringer-row"][data-saksdata-id="${id}"]`,
      { timeout: 2000 }
    );

    // Open the new kvalitetsvurdering.
    const openButton = await paabegyntRow.$(
      `[data-testid="kvalitetsregistreringer-open-link"][data-saksdata-id="${id}"]`
    );
    expect(openButton).not.toBeNull();

    if (openButton !== null) {
      await openButton.click();
    }

    // Check that the new kvalitetsvurdering is open.
    expect(urlAfterClick.pathname).toBe(`/kvalitetsregistreringer/${id}`);

    // Delete the new kvalitetsvurdering.
    await page.click('data-testid=delete-button');
    await page.waitForURL('https://kaka.dev.nav.no/kvalitetsregistreringer', { timeout: 3000 });
  });
});
