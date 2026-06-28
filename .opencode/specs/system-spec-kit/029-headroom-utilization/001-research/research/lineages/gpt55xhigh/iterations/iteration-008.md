# Iteration 008: Recommendation and Eliminated Alternatives

## Focus

Rank adoption paths and close the matrix.

## Findings

Recommended order:

1. Pilot `compress()` library in offline harness mode over copied deep-loop context bundles and large natural-language tool outputs. Guardrails: `compress_system_messages=False`, preserve recent turns, no generated metadata, no tool envelopes, exact citation preservation checks.
2. Use CacheAligner as detector-only observability if prompt-cache diagnostics are desired.
3. Evaluate Headroom MCP as an explicit manual helper, not auto-installed, and not named as a replacement for `mk-spec-memory`, `mk-skill-advisor`, or `mk-code-index`.
4. Evaluate RTK separately for shell-output shortening; Headroom bundles it, but our stack can assess it independently.
5. Do not adopt proxy, wrap, output-shaper, `headroom learn`, or cross-agent memory into core workflows now.

## Evidence

- The library returns originals on compression failure and has an inflation guard. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:262] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:336]
- CacheAligner explicitly says the prompt is never rewritten. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/cache_aligner.py:272]
- Headroom MCP compress stores originals with a hash and exposes retrieve. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/ccr/mcp_server.py:359] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/ccr/mcp_server.py:511]
- The deep-loop workflow requires canonical iteration/delta records, so adoption must stay out of machine-owned state. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:756]
- The hook system requires runtime-specific prompt-time context and fallback paths, so proxy-level mutation is not a first adoption target. [SOURCE: .opencode/skills/system-spec-kit/references/config/hook_system.md:108]

New information ratio: 0.18.

## Eliminated Alternatives

- Core proxy adoption now: rejected for prompt mutation and routing opacity.
- Auto-register Headroom MCP everywhere: rejected until a separate tool namespace and usage policy are defined.
- Use `headroom learn`: rejected because it writes AGENTS/native instruction surfaces outside Spec Kit Memory.
- Use cross-agent memory: rejected because it creates a second memory system.
- Use output-shaper for all runs: rejected because deep-loop and gate reasoning need stable prompts and effort policy.
