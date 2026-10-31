---
title: "Feature Specification: Phase 11: changelog-v4003-research"
description: "The v4.0.0.3 release notes predate the doctor command changes and the git hook gate settings, and may not cover all of the earlier hook hardening. This phase researches what the entry still needs, without editing it."
trigger_phrases:
  - "v4.0.0.3 changelog research"
  - "changelog doctor git hooks gap"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: changelog-v4003-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-doctor-router-gates |
| **Successor** | None |
| **Handoff Criteria** | `research/research.md` lists each missing or wrong changelog item with its evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the doctor audit follow-ups. The doctor phases and the git hook gate settings landed after the v4.0.0.3 release notes were last edited on 2026-10-02.

**Scope Boundary**: Research only. The changelog itself is not edited in this phase.

**Dependencies**:
- Phases 001-010 of this packet and the `sk-git/032-template-driven-message-enforcement` packet, as the record of what changed

**Deliverables**:
- `research/research.md`: what to add to or correct in `.skilled/changelog/skilled/v4.0.0.3.md`, with evidence

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The v4.0.0.3 entry was last edited on 2026-10-02. Since then the doctor commands were split by owner, `/doctor:rebuild` was removed, `/doctor:git` was added, and the hooks gained saved gate settings. The entry may also miss parts of the hook hardening merged the same day.

### Purpose
An evidence-backed list of what the entry should add or correct, ready for a later edit.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The doctor command changes in phases 001-010 of this packet
- The git hook gate settings, `/doctor:git` and `.sk-git/` rule editing
- The hook hardening in `sk-git/032-template-driven-message-enforcement` and its children
- A comparison against what the v4.0.0.3 entry already says

### Out of Scope
- Editing the changelog - the operator asked for research only
- Releases other than v4.0.0.3 - outside the question

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `011-changelog-v4003-research/research/` | Create | Research loop state and `research.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Three research iterations run on DeepSeek V4.1 Flash | Three iteration records in `research/` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Each proposed changelog item cites a commit, file or spec | `research/research.md` carries the citation for every item |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The report separates items the entry lacks from items it states wrongly.
- **SC-002**: Each item is checked against the repository before it is reported.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `opencode-go` provider for Pi | No iterations run | Report the provider failure |
| Risk | The model reports a gap the entry already covers | Med | Check each finding against the entry before reporting it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
- Deep-research topic: what must be added to or corrected in .skilled/changelog/skilled/v4.0.0.3.md so it covers (a) the doctor command changes in specs/system-speckit/049-doctor-audit-followups phases 001-010: trigger-index freshness, release/update customization signals, doctor gates and drift, doctor script conformance, the /doctor:update research and fixes, the speckit router contract drift, the ownership split of /doctor:speckit into /doctor:skill-advisor, /doctor:deep-loop and /doctor:runtime-mirrors with /doctor:rebuild and the fable-mode target deleted, the new /doctor:git <hooks|standards> command, and the mandatory input gates added to /doctor:skill-advisor and /doctor:mcp; and (b) the git workflow and hook changes: the speckit.hooks.<key> gate settings read by .skilled/scripts/git-hooks/lib/gate-config.sh from lib/gates.tsv, .sk-git/ rule overrides edited by .skilled/commands/doctor/scripts/git-standards.cjs, and the earlier hook hardening in specs/sk-git/032-template-driven-message-enforcement and its children 001-003 (commits e5b1ea84c7, 9c99983374, d1fe481584, f7316afc6a). compare against what the v4.0.0.3 entry already says, separate missing items from items it states wrongly or that later work made stale (for example references to /doctor:rebuild or /doctor:speckit), and cite a commit, file or spec for each item. research only; do not edit the changelog.

Research context: deep-research is active for this topic; `research/research.md` remains canonical.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
<!-- checksum: sha256:688c91d74b30ab079207537ebda7c760293e6beb0d2ba1d6eed2b9d2a5547805 -->
Deep-research findings (abridged; `research/research.md` is canonical):

- The entry never mentions the doctor commands. Against `v4.0.0.2`, `/doctor:speckit` became a retrieval check and `/doctor:update` became a release updater. `/doctor:env`, `/doctor:git`, `/doctor:skill-advisor`, `/doctor:deep-loop` and `/doctor:runtime-mirrors` are new.
- Missing hook items: saved gate settings through `speckit.hooks.<key>`, the unreadable-staged-file block, the message-cleanup fixes and the commit-body rule (`f8e2b51aa19`, in neither v4.0.0.2 nor v4.0.0.3).
- Line 88 overstates the trust rule: a repository with local `skilled.trustRepoHooks=true` runs its own hook scripts.
- `/doctor:rebuild` never shipped in a tag, so the upgrade notes start from what a `v4.0.0.2` user had.
- The glance list already holds 16 bullets against a ceiling of 12.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---


