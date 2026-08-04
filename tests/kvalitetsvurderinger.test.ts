import { expect, test } from '@playwright/test';
import { getParsedUrl, UI_DOMAIN } from './functions';

const KVALITETSVURDERING_REGEX = /^.*\/kvalitetsvurderinger\/[\d\w-]+$/;
const KVALITETSVURDERINGER_REGEX = /^.*\/kvalitetsvurderinger#?$/;

test.describe('Kvalitetsvurderinger', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${UI_DOMAIN}/kvalitetsvurderinger`);
  });

  test('"Kvalitetsvurderinger" loads incomplete kvalitetsvurderinger', async ({ page }) => {
    const url = getParsedUrl(page.url());
    expect(url.pathname).toBe('/kvalitetsvurderinger');
    await page.getByRole('region', { name: 'Påbegynte vurderinger' }).getByRole('table').waitFor();
  });

  test('"Kvalitetsvurderinger" loads complete kvalitetsvurderinger', async ({ page }) => {
    const url = getParsedUrl(page.url());
    expect(url.pathname).toBe('/kvalitetsvurderinger');
    await page.getByRole('region', { name: 'Fullførte vurderinger' }).getByRole('table').waitFor();
  });

  test('Create and delete a new kvalitetsvurdering', async ({ page }) => {
    const url = getParsedUrl(page.url());
    expect(url.pathname).toBe('/kvalitetsvurderinger');

    // Create a new kvalitetsvurdering.
    await page.getByText('Ny kvalitetsvurdering').click();
    await page.waitForURL(KVALITETSVURDERING_REGEX, { timeout: 10000 });
    const urlAfterClick = getParsedUrl(page.url());
    const [, , id] = urlAfterClick.pathname.split('/');

    // Go back to list page.
    await page.goBack();
    await page.waitForURL(KVALITETSVURDERINGER_REGEX, { timeout: 10000 });

    const table = page.getByRole('region', { name: 'Påbegynte vurderinger' }).getByRole('table');
    await table.waitFor({ state: 'visible', timeout: 1000 });

    // Check that the new kvalitetsvurdering is in the list.
    const paabegyntRow = page.locator(`tr[data-saksdata-id="${id}"]`);
    await paabegyntRow.waitFor();

    // Open the new kvalitetsvurdering.
    const openButton = paabegyntRow.getByText('Åpne');

    await openButton.click();
    await page.waitForURL(KVALITETSVURDERING_REGEX, { timeout: 10000 });

    // Check that the new kvalitetsvurdering is open.
    expect(getParsedUrl(page.url()).pathname).toBe(`/kvalitetsvurderinger/${id}`);

    // Delete the new kvalitetsvurdering.
    await page.click('data-testid=delete-button');
    await page.waitForURL('**/kvalitetsvurderinger', { timeout: 3000 });
  });
});
