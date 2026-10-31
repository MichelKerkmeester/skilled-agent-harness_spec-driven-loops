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
    last_updated_at: "2026-09-28T11:08:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met AC-008, the comment rule in all four readers of hook-flags.env"
    next_safe_action: "None, the packet is complete"
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
| AC-007 | REQ-007 | Given someone who wants validation off, When they read the docs, Then they find both switches, how to save them and what stays on | `ENV-REFERENCE.md`, `path-scoped-rules.md`, `validation-rules.md`, `spec-validation-rule-engine.md`, `validation-and-enforcement.md`, `core-standards.md`, both hooks READMEs and `hook-flags.env.example`. All 9 edited docs pass `validate_document.py` with no new finding, and their HVR findings match HEAD. `test_every_example_line_works_once_uncommented` proves every switch line of the example, the two validation lines included, turns its switch on once uncommented | Met | - |
| AC-008 | REQ-008 | Given a line of `hook-flags.env` with a comment after its value, When any of the four readers parses it, Then each one reads the value without the comment, and every switch line of the example reads as on once uncommented | The cross-reader test in `hook-flags.test.cjs` holds `hook-flags.cjs`, `hook-flags.sh`, `validation_switch.py` and `check-dist-staleness.sh` to one table, and reverting the rule in any one of them fails it. An example line uncommented as it stands disables its hook in the Node and shell resolvers. The dist checker made 0 calls to its Node helper with `SYSTEM_DIST_FRESHNESS_DISABLED=1  # note` saved, against 1 for the old parser | Met | - |
| AC-009 | REQ-005 | Given `SPECKIT_SKIP_VALIDATION` on, When `progressive-validate.sh --json` runs at level 1 or at the default level, Then stdout holds one parseable report carrying `skipped: true` and the notice goes to stderr | T-PB2-16a parses level 1's stdout and finds the notice on stderr. T-PB2-16b reads `skipped: true` and `passed: true` at the default level and `skipped: false` for the control with the switch at `0`. Against the unfixed wrapper both fail, as does T-PB2-10b, which lists `skipped` as a required field | Met | - |
| AC-010 | REQ-002 | Given a value with spaces inside it, spaces around it, or equal to the shell reader's old absence marker, When the four readers resolve it, Then they agree: `o n` is off, a value with only surrounding spaces is on and any set environment value answers | The cross-reader test "every reader trims only a value's edges and lets any set environment value answer" in `hook-flags.test.cjs` fails on the unfixed shell reader and passes for all four readers | Met | - |
| AC-011 | REQ-008 | Given a flags file saved with a UTF-8 byte order mark, When the four readers parse its first line, Then each reads the switch on it | "a byte order mark before the first line hides nothing from any reader" fails on the unfixed shell and dist readers, still fails with only the shell fixed, and passes once the dist reader opens the file as `utf-8-sig` | Met | - |
| AC-012 | REQ-009 | Given validation switched off, When `quality-audit.sh` or the strict-pass freshness sweep runs, Then each reports the folder as skipped, and a skipped baseline row never makes a later failure a known one | `quality-audit-script.vitest.ts` gets `skipped: 1` and status `skipped` in JSON and `Skipped: 1` in text, with the control at `0` failing as before. `strict-pass-freshness.vitest.ts` gets `skipped: 1` and exit 0, and a skipped baseline row followed by a failure exits 1 as a new failure whose message names the skipped run. All three tests fail against the unfixed code | Met | - |
| AC-013 | REQ-007 | Given someone reading `.env.example` or the hooks README, When they look for the switches and the comment rule, Then `.env.example` names both switches and the README states the rule with its tab case | `.env.example` Section 5 carries both lines, and `.skilled/hooks/README.md` says "after a space or tab". Both READMEs show the same `validate_document.py` result as at HEAD | Met | - |
| AC-014 | REQ-007 | Given the unreleased v4.0.0.2 entry, When someone reads what the release changed, Then it covers both switches and the review fixes | The entry gains a Doc Validation section, two glance bullets and four upgrade notes, and the component entries `system-spec-kit` v4.1.5.0, `sk-doc` v2.2.3.0 and `sk-code-quality` v1.0.1.0 cover each part. All pass `validate_document.py` with 0 issues and `hvr_scan.py` with 0 hard blockers | Met | - |

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

AC-001 and AC-003 carried the packet: the commit trap is gone at its producer, and all 20 sk-doc format validators skip from either source. The create-diff report validator was left on because it checks that a report is safe to open, not its format. The CI routing gates and the README auditor were left alone because they already have their own bypass or never block. AC-008 came after close, at the operator's request: the example's lines carry a comment after the value, so the comment rule had to reach every reader of the file for those lines to work as the docs say. AC-009 to AC-014 came from the deep review of 2026-09-28, which returned CONDITIONAL with one P1 and seven P2 findings. The operator asked for every finding to be fixed, and each one is: a switched-off run is now reported as skipped by every local consumer, the four readers agree on every line the review named, and the docs and the release entry cover the switches.
<!-- /ANCHOR:closure -->
