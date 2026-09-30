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

TASK: add the new offline judge scenario to the skill's manual testing playbook index, from a full copy the orchestrator already wrote and validated.
F = .skilled/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md (exists; the only file you change)
D = specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/scratch/w4-build/drafts/playbook/manual-testing-playbook.md (read only; the literal new text of F)
Read F and D in full first. D is F with seven edits: a Python 3 note in section 2, the `node --test --test-name-pattern` filter in section 4, `COMM-011` in the wave 4 row of section 6, a `COMM-011` block at the end of section 10, a sentence exception and one row in section 11, and one row in section 12.

STEP 1. Run `shasum -a 256 F`. It must print `0da9968efcff48763d88072f956a418de5ee53cff78eae80c02b33263c54c953`. If it prints anything else, F changed since D was written: change nothing and hand back BLOCKED with the printed hash.
STEP 2. Run `cp D F` from the repo root, then read F back. Do not reformat, reword or add anything.

Accept when: 1 file changed (F), no other file changed, `cmp D F` prints nothing, `git diff --stat -- F` shows 15 insertions and 4 deletions, and the validator exits 0.
Checks you run, from the repo root:
- `cmp specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/scratch/w4-build/drafts/playbook/manual-testing-playbook.md .skilled/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md` (expect no output, exit 0)
- `git diff --stat -- .skilled/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md`
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md` (expect exit 0)

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
