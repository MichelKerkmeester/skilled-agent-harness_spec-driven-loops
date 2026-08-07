# Iteration 004: Maintainability and verification-boundary review

## Focus

Maintainability pass over the newer plugin data models, package metadata, version markers, explicit `VERIFY` boundaries, and the relationship between executable routing and human-facing guidance.

## Files Reviewed

- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/charts/data-model.md:125-155,210-230`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/data-model.md:220-235,340-352`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/git/data-model.md:143-180`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/excalidraw/data-model.md:121-145,215-232`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/outliner/data-model.md:130-145`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/minimal/data-model.md:197-209`
- `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:1-39`
- `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/FEATURE-CATALOG.md:1-25`
- `.opencode/skills/mcp-tooling/mcp-obsidian/changelog/v1.2.0.0.md:1-40`

## Scorecard

- Dimensions covered: maintainability
- Explicit `VERIFY` markers in the six newer plugin data models: 17
- Open findings after this iteration: P0=0 P1=5 P2=2
- New findings: P0=0 P1=0 P2=1
- New findings ratio: 0.14

## Findings - New

### P1, Required

- None.

### P2, Suggestion

- **F007**: The six newer plugin data models retain 17 explicit `VERIFY` markers around schema, API, cache, credential-helper, and in-app state details. Examples include `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/charts/data-model.md:133,146`, `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/git/data-model.md:150-170`, and `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/excalidraw/data-model.md:125,224-230`. The markers are honest and guarded, but they leave copyable operational details dependent on later verification.

  Claim-adjudication packet:

  ```json
  {
    "findingId": "F007",
    "claim": "Seventeen explicit verification boundaries remain in the six newer plugin data models, leaving maintainability debt for copyable schema and API details.",
    "evidenceRefs": [
      ".opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/charts/data-model.md:133,146",
      ".opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/git/data-model.md:150-170",
      ".opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/excalidraw/data-model.md:125,224-230",
      ".opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/minimal/data-model.md:201"
    ],
    "counterevidenceSought": "Checked whether each marker is paired with a warning, a verified subset, or an explicit no-fabrication boundary; the package does so consistently.",
    "alternativeExplanation": "These markers may be the intended durable contract because the exact values vary by installed version, vault state, or in-app cache.",
    "finalSeverity": "P2",
    "confidence": 0.88,
    "downgradeTrigger": "Track the markers in a versioned verification ledger or resolve them against authoritative installed artifacts; absent that, retain them as accepted P2 debt rather than P1 correctness failures."
  }
  ```

## Findings - Existing / Refined

- **F001** through **F006** remain open with unchanged severities.
- The playbook metadata is current at `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:3,11,37`; no stale “three tie-ins” finding is raised in this lineage.
- No earlier finding was resolved or downgraded by the maintainability pass.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | blocked | core | `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:34-39` | Normative target inputs remain absent. |
| `checklist_evidence` | blocked | core | target root inventory | No checklist exists. |
| `feature_catalog_code` | pass | overlay | `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/FEATURE-CATALOG.md:21-25` | Catalog count and plugin section are current. |
| `playbook_capability` | pass | overlay | `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:3,11,37` | Metadata and body both say eleven. |

## Assessment

The package is explicit about uncertainty and generally prevents fabricated claims. The remaining 17 markers are maintainable only if downstream operators understand them as deliberate verification boundaries, not as settled schema. Metadata is otherwise aligned in the inspected files.

## Ruled Out

- Stale playbook count or description: current metadata says eleven.
- Stale feature-catalog entry count: current catalog says 31 total and 11 plugin/theme cards.
- A claim that every `VERIFY` marker is a defect: the markers are paired with guarded workflows and should not be “resolved” by guessing.

## Recommended Next Focus

Adversarial correctness/security replay: attempt counterexamples for the generic route, BRAT path boundary, MCP error handling, and token/TLS preflight before changing any severity.

Review verdict: CONDITIONAL
