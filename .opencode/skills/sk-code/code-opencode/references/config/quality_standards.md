---
title: Config Quality Standards
description: Quality gates for JSON/JSONC configuration files in OpenCode, including comment policy, KISS/DRY, and SOLID-aligned boundary checks.
trigger_phrases:
  - "opencode config quality standards"
  - "jsonc comment policy"
  - "config quality gates"
  - "json config validation rules"
importance_tier: normal
contextType: implementation
version: 1.0.0.15
---

# Config Quality Standards

Quality gates for JSON/JSONC configuration files used by OpenCode system tooling.

---

## 1. OVERVIEW

### Purpose

Define deterministic configuration quality checks so config updates stay parseable, low-noise, and maintainable across mixed-language workflows.

### Scope

- JSON files (`.json`) with no comments.
- JSONC files (`.jsonc`) with bounded purposeful comments.
- Feature flags, thresholds, ranking constants, and runtime behavior controls.

---

## 2. P0 - HARD BLOCKERS

### Syntax and Parse Safety

- JSON/JSONC must parse cleanly.
- No duplicate keys.
- No trailing commas in strict JSON files.

### Header and Section Invariant

- JSONC uses numbered ALL-CAPS section headers for major blocks.
- Do not convert header style to sentence case or unnumbered variants.
- Header style checks are manual/checklist gates (not hard-failed by `verify_alignment_drift.py`).

### Deterministic Defaults

- Feature flags and fallback values must be explicit.
- If default-on behavior is used, opt-out semantics must be documented inline.

---

## 3. P1 - REQUIRED

### KISS for Config

- Keep keys and nesting minimal for current behavior needs.
- Avoid speculative branches for hypothetical future toggles.

### DRY for Config

- Repeated literals and thresholds should be centralized once and referenced consistently.
- Avoid copy-paste constants across sibling sections.

### SOLID-Aligned Boundary Checks

- **SRP**: each config section should control one behavior domain.
- **OCP**: add new behavior through new section entries before editing stable defaults.
- **LSP/ISP/DIP**: section consumers should not require special-case type branching due to inconsistent shape.

### Comment Policy (JSONC Only)

- Maximum 3 comments per 10 lines.
- Comments should explain WHY, not WHAT. No narrative comments.
- This policy is a P1 manual/checklist gate (not hard-failed by `verify_alignment_drift.py`).

---

## 4. P2 - RECOMMENDED

- Add a durable WHY comment for high-impact rules (never a spec-folder-internal id like `REQ-###`; see `../shared/universal_patterns/naming-and-commenting.md` §4).
- Keep key ordering stable (`$schema`, core flags, behavior config, advanced settings).
- Include value constraints in comments for opaque numbers.

---

## 5. VERIFICATION

```bash
# JSON and JSONC parse checks
python -m json.tool config.json
grep -v '^\s*//' config.jsonc | python -m json.tool

# Header and comment policy spot-checks (JSONC, manual review support)
rg -n "^// [0-9]+\\. [A-Z0-9 ()/:-]+$" .opencode/skills/sk-code/code-opencode/references/config
```

---

## 6. RELATED RESOURCES

- [quick_reference.md](./quick_reference.md)
- [style_guide.md](./style_guide.md)
- [code_organization.md](../shared/code_organization/overview-and-module-organization.md)
- [config_checklist.md](../../assets/checklists/config_checklist.md)
