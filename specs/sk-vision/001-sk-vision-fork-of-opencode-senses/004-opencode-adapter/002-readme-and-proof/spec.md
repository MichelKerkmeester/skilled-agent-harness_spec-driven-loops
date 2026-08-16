---
title: "Feature Specification: sk-vision OpenCode README and proof"
description: "Add the plugins README inventory row and prove opencode.json did not gain a plugin array."
trigger_phrases:
  - "sk-vision plugins readme"
  - "sk-vision opencode.json proof"
  - "sk-vision plugin inventory"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/004-opencode-adapter/002-readme-and-proof"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored nested-phase copy pack and L1 suite."
    next_safe_action: "Implement files from this child's spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/plugins/README.md"
      - "opencode.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-004-opencode-adapter-002-readme-and-proof"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision OpenCode README and proof

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-plugin-reexport |
| **Successor** | None |
| **Handoff Criteria** | README row present. rg plugin on opencode.json does not show a new plugin array for this skill. GPU attach smoke only if 003 load smoke passed; otherwise SKIP. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of `004-opencode-adapter`.

**Scope Boundary**: README plus proof commands. Do not rewrite the plugin factory.

**Dependencies**:
- 001-plugin-reexport plugin file exists.

**Deliverables**:
- README row and proof evidence.

**Changelog**:
- When this phase closes, refresh the matching file in the parent changelog using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Operators will not find the plugin without an inventory row, and a plugin array in opencode.json would fight this repo's discovery path.

### Purpose
Document the plugin and prove opencode.json stays without a plugin array.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add README row
- Re-run file-type and import proofs
- rg plugin opencode.json
- SKIP GPU attach unless 003 load passed

### Out of Scope
- Editing opencode.json to add a plugin array
- Pi symlink
- Rewriting dist/plugin.js

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/README.md` | Modify | Inventory row for sk-vision.js |

### Implementer copy pack (follow exactly)

Stop and report if any of these is true: `.opencode/plugins/sk-vision.js` is missing or is a symlink; you are about to add a `plugin` array to `opencode.json`; you are about to await full GPU in attach smoke when 003 recorded SKIP.

Add one row to `.opencode/plugins/README.md` section 2 CONTENTS table:

`sk-vision.js` | Local vision adapter: default-exports `vision-runtime/dist/plugin.js`. Registers 13 `sk_vision_*` tools. Auto-inspect uses a 2s grace and never awaits full GPU.

```bash
test -f .opencode/plugins/sk-vision.js && test ! -L .opencode/plugins/sk-vision.js
rg -n "from '\.\./skills/sk-vision/vision-runtime/dist/plugin.js'|from \"\.\./skills/sk-vision/vision-runtime/dist/plugin.js\"" .opencode/plugins/sk-vision.js
rg -n 'plugin' opencode.json
```

`opencode.json` must not gain a `plugin` array for this skill. GPU attach smoke runs only if 003 `load` smoke passed; otherwise SKIP.

Close this child with:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/004-opencode-adapter/002-readme-and-proof --strict
```
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README inventory row | sk-vision.js listed |
| REQ-002 | No plugin array added | opencode.json unchanged on that axis |
| REQ-003 | GPU attach smoke gated on 003 | SKIP unless 003 load passed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | No extra scope | Files outside Files to Change stay untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] README lists sk-vision.js
- [x] opencode.json has no new plugin array
- [x] This child validate.sh --strict exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Adding plugin array | High | rg proof |
| Risk | GPU attach when 003 SKIP | Med | Record SKIP |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Must GPU attach pass to close 004? **A**: Only if 003 load smoke passed.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
