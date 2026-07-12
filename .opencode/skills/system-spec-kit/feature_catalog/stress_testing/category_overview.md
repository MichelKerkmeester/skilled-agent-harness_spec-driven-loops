---
title: "Stress testing"
description: "Category covering operator-driven stress-test cycles and the automated MCP server Vitest stress harness for system-spec-kit releases."
trigger_phrases:
  - "stress testing"
  - "run stress test cycle"
  - "frozen corpus stress cycle"
  - "release-readiness findings rubric"
  - "how do I run a stress test for a spec-kit release"
version: 3.7.1.0
---

# Stress testing

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Category covering operator-driven stress-test cycles and the automated MCP server Vitest stress harness for system-spec-kit releases.

This category documents two stress-test surfaces. The manual surface gives operators a reproducible release-readiness cycle with frozen corpora, packet x dimension scoring, `findings.md`, and `findings-rubric.json`. The automated surface lives at `mcp_server/stress_test/` and runs opt-in Vitest suites for code-level stress, load, matrix, and benchmark coverage.

---

## 2. HOW IT WORKS

The shipped manual surface includes one execution playbook for the full stress-test cycle, a frozen-corpus convention reused across cycles, the `findings.md` plus `findings-rubric.json` artifact pair, a Hunter-Skeptic-Referee adversarial block for every REGRESSION candidate, optional telemetry capture under `measurements/`, prior-cycle comparison deltas, and strict packet validation as the closing gate.

The shipped automated harness is independent from the manual cycle. It uses `vitest.stress.config.ts` and six domain folders under `mcp_server/stress_test/`: `durability/`, `matrix/`, `memory/`, `search-quality/`, `session/`, and `substrate/`. Operators run it from `.opencode/skills/system-spec-kit/mcp_server` with the confirmed npm scripts `npm run stress`, `npm run stress:harness`, `npm run stress:matrix`, `npm run stress:substrate`, and `npm run stress:durability`.

The playbook-side viewpoint lives in `manual_testing_playbook/stress_testing/`. The pipeline-architecture catalog peer at `feature_catalog/pipeline_architecture/stress_test_cycle.md` documents the cycle as a pipeline feature; this category overview keeps the stress-testing inventory entry intact so the catalog and playbook stay structurally parallel.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `manual_testing_playbook/stress_testing/run_stress_cycle.md` | Playbook | Canonical operator flow for one full stress-test cycle |
| `manual_testing_playbook/stress_testing/README.md` | Playbook | Package map and ownership guide for the stress-test category |
| `templates/stress_test/findings.template.md` | Template | Report scaffold copied into the active packet as `findings.md` |
| `templates/stress_test/findings-rubric.template.json` | Template | Machine-readable sidecar scaffold copied as `findings-rubric.json` |
| `templates/stress_test/findings-rubric.schema.md` | Template | Field contract for rubric metadata, cells, aggregate math, and comparison data |
| `feature_catalog/pipeline_architecture/stress_test_cycle.md` | Catalog peer | Pipeline-side feature entry that documents the cycle as a release pattern |
| `mcp_server/stress_test/README.md` | Automated harness | Root README for the opt-in Vitest stress harness and domain map |
| `mcp_server/stress_test/durability/README.md` | Automated harness | Durability stress gate for checkpoint, recycle, re-election, and persistence cases |
| `mcp_server/stress_test/search-quality/README.md` | Automated harness | Search-quality stress harness, corpus, metric, and degraded-readiness coverage |
| `mcp_server/stress_test/substrate/README.md` | Automated harness | Local substrate runner, sandbox cleanup, and pure-logic substrate stress coverage |

### Validation

| File | Layer | Role |
|------|-------|------|
| `scripts/spec/validate.sh` | Validator | Strict packet validator run as the closing gate on every cycle packet |
| `.opencode/skills/sk-doc/scripts/validate_document.py` | Validator | Markdown structure and HVR validator for the playbook README and category overview |
| `mcp_server/package.json` | npm scripts | Defines `stress`, `stress:harness`, `stress:matrix`, `stress:substrate`, and `stress:durability` |
| `mcp_server/vitest.stress.config.ts` | Vitest config | Limits automated stress discovery to `mcp_server/stress_test/**/*.{vitest,test}.ts` |

---

## 4. SOURCE METADATA
- Group: Stress testing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `stress_testing/category_overview.md`
