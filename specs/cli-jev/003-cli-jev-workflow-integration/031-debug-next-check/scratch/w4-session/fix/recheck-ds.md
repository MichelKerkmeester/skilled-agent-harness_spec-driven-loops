GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are a read-only reviewer (DeepSeek). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

TASK: read-only recheck of one doc fix made after your review. Edit nothing, create nothing, run no git command that writes.
Your review's P2, which the orchestrator session raised to P1: the seam search's docs did not say which paths it leaves out, and the playbook said the census's own script and test "appear as hits once they are tracked". A later code fix, `SEAM_SELF` in `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` (read it: `SEAM_FIXTURES`, `SEAM_SELF`, `seamSearch`), leaves out every path whose name holds `debug-next-check`.
The fix `f1`, by Pi MiMo, changed one sentence in each of:
- `.skilled/skills/system-spec-kit/changelog/v4.6.0.0.md` (the bullet "The census reports what a debug corpus holds today.")
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/debug-next-check.md` (the paragraph "Every run first lists tracked files outside `specs/`")
- `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/debug-next-check.md` (item 2 "When a `seam: <path>` line prints")
Check each sentence against the code, and grep the three files and `.skilled/skills/system-spec-kit/runtime/scripts/README.md` for any other seam sentence the fix left false. Run `node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` from the repo root and paste its first line. Report one line `closed|open - evidence` for the finding, then any new P0 or P1 in the three files. End with exactly one line `VERDICT: PASS` (closed, nothing new at P0 or P1) or `VERDICT: FAIL`.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check
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
