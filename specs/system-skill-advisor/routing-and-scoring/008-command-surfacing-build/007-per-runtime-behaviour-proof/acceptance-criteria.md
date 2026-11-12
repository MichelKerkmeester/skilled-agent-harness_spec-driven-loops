---
title: "Acceptance Criteria: Phase 7: per-runtime-behaviour-proof"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "per runtime behaviour proof acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof"
    last_updated_at: "2026-11-12T21:30:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Run the tasks before the pre-change arm, then meet the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-per-runtime-behaviour-proof"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: per-runtime-behaviour-proof

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
**Packet:** `system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. `S` is `$ADV/scripts/routing-accuracy/score-command-transcripts.mjs`. `R` is `$ADV/scripts/routing-accuracy/run-command-behaviour.mjs`. `D` is `$ADV/scripts/command-bridges/derive-command-bridges.cjs`. `X` is this phase's `scratch/` folder.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given built sessions for each ready runtime, When `S` scores them, Then each scorer fact matches its test row, and a gated reader exits 2 with `capability_gated` | In `$ADV`, `npx vitest run tests/command-transcript-score.vitest.ts` reports 0 failed, and `node $S --runtime cursor --locator '{"sessionId":"x"}'` exits 2 | Unmet | - |
| AC-002 | REQ-002 | Given the corpus, When `R` lists the chat set or is handed a holdout row, Then it lists 24 ids and refuses the holdout row with exit 2 and no prompt text | `node $R --list chat \| wc -l` prints 24, and `node $R --row-id <holdout id>` exits 2 | Unmet | - |
| AC-003 | REQ-003 | Given both arms on each measured runtime, When the summary runs, Then it prints a pre and a post command-start rate as n of 12 per runtime (the 8 start and 4 run rows, with the 4 ask rows reported apart) | `node $S --summary $X/runs-pre.jsonl $X/runs-post.jsonl --json \| jq -c 'map_values({pre: .pre.startRate, post: .post.startRate})'` | Unmet | - |
| AC-004 | REQ-004 | Given the post-change arm, When it is scored, Then the unsafe-start count is 0 on every measured runtime | `jq -c 'map_values(.post.unsafe)' $X/summary.json` prints 0 for each runtime | Unmet | - |
| AC-005 | REQ-005 | Given the started-command set on each measured runtime, When it is scored, Then no run started a loop without init | `jq -c 'map_values(.g2.loopsWithoutInit)' $X/summary.json` prints 0 for each runtime | Unmet | - |
| AC-006 | REQ-006 | Given all live runs done, When the worktree is checked, Then no path outside this phase folder is changed, and every changed path in the run logs is marked restored | `git -c core.fsmonitor=false status --porcelain` and `jq -s '[.[] \| select(.changedPaths != .restored)] \| length' $X/runs-*.jsonl` prints 0 | Unmet | - |
| AC-007 | REQ-007 | Given the post-change and started-command sessions, When `COMMAND:` lines are counted, Then no command has more than one per session, and `agents-md-check.cjs` reports `OK` | `jq -c 'map_values([.post.repeatedCommandLines, .g2.repeatedCommandLines])' $X/summary.json` prints 0s, and `node .skilled/commands/doctor/scripts/agents-md-check.cjs --json \| jq -r .status` prints `OK` | Unmet | - |
| AC-008 | REQ-008 | Given the lead-phrase check, When the deriver runs on the repository and on the two fixtures, Then the repository is `fresh`, the read-only fixture fails, the ask-route fixture passes and the doctor slice is green | `node $D --check` and, in `$ADV`, `npx vitest run tests/command-policy-derivation.vitest.ts tests/doctor-routing-slice.vitest.ts` reports 0 failed | Unmet | - |
| AC-009 | REQ-009 | Given two copies outside the repository that differ only in the name of `skill.md`, When Claude Code lists its Skill tool in each, Then the record states which copy lists `create:readme` | `$X/g5/listing-a.txt`, `$X/g5/listing-b.txt` and the result line in `implementation-summary.md` | Unmet | - |
| AC-010 | REQ-010 | Given the change, When the floors and the suite run, Then the scorer floor prints `[159,50,20,5]`, the command baseline metrics equal the T001 numbers and `npm test` in `$ADV` reports 0 failed | The `P` and `M` outputs from `tasks.md` and the suite summary | Unmet | - |

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

The phase is planned and nothing is built. Every question is answered.
<!-- /ANCHOR:closure -->
