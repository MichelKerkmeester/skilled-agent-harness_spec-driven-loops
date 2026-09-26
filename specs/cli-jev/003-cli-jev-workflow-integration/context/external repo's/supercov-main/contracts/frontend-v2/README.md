# Language-frontend protocol v2

Status: **frozen and sole supported protocol**. This is the boundary between a
language-specific producer and the single Rust Supercov engine. It does not
create language-specific analyzers. A frontend discovers and transforms
source, connects to its runtime/compiler/test runner where unavoidable, and
contributes normalized facts. Rust owns every verdict and product policy after
that boundary.

`test` represents ordinary test-body execution when a runner can identify the
test phase but cannot causally attribute execution to an action or assertion.
There is no legacy protocol reader.

A runner may catalog a selected test that never starts because of fail-fast or
an earlier infrastructure stop. That record has status `unstarted`, exact
logical test identity, and no scope, worker, retry, phase, flaky verdict or
observations. Inventing attempt identity for it is forbidden; attaching any
attempt data to it is fatal.

## Per-run declaration

Each evidence-v3 archive contains one strict `FrontendRunDeclaration`.
Attribution is declared for every runner actually observed in the run, not
once for an entire language. A single command may contribute multiple runner
declarations. `exact` requires causal identity in the evidence; `aggregate`
means observations are deliberately pooled; `unavailable` means the producer
cannot observe that axis. Every non-exact axis requires a named, runner-scoped
limitation. `structuralLimitations` must exactly reference IDs in the frozen
manifest. Timestamps never establish causal attribution.

## Required contributions

A frontend contributes only:

1. A complete structural manifest before execution, including exact source
   obligations, scope and located denominator limitations.
2. Observations naming frozen obligations. Unknown IDs or metadata drift are
   fatal; obligations cannot be added after execution starts.
3. Run, worker, test, retry and phase identity at the declared precision.
4. Setup, test, action, assertion, teardown and background transitions with
   run-unique, same-attempt, acyclic causal references.
5. Explicit limitations for every missing denominator or attribution surface.

The Rust engine alone merges manifests and evidence, selects terminal
outcomes, computes coverage and MC/DC witnesses, minimizes tests, persists
runs and answers queries. A frontend calculating those verdicts is a second
engine and violates this contract.

## Structural sources

- `owned-probes`: Supercov inserts and observes its own probes.
- `native-import`: an external engine supplies development-oracle facts.
- `mixed`: owned and oracle facts coexist in a development conformance run.

Product declarations must use `owned-probes`. Native imports and mixed mode
are development-only and may never become a user-run fallback.

## Product ownership policy

The protocol can represent `native-import` and `mixed` declarations so that
development conformance harnesses can pass oracle facts through the same
validator and analyzer. Those structural sources are not product execution
modes. Every declaration produced by a user run must use `owned-probes`:
Supercov discovers and injects its own instrumentation from the existing test
command without invoking or requiring an external coverage engine.

Oracle importers are compile-gated development infrastructure. They may emit
fixtures for differential tests, but product orchestration must never select
them and distribution packages must not depend on their external engines.

Unknown fields are fatal. Any semantic change requires a deliberate new
protocol version; archive framing remains independently versioned.
