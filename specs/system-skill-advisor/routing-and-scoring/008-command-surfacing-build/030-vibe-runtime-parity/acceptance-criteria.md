---
title: "Acceptance Criteria: Phase 30: vibe-runtime-parity"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "vibe runtime parity acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/030-vibe-runtime-parity"
    last_updated_at: "2026-11-15T10:20:11Z"
    last_updated_by: "claude"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-030-vibe-runtime-parity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 30: vibe-runtime-parity

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 030-vibe-runtime-parity
**Level:** 2
**Status:** Draft
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a run log line with runtime `vibe` whose locator names the committed reader fixture `scratch-cwd`, When the scorer summarizes it, Then the `vibe.pre` block prints `scored` 1 and `unscoredRuns` `[]`, and the fixture's records normalize to a `write` event whose path ends in `/proof.txt` | The summary and `vibeRecords` cases of T003 failed before its change and pass after it, and the `G1` line of `scratch/repro-after.txt` (T015) | Unmet | - |
| AC-002 | REQ-002 | Given the fixed scorer, When its Vibe table is read and the shared readers are diffed, Then the table holds only `file_system.read_file`, `file_system.write_file`, `file_system.edit` and `file_system.bash`, no other table changed and the readers show no diff | The `rg` checks of T003 and the `.skilled/hooks` diff check of T016 | Unmet | - |
| AC-003 | REQ-003 | Given the fixed runner, When `--print-argv vibe` runs, Then it exits 2 with `runtime vibe is not measured:` and a reason, never `unknown runtime`, and `RUNTIMES` holds no Vibe entry | The Vibe case of T004 failed before its change and passes after it, and the `G2` line of `scratch/repro-after.txt` (T015) | Unmet | - |
| AC-004 | REQ-004 | Given this checkout and the fixture files of `HWT`, When the wiring check runs, Then it prints `ok vibe` here, `hook-missing vibe .vibe/hooks.toml` for a `post_agent`, commented or name-only entry, `skipped` without `.vibe/`, and loads only `node:fs` and `node:path` | The five Vibe cases of T005 failed before its change and pass after it, `WIRE` in `after.txt` (T013) | Unmet | - |
| AC-005 | REQ-005 | Given the fixed workflow and route, When the contract test, `route-validate.sh` and `derive-command-bridges.cjs --check` run, Then each passes and the workflow and route name the three Vibe scripts nine and three times | `node --test` of the contract test and the `rg -c` checks of T006, and the `G5` line of `scratch/repro-after.txt` reading `workflow-lines=9 route-lines=3` (T015) | Unmet | - |
| AC-006 | REQ-006 | Given a Vibe brief whose head names a command, When the Vibe hook returns it, Then the head carries one `Command documents` line naming each command's file before the directive block, a head with no command carries none, every `commandPolicies` command maps to an existing file and `AGENTS.md` shows no diff | The `withCommandDocuments` cases of T009 failed before its change and pass after it, the `AGENTS.md` check of T016 and `AMC` at `16250 / 16384` | Unmet | - |
| AC-007 | REQ-007 | Given an isolated scope with the real advisor, When the Vibe prompt-advisor hook runs the readme, git hooks and setup prompts, Then each head holds its command, its policy word, the `Also:` line where the case has one and its document line | `VPT` in T008 and T009, and `VX tests/hooks/vibe-prompt-advisor.vitest.ts` in `after.txt` (T013) | Unmet | - |
| AC-008 | REQ-008 | Given the fixed tree, When the floors, the eval and every gate run, Then each floor and eval line equals its before line and every gate passes | `cmp` of the before and after files in T014 and `after.txt` of T013 | Unmet | - |
| AC-009 | REQ-009 | Given a startup event, When the shared handler records a policy observation for Claude, Pi, DSH, Vibe and Codex, Then each record carries `Claude Code`, `pi`, `dsh`, `vibe` and `codex` | The label cases of T007 failed before its change and pass after it, and the four `G11` lines of `scratch/repro-after.txt` (T015) | Unmet | - |
| AC-010 | REQ-010 | Given the three documents, When each is searched for its new sentence, Then each states the shipped behaviour and changes no other line | The `rg` and `numstat` checks of T010 to T012 | Unmet | - |
| AC-011 | REQ-011 | Given the phase diff, When added comment and doc lines are searched and the guarded paths are diffed, Then nothing is found and nothing outside `FILES` and this folder changed | The checks of T016 and the commit listing of T017 | Unmet | - |
| AC-012 | REQ-012 | Given the fix commit, When one Opus reviewer reads its diff, Then no P0 or P1 stays open | `scratch/review/report.txt` and the record on T018 | Unmet | - |
| AC-013 | REQ-013 | Given the close-out, When `scratch/handback.md` is read, Then it lists each handed-back gap with file and line evidence that still holds and the owner it goes to | The `rg -n` recheck of T019 | Unmet | - |

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

The phase is planned and not built, so every criterion is still unmet.
<!-- /ANCHOR:closure -->
