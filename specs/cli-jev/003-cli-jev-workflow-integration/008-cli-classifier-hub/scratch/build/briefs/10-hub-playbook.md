GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are @markdown, a leaf documentation editor dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

TASK: create 4 new files, the cli-classifier hub manual testing playbook: the root and three hub-routing scenarios. Each target is a byte-identical copy of a payload the orchestrator already wrote to the sk-doc template. Copy it exactly: no reflow, no edits, no added or removed byte.
Why: The parent-hub check requires a hub playbook, and the playbook validator needs every scenario the root links.

Copy each payload to its target with `mkdir -p <target dir>` then `cp <payload> <target>`:
  specs/cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub/scratch/build/briefs/payloads/pb--manual-testing-playbook.md.payload
    -> .skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md   (123 lines)
  specs/cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub/scratch/build/briefs/payloads/pb--deem-request-routes-to-transport.md.payload
    -> .skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/deem-request-routes-to-transport.md   (81 lines)
  specs/cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub/scratch/build/briefs/payloads/pb--jev-request-stays-with-cli-jev.md.payload
    -> .skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/jev-request-stays-with-cli-jev.md   (77 lines)
  specs/cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub/scratch/build/briefs/payloads/pb--out-of-domain-resolves-nothing.md.payload
    -> .skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/out-of-domain-resolves-nothing.md   (77 lines)

Accept when: exactly these 4 new files exist, nothing else changed, and each target is byte-identical to its payload (the orchestrator checks with cmp).
VERIFY (paste each with its result line and exit code): `grep -c '' <target>` for every target; each must print the line count shown above.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub
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
