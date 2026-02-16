---
title: "Spec Scripts"
description: "Spec lifecycle scripts for create, upgrade, placeholder cleanup, validation, and completion checks."
trigger_phrases:
  - "spec scripts"
  - "upgrade spec level"
  - "validate spec folder"
  - "check placeholders"
importance_tier: "normal"
---


# Spec Scripts

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📋 CURRENT INVENTORY](#2--current-inventory)
- [3. 📌 UPGRADE FLOW (SPEC124/128/129)](#3--upgrade-flow-spec124128129)
- [4. 📌 COMPLETION GATE](#4--completion-gate)
- [5. 📝 NOTES](#5--notes)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. 📖 OVERVIEW

The `scripts/spec/` directory is the shell-based spec lifecycle layer.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:current-inventory -->
## 2. 📋 CURRENT INVENTORY


- `create.sh` - create new spec folders from templates
- `upgrade-level.sh` - upgrade existing folders to `2`, `3`, or `3+`
- `check-placeholders.sh` - detect unresolved bracket placeholders after upgrades
- `validate.sh` - orchestrate modular validation rules
- `check-completion.sh` - enforce completion gate before claiming done
- `calculate-completeness.sh` - compute checklist completion metrics
- `recommend-level.sh` - recommend level from task signals
- `archive.sh` - archive completed or stale specs


<!-- /ANCHOR:current-inventory -->
<!-- ANCHOR:upgrade-flow-spec124128129 -->
## 3. 📌 UPGRADE FLOW (SPEC124/128/129)


Canonical flow for upgrades:

```bash
# 1) Upgrade target level
bash .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh specs/003-system-spec-kit/130-memory-overhaul-and-agent-upgrade-release --to 3

# 2) AI auto-populate injected placeholder sections from existing spec context

# 3) Verify no placeholders remain
bash .opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh specs/003-system-spec-kit/130-memory-overhaul-and-agent-upgrade-release

# 4) Run full validation (includes anchor checks)
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/003-system-spec-kit/130-memory-overhaul-and-agent-upgrade-release
```

`validate.sh` executes modular rules in `scripts/rules/`, including `check-anchors.sh` for ANCHOR tag pairing.


<!-- /ANCHOR:upgrade-flow-spec124128129 -->
<!-- ANCHOR:completion-gate -->
## 4. 📌 COMPLETION GATE


Before completion claims:

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh specs/003-system-spec-kit/130-memory-overhaul-and-agent-upgrade-release
```


<!-- /ANCHOR:completion-gate -->
<!-- ANCHOR:notes -->
## 5. 📝 NOTES


- `upgrade-level.sh` supports `--dry-run`, `--json`, `--verbose`, and `--keep-backups`.
- `create.sh` supports `--subfolder` for subfolder-based work inside an existing spec folder.
<!-- /ANCHOR:notes -->
