---
title: "Tasks: Code READMEs (Design, Prompt, Spec-Kit Batch)"
description: "Filter the exclusions, author thirty-eight per-folder READMEs across four family authors, then reconcile against the real folder listings and validate."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/006-code-readmes-design-prompt-speckit"
    last_updated_at: "2026-07-22T13:46:50Z"
    last_updated_by: "claude"
    recent_action: "All thirty-eight in-scope code READMEs authored and validated."
    next_safe_action: "Proceed to phase 007."
    blockers: []
    key_files: []
---

# Tasks: Code READMEs (Design, Prompt, Spec-Kit Batch)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Confirm the `design-mcp-open-design/__tests__` duplicate is byte-identical to `tests/` and filter the six `benchmarks/*/fixtures/fix-*/seed/` folders out of scope.
- [x] T002 Build the thirty-eight-folder author list (`phase-006-author.txt`) and the seven-folder exclusion list (`phase-006-excluded.txt`).

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Author READMEs for the 12 `sk-design` folders (mode `scripts`, `corpus/__tests__` suites, `design-mcp-open-design` `scripts`/`tests`/`fixtures`, `shared/scripts`).
- [x] T004 [P] Author READMEs for the 8 `sk-prompt` benchmark-harness folders (`eval-loop/scripts`, `eval-rig/grader`, `eval-rig/lib`, `eval-rig/scripts`, benchmark `scripts`).
- [x] T005 [P] Author READMEs for the 9 `system-spec-kit/mcp-server` folders (`lib/observability`, `lib/triggers`, `lib/storage/ports`, `hooks/codex`, `scripts/evals`, fixtures and fakes).
- [x] T006 [P] Author READMEs for the 9 `system-spec-kit` runtime, scripts and shared folders (`runtime/hooks/*`, `runtime/lib/spec-gate`, `scripts/*`, `shared/ipc`).

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Floor-validate all thirty-eight READMEs with `validate_document.py --type readme` and confirm each `README.md` exists.
- [x] T008 Cross-check every CONTENTS-table filename against the real folder listing (`c6-mismatch.txt`) and sweep all thirty-eight for em dashes and semicolons.
- [x] T009 Confirm the seven excluded folders (`phase-006-excluded.txt`) received no README.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All thirty-eight READMEs report VALID and the seven exclusions are honored
- [x] `checklist.md` verified with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
