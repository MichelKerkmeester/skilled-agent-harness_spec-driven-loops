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
    last_updated_at: "2026-11-13T18:30:00Z"
    last_updated_by: "markdown"
    recent_action: "Closed every criterion with its evidence or decision record"
    next_safe_action: "Operator approves the Codex hooks in one arena, then the Codex-only arm runs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-per-runtime-behaviour-proof"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. `S` is `$ADV/scripts/routing-accuracy/score-command-transcripts.mjs`. `R` is `$ADV/scripts/routing-accuracy/run-command-behaviour.mjs`. `D` is `$ADV/scripts/command-bridges/derive-command-bridges.cjs`. `X` is this phase's `scratch/` folder. Every check below ran on 2026-11-13 at HEAD `1ca14a4498`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given built sessions for each ready runtime, When `S` scores them, Then each scorer fact matches its test row, and a gated reader exits 2 with `capability_gated` | In `$ADV`, `npx vitest run tests/command-transcript-score.vitest.ts` reports 0 failed, and `node $S --runtime cursor --locator '{"sessionId":"x"}'` exits 2. Met: the test file printed `Tests 61 passed (61)` with exit 0, and the cursor call printed `{"ok":false,"code":"capability_gated"}` with exit 2. The test file asserts that refusal at `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:616`. | Met | - |
