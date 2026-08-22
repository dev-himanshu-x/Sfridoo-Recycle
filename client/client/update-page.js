const fs = require('fs');
const file = '/Users/tejash/Documents/recycle/client/app/create/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const overlayRegex = /\{file && \(\s*<div className="absolute top-2 right-2 bg-white\/90 backdrop-[^>]+>\s*<span[^>]+>\s*Selected:[^<]+<\/span>\s*<\/div>\s*\)\}/;

content = content.replace(overlayRegex, '');

fs.writeFileSync(file, content);
