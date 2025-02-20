const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3300;

app.use(express.json({ limit: '50mb' }));

app.post('/convert', async (req, res) => {
  if (!req.body.html) {
    return res.status(400).json({ error: 'No HTML content provided' });
  }

  const html = req.body.html;
  const options = req.body.options || {};
  
  // Create temp directory and files
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'html-to-pdf-'));
  const htmlFilePath = path.join(tempDir, `${uuidv4()}.html`);
  const pdfFilePath = path.join(tempDir, `${uuidv4()}.pdf`);
  
  try {
    // Write HTML content to file
    fs.writeFileSync(htmlFilePath, html);
    
    // Build wkhtmltopdf command
    let cmd = 'xvfb-run --server-args="-screen 0 1280x1024x24" wkhtmltopdf --enable-local-file-access';
    
    // Add options
    for (const [key, value] of Object.entries(options)) {
      if (value === true) {
        cmd += ` --${key}`;
      } else if (value !== false && value !== null && value !== undefined) {
        cmd += ` --${key} "${value}"`;
      }
    }
    
    cmd += ` "${htmlFilePath}" "${pdfFilePath}"`;
    
    // Execute command
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ 
          error: 'PDF generation failed', 
          details: stderr 
        });
      }
      
      // Read the generated PDF
      const pdfData = fs.readFileSync(pdfFilePath);
      
      // Set response headers and send PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');
      res.send(pdfData);
      
      // Clean up temporary files
      cleanup(htmlFilePath, pdfFilePath, tempDir);
    });
  } catch (err) {
    console.error(`Exception: ${err.message}`);
    res.status(500).json({ error: err.message });
    
    // Attempt cleanup even if there was an error
    cleanup(htmlFilePath, pdfFilePath, tempDir);
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

function cleanup(htmlFile, pdfFile, directory) {
  try {
    if (fs.existsSync(htmlFile)) fs.unlinkSync(htmlFile);
    if (fs.existsSync(pdfFile)) fs.unlinkSync(pdfFile);
    if (fs.existsSync(directory)) fs.rmdirSync(directory);
  } catch (err) {
    console.error(`Cleanup error: ${err.message}`);
  }
}

app.listen(port, () => {
  console.log(`HTML to PDF service listening at http://localhost:${port}`);
});