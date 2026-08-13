# Iteration 17: Classify cost control and monitoring

## Focus

Determine which observability claims are already covered and what still needs proof.

## Findings

- Pi session and RPC surfaces expose tokens, cost, current context usage, and normalized cache read/write usage. [SOURCE: https://pi.dev/docs/latest/rpc]
- Pi sessions show current session information including tokens and cost. [SOURCE: https://pi.dev/docs/latest/sessions]
- `pi-cache-optimizer` adds persistent provider/model counters, compatibility diagnosis, and process/session/day scopes without storing prompts or credentials. [SOURCE: https://pi.dev/packages/pi-cache-optimizer]
- Verdict: “cost control runtime partial” and “logging/monitoring partial” are directionally fair, but the proposed dashboard is not a prerequisite: core plus optimizer already provides the measurement substrate. Live provider-billing reconciliation remains the missing validation layer.

## Sources Consulted

- `https://pi.dev/docs/latest/rpc`
- `https://pi.dev/docs/latest/sessions`
- `https://pi.dev/packages/pi-cache-optimizer`

## Assessment

- newInfoRatio: 0.44
- Novelty justification: Separates existing telemetry from the unproven attribution and billing-reconciliation layer.
- Confidence: High.

## Reflection

- Worked: Normalized usage fields define an objective benchmark input.
- Failed/ruled out: Treating a footer hit percentage alone as verified savings is ruled out.

## Recommended Next Focus

Test the claim that cached content can be shared among concurrent agents.
