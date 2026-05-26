---
title: "Implementation Summary: Layer D Launcher Pre-Flight Reap and Parity Fixtures"
description: "Completed implementation notes, parity matrix, verification evidence, and handoff for packet 010/005/003."
trigger_phrases:
  - "arc 010 005 003 implementation summary"
  - "layer d launcher reap handoff"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/003-implement-layer-d-launcher-pre-flight-reap-and-parity-fixtures"
    last_updated_at: "2026-05-23T08:00:00Z"
    last_updated_by: "codex"
    recent_action: "completed-layer-d-launcher-reap"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0100050030100050030100050030100050030100050030100050030100050030"
      session_id: "010-005-003-layer-d-launcher-reap"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-implement-layer-d-launcher-pre-flight-reap-and-parity-fixtures |
| **Completed** | 2026-05-23 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Layer D now runs in both launcher twins before the normal reuse-or-spawn path:

- JS reads ledger v1/v2 payloads, identity-checks owners, probes `/health`, SIGTERMs dead-owner/unhealthy rows, removes reaped rows, and registers the current launcher owner.
- Python mirrors the same pre-flight behavior while using the ledger v2 liveness helpers and flock-backed ledger lock.
- Vitest now consumes the shared fixture matrix used by Python and adds launcher-specific cases for legacy migration and health-gated reap.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Modified | JS Layer D reap, owner identity, v2 writes, telemetry, and test exports. |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | Modified | Python Layer D mirror and owner registration. |
| `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` | Modified | JS fixture parity and launcher edge tests. |
| Packet docs | Created | Level 2 docs, decision record, metadata, and handoff evidence. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation keeps the launchers' existing structure. Pre-flight reap happens only after the cross-encoder disabled gate, then normal reusable lookup or spawn proceeds. Reap requires both all registered owners dead and a failed short `/health` probe, so a responding sidecar is preserved even if ledger owner state is stale.

Owner identity uses PID plus `ps -p <pid> -o lstart=,comm=` output so JS matches Python's `process_liveness()` semantics. Missing `owners` fields are treated conservatively as debug/legacy manual rows and skipped by pre-flight; healthy matching legacy rows are migrated when reused.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Health gates reaping after owner death. | Prevents killing a sidecar that is still responding on its port. |
| Missing `owners` field is skipped by pre-flight. | Protects operator-spawned debug sidecars from Layer D. |
| Empty `owners: []` remains reapable in fixture-level predicate. | Preserves 010/005/001 shared fixture semantics. |
| JS writes ledger v2 on mutation. | Keeps launcher rows aligned with ledger v2 owner identities. |
| Telemetry uses `RERANK_SIDECAR_REAPER_TELEMETRY_PATH`. | Matches the env-name refinement from 010/005/002. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` on scaffold | Exit 0 before implementation. |
| `node -c .opencode/bin/lib/ensure-rerank-sidecar.cjs` | Exit 0. |
| `PYTHONPYCACHEPREFIX=/private/tmp/codex-pycache python3 -m py_compile .opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | Exit 0. |
| `cd .opencode/skills/system-rerank-sidecar && python3 -m pytest tests/test_sidecar_ledger.py -v` | Exit 0; 22 passed. |
| `cd .opencode && node skills/system-spec-kit/scripts/node_modules/vitest/vitest.mjs run bin/lib/ensure-rerank-sidecar.vitest.ts --config vitest.config.bin.ts` | Exit 0; 25 passed, 5 pre-existing skipped. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/bin/lib` | Exit 0; PASS. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-rerank-sidecar/scripts` | Exit 0; PASS. |

### Parity Matrix

| Fixture Case | JS Verdict | Python Verdict |
|--------------|------------|----------------|
| all-owners-alive-no-reap | no reap | no reap |
| all-owners-dead-pid-not-recycled-reap | reap | reap |
| all-owners-dead-pid-recycled-reap | reap | reap |
| mixed-owners-some-dead-no-reap | no reap | no reap |
| pid-1-owner-reap | reap | reap |
| eperm-owner-no-reap | no reap | no reap |
| esrch-owner-reap | reap | reap |
| empty-owner-set-legacy-row-reap | reap | reap |
| unknown-owner-no-reap | no reap | no reap |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The exact requested Vitest path `node_modules/vitest/vitest.mjs` under `.opencode/skills/system-spec-kit` is not present in this checkout. The equivalent installed runner under `skills/system-spec-kit/scripts/node_modules` passed.
- Python pre-flight uses private ledger lock/read helpers because `sidecar_ledger.py` does not expose a public raw-row locked read that preserves missing-owner debug rows. This keeps the change inside the approved launcher file.
- Later phases still own `start.sh`, README, SKILL.md, and operator-facing docs.

## Commit Handoff

Suggested commit, not created:

```bash
git add .opencode/bin/lib/ensure-rerank-sidecar.cjs \
  .opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py \
  .opencode/bin/lib/ensure-rerank-sidecar.vitest.ts \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/003-implement-layer-d-launcher-pre-flight-reap-and-parity-fixtures
git commit -m "feat(010/005/003): launcher Layer D pre-flight reap (JS+Python) + parity fixtures"
```
<!-- /ANCHOR:limitations -->
