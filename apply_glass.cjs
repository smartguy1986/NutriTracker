const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'src', 'pages'),
  path.join(__dirname, 'src', 'components')
];

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
  for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove bg-brand-bg from the root divs so the body background gradient shows through
    content = content.replace(/bg-brand-bg\b/g, '');
    
    // Clean up spaces
    content = content.replace(/  +/g, ' ');
    
    fs.writeFileSync(filePath, content);
  }
}

console.log("Removed bg-brand-bg successfully!");
