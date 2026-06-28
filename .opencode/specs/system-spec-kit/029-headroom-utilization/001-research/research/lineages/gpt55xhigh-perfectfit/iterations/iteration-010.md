# Iteration 010 - exclusion guard

## Question

What new evidence does this focus add to the perfect-fit Headroom integration proof?

## Finding

The exclusion guard must be path-based and key-based. Generated metadata is hardened by source fingerprints and strict integrity flags, MCP envelopes are schema-bound, and tool responses carry metadata/hints that must remain byte-intact. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:139-142] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:441-444] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1366-1371] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1435-1461]

## Interpretation

This iteration keeps the candidate narrow. Evidence that mutates control-plane data is rejected; evidence that supports copied-bundle compression, raw fallback, detector-only CacheAligner, or explicit exclusion guards is retained.

## Delta

- newInfoRatio: 0.66
- delta file: .opencode/specs/system-spec-kit/029-headroom-utilization/001-research/research/lineages/gpt55xhigh-perfectfit/deltas/iter-010.jsonl
