const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

app.use(express.json());

async function createBrowser() {
  return puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-infobars",
      "--window-position=0,0",
      "--ignore-certifcate-errors",
      "--ignore-certifcate-errors-spki-list",
      "--disable-web-security",
      '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
    ],
    headless: false,
    defaultViewport: null,
    ignoreHTTPSErrors: true,
    dumpio: true,
  });
}

app.post("/generate-pdf", async (req, res) => {
  const { url, options = {} } = req.body;

  console.log(url, options);

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  let browser;

  try {
    browser = await createBrowser();
    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url, { waitUntil: "networkidle0" });

    // Uint8Array
    const u8arr = await page.pdf({
      format: options.format || "A4",
      printBackground: options.printBackground || true,
      margin: options.margin || {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    });

    const buffer = Buffer.from(u8arr);
    res.send(buffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

const PORT = 3300;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
