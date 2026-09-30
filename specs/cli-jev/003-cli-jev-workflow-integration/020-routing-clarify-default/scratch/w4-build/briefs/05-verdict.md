GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default

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

TASK: add the keep rule's verdict math to score-clarify-default.cjs as pure functions, plus three tests. Nothing calls them yet.

FILE 1 (edit): .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs
a. New section `7. VERDICT` between SCORER and CLI. Renumber CLI to 8 and EXPORTS to 9. Open it with a comment: counts stay integers and every binomial tail is an exact BigInt sum over 2^n, so no rounding decides a verdict.
b. Functions, each with JSDoc. Model them on `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` lines 812-897 (`signTestP`, `modalPick`, `decideVerdict`, `formatP`), with the differences stated here:
- `tailP(n, k)` returns `{ p, num, den }`: the exact P(X >= k) for X ~ Binomial(n, 1/2), `num` the BigInt sum of C(n, i) for i >= k, `den = 1n << BigInt(n)`, `p = Number(num) / Number(den)`. `n === 0` or `k <= 0` returns `{ p: 1, num: 1n, den: 1n }`.
- `modalPick(answers)` returns `{ pick, top }`: the key named at least twice and its count; when no key reaches two it returns `{ pick: null, top: 0 }`, so an unstable row adds 3 non-modal picks, not 2.
- `decideVerdict({ K, M, A, B, W, L, F })` returns `{ outcome, reason, p }` with `p = tailP(W + L, W).p` in every outcome. First failed check decides, in this order: coverage `10 * M >= 9 * K`, else `{ outcome: 'stop', reason: 'coverage' }`; kill: with `t = tailP(W + L, L)`, `W + L > 0` and `20n * t.num <= t.den` gives `{ outcome: 'kill', reason: null }`; margin `10 * (A - B) >= M`, else stop `'margin'`; sign test: with `s = tailP(W + L, W)`, `W + L > 0` and `20n * s.num < s.den`, else stop `'sign test'`; flips `10 * F <= 3 * M`, else stop `'flips'`; otherwise `{ outcome: 'keep', reason: null }`.
- `scoreColumn(labeled, answersById)`: `labeled` rows carry `id`, `alternatives` and `value`; `answersById` is a Map id -> array of answers (string or null). Returns `{ K, M, A, B, W, L, F, unstable, abstained }` with `K = labeled.length`. A row is measured only when its array has exactly `ORDERS` entries and every entry is a string; unmeasured rows add nothing else. For a measured row: `M += 1`; `{ pick, top } = modalPick(answers)`; `F += ORDERS - top`; `pick === null` adds to `unstable`, `pick === NONE_KEY` to `abstained`; `colRight = pick === row.value`; `baseRight = row.alternatives[0] === row.value`; A, B, W and L count `colRight`, `baseRight`, `colRight && !baseRight` and `baseRight && !colRight` over measured rows only.
- `formatP(p)` returns `p.toPrecision(4)`.
- `verdictLine(backend, counts, decision, suffix)` returns `'verdict ' + backend + ': ' + <'keep' | 'kill' | 'stop (' + reason + ')'> + ' K=.. M=.. A=.. B=.. W=.. L=.. F=.. p=' + formatP(decision.p)`, then `' ' + suffix` when `suffix` is a non-empty string.
c. EXPORTS gains `tailP, modalPick, decideVerdict, scoreColumn, formatP, verdictLine`.

FILE 2 (edit): the test file. Append three tests:
13. `tailP is exact`: `tailP(0, 0).p === 1`; `tailP(20, 20).p === 2 ** -20`; `tailP(10, 5)` has `num === 638n` and `den === 1024n`.
14. `decideVerdict checks coverage, kill, margin, sign test and flips in order`: `{K:30,M:26,A:26,B:0,W:26,L:0,F:0}` gives stop coverage; `{K:30,M:30,A:0,B:20,W:0,L:20,F:0}` gives kill; `{K:30,M:30,A:0,B:0,W:0,L:0,F:0}` gives stop margin; `{K:30,M:30,A:5,B:2,W:5,L:2,F:0}` gives stop sign test; `{K:30,M:30,A:30,B:0,W:30,L:0,F:10}` gives stop flips; `{K:30,M:30,A:30,B:0,W:30,L:0,F:0}` gives keep. Assert `outcome` and `reason` for each.
15. `scoreColumn counts measured, unstable and flips`: labeled `[{ id: 'a', alternatives: ['m1','m2'], value: 'm2' }, { id: 'b', alternatives: ['m1','m2'], value: 'm1' }, { id: 'c', alternatives: ['m1','m2'], value: 'm2' }]`; answers `a: ['m2','m2','m2']`, `b: ['m1','m2','none_of_these']`, `c: ['m2','m2',null]`. Expect `K 3, M 2, A 1, B 1, W 1, L 1, F 3, unstable 1, abstained 0`. Also `verdictLine('deem', <that result>, { outcome: 'stop', reason: 'coverage', p: 0.5 }, 'model=x')` equals `'verdict deem: stop (coverage) K=3 M=2 A=1 B=1 W=1 L=1 F=3 p=0.5000 model=x'`.

Accept when: 2 files changed, `node --check` passes on both, and `grep -c "^test(" <test file>` prints 15.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default
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

Checks to run: `node --check` on both files, and `grep -c "^test(" .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs`.

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
