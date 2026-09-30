GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader

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

TASK: add the fixed keep rule (exact binomial tails, the ordered verdict checks and the per-column summary) to the D4 agreement script, with six tests. 2 files.
S = .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs
T = .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts
Read first: S, T, section 5 of specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/scratch/w4-build/design.md (implement ONLY section 5), and, as the model to copy, `signTestP` and `decideVerdict` in .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:823-891 (read only).

STEP 1. In S insert after `chooseBaseline` a section `// 6. KEEP RULE`; renumber EXPORTS to `// 7. EXPORTS`. Add, JSDoc each:
- `binomialTail(successes, trials)`: BigInt binomial sum like signTestP; returns `{ num, den, p }` with `den = 1n << BigInt(trials)`, `num` = sum of C(trials, i) for i >= successes, `p = Number(num) / Number(den)`; trials 0 returns `{ num: 1n, den: 1n, p: 1 }`.
- `decideVerdict({ backend, K, M, A, B, W, L, F })`: returns `{ outcome, reason, pWin, pLoss }` where win = binomialTail(W, W + L), loss = binomialTail(L, W + L). First failing check decides: `!(10 * M >= 9 * K)` -> stop 'coverage'; `20n * loss.num < loss.den` -> outcome 'kill', reason null; `!(10 * (A - B) >= M)` -> stop 'margin'; `!(20n * win.num < win.den)` -> stop 'sign test'; `backend === 'jev' && !(10 * F <= 3 * M)` -> stop 'flips'; else 'keep', reason null. A comment says integer counts and exact tails mean no rounding decides a verdict.
- `formatP(p)`: `p.toPrecision(4)`.
- `summarizeColumn(backend, rows, answers, baselineCalls, labelsSha, suffix)` exactly as design section 5, including the `line` format.
- Append `binomialTail, decideVerdict, formatP, summarizeColumn` to `module.exports`.

STEP 2. In T add `//   Keep rule (binomialTail, decideVerdict, summarizeColumn)` to the MODULE header list and append `describe('score-d4-agreement keep rule', ...)` with six it(), each calling `d4.decideVerdict` or `d4.summarizeColumn`:
1. keep: `{ backend: 'deem', K: 30, M: 30, A: 30, B: 20, W: 10, L: 0, F: 0 }` -> outcome 'keep', reason null, `d4.formatP(pWin)` '0.0009766', pLoss 1; also `d4.binomialTail(5, 5)` has num 1n and den 32n.
2. kill: `{ backend: 'deem', K: 30, M: 30, A: 20, B: 28, W: 0, L: 8, F: 0 }` -> outcome 'kill'.
3. stop (margin): `{ backend: 'deem', K: 30, M: 30, A: 24, B: 22, W: 5, L: 3, F: 0 }` -> outcome 'stop', reason 'margin'.
4. stop (coverage): `{ backend: 'deem', K: 30, M: 26, A: 26, B: 10, W: 16, L: 0, F: 0 }` -> reason 'coverage'.
5. flips for jev only: `{ backend: 'jev', K: 30, M: 30, A: 30, B: 20, W: 10, L: 0, F: 10 }` -> reason 'flips'; the same counts with backend 'deem' -> outcome 'keep'.
6. summarizeColumn: rows `[{ file: 'a', label: 'yes' }, { file: 'b', label: 'no' }, { file: 'c', label: 'no' }]`, baselineCalls `new Map([['a', 'no'], ['b', 'no'], ['c', 'no']])`. jev answers `new Map([['a', [0.9, 0.8, 0.2]], ['b', [0.1, 0.1, 0.1]], ['c', [0.9, null, 0.9]]])` with labelsSha 'abc' and suffix 'jev_version=0.6.2 provider=official model=m' gives M 2, A 2, B 1, W 1, L 0, F 1 and line `'verdict jev: stop (coverage) K=3 M=2 A=2 B=1 W=1 L=0 F=1 p_win=0.5000 p_loss=1.000 labels_sha256=abc jev_version=0.6.2 provider=official model=m'`. deem answers `new Map([['a', [0.7]], ['b', [0.2]], ['c', [1.5]]])` with suffix '' gives M 2, F null and a line containing ' F=n/a ' and ending in 'labels_sha256=abc'.

VERIFY (repo root; paste each command, its result line and exit code):
  node --check .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs
  node -e "const m = require('./.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs'); console.log(JSON.stringify(m.decideVerdict({ backend: 'deem', K: 30, M: 30, A: 25, B: 22, W: 4, L: 1, F: 0 })))"   (expect outcome "stop", reason "sign test")
  grep -c "// 7. EXPORTS" .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs   (expect 1)
Accept when: 2 files changed (S and T) and nothing else; each check prints what it expects.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader
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
