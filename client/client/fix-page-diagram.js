const fs = require('fs');
const file = '/Users/tejash/Documents/recycle/client/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "height: 380",
  "height: 700"
);

fs.writeFileSync(file, content);
