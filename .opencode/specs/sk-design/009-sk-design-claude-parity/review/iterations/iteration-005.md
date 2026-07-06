---
title: Deep Review Iteration 005 - Maintainability
description: Maintainability review narrative for sk-design 009 Claude-parity deep review.
---

# Deep Review Iteration 005 - Maintainability

## Dimension

Maintainability. This pass reviewed procedure-card/schema drift cost, feature-catalog update burden, duplicate benchmark artifact naming, Phase 012 future-work handoff clarity, and whether the active md-generator P1s can be remediated through shared backend seams rather than unrelated one-off patches. Code graph status remains stale, so this pass used graphless fallback with direct reads, targeted globs, and exact grep evidence.

## Files Reviewed

| Area | Evidence | Result |
|------|----------|--------|
| Review state and severity doctrine | `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-strategy.md:126`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-002.md:32`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-003.md:32`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-004.md:34`, `.opencode/skills/sk-code/code-review/references/review_core.md:28` | Maintainability was the planned next dimension; P1-001 through P1-004 were treated as existing findings and not re-reported. |
| Code graph readiness | `code_graph_status` result: freshness `stale`, reason `git HEAD changed`, newer mtimes, and removed tracked files | Structural graph assertions were not trusted; graphless fallback was used. |
| Procedure-card schema and card conformance | `.opencode/skills/sk-design/shared/procedure_card_schema.md:75`, `.opencode/skills/sk-design/shared/procedure_card_schema.md:147`, `.opencode/specs/sk-design/009-sk-design-claude-parity/007-procedure-card-template-alignment/implementation-summary.md:109`, `.opencode/specs/sk-design/009-sk-design-claude-parity/007-procedure-card-template-alignment/implementation-summary.md:124`, `.opencode/skills/sk-design/design-interface/procedures/deck_direction_spec.md:17`, `.opencode/skills/sk-design/shared/procedures/polish_gate_orchestration.md:17`, `.opencode/skills/sk-design/design-md-generator/procedures/design_system_extraction.md:17` | The sampled cards conform today, but enforcement is still manual and outside the canon checker; P2-001 below. |
| Feature-catalog package structure | `.opencode/skills/sk-design/feature_catalog/feature_catalog.md:31`, `.opencode/skills/sk-design/feature_catalog/feature_catalog.md:39`, `.opencode/skills/sk-design/design-interface/feature_catalog/feature_catalog.md:37`, `.opencode/skills/sk-design/design-foundations/feature_catalog/feature_catalog.md:37`, `.opencode/skills/sk-design/design-motion/feature_catalog/feature_catalog.md:37`, `.opencode/skills/sk-design/design-audit/feature_catalog/feature_catalog.md:37`, `.opencode/skills/sk-design/design-md-generator/feature_catalog/feature_catalog.md:31` | Root catalogs are concise directories with short Current Reality summaries and leaf links, not full duplicated capability prose. No new duplication finding. |
| Duplicate benchmark artifacts | `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md:253`, `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/implementation-summary.md:111`, `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/implementation-summary.md:124`, `.opencode/skills/sk-design/benchmark/after-012-routing-rigor/report.md:1`, `.opencode/skills/sk-design/benchmark/after-d3-proxy/skill-benchmark-report.md:1`, `.opencode/skills/sk-design/benchmark/README.md:49` | The duplicate is documented and intentionally left untouched, but the two live folders use different naming conventions for byte-identical evidence; P2-002 below. |
| Phase 012 future-work handoff | `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md:259`, `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/plan.md:40`, `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/tasks.md:37`, `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/checklist.md:155`, `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/implementation-summary.md:141` | The ADR-003 descope, unbuilt expanded-battery work, and future pickup path are explicit enough to continue without re-deriving context. No new handoff finding. |
| md-generator backend maintainability around active P1s | `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:53`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:80`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:258`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:138`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:215`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:627`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:249`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:301` | The active P1s have two maintainable remediation seams: a prompt-data/facts encoder in the WRITE prompt path, and a shared output/artifact write policy used by extraction, guided-run, report, preview, and proof. No separate P1 is needed. |

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### P2-001 [P2] Procedure-card schema lint is manual-only and outside the existing canon checker

