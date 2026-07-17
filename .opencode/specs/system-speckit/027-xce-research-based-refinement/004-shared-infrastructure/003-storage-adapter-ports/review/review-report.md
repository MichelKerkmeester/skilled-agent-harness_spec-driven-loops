# Deep Review Report — 015 Storage Adapter Ports

Review target: `system-spec-kit/027-xce-research-based-refinement/015-storage-adapter-ports` (5 behavior-preserving port-extraction slices: VectorStore, LexicalSearch [adopts 014], GraphTraversal [adopts 012], Maintenance, ContentionPolicy).
Mode: autonomous fan-out (`/deep:start-review-loop` via `fanout-run.cjs`), 3× cli-opencode `gpt-5.5-fast --variant high` lineages (10–12 iterations each), strongest-restriction merge.

---

## 1. Executive Summary

**Verdict: CONDITIONAL** | P0: 0 · P1: 3 · P2: 1

Three independent gpt-5.5-fast-high lineages audited the 015 storage-port extraction. No P0. The findings are **not behavior regressions** — slice 2 was a pure extraction ("no logic edits to the moved code"). Orchestrator + independent Fable verification confirm: P1-1's flagged behavior is pre-existing in the extracted adapter; P1-2's `clear()` is freshly-authored 015 code (no legacy `clear()` existed) but is unreachable from production. Neither changes runtime behavior. They are instead **the freshly-authored port *interface* over-promising / mis-naming relative to the faithfully-preserved adapter behavior**. The correct remediation is therefore behavior-preserving (align interface contract / JSDoc / contract tests to the real adapter semantics), NOT changing the adapter — changing the adapter would itself violate the 015 behavior-preservation mandate. A fresh Fable 5 synthesis-check adjudicates each finding under exactly this regression-vs-interface-mismatch distinction before remediation.

---

## 2. Findings

- **P1-1 · correctness · `lib/storage/ports/vector-store.ts`** — The `VectorStore.upsert(record)` port interface (lines ~80-87, 175-187) declares a caller-supplied `id`, and the record-overload forwards `String(record.id)`. But the string-overload adapter builds `IndexMemoryParams` purely from metadata (specFolder/filePath/anchorId/…) and never threads the `id` to `index_memory` — the store assigns the id. **Orchestrator verification:** this is pre-existing extracted behavior, not a 015 logic edit. The *port interface* (authored in 015) overpromises caller-id honoring the adapter never delivered. **Fix (behavior-preserving):** adjust the port interface + JSDoc to document store-assigned ids (or make the record `id` advisory/optional), rather than changing the adapter to honor the id (which would be a behavior change requiring a golden-eval gate).
- **P1-2 · correctness · `lib/storage/ports/vector-store.ts:264-271`** — `clear()` deletes three tables (`vec_memories`, `active_memory_projection`, `memory_index`), i.e. a full vector-index reset, while the name/JSDoc ("Remove all vector records") implies vectors-only. **Verification (orchestrator + Fable):** no production caller invokes `BetterSqliteVectorStore.clear()` (every `.clear()` site in lib/ is an unrelated cache/map); zero production-behavior impact. Provenance: `clear()` is freshly-authored 015 code (the legacy class had no `clear()`), a latent footgun rather than preserved legacy — but unreachable, so not a regression. **Fix (behavior-preserving):** redocument to reflect full-index-reset semantics; do NOT alter the DELETEs.
- **P1-3 · traceability · `tests/storage-ports-contract.vitest.ts:276-303`** — The VectorStore contract tests do not assert the caller-id behavior the port interface promises (consistent with P1-1: the adapter does not honor it, so the test correctly avoids it). **Fix:** once P1-1's interface is aligned to store-assigned ids, add/adjust the contract assertion to lock the *actual* contract.
- **P2-1 · maintainability · `tests/fakes/storage-ports.ts:246-264`** — `FakeContentionPolicy` omits `retryDelaysMs` / `shouldAbort` parity with the real `ContentionPolicy` adapter (contention-policy.ts:120-138). **Fix:** extend the fake to match the port surface so contract tests exercise both consistently.

---

## 3. Convergence & Attribution

| Lineage | Executor | Iterations | Verdict |
|---------|----------|-----------|---------|
| gpt-1 | cli-opencode / gpt-5.5-fast-high | 12 (maxIter) | CONDITIONAL |
| gpt-2 | cli-opencode / gpt-5.5-fast-high | 10 (maxIter) | CONDITIONAL |
| gpt-3 | cli-opencode / gpt-5.5-fast-high | 12 (maxIter) | CONDITIONAL |

Merge policy: strongest-restriction (no lineage P0 → merged not-FAIL; P1s present → CONDITIONAL). Deduped to 3 P1 + 1 P2.

Per the /goal, a fresh Fable 5 agent independently adjudicates each finding — confirming the regression-vs-interface-mismatch classification and the behavior-preserving remediation — before any code change.

## 4. Verdict & Next Steps

**CONDITIONAL** — no behavior regressions; the port abstractions authored in 015 over-promise relative to the faithfully-preserved adapters. Release-ready after behavior-preserving remediation (interface/JSDoc/contract-test alignment + fake parity), pending Fable adjudication. The extraction's zero-behavior-delta golden-eval gates held; remediation must keep them green.
