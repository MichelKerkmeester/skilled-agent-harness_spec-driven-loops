# Iteration 11: Audit optimizer behavior and limits

## Focus

Determine what `pi-cache-optimizer` adds beyond Pi core.

## Findings

- The package reorders uniquely identifiable stable prompt content, compresses skill listings, requests supported long retention, and adds a conservative OpenAI-compatible `prompt_cache_key` fallback. [SOURCE: https://pi.dev/packages/pi-cache-optimizer]
- It diagnoses proxy/session-affinity compatibility and persists local numeric cache counters; it does not control or clear provider caches. [SOURCE: https://pi.dev/packages/pi-cache-optimizer]
- Its documentation explicitly calls caching provider-side and best-effort, acknowledging hidden proxy routing, unsupported parameters, and missing upstream usage fields. [SOURCE: https://github.com/jiangge/pi-cache-optimizer]
- The package already overlaps most credible “Reasonix-style caching plugin” scope. A new plugin needs a demonstrable gap rather than a renamed duplicate.

## Sources Consulted

- `https://pi.dev/packages/pi-cache-optimizer`
- `https://github.com/jiangge/pi-cache-optimizer`

## Assessment

- newInfoRatio: 0.61
- Novelty justification: Maps the package to concrete mutations, diagnostics, and hard provider boundaries.
- Confidence: High for documented behavior; live effectiveness untested.

## Reflection

- Worked: The package README is specific enough to construct an overlap matrix.
- Failed/ruled out: A greenfield plugin that merely reorders prompts and shows cache counters is ruled out as duplicate scope.

## Recommended Next Focus

Verify whether Pi extension hooks expose enough surface for safe cache policy and diagnostics.
