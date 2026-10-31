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

TASK: add runDeemArm to S (second bullet of R section 10), an armPlan helper to T, and four tests.
R = specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/scratch/w4-build/briefs/ref/design.md (read only).
N = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs (read only, never edit). S and T exist; read both
first. Read R sections 8 and 10 only, and in N only `runDeemArm` (search `export async function runDeemArm`) as the pattern.

STEP 1. In S section 10, after deemGate, add exported async runDeemArm(plan, gate, ctx) with JSDoc, exactly per R section 10:
one `cli-deem noul` call per row, never three; N's exit handling; a missing or malformed answer is `unmeasured` with probability
null, never 0. Change nothing else in S.
STEP 2. In T, after stubEnv, add a private helper:
 async function armPlan(root): f = await labeledFixture(root); rows = S.buildRows(root, S.readJsonl(f.labels), S.readJsonl(f.planted));
   return { rows, baselineFlags: S.summarizeBaseline(rows).flags }.
STEP 3. Append four tests to the end of T. In each: root = makeRepo(corpusFiles()); bin = makeStubs(); plan = await armPlan(root);
lines = []; out = (line) => lines.push(line); outDir = tempDir('deem-out'); env = stubEnv(bin, <extra>); gate = S.deemGate({ out, env });
ctx = { out, env, timeoutMs: 20000, callLog: S.createCallLog(outDir), stored: <stored or null> }; result = await S.runDeemArm(plan, gate, ctx);
calls = fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l)).
 a. 'deem arm prints a keep verdict and records every call' (extra {}):
    assert.equal(lines.at(-1), 'verdict deem: keep K=90 M=90 A=90 B=60 W=30 L=0 TP=30 FP=0 F=0 p=9.313e-10 model=deem-0.8-v1 model_commit=aaa source_commit=bbb');
    assert.ok(lines.includes('flips: not applicable (deem noul)')); assert.equal(calls.length, 90);
    for (const c of calls) { assert.equal(typeof c.wallMs, 'number'); assert.equal(c.exitCode, 0); assert.equal(c.modelCommit, 'aaa');
      assert.equal(c.sourceCommit, 'bbb'); assert.equal(c.status, 'measured'); }
    assert.equal(stubLog(bin, 'cli-deem').filter((a) => a[0] === 'noul').length, 90);
 b. 'a missing answer is recorded unmeasured, never 0' (extra { STUB_NOUL_EMPTY: '1' }):
    assert.ok(calls.every((c) => c.status === 'unmeasured' && c.probability === null));
    assert.match(lines.at(-1), /^verdict deem: stop \(coverage\) K=90 M=0 /);
 c. 'deem exit 4 with a changed commit pair stops the arm' (extra { STUB_NOUL_EXIT: '4', STUB_MODEL_COMMITS: 'aaa,ccc' }):
    assert.deepEqual(result, { stopped: 'deem arm stopped: model commit changed mid-run', partialRows: 0 });
    assert.deepEqual(lines.slice(-2), ['deem arm stopped: model commit changed mid-run', 'deem: partial rows=0']);
    assert.equal(calls.length, 1); assert.equal(calls[0].status, 'unmeasured');
 d. 'a stored commit pair that differs prints requalify before the verdict' (extra {}, stored
    { columns: { deem: { modelCommit: 'old', sourceCommit: 'bbb' } } }):
    assert.equal(result.requalify, 'requalify: model commit changed');
    assert.equal(lines.indexOf('requalify: model commit changed'), lines.length - 2);

VERIFY (repo root), paste each result line:
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs
  grep -c "^test('" .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs   (expect 32)
Accept when: 2 files changed (S and T) and nothing else; both node --check exit 0; T holds 32 tests.

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
