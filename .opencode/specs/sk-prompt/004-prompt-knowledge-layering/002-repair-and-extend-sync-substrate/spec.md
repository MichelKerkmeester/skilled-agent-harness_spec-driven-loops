---
title: "Feature Specification: Phase 2 — Repair + extend sync substrate"
description: "Repurpose check-prompt-quality-card-sync.sh from a 3-mirror hash comparison into a duplication guard covering all 5 cli-* quality cards; fix the broken checker-path reference in sk-prompt."
trigger_phrases:
  - "repair sync substrate"
  - "duplication guard"
  - "check-prompt-quality-card-sync"
  - "prompt quality card sync"
  - "cli prompt quality card path"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/004-prompt-knowledge-layering/002-repair-and-extend-sync-substrate"
    last_updated_at: "2026-06-02T18:04:11Z"
    last_updated_by: "completion-agent"
    recent_action: "Phase complete — duplication guard shipped, path reference fixed"
    next_safe_action: "Phase 006 turns guard GREEN by thinning inlined tables from 4 cli-* cards"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh"
      - ".opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-skilled-agent-orchestration/z_archive/004-prompt-knowledge-layering/002-repair-and-extend-sync-substrate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: repair-and-extend-sync-substrate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-02 |
| **Branch** | `scaffold/002-repair-and-extend-sync-substrate` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 8 |
| **Predecessor** | 001-design-architecture-and-data-contract |
| **Successor** | 003-land-recommended-frameworks-data |
| **Handoff Criteria** | Guard script exits 0 on clean input; exits 1 when any cli-* card inlines the framework or CLEAR table; broken path reference corrected in cli_prompt_quality_card.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Prompt-knowledge layering across CLI skills, sk-prompt frameworks, and the sk-prompt-models model-craft hub specification.

**Scope Boundary**: The sync script and the one broken path reference. No cli-* card content is thinned in this phase (that is Phase 006 work).

**Dependencies**:
- Phase 001 design contract defining the duplication-guard approach

**Deliverables**:
- Rewritten `check-prompt-quality-card-sync.sh` — duplication guard covering all 5 cli-* cards
- Corrected checker-path reference in `sk-prompt/assets/cli_prompt_quality_card.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The existing `check-prompt-quality-card-sync.sh` script compared file hashes across only 3 mirrors, missing two cli-* cards (`cli-devin`, `cli-opencode`) entirely. The hash approach also produced false positives on whitespace edits unrelated to duplication. Separately, the Mirror Sync section of `sk-prompt/assets/cli_prompt_quality_card.md` pointed readers and automation to a checker path (`.opencode/skills/scripts/...`) that did not exist, making the guard undiscoverable.

### Purpose

Replace the hash comparison with a grep-based duplication guard that covers all 5 cli-* cards and correctly fails only when a card inlines the prohibited framework or CLEAR table headers; fix the broken path reference so callers can find and run the script.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `check-prompt-quality-card-sync.sh` as a duplication guard (grep for framework-table and CLEAR-table header rows across all 5 cli-* cards)
- Fix the broken checker-path reference in `sk-prompt/assets/cli_prompt_quality_card.md`
- Confirm guard exits 1 on current RED state (4 cards still inlining tables)

### Out of Scope
- Thinning inlined tables from cli-* cards (Phase 006)
- Adding the guard to CI pipelines (separate infra work)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` | Modify | Replace 3-mirror hash comparison with grep-based duplication guard for all 5 cli-* cards |
| `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md` | Modify | Fix broken checker-path reference from old scripts location to real system-skill-advisor path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Guard covers all 5 cli-* cards | Script checks `cli-opencode`, `cli-gemini`, `cli-devin`, `cli-codex`, `cli-claude-code` quality cards |
| REQ-002 | Guard greps for framework-table and CLEAR-table headers | Uses `| Framework \| Best for \| Complexity band |` and `| Dimension \| Floor \| Pre-dispatch question |` as detection strings |
| REQ-003 | Guard exits 1 when any card inlines either table | Running against current repo produces exit 1 with FAIL lines for the violating cards |
| REQ-004 | Guard exits 0 when no card inlines either table | Removing the prohibited content from all cards causes script to exit 0 |
| REQ-005 | Broken path reference is corrected | `cli_prompt_quality_card.md` Mirror Sync section points to `.opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Script output is human-readable | Each card gets a labelled PASS or FAIL line; overall verdict printed on last line |
| REQ-007 | Script accepts optional repo-root argument | `check-prompt-quality-card-sync.sh <path>` resolves cards relative to the given root |
| REQ-008 | Script is fail-closed | Missing card files are reported as MISSING and count toward exit 1, not silently skipped |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Guard script exits 1 on the live repo (4 cards still inlining tables) with correct FAIL/PASS labels per card
- **SC-002**: Guard script exits 0 when all 5 cards are clean
- **SC-003**: `cli_prompt_quality_card.md` path reference resolves to the real script on disk
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 architecture contract | Guard design follows the agreed duplication-guard approach | Phase 001 spec is the authoritative reference |
| Risk | Header string drift — table headers change in sk-prompt | Guard would silently pass even with inlined content | Header patterns are pinned in script comments; any sk-prompt table refactor must update the guard |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Phase delivered as scoped.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
