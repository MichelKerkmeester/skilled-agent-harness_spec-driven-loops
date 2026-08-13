# Iteration 018 — Smallest credible cache-plugin scope

## Focus

What is the smallest viable Reasonix-style Pi cache enhancement?

## Evidence

- The existing optimizer already implements provider-aware ordering, compatibility checks, and local cache statistics. [SOURCE: https://pi.dev/packages/pi-cache-optimizer] Pi extensions can add commands, UI, footers, and session helpers. [SOURCE: https://pi.dev/docs/latest/extensions]

## Assessment

Recommended scope is a companion/extension layer: deterministic stable-prefix assembly, provider/route diagnostics, cache-hit/cost telemetry, and measurement export. Do not rebuild a generic Context Engine, MCP layer, or workspace checkpoint system in v1.

## New Signal

Narrowed the proposal to a composable enhancement rather than a Reasonix clone. The preliminary convergence score is 0.04; it is telemetry only, so the loop continues to a distinct research angle.

Research iteration complete; stop policy remains `max-iterations`.
