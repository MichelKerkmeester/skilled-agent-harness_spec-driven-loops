---
title: "Changelog: Absorb 028/006 Review-Remediation Closeout [016/013-absorb-028-004-review-remediation-closeout]"
description: "Closed the 016 program's books by pointing the absorbed trackers at their owning phases, reconstructing the 91-item P2 map and rolling up the 028/006 and 028 parents to the accurate absorbed and complete state."
trigger_phrases:
  - "review remediation closeout changelog"
  - "91 item p2 reconstruction"
  - "016 program rollup"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/system-speckit/004-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/013-absorb-028-004-review-remediation-closeout/` (Level 2)
> Parent packet: `.opencode/specs/system-speckit/004-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/`

### Summary

This phase writes no code. It closes the 016 program's books so packet 028's status surfaces are accurate. Three trackers that advertised a pre-absorption state now point at the phases that own their items. The 028/006/002 schema-and-concurrency tracker rows are marked verify-first-then-close because the plan review confirmed all three items were already correct in live code, so they route to phases 008 and 009 for verification and a test, not a re-fix. The ex-031 Group-A rows are reconciled to their 014 resolution and their shared root cause was hardened in phase 007. The frozen 91-item P2 source is unrecoverable, so the map was reconstructed from the 004-p2-triage G1-G15 lens grouping, which sums to about 86, with the roughly 5-item delta being the review's own stated approximation. Three scaffolding tooling bugs were recorded with repro and routed. Both the 028/006 and 028 parents were rolled up to the accurate absorbed and complete state. Shipped in `64242b5e58` and `6e9132a6ec`.

### Added

- A record of three scaffolding tooling bugs named TOOL-1, TOOL-2 and TOOL-3, each with a script-line anchor and a reproducing command, routed to a follow-on owner.

### Changed

- The 028/006/002 tracker rows T005 through T011 are absorbed as verify-first-then-close, P1-2 and P1-4 to phase 008 and P1-5 to phase 009.
- The ex-031 Group-A rows T-0211, T-0212 and REQ-214 are reconciled to their 014 resolution with a Group-A root-cause note pointing at phase 007.
- The 91-item P2 map was reconstructed from the G1-G15 lens grouping with a 016 disposition per family, reconciled to about 86.
- The finding-level no-silent-drops table pre-enumerates the 13 findings the section-level sweep let slip. The six assigned to phases 008, 009 and 012 are confirmed shipped.
- Both the 028/006 and 028 parents were rolled up from pending or planned to absorbed or complete.

### Verification

- T017 grep audit returned zero hits for the scaffold-only and queued markers. Every absorbed row carries a disposition.
- 91-item P2 reconstruction G1-G15 to a 016 disposition, about 86 reconciled versus 91 with no fabrication.
- Finding-level no-silent-drops table 13 pre-enumerated. The 008, 009 and 012 ones are confirmed shipped.
- Parent rollups pending or planned to absorbed or complete.
- Recursive `validate.sh --strict` across the program at closeout.

### Files Changed

- The 028/006/002 and 028/006/004 tracker docs carry the absorbed pointers and the reconstructed P2 map.
- The 014 findings-remediation tracker carries the ex-031 reconciliation.
- The 016 and 028 `spec.md` parents carry the rollups.

### Follow-Ups

- The P2 reconstruction is lens-level, not per-item, because the frozen per-item source is unrecoverable.
- The three tooling bugs are routed, not fixed, for a follow-on scripts-tooling packet.
- The memory-index of this closeout is a daemon-side follow-up.
