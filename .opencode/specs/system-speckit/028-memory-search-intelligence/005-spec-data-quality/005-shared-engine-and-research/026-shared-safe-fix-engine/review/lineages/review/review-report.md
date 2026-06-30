# Review Report — Shared Safe-Fix Engine (026)

**Target:** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/005-shared-engine-and-research/026-shared-safe-fix-engine`
**Target type:** spec-folder (status PLANNED — no source code exists)
**Lineage:** fanout `review` | session `fanout-review-1782055946319-8qzc54` | executor cli-claude-code/opus
**Iterations:** 3 | **Stop reason:** coverage complete + stabilized

---

## 1. Executive Summary

**Verdict: CONDITIONAL** (`hasAdvisories: true`)

Active findings: **P0: 0 | P1: 1 | P2: 2**.

This is a pre-implementation review: the packet is at status PLANNED and the two named source files (`scripts/dq/detector-registry.ts`, `scripts/dq/dq-engine.ts`) do not exist yet (the `scripts/dq/` directory is not created). The review therefore audited spec quality, internal consistency, and the feasibility of the load-bearing seams the spec pins.

The spec is well-formed and its safety design (deny-by-default, INV-1, atomic writes, quarantine of the destructive `runQualityLoop` budget-trim) is internally sound and grounded in real upstream code. One load-bearing planning gap blocks a clean PASS: the spec's central reuse mechanism — importing `computeMemoryQualityScore` verbatim into an engine placed under `scripts/dq/` — conflicts with an enforced repository import boundary and is not buildable as written.

---

## 2. Planning Trigger

The CONDITIONAL verdict routes to **`/speckit:plan`** to resolve F001 before Phase 2 implementation begins. F001 changes a load-bearing design decision (where the engine lives / how it reaches the scorer), so it must be settled in the plan, not improvised during the build. F002 and F003 are advisory doc cleanups that can ride along with the same plan refinement.

---

## 3. Active Finding Registry

### F001 — [P1] Mandated scorer reuse violates the enforced scripts→mcp_server/handlers import boundary
- **Category:** spec_code / traceability · **finding_class:** cross-consumer · **confidence:** 0.85
- **What:** REQ-008 (`spec.md:119`) and SC-001 (`spec.md:127`) require the engine — placed under `.opencode/skills/system-spec-kit/scripts/dq/` (`spec.md:94-95`) — to import `computeMemoryQualityScore` verbatim (`spec.md:78,209`; `plan.md:101`). That symbol lives in `mcp_server/handlers/quality-loop.ts` (def `:392`, export `:747`).
- **Why it fails:** `scripts/evals/import-policy-rules.ts` prohibits `scripts/ → mcp_server/{lib,core,handlers}` imports — both the package form `@spec-kit/mcp-server/handlers` and the relative form `../../mcp_server/handlers/...` (regex `RELATIVE_INTERNAL_RUNTIME_IMPORT_RE`). `scripts/evals/check-no-mcp-lib-imports.ts` enforces this by scanning `scripts/` and exiting non-zero on violations not in the allowlist; a future `scripts/dq/` is in scope. The symbol is **not** re-exported through the only legal surface, `mcp_server/api/index.ts` (verified absent). `scripts/tests/import-policy-rules.vitest.ts:18,20` locks the handlers prohibition.
- **Consequence:** A naive build following `plan.md:101` produces a `dq-engine.ts` import that fails the existing eval gate. The "one engine, reused by A1/B1/B2" success criterion (SC-001) inherits this.
- **Asymmetry note:** `reviewPostSaveQuality` (`scripts/core/post-save-review.ts:573`) is fine — `scripts/core → scripts/dq` is a legal intra-`scripts` import. Only `computeMemoryQualityScore` is blocked. The spec treats both as one undifferentiated "verbatim reuse."
- **Downgrade trigger:** export `computeMemoryQualityScore` from `mcp_server/api/`, OR add a reviewed `check-no-mcp-lib-imports` allowlist entry, OR relocate the engine out of `scripts/dq/`.

---

## 4. Remediation Workstreams

**WS-1 — Resolve the scorer import route (addresses F001, F002; gates Phase 2).** Pick exactly one and write it into spec §7 + plan AFFECTED SURFACES:
- **Option A (recommended):** Add `computeMemoryQualityScore` to the `mcp_server/api/` public barrel and have `dq-engine.ts` import from `@spec-kit/mcp-server/api` / `../../mcp_server/api/...`. Keeps the engine in `scripts/dq/`, keeps the boundary intact, satisfies "verbatim reuse."
- **Option B:** Add a reviewed, time-boxed `check-no-mcp-lib-imports` allowlist exception for the one import (owner + removeWhen). Cheapest, but carries an expiry obligation.
- **Option C:** Relocate the engine under `mcp_server/` (e.g. `mcp_server/dq/`); then A1/B1/B2's import story changes and must be re-stated in SC-001.

**WS-2 — Doc precision (addresses F002, F003).** Pin full directory paths for both scorers in spec §7 and plan AFFECTED SURFACES; reconcile OPEN QUESTION #1 with the already-committed `scripts/dq/` decision (or re-scope that open question to the F001 route choice).

---

## 5. Spec Seed

Minimal spec delta for the next planning pass:
- Amend §7 / REQ-008: state the **legal import route** for `computeMemoryQualityScore` (api re-export | allowlist | relocation) and pin both scorers with full paths (`mcp_server/handlers/quality-loop.ts`, `scripts/core/post-save-review.ts`).
- Amend SC-001: if Option C is chosen, restate where the engine lives and how the front doors import it.
- Resolve OPEN QUESTION #1: it is answered for "where the dir lives" but should be re-pointed at the import-boundary decision that actually makes the location load-bearing.

---

## 6. Plan Seed

Action-ready starter:
1. Decide WS-1 option (A/B/C) and record the decision in plan §3 + AFFECTED SURFACES.
2. Add a Phase-1 task: "Verify `dq-engine.ts` import of `computeMemoryQualityScore` passes `check-no-mcp-lib-imports`" as an explicit gate.
3. Keep existing Phase-2/3 tasks; they are otherwise coherent.
4. Add a Phase-3 verification: run `node scripts/evals/check-no-mcp-lib-imports.ts` (or its dist build) against the new `scripts/dq/` files.

---

## 7. Traceability Status

| Protocol | Class | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core / hard | **PARTIAL** | Scorer line-pins verify (`quality-loop.ts:392,747`, `post-save-review.ts:573`); reuse seam for `computeMemoryQualityScore` not legally reachable as specified (F001/F002). |
| `checklist_evidence` | core / hard | **PASS** | All checklist items unchecked, consistent with PLANNED; no over-claimed `[x]`. `validate.sh` exit-0 claim recorded as inferred. |
| `feature_catalog_code` | overlay / advisory | N/A | No catalog entry for the unbuilt engine. |
| `playbook_capability` | overlay / advisory | N/A | No playbook scenario for the unbuilt engine. |

Unresolved gap: the `spec_code` partial is fully attributable to F001 and clears when WS-1 lands.

---

## 8. Deferred Items

- **F002 [P2]** — Seam citations omit directories (the two scorers live in different trees). Fold into WS-2.
- **F003 [P2]** — Stale OPEN QUESTION #1 vs the already-committed `scripts/dq/` decision. Fold into WS-2.
- **Inferred claim** — `implementation-summary.md:98` asserts `validate.sh --strict` exits 0 on the scaffold; not independently re-run (interactive approval blocked under sandbox). Re-verify during the next save/validation pass.

---

## 9. Audit Appendix

**Coverage:** 4/4 dimensions across 3 iterations. Core protocols both covered; overlays determined N/A. 5 scaffold docs + 5 upstream source files read (all read-only; no target file modified).

**Convergence / replay:** newFindingsRatio trend 0.50 → 0.07 → 0.00 (descending). Stop legal: dimension coverage 100%, both core protocols covered, ≥1 stabilization pass (iteration 003) with zero new findings, no active P0 (P0 override not triggered). Rolling average of last two ratios = 0.035 < rollingStopThreshold 0.08. Replay of stored JSONL agrees with the recorded `synthesis_complete` event (verdict CONDITIONAL, activeP0=0, activeP1=1, activeP2=2, dimensionCoverage=1.0).

**Claim adjudication:** F001 adjudicated with a typed packet (iteration-001), `passed:true`, finalSeverity P1, confidence 0.85, downgrade trigger recorded. No missing packets. `claimAdjudicationGate` satisfied.

**Resource Map Coverage Gate:** omitted — `resource-map.md` not present at init (`resource_map_present: false`).

**Verdict mapping:** no active P0 → not FAIL; one active P1 → CONDITIONAL (not PASS). P2 advisories present → `hasAdvisories: true`.

Review verdict: CONDITIONAL
