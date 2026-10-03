---
title: "Acceptance Criteria: Phase 1: freshness-and-scan-truth"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/001-freshness-and-scan-truth"
    last_updated_at: "2026-10-03T05:27:36Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-freshness-and-scan-truth"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: freshness-and-scan-truth

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skill-advisor/033-advisor-status-truthfulness/001-freshness-and-scan-truth
**Level:** 3
**Status:** Draft
**Date:** 2026-10-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a worktree whose index hashes differ from disk, When `advisor_status` runs, Then it does not answer `freshness: live` without naming the index disagreement it read from the stored content hashes | `node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json --warm-only` compared with `node .skilled/bin/skill-advisor.cjs skill_graph_status --format json --warm-only`; `npm test -- tests/handlers/advisor-status.vitest.ts` | Unmet | - |
| AC-002 | REQ-002 | Given the audited checkout with six nested metadata fixtures, When `advisor_status` runs, Then `skillCount` equals the 14 depth-1 skill roots and equals `skill_graph_status.totalSkills` | `node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json --warm-only` and `node .skilled/bin/skill-advisor.cjs skill_graph_status --format json --warm-only`; the counting test in `tests/handlers/advisor-status.vitest.ts` | Unmet | - |
| AC-003 | REQ-003 | Given the compiled `skill-graph.json` is older than the newest on-disk `derived` source stamp, When the panel runs, Then it prints a stale-compiled line naming both timestamps | `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs`; `node .skilled/commands/doctor/scripts/tests/skill-graph-freshness.test.cjs` | Unmet | - |
| AC-004 | REQ-004 | Given no SQLite artifact is reachable, When the panel runs, Then it prints a degraded marker naming the absent artifact and the reduced comparison and still exits 0 | `mkdir -p /tmp/advisor-db-absent-probe && SYSTEM_SKILL_ADVISOR_DB_DIR=/tmp/advisor-db-absent-probe node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs`; exit status read directly; `node .skilled/commands/doctor/scripts/tests/skill-graph-freshness.test.cjs` | Unmet | - |
| AC-005 | REQ-005 | Given a family name equal to one of its skill ids, When the panel prints family comparisons, Then the output distinguishes the family label from the id, and the `z_archive` wording matches the depth-1 scan rule the code applies | `node .skilled/commands/doctor/scripts/tests/skill-graph-freshness.test.cjs`; `rg -n "z_archive|FAMILY" .skilled/commands/doctor/scripts/skill-graph-freshness.cjs` | Unmet | - |
| AC-006 | REQ-006 | Given a metadata tree larger than the scan cap, When `advisor_status` runs with `maxMetadataFiles`, Then it reports truncation and the bounded count, and the touched status and freshness docs describe the semantics the code implements | `npm test -- tests/handlers/advisor-status.vitest.ts` (cap and truncation cases); `rg -n "skillCount" .skilled/skills/system-skill-advisor/feature-catalog` | Unmet | - |

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

Pending. Every criterion is `Unmet` until the handler and panel changes land and the live pair, the panel runs and the test suites are observed; a row may close only with the evidence named in its Verification cell, or with an ADR-backed waiver.
<!-- /ANCHOR:closure -->
