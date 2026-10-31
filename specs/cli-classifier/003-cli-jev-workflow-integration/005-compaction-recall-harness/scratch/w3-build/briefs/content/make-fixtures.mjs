// Writes the six synthetic census fixtures. Every free-text string carries CANARY-.
// No line is copied from a real transcript.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
const OUT = join(import.meta.dirname, 'fixtures');
const LS = ' ';
const u = (file, n) => `00000000-0000-4000-8000-${String(file).padStart(4, '0')}${String(n).padStart(8, '0')}`;
const SESSION = (file) => u(file, 0);
const base = (file, n, parent) => ({ parentUuid: parent ? u(file, parent) : null, isSidechain: false, uuid: u(file, n), sessionId: SESSION(file), timestamp: `2026-09-01T10:00:${String(n).padStart(2, '0')}.000Z`, entrypoint: 'cli' });
const user = (file, n, text, extra = {}) => ({ ...base(file, n, n - 1), type: 'user', message: { role: 'user', content: text }, ...extra });
const assistantText = (file, n, text) => ({ ...base(file, n, n - 1), type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text }] } });
const assistantTool = (file, n, id, name, input) => ({ ...base(file, n, n - 1), type: 'assistant', message: { role: 'assistant', content: [{ type: 'tool_use', id, name, input }] } });
const toolResult = (file, n, id, text) => ({ ...base(file, n, n - 1), type: 'user', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, content: text }] } });
const boundary = (file, n, pre, post, head, anchor, tail) => ({ ...base(file, n, n - 1), type: 'system', subtype: 'compact_boundary', content: 'CANARY-boundary Conversation compacted', level: 'info', compactMetadata: { trigger: 'auto', preTokens: pre, postTokens: post, durationMs: 4000, preservedSegment: { headUuid: u(file, head), anchorUuid: u(file, anchor), tailUuid: u(file, tail) } } });
const summary = (file, n, text) => ({ ...base(file, n, n - 1), type: 'user', isCompactSummary: true, isVisibleInTranscriptOnly: true, message: { role: 'user', content: text } });
const hook = (file, n, status, command, content) => ({ ...base(file, n, n - 1), type: 'attachment', attachment: { type: status, hookName: 'SessionStart:compact', hookEvent: 'SessionStart', toolUseID: `CANARY-hook-${n}`, command, durationMs: 40, ...(content === undefined ? {} : { content, stdout: content, stderr: 'CANARY-stderr', exitCode: 0 }) } });
const PRIME = "bash -c 'node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js CANARY-cmd'";
const GUARD = "bash -c 'bash .skilled/bin/worktree-guard.sh CANARY-cmd'";
const BRIEF = 'CANARY-b1 ## Recovered Context (Post-Compaction)\nActive files: writer_notes.md parseWidget_config 001-demo-packet';
const write = (name, records, raw = {}) => {
  const lines = records.map((r, i) => raw[i + 1] ?? JSON.stringify(r));
  writeFileSync(join(OUT, name), `${lines.join('\n')}\n`);
};
// 1. clean: every rule kept, one raw U+2028 inside a text field.
write('clean.jsonl', [
  user(1, 1, `CANARY-u1 please update parseWidget_config in writer_notes.md${LS}for specs/demo-track/001-demo-packet`),
  assistantTool(1, 2, 'toolu_CANARY_01', 'Write', { file_path: '/tmp/CANARY-w/writer_notes.md', content: 'CANARY-c1 parseWidget_config = 1' }),
  toolResult(1, 3, 'toolu_CANARY_01', 'CANARY-r1 file written'),
  assistantText(1, 4, 'CANARY-a1 done with parseWidget_config'),
  boundary(1, 5, 1200, 300, 1, 4, 4),
  summary(1, 6, 'CANARY-s1 Summary: edited writer_notes.md and parseWidget_config in specs/demo-track/001-demo-packet'),
  hook(1, 7, 'hook_success', PRIME, BRIEF),
  assistantText(1, 8, 'CANARY-a2 continuing with parseWidget_config'),
]);
// 2. missing written file: the summary and the brief never name lost_file.md.
write('missing-written-file.jsonl', [
  user(2, 1, 'CANARY-u1 please update parseWidget_config for specs/demo-track/001-demo-packet'),
  assistantTool(2, 2, 'toolu_CANARY_02', 'Write', { file_path: '/tmp/CANARY-w/lost_file.md', content: 'CANARY-c1 parseWidget_config = 2' }),
  toolResult(2, 3, 'toolu_CANARY_02', 'CANARY-r1 file written'),
  assistantText(2, 4, 'CANARY-a1 done with parseWidget_config'),
  boundary(2, 5, 1100, 280, 1, 4, 4),
  summary(2, 6, 'CANARY-s1 Summary: parseWidget_config in specs/demo-track/001-demo-packet'),
  hook(2, 7, 'hook_success', PRIME, 'CANARY-b1 ## Recovered Context (Post-Compaction)\nparseWidget_config 001-demo-packet'),
  assistantText(2, 8, 'CANARY-a2 continuing with parseWidget_config'),
]);
// 3. unknown type on line 3.
write('unknown-type.jsonl', [
  user(3, 1, 'CANARY-u1 hello'),
  assistantText(3, 2, 'CANARY-a1 hi'),
  { ...base(3, 3, 2), type: 'brand-new-type', note: 'CANARY-n1 unknown record' },
  assistantText(3, 4, 'CANARY-a2 after'),
]);
// 4. malformed line 2.
write('malformed-line.jsonl', [
  user(4, 1, 'CANARY-u1 hello'),
  {},
  assistantText(4, 3, 'CANARY-a1 after'),
], { 2: '{"type":"user","message":{"role":"user","content":"CANARY-broken' });
// 5. no brief: the session-prime hook was cancelled, another hook succeeded.
write('no-brief.jsonl', [
  user(5, 1, 'CANARY-u1 please rename loadConfig_value'),
  assistantText(5, 2, 'CANARY-a1 renaming loadConfig_value'),
  boundary(5, 3, 900, 250, 1, 2, 2),
  summary(5, 4, 'CANARY-s1 Summary: renaming loadConfig_value'),
  hook(5, 5, 'hook_success', GUARD, 'CANARY-g1 guard ok'),
  hook(5, 6, 'hook_cancelled', PRIME),
  assistantText(5, 7, 'CANARY-a2 still on loadConfig_value'),
]);
// 6. recorded brief after another hook's success, so the brief is found by its hook, not by position.
write('recorded-brief.jsonl', [
  user(6, 1, 'CANARY-u1 please fix renderPanel_state'),
  assistantText(6, 2, 'CANARY-a1 fixing renderPanel_state'),
  boundary(6, 3, 1000, 260, 1, 2, 2),
  summary(6, 4, 'CANARY-s1 Summary: fixing renderPanel_state'),
  hook(6, 5, 'hook_success', GUARD, 'CANARY-g1 guard ok'),
  hook(6, 6, 'hook_success', PRIME, 'CANARY-b6 ## Recovered Context (Post-Compaction)\nrenderPanel_state'),
  assistantText(6, 7, 'CANARY-a2 done with renderPanel_state'),
]);
