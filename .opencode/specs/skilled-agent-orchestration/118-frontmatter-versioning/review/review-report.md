# Deep Review Report (Synthesis): 153-frontmatter-versioning

**Target:** the frontmatter-versioning work in spec `153-frontmatter-versioning` (engine, standard, validators, templates, spec docs).
**Executors:** 2 lineages via cli-opencode — `mimo` (`xiaomi/mimo-v2.5-pro`, 5 iterations) + `deepseek` (`opencode-go/deepseek-v4-pro`, 5 iterations). Both converged, all 4 dimensions covered.
**Per-lineage detail:** `review/lineages/mimo/review-report.md`, `review/lineages/deepseek/review-report.md`.

---

## Verdict: CONDITIONAL

| | P0 | P1 | P2 |
|---|---:|---:|---:|
| MiMo | 0 | 3 | 8 |
| DeepSeek | 0 | 6 | 16 |
| **Consensus** | **0** | doc/traceability only | advisory |

**Both models independently reached the same conclusion:** the implementation is functionally **complete, correct, and verified** — **zero P0, zero correctness defects, zero real security defects**. Every P1 is **documentation / traceability drift**, not a code or behavior problem. The engine is deterministic, idempotent, and the corpus is fully versioned and gated.

---

## Consensus findings (both models flagged — highest confidence)

| # | Finding | Severity | Status |
|---|---------|----------|--------|
| C1 | The five child `plan.md` + `tasks.md` are unfilled scaffold templates | P1 | Open — policy decision (populate vs. retire) |
| C2 | Parent `graph-metadata.json` `derived.status` is `planned` and `last_active_child_id` is null despite all phases complete | P1 | **Verified still stale** (memory-save did not refresh it) |
| C3 | spec.md scope numbers are inaccurate: "~2,500" vs actual 2,222; "~436 core docs" vs actual 457 | P1/P2 | Verified |
| C4 | The build-segment cap `W=99` and the `.mjs` (not `.ts`) engine name are not reflected in the spec text | P2 | Verified |

## DeepSeek-only P1 (verified real)

- **Child `spec.md` `_memory.continuity` blocks still show `completion_pct: 0`** while `Status: Complete`. The impl-summaries were updated to 100, but the spec.md continuity blocks were not. (Also: all-zero `session_dedup` fingerprints, scaffold `recent_action` text in a couple.)

## Notable P2 advisories (union)

- Engine: dead `const trailing` variable (**FIXED this pass**); unbounded anchor cache (negligible at current scale); 64 MB git `maxBuffer` ceiling (no real file approaches it); no path-boundary check on writes (low risk for a dev tool); shell wrapper doesn't verify `node` exists.
- Docs: parent execution-model text implies MiMo byte-edited docs, but the engine was the sole writer (MiMo audited read-only); Phase 4 leaf count "~1,700" vs actual 1,753; no `checklist.md` (correctly N/A — phase-parent + Level-1 children don't require one).

---

## What this means

The reviews are a strong signal: two independent models, ten iterations, **found no correctness or security defect** in the engine, standard, validators, or applied corpus. The CONDITIONAL verdict is entirely about **spec-doc accuracy and continuity hygiene** — the gap between the (green, verified) implementation and the spec text/metadata that describes it. That gap exists because the implementation work and the impl-summaries were kept current while the child `spec.md` continuity blocks, `plan.md`/`tasks.md` stubs, and parent metadata were not.

## Remediation (a ~30-minute doc-reconciliation pass, not code work)

1. **Refresh metadata** (C2): re-run the graph backfill on the parent + children so `derived.status` and `last_active_child_id` reflect completion.
2. **Reconcile child continuity** (DeepSeek P1): set child `spec.md` `_memory.continuity.completion_pct: 100` to match `Status: Complete`.
3. **Correct counts** (C3): spec.md "~2,500"→"2,222", "~436"→"457", "~1,700"→"1,753".
4. **plan/tasks policy** (C1): either populate the five `plan.md`/`tasks.md` from the impl-summaries, OR document that `implementation-summary.md` is the authoritative planning surface for this pattern. **Operator decision.**
5. **Doc nits** (C4): document `W=99` and the `.mjs` engine name in the standard/spec.

**Applied this pass:** the dead `trailing` variable was removed from `frontmatter-version.mjs`.
