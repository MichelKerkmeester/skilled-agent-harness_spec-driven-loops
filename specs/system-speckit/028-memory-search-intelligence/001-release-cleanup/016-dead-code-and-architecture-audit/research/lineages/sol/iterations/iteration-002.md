# Iteration 002: MCP-server shared contracts

## Focus

Audit shared payload, trust, and metrics layers across the three MCP packages.

## Findings

1. The shared-payload contract exists as three package-local implementations totaling 2,373 lines. Skill-advisor explicitly calls its 1,099-line version a duplicate, while CI requires local copies instead of cross-skill imports. This is intentional isolation with CAT-5/CAT-6 drift cost. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp-server/lib/shared/shared-payload.ts:2] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp-server/lib/shared/shared-payload.ts:4] [SOURCE: file:.github/workflows/isolation-check.yml:43] [SOURCE: file:.github/workflows/isolation-check.yml:66]
2. Code-graph imports a metrics surface in four production modules, but the implementation always returns `false` and both metric methods are no-ops. The local README confirms this is intentionally inert until a collector exists, making the call-site scaffolding CAT-6. [SOURCE: file:.opencode/skills/system-code-graph/mcp-server/lib/shared/metrics-stub.ts:5] [SOURCE: file:.opencode/skills/system-code-graph/mcp-server/lib/shared/metrics-stub.ts:9] [SOURCE: file:.opencode/skills/system-code-graph/mcp-server/lib/shared/README.md:105]

## Sources Consulted

- The three `shared-payload.ts` implementations.
- `.github/workflows/isolation-check.yml:43-126`
- `rg -n 'metrics-stub|isSpeckitMetricsEnabled|speckitMetrics' .opencode/skills/system-code-graph/mcp-server`

## Assessment

- New information ratio: 0.86
- Confidence: high; both duplication and inertness are explicitly documented.

## Reflection

The duplicate contracts are not accidental dead files. The simpler seam is a neutral versioned package, but current CI policy deliberately forbids that shape.

## Recommended Next Focus

Trace deep-loop transactional and resume layers into the active YAML workflows.
