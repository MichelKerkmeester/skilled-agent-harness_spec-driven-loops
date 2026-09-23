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

TARGET: P/implementation-summary.md

EDIT 1
OLD:     last_updated_by: "cli-pi mimo-v2.6-pro (orchestrated)"
NEW:     last_updated_by: "cli-pi-mimo-v2.6-pro"

EDIT 2
OLD:     next_safe_action: "Merge main, re-mint the cli-jev manifest, then run T015-T017 before any push"
NEW:     next_safe_action: "Strict-validate, commit, merge main, re-mint cli-jev, re-verify"

EDIT 3
OLD:       - "scorer-eval-baseline.json"
NEW:       - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json"

EDIT 4
OLD: | **Completed** | In progress |
NEW: | **Status** | In Progress |
| **Completed** | Pending |

EDIT 5
OLD: ### Phase 1: ci-cleanup-pi-proof
NEW: ### The live proof and the six surfaces

EDIT 6 (the cli-jev row of the Files Changed table: full baseline path and no-net-diff note)
OLD: | `.skilled/skills/cli-jev/SKILL.md`, `.skilled/skills/cli-jev/graph-metadata.json`, `.hermes/skills/cli-jev/SKILL.md`, `scorer-eval-baseline.json` | Modified | The bare word "run" removed from Keywords and derived.key_topics, the Hermes copy regenerated, the baseline restored to its committed content |
NEW: | `.skilled/skills/cli-jev/SKILL.md`, `.skilled/skills/cli-jev/graph-metadata.json`, `.hermes/skills/cli-jev/SKILL.md`, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | Modified | The bare word "run" removed from Keywords and derived.key_topics, the Hermes copy regenerated, the baseline restored to its committed content so it carries no net diff |

EDIT 7 (INSERT two rows directly after this ANCHOR line)
ANCHOR: | `recursive-child-manifest.vitest.ts` | Modified | Two hardcoded .opencode/specs paths corrected to the tracked specs/ tree |
NEW:
| `specs/system-speckit/033-system-speckit-v4/spec.md` | Modified | Phase map row 50 and the 049 to 050 handoff row added |
| `specs/system-speckit/033-system-speckit-v4/048-gate-3-mutation-time-delivery/implementation-summary.md` | Modified | One Verification row records this phase's live Pi proof |

EDIT 8
OLD: | Live proof captures and the four dispatch briefs with their handbacks |
NEW: | Live proof captures and the dispatch briefs wu1 to wu7 with their handbacks |

EDIT 9
OLD: The briefs and handbacks live in scratch/dispatch/ as wu1-links, wu2-jev-run-topic, wu3-jev-run-keyword and wu4-baseline-restore.
NEW: The briefs and handbacks live in scratch/dispatch/ as wu1-links, wu2-jev-run-topic, wu3-jev-run-keyword, wu4-baseline-restore, wu5-doc-* for the six packet documents, wu6-parent-rows and wu7-048-live-row.

EDIT 10
OLD: A clean base gave 151 of 26 and the base with this phase's cli-jev edge gave the same 151 of 26, so this phase's edits did not cause the drop. The base without cli-jev gave 152 of 27 and the base without the SKILL.md "run" keyword gave the same 152 of 27, which isolated the cause.
NEW: A clean base scored 151 of 195 and 26 of 32. The base with this phase's cli-jev edge scored the same, so this phase's edits did not cause the drop. The base without cli-jev scored 152 of 195 and 27 of 32, and so did the base without the SKILL.md "run" keyword, which isolated the cause.

EDIT 11
OLD: The orchestrator mirrored the primary checkout's gitignored link shared -> ../../../system-spec-kit/shared and no tracked file changed.
NEW: The orchestrator mirrored the primary checkout's gitignored link shared -> ../../../system-spec-kit/shared and no tracked file changed. sk-git's rule 8 names the full remedy for a fresh worktree: worktree-naming.sh provision.

EDIT 12
OLD: | Once the cli-jev keyword was gone the committed 152 of 27 was correct again and a fresh capture matched it on every metric and every fixture hash |
NEW: | Once the cli-jev keyword was gone the committed 152 of 195 and 27 of 32 were correct again and a fresh capture matched them on every metric and every fixture hash |

EDIT 13
OLD: | Push local main including the other session's two unpushed commits f5a89115b1 and 2c8f243607 | N/A - insufficient source context |
NEW: | Push local main including the other session's two unpushed commits f5a89115b1 and 2c8f243607 | The operator chose to publish local main as it stands, which carries the other session's two commits along with this phase |

EDIT 14
OLD: | Rebuild handover.md from the template | N/A - insufficient source context |
NEW: | Rebuild handover.md from the template | The earlier hand-written handover had no frontmatter, no template header and no anchors, which produced three of the five strict-validation errors |

EDIT 15 (the CLI row of the Verification table: replace the whole row, then add two rows after it)
OLD: | `npx vitest run --config ../../vitest.config.ts --project cli` | OPEN. First full run in this session had 1 file failed with 142 passed and 3 skipped, 3 tests failed with 1438 passed and 19 skipped of 1460, exit 1, 1592 s under heavy concurrent load. The failing file tests/runtime-memory-inputs.vitest.ts passes 24/24 when run alone. A clean full re-run is in progress, so AC-006 is Unmet and T016-adjacent CLI evidence is open |
NEW: | `npx vitest run --config ../../vitest.config.ts --project cli` | PASS. The clean full re-run reported 143 files passed and 3 skipped, 1441 tests passed and 19 skipped of 1460, exit 0, in 485 s. An earlier run under heavy concurrent load failed 3 tests in tests/runtime-memory-inputs.vitest.ts, which passes 24/24 alone. Load as the cause is inferred because those failure messages were not captured |
| `npx vitest run --config ../../vitest.config.ts --project cli tests/recursive-child-manifest.vitest.ts` | PASS. 1 file, 2 tests passed, exit 0 |
| Re-score after the cli-jev fix | PASS. 152/195 full corpus and 27/32 memory_save, with row 26 routing to system-deep-loop |

EDIT 16 (INSERT one numbered item directly after this ANCHOR line, with one blank line before it)
ANCHOR: 3. **Nine pre-existing run-all-drift-guards.sh errors remain.** Six are missing set -uo pipefail, two are missing references/README.md and one is missing assets/voice-report-template.md. They match the pre-change baseline and sit outside the six surfaces.
NEW:

4. **The primary checkout holds this phase's scaffold residue.** The scaffold ran against the primary checkout path, so the primary checkout's parent spec.md carries two placeholder rows and an untracked copy of the original 050 scaffold folder sits beside it. Both block updating the primary checkout's main to the phase commit, and removing them waits for the operator's yes at the merge step.

VERIFY - run these, paste each command with its result line
  grep -c 'N/A - insufficient source context' P/implementation-summary.md    # expect 0
  grep -c 'of 26\|of 27' P/implementation-summary.md                         # expect 0
  grep -c '| \*\*Status\*\* | In Progress |' P/implementation-summary.md      # expect 1
  grep -c '<!-- /\?ANCHOR:' P/implementation-summary.md                       # expect 12
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
