---
title: "Acceptance Criteria: Phase 8: hub-wiring"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hub wiring acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/008-hub-wiring"
    last_updated_at: "2026-11-22T10:48:35Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-hub-wiring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: hub-wiring

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 008-hub-wiring
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
| AC-001 | REQ-001, REQ-002 | Given the hub is scaffolded by `/create:skill-parent`, When `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots` runs, Then it exits 0 and its `INFO: Parent skill:` subject line names `system-skilled-bots` | Verbatim gate output with exit status in `implementation-summary.md`. A run without the hub path or with another subject line does not count (`skill-hub-routing.md` §3) | Unmet | - |
| AC-002 | REQ-003 | Given one natural prompt per mode (author, run, schedule, status), When each goes through `compiled-route.cjs --hub system-skilled-bots` and `skill_advisor.py --threshold 0.5`, Then stage two returns that mode with non-empty intents and stage one returns `system-skilled-bots` | Eight verbatim outputs, two per mode. A stage-one hit with `surfaceIntents: []` or a stage-two hit with `intents: [NONE]` fails the row, and the vocabulary is fixed on both sides (`parent-skills-nested-packets.md` §7, `skill-hub-routing.md` §1) | Unmet | - |
| AC-003 | REQ-004, REQ-011 | Given every surface ADR-001 lists as applying to a `metadata` mode, When each is inspected, Then each carries all four modes, and the hub `SKILL.md` mode table names all four with the packet count | A checklist row per applicable surface of `parent-skills-nested-packets.md` §7 with the file and the `rg` output. The ungated rows (stage-two intent, advisor vocabulary, `description.json`) are checked by hand, never inferred from a registry entry (`skill-hub-routing.md` §2) | Unmet | - |
| AC-004 | REQ-005 | Given the commands exist from `/create:command`, When the mirror sync scripts and checkers run, Then every runtime mirror carries every bots command and the doctor bots command | `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check` and `pi/sync-prompts-pi.cjs --check` each exit 0, plus a listing per mirror tree | Unmet | - |
| AC-005 | REQ-006 | Given the leaf manifest was regenerated, When the per-hub gate runs with the hub path, Then `10b-byte-drift` passes | The `10b-byte-drift` line from the AC-001 gate output | Unmet | - |
| AC-006 | REQ-007 | Given a copy of a vendored consumer with a fixture `bots/` folder, When `overlay-engine.cjs repin --upstream <dir> --to <commit> --root <copy> --stage <empty dir>` runs on it, Then every file under `bots/` in the staged tree and in the copy is byte-identical to the copy before the run | `shasum` lists of `bots/` from the copy before, the copy after and the staged tree, compared with `diff` and printing nothing, plus the repin exit status | Unmet | - |
| AC-007 | REQ-008 | Given phases 001 to 008 are written, When their documents are searched, Then none claims a mode is routed or reachable before AC-001 and AC-002 are Met, or integrated before AC-001 to AC-005 are Met (`skill-hub-routing.md` §2) | `rg` output over `../00[1-8]-*/*.md` showing no such claim | Unmet | - |
| AC-008 | REQ-009 | Given the alias list in ADR-002, When each alias's out-of-domain phrase goes through both stages, Then neither stage selects `system-skilled-bots` | One verbatim stage-one and stage-two output per alias (`skill-hub-routing.md` §4) | Unmet | - |
| AC-009 | REQ-010 | Given the doctor asset under `.skilled/commands/doctor/assets/`, When the doctor bots command runs on a fixture `bots/` folder, Then it runs the phase 2 checker read-only and reports each negative fixture by its invariant id | Command output plus `git status` showing no write outside the doctor state log | Unmet | - |
| AC-010 | REQ-012 | Given the phase diff, When it is inspected, Then no file under `.skilled/skills/system-skilled-bots/runtime/` changed | `git diff --stat -- .skilled/skills/system-skilled-bots/runtime` prints nothing | Unmet | - |
| AC-011 | REQ-013 | Given the AC-006 copy with a fixture install record at `<state root>/<identity>/installs/<bot-id>.json` under a temp user-level state root, and a fixture run folder under the copy's `.skilled/skills/.state/system-skilled-bots/<identity>/runs/`, When the staged re-pin runs and `bots status` reads the staged tree, Then the schedule is reported as needing reinstall, and whether the run folder survived is recorded | `bots status` output naming the reinstall row, plus `ls` of the run folder in the copy and the staged tree, in `implementation-summary.md` | Unmet | - |
| AC-012 | REQ-014 | Given one natural prompt for `bots inbox` and one for `bots answer`, When each goes through `compiled-route.cjs --hub system-skilled-bots` and `skill_advisor.py --threshold 0.5`, Then stage two returns status and run with non-empty intents and stage one returns `system-skilled-bots`, and each new alias misses its out-of-domain phrase | Four verbatim routing outputs plus one stage-one and stage-two output per new alias | Unmet | - |

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

Nothing is built yet, so every criterion is Unmet. AC-001 and AC-002 decide whether any mode may be called routed, and AC-001 to AC-005 decide whether it may be called integrated.
<!-- /ANCHOR:closure -->
