# Deep Review Report — packet 011 styles-library utilization (phases 004–010)

**Verdict: PASS after remediation.** 0 P0. All confirmed P1/P2 defects fixed and covered by adversarial regression tests. Whole-packet suites green: 184/184 `node --test` + 167/167 design-md-generator Vitest.

---

## Method

Two review passes ran after all seven implementation phases (004–010) were built, per-phase adversarially reviewed, fixed, validated, and integrated:

1. **Fanout deep-review** — 3 concurrent `gpt-5.6-sol` (high, fast) lineages via the deep-loop runtime over the packet's spec/plan/tasks. It converged with **0 P0**; its findings were spec/traceability-level or already-implemented (it read the requirement docs, not the code, and re-flagged items that were in fact built — e.g. path-containment, injection-neutralization, the seam package). Not the authoritative pass.
2. **Cross-phase code review** — 3 concurrent `gpt-5.6-sol` (xhigh, fast) lineages reading the **integrated `.mjs`/`.ts`** with distinct lenses: (A) cross-phase integration correctness, (B) authority-order + anti-slop holistically, (C) security/correctness invariants. This is the authoritative pass; it targeted defects **between** phases that the per-phase reviews structurally could not see.

## Findings (code review) — 0 P0, 13 P1, 2 P2, all remediated

Remediation ran as 4 parallel fix agents over disjoint file trees (engine / md-generator / seam+consumers / transport); each added a guard-specific regression test that fails if its guard is removed.

| # | Finding | Sev | Fix |
|--:|---------|:---:|-----|
| 1 | `generation-mismatch` plan could still hydrate the observed generation (consumers stopped only on `unavailable`; validator enforced state↔outcome one way) | P1 | Validator enforces the equivalence both ways; all four consumers fail closed before hydration on mismatch |
| 2 | Hydration trusted poisoned manifest records (compared only generationHash, then read slug/artifacts from the caller manifest) | P1 | Hydration bound to the re-derived live record / full-record equality |
| 3 | Top-level corpus reads (`_manifest.json`, `_retrieval-manifest.json`) skipped realpath containment | P1 | Same realpath-containment applied; escaping symlinks → `path-escape` |
| 4 | Phase 010 forked the phase-007 corpus contract (flattened, incompatible; excluded `unavailable`) | P1 | 010 adopts the canonical CORPUS_CONTEXT_PLAN shape; all five outcomes representable |
| 5 | 010 grounding receipt self-attested; digest only pattern-checked; contradictory enum combos passed | P1 | Receipt bound to a hydrated proof snapshot; exhaustive cross-field outcome consistency |
| 6 | Reconciliation could declare `aligned` from pre-call evidence + a transport-echoed hash | P1 | Alignment derived from actual returned artifact evidence vs the frozen proposal; divergence surfaced |
| 7 | Raw payload could escape via unbounded server-controlled `artifacts[]`/`files[]` metadata | P1 | Artifact metadata derived from trusted tool semantics; count/size bounded |
| 8 | Relationship claims (interface/audit/foundations) cloned from caller input, unbound to hydrated evidence | P1 | Closed artifact-backed attestation (mirroring motion); unattested relations rejected |
| 9 | Shared validator residual value-level bypass (`transformation.summary`/`fallback.reason` free strings; partial cross-field checks) | P1 | Typed enums + exhaustive cross-field consistency for all five outcomes |
| 10 | `corpus-changing` (concurrent mutation) rethrown by every consumer instead of a validated negative | P1 | Normalized centrally to a closed `unavailable`/`no-fit` outcome |
| 11 | Open Design capability/daemon outage converted back into a throw | P1 | Closed metadata-only unavailable reconciliation record; throws reserved for invalid contracts |
| 12 | A corpus advisory policy could be **upgraded** to `hard`/`target` via override (blocking a target) | P1 | Bidirectional immutability — corpus categories can never become hard/target |
| 13 | STUDY `leakReference` (collected literals/brands/assets/URLs) exported and persisted to `study-context.json` | P1 | `leakReference` kept in-process only; no source literal in the handoff/sidecar |
| 14 | `schemaDigest` was 32-bit FNV-1a (collision found) | P2 | SHA-256 over the canonicalized schema |
| 15 | STUDY trusted `candidate.contentHash` unbound to hydration; report emitted `variant.name` unescaped (XSS) | P2 | Content hash bound to hydrated bytes; HTML-escaped report sinks |

## Verification

- `node --test` across engine + seam + interface/audit/foundations/motion + transport: **184/184 pass, 0 fail** (up from 149 baseline; +35 adversarial regressions).
- `design-md-generator` Vitest: **167/167 pass**, `tsc --noEmit` clean (+5 regressions).
- Confirmed invariants that held pre-remediation: `build --check` re-derives the real 1,290-record manifest deterministically; phase 006 injection-neutralization keeps raw exemplar text out of the prompt; phase 010 deep-freezes mode inputs before its first await; no wall-clock/random in byte-stable committed content.
