// Read-only probe for the built purpose helper. Run from the repository root
// after `npm run build` in .skilled/skills/system-spec-kit/runtime:
//   <command that lists spec.md paths> | node <this file> <packet folder> [<packet folder> ...]
// It prints one line per named folder, `<folder name> <source>`, where source
// is packet, ancestor, goal or none. Then it reads spec.md paths from stdin,
// one per line, and prints how many of those packets yield an own purpose.
// Not run at planning time: the planning session could not start node.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const helper = path.join(root, '.skilled/skills/system-spec-kit/runtime/dist/lib/spec/packet-purpose.js');
const { resolvePacketPurpose } = await import(helper);

for (const folder of process.argv.slice(2)) {
  const purpose = resolvePacketPurpose(path.resolve(root, folder));
  console.log(`${path.basename(folder)} ${purpose ? purpose.source : 'none'}`);
}

const specFiles = fs.readFileSync(0, 'utf8').split(/\r?\n/).filter((line) => line.trim() !== '');
let ownPurpose = 0;
for (const file of specFiles) {
  if (resolvePacketPurpose(path.resolve(root, path.dirname(file)))?.source === 'packet') ownPurpose += 1;
}
console.log(`own purpose read: ${ownPurpose} of ${specFiles.length}`);
