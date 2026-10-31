GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/code.md; focused summary for a one-change brief) ===
You are @code, a leaf implementer dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. Read each file before editing it and re-read the edited region after.
Standards: read .skilled/skills/sk-code/SKILL.md and follow the route it resolves for this file type.
Comment hygiene is a hard block: no spec paths, packet or phase numbers, or REQ/task ids in code comments. Keep the durable why.
Verification: run only the checks this brief lists. Fail closed: no retry loop, no workaround. Report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: code) ===

TASK: add one exported pure function, summarizeCensus(census), that builds the census report lines, and its tests.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read both first. loadCensus() in the script shows the census shape.

In the script, after loadCensus, add `export function summarizeCensus(census)` with a JSDoc block. It returns { lines, voided, eligible, movable, headroom } and prints nothing:
- eligibleRows = census.rows whose classifyRow(row, census.isMatch) is not 'ineligible'. eligible = its length.
- One line per group, groups in this order: file labeled, file holdout, split train, split test. Counts over the group's rows:
  `census: file=<name> rows=<n> eligible=<e> movable=<m> gold_first=<f> gold_outside=<o> gold_top3=<t> tau03=<k> over25=<x>` (for the split groups the key is `split=<name>`)
  gold_top3 counts rows, eligible or not, whose gold matches (census.isMatch) within row.order.slice(0, 3). tau03 counts eligible rows with row.tau03 true. over25 counts eligible rows with row.cluster.length > 25.
- Then `baseline: holdout_top1=<correct>/<total>` from census.holdoutTop1. When that text is not '53/70', append `baseline mismatch: comparison void`, stop adding lines and return voided: true.
- Otherwise append `comparator: name=scorer rows=<eligible> mrr=<mrr.toFixed(4)> right1=<right1> right3=<right3>` from rankMetrics(eligibleRows, (row) => row.order, census.isMatch).
- Then `power: movable=<m> decided_ceiling=<m + f> min_wins=<minWins(m) ?? 'none'> win_rate_80=<winRate80(m)?.toFixed(3) ?? 'none'>` where m and f are the movable and gold_first totals over all rows.
- Then `no headroom` when m is 0, `underpowered` when m is 1 to 4. headroom is 'none', 'underpowered' or 'ok' to match. voided is false.

In the vitest file add summarizeCensus to the import, then a helper below the imports:
function synthCensus(holdoutCorrect = 53) { return { holdoutTop1: { correct: holdoutCorrect, total: 70 }, labels: [], isMatch: strict, describe: (s: string) => `desc ${s}`, rows: [
  { id: 'r1', file: 'labeled', split: 'train', prompt: 'p1', gold: 'a', goldKey: 'a', order: ['a', 'b', 'c'], cluster: ['a', 'b'], confidence: { a: 0.8, b: 0.9, c: 0.1 }, score: { a: 0.5, b: 0.4, c: 0.1 }, tau03: true },
  { id: 'r2', file: 'labeled', split: 'test', prompt: 'p2', gold: 'b', goldKey: 'b', order: ['a', 'b', 'c'], cluster: ['a', 'b'], confidence: { a: 0.9, b: 0.85, c: 0.1 }, score: { a: 0.6, b: 0.58, c: 0.2 }, tau03: false },
  { id: 'r3', file: 'holdout', split: 'train', prompt: 'p3', gold: 'z', goldKey: 'z', order: ['a', 'b'], cluster: ['a', 'b'], confidence: { a: 0.7, b: 0.7 }, score: { a: 0.5, b: 0.49 }, tau03: false },
  { id: 'r4', file: 'holdout', split: 'test', prompt: 'p4', gold: 'c', goldKey: 'c', order: ['c'], cluster: ['c'], confidence: { c: 0.9 }, score: { c: 0.9 }, tau03: false },
] }; }
Add describe('score-jev-tiebreak census summary') with two cases:
A. summarizeCensus(synthCensus()) has headroom 'underpowered', voided false, eligible 3, movable 1, and lines equal to exactly:
  'census: file=labeled rows=2 eligible=2 movable=1 gold_first=1 gold_outside=0 gold_top3=2 tau03=1 over25=0'
  'census: file=holdout rows=2 eligible=1 movable=0 gold_first=0 gold_outside=1 gold_top3=1 tau03=0 over25=0'
  'census: split=train rows=2 eligible=2 movable=0 gold_first=1 gold_outside=1 gold_top3=1 tau03=1 over25=0'
  'census: split=test rows=2 eligible=1 movable=1 gold_first=0 gold_outside=0 gold_top3=2 tau03=0 over25=0'
  'baseline: holdout_top1=53/70'
  'comparator: name=scorer rows=3 mrr=0.5000 right1=1 right3=2'
  'power: movable=1 decided_ceiling=2 min_wins=none win_rate_80=none'
  'underpowered'
B. summarizeCensus(synthCensus(52)) has voided true, 6 lines, and its last two lines are 'baseline: holdout_top1=52/70' and 'baseline mismatch: comparison void'.

VERIFY (repo root): node --check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs
Accept when: 2 files changed and nothing else; node --check exits 0.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm
- Other workers edit other files in this tree at the same time. Touch only the files this brief names.
- The orchestrator runs the test suites, spec validation and every git commit after you return.
- Your sandbox may block test runners that open local sockets (tsx, vitest). Run only the checks listed here; the orchestrator runs the rest.

DON'T
- Edit, create or delete any file this brief does not name.
- Run a git command that writes (add, commit, stash, checkout, restore, reset, merge, rebase, push).
- Install anything (npm/pnpm/pip/brew install, npm ci) or touch node_modules.
- Open any .env file, print environment variables, or write a key or token into any file.
- Call jev, the local Deem server (127.0.0.1:8300) or any network service.
- Put spec paths, packet or phase numbers, or REQ/task ids in code comments.
- Reformat, reorder or "improve" anything outside the named edit.
- Ask a question. If a step cannot be done exactly as written, stop and report BLOCKED with the reason.

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
