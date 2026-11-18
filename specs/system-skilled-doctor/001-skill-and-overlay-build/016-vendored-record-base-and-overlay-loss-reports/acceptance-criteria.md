---
title: "Acceptance Criteria: Record-base in a vendored layout and overlay-engine loss reports"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "vendored record base and overlay loss reports acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/016-vendored-record-base-and-overlay-loss-reports"
    last_updated_at: "2026-11-18T06:50:22Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-vendored-record-base-and-overlay-loss-reports"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Record-base in a vendored layout and overlay-engine loss reports

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 016-vendored-record-base-and-overlay-loss-reports
**Level:** 2
**Status:** Complete
**Date:** 2026-11-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a project whose `.skilled` is a symlink into a vendored subfolder, When `record-base` runs from the project root, Then the root is the folder that holds the real `.skilled`. An out-of-tree or wrongly named symlink is refused. | `.skilled/commands/doctor/scripts/tests/release-update.test.cjs:1987` ("record-base and check run from the vendored folder behind a root .skilled symlink") failed before the fix with the symlink error and passes after it. `.skilled/commands/doctor/scripts/tests/release-update.test.cjs:2027` ("a root .skilled symlink that leaves the work tree or names another folder is refused") passes. The root is chosen in `resolveRepo`, at `.skilled/commands/doctor/scripts/release-update.cjs:329`. Receipt: `scratch/work-record.md:15`, recorded and not re-run for this packet. | Met | - |
| AC-002 | REQ-002 | Given a vendored project whose HEAD sits in a subfolder, When `record-base` reads the project's own HEAD, Then the read uses `<rev>:<show-prefix>` and framework release commits are read at the top level. | `headFilesAt()` is defined at `.skilled/commands/doctor/scripts/release-update.cjs:413` and called at lines 916, 1942 and 2472. `releaseRenames` uses `:(top)` at line 1141. Both are observed by grep in this packet. `scratch/work-record.md:12` describes the change and the vendored test at `.skilled/commands/doctor/scripts/tests/release-update.test.cjs:1987` passes (`scratch/work-record.md:15`). No test names `headFilesAt()` directly. | Met | - |
| AC-003 | REQ-003 | Given a framework commit that falls between release tags, When `record-base --pin <full-sha>` runs, Then the unit records `{ commit, tree }` with no `release` key. A `--pin` value that is not 40 or 64 lowercase hex exits 2 and so does a `--pin` that comes with `--release`. | `.skilled/commands/doctor/scripts/tests/release-update.test.cjs:2047` ("record-base --pin records a framework commit that falls between release tags") failed before the fix with `unknown option` and passes after it (`scratch/work-record.md:15`). The record is written as `{ commit, tree }` at `.skilled/commands/doctor/scripts/release-update.cjs:2488`. Observed in this packet: `--pin abc --dry-run` exits 2 and a 40-hex `--pin` with `--release` exits 2. | Met | - |
| AC-004 | REQ-004 | Given a pinned unit, When `check` reads it, Then the pin is read through `recordRevision()` and a target release that is an ancestor of the pin reports `downgrade`. | The same pin test, `.skilled/commands/doctor/scripts/tests/release-update.test.cjs:2047`, carries the downgrade assertion. That assertion failed before the fix with `actual: 'update'` and passes after it (`scratch/work-record.md:13` and `:15`). `recordRevision()` is defined at `.skilled/commands/doctor/scripts/release-update.cjs:1094`. Recorded, not re-run for this packet. | Met | - |
| AC-005 | REQ-005 | Given a json-entry `set` whose hash names the new upstream copy, When the re-pin runs, Then the report names each upstream item the set would drop and each value upstream changed. Each line prints before the copy. The apply still runs. | `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs:988` ("a re-pin names each upstream change a json-entry set or setKeyOnItem writes over"). `jsonEntryLosses` is defined at `.skilled/commands/doctor/scripts/overlay-engine.cjs:4665`. On a pristine engine copy, 12 of the final overlay tests fail, sync 9 and repin 3 (`scratch/work-record.md:27`). Recorded, not re-run for this packet. | Met | - |
| AC-006 | REQ-006 | Given a directory overlay or a skill-root `replace` folder, that would remove a file upstream added or changed, When the re-pin runs, Then each such file is named after the copy. `remove-root` and skill-root `remove` paths stay unlisted. | `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs:1019` ("a re-pin names each upstream file a directory overlay removes after the copy") and `:1063` ("a re-pin names each upstream file a skill-root overlay removes from a folder it replaces"). `removedUpstreamChanges` is defined at `.skilled/commands/doctor/scripts/overlay-engine.cjs:4800`. The skill-root test failed before its fix (`scratch/work-record.md:27`). Recorded, not re-run for this packet. | Met | - |
| AC-007 | REQ-007 | Given a `setKeyOnItem` or `insertObjectKeys` that wrote a key, When the pin's key is dropped, Then the key is restored from the pin or a key the overlay added is deleted. The restore refuses on a hand-edited value or without a readable pin. | `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs:1576` ("apply takes back a dropped insertObjectKeys key and keeps a record of it while it is listed"), `:1591` ("apply takes back a dropped setKeyOnItem: a key it added leaves and a key upstream ships returns to the pin") and `:1630` ("a dropped setKeyOnItem whose value was edited by hand is refused, not removed"). `restoreDroppedKeys` is defined at `.skilled/commands/doctor/scripts/overlay-engine.cjs:1693`. Work record lines 25 and 27: `scratch/work-record.md:25` and `:27`. Recorded, not re-run for this packet. | Met | - |
| AC-008 | REQ-008 | Given an insert whose `before` anchor the file no longer holds, When `status` or `repin` runs, Then a `NOTE` line names it. Apply still adds the items at the end. | `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs:1541` ("status notes a before anchor the file no longer holds, and apply still adds the items at the end") and `:1563` ("status notes a before anchor that has no identityKey to match it by"). `NOTE` lines print at `.skilled/commands/doctor/scripts/overlay-engine.cjs:3548` and `:4868`. The no-identityKey warning is at `:1068`. Work record, lines 22 and 28: `scratch/work-record.md:22` and `:28`. | Met | - |
| AC-009 | REQ-009 | Given an operation whose path steps through an array index, of any kind, When `status` runs, Then the array-index note prints in place of the record note. | `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs:1457` ("status notes a set through an array index and no longer notes a recorded setKeyOnItem") and `:1524` ("status notes an appendItems or insertItems whose path goes through an array index"). The array-index note is built at `.skilled/commands/doctor/scripts/overlay-engine.cjs:3385`. Work record, lines 23 and 28: `scratch/work-record.md:23` and `:28`. Recorded, not re-run for this packet. | Met | - |
| AC-010 | REQ-010 | Given the command doc, its assets and `overlays.md`, When each is read, Then each describes `--pin`, the `upstream-lost` lines or the anchor `NOTE`, as applicable. | Observed by grep in this packet. `.skilled/commands/doctor/update.md:43` and `:86` name `--pin=<full-sha>`. `.skilled/commands/doctor/assets/doctor-update-record-base.yaml:59` names `--pin <sha>`. `.skilled/commands/doctor/assets/doctor-update-presentation.txt:32` names `--pin=<full-sha>`. `.skilled/commands/doctor/assets/doctor-overlay-repin.yaml:78` names `upstream-lost` and `NOTE`. `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:344` names `Upstream lost:`. `.skilled/skills/system-skilled-doctor/references/overlays.md:214` names `upstream-lost`. | Met | - |
| AC-011 | REQ-011 | Given the release-update, overlay, contract, compat and agents-md suites, When each runs after the change, Then none has a failing test. | `scratch/work-record.md:15` records contract 12 of 12, compat 30 of 30 and agents-md contract 39 of 39, before and after. `scratch/work-record.md:33` records 368 tests, 368 pass, 0 fail, exit 0 across the named suites. Recorded, not re-run for this packet. | Met | - |

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

Every criterion is Met on the work record's recorded runs or on the code and documents observed for this packet and each Verification cell says which of the two it rests on.
<!-- /ANCHOR:closure -->
