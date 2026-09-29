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

TASK: add runJevArm to S (second bullet of R section 11) and two tests to T.
R = specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/scratch/w4-build/briefs/ref/design.md (read only).
N = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs (read only, never edit). S and T exist; read both
first. Read R sections 8, 10 and 11 only, and in N only `runJevArm` (search `export async function runJevArm`) as the pattern.

STEP 1. In S section 11, after jevGate, add exported async runJevArm(plan, gate, ctx) with JSDoc, exactly per R section 11:
one `jev auth test --provider P` first, then JEV_RERUNS fresh `jev noul --provider P` calls per row with no answer cache, N's
Jev exit handling, and a missing or malformed answer `unmeasured` with probability null, never 0. Change nothing else in S.
STEP 2. Append two tests to the end of T. In each: root = makeRepo(corpusFiles()); bin = makeStubs(); plan = await armPlan(root);
lines = []; out = (line) => lines.push(line); outDir = tempDir('jev-out'); env = stubEnv(bin, <extra>);
gate = S.jevGate({ out, env, timeoutMs: 20000 }); ctx = { out, env, timeoutMs: 20000, backoffMs: 1,
callLog: S.createCallLog(outDir), stored: null }; result = await S.runJevArm(plan, gate, ctx).
 a. 'jev arm sends one --provider on every call and prints a keep verdict' (extra { JEV_PROVIDER: 'openrouter' }):
    assert.equal(lines.at(-1), 'verdict jev: keep K=90 M=90 A=90 B=60 W=30 L=0 TP=30 FP=0 F=0 p=9.313e-10 jev_version=0.6.2 provider=openrouter model=stub-model');
    assert.match(lines.find((l) => l.startsWith('jev: payload:')), /planned calls: 271;/);
    log = stubLog(bin, 'jev').filter((a) => a[0] !== '--version');
    assert.equal(log.filter((a) => a[0] === 'noul').length, 270);
    for (const a of log) { assert.equal(a.filter((x) => x === '--provider').length, 1);
      assert.equal(a[a.indexOf('--provider') + 1], 'openrouter'); }
    calls = fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
    assert.equal(calls.length, 271);
    assert.ok(calls.every((c) => typeof c.wallMs === 'number' && 'exitCode' in c && c.provider === 'openrouter' && c.model === 'stub-model'));
 b. 'jev exit 3 after the gate stops the arm as key rejected' (extra { STUB_NOUL_EXIT: '3' }):
    assert.deepEqual(result, { stopped: 'jev arm stopped: key rejected', partialRows: 0 });
    assert.deepEqual(lines.slice(-2), ['jev arm stopped: key rejected', 'jev: partial rows=0']);

VERIFY (repo root), paste each result line:
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs
  grep -c "^test('" .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs   (expect 36)
Accept when: 2 files changed (S and T) and nothing else; both node --check exit 0; T holds 36 tests.

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
