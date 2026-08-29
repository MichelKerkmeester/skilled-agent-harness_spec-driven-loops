# Iteration 4: D4 Maintainability — Cross-doc structure, template consolidation quality, naming clarity

## Focus
Dimension: maintainability. Scope: phase-naming consistency between plan.md and tasks.md, template consolidation structure, REQ-003 read-path documentation quality, comment hygiene in the new rule, and the packet's self-documentation of its four-phase structure.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 8
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.64

## Findings

### P1, Required
- **F010**: Cross-doc phase-number collision — "Phase N" means different workstreams in plan.md vs tasks.md, `specs/system-speckit/034-spec-template-context-optimizations/plan.md:70`, [Evidence: plan.md Phase 1/2/3/4 = research gating / consolidation+read-safety / validation gates / memory budget (plan.md:70-88). tasks.md Phase 1/2/3 = Setup / Implementation / Verification lifecycle (tasks.md:39-73), and the four implementation workstreams are re-labeled "Impl Phase P1..P4" (tasks.md:52-66). An operator told to "work Phase 2" gets different work from each doc, and REQ-to-task traceability (REQ-001..006 → Impl Phase P1..P4) is one extra indirection layer with no mapping table.]

### P2, Suggestion
- **F011**: Template consolidation partially undermines the "shared core" claim — the four consolidated templates still carry 71/30/20/18 inline gate markers, `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:1`, [Evidence: grep counts `IF level` markers: spec 71, plan 30, tasks 20, impl-summary 18. REQ-002/plan.md Phase 2 describe "ONE shared ungated core + per-level gated addenda" — the diff shows consolidation removed ~2,017 lines, but the per-level gating remains inline per template (each template still self-contains its level logic rather than importing a shared core). The byte-identical gate protects output, but the "shared core" architectural claim is only partially realized; worth stating precisely in the completion narrative.]
- **F012**: AC_COVERAGE escape-hatch semantics are undocumented at the packet level — ADR-003 references the escape hatch but no packet doc explains how a reviewer classifies "Manual-infeasible", `specs/system-speckit/034-spec-template-context-optimizations/decision-record.md:58`, [Evidence: ADR-003 (decision-record.md:58) says "preserving the manual-infeasible escape hatch" without defining the classification criteria or the evidence rule (the rule itself at check-ac-coverage.sh:147 requires evidence_l non-empty AND class matching manual+automation+infeasible — a brittle three-token string match). A future implementer cannot reproduce the classification without reading the rule source.]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | plan.md:70 vs tasks.md:39 | Phase-number collision is a plan-vs-tasks contract drift |
| checklist_evidence | pass | hard | checklist.md | No false completion marks |

## Assessment
- New findings ratio: 0.64
- Dimensions addressed: maintainability
- Novelty justification: F010 naming collision and F012 escape-hatch doc gap are new; F011 refines the REQ-002 claim with measured gate-marker counts.

## Ruled Out
- "Consolidation is complete per REQ-002": [gate markers remain inline in each template; the shared-core architecture is partial], [grep IF level counts]
- "Phase naming is unambiguous": [plan.md Phase N ≠ tasks.md Phase N], [heading comparison]

## Dead Ends
- None.

## Recommended Next Focus
Broaden: re-audit research.md.tmpl gating completeness (REQ-001) against the per-level render contract — verify each level renders the intended sections and the phase level is handled.

Review verdict: CONDITIONAL