// Prints where each parent in parents.txt gets its purpose and the sentence
// itself, then one summary line. Run from the repository root after a runtime
// build. The first eight lines are the layout-sentence parents, the last three
// the reserved sentences.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const helper = resolve('.skilled/skills/system-spec-kit/runtime/dist/lib/spec/packet-purpose.js');
const { resolvePacketPurpose } = await import(pathToFileURL(helper).href);
const folders = readFileSync(new URL('./parents.txt', import.meta.url), 'utf8').split('\n').filter((line) => line.startsWith('specs/'));
let layout = 0;
for (const folder of folders) {
  const purpose = resolvePacketPurpose(resolve(folder));
  const text = purpose ? purpose.text : '';
  if (text.startsWith('This phase groups the related child phases below')) layout += 1;
  console.log(`${(purpose ? purpose.source : 'none').padEnd(8)} ${folder.split('/').pop()} :: ${text.slice(0, 90)}`);
}
console.log(`layout sentence as purpose: ${layout} of ${folders.length}`);
