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
    last_updated_at: "2026-11-14T15:45:00Z"
    last_updated_by: "claude"
    recent_action: "Marked every criterion Met with observed evidence"
    next_safe_action: "Coordinator commits the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-024-fable-review-remediation"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a Codex rollout with a custom tool call and one with a function call, When `loadSession` reads each, Then the first call's `arguments` equal `{ input: <body> }` and the second keeps its parsed JSON, and every other reader consumer still passes | `node --test .skilled/hooks/shared/tests/session-readers/*.test.mjs` reports `fail 0` and the two history lookup test files report 0 failed (T009, T018). Met. `RT` printed pass 95 fail 0 (`scratch/after.txt:11`, lines 11 to 13), up from 93 at BASE, and `HT` printed 30 passed in 2 files (`scratch/after.txt:15`, lines 15 to 16). T009 evidence: the custom tool call keeps its body as `arguments.input` and the function call case passes | Met | - |
| AC-002 | REQ-002 | Given a Codex `exec` body with two `cmd` strings, one with a redirect, one that calls no shell tool and one whose commands sit in a list, When `normalize` reads each, Then it returns one shell event with both commands, one write event, one shell event with a null command and one shell event with every string | `npx vitest run tests/command-transcript-score.vitest.ts` reports 0 failed, and both Codex probe blocks print fewer shell events with no command text than shell events (T011, T020). Met. `VX tests/command-transcript-score.vitest.ts` printed 165 passed (`scratch/after.txt:6`). Shell events with no command text read 7 of 58 pre and 4 of 53 post (`scratch/repro-after.txt:110` and `scratch/repro-after.txt:139`) | Met | - |
| AC-003 | REQ-003 | Given the capture before and after the phase, When the five floor lines are compared, Then they are equal, with typed recall at least 24 of 44 and false offers 0 of 35 | `cmp scratch/floor-before.txt scratch/floor-after.txt` prints nothing and exits 0 (T019). Met. `cmp scratch/floor-before.txt scratch/floor-after.txt` printed nothing and exited 0. Typed recall `{"correct":24,"total":44}` and false offers `{"count":0,"total":35}` (`scratch/floor-after.txt:1`, lines 1 to 2) | Met | - |
| AC-004 | REQ-004 | Given the summary over `runs-pre.jsonl` and `runs-post.jsonl` before and after the phase, When the Codex start rates are read, Then `scratch/rescore-delta.txt` holds both arms before and after and the parent goal log repeats them with the words `no brief reached Codex` | `rg -c -e '^codex pre start ' -e '^codex post start ' scratch/rescore-delta.txt` prints 2 and `rg -c -F 'no brief reached Codex' ../goal.md` prints at least 1 (T021). Met. The codex start count over `scratch/rescore-delta.txt` printed 2 (`scratch/rescore-delta.txt:3`, lines 3 to 4, 0 of 12 before and after in both arms) and `rg -c -F 'no brief reached Codex' ../goal.md` printed 1 (`../goal.md:278`) | Met | - |
| AC-005 | REQ-005 | Given the six prompts of the review and the cases the test file held before, When the mention reader reads each, Then two refusals and the question-mark prompt are mentions, three are requests and no earlier case changed | The mention probe prints `SHIPPED: 46 of 46 agree` and `npx vitest run tests/command-attach-guards.vitest.ts` reports 0 failed (T008, T020). Met. `MENTION` printed `SHIPPED: 46 of 46 agree` (`scratch/repro-after.txt:48`) and the guards file printed 119 passed (`scratch/after.txt:3`). The OFFERS rows of the two refusals and the question print `command=-`, the three requests print their command (`scratch/repro-after.txt:52`, lines 52 to 75) | Met | - |
| AC-006 | REQ-006 | Given a lone search over the owner's entry document, a heredoc line that names it and a `cd` into the skill folder followed by `cat SKILL.md`, When `workflowPath` classifies each, Then it returns `none`, `none` and `skill` | The first eight lines of the shell probe end in `none`, `none`, `none`, `none`, `none`, `skill`, `skill` and `none` (T020). Met. The first eight `SHELL` lines end in none, none, none, none, none, skill, skill and none (`scratch/repro-after.txt:145`, lines 145 to 152) | Met | - |
| AC-007 | REQ-007 | Given two run lines that offer the row's command, one with `offeredAs` `partner` and one with `head`, When the summary runs, Then `offered` is 1 and `offeredAsPartner` is 1, and a line with no `offeredAs` counts as before | `npx vitest run tests/command-transcript-score.vitest.ts` reports 0 failed (T015, T016). Met. `VX tests/command-transcript-score.vitest.ts` printed 165 passed (`scratch/after.txt:6`). T015 evidence: the partner case read `offered` 2 first, then passed. T016 evidence: `offeredAsPartner` count 4 in the scorer | Met | - |
| AC-008 | REQ-008 | Given both rescored arms, When the count identity and the denominators are checked, Then the identity prints `true`, the denominators equal their before values and the delta file names a reason for each changed count | `SUMOK` prints `true` over both after files, both `cmp` checks of T021 exit 0, and `scratch/rescore-delta.txt` holds 12 start lines and 11 workflow lines. Met. T021 evidence: SUMOK printed `true` over both after files. `cmp` of both denominator pairs exited 0. `scratch/rescore-delta.txt` holds 12 start lines and 11 workflow lines, and each changed count names its task (`scratch/rescore-delta.txt:24`, lines 24 to 27) | Met | - |
| AC-009 | REQ-009 | Given the routing-accuracy README, When it is searched, Then it states the Codex body rule, the three shell-read rules, the partner count and the three designed withholds | The four `rg` checks of T017. Met. `rg -c` printed 1 for `offeredAsPartner`, 1 for `reads as a gate step` and 1 for `can reach 5 of 8` in the routing-accuracy README (`.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:122`), and `jq -c '.metrics.slash_variant.named_total'` printed 8 | Met | - |
| AC-010 | REQ-010 | Given the phase diff, When added comment lines are searched for a spec path or an id and the corpus, the baseline and `AGENTS.md` are diffed, Then nothing is found and none of the three changed | The checks in T022. Met. `AGENTS.md` diff against BASE exited 0 (`scratch/boundaries.txt:1`, lines 1 to 2). Corpus and baseline exited 1 against BASE because phase 023 committed both between BASE and BASES, and exited 0 against BASES (`scratch/boundaries.txt:3`, lines 3 to 6). No package file changed and the comment id search printed nothing (`scratch/boundaries.txt:7`, lines 7 to 9) | Met | - |

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

Every row is met with evidence observed in the phase scratch files.
<!-- /ANCHOR:closure -->
