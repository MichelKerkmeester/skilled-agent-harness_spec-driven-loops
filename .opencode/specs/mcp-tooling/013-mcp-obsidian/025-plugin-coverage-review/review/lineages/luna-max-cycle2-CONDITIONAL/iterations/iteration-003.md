# Iteration 003: Spec packet and shared contract alignment

## Focus

Traceability pass over the declared spec-folder target, core evidence inputs, the shared plugin operation contract, and the eleven-row data map.

## Files Reviewed

- `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:1-19`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/plugin-operation-logic.md:24-77`
- `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:268-333`
- `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/FEATURE-CATALOG.md:21-25`
- `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:26-39`

## Scorecard

- Dimensions covered: traceability
- Files reviewed: target packet root and shared contract surfaces
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P0, Blocker

- None.

### P1, Required

- **F001**: Target packet lacks normative review inputs — `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:3` — The spec-folder target has no `spec.md`, `plan.md`, `tasks.md`, or `checklist.md`, so the two core evidence protocols cannot establish spec-to-code or checklist support.
- **F002**: Shared plugin contract omits six newly covered plugins in its overview and relation note — `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/plugin-operation-logic.md:26` — The eleven-row data map is current, but the surrounding prose still names only Beancount, Tables, BRAT, Health.md, and Iconic; line 118 repeats the five-plugin loader description and omits Charts, Dataview, Excalidraw, Git, Outliner, and Minimal.

### P2, Suggestion

- None.

## Claim Adjudication

```json
{
  "F001": {
    "claim": "The declared spec-folder target has no normative spec, plan, task, or checklist inputs.",
    "evidenceRefs": [".opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:3"],
    "counterevidenceSought": "Listed the target root and searched for spec.md, plan.md, tasks.md, and checklist.md; none exists.",
    "alternativeExplanation": "This may be an intentionally review-only packet, but review_target_type=spec-folder requires normative inputs for the core protocols.",
    "finalSeverity": "P1",
    "confidence": 0.99,
    "downgradeTrigger": "A complete target packet with normative spec and checklist evidence is added and reconciled with the shipped skill.",
    "transitions": []
  },
  "F002": {
    "claim": "The shared plugin operation contract's overview and loader note cover only five of the eleven plugin surfaces.",
    "evidenceRefs": [".opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/plugin-operation-logic.md:26", ".opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/plugin-operation-logic.md:118"],
    "counterevidenceSought": "Compared the prose with the eleven-row data map at lines 61-75, all eleven reference directories, and all eleven router entries.",
    "alternativeExplanation": "The five-plugin prose may be an intentionally scoped historical example, but it is written as the current general contract and relation to the mode.",
    "finalSeverity": "P1",
    "confidence": 0.97,
    "downgradeTrigger": "The prose is explicitly labeled historical or replaced with a complete eleven-plugin contract.",
    "transitions": []
  }
}
```

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | partial | hard | `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:3` | Normative target files are absent. |
| checklist_evidence | partial | hard | `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:3` | No checklist exists to reconcile. |
| feature_catalog_code | pass | advisory | `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/FEATURE-CATALOG.md:23` | Catalog declares eleven plugin cards and the inventory is present. |
| playbook_capability | pass | advisory | `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:37` | The root index declares OBS-011..OBS-021. |

## Assessment

- Both P1 findings have direct file-and-line evidence and typed adjudication packets.
- The router and data map are more complete than the shared contract prose; this is a documentation consistency gap, not evidence that the six implementations are absent.
- New findings ratio: 1.0.

## Ruled Out

- Missing implementation coverage for the six newer plugin families: route, reference, catalog, and playbook cells are present.
- A P0 contradiction: no security or correctness failure is demonstrated by the stale prose.

## Recommended Next Focus

maintainability and verification-boundary hygiene

Review verdict: CONDITIONAL
