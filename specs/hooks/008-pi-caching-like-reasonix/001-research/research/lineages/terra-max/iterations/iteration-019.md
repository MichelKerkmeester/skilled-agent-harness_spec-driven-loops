# Iteration 019 — Measurement and failure modes

## Focus

What must be measured before any savings claim?

## Evidence

- Provider cache eligibility depends on a fully matching prefix, while the Pi optimizer warns that proxies and session affinity may prevent compatible behavior. [SOURCE: https://api-docs.deepseek.com/guides/kv_cache] [SOURCE: https://pi.dev/packages/pi-cache-optimizer]

## Assessment

Run controlled paired workloads and record provider/model, prompt-prefix hash, cached versus uncached tokens if exposed, cost, latency, routing/affinity, and optimizer version. Compare against a no-optimizer baseline; do not promise a percentage before that result.

## New Signal

Broadened to observability and negative controls after the convergence threshold was crossed. The preliminary convergence score is 0.03; it is telemetry only, so the loop continues to a distinct research angle.

Research iteration complete; stop policy remains `max-iterations`.
