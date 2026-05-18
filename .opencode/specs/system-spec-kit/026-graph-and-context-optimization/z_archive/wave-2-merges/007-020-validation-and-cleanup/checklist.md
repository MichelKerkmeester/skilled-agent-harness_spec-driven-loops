---
title: "Checklist: Validation + cleanup"
description: "Verification checklist for final extraction phase."
trigger_phrases:
  - "code graph validation cleanup checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/020-validation-and-cleanup"
    last_updated_at: "2026-05-14T08:43:25Z"
    last_updated_by: "codex"
    recent_action: "Checklist completed with evidence"
    next_safe_action: "Commit + ship"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Validation + cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [x] CHK-200 [P0] Strict validate this packet. (exit 0)
- [x] CHK-201 [P0] Recursive validate parent 014. (exit 0)
- [x] CHK-202 [P0] Full code-graph Vitest passes. (exit 0)
- [x] CHK-203 [P0] Typecheck passes. (exit 0)
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-210 [P0] 005 predecessor complete. (read 005 implementation summary)
- [x] CHK-211 [P0] Old DB retained until validation pass. (deleted after typecheck + Vitest + gold verifier)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] No code-graph algorithms changed. (only package/test/config/allowlist fallout)
- [x] CHK-011 [P0] Public tool IDs unchanged. (no schema/tool namespace edits)
- [x] CHK-012 [P1] Test fixtures mirror readiness metadata written by real scans. (scope + candidate manifest)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] system-spec-kit typecheck exit 0.
- [x] CHK-021 [P0] system-code-graph typecheck exit 0.
- [x] CHK-022 [P0] system-code-graph full Vitest exit 0.
- [x] CHK-023 [P1] system-spec-kit handler smoke exit 0.
- [x] CHK-024 [P0] gold-query verifier exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-FIX-001 [P0] Old DB deletion gated by matching counts. (`59816 == 59816`)
- [x] CHK-FIX-002 [P0] Active stale refs count is 0.
- [x] CHK-FIX-003 [P1] Parent 014 child list includes 006.
- [x] CHK-FIX-004 [P1] Parent 007 phase map marks 014 complete.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-220 [P0] No network-dependent install performed. (offline local compiler used for system-code-graph)
- [x] CHK-221 [P0] DB deletion constrained to the old code-graph DB fallback only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] 006 spec/plan/tasks/checklist/summary written.
- [x] CHK-041 [P1] 014 parent continuity updated.
- [x] CHK-042 [P1] 007 phase map updated.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-230 [P0] 006 contains the required 7 files.
- [x] CHK-231 [P0] description and graph metadata use 2-space JSON.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status |
|------|--------|
| Typecheck | PASS |
| Full Vitest | PASS |
| Gold verifier | PASS |
| DB parity/delete | PASS |
| Stale refs | PASS |
| Strict validation | PASS |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification
- [x] CHK-110 [P1] Full code-graph Vitest completed locally in under 2 seconds wall output duration.
<!-- /ANCHOR:perf-verify -->
