// Read-only probe for the built purpose helper. Run from the repository root
// after `npm run build` in .skilled/skills/system-spec-kit/runtime:
//   rg --files specs -g spec.md -g '!**/z_archive/**' -g '!**/scratch/**' -g '!**/lineages/**' \
//     | node <this file> [<helper.js>]
// It prints where each packet's purpose comes from, how many own purposes come
// from the opening paragraph of a combined problem and purpose heading, how many
// are the phase-group layout sentence and how many are three words or fewer.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const helper = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, '.skilled/skills/system-spec-kit/runtime/dist/lib/spec/packet-purpose.js');
const { resolvePacketPurpose } = await import(pathToFileURL(helper).href);

const files = fs.readFileSync(0, 'utf8').split(/\r?\n/).filter(Boolean);
const sources = { packet: 0, ancestor: 0, goal: 0, none: 0 };
const origin = { subheading: 0, labelled: 0, combinedOpening: 0, otherSectionOpening: 0 };
const layout = [];
const short = [];
for (const file of files) {
  const folder = path.resolve(root, path.dirname(file));
  const purpose = resolvePacketPurpose(folder);
  sources[purpose ? purpose.source : 'none'] += 1;
  if (!purpose || purpose.source !== 'packet') continue;
  const markdown = fs.readFileSync(path.join(folder, 'spec.md'), 'utf8');
  if (/^\s*###\s+Purpose\s*$/m.test(markdown)) origin.subheading += 1;
  else if (/^\s*(?:[-*]\s+)?\*{0,2}Purpose\*{0,2}\s*:/im.test(markdown)) origin.labelled += 1;
  else if (/^\s*##\s+(?:\d+\.\s+)?PROBLEM\s+(?:&|AND)\s+PURPOSE\s*$/im.test(markdown)) origin.combinedOpening += 1;
  else origin.otherSectionOpening += 1;
  if (/^This phase groups the related child phases below/.test(purpose.text)) layout.push(path.dirname(file));
  if (purpose.text.split(/\s+/).length <= 3) short.push(`${path.dirname(file)} :: ${purpose.text}`);
}
console.log(`sources ${JSON.stringify(sources)}`);
console.log(`own origin ${JSON.stringify(origin)}`);
console.log(`layout sentence as own purpose: ${layout.length}`);
console.log(`own purpose of three words or fewer: ${short.length}`);
for (const line of short) console.log(`  ${line}`);
console.log(`own purpose read: ${sources.packet} of ${files.length}`);
