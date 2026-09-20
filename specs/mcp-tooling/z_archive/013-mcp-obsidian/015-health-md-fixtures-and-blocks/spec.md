---
title: "Feature Specification: Phase 15 — health-md fixtures and render-block assets"
description: "Replace the example fixture with a schema-true healthmd.health_data v7 artifact and add tested health-viz render-block examples, per the deep-research findings."
trigger_phrases:
  - "health-md fixtures"
  - "health-viz render blocks"
  - "healthmd health_data v7 example"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/015-health-md-fixtures-and-blocks"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 15 spec"
    next_safe_action: "Audit and replace the fixture + add render-block examples"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 15 — health-md fixtures and render-block assets

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (013-mcp-obsidian) |
| **Parent Packet** | `mcp-tooling/013-mcp-obsidian` |
| **Predecessor** | `014-health-md-reference-remediation` |
| **Successor** | `016-health-md-catalog-and-playbook` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep research found the mode's example asset and quick-start blocks are not safe: the fixture (`healthmd-export.example.json`) was authored from starter guidance with fields that are not verified against the real `healthmd.health_data` v7 export shape, and every render-block example uses the wrong `health-md` fence with invented keys. Agents copying these assets would write files the plugin misreads — or worse, believe a chart rendered from bundled mock data proves real exports loaded.

### Purpose
Make the mode's health-md assets trustworthy: a fixture that conforms to the researched v7 daily-summary contract (and is explicitly marked as a shape example, not real data), plus a `health-viz` render-block examples asset using only registered renderers and documented keys.

**End goal:** every asset in `assets/plugins/health-md/` parses, conforms to the researched contract, and is referenced by the remediated reference docs (Phase 14).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit `assets/plugins/health-md/healthmd-export.example.json` against research §1/§4 (v7 daily summary shape: `healthmd.health_data` wrapper, `schema_version`, timezone, days + statistics with units).
- Rewrite/extend the fixture to a v7-conformant shape; mark it clearly as an example fixture, never real health data.
- Add `assets/plugins/health-md/health-viz-blocks.example.md`: tested render blocks (`type: step-spiral`, `last: 7`; documented keys `width`, `height`, `from`, `to`, `clickAction`; a `{{today:YYYY-MM-DD}}` dynamic-date example), each commented with its purpose.
- Reference both assets from the remediated reference docs (Phase 14 outputs).
- Update the changelog entry (v1.4.0.0).

### Out of Scope
- Reference doc rewrites (Phase 14).
- Playbook/catalog updates (Phase 16).
- Real health data or Android raw snapshots as fixtures (never vendor sensitive material).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp-obsidian/assets/plugins/health-md/healthmd-export.example.json` | Rewrite | v7-conformant example shape |
| `mcp-obsidian/assets/plugins/health-md/health-viz-blocks.example.md` | Create | Tested render-block examples |
| `mcp-obsidian/changelog/v1.4.0.0.md` | Create | Changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fixture conforms to researched v7 shape | JSON parses; wrapper `healthmd.health_data`; `schema_version: 7`; days carry `date` + `statistics` with units; no invented top-level keys |
| REQ-002 | Fixture honestly labeled | File header/README note states it is a shape example, not real health data; never to be written into a vault as if authentic |
| REQ-003 | Render-block asset uses `health-viz` only | All blocks use the `health-viz` fence with registered renderers; zero `health-md` fences, zero `type: chart`/`dateRange` |
| REQ-004 | Assets referenced from the reference docs | `health-md.md`/`workflows.md` (Phase 14 outputs) point to both assets |
| REQ-005 | Changelog entry shipped | `v1.4.0.0.md` records the fixture + block corrections with the research source |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `python3 json.load` + field audit passes on the fixture; grep confirms no banned fence/keys in the asset tree.
- **SC-002**: An agent copying a render-block example produces a block the plugin accepts (per research §3 grammar).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 14 rewrites | Asset references dangle | Both phases ship together; references verified after Phase 14 |
| Risk | Fixture mistaken for real data | Agent writes example data into a vault | Explicit labeling + workflow guard (authentic-source verification) |
| Risk | Renderer names drift | Blocks silently invalid | Only use renderers named in research §3; note recheck cadence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.

<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
