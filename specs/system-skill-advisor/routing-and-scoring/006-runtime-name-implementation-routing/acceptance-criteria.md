---
title: "Acceptance Criteria: Route implementation prompts that name a runtime surface to the code skill, not the CLI executor"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "runtime name implementation routing acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/034-runtime-name-implementation-routing"
    last_updated_at: "2026-11-08T16:20:14Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "37344d65-539c-401d-8341-c9b769fd34a7"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Route implementation prompts that name a runtime surface to the code skill, not the CLI executor

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `034-runtime-name-implementation-routing`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the eleven alignment probes, When `run-probes.cjs` scores them, Then none has a CLI executor as its top-1 | `run-probes.cjs` after the change: P02 `sk-code`, P04 `system-spec-kit`, P05 `sk-doc`, P09 `sk-code/sk-code-skilled`; before it, P02, P04, P05 and P09 named `cli-claude-code`, `cli-deepseek-harness`, `cli-pi` and `cli-devin` | Met | - |
| AC-002 | REQ-002 | Given "use codex to fix the Claude Code Stop hook", When both engines score it, Then the top-1 is the CLI hub with `cli-codex` resolved | `runtime-surface-beside-codex-handoff` fixture case passes on TypeScript and Python; the resolver test returns `cli-codex` | Met | - |
| AC-003 | REQ-003 | Given the same corpus, When `advisor_validate` runs after the change, Then full corpus, holdout and UNKNOWN match or beat 158/195, 30/40 and 13 | `advisor_validate` before and after: 158/195, 30/40, UNKNOWN 13, the same four pre-existing parity regressions | Met | - |
| AC-004 | REQ-004 | Given the probes that missed after the mask, When the approved `sk-code` vocabulary lands, Then each remaining miss has a recorded cause | `run-probes.cjs` pass 8; `implementation-summary.md` Known Limitations item 1 names P07, P09 and P11 with reasons; validate still 158/195 and 30/40 | Met | - |
| AC-005 | REQ-005 | Given the advisor vitest suite, When it runs after the change, Then no test fails that passed before | Before: 1 failed test, 2 failed files. After: 0 failed tests and 0 failed files, once the observation-sink import followed the hooks track rename. Python regression 78/84 before and after | Met | - |
| AC-006 | REQ-005 | Given a fresh Level 2 scaffold, When `create.sh` writes `acceptance-criteria.md`, Then its session id is a real scaffold id, not a placeholder | A throwaway scaffold wrote `session_id: "scaffold-999-scaffold-probe"`; spec-kit template and scaffold tests 201/201 | Met | - |

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

Every criterion is met with the evidence named in its row.
<!-- /ANCHOR:closure -->
