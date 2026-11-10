// Prints "file\tline" for every line that holds comment text, per the TypeScript scanner.
const ts = require(process.argv[2]);
const fs = require('fs');
const files = fs.readFileSync(process.argv[3], 'utf8').split('\0').filter(Boolean);
const out = [];
for (const f of files) {
  if (!/\.(c|m)?(j|t)sx?$/.test(f)) continue;
  let text; try { text = fs.readFileSync(f, 'utf8'); } catch { continue; }
  const variant = /\.(t|j)sx$/.test(f) ? ts.LanguageVariant.JSX : ts.LanguageVariant.Standard;
  const sf = ts.createSourceFile(f, text, ts.ScriptTarget.Latest, true, /\.tsx?$/.test(f) ? ts.ScriptKind.TS : ts.ScriptKind.JS);
  const lines = new Set();
  const seen = new Set();
  const visit = (node) => {
    for (const r of [...(ts.getLeadingCommentRanges(text, node.pos) || []), ...(ts.getTrailingCommentRanges(text, node.end) || [])]) {
      const k = r.pos; if (seen.has(k)) continue; seen.add(k);
      const a = sf.getLineAndCharacterOfPosition(r.pos).line + 1, b = sf.getLineAndCharacterOfPosition(r.end).line + 1;
      for (let i = a; i <= b; i++) lines.add(i);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  for (const r of ts.getLeadingCommentRanges(text, sf.endOfFileToken.pos) || []) { const a = sf.getLineAndCharacterOfPosition(r.pos).line + 1, b = sf.getLineAndCharacterOfPosition(r.end).line + 1; for (let i = a; i <= b; i++) lines.add(i); }
  for (const l of lines) out.push(`${f}\t${l}`);
}
fs.writeFileSync(process.argv[4], out.join('\n') + '\n');
