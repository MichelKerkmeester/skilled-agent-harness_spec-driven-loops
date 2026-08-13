# Iteration 006 — Pi native cache-control surface

## Focus

What does Pi expose for provider-side prompt caching?

## Evidence

- Pi custom-provider documentation supports compatibility configuration including an Anthropic-style cache-control format for selected system, tool-definition, and message content. [SOURCE: https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/custom-provider.md]

## Assessment

Partially confirmed: Pi can shape requests for provider caching; it does not document a Pi-owned universal KV cache.

## New Signal

Separated request controls from cache ownership. The preliminary convergence score is 0.55; it is telemetry only, so the loop continues to a distinct research angle.

Research iteration complete; stop policy remains `max-iterations`.
