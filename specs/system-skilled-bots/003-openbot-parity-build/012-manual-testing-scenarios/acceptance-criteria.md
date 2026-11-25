---
title: "Acceptance Criteria: Phase 12: manual-testing-scenarios"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "manual testing scenarios acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios"
    last_updated_at: "2026-11-25T20:32:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-manual-testing-scenarios"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 12: manual-testing-scenarios

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios
**Level:** 2
**Status:** Draft
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`PB` is `.skilled/skills/system-skilled-bots/manual-testing-playbook`, `VAL` is `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` and `RUN` is the one folder under `.skilled/skills/system-skilled-bots/benchmark/reports/` that holds a `results.csv`. Every check below runs from the repository root and needs no tty. The package validator is the gate the playbook contract names, and it reads the corpus as an input [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:67].

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the corpus after the 33 files land, When the package validator runs, Then it prints `PASS` with `scenarios=58 categories=17` and `violations=0`, and every new file carries the five numbered sections in order | `$VAL --package system-skilled-bots` prints `PASS package=system-skilled-bots tier=FAIL_CLOSED scenarios=58 categories=17 operator=52 routing_gold_excluded=6 violations=0 warnings=0`, and `rg -c '^## [1-5]\. ' $PB/*/*.md` prints 58 lines each holding `5` | Unmet | - |
| AC-002 | REQ-002 | Given the nine conversation scenarios, When each is read, Then it is one bash block whose turns are numbered, and the nine cover `bots chat`, `@bot` routing, an answer with `--scope`, the item's `grants`, a memory confirmation, a skill proposal review and the channel fake transport | `find $PB/conversations -name '*.md' \| wc -l` prints 9, and `rg -c '^### Turn [0-9]' $PB/conversations/*.md` prints nine lines each holding `2` or more | Unmet | - |
| AC-003 | REQ-003 | Given any new scenario, When its source section is read, Then it cites the phase spec line whose requirement it proves, so a renamed verb breaks the citation rather than the scenario | `rg -c '\[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/0' $PB/conversations $PB/routines $PB/activity $PB/terminal-screen $PB/working-place $PB/memory $PB/apps $PB/vault $PB/skills $PB/channels` prints 33 lines each holding `1` or more | Unmet | - |
| AC-004 | REQ-004 | Given the one schedule scenario, When its block is read, Then the slot is computed from the current clock plus two minutes and no future day is named; and given the `until` and fatigue scenarios, Then each drives a short loop with no wait | `rg -n 'date -v\+2M\|date -d' $PB/routines/cron-start-fires-at-computed-slot.md` prints the computation, `rg -n 'seq 1 10' $PB/routines/fatigue-after-ten-failures.md` prints the loop, and `rg -n 'until_check\|for i in' $PB/routines/until-outcome-completes.md` prints the loop | Unmet | - |
| AC-005 | REQ-005 | Given the executed corpus, When the run folder is read, Then `results.csv` holds one row per created scenario, each `PASS` or `FAIL` with a reason and an evidence path, and the recorder wrote the folder rather than a hand edit | `rg -c '^(PASS\|FAIL\|SKIP),' $RUN/results.csv` prints 33, and `rg -c '^#' $RUN/results.csv` prints 0, so no row is commented out | Unmet | - |
| AC-006 | REQ-006 | Given a `FAIL` in the recorded run, When the failure list is read, Then the id appears there with the phase, the requirement and the observed line, or the scenario was fixed and its row re-run | `rg -c '^FAIL,' $RUN/results.csv` prints 0, or every id it prints appears in `scratch/failures.md` with a phase and a requirement | Unmet | - |
| AC-007 | REQ-007 | Given the root index, When it is read, Then it holds one section per category, the updated counts, the preconditions the new scenarios need and the wave plan | `rg -c '^### BOT-0' $PB/manual-testing-playbook.md` prints 58, and `rg -c '^## [0-9]+\. ' $PB/manual-testing-playbook.md` prints 9 or more | Unmet | - |
| AC-008 | REQ-008 | Given a channel scenario that names a real account, When it cannot reach that account, Then it records `SKIP` with the missing account as its blocker rather than `FAIL`, and the fake-transport path still runs | `rg -n 'SKIP' $PB/conversations/channel-link-and-reply.md` prints the blocker line, and `rg -n 'fake transport' $PB/conversations/channel-link-and-reply.md` prints the transport the scenario runs on | Unmet | - |
| AC-009 | REQ-009 | Given the root index's scenario table, When it is read, Then every id has a row with its category and its feature-catalog link, and a scenario with no catalog entry says so | `rg -c '^\| BOT-0' $PB/manual-testing-playbook.md` prints 58, and `rg -c 'feature-catalog' $PB/manual-testing-playbook.md` prints 1 or more | Unmet | - |
| AC-010 | REQ-010 | Given the recorded run, When the benchmark index is read, Then it holds the run table and the run's row, so the corpus's execution is visible from the skill's benchmark index | `rg -n '^\| Executed \| Folder \|' .skilled/skills/system-skilled-bots/benchmark/reports/README.md` prints the header, and `rg -c 'manual-testing-playbook--openbot-parity' .skilled/skills/system-skilled-bots/benchmark/reports/README.md` prints 1 | Unmet | - |
| AC-011 | REQ-011 | Given the inventory in `spec.md` and the files on disk, When both are counted, Then they agree: 33 new scenarios, 58 in total, and no scenario for a behavior no phase delivers | `rg -c '^\| BOT-0' specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md` prints 33, and `find $PB -mindepth 2 -name '*.md' \| wc -l` prints 58 | Unmet | - |
| AC-012 | REQ-012 | Given any new scenario, When its block is read, Then no step reads a terminal: the screen's refusal, its lib-level key handling and the `bots answer` write are each proved by a command that needs no tty | `rg -n 'isTTY\|/dev/tty' $PB/*/*.md` exits 1, and `rg -c 'mktemp -d' $PB/conversations $PB/routines $PB/activity $PB/terminal-screen $PB/working-place $PB/memory $PB/apps $PB/vault $PB/skills $PB/channels` prints 33 lines each holding `1` or more | Unmet | - |

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

**Closeable:** No

AC-001 is unmet: the corpus still holds the 25 pre-parity scenarios, so no new scenario file exists and no verdict has been recorded.
<!-- /ANCHOR:closure -->

---
