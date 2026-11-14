// Prints, for each parent in parents.txt, where its carried purpose comes from,
// then one summary line. Run from the repository root after a runtime build.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const listPath = new URL('./parents.txt', import.meta.url);
const helper = resolve('.skilled/skills/system-spec-kit/runtime/dist/lib/spec/packet-purpose.js');
const { resolvePacketPurpose } = await import(pathToFileURL(helper).href);

const files = readFileSync(listPath, 'utf8').split('\n').filter((line) => line.startsWith('specs/'));
let own = 0;
for (const file of files) {
  const purpose = resolvePacketPurpose(resolve(dirname(file)));
  const source = purpose ? purpose.source : 'none';
  if (source === 'packet') own += 1;
  console.log(`${source.padEnd(8)} ${dirname(file)}${purpose && source === 'packet' ? ` :: ${purpose.text}` : ''}`);
}
console.log(`own purpose: ${own} of ${files.length}`);
