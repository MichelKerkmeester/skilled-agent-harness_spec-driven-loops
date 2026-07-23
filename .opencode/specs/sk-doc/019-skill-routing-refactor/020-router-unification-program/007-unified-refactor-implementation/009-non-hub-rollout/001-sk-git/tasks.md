---
title: "Tasks: sk-git Non-Hub Router Rollout"
description: "Ordered implementation and verification tasks for the target-local sk-git compiled-router rollout."
trigger_phrases:
  - "sk-git rollout tasks"
  - "sk-git compiled policy task list"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/001-sk-git"
    last_updated_at: "2026-07-19T10:40:49Z"
    last_updated_by: "codex"
    recent_action: "Completed all implementation and verification tasks"
    next_safe_action: "No remaining packet work"
    blockers: []
    key_files:
      - "harness/run-sk-git.cjs"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-rollout-20260719"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-git Non-Hub Router Rollout

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the complete generic compiler, projection, harness, parity, activation, fixture, and design inputs. [Evidence: `harness/source-contract.json` was authored only after the required source study.]
  - **Evidence**: Every requested source family was read before the first child write.
- [x] T002 Read `sk-git/SKILL.md` and every `references/` and `assets/` leaf.
  - **Evidence**: The source contract contains the five authored intents, ten unique leaves, and authored quick-reference default.
- [x] T003 Capture the protected scorer baseline hashes.
  - **Evidence**: All three final hashes equal the pre-write values recorded in `checklist.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create the target-local source contract and shared-compiler adapter (`harness/source-contract.json`, `harness/support.cjs`).
  - **Evidence**: The adapter asserts standalone topology, authored leaves, default inclusion, and empty composition collections.
- [x] T005 Create the deterministic build and validation driver (`harness/run-sk-git.cjs`).
  - **Evidence**: Explicit `--write` generation and read-only drift checking both exit zero.
- [x] T006 Create the protected replay and fingerprint helpers (`harness/protected-replay.cjs`, `harness/fingerprint.cjs`).
  - **Evidence**: Nine rows pass the real scorer subprocess and the deliberate falsifier is rejected.
- [x] T007 Reuse shared parity and fenced-manifest modules (`parity/shadow-parity.cjs`, `activation/fenced-manifest.cjs`).
  - **Evidence**: Both files are thin re-exports; no shared module was copied or edited.
- [x] T008 Generate the policy, three projections, nine fixtures, and four activation JSON artifacts (`compiled/sk-git/`, `activation/`).
  - **Evidence**: The harness reports 13 deterministic generated artifacts and verifies their bytes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run deterministic compilation and artifact drift checks.
  - **Evidence**: Five compiles and two processes share body hash `99fc04543f5e97591c8ba0e9c00802864c39b1267b5c8a1fa0421c30c79e6712` and effective hash `7912844c9e6cdcf9e16bbfebdfa43e317c7334aee4147e8a1bcfc641253ef7b8`.
- [x] T010 Run real-scorer, shadow-parity, closed-algebra, and rollback gates.
  - **Evidence**: The target-local command prints PASS for every group and ends with `GREEN result=PASS`.
- [x] T011 Run `node --check` on every target CommonJS file.
  - **Evidence**: Six of six parse checks exit zero.
- [x] T012 Re-read and hash the three protected scorer files. [Evidence: `checklist.md` records all three matching SHA-256 values.]
  - **Evidence**: Final SHA-256 values match their pre-write baselines exactly.
- [x] T013 Synchronize the Level-2 packet docs with executable evidence. [Evidence: `validate.sh --strict --verbose` confirms all five template and anchor contracts match.]
  - **Evidence**: Spec, plan, tasks, checklist, and implementation summary use contract anchors and cite the target-local receipts.
- [x] T014 Run strict packet validation and reconcile final completion metadata. [Evidence: `validate.sh --strict` exited zero with no errors or warnings before the completion state was applied.]
  - **Evidence**: The first strict receipt reported `Summary: Errors: 0 Warnings: 0` and `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
  - **Evidence**: T001 through T014 are complete in this document.
- [x] No `[B]` blocked tasks remain.
  - **Evidence**: No task carries a blocked marker.
- [x] Target-local executable verification passes.
  - **Evidence**: `node harness/run-sk-git.cjs` exits zero and prints the GREEN terminal line.
- [x] Strict packet validation passes and metadata is current.
  - **Evidence**: The strict gate passed after the scoped graph-metadata refresh.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Evidence Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
