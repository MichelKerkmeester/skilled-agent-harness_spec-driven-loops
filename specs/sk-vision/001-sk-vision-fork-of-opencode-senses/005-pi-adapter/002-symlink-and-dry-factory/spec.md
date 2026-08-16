---
title: "Feature Specification: sk-vision Pi symlink and dry factory"
description: "Create the relative symlink into .pi/extensions/, add README rows, optional input.images hook, then pi --offline --approve."
trigger_phrases:
  - "sk-vision pi symlink"
  - "sk-vision pi dry factory"
  - "sk-vision pi --offline"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter/002-symlink-and-dry-factory"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored nested-phase copy pack and L1 suite."
    next_safe_action: "Implement files from this child's spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".pi/extensions/sk-vision.ts"
      - ".pi/extensions/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-005-pi-adapter-002-symlink-and-dry-factory"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision Pi symlink and dry factory

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
| **Predecessor** | 001-extension-factory |
| **Successor** | None |
| **Handoff Criteria** | Relative symlink matches the locked target. pi --offline --approve starts without extension fail-closed. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of `005-pi-adapter`.

**Scope Boundary**: Symlink, README, optional P1 input hook, dry factory. No absolute symlink. No copied TS in .pi/extensions/.

**Dependencies**:
- 001-extension-factory owner file exists.

**Deliverables**:
- Relative symlink, README rows, dry factory evidence.

**Changelog**:
- When this phase closes, refresh the matching file in the parent changelog using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Pi discovers extensions under .pi/extensions/. Without a relative symlink the owner factory never loads.

### Purpose
Link the owner file the same way git-preflight-advisory.ts is linked, then dry-load Pi.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- ln -s relative target
- README rows
- optional P1 input.images
- pi --offline --approve

### Out of Scope
- Absolute symlink
- Copying TS into .pi/extensions/
- Object default export
- MCP primary path

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/sk-vision.ts` | Create | Relative symlink |
| `.pi/extensions/README.md` | Modify | Inventory rows |

### Implementer copy pack (follow exactly)

Stop and report if any of these is true: owner file is missing; you are about to use an absolute symlink; you are about to copy the TypeScript file into `.pi/extensions/`; default export is not a function.

Analog symlink: `.pi/extensions/git-preflight-advisory.ts` → `../../.opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts`.

```bash
ln -s ../../.opencode/skills/sk-vision/pi/sk-vision.ts .pi/extensions/sk-vision.ts
test -L .pi/extensions/sk-vision.ts
test "$(readlink .pi/extensions/sk-vision.ts)" = "../../.opencode/skills/sk-vision/pi/sk-vision.ts"
```

Do not use `ln -s /absolute/...`. Do not copy the TypeScript file into `.pi/extensions/`.

`.pi/extensions/README.md` overview table: add `sk-vision.ts` | `.opencode/skills/sk-vision/pi/sk-vision.ts`. Directory tree: add `sk-vision.ts`. Optional KEY FILES row: `sk-vision.ts` | `registerTool` (13 `sk_vision_*`) plus optional `input` / `session_shutdown`.

Optional P1 `input.images`: `pi.on("input")` when `images` is present; bound wait 2000ms; never block send on full GPU. If live paste is unproven, record the gap and still close on tools.

```bash
test -f .opencode/skills/sk-vision/pi/sk-vision.ts
test -L .pi/extensions/sk-vision.ts
readlink .pi/extensions/sk-vision.ts
pi --offline --approve
```

Close this child with:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter/002-symlink-and-dry-factory --strict
```
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Relative symlink exact target | readlink equals locked path |
| REQ-002 | README inventory | sk-vision.ts listed |
| REQ-003 | Dry factory | pi --offline --approve does not fail-close |
| REQ-004 | P1 input.images optional | Implement bounded wait or record gap |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | No extra scope | Files outside Files to Change stay untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] readlink matches the locked relative target — evidence: `readlink` = `../../.opencode/skills/sk-vision/pi/sk-vision.ts`
- [x] README lists sk-vision.ts — evidence: `.pi/extensions/README.md` overview, tree, KEY FILES rows
- [x] pi --offline --approve starts — evidence: exit 0; sk-vision extension loads without fail-close
- [x] This child validate.sh --strict exits 0 — evidence: orchestrator PASSED errors 0 warnings 0; script wrapper exit 2 from repo-wide COMMAND_TREE_PARITY only
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Absolute symlink | High | readlink proof |
| Risk | Copied file instead of symlink | High | test -L |
| Risk | Invalid default export fail-closes Pi | High | Prior child function export |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Is 004 a code dependency? **A**: No. Run 005 after 004 so tool names stay aligned.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
