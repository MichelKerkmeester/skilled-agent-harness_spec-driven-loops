# Iteration 7: Establish Pi’s core versus extension boundary

## Focus

Determine whether Pi is “missing” features or intentionally delegates them to packages.

## Findings

- Pi describes itself as a minimal terminal coding harness whose core stays small while extensions, skills, prompts, themes, and packages provide workflow-specific behavior. [SOURCE: https://pi.dev/docs/latest]
- Pi explicitly lists MCP, sub-agents, permission popups, plan mode, to-dos, and background bash as intentionally absent from core, while stating they can be added by extensions or packages. [SOURCE: https://pi.dev/docs/latest/usage]
- Therefore “missing in Pi” is ambiguous: absent from core does not mean unavailable on the Pi platform or infeasible as an extension.
- Any feasibility comparison must classify core, built-in provider adapter, first-party catalog/documentation, and third-party package surfaces separately.

## Sources Consulted

- `https://pi.dev/docs/latest`
- `https://pi.dev/docs/latest/usage`

## Assessment

- newInfoRatio: 0.64
- Novelty justification: Introduces the architectural classification needed to avoid false gap claims.
- Confidence: High.

## Reflection

- Worked: Pi’s own design-principles text directly resolves why several features are absent from core.
- Failed/ruled out: Equating “not built in” with “not supported by Pi” is ruled out.

## Recommended Next Focus

Verify Pi’s built-in prompt-caching and provider compatibility controls.
