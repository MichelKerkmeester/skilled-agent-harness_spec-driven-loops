---
title: "Verification Checklist: Silent Test Discovery"
description: "Evidence for the discovery runner and pre-push gate."
trigger_phrases:
  - "silent test checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-silent-test-discovery"
    last_updated_at: "2026-07-28T08:20:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Recorded evidence"
    next_safe_action: "Operator review"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-28-speckit-032"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Silent Test Discovery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The full suite was run and timed before any design
  - **Evidence**: 37 files, 49s, 27 failures decomposed by cause
- [x] CHK-002 [P0] Failures decomposed before scoping
  - **Evidence**: vendored/archived vs dist-gap vs dialect vs genuine rot

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] The runner cannot report a false green
  - **Evidence**: empty discovery exits 2; unparseable summary exits 2; missing vitest reports SKIPPED and fails
- [x] CHK-004 [P1] Dialect partition is by import, not filename
  - **Evidence**: the two vitest files are detected by their vitest import
- [x] CHK-005 [P1] Comment hygiene holds
  - **Evidence**: durable reasoning only

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-006 [P0] node:test half green on the main tree
  - **Evidence**: 35 files, 409 pass, 0 fail
- [x] CHK-007 [P0] vitest half surfaced rather than crash-failed
  - **Evidence**: 56 pass / 9 fail reported; runner exit 1
- [x] CHK-008 [P1] Pre-push script parses
  - **Evidence**: `bash -n` clean

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-015 [P0] Every discovered file is hosted by its own dialect
  - **Evidence**: 35 under node:test, 2 under vitest, none crash-failing under the wrong harness
- [x] CHK-016 [P0] The broken suite is surfaced on every push rather than re-hidden
  - **Evidence**: report-only gate prints the failure summary to stderr on each push

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-009 [P0] The gate cannot block on pre-existing rot by default
  - **Evidence**: report-only unless the enforce flag is set
- [x] CHK-010 [P1] The gate is independently bypassable
  - **Evidence**: its own skip flag; sibling gates untouched

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-011 [P0] What the silence hid is on the record with numbers
  - **Evidence**: the broken suite (9/65) and both dialect mismatches named in the summary
- [x] CHK-012 [P1] The enforcement path is written down
  - **Evidence**: flag named in the hook comment and the open question

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-013 [P0] The runner lives in repo-wide scripts, not inside any one skill
  - **Evidence**: `.opencode/scripts/run-node-tests.mjs`
- [x] CHK-014 [P2] The failing suite was left to its owner
  - **Evidence**: no edit to completion-state; recorded as the open question

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Priority | Total | Complete | Outstanding |
|----------|-------|----------|-------------|
| P0 | 9 | 9 | 0 |
| P1 | 5 | 5 | 0 |
| P2 | 1 | 1 | 0 |

Enforcement is deliberately outstanding as a follow-up, not as an unchecked item: it is gated on
spec-kit repairing the suite this packet exposed.

<!-- /ANCHOR:summary -->
