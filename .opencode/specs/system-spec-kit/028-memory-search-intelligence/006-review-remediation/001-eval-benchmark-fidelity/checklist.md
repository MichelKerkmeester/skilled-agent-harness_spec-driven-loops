---
title: "Verification Checklist: Eval Benchmark Fidelity Remediation"
description: "PENDING verification checklist for the flag-eval driver fix and criterion-4 re-run."
trigger_phrases:
  - "028 eval benchmark fidelity checklist"
  - "flag eval driver fix checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/006-review-remediation/001-eval-benchmark-fidelity"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created PENDING eval-benchmark-fidelity checklist"
    next_safe_action: "Do not mark items complete until the benchmark re-run evidence exists"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-checklist-006-001-eval-benchmark-fidelity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Eval Benchmark Fidelity Remediation

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Scope is limited to the eval driver and benchmark doc, not production routing.
- [ ] CHK-002 [P0] Prior criterion-4 run is reproduced as a baseline.
- [ ] CHK-003 [P1] Default routing and trigger call-site facts are confirmed against source.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Driver no longer hardcodes `forceAllChannels: true` for the per-flag pass.
- [ ] CHK-011 [P0] Trigger ablation genuinely removes the trigger lane.
- [ ] CHK-012 [P1] Production routing code is unchanged.
- [ ] CHK-013 [P1] Driver change is measurement-only with no runtime side effect.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Criterion-4 per-flag benchmark is re-run on the corrected driver.
- [ ] CHK-021 [P0] Embedding coverage is asserted healthy before trusting the re-run.
- [ ] CHK-022 [P1] Trigger row delta differs from baseline after the fix.
- [ ] CHK-023 [P1] Strict validation exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-060 [P0] Both P1-1 and P1-3 are addressed.
- [ ] CHK-061 [P0] The criterion-4 flip verdict is re-derived from the new deltas.
- [ ] CHK-062 [P1] `benchmark-status.md` states the re-run supersedes the prior measurement.
- [ ] CHK-063 [P1] The concurrent session's files and packet 030 remain unchanged.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets or shard paths are leaked into the benchmark doc.
- [ ] CHK-031 [P1] Re-run commands are reproducible and do not encourage unsafe execution.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and checklist remain synchronized.
- [ ] CHK-041 [P1] Parent phase map still points to this child.
- [ ] CHK-042 [P2] Benchmark re-run evidence is linked from this child when execution happens.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No temp files are committed.
- [ ] CHK-051 [P1] Benchmark output stays in the recorded evidence area.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 9 | 0/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-06-19
<!-- /ANCHOR:summary -->
