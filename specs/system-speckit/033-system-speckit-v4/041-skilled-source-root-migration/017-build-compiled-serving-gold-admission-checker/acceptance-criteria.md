---
title: "Acceptance Criteria: Phase 17: build-compiled-serving-gold-admission-checker"
description: "The criteria the admission checker build must satisfy before it may close."
trigger_phrases:
  - "gold admission checker acceptance"
  - "phase 17 closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/017-build-compiled-serving-gold-admission-checker"
    last_updated_at: "2026-09-19T05:53:38Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Built the checker; the flip stays blocked"
    next_safe_action: "Decide how the flip gate and the scorer freeze are unblocked"
    blockers:
      - "The scorer freeze may be renewed only on a green routing battery, and two advisor parity tests are red"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "When should CI block: after the four baseline failures are fixed, or with an exemption list?"
    answered_questions:
      - "The five build decisions, accepted as recommended on 2026-09-19"
      - "The dead canary gate is replaced by the admission check (operator, 2026-09-19)"
      - "The scorer re-freeze waits on the advisor suite, fixed in phase 18 (operator, 2026-09-19)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 17: build-compiled-serving-gold-admission-checker

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 041-skilled-source-root-migration/017-build-compiled-serving-gold-admission-checker
**Level:** 2
**Status:** In Progress
**Date:** 2026-09-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fixture per status and sub-reason, When the scorer runs, Then each gets its expected status, and an unparseable gold value fails the run | `.skilled/bin/tests/compiled-route-admission.test.cjs:158` lists one expected status per fixture. `node --test` on the file: 29 pass, 0 fail, fifteen of them one per scenario status and sub-reason. Three mutants of the scorer (clarify as a route, must-include dropped, floors on admitted hubs) each fail the suite | Met | - |
| AC-002 | REQ-002 | Given a hub whose manifest reads legacy, When the checker runs, Then it still scores the hub and no manifest changes | `.skilled/bin/tests/compiled-route-admission.test.cjs:244` hashes the tree. The checker calls `compiledRoute()`, which never reads the serving flag or manifest. The live test hashes the promoted activation tree before and after scoring every hub and finds it unchanged | Met | - |
| AC-003 | REQ-003 | Given a hub below the floor, When the checker runs, Then it reports `insufficient-coverage` | `.skilled/bin/tests/compiled-route-admission.test.cjs:193` and the tests after it: a candidate missing a mode's gold, and one with no negative scenario, each report `insufficient-coverage`; an admitted hub with the same gaps passes and still reports them | Met | - |
| AC-004 | REQ-004 | Given the live corpus, When the tests run, Then the corpus count matches its pin and one live hub scores | `.skilled/bin/tests/compiled-route-admission.test.cjs:32` pins the count. The live tests pin 73 scenarios and score all five hubs through the real engine | Met | - |
| AC-005 | REQ-005 | Given a push, When CI runs, Then the checker runs over all five hubs | `.github/workflows/routing-registry-drift.yml:176` runs it warn-only. It ran in a clean clone under Node 22 with no installs. A CI run ID waits on the push | Unmet | - |
| AC-006 | REQ-006 | Given the baseline report, When it is read, Then every failure carries a class | `baseline/admission-report.md:32` and the rows around it, classed in `implementation-summary.md`: three engine drifts, one stale gold entry, five scenarios without a prompt | Met | - |
| AC-007 | REQ-007 | Given a sandbox copy, When the flip step runs, Then the manifest reads `compiled` and the lock and journal are clean | `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/shared/admission-gate.cjs:40` is the gate both tools now call. In a sandboxed copy with its own fresh freeze, mcp-tooling flipped to `compiled` with no lock or journal left and `admissionPassed: true` recorded, then rolled back byte-identically. sk-doc was refused for drift. The live activation hash was unchanged | Met | - |

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

Everything but AC-005 is met; it waits on a CI run of the pushed step. A live flip still needs the scorer freeze renewed, which phase 18 owns.
<!-- /ANCHOR:closure -->
