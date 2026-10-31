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

STEP 1: State the zero-hard-failure gate in the validate feature entry
Scope: 1 file, .skilled/skills/sk-design/sk-design-md-generator/feature-catalog/validate/validate.md. Read it before editing.
Each edit names a line, an OLD text and a NEW text. The literal text is everything after
"OLD: " or "NEW: " up to the end of that line. On the named line only, replace OLD with NEW.
OLD occurs exactly once on that line. Keep the rest of the line byte-identical, including any
em dash, semicolon or table pipe already there. Add no line and remove no line.
  a. Line 21
     OLD: and `isPass()` requires `claimsScore >= 80`.
     NEW: and the verdict (`isValidationPass()`) passes only with zero hard failures in the `target`, `schema` and `provenance` categories, so the scores inform it but do not decide it.
  b. Line 67
     OLD: `isPass()` additionally requires `claimsScore >= 80`, so
     NEW: any hard failure in the `target`, `schema` or `provenance` categories fails the verdict (`isValidationPass()`), so
  c. Line 67
     OLD: a `claimsScore` below 80 fails the verdict and surfaces prominently.
     NEW: a `claimsScore` below 80 also prints an advisory line.
  d. Line 86
     OLD: (`isPass` requires `claimsScore >= 80`)
     NEW: (`isValidationPass` passes on zero hard failures)
Accept when: 1 file changed, 3 line(s) changed (lines 21, 67, 86), line count unchanged.

VERIFY (paste each command with its result line and exit code)
  grep -cE 'isPass[^A-Za-z]|>= ?80' .skilled/skills/sk-design/sk-design-md-generator/feature-catalog/validate/validate.md    # expect 0 (exit 1)
  grep -cF 'and the verdict (`isValidationPass()`) passes on' .skilled/skills/sk-design/sk-design-md-generator/feature-catalog/validate/validate.md    # expect 1
  git diff --numstat -- .skilled/skills/sk-design/sk-design-md-generator/feature-catalog/validate/validate.md    # expect 3 added, 3 removed

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
