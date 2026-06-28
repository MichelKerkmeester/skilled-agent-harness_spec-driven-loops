# Iteration 019 - final perfect-fit spec

## Question

What new evidence does this focus add to the perfect-fit Headroom integration proof?

## Finding

Final spec: offline Headroom compress() over copied non-authoritative prompt-pack/tool-output bundles, with compress_system_messages=False, compress_user_messages=False unless the bundle is explicitly a copied document/tool object, protect_analysis_context=True, kompress_model="disabled", inflation fallback, raw sha256 sidecar, citation equality check, and CacheAligner detector-only telemetry. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:100-135] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/cache_aligner.py:214-222]

## Interpretation

This iteration keeps the candidate narrow. Evidence that mutates control-plane data is rejected; evidence that supports copied-bundle compression, raw fallback, detector-only CacheAligner, or explicit exclusion guards is retained.

## Delta

- newInfoRatio: 0.08
- delta file: .opencode/specs/system-spec-kit/029-headroom-utilization/001-research/research/lineages/gpt55xhigh-perfectfit/deltas/iter-019.jsonl
