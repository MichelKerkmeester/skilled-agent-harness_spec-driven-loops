---
title: "Feature Specification: Phase 4 — onboard implement"
description: "Relocate the flat sk-code references, assets, and scripts into the parent-hub layout, split content across shared and mode packets, and repoint internal links without authoring new skill content."
trigger_phrases:
  - "sk-code onboard implement"
  - "sk-code content relocation"
  - "sk-code parent hub relocation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/004-onboard-implement"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Documented the completed onboard-implement relocation phase"
    next_safe_action: "Proceed to 005 foldin-review to fold sk-code-review into code-review"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4 — onboard implement

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
| **Priority** | P1 |
| **Status** | Accepted / Complete |
| **Created** | 2026-07-04 |
| **Branch** | Worktree for `124-sk-code-parent` content relocation work |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 9 |
| **Predecessor** | ../003-scaffold-hub/spec.md |
| **Successor** | ../005-foldin-review/spec.md (planned) |
| **Handoff Criteria** | Flat references/assets/scripts content relocated into shared and mode packets, internal links repointed, full markdown link-resolution reports zero broken content links, and contract authoring remains deferred |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the sk-code parent-skill conversion. It is the **content relocation step** after phase 003 created the parent-hub scaffold.

Phase 004 relocated the flat `sk-code` content directories into the nested parent-hub layout. The move covered 128 files from top-level `references/`, `assets/`, and `scripts/`, using `git mv` so history is preserved. The flat top-level `references/`, `assets/`, and `scripts/` directories are now removed.

**Relocation split:**
- `shared/`: 17 files for surface detection, routing, phase detection, universal cross-cutting rules, shared surface rule sets, and universal asset patterns.
- `code-implement/`: 82 files for webflow and opencode authoring reference trees, motion.dev references, and build assets. Implement owns surface authoring.
- `code-quality/`: 16 files for comment-hygiene, dist-staleness scripts and hooks, opencode authoring/language checklists, and the code-quality checklist.
- `code-verify/`: 9 files for webflow verification references, alignment/stack-folder verification scripts, and verification checklists.
- `code-debug/`: 4 files for webflow debugging references and debug checklists.

`benchmark/` and `manual_testing_playbook/` intentionally stayed at the hub as routing-level test artifacts.

**Repointing outcome:** the move fragmented cohesive surface sub-trees across mode packets, so internal relative links dangled. An initial LLM repointing pass self-reported zero unresolved links but a full link-resolution check found 101 still broken. A deterministic old-structure-aware repair pass then reconstructed each source file's pre-move location, resolved each broken link against that location, mapped the target through the move-map, and recomputed the correct relative path. The repair fixed 111 links across 43 files. A full markdown link-resolution check now reports zero broken content links. One apparent hit was JavaScript inside a code fence, not a link.

**Deliberate refinement of decision-record §5.3:** to keep each surface language sub-tree cohesive and minimize broken links, the webflow/opencode `quality_standards` files travel with their language directories into `code-implement` as surface authoring reference, while `code-quality` owns the checklists and hygiene scripts. Mode packets may cross-reference each other's reference material.

**Scope Boundary**: relocation and link repointing only. Do not author the mode-packet workflow contracts in this phase; that is phase 006. Do not fold `.opencode/skills/sk-code-review/` into `code-review`; that is phase 005.

**Dependencies**:
- Scaffold phase: `../003-scaffold-hub/spec.md`.
- Next fold-in phase: `005-foldin-review`.
- Contract authoring phase: `006`.

**Deliverables**:
- 128 relocated files split across `shared/`, `code-implement/`, `code-quality/`, `code-verify/`, and `code-debug/`.
- Internal markdown links repointed to their new cross-packet locations.
- Audit map of destination buckets and source sub-trees.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the parent-hub scaffold existed, the flat top-level `references/`, `assets/`, and `scripts/` directories still held the prior monolithic sk-code content. The mode packets could not own their reference material until those files were moved into the nested layout.

