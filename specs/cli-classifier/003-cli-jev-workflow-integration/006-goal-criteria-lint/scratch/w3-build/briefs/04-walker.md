GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint

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

TASK: add the goal-file walker and the file, workspace and packet runners to the goal-criteria lint, and pin them with two tests.
G = .skilled/skills/sk-doc/sk-create-goal/scripts. Edit only G/lint-goal-criteria.cjs and G/tests/lint-goal-criteria.test.cjs. Read both first, and G/check-goal.cjs:440-464 (the walker this one extends).

EDIT 1, G/lint-goal-criteria.cjs section 3 HELPERS, after hasNamedArtifact: `toPosixRelative(root, absolutePath)` returns path.relative(root, absolutePath).split(path.sep).join('/').

EDIT 2, section 4 CORE LOGIC, after lintCriterion, five functions, each with a JSDoc block. None prints, spawns a process or writes a file.
- `walkGoalFiles(specsDir)` returns { goalFiles, scratchExcluded, errors }. Recursive visit like check-goal.cjs:440-464: a readdirSync failure pushes { path: directory, message } to errors and returns; a directory named ARCHIVE_DIR is never entered; a file named GOAL_FILE whose path.relative(specsDir, file).split(path.sep) includes SCRATCH_DIR adds 1 to scratchExcluded, any other GOAL_FILE is pushed to goalFiles. goalFiles is sorted. Comment the why: scratch trees hold fixture goals that are not authored criteria, so they are counted apart.
- `lintGoalFile(goalPath, root)`: rel = toPosixRelative(root, goalPath). A readFileSync failure returns { path: rel, criteria: 0, noInput: false, error: message, records: [] }. Otherwise { criteria, error } = readGoalCriteria(content) and records = criteria.map((c) => ({ id: rel + ':' + c.line, text_sha12: c.text_sha12, ...lintCriterion(c.text) })). Return { path: rel, criteria: criteria.length, noInput: error === null && criteria.length === 0, error, records }.
- `buildLintResult(fileResults, scratchExcluded, errors)`: records = fileResults.flatMap((f) => f.records); scored = records whose class is 'scored'. errors = [...errors, ...fileResults with error !== null mapped to { path: f.path, message: f.error }]. Return { summary, files, records, errors } where files = fileResults mapped to { path, criteria, noInput, error } and summary is, in this key order: goals_scanned (fileResults.length), scratch_excluded, criteria (records.length), scored, rule4_violations (scored with rule4.length > 0), rule5_violations, both_violations, placeholder, lexical_unscored (counts of records with that class), no_input (files with noInput), errors (errors.length).
- `lintWorkspace(root)`: specsDir = path.join(root, 'specs'). When it is not an existing directory, return buildLintResult([], 0, [{ path: 'specs', message: 'specs directory not found' }]). Otherwise walk it, lint each goal file and return buildLintResult(files, walk.scratchExcluded, walk.errors mapped to { path: toPosixRelative(root, e.path), message: e.message }).
- `lintPacket(packetArg, root)`: target = path.resolve(root, packetArg); goalPath = path.basename(target) === GOAL_FILE ? target : path.join(target, GOAL_FILE). When goalPath is not an existing file, return buildLintResult([], 0, [{ path: toPosixRelative(root, target), message: 'packet not found' }]). Otherwise return buildLintResult([lintGoalFile(goalPath, root)], 0, []).
Add walkGoalFiles, lintGoalFile, lintWorkspace and lintPacket to the exports.

EDIT 3, G/tests/lint-goal-criteria.test.cjs: import walkGoalFiles and lintWorkspace too. Add a helper that writes a file under a fresh fs.mkdtempSync(path.join(os.tmpdir(), 'lint-goal-walk-')) root (mkdir -p its folder), remove each root at the end of its test, and let GOOD = ['---', 'title: x', '---', '# Goal', '', '<!-- ANCHOR:completion -->', '## 3. COMPLETION CRITERIA', '', '- [ ] The report exists', '- [ ] `npm test` exits 0', '- [ ] Every REQ-001 row holds', '<!-- /ANCHOR:completion -->', ''].join('\n'). Append two tests:
  1. 'a goal with no criteria yields no records and counts as no_input': root holds only specs/p/goal.md = '---\ntitle: x\n---\n# Goal\n\nNo criteria here.\n'. r = lintWorkspace(root): r.summary.goals_scanned 1, r.summary.no_input 1, r.records deepEquals [], r.files deepEquals [{ path: 'specs/p/goal.md', criteria: 0, noInput: true, error: null }].
  2. 'the walker excludes scratch paths and z_archive': GOOD written to specs/a/goal.md, specs/a/scratch/b/goal.md, specs/scratch/c/goal.md and specs/z_archive/d/goal.md. walkGoalFiles(root + '/specs') gives goalFiles deepEqual [path.join(root, 'specs/a/goal.md')], scratchExcluded 2, errors []. lintWorkspace(root).summary deepEquals { goals_scanned: 1, scratch_excluded: 2, criteria: 3, scored: 3, rule4_violations: 2, rule5_violations: 1, both_violations: 1, placeholder: 0, lexical_unscored: 0, no_input: 0, errors: 0 }, and its records[0].id is 'specs/a/goal.md:9'.

VERIFY (repo root):
  node --check .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs
  node -e "const m=require('./.skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs');console.log(JSON.stringify(m.lintPacket('specs/no-such-packet',process.cwd()).errors))"
Accept when: 2 files changed and nothing else; node --check exits 0; the node -e line prints [{"path":"specs/no-such-packet","message":"packet not found"}].

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint
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
