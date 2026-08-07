# Deep Review Synthesis — plugin coverage review

## Outcome

Review target: `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review`

The detached lineage completed all 10 required review iterations under the `max-iterations` stop policy. The final verdict is **CONDITIONAL**: the overlay coverage is broad and internally traceable, but core acceptance remains blocked by missing normative target inputs and five active P1 findings.

Final finding counts:

- P0: 0
- P1: 5 active
- P2: 2 active
- Resolved: 0

Convergence before iteration 10 was treated as telemetry only, as requested. The terminal stop reason is `maxIterationsReached`.

## Findings

| ID | Severity | Status | Finding |
|---|---|---|---|
| F001 | P1 | active | The spec-folder target lacks normative `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` inputs needed to validate scope and acceptance evidence. |
| F002 | P1 | active | The generic `PLUGINS` route loads only 4/11 plugin/theme resource families; six newer families require specific intents. |
| F003 | P2 | active | The human resource-loading index omits newer plugin references even though executable specific maps exist. |
| F004 | P1 | active | The MCP preflight can send a bearer token to an environment-selected endpoint with TLS verification disabled by unconditional `curl -sk`. |
| F005 | P1 | active | BRAT interpolates a downloaded manifest ID into the plugin path without safe-ID validation or resolved-path containment. |
| F006 | P1 | active | The Code Mode example treats every `obsidian_get_note` error as a missing note and can write empty replacement content. |
| F007 | P2 | active | Six newer plugin data models retain 17 explicit verification boundaries for version-, cache-, or vault-dependent details. |

No finding was marked resolved without direct evidence. F007 was refined as accepted P2 maintainability debt rather than escalated or silently discarded.

## Dimension Coverage

### Correctness

The specific intent and resource-map inventory covers all 11 plugin/theme reference sets. The generic `PLUGINS` signal remains partial at 4/11, which leaves a real route-coverage gap for generic community-plugin requests.

### Security

The final replay reconfirmed three P1 paths:

- `examples/mcp-roundtrip.sh` uses an environment-selected base URL, sends the bearer header, and disables TLS verification with `curl -sk` without using a verification setting.
- The BRAT workflow and its manual-testing copy derive the destination directory from `manifest.id` without a safe identifier allowlist or realpath containment check.
- The Code Mode example catches all read errors, recreates empty content, and proceeds to the write path without distinguishing not-found from auth, transport, or server failures.

### Traceability

The overlay evidence is internally complete:

- 11/11 plugin reference directories.
- 11/11 feature-catalog cards.
- 33/33 required `data-model.md`, `workflows.md`, and `troubleshooting.md` siblings.
- 11 plugin tie-in files in the manual-testing playbook.
- 474 local Markdown links checked with 0 missing links.

The two core gates remain blocked because the configured spec-folder target has no `spec.md`, `plan.md`, `tasks.md`, or `checklist.md`. The existing target `review-report.md` records that absence but is not a substitute for normative acceptance criteria.

### Maintainability

The 17 `VERIFY` markers in the six newer data models are explicit and generally paired with warnings, verified subsets, or no-fabrication boundaries. They remain P2 debt because the package lacks a versioned verification ledger or authoritative installed-artifact resolution for those values. Catalog and playbook metadata were current at eleven plugins; all package shell scripts passed `bash -n`.

## Verification

Every iteration 1–10 passed the authoritative iteration verifier:

`OK iteration N complete: narrative + route-proof + delta`

The reducer passed after every iteration with zero corruption warnings, zero search debt, seven open findings, and no synthetic summary finding. The final state and all ten delta files parse as JSONL. The final artifact set contains prompts, narratives, deltas, dispatch receipts, state, registry, dashboard, strategy, and this report under the requested lineage directory.

## Stop Policy

- `loop_type`: `review`
- `config.stopPolicy`: `max-iterations`
- `config.maxIterations`: `10`
- `stopReason`: `maxIterationsReached`
- `convergenceTelemetryOnly`: `true`
- `review_dimensions`: `all`

## Execution Boundary

The lineage preserves the requested executor metadata: `cli-codex model=gpt-5.6-luna`, autonomous mode, and the exact fan-out artifact override. A nested executor launch was attempted but could not initialize its in-process app-server client under the current sandbox; no external path was written. The ten bounded review passes and all authoritative artifacts were completed within the bound lineage worker.

## Scope Boundary

All task-created outputs are confined to:

`.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review/lineages/luna-max`

No production source, target packet, sibling lineage, or user-global hook configuration was modified.

Review verdict: CONDITIONAL
