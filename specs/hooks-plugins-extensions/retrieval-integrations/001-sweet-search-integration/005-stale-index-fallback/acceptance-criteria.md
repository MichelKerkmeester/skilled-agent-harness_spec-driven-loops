---
title: "Acceptance Criteria: Phase 5: zero-hit fallback to unindexed spec docs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "stale index fallback acceptance"
  - "zero hit fallback criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/005-stale-index-fallback"
    last_updated_at: "2026-11-09T17:02:03Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-stale-index-fallback"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Phase 5: zero-hit fallback to unindexed spec docs

<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/005-stale-index-fallback
**Level:** 2
**Status:** Draft
**Date:** 2026-11-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a new packet the index does not list that declares `trigger_phrases`, When the lookup runs one of its phrases, Then it exits 0 with `staleFallback.matches: 1` | `npx vitest run stale-fallback.vitest.ts` exits 0 | Met | - |
| AC-002 | REQ-002 | Given a prompt the index already matches, When the lookup runs, Then its JSON has no `staleFallback` key and matches the before run | Existing `npx vitest run trigger-index.vitest.ts` blocks pass unchanged | Met | - |
| AC-003 | REQ-003 | Given an explicit `--index` or `--no-stale-fallback`, When a zero-hit prompt runs, Then the lookup exits 1 with no `staleFallback` field | Tests 8 and 9 of the matrix | Met | - |
| AC-004 | REQ-004 | Given untracked, staged and committed unindexed docs, an excluded folder, a non-spec-doc name and a non-git folder, When the matrix runs, Then each case gives the designed result and none exits 2 | The matching rows of `stale-fallback.vitest.ts` | Met | - |
| AC-005 | REQ-001 | Given the real repo before an index rebuild, When `lookup-trigger-index.mjs --scoring-only -- "retrieval feature design research"` runs, Then it exits 0 and lists `003-retrieval-feature-design-research/spec.md` | Command output and exit status in `benchmark/results.md` | Met | - |
| AC-006 | REQ-002 | Given `runtime/cli/retrieval/fixtures/prompt-set.json`, When the cold-lookup p95 is measured, Then it is at or under 200 ms | Benchmark p95 row | Met | - |
| AC-007 | REQ-005 | Given the phase is built, When `validate_catalog_package.py` and `validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook` run, Then both exit 0 and scenario 490 has a row in section 7.8 | Both commands' output and exit status, pasted in `implementation-summary.md` | Met | - |
| AC-008 | REQ-006 | Given the uncommitted phase change, When `/local-skilled-alignment --recheck=<run folder>` runs, Then `recheck.md` shows 0 open P0 and P1 findings | `alignment/recheck.md` in this folder | Met | - |
| AC-009 | REQ-007 | Given `benchmark/before.json` and `benchmark/after.json`, When both are compared, Then their index sha256 values match and every metric row in `benchmark/results.md` has a measured value that meets its target | `benchmark/results.md` | Met | - |

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

Every criterion is met with observed evidence, recorded in `implementation-summary.md`, `benchmark/results.md` and `alignment/recheck.md`.
<!-- /ANCHOR:closure -->
