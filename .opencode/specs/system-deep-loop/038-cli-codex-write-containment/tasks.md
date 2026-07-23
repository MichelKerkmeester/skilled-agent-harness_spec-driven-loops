---
title: "Tasks: codex Write-Containment Guard"
description: "Task breakdown for the codex write-containment guard across the four dispatch sites."
trigger_phrases:
  - "tasks"
  - "codex write containment"
  - "dispatch guard"
importance_tier: "normal"
contextType: "general"
---
# Tasks: codex Write-Containment Guard

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |

**Task Format**: `T### Description (file path)`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create shared containment helper scaffold (`runtime/lib/deep-loop/write-containment.ts`)
- [x] T002 Decide fail-open + auto-skip contract (non-git / artifact dir outside worktree → no-op)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Implement snapshot / detect / revert / enforce + event builder
- [x] T011 Scoped revert only (tracked→HEAD restore; untracked→remove specific path; never blanket clean)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Wire guard into `fanout-run.cjs` codex worker; fail-closed throw with `containmentViolation` (`runtime/scripts/fanout-run.cjs`)
- [x] T021 Wire guard into `deep-review-auto.yaml` `if_cli_codex` branch (`commands/deep/assets/deep-review-auto.yaml`)
- [x] T022 Wire guard into `deep-research-auto.yaml` `if_cli_codex` branch (`commands/deep/assets/deep-research-auto.yaml`)
- [x] T023 Wire guard into `deep-alignment-auto.yaml` `if_cli_codex` branch (`commands/deep/assets/deep-alignment-auto.yaml`)
- [x] T024 Add regression suite cases (a/b/c) (`runtime/tests/unit/write-containment.vitest.ts`)
- [x] T025 `node --check` the modified worker; run affected vitest suites; `spec validate --strict` Errors:0

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] Affected vitest suites pass
- [x] `spec validate --strict` Errors:0

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
