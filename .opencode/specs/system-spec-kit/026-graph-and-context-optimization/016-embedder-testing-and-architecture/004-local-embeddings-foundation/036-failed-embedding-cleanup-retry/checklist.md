---
title: "Checklist: 036 Failed Embedding Cleanup Retry"
description: "Verification checklist for the one-shot failed-embedding cleanup retry."
trigger_phrases:
  - "036 checklist"
  - "failed embedding cleanup checklist"
importance_tier: "important"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/036-failed-embedding-cleanup-retry"
    last_updated_at: "2026-05-14T00:30:00Z"
    last_updated_by: "main-agent"
    recent_action: "Recorded repair-script evidence and final DB counts"
    next_safe_action: "Emit final binding trace"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: 036 Failed Embedding Cleanup Retry

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| [P0] | Hard blocker | Must pass or packet is FAIL/PARTIAL |
| [P1] | Required | Must pass or documented with evidence |
| [P2] | Optional | Can defer with reason |

Evidence format: command exit code, summary line, status count, or file path.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Gate 3 answer supplied for 036 packet path.
  - Evidence: user dispatch pre-bound `GATE_3_ANSWER=E-Phase-036`.
- [x] CHK-002 [P0] Source-modification scope is forbidden and acknowledged.
  - Evidence: `spec.md > Out of Scope`.
- [x] CHK-003 [P0] Baseline status counts captured before dry-run.
  - Evidence: pending=741, retry=18, success=2897.
- [x] CHK-004 [P1] Repair script selection behavior inspected.
  - Evidence: script selects `WHERE embedding_status = 'failed'`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No source-code files are modified for this packet.
  - Evidence: this packet only added `.opencode/specs/.../036-failed-embedding-cleanup-retry/`; existing unrelated dirty files were left untouched.
- [x] CHK-011 [P0] Existing repair script is used as-is.
  - Evidence: no patch applied to `repair-failed-embeddings.mjs`.
- [x] CHK-012 [P1] CPU fallback path is understood before live run.
  - Evidence: script sets `process.env.NODE_LLAMA_CPP_GPU ??= 'false'`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Dry-run command exits 0.
  - Evidence: `EMBEDDINGS_PROVIDER=llama-cpp node .../repair-failed-embeddings.mjs --dry-run </dev/null` exit 0.
- [x] CHK-021 [P0] Dry-run summary line captured.
  - Evidence: `summary processed=0 succeeded=0 skipped=0 errored=0 elapsed_ms=0 dry_run=true`.
- [x] CHK-022 [P0] Live command exits 0.
  - Evidence: `EMBEDDINGS_PROVIDER=llama-cpp node .../repair-failed-embeddings.mjs </dev/null` exit 0.
- [x] CHK-023 [P0] Live summary line captured.
  - Evidence: `summary processed=0 succeeded=0 skipped=0 errored=0 elapsed_ms=0 dry_run=false`.
- [x] CHK-024 [P0] Final `memory_index` status counts captured.
  - Evidence: pending=741, retry=18, success=2897, failed absent.
- [x] CHK-025 [P1] Final vector-row count captured through sqlite-vec-aware path.
  - Evidence: Node query with `better-sqlite3` + `sqlite-vec` returned `vec_memories|2902`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-026 [P0] Repair script selected zero failed rows honestly.
  - Evidence: dry-run `failed_count=0`; live `starting_failed_count=0`.
- [x] CHK-027 [P0] No failed rows remain after live run.
  - Evidence: final `memory_index` counts were pending=741, retry=18, success=2897, with `failed` absent.
- [x] CHK-028 [P1] Pending/retry rows are documented as outside failed-row repair scope.
  - Evidence: `implementation-summary.md > Known Limitations`.

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No network access is needed.
  - Evidence: user dispatch says model already cached; repair script uses local DB/model.
- [x] CHK-031 [P0] No secrets or credentials are read or modified.
  - Evidence: commands target local SQLite DB and local Node script only.
- [x] CHK-032 [P1] No Memory MCP tools are called.
  - Evidence: execution plan uses shell commands only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Level-2 packet docs created.
  - Evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`.
- [x] CHK-041 [P0] Implementation summary records baseline counts.
  - Evidence: `implementation-summary.md > What Was Built`.
- [x] CHK-042 [P0] Implementation summary records dry-run and live-run results.
  - Evidence: `implementation-summary.md > Verification`.
- [x] CHK-043 [P0] Implementation summary records final counts and delta.
  - Evidence: `implementation-summary.md > Verification`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Packet lives at requested 036 path.
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/036-failed-embedding-cleanup-retry/`.
- [x] CHK-051 [P0] `description.json` has `specId="036"` and 3-element `parentChain`.
  - Evidence: created in packet root.
- [x] CHK-052 [P0] `graph-metadata.json` has full nested `packet_id` and parent `014-local-embeddings-migration`.
  - Evidence: created in packet root.
- [x] CHK-053 [P0] `manual.depends_on` points at 037, 038, and 039.
  - Evidence: `graph-metadata.json`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-060 [P0] Strict validation exits 0.
  - Evidence: `validate.sh .opencode/specs/.../036-failed-embedding-cleanup-retry --strict` exit 0; `RESULT: PASSED`.
- [x] CHK-061 [P0] Required final stdout binding trace can be filled completely.
  - Evidence: all required values are known except strict validation, which is next.
- [x] CHK-062 [P1] Packet status is marked PASS, PARTIAL, or FAIL based on evidence.
  - Evidence: `PHASE_036_STATUS=PASS` because dry-run/live/final counts succeeded and remaining failed rows = 0.
<!-- /ANCHOR:summary -->
