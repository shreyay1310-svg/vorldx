const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlFilePath = path.join(__dirname, 'project_report_master_20p.html');
const outputPdfPath = path.join(__dirname, 'VorldX_Project_Report.pdf');
const serverDownloadPdfPath = path.join(__dirname, 'server', 'downloads', 'VorldX-Project-Report.pdf');
const clientPublicPdfPath = path.join(__dirname, 'client', 'public', 'VorldX_Project_Report.pdf');
const clientDistPdfPath = path.join(__dirname, 'client', 'dist', 'VorldX_Project_Report.pdf');

if (!fs.existsSync(htmlFilePath)) {
  console.error('Source HTML not found:', htmlFilePath);
  process.exit(1);
}

const edgeExecutable = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const fileUrl = 'file:///' + htmlFilePath.replace(/\\/g, '/');

console.log('Generating exactly 20-page PDF via headless Microsoft Edge...');
const command = '"' + edgeExecutable + '" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="' + outputPdfPath + '" "' + fileUrl + '"';

try {
  execSync(command);
  console.log('PDF successfully created at:', outputPdfPath);
  const stats = fs.statSync(outputPdfPath);
  console.log('PDF File Size:', (stats.size / 1024).toFixed(2), 'KB');

  // Copy to server downloads & client public for direct web downloading
  fs.mkdirSync(path.dirname(serverDownloadPdfPath), { recursive: true });
  fs.copyFileSync(outputPdfPath, serverDownloadPdfPath);
  console.log('Copied to server downloads:', serverDownloadPdfPath);

  fs.mkdirSync(path.dirname(clientPublicPdfPath), { recursive: true });
  fs.copyFileSync(outputPdfPath, clientPublicPdfPath);
  console.log('Copied to client public directory:', clientPublicPdfPath);

  if (fs.existsSync(path.dirname(clientDistPdfPath))) {
    fs.copyFileSync(outputPdfPath, clientDistPdfPath);
    console.log('Copied to client dist directory:', clientDistPdfPath);
  }

  // Verify page count in generated PDF
  const pdfBuffer = fs.readFileSync(outputPdfPath);
  const text = pdfBuffer.toString('latin1');
  const pageMatches = (text.match(/\/Type\s*\/Page\b/g) || []).length;
  console.log('Verified PDF Page Count:', pageMatches, 'Pages');
} catch (err) {
  console.error('Error generating PDF:', err);
  process.exit(1);
}
