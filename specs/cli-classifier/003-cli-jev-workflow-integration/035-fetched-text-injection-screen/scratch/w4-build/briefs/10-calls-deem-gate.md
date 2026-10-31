GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen

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

TASK: add the call helpers (R section 9) and the Deem gate (first bullet of R section 10) to S, a stubEnv helper to T, and two tests.
R = specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/scratch/w4-build/briefs/ref/design.md (read only).
N = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs (read only, never edit). S and T exist; read both
first. Read R sections 1, 2, 9 and 10 only. In N read only: `which` (line 1054), `deemCommand` (1076), `readDeemHealth` (1090),
`deemGate` (1154), `spawnCall` (1190), `createCallLog` (1236) and `readStoredReport` (1769), each with the JSDoc above it.

STEP 1. In S section 9 (CALLS), under its divider, copy verbatim from N, JSDoc included: which (keep it private), spawnCall,
createCallLog, readStoredReport. In S section 10 (DEEM ARM), under its divider, add the comment line
`// The gate reads the local model's health once, passes no key and starts no server, so a skipped arm writes no file.`,
then copy verbatim from N, JSDoc included: deemCommand, readDeemHealth, deemGate. They must use S's own REPO_CLI_DEEM,
DEEM_MODEL and HEALTH_TIMEOUT_MS constants, which already exist. Change nothing else in S.
STEP 2. In T, after stubLog, add a private helper:
 stubEnv(bin, extra = {}): ({ ...cleanEnv(), PATH: `${bin}${path.delimiter}${process.env.PATH}`, ...extra }).
STEP 3. Append two tests to the end of T:
 a. 'deem gate passes a torch health and prints the commit pair':
    bin = makeStubs(); lines = [];
    gate = S.deemGate({ out: (line) => lines.push(line), env: stubEnv(bin) });
    assert.equal(gate.passed, true); assert.equal(gate.modelCommit, 'aaa'); assert.equal(gate.sourceCommit, 'bbb');
    assert.deepEqual(lines, ['deem: health backend=torch model=deem-0.8-v1 model_commit=aaa source_commit=bbb']);
    assert.deepEqual(stubLog(bin, 'cli-deem'), [['health']]);
 b. 'deem gate skips a stub backend':
    bin = makeStubs(); lines = [];
    gate = S.deemGate({ out: (line) => lines.push(line), env: stubEnv(bin, { STUB_DEEM_BACKEND: 'stub' }) });
    assert.equal(gate.passed, false); assert.equal(gate.reason, 'deem arm skipped: stub backend');
    assert.deepEqual(lines, ['deem arm skipped: stub backend']);

VERIFY (repo root), paste each result line:
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs
  grep -c "^test('" .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs   (expect 28)
  grep -cE 'API_KEY|TYPESAFE|Bearer|Authorization' .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs   (expect 0)
Accept when: 2 files changed (S and T) and nothing else; both node --check exit 0; T holds 28 tests; the key grep prints 0.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen
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
