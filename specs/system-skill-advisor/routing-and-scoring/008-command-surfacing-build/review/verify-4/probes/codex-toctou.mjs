// Repoints a symlinked rollout between the containment check and the read, then
// reports which file the Codex reader returned. Usage: node codex-toctou.mjs <tmpdir>
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { join } from 'node:path';

const tmp = process.argv[2];
const store = join(tmp, 'sessions');
fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(store, { recursive: true });
const sessionId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
const line = (marker) => [
  JSON.stringify({ type: 'session_meta', payload: { id: sessionId } }),
  JSON.stringify({ type: 'response_item', timestamp: '2026-11-14T00:00:00Z', payload: { type: 'message', role: 'user', content: [{ type: 'input_text', text: marker }] } }),
].join('\n');
const inside = join(store, 'inside.jsonl');
const outside = join(tmp, 'outside.jsonl');
fs.writeFileSync(inside, line('APPROVED-FILE'));
fs.writeFileSync(outside, line('OUTSIDE-STORE-FILE'));
const link = join(store, 'rollout-link.jsonl');
fs.symlinkSync(inside, link);

const realRead = fs.readFileSync;
const reads = [];
fs.readFileSync = function patched(path, ...rest) {
  if (path === link) { fs.unlinkSync(link); fs.symlinkSync(outside, link); }
  reads.push(String(path));
  return realRead.call(fs, path, ...rest);
};
syncBuiltinESMExports();

const { loadCodexSession } = await import('/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research/.skilled/hooks/shared/session-readers/codex.mjs');
const result = loadCodexSession({ sessionId, transcriptPath: link, codexRoot: store });
console.log('readPaths', JSON.stringify(reads.map((p) => p.replace(tmp, '<tmp>'))));
console.log('ok', result.ok, 'storePath', result.source?.storePath?.replace(fs.realpathSync(tmp), '<tmp>'));
console.log('recordsText', JSON.stringify(result.records ?? null).match(/APPROVED-FILE|OUTSIDE-STORE-FILE/g));
