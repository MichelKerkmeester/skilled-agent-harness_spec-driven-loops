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

TASK: one behavior change in `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` plus its test file
`.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs`.
Context: the Jev transport is now mode `cli-jev` of the `cli-classifier` hub, over the packet folder
`cli-usage` at `.skilled/skills/cli-classifier/cli-usage/`. The folder `.skilled/skills/cli-jev/` is
gone, so a dispatch row pointing there resolves a SKILL.md that does not exist and the eight Jev rules
fail open. A `jev` dispatch must now report skill `cli-classifier` with packet path `cli-classifier/cli-usage`.
Edits in dispatch-audit.mjs:
1. Line 46. Old: `skill: 'cli-jev', packetPath: 'cli-jev/cli-usage' },`
   New: `skill: 'cli-classifier', packetPath: 'cli-classifier/cli-usage' },` (rest of the line unchanged)
2. Line 234. Old: `    if (binary === 'jev-mcp') return 'cli-jev';`
   New: `    if (binary === 'jev-mcp') return 'cli-classifier';`
3. Line 237. Old: `      ? 'cli-jev'`  New: `      ? 'cli-classifier'`
Edits in dispatch-audit.test.mjs:
4. Line 123. Old: `      'cli-jev',`  New: `      'cli-classifier',`
5. Lines 125-126. Old (2 lines):
    // The Jev transport moved to a hub of its own; its row has to name the new packet, or
    // the preflight reads a path that is not there and the eight rules fail open.
   New (2 lines):
    // The Jev transport is a mode of the classifier hub; its row has to name that packet, or
    // the preflight reads a path that is not there and the eight rules fail open.
6. Line 128. Old: `shape.skill === 'cli-jev').packetPath).toBe('cli-jev/cli-usage');`
   New: `shape.skill === 'cli-classifier').packetPath).toBe('cli-classifier/cli-usage');`
7. Lines 159, 160, 161, 162: each ends `.toBe('cli-jev');`. Change each to `.toBe('cli-classifier');`.
Change nothing else.
Checks (report result line and exit code):
  node --check .skilled/hooks/dispatch/lib/dispatch-audit.mjs   (expect exit 0)
  node --check .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs   (expect exit 0)
  grep -c "cli-jev" .skilled/hooks/dispatch/lib/dispatch-audit.mjs   (expect 0)
  grep -c "cli-jev" .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs   (expect 0)
Do not run vitest; the orchestrator runs the suite.
Accept when: 2 files changed, dispatch-audit.mjs +3/-3, dispatch-audit.test.mjs +8/-8. No other file differs.

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
