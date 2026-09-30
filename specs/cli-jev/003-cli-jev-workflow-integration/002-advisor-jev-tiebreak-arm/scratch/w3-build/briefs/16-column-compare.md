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

TASK: add the column comparison. When both the Jev and the Deem choice columns ran, compare them only on rows both decided, with a one-sided bound on the paired reciprocal-rank gap. Tests pin it.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read summarizeColumn, runJevArm's return, runDeemArm's return and main first.

In the script:
1. summarizeColumn: add `const decidedRr = {};` beside the other counters. In the loop, inside the `if (rc > rs)` branch and inside the `else if (rc < rs)` branch, add `decidedRr[row.id] = rc;`. Return decidedRr as a new field after `verdict`, and add `decidedRr: Record<string, number>` to the JSDoc return type. Nothing else in the function changes.
2. Directly after verdictLine, add with a JSDoc block:
   export function compareColumns(a, b)
   ids = the keys of a.decidedRr that are also keys of b.decidedRr, sorted. gaps = ids.map((id) => a.decidedRr[id] - b.decidedRr[id]). n = gaps.length. meanGap = n === 0 ? null : sum / n. When n < 2: lower95 and upper95 are null. Otherwise sd = sample standard deviation (divide by n - 1), half = 1.6449 * sd / Math.sqrt(n), lower95 = meanGap - half, upper95 = meanGap + half.
   Return { first: a.backend, second: b.backend, n, meanGap, lower95, upper95 }.
   JSDoc: each bound is a one-sided 95 percent bound on the mean paired gap by the normal approximation; a positive lower bound favors the first column and a negative upper bound favors the second.
   export function compareLine(c): f = (v) => (v === null ? 'none' : v.toFixed(4)); returns
   `compare: first=${c.first} second=${c.second} rows_both_decided=${c.n} mean_rr_gap=${f(c.meanGap)} lower95=${f(c.lower95)} upper95=${f(c.upper95)}`
3. main: keep the value each arm returns: `let jevResult;` and `let deemResult;` before the two `if (values.jev === true)` / `if (values.deem === true)` blocks; assign `jevResult = await runJevArm(...)` in both Jev branches and `deemResult = await runDeemArm(...)`. Before `return 0;` add:
      const jevColumn = jevResult && 'decidedRr' in jevResult ? jevResult : undefined;
      const deemColumn = deemResult && 'column' in deemResult ? deemResult.column : undefined;
      if (jevColumn && deemColumn) out(compareLine(compareColumns(jevColumn, deemColumn)));

In the vitest file, import compareColumns and compareLine, and add describe('score-jev-tiebreak column comparison'):
1. it('bounds the paired gap on rows both columns decided'):
   a = { backend: 'jev', decidedRr: { r1: 1, r2: 1, r3: 0.5 } }, b = { backend: 'deem', decidedRr: { r1: 0.5, r2: 0.5, r4: 1 } }.
   compareColumns(a, b) equals { first: 'jev', second: 'deem', n: 2, meanGap: 0.5, lower95: 0.5, upper95: 0.5 }.
   c = compareColumns({ backend: 'jev', decidedRr: { r1: 1, r2: 0.5, r3: 1 } }, { backend: 'deem', decidedRr: { r1: 0.5, r2: 1, r3: 0.5 } }): c.n is 3, c.meanGap close to 1/6, c.lower95 close to 1/6 - 1.6449 * Math.sqrt(1 / 3) / Math.sqrt(3), c.upper95 above c.meanGap.
   compareLine(compareColumns(a, b)) is 'compare: first=jev second=deem rows_both_decided=2 mean_rr_gap=0.5000 lower95=0.5000 upper95=0.5000'.
2. it('prints no bound below two shared rows'): compareColumns({ backend: 'jev', decidedRr: { r1: 1 } }, { backend: 'deem', decidedRr: { r2: 1 } }) equals { first: 'jev', second: 'deem', n: 0, meanGap: null, lower95: null, upper95: null }, and its compareLine ends with 'rows_both_decided=0 mean_rr_gap=none lower95=none upper95=none'.
3. In describe('score-jev-tiebreak column and keep rule'), in the first it(), add: expect(Object.keys(s.decidedRr)).toHaveLength(s.decided), using that test's own summary variable name.

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
