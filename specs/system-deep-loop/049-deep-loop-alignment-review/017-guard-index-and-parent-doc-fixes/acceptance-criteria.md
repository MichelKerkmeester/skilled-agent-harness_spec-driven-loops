---
title: "Acceptance Criteria: Phase 17: guard-index-and-parent-doc-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "guard index fixes acceptance"
  - "lineage exclusion closure gate"
  - "drift guard acceptance criteria"
  - "parent documents acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/049-deep-loop-alignment-review/017-guard-index-and-parent-doc-fixes"
    last_updated_at: "2026-09-16T20:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Marked every criterion with observed evidence"
    next_safe_action: "Commit when the operator asks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-017-guard-index-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 17: guard-index-and-parent-doc-fixes

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/049-deep-loop-alignment-review/017-guard-index-and-parent-doc-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-09-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a `SKILL.md` carrying the generated-copy marker and a dead route, When the dead-route check runs, Then nothing is reported | `.opencode/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_alignment_drift.py:247` failed before the skip at `verify_alignment_drift.py:691` and passes after | Met | - |
| AC-002 | REQ-001 | Given this tree, When `run-all-drift-guards.sh` runs, Then it exits 0 and no authored file is exempted | Exit 0 with both guards PASS; the one authored finding was fixed at `.hermes/plugins/repo-guards/__init__.py:1` rather than excluded | Met | - |
| AC-003 | REQ-002 | Given a `lineages` directory under `specs/` with any parent, When the corpus walker meets it, Then it is pruned | `.opencode/skills/system-spec-kit/runtime/cli/tests/retrieval-coverage-parity.vitest.ts:160` failed before the rule at `retrieval/lib/corpus.mjs:138` and passes after | Met | - |
| AC-004 | REQ-002 | Given the regenerated trigger index, When its paths are read, Then none is a lineage path under `specs/` and every untracked path belongs to this phase or phase 016 | 15,266 paths, 0 lineage paths, 10 untracked all in `016-` and `017-`; 30 removals are 26 pruned lineages and 4 deleted files, recorded at `implementation-summary.md:109` | Met | - |
| AC-005 | REQ-003 | Given the corpus rule, When its manifest text, the parity table and the conventions document are read, Then all describe the same policy | `retrieval/lib/corpus.mjs:46`, the divergence entry in `retrieval-coverage-parity.vitest.ts`, and `references/retrieval/retrieval-conventions.md:296` | Met | - |
| AC-006 | REQ-004 | Given the parent spec and goal, When validated strictly, Then no template placeholder remains and the goal's durable slice is within its warning budget with every decision and criterion intact | `specs/system-deep-loop/049-deep-loop-alignment-review/spec.md:133` shows a filled handoff row; the goal slice is 2,985 characters with D1 to D4, the binding at `goal.md:67` and six criteria kept | Met | - |
| AC-007 | REQ-005 | Given every suite touched by the three fixes, When run after them, Then nothing fails | Verifier 19 passed, Hermes plugin 42 passed, retrieval and trigger suites 199 passed with 1 skipped, recorded at `implementation-summary.md:108` | Met | - |

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

The two regression tests, the drift-guard wrapper and the audited regeneration carried the packet. The goal template's budget, the nesting containment snapshots and the stale three-guard description were found here and deliberately left for their owners.
<!-- /ANCHOR:closure -->
