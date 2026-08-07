# Iteration 009: Adversarial final replay

## Focus

Final correctness and security replay for generic routing, bearer-token transport, release-derived paths, and read-before-write error handling.

## Files Reviewed

- `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:238-330`
- `.opencode/skills/mcp-tooling/mcp-obsidian/examples/mcp-roundtrip.sh:13-15,36-41,64-82`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/obsidian42-brat/workflows.md:53-79,107-119`
- `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/brat-headless-install.md:46-70,92-100`
- `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:7-39`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/*/{data-model.md,workflows.md,troubleshooting.md}`

## Scorecard

- Dimensions covered: correctness and security adversarial replay
- Generic `PLUGINS` route: still 4/11 resource families
- F004: `BASE_URL` override, bearer header, and unconditional `curl -sk` remain present; no verification-setting use
- F005: release manifest ID still reaches `.obsidian/plugins/$PLUGIN_ID` without safe-ID or realpath containment
- F006: catch-all read error still creates empty content before the write path; no 404 discriminator or rethrow
- Core target inputs: still absent; F001 remains evidenced
- Open findings after this iteration: P0=0 P1=5 P2=2
- New findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings - New

### P0, Blocker

- None.

### P1, Required

- None. The adversarial replay reconfirms existing findings without creating aliases or changing severity.

### P2, Suggestion

- None. F003 and F007 remain accepted P2 debt.

## Findings - Existing / Refined

- **F002** remains P1 because generic plugin intent does not load the six newer specific resource families.
- **F004** remains P1 because an environment-selected endpoint can receive the bearer token while TLS verification is disabled.
- **F005** remains P1 because a release-controlled manifest ID is interpolated into a filesystem destination without boundary validation.
- **F006** remains P1 because transport, auth, and server failures are treated like a missing note before writing replacement content.
- **F001**, **F003**, and **F007** remain open at their prior severities.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | blocked | core | `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:34-39` | Normative target inputs remain absent. |
| `checklist_evidence` | blocked | core | target root inventory | No checklist exists. |
| `feature_catalog_code` | pass | overlay | `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/FEATURE-CATALOG.md:199-267` | Eleven cards remain present. |
| `playbook_capability` | pass | overlay | `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:231-413` | Eleven playbook IDs remain present. |

## Assessment

The final adversarial replay finds no counterevidence to the five P1 findings. The documented normal-use assumptions lower practical likelihood for some paths, but they are not enforced by the examples or workflows. The review therefore remains conditional.

## Ruled Out

- A verification flag that changes the preflight's `curl -k` behavior.
- A manifest-ID allowlist or resolved-path containment guard in the cited BRAT flows.
- A status-aware not-found branch that protects the Code Mode write.
- A generic-route expansion that covers all eleven plugin reference families.

## Recommended Next Focus

Forced final stabilization pass across all review dimensions; stop only after iteration 10 under the max-iterations policy.

Review verdict: CONDITIONAL
