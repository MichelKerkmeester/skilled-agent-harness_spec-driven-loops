---
title: "Tasks: OpenCode skill wrapper and accessibility refinement"
description: "Implementation queue for the sk-doc `create-diff` nested mode wrapper, automatic edit capture, explicit fallback, and accessible review."
trigger_phrases:
  - "OpenCode skill tasks"
  - "AI edit snapshot tasks"
  - "document diff accessibility tasks"
importance_tier: "important"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/136-standalone-document-diff-skill/006-opencode-skill-and-accessibility"
    last_updated_at: "2026-07-13T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the OpenCode wrapper and accessibility scaffold"
    next_safe_action: "Stabilize phases 002 through 005, then run create-skill intake"
    blockers:
      - "Stable phases 002 through 005 and passing phase 003 gates"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-phase-006-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: OpenCode skill wrapper and accessibility refinement

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are satisfied |
| `[B]` | Blocked by an explicit gate |

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phases 002 through 005 and phase 003 gates are ready
- [ ] T002 Freeze public API, CLI, diagnostics, exit codes, and capability tiers
- [ ] T003 Load sk-doc create-skill instructions and confirm the `create-diff` mode name + registration files
- [ ] T004 Scaffold and register `create-diff` under sk-doc (mode-registry.json + hub-router.json)
- [ ] T005 Replace generated placeholders with the bounded orchestration contract
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Implement target and capability validation
- [ ] T007 Implement the capture-before-write ordering invariant
- [ ] T008 Implement after-edit comparison and local report handoff
- [ ] T009 Implement explicit before and after fallback
- [ ] T010 Implement lock, unsupported-format, corrupt-state, and cleanup guidance
- [ ] T011 Prove the wrapper contains no parser, diff, snapshot, or report algorithm

### Accessibility refinement

- [ ] T012 [P] Complete headings, landmarks, summaries, skip links, and ARIA labels
- [ ] T013 [P] Complete keyboard order, visible focus, and view controls
- [ ] T014 [P] Verify contrast, high contrast, zoom, reflow, and print behavior
- [ ] T015 [P] Verify screen-reader announcements and change navigation
- [ ] T016 [P] Verify RTL, CJK, long tokens, reduced motion, and no-script use
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Run parent-hub + create-diff mode canon validation (parent-skill-check, package_skill --check, frontmatter versions)
- [ ] T018 Run automatic capture, after-edit review, interruption, and explicit-pair tests
- [ ] T019 Compare direct and wrapped canonical and HTML output
- [ ] T020 Run phase 003 hostile-input and zero-network gates
- [ ] T021 Complete automated and manual accessibility matrices
- [ ] T022 Publish simple capability, limitation, cleanup, and recovery guidance
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] tasks remain
- [ ] Automatic capture cannot run after the first edit write
- [ ] Explicit-pair fallback works without stored state
- [ ] Skill and direct CLI behavior remain equivalent
- [ ] Accessibility and local-only gates pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Research**: `../001-research-and-requirements/research/research.md`
- **Portable CLI**: `../005-pdf-cli-and-cross-platform-state/spec.md`
<!-- /ANCHOR:cross-refs -->
