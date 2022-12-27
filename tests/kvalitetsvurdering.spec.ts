import { expect, test } from '@playwright/test';
import { UI_DOMAIN, getParsedUrl } from './functions';
import { getLoggedInPage } from './helpers';
import { userSaksbehandler } from './users';

const FNR = '17457337760';

test.describe('Kvalitetsvurderinger', () => {
  test.beforeEach(async ({ page }) => {
    await getLoggedInPage(page, userSaksbehandler, '/kvalitetsvurderinger');
  });

  test.afterEach(async ({ page }) => {
    await page.click('data-testid=reopen-button');
    await page.click('data-testid=delete-button');
    await page.waitForURL(`${UI_DOMAIN}/kvalitetsvurderinger`, { timeout: 3000 });
  });

  test.only('Create and delete a new kvalitetsvurdering', async ({ page }) => {
    const url = getParsedUrl(page.url());
    expect(url.pathname).toBe('/kvalitetsvurderinger');

    await page.click('data-testid=new-kvalitetsvurdering-button', { timeout: 10000 });
    await page.waitForNavigation({ timeout: 3000 });

    const sakstypeKlage = page.locator('id=sakstypeId').locator('id=1');
    await sakstypeKlage.check();

    const sakenGjelder = page.locator('id=sakenGjelder');
    await sakenGjelder.fill(FNR);

    const ytelse = page.locator('id=ytelseId');
    await ytelse.selectOption('38'); // Yrkesskade

    const mottattVedtaksinstans = page.locator('id=mottattVedtaksinstans');
    await mottattVedtaksinstans.fill('01.12.2022');

    const mottattKlageinstans = page.locator('id=mottattKlageinstans');
    await mottattKlageinstans.fill('02.12.2022');

    const enhet = page.locator('id=vedtaksinstansEnhet');
    await enhet.click();
    await page
      .locator('data-testid=fra-vedtaksenhet-dropdown-list')
      .getByTestId('fra-vedtaksenhet-dropdown-4803')
      .click();

    const utfall = page.locator('id=utfallId');
    await utfall.selectOption('4'); // Medhold

    await page.locator('id=hjemmelIdList').click();
    await page.locator('data-testid=lovhjemmel-dropdown').locator('input[value="319"]').click(); // § 13-5
    await page.locator('data-testid=lovhjemmel-dropdown').locator('input[value="320"]').click(); // § 13-6

    const klageforberedelsenBra = page.locator('id=klageforberedelsen').locator('[value="BRA"]');
    await klageforberedelsenBra.check();

    const utredningenBra = page.locator('id=utredningen').locator('[value="BRA"]');
    await utredningenBra.check();

    const vedtaketBra = page.locator('id=vedtaket').locator('[value="BRA"]');
    await vedtaketBra.check();

    const brukAvRaadgivendeLegeBra = page.locator('id=brukAvRaadgivendeLege').locator('[value="BRA"]');
    await brukAvRaadgivendeLegeBra.check();

    await page.click('data-testid=complete-button');
    await page.waitForSelector('data-testid=finished-vurdering-footer');

    await page.reload();

    await expect(sakstypeKlage).toBeChecked();
    await expect(sakenGjelder).toHaveValue(FNR);

    const yrkesskade = page.locator('data-testid=selected-ytelse').getByTestId('selected-ytelse-38');
    await expect(page.getByTestId('selected-ytelse')).toContain(yrkesskade);

    await expect(mottattVedtaksinstans).toHaveValue('01.12.2022');
    await expect(mottattKlageinstans).toHaveValue('02.12.2022');
    await expect(enhet).toHaveAttribute('data-value', '4803');

    const hjemmel13_5 = page.locator('data-testid=selected-hjemler-list').getByTestId('selected-hjemmel-319');
    const hjemmel13_6 = page.locator('data-testid=selected-hjemler-list').getByTestId('selected-hjemmel-320');
    await expect(page.getByTestId('selected-hjemler-list')).toContain(hjemmel13_5);
    await expect(page.getByTestId('selected-hjemler-list')).toContain(hjemmel13_6);

    await expect(klageforberedelsenBra).toHaveValue('BRA');
    await expect(utredningenBra).toHaveValue('BRA');
    await expect(vedtaketBra).toHaveValue('BRA');
    await expect(brukAvRaadgivendeLegeBra).toHaveValue('BRA');
  });
});
