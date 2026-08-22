const fs = require('fs');
const content = fs.readFileSync('/Users/tejash/Documents/recycle/client/app/create/page.tsx', 'utf8');

const regex = /<label className="block text-sm font-semibold text-gray-800 mb-2">\s*Attach a photo of the material \*\s*<\/label>[\s\S]*?className="hidden"\s*accept="image\/\*"\s*onChange={handleFileChange}\s*\/>\s*<\/div>\s*<\/div>/g;

const newStr = `<label className="block text-sm font-semibold text-gray-800 mb-2">
                  Attach a photo of the material *
                </label>
                <div className="w-full relative">
                  <FileUpload onChange={handleFileUpload} />
                  {file && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-green-200 flex items-center justify-between shadow-sm">
                      <span className="text-sm font-medium text-green-700 truncate">
                        Selected: {file.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>`;

fs.writeFileSync('/Users/tejash/Documents/recycle/client/app/create/page.tsx', content.replace(regex, newStr));

