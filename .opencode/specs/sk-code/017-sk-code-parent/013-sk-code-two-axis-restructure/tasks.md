---
title: "Tasks: Phase 13 sk-code two-axis restructure"
description: "Completed task breakdown for the shipped sk-code two-axis surface restructure and review rename."
trigger_phrases:
  - "sk-code two-axis tasks"
  - "surface packet tasks"
  - "review rename tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/013-sk-code-two-axis-restructure"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Backfilled strict Level 2 task documentation for the shipped two-axis restructure."
    next_safe_action: "Use completed task list as phase evidence"
---
# Tasks: Phase 13 sk-code two-axis restructure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Identify scattered Webflow evidence in workflow packets (`.opencode/skills/sk-code/`) [mechanical]
- [x] T002 Identify OpenCode language references and checklists (`.opencode/skills/sk-code/`) [mechanical]
- [x] T003 Identify Motion.dev animation references and assets (`.opencode/skills/sk-code/`) [mechanical]
- [x] T004 Identify rename consumers for `code-review` (`.opencode/`, `.claude/`) [mechanical]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Surface Packets
- [x] T005 Move Webflow references and assets into `webflow/` (`.opencode/skills/sk-code/webflow/`) [large]
- [x] T006 Move OpenCode references and assets into `opencode/` (`.opencode/skills/sk-code/opencode/`) [large]
- [x] T007 Move Motion.dev references and assets into `animation/` (`.opencode/skills/sk-code/animation/`) [large]
- [x] T008 Author surface packet SKILL, README, and changelog files (`webflow/`, `opencode/`, `animation/`) [medium]

### Registry and Router
- [x] T009 Add `packetKind` across all eight modes (`.opencode/skills/sk-code/mode-registry.json`) [medium]
- [x] T010 Add three surface entries and `extensions.surface-axis` (`.opencode/skills/sk-code/mode-registry.json`) [medium]
- [x] T011 Move surface aliases off implement and onto the surface packets (`.opencode/skills/sk-code/mode-registry.json`) [medium]
- [x] T012 Add surface router signals, owned vocabulary classes, `surfaceBundle`, and tie-breaks (`.opencode/skills/sk-code/hub-router.json`) [medium]

### Rename and Path Repoints
- [x] T013 Fold `code-review` into `review` (`.opencode/skills/sk-code/review/`) [large]
- [x] T014 Repoint rule-canary CI and deep-review agents (`.github/`, `.claude/`, `.opencode/`) [medium]
- [x] T015 Repoint prompt-pack template, rule-copy scripts/tests, sk-doc schema docs, and speckit YAMLs (`.opencode/skills/`) [medium]
- [x] T016 Normalize smart-routing paths (`.opencode/skills/sk-code/shared/references/smart_routing.md`) [medium]
- [x] T017 Update router replay and router-sync guards (`router-replay.cjs`, router-sync tests) [medium]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit Tests
- [x] T018 Run check-rule-copies test for review rename consumers [verified]
- [x] T019 Run vocab-sync and router-sync vitests [verified]

### Integration Tests
- [x] T020 Run `parent-skill-check sk-code` in default mode [verified]
- [x] T021 Run `PARENT_HUB_CHECK_STRICT=1 parent-skill-check sk-code` [verified]
- [x] T022 Run router replay for `review my webflow animation` [verified]

### Manual Verification
- [x] T023 Repair 298 move-broken relative links with reverse-move resolver [verified]
- [x] T024 Confirm dead-path grep returns 0 live stale references in sk-code tree [verified]

### Documentation
- [x] T025 Update hub SKILL, README, description, graph metadata, and changelog to `4.1.0.0` [verified]
- [x] T026 Record phase implementation summary with shipped commit and gate results (`implementation-summary.md`) [verified]
- [x] T027 Backfill strict Level 2 spec docs for the phase (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) [verified]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Shipped commit `90e8833411` recorded.
- [x] Deterministic verification gates passed.
- [x] Checklist.md fully verified.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
