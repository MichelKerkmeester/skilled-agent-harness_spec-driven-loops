import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'stop-park-notice-'));
const runtimeDir = path.join(root, 'runtime');
const stateDir = path.join(runtimeDir, 'skilled-relaunch');
fs.mkdirSync(stateDir, { recursive: true });
const loopId = '999999999';
const recordPath = path.join(stateDir, `relaunch-${loopId}.json`);
const record = {
  version: 1,
  status: 'pending',
  loopId,
  handoff: path.join(root, 'handoff.md'),
  sessionId: 'session-adapter-00000001',
  runtime: 'claude',
  name: null,
  cwd: root,
  hops: 0,
  preparedAt: new Date().toISOString(),
};
fs.writeFileSync(recordPath, JSON.stringify(record));

const env = { ...process.env, XDG_RUNTIME_DIR: runtimeDir, SKILLED_LOOP_ID: loopId };
delete env.CLAUDE_PID;
delete env.SKILLED_LOOP_HOPS;

const adapter = path.join(
  process.cwd(),
  '.skilled/hooks/session-relaunch/claude/stop-arm.mjs',
);
const { armPendingRecord } = await import(pathToFileURL(adapter).href);

const armed = await armPendingRecord({
  session_id: record.sessionId,
  transcript_path: path.join(root, 'transcript.jsonl'),
  cwd: root,
  background_tasks: [],
}, {
  env,
  pid: 41,
  processTable: '41 1\n',
  write: () => {
    throw new Error('stdout closed');
  },
});

const after = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
const log = fs.readFileSync(path.join(stateDir, 'relaunch.log'), 'utf8');
const noticeLines = log.split(/\r?\n/).filter((line) => line.includes('stage=notice'));
const targetLines = log.split(/\r?\n/).filter((line) => line.includes('stage=target-pid'));
console.log(`armed=${JSON.stringify(armed)}`);
console.log(`deferredAt=${typeof after.deferredAt === 'string' && Number.isFinite(Date.parse(after.deferredAt))}`);
console.log(`unchanged=${JSON.stringify(Object.keys(after).sort()) === JSON.stringify([...Object.keys(record), 'deferredAt'].sort())}`);
console.log(`noticeLogLines=${noticeLines.length}`);
console.log(`targetLogLines=${targetLines.length}`);
console.log(`noticeLine=${noticeLines.join(' | ')}`);
fs.rmSync(root, { recursive: true, force: true });
