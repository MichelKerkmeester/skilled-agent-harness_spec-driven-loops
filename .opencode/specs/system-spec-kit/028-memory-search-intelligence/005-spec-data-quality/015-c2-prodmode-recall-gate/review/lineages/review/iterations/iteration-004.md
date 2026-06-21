# Iteration 004 — Maintainability / Completeness

Dimension: Maintainability · Target: `015-c2-prodmode-recall-gate` (spec-folder, PLANNED) · Lineage: review

## Scope

Audited design completeness and maintainability of the planned packet: whether the "thin wrapper" reuse claim is achievable from the harness's actual export surface, and whether the new gold-set file has a defined path into the harness retrieval loop. Doc-sync (spec/plan/tasks) also checked.

## Observations & Findings

### F002 [P2] "Thin wrapper" understates the non-lens orchestration the gate must replicate

The plan describes the gate as a *"thin gate wrapper over an unchanged measurement harness"* reusing `buildSearchLenses` + `meanCompleteRecallProfile` + `MEASURABILITY_CLASSES` [SOURCE: plan.md:85, spec.md:116]. Those three symbols are exported, but the orchestration that turns them into a `prodMode.completeRecallAt3` number is NOT: `prepareEvalDatabase` (copy-DB + shard backup) [SOURCE: run-eval-v2.mjs:107-122], the six dist-module dynamic imports [SOURCE: run-eval-v2.mjs:259-266], `groupGroundTruth` [SOURCE: run-eval-v2.mjs:200-211], and the per-query retrieval loop [SOURCE: run-eval-v2.mjs:286-289] all live inside `main()` and are unexported. To produce a verdict the gate must re-implement that scaffolding. This is not lens logic, so REQ-005 ("no lens logic duplicated") is not violated — but the "thin" framing under-scopes the build (plan effort estimate 4-6h for core may be optimistic). Advisory; the design remains feasible.

Category: `completeness` · finding_class: `instance-only` · content_hash: `f002-thin-wrapper-orchestration`

### F003 [P2] Gold-set → harness wiring is unspecified (no golden-file loader exists)

The harness sources ground truth from `GROUND_TRUTH_QUERIES` / `GROUND_TRUTH_RELEVANCES` filtered by `q.category ∈ MEASURABILITY_CLASSES` [SOURCE: run-eval-v2.mjs:272-277], i.e. from the compiled `ground-truth-data.js` module — there is no loader for an external `spec-corpus-golden.json`. The spec introduces `spec-corpus-golden.json` as a new gold-set file [SOURCE: spec.md:92] but neither spec nor plan states how its queries/relevances enter the retrieval path (extend `ground-truth.json`, or have the gate load the JSON and build its own `relevancesByQuery` for `meanCompleteRecallProfile`). The seam is implementable but currently undocumented; naming it now prevents an implementer guessing. Advisory.

Category: `completeness` · finding_class: `instance-only` · content_hash: `f003-goldenset-wiring-unspecified`

### Doc-sync (CHK-040)

spec/plan/tasks/checklist/implementation-summary agree on Status PLANNED, completion 0, and the same four key files [SOURCE: spec.md:56, plan.md:18, tasks.md:18, checklist.md:143, implementation-summary.md:56]. The only cross-doc inconsistency is the stale harness-export premise already captured as F001 (iteration-003); it propagates identically through spec/plan/tasks, so it is one finding, not three. No additional doc-sync finding.

## New-Finding Ratio

findingsNew: 2 (2×P2) · newFindingsRatio: 0.15

Review verdict: PASS
