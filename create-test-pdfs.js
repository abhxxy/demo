const fs = require('fs');
const crypto = require('crypto');

// Function to create a PDF of specific size
function createPDFOfSize(filename, sizeMB) {
    const targetSizeBytes = sizeMB * 1024 * 1024;

    // Basic PDF structure
    let pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]
   /Resources << /Font << /F1 4 0 R >> >>
   /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length `;

    // Calculate how much padding we need
    const baseSize = pdfContent.length + 200; // Account for the rest of PDF structure
    const paddingNeeded = Math.max(0, targetSizeBytes - baseSize);

    // Create padding data (random bytes converted to hex)
    const padding = crypto.randomBytes(Math.floor(paddingNeeded / 2)).toString('hex');

    // Complete the PDF with padding in a comment
    const streamContent = `BT /F1 24 Tf 100 700 Td (Test PDF ${sizeMB}MB) Tj ET\n% Padding: ${padding}`;

    pdfContent += `${streamContent.length} >>
stream
${streamContent}
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000258 00000 n
0000000336 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
430
%%EOF`;

    fs.writeFileSync(`./catalogs/${filename}`, pdfContent);
    const actualSize = fs.statSync(`./catalogs/${filename}`).size;
    console.log(`Created ${filename}: ${(actualSize / 1024 / 1024).toFixed(2)} MB`);
}

// Create test PDFs of various sizes
console.log('Creating test PDFs of different sizes...\n');

createPDFOfSize('test-1mb.pdf', 1);
createPDFOfSize('test-2mb.pdf', 2);
createPDFOfSize('test-5mb.pdf', 5);

console.log('\nTest PDFs created successfully!');
console.log('\nTest commands:');
console.log('!test1mb   - Test 1 MB PDF');
console.log('!test2mb   - Test 2 MB PDF');
console.log('!test5mb   - Test 5 MB PDF');