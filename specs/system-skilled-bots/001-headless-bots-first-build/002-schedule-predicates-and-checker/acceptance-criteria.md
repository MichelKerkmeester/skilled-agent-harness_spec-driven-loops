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
**Status:** Draft
**Date:** 2026-11-22
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the probe plist is bootstrapped on day one, When it has run across one matching and one non-matching weekday, Then `decision-record.md` holds the dates, the plist text and the fire log lines, and `implementation-summary.md` holds one result line naming `Weekday` with the dates | `rg -n 'Probe observation' decision-record.md` and the log excerpt under it, and `rg -n 'Weekday' implementation-summary.md` | Unmet | - |
| AC-002 | REQ-002 | Given the probe record, When the translator test runs `0 9 * * 1-5`, Then the outcome (emit `Weekday` alone, or refuse by id) matches the rule the record names | Translator test output for that case, read beside the decision record | Unmet | - |
| AC-003 | REQ-003 | Given the translator, When it translates `*/15 0-23/2 * * *` and `0 9 1 * 1`, Then it yields 48 dictionaries and 1 dictionary | Translator test output naming both counts | Unmet | - |
| AC-004 | REQ-004 | Given `@reboot`, `@AppleNotOnBattery`, a percent-stdin cron and a cron past the cap, When each is translated, Then each fails with its own invariant id, and `@reboot` passes parse before it fails translate | Refusal test output listing four distinct ids | Unmet | - |
| AC-005 | REQ-005 | Given the clean fixture, each defect fixture and a missing path, When `bot-check.cjs` runs on each, Then it prints one `PASS\|FAIL\|WARN\|INFO: <id>: <message>` line per finding and exits 0, 1 and 2 | Checker runs with output and `echo $?` read for each | Unmet | - |
| AC-006 | REQ-007 | Given a fixture with one advisory finding and one hard failure, When the checker runs with and without the strict switch, Then only the advisory line changes and the exit stays 1 | Two checker runs compared line by line | Unmet | - |
| AC-007 | REQ-008 | Given the finished checker, When it is searched for restated enums or bounds, Then no executor kind, budget bound or cron rule is defined in it | `rg -n 'cli-opencode\|3600\|@reboot' .skilled/skills/system-skilled-bots/scripts/bot-check.cjs` prints nothing | Unmet | - |
| AC-008 | REQ-009 | Given the shared fixture set with one daylight-saving boundary under a fixed `TZ`, When the lister and the translator run over it, Then their slot sets agree, including the `StartInterval 60` case | Agreement test output naming the boundary case | Unmet | - |
| AC-009 | REQ-010 | Given two repository identities with the same bot id, When labels are built, Then the labels differ and each parses back to identity, bot id and schedule index | Label test output | Unmet | - |
| AC-010 | REQ-006 | Given the code this phase adds, When it is searched, Then no path calls `launchctl bootstrap` and no file writes a `com.skilled.bots.` plist | `rg -n 'launchctl bootstrap' .skilled/skills/system-skilled-bots` prints no code line | Unmet | - |
| AC-011 | REQ-001 | Given the phase is about to close, When `~/Library/LaunchAgents` is listed, Then no `com.skilled.probe` plist remains and `launchctl print` for its label fails | `ls ~/Library/LaunchAgents \| rg com.skilled.probe` prints nothing | Unmet | - |
| AC-012 | REQ-011 | Given the fixture folder, When each defect test runs, Then each fixture differs from the clean one by one defect and its test asserts the invariant id | `diff` of each fixture against the clean one shows one change, and the test suite exits 0 | Unmet | - |
| AC-013 | REQ-012 | Given a repository with no remote, When `bot-check.cjs` runs on a definition set whose `bots/config.json` has no `identity` key and then on the same set with `"identity": "local/tool"`, Then the first run prints a `FAIL:` line with the no-identity invariant id and exits 1, and the second prints no line with that id | Two checker runs in a scratch repository with no remote, with output and `echo $?` read for each | Unmet | - |

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

**Closeable:** No

No. Nothing is built yet, and AC-001 waits for at least two observed days of the weekday probe.
<!-- /ANCHOR:closure -->
