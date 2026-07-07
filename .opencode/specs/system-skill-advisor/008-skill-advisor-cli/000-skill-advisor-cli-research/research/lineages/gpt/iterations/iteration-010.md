# Iteration 10: KQ10 Verdict Synthesis

## Focus

Synthesize go/no-go, architecture pick, effort, inheritance list, and spec-memory corrections.

## Findings

1. Verdict: go for a dual-stack CLI, no-go for MCP removal. MCP stays canonical; CLI supplies resilience, scriptability, and universal fallback [SOURCE: file:opencode.json:47].
2. Architecture: generated Node CLI over existing handlers/compat modules, with launcher/IPC auto-spawn only for warm daemon access. Python remains a legacy `advisor_recommend` facade until callers migrate.
3. Effort: medium. Estimated 3 implementation packets: CLI registry/schema/exit map, Python reconciliation plus parity tests, lifecycle/hook integration with orphan reaping tests.
4. Inherits verbatim from spec-memory: thin IPC client, launcher auto-spawn, exit map, generated subcommands from canonical registry, warm-only hook policy, owner-lease single writer.
5. Skill-advisor corrections: trusted graph mutations, in-process prompt cache, semantic shadow/embedder state, Python compatibility shim, and graph watcher generation semantics are skill-advisor-specific and cannot be assumed from spec-memory.
6. Terminal answer: zero feature loss is feasible only if the CLI wraps/adapts all 9 MCP tools and treats daemon-backed features explicitly; it is not feasible by blessing the current Python script alone.

## Sources Consulted

- All prior iteration evidence
- Runtime configs and registry files

## Assessment

`newInfoRatio`: 0.42. Low novelty by design; synthesis pass consolidated rather than expanding the evidence set.

## Reflection

What worked: separating architecture verdict from legacy Python disposition. What failed: no further evidence was needed. Ruled out: MCP removal and Python-only CLI.

## Recommended Next Focus

Begin implementation with D1-D4 as the first packet.
