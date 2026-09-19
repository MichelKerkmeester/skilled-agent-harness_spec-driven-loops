---
title: "Acceptance Criteria: Phase 18: restore-advisor-suite-and-renew-scorer-freeze"
description: "The criteria this phase must satisfy before it may close, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "advisor suite restore acceptance"
  - "phase 18 closure gate"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/018-restore-advisor-suite-and-renew-scorer-freeze"
    last_updated_at: "2026-09-19T06:29:02Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Met every criterion"
    next_safe_action: "None for this phase; the runtime-engine harness findings need their own decision"
    blockers: []
    key_files:
      - ".opencode/plugins/system-skill-advisor.js"
      - ".skilled/skills/system-deep-loop/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 18: restore-advisor-suite-and-renew-scorer-freeze

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 041-skilled-source-root-migration/018-restore-advisor-suite-and-renew-scorer-freeze
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
| AC-001 | REQ-001 | Given a workspace inside the checkout, and one outside, When a prompt repeats, Then the first is cached and the second never is | `.opencode/plugins/system-skill-advisor.js:339` resolves the repository root first. `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts:256` tests both cases. The plugin suite passes 41 of 41, and 9 fail against the plugin before the fix. `.opencode/plugins/tests/mcp-route-guard.test.cjs` adds the nested-project case for the log helpers, which fails before its fix too | Met | - |
| AC-002 | REQ-002 | Given the parity suites, When they run, Then all pass with no pinned count lowered | `.skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts:220` still pins 109. The six parity files pass 54 of 54. The one ledger change, `local-native-approved-divergences.json:630`, records native moving to the gold skill | Met | - |
| AC-003 | REQ-003 | Given a full advisor run, When it ends, Then no tracked file changed | `.skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/seed-skill-embeddings.ts:146` writes the cache only on request; `git status` after the full suite shows only this phase's edits | Met | - |
| AC-004 | REQ-004 | Given a green routing battery, When the freeze is renewed, Then the scorer matches its pins | `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/shared/frozen-scorer-pins.json:3` records the renewal; `frozen-scorer-contract.cjs` reports that the scorer matches | Met | - |
| AC-005 | REQ-005 | Given the changed `SKILL.md`, When the guard and drift check run, Then every manifest and contract is current | `.skilled/skills/system-deep-loop/SKILL.md:8` is the change. `compiled-route-guard.cjs` reports every hub fresh, and the contract drift check reports all three deep commands OK | Met | - |

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
