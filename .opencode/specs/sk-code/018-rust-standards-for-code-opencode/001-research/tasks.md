---
title: "Tasks: Phase 1 — Rust Standards Deep Research"
description: "Execution checklist for the 10-round GPT-5.6-sol deep-research pass on Rust standards for code-opencode: setup, worktree isolation, smoke check, loop launch, synthesis, and verification."
trigger_phrases:
  - "018 rust research tasks"
  - "rust standards research checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/001-research"
    last_updated_at: "2026-07-11T08:29:40Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the execution checklist (all pending — loop not yet run)"
    next_safe_action: "Execute T001 (executor pre-flight)"
    blockers: []
    key_files:
      - "research/deep-research-strategy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-sk-code-018-001-rust-standards-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1 — Rust Standards Deep Research

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

- [x] T001 Pre-flight: `opencode` v1.17.11, `openai` provider authed (oauth), `openai/gpt-5.6-sol-fast` resolvable — confirmed
- [x] T002 Write `research/deep-research-fanout-config.json` (cli-opencode, openai/gpt-5.6-sol-fast, high, iterations 10) — done
- [x] T003 Seed `research/deep-research-strategy.md` (3 thrusts, 11 angles, framing invariant, deliverables, stop conditions) — done
- [x] T004 Worktree isolation — N/A (adapted): agents ran **read-only** (no `--dangerously-skip-permissions`), returning findings on stdout; Claude wrote all artifacts, so no worktree/RM-8 exposure. Kills stayed PID-scoped to the `Round N` signature (operator's concurrent `@deep-review` on the same model was never touched)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Smoke-test the cli-opencode executor at 1 round — confirmed plain-format stdout captures the agent's markdown; agent self-grounds in the repo
- [x] T006 Launch the loop — **manual cli-opencode orchestration** (operator direction), 9 evidence rounds in 3 waves of 3, following the round→angle allocation in `plan.md` §3; all `rc=0`
- [x] T007 Loop hit the 10-round cap; round-10 synthesis dispatch merged into `research/research.md` with the four deliverables
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Terminal `stopReason: maxIterationsReached` present in `research/deep-research-state.jsonl` (10 records)
- [x] T009 `research/research.md` carries all four deliverables (Rust standard, upgrade manifest, conformance map, gate plan) with citations
- [x] T010 Every angle A1–A11 covered (research.md §2); load-bearing manifest paths re-verified vs live repo — the union lives in `smart_routing.md` (charter corrected), guarded by `sk-code-router-sync.vitest.ts`
- [x] T011 Ran `validate.sh --strict`; wrote `implementation-summary.md`; handoff to `002-upgrade/` documented in research.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: T001–T011 all completed above with per-task notes]
- [x] No `[B]` blocked tasks remaining [evidence: zero blocked items; all 11 tasks resolved]
- [x] Loop capped at 10 rounds and the Rust standard + upgrade manifest are ready for phase 002 [evidence: research/research.md Deliverables 1–4]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: `spec.md` (11 angles)
- **Plan**: `plan.md` (round→angle allocation)
- **Strategy**: `research/deep-research-strategy.md`
<!-- /ANCHOR:cross-refs -->
