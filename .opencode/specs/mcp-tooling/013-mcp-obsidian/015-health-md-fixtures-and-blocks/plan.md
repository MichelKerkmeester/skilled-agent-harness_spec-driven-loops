---
title: "Implementation Plan — Phase 15 — health-md fixtures and render-block assets"
description: "Plan for the schema-true fixture and health-viz render-block examples."
trigger_phrases:
  - "phase 15 plan"
  - "health-md fixture plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/015-health-md-fixtures-and-blocks"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 15 plan"
    next_safe_action: "Execute T001-T005"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/015-health-md-fixtures-and-blocks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan — Phase 15 — health-md fixtures and render-block assets

<!-- ANCHOR:summary -->
## 1. SUMMARY

Replace the health-md example fixture with a v7-conformant shape example and add a `health-viz` render-block examples asset, both verified against the deep-research contract (research.md §1, §3, §4). Reversible: delete/revert the two asset files + changelog.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Fixture schema | Wrapper, schema_version 7, days/statistics/units shape | python3 json + field audit vs research §1/§4 |
| Fence hygiene | No `health-md` fence / `type: chart` / `dateRange` in assets | grep -r |
| Renderer validity | Blocks use registered renderers from research §3 | read |
| Labeling | Fixture header marks it as a non-real shape example | read |
| Versioning | Changelog + asset frontmatter carry `version:` | frontmatter gate |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two files under `assets/plugins/health-md/`:

| File | Content |
|------|---------|
| `healthmd-export.example.json` | `healthmd.health_data` v7 wrapper, `schema_version: 7`, `timezone`, `source` marked "example fixture — not real data", 2 `days` with `statistics` incl. units |
| `health-viz-blocks.example.md` | Fenced `health-viz` blocks: minimal (`step-spiral`, `last: 7`), sized (`width`/`height`), windowed (`from`/`to`), click action, dynamic date (`{{today:YYYY-MM-DD}}`) — each with a purpose comment |

Both are referenced from the Phase 14-remediated `health-md.md` + `workflows.md`. Changelog `v1.4.0.0` records the corrections and cites `research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Extract fixture + block grammar facts from research.md §1/§3/§4 |
| Implementation | Rewrite fixture; create blocks asset; add changelog; wire references |
| Verification | JSON parse, grep gates, frontmatter gate |

Sequenced in tasks.md (T001–T005).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Static verification: JSON parse + field audit, grep for banned fence/keys, cross-check each block against research §3 keys, frontmatter gate, `validate.sh`. No vault writes — fixtures are examples, never installed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Phase 14 reference rewrites | Asset pointers dangle | Coordinate; verify references resolve after Phase 14 |
| Upstream plugin changes | Renderer/schema drift | Changelog pins researched versions; recheck note included |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete the new blocks asset + changelog; revert the fixture file to its committed version. No other files are touched.
<!-- /ANCHOR:rollback -->