### Purpose
Relocate the existing flat sk-code content into the parent-hub packet layout without authoring new content, preserve history through `git mv`, and repair internal links so the moved material remains navigable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move top-level `references/`, `assets/`, and `scripts/` content into `shared/` and the implement, quality, verify, and debug mode packets.
- Preserve file history by moving all 128 files with `git mv`.
- Keep `benchmark/` and `manual_testing_playbook/` at the hub.
- Repoint internal relative links after relocation.
- Exclude `changelog/` and `benchmark/` from repointing because they are historical records that intentionally cite old paths.
- Revert the out-of-scope `package.json` runtime side effect.

### Out of Scope
- Authoring mode-packet workflow contracts; phase 006 owns contract authoring.
- Folding `.opencode/skills/sk-code-review/` into `code-review`; phase 005 owns fold-in.
- Creating new reference content beyond relocation and link repointing.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/shared/` | Move target | Shared routing, surface detection, cross-cutting rules, and universal asset patterns |
| `.opencode/skills/sk-code/code-implement/` | Move target | Surface authoring references and build assets |
| `.opencode/skills/sk-code/code-quality/` | Move target | Quality checklists, comment-hygiene, dist-staleness scripts, and hooks |
| `.opencode/skills/sk-code/code-verify/` | Move target | Verification references, scripts, and checklists |
| `.opencode/skills/sk-code/code-debug/` | Move target | Debugging references and checklists |
| `.opencode/skills/sk-code/references/` | Remove | Flat top-level source directory removed after relocation |
| `.opencode/skills/sk-code/assets/` | Remove | Flat top-level source directory removed after relocation |
| `.opencode/skills/sk-code/scripts/` | Remove | Flat top-level source directory removed after relocation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Move flat content into hub packets | All 128 files from flat `references/`, `assets/`, and `scripts/` relocate into `shared/` and mode packets |
| REQ-002 | Preserve history | All 128 moves are tracked by git as renames |
| REQ-003 | Repoint internal links | Full markdown link-resolution reports zero broken content links |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Keep routing-level artifacts at hub | `benchmark/` and `manual_testing_playbook/` intentionally remain at the hub |
| REQ-005 | Apply §5.3 refinement | Surface language `quality_standards` files travel with language dirs into `code-implement`; `code-quality` owns checklists and hygiene scripts |
| REQ-006 | Avoid new content authoring | Phase remains a move and repoint phase only |
| REQ-007 | Revert out-of-scope runtime side effect | `package.json` runtime side effect is reverted |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The flat top-level `references/`, `assets/`, and `scripts/` directories are removed after their 128 files are moved into the parent-hub layout.
- **SC-002**: Markdown link-resolution reports zero broken content links after deterministic repair.
- **SC-003**: Verification confirms all 128 moves are tracked as renames, non-markdown asset path references are spot-checked valid, and the out-of-scope package side effect is reverted.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:research-questions -->
## 6. RESEARCH QUESTIONS (Track R) & CONTEXT TARGETS (Track C)

### Track R — deep-research
- The relocation taxonomy was already constrained by the phase 003 scaffold and the accepted parent-hub layout.
- This phase did not reopen the five-mode taxonomy.

### Track C — deep-context
- Confirm every moved file lands in `shared/`, `code-implement/`, `code-quality/`, `code-verify/`, or `code-debug/` according to the split map.
- Confirm internal markdown links resolve after deterministic repair.
- Preserve the repointing lesson for later relocation-heavy phases.
<!-- /ANCHOR:research-questions -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cross-packet relative links remain broken | Moved reference trees become hard to use | Run deterministic old-structure-aware repair and full link-resolution verification |
| Risk | Surface authoring references are split too aggressively | Language sub-trees lose cohesion and link counts grow | Keep webflow/opencode `quality_standards` with language dirs in `code-implement` |
| Risk | LLM repointing is trusted without resolution checks | Broken links remain despite a clean self-report | Require deterministic reconstruction and link-resolution verification |
| Dependency | Phase 005 fold-in | Standalone `sk-code-review` remains outside the parent hub until the next phase | Proceed to fold-in after relocation is complete |
| Dependency | Phase 006 contract authoring | Mode-packet `SKILL.md` files remain skeletons after relocation | Author workflow contracts in phase 006 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- None for this completed relocation phase. Contract authoring and review fold-in are known phase boundaries, not open questions.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
