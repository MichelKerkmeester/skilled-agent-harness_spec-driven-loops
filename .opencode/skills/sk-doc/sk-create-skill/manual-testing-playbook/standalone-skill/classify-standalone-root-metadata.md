---
title: "SKL-002 -- Classify standalone root metadata"
description: "This scenario validates standalone root metadata for `SKL-002`. It focuses on class S, authored declarations, generated manifests and forbidden hub files."
version: 1.2.0.1
---

# SKL-002 -- Classify standalone root metadata

This document captures the operator contract for `SKL-002`.

---

## 1. OVERVIEW

This scenario validates the root metadata class for a standalone skill. It checks that class S is selected from the absence of both parent declarations and that generated files are refreshed by the metadata gate.

### Why This Matters

The root class is a contract. A standalone root authors identity and leaf configuration. A hub root authors registry and router declarations. Adding one file from the other class creates a half-written or competing declaration.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKL-002` and inspect authored and generated metadata separately.

- Objective: classify a standalone root and produce the correct authored and generated metadata files
- Realistic user request: `My new skill is standalone. Which root metadata files should I author and which ones should the gate generate?`
- Prompt: `My new skill is standalone. Which root metadata files should I author and which ones should the gate generate?`
- Expected execution process: inspect the root, confirm it declares neither `mode-registry.json` nor `hub-router.json`, author `graph-metadata.json` and `leaf-manifest.config.json`, run `ci-skill-root-metadata.cjs --fix` and confirm fresh generated files.
- Expected signals: class S is named, `graph-metadata.json` and `leaf-manifest.config.json` are authored, `leaf-manifest.json` and `leaf-aliases.json` are generated and hub-only files are absent.
- Desired user-visible outcome: a standalone root with correct metadata ownership and fresh generated output.
- Pass/fail: PASS if the class and file ownership are correct and the gate is clean. FAIL if `description.json`, `mode-registry.json` or `hub-router.json` is added to the standalone root or generated files are hand-edited.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `My new skill is standalone. Which root metadata files should I author and which ones should the gate generate?`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKL-002 | Classify standalone root metadata | Classify a standalone root and produce the correct authored and generated metadata files | `My new skill is standalone. Which root metadata files should I author and which ones should the gate generate?` | 1. `agent: Read the standalone class row in references/shared/skill-root-metadata-contract.md` -> 2. `agent: Confirm the root declares neither mode-registry.json nor hub-router.json` -> 3. `agent: Author graph-metadata.json and leaf-manifest.config.json only` -> 4. `bash: node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix` -> 5. `bash: node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Step 1: class S is named. Step 2: both hub declarations are absent. Step 3: the authored set is correct. Step 4: generated manifests are refreshed. Step 5: the final gate is clean | The exact prompt, class row, root metadata listing, both gate transcripts with exit statuses and the final file ownership map | PASS if the authored and generated sets match class S and the final gate reports clean. FAIL if a hub-only file is present or generated output is hand-authored | 1. Compare the root files with the class S matrix. 2. Check that `leaf-manifest.json` and `leaf-aliases.json` match generated output. 3. Re-run the gate without `--fix` and read its exit status |

### Commands

1. `agent: Read the standalone class row in references/shared/skill-root-metadata-contract.md`
2. `agent: Confirm the root declares neither mode-registry.json nor hub-router.json`
3. `agent: Author graph-metadata.json and leaf-manifest.config.json only`
4. `bash: node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix`
5. `bash: node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`

### Expected

Step 1 resolves the root as class S. Step 2 confirms the discriminator. Step 3 authors the two semantic declarations. Step 4 generates the manifest and identity alias projection. Step 5 proves freshness and absence of forbidden hub files.

### Evidence

Capture the prompt, class matrix, root file listing, both gate outputs and exit statuses and the authored-versus-generated ownership map.

### Pass / Fail

- **Pass**: class S is explicit, only its authored files are hand-written, generated files are fresh and hub-only files are absent.
- **Fail**: the root is treated as a hub, a generated file is hand-edited or the final gate is not run.

### Failure Triage

1. Inspect the presence of registry and router declarations.
2. Compare the root file set with the class S matrix.
3. Regenerate derived files and compare the final gate output.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | Standalone metadata workflow |
| [`references/shared/skill-root-metadata-contract.md`](../../references/shared/skill-root-metadata-contract.md) | Class S matrix and generated-file ownership |
| [`scripts/ci-skill-root-metadata.cjs`](../../scripts/ci-skill-root-metadata.cjs) | Root metadata gate and generator |

---

## 5. SOURCE METADATA

- Group: STANDALONE SKILL
- Playbook ID: SKL-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `standalone-skill/classify-standalone-root-metadata.md`
