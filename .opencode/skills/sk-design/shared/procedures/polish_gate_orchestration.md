# Polish Gate Orchestration

| Field | Value |
|---|---|
| Purpose | Coordinate final pre-delivery design review across accessibility, anti-slop, hierarchy/rhythm, and interaction states. |
| Owning mode | `shared`; owning reviewer: `design-audit` |
| Source reference | `polish-pass.md` |
| Trigger | Use when a built or planned design needs a final polish, release-readiness review, or stakeholder-facing quality gate that spans multiple review dimensions. |
| Output contract | A consolidated review plan or findings report grouped into blockers, quality issues, polish recommendations, open decisions, and out-of-scope observations. |
| Proof gate | The report covers accessibility, anti-slop, hierarchy/rhythm, and interaction states; duplicates are merged; P0/P1 issues are surfaced before polish notes. |
| Privacy rule | This shared private card is internal orchestration only and does not create a public polish-pass skill. |

## Placement Rationale

This card spans four existing modes: `design-audit` owns findings and severity, `design-foundations` owns hierarchy and rhythm fixes, `design-motion` owns interaction-state and transition standards, and `design-interface` owns visual-direction repair. Keeping the orchestration shared avoids duplicating the same final-gate workflow in multiple mode folders while preserving `design-audit` as the reviewer.

## Read-Only Compatibility

Read-only modes may cite the shared card to produce a review plan, findings report, or handoff. They must not require Write, Edit, Bash, or file mutation to use it.

## Procedure

1. Resolve whether the surface is ready for polish or still structurally mid-flight.
2. Cover accessibility, AI-template risk, hierarchy/rhythm, and interaction states.
3. Collect all findings before filtering so minor but real issues are not lost.
4. Deduplicate overlapping findings and order them by release impact.
5. Route fixes to the owning mode or `sk-code`; do not silently apply them from audit-only contexts.
6. End with a concise verdict and any decisions the user must review.

## Related Cards

- `../design-audit/procedures/accessibility_audit.md`
- `../design-audit/procedures/ai_slop_check.md`
- `../design-foundations/procedures/hierarchy_rhythm_review.md`
- `../design-motion/procedures/interaction_states_pass.md`
