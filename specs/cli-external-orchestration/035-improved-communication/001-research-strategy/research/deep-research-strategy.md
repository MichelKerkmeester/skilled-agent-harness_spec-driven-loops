# Deep Research Strategy: Provider-Neutral CLI Display Projection

## Topic

Reverse engineer the claudish-to-english architecture and select a provider-neutral display-projection architecture across Claude, Codex, Pi, OpenCode, Devin, and Cursor while preserving canonical state.

## Key Questions

- [x] What behavior and risks define the reference architecture?
- [x] What is the safest presentation boundary in each CLI?
- [x] What immutable normalized event model covers all six runtimes?
- [x] How must assembly handle streaming, ordering, concurrency, cancellation, and retry?
- [x] How can protected spans and validation reject fidelity loss?
- [x] How should hosted and local provider routing enforce privacy?
- [x] How should perceptual 1:1 parity and operations be evaluated?
- [x] What downstream phases and gates should inherit this evidence?

## Known Context

- The phase packet and read-only reference were loaded before dispatch.
- Two independent lineages completed 7 and 3 iterations under `max-iterations` stop policy.
- The merged registry contains 97 attributed findings from 10 canonical deltas.
- `resource-map.md` was absent at initialization; the workflow emitted `research/resource-map.md` from final lineage deltas.

## Non-Goals

- No production implementation, packaging, deployment, provider configuration, or reference mutation.
- No canonical transcript, model-context, tool-event, tool-input, or tool-result mutation.

## What Worked

- Combining exact local file evidence with current primary sources.
- Independent lineages that converged on the same canonical-state invariant.
- A fixtures-first state-machine analysis that made unknown runtime fields explicit.
- Deterministic protected-span and exact-original gates before perceptual scoring.

## What Failed or Was Limited

- DeepSeek state timestamps did not match the observed subprocess window and cannot prove chronology.
- The workflow resource-map title inherited the full safety-bound research topic and is verbose.
- Primary documentation establishes integration families but not every version-pinned event field.

## Ruled-Out Directions

- Universal lifecycle hooks, canonical message mutation, pre-validation suppression, prompt-only fidelity, LLM-judge authorization, implicit local-to-hosted fallback, and content-bearing telemetry.

## Active Risks

- Runtime and provider drift require pinned fixtures and dated probes.
- Atomic replacement remains unsupported until each runtime fixture proves it.
- Perceptual similarity cannot override deterministic or semantic failures.

## Stop Conditions

- DeepSeek completed exactly 7 iterations.
- GPT completed exactly 3 iterations.
- Both stop reasons are `maxIterationsReached`.
- All ten canonical iteration validators pass.
- Canonical synthesis and resource map exist.

## Next Focus

Plan downstream Phase 002, contracts and fixtures, using `research/research.md` as the canonical architecture evidence.
