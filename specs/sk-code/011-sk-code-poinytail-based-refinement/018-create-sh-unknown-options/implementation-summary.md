---
title: "Implementation Summary"
description: "create.sh now stops on an unknown option with an error and exit code 1, instead of adding it to the spec folder title, and the two docs that passed a flag it never had now pass the real one."
trigger_phrases:
  - "create sh unknown options implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/018-create-sh-unknown-options"
    last_updated_at: "2026-10-11T15:00:00Z"
    last_updated_by: "create-sh-unknown-options-orchestrator"
    recent_action: "Closed the phase with every goal criterion passing"
    next_safe_action: "Operator reviews the worktree branch before it merges"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "summary-018-create-sh-unknown-options"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-create-sh-unknown-options |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`create.sh --goal "My feature"` used to make a folder titled "--goal My feature", write no goal.md and exit 0. It now prints `Error: unknown option '--goal'` and a pointer to `--help`, exits 1 and writes nothing. The rule covers every argument that starts with a dash and matches no option, so no alias or suggestion table was needed.

The caller sweep found one more case of the same bug. The literal-naming playbook scenario and its feature catalog entry passed `--phase-count`, an option the parser never had. Their runs still made three children only because three is the default. Both now pass `--phases`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Unknown-option branch |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-unknown-options.vitest.ts` | Create | Happy path and edge case |
| The literal-naming playbook scenario and catalog entry | Modify | Real flag name |
| `.skilled/skills/system-spec-kit/changelog/v2.7.10.0.md` and `SKILL.md` | Create/Modify | Release entry and version |
| This phase's docs and the parent `spec.md` and `goal.md` | Create/Modify | Phase record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The sweep read every line that invokes create.sh across the repository and every code file that builds its argument list. Commands, runtime code and tests pass only options the parser handles. No caller passes a title that starts with a dash or a bare `--`.

### Dispatches

| Brief | Route | Result |
|-------|-------|--------|
| Unknown-option branch | cli-pi, DeepSeek V4.1 Flash max via DevPass | Exact edit; dropped the executable bit, restored by the orchestrator |
| New vitest | cli-pi, DeepSeek V4.1 Flash max via DevPass | File identical to the brief |
| Caller doc flag | cli-pi, DeepSeek V4.1 Flash max via DevPass | Six lines, exact edit |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Pattern `-?*` rather than `-*` | A lone `-` stays title text; everything else that looks like an option is checked |
| Exit 1 | Matches the script's other argument errors, such as `--number requires a value` |
| No `--` end-of-options marker | No caller needs one, and adding it would widen the parser |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Create test set on the pre-fix script (baseline) | 3 files, 30 tests passed |
| New test on the pre-fix script | 1 failed (exit 0, expected 1), 1 passed |
| Create test set on the fixed script | 4 files, 32 tests passed |
| Other vitest suites that invoke create.sh | 9 files, 61 passed, 3 skipped |
| test-phase-system.sh and the three phase JS suites | 12, 27, 51 and 148 passed, 0 failed |
| Corrected playbook command | Exit 0, three placeholder children |
| validate.sh parent --recursive --strict | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. A title that starts with a dash is now refused. Callers must reword it, because the script has no `--` marker.
<!-- /ANCHOR:limitations -->

---
