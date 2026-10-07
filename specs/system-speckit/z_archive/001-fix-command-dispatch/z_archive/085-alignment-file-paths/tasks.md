---
title: "Tasks: Alignment Validator File Path Analysis"
description: "Reconstructed task breakdown for adding file-path analysis to the alignment validator and content validation to the memory continue command."
trigger_phrases:
  - "alignment validator file path tasks"
  - "memory folder alignment fix tasks"
  - "recovery content validation tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Alignment Validator File Path Analysis

<!-- SPECKIT_LEVEL: 1 -->
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

> Per-task state was not recorded at the time, so every task below is listed pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: File Path Analysis In The Alignment Validator

- [ ] T001 Add infrastructure pattern configuration and the bonus/threshold constants (`.opencode/skills/system-spec-kit/scripts/spec-folder/alignment-validator.js`)
- [ ] T002 Implement `detect_work_domain()` to classify work from observation file paths (`.opencode/skills/system-spec-kit/scripts/spec-folder/alignment-validator.js`)
- [ ] T003 Implement domain-aware scoring that boosts folders matching infrastructure patterns (`.opencode/skills/system-spec-kit/scripts/spec-folder/alignment-validator.js`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Recovery Content Validation In continue.md

- [ ] T004 Add the content validation step that compares `key_files` from memory metadata against the stored `spec_folder` (`.opencode/commands/memory/continue.md`)
- [ ] T005 Present correction options and show key files in the recovery summary when a mismatch is detected (`.opencode/commands/memory/continue.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Exercise the spec-kit memory file case that previously filed infrastructure work under a project folder (`spec.md`)
- [ ] T007 Exercise project-file and mixed-file memory cases to confirm the infrastructure bonus does not misfire (`plan.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Infrastructure work (files in `.opencode/`) is detected
- [ ] Alignment scoring prefers infrastructure-related spec folders
- [ ] Recovery command validates `key_files` against `spec_folder`
- [ ] Mismatch triggers a user prompt with correction options
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
