---
title: "Create Skill Scripts: skill lifecycle and leaf-manifest tooling"
description: "Python CLIs that init, package and validate a skill folder, plus Node CLIs that generate and gate a hub's leaf-manifest and compiled-routing scenario/playbook contracts."
---

# Create Skill Scripts

---

## 1. OVERVIEW

`create-skill/scripts/` holds the tooling for the `/create:skill` and `/create:skill-parent` workflows. The Python scripts cover a skill's lifecycle: init, package and validate. The Node scripts cover a parent hub's leaf-manifest generation and its compiled-routing gates. `lib/` holds the pure leaf-resource identity library the manifest generator depends on. `tests/` holds the assert-based coverage for the Node scripts.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `init_skill.py` | Creates a new skill folder from template at a given path, validating the skill name as hyphen-case. |
| `package_skill.py` | Validates a skill folder against the skill-creation standards and packages it into a distributable zip. Validates only with `--check`. |
| `validate_skill_package.py` | Runs the completion checks required for a standalone skill or parent hub, including compiled-routing readiness markers in `SKILL.md`. |
| `generate-leaf-manifest.cjs` | Walks a hub's declared packets, normalizes every leaf resource through `lib/leaf-resource-contract.cjs` and writes or checks `leaf-manifest.json`. |
| `ci-leaf-manifest-freshness.cjs` | Fleet-wide CI gate that regenerates every committed `leaf-manifest.json` and fails on any byte drift. |
| `validate-playbook-topology.cjs` | Pre-dispatch gate for a hub's manual testing playbook: schema, manifest resolution and selected-map join checks on typed gold. |
| `validate-compiled-routing-scenarios.cjs` | Content admission gate for a hub's compiled-routing scenario matrix, hard-rejecting id-only or evidence-incomplete scenarios. |

## 3. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/sk-doc/create-skill/scripts/init_skill.py <skill-name> --path <path>
python3 .opencode/skills/sk-doc/create-skill/scripts/package_skill.py <path/to/skill-folder> --check
python3 .opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py <path/to/skill-folder>
node .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs --check <skillDir>
node .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs
```

Expected result: each script exits 0 when the target is valid or already up to date, nonzero with findings printed otherwise.

## 4. TESTS

- `.opencode/skills/sk-doc/create-skill/scripts/tests/`

## 5. RELATED

- [`lib/leaf-resource-contract.cjs`](lib/leaf-resource-contract.cjs)
- [`SKILL.md`](../SKILL.md)
- [`README.md`](../README.md)
