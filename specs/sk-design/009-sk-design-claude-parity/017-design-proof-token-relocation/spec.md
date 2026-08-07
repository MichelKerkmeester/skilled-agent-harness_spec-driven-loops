---
title: "Feature Specification: Phase 017 - design_proof_token.md Relocation to shared/"
description: "Moves sk-design's lone hub-root references/design_proof_token.md into shared/ (alongside its cross-cutting siblings) and repoints every live citation, then removes the now-empty references/ folder."
trigger_phrases:
  - "design proof token relocation"
  - "phase 017 sk-design references"
  - "sk-design shared folder consolidation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/017-design-proof-token-relocation"
    last_updated_at: "2026-07-07T04:20:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec.md after the move + reference repoint was completed and verified"
    next_safe_action: "Author plan.md, tasks.md, implementation-summary.md, then commit and push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-proof-token-relocation-017"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 017 - design_proof_token.md Relocation to shared/

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-design`'s hub root had a `references/` folder containing exactly one file, `design_proof_token.md`, while every other cross-cutting design doc (`anti_slop_principles.md`, `cognitive_laws.md`, `design_token_vocabulary.md`, etc.) already lives directly in `shared/`. This is visible in `hub-router.json`'s own `routerPolicy.defaultResource` list, where 3 of 4 entries are `shared/*.md` and the fourth is the lone `references/design_proof_token.md` outlier. A single-file `references/` folder sitting beside a fully-populated `shared/` that holds the same kind of cross-cutting reference material is structural drift, not an intentional split.

### Purpose

Move `design_proof_token.md` into `shared/`, repoint every live citation (in-skill and cross-skill), remove the now-empty `references/` folder, and verify the skill-benchmark D5 connectivity gate still passes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `git mv .opencode/skills/sk-design/references/design_proof_token.md` -> `.opencode/skills/sk-design/shared/design_proof_token.md` (preserves rename history).
- Remove the now-empty `.opencode/skills/sk-design/references/` folder.
- Repoint the one in-skill citation (`hub-router.json` `routerPolicy.defaultResource`) and the two `shared/assets/*.md` proof-card citations to the new path.
- Repoint the four cross-skill citations in `.opencode/skills/mcp-open-design/references/{cli_child_pairing,guarded_proxy,freshness_invalidation,inner_generator_binding}.md` (six total occurrences, two of which carry `#anchor` fragments that must survive the edit unchanged).
- Re-run the skill-benchmark D5 connectivity gate (router mode) to confirm no orphaned or broken reference.

### Out of Scope

- Any content edit to `design_proof_token.md` itself (moved verbatim; its own internal citations use repo-absolute paths, so the move does not affect them).
- Historical/frozen documents that describe this file's PAST path as a point-in-time record rather than a live pointer: `changelog/v1.1.0.0.md`, prior review-iteration snapshots, and one already-closed phase's `implementation-summary.md` (`skilled-agent-orchestration/124-.../015-sk-design-canon-alignment/implementation-summary.md`) — these are left untouched, the same way a changelog entry or git history is never retroactively rewritten.
- Any change to `mode-registry.json` (this file is only ever cited from `hub-router.json`, never from the mode registry).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-design/references/design_proof_token.md` | Move | -> `.opencode/skills/sk-design/shared/design_proof_token.md` |
| `.opencode/skills/sk-design/references/` | Delete | Now-empty folder removed |
| `.opencode/skills/sk-design/hub-router.json` | Edit | `defaultResource` path repointed; version bump |
| `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md` | Edit | Relative path repointed (`../../references/` -> `../`) |
| `.opencode/skills/sk-design/shared/assets/context_loaded_card.md` | Edit | Relative path repointed (`../../references/` -> `../`) |
| `.opencode/skills/mcp-open-design/references/cli_child_pairing.md` | Edit | Path segment repointed |
| `.opencode/skills/mcp-open-design/references/guarded_proxy.md` | Edit | Path segment repointed (2 occurrences) |
| `.opencode/skills/mcp-open-design/references/freshness_invalidation.md` | Edit | Path segment repointed (anchor preserved) |
| `.opencode/skills/mcp-open-design/references/inner_generator_binding.md` | Edit | Path segment repointed (2 occurrences, 1 anchor preserved) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | File relocated with history preserved | `git mv` used, not delete+recreate; `git log --follow` on the new path shows the file's prior history |
| REQ-002 | Every live reference repointed | A repo-wide grep for `references/design_proof_token` (excluding changelog/review/closed-phase snapshots) returns zero hits |
| REQ-003 | Anchors preserved on cross-skill citations | The two `#anchor`-bearing links in `mcp-open-design` still resolve to the same section after the path segment change |
| REQ-004 | `references/` folder fully removed | `.opencode/skills/sk-design/references/` no longer exists on disk |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | D5 connectivity gate still passes | Router-mode skill-benchmark run shows D5 connectivity 100/100 post-move |
| REQ-006 | `hub-router.json` still parses | `python3 -c "import json; json.load(...)"` succeeds |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the move is complete, **When** a repo-wide grep runs for the old path, **Then** only historical/frozen documents remain (0 live hits).
- **SC-002**: **Given** the skill-benchmark is re-run in router mode, **Then** D5 connectivity scores 100/100 and the overall verdict stays PASS.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Missing a citation leaves a dangling link | Medium | Repo-wide grep performed BEFORE and AFTER the edit, cross-checked against every file type (`.md`, `.json`, `.yaml`, `.txt`) |
| Risk | Anchor fragments dropped during the path-segment edit | Low | `sed` substitution targeted only the `sk-design/references/` segment, leaving any trailing `#anchor` untouched by construction |
| Dependency | `d5-connectivity.cjs` (skill-benchmark Lane C) as the automated verification gate | Low | Already exercised twice this session (phase 016); known-fast, deterministic, no LLM dispatch needed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding.
<!-- /ANCHOR:questions -->
