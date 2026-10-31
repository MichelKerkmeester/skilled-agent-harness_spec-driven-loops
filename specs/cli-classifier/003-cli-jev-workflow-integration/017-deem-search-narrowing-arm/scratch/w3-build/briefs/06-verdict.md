GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm

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

TASK: add the per-column keep rule (modal pick, exact sign test, verdict, column summary) to the track-narrowing script, with five vitest cases.
S = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs. T = .skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts. Read both first.

In S, new section `6. VERDICT` after section 5, exported functions with JSDoc. A comment states the rule is fixed before any model call, counts stay integers and p is exact, so no rounding decides a verdict.
 a. signTestP(wins, losses): n = wins + losses; n === 0 returns { p: 1, below: false }. Otherwise with BigInt, num = sum over i = wins..n of C(n, i) (build each coefficient exactly, e.g. C(n, i) = C(n, i - 1) * (n - i + 1) / i starting from C(n, 0) = 1n), den = 1n << BigInt(n); below = 20n * num < den (that is p < 0.05 exactly); p = Number(num) / Number(den). Returns { p, below }.
 b. modalPick(answers) with three keys: the key named at least twice gives { pick: key, top: count }; three different keys give { pick: null, top: 1 } (unstable).
 c. decideVerdict({ K, M, A, B, W, L, F }): checks in order and returns the first failure as { outcome: 'stop', reason, p }: coverage 10 * M >= 9 * K else 'coverage'; margin 10 * (A - B) >= M else 'margin'; sign test signTestP(W, L).below else 'sign test'; flips 10 * F <= 3 * M else 'flips'. All pass gives { outcome: 'keep', reason: null, p }. p is signTestP(W, L).p in every case.
 d. formatP(p): p.toPrecision(4).
 e. summarizeColumn(backend, rows, records, baselinePicks, suffix): rows are the kept rows { id, track }, K = rows.length; records is a Map from row id to that row's answers in call order (a submitted key, or null for an unmeasured call); baselinePicks is a Map from row id to the baseline method's pick (a track or null). A row is measured when it has exactly 3 answers and all are strings; M counts them, the rest are unmeasured. On a measured row: { pick, top } = modalPick(answers); F += 3 - top; the backend is right when pick === row.track (unstable and NONE_KEY are wrong); the baseline is right when baselinePicks.get(row.id) === row.track; A, B, W (backend only right) and L (baseline only right) count them; unstable counts pick null and abstained counts pick NONE_KEY. v = decideVerdict. line = `verdict ${backend}: ${v.outcome === 'keep' ? 'keep' : `stop (${v.reason})`} K=${K} M=${M} A=${A} B=${B} W=${W} L=${L} F=${F} p=${formatP(v.p)}`, plus ` ${suffix}` when suffix is a non-empty string. Returns { backend, K, M, unmeasured: K - M, unstable, abstained, A, B, W, L, F, p: v.p, flipRate: M === 0 ? 0 : F / (3 * M), outcome: v.outcome, reason: v.reason, line }.
 f. nearestRank(values, q): null for an empty list, else the ascending-sorted value at index Math.ceil(q * n) - 1, passed through Math.round.
 g. columnLine(summary, latency) with latency { p50, p95 }: `column ${backend}: rows=${K} measured=${M} unmeasured=${unmeasured} unstable=${unstable} abstained=${abstained} flip_rate=${flipRate.toFixed(4)} latency_p50_ms=${p50 ?? 'none'} latency_p95_ms=${p95 ?? 'none'}`.

In T, import the new names and add describe('score-track-narrowing verdict'). A helper col(tracks, answers, baseline) builds rows { id: `r${i}`, track }, records = new Map of `r${i}` to answers[i] (omit the entry when answers[i] is undefined) and baselinePicks = new Map of `r${i}` to baseline[i], then returns summarizeColumn('deem', rows, records, baselinePicks, 'model=deem-0.8-v1').
 1. 'prints keep on stub answers that clear all four conditions': six rows of track 'a', answers ['a','a','a'] each, baseline 'b' each: K 6, M 6, A 6, B 0, W 6, L 0, F 0, outcome 'keep', p 0.015625, line equals 'verdict deem: keep K=6 M=6 A=6 B=0 W=6 L=0 F=0 p=0.01563 model=deem-0.8-v1'.
 2. 'prints stop (margin) on a gain under ten points': 20 rows of track 'a'; baseline 'a' for rows 0-9 and 'b' for 10-19; answers ['a','a','a'] for rows 0-10 and ['b','b','b'] for 11-19: A 11, B 10, W 1, L 0, reason 'margin', line starts with 'verdict deem: stop (margin) K=20 M=20 A=11 B=10 W=1 L=0 F=0 p='.
 3. 'prints stop (coverage) with 2 of 10 kept rows unmeasured and every measured pick right': 10 rows of track 'a', baseline null each, answers ['a','a','a'] for rows 0-7, ['a', null, 'a'] for row 8 and none for row 9: M 8, unmeasured 2, A 8, reason 'coverage', line starts with 'verdict deem: stop (coverage) K=10 M=8'.
 4. 'stops on the sign test and on flips, and counts unstable and none as wrong': four rows of track 'a' answered ['a','a','a'] with baseline null give reason 'sign test' and p 0.0625. 25 rows of track 'a' with baseline null, answers ['a','a','a'] for rows 0-19 and ['a','b','c'] for rows 20-24: unstable 5, F 10, A 20, reason 'flips'. col(['a'], [['none','none','a']], [null]) gives abstained 1 and A 0. signTestP(0, 0) equals { p: 1, below: false }; signTestP(5, 0) equals { p: 0.03125, below: true }; modalPick(['a','b','c']) equals { pick: null, top: 1 } and modalPick(['a','a','b']) equals { pick: 'a', top: 2 }.
 5. 'reports nearest-rank latency and the column line': nearestRank([10, 30, 20, 40], 0.5) is 20, nearestRank([10, 20, 30, 40], 0.95) is 40, nearestRank([], 0.5) is null; columnLine of test 1's summary with { p50: 12, p95: null } equals 'column deem: rows=6 measured=6 unmeasured=0 unstable=0 abstained=0 flip_rate=0.0000 latency_p50_ms=12 latency_p95_ms=none'.

VERIFY (repo root): node --check .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs
Accept when: 2 files changed and nothing else; node --check exits 0.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm
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
