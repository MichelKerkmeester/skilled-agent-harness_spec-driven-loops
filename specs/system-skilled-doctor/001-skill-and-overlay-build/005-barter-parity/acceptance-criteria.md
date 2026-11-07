---
title: "Acceptance Criteria: Phase 5: barter-parity"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "barter parity acceptance criteria"
  - "overlay adoption closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/005-barter-parity"
    last_updated_at: "2026-11-07T23:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Marked every criterion Met with final-state evidence"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "b2bc3af2-2d66-4d13-9d70-784e628579d2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Phase 5: barter-parity

<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 005-barter-parity
**Level:** 2
**Status:** Complete
**Date:** 2026-11-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a token-named file inside a walked folder, When `status` and `apply` run, Then `status` exits 1 with a `MISS` line naming the file and the `protectedPaths` fix while still reporting other overlays, and `apply` exits 1 writing nothing | `overlay-engine-fixes.test.cjs` "blocks only its own entry" passes; mutation restoring the abort fails it | Met | - |
| AC-002 | REQ-002 | Given Barter's adopted tree, When the upstream `status` and Barter's two checks run, Then all three pass | `overlay-engine.cjs status --root B` printed `checked=132 ok=132 miss=0`, `RESULT: PASSED`; `replay.cjs --check` `RESULT: PASSED`; `sync.cjs --status` `in-sync=468` | Met | - |
| AC-003 | REQ-003 | Given the final tree, When the doctor suite runs, Then only the six baseline agents-md failures remain | `node --test …/*.test.cjs` printed `tests 1068`, `pass 1062`, `fail 6`, the six agents-md tests that fail on the base | Met | - |
| AC-004 | REQ-004 | Given an upstream `.dsh` file and no `repin.runtimeFolders`, When a re-pin runs, Then the file is copied and counted | re-pin test "copies .dsh" printed `copy 10 paths, delete 2 paths`; mutation dropping `.dsh` fails it | Met | - |
| AC-005 | REQ-005 | Given upstream changes in a root file, a real top-level folder, a linked top-level folder and an excluded path, When a re-pin runs, Then `notCopied` lists the three non-link paths and no link path | re-pin test asserts `notCopied` equals `['.claude/new.md', 'AGENTS.md', 'repo-rules/new-rule.md']`; on Barter the stage listed only `README.md`, skipping the `specs` link | Met | - |
| AC-006 | REQ-006 | Given a manifest with one regenerate and one verify step, When a stage runs, Then it prints the stage-skip line | stage test matched `stage skipped 1 regenerate and 1 verify step(s)`; Barter's stage printed `stage skipped 9 regenerate and 10 verify step(s)` | Met | - |
| AC-007 | REQ-007 | Given a refused overlay, When a live re-pin runs, Then it exits 2 before any backup and the tree is unchanged | re-pin test "stops before the backup": exit 2, no `repin-runs`, unchanged tree digest | Met | - |
| AC-008 | REQ-008 | Given no manifest at the default folder, When `status --json` runs with and without the setting file, Then only the no-setting error names `.skilled-overlays.json` | `overlay-engine-sync.test.cjs` 17 of 17, both variants | Met | - |
| AC-009 | REQ-009 | Given the three adoption phrases, When the phrase-reach probe runs, Then each reaches `command-doctor-overlay-status` | `doctor-phrase-reach.cjs` printed `STATUS=OK phrases=228 bridges=35`, all three phrases PASS | Met | - |
| AC-010 | REQ-002 | Given Barter's adopted tree, When a re-pin onto this branch's commit is staged, Then it finishes with no blocked overlay | `repin --to c29f26ded8 --stage` exit 0, `checked=132 ok=132 miss=0`, `RESULT: STAGED`, no `blocked` line | Met | - |

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

Every criterion is Met with evidence observed from the final tree at `c29f26ded8`.
<!-- /ANCHOR:closure -->
