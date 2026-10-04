---
title: "Shared frontmatter value list"
description: "One JSON list holds the legal contextType and importance_tier values, the save CLI reads its sets from it, and the FRONTMATTER_VALUES rule warns when a packet doc carries a value outside it."
trigger_phrases:
  - "shared frontmatter value list"
  - "frontmatter-values.json"
  - "FRONTMATTER_VALUES rule"
  - "contextType value list"
  - "importance_tier value list"
version: 1.0.0.0
---

# Shared frontmatter value list (frontmatter-values.json)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

One JSON list holds the legal contextType and importance_tier values, the save CLI reads its sets from it, and the FRONTMATTER_VALUES rule warns when a packet doc carries a value outside it.

sk-create-frontmatter's `assets/frontmatter-values.json` is the single place a legal document value or tier is written down. The save path, the frontmatter migration and the validator all read the same file, so a value the writer accepts is a value the validator accepts. The validator side only warns: a value outside the list never fails a run.

---

## 2. HOW IT WORKS

### The Value List

The file holds two lists. The document `contextType` list has four canonical values, `implementation`, `research`, `planning` and `general`, plus aliases that map onto them: `decision`, `spec`, `specification`, `plan` and `tasks` map to `planning`, `discovery`, `reference` and `documentation` map to `general`, and `review` maps to `research`. The `importance_tier` list has `constitutional`, `critical`, `important`, `normal`, `temporary` and `deprecated`, plus the aliases `high` for `important` and `supporting`, `useful`, `medium` and `standard` for `normal`. The session `contextType` list is not in the file: it classifies saves, so `shared/context-types.ts` keeps its eleven values, `implementation`, `research`, `debugging`, `review`, `planning`, `decision`, `architecture`, `configuration`, `documentation`, `general` and `discovery`.

### Who Reads It

`shared/context-types.ts` reads the file at run time, from source and from its built `dist/` copy alike, and exports `CANONICAL_CONTEXT_TYPES`, `DOCUMENT_CONTEXT_TYPE_ALIASES`, `SESSION_CONTEXT_TYPES`, `IMPORTANCE_TIERS` and `IMPORTANCE_TIER_ALIASES`. The save CLI's input normalizer and session extractor import those sets, and so does the frontmatter migration, so none of them keeps a private copy of the values.

### The FRONTMATTER_VALUES Rule

`FRONTMATTER_VALUES` is registered at warn severity in the validator registry. It checks the `contextType` and `importance_tier` of each top-level packet doc. An alias is legal. A value outside the list prints one warning that names the canonical values to use instead. The rule never fails a run, with `--strict` or without it. When the shared list cannot be read, the rule warns that it skipped the check rather than passing silently.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-values.json` | Shared | The document contextType and importance_tier lists with their aliases |
| `.skilled/skills/system-spec-kit/shared/context-types.ts` | Shared | Reads the list, holds the session list, and exports the canonical, alias, session and tier sets |
| `.skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts` | Script | Save-path input normalization that imports the shared sets |
| `.skilled/skills/system-spec-kit/runtime/cli/extractors/session-extractor.ts` | Script | Session extraction that imports the shared sets |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts` | Script | Frontmatter migration that imports the shared sets |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values.sh` | Script | The `FRONTMATTER_VALUES` rule over each top-level packet doc |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs` | Script | Compares one document's values with the list and prints one `WARN` line per value outside it |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` | Shared | Registers `FRONTMATTER_VALUES` at warn severity |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/shared/tests/context-types.test.ts` | Unit | Script-style assertions over canonical and alias resolution, the eleven session values and the importance tiers |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/phase-status-from-payload.vitest.ts` | Vitest | Phase status for planning, debugging and decision sessions |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/shared-frontmatter-value-list.md` | Manual playbook | Runs the helper on a scratch copy with a value outside the list and with an alias |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/shared-frontmatter-value-list.md`

Related references:
- [setup-native-module-health-and-mcp-installation.md](setup-native-module-health-and-mcp-installation.md) - the entry before this one in the category
- [sk-git-worktree-convention.md](sk-git-worktree-convention.md) - the entry after this one in the category
- [spec-validation-rule-engine.md](spec-validation-rule-engine.md) - the orchestrator that runs the rule from the registry
