---
title: "Tasks: deep-loop parent-skill alignment"
description: "Task breakdown for the staged deep-loop alignment (R1-R5), mapped to the plan stages. All tasks are pending; execution is gated."
trigger_phrases:
  - "deep-loop alignment tasks"
  - "ai-council rename tasks"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the task breakdown"
    next_safe_action: "Gate, then start Stage 0"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-155-002-deep-loop-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: deep-loop parent-skill alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

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

All tasks below are pending. This packet is plan-only and every task is gated on the user's go-ahead. Tasks map to the `plan.md` stages (Stage 0–5).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**Structural alignment (plan Stages 0–2): inventory + baseline, then the lowest-blast structural fixes.**

- [ ] T001 Stage 0 — Record a recovery baseline before any mutation (baseline SHA)
- [ ] T002 [P] Stage 0 — Inventory every `ai-council` reference: commands, agents, `mode-registry.json`, `deep-loop-runtime`, cross-refs (inventory notes)
- [ ] T003 [P] Stage 0 — Inventory each deep mode's `feature_catalog/` contents (inventory notes)
- [ ] T004 [P] Stage 0 — Inventory `deep-loop-runtime` path/identity assumptions + the merged-identity projection sites (inventory notes)
- [ ] T005 Stage 1 (R2) — Rename folder `ai-council` → `deep-ai-council` per ADR-001 (`.opencode/skills/deep-loop-workflows/`)
- [ ] T006 Stage 1 (R2) — Rewire every reference from the T002 inventory (commands, agents, registry, runtime, cross-refs)
- [ ] T007 Stage 1 (R2) — `package_skill.py --check` passes for the hub + all five packets; zero broken `ai-council` refs
- [ ] T008 Stage 2 (R3) — Apply the ADR-003 ruling per mode: keep `feature_catalog/` where earned, remove the rest
- [ ] T009 Stage 2 (R3) — Repoint `SKILL.md`/reference pointers; zero dangling `feature_catalog` refs; `--check` still green
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Routing + runtime (plan Stages 3–4): the higher-blast work, gated on Phase 1.**

- [ ] T010 [B] Stage 3 (R1) — Retrofit Option E onto the deep-loop hub `SKILL.md` + `mode-registry.json` routing
- [ ] T011 [B] Stage 3 (R1) — Confirm `Skill(deep-loop-workflows[,hint])` resolves a mode; `/deep:*` + agents still work; one `graph-metadata.json` preserved
- [ ] T012 [B] Stage 4 (R4) — Verify `deep-loop-runtime` path/identity assumptions hold post-1–3
- [ ] T013 [B] Stage 4 (R4) — Evaluate and record the merged-identity keep/simplify decision (ADR-002) against routing fixtures
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Validation (plan Stage 5), gated on Phase 2.**

- [ ] T014 [B] Stage 5 (R5) — `package_skill.py --check` (hub + packets)
- [ ] T015 [B] Stage 5 (R5) — `advisor_rebuild` + `skill_graph_validate` clean
- [ ] T016 [B] Stage 5 (R5) — Routing fixtures: a deep-loop query resolves to `deep-loop-workflows`
- [ ] T017 [B] Stage 5 (R5) — `validate.sh --recursive` green on this packet + the parent
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All gates green; `/deep:*` commands + agents still function
- [ ] deep-loop workflow behavior unchanged (only structure/invocation aligned)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
