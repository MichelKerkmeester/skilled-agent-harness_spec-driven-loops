# Iteration 001 — Correctness + Traceability (spec_code core)

**Target:** `026-shared-safe-fix-engine` (spec-folder, status PLANNED)
**Dimensions:** D1 Correctness, D3 Traceability (spec_code)
**Executor:** cli-claude-code model=opus

## Scope note

No source code exists (`scripts/dq/detector-registry.ts` and `scripts/dq/dq-engine.ts` are absent; `scripts/dq/` directory not created). Correctness is therefore assessed against spec-logic soundness, and traceability against whether the spec's pinned reuse seams are real and legally reachable from the planned engine location.

## Actions

1. Read spec.md / plan.md / tasks.md / checklist.md / implementation-summary.md.
2. Confirmed engine files do not exist anywhere under `.opencode` (find).
3. Verified scorer symbols and line pins:
   - `computeMemoryQualityScore` — `mcp_server/handlers/quality-loop.ts:392` (def), `:747` (export). Spec pin `quality-loop.ts:392,747` correct.
   - `reviewPostSaveQuality` — `scripts/core/post-save-review.ts:573` (export). Spec pin `:573` correct.
   - `attemptAutoFix` — `quality-loop.ts:434`; `runQualityLoop` — `:582`; 8000-char budget referenced `:229`. Spec's "destructive 8000-char substring trim" characterization is accurate.
4. Located the import-policy boundary: `scripts/evals/import-policy-rules.ts` + `scripts/evals/check-no-mcp-lib-imports.ts`.
5. Confirmed `computeMemoryQualityScore` is NOT re-exported through `mcp_server/api/` (the only legal scripts→mcp_server surface).

## Findings

### F001 — [P1] Mandated scorer reuse violates the enforced scripts→mcp_server/handlers import boundary

- **Category:** spec_code / traceability
- **finding_class:** cross-consumer
- **Claim:** REQ-008 + SC-001 require the engine (placed under `scripts/dq/`) to import `computeMemoryQualityScore` verbatim, but that symbol lives in `mcp_server/handlers/quality-loop.ts`, and an enforced eval prohibits any `scripts/ → mcp_server/handlers` import. The scorer is not exposed via the allowed `mcp_server/api/` surface, so as specified the engine cannot import it without failing `check-no-mcp-lib-imports`.
- **Evidence [SOURCE]:**
  - `spec.md:94-95` — Files to Change places both files under `.opencode/skills/system-spec-kit/scripts/dq/`.
  - `spec.md:119` — REQ-008 "The engine imports `computeMemoryQualityScore` and `reviewPostSaveQuality`".
  - `spec.md:78,209` — "Verbatim reuse of the shipped pure scorer `computeMemoryQualityScore`".
  - `plan.md:101` — AFFECTED SURFACES: "grep the import in `dq-engine.ts`, reuse pinned at `quality-loop.ts:392,747`".
  - `mcp_server/handlers/quality-loop.ts:392,747` — `computeMemoryQualityScore` defined and exported here (in `handlers/`).
  - `scripts/evals/import-policy-rules.ts` — `PROHIBITED_PACKAGE_IMPORTS` includes `@spec-kit/mcp-server/handlers`; `RELATIVE_INTERNAL_RUNTIME_IMPORT_RE = /^\.\.(?:\/\.\.)*\/(?:mcp_server\/(?:lib|core|handlers)|shared)(?:$|\/)/` blocks `../../mcp_server/handlers/...`.
  - `scripts/tests/import-policy-rules.vitest.ts:18,20` — asserts `../../mcp_server/handlers` and `.../handlers/memory-index` are prohibited.
  - `scripts/evals/check-no-mcp-lib-imports.ts:6-9` — "Scans scripts/ for prohibited internal runtime imports. Violations not in the allowlist cause a non-zero exit." `SCRIPTS_ROOT` resolves to the scripts tree (would include a future `scripts/dq/`).
  - `mcp_server/api/index.ts` — public barrel ("Only export what external consumers (scripts/, other packages) need"); `computeMemoryQualityScore` is NOT among its exports (grep over `mcp_server/api` returns no hit).
