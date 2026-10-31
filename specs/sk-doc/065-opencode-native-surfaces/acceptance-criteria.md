---
title: "Acceptance Criteria: Move goal-opencode command into .opencode only and remove the .skilled/plugins symlink"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "opencode native surfaces acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/073-opencode-native-surfaces"
    last_updated_at: "2026-10-28T17:30:00Z"
    last_updated_by: "leaf-worker"
    recent_action: "Marked every acceptance row Met with observed evidence"
    next_safe_action: "None: packet closeable; commit and merge wait on the operator"
    blockers: []
    key_files:
      - ".opencode/commands/goal-opencode.md"
      - ".skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-doc-073-opencode-native-surfaces"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Move goal-opencode command into .opencode only and remove the .skilled/plugins symlink

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** sk-doc/073-opencode-native-surfaces
**Level:** 2
**Status:** Complete
**Date:** 2026-10-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the worktree, When `test -f .opencode/commands/goal-opencode.md -a ! -L .opencode/commands` runs, Then it exits 0 and `.skilled/commands/goal-opencode.md` does not exist | Observed exit 0; the layout test asserts both at .skilled/bin/tests/opencode-compat-layout.test.cjs:86 and passes | Met | - |
| AC-002 | REQ-002 | Given the worktree, When `test -L .skilled/plugins` runs, Then it exits non-zero | Observed exit 1; asserted at .skilled/bin/tests/opencode-compat-layout.test.cjs:85 | Met | - |
| AC-003 | REQ-003 | Given the worktree, When `sync-runtime-mirrors.cjs --check` runs, Then it passes, and with `.opencode/commands/deep` moved away it exits 1 naming the link | Observed `PASS: 202 mirrors across 9 trees are in sync.` exit 0, and `MISSING .opencode/commands/deep` exit 1 from .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:278 | Met | - |
| AC-004 | REQ-004 | Given the worktree, When `rg` searches for `.skilled/plugins` or `.skilled/commands/goal-opencode.md` outside `specs/`, Then it lists no live file | Observed one hit, a released changelog kept as history; the layout guard for the old paths is .skilled/bin/tests/opencode-compat-layout.test.cjs:84 | Met | - |
| AC-005 | REQ-005 | Given the worktree, When the plugin, layout, mirror and catalog suites run, Then each passes | Observed plugins 557/0, layout 20 pass 0 fail 1 skipped, catalog `STATUS=OK`, mirror suite 3/3 including .skilled/skills/system-spec-kit/runtime/cli/tests/sync-runtime-mirrors.test.mjs:50 | Met | - |
| AC-006 | REQ-001 | Given OpenCode v2, When `opencode-version-battery.cjs --family=v2 --root=.` runs, Then every command file under `.opencode/commands`, `goal-opencode` included, is listed (SC-002) | Observed `PASS v2 command-listed: all 49 command files listed`, exit 0; required names come from .skilled/commands/doctor/scripts/opencode-version-battery.cjs:276 | Met | - |

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

Every row is `Met` with evidence observed in the worktree; commit and merge are separate operator steps and do not gate closure.
<!-- /ANCHOR:closure -->
