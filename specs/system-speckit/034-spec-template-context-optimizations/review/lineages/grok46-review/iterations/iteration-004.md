# Iteration 4: D4 Maintainability — consolidation architecture, phase numbering, stale plan text

## Focus
Dimension: maintainability. Template consolidation vs the "shared core" claim, plan.md vs tasks.md phase numbering, leftover plan instructions that would regress shipped behavior, and placeholder continuity fingerprints.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 6
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=1 P2=0
- New findings ratio: 0.18

## Findings

### P0, Blocker
- None.

### P1, Required
- **F013**: Open plan/task text still tells a follow-on agent to ship AC_COVERAGE as warn, `specs/system-speckit/034-spec-template-context-optimizations/plan.md:84`, [Evidence: Phase 3 says "promote AC_COVERAGE to default-on at warn severity". `tasks.md:65` T030 is still `[ ]` with the same warn wording. Shipped behavior is INFO/advisory (`validator-registry.json:78`, `validation-rules.md:76`, `check-ac-coverage.sh:172` always `RULE_STATUS=pass`). An agent that "finishes" T030 as written would regress REQ-004.]
- **F009** (refined): `plan.md:90` Phase 4 still says apply the shared `enforceTokenBudget` helper, matching the unmet REQ-006 clause.

### P2, Suggestion
- **F014**: REQ-002 "one shared ungated core" is not a shared include, `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:1`, [Evidence: no shared core file exists under `templates/manifest/`. Each multi-level template carries its own inline `<!-- IF level:... -->` gates. Source did shrink (spec+plan+tasks+implementation-summary = 1314 lines). The architecture is per-template gated copies, not one core + addenda.]
- **F015**: Continuity fingerprints are the all-zero placeholder across every packet doc, `specs/system-speckit/034-spec-template-context-optimizations/spec.md:24`, [Evidence: `session_dedup.fingerprint` is `sha256:0000…0000` in spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, and decision-record.md. Resume/dedup cannot distinguish sessions.]

## Claim adjudication

```json
{
  "findingId": "F013",
  "claim": "plan.md Phase 3 and open task T030 still prescribe warn-severity AC_COVERAGE, which would regress the shipped INFO/advisory rule if executed.",
  "evidenceRefs": [
    "specs/system-speckit/034-spec-template-context-optimizations/plan.md:84",
    "specs/system-speckit/034-spec-template-context-optimizations/tasks.md:65",
    ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:78",
    ".opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh:172"
  ],
  "counterevidenceSought": "Checked whether T030 was marked done or annotated as superseded by the advisory decision. It is still [ ]. validation-rules.md already documents default-on INFO.",
  "alternativeExplanation": "Warn in the task list could mean 'the rule class is WARNING in the operator UI' while RULE_STATUS stays pass. Rejected: plan.md says warn severity as the promotion target, which is how the old dormant rule was described.",
  "finalSeverity": "P1",
  "confidence": 0.87,
  "downgradeTrigger": "If T030 is checked with a note that advisory/INFO superseded warn, and plan.md Phase 3 is rewritten, downgrade to P2.",
  "transitions": [
    { "iteration": 4, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | plan.md:84, spec.md.tmpl:1 | Phase-numbering note in tasks.md:35 addresses sibling F010 |
| checklist_evidence | partial | hard | tasks.md:65 | Open T030 is a maintainability footgun |

## Assessment
- New findings ratio: 0.18
- Dimensions addressed: maintainability
- Novelty justification: F013 is a new footgun (open warn-severity task vs shipped INFO). F014–F015 are new maintainability issues. F009 refined via plan.md Phase 4.

## Ruled Out
- plan.md vs tasks.md phase-number collision as an unmarked defect: [tasks.md:35 now has an explicit Phase-numbering note distinguishing lifecycle stages from impl phases P1–P4], [tasks.md:35]
- Template source not shrinking: [spec+plan+tasks+implementation-summary = 1314 lines, matching the packet's 2,931 → 1,314 claim], [wc -l]

## Dead Ends
- Looking for a shared `*-core.md.tmpl` include: none exists; consolidation is inline gating per file.

## Recommended Next Focus
Iteration 5 broadening pass: adversarial replay of all active P1s, overlay leftovers, and any remaining REQ-005 fixture proof.

Review verdict: CONDITIONAL
