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

TASK: index the new CC-004 scenario in the hub playbook root.
File F = .skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md. Read F first.
Block B = specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/scratch/w4-build/briefs/content/playbook-root-section-7.txt (read only, 12 lines).
Apply the steps bottom-up in this order so the line numbers below stay valid. Each quoted text is exact.

STEP 1. After F:145 (the row starting `| CJ-002 | The cli-jev name resolves`) insert this line:
| CC-004 | The injection screen scorer runs with zero model calls | Measurements | [CC-004](measurements/injection-screen-measurement.md) |
STEP 2. F:137 `## 8. FEATURE CATALOG CROSS-REFERENCE INDEX` becomes `## 9. FEATURE CATALOG CROSS-REFERENCE INDEX`.
STEP 3. After F:133 (the row starting `| Deem client behavior |`) insert this line:
| Injection screen scorer | [score-injection-screen tests](../benchmark/injection-screen/tests/score-injection-screen.test.mjs) | `CC-004` |
STEP 4. F:125 `## 7. AUTOMATED TEST CROSS-REFERENCE` becomes `## 8. AUTOMATED TEST CROSS-REFERENCE`.
STEP 5. After F:123 (the `---` line that follows the CJ-002 feature-file line) insert the 12 lines of B exactly, in order.
STEP 6. F:32 reads `- The scenarios validate routing only. They never start the Deem server and never send a judgment to either backend.`
Replace it with:
- The hub-routing scenarios validate routing only. `CC-004` runs the injection screen scorer on stub binaries. No scenario starts the Deem server or sends a judgment to either backend.
STEP 7. On F:18 replace only its first sentence, `The walked tree holds the hub-routing scenarios for `cli-classifier`.`, with:
The walked tree holds the hub-routing scenarios for `cli-classifier` and one measurement scenario for its offline injection screen scorer.
Keep the rest of F:18 and everything else in F byte-identical. Edit no other file.

VERIFY (repo root), paste each result line:
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md --type playbook   (expect "Total issues: 0")
  grep -c "CC-004" .skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md   (expect 5)
  grep -c "^## [0-9]" .skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md   (expect 9)
Accept when: 1 file changed (F) with 14 lines added and 4 lines replaced; the validator exits 0; the greps print 5 and 9.

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
