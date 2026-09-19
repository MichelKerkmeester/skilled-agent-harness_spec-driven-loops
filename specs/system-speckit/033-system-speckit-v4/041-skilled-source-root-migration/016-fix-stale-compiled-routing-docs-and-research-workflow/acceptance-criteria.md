---
title: "Acceptance Criteria: Phase 16: fix-stale-compiled-routing-docs-and-research-workflow"
description: "The criteria this phase must satisfy before it may close, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "stale compiled routing text acceptance"
  - "phase 16 closure gate"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/016-fix-stale-compiled-routing-docs-and-research-workflow"
    last_updated_at: "2026-09-19T05:09:41Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Met every criterion"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 16: fix-stale-compiled-routing-docs-and-research-workflow

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 041-skilled-source-root-migration/016-fix-stale-compiled-routing-docs-and-research-workflow
**Level:** 2
**Status:** Complete
**Date:** 2026-09-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the changes, When the compiled-routing tests, the guard and both gates run, Then all pass as before | `npx vitest run --config vitest.config.bin.ts`: 2 files, 46 pass. `compiled-route-guard.cjs`: all five hubs fresh. Node gate: 89 files, 1,007 pass, 0 fail, the same as before the phase. Standalone deep-loop suite: 154 files, 2,684 pass, 8 skipped, 0 fail, and the tracked council database unchanged | Met | - |
| AC-002 | REQ-002 | Given the live tree, When it is searched for a seven-hub cohort or a renamed compiled-routing directory, Then only history remains | The search in `plan.md` finds one hit, `compiled-routing-architecture.md:116`, which describes the cohort at cutover on purpose, and one unrelated "seven-field" receipt | Met | - |
| AC-003 | REQ-003 | Given the two resolver copies, When they are compared, Then they are byte-identical | `cmp` of `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` and its authored source reports no difference; before this phase they differed at line 29 | Met | - |
| AC-004 | REQ-004 | Given the research workflows' rule lists, When each is passed to the validator, Then it runs | The old list stops with `SPECKIT_RULES names 1 rule(s) that do not exist: TEMPLATE_HEADERS`. The new list, now in all four places, reports `RESULT: PASSED` on this folder | Met | - |
| AC-005 | REQ-005 | Given the edited workflows, When the contract drift check runs, Then every deep command contract is current | `check-contract-drift.cjs` reported `STALE_SOURCE_DIGEST` for `deep/research` after the edit; after recompiling, all three deep commands report OK | Met | - |

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

Every criterion is met.
<!-- /ANCHOR:closure -->
