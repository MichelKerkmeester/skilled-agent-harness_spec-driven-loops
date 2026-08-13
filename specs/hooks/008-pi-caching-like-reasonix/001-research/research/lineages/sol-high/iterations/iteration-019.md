# Iteration 19: Threat-model a cache companion

## Focus

Identify safety and correctness constraints that determine viable scope.

## Findings

- Pi packages execute arbitrary code with the user’s permissions; Pi explicitly tells users to review third-party source before installation. [SOURCE: https://pi.dev/docs/latest/packages]
- Prompt rewriting can change behavior, tool selection, safety instructions, or cache identity even when intended as a cost optimization. Observe-only mode and an explicit mutation opt-in are therefore safer defaults.
- Persisted telemetry should store numeric usage, provider/model identity, hashed session identifiers, and mutation diagnostics—not prompts, headers, credentials, or responses. This matches the optimizer’s published data-minimization design. [SOURCE: https://pi.dev/packages/pi-cache-optimizer]
- Provider capability mismatches must fail open for request correctness: strip unsupported cache hints, warn, and continue uncached rather than blocking or repeatedly retrying a request.

## Sources Consulted

- `https://pi.dev/docs/latest/packages`
- `https://pi.dev/docs/latest/security`
- `https://pi.dev/packages/pi-cache-optimizer`

## Assessment

- newInfoRatio: 0.39
- Novelty justification: Turns feasibility into explicit opt-in, privacy, and failure-mode requirements.
- Confidence: High.

## Reflection

- Worked: Security and package contracts expose the real blast radius of “small” prompt mutations.
- Failed/ruled out: Silent prompt rewriting, raw-prompt logging, and mandatory cache parameters are ruled out.

## Recommended Next Focus

Perform a final adversarial claim audit and bound the minimum viable scope.
