---
title: "Create-skill scripts"
description: "Lifecycle, metadata, leaf-manifest and compiled-routing utilities used by the create-skill workflows."
trigger_phrases:
  - "create-skill scripts"
  - "leaf manifest generator"
  - "skill package validation"
---

# Create-skill scripts

---

## 1. OVERVIEW

`scripts/` owns the command-line tooling for initializing, packaging and validating skills, generating leaf manifests, refreshing derived skill data and checking compiled-routing assets. The `lib/` and `tests/` directories are separate source zones with their own READMEs.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `ci-leaf-manifest-freshness.cjs` | Checks committed leaf manifests for byte drift. |
| `ci-skill-derived-freshness.cjs` | Checks generated skill-derived files for freshness. |
| `ci-skill-root-metadata.cjs` | Enforces skill-root metadata class rules. |
| `generate-leaf-manifest.cjs` | Generates or checks a hub leaf manifest. A starting root or declared scope that resolves outside the skill fails with `LEAF_SYMLINK_OUT_OF_ROOT`, and so does a leaf link that escapes the skill. A link that stays inside the skill is listed under its own path. `--write` refuses a `leaf-manifest.json` that is a link, with `symbolic link, not followed` in the error and a non-zero exit, and otherwise writes the manifest through a temporary sibling renamed over it. |
| `init_skill.py` | Scaffolds a skill directory. |
| `package_skill.py` | Validates and packages a skill directory. |
| `regenerate-skill-derived.cjs` | Regenerates derived skill data. |
| `leaf-route-replay.cjs` | Replays the stage-two `ROUTER.md` keyword block with zero model calls, recounts `ROUTER.md` reads behind `--transcripts` and compares the prose arm behind `--prose`. |
| `validate-compiled-routing-scenarios.cjs` | Validates compiled-routing scenario content. |
| `validate-playbook-topology.cjs` | Validates manual playbook topology. |
| `validate_skill_package.py` | Runs skill and parent-hub package validation. |

---

## 3. BOUNDARIES

- `lib/` contains pure contracts used by the generators.
- `tests/` contains self-running Node regression scripts.
- Generated manifests and derived files are written only by their owning generator commands.

---

## 4. VALIDATION

Run syntax checks for the Node entrypoints from the repository root:

```bash
for script in .skilled/skills/sk-doc/sk-create-skill/scripts/*.cjs; do node --check "$script"; done
```

Use the package-specific commands in the create-skill workflow when validating a skill or hub.

---

## 5. RELATED

- [`Create-skill library`](./lib/README.md)
- [`Create-skill tests`](./tests/README.md)
- [`Create-skill workflow`](../SKILL.md)
