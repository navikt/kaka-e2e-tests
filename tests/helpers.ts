import { Page, expect } from '@playwright/test';
import { DEV_DOMAIN, UI_DOMAIN } from './functions';
import { User } from './users';

export const goToAzure = async (page: Page, path = ''): Promise<Page> => {
  const res = await page.goto(`${DEV_DOMAIN}${path}`);
  expect(res).not.toBeNull();
  const url = res?.url();
  expect(url).toBeDefined();
  expect(url).toMatch('https://login.microsoftonline.com');
  return page;
};

export const getLoggedInPage = async (page: Page, { username, password }: User, path = '') => {
  const azurePage = await goToAzure(page, path);
  // Fill in username.
  await azurePage.fill('input[type=email][name=loginfmt]', username, { timeout: 3000 });

  // Click "Next".
  await azurePage.click('input[type=submit]', { timeout: 3000 });

  // Fill in password.
  await azurePage.fill('input[type=password][tabindex="0"]', password, { timeout: 3000 });

  // Click "Sign in".
  await azurePage.click('input[type=submit]', { timeout: 3000 });

  // Click "No" to remember login.
  await azurePage.click('input[type=button]', { timeout: 3000 });

  // Browser should be redirected to KAKA.
  expect(azurePage.url()).toMatch(`${UI_DOMAIN}${path}`);

  return azurePage;
};
