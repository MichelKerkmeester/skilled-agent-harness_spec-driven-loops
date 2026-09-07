---
title: "Validation Rules"
description: "Shell rule modules that validate spec folder structure, metadata and documentation state."
trigger_phrases:
  - "validation rules"
  - "check spec folder"
  - "spec validation scripts"
---

# Validation Rules

---

## 1. OVERVIEW

`runtime/cli/rules/` owns the shell modules used by `runtime/cli/spec/validate.sh`. Each rule reports through the shared `run_check()` interface and sets `RULE_*` variables that the validator reads.

Current state:

- Rule metadata and dispatch order come from `runtime/cli/lib/validator-registry.json`. The hop is `spec/validate.sh` → `runtime/dist/lib/validation/orchestrator.js` → that registry → one spawn per rule script; validate.sh never sources a rule itself.
- Authored rules validate packet files, template markers, anchors, sections and metadata.
- Runtime rules validate generated artifacts, save contracts, link scans and continuity support files.
- Shell modules stay small and defer shared logic to `runtime/cli/lib/` when possible.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         scripts/rules                            │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ validate.sh  │ ───▶ │ registry metadata│ ───▶ │ check-*.sh rules │
└──────┬───────┘      └────────┬─────────┘      └────────┬─────────┘
       │                       │                         │
       │                       ▼                         ▼
       │              ┌──────────────────┐      ┌──────────────────┐
       └──────────▶   │ scripts/lib/*    │ ◀─── │ RULE_* variables │
                      └────────┬─────────┘      └──────────────────┘
                               │
                               ▼
                      ┌──────────────────┐
                      │ validator output │
                      └──────────────────┘

Dependency direction: validate.sh ───▶ registry ───▶ rules ───▶ scripts/lib
```

---

## 3. DIRECTORY TREE

```text
rules/
+-- check-files.sh              # Required file checks by level
+-- check-template-source.sh    # Template source marker checks
+-- check-canonical-save-*.sh   # One save-time contract check per registry row
+-- check-canonical-save-*.cjs  # Each rule's decision, over the shared packet context
+-- check-canonical-save-shared.cjs             # Packet context the five canonical-save rules share
+-- check-graph-metadata.sh     # Graph metadata checks
+-- check-metadata-disk-consistency-helper.cjs  # Node helper for metadata/disk-path checks
+-- check-grep-convention-helper.mjs            # Node helper for the grep-convention rule
+-- check-links.sh              # Wikilink scan over this skill; LINKS_VALID row, also runs by hand
+-- check-*.sh                  # Additional focused rule modules
`-- README.md
```

The rule list is the set of rows in `../lib/validator-registry.json`; every row names one
`check-*.sh` file here. `check-links.sh` doubles as a hand-run scan over any skill tree, while its
`LINKS_VALID` row always scans this skill regardless of the packet being validated. Three Node helpers back the `.sh` rules that need logic bash cannot express directly:
`check-canonical-save-shared.cjs` behind the five canonical-save modules, `check-metadata-disk-consistency-helper.cjs` and
`check-grep-convention-helper.mjs`.

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `check-files.sh` | Confirms required packet files for the declared level. |
| `check-level-match.sh` | Compares declared level with required-file state. |
| `check-template-source.sh` | Verifies template-source metadata markers. |
| `check-canonical-save-root-spec.sh` | A live packet root must expose a canonical spec.md. |
| `check-canonical-save-source-docs.sh` | A live packet root graph must carry derived.source_docs. |
| `check-canonical-save-lineage.sh` | Graph writes on or after the cutoff must record save_lineage. |
| `check-canonical-save-packet-identity.sh` | Continuity, description and graph must agree on the packet identity. |
| `check-canonical-save-description-graph-freshness.sh` | Description and graph timestamps must stay within the slack window. |
| `check-links.sh` | Scans this skill for broken wikilinks on every validate run through `LINKS_VALID`; by hand it scans any skill tree. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Source shared shell helpers from `runtime/cli/lib/`. |
| Registry | Add or change public rule metadata in `runtime/cli/lib/validator-registry.json`. |
| Ownership | Keep rule-specific checks in `check-*.sh`. Keep orchestration in `runtime/cli/spec/validate.sh`. |
| Output | Set `RULE_NAME`, `RULE_STATUS`, `RULE_MESSAGE`, `RULE_DETAILS` and `RULE_REMEDIATION`. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ Developer runs validate.sh               │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Validator reads registry metadata        │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Rule module run_check() executes         │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ RULE_* result fields are collected       │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Validator prints text or JSON output     │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `runtime/cli/spec/validate.sh` | Shell command | Runs registered rule checks for a spec folder. |
| `run_check()` | Shell function | Executes one rule module against a target packet. |
| `runtime/cli/lib/validator-registry.json` | Registry | Defines rule aliases, severity and dispatch metadata. |

---

## 7. VALIDATION

Run from the repository root:

```bash
.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh <spec-folder> --strict
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/runtime/cli/rules/README.md
```

Expected result: spec validation passes or reports only accepted packet warnings, and README validation exits `0` with no HVR violations.

---

## 8. RELATED

- [Validator command](../spec/validate.sh)
- [Validator registry](../lib/validator-registry.json)
- [System Spec Kit skill](../../SKILL.md)
- [Spec templates](../../templates/README.md)
