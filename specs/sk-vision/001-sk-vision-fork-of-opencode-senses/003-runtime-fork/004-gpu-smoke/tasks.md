---
title: "Tasks: sk-vision GPU smoke"
description: "Executable tasks for sk-vision GPU smoke."
trigger_phrases:
  - "sk-vision gpu smoke"
  - "sk-vision load status"
  - "sk-vision moondream2"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork/004-gpu-smoke"
    last_updated_at: "2026-08-16T10:20:00.000Z"
    last_updated_by: "code-agent"
    recent_action: "GPU smoke PASS: load+status, model_loaded true on MPS."
    next_safe_action: "004-opencode-adapter/001-plugin-reexport"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-003-runtime-fork-004-gpu-smoke"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision GPU smoke

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

- [x] T001 Confirm dist/plugin.js exists — 499333 bytes at `.opencode/skills/sk-vision/vision-runtime/dist/plugin.js`
- [x] T002 Record hardware (NVIDIA Ampere+ / Apple Silicon / absent) — `uname -m` = arm64; `sysctl machdep.cpu.brand_string` = Apple M5 Max
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Send load then status, or write SKIP — PASS: NDJSON load id=1 → status id=2, `model_loaded: true`, device `mps`
- [x] T004 Do not treat ping as pass — smoke transcript shows only `load` and `status` methods; ping not sent
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Record PASS or SKIP in this child's implementation-summary — PASS recorded at `implementation-summary.md:74` with NDJSON load/status transcript
- [x] T006 Run validate.sh --strict on this child — RESULT: PASSED (0 errors, 0 warnings); wrapper exit 2 from repo-wide COMMAND_TREE_PARITY drift (same as 003-build-and-tests)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
