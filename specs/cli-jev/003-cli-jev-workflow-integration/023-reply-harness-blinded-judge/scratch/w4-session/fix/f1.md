GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are @markdown, a leaf documentation editor dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

TASK: name the `--jev` switch and its gate in the offline judge playbook scenario and its index section. One appended sentence in each of 2 named files.
EDIT 1: `.skilled/skills/sk-communication/manual-testing-playbook/release-gating/offline-judge-census-stops-at-label-gate.md` line 16 ends with `leaves every census line as it was.` Append one space and this sentence to that same line:
`--jev` adds a Jev column only after the identity line, `jev --version` printing `jev 0.6.2` and `jev auth status --provider <p>` exiting 0, and a stub whose `auth status` exits 3 prints `jev arm skipped: no credential` with every census line unchanged.
EDIT 2: `.skilled/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md`, in the `### COMM-011` section, the paragraph that starts `Verify the offline judge measurement counts` ends with `without changing the census.` Append one space and this sentence to that same line:
The `--jev` switch is gated the same way, and a Jev without a credential prints its identity line and one skip line.
Change nothing else in either file.
VERIFY (repo root), paste each result line:
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-communication/manual-testing-playbook/release-gating/offline-judge-census-stops-at-label-gate.md
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md --type playbook
  grep -c -- "--jev" .skilled/skills/sk-communication/manual-testing-playbook/release-gating/offline-judge-census-stops-at-label-gate.md
  grep -c -- "--jev" .skilled/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md
  git diff --stat -- .skilled/skills/sk-communication/manual-testing-playbook
Accept when: exactly these 2 files changed, 1 insertion and 1 deletion each; both validators exit 0; both greps print at least 1.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge
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
