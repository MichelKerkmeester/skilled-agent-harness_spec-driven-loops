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
First run the STEP 0 command exactly as written, if the body has one. Then apply the numbered EDITS below to the one TARGET file, exactly as written. Each EDIT gives the OLD text,
copied from the file as it is now, and the NEW text that replaces it. An INSERT gives an ANCHOR line
that exists in the file and the NEW lines to add directly after it.

DON'T
- No git state change of any kind. No nested CLI, no agent dispatch, no commands beyond STEP 0 and VERIFY.
- Do not reword, reorder or "improve" anything outside the EDITS. Do not touch any other file.
- If an OLD text or ANCHOR line is not found exactly once, skip that EDIT, do the rest, and report it
  under failures. Never guess a nearby match.

TARGET: P/implementation-summary.md

STEP 0 (the cited captures moved from scratch/ to evidence/; rewrite their paths)
  sed -i '' -e 's#scratch/dispatch/#evidence/dispatch/#g' -e 's#scratch/pi-#evidence/pi-#g' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/implementation-summary.md

EDIT 1
OLD:     recent_action: "T001-T012 done with the Pi Gate-3 live proof captured and the six CI surfaces green"
NEW:     recent_action: "T001-T014 done: live Pi proof, six CI surfaces green, packet validates strict"

EDIT 2
OLD:     next_safe_action: "Strict-validate, commit, merge main, re-mint cli-jev, re-verify"
NEW:     next_safe_action: "Commit on the worktree branch, merge main, re-mint cli-jev, re-verify"

EDIT 3
OLD:     completion_pct: 70
NEW:     completion_pct: 80

EDIT 4
OLD: | Live proof captures and the dispatch briefs wu1 to wu7 with their handbacks |
NEW: | Live proof captures and the dispatch briefs wu1 to wu8 with their handbacks, moved from scratch/ to evidence/ |

EDIT 5
OLD: wu6-parent-rows and wu7-048-live-row.
NEW: wu6-parent-rows, wu7-048-live-row and wu8-rev-* for the revision pass over the six documents.

EDIT 6 (INSERT one paragraph directly after this ANCHOR line, with one blank line before it)
ANCHOR: The orchestrator mirrored the primary checkout's gitignored link shared -> ../../../system-spec-kit/shared and no tracked file changed. sk-git's rule 8 names the full remedy for a fresh worktree: worktree-naming.sh provision.
NEW:

The live-proof captures and the dispatch trail first lived in scratch/. They moved to evidence/ before the commit, because the packet docs cite them and the spec-kit folder rules keep cited files out of scratch/.

EDIT 7 (INSERT three rows directly after this ANCHOR line)
ANCHOR: | Re-score after the cli-jev fix | PASS. 152/195 full corpus and 27/32 memory_save, with row 26 routing to system-deep-loop |
NEW:
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof --strict` | PASS. RESULT: PASSED, 0 errors, 0 warnings |
| `validate.sh --strict` on `048-gate-3-mutation-time-delivery` after its derived metadata was regenerated | PASS. RESULT: PASSED, 0 errors, 0 warnings |
| `validate.sh --strict` on the parent `033-system-speckit-v4`, which recurses into its 50 phases | FAIL on one phase only. The parent folder and 49 of its 50 phases pass. 030-spec-kit-simplification-research fails SPECDOC_SUFFICIENCY_005 because its goal.md durable slice is 6498 characters against a 4000 limit. This phase did not touch 030 |

EDIT 8 (INSERT one numbered item directly after this ANCHOR line, with one blank line before it)
ANCHOR: 4. **The primary checkout holds this phase's scaffold residue.** The scaffold ran against the primary checkout path, so the primary checkout's parent spec.md carries two placeholder rows and an untracked copy of the original 050 scaffold folder sits beside it. Both block updating the primary checkout's main to the phase commit, and removing them waits for the operator's yes at the merge step.
NEW:

5. **Phase 030 fails strict validation on its own goal.md.** Its durable slice is 6498 characters against a 4000 limit. That predates this phase and sits outside its scope, so the parent's recursive strict run stays red on that one phase.

VERIFY - run these, paste each command with its result line
  grep -c 'scratch/pi-\|scratch/dispatch' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/implementation-summary.md   # expect 0
  grep -c 'wu8' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/implementation-summary.md                            # expect 2
  grep -c '<!-- /\?ANCHOR:' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/implementation-summary.md                 # expect 12

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
