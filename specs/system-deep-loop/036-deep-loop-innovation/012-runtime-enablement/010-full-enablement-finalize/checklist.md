---
title: "QA Checklist: Full Enablement and Finalize"
description: "Evidence-backed acceptance checks for the finalize transition, the widened gate authority-state, the real reader-contract check, and the literal PASS verdict."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/010-full-enablement-finalize"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# QA Checklist: Full Enablement and Finalize

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/010-full-enablement-finalize |
| **Level** | 2 |
| **Status** | Planned |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:checklist -->
## 2. ACCEPTANCE CHECKS

| ID | Check | Maps to | Evidence | Status |
|----|-------|---------|----------|--------|
| CHK-001 | Finalize CAS lands a mode at `new_authoritative_final` epoch N+1, writer `dark` | REQ-001, SC-001 | | [ ] |
| CHK-002 | Finalize record honestly states window-free operator bypass; no fabricated window/drill/execution evidence | REQ-002 | | [ ] |
| CHK-003 | Flip runner fails when the on-disk record did not land at final | REQ-003 | | [ ] |
| CHK-004 | Selector routes each final mode to `dark` with no shadow route | REQ-004 | | [ ] |
| CHK-005 | Gate authority-state passes on eight stored final records; fails on the absent-record default | REQ-005, SC-005 | | [ ] |
| CHK-006 | Reader-contract check runs a real per-mode read: fold → materialize → consumer → clean read | REQ-006, SC-002 | | [ ] |
| CHK-007 | Reader-contract negative control: red-when-disabled, green-when-restored, both counts recorded | REQ-007, SC-003 | | [ ] |
| CHK-008 | Finalize CAS negative control: wrong epoch denied, record byte-identical after | REQ-008, SC-004 | | [ ] |
| CHK-009 | `verify-authority.cjs` shows eight modes on final from stored records | SC-001 | | [ ] |
| CHK-010 | Full suite candidate failed-count ≤ baseline | SC-005 | | [ ] |
| CHK-011 | Whole-system gate verdict PASS, zero not-run; tree unchanged by the run | SC-002, SC-006 | | [ ] |
<!-- /ANCHOR:checklist -->
