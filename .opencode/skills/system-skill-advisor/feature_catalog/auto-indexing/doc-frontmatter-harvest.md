---
title: "Doc-Frontmatter Trigger Harvest"
description: "Flag-gated harvest of reference/asset doc frontmatter into the skill_docs table, scored in the derived lane and surfaced as matchedDocs pointers."
trigger_phrases:
  - "doc trigger harvest"
  - "matchedDocs"
  - "skill_docs table"
  - "doc frontmatter routing"
version: 0.8.0.1
---

# Doc-Frontmatter Trigger Harvest

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Make the detailed frontmatter on skill reference/asset docs (`title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`) a real routing signal: doc-specific prompts surface the owning skill AND point at the exact doc to open, without letting doc volume buy routing weight.

## 2. HOW IT WORKS

When `SPECKIT_ADVISOR_DOC_TRIGGERS=true`, `skill_graph_scan` walks every skill's `references/` and `assets/` markdown (READMEs excluded, depth 6, 200 docs/skill) and upserts parsed frontmatter into a `skill_docs` table (UNIQUE per skill+path, FK-cascade, per-doc content-hash skip, per-skill stale sweep). The daemon watcher registers each harvestable doc so edits re-index the owning skill. At scoring time the sqlite projection loads doc triggers and the `derived_generated` lane scores them — top-3 docs per skill, tier-weighted (constitutional/critical 1.0 down to deprecated 0.2), summed contribution capped at 0.45 — emitting `doc:<path>` evidence that the recommend handler sanitizes (references/assets prefix, no traversal, markdown only) into an optional `matchedDocs` field (max 3). The `skill_docs` table itself stores the parsed frontmatter (`title`, `description`, `trigger_phrases`) verbatim as an internal projection source that is never returned to a caller; this `matchedDocs` emission is the only consumer-facing path, so the sanitization here is the single trust boundary and raw frontmatter never escapes the store unsanitized. Flag off (default) is byte-identical to pre-feature behavior: no writes, no watch targets, no projection rows, no schema field. The flag must be present in the launcher's `CHILD_ENV_ALLOWLIST` to reach the daemon child; the Python shim harvests the same phrases from disk under the same flag.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/doc-frontmatter.ts` | Library | Flag gate, tier weights, list-aware parser, capped walker |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | Library | `skill_docs` DDL + `harvestSkillDocs()` + scan-result counters |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts` | Library | Flag-gated, missing-table-tolerant doc-trigger projection load |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts` | Library | Top-3 tier-weighted doc scoring, 0.45 cap, docs-first evidence |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts` | Handler | Sanitized `matchedDocs` extraction, `doc_reference_signal` evidence type |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts` | Daemon | `doc-frontmatter` watch targets when the flag is on |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Launcher | `SPECKIT_ADVISOR_DOC_TRIGGERS` in `CHILD_ENV_ALLOWLIST` |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Compat | Gate-2 parity harvest merged into both graph-loader paths |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-doc-harvest.vitest.ts` | Automated test | Parser, walker, flag-gated lifecycle, capping, invariance, sanitization (11 cases) |
| `Playbook scenario [AI-006](../../manual_testing_playbook/auto-indexing/doc-frontmatter-harvest.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Auto indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `auto-indexing/doc-frontmatter-harvest.md`

Related references:

- [derived-extraction.md](./derived-extraction.md).
- [anti-stuffing.md](./anti-stuffing.md).
- [`scorer-fusion/five-lane-fusion.md`](../scorer-fusion/five-lane-fusion.md).
