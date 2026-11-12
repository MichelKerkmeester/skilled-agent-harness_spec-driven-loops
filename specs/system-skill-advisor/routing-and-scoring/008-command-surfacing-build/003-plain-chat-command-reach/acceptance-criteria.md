---
title: "Acceptance Criteria: Phase 3: plain-chat-command-reach"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "plain chat command reach acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/003-plain-chat-command-reach"
    last_updated_at: "2026-11-12T12:27:36Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-plain-chat-command-reach"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: plain-chat-command-reach

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
**Packet:** `system-skill-advisor/routing-and-scoring/008-command-surfacing-build/003-plain-chat-command-reach`
**Level:** 3+
**Status:** Draft
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the extended harness and an empty `MODE_COMMANDS`, When it re-captures before any scorer change, Then the existing keys are byte-identical to the saved baseline and attached reach is 0 on both splits | T008: `diff <(node $C \| jq -c '{rows,metrics,commands,unreachable}') $S/baseline-before.json` prints nothing | Pending | - |
| AC-002 | REQ-002 | Given the attach function, When it gets a single-target `route` with a known mode, a `multi` route and an `ask` route, Then it returns the command for the first and nothing for the others, and the handler and the harness both call it | T011 one-liner output, T017 test, and `rg -n 'attachCommand' $C $ADV/handlers/advisor-recommend.ts` prints a call in each | Pending | - |
| AC-003 | REQ-003 | Given the three hub registries, When the deriver runs, Then `MODE_COMMANDS` holds 19 commands and a hand edit makes `--check` print `stale` | T009 prints 19, T010 prints `stale` then `fresh` | Pending | - |
| AC-004 | REQ-004 | Given `create a readme for the utils folder`, When `advisor_recommend` runs, Then `sk-doc` carries `command` `/create:readme` and the schema accepts a recommendation with and without the field | T014 `jq` output and the schema cases in T017 | Pending | - |
| AC-005 | REQ-005 | Given a stubbed CLI result with `command`, When the hook builds its recommendation, Then the field survives, and the hook no longer sends `includeCompiledRoute: false` | T015 `rg` prints nothing, T016 `rg` prints one line, T017 hook case passes | Pending | - |
| AC-006 | REQ-006 | Given the hand-authored phrases, When the deriver regenerates, Then the 8 non-hub commands each have one row active in both scorers | T021 `jq` prints 8, and T019 and T020 print `true` | Pending | - |
| AC-007 | REQ-007 | Given all changes, When the capture runs, Then plain reach is above 0 of 44 on tune and on holdout, shown as own-row, attached and combined against the ceiling 44 with the doctor rows on their own line | T037: `jq -c .attachedMetrics $S/after.json` | Pending | - |
| AC-008 | REQ-008 | Given all changes, When the capture runs, Then false offers are 0 of 35 and no `d3-plain` row is offered | T037 prints `{"count":0,"total":35}` and T038 prints 0 | Pending | - |
| AC-009 | REQ-009 | Given all changes, When the pinned capture runs, Then the four numbers are no worse than 158, 50, 20 and 5 | T039: `$P` output | Pending | - |
| AC-010 | REQ-010 | Given every typed row, When it is scored, Then none is ambiguous with its own owner, and `/speckit:plan add a login page` is not ambiguous | T035: `jq` prints 0 and the one-liner prints `"ambiguous":false` | Pending | - |
| AC-011 | REQ-011 | Given a metadata command with no compatibility row, When the deriver runs, Then the command is active, and the compatibility file holds no row for the 8 non-hub commands | T027 fixture case and T028 `grep -c` prints 0 | Pending | - |
| AC-012 | REQ-012 | Given the regenerated TypeScript block, When it is searched, Then `/speckit:search` alone among non-doctor rows has `readOnly: true`, and the L3 prompt reaches it | T030 prints 1 and T031 top skill | Pending | - |
| AC-013 | REQ-013 | Given `save context`, When it is scored in both scorers, Then the top 3 hold at most one id for `/speckit:save` | T033 output and the T034 Python tests | Pending | - |
| AC-014 | REQ-014 | Given a deep-loop route, When the prompt has no depth wording, Then no `/deep:*` command attaches, and with depth wording it does | T012 one-liner outputs | Pending | - |
| AC-015 | REQ-015 | Given the operator's decision of 2026-11-12 to replace the umbrella ids now, When the umbrella ids are retired and the gold lines relabelled, Then no active row and no gold label names them and each relabel is listed | T022 prints 0, T024 prints 0 per file and 17 list lines, T023 and T026 values side by side | Pending | - |
| AC-016 | REQ-016 | Given the timing script, When it runs before and after, Then both medians and p95 values are in `implementation-summary.md` | T005 and T041 outputs | Pending | - |
| AC-017 | REQ-017 | Given all changes, When the deriver check, the suite and the metadata gate run, Then they print `fresh`, 0 failed and `failed=0` | T036 and T042 outputs | Pending | - |
| AC-018 | REQ-018 | Given the new doctor phrases in `_routes.yaml`, When the route validator runs, Then it reports OK and every new phrase has three or more words | T046 to T049: `route-validate.sh` prints `OK: route-validate` | Pending | - |
| AC-019 | REQ-019 | Given the regenerated and rebuilt advisor, When the phrase reach probe, the doctor slice and the capture run, Then the probe exits 0, the slice passes and doctor tune recall at 1 is above 0 of 17 | T051 exit status and slice result, T052 `jq` count | Pending | - |
| AC-020 | REQ-020 | Given the new `/doctor:helper` phrases, When the capture runs, Then the doctor rows of other commands with `command-doctor-helper` on top number 7 or fewer | T052 second `jq` count | Pending | - |
| AC-021 | REQ-021 | Given all changes, When the scorer diff is searched, Then no lane, boost or penalty changed for a doctor command | T053: `git diff -- $ADV/lib/scorer \| rg -c 'doctor'` prints nothing | Pending | - |

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

Implementation has not started, so no criterion has evidence yet.
<!-- /ANCHOR:closure -->
