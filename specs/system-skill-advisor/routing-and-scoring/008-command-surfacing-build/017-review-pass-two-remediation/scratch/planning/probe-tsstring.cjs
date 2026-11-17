// Run from the repository root: node <this file>
// Evaluates the deriver's own tsString source on values that hold a line break,
// says whether the emitted literal still parses, and counts the generated
// strings that hold a break today. Reads files only.
const fs = require('fs');
const path = require('path');
const DER = '.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs';
const source = fs.readFileSync(DER, 'utf8');
const match = /function tsString\(value\) \{[\s\S]*?\n\}/.exec(source);
const tsString = new Function(`${match[0]}; return tsString;`)();
const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);
const BREAK = new RegExp(`[\\n\\r${LS}${PS}]`);
console.log(`exported: ${'tsString' in require(path.resolve(DER))}`);
for (const [label, value] of [['LF', 'a\nb'], ['CR', 'a\rb'], ['U+2028', `a${LS}b`], ['U+2029', `a${PS}b`]]) {
  const literal = tsString(value);
  let parses = true;
  try { new Function(`return ${literal};`)(); } catch { parses = false; }
  console.log(`${label}: raw break in literal ${BREAK.test(literal)}, parses ${parses}`);
}
const generated = JSON.parse(fs.readFileSync('.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json', 'utf8'));
let strings = 0; let withBreak = 0;
const walk = (node) => {
  if (typeof node === 'string') { strings += 1; if (BREAK.test(node)) withBreak += 1; }
  else if (Array.isArray(node)) node.forEach(walk);
  else if (node && typeof node === 'object') Object.values(node).forEach(walk);
};
walk(generated);
console.log(`generated strings ${strings}, with a line break ${withBreak}`);
