---
title: "Iteration 1 - Correctness: producer retirement vs claimed test evidence"
trigger_phrases: []
---
# Iteration 1 - Correctness: producer retirement vs claimed test evidence

## Dispatcher
Dimension: correctness
Focus: Confirm that live producers and the claimed unit/fixture surface agree. REQ-001 (no producer) vs T009–T011 and the level-contract tests.

## Files Reviewed
- `.opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh:84-92`
- `.opencode/skills/system-spec-kit/scripts/tests/check-ac-coverage.sh:135-146`
- `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts:30-36`
- `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json:561-563`
- `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts:136-148`
- `.opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:211-215`
- `.opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh:63,729-740`
- `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:52-62`

## Findings - New

### P0 Findings
None.

### P1 Findings
- **F001**: AC-coverage unit tests still assert the retired checklist.md fallback — `.opencode/skills/system-spec-kit/scripts/tests/check-ac-coverage.sh:141` — `_ac_traceability_file` now returns only `tasks.md` with a protocol anchor and otherwise fails (`check-ac-coverage.sh:84-92`), but `expect_source` still wants `checklist.md` for pre-merge and unmerged packets. T011 in `tasks.md` is marked complete on that old return value. Two cases at lines 141-146 would fail against live source.
- **F002**: Level-contract vitest still expects checklist.md in optionalAddonDocs — `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts:32` — live `spec-kit-docs.json:561-563` lists only `acceptance-criteria.md`. The updated golden-snapshot test at `scaffold-golden-snapshots.vitest.ts:136-148` asserts absence. These two tests cannot both pass.
- **F003**: Integration vitest still requires deleted level-2 checklist.md example — `.opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:215` — `expect(fs.existsSync(path.join(TEMPLATES_DIR, 'level-2', 'checklist.md'))).toBe(true)` but `templates/**/checklist.md*` is empty after the example deletion.

### P2 Findings
None this pass.

## Claim Adjudication
- F001: claim=stale tests pin a read-path REQ-005 removed; evidenceRefs=`scripts/tests/check-ac-coverage.sh:141`,`scripts/rules/check-ac-coverage.sh:84`; counterevidenceSought=alternate `_ac_traceability_file` later in the file (none found through EOF of the function); alternativeExplanation=tests not executed in this lineage so they might be skipped by filename filter; finalSeverity=P1; confidence=0.86; downgradeTrigger=if the test file is excluded from the default suite or already counted in the accepted 13-fail baseline.
- F002: claim=contract test and live contract disagree on optionalAddonDocs; evidenceRefs=`level-contract-resolver.vitest.ts:32`,`spec-kit-docs.json:561`; counterevidenceSought=resolver hardcoding checklist.md (resolver only copies manifest lists); alternativeExplanation=test file is orphaned and not collected; finalSeverity=P1; confidence=0.9; downgradeTrigger=if vitest project excludes this file.
- F003: claim=integration test requires deleted example; evidenceRefs=`test-integration.vitest.ts:215`; counterevidenceSought=TEMPLATES_DIR pointing at a leftover fixtures tree; alternativeExplanation=same 13-fail baseline already includes this; finalSeverity=P1; confidence=0.82; downgradeTrigger=confirm the file is in the documented pre-existing failure set.

## Traceability Checks
- spec_code / REQ-001 producer: pass for upgrade-level.sh (creates acceptance-criteria.md only at 729-740) and spec-kit-docs.json (no `checklist` key).
- spec_code / REQ-005 vs tests: partial — production read-path in `_ac_traceability_file` is gone; tests still encode it.
- checklist_evidence / T011: fail — checked complete with evidence that live code no longer exhibits.

## Confirmed-Clean Surfaces
- `upgrade-level.sh` L1→L2 creates `acceptance-criteria.md` only; no `checklist.md` string in the script.
- `CANONICAL_PACKET_DOCS` no longer includes `checklist.md` (`graph-metadata-parser.ts:52-62`).
- `check-evidence.sh:89-93` holds both `T` and `CHK-` id shapes.

## Assessment
Dimensions addressed: correctness
Provisional iteration verdict: CONDITIONAL (3 P1, 0 P0)

## Next Focus (recommendation)
Security: fingerprint generation skip, symlink confinement, and whether leftover example/docs paths can still be written through a producer.

## SCOPE VIOLATIONS
None. Graph upsert and validate.sh skipped because they write outside this lineage.

Review verdict: CONDITIONAL
