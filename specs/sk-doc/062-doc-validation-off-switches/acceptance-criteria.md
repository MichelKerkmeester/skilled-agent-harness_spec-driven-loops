---
title: "Acceptance Criteria: Doc validation off switches"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doc validation off switch acceptance"
  - "validation switch closure gate"
  - "commit trap acceptance"
  - "skdoc skip validation criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/062-doc-validation-off-switches"
    last_updated_at: "2026-09-28T08:20:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met all seven criteria with observed evidence"
    next_safe_action: "Commit the packet with the code it verifies"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh"
      - ".skilled/skills/sk-doc/shared/scripts/validation_switch.py"
      - ".skilled/skills/sk-doc/shared/scripts/validation-switch.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Doc validation off switches

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/062-doc-validation-off-switches
**Level:** 2
**Status:** Complete
**Date:** 2026-09-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `SPECKIT_SKIP_VALIDATION=1`, When the pre-commit gate's command `repair-derived.cjs --folder <packet> --apply` runs, Then it exits 0 and writes nothing | Observed `inspected=1 repaired=0 failed=0`, exit 0, with the packet's metadata checksums unchanged. Before the fix the same run printed `UNREADABLE` and exited 2, because HEAD's `validate.sh --json` printed 0 bytes. `repair-derived.vitest.ts` pins it | Met | - |
| AC-002 | REQ-002 | Given the switch in the environment, in a flags file, or both, When `validate.sh` runs, Then the environment answers whenever it is set and only `1`, `true`, `yes` or `on` skip | `validate-skip-switch.vitest.ts`: the environment on, the file on, and environment `0`, empty and `skip` over a file set to `1` all behave as specified. The pre-commit command also exited 0 with the switch saved only in a file | Met | - |
| AC-003 | REQ-003 | Given `SKDOC_SKIP_VALIDATION` on, When any sk-doc format validator runs its check path, Then it prints one notice on stderr and exits 0 without checking | `test_validation_switch.py` spawns all 20 guarded validators with the switch on. Two controls fail with it off and pass from either source. Removing the `hvr_scan.py` or `check-repo-rules.cjs` guard fails the sweep by name. The six symlinked shims in `sk-doc/scripts/` skip too | Met | - |
| AC-004 | REQ-004 | Given `SKDOC_SKIP_VALIDATION` on, When a mode that writes or tests the tool runs, Then it still runs | `test_writers_and_self_tests_ignore_the_switch`: `--fix --dry-run`, `--self-test` and `apply` with an empty path list all run. The engine modules that import `check_no_new_snake_case` pass their own suites | Met | - |
| AC-005 | REQ-005 | Given a switch on, When the caller asked for JSON, Then stdout holds one parseable line | `validate.sh` prints a report with `skipped: true`, one `VALIDATION_SKIPPED` info entry and no errors. The sk-doc validators print `{"skipped": true, "valid": true, ...}` for `--json`, `--format json` and `--format=json` | Met | - |
| AC-006 | REQ-006 | Given a CI run, When any workflow validates, Then neither switch can be on | `rg -n 'SKIP_VALIDATION\|HOOK_FLAGS_CONFIG\|SPECKIT_VALIDATION' .github` finds 0 lines, and `.skilled/hooks/hook-flags.env` is untracked and ignored by `.gitignore:352` | Met | - |
| AC-007 | REQ-007 | Given someone who wants validation off, When they read the docs, Then they find both switches, how to save them and what stays on | `ENV-REFERENCE.md`, `path-scoped-rules.md`, `validation-rules.md`, `spec-validation-rule-engine.md`, `validation-and-enforcement.md`, `core-standards.md`, both hooks READMEs and `hook-flags.env.example`. All 9 edited docs pass `validate_document.py` with no new finding, and their HVR findings match HEAD. `test_the_example_switch_lines_work_once_uncommented` proves the example's two lines turn the switches on once uncommented | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

AC-001 and AC-003 carried the packet: the commit trap is gone at its producer, and all 20 sk-doc format validators skip from either source. The create-diff report validator was left on because it checks that a report is safe to open, not its format. The CI routing gates and the README auditor were left alone because they already have their own bypass or never block.
<!-- /ANCHOR:closure -->
