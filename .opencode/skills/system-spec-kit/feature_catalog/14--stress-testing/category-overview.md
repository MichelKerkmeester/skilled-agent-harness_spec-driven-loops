---
title: "Stress testing"
description: "Category covering operator-driven stress-test cycles, including frozen corpora, packet x dimension scoring, narrative findings, machine-readable rubric sidecars, comparison deltas, and telemetry capture for system-spec-kit releases."
trigger_phrases:
  - "stress testing"
  - "run stress test cycle"
  - "frozen corpus stress cycle"
  - "release-readiness findings rubric"
  - "how do I run a stress test for a spec-kit release"
---

# Stress testing

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Category covering operator-driven stress-test cycles, including frozen corpora, packet x dimension scoring, narrative findings, machine-readable rubric sidecars, comparison deltas, and telemetry capture for system-spec-kit releases.

This category documents the manual stress-test surface that operators run when a release, remediation set, or subsystem change needs reproducible release-readiness evidence. The playbook peer captures the execution flow; this catalog category records the current shape of the surface as a stable inventory entry alongside its pipeline-architecture sibling.

---

## 2. HOW IT WORKS

The shipped surface now includes one execution playbook for the full stress-test cycle, a frozen-corpus convention reused across cycles, the `findings.md` plus `findings-rubric.json` artifact pair, a Hunter-Skeptic-Referee adversarial block for every REGRESSION candidate, optional telemetry capture under `measurements/`, prior-cycle comparison deltas, and strict packet validation as the closing gate.

The playbook-side viewpoint lives in `manual_testing_playbook/14--stress-testing/`. The pipeline-architecture catalog peer at `feature_catalog/14--pipeline-architecture/stress-test-cycle.md` documents the cycle as a pipeline feature; this category overview keeps the stress-testing inventory entry intact so the catalog and playbook stay structurally parallel.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `manual_testing_playbook/14--stress-testing/170-run-stress-cycle.md` | Playbook | Canonical operator flow for one full stress-test cycle |
| `manual_testing_playbook/14--stress-testing/README.md` | Playbook | Package map and ownership guide for the stress-test category |
| `templates/stress_test/findings.template.md` | Template | Report scaffold copied into the active packet as `findings.md` |
| `templates/stress_test/findings-rubric.template.json` | Template | Machine-readable sidecar scaffold copied as `findings-rubric.json` |
| `templates/stress_test/findings-rubric.schema.md` | Template | Field contract for rubric metadata, cells, aggregate math, and comparison data |
| `feature_catalog/14--pipeline-architecture/stress-test-cycle.md` | Catalog peer | Pipeline-side feature entry that documents the cycle as a release pattern |

### Validation

| File | Layer | Role |
|------|-------|------|
| `scripts/spec/validate.sh` | Validator | Strict packet validator run as the closing gate on every cycle packet |
| `.opencode/skills/sk-doc/scripts/validate_document.py` | Validator | Markdown structure and HVR validator for the playbook README and category overview |

---

## 4. SOURCE METADATA
- Group: Stress testing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `14--stress-testing/category-overview.md`
