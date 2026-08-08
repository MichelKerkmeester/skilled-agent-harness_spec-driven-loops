---
title: "Checklist: State records a deep loop can trust"
description: "Verification evidence for authoritative timestamping and evidence-based completion."
trigger_phrases:
  - "deep loop state record checklist"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/050-trustworthy-state-records"
    last_updated_at: "2026-07-27T16:10:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Landed both fixes with covering tests"
    next_safe_action: "Watch the next real fan-out for a quiet timestamp_anomaly channel"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Checklist: State Records A Deep Loop Can Trust

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item names the command and the number that settled it. Claims without a number are not evidence.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Blast radius measured before changing anything. Evidence: `145` `{ISO_8601_NOW}` placeholders across `12` deep-command files.
- [x] CHK-002 [P0] Affected suites baselined. Evidence: `7 passed (7)` across the timestamp-window and observability files.
- [x] CHK-003 [P1] The single append path confirmed rather than assumed. Evidence: the command templates pipe every record through `append-state-record.cjs`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] Both changed scripts pass `node --check`. Evidence: `syntax OK` for each.
- [x] CHK-005 [P1] No spec path, packet number or requirement id appears in any code comment. Evidence: `rg` over both changed scripts returns `0` matches.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-006 [P0] New coverage passes. Evidence: `Tests 7 passed (7)`.
- [x] CHK-007 [P0] No regression in the adjacent suites. Evidence: `Tests 7 passed (7)`, unchanged from baseline.
- [x] CHK-008 [P0] A fabricated future timestamp is replaced. Evidence: a record submitted at `2099-01-01T00:00:00.000Z` stored the append time instead.
- [x] CHK-009 [P0] The producer claim survives. Evidence: `reportedTimestamp` retains `2026-07-27T23:55:00.000Z`.
- [x] CHK-010 [P1] A record with no timestamp gains no claim field. Evidence: `config` record has `timestamp` and no `reportedTimestamp`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-011 [P0] All three synthesis names seen in real runs are recognised. Evidence: `synthesis_complete`, `phase_synthesis_complete` and `synthesis` all present in the matcher.
- [x] CHK-012 [P0] An explicit incomplete report is still a violation. Evidence: `synthesis_incomplete` is absent from the recognised set, asserted by test.
- [x] CHK-013 [P0] The fallback can reach the artifacts. Evidence: `lineageDir` is threaded through the call site rather than read from the lineage config, which does not carry it.
- [x] CHK-014 [P1] Unrelated fields round-trip unchanged. Evidence: `totalIterations`, `stopReason` and `event` survive a record append.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-015 [P1] No credential or transcript content is introduced. Evidence: the appender writes `1` added field, `timestamp`, plus `reportedTimestamp` when a claim differs.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-016 [P1] The deferred template cleanup is recorded rather than silently skipped. Evidence: `spec.md` out-of-scope names the 145 now-inert placeholders.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-017 [P1] Change confined to two runtime scripts and one test file.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Both defects are closed at their choke points, covered by tests built from the literal strings that
failed in real runs. The one open question is recorded in the spec: whether the anomaly detector should
be repointed at the preserved claim so it reports fabrication rather than going quiet.
<!-- /ANCHOR:summary -->
