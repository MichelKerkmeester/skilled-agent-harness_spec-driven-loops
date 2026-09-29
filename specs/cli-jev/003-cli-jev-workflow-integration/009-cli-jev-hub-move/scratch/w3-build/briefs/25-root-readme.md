GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are @markdown, a leaf documentation editor dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

TASK: four line edits in one file, the repository root `README.md`.
Context: the `cli-jev` hub is gone. Its Jev transport is now mode `cli-jev` of the `cli-classifier` hub
(over the packet folder `cli-usage`), beside mode `cli-deem`, a client for the Deem model served on
this machine. The two skill-list entries must name the hub that exists.
1. Line 825. Old (whole line): **`cli-jev`** - typed judgments from the Jev CLI
   New (whole line): **`cli-classifier`** - typed judgments from the Jev CLI or the local Deem model
2. Line 827. Old (whole line):
When a decision needs a number rather than prose, this hub asks the `jev` CLI for one: a probability, a choice between options, a score position or a batch of keyed answers. It returns the value and changes nothing else.
   New (whole line):
When a decision needs a number rather than prose, this hub asks a classifier for one: the hosted Jev service through the `jev` CLI (mode `cli-jev`) or the Deem model served on this machine (mode `cli-deem`). It returns a probability, a choice between options, a score position or a batch of keyed answers, and changes nothing else.
3. Line 1351. Old (whole line): **`cli-jev`** - ✅ codebase-agnostic
   New (whole line): **`cli-classifier`** - ✅ codebase-agnostic
4. Line 1353. Old (whole line):
- Parent hub for the Jev typed-judgment transport: routes to `cli-usage` for a probability, an option key, a score position or a batch of keyed answers from the `jev` CLI. Stack-independent. Needs the `jev` CLI on PATH
   New (whole line):
- Parent hub for typed-judgment transports: routes to `cli-jev` (the `jev` CLI, over the `cli-usage` packet) or `cli-deem` (the local Deem server) for a probability, an option key, a score position or a batch of keyed answers. Stack-independent. Mode `cli-jev` needs the `jev` CLI on PATH and mode `cli-deem` needs the local Deem server running
Change nothing else.
Checks (report result line and exit code):
  grep -c "^\*\*\`cli-jev\`\*\*" README.md   (expect 0)
  grep -c "^\*\*\`cli-classifier\`\*\*" README.md   (expect 2)
Accept when: 1 file changed, +4/-4 lines. No other file differs.

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
