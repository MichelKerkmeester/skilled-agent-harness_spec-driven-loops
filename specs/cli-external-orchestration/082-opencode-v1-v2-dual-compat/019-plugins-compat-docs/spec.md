---
title: "Feature Specification: Phase 19: plugins-compat-docs"
description: "The plugins README never said which OpenCode versions the plugins run on and had drifted from the code. This phase states both tested versions in it, fixes the drift and adds ARCHITECTURE.md for the dual-version design."
trigger_phrases:
  - "plugins compat docs"
  - "phase 19 plugins compat docs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 19: plugins-compat-docs

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-19 |
| **Branch** | `scaffold/019-plugins-compat-docs` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 19 |
| **Predecessor** | 013-sk-vision-v2-tools-and-loose-ends |
| **Successor** | None |
| **Handoff Criteria** | The README states both tested versions and matches the code, and ARCHITECTURE.md passes review |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the Bring the OpenCode plugins README up to date with v1 and v2 compatibility and add a detailed architecture doc specification.

**Scope Boundary**: The two plugin docs (`.opencode/plugins/README.md` modified and `.opencode/plugins/ARCHITECTURE.md` created), this folder's records and the parent phase map row. The phase changes no code.

**Dependencies**:
- The 082 proof record `../011-two-version-proof-and-closeout/`, which carries the tested versions and the 17-plugin battery result.
- The packet research `../research/research.md` and phase 013's implementation summary, which carry the sk-vision facts.
- `scratch/facts.md` in this folder, the audit record that names a source for every fact.

**Deliverables**:
- `.opencode/plugins/README.md` stating both versions and matching the code.
- `.opencode/plugins/ARCHITECTURE.md` in the sk-doc architecture template with a source per claim.
- This folder's spec, plan and tasks, and the parent handoff row.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The plugins README did not say which OpenCode versions the plugins run on, and it had drifted from the code. It missed `cli-dispatch-audit.js`'s `tool.execute.before` guard and `session-cleanup.js`'s `dispose`, listed sk-vision's hooks wrong, and claimed every plugin except the message gate honors the master kill switch when `system-speckit-completion.js` and `sk-vision.js` do not. It also named one exception to the switch naming where `hook-flags.cjs` has six, and said the registration test covers 11 plugins where it covers 12. No document explained the dual-version design in depth.

### Purpose
The README states plainly that every plugin runs on OpenCode 1 (`server`, tested 1.19.3) and OpenCode 2 (`setup`, tested 2.0.32) and matches the code, and `ARCHITECTURE.md` explains the dual export, the bridge, sk-vision's own path, the kill switches, how to add a plugin, verification and known limits.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/plugins/README.md` (modified): the version statement with the proof date, the six drift fixes and the link to ARCHITECTURE.md.
- `.opencode/plugins/ARCHITECTURE.md` (new): the dual export, the bridge, sk-vision's own path, the kill switches, how to add a plugin, verification and known limits.
- This folder's spec, plan and tasks, and the parent phase map handoff row.

### Out of Scope
- The CI `bun: command not found` failure - it is a workflow fix outside the plugin docs, recorded as a known limit.
- The kill-switch code gaps in `system-speckit-completion.js` and `sk-vision.js` - they are code changes, documented as they are today.
- `.opencode/plugins/tests/README.md`, which does not list `session-relaunch` - it is a separate README outside this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/README.md` | Modify | States both tested versions and the proof date, and fixes every drift item listed in the problem statement |
| `.opencode/plugins/ARCHITECTURE.md` | Create | The dual-version design in the sk-doc architecture template, with a repo source per claim |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/019-plugins-compat-docs/spec.md`, `plan.md`, `tasks.md` | Modify | This folder's records, filled from the template |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` | Modify | The 013 to 019 handoff row in the phase map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The README states both versions and the proof date. | The overview names OpenCode 1 (`server`, tested 1.19.3) and OpenCode 2 (`setup`, tested 2.0.32) with the 2026-10-19 proof date. |
| REQ-002 | Every README claim matches the code on main. | The six drift items are fixed and a read against `scratch/facts.md` finds no remaining mismatch. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `ARCHITECTURE.md` follows the sk-doc architecture template (eight fixed sections) and cites a repo source for each claim. | The eight sections are present and every design claim carries a file and line source. |
| REQ-004 | Both files pass sk-doc's `validate_document.py` and a read-only Luna review. | Validator exit 0 on both files and a Luna verdict of PASS. |
| REQ-005 | The plugin suite still passes 397 of 397. | `node --test .opencode/plugins/tests/` reports 397 of 397. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each requirement REQ-001 to REQ-005 is checked with recorded evidence in this folder.
- **SC-002**: The README alone answers which versions the plugins run on, and `ARCHITECTURE.md` answers the design questions with sources.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The 082 proof and research records | The version and battery claims would rest on memory | `scratch/facts.md` cites `../011-two-version-proof-and-closeout/` and `../research/research.md` for each fact |
| Risk | The docs drift again when a plugin is added | Med | `ARCHITECTURE.md`'s "Adding a plugin" steps and the hand-written v2 test lists tell the next author what to touch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None left open by this phase. The documentation scope was fixed at dispatch, so the README and ARCHITECTURE.md coverage above is the settled answer.
<!-- /ANCHOR:questions -->

---
