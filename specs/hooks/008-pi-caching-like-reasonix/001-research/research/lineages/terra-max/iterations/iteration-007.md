# Iteration 007 — Pi’s DeepSeek-specific cache path

## Focus

Can Pi directly reproduce DeepSeek cache behavior?

## Evidence

- The Pi optimizer documents stable-before-dynamic ordering, provider compatibility, and a conservative prompt-cache-key fallback; DeepSeek requires a fully matching prefix. [SOURCE: https://pi.dev/packages/pi-cache-optimizer] [SOURCE: https://api-docs.deepseek.com/guides/kv_cache]

## Assessment

An extension can improve request discipline and diagnostics, but cannot force upstream cache state or routing affinity.

## New Signal

Joined agent-side ordering with provider-side constraints. The preliminary convergence score is 0.49; it is telemetry only, so the loop continues to a distinct research angle.

Research iteration complete; stop policy remains `max-iterations`.
