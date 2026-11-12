---
title: "Acceptance Criteria: Phase 1: command-routing-baseline-corpus"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "command routing baseline corpus acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/001-command-routing-baseline-corpus"
    last_updated_at: "2026-11-12T12:27:34Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-command-routing-baseline-corpus"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: command-routing-baseline-corpus

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `system-skill-advisor/routing-and-scoring/008-command-surfacing-build/001-command-routing-baseline-corpus`
**Level:** 3+
**Status:** Complete
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the corpus, When rows are grouped by command, Then all 44 command files have one typed and two plain rows | `jq` over the corpus: 44 commands with a typed row, 88 command and split pairs with a plain row, 0 plain rows holding a command string | Met | - |
| AC-002 | REQ-002 | Given the corpus, When each row's keys are read, Then every row has the eight fields and must-not-start rows have a null command | `jq -e 'has(...)'` over the corpus prints `true` only, and all 22 must-not-start rows have a null command | Met | - |
| AC-003 | REQ-003 | Given the capture script, When it runs twice on one commit, Then both runs print identical JSON | `diff` of two capture runs printed nothing | Met | - |
| AC-004 | REQ-004 | Given the baseline, When `jq` reads it, Then it holds 44 commands with typed and plain recall and a false offer count | `jq` over the baseline printed `[44,true,true,true,true,175]` | Met | - |
| AC-005 | REQ-005 | Given all new files exist, When the existing capture and ratchet run, Then they report 158, 50, 20 and 5 and the ratchet passes | Capture printed `[158,50,20,5]` after all files existed, the ratchet passed, and `scorer-eval-baseline.json` is unchanged in `git status` | Met | - |
| AC-006 | REQ-006 | Given one changed `expected_command`, When the slice test runs, Then it fails and names the row | With row 1 relabeled to `/create:skill` the slice test failed and named `cmd-create-agent-typed-01`. Restored, 4 of 4 passed | Met | - |
| AC-007 | REQ-007 | Given the plain rows, When grouped by command and split, Then each command has a `tune` and a `holdout` row and the baseline reports both | 88 command and split pairs, and the baseline holds `plain_recall_at_1.tune` and `.holdout` | Met | - |
| AC-008 | REQ-008 | Given the corpus, When must-not-start rows are counted, Then there are 20 or more and 8 or more are `d3-plain` | 22 must-not-start rows, 10 with source `d3-plain` | Met | - |
| AC-009 | REQ-009 | Given the corpus, When near-miss rows are grouped by `expected_top`, Then every owner skill in `command-bridges.generated.json` appears | 9 near-miss owners, equal to the 9 owner skills in `command-bridges.generated.json` | Met | - |
| AC-010 | REQ-010 | Given the corpus, When slash-variant rows are counted, Then there are 10 or more | 12 slash-variant rows | Met | - |
| AC-011 | REQ-011 | Given the baseline, When `.unreachable` is read, Then it lists each command no TypeScript-enabled bridge maps to | `.unreachable` lists 25 commands, equal to the 25 empty entries of `scratch/command-bridge-map.json` | Met | - |
| AC-012 | REQ-012 | Given the baseline, When `.metrics.agreement` is read, Then it holds a correct and a total count | `.metrics.agreement` is 7 correct of 12 | Met | - |
| AC-013 | REQ-013 | Given the five corpora, When prompts are compared, Then none repeats | `comm -12` of the existing prompts against the new ones printed 0, and no prompt repeats inside the new corpus | Met | - |

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

Every criterion is met with observed evidence from 2026-11-12.
<!-- /ANCHOR:closure -->
