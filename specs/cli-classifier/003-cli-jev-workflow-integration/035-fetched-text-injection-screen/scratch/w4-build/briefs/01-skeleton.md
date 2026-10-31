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

TASK: create the scorer S with its skeleton, constants and git helpers, and create its test file T with the fixture helpers and one test.
R = specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/scratch/w4-build/briefs/ref/design.md (read only). S and T are named at its top. Read R sections 1, 2, 3 and T now; later sections describe later briefs, so do not build them.

STEP 1. Create S (new file) exactly per R sections 1 to 3:
 a. Shebang, header comment, all 13 section dividers in order. Sections 4 to 12 hold only their divider for now.
 b. Section 1 imports and section 2 constants, every constant R section 2 lists, with the comment line R section 2 gives.
 c. Section 3 exports with JSDoc: git, trackedFiles, headCommit, readAtCommit, sha256, sha12, compareCodeUnits.
 d. Section 13 holds a placeholder `export async function main(argv, deps = {})` that returns 0 (a later brief fills it; keep the JSDoc short), then the two entry lines of R section 1.

STEP 2. Create T (new file) per R section T, with these private helpers and exactly one test:
 - cleanEnv(): a copy of process.env without GIT_DIR, GIT_WORK_TREE, GIT_COMMON_DIR, GIT_INDEX_FILE, GIT_OBJECT_DIRECTORY,
   GIT_ALTERNATE_OBJECT_DIRECTORIES, GIT_NAMESPACE, GIT_CEILING_DIRECTORIES, JEV_PROVIDER and CLI_DEEM_URL.
 - tempDir(prefix): fs.mkdtempSync(path.join(os.tmpdir(), `injscreen-${prefix}-`)).
 - makeRepo(files): files is an object of repo-relative path to text. root = tempDir('repo'); write each file (mkdir -p its parent);
   then run git through execFileSync('git', ['-C', root, '-c', 'user.email=fixture@example.com', '-c', 'user.name=fixture',
   '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', ...args], { env: cleanEnv(), stdio: 'pipe' }) for
   ['init', '-q'], ['add', '-A'], ['commit', '-q', '-m', 'fixture']. Returns root.
 - test 'trackedFiles lists committed paths and headCommit is a full hash':
   root = makeRepo({ 'a.md': '# A\n', "dir/it's.md": '# B\n' });
   assert.deepEqual(S.trackedFiles(root), ['a.md', "dir/it's.md"]);
   const head = S.headCommit(root); assert.match(head, /^[0-9a-f]{40}$/);
   assert.equal(S.readAtCommit(root, head, "dir/it's.md"), '# B\n');
   assert.equal(S.sha12('abc'), 'ba7816bf8f01');

VERIFY (repo root), paste each result line:
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs
  node .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs; echo "exit=$?"   (expect no output and exit=0)
  grep -cE 'API_KEY|TYPESAFE|Bearer|Authorization' .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs   (expect 0)
Accept when: 2 files created (S and T) and nothing else changed; both node --check exit 0; the plain run prints nothing and exits 0.

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
