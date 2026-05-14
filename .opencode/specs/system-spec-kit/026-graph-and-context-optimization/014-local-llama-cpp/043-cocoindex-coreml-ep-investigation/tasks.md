---
title: "Tasks: CocoIndex CoreML EP Investigation"
description: "Completed research task list for the CocoIndex CoreML Execution Provider investigation."
trigger_phrases:
  - "cocoindex coreml"
  - "onnxruntime"
  - "execution provider"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/043-cocoindex-coreml-ep-investigation"
    last_updated_at: "2026-05-14T16:20:00Z"
    last_updated_by: "codex-gpt5.5"
    recent_action: "Completed research tasks"
    next_safe_action: "Validate packet strictly"
    blockers: []
    key_files:
      - "research.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:a33bb4bef5fdfd3569505047c40304469c1099e70a4a2cff89280ce49f3cfab7"
      session_id: "cli-codex-gpt5.5-xhigh-fast-043"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CocoIndex CoreML EP Investigation

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

- [x] T001 Run `043` and reserved `042` collision pre-checks.
- [x] T002 Scaffold approved L1 spec folder under `014-local-llama-cpp`.
- [x] T003 [P] Read manifest template and validation contracts.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Capture venv inventory for ONNX Runtime, providers, platform, and package state.
- [x] T005 Locate CocoIndex embedder creation and confirm no EP provider list exists in fork source.
- [x] T006 Inspect installed `cocoindex.ops.sentence_transformers` and `sentence-transformers` backend behavior.
- [x] T007 Measure three-trial query latency without source changes or daemon process killing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Write `research.md` with H1-H4 evidence matrix and baseline numbers.
- [x] T009 Write `decision-record.md` with options A-D and one recommendation.
- [x] T010 Update packet metadata and completion summary.
- [x] T011 Run strict spec-kit validation and stage only the `043` packet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed through local command evidence.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Research**: See `research.md`.
- **Decision Record**: See `decision-record.md`.
- **Evidence**: See `scratch/`.
<!-- /ANCHOR:cross-refs -->
