// Walks a source tree and emits one TSV row per file: path, bytes, class, lines, CJK count.
// Text/binary is decided by NUL byte and UTF-8 decodability rather than by extension, so a
// mislabelled file cannot silently skip the character census.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2];
if (!root) { console.error('usage: scan-source.mjs <root>'); process.exit(1); }

const files = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name === '.git') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile()) files.push(full);
  }
}
walk(root);

// Unified ideographs, the extension blocks, and CJK punctuation. Fullwidth forms are counted
// separately because they are punctuation a translator must also replace.
const HAN = /[㐀-䶿一-鿿豈-﫿]|[\u{20000}-\u{2FA1F}]/gu;
const CJK_PUNCT = /[　-〿！-｠￠-￦]/gu;

console.log(['path', 'bytes', 'class', 'lines', 'han', 'cjk_punct'].join('\t'));
for (const f of files) {
  const buf = readFileSync(f);
  const rel = relative(root, f);
  const bytes = statSync(f).size;
  let cls = 'binary', lines = '', han = '', punct = '';
  if (!buf.includes(0)) {
    let text = null;
    try { text = new TextDecoder('utf-8', { fatal: true }).decode(buf); } catch { text = null; }
    if (text !== null) {
      cls = 'text';
      lines = text.length === 0 ? 0 : text.split('\n').length - (text.endsWith('\n') ? 1 : 0);
      han = (text.match(HAN) || []).length;
      punct = (text.match(CJK_PUNCT) || []).length;
    } else {
      cls = 'undecodable';
    }
  }
  console.log([rel, bytes, cls, lines, han, punct].join('\t'));
}
console.error(`files=${files.length}`);
