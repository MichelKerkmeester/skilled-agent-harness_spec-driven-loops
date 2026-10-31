GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order

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

TASK: add the keep rule that judges one backend column, its two print lines, and their tests.
R = .skilled/skills/system-skill-advisor/runtime. Files: S = R/scripts/routing-accuracy/score-suggested-order.mjs and T = R/tests/parity/score-suggested-order.vitest.ts. Read both first, and read R/scripts/routing-accuracy/score-jev-tiebreak.mjs lines 50-65, 98-110 and 345-362 (never edit it).

In S:
1. Extend the import to `import { alwaysSecondOrder, binomTail, confidenceOrder, reciprocalRank, reorderSlots } from './score-jev-tiebreak.mjs';`
2. Replace the readProbabilities JSDoc summary line ` * Probability map read from advisor stdout, with the raw and full-coverage views.` with ` * Probability map from a classifier answer on stdout, with the raw and full-coverage views.`
3. After orderFromMaps add, with JSDoc blocks:
 a. `export function judgeColumn(backend, rows, answersByRow, walls, census)`. K = rows.length. A row is measured when answersByRow[row.id] is an array of exactly 3 non-null objects; skip other rows. For each measured row: { order, abstained } = orderFromMaps(row, answers); count abstentions; F += 3 minus the count of the most common value among the three topKey(answer, [...row.cluster, 'none']). Baseline: sum reciprocalRank(order, row.gold, census.isMatch) over measured rows for 'scorer' (row.order), 'confidence' (confidenceOrder(row)) and 'always_second' (alwaysSecondOrder(row)); the baseline is the first of those names whose sum is strictly greater than every earlier one, so a tie keeps the earlier name. Per measured row rc = reciprocal rank of the column order, rb = of the baseline order; SA += rc; SB += rb; W counts rc > rb, L counts rc < rb. M = measured rows. p = binomTail(W + L, W); pLoss = binomTail(W + L, L); t = nearestRank(walls, 0.95); p50 = nearestRank(walls, 0.5).
    verdict is the first that applies: 10 * M < 9 * K -> 'stop (coverage)'; pLoss <= ALPHA -> 'kill'; 20 * (SA - SB) < M - 1e-9 -> 'stop (margin)'; !(p < ALPHA) -> 'stop (sign test)'; 10 * F > 3 * M -> 'stop (flips)'; t === null or t > ADVISOR_BUDGET_MS -> 'stop (latency)'; else 'keep'.
    Return { backend, K, M, W, L, ties: M - W - L, abstentions, F, p, pLoss, sa: SA, sb: SB, baseline, t, p50, calls: walls.length, verdict }.
 b. `export function verdictLineFor(s, extra)` returns `verdict ${s.backend}: ${s.verdict} K=${s.K} M=${s.M} W=${s.W} L=${s.L} F=${s.F} p=${s.p.toFixed(4)} mrr=<a>/<b> p95_ms=<t>` where <a> = (s.sa / s.M).toFixed(4), <b> = (s.sb / s.M).toFixed(4), both 'none' when M is 0, and <t> = Math.round(s.t) or 'none' when null; a non-empty extra string is appended after one space.
 c. `export function columnLine(s)` returns `column ${s.backend}: rows=${K} measured=${M} wins=${W} losses=${L} ties=${ties} abstentions=${abstentions} flips=${F} baseline=${baseline} p_loss=${pLoss.toFixed(4)} calls=${calls} p50_ms=<p50> p95_ms=<t>`, each ms rounded or 'none'.

In T: add judgeColumn, verdictLineFor and columnLine to the import. Add helpers: `const strict = (a: string | null, g: string) => a === g;` `function rowOf(id: string, cluster: string[])` returning { id, gold: 'g', order: [...cluster, 'z'], cluster, confidence: { [cluster[0]]: 0.9, [cluster[1]]: 0.8, z: 0.1 } }; `function favor(k: string, cluster: string[])` returning a map over [...cluster, 'none'] giving k 0.7 and each other key 0.3 divided by (key count - 1). Rows 'm<i>' use cluster ['a','g'] (gold second), rows 'f<i>' use ['g','a'] (gold first). Then describe('score-suggested-order keep rule') with its (walls = 60 values of 800 unless stated; answers are three maps per row):
 1. keep: 10 m rows and 10 f rows, all favor('g'). Expect verdict 'keep', baseline 'scorer', W 10, L 0, and verdictLineFor(s, 'model=x') equals 'verdict deem: keep K=20 M=20 W=10 L=0 F=0 p=0.0010 mrr=1.0000/0.7500 p95_ms=800 model=x'; columnLine(s) starts with 'column deem: rows=20 measured=20 wins=10 losses=0'.
 2. kill: 10 f rows favor('a') and 10 f rows favor('g'). Expect verdict 'kill', W 0, L 10.
 3. stop (coverage): the keep rows, but 3 m rows get answers [map, map, null]. Expect M 17 and verdict 'stop (coverage)'.
 4. stop (margin): 1 m row and 19 f rows, all favor('g'). Expect baseline 'scorer', W 1, L 0, verdict 'stop (margin)'.
 5. stop (sign test): 4 m rows and 4 f rows, all favor('g'). Expect baseline 'scorer', W 4, L 0, verdict 'stop (sign test)'.
 6. stop (flips): the keep rows, but each f row's answers are [favor('g'), favor('g'), favor('a')]. Expect F 10 and verdict 'stop (flips)'.
 7. stop (latency): the keep rows with walls of 56 x 800 and 4 x 2500. Expect t 2500 and verdict 'stop (latency)'.
 8. The best zero-call order is the baseline: 10 m rows favor('g'). Expect baseline 'always_second', W 0, L 0, verdict 'stop (margin)'.
Call judgeColumn('deem', rows, answersByRow, walls, { isMatch: strict }).

VERIFY (repo root): node --check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs
  grep -c "export function judgeColumn\|export function verdictLineFor\|export function columnLine" .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs
Accept when: the same 2 files changed and nothing else; node --check exits 0; grep prints 3.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order
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
