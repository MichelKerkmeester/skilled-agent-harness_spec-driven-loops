# JS/TS assertion follow-up: JS-ASSERT-005 (fixed)

Status: fixed in the following authorized step. The former TODO now passes;
see [implementation and calibration](asserted-js-witness-limits-2026-09-09.md).
The discovery and expected repair below are retained as historical context.

## JS-ASSERT-005 — missing witnesses lose their per-site analysis-limit provenance

Discovered while fixing JS-ASSERT-001–004. This is a reporting/provenance bug,
not another demonstrated false-positive value observation. Do not fix it silently
as part of the previous four fixes.

Reproduce:

```sh
npm run build --prefix analyzers/typescript
node --test analyzers/typescript/tests/analyze.test.mjs
```

The explicitly failing TODO uses the existing ordinary `increment` source/test
fixture, with controlled coverage and assertion-phase loading disabled. It
verifies that coverage remains, that the static observation was suppressed, and
that the corresponding site's `unmodelledShapes` should carry an analysis limit.
That final assertion fails: the list is empty. This is a parser/adapter fixture,
not fabricated evidence presented as a measured test run.

`witnessedObservation` correctly refuses a static observation without a successful
exact call witness. It puts the reason in `diagnostics.suppressedObservations`,
but does not send the affected site's uncertainty through the facts-to-join
interface. The join sees no observation and no corresponding limit, allowing a
`gap:*` reason where the analyzer cannot establish whether the assertion ran.
Absence of usable evidence is not evidence of an absent assertion.

The external comparison makes the practical problem visible: the legacy
Supergateway evidence has **no `.phases.json` files**. The stricter analyzer
emits zero observations, yet the join's 364 contractual candidates include 298
`gaps` and 66 `limits`. Those are current diagnostic counts, **not a valid
classification of the suite's protection**. They must not become a score.

Expected repair: propagate structured missing/ambiguous/failed-witness provenance
to affected candidates, preserving sites and coverage. Distinguish unavailable
capture from a known unexecuted assertion or a caught assertion failure; these
are not interchangeable. Do not restore temporal/name-based value credit or
delete affected sites to improve a denominator.

## Capability gaps and measurements, not extra bug counts

- The fresh CLI and header archives now publish and query, but `launchGateway`,
  `rpc`, and global `fetch` paths produce unrecognized operands and no modeled
  observations in those slices. Helpers need source- and instance-specific
  capture analysis. This does not mean those tests assert nothing.
- The exported `executionLinks` list contains assertion-phase-linked events,
  not an exhaustive list of all earlier statement-linked execution. Zero links
  in an asynchronous CLI test does not mean the runtime probes were removed.
- A Boolean predicate can be observed without fixing the producer's exact value.
  The fixture still calls its return candidate `evident`, while 4→9 survives
  and 4→0 fails. The label is intentionally unverified and not a mutation score.
- One fresh CLI timing pair showed roughly +29% runner duration; the header pair
  showed roughly +9.8%. These are not a controlled benchmark. Total <10% remains
  unestablished; the earlier +0.9% result was incremental marker overhead only.
- Running the existing TypeScript E2E tests without transpile-only mode exposes
  pre-existing helper typing errors natively too. Both fresh comparisons used
  `TS_NODE_TRANSPILE_ONLY=1`, with the same Node loader/mock flags and no sample
  source edits. Known-bug TODO header diagnostics were not enabled.

See [the completed batch](asserted-js-fixes-2026-09-09.md) and
[saved sample comparison](asserted-js-sample-comparison-2026-09-09.json).
