const fs = require('fs');
const content = fs.readFileSync('/Users/himanshu/Erp/recycle/client/app/product/[id]/page.tsx', 'utf8');

const oldStr = `            </div>
          </div>
        </div>
      </div>
      </div>
      );
    }

    return (`;

const newStr = `            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ 
  label, 
  value, 
  tooltip = false,
  vertical = false
}: { 
  label: string; 
  value: ReactNode; 
  tooltip?: boolean;
  vertical?: boolean;
}) {
  if (vertical) {
    return (
      <div className="p-4 flex flex-col gap-2 relative">
         <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">{label}</span>
          {tooltip && <Info className="w-4 h-4 text-gray-400" />}
        </div>
        <div className="text-gray-800 font-medium">{value}</div>
      </div>
    );
  }

  return (`

fs.writeFileSync('/Users/himanshu/Erp/recycle/client/app/product/[id]/page.tsx', content.replace(oldStr, newStr));