- File: `.opencode/skills/sk-design/shared/procedure_card_schema.md:75`
- Claim: The private procedure-card schema is conforming today, but the required-field lint can be silently skipped on the next card edit because it is documented as a manual pre-publish check and the existing canon checker still has no `procedures/` coverage.
- Evidence: The schema says, "Before publishing or updating a card, verify the card passes this local lint," then lists a 10-point text lint rather than a runnable checker. Its publication checklist is also a manual markdown checklist. Evidence: `.opencode/skills/sk-design/shared/procedure_card_schema.md:75`, `.opencode/skills/sk-design/shared/procedure_card_schema.md:79`, `.opencode/skills/sk-design/shared/procedure_card_schema.md:147`.
- Current conformance: The sampled live cards have frontmatter, `## 1. REQUIRED FIELDS`, the required table, and numbered sections. Evidence: `.opencode/skills/sk-design/design-interface/procedures/deck_direction_spec.md:17`, `.opencode/skills/sk-design/shared/procedures/polish_gate_orchestration.md:17`, `.opencode/skills/sk-design/design-md-generator/procedures/design_system_extraction.md:17`.
- Enforcement gap: Phase 007 explicitly re-confirmed that the canon checker has no `procedures` visibility, and its known limitations/follow-up leave automated `procedures/` enforcement optional future work. Evidence: `.opencode/specs/sk-design/009-sk-design-claude-parity/007-procedure-card-template-alignment/implementation-summary.md:109`, `.opencode/specs/sk-design/009-sk-design-claude-parity/007-procedure-card-template-alignment/implementation-summary.md:124`, `.opencode/specs/sk-design/009-sk-design-claude-parity/007-procedure-card-template-alignment/implementation-summary.md:148`.
- Counterevidence sought: I checked the schema, Phase 007 verification records, and sampled cards for a current conformance failure; none was found. The issue is future drift risk, not present invalid cards.
- Alternative explanation: The team may intentionally keep procedure cards lightweight and manually reviewed because they are private mode guidance. That is acceptable, but the schema now presents a required lint contract without a machine gate.
- Final severity: P2. This is a maintainability guardrail gap, not a P1 correctness/spec mismatch, because current cards conform and the risk triggers on future edits.
- Confidence: 0.82.
- Downgrade trigger: Downgrade to no finding if a runnable checker or validation rule already exists outside the reviewed surfaces and is documented as required for every procedure-card edit.
- Finding class: matrix/evidence.
- Affected surface hints: `shared/procedure_card_schema.md`, fourteen `procedures/*.md` cards, `parent-skill-check.cjs`, future procedure-card edits.
- Recommendation: Add a small procedure-card lint check to the existing canon/validation path or add an explicit validation command to the schema and phase checklist so future card edits cannot skip the required-field/order checks silently.

#### P2-002 [P2] Byte-identical benchmark artifacts remain under two incompatible naming conventions

