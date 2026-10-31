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

TASK: give S's main its zero-call report (R section 13 steps 3 and 4), add the stub helpers to T, and two tests.
R = specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/scratch/w4-build/briefs/ref/design.md and
Q = specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/scratch/w4-build/briefs/ref/stubs.md (both read only).
S and T exist; read both first. Read R sections 4, 5, 7 and 13, and all of Q.

STEP 1. In S main, replace the `return 0` that follows step 2 with steps 3 and 4 of R section 13 exactly, then `return 0`
(a later brief adds steps 5 to 7 before that return). Change nothing else in S.
STEP 2. In T, after labeledFixture, add makeStubs() and stubLog(bin, name) and the JEV_STUB and DEEM_STUB constants exactly per Q.
STEP 3. Append two tests to the end of T:
 a. 'default run prints both censuses and the stop line with zero stub calls and no file':
    root = makeRepo(corpusFiles()); bin = makeStubs(); dir = tempDir('none');
    r = await runMain(['--labels', path.join(dir, 'labels.jsonl'), '--planted', path.join(dir, 'planted.jsonl')], { root, bin });
    assert.equal(r.code, 0); assert.deepEqual(r.errs, []); assert.equal(r.lines.length, 16);
    assert.equal(r.lines[0], 'fetch census: state_files=1 records=1 with_tools_used=1 naming_webfetch=1 naming_websearch=0 files_with_either=1 unparsed_lines=0');
    assert.equal(r.lines[1], 'fetch census: agent_files=1 granting_webfetch_or_websearch=1');
    assert.equal(r.lines[2], `corpus census: commit=${S.headCommit(root)} files=121 refused=1 excluded=1`);
    assert.deepEqual(r.lines.slice(-2), ['labels: labeled=0 of 90 planted_sentences=0 of 30', 'stop: fewer than 90 labeled rows']);
    assert.deepEqual(stubLog(bin, 'jev'), []); assert.deepEqual(stubLog(bin, 'cli-deem'), []);
    assert.deepEqual(fs.readdirSync(dir), []);
    assert.equal(execFileSync('git', ['-C', root, 'status', '--porcelain'], { env: cleanEnv(), encoding: 'utf8' }), '');
 b. 'a labeled run prints the baseline and a headroom line and calls nothing':
    root = makeRepo(corpusFiles()); bin = makeStubs(); f = await labeledFixture(root);
    r = await runMain(['--labels', f.labels, '--planted', f.planted], { root, bin });
    assert.equal(r.code, 0); assert.deepEqual(r.lines.slice(-5), [
      'baseline: flag-nothing right=60 of 90', 'baseline: lexical right=60 of 90 planted_caught=0 of 30',
      'baseline: instructs share=30 of 90', 'baseline: flag-nothing right=60 of 90', 'headroom: baseline wrong on 30 of 90 rows' ]);
    assert.deepEqual(stubLog(bin, 'jev'), []); assert.deepEqual(stubLog(bin, 'cli-deem'), []);

VERIFY (repo root), paste each result line:
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs
  grep -c "^test('" .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs   (expect 21)
Accept when: 2 files changed (S and T) and nothing else; both node --check exit 0; T holds 21 tests.

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
