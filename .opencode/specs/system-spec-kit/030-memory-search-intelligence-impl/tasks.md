---
title: "Tasks: Memory Search Intelligence Wave-0 closeout"
description: "Task breakdown for the 030 Wave-0 implementation packet: one task per candidate, deferred-candidate evidence, touched-subsystem verification, and Level-3 documentation closeout."
trigger_phrases:
  - "tasks memory search intelligence wave 0"
  - "030 candidate task breakdown"
  - "wave 0 shipped deferred tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-memory-search-intelligence-impl"
    last_updated_at: "2026-06-18T23:20:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Rewrote tasks for all Wave-0 candidates."
    next_safe_action: "Track Candidate 6 and Candidate 11 in Wave-1."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-18-wave-0-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Memory Search Intelligence Wave-0 closeout

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed or explicitly deferred with accepted evidence |
| `[P]` | Parallelizable |
| `[B]` | Blocked before completion |

**Task Format**: `T### [P?] Candidate or closeout action (primary seam) [status/evidence]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M1 | T001-T013 | Candidate disposition |
| M2 | T014-T016 | Touched-subsystem verification |
| M3 | T017-T021 | Level-3 packet closeout |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Candidate 1 Q6-anchor FIX (`deep-loop-workflows/deep-research/assets/deep_research_strategy.md`) [Done, commit `738e118751`].
- [x] T002 Candidate 2 C9 embedder-degrade (`stage1-candidate-gen.ts`, `hybrid-search.ts`) [Done, commit `484b77b589`].
- [x] T003 Candidate 3 ANN tie-stable ORDER BY (`vector-index` ranked queries) [Done, commit `bec0eed27f`].
- [x] T004 Candidate 4 C5-B content-derived tiebreak (`stage2-fusion.ts`, deterministic comparators) [Done, commit `bec0eed27f`].
- [x] T005 Candidate 5 C-X1 plus C6-A (`bonusOverChannels`, rank-time decay clock) [Done, commit `65cfcea513`].
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Candidate 6 C4-A idempotency default-on (`idempotency-receipts.ts`, `memory-save.ts`) [Deferred to Wave-1+, regression evidence: 11 `handleMemoryUpdate` tests break when default flips on].
- [x] T007 Candidate 7 content-id module (`lib/content-id.ts`) [Done, commit `18c8582e33`].
- [x] T008 Candidate 8 enrichment pending/failed gauges (`memory-save.ts`, `memory-crud-health.ts`) [Done, commit `e1c6a3c793`].
- [x] T009 Candidate 9 skip-closed-in-sweep (`frontmatter-promoter.ts`) [Done, commit `e1c6a3c793`].
- [x] T010 Candidate 10 constitutional self-edit and CAS guard (`memory-crud-update.ts`, tool schemas) [Done, commit `e1c6a3c793`].
- [x] T011 Candidate 11 M-system-kind-exclusion (`formatters/search-results.ts`, `write-provenance.ts`) [Deferred to Wave-1, live DB evidence: `source_kind='system'` includes 9,592 live spec docs and 29 constitutional rules].
- [x] T012 Candidate 12 Deep-Loop trio plus graceful-self-stop (`fanout-merge.cjs`, `fanout-pool.cjs`, `fanout-run.cjs`) [Done, commit `46812f12a8`].
- [x] T013 Candidate 13 Code-Graph Q4-C1 rank-time trust (`code-graph-context.ts`) [Done, commit `e21caf5de6`].
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run Memory MCP static gates [PASS: `npm run typecheck`, `npm run build`].
- [x] T015 Run Memory MCP touched-area composition suite [PASS: 23 files, 666 passed, 23 skipped].
- [x] T016 Attempt Memory MCP broad Vitest suite and classify failures [Broad run emitted pre-existing failures and stalled in IPC/launcher region; baseline archive reproduced representative failure classes].
- [x] T017 Run Code Graph static gates and ranking/impact tests [PASS: typecheck, build, 5 files, 80 passed].
- [x] T018 Run Deep Loop fanout syntax and unit tests [PASS: 3 scripts `node --check`; 4 files, 58 passed].
- [x] T019 Rewrite `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` for all 13 candidates.
- [x] T020 Preserve existing `description.json` and `graph-metadata.json` for separate regeneration.
- [x] T021 Run strict packet validation and fix structure issues.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Wave-0 candidates have a final status in docs and `spec.md` section 14.
- [x] All shipped candidates have implementation, test, review, and commit evidence.
- [x] Deferred candidates are not disguised as incomplete work; each has a block reason and Wave-1 path.
- [x] Touched-subsystem verification is recorded with pass/fail classification.
- [x] Strict validation passes for the packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`, especially section 14 candidate status.
- **Plan**: `plan.md`.
- **Checklist**: `checklist.md`.
- **Decision record**: `decision-record.md`.
- **Summary**: `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
