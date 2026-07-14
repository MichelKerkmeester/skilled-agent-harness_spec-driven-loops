---
title: "Tasks: Phase 6: broad-scope-timeout-caveat [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "kimi k2.7 timeout caveat tasks"
  - "phase 006 tasks"
  - "over-exploration mitigation tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/116-kimi-k2-7-code-support/006-broad-scope-timeout-caveat"
    last_updated_at: "2026-06-17T11:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented k2.7 over-exploration/timeout caveat + fixed stale k2.6 refs"
    next_safe_action: "Phase complete; strict-validate and close"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/assets/model_profiles.json"
      - ".opencode/skills/cli-opencode/references/context-budget.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-17-149-006-broad-scope-timeout-caveat"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: broad-scope-timeout-caveat

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

- [x] T001 Upgrade `kimi-k2.7-code.md` §5 scaffold note to the over-exploration → 600s-timeout → 0-bytes failure mode + read-cap/1200s mitigation (load-bearing)
- [x] T002 Add the §6 `variant_flag` operational caveat + §2 avg-wall-clock observation (kimi-k2.7-code.md)
- [x] T003 Add the over-exploration/timeout entry to the `kimi-k2.7-code` `weaknesses` array (model_profiles.json)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Append the operational caveat to the `kimi-for-coding/k2p7` line (cli-opencode/SKILL.md)
- [x] T005 Repair stale `opencode-go/kimi-k2.6` row → `kimi-for-coding/k2p7` (cli_reference.md)
- [x] T006 Repair `kimi-k2.6` → `kimi-k2.7-code` (262,144) + add caveat + fix prose ref (context-budget.md)
- [x] T007 Reconcile parent phase map (phase-6 row) + `children_ids` (graph-metadata.json)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 `model_profiles.json` parses (`node` JSON.parse → valid)
- [x] T009 `check-prompt-quality-card-sync.sh` → GUARD PASS (CHECK 1–4, exit 0)
- [x] T010 Strict-validate this phase; reconcile completion metadata
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (guard green; JSON valid)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
