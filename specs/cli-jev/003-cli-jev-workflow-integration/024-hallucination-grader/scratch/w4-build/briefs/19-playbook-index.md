GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are @markdown, a leaf documentation editor dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

TASK: add scenario 5D-051 to the manual testing playbook index. Three literal edits in 1 file.
File: .skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/manual-testing-playbook.md. Read it first.

Edit 1, inside line 116. Old text:
The deep-improvement subtotal is 45 numbered scenarios (`IS-001..MB-042` plus MB-049, E2E-050, and the reviewer regression `MB-R01`)
New text:
The deep-improvement subtotal is 46 numbered scenarios (`IS-001..MB-042` plus MB-049, E2E-050, 5D-051, and the reviewer regression `MB-R01`)
(The rest of line 116 stays as it is.)

Edit 2, line 252. Old:
This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.
New:
This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

Edit 3 (do it last). Line 291 is `> **Feature File:** [5D-011](../manual-testing-playbook/five-d-scorer/missing-candidate.md)`, line 292 is blank and line 293 is `---`. Insert the exact contents of this file directly after line 291, byte for byte:
  specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/scratch/w4-build/content/playbook-index-block.md
That file starts with one blank line and ends with the `> **Feature File:** [5D-051](...)` line, so the old blank line and the old `---` line follow it.

Nothing else in the file changes, including its frontmatter.

VERIFY (repo root; paste each command, its result line and exit code):
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/manual-testing-playbook.md
  grep -c "5D-051\|covers 4 scenario summaries" .skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/manual-testing-playbook.md
Accept when: 1 file changed and nothing else; validate_document exits 0; the grep prints 6 (lines 136 and 194 already say "covers 4" for other categories).

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader
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
