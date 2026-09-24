---
title: "Feature Specification: Archive a phase into its parent's own z_archive and restore it back into the parent, leaving the parent's phase list to the reviewed prune"
description: "archive.sh sent a phase to the root specs/z_archive/, where its parent no longer shows and phase numbers collide, and restored it loose at the specs root. The repository keeps archived phases in the parent's own z_archive/, and is-phase-parent.ts tells you to."
trigger_phrases:
  - "phase-aware archive"
  - "archive a phase"
  - "restore phase to parent"
  - "packet home"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Archive a phase into its parent's own z_archive and restore it back into the parent, leaving the parent's phase list to the reviewed prune

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-24 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After packet 038, `archive.sh` kept a track packet inside its track, but a phase still went to the root `specs/z_archive/`. There the archive path no longer shows which packet the phase belonged to, and two phases with the same number from different packets collide. A restore then put the phase loose at the specs root instead of back in its parent. The repository keeps archived phases in the parent's own `z_archive/`, as `026-graph-and-context-optimization` does, and `is-phase-parent.ts` recommends exactly that.

### Purpose
One rule covers every archive: a folder goes into the `z_archive/` beside it, and a restore returns it to the place that archive belongs to.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Archive a phase into its parent's own `z_archive/`, and restore it back into the parent
- Recognise where archives may sit: the specs root, a track, or a packet or phase reached through numbered folders only
- List those archives and nothing else, by walking packet folders
- Refuse to archive a numbered folder that is not a packet, track packet or phase, and refuse to restore from any other `z_archive/`
- Tests, mutation runs, and the docs that describe the script

### Out of Scope
- The phase parent's `children_ids` - the operator chose to leave it alone: its writer only adds children, and dropping one is a reviewed prune, so the script prints the prune command instead
- The Phase Documentation Map in the parent's `spec.md` - an authored table; no check reports an archived phase's row, and the status sync skips it
- Moving phases that were archived by hand - they already sit where the script now puts them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modify | The archive beside the folder, packet homes, the list walk, the phase note |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts` | Modify | Seven phase and packet-home cases, and three guard assertions |
| `runtime/cli/spec/README.md`, the lifecycle catalogue entry, the lifecycle playbook | Modify | Describe the phase archive and the packet-home rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A phase archives into its parent's own archive | `specs/tools/001-a/002-p` lands at `specs/tools/001-a/z_archive/002-p`, with no root or track archive created |
| REQ-002 | A phase restores into its parent | `specs/tools/001-a/z_archive/002-p` returns to `specs/tools/001-a/002-p` |
| REQ-003 | The parent's and the track's lists are untouched by a phase move | Both `graph-metadata.json` files are byte-identical after archive and after restore |
| REQ-004 | Root and track packets behave as before | The 038 cases keep passing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `--list` shows phase archives and only real archives | It lists `specs/tools/001-a/z_archive/002-p`, and leaves out an archive inside an archived packet, inside a research copy, and behind a link |
| REQ-006 | Restore accepts only the archive beside a packet home | Restoring from an archive inside an archived packet, inside a research copy, or outside the specs root is "not in archive directory" |
| REQ-007 | Archive refuses a folder outside the packet structure | A numbered folder under a packet's `research/` is "Not a packet, track packet or phase" |
| REQ-008 | A phase archive names the reviewed prune | The note appears when the parent has a `graph-metadata.json`, and not for a track packet, a packet at the specs root, or a parent without one |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `archive-track.vitest.ts` passes, 16 of 16, and each of 20 guarded rules removed on purpose fails it
- **SC-002**: `archive.sh --list` on this repository shows the 268 track entries plus the 4 in `026-graph-and-context-optimization/z_archive`, and none of the research copies
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Research folders that copy a whole specs tree | High | Archives are only looked for along packet folders, and restore and archive use the same check |
| Risk | A stale phase entry in the parent's `children_ids` | Low | No check reports it, a restore finds it listed, and the note names the reviewed prune |
| Dependency | The 038 track refresh | Low | Unchanged, and its cases still pass |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose to leave the parent's phase list alone, since its writer drops a child only through a reviewed prune.
<!-- /ANCHOR:questions -->

---
