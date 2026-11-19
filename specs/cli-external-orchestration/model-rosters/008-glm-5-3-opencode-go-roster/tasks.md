---
title: "Tasks: Add GLM 5.3 to the cli-pi and cli-opencode rosters through the opencode-go provider"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "glm 5 3 opencode go roster tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Add GLM 5.3 to the cli-pi and cli-opencode rosters through the opencode-go provider

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`RO` is the cli-opencode `references/providers-and-models.md`. `RP` is the cli-pi `references/providers-and-models.md`. `M` is `opencode-go/glm-5.3`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the catalog entry for `M` (OpenCode 1 and Pi). Verify: `opencode1 models opencode-go --verbose` shows variants `low`, `high`, `max`, and `pi --list-models` lists `opencode-go glm-5.3`.
- [x] T002 Try one turn per level on each CLI. Verify: each attempt exits 1 with `Model access is disabled`; the operator confirmed the Go plan is out of usage and approved adding the rows anyway.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Rewrite the `M` row (`RO`). Verify: `rg -c 'Z.AI GLM-5.3, the full model' RO` prints 1.
- [x] T004 [P] Add the `glm-5.3` row (`RP`). Verify: `rg -c 'Z.AI GLM-5.3, the full model' RP` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Check each row names `low`, `high` and `max` and says it is not dispatch-verified. Verify: the `rg` lines hold all three levels and `Not dispatch-verified`.
- [x] T006 Validate the packet. Verify: `validate.sh <packet> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Live-reply check deferred with operator approval until the Go plan usage resets
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
