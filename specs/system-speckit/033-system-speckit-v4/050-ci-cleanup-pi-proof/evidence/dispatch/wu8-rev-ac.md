GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 are
set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch
exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you.
Your write authority is already bound. The spec folder is:
  specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof
Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

PERSONA
You are @markdown, a LEAF documentation executor at depth 1. You apply literal text replacements to one
spec document and return one handback block. Nested dispatch is illegal: do not start another pi, cli or
agent process.

Repo root: the current working directory (all paths from there).
P = specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof

ROLE
Apply the numbered EDITS below to the one TARGET file, exactly as written. Each EDIT gives the OLD text,
copied from the file as it is now, and the NEW text that replaces it. An INSERT gives an ANCHOR line
that exists in the file and the NEW lines to add directly after it.

DON'T
- No git state change of any kind. No nested CLI, no agent dispatch, no scripts beyond VERIFY.
- Do not reword, reorder or "improve" anything outside the EDITS. Do not touch any other file.
- If an OLD text or ANCHOR line is not found exactly once, skip that EDIT, do the rest, and report it
  under failures. Never guess a nearby match.

TARGET: P/acceptance-criteria.md

EDIT 1
OLD:     last_updated_by: "cli-pi mimo-v2.6-pro (orchestrated)"
NEW:     last_updated_by: "cli-pi-mimo-v2.6-pro"

EDIT 2
OLD:     recent_action: "Greened the six CI surfaces and root-caused the scorer drop at cli-jev with T001 through T012 done"
NEW:     recent_action: "Six CI surfaces green, scorer drop fixed at cli-jev, CLI suite passed"

EDIT 3
OLD:     next_safe_action: "Work T013 through T017 in order: packet docs and parent records, strict validation, merge main and re-mint cli-jev, merged-tree re-verification, then commit and push"
NEW:     next_safe_action: "Strict-validate, commit, merge main, re-mint cli-jev, re-verify"

EDIT 4
OLD:       session_id: "[SESSION-ID]"
NEW:       session_id: "scaffold-050-ci-cleanup-pi-proof"

EDIT 5 (the AC-006 row: replace the Verification cell and the Status cell)
OLD: | The first full run of npx vitest run --config ../../vitest.config.ts --project cli reported 1 file failed and 3 tests failed of 1460 with 1438 passed and 19 skipped and exit 1 after 1592 s under heavy concurrent load. The failing file tests/runtime-memory-inputs.vitest.ts passes 24 of 24 when run alone. A clean full re-run was still in progress in the evidence pack, so the row is Unmet | Unmet | - |
NEW: | A clean full re-run of npx vitest run --config ../../vitest.config.ts --project cli in .skilled/skills/system-spec-kit/runtime/cli reported 143 files passed and 3 skipped, 1441 tests passed and 19 skipped of 1460, and exit 0 in 485 s. An earlier full run under heavy concurrent load failed 3 tests in tests/runtime-memory-inputs.vitest.ts, and that file passes 24 of 24 alone. Its failure messages were not captured, so load as the cause is inferred | Met | - |

EDIT 6 (the AC-009 Verification cell)
OLD: | N/A - insufficient source context. The evidence pack records no strict validate run and task T014 is open, so the row is Unmet | Unmet | - |
NEW: | bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof --strict must print RESULT: PASSED, and the parent spec.md must carry phase map row 50 and the 049 to 050 handoff row. Task T014 is open, so the row is Unmet | Unmet | - |

EDIT 7 (the AC-010 Verification cell)
OLD: | N/A - insufficient source context. Task T016 is open and the evidence pack records no merged-tree run, so the row is Unmet | Unmet | - |
NEW: | On the merged tree, sync-skills-hermes.cjs --check, the parity/scorer-eval-baseline-ratchet vitest, check-markdown-links.cjs and compiled-route-guard.cjs must each exit 0, with the guard reporting cli-jev fresh. Task T016 is open, so the row is Unmet | Unmet | - |

EDIT 8
OLD: AC-006, AC-008, AC-009 and AC-010 are the open rows and each must turn Met or carry a waiver ADR before this packet may close.
NEW: AC-008, AC-009 and AC-010 are the open rows and each must turn Met or carry a waiver ADR before this packet may close.

VERIFY - run these, paste each command with its result line
  grep -c 'N/A - insufficient source context' P/acceptance-criteria.md      # expect 0
  grep -c '| Met | - |' P/acceptance-criteria.md                            # expect 7
  grep -c '\[SESSION-ID\]' P/acceptance-criteria.md                          # expect 0
  grep -c '<!-- /\?ANCHOR:' P/acceptance-criteria.md                         # expect 6
(replace P with the full folder path when you run them)

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
