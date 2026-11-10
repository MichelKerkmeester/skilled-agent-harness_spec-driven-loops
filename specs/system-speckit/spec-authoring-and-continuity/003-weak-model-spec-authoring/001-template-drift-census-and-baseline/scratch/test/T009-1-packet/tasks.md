---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "recommend level quiet flag tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Read the full argument loop, output dispatch and help text in the target script, and record the exact default level line and its surrounding blank lines (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T002 Capture a pre-change baseline for four input classes — simple, risky, Level 3, boundary — storing stdout, stderr and exit code per run (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/baseline/`)
- [ ] T003 [P] Record the exact `--json` invocation used by the plan and complete commands so their output can be diffed too (`.skilled/commands/speckit/assets/speckit-plan.yaml`, `.skilled/commands/speckit/assets/speckit-complete.yaml`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `QUIET_MODE=false` beside the other output globals, with a comment stating why quiet is checked before JSON (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T005 Add the `--quiet|-q` arm to the argument `case`, shifting one argument and leaving every existing arm untouched (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T006 Add the quiet branch to the output dispatch so it prints `Recommended Level: <N> (<Name>)` once and skips the report, breakdown and phase section (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T007 Document the flag in both `show_help` and the file-header OPTIONS block, including that quiet takes precedence over `--json` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T008 Confirm no scoring, threshold or validation line was touched, using a scoped diff of the file (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run `bash -n` on the script and confirm a clean exit (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T010 Run every matrix cell — default, `--json`, `--quiet`, `--quiet --json`, `--quiet --no-recommend-phases`, `-q` — and assert quiet prints exactly one line and JSON mode is unaffected (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/matrix/`)
- [ ] T011 Diff default and `--json` output for all four input classes against the Phase 1 baseline and confirm an empty diff (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T012 Run the negative cases under `--quiet` — no inputs, non-numeric `--loc`, unknown option — and confirm stderr messages and exit status 1 survive (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T013 Confirm `--help` lists `--quiet, -q` and still exits 0 (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/help.txt`)
- [ ] T014 Record the observed evidence in `acceptance-criteria.md` and clear the scratch baseline files (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/acceptance-criteria.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n` passes on the modified script
- [ ] CHK-011 [P0] No output to stdout in quiet mode beyond the single level line
- [ ] CHK-012 [P1] `QUIET_MODE` is initialised before use so `set -u` cannot abort
- [ ] CHK-013 [P1] The new `case` arm and output branch follow the file's existing naming and comment style
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual matrix run complete with captured output
- [ ] CHK-022 [P1] Default-path baseline diff empty for text and JSON
- [ ] CHK-023 [P1] Negative cases still exit 1 with stderr diagnostics under `--quiet`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable. This packet adds a flag rather than repairing a reported finding, so
there is no finding class to assign and no adversarial parser, path or redaction
matrix to build. The producer and consumer inventory that would otherwise live here
is recorded in `plan.md` §AFFECTED SURFACES, because the change still touches a
shared CLI surface.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced
- [ ] CHK-031 [P0] Argument validation unchanged; the flag consumes no value
- [ ] CHK-032 [P1] Quiet output exposes nothing beyond the level already printed by default
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Header comment and `show_help` agree on the flag's semantics
- [ ] CHK-042 [P2] Callers documented elsewhere left unchanged, or updated if a flag inventory exists
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-23
<!-- /ANCHOR:summary -->

---
