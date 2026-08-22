const fs = require('fs');
const file = '/Users/tejash/Documents/recycle/client/components/waste-flow-diagram.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'fitViewOptions={{ padding: 0.05 }}',
  'fitViewOptions={{ padding: 0 }}' // to make it as big as possible
);

// If width is 100%, let's make it 100% and centered
content = content.replace(
  'width: "100%",',
  'width: "100%",\n        maxWidth: 1200,'
);


fs.writeFileSync(file, content);
