---
title: "Tasks: deep-alignment deep-review remediation"
description: "Task Format: T### [P?] Description (file path). Maps the 10 findings' fixes across setup, implementation, and verification."
trigger_phrases:
  - "deep-alignment remediation tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/013-review-remediation"
    last_updated_at: "2026-07-13T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Mapped F001-F010 fixes across setup, implementation, verification"
    next_safe_action: "Run validate.sh --strict from the main tree"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "059-013-review-remediation"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: deep-alignment deep-review remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Verify-first re-read of every cited `file:line` from the review report; reproduce both P0s against source
- [x] T002 Confirm isolated worktree + baseline `state-machine-wiring.test.cjs` green
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

WS1 — Fail-closed correctness
- [x] T010 (F001) `nothingToConverge` derives from the discovered corpus; unaudited non-empty corpus → FAIL (`reduce-alignment-state.cjs`)
- [x] T011 (F001) seed the findings registry before the first LEAF dispatch (`deep_alignment_{auto,confirm}.yaml`)
- [x] T012 (F005) fail closed on corrupt JSONL / unrecognized severity (`reduce-alignment-state.cjs`)
- [x] T013 (F007) identity-based progress with count fallback (`partition-corpus.cjs`, `reduce-alignment-state.cjs`)

WS2 — Security boundary
- [x] T020 (F002) reconcile the read-only claim; `mutatesWorkspace: true`; decision-record deferral (`deep-alignment.md` + mirror, `mode-registry.json`, `decision-record.md`)
- [x] T021 (F008) register `deep-alignment` in `LOOP_EXECUTOR_AGENTS` (`dispatch-guard.cjs`)

WS3 — Contract fidelity
- [x] T030 (F003) bind `resolved_lanes` on the no-config path (`deep_alignment_{auto,confirm}.yaml`)
- [x] T031 (F004) trim ignored executor flags from the public contract (`alignment.md`, legacy body, yaml)
- [x] T032 (F006) optional adapter discriminator + discover/check threading (`scoping.cjs`, `partition-corpus.cjs`, yaml, agent docs, schema doc)

WS4 — Topology/behavior truth
- [x] T040 (F009) reconcile parent children_ids/status/phase-map to on-disk children 000-013 (`spec.md`, `graph-metadata.json`)
- [x] T041 (F010) setup-misbind fixed via F003; autonomous-termination proof deferred (`decision-record.md` ADR-003)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T050 RED→GREEN regression for F001+F005 (`reducer-fail-closed.test.cjs`)
- [x] T051 F007 regression (`partition-identity-progress.test.cjs`) + F006 regression (`scoping-adapter.test.cjs`)
- [x] T052 Both dispatch-guard tests green (`mk-deep-loop-guard`, `claude-task-dispatch-guard`)
- [x] T053 `validate.sh --strict` on this packet exit 0 (run from main tree)
- [x] T054 `implementation-summary.md` written with per-finding evidence + honest deferrals
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All actionable findings fixed at root or deferred with recorded rationale
- [x] No `[B]` blocked tasks remaining
- [x] `validate.sh --strict` exit 0 and checklist fully evidenced
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
