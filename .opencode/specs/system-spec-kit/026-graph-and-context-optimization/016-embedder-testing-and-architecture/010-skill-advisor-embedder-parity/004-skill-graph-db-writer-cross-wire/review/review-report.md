---
title: "Deep-Review Report: 010/004 skill-graph-db writer cross-wire (commit c0ec765f4)"
description: "5-iteration cli-devin SWE-1.6 post-impl review of 010/004 — refactor of refreshSkillEmbeddings to dispatch on hasActiveEmbedderPointer and use the new EmbedderAdapter layer. Verdict: PASS-with-advisories (0 P0, 1 P1, 2 P2)."
trigger_phrases:
  - "010/004 review report"
  - "c0ec765f4 deep review"
  - "skill-graph-db writer review"
  - "writer cross-wire deep-review"
importance_tier: "important"
contextType: "review"
---
<!-- SPECKIT_TEMPLATE_SOURCE: review-report-core | v1.0 -->

# Deep-Review Report — 010/004 skill-graph-db Writer Cross-Wire

## 1. METADATA

| Field | Value |
|---|---|
| Spec folder | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-skill-advisor-embedder-parity/004-skill-graph-db-writer-cross-wire/review` |
| Review target | git commit `c0ec765f4` (skill-graph-db.ts refresh refactor + refresh-roundtrip.vitest.ts new file — 3 files, +378/-20 LOC) |
| Iterations completed | 5 of 5 (single-commit tier per `post-implementation-deep-review.md`) |
| Stop reason | `MAX_ITER` — 5/5 dimensions covered |
| Executor | cli-devin (SWE-1.6) with `agent-config-deep-review-iter.json` recipe |
| Model | swe-1.6 |
| Wall time | ~3 min (parallel batches: 3 + 2) |
| Verdict | **PASS-with-advisories** (`hasAdvisories=true`) |
| Total findings | 0 P0 + 1 P1 + 2 P2 = 3 |
| Created by | main_agent + cli-devin SWE-1.6 (devin stayed read-only per recipe; main agent extracted iter content + JSONL rows via `/tmp/extract-f-iters.py`) |
| Created at | 2026-05-18T00:23:00Z |

---

## 2. EXECUTIVE SUMMARY

The 010/004 writer cross-wire is **architecturally sound and correct**. The 5-iter review found **zero P0**, **one P1** (early-failure ergonomics — handles mismatches per-row instead of failing configuration up front), and **two P2** (consumer signal gaps around ADAPTER-UNAVAILABLE).

**Strongest convergence signals:**
- **Iter 1 (correctness)**: ZERO findings — dispatch branch is correct, adapter writes to `vec_<active.dim>` match the loadSkillEmbeddings read shape, legacy fallback is unchanged.
- **Iter 5 (architecture-fit)**: ZERO findings — module boundaries respected (registry/schema/adapter imports), INSERT OR REPLACE matches loadSkillEmbeddings projection.

Same clean-signal pattern as E review (010/001 review): correctness + architecture-fit both clean. The remaining findings are about **operator UX** (early failure for misconfigured pointers) and **observability** (warnings consistency).

**False-positive count**: 0 over 5 iters.

---

## 3. P0 FINDINGS

**None.**

010/004 implementation has no defects that would gate-block production rollout. Round-trip integration test (4 cases) passes. Build clean. Strict-validate 0e/0w.

---

## 4. P1 FINDINGS

### P1-1 (error-handling, iter 3) — Active embedder name/dim mismatch handled per-row

**File:** `mcp_server/lib/skill-graph/skill-graph-db.ts:refreshSkillEmbeddingsViaAdapter` (line 769+)

**Issue:** If the active embedder's manifest reports a different `dim` than the `vec_metadata.active_embedder_dim` pointer (a config mismatch), each row fails individually with "EMBEDDING-FAILED: <id> (adapter returned vector of length X, expected Y)" + the helper `deleteEmbedding.run(row.id)` deletes the vec row. This means:
1. Operator gets one EMBEDDING-FAILED warning PER skill row (potentially hundreds of warnings for a single config error)
2. After the failed refresh, the `vec_<dim>` table is emptied (since all rows are deleted on the per-row catch path)
3. The operator must read the warning array to discover the dim mismatch — no early-fail signal

**Repro:**
1. `setActiveEmbedder(db, 'mock-adapter', 1024)` — pointer dim = 1024
2. The `mock-adapter` manifest actually has `dim: 768` (mismatch — config bug)
3. Call `refreshSkillEmbeddings()` → all N rows fail with same dim-mismatch error; all N rows deleted from `vec_1024`

**Recommendation:** Add a single early-fail check at the top of `refreshSkillEmbeddingsViaAdapter`:
```ts
if (adapter.dim !== active.dim) {
  return {
    embedded: 0, skipped: 0, failed: 0,
    warnings: [`ADAPTER-DIM-MISMATCH: ${active.name} reports dim=${adapter.dim} but vec_metadata pointer dim=${active.dim}; fix configuration before refresh`],
  };
}
```
This fails-fast (no row-level damage), surfaces a single clear warning, and preserves operator-actionable context.

**Effort:** XS (3-line check + 1 test case).

---

## 5. P2 FINDINGS

### P2-1 (regression-risk, iter 2) — ADAPTER-UNAVAILABLE returns failed=0/skipped=0

**File:** `mcp_server/lib/skill-graph/skill-graph-db.ts:refreshSkillEmbeddingsViaAdapter` (line ~786 — early-return for unknown manifest)

**Issue:** When the adapter manifest is missing (`getAdapter()` returns undefined), the early-return reports `{ embedded: 0, skipped: 0, failed: 0, warnings: ['ADAPTER-UNAVAILABLE...'] }`. Consumers that watch `failed` or `skipped` to detect refresh outages won't notice this case — they only see the warnings array, which is often logged-and-forgotten.

**Recommendation:** Either (a) populate `failed` with the total `skill_nodes` row count (signals "everything failed" to status-watching consumers) OR (b) include an `outcome` field in `SkillEmbeddingRefreshResult` like `'success' | 'ADAPTER-UNAVAILABLE' | 'partial-failure'` that consumers can dispatch on explicitly.

**Effort:** S (1-2 LOC + return-shape update + tests).

### P2-2 (observability, iter 4) — ADAPTER-UNAVAILABLE warning not emitted via console.warn

**File:** `mcp_server/lib/skill-graph/skill-graph-db.ts:refreshSkillEmbeddingsViaAdapter` (line ~786)

**Issue:** Per-row EMBEDDING-FAILED warnings get `console.warn('[skill-graph] ${warning}')` (line ~893), but the early-return ADAPTER-UNAVAILABLE warning only goes into the returned `warnings[]` array — never to console. Operators tailing the daemon log won't see the failure unless they're inspecting the return value.

**Recommendation:** Add `console.warn('[skill-graph] ADAPTER-UNAVAILABLE: ${active.name} (...)')` before the early-return.

**Effort:** XS (1-line).

---

## 6. CONVERGENCE & VERDICT

### Convergence trace

| Iter | Dimension | New P0 | New P1 | New P2 | Verdict trend |
|---|---|---|---|---|---|
| 1 | correctness | 0 | 0 | 0 | **clean signal** |
| 2 | regression-risk | 0 | 0 | 1 | minor consumer-signal gap |
| 3 | error-handling | 0 | 1 | 0 | early-fail ergonomics |
| 4 | observability | 0 | 0 | 1 | warning-channel gap |
| 5 | architecture-fit | 0 | 0 | 0 | **clean signal** |

**Convergence signal**: 2 of 5 iters (correctness + architecture-fit) found ZERO findings — strong signal the core refactor is right. Iters 2/3/4 each found a single non-blocking finding. No P0 across any iter.

### Verdict: PASS-with-advisories (`hasAdvisories=true`)

**Justification:**
- **Zero P0** — no defects gate-block production rollout.
- **Single P1 is an ergonomics improvement** (early-fail on dim mismatch) — not a runtime bug; just a better operator UX.
- **Two P2** are minor observability polish — surface ADAPTER-UNAVAILABLE more clearly.
- **Same shape as E review pattern** — clean correctness + architecture-fit signals; minor polish on edges.
- **Round-trip test exists and passes** (4 cases covering both branches + idempotency + unknown-manifest).
- **No regressions** vs pre-existing skill-advisor test baseline.

010/004 declared complete. Advisories should be addressed in a small follow-up (XS effort) or batched with 010/002 swap execution.

---

## 7. RECOMMENDATIONS

### Immediate (consider as cleanup follow-up before 010/002 swap execution)

1. **P1-1 (early-fail dim check)**: Add `if (adapter.dim !== active.dim) return early-warning` at top of `refreshSkillEmbeddingsViaAdapter`. Prevents per-row noise + accidental vec_<dim> table emptying.
2. **P2-2 (console.warn ADAPTER-UNAVAILABLE)**: 1-line addition to surface in daemon logs.
3. **P2-1 (outcome signal)**: Either populate `failed=N` or add `outcome` field. Pick one and apply consistently.

These three combined are ~15 LOC + 2-3 test cases. Could ship as a cleanup commit immediately after the F review verdict lands.

### Short-term backlog (already covered by 010/001 P1/P2 advisories)

- Refer to 010/001 E review-report.md §7 — overlapping items like pointer/refresh discipline (P1-1) are now addressed by this packet's dispatch-on-pointer logic.

### Long-term

- Once 010/002 swap is executed in production + verified stable for a few weeks, consider a "legacy embedding column deprecation" packet to remove the `skill_nodes.embedding` BLOB column entirely.

---

## 8. SOURCE ITERATIONS

| Iter | File | Findings | Dimension |
|---|---|---|---|
| 1 | `iterations/iteration-001.md` | 0/0/0 | correctness (**clean**) |
| 2 | `iterations/iteration-002.md` | 0/0/1 | regression-risk |
| 3 | `iterations/iteration-003.md` | 0/1/0 | error-handling (single P1) |
| 4 | `iterations/iteration-004.md` | 0/0/1 | observability |
| 5 | `iterations/iteration-005.md` | 0/0/0 | architecture-fit (**clean**) |

**JSONL state**: `deep-review-state.jsonl` (6 rows = run_init + 5 iter_complete).

---

## 9. SIGN-OFFS

| Role | Signed | Date |
|---|---|---|
| Loop manager (main_agent + cli-devin SWE-1.6) | ✅ | 2026-05-18T00:23:00Z |
| Iter worker (cli-devin SWE-1.6) | ✅ (5 iters) | 2026-05-18T00:19:53Z → 2026-05-18T00:21:51Z |

**Process notes:**
- Wall time: ~3 min total (batch 1 of 3 took ~30s; batch 2 of 2 took ~90s).
- Devin stayed read-only per the iter-recipe contract; main agent extracted markdown + JSONL rows via `/tmp/extract-f-iters.py`.
- Iter 5 (architecture-fit) explicitly confirmed module boundaries + read-write shape alignment — the strongest signal the refactor is structurally sound.

**Next action**: Address P1-1 + P2-1 + P2-2 in a small cleanup commit (~15 LOC), OR defer to 010/002 swap-execution batch. Either way, 010/004 is shipped and verified.
