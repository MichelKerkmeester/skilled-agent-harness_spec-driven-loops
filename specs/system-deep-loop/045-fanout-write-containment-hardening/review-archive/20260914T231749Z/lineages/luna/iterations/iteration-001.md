# Deep Review Iteration 001

## Focus

Correctness of baseline subtraction, containment timing, and lane outcome handling.

## Files Reviewed

- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:810-843`
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3381-3436`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:130-158`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:544-548`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:120-123`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:1625-1715`

## Findings

### P0

None.

### P1

- **LUNA-F001**: Pre-existing untracked deletions disappear from the baseline diff — `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:823` — detection iterates only the current status entries, so a baseline-only untracked path that is deleted before the post-dispatch sample is absent from the loop and cannot become a violation or be preserved.
- **LUNA-F002**: Failed or incomplete lanes skip containment entirely — `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3381` — missing-artifact, stop-policy, and salvage failures throw before the containment call, leaving out-of-scope writes from those lanes unreported despite the packet's unqualified containment success criteria.

### P2

None.

## Claim Adjudication Packets

```json
{"findingId":"LUNA-F001","claim":"A pre-existing untracked path deleted before the post-dispatch sample is not represented in the current status entries and therefore escapes detectNewOutOfScopeViolations.","evidenceRefs":[".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:823-835","specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:130","specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:544-548"],"counterevidenceSought":["A current-status entry for a missing untracked baseline path, or a separate baseline-union comparison elsewhere in the containment call chain."],"alternativeExplanation":"Tracked deletions can be reported by git status, but that does not make a deleted untracked baseline path appear in the current entries.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"A baseline-aware union comparison and regression test that reports the deleted untracked path would invalidate this finding."}
```

```json
{"findingId":"LUNA-F002","claim":"The fan-out runner throws for several terminal failure conditions before invoking enforceWriteContainment, so failed lanes cannot produce containment findings.","evidenceRefs":[".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3381-3420",".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3422-3436","specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:120-123","specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:130,153"],"counterevidenceSought":["A finally block or failure-path wrapper that invokes containment before these throws."],"alternativeExplanation":"Successful lanes do reach containment, but the documented limitation confirms that earlier gate failures do not.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"A failure-path containment invocation that preserves the original lane error while recording the out-of-scope write would invalidate this finding."}
```

## Ruled Out

- The normal changed-tracked-file path is not a false positive: current entries are compared against the baseline hash before a violation is emitted at `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:830-835`.
- The review did not infer a new defect from unrelated dirty paths; the candidates above are limited to the target's baseline and failure-path contracts.

## Traceability Checks

- `spec_code`: partial. The implementation has direct evidence for both gaps; REQ-001 and SC-001 do not carve out failed lanes, while the known limitation documents the mismatch.
- `checklist_evidence`: partial. The current unit tests cover tracked deletion and preserved untracked writes, but no pre-existing untracked deletion case or failure-lane containment case was found in the reviewed test span.
- `feature_catalog_code`: not exercised in this correctness pass; scheduled for the traceability pass.
- `playbook_capability`: not exercised in this correctness pass; scheduled for the maintainability pass.

## Next Focus

Security: canonical destination handling, symlink boundaries, and preservation of trusted lineage writes.

## Assessment

Dimensions addressed: correctness. Two independently evidenced P1 findings remain actionable; no P0 was established in this pass.

Review verdict: CONDITIONAL
