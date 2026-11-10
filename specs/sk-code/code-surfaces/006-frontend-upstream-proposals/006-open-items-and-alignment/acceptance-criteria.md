---
title: "Acceptance Criteria: Phase 6: open-items-and-alignment"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "open items and alignment acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/006-frontend-upstream-proposals/006-open-items-and-alignment"
    last_updated_at: "2026-11-03T18:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met every criterion with observed evidence"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: open-items-and-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `sk-code/code-surfaces/006-frontend-upstream-proposals/006-open-items-and-alignment`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final state, When `node --test .skilled/bin/tests/compiled-route-*.test.cjs` runs, Then it reports `fail 0` | `scratch/final-suites.txt`: 101 tests, 101 pass, 0 fail, exit 0 | Met | - |
| AC-002 | REQ-002 | Given two same-mode sk-design intents that tie, When `scoreIntents` sorts them, Then it returns both in intent-name order without throwing | `compiled-route-sk-design-tie.test.cjs` ties three intents and passes; `scratch/tie-revert-test.txt` fails 1 with the fix reverted | Met | - |
| AC-003 | REQ-003 | Given the fixes, When `/local-skilled-alignment --recheck` runs on the first run folder, Then no finding on a touched skill is open | `scratch/alignment-runs/recheck1.md` and `recheck3.md`, each still-open row a substring false positive, every needs-review row settled in `scratch/alignment-fixes.md` | Met | - |
| AC-004 | REQ-004 | Given a save without `--full-auto`, When it finishes, Then its summary says the continuity fields were not written | The plan-only vitest passes 8 of 8; `scratch/planonly-revert-test.txt` fails 1 of 8 with the fix reverted | Met | - |
| AC-005 | REQ-005 | Given `system-spec-kit/changelog/`, When the newest entry is read, Then it names the trigger-index warning and the plan-only line, and `SKILL.md` carries its version | `v2.12.31.0.md` names `--repo-root` and full-auto; `SKILL.md` reads `version: 2.12.31.0` | Met | - |
| AC-006 | REQ-006 | Given the parent `goal.md`, When `goal.cjs packet` runs, Then D6 names DeepSeek V4.1 Flash on opencode-go for builds and prints `packet_budget=ok` | `goal.cjs packet` prints D6 naming `opencode-go/deepseek-v4.1-flash` and `packet_budget=ok` | Met | - |
| AC-007 | REQ-007 | Given the last edit, When reach runs on every hub at concurrency 2, Then each prints `outranked=  0` and `wrong-hub=  0` | `scratch/reach-final.txt`: seven hubs, `outranked=0`, `wrong-hub=0`, `RESULT: PASSED` | Met | - |

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

Every criterion is met with evidence observed from the final state.
<!-- /ANCHOR:closure -->
