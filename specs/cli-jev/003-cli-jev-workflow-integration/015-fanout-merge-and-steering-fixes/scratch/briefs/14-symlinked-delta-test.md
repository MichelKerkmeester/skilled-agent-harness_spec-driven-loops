GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes

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

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes
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

STEP 1: pin that a symlinked delta file fails the merge closed
Scope: 1 file, test only. S = .skilled/skills/system-deep-loop/runtime. Edit S/tests/unit/fanout-merge.vitest.ts (T) only.
Why: the merge reads `<lineage>/deltas/iter-N.jsonl` finding records when it rebuilds a short registry, and refuses a delta file that is a symlink
(exit 3, "lineage <label> delta source must be a real file: <path>"). No test covers that refusal yet.
a. In T, directly after the test titled 'rebuilds a short registry from delta finding records' (find it by title), add one test:
   it('fails closed on a symlinked delta file', async () => { ... })
   - `const baseDir = makeTempDir('fanout-merge-research-linked-delta-');` and `const outsideDir = makeTempDir('fanout-merge-research-delta-target-');`
   - `const lineageDir = join(baseDir, 'lineages', 'alpha');` with `mkdirSync(join(lineageDir, 'deltas'), { recursive: true });`
   - `findings-registry.json`: `{ keyFindings: [{ id: 'r1', title: 'registry finding' }] }` written as `${JSON.stringify(...)}\n`.
   - `deep-research-state.jsonl`: one line, `JSON.stringify({ type: 'iteration', run: 1, iteration: 1, findingsCount: 2 })` plus '\n'
     (count-only 2 is more than the registry's 1, so the merge rebuilds and reads the deltas).
   - `const targetPath = join(outsideDir, 'iter-001.jsonl');` written with
     `'{"type":"finding","label":"outside finding","iteration":1}\n{"type":"finding","label":"second outside finding","iteration":1}\n'`.
   - `symlinkSync(targetPath, join(lineageDir, 'deltas', 'iter-001.jsonl'));` (`symlinkSync` is already imported at T:3).
   - Run the CLI exactly as the neighbouring tests do.
   - Expect: `result.exitCode` 3; `result.stdout` contains 'delta source must be a real file'; `existsSync(join(baseDir, 'findings-registry.json'))` is false.
     (`existsSync` is already imported at T:3.)
   No code comment in the test names a spec path or id.
Accept when: 1 file changed; T holds exactly one new test; no import line changes.

VERIFY (run from the repo root; paste each command with its result line and exit code)
  grep -c "fails closed on a symlinked delta file" .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts   # 1
  grep -c "specs/cli-jev" .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts                           # 0 (grep exits 1)
  git diff --numstat -- .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs                                      # report the line; this brief must not change it

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
