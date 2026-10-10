// Rebuilds each of the fourteen hooks from the saved before copy by applying only the planned
// edits, and compares the result with the live file. Any extra or missing change is a mismatch.
// Usage: node verify-exact-edits.mjs <before .skilled/hooks dir> <live .skilled/hooks dir>
import fs from 'node:fs';
import path from 'node:path';

const [, , beforeDir, liveDir] = process.argv;
const READER = "async function readStdin() {\n  const chunks = [];\n  for await (const chunk of process.stdin) chunks.push(chunk);\n  return Buffer.concat(chunks).toString('utf8');\n}\n\n";
const IMPORT = "import { readStdin } from '../../shared/hook-adapter-shared.cjs';\n";
const FLAGS = "import { isHookEnabled } from '../../shared/hook-flags.mjs';\n";
const CREATE = "import { createRequire } from 'node:module';\n";
const FABLE_READER = "function readStdin() {\n  try {\n    return fs.readFileSync(0, 'utf8');\n  } catch {\n    return '';\n  }\n}\n\n";

const ANCHORS = {
  'classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs': FLAGS,
  'classifier-injection-screen/devin/classifier-injection-screen-posttooluse.mjs': FLAGS,
  'dispatch/claude/dispatch-preflight-lint.mjs': FLAGS,
  'dispatch/codex/dispatch-preflight-lint.mjs': FLAGS,
  'dispatch/cursor/dispatch-preflight-lint.mjs': FLAGS,
  'dispatch/devin/dispatch-preflight-lint.mjs': FLAGS,
  'dispatch/claude/dispatch-audit-posttooluse.mjs': FLAGS,
  'dispatch/codex/dispatch-audit-posttooluse.mjs': FLAGS,
  'dispatch/devin/dispatch-audit-posttooluse.mjs': FLAGS,
  'goal/cursor/goal-inject.mjs': CREATE,
  'goal/devin/goal-inject.mjs': CREATE,
  'mcp-route-guard/cursor/mcp-route-guard.mjs': FLAGS,
  'task-dispatch/cursor/task-dispatch-guard.mjs': FLAGS,
};
const FABLE = 'task-dispatch/claude/fable-subagent-guard.mjs';

function replaceOnce(text, find, replacement) {
  const parts = text.split(find);
  if (parts.length !== 2) throw new Error(`expected one match of ${JSON.stringify(find.slice(0, 40))}, found ${parts.length - 1}`);
  return parts.join(replacement);
}

function expected(file, before) {
  if (file === FABLE) {
    let text = replaceOnce(before, FABLE_READER, '');
    text = replaceOnce(text, FLAGS, FLAGS + IMPORT);
    text = replaceOnce(text, 'function main() {', 'async function main() {');
    return replaceOnce(text, 'payload = JSON.parse(readStdin());', 'payload = JSON.parse(await readStdin());');
  }
  const anchor = ANCHORS[file];
  const text = replaceOnce(before, READER, '');
  return replaceOnce(text, anchor, anchor + IMPORT);
}

let mismatches = 0;
for (const file of [...Object.keys(ANCHORS), FABLE]) {
  try {
    const want = expected(file, fs.readFileSync(path.join(beforeDir, file), 'utf8'));
    const live = fs.readFileSync(path.join(liveDir, file), 'utf8');
    if (want !== live) throw new Error('live file differs from the before copy plus the planned edits');
  } catch (error) {
    mismatches += 1;
    console.log(`MISMATCH ${file}: ${error.message}`);
  }
}
console.log(`mismatches=${mismatches}`);
process.exit(mismatches === 0 ? 0 : 1);
