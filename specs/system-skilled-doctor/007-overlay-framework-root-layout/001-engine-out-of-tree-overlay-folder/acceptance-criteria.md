---
title: "Acceptance Criteria: Phase 1: engine-out-of-tree-overlay-folder"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "engine out of tree overlay folder acceptance criteria"
  - "sibling overlay folder acceptance rows"
  - "repin stage writes nothing live acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder"
    last_updated_at: "2026-11-20T09:31:33Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked every criterion Met with observed runs"
    next_safe_action: "Start phase 002"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-engine-out-of-tree-overlay-folder"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: engine-out-of-tree-overlay-folder

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder
**Level:** 2
**Status:** Complete
**Date:** 2026-11-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Paths in the Verification cells are under `.skilled/commands/doctor/scripts/tests/` unless they say otherwise. "Sibling folder" means a fixture with the overlay folder at `workspace/overlays` and the setting `../overlays`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a tree whose setting is each value in the accept/refuse table, When `engine.resolveOverlayDir(tree)` runs, Then it returns `../overlays` for `../overlays`, `../overlays/` and `a/../../overlays`, and throws an error naming `.skilled-overlays.json` for `..`, `../`, `.`, `/etc`, `C:\overlays`, a NUL value, `../../x` and `../a/b` | `node --test overlay-engine-fixes.test.cjs` exits 0. Observed: fixes test 33/33, exit 0. Cited: .skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs:115, .skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs:123. | Met | - |
| AC-002 | REQ-002 | Given the in-tree fixtures, When `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` runs, Then it exits 0 with no existing assertion edited apart from `overlay-engine-fixes.test.cjs:102-105`, and an in-tree re-pin's `backup.json` has no `area` field | The suite run, plus `git diff -U0 -- .skilled/commands/doctor/scripts/tests/overlay-engine-{sync,strict-writes,repin,follow-up}.test.cjs \| rg '^-\s*(assert\|test\()'` printing nothing (`overlay-engine-fixtures.cjs` is an expected modification), and the new in-tree no-`area` test in `overlay-engine-repin.test.cjs`. Observed: suite 238/238, exit 0; the `rg` printed nothing; "an in-tree backup records no area, so every entry is a tree path" passed. Cited: .skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs:1180. | Met | - |
| AC-003 | REQ-003 | Given a sibling folder, When `status`, `apply` and `apply --capture` run, Then `status` exits 0 on an in-sync tree, `apply` writes each destination from its source, and `--capture` writes the live edit into `workspace/overlays/` | `node --test --test-name-pattern sibling overlay-engine-sync.test.cjs` exits 0. Observed: sync sibling pattern 3/3, exit 0. Cited: .skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs:1738, .skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs:1770. | Met | - |
| AC-004 | REQ-004 | Given a sibling folder and a new pin, When a live re-pin runs, Then it exits 0 and `repin-runs/<id>/backup.json` lists `overlay-manifest.json` and `sync-state.json` with `"area": "overlay"` and overlay-relative paths, stored outside the run's `backup/` subfolder | `node --test --test-name-pattern sibling overlay-engine-repin.test.cjs` exits 0. Observed: "a live repin with a sibling overlay folder backs up its files against the overlay root" passed; repin sibling pattern 10/10, exit 0. Cited: .skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs:1151. | Met | - |
| AC-005 | REQ-005 | Given a sibling-folder run folder, and separately a run folder with no `area` entries, When `repin --rollback` runs on each, Then the manifest pin and `sync-state.json` are restored byte for byte and the old run folder restores as it does today | `node --test --test-name-pattern sibling overlay-engine-repin.test.cjs` exits 0. Observed: "--rollback of a sibling-folder run restores the manifest pin and sync-state.json in the overlay folder" and the in-tree backup rollback passed. Cited: .skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs:1198, .skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs:1180. | Met | - |
| AC-006 | REQ-006 | Given a sibling folder and an empty stage folder beside the tree, When `repin --stage <dir>` runs, Then `<dir>/<tree folder name>` and `<dir>/<overlay folder name>` exist and the live manifest, live `sync-state.json` and live `repin-runs/` bytes are unchanged; When the stage folder sits inside the live overlay folder, Then the run exits 2 | `node --test --test-name-pattern sibling overlay-engine-repin.test.cjs` exits 0. Observed: "repin --stage with a sibling overlay folder stages both folders and writes nothing in the live overlay folder" and "repin --stage refuses a stage folder inside the live sibling overlay folder" passed. Cited: .skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs:1221, .skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs:1245. | Met | - |
| AC-007 | REQ-007 | Given a sibling folder under strict writes, When `--guard` runs for an owned destination and for a file inside `workspace/overlays/`, Then the first is refused and the second is allowed | `node --test --test-name-pattern sibling overlay-engine-strict-writes.test.cjs` exits 0. Observed: "the guard names a sibling overlay folder for an owned path and allows a path inside that folder" passed; strict-writes sibling pattern 5/5, exit 0. Cited: .skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:677, .skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:695. | Met | - |
| AC-008 | REQ-008 | Given a sibling folder with the tree nested in the git repository and a staged pin change, When pre-commit runs, Then it lets the commit through; Given the tree as the git top level, When pre-commit runs, Then it exits 2 with a line saying the overlay folder must sit inside the same repository | `node --test --test-name-pattern sibling overlay-engine-strict-writes.test.cjs` exits 0. Observed: both sibling pre-commit cases passed. Cited: .skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:730, .skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:753. | Met | - |
| AC-009 | REQ-009 | Given a sibling folder and an unowned vendored file, When `apply --adopt <path>` runs, Then the copy lands inside `workspace/overlays/` and the manifest gains its entry | `node --test --test-name-pattern sibling overlay-engine-strict-writes.test.cjs` exits 0. Observed: "adopt writes the copy and its entry into a sibling overlay folder and names it" passed. Cited: .skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:708. | Met | - |
| AC-010 | REQ-010 | Given a sibling folder with an off-layout source, When `apply --relayout` runs, Then it exits 0 and `relayout-runs/<stamp>/` holds the moved source and the manifest at overlay-relative paths; Given an in-tree folder, Then the backup keeps `runDir/<overlayLabel>/...` | `node --test overlay-engine-follow-up.test.cjs` exits 0, including `:1094,1098,1138-1139`. Observed: follow-up 46/46, exit 0, including the sibling relayout case. Cited: .skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:1207. | Met | - |
| AC-011 | REQ-011 | Given a guard-core tree whose setting names a sibling folder, When the guard evaluates an owned destination and a file inside the sibling folder, Then the first is denied and the second allowed, with `overlay-guard.cjs` unchanged | `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` exits 0. Observed: guard 20/20, exit 0; `overlay-guard.cjs` has no diff. Cited: .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs:191. | Met | - |
| AC-012 | REQ-012 | Given a sibling folder, When status prints an overlay path, Then the line shows `../overlays/<source>` relative to the tree root | `node --test --test-name-pattern sibling overlay-engine-sync.test.cjs` exits 0. Observed: "status and status --json show a sibling overlay folder by its ../overlays label" passed. Cited: .skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs:1754. | Met | - |

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

Every criterion is `Met`, each with the test run observed in its Verification cell.
<!-- /ANCHOR:closure -->
