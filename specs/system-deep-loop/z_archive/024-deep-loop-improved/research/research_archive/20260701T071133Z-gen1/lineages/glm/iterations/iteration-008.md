# Iteration 008: ADR Phases Missing decision-record.md and checklist.md

## Focus
- Scope: ADR-named phases across 003-deep-loop-workflows — missing decision-record.md and checklist.md
- Question: Do all ADR phases have decision-record.md?

## Findings

### F-008: ADR phases missing decision-record.md — only 1 of 3 ADR phases has one

**Severity: High (ADR phase without a decision record is an oxymoron)**

Phase 003-deep-loop-workflows has three sub-phases with `-adr` in their names (indicating they are decision-record phases):

| Sub-phase | Has decision-record.md? | Has checklist.md? |
|-----------|------------------------|-------------------|
| `002-convergence-profile-unification-adr` | **YES** | NO |
| `003-cross-mode-anti-convergence-adr` | **NO** | NO |
| `005-anchor-ownership-conflict-adr` | **NO** | NO |

[SOURCE: `003-deep-loop-workflows/002-convergence-profile-unification-adr/` (has decision-record.md)]
[SOURCE: `003-deep-loop-workflows/003-cross-mode-anti-convergence-adr/` (no decision-record.md)]
[SOURCE: `003-deep-loop-workflows/005-anchor-ownership-conflict-adr/` (no decision-record.md)]

**Root cause:** The ADR phases were scaffolded with the standard Level-1 template set (spec.md, plan.md, tasks.md, implementation-summary.md) but the `decision-record.md` was only created for 002. The other two ADR phases completed implementation (their implementation-summary.md says `completion_pct: 100`) but never produced the actual decision record document that their name implies.

**What the ADR phases should contain:**
- `003-cross-mode-anti-convergence-adr`: Should document the decision to project the `antiConvergence` contract across all four mode configs (research, review, ai-council, context)
- `005-anchor-ownership-conflict-adr`: Should document the decision to add `resolveQuestionConflicts()` and make `key-questions` a generated projection (resolving anchor ownership between spec.md and generated content)

**checklist.md absence:** None of the 12 sub-phases in 003 have a `checklist.md`. At Level 2 (100-499 LOC), checklist.md is required. The 003 parent spec is at SPECKIT_LEVEL: 2. However, the sub-phases may be Level 1 (each <100 LOC), which doesn't require checklist.md. This needs verification per sub-phase.

**Impact:**
1. An ADR phase without a decision record fails its core purpose — the architectural decision is undocumented
2. Future maintainers encountering `resolveQuestionConflicts()` or the anti-convergence projection have no ADR to reference for the "why"
3. The validation suite may not catch this because the template doesn't enforce decision-record.md for `-adr` named folders

**Recommendation:**
1. **Immediate:** Create `decision-record.md` for `003-cross-mode-anti-convergence-adr` and `005-anchor-ownership-conflict-adr`, backfilling from the spec.md context and implementation-summary.md
2. **Validation:** Add a validate.sh rule: folders matching `*-adr/` MUST contain `decision-record.md`
3. **Template:** When the spec-kit scaffolder creates a `-adr` named folder, auto-include `decision-record.md` from the template

## Novelty Justification
Confirmed only 1 of 3 ADR phases has the decision record. Identified that checklist.md is absent across ALL 12 sub-phases (new systemic finding). The validate.sh gap (no enforcement of decision-record.md for ADR folders) is a new recommendation.

## What Was Tried and Failed
- Checked if the ADR content was embedded in spec.md instead (it was not — spec.md contains the problem/scope but not the formal decision record with context/decision/consequences)

## Ruled-Out Directions
- The ADR phases are NOT non-ADR phases with misleading names (their spec.md explicitly describes architectural decisions)