| AC-002 | REQ-002 | Given the corpus, When `R` lists the chat set or is handed a holdout row, Then it lists 24 ids and refuses the holdout row with exit 2 and no prompt text | `node $R --list chat \| wc -l` prints 24, and `node $R --row-id <holdout id>` exits 2. Met: `--list chat` printed 24 ids and none holds `holdout`. `node $R --dry-run --runtime claude --row-id cmd-create-agent-plain-holdout-01 --out <session scratchpad>` exited 2 and printed `"code":"holdout_row"` with `a holdout row is never run` and no prompt text. The bare `--row-id` form stops earlier as a usage error, because `R` requires `--runtime` (`.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1072`), so the check added `--runtime` and `--dry-run`. | Met | - |
| AC-003 | REQ-003 | Given both arms on each measured runtime, When the summary runs, Then it prints a pre and a post command-start rate as n of 12 per runtime (the 8 start and 4 run rows, with the 4 ask rows reported apart) | `node $S --summary $X/runs-pre.jsonl $X/runs-post.jsonl --json \| jq -c 'map_values({pre: .pre.startRate, post: .post.startRate})'`. Met: `scratch/summary.json:1` reads claude 3 of 12 to 4 of 12, codex 0 of 12 to 0 of 12, pi 0 of 11 to 2 of 10, devin 1 of 8 to 3 of 9, opencode 2 of 7 to 1 of 5 and dsh 6 of 12 to 6 of 12. Capped start rows leave the denominator, so four runtimes read under 12. The rerun over `runs-pre-final.jsonl` and `runs-post-final.jsonl` printed the same six pairs with exit 0. Over `runs-pre.jsonl` it printed dsh pre 4 of 12, because that log holds the first DSH arm, which ran with the advisor off (`../goal.md:122`). | Met | - |
| AC-004 | REQ-004 | Given the post-change arm, When it is scored, Then the unsafe-start count is 0 on every measured runtime | `jq -c 'map_values(.post.unsafe)' $X/summary.json` prints 0 for each runtime. Waived: it printed `{"claude":0,"codex":0,"pi":1,"devin":1,"opencode":2,"dsh":0}`. The final arm reads 7 in `$X/summary-final.json` line 1. | Waived | ADR-005 |
| AC-005 | REQ-005 | Given the started-command set on each measured runtime, When it is scored, Then no run started a loop without init | `jq -c 'map_values(.g2.loopsWithoutInit)' $X/summary.json` prints 0 for each runtime. Waived: it printed `{"claude":0,"codex":0,"pi":2,"devin":1,"opencode":1,"dsh":0}`. | Waived | ADR-006 |
| AC-006 | REQ-006 | Given all live runs done, When the worktree is checked, Then no path outside this phase folder is changed, and every changed path in the run logs is marked restored | `git -c core.fsmonitor=false status --porcelain` and `jq -s '[.[] \| select(.changedPaths != .restored)] \| length' $X/runs-*.jsonl` prints 0. Met: every run turned in an arena under `$TMPDIR/skilled-behaviour-arenas`, which the `locator.projectDir` of all 786 lines of `$X/runs-*.jsonl` names, so no run touched the worktree. The porcelain list outside this folder holds only `../review/` and `../goal.md`, written by the parallel review job and the coordinator. The jq in this cell prints 786, because it compares the `changedPaths` array with the `restored` boolean. `jq -s '[.[] \| select(.restored != true)] \| length'` over the same logs prints 0. Before phase 013 the restore wrote `restored: true` over staged new files, which left three arenas dirty (`../goal.md:140`). | Met | - |
| AC-007 | REQ-007 | Given the post-change and started-command sessions, When `COMMAND:` lines are counted, Then no command has more than one per session, and `agents-md-check.cjs` reports `OK` | `jq -c 'map_values([.post.repeatedCommandLines, .g2.repeatedCommandLines])' $X/summary.json` prints 0s, and `node .skilled/commands/doctor/scripts/agents-md-check.cjs --json \| jq -r .status` prints `OK`. Waived: the jq printed 0s except `"opencode":[0,1]`, and the final arm reads devin 1 in `$X/summary-final.json` line 1. The check printed `OK`. | Waived | ADR-007 |
| AC-008 | REQ-008 | Given the lead-phrase check, When the deriver runs on the repository and on the two fixtures, Then the repository is `fresh`, the read-only fixture fails, the ask-route fixture passes and the doctor slice is green | `node $D --check` and, in `$ADV`, `npx vitest run tests/command-policy-derivation.vitest.ts tests/doctor-routing-slice.vitest.ts` reports 0 failed. Met: `node $D --check` printed `"status": "fresh"` with `"changed": []` and exit 0. `tests/command-policy-derivation.vitest.ts` printed `Tests 9 passed (9)` and `tests/doctor-routing-slice.vitest.ts` printed `Tests 2 passed (2)`, each with exit 0. The word check sits at `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:749` and the read-only fixture at `.skilled/skills/system-skill-advisor/runtime/tests/command-policy-derivation.vitest.ts:178`. | Met | - |
| AC-009 | REQ-009 | Given two copies outside the repository that differ only in the name of `skill.md`, When Claude Code lists its Skill tool in each, Then the record states which copy lists `create:readme` | `$X/g5/listing-a.txt`, `$X/g5/listing-b.txt` and the result line in `implementation-summary.md`. Met: `scratch/g5/listing-a.txt:1` reads `create` and the file holds no `create:readme`. `scratch/g5/listing-b.txt:2` reads `create:readme`. `scratch/g5/result.txt:2` and the two lines after it give each copy's files and the cause, and `implementation-summary.md:172` carries the result line (ADR-009). | Met | - |
| AC-010 | REQ-010 | Given the change, When the floors and the suite run, Then the scorer floor prints `[159,50,20,5]`, the command baseline metrics equal the T001 numbers and `npm test` in `$ADV` reports 0 failed | The `P` and `M` outputs from `tasks.md` and the suite summary. Superseded: `scorer-eval-baseline.json` reads `[160,50,21,5]` and plain tune combined reads 28 of 45 against T001's 9 of 45. `../018-holdout-row-retirement/scratch/after.txt` line 8 reads holdout 50 of 65 and lines 23 and 24 read 184 files, 1796 passed. `../017-review-pass-two-remediation/scratch/after.txt` lines 6, 7 and 11 read typed 24 of 44, false offers 0 of 35 and `[160,50,21,5]`. | Superseded | ADR-008 |

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

AC-001, AC-002, AC-003, AC-006, AC-008 and AC-009 are `Met` on checks rerun on 2026-11-13 or on the scratch files they cite. AC-004, AC-005 and AC-007 are `Waived` by ADR-005, ADR-006 and ADR-007, because the misses they record are write discipline or Gate 2 wording that a brief cannot fix and the operator kept outside this packet. AC-010 is `Superseded` by ADR-008, because later phases raised the floor with their own committed scripts.
<!-- /ANCHOR:closure -->
