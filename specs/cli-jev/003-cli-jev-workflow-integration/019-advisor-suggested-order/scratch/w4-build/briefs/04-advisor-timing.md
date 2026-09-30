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

TASK: add the zero-call advisor-only timing, its print line and the headroom rule, with tests.
R = .skilled/skills/system-skill-advisor/runtime. Files: S = R/scripts/routing-accuracy/score-suggested-order.mjs and T = R/tests/parity/score-suggested-order.vitest.ts. Read both first.

In S, after childEnv add, each with a JSDoc block:
 a. `export async function timeAdvisor(prompts, opts = {})`: for each prompt in order, `await runTimedChild({ prompt }, opts)` one at a time (never in parallel, so children do not compete for the machine); collect wallMs into walls and count timedOut as killed. Return { n: walls.length, p50: nearestRank(walls, 0.5), p95: nearestRank(walls, 0.95), max: walls.length === 0 ? null : Math.max(...walls), over2200: the count of walls above ADVISOR_BUDGET_MS, killed, walls }.
 b. `export function advisorLine(t)` returns `advisor child: p50=<p50> p95=<p95> max=<max> over_2200=${t.over2200} children=${t.n} killed=${t.killed}`, where each of p50, p95 and max prints as Math.round(value), or 'none' when null.
 c. `export function headroomLine(movable, advisorP95)` returns 'no headroom (movable)' when movable < MIN_MOVABLE; else 'no headroom (latency)' when advisorP95 is null or above ADVISOR_BUDGET_MS; else null. Say in the JSDoc that either line stops both model arms before any call.

In T: add timeAdvisor, advisorLine and headroomLine to the import, then describe('score-suggested-order advisor timing and headroom') with its:
 1. timeAdvisor(['late a', 'late b'], { childFile: stubChild() }) (the stub child sleeps 2300 ms for prompts starting with 'late'): n 2, killed 0, over2200 2, p95 at least 2300, and headroomLine(23, t.p95) is 'no headroom (latency)'. Give this it a 30_000 ms timeout argument.
 2. advisorLine({ n: 241, p50: 812.4, p95: 1103, max: 2281, over2200: 1, killed: 0, walls: [] }) is 'advisor child: p50=812 p95=1103 max=2281 over_2200=1 children=241 killed=0'; advisorLine({ n: 0, p50: null, p95: null, max: null, over2200: 0, killed: 0, walls: [] }) is 'advisor child: p50=none p95=none max=none over_2200=0 children=0 killed=0'.
 3. headroomLine(4, 800) is 'no headroom (movable)'; headroomLine(5, 2200) is null; headroomLine(23, 2201) is 'no headroom (latency)'; headroomLine(23, null) is 'no headroom (latency)'.

VERIFY (repo root): node --check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs
  node -e "import('./.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs').then((m) => console.log(m.headroomLine(4, 800), '|', m.headroomLine(23, 2201), '|', m.headroomLine(5, 2200)))"
Accept when: the same 2 files changed and nothing else; node --check exits 0; the node -e line prints `no headroom (movable) | no headroom (latency) | null`.

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
