// Appends iteration notes under the WHAT WORKED / WHAT FAILED headings of the strategy file.
const fs = require('fs');
const [file, worked, failed] = process.argv.slice(2);
let t = fs.readFileSync(file, 'utf8');
const add = (heading, line) => {
  const re = new RegExp('(## \\d+\\. ' + heading + '\\n)(\\[Populated after iteration 1\\]\\n)?');
  t = t.replace(re, (m, h) => h + '- ' + line + '\n');
};
add('WHAT WORKED', worked);
add('WHAT FAILED', failed);
fs.writeFileSync(file, t);
