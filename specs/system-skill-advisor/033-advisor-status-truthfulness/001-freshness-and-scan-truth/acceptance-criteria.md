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
**Status:** Complete
**Date:** 2026-10-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a worktree whose index hashes differ from disk, When `advisor_status` runs, Then it does not answer `freshness: live` without naming the index disagreement it read from the stored content hashes | `node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json --warm-only` compared with `node .skilled/bin/skill-advisor.cjs skill_graph_status --format json --warm-only`; `npm test -- tests/handlers/advisor-status.vitest.ts`. Met: live pair after rebuild shows `indexStaleness` fresh 14/14 on both surfaces (`scratch/verification.md`); stale case pinned (freshness `stale`, `changedSourceFiles: 1`) in `tests/handlers/advisor-status.vitest.ts`, 16/16 pass | Met | - |
| AC-002 | REQ-002 | Given the audited checkout with six nested metadata fixtures, When `advisor_status` runs, Then `skillCount` equals the 14 depth-1 skill roots and equals `skill_graph_status.totalSkills` | `node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json --warm-only` and `node .skilled/bin/skill-advisor.cjs skill_graph_status --format json --warm-only`; the counting test in `tests/handlers/advisor-status.vitest.ts`. Met: live `skillCount: 14` equals `skill_graph_status.totalSkills: 14`; nested-fixture test (two roots plus one nested gives 2) passes | Met | - |
| AC-003 | REQ-003 | Given the compiled `skill-graph.json` is older than the newest on-disk `derived` source stamp, When the panel runs, Then it prints a stale-compiled line naming both timestamps | `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs`; `node .skilled/commands/doctor/scripts/tests/skill-graph-freshness.test.cjs`. Met: live panel prints `STALE COMPILED: skill-graph.json generated_at 2026-09-29T07:49:34.068437+00:00 is older than the newest source stamp 2026-09-29T09:00:00Z (cli-classifier)`; panel test case b passes | Met | - |
| AC-004 | REQ-004 | Given no SQLite artifact is reachable, When the panel runs, Then it prints a degraded marker naming the absent artifact and the reduced comparison and still exits 0 | `mkdir -p /tmp/advisor-db-absent-probe && SYSTEM_SKILL_ADVISOR_DB_DIR=/tmp/advisor-db-absent-probe node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs`; exit status read directly; `node .skilled/commands/doctor/scripts/tests/skill-graph-freshness.test.cjs`. Met: empty-dir run prints `DEGRADED: SQLite skill-graph.sqlite absent at /tmp/advisor-db-absent-probe/skill-graph.sqlite; ZOMBIE, MISSING and FAMILY MISMATCH SQLite vs disk were not checked ...`, exit 0; panel test case c passes | Met | - |
| AC-005 | REQ-005 | Given a family name equal to one of its skill ids, When the panel prints family comparisons, Then the output distinguishes the family label from the id, and the `z_archive` wording matches the depth-1 scan rule the code applies | `node .skilled/commands/doctor/scripts/tests/skill-graph-freshness.test.cjs`; `rg -n "z_archive" .skilled/commands/doctor/scripts/skill-graph-freshness.cjs` and `rg -n "FAMILY" .skilled/commands/doctor/scripts/skill-graph-freshness.cjs`. Met: panel prints `skill alpha (family disk=other compiled=alpha)` (test case d); `rg -n "z_archive"` no match; scan rule line printed | Met | - |
| AC-006 | REQ-006 | Given a metadata tree larger than the scan cap, When `advisor_status` runs with `maxMetadataFiles`, Then it reports truncation and the bounded count, and the touched status and freshness docs describe the semantics the code implements | `npm test -- tests/handlers/advisor-status.vitest.ts` (cap and truncation cases); `rg -n "skillCount" .skilled/skills/system-skill-advisor/feature-catalog`. Met: cap test (`maxMetadataFiles: 1`, two roots) reports count 1 and the truncation error; `rg -n "skillCount"` in feature-catalog shows the root-only semantics in `cli-surface/advisor-status.md` | Met | - |

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

All six criteria are Met with the evidence named in each row; no waiver was needed.
<!-- /ANCHOR:closure -->
