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

TASK: create two new files, an ES module holding pure math for an offline routing eval, and its vitest file.
R = .skilled/skills/system-skill-advisor/runtime
Style models to read first: R/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs lines 1-30 (header and import style) and R/tests/parity/capture-ledger-workspace-root.vitest.ts (test style).

FILE 1, create R/scripts/routing-accuracy/score-jev-tiebreak.mjs:
- Line 1 `#!/usr/bin/env node`, then the 3-line box header with `MODULE: Jev and Deem Tie-Break Eval`, then this comment:
  // Measures, offline, whether a Jev or local Deem choice inside the advisor's
  // near-tie cluster beats the scorer's own order. The default run is a census
  // that makes no model call. The script holds no credential and reads none.
- `export const ALPHA = 0.05;` and `export const POWER = 0.8;`
- These exported functions, each with a short JSDoc block. No top-level side effects, no console output, no dist import:
  a. binomTail(n, k, p = 0.5): P(X >= k) for X ~ Binomial(n, p). Return 1 when k <= 0 and 0 when k > n. Otherwise the exact sum over i = k..n of C(n, i) * p^i * (1 - p)^(n - i), with C(n, i) built by the multiplicative loop in floating point.
  b. minWins(n): the smallest k in 0..n with binomTail(n, k) <= ALPHA, or null when none exists.
  c. winRate80(n): null when minWins(n) is null. Otherwise run 60 bisection steps on [0.5, 1] for the smallest p with binomTail(n, minWins(n), p) >= POWER and return the upper bound.
  d. reciprocalRank(order, gold, isMatch): 1 / (i + 1) for the first index i where isMatch(order[i], gold) is true, else 0.
  e. rankMetrics(rows, orderFor, isMatch): returns { n, mrr, right1, right3 }. n is rows.length. For each row, order = orderFor(row) and the gold is row.gold. mrr is the mean reciprocal rank rounded with Number(x.toFixed(4)), 0 when n is 0. right1 and right3 count rows whose gold matches within order.slice(0, 1) and order.slice(0, 3).
  f. reorderSlots(order, cluster, newCluster): a copy of order in which the positions holding cluster members, taken in ascending position, receive newCluster's entries in turn. Other positions keep their skill.
  g. movePickFirst(order, cluster, pick): reorderSlots(order, cluster, [pick, ...cluster.filter((s) => s !== pick)]) when cluster includes pick, otherwise a copy of order.
  h. classifyRow(row, isMatch): 'ineligible' when row.cluster.length < 2. Otherwise g = index of the first cluster member m with isMatch(m, row.gold): 'gold_first' when g is 0, 'movable' when g > 0, 'gold_outside' when g is -1.

FILE 2, create R/tests/parity/score-jev-tiebreak.vitest.ts with the box header `MODULE: Jev Tie-Break Eval Tests` and one describe('score-jev-tiebreak pure math'). Import the eight functions from '../../scripts/routing-accuracy/score-jev-tiebreak.mjs'. Use const strict = (a: string | null, g: string) => a === g. One it() per line:
  1. binomTail(5, 5) is 0.03125, binomTail(5, 0) is 1, binomTail(5, 6) is 0
  2. minWins(4) is null, minWins(5) is 5, minWins(23) is 16, minWins(55) is 35
  3. winRate80(5)!.toFixed(3) is '0.956', winRate80(55)!.toFixed(3) is '0.680', winRate80(4) is null
  4. reorderSlots(['a','x','b','c'], ['a','b','c'], ['c','a','b']) equals ['c','x','a','b']
  5. movePickFirst(['a','x','b'], ['a','b'], 'b') equals ['b','x','a']; movePickFirst(['a','b'], ['a','b'], 'z') equals ['a','b']
  6. rankMetrics([{ gold: 'b' }, { gold: 'z' }], () => ['a','b','c'], strict) equals { n: 2, mrr: 0.25, right1: 0, right3: 1 }
  7. classifyRow: cluster ['a'] gold 'a' is 'ineligible'; ['g','a'] gold 'g' is 'gold_first'; ['a','g'] gold 'g' is 'movable'; ['a','b'] gold 'g' is 'gold_outside'

VERIFY (run from the repo root):
  node --check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs
  node -e "import('./.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs').then((m) => console.log(m.minWins(23), m.winRate80(55).toFixed(3)))"
Accept when: 2 files created and nothing else changed; node --check exits 0; the node -e line prints `16 0.680`.

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
