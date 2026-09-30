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

TASK: add buildReport to S (R section 12), wire both arms into main (R section 13 steps 5 to 7), and add four tests to T.
R = specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/scratch/w4-build/briefs/ref/design.md (read only).
S and T exist; read both first. Read R sections 10, 11, 12 and 13 only.

STEP 1. In S section 12 (REPORT), under its divider, add exported buildReport with JSDoc exactly per R section 12
(instructionSha256 is sha256(INSTRUCTION), lexicalSha256 is sha256(LEXICAL_PATTERNS.join('\n'))).
STEP 2. In S main, replace the final `return 0` with steps 5, 6 and 7 of R section 13 exactly, Jev first, then Deem, then
`return 0`. Change nothing else in S.
STEP 3. Append four tests to the end of T. Shared setup where named: root = makeRepo(corpusFiles()); bin = makeStubs();
none = tempDir('none'); noLabels = ['--labels', path.join(none, 'labels.jsonl'), '--planted', path.join(none, 'planted.jsonl')];
base = await runMain(noLabels, { root, bin }); outDir = path.join(tempDir('out'), 'run').
 a. '--deem with a stub backend adds one skip line and writes nothing':
    r = await runMain(['--deem', '--out', outDir, ...noLabels], { root, bin, env: { STUB_DEEM_BACKEND: 'stub' } });
    assert.equal(r.code, 0); assert.deepEqual(r.lines, [...base.lines, 'deem arm skipped: stub backend']);
    assert.equal(fs.existsSync(outDir), false);
 b. '--jev with no credential adds the identity line and one skip line':
    r = await runMain(['--jev', '--out', outDir, ...noLabels], { root, bin, env: { STUB_AUTH_STATUS_EXIT: '3' } });
    assert.equal(r.code, 0); assert.deepEqual(r.lines, [...base.lines, `jev: path=${path.join(bin, 'jev')} provider=official`,
      'jev arm skipped: no credential']); assert.equal(fs.existsSync(outDir), false);
 c. 'a passing gate before the labels exist calls no model':
    r = await runMain(['--deem', '--out', outDir, ...noLabels], { root, bin });
    assert.deepEqual(r.lines.slice(-2), ['deem: health backend=torch model=deem-0.8-v1 model_commit=aaa source_commit=bbb',
      'deem arm skipped: fewer than 90 labeled rows']); assert.deepEqual(stubLog(bin, 'cli-deem'), [['health']]);
    assert.equal(fs.existsSync(outDir), false);
 d. 'both switches on the labeled fixture print a verdict per backend, jev first, and record every call':
    root = makeRepo(corpusFiles()); bin = makeStubs(); f = await labeledFixture(root); outDir = path.join(tempDir('out'), 'run');
    r = await runMain(['--deem', '--jev', '--out', outDir, '--labels', f.labels, '--planted', f.planted], { root, bin });
    assert.equal(r.code, 0); verdicts = r.lines.filter((l) => l.startsWith('verdict '));
    assert.equal(verdicts.length, 2); assert.match(verdicts[0], /^verdict jev: keep /); assert.match(verdicts[1], /^verdict deem: keep /);
    report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
    assert.equal(report.columns.jev.verdict, 'keep'); assert.equal(report.columns.deem.modelCommit, 'aaa'); assert.equal(report.K, 90);
    calls = fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
    assert.equal(calls.length, 361); assert.ok(calls.every((c) => typeof c.wallMs === 'number' && 'exitCode' in c));

VERIFY (repo root), paste each result line:
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs
  grep -c "^test('" .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs   (expect 40)
Accept when: 2 files changed (S and T) and nothing else; both node --check exit 0; T holds 40 tests.

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
