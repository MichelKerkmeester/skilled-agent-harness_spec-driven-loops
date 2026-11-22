---
title: "Acceptance Criteria: Phase 6: launchd-installer"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "launchd installer acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/006-launchd-installer"
    last_updated_at: "2026-11-22T10:48:32Z"
    last_updated_by: "scaffold"
    recent_action: "Wrote the phase 6 acceptance criteria from the phase advice"
    next_safe_action: "Close phases 3 and 5, then start Setup in tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-launchd-installer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: launchd-installer

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 006-launchd-installer
**Level:** 3
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
| AC-001 | REQ-001 | Given a bot with a valid cron trigger, When `bots schedule install <id>` runs, Then the stubbed `launchctl` records render, lint, bootout, move, bootstrap and print in that order; and Given a plist that fails `plutil -lint`, Then install exits non-zero and the old plist file and loaded job are unchanged | `installer.vitest.ts` transaction and lint-failure cases; byte compare of the old plist before and after | Unmet | - |
| AC-002 | REQ-002 | Given a label never installed before, When install completes, Then the job is disabled and nothing fires until the operator enables it; and When install runs again before enable, Then it does not stop with the kill-switch message | T015: `launchctl print-disabled gui/$(id -u)` lists the label as disabled and no run record appears across one scheduled minute; `installer.vitest.ts` reinstall-before-enable case | Unmet | - |
| AC-003 | REQ-003 | Given a label disabled as a kill switch, When install runs again, Then it stops with a message, or enables the label only when the explicit flag is passed; no code path calls `launchctl load` in any form | `installer.vitest.ts` kill-switch case; `rg -n 'launchctl load|"load"' .skilled/skills/system-skilled-bots/runtime/lib .skilled/bin/bots.cjs` prints nothing | Unmet | - |
| AC-004 | REQ-006 | Given two repository identities with the same bot id, When both render labels, Then the labels differ | `installer.vitest.ts` label-collision case | Unmet | - |
| AC-005 | REQ-005 | Given an enabled harmless cron bot, When launchd fires it with `PATH=/usr/bin:/bin:/usr/sbin:/sbin`, Then the runner starts and writes one run record | T016: one real fire; `launchctl print gui/$(id -u)/<label>` shows the absolute interpreter; the run record is quoted in `implementation-summary.md` | Unmet | - |
| AC-006 | REQ-007 | Given a last run before a simulated sleep gap, When one fire arrives after the gap, Then exactly one run carries `scheduled_at`, a lateness class and a skipped-slot summary of count, first and last instant, and no backfill run exists | `slot-accounting.vitest.ts` sleep-gap case: run count 1 | Unmet | - |
| AC-007 | REQ-004 | Given an unresolvable runner, unreadable switches, unknown identity, a checker failure or a posture failure, When install runs, Then it refuses with the named reason and writes nothing to `~/Library/LaunchAgents` | `installer.vitest.ts` five refusal cases | Unmet | - |
| AC-008 | REQ-008 | Given an installed bot and one orphan hub label, When `bots schedule uninstall <id>` runs, Then both plists and the bot's install record are gone, and the run folders under `.skilled/skills/.state/system-skilled-bots/` in the resolved Skilled tree, for every identity, are byte-identical | `installer.vitest.ts` uninstall case; T020 on the real host | Unmet | - |
| AC-009 | REQ-009 | Given the drain agent is enabled, When one request lands in phase 5's `<state root>/<repository identity>/requests/inbox/`, Then one run record appears and that folder is empty afterwards | T019: `ls -A <state root>/<repository identity>/requests/inbox` prints nothing | Unmet | - |
| AC-010 | REQ-011 | Given an installed job, When install verification runs, Then the plist read back matches the translator's dictionaries, `launchctl print` is read, and the next fire time is reported as UNKNOWN | `installer.vitest.ts` read-back case; install output names next fire as UNKNOWN | Unmet | - |
| AC-011 | REQ-012 | Given a plist whose resolved paths no longer match the tree root, a retargeted `.skilled` link or a changed vendored `pin.commit`, When install runs again, Then the plist and the install record are rewritten with the current paths and pin, the check returns `ok`, and no shim is installed | `installer.vitest.ts` moved-checkout, retarget and re-pin cases (T025) | Unmet | - |
| AC-012 | REQ-010 | Given a one-minute and a one-day schedule, When the grace window is computed, Then it clamps to 120 and 7,200 seconds, and the skipped-slot list comes from the phase 2 slot lister | `slot-accounting.vitest.ts` clamp cases; `rg` shows no second cron evaluator in `runtime/lib` | Unmet | - |
| AC-013 | REQ-013 | Given the phase's code, When it is searched outside the tests, Then only `installer.ts` calls `launchctl`, names `bootstrap` or writes into `~/Library/LaunchAgents` | T021: `rg -n --glob '!tests/**' 'launchctl|bootstrap|LaunchAgents' .skilled/skills/system-skilled-bots/runtime/lib .skilled/bin/bots.cjs` prints lines from `installer.ts` only | Unmet | - |
| AC-014 | REQ-014 | Given a label installed from one clone and a second clone of the same identity whose checkout still exists, When install runs from the second clone, Then it refuses with reason `label-held-by-clone`, names the first clone's path and writes nothing into `~/Library/LaunchAgents` | T022: the `installer.vitest.ts` second-clone case | Unmet | - |
| AC-015 | REQ-015 | Given a plain checkout, a linked `.skilled` (whole or merged) and a vendored tree, When install runs in each, Then `<state root>/<identity>/installs/<bot-id>.json` names the labels, both runner paths, the real path, the tree root, the matching kind, and `pin.commit` only for `vendored`, and no temp file is left beside it | T023 cases in `installer.vitest.ts` |
| AC-016 | REQ-016 | Given an installed bot, When its runner is deleted, its link retargeted, its kind changed, its pin changed or its record removed, Then the check returns `needs-reinstall` with `runner-missing`, `runner-retargeted`, `kind-changed`, `pin-changed` or `record-missing`, and the check leaves the stubbed state root and `~/Library/LaunchAgents` byte-identical | T024 and T025 in `installer.vitest.ts` |
| AC-017 | REQ-017 | Given the finished phase, When its diff is read, Then no file under `.skilled/commands/doctor/` changed and `implementation-summary.md` names the `doctor-overlay-repin.yaml` re-read step as the hook point for the system-skilled-doctor follow-up | T026: `git diff --stat <phase start commit> -- .skilled/commands/doctor` prints nothing; T027 |
| AC-018 | REQ-018 | Given a cron bot with one open needs-you item, When its schedule fires and then fires again after the item is answered, Then the first fire dispatches nothing and its slot is recorded as skipped with reason `held-needs-you`, and the second fire runs with a normal lateness class | `slot-accounting.vitest.ts` with a stubbed fire (T028) | Unmet | - |

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

Nothing is built yet, and no row can be Met before phases 3 and 5 close and the real fire in T016 runs.
<!-- /ANCHOR:closure -->
