# Iteration 009 — pi-cache-optimizer operational scope

## Focus

What does the cache optimizer actually do and not do?

## Evidence

- Its registry page describes provider-side KV/prompt-cache optimization, stable ordering, skill-list compression, compatible retention, conservative prompt-cache-key fallback, and local read-only footer statistics; it warns about proxy compatibility and session affinity. [SOURCE: https://pi.dev/packages/pi-cache-optimizer]

## Assessment

Confirmed scope: diagnostics and request shaping. Unsupported scope: universal cache control, cross-agent sharing, or guaranteed savings.

## New Signal

Turned the package name into capabilities and limits. The preliminary convergence score is 0.37; it is telemetry only, so the loop continues to a distinct research angle.

Research iteration complete; stop policy remains `max-iterations`.
