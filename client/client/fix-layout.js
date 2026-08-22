const fs = require('fs');
const file = '/Users/tejash/Documents/recycle/client/app/layout.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import { Open_Sans } from "next/font/google";',
  'import { Open_Sans, Poppins } from "next/font/google";\n\nconst poppins = Poppins({\n  weight: ["400", "500", "600", "700"],\n  variable: "--font-poppins",\n  subsets: ["latin"],\n});'
);

content = content.replace(
  'className={`${openSans.variable} font-sans h-full antialiased`}',
  'className={`${openSans.variable} ${poppins.variable} font-sans h-full antialiased`}'
);

fs.writeFileSync(file, content);
