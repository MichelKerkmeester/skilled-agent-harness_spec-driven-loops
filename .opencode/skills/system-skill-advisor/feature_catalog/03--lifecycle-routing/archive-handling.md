---
title: "Archive and Future Skills Indexed But Not Routed"
description: "z_archive/ and z_future/ skills are visible to inspection tools but excluded from live routing and active-corpus statistics."
trigger_phrases:
  - "archive handling"
  - "z_archive skills"
  - "z_future skills"
  - "indexed but not routed"
---

# Archive and Future Skills Indexed But Not Routed

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Preserve historical and staged skills for inspection (audits, history, pre-activation preview) without letting them surface in live routing recommendations.

## 2. HOW IT WORKS

`lib/lifecycle/archive-handling.ts` classifies skills under `z_archive/` and `z_future/` as indexed-but-not-routed. They appear in inspection surfaces (graph status, catalog, playbook cross-references) but are excluded from:

1. `advisor_recommend` recommendations.
2. DF/IDF corpus statistics (see `lib/corpus/df-idf.ts`).
3. 5-lane fusion scoring inputs.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/lifecycle/archive-handling.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/corpus/df-idf.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` | Automated test | archived-skill exclusion |
| `Playbook scenario [LC-003](../../manual_testing_playbook/07--lifecycle-routing/archive-handling.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Lifecycle routing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--lifecycle-routing/archive-handling.md`

Related references:

- [`02--auto-indexing/df-idf-corpus.md`](../02--auto-indexing/df-idf-corpus.md).
- [02-supersession.md](./supersession.md).
- [04-schema-migration.md](./schema-migration.md).
