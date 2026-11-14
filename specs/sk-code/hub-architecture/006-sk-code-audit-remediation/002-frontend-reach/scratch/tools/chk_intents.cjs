// Prints: <distinct frontend keywords in the file's INTENT_SIGNALS rows> <single-word count> <equal to hub-router.json union>
const fs = require('fs');
const text = fs.readFileSync(process.argv[2], 'utf8');
const block = text.slice(text.indexOf('INTENT_SIGNALS = {'));
const names = ['FRONTEND_WEB', 'WEB_ELEMENTS', 'WEB_CASCADE', 'WEB_LAYOUT', 'WEB_A11Y', 'WEB_PERF', 'WEB_I18N', 'WEB_VISUAL_VALUES', 'WEB_VISUAL_HIERARCHY', 'WEB_MOTION', 'FIGMA_TO_CODE'];
const keys = [];
for (const name of names) {
  const line = block.split('\n').find((row) => row.trim().startsWith(`"${name}":`));
  keys.push(...JSON.parse(line.slice(line.indexOf('['), line.lastIndexOf(']') + 1)));
}
const classes = require(process.cwd() + '/.skilled/skills/sk-code/hub-router.json').vocabularyClasses;
const hub = ['code-frontend-aliases', 'code-frontend-visual', 'code-frontend-review'].flatMap((c) => classes[c].keywords);
const same = JSON.stringify([...new Set(keys)].sort()) === JSON.stringify([...new Set(hub)].sort());
console.log(new Set(keys).size, keys.filter((k) => !/[ -]/.test(k)).length, same);