- File: `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md:253`
- Claim: Keeping the same benchmark evidence under both `benchmark/after-012-routing-rigor/report.{json,md}` and `benchmark/after-d3-proxy/skill-benchmark-report.{json,md}` creates a future maintainer trap: the folders look like separate benchmark runs but are documented as byte-identical duplicate evidence.
- Evidence: ADR-003 says the accepted run is content-identical to `after-d3-proxy/skill-benchmark-report.{json,md}`, confirmed by `diff`, and left untouched as an orphaned duplicate. The implementation summary repeats both the byte-identical verification and the optional future cleanup item. Evidence: `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md:253`, `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/implementation-summary.md:111`, `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/implementation-summary.md:124`, `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/implementation-summary.md:147`.
- Naming mismatch: The two markdown reports render the same report title, verdict, coverage, scores, scenario rows, and caveats, but one folder uses `report.md` while the other uses `skill-benchmark-report.md`. Evidence: `.opencode/skills/sk-design/benchmark/after-012-routing-rigor/report.md:1`, `.opencode/skills/sk-design/benchmark/after-d3-proxy/skill-benchmark-report.md:1`, `.opencode/skills/sk-design/benchmark/after-012-routing-rigor/report.md:5`, `.opencode/skills/sk-design/benchmark/after-d3-proxy/skill-benchmark-report.md:5`.
- Maintainer convention pressure: The benchmark README tells maintainers to add new baselines as sibling folders rather than overwrite the frozen baseline, so sibling benchmark folders are meaningful historical anchors. Evidence: `.opencode/skills/sk-design/benchmark/README.md:49`.
- Counterevidence sought: I checked Phase 012 docs for visibility. The duplicate is clearly documented, so this is not a traceability P1 or a false-completion defect.
- Alternative explanation: Leaving both artifacts was correct for the Phase 012 doc-only reconciliation scope, and deleting/renaming during review would have violated scope. The issue is only that future cleanup or canonical naming should be scheduled.
- Final severity: P2. This is an advisory maintenance/wayfinding issue, not a release blocker, because the duplicate is documented and no consumer breakage was confirmed.
- Confidence: 0.86.
- Downgrade trigger: Downgrade to no finding if a future cleanup phase consolidates the duplicate or adds a canonical alias/README note in the benchmark directory making one path explicitly deprecated.
- Finding class: matrix/evidence.
- Affected surface hints: `benchmark/after-012-routing-rigor/`, `benchmark/after-d3-proxy/`, `benchmark/README.md`, future Phase 012 benchmark follow-up.
- Recommendation: In a cleanup phase, either consolidate to one canonical folder/name or add a local `benchmark/README.md` section that marks `after-d3-proxy/` as an orphaned duplicate and names `after-012-routing-rigor/` as authoritative.

## Traceability Checks

| Check | Status | Evidence |
|-------|--------|----------|
| `spec_code` | Covered for maintainability, no new P1 | Procedure-card, feature-catalog, Phase 012, benchmark, and md-generator backend surfaces were checked against live files. |
| `checklist_evidence` | Covered, no new checklist-only defect | Phase 007 and Phase 012 verification records were checked for the maintainability claims under review. |
| `skill_agent` | Partial, no new defect | Procedure-card private guidance remains behind existing mode surfaces; no public mode/tool-surface escalation found in this pass. |
| `agent_cross_runtime` | Not applicable | Strategy marks this N/A for sk-design; no dedicated design agent family is in this packet. |
| `feature_catalog_code` | Covered, no new P1 | Root catalogs mostly summarize and link leaves; no duplicated long-form capability body was found. Existing P1-004 remains the catalog/code mismatch for report/preview overwrite semantics. |
| `playbook_capability` | Partial, no new defect | Procedure-card manual testing remains structurally documented; full live scenario execution remains outside this iteration. |
| `maintainability_drift` | Covered with two advisories | P2-001 and P2-002 record non-blocking future drift/wayfinding risks. |

## Search Depth

Scope class is complex. This iteration used graphless fallback because `code_graph_status` reported stale readiness. Target selection followed the maintainability prompt: procedure-card schema and sample cards, root feature catalogs across all six packages, benchmark duplicate artifacts and Phase 012 closeout docs, and md-generator backend scripts that own the active P1 seams. High-risk targets not exhaustively covered: executing the procedure-card manual playbook scenarios, byte-level diffing the duplicate JSON reports inside this pass, and designing or implementing the md-generator remediation modules.

## SCOPE VIOLATIONS

None. No reviewed target source/spec files were modified.

## Verdict

PASS for iteration 5 maintainability with advisories: two new P2 findings were recorded. No new P0 or P1 findings were discovered. The overall review loop remains CONDITIONAL because P1-001 through P1-004 are still active from prior iterations.

## Next Dimension

Iteration 6 should begin deeper revisit passes, starting with a focused revisit of md-generator P1 remediation design: prompt data isolation plus component facts, and shared output/artifact write policy across extraction, guided-run, report, preview, and proof.

Review verdict: PASS
