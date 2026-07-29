---
title: "Tasks: Phase 2 — register leaves + wire pointers + fix smart-routing"
description: "Task list for registering the six catalog leaves and expanding smart-routing to six modes (Complete)."
trigger_phrases:
  - "register cli reference leaves tasks"
  - "leaf manifest regeneration task list"
  - "smart-routing six modes tasks"
  - "cli catalog wiring tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/033-per-mode-provider-model-reference/002-register-and-wire"
    last_updated_at: "2026-07-29T09:18:38Z"
    last_updated_by: "implementer"
    recent_action: "Regenerated leaf-manifest and expanded smart-routing to six modes"
    next_safe_action: "Trim duplicated enumerations (phase 003)"
    blockers: []
    key_files:
      - "leaf-manifest.json"
      - "shared/references/smart-routing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "tasks-033-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2 — register leaves + wire pointers + fix smart-routing

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

- [x] T001 Confirm phase 1 catalogs exist on disk for all six modes — [evidence: 6/6 `references/providers-and-models.md` present on disk]
- [x] T002 Locate `generate-leaf-manifest.cjs` and read current `shared/references/smart-routing.md`
- [x] T003 [P] Note current router coverage gap (only opencode/claude-code/codex enumerated) — [evidence: `smart-routing.md` INTENT_SIGNALS/RESOURCE_MAP covered only 3 of 6 modes]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Regenerate `leaf-manifest.json` via `generate-leaf-manifest.cjs --write` (six new catalog leaves)
- [x] T005 Expand `smart-routing.md` INTENT_SIGNALS + RESOURCE_MAP from 3 to 6 modes (add cursor, devin, pi)
- [x] T006 Add a model-selection intent routing to the six new leaves; fix the stale 3-executor prose — [evidence: `smart-routing.md` prose no longer claims only three executors; 6 intents present]
- [x] T007 Keep the catalog on-demand (not first-slice) to preserve router-replay/benchmark contracts; bump version 1.0.0.1 → 1.0.0.2 — [evidence: `smart-routing.md` version 1.0.0.1→1.0.0.2; two first-slice leaves per mode preserved]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 `generate-leaf-manifest.cjs --check` — fresh, six new leaves present
- [x] T009 Verify all RESOURCE_MAP paths resolve on disk and are manifest-registered (18/18); INTENT_SIGNALS covers 6 modes — [evidence: verified via `generate-leaf-manifest.cjs --check`; 18/18 paths resolve]
- [x] T010 `parent-skill-check.cjs` router invariants — PASS
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
