---
title: "Task Breakdown: sk-code Router — Typed-Gold Instrumentation + Live Measurement"
description: "Ordered tasks for the Wave 2 sk-code pilot, mapped to plan phases and requirements."
trigger_phrases:
  - "sk-code router typed gold tasks"
  - "wave 2 sk-code pilot task breakdown"
  - "sk-code baseline refresh tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Conformed tasks to the strict template headers/anchors and added the continuity block"
    next_safe_action: "Execute T-014 (live-mode sample), then T-015 (fan-out recipe)"
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-sk-code-router-alignment-authoring"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Task Breakdown: sk-code Router — Typed-Gold Instrumentation + Live Measurement

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T-### — Description — REQ-###`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Phase 1 — Ground truth & baseline refresh
- [ ] T-001 — Confirm map correctness (drift-guard 7/7; fresh router run PASS 83 / D5 100) — DONE this session (evidence in implementation-summary) — REQ-001
- [ ] T-002 — Replace stale committed `benchmark/baseline/skill-benchmark-report.{json,md}` with the fresh accurate run — REQ-001
- [ ] T-003 — Verify committed baseline shows non-null PASS + no pre-reorg unreachable loci — REQ-001
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase 2 — Partition routing vs command scenarios
- [ ] T-004 — Enumerate the loaded playbook scenarios and classify ROUTING vs COMMAND — REQ-002
- [ ] T-005 — Record the partition; list excluded command/exit-code scenarios — REQ-002

### Phase 3 — Author independent typed gold
- [ ] T-006 — For each ROUTING scenario, derive `expected_workflow_mode` + `expected_leaf_resources` from stated intent — REQ-002
- [ ] T-007 — Non-circular check: confirm some gold legitimately differs from current router output — REQ-002
- [ ] T-008 — Add frontmatter keys without disturbing scenario bodies — REQ-002

### Phase 4 — Packet-qualify shared-tier paths (only if required)
- [ ] T-009 — Determine whether the typed-pair contract needs `shared/references/...` form — REQ-006
- [ ] T-010 — If required, canonicalize flat `references/...` entries + DEFAULT_RESOURCE preamble — REQ-006
- [ ] T-011 — Re-run drift-guard (stays 7/7) and router-mode run (D5 stays 100) — REQ-006
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Phase 5 — Re-baseline & confirm typed dims score
- [ ] T-012 — Re-run router mode; confirm `typedPairRecall` + mode-routing non-null for annotated scenarios — REQ-003
- [ ] T-013 — Commit the refreshed typed-surface baseline — REQ-003

### Phase 6 — Live-mode sample
- [ ] T-014 — Run a representative routing sample through live-mode; record number + transport + model/effort — REQ-004

### Phase 7 — Capture the fan-out recipe
- [ ] T-015 — Document steps + guardrails + machinery gaps for 016–019 — REQ-005
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] REQ-001…REQ-005 satisfied; REQ-006 resolved or deferred with reason
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
