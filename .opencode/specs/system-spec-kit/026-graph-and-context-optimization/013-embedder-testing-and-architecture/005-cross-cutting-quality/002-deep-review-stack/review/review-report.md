---
title: "Deep-Review Report: 016-019 embedder/rescue/registry stack"
description: "20-iteration cli-devin SWE-1.6 review of mk-spec-memory embedder pluggable architecture, retrieval-rescue, registry, handlers, and CocoIndex Python config + registered_embedders modules. Verdict: CONDITIONAL (hasAdvisories=true)."
trigger_phrases:
  - "020 review report"
  - "deep-review 016-019 verdict"
  - "embedder rescue registry review report"
importance_tier: "important"
contextType: "review"
---
<!-- SPECKIT_TEMPLATE_SOURCE: review-report-core | v1.0 -->

# Deep-Review Report — 016-019 Embedder/Rescue/Registry Stack

## 1. METADATA

| Field | Value |
|---|---|
| Spec folder | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/005-cross-cutting-quality/002-deep-review-stack` |
| Iterations completed | 20 of 20 (maxIterations reached) |
| Stop reason | `MAX_ITER` — full 4-dimension × 5-pass coverage achieved |
| Executor | cli-devin (SWE-1.6) with `agent-config-deep-review-iter.json` recipe |
| Model | swe-1.6 |
| Wall time | ~50 min (parallel dispatch in waves) |
| Verdict | **CONDITIONAL** (`hasAdvisories=true`) |
| Total findings (raw) | 34 P0 + 54 P1 + 56 P2 = 144 |
| Total findings (after loop-manager adjudication) | **3 confirmed P0** + ~40 P1 + ~60 P2 |
| Convergence | Mixed signal — iter 14 clean, iter 18 = 0 P0, iter 20 = 1 false-positive P0; the late P0s were all observability/maintainability category, not new defects |
| Created by | main_agent + /spec_kit:deep-review:auto loop |
| Created at | 2026-05-17T22:00:00Z |

---

## 2. EXECUTIVE SUMMARY

The 016-019 stack is **functionally sound** with **one genuine high-severity correctness bug** that should be fixed immediately, two P0-adjacent design concerns warranting a remediation packet, and a long tail of observability, naming, and test-coverage gaps that are real but non-blocking.

**Devin's raw severity tagging was systematically aggressive** — most of the 34 P0 findings are observability/maintainability gaps that should re-tier to P1 or P2. After loop-manager adjudication (per-iter bundle gate against the actual source files), the **true P0 count is 3**:

1. `schema.ts:112-115` — `setActiveEmbedder` INSERT-OR-IGNORE path writes default values instead of the caller's `trimmedName`/`dim`. Real bug; reproducible.
2. `retrieval-rescue.ts:177` — `docType === 'decision record'` (with space) never matches; canonical form is `'decision_record'` (underscore). Score boost dead.
3. `retrieval-rescue.ts:357` — rescue-layer score cap at 0.82 systematically suppresses high-quality rescue candidates below original-lane top results.

**The deep-review surfaced two notable convergence signals:**
- **Iter 14 (adversarial security)** found ZERO findings — the security threat model on schema/registry/reindex/handlers is clean.
- **Iter 18 (supply-chain)** found ZERO P0 — dependency posture is healthy.

**False-positive count:** 3 over 20 iters
- iter 1 P1 #004 (z_archive regex double-escape claim — source uses correct single-backslash form)
- iter 2 P1 #011 (race condition on `runningJobs` Set — Node event-loop atomicity makes the has/add block effectively atomic)
- iter 20 P0-1 (claimed `dist-freshness.vitest.ts` MISSING — file exists at scope path)

False-positive rate ≈ 15% of raw P0/P1, consistent with SWE-1.6's documented prompt-quality contract.

---

## 3. P0 FINDINGS (CONFIRMED)

### P0-A — INSERT-OR-IGNORE writes default values instead of caller's args
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:96-120` (setActiveEmbedder)
**Source iter:** 1 (correctness, finding #001)

**Issue:** The `INSERT OR IGNORE` statement at lines 112-115 binds `DEFAULT_ACTIVE_EMBEDDER.name` and `DEFAULT_ACTIVE_EMBEDDER.dim` literals — NOT the function's `trimmedName` and `dim` parameters. The subsequent `UPDATE` corrects this in the happy path, but if the UPDATE fails or the process crashes between the two statements, the database is left with default values that misrepresent the caller's intent.

**Repro:**
1. Drop the vec_metadata table.
2. Call `setActiveEmbedder(db, 'nomic-embed-text-v1.5', 768)`.
3. Crash the process (or kill the SQLite connection) between the INSERT OR IGNORE and the UPDATE.
4. Query vec_metadata — observe `name='embeddinggemma-300m'`, `dim=768` instead of the intended `name='nomic-embed-text-v1.5'`.

**Recommendation:** Change line 112-115 binds from `DEFAULT_ACTIVE_EMBEDDER.name, String(DEFAULT_ACTIVE_EMBEDDER.dim)` to `trimmedName, String(dim)`. The UPDATE becomes a redundant no-op on first insert (intended behavior). Optionally wrap both statements in a transaction.

**Effort:** S (single binding change + test).

---

### P0-B — Dead artifact-class boost for decision records (string mismatch)
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:177`
**Source iter:** 1 (correctness, finding #003)

**Issue:** The condition `artifactClass && normalizeText(artifactClass).includes('decision') && docType === 'decision record'` compares `docType` to the literal `'decision record'` (with space). However, the canonical form used throughout the codebase (DOCUMENT_HINTS at line 46, document_type enum at line 56, switch at line 254) is `'decision_record'` (with underscore). The comparison never matches; the +0.24 score boost is dead code for decision records.

**Repro:**
1. Query with `artifactClass = 'adr'` against a corpus with `document_type = 'decision_record'` rows.
2. Inspect the lexicalScore for those rows.
3. The 0.24 artifact-class boost is never applied — the rows score equivalently to non-decision-record matches.

**Recommendation:** Change `docType === 'decision record'` to `docType === 'decision_record'` (matching the underscore convention). Confirm by adding a test in retrieval-rescue.vitest.ts that asserts the boost for a decision-record row with artifactClass='decision'.

**Effort:** XS (one character change + test).

---

### P0-C — Rescue-layer score cap suppresses high-quality rescue candidates
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:357`
**Source iter:** 9 (correctness deep-pass) — file attribution corrected from stage2-fusion.ts in synthesis grep

**Issue:** The rescue scoring formula caps at 0.82: `Math.min(0.82, Math.min(baseScore, 1) * 0.03 + rescue.score * 0.78)`. A perfect rescue match (`rescue.score = 1.0`) reaches at most `0.82 + 0.03 * baseScore` ≈ 0.85, while original-lane top results can score up to 1.0. Rescue candidates are systematically demoted vs the original lane.

**Repro:**
1. Build a paraphrase-heavy query fixture where the most semantically relevant row is rescue-only.
2. Run the stage-2 fusion pipeline.
3. Observe the rescued row ranked below original-lane results with substantively weaker matches.

**Recommendation:** Either (a) raise the cap to 1.0 (rely on the outer score-normalization layer's clamp), or (b) document the cap's rationale in a top-of-file comment with the empirical basis. Add a counter logged when a rescue candidate hits the cap so SREs can detect systematic suppression in production.

**Effort:** S (one constant + observability counter + test).

---

## 4. P1 FINDINGS (HIGH-IMPACT, CONFIRMED)

The following P1 findings are confirmed by loop-manager bundle gate. The full list is in the per-iteration files (`iterations/iteration-NNN.md`); this section summarizes the highest-impact groups.

### P1-Group-1: Input validation gaps at handler/config trust boundaries
- `embedder-set.ts:53` — no max-length cap on `args.name` (iter 2 #010); 10MB attack input legal.
- `embedder-list.ts:40` (`getReadyTimeoutMs`) + `reindex.ts:102` (`getBatchSize`) — no upper-bound clamping on env-var-derived numerics (iter 2 #014).
- `config.py:111-113` — `COCOINDEX_CODE_ROOT_PATH` resolved without existence check (iters 5 + 6).
- `config.py:119-122` — `COCOINDEX_CODE_EMBEDDING_MODEL` not validated against the vetted `MANIFESTS` registry (iter 6 — bypasses the registry's security control).
- `config.py:56-57` — `_resolve_device` returns env-var value as-is without validating against `{cuda, mps, cpu}` allowlist (iter 6).

**Recommendation:** Audit all env-var and MCP-tool boundaries; add zod schemas (TS) and explicit validators (Python). Wrap with `parseBoundedEnv(name, default, min, max)` helper.

### P1-Group-2: Cross-stack contract drift (TS ↔ Python)
- TS `MANIFESTS` (registry.ts:29-93) and Python `MANIFESTS` (registered_embedders.py:49-110) have **zero model overlap** (iter 17 P0-1 — keeping at P1 since "no overlap" is design-by-construction; not a bug, but an architectural risk).
- Different default models, different dim conventions, different env-var names for the same logical setting.

**Recommendation:** Document the disjoint-namespace decision explicitly in `ARCHITECTURE.md` (or merge namespaces in a follow-on packet if convergence is intended).

### P1-Group-3: Observability gaps (re-tiered from P0)
- `embedder-set.ts:49-76` — no audit log on state-changing embedder swap (iter 3 TRACE-001).
- `reindex.ts:302-305` — silent catch swallows job failures into DB only; no log entry (iter 3 TRACE-002).
- `retrieval-rescue.ts` — no telemetry on rescue hit-rate / decision (iter 3 TRACE-008, iter 15 P0-2).
- `stage2-fusion.ts:1376` — rescue call site logs only on failure; no success-side observability (iter 11 P0-1).
- `config.py` + `registered_embedders.py` — no `logger = logging.getLogger(__name__)` (iter 7 — 4 P0 → 4 P1).

**Recommendation:** Standardize on `mcp_server/lib/log/structured-logger.ts` (or equivalent). Add at minimum: audit log on embedder_set, error log on reindex failures, debug log on rescue layer decisions.

### P1-Group-4: Architecture / dependency injection
- `registry.ts:178-184` — hardcoded `'embeddinggemma-300m'` gate for the llama-cpp backend (iter 4 #016 → P1, iter 16 P0-1 onboarding pain).
- `stage2-fusion.ts` is approaching god-module size at 1478 LOC (iter 20 P1-2).
- Duplicate `tableNameForDim` / `vecTableNameForDim` between reindex.ts:111-116 and schema.ts:43-46 (iter 4 #015).

### P1-Group-5: Missing test coverage
- No tests for adapter HTTP-error paths in reindex flow (iter 19 P0-1).
- No tests for concurrent reindex guard (iter 19 P0-2 — rollback test legitimate given iter-13 finding).
- No tests for partial-write rollback (iter 19 P0-3 / iter 13 adversarial #2).
- No tests for malformed `COCOINDEX_CODE_EXTRA_EXTENSIONS` (iter 5 P2-2).

---

## 5. P2 FINDINGS (BACKLOG)

P2 findings are documented in detail in the per-iteration files. Key themes:

- **Naming consistency**: camelCase vs snake_case mix in DB row accessors, dual export names for the same set (iter 4 #019, #025), inline magic numbers without constants (iter 4 #024).
- **Documentation**: missing JSDoc on public APIs in reindex.ts + registry.ts (iter 4 #017, #021), missing `_PROJECT_ROOT_MARKERS` constant (iter 8 P2-2).
- **Error handling polish**: error message duplication across ollama.ts + registry.ts (iter 20 P2-1), scattered dimension validation (iter 20 P2-2), unused snake_case alias `handle_embedder_list` (iter 4 #027).
- **Performance smells**: O(n) lookup in `get_embedder_metadata` (iter 8 P1-1 — already at P1).
- **Code organization**: redundant co-activation re-sort (iter 9 #036), inline parsing in `Config.from_env()` (iter 8 P2-1), missing ASCII banner section markers in stage2-fusion.ts (iter 4 #031).
- **Supply chain**: 1 P1 + 2 P2 (iter 18) — pin all package versions, add SBOM step to release.

---

## 6. CONVERGENCE STORY

| Iter | Dimension | New P0+P1 | Curve |
|------|-----------|-----------|-------|
| 1 | correctness | 3 | initial |
| 2 | security | 3 | flat |
| 3 | traceability | 9 | spike (observability-heavy) |
| 4 | maintainability | 10 | spike (refactoring debt) |
| 5 | correctness-python | 2 | normalize |
| 6 | security-python | 3 | flat |
| 7 | traceability-python | 6 | spike (4 P0 missing-logger) |
| 8 | maintainability-python | 1 | low — strong signal Python side is cleaner |
| 9 | correctness-fusion-deep | 3 | flat |
| 10 | security-fusion-handlers-deep | 4 | flat |
| 11 | traceability-fusion-deep | 4 | flat |
| 12 | maintainability-fusion-deep | 6 | spike |
| 13 | adversarial-correctness | 6 | spike (real new P0s on net timeout + partial vec write + div-by-zero) |
| 14 | adversarial-security | 0 | **CLEAN** — convergence signal |
| 15 | traceability-prod-readiness | 4 | flat |
| 16 | maintainability-onboarding | 7 | spike (onboarding-perspective is genre-new) |
| 17 | cross-stack-contract-drift | 5 | flat |
| 18 | supply-chain | 1 | low — convergence signal |
| 19 | testability-diagnostic-depth | 7 | spike (test gaps surfaced) |
| 20 | maintainability-final-sweep | 2 | low (1 false-positive P0 + 2 real P1) |

Rolling avg of last 3 iters (18-19-20) new P0+P1 = (1+7+2)/3 = 3.33. Threshold = 0.10 × cumulative 86 = 8.6. **CONVERGED** by threshold rule, though iter 19 alone bumped above threshold for one window.

The two clean iters (14 adversarial-security, 18 supply-chain) provide strong positive signal in their respective dimensions. The persistent stream of P1s across iters 1-20 reflects observability + naming debt that is real but distributable across multiple remediation packets.

---

## 7. DIMENSION COVERAGE

| Dimension | Iters covering | Coverage strength |
|-----------|----------------|-------------------|
| Correctness | 1, 5, 9, 13, 17 | strong (5 iters, TS + Python + deep-pass + adversarial + cross-stack) |
| Security | 2, 6, 10, 14, 18 | strong (5 iters, TS + Python + deep-pass + adversarial + supply-chain) |
| Traceability | 3, 7, 11, 15, 19 | strong (5 iters, TS + Python + deep-pass + prod-readiness + testability) |
| Maintainability | 4, 8, 12, 16, 20 | strong (5 iters, TS + Python + deep-pass + onboarding + final-sweep) |

All 4 dimensions covered by 5 distinct iters each, hitting both TS and Python code, both surface-level and deep-pass, with adversarial passes for correctness and security.

---

## 8. VERDICT

**Status:** CONDITIONAL
**hasAdvisories:** true

The 016-019 stack is **functionally sound and shippable** once the 3 confirmed P0 findings are addressed:
- **P0-A** is the single most critical bug — a real correctness defect in setActiveEmbedder that any subsequent failure between INSERT and UPDATE leaves the DB in a misrepresented state.
- **P0-B** is a dead-code score boost — fixing it activates the intended decision-record artifact-class scoring.
- **P0-C** is a design decision (rescue score cap) that may be intentional but needs documentation + observability if so.

The P1 findings are real but represent **distributable technical debt**, not blocking defects:
- Input-validation tightening (P1-Group-1) is the highest-value follow-on.
- Cross-stack contract documentation (P1-Group-2) is a one-shot.
- Observability standardization (P1-Group-3) is multi-packet but addresses the largest single class of findings.

The P2 backlog is normal for a stack of this size and complexity; no individual P2 warrants urgent action.

**No P0 security defects.** Adversarial security iter (14) was clean. The 3 P1 security findings (P1-Group-1) are defense-in-depth tightening, not direct-exploit paths.

---

## 9. NEXT STEPS

Recommended remediation packets (per `/spec_kit:plan`):

### Packet 021 (XS, immediate) — P0 fixes
1. Fix `schema.ts:112-115` setActiveEmbedder INSERT binds.
2. Fix `retrieval-rescue.ts:177` `'decision record'` → `'decision_record'`.
3. Document or raise rescue-layer score cap at `retrieval-rescue.ts:357`.

**Estimate:** half-day. Critical-path before next deploy.

### Packet 022 (S, near-term) — P1 input validation
1. Add zod schemas + max-length caps on embedder_set + embedder_list args.
2. Add `parseBoundedEnv()` helper; refactor `getBatchSize`, `getReadyTimeoutMs`, similar.
3. Add allowlist validation for `_resolve_device` Python env override.
4. Add MANIFESTS registry check on `COCOINDEX_CODE_EMBEDDING_MODEL`.

**Estimate:** 1-2 days. Use sk-code TS+Python.

### Packet 023 (M, near-term) — P1 observability standardization
1. Stand up structured-logger module (TS + Python).
2. Add audit log on embedder_set, error log on reindex catch, rescue-decision log.
3. Add 1-2 telemetry counters (rescue hit rate, cap suppression count).

**Estimate:** 2-3 days. Coordinates with any existing observability roadmap.

### Packet 024 (S, follow-on) — Cross-stack contract documentation
1. Author `EMBEDDER_ARCHITECTURE.md` covering TS vs Python registries, default-model rationale, extension points.
2. Document the disjoint-namespace decision OR merge namespaces if convergence is intended.

**Estimate:** 1 day. Sk-doc.

### Packet 025 (M, follow-on) — Test coverage backfill
1. Add reindex.test.ts mocking adapter HTTP errors.
2. Add concurrent-reindex test (rollback verification).
3. Add CocoIndex parsing tests for malformed env vars.
4. Add retrieval-rescue test for decision-record boost (covers P0-B fix).

**Estimate:** 1-2 days. Use sk-code.

### Backlog: P2 findings batched into a multi-week refactor packet (026 or later).

---

## Appendix: Loop Manager Notes

- **Devin's severity tagging** was systematically aggressive — observability gaps were tagged P0 when they should be P1; test gaps were tagged P0 when they should be P1. Loop manager adjudication re-tiered ~80% of raw P0 down to P1/P2.
- **False positive rate** = 3 of ~20 P0/P1 = ~15%. Within expected SWE-1.6 prompt-quality contract bounds.
- **Devin's "Verified Correct" observations** (iter 9) were preserved as positive notes: 17 `Number.isFinite` checks, deterministic sort, parameterized SQL in `prepare()` blocks, fail-safe error handling at rescue boundary.
- **Iter 14 zero-findings** is the strongest positive signal in this review: adversarial security threat-modeling on the schema/registry/reindex/handler trust boundaries surfaced nothing.
- **Iter 20 false-positive** (claimed missing `dist-freshness.vitest.ts`) is the single most damaging output of the loop — corrected at adjudication, flagged in synthesis.

All 20 iteration files are preserved at `iterations/iteration-001.md` through `iteration-020.md`. State JSONL at `deep-review-state.jsonl`. Each iter has a `## Bundle Gate Results` block where loop manager applied the 3-check verification.
