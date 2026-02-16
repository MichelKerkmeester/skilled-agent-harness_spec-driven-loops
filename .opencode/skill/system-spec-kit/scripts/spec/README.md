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

The `scripts/spec/` directory is the shell-based spec lifecycle layer.

## Current Inventory

- `create.sh` - create new spec folders from templates
- `upgrade-level.sh` - upgrade existing folders to `2`, `3`, or `3+`
- `check-placeholders.sh` - detect unresolved bracket placeholders after upgrades
- `validate.sh` - orchestrate modular validation rules
- `check-completion.sh` - enforce completion gate before claiming done
- `calculate-completeness.sh` - compute checklist completion metrics
- `recommend-level.sh` - recommend level from task signals
- `archive.sh` - archive completed or stale specs

## Upgrade Flow (Spec124/128/129)

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

## Completion Gate

Before completion claims:

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh specs/003-system-spec-kit/130-memory-overhaul-and-agent-upgrade-release
```

## Notes

- `upgrade-level.sh` supports `--dry-run`, `--json`, `--verbose`, and `--keep-backups`.
- `create.sh` supports `--subfolder` for subfolder-based work inside an existing spec folder.
