const fs = require('fs');
const file = '/Users/tejash/Documents/recycle/client/components/waste-flow-diagram.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'height: 560,',
  'height: 700,'
);

content = content.replace(
  'fitViewOptions={{ padding: 0.2 }}',
  'fitViewOptions={{ padding: 0.05 }}'
);

fs.writeFileSync(file, content);
