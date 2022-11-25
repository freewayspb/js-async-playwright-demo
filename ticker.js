const { chromium } = require('playwright');
const { ArgumentParser } = require('argparse');
let parser = new ArgumentParser();
parser.add_argument('--ticker', { type: String, required: false });
const { ticker = 'EGIO' } = parser.parse_args();

void main()
  .then(() => process.exit(0))
  .catch((err) => {
      console.error(err);
      process.exit(1);
  });

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const url = `https://finance.yahoo.com/quote/${ticker}/history?p=${ticker}`;
  await page.goto(url);
  await page.waitForTimeout(3000);
  await page.locator('[aria-label="Close"]').click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator(`a[download="${ticker}.csv"]`).click()
  ]);
  const date = new Date()
  const dateTime = date.toISOString();
  await download.saveAs(`./reports/${ticker}-${dateTime}.csv`);
  await page.waitForTimeout(5000);
}

