---
title: "Feature Specification: Phase 15: v4-0-0-13-changelog"
description: "Main had shipped the in-session handover, OpenCode 1 and 2 dual compatibility and the sk-code-skilled rename since v4.0.0.12 with no global release entry. This phase writes the v4.0.0.13 Skilled changelog with the in-session handover as its headline."
trigger_phrases:
  - "v4 0 0 13 changelog"
  - "phase 15 v4 0 0 13 changelog"
  - "skilled v4.0.0.13 release notes"
  - "sessions that hand themselves over"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 15: v4-0-0-13-changelog

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/172-v4-0-0-13-changelog-and-handover-review` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 16 |
| **Predecessor** | 014-handover-docs-promotion |
| **Successor** | 016-handover-trigger-review |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, `validate_document.py` passes on the release entry and strict validation of this folder prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the Session relaunch loop specification.

**Scope Boundary**: Documentation only. One new global release entry under `.skilled/changelog/skilled/`. No code, test, config or component changelog changes, and no GitHub release.

**Dependencies**:
- Phases 001 to 014, which shipped and documented the in-session handover the entry headlines.
- The source-of-truth doc for every handover claim: `.skilled/hooks/session-relaunch/README.md`.
- The sk-doc sk-create-changelog mode, which owns the release entry format and its validators.

**Deliverables**:
- `.skilled/changelog/skilled/v4.0.0.13.md`, titled "v4.0.0.13, Sessions That Hand Themselves Over", in the expanded format.

**Changelog**:
- This phase is itself the release entry. The component changelogs for `cli-opencode` (v1.5.0.0) and `sk-code-skilled` (v2.0.0.0) already existed and stay unchanged.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Main had moved well past the v4.0.0.12 release at commit `0ead854621`. It now carried the in-session handover from this packet, OpenCode 1 and 2 dual compatibility, the `sk-code-opencode` to `sk-code-skilled` rename, a deep-loop legacy row migration, more CI suites and worktree bun provisioning. None of it had a global Skilled release entry, so a reader of `.skilled/changelog/skilled/` saw nothing after v4.0.0.12 and the rename's breaking surface id change was written down nowhere a user would look.

### Purpose
One release entry tells a user what changed since v4.0.0.12 in plain words. The in-session handover leads, the breaking rename is marked, and the upgrade notes give the steps a user has to take.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The version choice: the next build number after the highest local and upstream entry.
- The entry's scope: everything merged to main since v4.0.0.12.
- An expanded-format entry with a headline section for the in-session handover, sections for OpenCode 1 and 2 and the framework code standards rename, a marked breaking change and upgrade notes.
- The sk-doc validators on the finished entry.

### Out of Scope
- A GitHub release, because none was asked for.
- Component changelogs, because `cli-opencode` v1.5.0.0 and `sk-code-skilled` v2.0.0.0 already exist.
- The prompt-improver Haiku eligibility change, dropped as too minor for a global entry.
- Any edit to the session-relaunch README or other source docs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/changelog/skilled/v4.0.0.13.md` | Create | The v4.0.0.13 global Skilled release entry, expanded format |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The entry exists at `.skilled/changelog/skilled/v4.0.0.13.md` with a version that is unique and strictly greater than every local and upstream entry and tag, and its frontmatter carries the five keys `title`, `description`, `trigger_phrases`, `importance_tier` and `contextType`. |
| REQ-002 | The in-session handover is the headline, and every claim the entry makes about it matches `.skilled/hooks/session-relaunch/README.md`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The entry uses the expanded format, because the release carries a breaking rename and ten or more changes. |
| REQ-004 | `validate_document.py` passes on the entry and `hvr_scan.py` reports no hard blocker. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader of the v4.0.0.13 entry learns in its opening paragraph that a long session hands over in the same terminal and which runtimes do it on their own.
- **SC-002**: The entry validates with 0 issues and 0 HVR hard blockers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A version number collides with an existing entry or tag | High | Both the local and `origin/main` changelog folders and the tag list were checked before the file was named |
| Risk | A handover claim overstates the feature | Med | Each number and runtime list was read back against the session-relaunch README |
| Risk | Users miss the breaking surface id change | Med | The rename carries a bold Breaking line and an upgrade note |
| Dependency | Phases 001 to 014 | The headline would describe unshipped work | The parent packet lists every phase complete |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The entry stays readable in one sitting, with one section per user-visible area.

### Security
- **NFR-S01**: The entry names no secret, token or private path. The Hermes note scopes `HERMES_ENABLE_PROJECT_PLUGINS=1` to wrapped launches only.

### Reliability
- **NFR-R01**: Every number in the entry has a source: the session-relaunch README for the handover, the merged specs for the rest.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A session started outside the loop: the entry says it never gets the handoff request and auto-compaction stays the fallback.
- A repository that links `.skilled`: the entry says it hops the same way.

### Error Scenarios
- A hop that will not go idle: the entry names the 30-second deadline and the macOS notification with the manual command.

### State Transitions
- A runaway chain: the entry names the hop cap of ten and the ten-minute freshness limit.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | One new doc of about 100 lines |
| Risk | 3/25 | Documentation only, with one breaking change to state |
| Research | 6/20 | A sweep of main since v4.0.0.12 and a read of the source docs |
| **Total** | **13/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
