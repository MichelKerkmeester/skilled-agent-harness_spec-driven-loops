# Iteration 006: Adversarial security replay

## Focus

Security replay using direct pattern checks for bearer-token transport, TLS configuration, release-derived path values, and read-error classification before writes.

## Files Reviewed

- `.opencode/skills/mcp-tooling/mcp-obsidian/examples/mcp-roundtrip.sh:13-41,64-82`
- `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:538-567`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/obsidian42-brat/workflows.md:53-79,107-119`
- `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/brat-headless-install.md:54-70,92-100`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/obsidian42-brat/troubleshooting.md:89-100,146-159`

## Scorecard

- Dimensions covered: security replay
- F004 pattern result: endpoint override + bearer header + `curl -sk`; no verification-setting use
- F005 pattern result: manifest-derived ID reaches destination; no safe-ID or containment check
- F006 pattern result: catch-all recreates empty content and precedes write; no 404 discriminator or rethrow
- Open findings after this iteration: P0=0 P1=5 P2=2
- New findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings - New

### P0, Blocker

- None.

### P1, Required

- None. The direct replay reconfirms F004, F005, and F006 without adding a duplicate finding.

### P2, Suggestion

- None. F003 and F007 remain unchanged.

## Findings - Existing / Refined

- **F004** remains P1: `BASE_URL` is overrideable, the bearer header is present, `curl -sk` is unconditional, and `OBSIDIAN_VERIFY_SSL` is not used by the preflight.
- **F005** remains P1: quoting is present but no validation prevents `..` segments or a resolved destination outside the plugin root.
- **F006** remains P1: the catch-all has no status check and writes after creating `{ content: "" }`.
- F001-F003 and F007 remain open with unchanged severity.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | blocked | core | `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:34-39` | Normative target inputs remain absent. |
| `checklist_evidence` | blocked | core | target root inventory | No checklist exists. |
| `feature_catalog_code` | pass | overlay | `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/FEATURE-CATALOG.md:199-267` | Catalog remains stable. |
| `playbook_capability` | pass | overlay | `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/brat-headless-install.md:46-121` | BRAT security boundary remains exposed in the scenario. |

## Assessment

The adversarial replay found no counterevidence that reduces the three security findings. The default loopback endpoint and normal trusted manifests reduce likelihood in ordinary use, but neither is an enforced boundary in the documented recipes.

## Ruled Out

- Token printing in the preflight output.
- Shell splitting from the cited BRAT path assignments.
- A documented 404-only error classifier in the MCP example.

## Recommended Next Focus

Traceability replay across cross-links, report claims, and finding evidence; ensure every surviving finding has a concrete source and no duplicate aliases.

Review verdict: CONDITIONAL
