---
title: "Iteration 006 — Angle (f): acceptance-criteria single-source vs duplication given validator coupling"
trigger_phrases: []
---
# Iteration 006 — Angle (f): acceptance-criteria single-source vs duplication given validator coupling

**Focus:** Q-A6 — Where do acceptance criteria actually live, which copies are machine-consumed, and what should single-sourcing look like after the tasks+checklist merge?

## Method
Read `scripts/rules/check-ac-coverage.sh` end-to-end; grepped all templates for acceptance-criteria surfaces.

## Findings

### F-F1.1 — Acceptance criteria have exactly TWO machine-consumed homes [CONFIRMED]
[SOURCE: scripts/rules/check-ac-coverage.sh:100-166] `AC_COVERAGE` counts criteria FROM spec.md (`_ac_count_requirement_table` parses the `| ID | Requirement | Acceptance Criteria |` tables; `_ac_count_story_criteria` handles an L3+ story format), then evaluates coverage FROM a traceability matrix in checklist.md (`_ac_analyze_traceability` parses `| AC-ID | class | evidence |` rows, requiring file:line evidence for tested/partial classes).
All other appearances are non-machine prose:
- plan.md.tmpl:128 `- [ ] All acceptance criteria met` (completion-gate checkbox)
- checklist.md.tmpl CHK-020 x3 (one per level body) `[P0] All acceptance criteria met`
- implementation-summary: narrative completion claims (dispatch's 5th copy)
- spec.md also embeds per-story `**Acceptance Criteria**:` prose blocks (L3+ variant)
**Implication:** the "5x restatement" decomposes into 1 canonical definition (spec.md) + 1 derived evidence matrix (checklist.md) + 3 decorative checkboxes/prose. Only the decorative copies are candidates for removal.

### F-F1.2 — The traceability matrix is DERIVED STATE with evidence pointers, not duplication of content [ANALYTICAL]
The checklist matrix repeats AC IDs but its payload is verification CLASS + file:line EVIDENCE — data that cannot live in spec.md without polluting requirements with implementation detail.
**Implication:** full single-sourcing is wrong; the correct model is spec.md as single source of DEFINITION + one evidence matrix elsewhere. This mirrors ADR practice (decision vs record separation) and the framework's own "finding = hypothesis, evidence pinned to SHA" discipline.

### F-F1.3 — AC_COVERAGE lifecycle gating hard-binds BOTH filenames [CONFIRMED]
[SOURCE: check-ac-coverage.sh:53-58] `_ac_lifecycle_active` requires `level_num >= 2`, `checklist.md` exists, AND `implementation-summary.md` exists; `_ac_analyze_traceability "$checklist_file"` at line 200 passes `$folder/checklist.md` literally.
**Implication:** the merge directive REQUIRES retargeting this rule to the merged doc's verification section. It also answers the L1-behavior sub-question from Q-A1: today AC coverage is intentionally dormant below L2 ([SOURCE: same lines]; 033 ADR-003 kept it advisory-by-default). Merged design preserves that by keeping the traceability matrix inside the L2+ gated addendum.

### F-F1.4 — Recommendation draft [RECOMMENDATION-DRAFT]
1. Keep spec.md requirement/story tables as the ONLY definition site (already true).
2. Move the traceability matrix into the merged doc's verification section (L2+ gate).
3. Delete decorative restatements: plan.md completion checkbox stays as workflow step but drops the phrase-level coupling; CHK-020 collapses from 3 copies to 1 via shared-core (F-B1.3 refactor); implementation-summary keeps narrative but validator already ignores it for AC purposes.
4. Co-changes: check-ac-coverage.sh filename bindings (lines 54, 57, 126, 164, 198-200); SPECKIT_AC_COVERAGE_* env contract unchanged; advisory severity preserved per 033 ADR-003 (warn blocks --strict completions).
Risk: LOW relative to value — the rule is advisory today (non-blocking), so even a missed retarget degrades to a no-op warning rather than a fleet regression. Flag: shipped packets WITH standalone checklist.md keep passing because the rule reads whatever file exists at $folder/checklist.md — legacy path survives untouched if the script prefers merged-doc matrix when present.

## Ruled out this iteration
- Ruled OUT: moving the evidence matrix INTO spec.md — couples requirements to implementation evidence and bloats the most-read doc against small-model budgets (F-E1.2).
- Ruled OUT: deleting the traceability matrix entirely — would zero out AC_COVERAGE (the one machine-checked plan-adherence gate, 033 ADR-003/ADR-004 context).

## Dead ends hit
- None.

## Open questions carried forward
- Full versioned-change surface map (content-router keying, golden snapshot inventory) — next iteration.
