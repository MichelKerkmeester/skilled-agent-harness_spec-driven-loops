---
title: "Spec folder literal naming: create.sh fallback"
description: "create.sh emits PROVIDE-DESCRIPTIVE-SLUG placeholders and one stderr warning per child when --phase-names is omitted, so generic phase-N names never reach the spec tree."
trigger_phrases:
  - "spec folder literal naming create.sh fallback"
  - "PROVIDE-DESCRIPTIVE-SLUG"
  - "phase name placeholder"
  - "generic phase name warning"
version: 3.6.0.6
---

# Spec folder literal naming: create.sh fallback

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

create.sh emits PROVIDE-DESCRIPTIVE-SLUG placeholders and one stderr warning per child when `--phase-names` is omitted, so generic `phase-N` names never reach the spec tree.

This is the script-level half of the literal-naming discipline. When an operator runs `create.sh "task" --phase --phase-count N` without `--phase-names`, every generated child folder ends with the literal token `PROVIDE-DESCRIPTIVE-SLUG` and the script emits one `[speckit] Warning:` line per child to stderr. Exit code stays 0, so the fallback is warn-only and never blocks scaffolding. The placeholder forces the operator or AI agent to rename each child to a literal slug before the folder is treated as final.

---

## 2. HOW IT WORKS

The fallback path lives entirely inside `scripts/spec/create.sh`. When `--phase` is active and `--phase-names` is absent or under-supplied, the script synthesizes a child slug of the form `phase-${N}-PROVIDE-DESCRIPTIVE-SLUG` and writes a matching stderr line: `[speckit] Warning: Falling back to generic phase name 'phase-N-PROVIDE-DESCRIPTIVE-SLUG'. Provide --phase-names with literal slugs.`

The validation phase scaffolded by the script also seeds an initial `001-validation-phase-PROVIDE-DESCRIPTIVE-SLUG` child for the validation track. Both placeholder paths share the same token so a single grep can locate every pending rename: `grep -rn 'PROVIDE-DESCRIPTIVE-SLUG' specs/` returns every child that still needs a literal slug.

Exit code remains 0 to keep scaffolding non-blocking. Downstream consumers (workflow YAMLs, AI agents) are expected to read the stderr warnings, rename each child, and re-run any validation step that depends on slug shape. The behavior was shipped by Packet 012 REQ-003 and REQ-004 to make pre-012 regressions visible: any bare `phase-N` slug now signals a stale create.sh or a wrapper that swallowed the fallback.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | Script | Generates phase children, emits PROVIDE-DESCRIPTIVE-SLUG placeholders, and writes one stderr warning per child when --phase-names is omitted |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md` | Manual playbook | Playbook scenario PHASE-006 covering placeholder emission, stderr warning count, and exit-code expectation |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md`
Related references:
- [spec-folder-literal-naming-ai-derived-slugs.md](spec-folder-literal-naming-ai-derived-slugs.md) — Spec folder literal naming: AI-derived slugs
