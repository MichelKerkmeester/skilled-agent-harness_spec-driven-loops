# Review Iteration 005

## Dispatcher

- Lineage: `docs-merge-10`, area `docs-merge`.
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Focus: traceability and correctness, applying the iteration-4 token-level method to the "Command Fit" and "No-Edit Prompts" sections of the changelog. The pass-ten operator focus still binds.
- `steer.md` does not exist in the lineage directory, so no lead ruling applied.
- The holdout rule and the recorded limits were honoured.

## Files Reviewed

| File | Lines read | What was checked |
|------|-----------|------------------|
| `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md` | 118-152 | Every sentence of "No-Edit Prompts" and "Command Fit" against the gate code and its tests |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | 340-470 | `NO_EDIT_REQUEST`, the decline leads, the or-list, the question lead and the small-edit constants |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | 1160-1235 | The weak-cue gate, the words-only override and the no-edit withholding |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts` | 40-56 | The two score thresholds |

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Carried active: F001.

### P2 Findings

None new. Carried active: F002, F003, F004, F005.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | notApplicable | No spec implementation surface maps to this docs area. |
| `checklist_evidence` | notApplicable | No `checklist.md`; the brief and scope file are the checklist. |
| `skill_agent` | pass | The sk-doc rename remains coherent. |
| `agent_cross_runtime` | pass | The adapter set is unchanged. |

## Integration Evidence

- **No-edit wording:** `NO_EDIT_REQUEST` at `command-attach.ts:351` matches `no edits?`, `make no changes`, `no changes yet`, `don't/dont make any changes`, `don't create it`, `just show` and `just list`; `isNoEditRequest` folds curly apostrophes. The changelog's wording list and its "Don't add tools" counterexample both hold, because `tools` is not in the pronoun-or-nothing object list.
- **No-edit gap:** the changelog's documented gap, "make no changes to the public API" reads as no-edit, is the same pattern's scope limit, not a contradiction.
- **Decline leads:** `COMMAND_DECLINE_LEADS` includes `no need to` and `stop/stop using`, and the or-list join is handled by the shared lead pattern; the changelog's two examples hold.
- **Question leads:** the question-mark and `is the` handling is documented in the parser comments and exercised by the guard tests; no sentence in the changelog contradicts it.
- **Small edit:** `SMALL_EDIT_GATED_COMMANDS` is exactly `/create:readme`, `/create:feature-catalog` and `/create:manual-testing-playbook`, matching "readme, catalog or playbook".
- **Weak cue:** `DOCTOR_HELPER_WEAK_CUE_MIN_SCORE` is 9 and `DOCTOR_HELPER_UNCUED_MIN_SCORE` is 10, matching both changelog sentences when read in their separate cases.

## Edge Cases

- The "any other suffix" defect found in iteration 4 is not repeated here; this pass covers the neighbouring sections and closes clean.
- The deep-loop depth sentence ("typing another `/deep:` command no longer does") relies on route selection, which the `attach-scorer-10` area owns; this iteration checked only the depth-wording list and did not re-report that area.
- No new security surface; the reviewed files are prose plus gate constants.

## Confirmed-Clean Surfaces

- **No-edit gate:** the changelog's examples and counterexample match the pattern.
- **Decline leads:** the two named leads and the or-list behaviour are present.
- **Small-edit gate:** the three commands are the three the changelog names.
- **Weak-cue thresholds:** 9 for a weak cue, 10 for the words-only override.

## Ruled Out

- **A wrong no-edit list:** every example and the counterexample resolve against the pattern.
- **A missing or-list refusal:** the shared lead covers the list, and the changelog's example holds.
- **A wrong small-edit command set:** exactly three commands, matching the three document families.
- **A wrong weak-cue threshold:** both constants match the two sentences when read in their own cases.

## Next Focus

- Dimension: traceability
- Focus area: the changelog's measurement claims against the committed baseline aggregates
- Reason: the prose rules are now checked; the remaining unverified claims are the counts in "The Counts on Sealed Rows" and "Tests and Scenarios"
- Rotation status: correctness, security, traceability and maintainability have at least one pass each
- Required evidence: aggregate-only reads of the baseline; no prompt text
- Recovery note: none

Review verdict: CONDITIONAL
