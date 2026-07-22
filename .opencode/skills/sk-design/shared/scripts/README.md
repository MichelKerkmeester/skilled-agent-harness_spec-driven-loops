---
title: "Scripts: Shared Deterministic Gates for sk-design"
description: "Cross-mode Python and Node checkers plus their node:test coverage, reused by design-audit, design-foundations, and the hub-level command surface."
---

# Scripts: Shared Deterministic Gates for sk-design

---

## 1. OVERVIEW

`shared/scripts/` owns the deterministic gates and row-parsing helpers reused across sk-design modes, plus the `node:test` coverage for the two largest checkers. Python checkers here validate shared reference documents (`numeric-design-laws.md`, `variant-parameter-contract.md`, the proof-of-application card, procedure cards), while the Node checkers validate the `/interface:*` command surface itself against `command-metadata.json`, `mode-registry.json`, and `hub-router.json`.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `md_table.py` | Shared Markdown table parsing helpers (`_clean_cell`, `_strip_markdown`, `_split_table_row`, `_is_separator_row`) imported by every Python row checker in this file and in `design-audit/scripts` and `design-foundations/scripts`. |
| `numeric_law_check.py` | Completeness and uniqueness gate for `shared/numeric-design-laws.md`'s Law Index table: every row needs all six required cells filled and no duplicate values. |
| `variant_parameter_check.py` | Schema gate for `shared/assets/variant-parameter-contract.md`: every variant knob row must have its required cells filled and name every canonical transport. |
| `proof_check.py` | Proof-of-application gate for a filled context-loading notes file or `shared/assets/proof-of-application-card.md`: requires REGISTER/DIALS, CONTRAST PAIRS, INTERFACE PREFLIGHT, and AUDIT EVIDENCE fields plus a READY verdict. |
| `procedure-card-schema-check.mjs` | Automates rules 1-7 and 9 of the Required-Field Lint in `shared/procedure-card-schema.md` Section 4 against every `procedures/*.md` card: frontmatter fields and the seven required field rows (Purpose, Owning mode, Source reference, Trigger, Output contract, Proof gate, Privacy rule). Rules 8 and 10 stay a called-out manual review item. |
| `ai-fingerprint-fixture-check.mjs` | Cross-checks `design-audit/assets/ai-fingerprint-registry.json` against its fixture files: each registry tell has a matcher here and a real fixture under `design-audit/assets/ai-fingerprint-fixtures/`. |
| `ai-fingerprint-registry-check.mjs` | Validates the AI-fingerprint registry against the tells catalog: required fields present, `model_family` and `severity_floor` in their closed enums, and fixture IDs resolve to real fixture files. |
| `design-command-surface-check.mjs` | Validates the `/interface:*` command surface: every command in `command-metadata.json` carries its required fields, the auto/confirm YAML assets exist and match the registry, and intent-signal keys stay in sync with `design-interface/SKILL.md`. |
| `design-command-surface-check.test.mjs` | `node:test` coverage for `design-command-surface-check.mjs`'s exported helpers (`commandSetForModes`, `validateMetadata`, `validateDiscriminator`, and related parsers). |
| `interface-command-contract.test.mjs` | `node:test` coverage asserting the canonical `/interface:*` commands resolve to stable internal modes and that each command surface exposes its required output blocks (Route Proof, Resolved Brief, Context Manifest, Grounding Record, Creation/Remediation Artifact, Critique/Validation, Evidence Ledger, Next Action/Handoff). |

## 3. CONSUMERS

- `design-audit/scripts/perf_evidence_check.py` and `polish_readiness_check.py` import `md_table.py`.
- `design-foundations/scripts/baseline_rhythm_check.py`, `contrast_check.py`, and `naming_doc_check.py` import `md_table.py`.
- `shared/numeric-design-laws.md` and `shared/context-loading-contract.md` document `numeric_law_check.py` and `proof_check.py` as their own verification commands.

## 4. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/sk-design/shared/scripts/numeric_law_check.py <numeric-design-laws.md>
python3 .opencode/skills/sk-design/shared/scripts/variant_parameter_check.py <variant-parameter-contract.md>
python3 .opencode/skills/sk-design/shared/scripts/proof_check.py <notes.md>
node .opencode/skills/sk-design/shared/scripts/procedure-card-schema-check.mjs
node .opencode/skills/sk-design/shared/scripts/ai-fingerprint-registry-check.mjs
node --test .opencode/skills/sk-design/shared/scripts/*.test.mjs
```

Exit 0 means satisfied, exit 1 means a violation, exit 2 means a usage, read, or parse error for the Python checkers. The Node checkers accept `--json` where noted in-file.

## 5. RELATED

- [`../../SKILL.md`](../../SKILL.md) - sk-design hub, owner of the shared base.
- [`../procedure-card-schema.md`](../procedure-card-schema.md), [`../numeric-design-laws.md`](../numeric-design-laws.md) - the documents these gates enforce.
