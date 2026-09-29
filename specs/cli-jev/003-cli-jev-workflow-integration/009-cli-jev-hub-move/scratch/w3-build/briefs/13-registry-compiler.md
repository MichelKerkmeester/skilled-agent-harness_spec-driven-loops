GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move

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

TASK: the same literal edits in two byte-identical files (runtime copy and authored twin):
  R=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/lib/registry-compiler.cjs
  T=specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/lib/registry-compiler.cjs
Context: the harness now keys its source bytes by `cli-classifier/...` ids. This compiler checks the
parsed sources against those bytes by id, so its ids must use the same prefix or the build fails.
1. Line 2. Old: `// ║ LIBRARY: CLI JEV REGISTRY COMPILER                  ║`
   New: `// ║ LIBRARY: CLI CLASSIFIER REGISTRY COMPILER           ║` (same 58-char width)
2. Line 80. Old: `  const registryId = 'cli-jev/mode-registry.json';`
   New: `  const registryId = 'cli-classifier/mode-registry.json';`
3. Line 81. Old: `  const routerId = 'cli-jev/hub-router.json';`
   New: `  const routerId = 'cli-classifier/hub-router.json';`
4. Line 82. Old: `  const skillId = 'cli-jev/SKILL.md';`
   New: `  const skillId = 'cli-classifier/SKILL.md';`
5. Line 95. Old: ``    const packetId = `cli-jev/${mode.packet}/SKILL.md`;``
   New: ``    const packetId = `cli-classifier/${mode.packet}/SKILL.md`;``
Change nothing else. Checks (report result line and exit code):
  node --check $R ; node --check $T   (expect exit 0 each)
  cmp $R $T   (expect exit 0)
  grep -c "cli-jev" $R   (expect 0)
  grep -c "cli-classifier" $R   (expect 4)
Accept when: 2 files changed, each +5/-5 lines, byte-identical to each other. No other file differs.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move
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
