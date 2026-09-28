GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are @markdown, a leaf documentation editor dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

TASK: create one new feature catalog entry (sk-create-feature-catalog leaf shape) so it is byte-identical to literal text the orchestrator already wrote to sk-doc's rules for that doc type.
Source (read only, do not edit): specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/scratch/w3-build/content/catalog-goal-criteria-lint.md
Target (create): .skilled/skills/sk-doc/feature-catalog/document-validation/goal-criteria-lint.md

Step: make the target byte-identical to the source, for example with
  cp specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/scratch/w3-build/content/catalog-goal-criteria-lint.md .skilled/skills/sk-doc/feature-catalog/document-validation/goal-criteria-lint.md
Do not reword, reflow or reformat anything. Do not run any command the document lists. Change no other file.

VERIFY (repo root):
  cmp specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/scratch/w3-build/content/catalog-goal-criteria-lint.md .skilled/skills/sk-doc/feature-catalog/document-validation/goal-criteria-lint.md
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/feature-catalog/document-validation/goal-criteria-lint.md
Accept when: 1 file created and nothing else; cmp prints nothing and exits 0; validate_document exits 0.

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
