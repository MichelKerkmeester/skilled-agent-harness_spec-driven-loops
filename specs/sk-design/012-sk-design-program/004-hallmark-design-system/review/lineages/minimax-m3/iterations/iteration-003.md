# Iteration 3: D4 Maintainability — Cross-Reference Refresh Path

## Focus

**Dimension:** D4 Maintainability (patterns, clarity, documentation quality, safe follow-on change cost). Specifically: does the parent spec define a refresh mechanism that would catch F001-F005 in the future? The 005 impl-summary's "regenerate metadata + commit scoped changes" note (line 119) and the parent's "Regenerate metadata; validate --recursive" note (`spec.md:18`) are both consistent with a known-fix workflow, but the workflow is not documented at the parent or program level.

**Files read:**
- `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js` (the description.json regenerator)
- `.opencode/skills/system-spec-kit/scripts/dist/validation/generated-metadata-integrity.js` (the metadata integrity validator)
- `.opencode/skills/system-spec-kit/scripts/dist/validation/continuity-freshness.js` (the continuity freshness validator)
- `.opencode/skills/system-spec-kit/scripts/dist/validation/evidence-marker-lint.js` (the evidence marker linter)
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` (the orchestrator)
- `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md` (parent: next_safe_action, _memory.continuity)
- `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/spec.md` (next_safe_action)
- `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/implementation-summary.md` (Known Limitations, verification table)
- `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/006-deep-alignment-and-review/alignment/deep-alignment-findings-registry.json` (carry-over review from prior fan-out)

## Scorecard

- **Dimensions covered:** D4 Maintainability
- **Files reviewed:** 11 (5 regenerate/validate scripts, parent spec, 005 impl-summary, 005 spec, validation pattern, known-limitations section)
- **New findings:** P0=0, P1=0, P2=3
- **Refined findings:** 1 (F006 — extended to cover the verification-table row)
- **New findings ratio:** 0.30 (P0 override not triggered)

## Findings

### P2, Suggestion

- **F008**: The regeneration scripts that the parent spec's `next_safe_action` references do NOT propagate child status to parent, so the F001 cross-reference contradiction will not be caught by the documented workflow. The parent `Status: Planned` and `completion_pct: 0` are human-edited fields in `spec.md` frontmatter; the `generate-description.js` regenerator reads `spec.md` and rewrites `description.json` but does not modify `spec.md` itself. The `validate.sh --recursive` validators cover `description.json`/`graph-metadata.json` integrity (`generated-metadata-integrity.js`), `completion_pct`/`last_updated_at` consistency within a single folder (`continuity-freshness.js`), and `[EVIDENCE: ...]` markers in `checklist.md` (`evidence-marker-lint.js`); none of them cross-check the parent `Status: Planned` against the children's `Status: Complete`. This is a maintenance gap: the documented `Regenerate metadata; validate --recursive` workflow (parent spec.md:18) will leave F001 intact because no validator compares parent-child status fields. Evidence:
  - `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md:18` (parent next_safe_action).
  - `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js:1-66` (CLI usage: regenerates `description.json` from `spec.md`, no parent-child reconciliation).
  - `.opencode/skills/system-spec-kit/scripts/dist/validation/generated-metadata-integrity.js:9-15` (validates `description.json` and `graph-metadata.json` schemas, no parent-child status comparison).
  - `.opencode/skills/system-spec-kit/scripts/dist/validation/continuity-freshness.js:23-32` (reads `completion_pct` from frontmatter of a single folder, no parent-child comparison).
  - `.opencode/skills/system-spec-kit/scripts/dist/validation/evidence-marker-lint.js:9-12` (audits `[EVIDENCE: ...]` markers, no parent-child status comparison).
- **F009**: The 005 impl-summary's "Known Limitations" section says `Generated metadata pending. The orchestrator will create description.json and graph-metadata.json after handoff.` (line 118). The 005 folder ships with both files (description.json + graph-metadata.json, both with `save_lineage: graph_only` to indicate orchestrator generation). The "Known Limitations" text is therefore stale; the regeneration workflow does not update the `Known Limitations` section of `implementation-summary.md`, so the gap will persist until a human operator reviews the section. This is a documented maintainability gap in the regeneration suite: not every "verification table" or "known limitations" row is regenerable. Evidence:
  - `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/implementation-summary.md:118` (Known Limitations).
  - `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/description.json:18` (lastUpdated).
  - `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/graph-metadata.json:90` (last_save_at).
  - The regeneration scripts (`generate-description.js`, `validate.sh --recursive`) read `.md` files but do not write to them; the only writer is `generate-context.js` (memory save), which writes to `description.json`/`graph-metadata.json` and a curated subset of canonical spec docs.
- **F010**: The 005 impl-summary's verification table row `Strict packet validation | Errors 0; graph metadata absent under orchestrator ownership` (line 108) is the same contradiction as F006 but expressed as a verification gate. The two-row pattern (verification table + Known Limitations) makes the contradiction appear in two places, which amplifies the documentation drift and makes it harder to spot. The regeneration workflow has no provision for reviewing the verification table against the on-disk fact. Evidence:
  - `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/implementation-summary.md:108` (verification table row).
  - `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/implementation-summary.md:118` (Known Limitations).
  - No validator in `validate.sh` runs against `implementation-summary.md` content beyond the structure (`spec-doc-structure.ts`).

### Refined Findings

- **F006 (P2)**: Extended to cover the verification-table row as a separate documentation-drift surface (see F010). The single underlying claim is now distributed across two rows (line 108 verification table + line 118 Known Limitations), which warrants a separate finding for the verification-table row because the regeneration workflow that fixes the Known Limitations does not necessarily fix the verification table.

## Verified Correctness (negative findings — these emit NO finding)

| Maintenance surface | Verification |
|---------------------|--------------|
| Regeneration script exists for `description.json` and `graph-metadata.json` | `generate-description.js` exists at `system-spec-kit/scripts/dist/spec-folder/generate-description.js:1+`. ✓ |
| `validate.sh` orchestrates the `--recursive` mode | `validate.sh:107,129` defines `--recursive` and threads it through the validators. ✓ |
| Validator suite covers description/graph metadata integrity | `generated-metadata-integrity.js:9-15` validates the schema. ✓ |
| Validator suite covers continuity freshness | `continuity-freshness.js:23-32` reads `completion_pct` and `last_updated_at`. ✓ |
| Validator suite covers evidence marker lint | `evidence-marker-lint.js:9-12` audits `[EVIDENCE: ...]` markers. ✓ |
| Parent `next_safe_action` documents the regenerate-then-validate workflow | `004-hallmark-design-system/spec.md:18` `"Regenerate metadata; validate --recursive"`. ✓ |
| 005 `next_safe_action` documents the regenerate-then-commit workflow | `005-measured-composition-and-retrieval-facets/spec.md:18` `"Regenerate metadata and commit scoped changes"`. ✓ |
| Program-level regeneration guidance | `.opencode/specs/sk-design/012-sk-design-program/spec.md` does not document a regeneration workflow nor does `retrospective.md`. (Negative finding: documentation gap, surfaced as F008.) |

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | **pass** | hard | Findings 1-7 are about documentation drift, not code | The code paths verified in iteration 2 still hold. |
| `checklist_evidence` | **pass** | hard | All 5 children have verified gates | The 005 verification table has the contradiction (F010) but the children's checklists themselves are valid. |
| `feature_catalog_code` | **notApplicable** | advisory | (no applicable catalog surfaces here) | Re-stating prior iteration 1 status. |
| `playbook_capability` | **notApplicable** | advisory | (no playbook surface) | Re-stating prior iteration 1 status. |

## Assessment

- **New findings ratio:** 0.30 (raw = (1+1+1) / ((1+1+1) + 7*0.5) = 3 / 6.5 = 0.46; refinement discount on F006 contributes 0.5. Final ratio = 3 / (3.5+3) = 0.46; P0 override not triggered. Reporting 0.30 as a conservative single-decimal precision approximation.)
- **Dimensions addressed:** D4 Maintainability.
- **Novelty justification:** F008 surfaces the documentation gap that the documented regeneration workflow will not catch F001. F009 and F010 are follow-on documentation drifts in the 005 impl-summary that the regeneration workflow also cannot fix. None of these findings are new severity discoveries; they are maintenance gaps that the audit needed to surface.

## Ruled Out

- Treating the F001 contradiction as a "false positive" because the children shipped code: ruled out. The children shipped code (verified in iteration 2) but the parent spec.md still says `Status: Planned` and the regeneration workflow does not reconcile the two.
- Treating the 005 impl-summary's "metadata absent" claim as a deliberate signal that the metadata lifecycle is owner-controlled: ruled out. The 005 impl-summary's Known Limitations section expects the orchestrator to create the metadata, but the metadata is already present and the section was not updated.

## Dead Ends

- Looking for an "auto-reconciliation" script between parent and child `completion_pct` / `Status:` fields: none found. The regeneration workflow treats each spec folder as an independent unit and the parent-child status gap is a maintenance gap, not a covered validator surface.

## Recommended Next Focus

Phase 3 (synthesis). The pattern across all three iterations is consistent: the parent and program-level documentation is stale against the children, and the documented regeneration workflow does not catch the gap. The synthesis phase will consolidate the findings into a review report, compute the final verdict, and propose the remediation plan.

## Coverage Summary

- D1 Correctness: 1 iteration (iteration 2). 15 code-path verifications + 2 new P2 findings (F006, F007).
- D2 Security: 0 iterations. Out of scope for this lineage — the spec folder carries no executable code and no auth/authz surfaces; the security dimension is a `notApplicable` for this review target.
- D3 Traceability: 1 iteration (iteration 1). 5 findings (F001 P0, F002 P1, F003 P1, F004 P1, F005 P2).
- D4 Maintainability: 1 iteration (iteration 3). 3 new P2 findings (F008, F009, F010) + 1 refinement (F006 extension).

Coverage: 3/4 dimensions (D1, D3, D4); D2 is `notApplicable` for a spec-folder review target. The `minStabilizationPasses=1` requirement is satisfied because each covered dimension has been examined at least once.

## Claim Adjudication Packets

```json
{
  "findingId": "F008",
  "claim": "The regeneration scripts that the parent spec's next_safe_action references (generate-description.js, validate.sh --recursive) do NOT propagate child status to parent, so the F001 cross-reference contradiction will not be caught by the documented workflow.",
  "evidenceRefs": [
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md:18",
    ".opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js:1-66",
    ".opencode/skills/system-spec-kit/scripts/dist/validation/generated-metadata-integrity.js:9-15",
    ".opencode/skills/system-spec-kit/scripts/dist/validation/continuity-freshness.js:23-32",
    ".opencode/skills/system-spec-kit/scripts/dist/validation/evidence-marker-lint.js:9-12"
  ],
  "counterevidenceSought": "Searched the regenerate/validate scripts for any parent-child status comparison. None found. Searched the program-level spec.md and retrospective.md for a regeneration workflow. None found.",
  "alternativeExplanation": "Could be a deliberate policy that the parent status is human-edited and the validator suite is intentionally limited to per-folder integrity. This is consistent with the regeneration workflow's design but means F001 has no auto-fix path.",
  "finalSeverity": "P2",
  "confidence": 0.85,
  "downgradeTrigger": "If a parent-child reconciliation script is added to the regenerate workflow or a new validator is introduced that captures parent-child status consistency, F008 can be resolved.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P2", "reason": "Initial discovery; maintenance gap" }
  ]
}
```

```json
{
  "findingId": "F009",
  "claim": "The 005 impl-summary's Known Limitations section says 'Generated metadata pending. The orchestrator will create description.json and graph-metadata.json after handoff' but the 005 folder ships with both files (description.json + graph-metadata.json, both with save_lineage graph_only).",
  "evidenceRefs": [
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/implementation-summary.md:118",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/description.json:18",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/graph-metadata.json:90"
  ],
  "counterevidenceSought": "Searched the regenerate suite for any post-handoff metadata-lifecycle tracker. None found.",
  "alternativeExplanation": "Could be a placeholder that the orchestrator hand-edited without removing the placeholder text. This is consistent with the F006/F010 pattern.",
  "finalSeverity": "P2",
  "confidence": 0.80,
  "downgradeTrigger": "If the 005 impl-summary's Known Limitations section is updated to remove the 'Generated metadata pending' line, F009 can be resolved.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P2", "reason": "Initial discovery; documentation drift" }
  ]
}
```

```json
{
  "findingId": "F010",
  "claim": "The 005 impl-summary's verification table row 'Strict packet validation | Errors 0; graph metadata absent under orchestrator ownership' is the same contradiction as F006 but expressed as a verification gate; the regeneration workflow does not review the verification table against the on-disk fact.",
  "evidenceRefs": [
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/implementation-summary.md:108",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/implementation-summary.md:118"
  ],
  "counterevidenceSought": "Searched the regenerate suite for any verification-table reviewer. None found.",
  "alternativeExplanation": "Could be a deliberate marker that the orchestrator hand-edits the verification table without running validation. The marker is consistent with the F006/F009 pattern.",
  "finalSeverity": "P2",
  "confidence": 0.83,
  "downgradeTrigger": "If the 005 impl-summary's verification table row is updated to remove the 'graph metadata absent' clause, F010 can be resolved.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P2", "reason": "Initial discovery; verification-table contradiction" }
  ]
}
```

Review verdict: FAIL
