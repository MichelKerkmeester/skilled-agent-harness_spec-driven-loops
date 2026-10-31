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

TARGET: P/tasks.md

EDIT 1 (T009 evidence: cite the changed test alone and the clean full run)
OLD: and the covering run `npx vitest run --config ../../vitest.config.ts --project cli` in `.skilled/skills/system-spec-kit/runtime/cli` reports 142 files passed with 1 file failed and 3 skipped, the failing file `tests/runtime-memory-inputs.vitest.ts` passing 24/24 when run alone.
NEW: and `npx vitest run --config ../../vitest.config.ts --project cli tests/recursive-child-manifest.vitest.ts` in `.skilled/skills/system-spec-kit/runtime/cli` reports 1 file and 2 tests passed at exit 0. The clean full CLI re-run reports 1441 tests passed at exit 0.

EDIT 2 (T011 evidence: add the re-score)
OLD: and `node .skilled/bin/compiled-route-admission.cjs --hub cli-jev` reports pass with 3 pass 0 drift 0 stale at exit 0.
NEW: and `node .skilled/bin/compiled-route-admission.cjs --hub cli-jev` reports pass with 3 pass 0 drift 0 stale at exit 0. A re-score after the fix reports 152/195 full corpus and 27/32 memory_save, with row 26 routing to system-deep-loop.

EDIT 3 (split CHK-023 into the met CLI half and a new open merged-tree item)
OLD: - [ ] CHK-023 [P1] The pre-push verification passes: a clean full run of the spec-kit CLI project and the merged-tree re-verification of Hermes sync, scorer ratchet, link check and route guard
NEW: - [x] CHK-023 [P1] A clean full run of the spec-kit CLI project passes - **Evidence**: `npx vitest run --config ../../vitest.config.ts --project cli` in `.skilled/skills/system-spec-kit/runtime/cli` reports 143 files passed and 3 skipped, 1441 tests passed and 19 skipped of 1460, at exit 0.
- [ ] CHK-024 [P1] The merged-tree re-verification of Hermes sync, the scorer ratchet, the link check and the route guard passes before any push

EDIT 4
OLD: | P1 Items | 12 | 8/12 |
NEW: | P1 Items | 13 | 9/13 |

VERIFY - run these, paste each command with its result line
  grep -c '142 files passed' P/tasks.md                  # expect 0
  grep -c 'CHK-024' P/tasks.md                           # expect 1
  grep -c '^- \[x\] CHK-023' P/tasks.md                  # expect 1
  grep -c '<!-- /\?ANCHOR:' P/tasks.md                   # expect 30
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
