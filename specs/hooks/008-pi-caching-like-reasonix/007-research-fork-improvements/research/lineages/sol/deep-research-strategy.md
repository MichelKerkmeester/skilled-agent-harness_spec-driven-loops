# Deep Research Strategy: Pi Fork Improvements

## Research Topic

Find concrete, evidence-based improvements for the vendored `pi-cache-optimizer` and `deep-pi` forks across correctness, test coverage, observability, cost economics, and maintainability.

## Known Context

- The target spec has no `resource-map.md`; the coverage-map gate is informationally skipped.
- `deep-pi` cannot expose the full `/deeppi report` body non-interactively, including RPC mode.
- `deep-pi` has no persistent stats file comparable to `pi-cache-optimizer`.
- A live regression check remains unresolved because the configured OpenCode credential was missing.
- Cold-start cache writes for newly added models in `pi-cache-optimizer` are uncharacterized.

<!-- ANCHOR:key-questions -->
## Key Questions

- [x] Which correctness and failure-isolation gaps remain in each fork?
- [x] Which high-value boundary, fault-injection, and live-contract tests are missing?
- [x] How should both forks expose durable, automation-friendly telemetry without leaking sensitive content?
- [x] Which cost claims can be measured honestly, and what experiment design is needed?
- [x] Which structural changes would reduce drift and maintenance burden without over-generalizing?
<!-- /ANCHOR:key-questions -->

## Non-Goals

- Do not implement fixes.
- Do not modify either extension, sibling packet, or target spec.
- Do not treat upstream claims as proven local behavior without local evidence.

## Stop Conditions

- Complete exactly seven evidence iterations because the stop policy is `max-iterations`.
- Produce a synthesis that ranks concrete improvements and records ruled-out directions and unresolved validation dependencies.

<!-- ANCHOR:answered-questions -->
## Answered Questions

- Correctness and failure-isolation gaps: iterations 1-2.
- Boundary, fault-injection, and live-contract tests: iteration 3.
- Automation-safe telemetry: iteration 4.
- Honest cost claims and benchmark design: iteration 5.
- Maintainability, provenance, and modularization: iteration 6.
- Evidence-weighted implementation order and explicit deferrals: iteration 7.
<!-- /ANCHOR:answered-questions -->

<!-- ANCHOR:what-worked -->
## What Worked

- Source-to-spec triangulation established the ownership baseline (iteration 1).
- Transaction-level persistence tracing exposed cross-process and corruption failure modes (iteration 2).
- Responsibility-to-test mapping exposed the missing DeepPi live benchmark and concrete cache-optimizer blind spots (iteration 3).
- Separating structured data, text rendering, and transport produced an automation-safe telemetry design (iteration 4).
- Provider-semantics comparison separated valid accounting from causal savings claims (iteration 5).
- Package and export-boundary analysis exposed low-coupling stewardship controls (iteration 6).
- Adversarial ranking separated demonstrated data loss from plausible but unobserved concurrency risk (iteration 7).
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## What Failed

- Broad grep over the monolithic cache optimizer was noisy; use named-function slices.
- Static test counts differ from historical run totals and cannot serve as coverage evidence.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## Exhausted Approaches

- Additional RPC transport probing before structured snapshot production.
- One-score prioritization that obscures proof strength and dependency order.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## Ruled-Out Directions

- Broad DeepSeek matching as the ownership boundary: excludes non-direct routes incorrectly.
- Atomic rename as a substitute for transaction-level concurrency control: prevents partial files, not lost updates.
- Real credentials as the only boundary-regression proof: keep them as optional live confirmation over deterministic local integration tests.
- Footer-only cold-start measurement: inspect structured counters across first, second, and restarted requests.
- UI/RPC notifications as the canonical automation channel: persist versioned numeric snapshots instead.
- Content-bearing or cross-extension shared telemetry state: retain separate, privacy-bounded files.
- Single-pair cold/warm benchmarks and hard-coded live prices: use repeated crossover runs with price provenance.
- Shared runtime ownership modules and one-shot rewrites: prefer fixtures, characterization tests, and staged extraction.
- Locking DeepPi edits before reproducing concurrent-writer clobber: monitor and test first.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## Next Focus

[Synthesis complete; all tracked questions resolved]
<!-- /ANCHOR:next-focus -->

## Research Boundaries

- Maximum iterations: 7
- Convergence threshold: 0.05 (telemetry only before iteration 7)
- Allowed writes: this lineage directory only
