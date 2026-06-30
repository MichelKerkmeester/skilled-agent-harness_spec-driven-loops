---
title: "Tasks: MiniMax 2.7 prompt-framework benchmark"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "minimax benchmark tasks"
  - "minimax eval rig tasks"
  - "minimax framework bake-off tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-003 task list"
    next_safe_action: "Port rig (T001-T004)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-minimax-prompt-framework-benchmark"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: minimax-prompt-framework-benchmark

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

- [x] T001 Copy 113 `002-eval-rig/` → `eval-rig/` (fixtures, deterministic checks, grader, dry-run; empty cache)
- [x] T002 Copy 113 `003-eval-loop/scripts/` → `eval-loop/scripts/`; repoint paths to local eval-rig
- [x] T003 Write `eval-loop/scripts/dispatch-minimax.cjs` (opencode run minimax/MiniMax-M2.7, timeout + 429 backoff + mock)
- [x] T004 Seed 5 framework variants (RCAF/RACE/CIDI/TIDD-EC/COSTAR); retune fix-001 allowlist; `dry-run.cjs` passes
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Run `loop.cjs` — 5 variants × 7 fixtures on MiniMax M2.7, budget cap ~60 calls
- [x] T006 Hill-climb a few iterations on the leader (pre-plan density / framework refinements)
- [x] T007 Synthesize `eval-loop/synthesis.md` (ranked frameworks + winner + integration rec)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Integrate winner into cli-opencode prompt assets + sentinel pattern-index + sk-prompt card; correct slug + context_length
- [x] T009 Author changelog + decision-record; `jq`/`rg` verification
- [x] T010 `validate.sh --strict` on 003 + recursive on 120; reconcile parent
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

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

