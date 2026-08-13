# Iteration 4: Telemetry and Non-Interactive Observability

## Focus

Turn the current TUI-oriented diagnostics into durable, machine-readable evidence without storing prompts, model output, credentials, or raw session identifiers.

## Findings

1. The reliable fix for the `/deeppi` report gap is a versioned snapshot file, not further dependence on UI event transport. The command currently constructs the complete report and immediately sends it only to `ctx.ui.notify`; a pure structured report object can feed both that display and an atomic `deep-pi-stats.json` snapshot. This makes `pi --print`, RPC clients, CI, and postmortems independent of whether Pi forwards multi-line notifications. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:64] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:80]
2. DeepPi needs two scopes rather than one lifetime file: current-session counters (reset semantics preserved) and daily cumulative totals (restart-persistent). The schema should carry `version`, local day, hashed session id, provider/model, request/cache token counts, actual cost, estimated savings, retry/edit/error counters, and `updatedAt`; it should never carry request content. `pi-cache-optimizer` already demonstrates versioned migration and hashed-session buckets. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:46] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:330] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:350]
3. `pi-cache-optimizer` persists aggregate stats but loses its most diagnostic data at reload: the last 50 per-request samples are memory-only. Persisting raw samples indefinitely is unnecessary; add bounded daily aggregates such as `missingUsageResponses`, `coldStartsObserved`, `zeroReadNonzeroWriteResponses`, persistence failures, and prompt-integrity fallbacks. This preserves operational signal with much lower privacy and storage risk. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:370] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:384] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:6818]
4. Both extensions mix user-facing strings with state production. Define structured report builders first, render TUI text from them second, and add a tiny read-only CLI (`node .../report.mjs --json`) that reads only versioned snapshots. Do not use `console.log` inside hooks: it can contaminate `pi --print` protocol output and still lacks durable framing. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:94] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:3749] [INFERENCE: separation of state, rendering, and transport makes outputs testable across Pi modes]
5. Observability needs explicit health counters, not only business metrics. For `pi-cache-optimizer`: state parse errors, state write errors, ownership-guard skips, missing usage fields, prompt-integrity fallbacks, and compat fallback activations. For `deep-pi`: transform/cost/usage errors already exist, but add persistence errors, report-write age, drift warnings, and unrecognized-model ids as bounded counts. Current persistence failures are mostly console warnings and one once-per-process UI notification. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:4066] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:7025] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:27]

## Ruled Out

- Relying on RPC notification forwarding as the canonical report transport; prior work confirmed only partial observability and the contract remains UI-shaped. [SOURCE: specs/hooks/008-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout/implementation-summary.md:60]
- Persisting prompts, tool arguments, model outputs, raw errors, headers, or raw session ids. Numeric counters, enums, timestamps, and hashed session ids are sufficient. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:370]
- A shared writable state file for both extensions. It would couple failure domains and intensify the cross-process lost-update problem; use separate files with compatible envelopes. [INFERENCE: iteration 2 persistence analysis]

## Dead Ends

- Adding another `/deeppi` textual subcommand alone cannot solve non-interactive capture because the command handler still exits through `ctx.ui.notify`. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:66]

## Edge Cases

- Ambiguous input: persistent stats means aggregate snapshots, not an unbounded event log.
- Contradictory evidence: RPC carries some UI events but has not proven full report delivery; a file snapshot avoids depending on that uncertainty.
- Missing dependencies: neither package needs a new runtime dependency for JSON snapshots and atomic rename.
- Partial success: no live Pi mode was invoked; the transport recommendation follows the observed command boundary and prior live evidence.

## Sources Consulted

- DeepPi entry point and telemetry module
- Cache optimizer state schemas, sample tracking, persistence, and diagnostics
- prior RPC follow-up evidence

## Assessment

- New information ratio: 0.80
- Novelty justification: Three findings are new designs and two consolidate prior gaps into a coherent observability contract.
- Questions addressed: telemetry/observability and maintainability.
- Questions answered: the recommended non-interactive and persistent telemetry boundary is now concrete.

## Reflection

- What worked and why: separating data, rendering, and transport makes the report independently testable.
- What did not work and why: UI-channel analysis cannot guarantee Pi runtime forwarding semantics without a live mode matrix.
- What I would do differently: prototype the snapshot reader against recorded fixture files before wiring hooks.

## Recommended Next Focus

Audit the economics formulas and design a benchmark that separates cache optimization benefit, provider pricing, cold-start write cost, and extension overhead.
