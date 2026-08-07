# Deep Review Strategy — Shared Safe-Fix Engine (026)

## Topic

Pre-implementation review of the `026-shared-safe-fix-engine` spec folder. Status is **PLANNED**: spec/plan/tasks/checklist/implementation-summary are authored, and the two named source files (`detector-registry.ts`, `dq-engine.ts`) do not exist yet. The review therefore audits spec quality, internal consistency, and the feasibility of the load-bearing seams the spec pins, not shipped code behavior.

## Review Dimensions

- [x] D1 Correctness (spec-logic soundness; no code to audit)
- [x] D2 Security (deny-by-default / INV-1 design soundness; no code to audit)
- [x] D3 Traceability (spec_code seam feasibility + checklist_evidence)
- [x] D4 Maintainability (internal consistency of the scaffold)

## Files Under Review

| Path | Role | State |
|------|------|-------|
| spec.md | Feature spec, requirements, seams | Authored |
| plan.md | Implementation plan, affected surfaces | Authored |
| tasks.md | Task breakdown | Authored |
| checklist.md | QA checklist (all unchecked) | Authored |
| implementation-summary.md | Status PLANNED | Authored |
| scripts/dq/detector-registry.ts | Planned source | **Does not exist** |
| scripts/dq/dq-engine.ts | Planned source | **Does not exist** |

### Cross-referenced upstream (read-only, evidence for seam feasibility)

| Path | Why read |
|------|----------|
| mcp_server/handlers/quality-loop.ts | Houses `computeMemoryQualityScore` (def L392, export L747), `attemptAutoFix` (L434), `runQualityLoop` (L582) |
| scripts/core/post-save-review.ts | Houses `reviewPostSaveQuality` (export L573) |
| scripts/evals/import-policy-rules.ts | `isProhibitedImportPath` — bans scripts→mcp_server/{lib,core,handlers} |
| scripts/evals/check-no-mcp-lib-imports.ts | Enforcement eval, scans scripts/, non-zero exit on violation |
| mcp_server/api/index.ts | The only legal public surface scripts/ may import from |

## Cross-Reference Status

### Core (hard)
- `spec_code`: COVERED — seam claims verified to file:line; one feasibility conflict found (F001).
- `checklist_evidence`: COVERED — checklist all-unchecked is consistent with PLANNED status; implementation-summary "validate.sh --strict exits 0" claim recorded as inferred (could not re-run under sandbox).

### Overlay (advisory)
- `feature_catalog_code`: N/A — no catalog claims for this unbuilt engine.
- `playbook_capability`: N/A — no playbook scenarios for this unbuilt engine.

## Known Context

- `resource-map.md` not present. Skipping coverage gate.
- No `applied/T-*.md` reports (nothing implemented).
- `computeMemoryQualityScore` exists only in `mcp_server/handlers/quality-loop.ts`; it is **not** re-exported through `mcp_server/api/`.

## Review Boundaries

### Non-Goals
- Auditing code behavior (no code exists).
- Building or fixing the engine.
- Re-deciding the program's build order.

### Stop Conditions
- All 4 dimensions covered + both core traceability protocols covered + ≥1 stabilization pass with no new P0/P1.

## Next Focus

Loop complete — synthesis written.
