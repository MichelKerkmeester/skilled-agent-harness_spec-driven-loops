---
title: "Tasks: Contract Compiler Design"
description: "Task stub for phase 001 of packet 036 (command contract compiler)."
trigger_phrases: ["tasks", "036 001 tasks"]
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/007-compiled-contract-compiler/001-contract-compiler-design"
    last_updated_at: "2026-07-03T19:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Design verified + decomposed; Sonnet-confirmed"
    next_safe_action: "Post the phase breakdown for approval; do not implement"
    blockers: []
    key_files:
      - "design.md"
      - "phase-decomposition.md"
    session_dedup: {fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "036-001-tasks", parent_session_id: null}
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Contract Compiler Design

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |

**Task Format**: `T### Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Verify every `design.md` file citation against the live tree; correct drift. — `design-citations.md`: all citations verified, `deep_review_config.json` path drift + a stale `spec.md` citation corrected, authority chain expanded 14→16 files (added `review_mode_contract.yaml`, `deep_review_confirm.yaml`, `state_format.md`, `convergence.md`). Sonnet-CONFIRMED.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Resolve the three unknowns (injection insertion point, checksum ownership, CLI receipt/progress parity under fan-out) with cited evidence; finalize the implementable spec. — `design-unknowns.md`: injection seam = command-Markdown body via the bang-shell render prelude (plugins + AGENTS.md ruled out); checksum ownership = compiler-owned `sourceDigests` + header-excluding `compiledBodyDigest`; CLI parity = single-executor branches audited but fan-out NOT (real gap). Consolidated into `design.md`. Sonnet-CONFIRMED (gap verified line-for-line).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T003 Decompose the build/retrofit phases with effort + acceptance; validate strict; scoped commit. — `phase-decomposition.md`: 8 phases (P1-P8) with effort tiers, dependency DAG, per-phase acceptance, and the T002-unblock path. Sonnet-verified; 4 decomposition defects (false P5→T002 gate, missing P7←P2 dep, agent miscount 15→14, unaddressed AGENTS.md bridge) fixed and re-confirmed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Citations verified; unknowns resolved; implementable spec + phase decomposition authored.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Seed design**: `design.md`
- **Parent**: `../spec.md`
- **Carve record**: `../context-index.md`
<!-- /ANCHOR:cross-refs -->
