import { execSync } from 'node:child_process';
import { dirname } from 'node:path';
import { resolvePacketPurpose } from './prototype-packet-purpose.ts';
const files = execSync("rg --files -g 'spec.md' -g '!**/z_archive/**' specs", { encoding: 'utf8' }).trim().split('\n');
const counts: Record<string, number> = { packet: 0, ancestor: 0, goal: 0, none: 0 };
let maxLen = 0; const t0 = performance.now();
for (const f of files) { const p = resolvePacketPurpose(`${process.cwd()}/${dirname(f)}`); counts[p ? p.source : 'none']++; if (p) maxLen = Math.max(maxLen, p.text.length); }
console.log(`folders=${files.length}`, JSON.stringify(counts), `maxLen=${maxLen}`, `avgMs=${((performance.now()-t0)/files.length).toFixed(2)}`);
