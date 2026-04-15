const fs = require('fs');
const path = require('path');

console.log('=== SERVER ENVIRONMENT CHECK ===\n');

console.log('1. Current Working Directory:');
console.log(`   ${process.cwd()}\n`);

console.log('2. Script Directory:');
console.log(`   ${__dirname}\n`);

console.log('3. Node.js Version:');
console.log(`   ${process.version}\n`);

console.log('4. Platform:');
console.log(`   ${process.platform}\n`);

console.log('5. Checking catalogs directory:');
const catalogDir = path.join(process.cwd(), 'catalogs');
console.log(`   Looking for: ${catalogDir}`);

if (fs.existsSync(catalogDir)) {
    console.log('   ✅ Directory exists');
    console.log('   Contents:');

    const files = fs.readdirSync(catalogDir);
    if (files.length === 0) {
        console.log('   ⚠️  Directory is empty!');
    } else {
        files.forEach(file => {
            const filePath = path.join(catalogDir, file);
            const stats = fs.statSync(filePath);
            const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);
            console.log(`   - ${file} (${sizeInMB} MB)`);
        });
    }
} else {
    console.log('   ❌ Directory does not exist!');
    console.log('   Create it with: mkdir catalogs');
}

console.log('\n6. Checking specific PDF files:');
const pdfFiles = [
    './catalogs/Floor Tiles.pdf',
    './catalogs/Wall Tiles.pdf',
    './catalogs/Parking Tiles.pdf'
];

pdfFiles.forEach(pdfPath => {
    const absolutePath = path.resolve(pdfPath);
    console.log(`\n   File: ${pdfPath}`);
    console.log(`   Absolute: ${absolutePath}`);

    if (fs.existsSync(pdfPath)) {
        const stats = fs.statSync(pdfPath);
        console.log(`   ✅ Exists`);
        console.log(`   Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Readable: ${fs.accessSync(pdfPath, fs.constants.R_OK) === undefined ? 'Yes' : 'No'}`);
    } else {
        console.log(`   ❌ Does not exist`);
    }
});

console.log('\n7. File permissions check:');
try {
    const testFile = './catalogs/Floor Tiles.pdf';
    if (fs.existsSync(testFile)) {
        fs.accessSync(testFile, fs.constants.R_OK);
        console.log('   ✅ Can read PDF files');
    }
} catch (error) {
    console.log('   ❌ Cannot read PDF files:', error.message);
}

console.log('\n=== RECOMMENDATIONS ===');
console.log('If PDFs are missing on server:');
console.log('1. Upload the catalogs folder with PDFs');
console.log('2. Ensure file names match exactly (case-sensitive on Linux)');
console.log('3. Check file permissions (chmod 644 catalogs/*.pdf)');
console.log('4. Verify path in bot.js matches server structure');