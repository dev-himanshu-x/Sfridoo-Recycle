const fs = require('fs');
const file = '/Users/tejash/Documents/recycle/client/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /style=\{\{ fontFamily: "'Poppins', sans-serif" \}\}/g,
  'style={{ fontFamily: "var(--font-poppins)" }}'
);

fs.writeFileSync(file, content);
