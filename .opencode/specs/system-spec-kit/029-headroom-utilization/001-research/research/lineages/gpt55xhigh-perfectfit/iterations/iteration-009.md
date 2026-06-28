# Iteration 009 - config knobs

## Question

What new evidence does this focus add to the perfect-fit Headroom integration proof?

## Finding

The safe entry point is compress() with narrow CompressConfig: compress_system_messages=False, compress_user_messages=False unless the input is a copied document/tool bundle, protect_analysis_context=True, conservative target_ratio, and kompress_model="disabled" for offline operation. Headroom has inflation and exception passthrough. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:100-135] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:262-278] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:336-349]

## Interpretation

This iteration keeps the candidate narrow. Evidence that mutates control-plane data is rejected; evidence that supports copied-bundle compression, raw fallback, detector-only CacheAligner, or explicit exclusion guards is retained.

## Delta

- newInfoRatio: 0.72
- delta file: .opencode/specs/system-spec-kit/029-headroom-utilization/001-research/research/lineages/gpt55xhigh-perfectfit/deltas/iter-009.jsonl
