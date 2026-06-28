# Iteration 017 - acceptance criteria

## Question

What new evidence does this focus add to the perfect-fit Headroom integration proof?

## Finding

The acceptance gate should be measurable: path/key guard rejects every excluded artifact class, Headroom returns raw content on errors or inflation, citation sets are equal before/after for cited bundles, estimated token saving is positive and above threshold, and a prepared-env live run succeeds with telemetry/update checks off. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:262-278] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:336-349]

## Interpretation

This iteration keeps the candidate narrow. Evidence that mutates control-plane data is rejected; evidence that supports copied-bundle compression, raw fallback, detector-only CacheAligner, or explicit exclusion guards is retained.

## Delta

- newInfoRatio: 0.18
- delta file: .opencode/specs/system-spec-kit/029-headroom-utilization/001-research/research/lineages/gpt55xhigh-perfectfit/deltas/iter-017.jsonl
