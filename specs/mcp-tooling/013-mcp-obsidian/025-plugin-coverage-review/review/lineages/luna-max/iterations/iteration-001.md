# Iteration 001: Plugin inventory and router correctness

## Focus

Correctness pass over the eleven plugin/theme coverage surfaces, specific-intent dispatch, the generic plugin route, and the target packet's review inputs.

## Files Reviewed

- `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:48-82`
- `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:163-333`
- `.opencode/skills/mcp-tooling/mcp-obsidian/README.md:192-225`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/plugin-operation-logic.md:24-77`
- `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/FEATURE-CATALOG.md:199-267`
- `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:7-39,368-413`
- `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:1-39`

## Scorecard

- Dimensions covered: correctness
- Markdown files inventoried: 132
- Local markdown links checked: 474; broken local links: 0
- Specific plugin routes: 11/11; generic `PLUGINS` route: 4/11
- New findings: P0=0 P1=2 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings - New

### P1, Required

- **F001**: The requested `spec-folder` target has no normative `spec.md`, `plan.md`, `tasks.md`, or `checklist.md`, so the review cannot prove acceptance criteria or checklist evidence. The existing target report explicitly labels this as a residual condition at `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:34-39`. This is self-referential to the review packet, but it remains a P1 evidence boundary for a spec-folder review.

  Claim-adjudication packet:

  ```json
  {
    "findingId": "F001",
    "claim": "A spec-folder review target lacks the normative inputs needed to validate scope and acceptance evidence.",
    "evidenceRefs": [
      ".opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:34-39"
    ],
    "counterevidenceSought": "Checked the target root inventory and the existing report for an alternate normative packet or checklist.",
    "alternativeExplanation": "The packet may intentionally be a report-only review artifact rather than an implementation spec.",
    "finalSeverity": "P1",
    "confidence": 0.97,
    "downgradeTrigger": "A scoped spec.md/plan.md/tasks.md/checklist.md set or an explicit non-spec target contract is added."
  }
  ```

- **F002**: A generic request matching `PLUGINS` loads only `plugin-operation-logic.md` plus the Finance, Tables, BRAT, and Iconic indexes, while six newer plugin/theme references are available only through specific intents. The generic signal is defined at `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:238-240`, and the incomplete generic resource set is at `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:326-330`; the newer specific resource maps begin at `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:291-325`. A generic “community plugin” request can therefore omit Charts, Dataview, Excalidraw, Git, Outliner, Minimal, and Health.md.

  Claim-adjudication packet:

  ```json
  {
    "findingId": "F002",
    "claim": "The generic PLUGINS route returns a partial plugin reference set despite the skill promising eleven plugin/theme surfaces.",
    "evidenceRefs": [
      ".opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:238-240",
      ".opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:291-330",
      ".opencode/skills/mcp-tooling/mcp-obsidian/README.md:192-194"
    ],
    "counterevidenceSought": "Checked every specific PLUGIN_* intent and confirmed that all eleven have dedicated resource maps.",
    "alternativeExplanation": "The generic route may intentionally provide only a starter subset and rely on follow-up disambiguation, but the code does not declare that limitation.",
    "finalSeverity": "P1",
    "confidence": 0.93,
    "downgradeTrigger": "The generic route is documented as intentionally partial with an explicit disambiguation/expansion contract, or it loads all eleven reference sets."
  }
  ```

### P2, Suggestion

- **F003**: The `Resource Loading Levels` section lists on-demand plugin references only through Iconic at `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:48-82`, while the router has six additional specific resource maps at `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:291-325` and the README advertises all eleven at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md:192-194`. The router is more complete than the human-facing loading index, so this is a documentation maintainability gap rather than a missing implementation path.

  Claim-adjudication packet:

  ```json
  {
    "findingId": "F003",
    "claim": "The human-facing resource-loading index omits six plugin/theme reference sets that the executable router supports.",
    "evidenceRefs": [
      ".opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:48-82",
      ".opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:291-325",
      ".opencode/skills/mcp-tooling/mcp-obsidian/README.md:192-194"
    ],
    "counterevidenceSought": "Checked the executable RESOURCE_MAP and all eleven plugin reference directories.",
    "alternativeExplanation": "The section may be intentionally abbreviated, but it is not labeled as an abbreviated index.",
    "finalSeverity": "P2",
    "confidence": 0.9,
    "downgradeTrigger": "The section is labeled as a partial example and links to the complete router/resource inventory."
  }
  ```

## Findings - Existing / Refined

- None in this lineage before iteration 001.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | blocked | core | `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:34-39` | Normative spec inputs are absent from the target root. |
| `checklist_evidence` | blocked | core | target root inventory | No target checklist exists to reconcile. |
| `feature_catalog_code` | pass | overlay | `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/FEATURE-CATALOG.md:199-267` | Eleven plugin cards are present. |
| `playbook_capability` | pass | overlay | `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:368-413` | OBS-011 through OBS-021 are indexed. |

## Assessment

The specific router matrix and plugin artifact inventory are complete, and all local Markdown links resolve. The generic plugin route is not complete, and the human resource-loading index does not expose the full specific route set. The target packet's own report acknowledges the missing normative inputs, so review conclusions are conditional on the implementation-surface evidence rather than acceptance criteria.

## Ruled Out

- Missing per-plugin reference directories: all eleven are present.
- Missing feature-catalog plugin cards: all eleven cards are present.
- Missing playbook plugin tie-ins: all eleven tie-in files are present and indexed.
- Broken local Markdown links: 474 local links checked; none broken.

## Recommended Next Focus

Security and destructive-operation boundaries in plugin workflows, fixtures, scripts, and token-handling guidance.

Review verdict: CONDITIONAL
