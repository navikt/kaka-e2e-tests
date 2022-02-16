import test, { expect } from '@playwright/test';
import { getParsedUrl } from './functions';
import { getLoggedInPage } from './helpers';
import { userSaksbehandler } from './users';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await getLoggedInPage(page, userSaksbehandler);
  });

  test('Åpen statistikk navigates to /statistikk/aapen', async ({ page }) => {
    const link = await page.waitForSelector('data-testid=statistikk-aapen-nav-link', { timeout: 10000 });

    await link.click();

    const url = getParsedUrl(page.url());
    expect(url.pathname).toBe('/statistikk/aapen');
  });

  test('Totalstatistikk navigates to /statistikk/total', async ({ page }) => {
    const link = await page.waitForSelector('data-testid=statistikk-total-nav-link', { timeout: 10000 });

    await link.click();

    const url = getParsedUrl(page.url());
    expect(url.pathname).toBe('/statistikk/total');
  });
});
