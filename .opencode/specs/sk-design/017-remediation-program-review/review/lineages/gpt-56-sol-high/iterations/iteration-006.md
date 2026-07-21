# Deep Review Iteration 006 — Security Integration Boundaries

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-gpt-56-sol-high-1784650021792-031fvi`
- Generation / lineage: `1` / `new`
- Budget profile: `verify`
- Scope: validated 118-file `goal-file-manifest.txt` at pinned HEAD `7b9d3b6b71`
- Structural caveat: Code Graph was unavailable by dispatch contract; direct manifest-scoped reads and focused executable tests were used.

## Files Reviewed

- `.opencode/skills/sk-design/styles/lib/engine/style-library.mjs`
- `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs`
- `.opencode/skills/sk-design/styles/lib/database/retrieval.mjs`
- `.opencode/skills/sk-design/styles/lib/database/operator.mjs`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/tests/corpus-baseline-v3.test.ts`
- `.opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs`
- `.opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs`
- `.opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs`
- `.opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs`
- The manifest-listed adapter, retrieval, operator, and four mode-corpus test files.

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **P1-006 — Post-query generation drift is mislabeled as no-fit in every corpus consumer** -- `.opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:503` -- Each consumer detects that the query generation differs from the context-plan generation, but passes `no-fit` into its negative-proof builder. That bypasses the builders' existing `generation-mismatch` branch, records a target-derived/no-fit fallback instead of `requery-required`, and lets callers continue without an explicit stale-generation recovery signal [SOURCE: `.opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:374-403`] [SOURCE: `.opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:503-508`] [SOURCE: `.opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:681-710`] [SOURCE: `.opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:854-855`] [SOURCE: `.opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:471-500`] [SOURCE: `.opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:622-628`] [SOURCE: `.opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:509-538`] [SOURCE: `.opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:808-815`].
   - Finding class: cross-consumer
   - Scope proof: All four manifest-listed production corpus classifiers contain the same post-query generation comparison and all four hard-code `no-fit`; each negative-proof builder already defines distinct `generation-mismatch` / `requery-required` semantics. The seven focused suites passed 76/76, including current concurrent-generation tests, proving the behavior is stable rather than incidental.
   - Affected surface hints: audit comparison fallback; foundations relationship fallback; interface exemplar fallback; motion evidence fallback; stale-generation requery orchestration
   - Recommendation: Pass `generation-mismatch` through each post-query mismatch branch and assert the resulting proof/fallback requires requery while preserving the current no-source-influence containment.

```json
{"findingId":"P1-006","type":"trust-boundary-classification","claim":"All four corpus consumers detect post-query generation drift but classify it as no-fit, suppressing their existing requery-required proof state.","evidenceRefs":[".opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:374-403",".opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:503-508",".opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:681-710",".opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:854-855",".opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:471-500",".opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:622-628",".opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:509-538",".opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:808-815"],"counterevidenceSought":"Reviewed the mismatch warnings, negative-proof containment, and passing concurrent-generation tests in all four suites. The current path blocks stale hydration and retains a warning.","alternativeExplanation":"Treating generation drift as a safe no-fit may be deliberate because it prevents source influence and permits target-derived work.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade only if the governing contract explicitly defines post-query generation mismatch as no-fit and proves no caller relies on the proof state's requery-required branch."}
```

### P2 Findings

None.

## Traceability Checks

- `stale_generation_fallback_classification`: **fail** — all four consumers preserve a warning but emit `no-fit` instead of their modeled `generation-mismatch` / `requery-required` state; recorded as `P1-006`.
- `adapter_error_propagation`: **partial** — legacy async rejection and persistent-mode failures propagate; shadow mode converts synchronous persistent failures to typed shadow evidence, but the focused suite does not inject every synchronous/asynchronous failure shape [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:152-165`] [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:331-355`].
- `md_generator_child_process_boundary`: **pass-by-read** — nonzero exit, spawn error, and signal termination throw before parse; malformed stdout fails JSON parsing and is converted to a failed preparation result [SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:75-90`] [SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:128-177`].
- `persistent_generation_and_path_guards`: **pass** — generation mismatch, corpus/style realpath containment, and artifact digest mismatch refuse hydration; focused database tests passed [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:189-200`] [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:229-257`].

## Integration Evidence

- Pinned Git evidence: `HEAD` resolved to `7b9d3b6b71`.
- Executable evidence: adapter, retrieval, operator, and all four manifest-listed mode-corpus suites passed 76/76.
- Exact integration surfaces reviewed: `style-library.mjs`, `persistent-adapter.mjs`, database `retrieval.mjs` and `operator.mjs`, md-generator `study-prepare.ts`, and the four production corpus fallback classifiers.

## Edge Cases

- The generation-mismatch warning and no-source-influence result contain stale data, so the finding is P1 rather than P0; the defect is the loss of required requery semantics at a trust boundary.
- The md-generator backend dependency installation remains absent, so its TypeScript suite was not executed. Child-process malformed/nonzero behavior is direct-read evidence only.
- Code Graph was unavailable. Structural-impact analysis remains unavailable, but all named consumers were enumerated from the validated manifest.
- The existing publication-digest finding was not retried because no new counterevidence changed it.

## Confirmed-Clean Surfaces

- `study-prepare.ts` rejects nonzero/signal/spawn failures before parsing and catches malformed JSON at the preparation boundary [SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:75-90`] [SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:172-176`].
- Persistent hydration rejects stale generations and path escapes and verifies artifact digests before returning bytes [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:189-200`] [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:229-257`].
- Unknown corpus retrieval exceptions are rethrown; only known availability failures enter fallback in all four consumers.

## Ruled Out

- P0 stale-source consumption: mismatch branches do not hydrate the mismatched generation, and current tests confirm no stale source influence.
- Publication-digest re-adjudication: exhausted by prior iterations and unchanged in this pass.
- Path-escape bypass: direct guards and focused tests support fail-closed behavior.

## Next Focus

- Dimension: traceability (second-pass evidence)
- Focus area: test-to-claim closure for active findings and unexecuted adversarial seams
- Reason: iteration 006 found a stable cross-consumer classification defect while child-process and adapter failure coverage remains partly read-only
- Rotation status: security second-pass complete; rotate to a distinct evidence-quality pass for iteration 007
- Blocked/productive carry-forward: Code Graph and md-generator Vitest remain unavailable; manifest-scoped test assertions and packet claims remain productive; do not repeat publication-digest or stale-generation discovery without changed evidence
- Required evidence: map active P1 claims to executable assertions, identify false-positive completion evidence, and distinguish blocked tests from missing tests

Review verdict: CONDITIONAL
