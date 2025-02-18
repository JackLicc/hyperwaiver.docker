const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

app.use(express.json());

async function createBrowser() {
  return puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

app.post("/generate-pdf", async (req, res) => {
  const { url, options = {} } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  let browser;

  try {
    browser = await createBrowser();
    const page = await browser.newPage();

    // Set default viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Wait until network is idle
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
