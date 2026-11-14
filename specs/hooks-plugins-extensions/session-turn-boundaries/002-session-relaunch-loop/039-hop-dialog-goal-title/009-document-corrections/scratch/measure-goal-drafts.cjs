// Drafts the goal amendments in a scratch workspace and measures each durable slice.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const repo = '/Users/michelkerkmeester/MEGA/Development/Skilled';
const R = 'specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop';
const scratch = __dirname;

function must(text, from, to) {
  if (!text.includes(from)) throw new Error('not found: ' + from.slice(0, 60));
  return text.replace(from, to);
}
function measure(name, content) {
  const ws = path.join(scratch, 'ws-' + name);
  const dir = path.join(ws, 'specs', 'x');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'goal.md'), content);
  const out = execFileSync('node', [path.join(repo, '.skilled/hooks/goal/bin/goal.cjs'), 'packet', 'specs/x', '--workspace', ws], { encoding: 'utf8' });
  const chars = /packet_durable_chars=(\d+)/.exec(out)[1];
  const budget = Number(chars) <= 4000 ? 'ok' : 'OVER';
  console.log(`${name}: durable=${chars} budget=${budget}`);
}

// ---- 039 goal
const g039 = fs.readFileSync(path.join(repo, R, '039-hop-dialog-goal-title/goal.md'), 'utf8');
const objOld = '**Objective:** A Claude Code session that hands over cannot park its hop behind a question dialog, starts its receiver on the unfinished goal of its packet when it set no goal itself and keeps its generated title in the next session.';
const objNew = objOld + ' The gaps the 2026-11-13 research found that the operator chose to close are closed: a changed wrapper says so before a hop, a hand-over Stop cannot arm stops blocking questions, a goal the operator ended stays ended and the documents say what the code does.';
const d2Old = '| D2 | Every child changes Claude Code only. Pi, OpenCode, Codex, Cursor and Devin stay as they are |';
const d2New = '| D2 | Children 001 to 003 change Claude Code only. Children from 004 may also change the shared wrapper, the shared relaunch core, tests and documents. No child edits a Pi, OpenCode, Codex, Cursor or Devin adapter |';
const d1Old = '| D1 | One child per fix. Each code change lands with a test that failed first |';
const d1New8 = '| D1 | One child per code fix. Each code change lands with a test that failed first. The five document fixes share one child |';
const lastRow = '| 003-generated-title-carry | `003-generated-title-carry/goal.md` |';
const kids8 = ['004-wrapper-change-notice', '005-parked-record-escape', '006-record-without-handoff', '007-killer-test-margin', '008-history-test-database-env', '009-document-corrections', '010-goal-ending-carry', '011-goal-fallback-bound'];
const kids12 = ['004-wrapper-change-notice', '005-parked-record-escape', '006-record-without-handoff', '007-killer-test-margin', '008-history-test-database-env', '009-parent-goal-binding-rows', '010-phase-033-status', '011-rebase-commit-id-sentence', '012-permission-carry-summary-rows', '013-playbook-case-names', '014-goal-ending-carry', '015-goal-fallback-bound'];
const rows = (kids) => kids.map((k) => `| ${k} | \`${k}/goal.md\` |`).join('\n');
function build039(kids, d1, count) {
  let t = g039;
  t = must(t, objOld, objNew);
  if (d1) t = must(t, d1Old, d1);
  t = must(t, d2Old, d2New);
  t = must(t, lastRow, lastRow + '\n' + rows(kids));
  t = must(t, 'prints `RESULT: PASSED` four times', `prints \`RESULT: PASSED\` ${count} times`);
  t = t.replace(/^- \[x\] /gm, '- [ ] ');
  return t;
}
measure('039-current', g039);
const a8 = build039(kids8, d1New8, 'twelve');
const rowsCompact = (kids) => kids.map((k) => `| ${k.slice(0, 3)} | \`${k}/goal.md\` |`).join('\n');
let a12 = build039(kids12, null, 'sixteen');
a12 = a12.replace(rows(kids12), rowsCompact(kids12));
measure('039-eight-children', a8);
measure('039-twelve-children', a12);
fs.writeFileSync(path.join(scratch, '039-goal-eight.md'), a8);
fs.writeFileSync(path.join(scratch, '039-goal-twelve.md'), a12);

// ---- 002 parent goal
const g002 = fs.readFileSync(path.join(repo, R, 'goal.md'), 'utf8');
const p1Old = '| D1 | Phases close in order: Claude Code, then Pi and OpenCode, then Codex, Cursor, Devin and Hermes, then review and closure. Read-only spikes of the next phase may overlap it |';
const p1New = '| D1 | Phases close in order: Claude Code, Pi and OpenCode, the other runtimes, then review. Read-only spikes of the next phase may overlap |';
const p7Old = '| D7 | Live runs and provider probes use OpenAI with `gpt-6-luna`. Devin\'s live run uses `swe-2-max`. A live OpenCode run proving the repo default runs `llmgateway/deepseek-v4.1-flash` variant `max`. Nothing else is substituted. Hermes and Cursor have no live run |';
const p7New = '| D7 | Live runs and probes use OpenAI `gpt-6-luna`. Devin uses `swe-2-max`. An OpenCode run proving the repo default uses `llmgateway/deepseek-v4.1-flash` `max`. No substitutes. Hermes and Cursor have none |';
const pLast = '| 036-review-remediation | `036-review-remediation/goal.md` |';
let p = g002;
p = must(p, p1Old, p1New);
p = must(p, p7Old, p7New);
const pCompact = must(p, pLast, pLast + '\n| 038 | `038-goal-and-workflow-resume/goal.md` |\n| 039 | `039-hop-dialog-goal-title/goal.md` |');
const pStandard = must(p, pLast, pLast + '\n| 038-goal-and-workflow-resume | `038-goal-and-workflow-resume/goal.md` |\n| 039-hop-dialog-goal-title | `039-hop-dialog-goal-title/goal.md` |');
measure('002-current', g002);
measure('002-compact-rows', pCompact);
measure('002-standard-rows', pStandard);
console.log('D1 saved', p1Old.length - p1New.length, 'D7 saved', p7Old.length - p7New.length);
fs.writeFileSync(path.join(scratch, '002-goal-compact.md'), pCompact);
