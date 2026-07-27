# Research Synthesis — Compiled Routing Next Move (grok lineage)

**Session:** `fanout-grok-1785124318112-qa7rq8`  
**Stop reason:** `maxIterationsReached` (5/5; convergence telemetry only)  
**Executor:** cli-cursor / cursor-grok-4.5-high-fast  
**Mode:** research only — no implementation

## Executive recommendation

Adopt a **derived dual-location** activation-manifest contract; fix **live-input / harness skew** (especially `cli-external-orchestration`) so authored closure tracing can succeed; make **`compiled-route-guard` blocking in CI** with a narrow `inputs-do-not-compile` allowlist for hubs mid-restructure; **retain staging + atomic rename + rollback**; sequence CLI harness + dual write-back + CI now, and defer sk-design remint/compiler-contract alignment until the registry restructure finishes.

---

## Q1 — Activation-manifest ownership

**Decision:** Derived dual-location model.

| Model | Verdict | Breakage |
|-------|---------|----------|
| Authored-only (no runtime mirror) | Reject | Resolver reads promoted `ACTIVATION_ROOT` only; no mirror ⇒ all legacy. [SOURCE: resolve.cjs:24,106] |
| Runtime-authoritative | Reject as sole owner | Mint/refresh write runtime only (`compiled-route-manifest.cjs:16,55,579`); rebuild copies from authored (`compiled-route-sync.cjs:724`) ⇒ unreproducible / overwrite |
| **Derived dual-location** | **Adopt** | Authored = reproducibility authority; runtime = promoted serving mirror; unrecorded drift is a defect. Guard already names `authored-drift` vs `stale-manifest`. [SOURCE: guard.cjs:13-19] |

**Current violation evidence:** `sk-doc` and `sk-design` manifests differ authored↔runtime; five hubs identical; guard reports `sk-doc=authored-drift`, cli+sk-design=`inputs-do-not-compile`. [SOURCE: cmp; guard --json]

---

## Q2 — Exact closure-resolution mechanism

**Mechanism (confirmed, not guessed):**

1. `traceClosure` / `--check` call `resolveRoute` under forced flag. [SOURCE: sync.cjs:120-142]
2. `resolveRoute` returns `null` if `compiledRoute` throws **or** live snapshot hash/generation ≠ manifest `selectedPolicy`. [SOURCE: resolve.cjs:103-121]
3. Unresolved hubs → `authored closure failed to resolve hubs: …`. [SOURCE: sync.cjs:741-743]
4. Engines always `loadSnapshot()` from **live** `.opencode/skills/<hub>` via child harnesses — activation manifest bytes are not the compile input. [SOURCE: compiled-route.cjs:55-81]

**Per-hub exact errors:**

| Hub | Graph | Exact failure |
|-----|-------|----------------|
| cli-external-orchestration | runtime | `ENOENT` …/`cli-devin/SKILL.md` still listed in promoted `sourceInputs` while live registry has 4 modes without cli-devin. [SOURCE: runtime build-artifacts.cjs:82; loadHubEngine] |
| cli-external-orchestration | authored | Authored `sourceInputs` omits `cli-cursor`; live registry includes it → `undefined.toString`. Authored≠runtime harness (`cmp` differs). [SOURCE: authored build-artifacts.cjs:64-108] |
| sk-design | both | `sk-design must declare six modes` (`modes.length !== 6`) but live registry has 4 modes. [SOURCE: registry-compiler.cjs:296; mode-registry] |

**Baseline contradictions (explicit):**

- Claim “runtime resolution succeeds” for these hubs: **FALSE in this checkout** — both graphs fail `loadHubEngine`/`resolveRoute`.
- Claim manifests are byte-identical for the pair: **TRUE for cli-external-orchestration; FALSE for sk-design** currently.
- `--check` also fails `sk-doc` via identity bind (authored selected hash `2833c064…` ≠ live `3ed7c31e…`). `--verify` fails only cli+sk-design.

---

## Q3 — Freshness guard placement + escape hatch

**Decision:**

| Surface | Role |
|---------|------|
| **CI (PR + main)** | **Authoritative block** via `compiled-route-guard.cjs` |
| Pre-commit | Optional `--warn-only` UX |
| Session hook | Optional advisory context |
| Pre-push | **Do not use** (remote permission gate only) |

**Escape hatch:** reviewed allowlist of hubIds for **`inputs-do-not-compile` only** (never `stale-manifest` / `authored-drift`), with reason + tracking reference. Required so `sk-design` mid-restructure does not wedge CI.

**Evidence:** guard unused by hooks/CI today; hooks opt-in; pre-push is naming/allowlist; sibling workflows already exist for registry drift and no-spec-import. [SOURCE: rg; hooks README:81; pre-push header; workflow YAML headers]

**UNVERIFIED:** concrete workflow filename and path filters.

---

## Q4 — Staging / rollback retention

**Decision:** **Retain** staging + atomic rename + retained rollback + publication-state finalize/revert. **Do not** restore live-root `rmSync`.

| Side | Argument |
|------|----------|
| Keep | Historical `rmSync(RUNTIME_ROOT)` then copy was crash-unsafe [SOURCE: 4153cbebd8]; current sibling staging/rename + retained rollback covers post-publish gates [SOURCE: sync.cjs:746-895,924,938] |
| Against full bulk | Closure is git-tracked (~74 paths); single-operator; nested `_testFailRename` recovery is oversized relative to need [SOURCE: tests:870+; wc -l ~1086/1372] |

**Prune later:** test-injection-only nested rename recovery, only after lifecycle tests can run (blocked by Q2).

---

## Q5 — Minimum sequenced work

### Safe before sk-design restructure ends

1. Fix cli harness skew (drop cli-devin from runtime inputs; add cli-cursor to authored inputs) so cli compiles.
2. Implement dual-location mint/sync write-back (Q1) to clear authored-drift / identity-bind (e.g. sk-doc).
3. Add CI guard job + allowlist entry for sk-design (`inputs-do-not-compile`); optional warn-only pre-commit/session.
4. Improve `--check` to print underlying compile errors, not only hub names.
5. Keep staging/rollback.

### Must wait for sk-design restructure

1. Decide end-state mode cardinality (4 vs 6) — **UNVERIFIED intent**.
2. Remint sk-design; remove allowlist entry.
3. Green `--check` / lifecycle tests; then prune nested rename recovery.

---

## Convergence report

| Metric | Value |
|--------|-------|
| Iterations | 5 |
| Stop reason | maxIterationsReached |
| Questions answered | 5/5 |
| newInfoRatio trend | 1.0, 1.0, 1.0, 1.0, 0.85 |
| Spec anchoring | skipped (detached lineage write boundary) |

## Ruled-out directions (fleet)

- Pure authored-only or pure runtime-authoritative ownership
- Manifest-byte comparison as Q2 root cause
- Authoritative pre-commit / pre-push / session blocking
- Live-root rmSync publication
- Open-ended sk-design exemption without allowlist discipline
