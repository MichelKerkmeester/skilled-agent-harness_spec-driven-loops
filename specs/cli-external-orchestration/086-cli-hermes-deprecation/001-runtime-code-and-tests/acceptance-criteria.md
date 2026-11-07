---
title: "Acceptance Criteria: Phase 1: runtime-code-and-tests"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: runtime-code-and-tests

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 001-runtime-code-and-tests
**Level:** 2
**Status:** Complete
**Date:** 2026-11-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase area, When `rg -n -i hermes` runs, Then only the justified transcript fixture matches | `implementation-summary.md:113`. `rg` output on 2026-11-07, implementation-summary.md Known Limitations | Met | - |
| AC-002 | REQ-002 | Given each touched suite, When it reruns, Then it reports no failure its baseline lacked | `implementation-summary.md:98`. Verification table in implementation-summary.md | Met | - |
| AC-003 | REQ-003 | Given a Pi delegation request, When routed, Then it still reaches `cli-pi` | `implementation-summary.md:76`. `compiled-route.cjs --hub cli-external-orchestration --prompt "delegate this review to pi"` returns `cli-pi` | Met | - |

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

Every criterion above is Met with observed evidence, so this phase may close.
<!-- /ANCHOR:closure -->
