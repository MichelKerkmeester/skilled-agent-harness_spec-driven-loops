# Iteration 11: Audit Pi context-engine capabilities

## Focus

Compare the `lumo.md` “Context Engine v2” gap claim with Pi's native compaction, branch summarization, and extension lifecycle.

## Findings

- Pi already has two native context-management mechanisms: compaction for long sessions and branch summarization when navigating the session tree. Both track file operations and use structured summaries. [SOURCE: https://pi.dev/docs/latest/compaction]
- Pi's compaction and branch-summary requests use fresh routing session IDs and, where supported, disable prompt-cache writes because one-off summaries are unlikely to be reused. This is a deliberate cache-aware behavior, not an absence of context-engine logic. [SOURCE: https://pi.dev/docs/latest/compaction]
- Extensions can intercept `session_before_compact` and `session_before_tree`, inspect preparation data, cancel, or provide a custom summary with usage and custom details. That makes a context-policy extension feasible without replacing Pi's session manager. [SOURCE: https://pi.dev/docs/latest/compaction]
- The lumo “Context Engine v2” proposal is therefore not a description of a missing Pi primitive. It is a possible policy layer for stable-prefix preservation and cache diagnostics around existing compaction; its value depends on improving provider cache reuse without degrading summary correctness. [SOURCE: .opencode/specs/cli-external-orchestration/039-pi-caching-like-reasonix/lumo.md:23-32; INFERENCE: https://pi.dev/docs/latest/compaction]

## Ruled Out

- Claiming that Pi lacks any native context engine or compaction path is ruled out by the official compaction documentation.

## Dead Ends

- Replacing Pi's compaction implementation solely to improve cache reuse is a dead end until a controlled benchmark shows the native path causes material cache loss.

## Questions Remaining

- Is a cache-oriented compaction policy better expressed as a separate extension or as a contribution to Pi's existing compaction hooks?
- What cache diagnostics survive compaction without exposing prompt contents?

## Sources Consulted

- `https://pi.dev/docs/latest/compaction`
- `https://pi.dev/docs/latest/extensions`
- `.opencode/specs/cli-external-orchestration/039-pi-caching-like-reasonix/lumo.md:23-32`

## Assessment

- newInfoRatio: 0.52
- Novelty justification: The context-engine gap is narrowed from missing core capability to a possible cache-preservation policy around documented Pi mechanisms.
- Confidence: High for Pi's native compaction and hook surface; medium for whether a custom policy improves real cache rates.

## Reflection

- What worked and why: The official compaction page exposes both behavior and extension interception points in one place.
- What did not work and why: Documentation cannot show the cache-rate impact of custom summaries.
- What I would do differently: Benchmark native versus custom compaction using identical post-compaction prefixes.

## Recommended Next Focus

Check the MCP claim: distinguish Pi core, RPC, and community MCP packages before treating MCP as a caching-plugin requirement.

