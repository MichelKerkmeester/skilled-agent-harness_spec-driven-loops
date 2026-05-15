# Decision Record

## ADR-001: Advisor Hook Logic Moves To Advisor

Status: Accepted.

Decision: Move Claude, Codex, and Gemini advisor prompt hook implementations to `system-skill-advisor/hooks`.

Reasoning: The hook logic renders advisor freshness and recommendations. Keeping it under spec-kit required source imports into advisor internals, which violates the narrowed operator directive.

Consequence: Spec-kit retains only thin process stubs so existing runtime configs can continue invoking the old paths until configs are fully cut over.

## ADR-002: Spec-Kit Hook Stubs Are Process Boundaries

Status: Accepted.

Decision: The spec-kit hook files execute advisor compiled hooks through Node child processes instead of importing advisor code.

Reasoning: This preserves compatibility without in-process coupling.

Consequence: Tests must not import those stubs as modules; advisor hook behavior is verified from the advisor package.

## ADR-003: Advisor Tests Move With Advisor Source

Status: Accepted.

Decision: Skill-graph tests, hook tests, advisor rebuild tests, and advisor stress tests now live under `system-skill-advisor/mcp_server`.

Reasoning: Tests that import advisor handlers or libraries are advisor package tests. Keeping them under spec-kit perpetuates the forbidden import direction.

Consequence: Advisor test totals increase. Spec-kit keeps only gateway/config tests that do not import advisor source.

## ADR-004: Plugin Bridge Remains A Gateway

Status: Accepted.

Decision: Keep `spec-kit-skill-advisor-bridge.mjs` and related plugin tests in spec-kit.

Reasoning: The bridge calls advisor over MCP stdio and does not import advisor source. It is a process boundary, not a sibling source import.

Consequence: Broad greps still show plugin names containing `skill-advisor`, but not advisor source imports.

## ADR-005: Neutral Seams Are Removed Or Localized

Status: Accepted.

Decision: Delete the SQLite integrity re-export and make skill-label sanitization a local spec-kit helper.

Reasoning: Re-exporting advisor utilities from spec-kit is another in-process dependency. The sanitizer remains needed by spec-kit shared payload validation, so it is local.

Consequence: Spec-kit and advisor sanitizer implementations can diverge if behavior changes. That is preferable to a forbidden dependency.
