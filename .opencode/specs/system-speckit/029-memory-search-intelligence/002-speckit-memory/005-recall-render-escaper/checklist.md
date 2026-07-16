---
title: "Checklist: Recall→Render Trust Escaper + Substrate-Kind Recall Correctness (028/001 impl phase)"
description: "Level-2 verification checklist for the six write→recall→prompt spine candidates. Implemented items cite local test evidence. Substrate-kind recall exclusion remains unchecked on its real-signal/live-DB gate."
trigger_phrases:
  - "028 recall render escaper checklist"
  - "C8 verification checklist"
  - "recall trust spine checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/005-recall-render-escaper"
    last_updated_at: "2026-07-04T17:50:59.324Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Checked all verified ungated items and left live-DB/system-kind items pending"
    next_safe_action: "Resolve M-system-kind-exclusion with a substrate-only marker and live-DB validation"
    blockers:
      - "Live DB and substrate-only marker unavailable for CHK-004/033/043"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-005-recall-render-escaper-checklist"
      parent_session_id: null
    completion_pct: 83
    open_questions: []
    answered_questions: []
---

# Checklist: Recall→Render Trust Escaper + Substrate-Kind Recall Correctness (028/001 impl phase)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

Each item is verified against real evidence (file:line, command or test output), not assumption. DONE items cite the 030 §14 commit. PENDING items stay unchecked until built and verified. No completion claim without `validate.sh --strict` and the focused test gate passing.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The single recall render seam is confirmed (`formatters/search-results.ts`, NOT `wrapForMCP`/`envelope.ts:284-295`)
- [x] CHK-002 [P0] The shared `indexSingleFile` route is confirmed to delegate into the capture-filter install site (`indexMemoryFile` / `processPreparedMemory`)
- [x] CHK-003 [P0] The benign-corpus fixture + anchored-phrase marker list exist before the marker filter is enabled (`tests/redaction-gate.vitest.ts`)
- [ ] CHK-004 [P1] The live-DB `source_kind='system'` distribution is snapshotted to design a real substrate signal, pending: live DB unavailable in this workspace
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] C8 escaping lives at exactly ONE render seam (`formatters/search-results.ts`, single-seam invariant)
- [x] CHK-011 [P0] The injection-marker detector is a SEPARATE non-destructive symbol, never merged into the destructive secrets PATTERNS (`redaction-gate.ts`)
- [x] CHK-012 [P0] The constitutional CAS guard is byte-identical for the non-constitutional update path, DONE `e1c6a3c793`
- [x] CHK-013 [P1] The CAS P2 polish removes only the dead branch, the unconditional self-edit block is untouched (`tests/memory-crud-update-constitutional-guard.vitest.ts`)
- [ ] CHK-014 [P0] `tsc` + build pass, no scope drift beyond the six candidates, typecheck passed and alignment drift passed, build was not run
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Poison/injection probe vitest passes (forged close-tag inert, non-empty probe set, full + compact recall)
- [x] CHK-021 [P0] Benign-corpus zero-FP gate passes (CI-gated marker list)
- [x] CHK-022 [P0] CAS-guard tests pass (fail-closed self-edit + matching-hash safe update), DONE `e1c6a3c793` (114 tests pass)
- [x] CHK-023 [P1] `residual_retention` field unit test passes (+ GDPR no-deny-list assertion)
- [ ] CHK-024 [P1] Existing search/crud/schema/health/promoter suites green, baseline captured, delta reported, focused baseline/delta captured, broad schema/health/promoter gate not run
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Same-class render seams inventoried (`rg -n 'wrapForMCP|serializeEnvelope|formatSearchResults|getTieredContent'`), only the content formatter owns recall-content escaping
- [x] CHK-031 [P1] `source_kind` / `SourceKind` consumers inventoried before changing the default-recall filter
- [x] CHK-032 [P0] Capture filter verified in the shared indexing core reached by ingest/scan routes, not only the after-tool hook (`tests/injection-marker-capture.vitest.ts`)
- [ ] CHK-033 [P0] Substrate-kind exclusion verified to hide NO canonical spec-docs / constitutional rules (live-DB), pending with REQ-005
- [x] CHK-034 [P0] Escaping invariant verified: a forged close-tag in a recalled body renders inert
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Recalled bodies are framed as untrusted data ("not instructions") and tag-escaped at render (C8)
- [x] CHK-041 [P0] Capture-side markers are flagged non-destructively at the shared indexing chokepoint (M-write-time-injection-filter)
- [x] CHK-042 [P0] Constitutional self-edit / stale-`expectedHash` writes are rejected fail-closed, DONE `e1c6a3c793`
- [ ] CHK-043 [P0] Substrate-internal rows do not leak into default recall (M-system-kind-exclusion), pending with REQ-005
- [x] CHK-044 [P0] No persistent tombstone deny-list registry is created (GDPR guard rail, residual-retention is disclosure-only)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `spec.md` / `plan.md` / `tasks.md` reconciled with the as-built state
- [x] CHK-051 [P1] Per-candidate STATUS updated (DONE with evidence / PENDING with gate)
- [x] CHK-052 [P1] `implementation-summary.md` updated once tasks complete, completion metadata reconciled
- [x] CHK-053 [P2] Campaign caveat honored, no measured benefit number claimed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] All authored docs live under `001-speckit-memory/005-recall-render-escaper/`
- [x] CHK-061 [P0] No edits to the Wave-0 implementation record (the shipped record is read-only)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Candidate | Status | Evidence |
|-----------|--------|----------|
| C8 source_kind-gated render escaper | DONE | `formatters/search-results.ts`, `tests/search-results-format.vitest.ts`, typecheck + focused vitest green |
| M-write-time-injection-filter | DONE | `redaction-gate.ts`, `memory-save.ts`, `tests/redaction-gate.vitest.ts`, `tests/injection-marker-capture.vitest.ts` |
| Constitutional-CAS-guard | DONE | commit `e1c6a3c793` (030 §14 #10), opus SHIP, 114 tests pass |
| Constitutional-CAS-P2-polish | DONE | `memory-crud-update.ts`, `tests/memory-crud-update-constitutional-guard.vitest.ts` |
| M-system-kind-exclusion | PENDING | gate: real substrate signal + spec-doc short-circuit + live-DB validation unavailable in this phase |
| M-residual-retention-report | DONE | `memory-retention-sweep.ts`, `tests/memory-retention-sweep.vitest.ts` |

**Done: 5 / Pending: 1** (6 candidates total, M-system-kind-exclusion remains gated).
<!-- /ANCHOR:summary -->
