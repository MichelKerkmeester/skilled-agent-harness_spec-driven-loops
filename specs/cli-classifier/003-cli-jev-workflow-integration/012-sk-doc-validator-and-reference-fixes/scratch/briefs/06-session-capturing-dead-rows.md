GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/012-sk-doc-validator-and-reference-fixes

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are @markdown, a leaf documentation editor dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/012-sk-doc-validator-and-reference-fixes
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

STEP 1: remove two dead rows from a recorded capture and say why in the capture's own note
Scope: 1 file, .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md.
Anchor: line 100 is the capture's note, lines 117-118 are the two rows. The test they cite now has 62 lines and no
`../../shared/embeddings` import, so the rows point at nothing. The capture keeps its recorded `17 violation(s)` line.
  a. Delete lines 117 and 118 in full. Their exact text (4 leading spaces each):
         tests/memory-pipeline-regressions.vitest.ts:67 → ../../shared/embeddings
         tests/memory-pipeline-regressions.vitest.ts:109 → ../../shared/embeddings
     Lines 116 (`tests/level-contract-resolver.vitest.ts:6 ...`) and 119 (`tests/memory-template-contract.vitest.ts:5 ...`) stay.
  b. Replace the whole line 100 (2 leading spaces). Old text:
  Recorded before the CLI nesting; the `@spec-kit/scripts` workspace and two of the listed test files no longer exist, the boundary script is repaired, and `npm run check` passes with the listed test imports governed by the allowlist.
     New text (same 2 leading spaces, one line):
  Recorded before the CLI nesting; the `@spec-kit/scripts` workspace and two of the listed test files no longer exist, the boundary script is repaired, and `npm run check` passes with the listed test imports governed by the allowlist. Two rows for `memory-pipeline-regressions.vitest.ts` were later removed from the capture below, because that test no longer imports `../../shared/embeddings` and the lines they cited are gone. The `17 violation(s)` count is the original recording.
Keep every other line of the file byte-identical, including line 110 `Import policy check FAILED: 17 violation(s) found:`.
Accept when: 1 file changed, +1/-3: line 100 rewritten, lines 117-118 removed.

VERIFY (paste each command with its result line and exit code)
  grep -c "memory-pipeline-regressions" .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md      # 1 (the note)
  grep -c "regressions.vitest.ts:" .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md      # 0 (exit 1 is expected for a zero count)
  grep -c "17 violation(s)" .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md      # 2 (note and capture)

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
