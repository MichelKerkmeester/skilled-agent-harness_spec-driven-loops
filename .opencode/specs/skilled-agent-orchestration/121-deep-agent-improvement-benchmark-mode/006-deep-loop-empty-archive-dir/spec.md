---
title: "Feature Specification: fix empty archive directory handling for deep-loop runtime"
description: "Fix deep-loop runtime archive handling so restart branches create archive directories lazily and avoid empty directory churn."
trigger_phrases:
  - "empty archive folder"
  - "research_archive review_archive"
  - "deep loop archive dir"
  - "archive root mkdir lazy"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/006-deep-loop-empty-archive-dir"
    last_updated_at: "2026-05-29T08:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Removed eager archive-root mkdir from research init; made all 4 restart branches lazy+guarded"
    next_safe_action: "None — phase complete; verified + reconciled"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_start-research-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-archive-fix-20260529"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: fix empty archive directory handling for deep-loop runtime

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 19 |
| **Predecessor** | 005-add-opt-in-5dim-scorer-and-skill-docs |
| **Successor** | 007-review-model-benchmark-mode-hardening |
| **Handoff Criteria** | No init mkdir creates `{mode}_archive`; restart still archives lazily; contract-parity + resolver suites green; existing empties removed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is a **maintenance phase** under packet 121, fixing a cross-cutting deep-loop defect surfaced while working in this program: empty `research_archive/` and `review_archive/` directories accumulating in spec packets (e.g. `…/122-session-120-121-deep-review/review_archive`).

**Scope Boundary**: the four deep-loop command YAMLs + two contract-parity test files + removal of existing empty archive dirs. No change to the shared resolver, reducers, or runtime scripts (they do not create archive dirs).

**Dependencies**: `system-spec-kit/shared/review-research-paths.cjs` (`resolveArtifactRoot`, read-only) and the deep-research / deep-review contract-parity vitest suites.

**Deliverables**: lazy + guarded archive creation; regression assertions; clean sweep of empties.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-research command init step `step_create_directories` ran `mkdir -p … {state_paths.archive_root}` on every fresh/resume run, but the archive root is only used on a `restart` move (rare) — so it almost always stayed empty, littering packets with empty `research_archive/`. Git archaeology (introduced in commit `537cd82d26`) plus an independent `openai/gpt-5.5-fast` read-only trace confirmed deep-review's init never created it; its empties are historical/orphaned restart artifacts.

### Purpose
A `{mode}_archive/` directory is created only when content is actually archived (a real `restart` move), never eagerly at init.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove `{state_paths.archive_root}` from deep-research `step_create_directories` (auto + confirm).
- Convert all four restart branches (research + review × auto + confirm) to a lazy, guarded archive command that creates the archive root only immediately before the move and only when the packet exists.
- Regression assertions in the deep-research / deep-review contract-parity suites.
- Remove the 5 existing empty `*_archive/` dirs (untracked).

### Out of Scope
- `deep-agent-improvement` `improvement_archive` — sibling pattern; no live eager creator found, recorded as a watch item.
- Deep-review historical orphan root-cause beyond removal — no live creator exists in the current command/runtime.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Modify | Drop archive_root from init mkdir; lazy+guarded restart archive |
| `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml` | Modify | Same |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modify | Lazy+guarded restart archive |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modify | Same |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` | Modify | Regression assertion |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` | Modify | Regression assertion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Init must not pre-create the archive root | No `step_create_directories` mkdir contains `{state_paths.archive_root}`; a fresh run creates no `*_archive/` dir |
| REQ-002 | Restart must still archive correctly | Restart with an existing packet moves it under `{mode}_archive/{timestamp}`; restart with no packet creates nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Lock the invariant with tests | Contract-parity suites assert no eager archive_root + the lazy guarded restart; all suites green |
| REQ-004 | Remove existing empty archive dirs | The 5 empty `*_archive/` dirs removed; populated archives untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh `/deep:start-research-loop` or `/deep:start-review-loop` run produces no empty `*_archive/` directory.
- **SC-002**: A `restart` still archives the prior tree under `{mode}_archive/{timestamp}/`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Restart previously relied on init pre-creating archive_root | Med | Restart branch now creates archive_root lazily right before the move (verified by simulation) |
| Risk | Changing declarative `archive:` → `command:` | Low | Parity tests assert `on_restart:` / `options:` unchanged; only the archive directive form changed |
| Dependency | `review-research-paths.cjs` resolver | Low | Path resolution unchanged (resolver never mkdirs) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- RESOLVED: deep-review's empty archives have no live creator (init never created them; git-untracked; the 122 case was a pure `new` run). Removal plus the shared lazy guard satisfy "never created again".
- RESOLVED: the restart branch must create the archive root lazily once init no longer does — implemented as a guarded `command:` across all four YAMLs.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