- **Impact:** The spec's central acceptance criterion (one engine reusing the shipped scorer verbatim, imported by A1/B1/B2) is unsatisfiable as written. A naive build following `plan.md:101` produces a `scripts/dq/dq-engine.ts` import that fails the existing eval gate.
- **Why P1 (not P0):** This is a planning-artifact feasibility gap, not shipped-behavior failure. Legal routes exist but none is named in the spec/plan: (a) re-export `computeMemoryQualityScore` through `mcp_server/api/`; (b) add a reviewed `check-no-mcp-lib-imports` allowlist exception; (c) relocate the engine into `mcp_server/` (changes the scripts-side import story for A1/B1/B2). The spec should pick one before Phase 2.
- **Note:** `reviewPostSaveQuality` is unaffected — `scripts/core/ → scripts/dq/` is an intra-`scripts` import and is legal. The two "shipped scorers" are not symmetric in importability, which the spec treats as one undifferentiated reuse.

### F002 — [P2] Seam citations omit directories; the two scorers live in different trees

- **Category:** spec_code / traceability
- **finding_class:** instance-only
- **Claim:** spec/plan cite the scorers as `quality-loop.ts` and `post-save-review.ts` with no directory, flattening the fact that they sit in two distinct trees (`mcp_server/handlers/` vs `scripts/core/`). This is the imprecision that masks F001.
- **Evidence [SOURCE]:** `plan.md:101-102` AFFECTED SURFACES rows; `spec.md:209`. Actual locations: `mcp_server/handlers/quality-loop.ts`, `scripts/core/post-save-review.ts`.
- **Impact:** Low on its own; it is the documentation root cause of F001. Pinning full paths in the spec would have surfaced the boundary at authoring time.

## Correctness (spec-logic) assessment

The spec's safety logic is internally sound for a planning artifact: deny-by-default (REQ-003), INV-1 (a body-mutating detector is never `safe`, REQ-004), report-mode-writes-nothing (REQ-001), safe-class-only apply (REQ-002), content_hash idempotency (REQ-005), atomic writes (REQ-006), and quarantining the destructive `runQualityLoop` budget-trim are all coherent and mutually consistent. No P0 spec contradiction found. The only correctness-adjacent issue is the seam-feasibility conflict (F001), classified under traceability.

## Adversarial self-check

No P0 asserted, so no P0 replay required. F001 was tested against the downgrade trigger: I confirmed `computeMemoryQualityScore` is absent from `mcp_server/api/` exports and that the relative-path regex matches the `handlers` segment, so the conflict is not discharged by an existing legal route. Severity held at P1 because addressable routes exist at planning time.

## Claim Adjudication Packet

```json
{
  "findingId": "F001",
  "claim": "The engine, placed under scripts/dq/ per spec.md:94-95, cannot import computeMemoryQualityScore from mcp_server/handlers/quality-loop.ts because scripts->mcp_server/handlers imports are prohibited by an enforced eval and the symbol is not re-exported through mcp_server/api/.",
  "evidenceRefs": [
    "spec.md:94-95",
    "spec.md:119",
    "plan.md:101",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts:392",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts:747",
    ".opencode/skills/system-spec-kit/scripts/evals/import-policy-rules.ts",
    ".opencode/skills/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts",
    ".opencode/skills/system-spec-kit/mcp_server/api/index.ts"
  ],
  "counterevidenceSought": "Searched mcp_server/api/ for a re-export of computeMemoryQualityScore (none); checked the policy regex/test for a handlers carve-out (none — handlers is explicitly prohibited, only api is allowed).",
  "alternativeExplanation": "An allowlist exception or an api/ re-export could make the import legal — but neither exists today and neither is named in the spec/plan, so the spec as written is not buildable without an unstated change.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "computeMemoryQualityScore becomes exported from mcp_server/api/, OR a check-no-mcp-lib-imports allowlist entry is added for the engine, OR the spec relocates the engine out of scripts/dq/.",
  "transitions": []
}
```

## Severity rollup (this iteration)

P0: 0 | P1: 1 (F001) | P2: 1 (F002)

Review verdict: CONDITIONAL
