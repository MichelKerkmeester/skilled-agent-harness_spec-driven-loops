# Iteration 12: Audit MCP and RPC boundaries

## Focus

Verify whether MCP is a Pi core capability, how it relates to RPC, and whether either belongs in the smallest caching-plugin scope.

## Findings

- Pi's official usage documentation explicitly describes the core as intentionally small and says it does not include built-in MCP, sub-agents, plan mode, to-dos, permission popups, or background bash. These workflows can be built or installed as extensions or packages. [SOURCE: https://pi.dev/docs/latest/usage]
- Pi RPC is a headless JSON protocol over stdin/stdout for embedding Pi or building custom UIs. It is a process-control surface, not an MCP client/server implementation. [SOURCE: https://pi.dev/docs/latest/rpc]
- The local cli-pi integration references preserve the same boundary: third-party MCP packages and Pi RPC should not be conflated with first-party core features. [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/references/mcp-and-third-party-packages.md]
- MCP is not necessary for a prompt-cache optimizer. Adding it would enlarge the trust, lifecycle, and configuration surface without improving prefix stability or provider cache telemetry. It is a separate integration choice, not part of the minimal plugin contract. [INFERENCE: https://pi.dev/docs/latest/usage; https://pi.dev/docs/latest/rpc]

## Ruled Out

- Treating “Pi has RPC” as evidence that Pi has first-party MCP is ruled out.
- Including MCP as a required dependency of the caching plugin is ruled out for the minimal scope.

## Dead Ends

- Searching RPC docs for cache-sharing primitives is a dead end; RPC transports agent control messages and does not define provider prompt caching.

## Questions Remaining

- Is native plan mode absent only from core, or already covered by maintained packages?
- Are checkpoint and rewind gaps similarly filled by packages?

## Sources Consulted

- `https://pi.dev/docs/latest/usage`
- `https://pi.dev/docs/latest/rpc`
- `.opencode/skills/cli-external-orchestration/cli-pi/references/mcp-and-third-party-packages.md`
- `.opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md:23-32`

## Assessment

- newInfoRatio: 0.49
- Novelty justification: The MCP claim is resolved at the core/package boundary and removed from the caching-plugin dependency set.
- Confidence: High for the official core boundary; medium for the quality and maintenance status of third-party packages.

## Reflection

- What worked and why: Official usage and RPC docs make the protocol distinction explicit.
- What did not work and why: Package ecosystem quality cannot be inferred from core documentation.
- What I would do differently: Evaluate a specific MCP package only if the product requirements make MCP an explicit user-facing feature.

## Recommended Next Focus

Audit plan-mode availability: native Pi core versus community extension, and whether cache work needs a planning workflow at all.

