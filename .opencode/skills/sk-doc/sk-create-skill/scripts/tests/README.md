---
title: "Create-skill scripts tests"
description: "Self-running Node regression scripts for leaf resources, metadata freshness, compiled routing and scaffold journeys."
trigger_phrases:
  - "create-skill script tests"
  - "leaf-resource tests"
  - "compiled-routing scenario tests"
---

# Create-skill scripts tests

---

## 1. OVERVIEW

`tests/` contains self-running Node scripts. Each script invokes its assertions directly, prints a pass line and exits nonzero on failure.

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `advisor-index-handoff-contract.test.cjs` | Checks advisor handoff documentation and verification-state vocabulary. |
| `ci-leaf-manifest-freshness.test.cjs` | Checks leaf-manifest freshness traversal. |
| `compiled-routing-lockstep-parity.test.cjs` | Checks compiled-routing lockstep fixtures and reports live parity. |
| `create-journey-proof.test.cjs` | Checks standalone and parent-hub create journeys. |
| `leaf-resource-contract.test.cjs` | Tests typed leaf-resource identity behavior. |
| `skill-derived-regenerator.test.cjs` | Tests derived-data regeneration and freshness behavior. |
| `skill-root-metadata-contract.test.cjs` | Tests skill-root metadata classification and fleet conformance. |
| `validate-compiled-routing-scenarios.test.cjs` | Tests compiled-routing scenario admission fixtures. |
| `validate-playbook-topology.test.cjs` | Tests playbook topology parsing and validation. |

## 3. VALIDATION

Run the source inventory from the repository root:

```bash
cd .opencode/skills/sk-doc/sk-create-skill/scripts/tests
for test_file in ./*.test.cjs; do node "$test_file"; done
```

Expected result: every script prints its pass line and exits successfully. The recorded source run passed the full current test inventory.

## 4. RELATED

- [`Create-skill scripts`](../README.md)
- [`Create-skill library`](../lib/README.md)
