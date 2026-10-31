GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are @markdown, a leaf documentation editor dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

You are a mechanical editor in one repository. Do exactly the steps below, nothing more.
Repo root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration (all paths from there).

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check
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

STEP 1: State the zero-hard-failure gate in the quality checklist, including VS-05
Scope: 1 file, .skilled/skills/sk-design/sk-design-md-generator/references/quality-checklist.md. Read it before editing.
Each edit names a line, an OLD text and a NEW text. The literal text is everything after
"OLD: " or "NEW: " up to the end of that line. On the named line only, replace OLD with NEW.
OLD occurs exactly once on that line. Keep the rest of the line byte-identical, including any
em dash, semicolon or table pipe already there. Add no line and remove no line.
  a. Line 29
     OLD: and `isPass` requires `score >= 80` AND `claimsScore >= 80`.
     NEW: and `isValidationPass` passes only with zero hard failures in the `target`, `schema` and `provenance` categories. The dual score is printed for information and does not decide the verdict.
  b. Line 476
     OLD: Pass gate: `isPass` requires score >= 80 AND claimsScore >= 80
     NEW: Pass gate: `isValidationPass` requires zero hard failures
  c. Line 477
     OLD: `isPass` returns true only when `score >= 80` AND `claimsScore >= 80` AND there is no critical failure (e.g. a phantom hex)
     NEW: `isValidationPass` returns true only when `failures` is empty. Every issue in the `target`, `schema` and `provenance` categories is a hard failure (a phantom hex is `target`), and the CLI exits 0 only on a pass
  d. Line 478
     OLD: A doc with a passing `valuesScore` but `claimsScore < 80` still FAILS
     NEW: Any hard failure fails the doc, whatever its scores, even when every hex is verbatim
  e. Line 479
     OLD: Drive `claimsScore` to >= 80 by removing
     NEW: Clear every hard failure. For `provenance`, remove
Accept when: 1 file changed, 5 line(s) changed (lines 29, 476, 477, 478, 479), line count unchanged.

VERIFY (paste each command with its result line and exit code)
  grep -cE 'isPass[^A-Za-z]|>= ?80' .skilled/skills/sk-design/sk-design-md-generator/references/quality-checklist.md    # expect 0 (exit 1)
  grep -cF 'and `isValidationPass` passes only with zero har' .skilled/skills/sk-design/sk-design-md-generator/references/quality-checklist.md    # expect 1
  git diff --numstat -- .skilled/skills/sk-design/sk-design-md-generator/references/quality-checklist.md    # expect 5 added, 5 removed

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
