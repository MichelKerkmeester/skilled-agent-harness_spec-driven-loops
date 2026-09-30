GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are @markdown, a leaf documentation editor dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

TASK: add the scorer's navigation row and the new release row to the hub README.
File F = .skilled/skills/cli-classifier/README.md. Read F first.

STEP 1. F:73 currently reads exactly:
| [`leaf-manifest.json`](./leaf-manifest.json) | The generated inventory of routed leaves | Find the references a mode loads |
Insert this new line directly after it:
| [`benchmark/injection-screen/`](./benchmark/injection-screen/) | The offline injection screen scorer and its tests | Its default run makes zero model calls. `--jev` and `--deem` each add one backend behind that backend's own gate |
STEP 2. The CHANGELOG table's first data row currently reads exactly (it follows the `| Release | Entry |` header and its `|---|---|` line):
| v1.1.0.0 | [`changelog/v1.1.0.0.md`](./changelog/v1.1.0.0.md) |
Insert this new line directly before it, so the newest release is listed first:
| v1.2.0.0 | [`changelog/v1.2.0.0.md`](./changelog/v1.2.0.0.md) |
Keep the frontmatter, including `version: 1.1.0.0`, byte-identical. Change nothing else in F. Edit no other file.

VERIFY (repo root), paste each result line:
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/cli-classifier/README.md --type readme   (expect "Total issues: 0"; the v1.2.0.0 link target is created by a sibling brief, so a broken-link note for it alone is expected if it appears)
  grep -c "benchmark/injection-screen/\|changelog/v1.2.0.0.md" .skilled/skills/cli-classifier/README.md   (expect 2)
Accept when: 1 file changed (F) with exactly 2 lines added and none removed; the grep prints 2.

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
