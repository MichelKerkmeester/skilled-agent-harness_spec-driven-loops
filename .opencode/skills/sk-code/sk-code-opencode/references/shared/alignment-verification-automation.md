---
title: Alignment Verification Automation
description: Repeatable verifier guidance for recurring OpenCode alignment drift checks.
trigger_phrases:
  - "alignment drift verification"
  - "verify alignment drift script"
  - "opencode alignment checks"
  - "repeatable drift verifier"
importance_tier: normal
contextType: implementation
version: 1.0.0.18
---

# Alignment Verification Automation

This document describes the repeatable verifier introduced for recurring alignment drift checks.

## 1. OVERVIEW

### Purpose

Defines the operational contract for `verify_alignment_drift.py`, including:
- what rule categories are enforced;
- how severities (`ERROR`/`WARN`) are assigned;
- default vs strict CI failure behavior.
- which standards remain manual checklist gates.

### When to Use

Use this reference when tuning recurring checks or interpreting verifier output in automation.

## 2. SCRIPT

- Path: `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py`
- Purpose: run lightweight, deterministic, behavior-neutral checks across OpenCode system languages.

## 3. WHAT IT CHECKS

- **Common (all scanned files)**: UTF-8 readability and LF line endings (flags CRLF).
- **JavaScript (`.js/.cjs`)**: requires `'use strict';` near file top.
- **JavaScript ESM (`.mjs`)**: strict-mode directive is not enforced.
- **TypeScript (`.ts/.tsx/.mts`)**: requires a `MODULE:` header marker near file top, except test files and pattern assets.
- **Python (`.py`)**: requires `#!/usr/bin/env python3` and module docstring near file top.
- **Shell (`.sh`)**: requires `#!/usr/bin/env bash` and `set -euo pipefail` near file top.
- **JSON (`.json`)**: strict parser validation via Python `json` module, with comment-aware fallback for `tsconfig*.json`.
- **JSONC (`.jsonc`)**: comment stripping followed by strict JSON parse.

### What it does not check

The verifier is intentionally lightweight. It does not replace the standards
checklists and, by default, does not scan markdown. The opt-in `--check-router`
flag adds one narrow exception: it checks that every RESOURCE_MAP/DEFAULT_RESOURCE
leaf a `SKILL.md` router names exists on disk (a dead-route guard, scoped to the
router block only). It still never inspects markdown prose. RESOURCE_MAP
parent-child *equality* is enforced separately by `sk-code-router-sync.vitest.ts`,
not by this script. These remain manual review gates:

- exact visual header shape beyond the marker-level checks above;
- naming conventions;
- comment density and WHY-vs-WHAT comment quality;
- KISS/DRY/SOLID judgment;
- JavaScript `module.exports` versus plugin ESM default-export decisions;
- TypeScript package-boundary decisions such as NodeNext ESM versus root
  CommonJS defaults.

### Severity model

- **ERROR**: parse/integrity findings (`COMMON-*`, `JSON-*`, `JSONC-*`) in active paths.
- **WARN**: style findings (`JS-*`, `TS-*`, `PY-*`, `SH-*`) by default.
- **Context-aware advisory downgrade**: any finding under archival/contextual paths is downgraded to `WARN`:
  - `z_archive`, `scratch`, `memory`, `research`, `context`, `assets`, `examples`, `fixtures`, and test-heavy paths.

## 4. USAGE

```bash
python3 .opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py --root .opencode
```

Strict CI mode:

```bash
python3 .opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py --root .opencode --fail-on-warn
```

Router dead-route check (default off):

```bash
python3 .opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py --root .opencode/skills/sk-code --check-router
```

Notes:
- `--root` is repeatable; when omitted, current directory is scanned.
- Files are deduplicated by realpath when repeated/overlapping roots are provided.
- Output includes both rule id and severity (`[RULE] [ERROR|WARN]`).
- Exit code `0` means no blocking findings (warnings are non-blocking by default).
- Exit code `1` means one or more errors were found, or warnings were found with `--fail-on-warn`.
- `--check-router` (default off) emits `ROUTER-DEAD-PATH` (ERROR) for any RESOURCE_MAP leaf with no file on disk; without the flag the router table is never parsed, so the default invocation is behavior-identical to omitting it.

---

## 5. RELATED RESOURCES

- [code_organization.md](code-organization/overview-and-module-organization.md)
- [universal_patterns.md](universal-patterns/naming-and-commenting.md)
- [hooks.md](./hooks.md)
- RESOURCE_MAP equality guard: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts` — the Vitest suite that enforces parent↔child RESOURCE_MAP equality and the compiled-destination ↔ leaf-manifest ↔ RESOURCE_MAP bijection. This, not `verify_alignment_drift.py`, is the equality authority.
- Drift-guard entry point: `.opencode/skills/sk-code/code-opencode/scripts/run-all-drift-guards.sh` — runs this verifier, `verify_stack_folders.py`, and the router-sync suite together as one gate.

---

## 6. ALIGNMENT AUTHORITY INTERFACE (code-opencode)

code-opencode has exactly one alignment source of truth: the three-part interface
below. Later coverage and activation work must consume this interface rather than
re-derive a second RESOURCE_MAP parser or a local eligibility map.

1. **Doc pointer** — this file plus the code-opencode `SKILL.md` SMART ROUTING
   block, which name `sk-code-router-sync.vitest.ts` as the RESOURCE_MAP-equality
   guard (the markdown-blind `verify_alignment_drift.py` is not that authority).
2. **Bijection module** — `qualifiedIdToLeaf` in
   `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs`:
   the one bridge from a compiled router destination id
   (`<hub>/<workflowMode>/<packet>/<kind>/<slug>`) to a `leaf-manifest.json` mode,
   exercised by the router-sync suite.
3. **Orchestrator** — `scripts/run-all-drift-guards.sh`: the single command that
   runs all three drift guards and exits non-zero if any one fails.

Any new check that needs code-opencode RESOURCE_MAP alignment extends this
interface; it must not stand up a competing parser or eligibility map.
