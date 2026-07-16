---
title: "Feature Specification: Align sk-doc numbering by coordinating with the live concurrent migration"
description: "sk-doc's archived packets (001-013) are contiguous but active packets skip 014, jump from 016 to 030, and include three untracked stub directories; a concurrent session is actively renumbering the same tree right now (929 dirty paths). This phase documents the target aligned end-state and defers verification until that session commits and the tree is clean."
trigger_phrases:
  - "sk-doc numbering alignment"
  - "sk-doc archive gap 014"
  - "sk-doc concurrent migration coordination"
  - "sk-doc working tree clean gate"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/004-sk-doc-alignment"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded sk-doc numbering-alignment coordination packet"
    next_safe_action: "Re-check sk-doc git status after concurrent commit"
    blockers:
      - "sk-doc tree dirty from concurrent migration (929 paths: 926 D + 3 untracked, mtime to 07:52); no git-mv/rm until clean."
    key_files:
      - ".opencode/specs/sk-doc/z_archive/"
      - ".opencode/specs/sk-doc/015-sk-doc-parent/"
      - ".opencode/specs/sk-doc/016-hub-doc-conformance-fixes/"
      - ".opencode/specs/sk-doc/030-benchmark-authoring-centralization/"
      - ".opencode/specs/sk-doc/031-sk-doc-router-alignment/"
      - ".opencode/specs/sk-doc/032-hyphen-naming-convention/"
      - ".opencode/specs/sk-doc/033-create-diff-mode/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Close 014 gap via archive renumber, or leave intentionally open?"
      - "Is 016->030 a reserved range, or should it renumber contiguously?"
    answered_questions: []
