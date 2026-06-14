# Deep Review Report — 012 Causal-Traversal BFS

Review target: `system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs` (shared BFS traversal replacing two recursive-CTE read paths; commit db38d4b921).
Mode: autonomous fan-out (`/deep:start-review-loop` via `fanout-run.cjs`), 3× cli-opencode `gpt-5.5-fast --variant high` lineages, strongest-restriction merge.

---

## 1. Executive Summary

**Verdict: CONDITIONAL** | P0: 0 · P1: 2 · P2: 1

Three gpt-5.5-fast-high lineages audited the shared BFS traversal helper. No P0. The behavioral equivalence (BFS replacing the recursive-CTE read paths) was not contradicted. The two P1s cluster on the **latency-benchmark verification approach** (not a traversal-correctness defect): SC-002's p95 target vs mean-latency evidence, and a latency assertion baked into a deterministic unit test (environment-fragile). The P2 is a memo edge-count cache-coherence edge case. A fresh Fable 5 adjudicates each before remediation.

---

## 2. Findings

- **P1-1 · traceability · `012/spec.md` (SC-002)** — SC-002 specifies a p95 latency target, but the recorded verification evidence reports only mean latency. The acceptance criterion and the evidence measure different statistics. **Fix:** reconcile — either record p95 to match SC-002, or amend SC-002 to the statistic actually gated (and state why), so the criterion and evidence agree.
- **P1-2 · correctness(test-robustness) · `tests/causal-traversal-bfs-equivalence.vitest.ts`** — A latency threshold is enforced as a deterministic unit-test assertion. Wall-clock latency is environment-dependent (CI load, machine), so a hard latency assertion in a unit test is flaky and can fail for reasons unrelated to the code. **Fix (behavior-preserving):** keep the equivalence assertions hard; make the latency check advisory/non-gating in the unit test (log/skip-on-slow) or move it to a dedicated benchmark harness, so correctness stays gated but latency does not flake the suite.
- **P2-1 · correctness · `lib/storage/memo.ts`** — The memo edge-count cache can miss `dependency_edges` written outside this store instance (cross-instance cache staleness). Likely pre-existing / bounded, but flagged. **Adjudication needed:** is this reachable in production (multiple store instances writing edges concurrently), or is the cache single-instance by construction? Fix only if reachable.

---

## 3. Convergence & Attribution

| Lineage | Executor | Verdict |
|---------|----------|---------|
| gpt-1/2/3 | cli-opencode / gpt-5.5-fast-high | CONDITIONAL |

Merge policy: strongest-restriction (no P0 → not-FAIL; P1s → CONDITIONAL). Deduped to 2 P1 + 1 P2. A fresh Fable 5 agent independently adjudicates each finding (real vs false-positive, behavior-preserving fix, missed-findings sweep) before remediation.

## 4. Verdict & Next Steps

**CONDITIONAL** — no traversal-correctness/equivalence regressions; findings are latency-verification methodology (spec criterion vs evidence; flaky-assertion risk) + a memo cache-coherence edge. Release-ready after behavior-preserving remediation, pending Fable adjudication.
