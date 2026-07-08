---
title: "Self-target packaging profile"
description: "Adds a runtime/ Lane D self-target profile, schema fields, loop-contract guardrails, and command-level --self-target setup for dry-run-first self-improvement."
trigger_phrases:
  - "self-target packaging profile"
  - "runtime/ profile"
  - "allowedDiffRelpaths"
  - "frozenSurfaces"
  - "--self-target"
version: 1.17.0.1
---

# Self-target packaging profile

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Lane D can now describe `runtime/` as a self-improvement target without letting the candidate edit the scorer or harness it is being judged by. The profile defines frozen surfaces, editable technique docs, a complete allowed-diff allow-list, and session prefixes to exclude from polling or scoring. The `/deep:ai-system-improvement --self-target <profile>` command path validates those boundaries before compiling to the existing `non-dev-ai-system-refine` adapter invocation.

---

## 2. HOW IT WORKS

`assets/non_dev_ai_system/profiles/deep-loop-runtime.json` is the concrete self-target profile. It points at `.opencode/skills/runtime/`, freezes scorer and harness surfaces such as `run-benchmark.cjs`, `promote-candidate.cjs`, `convergence.cjs`, and `loop-lock.ts`, and only allows technique-doc edits under the runtime/ README and references.

`packaging_config.schema.json` recognizes the self-target metadata fields without making them required for older Lane D packagings: `frozenSurfaces[]`, `editableTechDocs[]`, `allowedDiffRelpaths[]`, and `excludedSessionPrefixes[]`. `loop_contract.md` documents the same four-field contract and the invariant that every editable doc must be allowed while every frozen surface must be absent from the allowed diff list.

The command-level `--self-target <profile>` guard resolves a bare profile ID under the Lane D profiles directory, validates the JSON against the packaging schema, checks the allow-list boundary, defaults to dry-run, requires a clean tree before `--live`, acquires the single-writer lock for live runs, and runs one serial candidate unless `--parallel` is explicitly passed. The flag is router-owned and is not forwarded to `loop-host.cjs`; after guard success, it compiles to `--mode=non-dev-ai-system-refine --packaging-root <resolved-root>`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/assets/non_dev_ai_system/profiles/deep-loop-runtime.json` | Profile | Defines the runtime/ packaging root, frozen scorer/harness surfaces, editable technique docs, allowed diff relpaths, and excluded session prefixes. |
| `.opencode/skills/system-deep-loop/deep-improvement/assets/non_dev_ai_system/packaging_config.schema.json` | Schema | Adds optional validation for `frozenSurfaces`, `editableTechDocs`, `allowedDiffRelpaths`, and `excludedSessionPrefixes`. |
| `.opencode/skills/system-deep-loop/deep-improvement/references/non_dev_ai_system/loop_contract.md` | Contract reference | Documents the self-target packaging-profile contract and command-level guard behavior. |
| `.opencode/commands/deep/ai-system-improvement.md` | Command router | Adds `--self-target <profile>` setup, dry-run default, clean-tree and lock requirements, serial default, and non-forwarding to loop-host. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/runtime/tests/unit/meta-loop-lane-d-packaging.vitest.ts` | Automated test | Asserts editable docs are allowed, frozen surfaces are excluded, schema fields exist without becoming required, and the command/contract document the self-target guard. |

---

## 4. SOURCE METADATA

- Group: Non-dev-ai-system mode
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--non-dev-ai-system/self-target-packaging-profile.md`
Related references:
- [guarded-refine-loop.md](guarded-refine-loop.md) -- Lane D guarded packaging refine loop
- [loop_contract.md](../../references/non_dev_ai_system/loop_contract.md) -- Packaging-owned loop contract
