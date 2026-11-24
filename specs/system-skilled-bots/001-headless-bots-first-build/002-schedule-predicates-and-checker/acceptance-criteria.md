---
title: "Acceptance Criteria: Phase 2: schedule-predicates-and-checker"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "schedule predicates and checker acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/002-schedule-predicates-and-checker"
    last_updated_at: "2026-11-22T10:48:28Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-schedule-predicates-and-checker"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: schedule-predicates-and-checker

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `002-schedule-predicates-and-checker`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-22
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the probe plist is bootstrapped on day one, When it has run across one matching and one non-matching weekday, Then `decision-record.md` holds the dates, the plist text and the fire log lines, and `implementation-summary.md` holds one result line naming `Weekday` with the dates | Probe installed 2026-11-22 with Weekday 1 at 12:00. It fired on Monday 2026-11-23 at 12:00:04 and did not fire on Tuesday 2026-11-24, with the host awake through both slots (`specs/system-skilled-bots/001-headless-bots-first-build/002-schedule-predicates-and-checker/scratch/probe-result.txt:15`). The dates, the plist text and the fire log line are under Probe observation (`specs/system-skilled-bots/001-headless-bots-first-build/002-schedule-predicates-and-checker/decision-record.md:50`), and the result line naming `Weekday` with the dates is in `specs/system-skilled-bots/001-headless-bots-first-build/002-schedule-predicates-and-checker/implementation-summary.md:58` | Met | - |
| AC-002 | REQ-002 | Given the probe record, When the translator test runs `0 9 * * 1-5`, Then the outcome (emit `Weekday` alone, or refuse by id) matches the rule the record names | The record names emit (`specs/system-skilled-bots/001-headless-bots-first-build/002-schedule-predicates-and-checker/decision-record.md:104`). `SINGLE_DAY_FIELD_RULE` is `emit` (`.skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:69`), and the test asserts five `Weekday` dictionaries for `0 9 * * 1-5` (`.skilled/skills/system-skilled-bots/runtime/tests/cron-translator.vitest.ts:79`). The runtime suite passed 35 files and 372 tests | Met | - |
| AC-003 | REQ-003 | Given the translator, When it translates `*/15 0-23/2 * * *` and `0 9 1 * 1`, Then it yields 48 dictionaries and 1 dictionary | `.skilled/skills/system-skilled-bots/runtime/tests/cron-translator.vitest.ts:34` asserts 48 dictionaries and `.skilled/skills/system-skilled-bots/runtime/tests/cron-translator.vitest.ts:41` asserts 1. Suite run: 109 passed | Met | - |
| AC-004 | REQ-004 | Given `@reboot`, `@AppleNotOnBattery`, a percent-stdin cron and a cron past the cap, When each is translated, Then each fails with its own invariant id, and `@reboot` passes parse before it fails translate | `.skilled/skills/system-skilled-bots/runtime/tests/cron-translator.vitest.ts:98` asserts `cron-reboot`, `cron-apple-not-on-battery`, `cron-percent-stdin` and `cron-over-cap`, four distinct. `.skilled/skills/system-skilled-bots/runtime/tests/cron-translator.vitest.ts:109` asserts `@reboot` parses first | Met | - |
| AC-005 | REQ-005 | Given the clean fixture, each defect fixture and a missing path, When `bot-check.cjs` runs on each, Then it prints one `PASS\|FAIL\|WARN\|INFO: <id>: <message>` line per finding and exits 0, 1 and 2 | CLI runs printed one contract line per finding: clean exit 0, 12 of 13 defect fixtures exit 1 in this checkout, `/nope` exit 2 with `FAIL: target-missing`. `no-identity` exits 0 in this checkout because the worktree's own origin supplies the identity; in a remote-less repository it exits 1 (AC-013). Tested in `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts:109`, `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts:118` and `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts:137` | Met | - |
| AC-006 | REQ-007 | Given a fixture with one advisory finding and one hard failure, When the checker runs with and without the strict switch, Then only the advisory line changes and the exit stays 1 | `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts:153` runs one hard failure plus `folder-id-mismatch` with and without `--strict`: only that line changes (WARN to FAIL), exit 1 both times | Met | - |
| AC-007 | REQ-008 | Given the finished checker, When it is searched for restated enums or bounds, Then no executor kind, budget bound or cron rule is defined in it | `rg -n 'cli-opencode\|3600\|@reboot' .skilled/skills/system-skilled-bots/scripts/bot-check.cjs` printed nothing, exit 1. Bounds come from `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts:339` | Met | - |
| AC-008 | REQ-009 | Given the shared fixture set with one daylight-saving boundary under a fixed `TZ`, When the lister and the translator run over it, Then their slot sets agree, including the `StartInterval 60` case | `.skilled/skills/system-skilled-bots/runtime/tests/slot-lister.vitest.ts:85` agreement cases under `TZ=Europe/Amsterdam`, boundary case named at `.skilled/skills/system-skilled-bots/runtime/tests/slot-lister.vitest.ts:87`, `StartInterval 60` at `.skilled/skills/system-skilled-bots/runtime/tests/slot-lister.vitest.ts:103`. All pass | Met | - |
| AC-009 | REQ-010 | Given two repository identities with the same bot id, When labels are built, Then the labels differ and each parses back to identity, bot id and schedule index | `.skilled/skills/system-skilled-bots/runtime/tests/label.vitest.ts:23` builds `acme/web` and `local/tool` labels for bot `review`, they differ and each parses back | Met | - |
| AC-010 | REQ-006 | Given the code this phase adds, When it is searched, Then no path calls `launchctl bootstrap` and no file writes a `com.skilled.bots.` plist | `rg -n 'launchctl bootstrap' .skilled/skills/system-skilled-bots` printed nothing, exit 1. The only prefix line is the constant at `.skilled/skills/system-skilled-bots/runtime/lib/label.ts:22` | Met | - |
| AC-011 | REQ-001 | Given the phase is about to close, When `~/Library/LaunchAgents` is listed, Then no `com.skilled.probe` plist remains and `launchctl print` for its label fails | On 2026-11-24 `probe-weekday.sh remove` printed `removed`, exit 0. `ls ~/Library/LaunchAgents \| rg com.skilled.probe` then printed nothing, exit 1, and `launchctl print gui/501/com.skilled.probe.weekday` exited 113 (`specs/system-skilled-bots/001-headless-bots-first-build/002-schedule-predicates-and-checker/scratch/probe-result.txt:26`) | Met | - |
| AC-012 | REQ-011 | Given the fixture folder, When each defect test runs, Then each fixture differs from the clean one by one defect and its test asserts the invariant id | `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts:91` compares each fixture with `clean`: one added or changed file, at most one replaced line. Each defect test asserts its id at `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts:118` | Met | - |
| AC-013 | REQ-012 | Given a repository with no remote, When `bot-check.cjs` runs on a definition set whose `bots/config.json` has no `identity` key and then on the same set with `"identity": "local/tool"`, Then the first run prints a `FAIL:` line with the no-identity invariant id and exits 1, and the second prints no line with that id | `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts:125` copies the fixture into a temp repository with no remote: exit 1 with one `FAIL: identity-missing:` line, then exit 0 and no line with that id after `"identity": "local/tool"`. Also run by hand in a scratch `git init` repository under `env -i`: exit 1 with the `FAIL: identity-missing:` line, then exit 0 with `PASS: identity: local/tool (from config)` | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Yes. Every criterion is Met.
<!-- /ANCHOR:closure -->
