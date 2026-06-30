# Iteration 013 - fidelity and reversibility

## Question

What new evidence does this focus add to the perfect-fit Headroom integration proof?

## Finding

Reversibility is viable in two layers: the lineage shim keeps a raw sha256 sidecar for deterministic restore/re-run, and Headroom CCR can store originals by hash and retrieve full content locally when CCR markers are used. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/ccr/mcp_server.py:359-413] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/ccr/mcp_server.py:415-483] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/cache/compression_store.py:261-388] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/cache/compression_store.py:390-451]

## Interpretation

This iteration keeps the candidate narrow. Evidence that mutates control-plane data is rejected; evidence that supports copied-bundle compression, raw fallback, detector-only CacheAligner, or explicit exclusion guards is retained.

## Delta

- newInfoRatio: 0.44
- delta file: .opencode/specs/system-spec-kit/029-headroom-utilization/001-research/research/lineages/gpt55xhigh-perfectfit/deltas/iter-013.jsonl
