const fs = require('fs');
const file = '/Users/tejash/Documents/recycle/client/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// replace mb-16 with mb-4
content = content.replace(
  'className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16"',
  'className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4"'
);

// center the wrapper and maybe limit its max height or let it expand horizontally more
content = content.replace(
  '<div className="w-full mt-4" style={{ maxWidth: \'100vw\', marginLeft: \'calc(50% - 50vw)\', marginRight: \'calc(50% - 50vw)\', paddingLeft: \'2rem\', paddingRight: \'2rem\' }}>',
  '<div className="w-full mt-2 lg:-mx-12 xl:-mx-24 flex justify-center">'
);

fs.writeFileSync(file, content);
