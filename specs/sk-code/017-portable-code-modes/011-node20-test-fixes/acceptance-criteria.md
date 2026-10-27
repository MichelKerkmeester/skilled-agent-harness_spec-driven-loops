---
title: "Acceptance Criteria: Node 20 test fixes for the advisor plugin suite and the parallel node check helper"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "node20 test fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/011-node20-test-fixes"
    last_updated_at: "2026-10-27T21:30:00Z"
    last_updated_by: "implementer"
    recent_action: "Met every criterion with observed test runs on three Node versions"
    next_safe_action: "Conductor merges the child into the parent phase table and commits"
    blockers: []
    key_files:
      - ".opencode/plugins/tests/system-skill-advisor.test.cjs"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/lib/parallel-node-check.cjs"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/tests/parallel-node-check.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "node20-test-fixes-implementer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Node 20 test fixes for the advisor plugin suite and the parallel node check helper

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `011-node20-test-fixes`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given Node 20.19.5, 22.23.1 or 26.8.2, When `node --test .opencode/plugins/tests/system-skill-advisor.test.cjs` runs three times, Then every run prints `fail 0` and exits 0 | Before: Node 20 `TypeError: registerHooks is not a function`, `pass 0 fail 1`, exit 1 on three runs. After: `pass 42 fail 0`, exit 0 on all nine runs. Fix: `.opencode/plugins/tests/system-skill-advisor.test.cjs:70` | Met | - |
| AC-002 | REQ-002 | Given the same three Node versions, When `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/parallel-node-check.test.cjs` runs three times, Then every run prints `fail 0` and exits 0 | Before: Node 20 `the direct check reported no message`, `pass 2 fail 1`, exit 1 on three runs. After: `pass 3 fail 0`, exit 0 on all nine runs. Fix: `.skilled/skills/sk-code/sk-code-quality/scripts/lib/parallel-node-check.cjs:76` | Met | - |
| AC-003 | REQ-003 | Given the test with its file-based reference and a 100,000-character line, When it runs on Node 20, 22 and 26 against the unchanged helper, Then case 2 fails on each, and against the changed helper it passes on each | Unchanged helper copied from `HEAD`: `Cannot read properties of null (reading '1')`, `pass 2 fail 1`, exit 1 on all three. Changed helper: `pass 3 fail 0`, exit 0 on all three. Reference read: `.skilled/skills/sk-code/sk-code-quality/scripts/tests/parallel-node-check.test.cjs:132` | Met | - |
| AC-004 | REQ-004 | Given the default Node 26.8.2, When the full sk-code-quality script suite and the full plugin suite run, Then both pass | `pass 123 fail 0` exit 0 and `pass 553 fail 0` exit 0; Node 20 sk-code-quality suite `pass 123 fail 0` exit 0. Read-back: `.skilled/skills/sk-code/sk-code-quality/scripts/lib/parallel-node-check.cjs:174` | Met | - |
| AC-005 | REQ-005 | Given the two owning skills, When their changelog entries are validated, Then each reports 0 issues and its `SKILL.md` version matches | `validate_document.py --json` `"total_issues": 0` for `v1.13.2.0.md` and `v0.17.10.0.md`; `.skilled/skills/sk-code/sk-code-quality/SKILL.md:5` and `.skilled/skills/system-skill-advisor/SKILL.md:5` | Met | - |
| AC-006 | REQ-006 | Given macOS, When `npx vitest run tests/daemon-watcher-new-root-ingestion.vitest.ts` runs five times from the advisor runtime, Then every run passes | `Tests 5 passed (5)`, exit 0 on all five runs. Fix: `.skilled/skills/system-skill-advisor/runtime/tests/daemon-watcher-new-root-ingestion.vitest.ts:243` | Met | - |

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

Every criterion is met with observed runs on all three Node versions.
<!-- /ANCHOR:closure -->
