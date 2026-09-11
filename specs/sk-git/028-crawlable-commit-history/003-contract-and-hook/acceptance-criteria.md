---
title: "Acceptance Criteria: Phase 3: contract-and-hook"
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
    packet_pointer: "sk-git/028-crawlable-commit-history/003-contract-and-hook"
    last_updated_at: "2026-09-11T07:16:28Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-skgit-028"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: contract-and-hook

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-git/028-crawlable-commit-history/003-contract-and-hook
**Level:** 3
**Status:** Complete
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the hook, When a body holds only Spec and Commit-Id lines with four paths staged, Then it is blocked, and a malformed or foreign id is blocked while HEAD's own id passes | commit-msg.test.sh PASS=9 FAIL=0, run by the conductor | Met | - |
| AC-002 | REQ-002 | Given an empty history, When allocate runs twice concurrently, Then two consecutive seven-digit ordinals come back and the high-water rebuilds from history | commit-id-naming.test.sh PASS=35 FAIL=0, run by the conductor | Met | - |
| AC-003 | REQ-003 | Given the stamper, When the source is amend, cherry-pick, merge or a foreign repository, Then the id is kept, re-minted, untouched or absent respectively, and a Context-only body gets a blank line | prepare-commit-msg.test.sh PASS=43 FAIL=0, run by the conductor | Met | - |
| AC-004 | REQ-004 | Given the three new scripts, When their harnesses run, Then each exits 0 and run-all-drift-guards.sh exits 0 | three harness runs and `run-all-drift-guards: all 3 guards PASSED` | Met | - |
| AC-005 | REQ-005 | Given the four skill documents, When validated, Then validate_document.py reports VALID for each and package_skill.py --check passes | four VALID lines and `Result: PASS` at 4,964 words | Met | - |

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

AC-003 carried the packet: the stamper's 43 cases include a real commit through both hooks in a fixture with a hooks path. Left out on purpose: the live machine-wide smoke, which needs the merge because the global hooks path points at the main clone.
<!-- /ANCHOR:closure -->