---
# Feature Specification: Align sk-doc numbering by coordinating with the live concurrent migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
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
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-16 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/specs/sk-doc/z_archive/` holds a contiguous run of retired packets, `001-cmd-create-emoji-enforcement` through `013-sk-doc-readme` (verified: `ls .opencode/specs/sk-doc/z_archive` lists exactly `001`-`013`). The currently active top-level folders are `015-sk-doc-parent`, `016-hub-doc-conformance-fixes`, `030-benchmark-authoring-centralization`, `031-sk-doc-router-alignment`, `032-hyphen-naming-convention`, and `033-create-diff-mode` — there is no active `014`, and the active range jumps from `016` straight to `030`. Of those active folders, `030`, `031`, and `033` are untracked (0 files under `git ls-files`) while `015`, `016`, and `032` are tracked.

A separate, **concurrent session is actively renumbering this exact tree right now**. `git status --porcelain -- .opencode/specs/sk-doc` returned 929 changed paths: 926 deletions (`D`) of old top-level folders that still exist in git's index but have already been removed from the working directory — including `001-cmd-create-emoji-enforcement` through `014-skill-readme-standardization`, plus `017-benchmark-authoring-centralization`, `018-sk-doc-router-alignment`, and `999-create-diff-mode` — and 3 untracked (`??`) new-numbered directories (`030`, `031`, `033`), which are the concurrent session's rename targets still in flight. The newest file mtime observed in the tree was `2026-07-16 07:52:46`, after the most recent sk-doc commit (`087b57045c`, `2026-07-16 07:26:55`, "docs(specs): renumber sk-doc hyphen-naming packet 019 -> 032"), confirming the migration is still live as of this scaffold.

Running any git-mv or git-rm against `.opencode/specs/sk-doc` while that tree is dirty would collide with the concurrent session's in-flight renames and risk corrupting both efforts.

### Purpose
Document the target aligned sk-doc numbering end-state now — archive max `013`, the `014` gap either closed or intentionally retained, and active packets continuing cleanly from there — while deferring any alignment verification or git execution until the concurrent session commits and `git status --porcelain -- .opencode/specs/sk-doc` returns zero lines.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Document the current on-disk and git state of `.opencode/specs/sk-doc` numbering: archive vs. active, tracked vs. untracked, and the `014` gap.
- Document the target aligned end-state and the open questions that determine which of the valid resolutions applies.
- State the hard gate explicitly: no git-mv/rm execution against sk-doc is proposed or attempted until `git status --porcelain -- .opencode/specs/sk-doc` returns zero lines.
- Define the read-only verification steps to run once that gate clears.

### Out of Scope
- Any git mutation (git mv, git rm, rm, file edit) under `.opencode/specs/sk-doc` - the concurrent session owns that work and must land it first.
- Renumbering, moving, or editing any file outside `.opencode/specs/sk-doc` - no other track is touched by this phase.
- Deciding, on this phase's own authority, whether the `014` gap should be closed or intentionally skipped - that decision belongs to the concurrent session's own migration plan or the user; this phase only records the two valid resolutions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/004-sk-doc-alignment/{spec,plan,tasks,checklist}.md` | Create | This packet's own coordination/verification documentation. No file under `.opencode/specs/sk-doc` is touched. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | State the hard gate prominently | `spec.md` and `plan.md` both state, in their own words, that no git-mv/rm may target `.opencode/specs/sk-doc` until its working tree is clean. |
| REQ-002 | Verify only after the concurrent session commits and the tree is clean | `checklist.md` carries a P0 item requiring `git status --porcelain -- .opencode/specs/sk-doc` to return zero lines before alignment verification is marked complete. |
| REQ-003 | Ground every numbering claim in evidence, not assumption | Every archive/active/gap claim in this spec cites the `git`/`ls`/`find` command that produced it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Document both valid target end-states for the `014` gap | Sections 2 and 7 record that the gap may be closed (retired `014-skill-readme-standardization` content renumbered into `z_archive/014`) or intentionally left open (content redistributed elsewhere), without this phase deciding which. |
| REQ-005 | Document the `016` to `030` numbering jump as an open question | Section 7 records the jump as observed fact, not as a self-evident defect or an assumed reserved range. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` pass `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/004-sk-doc-alignment --strict`.
- **SC-002**: No command run while authoring this packet mutates any path under `.opencode/specs/sk-doc`.
- **SC-003**: When re-run after the concurrent session commits, `git status --porcelain -- .opencode/specs/sk-doc` returns zero lines before this packet's verification checklist item is marked `[x]`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Concurrent sk-doc migration session completing and committing | Verification cannot start until it lands; no timeline is known | Poll `git status --porcelain -- .opencode/specs/sk-doc` before any alignment action rather than assuming a timeline. |
| Risk | Acting on a stale snapshot of sk-doc state | Could recommend git-mv/rm against files the concurrent session has already moved again | Re-verify git status immediately before any future execution proposal, not just at scaffold time. |
| Risk | Treating the `014` gap or `016`→`030` jump as self-evidently a defect | Could propose renumbering that fights the concurrent session's own plan | Leave both open questions unresolved in this phase; only the concurrent session or the user can close them. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A - documentation-only coordination phase, no runtime path is exercised.

### Security
- **NFR-S01**: No credentials, secrets, or auth surfaces are touched; sk-doc specs are internal documentation.

### Reliability
- **NFR-R01**: This phase's docs must not go stale relative to the concurrent session; re-verify facts with live commands before every future completion claim rather than trusting this scaffold's snapshot.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Concurrent session commits between two of this phase's own checks: re-run `git status --porcelain -- .opencode/specs/sk-doc` immediately before any action rather than relying on a cached count.
- Concurrent session stalls or abandons the migration mid-flight (dirty tree persists indefinitely): escalate to the user rather than assuming a resolution or timeline.

### Error Scenarios
- `git status --porcelain -- .opencode/specs/sk-doc` is still non-empty after the concurrent session reports completion: treat as a LOGIC-SYNC conflict - halt and ask which truth prevails rather than proceeding.
- The final on-disk numbering after the concurrent session's commit matches neither documented target end-state: halt and ask the user rather than silently picking one.

### State Transitions
- Dirty → clean: only occurs via the concurrent session's own commit; this phase never commits on sk-doc's behalf.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Single track (sk-doc numbering), 4 doc files authored, zero source edits. |
| Risk | 10/25 | Low direct risk (read-only posture), but colliding with a live concurrent session would be high-impact if the hard gate were ignored. |
| Research | 12/20 | Required live `git status`, archive/active directory diffs, `git ls-files`, and mtime checks to ground every claim in evidence. |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the retired top-level `014-skill-readme-standardization` content be renumbered into `z_archive/014` to close the gap, or is the gap intentionally permanent because that content was redistributed elsewhere by the concurrent session?
- Is the `016` → `030` numeric jump an intentional reserved range (`017`-`029`) for future work, or should active packets renumber contiguously once the concurrent migration lands?
- Once the tree is clean, who confirms the final target numbering — the concurrent session's own closeout doc, or a follow-up verification phase under this packet?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
