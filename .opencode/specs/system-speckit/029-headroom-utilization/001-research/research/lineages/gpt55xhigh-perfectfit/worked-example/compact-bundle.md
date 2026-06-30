# Compact Bundle - Citation-Preserving Worked Example

This is a deterministic research-side compact candidate for a copied, non-authoritative bundle. It is not a live Headroom run; the live import is a validation gate because local dependencies are unavailable in this fan-out environment.

## Answer Probes Preserved

- Best-fit surface: offline Headroom library compression over copied prompt-pack/tool-output bundles, not active control-plane envelopes.
- CacheAligner result: zero-conflict detector-only, but not sufficient alone because it does not mutate messages and therefore cannot create token savings.
- Guard shape: path allowlist plus denylist for generated metadata/state/envelopes, JSON key denylist, raw sha256 sidecar, citation-set equality, inflation fallback, and raw passthrough on exception.
- Reversibility: retain raw bundle by sha256 and require deterministic re-run; optional CCR retrieve-by-hash is useful only when the compression output actually contains CCR markers.

## Source Files Retained
- .opencode/specs/system-spec-kit/029-headroom-utilization/001-research/research/lineages/gpt55xhigh/iterations/iteration-003.md
- .opencode/specs/system-spec-kit/029-headroom-utilization/001-research/research/lineages/gpt55xhigh/iterations/iteration-007.md

## Citation Set Retained
- [SOURCE: .opencode/skills/system-spec-kit/constitutional/memory-system-spec-kit-only.md:24]
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:133]
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:208]
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1246]
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1435]
- [SOURCE: .opencode/skills/system-spec-kit/references/memory/save_workflow.md:291]
- [SOURCE: .opencode/skills/system-spec-kit/references/memory/save_workflow.md:317]
- [SOURCE: .opencode/skills/system-spec-kit/references/memory/save_workflow.md:325]
- [SOURCE: .opencode/skills/system-spec-kit/references/memory/save_workflow.md:360]
- [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:333]
- [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:443]
- [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/cli/learn.py:75]
- [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/cli/proxy.py:750]
- [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:100]
- [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:111]
- [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/learn/writer.py:347]
- [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/proxy/output_shaper.py:253]
- [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/proxy/output_shaper.py:289]
- [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/telemetry/beacon.py:1]
- [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/cache_aligner.py:1]
- [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/cache_aligner.py:266]
- [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/smart_crusher.py:190]
- [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/tag_protector.py:97]
- [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/llms.txt:67]

## Minimal Evidence Summary

Round 1 already narrowed the candidates to detector-only CacheAligner and tightly scoped offline compress(). Round 2 confirms CacheAligner is valuable as a diagnostic but not as the token-saving integration. The perfect-fit integration is the offline library call over a copied bundle, with system/developer prompts, generated metadata, JSONL state, envelopes, hook payloads, code-graph readiness payloads, and source citations excluded by guard before compression.
