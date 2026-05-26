---
title: "Spec Scripts"
description: "Spec lifecycle shell entrypoints for create, upgrade, validation, completion checks and archival."
trigger_phrases:
  - "spec scripts"
  - "upgrade spec level"
  - "validate spec folder"
  - "check placeholders"
---

# Spec Scripts

---

## 1. OVERVIEW

`scripts/spec/` owns shell entrypoints for spec folder lifecycle work. It creates packet folders, upgrades documentation levels, validates structure, checks completion state and archives finished or stale folders.

Current state:

- Shell scripts are the public command surface for spec lifecycle operations.
- Validation delegates rule checks to `../rules/` and shared helpers in `../lib/`.
- Scripts accept explicit spec folder paths and are intended to run from the repository root.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────╮
│                         SPEC SCRIPTS                         │
╰──────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌────────────────┐      ┌────────────────┐
│ Operator     │ ───▶ │ create.sh      │ ───▶ │ Spec folder    │
│ or command   │      │ upgrade-level  │      │ files          │
└──────┬───────┘      └───────┬────────┘      └───────┬────────┘
       │                      │                       │
       │                      ▼                       ▼
       │              ┌──────────────┐       ┌────────────────┐
       └────────────▶ │ validate.sh  │ ───▶  │ rules/check-*  │
                      └──────┬───────┘       └───────┬────────┘
                             │                       │
                             ▼                       ▼
                      ┌──────────────┐       ┌────────────────┐
                      │ completion   │       │ lib/*.sh       │
                      │ and archive  │       │ helpers        │
                      └──────────────┘       └────────────────┘

Dependency direction: spec/*.sh ───▶ rules/*.sh ───▶ lib/*.sh
```

---

## 3. PACKAGE TOPOLOGY

```text
scripts/spec/
+-- create.sh                    # Scaffold spec folders from templates
+-- upgrade-level.sh             # Add level-owned docs and sections
+-- check-placeholders.sh        # Detect unresolved template placeholders
+-- validate.sh                  # Run structural validation rules
+-- progressive-validate.sh      # Staged validation helper
+-- check-completion.sh          # Verify completion checklist state
+-- calculate-completeness.sh    # Report checklist completion metrics
+-- recommend-level.sh           # Recommend documentation level from task signals
+-- archive.sh                   # Move completed or stale spec folders
+-- check-template-staleness.sh  # Compare generated docs with templates
+-- quality-audit.sh             # Batch quality audit helper
`-- README.md
```

Allowed direction:

- `spec/*.sh` may source shared shell helpers from `../lib/`.
- `validate.sh` may call validation rules from `../rules/`.
- Lifecycle scripts may read templates and write only the selected spec folder.

Disallowed direction:

- Rule scripts should not mutate spec content.
- Shell helpers should not call spec lifecycle entrypoints.
- Spec scripts should not depend on generated `dist/` output.

---

## 4. KEY FILES

| File | Role |
|---|---|
| `create.sh` | Creates new Level 1 or phase folders from templates. |
| `upgrade-level.sh` | Adds missing files and sections for higher documentation levels. |
| `validate.sh` | Runs the modular validation gate used before completion claims. |
| `check-completion.sh` | Confirms checklist evidence before a task is called complete. |
| `progressive-validate.sh` | Runs a staged validation pass for detect, fix, suggest and report flows. |
| `archive.sh` | Moves completed or stale spec folders into the archive area. |

---

## 5. BOUNDARIES AND FLOW

Main validation flow:

```text
╭──────────────────────────────╮
│ Repository-root command      │
╰──────────────────────────────╯
              │
              ▼
┌──────────────────────────────┐
│ scripts/spec/validate.sh     │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Load lib shell helpers       │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Run rules/check-*.sh         │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Print pass, warning or error │
└──────────────────────────────┘
```

This folder owns shell orchestration only. Template content belongs under `templates/`, validation rule behavior belongs under `rules/` and shared shell primitives belong under `lib/`.

---

## 6. ENTRYPOINTS

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/create.sh specs/<name>
bash .opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh specs/<name> --to 3
bash .opencode/skills/system-spec-kit/scripts/spec/check-placeholders.sh specs/<name>
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/<name> --strict
bash .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh specs/<name>
```

---

## 7. VALIDATION

Use repository-root commands:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/<name> --strict
bash .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh specs/<name>
```

Use `--recursive` with `validate.sh` when the target is a phase parent with child phase folders.

---

## 8. RELATED

- [`../README.md`](../README.md)
- [`../lib/README.md`](../lib/README.md)
- [`../rules/README.md`](../rules/README.md)
- [`../templates/README.md`](../templates/README.md)
