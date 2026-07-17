---
title: "Feature Specification: Flatten redundant asset subfolders"
description: "Remove the redundant single-subfolder nesting under six sk-doc packets' assets/ (e.g. create-readme/assets/readme/) by moving the templates directly into assets/ and updating every live reference."
trigger_phrases:
  - "flatten asset subfolders"
  - "125 sk-doc phase 021"
  - "redundant assets nesting"
importance_tier: "normal"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/021-flatten-asset-subfolders"
    last_updated_at: "2026-07-07T14:54:32.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Moved 17 templates up; swept 33 live refs"
    next_safe_action: "Validate and commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-readme/assets/"
      - ".opencode/commands/create/assets/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Feature Specification: Flatten redundant asset subfolders

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P3 |
| **Status** | Draft |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | `skilled-agent-orchestration/125-sk-doc-parent` |
| **Depends On** | none |
| **Predecessor** | `020-command-agent-template-conformance/` |
| **Successor** | none |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Six sk-doc packets wrap their templates in a redundant single subfolder whose name just repeats the packet domain — e.g. `create-readme/assets/readme/readme_template.md`. The `assets/` folder holds nothing but that one subfolder, so the extra level adds path depth without organizing anything.

### Purpose
Flatten the redundant nesting: move each packet's templates directly into `assets/` and update every live reference. create-agent and shared are already flat; create-skill keeps its two-family `skill/` + `parent_skill/` split (a deliberate organization, not the single-redundant-wrapper pattern).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Flatten `assets/<sub>/` → `assets/` for: create-readme (`readme/`), create-benchmark (`benchmark/`), create-command (`command/`), create-feature-catalog (`feature_catalog/`), create-flowchart (`flowcharts/`), create-manual-testing-playbook (`testing_playbook/`) — 17 template files.
- Update every LIVE reference (command YAMLs, packet SKILL/README docs, the markdown agent mirror, and any skill refs) via anchored, packet-scoped path rewrites.

### Out of Scope
- create-skill's `skill/` + `parent_skill/` split (two template families, intentional).
- create-agent and shared (already flat).
- Historical `.opencode/specs/**` and changelog references (time-stamped records keep the old paths).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `sk-doc/create-{readme,benchmark,command,feature-catalog,flowchart,manual-testing-playbook}/assets/**` | Move | 17 templates flattened into `assets/` |
| `commands/create/assets/*.yaml`, sk-doc packet docs, `agents/markdown.md` | Update | Reference paths rewritten to the flat location |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The six redundant subfolders are gone; templates live in `assets/` | `find` shows 0 of the six subfolders; templates loose in each `assets/` |
| REQ-002 | Every live reference points at the flat path and resolves | 0 stale live subfolder refs; every rewritten template path exists (`test -e`) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Historical references are left untouched | Only live surfaces rewritten; specs/changelog keep old paths |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 0 of the six subfolders remain; 17 templates loose in their `assets/`.
- **SC-002**: 0 stale live subfolder references; all rewritten paths resolve.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A live reference missed by the sweep | Broken template path | `test -e` on every rewritten path; 0 missing |
| Risk | Concurrent-session churn on shared docs | Mixed commit | Scoped pathspec; flatten refs verified resolving |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- create-skill's two-subfolder split (`skill/` + `parent_skill/`) was intentionally left; flattening it (with the existing distinguishing prefixes) is a separate call for the operator.
<!-- /ANCHOR:questions -->
