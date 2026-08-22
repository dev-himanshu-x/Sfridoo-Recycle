const fs = require('fs');
const file = '/Users/tejash/Documents/recycle/client/components/ui/file-upload.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /className=\{cn\([\s\S]*?"relative z-40 mx-auto mt-4 flex w-full flex-col items-start justify-start overflow-hidden rounded-md bg-white p-4 md:h-24 dark:bg-neutral-900",[\s\S]*?"shadow-sm",[\s\S]*?\)\}[\s\S]*?>/,
  `className={cn(
                    "relative z-40 mx-auto mt-4 flex w-full flex-col items-start justify-start overflow-hidden rounded-md bg-white p-4 md:h-auto dark:bg-neutral-900",
                    "shadow-sm",
                  )}
                >
                  {file.type.startsWith('image/') && (
                    <div className="w-full relative h-40 mb-4 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
                      <img 
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}`
);

fs.writeFileSync(file, content);
