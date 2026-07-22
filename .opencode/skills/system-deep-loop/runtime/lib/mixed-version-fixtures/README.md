---
title: "Mixed-Version Fixtures: Old and New Runtime Compatibility Corpus"
description: "Authors, compiles and oracle-verifies fixture cases that mix old and new runtime versions across a mode cutover boundary."
---

# Mixed-Version Fixtures

---

## 1. OVERVIEW

Not a passive fixtures directory. This folder authors, seals and oracle-verifies a corpus of state-transition cases that mix old-runtime and new-runtime behavior (`pure-old`, `pure-new`, `mid-upgrade`, `interrupted-migration`) to prove that resume classification behaves correctly across a `system-deep-loop` mode cutover boundary. A compatibility adapter bridges the `compatibility-shadow` upcaster into these cases. A seal compiler produces hash-verified artifact references so a case replays byte-identically on every run.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `compatibility-adapter.ts` | `MixedVersionCompatibilityAdapter`: bridges compatibility-shadow state upcasting into mixed-version event and state definitions |
| `fixture-corpus.ts` | Authors the corpus of mixed-version cases across workstreams and scenario families, with manifest coverage assertions |
| `mixed-version-types.ts` | Scenario-family and resume-classification vocabularies plus case, causal-boundary and oracle contracts |
| `reducer-resume-oracle.ts` | Runs an authored case through frozen classification-manifest verification to prove correct resume disposition |
| `seal-compiler.ts` | Compiles authored cases into sealed, hash-verified artifact references for reproducible execution |
| `index.ts` | Public API barrel |

## 3. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/mixed-version-fixtures.vitest.ts`
