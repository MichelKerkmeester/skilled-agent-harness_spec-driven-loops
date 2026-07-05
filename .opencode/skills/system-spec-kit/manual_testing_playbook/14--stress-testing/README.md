---
title: "Stress Testing Manual Playbook"
description: "Section index and ownership guide for manual stress cycles plus automated stress harness cross-references in system-spec-kit."
audited_post_018: true
version: 3.7.1.0
---

# Stress Testing Manual Playbook

> Package map for the stress-test manual playbook, execution file, automated harness cross-reference, template pack and catalog cross-reference.

---

## 1. OVERVIEW

`manual_testing_playbook/14--stress-testing/` owns operator-facing stress-test steps for `system-spec-kit`. Use it when a release, remediation set, or subsystem change needs a reproducible manual stress cycle with a frozen corpus, scored cells, narrative findings, a rubric sidecar, comparison deltas and optional telemetry samples. Pair it with the automated `mcp_server/stress_test/` Vitest harness when the change needs code-level stress evidence.

Current state:

- One execution playbook covers stress-cycle setup, scoring, findings and telemetry capture.
- The folder links to the current feature catalog entry and stress-test template pack.
- The automated harness has six domains: `durability/`, `matrix/`, `memory/`, `search-quality/`, `session/`, and `substrate/`.
- The confirmed npm stress scripts are `stress`, `stress:harness`, `stress:matrix`, `stress:substrate`, and `stress:durability` in `mcp_server/package.json`.
- This README is the package map. The execution procedure stays in `run-stress-cycle.md`.

---

## 2. DIRECTORY TREE

```text
14--stress-testing/
+-- run-stress-cycle.md  # Execution procedure and verification rules
`-- README.md               # Package map and ownership guide
```

---

## 3. ENTRIES

| Entry | Responsibility |
|---|---|
| [01 - Run stress cycle](run-stress-cycle.md) | Guides corpus freeze, packet x dimension scoring, findings authoring, rubric output, prior-cycle comparison, telemetry sampling, packet validation and parent phase-map updates. |

---

## 4. KEY FILES

| File | Role |
|---|---|
| `run-stress-cycle.md` | Canonical operator flow for one full stress-test cycle. |
| `../../templates/stress_test/findings.template.md` | Report scaffold copied to the active packet as `findings.md`. |
| `../../templates/stress_test/findings-rubric.template.json` | Machine-readable sidecar scaffold copied as `findings-rubric.json`. |
| `../../templates/stress_test/findings-rubric.schema.md` | Field contract for rubric metadata, cells, aggregate math and comparison data. |
| `../../feature_catalog/14--pipeline-architecture/stress-test-cycle.md` | Current catalog entry for the stress-test cycle operator flow. |
| `../../mcp_server/stress_test/README.md` | Automated Vitest stress harness root, domain map and entrypoint list. |
| `../../mcp_server/package.json` | Source for the `npm run stress*` command surface. |

---

## 5. SCENARIO CONTRACT

Stress-test scenarios must identify the active corpus, target packet, scoring dimensions, expected findings format and evidence path before execution starts.

| Contract Item | Rule |
|---|---|
| Inputs | Use a frozen corpus and named target packet. |
| Scoring | Record packet x dimension scores in the active findings file. |
| Evidence | Capture command output, telemetry samples and validation results. |
| Output | Emit `findings.md` and `findings-rubric.json` in the active packet. |

---

## 6. TEST EXECUTION

Use [01 - Run stress cycle](run-stress-cycle.md) as the manual execution source. This README lists the available manual scenario entry, ownership rules and automated harness cross-reference.

Execution order:

1. Freeze the corpus or declare the first-run baseline.
2. Score every packet x dimension cell on the active 0-2 rubric.
3. Write `findings.md`, emit `findings-rubric.json` and record any `measurements/` samples.
4. Compare with the prior sidecar when one exists.
5. Run the owning packet's strict validator before publishing the verdict.

Automated harness entrypoints, run from `.opencode/skills/system-spec-kit/mcp_server`:

```bash
npm run stress
npm run stress:harness
npm run stress:matrix
npm run stress:substrate
npm run stress:durability
```

---

## 7. BOUNDARIES

| Boundary | Rule |
|---|---|
| Ownership | Keep execution steps in `run-stress-cycle.md`. |
| Templates | Keep reusable findings files in `templates/stress_test/`. |
| Catalog links | Keep current feature ownership in `feature_catalog/14--pipeline-architecture/stress-test-cycle.md`. |
| Automated harness | Keep code-level stress details in `mcp_server/stress_test/**/README.md`; this playbook only points operators to the harness and scripts. |
| Validator scope | Treat `validate_document.py` as README-focused. It does not prove that every playbook link or packet artifact exists. |

---

## 8. SOURCE METADATA

| Source | Path |
|---|---|
| Playbook root | `.opencode/skills/system-spec-kit/manual_testing_playbook/14--stress-testing/` |
| Feature catalog | `.opencode/skills/system-spec-kit/feature_catalog/14--pipeline-architecture/stress-test-cycle.md` |
| Template bundle | `.opencode/skills/system-spec-kit/templates/stress_test/` |
| Automated harness | `.opencode/skills/system-spec-kit/mcp_server/stress_test/` |

---

## 9. VALIDATION

Run from the repository root after README edits:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/manual_testing_playbook/14--stress-testing/README.md
```

Expected result: validation exits `0` and reports no HVR violations.

For a fuller quality check, also extract the structure and confirm the DQI remains in the good band or better:

```bash
python3 .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/system-spec-kit/manual_testing_playbook/14--stress-testing/README.md
```

---

## 10. RELATED

- [Run stress cycle](run-stress-cycle.md)
- [Stress test templates](../../templates/stress_test/README.md)
- [Stress test feature catalog entry](../../feature_catalog/14--pipeline-architecture/stress-test-cycle.md)
- [MCP server stress test harness](../../mcp_server/stress_test/README.md)
