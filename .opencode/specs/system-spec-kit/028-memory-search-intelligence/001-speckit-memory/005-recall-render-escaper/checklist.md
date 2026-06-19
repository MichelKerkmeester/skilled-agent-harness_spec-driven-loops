---
title: "Checklist: Recall→Render Trust Escaper + Substrate-Kind Recall Correctness (028/001 impl phase)"
description: "Level-2 verification checklist for the six write→recall→prompt spine candidates. DONE items pre-checked with commit evidence; PENDING items unchecked."
trigger_phrases:
  - "028 recall render escaper checklist"
  - "C8 verification checklist"
  - "recall trust spine checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/005-recall-render-escaper"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-2 verification checklist"
    next_safe_action: "Verify pre-implementation items before building the recall-trust spine"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-005-recall-render-escaper-checklist"
      parent_session_id: null
    completion_pct: 17
    open_questions: []
    answered_questions: []
---

# Checklist: Recall→Render Trust Escaper + Substrate-Kind Recall Correctness (028/001 impl phase)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

Each item is verified against real evidence (file:line, command, or test output), not assumption. DONE items cite the 030 §14 commit; PENDING items stay unchecked until built and verified. No completion claim without `validate.sh --strict` and the focused test gate passing.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The single recall render seam is confirmed (content formatter, NOT `wrapForMCP`/`envelope.ts:284-295`)
- [ ] CHK-002 [P0] The shared write chokepoint `indexSingleFile` is confirmed as the capture-filter install site (covers ingest + watcher + startup-scan)
- [ ] CHK-003 [P0] The benign-corpus fixture + anchored-phrase marker list exist before the marker filter is enabled
- [ ] CHK-004 [P1] The live-DB `source_kind='system'` distribution is snapshotted to design a real substrate signal
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] C8 escaping lives at exactly ONE render seam (single-seam invariant, H33-02)
- [ ] CHK-011 [P0] The injection-marker detector is a SEPARATE non-destructive symbol, never merged into the destructive secrets PATTERNS
- [x] CHK-012 [P0] The constitutional CAS guard is byte-identical for the non-constitutional update path — DONE `e1c6a3c793`
- [ ] CHK-013 [P1] The CAS P2 polish removes only the dead branch; the unconditional self-edit block is untouched
- [ ] CHK-014 [P0] `tsc` + build pass; no scope drift beyond the six candidates
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Poison/injection probe vitest passes (forged close-tag inert, zero-success ceiling, empty-probe-fails, full + compact recall)
- [ ] CHK-021 [P0] Benign-corpus zero-FP gate passes (CI-gated marker list)
- [x] CHK-022 [P0] CAS-guard tests pass (fail-closed self-edit + matching-hash safe update) — DONE `e1c6a3c793` (114 tests pass)
- [ ] CHK-023 [P1] `residual_retention` field unit test passes (+ GDPR no-deny-list assertion)
- [ ] CHK-024 [P1] Existing search/crud/schema/health/promoter suites green; baseline captured, delta reported
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Same-class render seams inventoried (`rg -n 'wrapForMCP|serializeEnvelope|formatSearchResults|getTieredContent'`) — only the content formatter owns recall-content escaping
- [ ] CHK-031 [P1] `source_kind` / `SourceKind` consumers inventoried before changing the default-recall filter
- [ ] CHK-032 [P0] Capture filter verified to fire on the ingest path, not only the after-tool hook (`extraction-adapter.ts:247`)
- [ ] CHK-033 [P0] Substrate-kind exclusion verified to hide NO canonical spec-docs / constitutional rules (live-DB)
- [ ] CHK-034 [P0] Escaping invariant verified: a forged close-tag in a recalled body renders inert
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] Recalled bodies are framed as untrusted data ("not instructions") and tag-escaped at render (C8)
- [ ] CHK-041 [P0] Capture-side markers are flagged non-destructively at the shared write chokepoint (M-write-time-injection-filter)
- [x] CHK-042 [P0] Constitutional self-edit / stale-`expectedHash` writes are rejected fail-closed — DONE `e1c6a3c793`
- [ ] CHK-043 [P0] Substrate-internal rows do not leak into default recall (M-system-kind-exclusion)
- [ ] CHK-044 [P0] No persistent tombstone deny-list registry is created (GDPR guard rail; residual-retention is disclosure-only)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] `spec.md` / `plan.md` / `tasks.md` reconciled with the as-built state
- [ ] CHK-051 [P1] Per-candidate STATUS updated (DONE with commit / PENDING with gate)
- [ ] CHK-052 [P1] `implementation-summary.md` updated once tasks complete; completion metadata reconciled
- [ ] CHK-053 [P2] Campaign caveat honored — no measured benefit number claimed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] All authored docs live under `001-speckit-memory/005-recall-render-escaper/`
- [ ] CHK-061 [P0] No edits to `030-memory-search-intelligence-impl/` (the shipped record is read-only)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Candidate | Status | Evidence |
|-----------|--------|----------|
| C8 source_kind-gated render escaper | PENDING | gate: threat-model (Round O CONFIRMED loop closes); reference-impl backed (H33-02) |
| M-write-time-injection-filter | PENDING | gate: benign-corpus zero-FP fixture; co-built with C8 (iter-019 HIGH net-new) |
| Constitutional-CAS-guard | DONE | commit `e1c6a3c793` (030 §14 #10); opus SHIP; 114 tests pass |
| Constitutional-CAS-P2-polish | PENDING | gate: none (cleanup on DONE code); dead branch + opt-in CAS posture |
| M-system-kind-exclusion | PENDING | gate: real substrate signal + spec-doc short-circuit + live-DB validation |
| M-residual-retention-report | PENDING | gate: none (additive sweep-result field, reading-b scope) |

**Done: 1 / Pending: 5** (6 candidates total; CAS-guard shipped, its P2 polish + the other four pending).
<!-- /ANCHOR:summary -->
