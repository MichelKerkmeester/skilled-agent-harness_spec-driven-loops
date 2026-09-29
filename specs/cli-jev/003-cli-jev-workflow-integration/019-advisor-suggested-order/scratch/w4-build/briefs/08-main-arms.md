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

TASK: wire the two gates and the two arms into main(), Jev first, each gate once, only when there is headroom, with tests.
R = .skilled/skills/system-skill-advisor/runtime. Files: S = R/scripts/routing-accuracy/score-suggested-order.mjs and T = R/tests/parity/score-suggested-order.vitest.ts. Read both first, then R/scripts/routing-accuracy/score-jev-tiebreak.mjs lines 1375-1411 and 1489-1506 (jevGate, deemGate; never edit that file).

In S:
1. Add deemGate and jevGate to the score-jev-tiebreak import (alphabetical) and `const GATE_TIMEOUT_MS = 10000;`.
2. In main, replace the final `return 0;` (after `out(KEEP_RULE_LINE);`) with:
   - `let jevResult;` and `let deemResult;`
   - when headroom is null: armCtx = { out, env: childEnv(env), outDir: values.out, childFile: deps.childFile, timeoutMs: deps.timeoutMs, backoffMs: deps.backoffMs, advisorP50: timing.p50 }. When values.jev is true: gate = jevGate({ out, env, timeoutMs: GATE_TIMEOUT_MS }); when gate.passed, jevResult = await runArm('jev', census, gate, armCtx). Then, when values.deem is true: gate = deemGate({ out, env }); when gate.passed, deemResult = await runArm('deem', census, gate, armCtx). One comment line: Jev runs first, each gate runs once, and a failed gate never starts the other backend.
   - `return 0;`
   Add timeoutMs and backoffMs to main's JSDoc deps list. jevResult and deemResult stay unused in this step; a later step writes them to a report.

In T: add `function linesOf(args: string[], deps: object)` that runs main(args, { ...deps, out: (l: string) => lines.push(l) }) and resolves { code, lines }. `const noProvider = () => { const env = { ...process.env }; delete env.JEV_PROVIDER; return env; };` Then describe('score-suggested-order gates and arms in main') with its, each comparing against base = (await linesOf([], { census: censusOf(6), timing })).lines:
 1. deemDir = makeBin('cli-deem', `echo '{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"a","source_commit":"b"}'`); linesOf(['--deem', '--out', tmp], { census: censusOf(6), timing, env: { ...noProvider(), PATH: `${deemDir}:${process.env.PATH}` } }) gives code 0 and lines equal to [...base, 'deem arm skipped: stub backend']; cli-deem.log lines are ['health'].
 2. jevDir = makeBin('jev', 'case "$1" in --version) echo "jev 0.6.2";; auth) exit 3;; esac'); the same with ['--jev', '--out', tmp] and jevDir first on PATH gives code 0 and lines equal to [...base, `jev: path=${join(jevDir, 'jev')} provider=official`, 'jev arm skipped: no credential']; jev.log lines are ['--version', 'auth status --provider official'].
 3. censusOf(4) with ['--jev', '--deem', '--out', tmp] and both of those stub dirs first on PATH: code 0, a 'no headroom (movable)' line, no line starting 'jev' or 'deem', and neither log file exists.
 4. Both gates pass: jevDir2 = nodeBin('jev', JEV_STUB) and deemDir2 = nodeBin('cli-deem', DEEM_STUB) first on PATH, linesOf(['--jev', '--deem', '--out', tmp], { census: censusOf(6), timing, env: { ...noProvider(), PATH }, childFile: stubChild(), backoffMs: 10 }): code 0; the lines hold `jev: path=${join(jevDir2, 'jev')} provider=official`; the first line starting 'verdict jev:' comes before the line starting 'deem: health backend=torch', which comes before the first line starting 'verdict deem:'. Timeout 120_000.

VERIFY (repo root): node --check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs
  grep -c "jevGate({ out, env, timeoutMs: GATE_TIMEOUT_MS })\|deemGate({ out, env })" .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs
Accept when: the same 2 files changed and nothing else; node --check exits 0; grep prints 2.

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
