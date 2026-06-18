# Deep Review Strategy — p017c004-opus

## Topic

Release-readiness audit of phase packet **004-confidence-calibration-labeled-set** (Problem 6 / Calibration Headroom): a default-ON per-result confidence weight rebalance plus flag-gated, default-OFF isotonic calibration infrastructure.

## Review Dimensions

- [x] D1 Correctness — confidence math, rebalance, fit/apply, default-OFF wiring
- [x] D2 Security — file/env handling, parse safety, trust boundaries
- [x] D3 Traceability — spec.md/plan.md/tasks.md vs shipped code and metadata
- [x] D4 Maintainability — duplication, model serialization, documented limitations

## Files Under Review

| File | Role | Action |
|------|------|--------|
| `mcp_server/lib/search/confidence-scoring.ts` | Per-result confidence + rebalance + calibration hook | read |
| `mcp_server/lib/search/confidence-calibration.ts` | Isotonic fit/apply, loaders | read |
| `mcp_server/lib/search/search-flags.ts` | Opt-in flag + model path resolver | read |
| `mcp_server/tests/confidence-calibration.vitest.ts` | Fit/apply/loader/default-OFF tests | read |
| `004-…/assets/fit-calibration.mjs` | Proxy seed generator | read |
| `004-…/assets/confidence-calibration-model.starter.json` | Demo isotonic model | read |
| `004-…/spec.md`, `plan.md`, `tasks.md` | Packet normative docs | read |
| `004-…/implementation-summary.md` | Completion narrative | read |
| `004-…/graph-metadata.json`, `description.json` | Packet metadata | read |

## Cross-Reference Status

### Core (hard gate)

| Protocol | Status | Note |
|----------|--------|------|
| `spec_code` | **fail/partial** | spec.md carries no normative claims (raw template), so normative-claim → shipped-behavior cannot be verified. Code itself matches the implementation-summary narrative. |
| `checklist_evidence` | N/A | No `checklist.md` present (Level 1 packet). |

### Overlay (advisory)

| Protocol | Status | Note |
|----------|--------|------|
| `feature_catalog_code` | N/A | No catalog claim in scope for this packet. |
| `playbook_capability` | N/A | No playbook in scope. |

## Known Context

- `resource-map.md` not present. Skipping coverage gate.
- Calibration deliverable (B) is flag-gated, default OFF (`SPECKIT_CONFIDENCE_CALIBRATION` via `isOptInEnabled`) and additionally requires a readable model path — confirmed inert in production.
- The starter labeled set/model is an explicitly-labeled CORPUS-DERIVED PROXY; the real ~50–100 judged pairs are the documented follow-up.
- Test re-execution (vitest) was blocked by the sandbox in this lineage; the 67/67 PASS figure is carried from implementation-summary.md as a documented-but-not-independently-re-run claim.

## Review Boundaries

### Non-Goals
- Re-running or re-fitting the calibration model on real labeled traffic (that is the documented follow-up, out of scope).
- Modifying any code under review (observation-only).

### Stop Conditions
- `maxIterations = 1` (fan-out lineage). One breadth-first iteration covering all four dimensions, then synthesis.
