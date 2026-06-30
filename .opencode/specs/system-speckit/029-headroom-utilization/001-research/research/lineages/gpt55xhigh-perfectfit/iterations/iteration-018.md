# Iteration 018 - edge and failure modes

## Question

What new evidence does this focus add to the perfect-fit Headroom integration proof?

## Finding

The sharp edges are controlled by exclusion rather than trust: ContentRouter can handle tool_result blocks, but the stack should not send Bash outputs, patches, readiness payloads, or JSONL state through it; Headroom passthrough handles exceptions and inflation, while the shim still denies before the library call. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/content_router.py:3000-3086] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/content_router.py:3090-3167] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:336-349]

## Interpretation

This iteration keeps the candidate narrow. Evidence that mutates control-plane data is rejected; evidence that supports copied-bundle compression, raw fallback, detector-only CacheAligner, or explicit exclusion guards is retained.

## Delta

- newInfoRatio: 0.12
- delta file: .opencode/specs/system-spec-kit/029-headroom-utilization/001-research/research/lineages/gpt55xhigh-perfectfit/deltas/iter-018.jsonl
