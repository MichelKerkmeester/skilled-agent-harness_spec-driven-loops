GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are @markdown, a leaf documentation editor dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

TASK: list the goal verifier census, row builder and scorer in .skilled/hooks/goal/README.md. One file, five literal edits, text exactly as given. Change nothing else.

EDIT 1 (section 4 tree). Replace the four lines under "+-- lib/" (lines 95-98, from "|   +-- goal-core.cjs" through "|   `-- goal-slice.test.cjs") with these ten lines:
|   +-- build-verifier-fixture.cjs          # unlabeled verifier rows from Pi sessions and any Claude transcripts the operator names
|   +-- build-verifier-fixture.test.cjs     # row fields, skipped nudges, row selection, refusal to overwrite
|   +-- count-pi-goal-nudges.mjs            # Pi census of recorded goal-verify-nudge records: counts, categories and dates, no text
|   +-- count-pi-goal-nudges.test.mjs       # per-reason counts, unknown record type, no message text in the output
|   +-- goal-core.cjs                       # scope validation, opaque paths, atomic state, lifecycle, packet binding, rendering, verifier, legacy quarantine
|   +-- goal-core.test.cjs                  # core, lifecycle, concurrency, legacy, hardening, packet, CLI contract coverage
|   +-- goal-slice.cjs                      # packet goal.md projections: frontmatter split, durable and chat slices, objective slice, hash
|   +-- goal-slice.test.cjs                 # no-leak, slice boundary, nested versus singular, hash stability, unbound paths
|   +-- score-verifier-labeled-set.cjs      # offline scorer: three zero-call verifier arms, clamp defects, stop and gate lines
|   `-- score-verifier-labeled-set.test.cjs # loader, normalization, report and stop lines, CLI with stub model binaries

EDIT 2 (section 5 table). Directly after the row that starts "| `lib/goal-slice.cjs` |", insert these three rows:
| `lib/count-pi-goal-nudges.mjs` | Pi census of the goal verifier's recorded use. It walks a Pi session directory and counts `goal-verify-nudge` records per session file by verdict and reason category, with first and last dates. Its first line states the counting method. It prints no message text, and an unknown record type stops it with a named error. |
| `lib/build-verifier-fixture.cjs` | Builds unlabeled rows for the verifier scorer. Each Pi row pairs a recorded nudge with the turn text behind it. Each Claude row pairs a native `goal_status` result, kept as a pre-label, with the assistant text before it, and Claude rows come only from a transcript directory the operator names. Every `label` stays empty for the operator. The output holds conversation text, so it is written with mode `0600`, never overwrites a file and stays untracked. |
| `lib/score-verifier-labeled-set.cjs` | Offline scorer for a labeled row file. It runs three zero-call arms on identical rows: the OpenCode plugin heuristic on the as-ingested text, a tail-window arm on the raw last 1,200 characters and goal-core parity. It prints a confusion table per arm, the false `not_met` rows by heuristic check, the clamp-defect count and a stop or gate line. It stops under 30 labeled rows and spawns no model binary. |

EDIT 3 (section 5 table). Directly after the row that starts "| `lib/goal-core.test.cjs`, `bin/goal.test.cjs` |", insert this row:
| `lib/count-pi-goal-nudges.test.mjs`, `lib/build-verifier-fixture.test.cjs`, `lib/score-verifier-labeled-set.test.cjs` | Census, row builder and scorer coverage on synthetic fixtures. No test reads a real session. |

EDIT 4 (section 7, the Imports row, line 145). Replace the sentence "Nothing imports the plugin." with:
Only the offline scorer, `lib/score-verifier-labeled-set.cjs`, imports the plugin, to run its heuristic as shipped through `__test`.

EDIT 5 (section 8). In the first node --test block, directly after the line "  .skilled/hooks/goal/lib/goal-core.test.cjs \", insert these three lines:
  .skilled/hooks/goal/lib/count-pi-goal-nudges.test.mjs \
  .skilled/hooks/goal/lib/build-verifier-fixture.test.cjs \
  .skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs \
Then, directly after that block's line "Expected result: all tests pass.", insert a blank line and these lines:
```bash
node .skilled/hooks/goal/lib/count-pi-goal-nudges.mjs --dir ~/.pi/agent/sessions
```

Expected result: a `method:` line first, one `session:` line per session file that holds a nudge and a `totals:` line, with no message text. The census only reads.

Accept when: 1 file changed, only these five edits, and the check below exits 0.
CHECKS (run exactly this):
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/hooks/goal/README.md

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow
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
