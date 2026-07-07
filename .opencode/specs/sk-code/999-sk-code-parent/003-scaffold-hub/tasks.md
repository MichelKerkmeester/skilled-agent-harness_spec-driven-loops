---
title: "Tasks: Phase 3 — scaffold hub"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-code scaffold hub tasks"
  - "sk-code parent scaffold tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/003-scaffold-hub"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Documented completed scaffold-hub tasks"
    next_safe_action: "Proceed to 004-onboard-implement to relocate implement, quality, debug, and verify contracts into packets and shared/"
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3 — scaffold hub

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read 001 templates and the 002 architecture decision; evidence: phase 002 §5 binds 003 as scaffold-hub with five mode packets.
- [x] T002 Read built scaffold files; evidence: hub, registry, router, graph metadata, shared README, changelog, and five packet skeletons exist.
- [x] T003 Freeze static routing-parity fixture expectations for later baseline capture; evidence: `fixtures/routing-parity-fixtures.md` records eight representative prompts.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author hub `SKILL.md`; evidence: `.opencode/skills/sk-code/SKILL.md` is version `4.0.0.0` and routes through `mode-registry.json`.
- [x] T005 Create `mode-registry.json`; evidence: five modes carry `advisorRouting.routingClass: "metadata"` and the agreed tool surfaces.
- [x] T006 Create `hub-router.json`; evidence: router policy defaults to `implement` and includes five router signals plus vocabulary classes.
- [x] T007 Rewrite hub `graph-metadata.json` identity-preserving; evidence: `skill_id` and `family` are `sk-code`, with existing edges/domains/intent signals retained and derived hub fields extended.
- [x] T008 Author hub README, changelog, and shared placeholder; evidence: `README.md`, `changelog/v4.0.0.0.md`, and `shared/README.md` exist.
- [x] T009 Create five mode-packet skeletons; evidence: `code-implement`, `code-quality`, `code-debug`, `code-verify`, and `code-review` each have `SKILL.md` + `README.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify exactly one graph metadata file; evidence: scaffold verification PASS found only `.opencode/skills/sk-code/graph-metadata.json`.
- [x] T011 Verify all JSON validity; evidence: scaffold verification PASS for `mode-registry.json`, `hub-router.json`, and `graph-metadata.json`.
- [x] T012 Verify banned paths untouched; evidence: `references/`, `assets/`, `scripts/`, `benchmark/`, `manual_testing_playbook/`, and `description.json` were not changed.
- [x] T013 Verify `sk-code-review` untouched; evidence: scaffold verification PASS confirmed no changes to `.opencode/skills/sk-code-review/`.
- [x] T014 Verify comment/doc hygiene; evidence: scaffold verification PASS found no comment-hygiene leaks in code comments.
- [x] T015 Revert out-of-scope runtime side effect; evidence: `package.json` and `package-lock.json` side-effect changes were reverted.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Scaffold-hub phase accepted and complete; relocation/fold-in/integration work deferred to phases 004, 005, and 007
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Fixtures**: See `fixtures/routing-parity-fixtures.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
