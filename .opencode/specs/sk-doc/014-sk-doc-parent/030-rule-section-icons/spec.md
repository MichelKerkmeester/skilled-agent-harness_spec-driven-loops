---
title: "Feature Specification: Rule-section icon standardization across SKILL.md files"
description: "SKILL.md rule sections used an inconsistent icon convention — 13 files carried ✅/❌/⚠️ on ALWAYS/NEVER/ESCALATE IF while the rest were plain. Standardize every SKILL.md on ✅ ALWAYS · ⛔ NEVER · ⚠️ ESCALATE IF so the positive/negative/warning cue is uniform repo-wide."
trigger_phrases:
  - "rule section icons"
  - "014 sk-doc phase 030"
  - "always never escalate icons"
importance_tier: "normal"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/030-rule-section-icons"
    last_updated_at: "2026-07-14T17:24:30.985Z"
    last_updated_by: "claude-opus"
    recent_action: "Icon sweep applied + validated across 11 hubs"
    next_safe_action: "Ship with the sk-doc router commit; user pulls in IDE"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Rule-section icon standardization across SKILL.md files

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
SKILL.md rule sections carried an inconsistent icon convention: 13 files used `✅ ALWAYS / ❌ NEVER / ⚠️ ESCALATE IF` while the remaining rule sections were plain text. The positive/negative/warning cue was therefore uneven across the skill fleet, and the negative glyph (`❌`) did not match the operator's preferred "stop" sign.

### Purpose
Every SKILL.md rule section reads with one uniform, scannable convention: **✅ ALWAYS · ⛔ NEVER · ⚠️ ESCALATE IF**.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Prefix `✅` on `ALWAYS` rule headers, `⛔` on `NEVER`, `⚠️` on `ESCALATE IF` in every SKILL.md, idempotently.
- Unify the 8 pre-existing `❌ NEVER` headers to `⛔ NEVER`.
- Handle the `… Rules` and combined `ALWAYS / NEVER (…)` header variants.

### Out of Scope
- The `## RULES` H2 header itself — left plain (no glyph), per operator preference.
- Prose headers where the keyword is incidental (e.g. "First Step (Always)", "the always-current live branch") — untouched.
- Any non-header body text; any non-SKILL.md file.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/**/SKILL.md` | Modify | Icon prefix on ALWAYS/NEVER/ESCALATE IF rule headers (42 files, 11 hubs) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Uniform icon convention on rule headers | Every `ALWAYS/NEVER/ESCALATE IF` SKILL.md header carries `✅`/`⛔`/`⚠️`; sweep re-run is a no-op (idempotent) |
| REQ-002 | No validator regressions | sk-doc packaging sweep 11/11 PASS; `parent-skill-check.cjs` STRICT exit 0 on every affected parent hub |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Pre-existing `❌` unified | No `❌ NEVER` headers remain; all negative headers use `⛔` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `✅ ALWAYS · ⛔ NEVER · ⚠️ ESCALATE IF` applied uniformly across all SKILL.md rule sections.
- **SC-002**: sk-doc sweep 11/11 PASS and all affected parent hubs pass `parent-skill-check.cjs` STRICT after the sweep.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Glyphs count as word tokens | A packet at the word cap (create-benchmark) can breach 5000 | Re-trimmed create-benchmark to 4993 words |
| Risk | Icons on headers could break section detection | Validator false-negatives | Confirmed H2 section checks match on substring; sweep + hub checks re-run clean |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Operator specified the glyph set (✅/⛔/⚠️, no shield on RULES) and scope ("all skill.md's, clear positive/negative/warning").
<!-- /ANCHOR:questions -->
