---
title: "Tasks - Phase 001 Complete CocoIndex MCP Fork"
description: "Actionable task breakdown for importing upstream v0.2.33 as a complete local fork and porting spec-kit patches."
trigger_phrases:
  - "027 phase 001 tasks"
  - "cocoindex complete fork tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-cocoindex-complete-fork"
    last_updated_at: "2026-05-10T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored Phase 001 tasks"
    next_safe_action: "Decide fork layout and create import manifest"
    blockers: []
    key_files: ["tasks.md", "checklist.md", "plan.md"]
    completion_pct: 0
---
# Tasks: Complete CocoIndex MCP Fork

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending
- `[x]` completed
- `(P0)` blocker
- `(P1)` required
- `(P2)` nice to have
- Evidence must be recorded in `checklist.md` or `implementation-summary.md` before closing a task.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 (P0) Confirm target spec parent and create Phase 001.
- [x] T002 (P0) Renumber existing phase folders from 001-010 to 002-011.
- [x] T003 (P0) Research local soft-fork version, upstream latest tag, downloaded source tree, package/test delta, and transitive dependency boundary.
- [ ] T004 (P0) Decide whether `cocoindex` engine vendoring is excluded or included in this phase.
- [ ] T005 (P0) Choose fork-root layout: upstream `src/` layout under `mcp_server/` or local adapter layout.
- [ ] T006 (P1) Create import manifest listing imported, excluded, and deferred upstream files.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 (P0) Import complete upstream v0.2.33 fork root from `external/cocoindex-code-main`.
- [ ] T008 (P0) Port spec-kit patch REQ-001 mirror exclusions and canonical resource path behavior.
- [ ] T009 (P0) Port spec-kit patch REQ-002 chunk identity fields.
- [ ] T010 (P0) Port spec-kit patch REQ-003 over-fetch dedup and response counters.
- [ ] T011 (P0) Port spec-kit patch REQ-004 path-class taxonomy.
- [ ] T012 (P0) Port spec-kit patch REQ-005 bounded reranking.
- [ ] T013 (P0) Port spec-kit patch REQ-006 `rankingSignals`, `raw_score`, protocol, CLI, and MCP DTO fields.
- [ ] T014 (P1) Update `install.sh`, `update.sh`, `doctor.sh`, and `ensure_ready.sh` for the chosen complete-fork layout.
- [ ] T015 (P1) Update skill docs, references, NOTICE, LICENSE handling, and CHANGELOG.
- [ ] T016 (P1) Update later phase dependency notes for Phase 007, Phase 010, and Phase 011 if implementation changes their baseline assumptions.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 (P0) Run default upstream pytest subset with Docker/provider tests excluded.
- [ ] T018 (P0) Run spec-kit patch regression tests for extended result fields and dedup/rerank behavior.
- [ ] T019 (P0) Run local editable install smoke and verify `ccc --version` includes a spec-kit fork identifier.
- [ ] T020 (P1) Run non-destructive doctor/ensure_ready checks with isolated runtime directories.
- [ ] T021 (P1) Run recursive strict SpecKit validation for the parent packet.
- [ ] T022 (P1) Fill `implementation-summary.md` and mark checklist evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- P0 tasks T004-T013 and T017-T019 complete with evidence.
- P1 tasks either complete or explicitly deferred by the user.
- Recursive validation passes or any warning is documented with remediation.
- No later CocoIndex phase remains numbered as old Phase 006/009/010 in active planning docs.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: `spec.md`
- Plan: `plan.md`
- Research: `research.md`
- Decision: `decision-record.md`
- Checklist: `checklist.md`
- Parent packet: `../spec.md`
<!-- /ANCHOR:cross-refs -->
