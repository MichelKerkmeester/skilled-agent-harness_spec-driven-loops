# Iteration 015 — MCP boundary

## Focus

Is MCP a first-class Pi feature or a plugin-sized gap?

## Evidence

- Reasonix documents an MCP bridge as part of its architecture. [SOURCE: https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md] Pi’s core design explicitly omits built-in MCP. [SOURCE: https://pi.dev/docs/latest/usage]

## Assessment

Confirmed core gap: Pi does not present MCP as a built-in primitive. An extension may add integration, but that is not equivalent to native first-class support.

## New Signal

Identified a real product-boundary difference without inferring implementation impossibility. The preliminary convergence score is 0.12; it is telemetry only, so the loop continues to a distinct research angle.

Research iteration complete; stop policy remains `max-iterations`.
