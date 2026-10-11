GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/039-deprecate-improvement-modes/003-agent-mirror-checker-relocation
It lives in the main checkout; you do not write to it. You write only in the current directory, which is a git worktree.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

ROLE: You move one script and its support files to a new folder and repoint every caller. Nothing else.

RUN CONTEXT
- Working directory: the git worktree you were started in. Every path below is relative to it.
- `.opencode/skills`, `.opencode/bin` and `.opencode/hooks` are symlinks to `.skilled/skills`, `.skilled/bin` and `.skilled/hooks`.

STEP 1. Move five files with `git mv` (create target folders first):
  .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs -> .skilled/bin/check-agent-mirror-sync.cjs
  .skilled/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs -> .skilled/bin/lib/mirror-sync-verify.cjs
  .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-agent-mirror-sync.vitest.ts -> .skilled/bin/check-agent-mirror-sync.vitest.ts
  .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/mirror-sync-verify.vitest.ts -> .skilled/bin/mirror-sync-verify.vitest.ts
  .skilled/skills/system-deep-loop/deep-improvement/references/shared/agent-mirror-crosswalk.md -> .skilled/bin/agent-mirror-crosswalk.md

STEP 2. Fix the moved code so it works from its new depth.
  a) .skilled/bin/check-agent-mirror-sync.cjs: `REPO_ROOT` is `path.resolve(__dirname, '..', '..', '..', '..', '..')`. It is now two levels below the root: use `path.resolve(__dirname, '..', '..')` and correct the comment above it.
  b) .skilled/bin/lib/mirror-sync-verify.cjs: replace `require('@spec-kit/shared/frontmatter/parse-frontmatter.js')` with a require of `path.join(__dirname, '..', '..', 'skills', 'system-spec-kit', 'shared', 'dist', 'frontmatter', 'parse-frontmatter.js')`. The package link it used lives only in the deep-loop hub's node_modules and is not reachable from .skilled/bin.
  c) Both moved .vitest.ts files: fix `WORKSPACE_ROOT`, `SCRIPTS_DIR` and any relative import so they point at `.skilled/bin`. In check-agent-mirror-sync.vitest.ts the fixture copies the checker and lib into a temp dir at the same relative depth: keep that, use `SCRIPTS_DIR = '.skilled/bin'`, and replace the `node_modules/@spec-kit/shared` symlink with a symlink of `<WORKSPACE_ROOT>/.skilled/skills/system-spec-kit/shared` to `<tmpDir>/.skilled/skills/system-spec-kit/shared`, so the copied lib's new relative require resolves.

STEP 3. Repoint callers. Replace the old path with the new one, nothing else on the line:
  old path tail: skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs
  new path tail: bin/check-agent-mirror-sync.cjs
  Files and lines:
  - .skilled/hooks/git/pre-commit:82
  - .skilled/scripts/git-hooks/pre-commit:165
  - .skilled/scripts/git-hooks/tests/pre-commit.test.sh:360,361,539,540,610,611 (the `mkdir -p` lines become `mkdir -p "$TMP/.opencode/bin"`, keeping any other dir on line 610)
  - .skilled/hooks/git/README.md:138 (link text and target; the target is relative: `../../bin/check-agent-mirror-sync.cjs`)
  - .skilled/CROSS-CLI.md:89
  - .claude/SYNC.md:57,100
  - .github/workflows/agent-mirror-sync.yml:17
  - .github/scripts/tests/broken-move-drill.sh:133,134
  - .skilled/skills/sk-code/sk-code-opencode/assets/checklists/agent-authoring.md:37,65,73
  - .skilled/bin/agent-mirror-crosswalk.md:52
  Crosswalk links: in .skilled/agents/README.txt:11 and .claude/agents/README.txt:11 replace
    .skilled/skills/system-deep-loop/deep-improvement/references/shared/agent-mirror-crosswalk.md
  with
    .skilled/bin/agent-mirror-crosswalk.md

STEP 4. In .skilled/bin/README.md add one row or line for `check-agent-mirror-sync.cjs` next to the other checkers, in the same format as its neighbours, saying it blocks agent edits that desync the runtime mirrors and is run by both pre-commit hooks and the agent-mirror-sync CI workflow.

DON'T
- Do not edit, move or delete any other file.
- BANNED OPERATIONS: git commit, git push, git checkout, git reset, git stash, git rebase, git branch, rm -rf, npm install, editing anything under specs/.
- ALLOWED WRITE PATHS: the five targets in STEP 1, the files named in STEPS 2 to 4, and nothing else.
- Do not put spec paths, phase numbers or ticket ids in code comments.

VERIFY (run these; report each exit status)
  node .skilled/bin/check-agent-mirror-sync.cjs --all
  (cd .skilled && npx vitest run --config vitest.config.bin.ts bin/check-agent-mirror-sync.vitest.ts bin/mirror-sync-verify.vitest.ts)
  bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh
  rg -n "deep-improvement/scripts/check-agent-mirror-sync|references/shared/agent-mirror-crosswalk" --hidden -g '!specs/**' -g '!**/changelog/**' -g '!**/benchmark/reports/**' .

HANDBACK: list every file you changed or moved, then each VERIFY command with its exit status and the last lines of any failure. The final rg should print nothing outside the deep-improvement packet itself.
