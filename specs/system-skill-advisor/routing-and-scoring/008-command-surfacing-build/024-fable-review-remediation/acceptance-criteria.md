---
title: "Acceptance Criteria: Phase 24: fable-review-remediation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "fable review remediation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/024-fable-review-remediation"
    last_updated_at: "2026-11-14T12:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Run T001 and T002, then lanes A and R"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-024-fable-review-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 24: fable-review-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 024-fable-review-remediation
**Level:** 2
**Status:** Planned
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a Codex rollout with a custom tool call and one with a function call, When `loadSession` reads each, Then the first call's `arguments` equal `{ input: <body> }` and the second keeps its parsed JSON, and every other reader consumer still passes | `node --test .skilled/hooks/shared/tests/session-readers/*.test.mjs` reports `fail 0` and the two history lookup test files report 0 failed (T009, T018) | Unmet | - |
| AC-002 | REQ-002 | Given a Codex `exec` body with two `cmd` strings, one with a redirect, one that calls no shell tool and one whose commands sit in a list, When `normalize` reads each, Then it returns one shell event with both commands, one write event, one shell event with a null command and one shell event with every string | `npx vitest run tests/command-transcript-score.vitest.ts` reports 0 failed, and both Codex probe blocks print fewer shell events with no command text than shell events (T011, T020) | Unmet | - |
| AC-003 | REQ-003 | Given the capture before and after the phase, When the five floor lines are compared, Then they are equal, with typed recall at least 24 of 44 and false offers 0 of 35 | `cmp scratch/floor-before.txt scratch/floor-after.txt` prints nothing and exits 0 (T019) | Unmet | - |
| AC-004 | REQ-004 | Given the summary over `runs-pre.jsonl` and `runs-post.jsonl` before and after the phase, When the Codex start rates are read, Then `scratch/rescore-delta.txt` holds both arms before and after and the parent goal log repeats them with the words `no brief reached Codex` | `rg -c -e '^codex (pre|post) start ' scratch/rescore-delta.txt` prints 2 and `rg -c -F 'no brief reached Codex' ../goal.md` prints at least 1 (T021) | Unmet | - |
| AC-005 | REQ-005 | Given the six prompts of the review and the cases the test file held before, When the mention reader reads each, Then two refusals and the question-mark prompt are mentions, three are requests and no earlier case changed | The mention probe prints `SHIPPED: 46 of 46 agree` and `npx vitest run tests/command-attach-guards.vitest.ts` reports 0 failed (T008, T020) | Unmet | - |
| AC-006 | REQ-006 | Given a lone search over the owner's entry document, a heredoc line that names it and a `cd` into the skill folder followed by `cat SKILL.md`, When `workflowPath` classifies each, Then it returns `none`, `none` and `skill` | The first eight lines of the shell probe end in `none`, `none`, `none`, `none`, `none`, `skill`, `skill` and `none` (T020) | Unmet | - |
| AC-007 | REQ-007 | Given two run lines that offer the row's command, one with `offeredAs` `partner` and one with `head`, When the summary runs, Then `offered` is 1 and `offeredAsPartner` is 1, and a line with no `offeredAs` counts as before | `npx vitest run tests/command-transcript-score.vitest.ts` reports 0 failed (T015, T016) | Unmet | - |
| AC-008 | REQ-008 | Given both rescored arms, When the count identity and the denominators are checked, Then the identity prints `true`, the denominators equal their before values and the delta file names a reason for each changed count | `SUMOK` prints `true` over both after files, both `cmp` checks of T021 exit 0, and `scratch/rescore-delta.txt` holds 12 start lines and 11 workflow lines | Unmet | - |
| AC-009 | REQ-009 | Given the routing-accuracy README, When it is searched, Then it states the Codex body rule, the three shell-read rules, the partner count and the three designed withholds | The four `rg` checks of T017 | Unmet | - |
| AC-010 | REQ-010 | Given the phase diff, When added comment lines are searched for a spec path or an id and the corpus, the baseline and `AGENTS.md` are diffed, Then nothing is found and none of the three changed | The checks in T022 | Unmet | - |

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

The phase is planned and not built, so every row is unmet.
<!-- /ANCHOR:closure -->
