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

TASK: give S's main its argument parsing, the --draw mode and the --out refusal (R section 13 opening paragraph and steps 1 and 2), add a runMain helper to T, and three tests.
R = specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/scratch/w4-build/briefs/ref/design.md (read only). S and T exist; read both first. Read R sections 1, 6 and 13 only.

STEP 1. In S section 13, replace the placeholder main with the real signature, JSDoc naming every dep, the deps defaults,
the parseArgs call, labelsPath and plantedPath, then steps 1 and 2 of R section 13 exactly. After step 2, return 0 for now
(a later brief adds steps 3 to 7 there). Keep the two entry lines last. Change nothing else in S.

STEP 2. In T, after corpusFiles, add a private helper:
 async function runMain(args, options = {}): lines = [], errs = []; code = await S.main(args, { repoRoot: options.root,
   contextDir: CONTEXT, out: (line) => lines.push(line), err: (line) => errs.push(line), env: { ...cleanEnv(),
   PATH: options.bin ? `${options.bin}${path.delimiter}${process.env.PATH}` : process.env.PATH, ...(options.env ?? {}) },
   timeoutMs: 20000, backoffMs: 1 }); return { code, lines, errs }.
STEP 3. Append three tests to the end of T:
 a. '--draw writes byte-identical files for one seed':
    root = makeRepo(corpusFiles()); a = tempDir('draw-a'); b = tempDir('draw-b');
    for (const dir of [a, b]) { r = await runMain(['--draw', '--seed', '7', '--labels', path.join(dir, 'labels.jsonl'),
      '--planted', path.join(dir, 'planted.jsonl')], { root }); assert.equal(r.code, 0); }
    for (const name of ['labels.jsonl', 'planted.jsonl']) assert.equal(fs.readFileSync(path.join(a, name), 'utf8'),
      fs.readFileSync(path.join(b, name), 'utf8'));
    assert.equal(fs.readFileSync(path.join(a, 'labels.jsonl'), 'utf8').trim().split('\n').length, 90);
    assert.equal(r.lines[0], `draw: seed=7 commit=${S.headCommit(root)} rows=90 natural=60 planted=30`);
 b. '--draw refuses to overwrite a file that holds a label':
    root = makeRepo(corpusFiles()); dir = tempDir('draw-c'); labels = path.join(dir, 'labels.jsonl');
    args = ['--draw', '--seed', '7', '--labels', labels, '--planted', path.join(dir, 'planted.jsonl')];
    assert.equal((await runMain(args, { root })).code, 0);
    rows = S.readJsonl(labels); rows[0] = { ...rows[0], label: 'clean', labeler: 'operator' }; S.writeJsonl(labels, rows);
    before = fs.readFileSync(labels, 'utf8'); r = await runMain(['--draw', '--seed', '8', '--labels', labels, '--planted',
      path.join(dir, 'planted.jsonl')], { root });
    assert.equal(r.code, 2); assert.match(r.errs.join('\n'), /draw refused/); assert.equal(fs.readFileSync(labels, 'utf8'), before);
 c. '--jev without --out exits 2 before any call':
    r = await runMain(['--jev'], { root: makeRepo(corpusFiles()) });
    assert.equal(r.code, 2); assert.deepEqual(r.lines, []);
    assert.deepEqual(r.errs, ['--jev and --deem need --out <dir> so every call is recorded']);

VERIFY (repo root), paste each result line:
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs
  grep -c "^test('" .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs   (expect 15)
Accept when: 2 files changed (S and T) and nothing else; both node --check exit 0; T holds 15 tests.

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
