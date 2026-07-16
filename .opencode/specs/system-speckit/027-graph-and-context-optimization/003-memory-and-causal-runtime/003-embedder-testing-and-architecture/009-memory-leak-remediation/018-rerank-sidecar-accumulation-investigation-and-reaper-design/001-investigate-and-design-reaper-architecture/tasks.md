---
title: "Tasks: Rerank-Sidecar Accumulation Investigation and Reaper Design"
description: "Canonical-anchor task ledger for lifecycle mapping, three-layer reaper evaluation, ADR authoring, and strict validation."
trigger_phrases:
  - "arc 010 004 001 tasks"
  - "rerank sidecar reaper design tasks"
importance_tier: "critical"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture"
    last_updated_at: "2026-05-23T10:45:00Z"
    last_updated_by: "codex"
    recent_action: "completed-rerank-sidecar-reaper-design-tasks"
    next_safe_action: "use implementation-summary.md follow-on Files-to-Change"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
      - "research/findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0100040010100040010100040010100040010100040010100040010100040010"
      session_id: "010-004-001-rerank-reaper-design"
      parent_session_id: null
    completion_pct: 100
---
# Tasks: Rerank-Sidecar Accumulation Investigation and Reaper Design

<!-- SPECKIT_LEVEL: 3 -->
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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T000 Read this packet's `spec.md`.
- [x] T001 Read `../spec.md` and `../../spec.md` for parent and arc-root scope.
- [x] T002 Read full `.opencode/bin/lib/ensure-rerank-sidecar.cjs`.
- [x] T003 Read full `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`.
- [x] T004 Read full `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py`.
- [x] T005 Read full `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py`.
- [x] T006 Verify current `start_new_session=True` call sites in `mcp-coco-index` client and sidecar launcher.
- [x] T007 Read F88/F102/F69/F15/F49 precedent docs.
- [x] T008 Read arc `010/003/001` canonical plan/tasks/checklist anchors.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Author `research/iter-001.md` with frontmatter, lifecycle map, ledger lifecycle, existing GC paths, start-new-session verification, failure modes, and findings list.
- [x] T011 Populate `research/findings-registry.json` with 12 canonical lifecycle fingerprints.
- [x] T012 Author `research/research.md` with the required 10-section synthesis.
- [x] T013 Evaluate Layer B owner-liveness self-check with pros, cons, edge cases, tests, and cost.
- [x] T014 Evaluate Layer D launcher pre-flight reap with pros, cons, edge cases, tests, and cost.
- [x] T015 Evaluate Layer A idle backstop with pros, cons, edge cases, tests, and cost.
- [x] T016 Compute layer-interaction matrix and marginal coverage; reject no layer because all three have non-zero marginal coverage.
- [x] T017 Define identity-verified PID check contract for macOS `ps -p PID -o lstart= -o comm=`.
- [x] T018 Define ledger schema extension for owner identity rows.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Create `plan.md`, `tasks.md`, and `checklist.md` using canonical sibling anchors.
- [x] T021 Create `decision-record.md` with 7 Proposed ADRs.
- [x] T022 Create `implementation-summary.md` with Completed status, 100 percent completion, Files-to-Change list, and commit handoff.
- [x] T023 Update this packet's `spec.md` completion metadata.
- [x] T024 Run strict validation for this packet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Current lifecycle root cause is confirmed with file:line citations.
- [x] Existing cleanup paths are classified as ledger-row cleanup, not process reaping.
- [x] Three-layer B+D+A design is retained with explicit marginal coverage.
- [x] At least 5 ADRs exist; this packet provides 7.
- [x] `implementation-summary.md` contains absolute paths for every changed or created packet file.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Iteration research**: `research/iter-001.md`
- **Synthesis**: `research/research.md`
- **Registry**: `research/findings-registry.json`
- **Decision record**: `decision-record.md`
- **Precedent F88/F102/F69**: `../../002-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/`
- **Precedent F15/F49**: `../../003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/004-fix-investigation-p1s-for-launcher-and-reindex-deadcode/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:architecture-tasks -->
## Architecture Tasks

- [x] ARCH-001 Preserve warm-model detached launch semantics.
- [x] ARCH-002 Require owner identity verification before treating a PID as live.
- [x] ARCH-003 Require JS/Python launcher parity for owner identity, stale-owner pruning, and reap predicates.
- [x] ARCH-004 Require in-flight request gates before sidecar self-exit.
- [x] ARCH-005 Keep scope restricted to packet docs; runtime source changes belong to follow-on packet 010/005.
<!-- /ANCHOR:architecture-tasks -->
