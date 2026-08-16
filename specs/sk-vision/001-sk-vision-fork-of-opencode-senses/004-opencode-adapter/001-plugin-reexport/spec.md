---
title: "Feature Specification: sk-vision OpenCode plugin re-export"
description: "Write .opencode/plugins/sk-vision.js as a regular file that default-exports vision-runtime/dist/plugin.js. Not a symlink."
trigger_phrases:
  - "sk-vision opencode plugin"
  - "sk-vision.js re-export"
  - "sk-vision plugin file"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/004-opencode-adapter/001-plugin-reexport"
    last_updated_at: "2026-08-16T08:20:00.000Z"
    last_updated_by: "cursor-code"
    recent_action: "Created .opencode/plugins/sk-vision.js thin re-export; copy-pack proofs passed."
    next_safe_action: "002-readme-and-proof"
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/plugins/sk-vision.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-004-opencode-adapter-001-plugin-reexport"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision OpenCode plugin re-export

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
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | 002-readme-and-proof |
| **Handoff Criteria** | test -f and test ! -L on .opencode/plugins/sk-vision.js. Import target is vision-runtime/dist/plugin.js. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of `004-opencode-adapter`.

**Scope Boundary**: Plugin file bytes only. No README. No opencode.json plugin array. No Pi symlink.

**Dependencies**:
- 003 dist/plugin.js exists (or documented tsc substitute).

**Deliverables**:
- Regular file .opencode/plugins/sk-vision.js.

**Changelog**:
- When this phase closes, refresh the matching file in the parent changelog using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
OpenCode will not load the skill factory until a real file exists under .opencode/plugins/.

### Purpose
Add a thin re-export matching mk-communication-projection.js.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Prove dist/plugin.js exists
- Write regular-file re-export
- Keep GPU logic in the skill package

### Out of Scope
- ln -s this plugin — Pi is the symlink host
- Editing repo-root opencode.json
- Copying dump context/opencode.json
- README row — next child
- Inventing sk_vision_query
- Awaiting full GPU in chat.message

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/sk-vision.js` | Create | Thin default re-export |

### Implementer copy pack (follow exactly)

Stop and report if any of these is true: `003-runtime-fork` has no `dist/plugin.js` and no documented `tsc` substitute; you are about to `ln -s` this plugin; you are about to edit repo-root `opencode.json`; you are about to copy dump `context/opencode.json`; you are about to add a `plugin` array; you are about to invent `sk_vision_query`.

Analog (real file importing skill `dist/`): `.opencode/plugins/mk-communication-projection.js`. Dump factory with the four hooks: `vision-runtime/src/plugin.ts`. 2s grace lives in dump `attachments.ts`; 004 keeps that by re-exporting the built factory, not by rewriting it.

```bash
test -f .opencode/skills/sk-vision/vision-runtime/dist/plugin.js
```

Preferred bytes:

```javascript
'use strict';

export { default } from '../skills/sk-vision/vision-runtime/dist/plugin.js';
```

If OpenCode fails to load a re-export, use an explicit default function that calls the skill factory and returns its hooks object. Do not put GPU logic in this file.

```bash
test -f .opencode/plugins/sk-vision.js && test ! -L .opencode/plugins/sk-vision.js
```

The loaded factory MUST still expose dump hooks: `event`, `chat.message` (wait at most 2000ms), `tool` (13 `sk_vision_*` names only), `dispose` (`client.close()`).

Close this child with:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/004-opencode-adapter/001-plugin-reexport --strict
```
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Regular file re-export | test -f and test ! -L |
| REQ-002 | Import target is dist/plugin.js | rg the relative import |
| REQ-003 | No GPU logic in the adapter file | File stays a thin re-export |
| REQ-004 | Not a symlink | test ! -L |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | No extra scope | Files outside Files to Change stay untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] `.opencode/plugins/sk-vision.js` exists and is not a symlink
- [x] File imports vision-runtime/dist/plugin.js
- [x] This child validate.sh --strict folder RESULT: PASSED (errors=0 warnings=0)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Using a symlink like Pi | High | test ! -L |
| Risk | Missing dist/plugin.js | High | Stop; 003 owns the artifact |
| Risk | Adding opencode.json plugin array | High | Next child proves rg plugin on opencode.json |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Copy dump opencode.json? **A**: No. This repo discovers plugins as real files under .opencode/plugins/.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
