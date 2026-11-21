# Iteration 017 - Core protocol adjudication across phases 006-008 (traceability)

## Dispatcher

- Lineage: opus-medium, session fanout-opus-medium-1795192401900-xpt66n
- Trigger: the stop check after iteration 16 is BLOCKED on dimensionCoverageGate because both hard core protocols were recorded as fail at iteration 15.
- Review focus addressed: whether that fail is what the two protocols measure. spec_code asks whether the code implements the packet's specs. checklist_evidence asks whether each checklist item's evidence holds. Iteration 15 marked both fail because of doc-to-code and summary-narrative findings. Those findings are real, but they sit outside what the two protocols check, and the registry already carries them as active P2s. This iteration re-runs both protocols against their own objects, requirement by requirement and task by task, and records the result with file:line evidence.
- Sources: steer.md absent; strategy; registry traceability results.

## Files Reviewed

- `specs/system-skilled-doctor/007-overlay-framework-root-layout/006-review-remediation/spec.md:128-140` (REQ-001..008), `specs/system-skilled-doctor/007-overlay-framework-root-layout/007-barter-review-fixes/spec.md:123-133` (REQ-001..006), `specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/spec.md:123-132` (REQ-001..005)
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/006-review-remediation/tasks.md:36-78`, `specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/tasks.md:36-81` (verify clauses)
- Evidence gathered in iterations 1-16 (cited per row)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. R5-P1-001 stays active. No spec REQ covers it: phase 006 recorded the probe as Known Limitation 1 and predicted a different outcome, so it is a code defect plus a wrong record, not a REQ the code misses.

### P2 Findings

None new.

## spec_code: pass

| REQ | Evidence | Result |
|-----|----------|--------|
| 006 REQ-001 relayout restore | `.skilled/commands/doctor/scripts/overlay-engine.cjs:6512-6549`; 3 of 3 rollback tests fail before the fix and pass after it (iterations 1, 16) | met |
| 006 REQ-002, REQ-003 outside-repository sibling | `.skilled/commands/doctor/scripts/overlay-engine.cjs:466-474`; strict-writes tests at :786, :806, :817 | met |
| 006 REQ-004 LAYOUT overflow split | `.skilled/commands/doctor/scripts/overlay-engine.cjs:3698-3708` | met |
| 006 REQ-005 remove-list remedy | `.skilled/commands/doctor/scripts/overlay-engine.cjs:5605-5614` | met |
| 006 REQ-006 both LAYOUT remedies in both docs | presentation lines 87-88, overlays.md line 92 | met (the generic rows R2-P2-001 names are outside this REQ) |
| 006 REQ-007 JSDoc, overlayOutside, writeBackup | `.skilled/commands/doctor/scripts/overlay-engine.cjs:3434-3440`, `.skilled/commands/doctor/scripts/overlay-engine.cjs:524`, `.skilled/commands/doctor/scripts/overlay-engine.cjs:4684-4697` | met |
| 006 REQ-008 002 pointers, 005 AC rows | iteration 4 | met |
| 007 REQ-001, REQ-002 no-manifest gate | barter pre-commit hook lines 120-146; pre-commit.test.cjs 6 of 6 | met |
| 007 REQ-003 hooks read overlayDir, postures kept | iteration 7 posture map | met |
| 007 REQ-004 real-bridge plugin test | barter-overlay-guard.test.cjs, 3 of 3 | met |
| 007 REQ-005 relayout-runs ignored | ai-speckit .gitignore:69, README.md:459 | met |
| 007 REQ-006 no live old-folder name | met apart from the vendored upstream test value that ai-speckit's 039 Known Limitation 6 and phase 005 AC-009 accept on purpose; R3-P2-001 disputes that decision | met with a recorded exception |
| 008 REQ-001..REQ-005 gates, push, pin, re-pin gates, 007 fixes survive | iterations 4 and 8 reruns | met |

## checklist_evidence: pass

- 006 T001-T018 and 008 T001-T011: every verify clause this lineage could rerun read-only reproduced (engine suite 262/262, pre-commit 6/6, status in-sync=488 136/136, b5a630c6efa on origin/main, vendored engine byte-identical, the 002 pointers at HEAD).
- R4-P2-001 and R4-P2-002 sit in implementation-summary narrative and continuity lines, not in a checklist item, and stay active as P2 findings.

## Traceability Checks

- spec_code: pass (supersedes iteration 15's fail, which counted doc-to-code findings this protocol does not measure).
- checklist_evidence: pass (supersedes iteration 15's fail on the same grounds).

## Edge Cases

- This lineage moved both protocols from fail to pass in one iteration. The evidence for each row is cited above; the findings that caused the earlier fail all remain active in the registry, so no finding is dropped by the change.

## Confirmed-Clean Surfaces

- Every REQ row of phases 006-008.

## Ruled Out

- A spec REQ the code misses: none.

## Next Focus

- Dimension: none
- Focus area: synthesis if the stop decision allows it
- Reason: core protocols adjudicated
- Rotation status: complete
- Required evidence: stop decision

Review verdict: CONDITIONAL
