# Phase 2 Delta — 015 Tree-sitter vs 016 Query Expansion

## Summary

| Lane | 015 hits | 016 hits | Delta |
|---|---:|---:|---:|
| baseline-bge | 12/18 | 12/18 | +0 |
| bge-path-class | 13/18 | 12/18 | -1 |
| jina-v3 | 14/18 | 12/18 | -2 |

## Probe Flips

| Probe | Lane | 015 | 016 | Direction | 016 top1 |
|---:|---|:---:|:---:|---|---|
| 14 | bge-path-class | ✓ | ✗ | hit -> miss | `.opencode/skills/mcp-coco-index/mcp_server/tests/test_code_aware_chunker.py` |
| 10 | jina-v3 | ✓ | ✗ | hit -> miss | `.opencode/skills/system-spec-kit/references/structure/sub_folder_versioning.md` |
| 18 | jina-v3 | ✓ | ✗ | hit -> miss | `.opencode/skills/mcp-coco-index/references/tool_reference.md` |

## Verdict

- `baseline-bge` held the 015 hit rate: 12/18 -> 12/18.
- `bge-path-class` regressed by one probe: 13/18 -> 12/18, losing probe 14.
- `jina-v3` regressed by two probes: 14/18 -> 12/18, losing probes 10 and 18.
- Latency p95 improved versus the 015 markdown baseline in all lanes, but the hit-rate gate is not satisfied for bge-path-class or jina-v3.

## Notes

- An initial bench attempt without `COCOINDEX_CODE_DIR` failed with daemon spawn-lock permission errors and produced empty top-5 rows.
- A second attempt with a packet-local daemon directory failed because the AF_UNIX socket path was too long.
- The retained comparison uses `COCOINDEX_CODE_DIR=/private/tmp/c16`, which allowed the daemon to start without changing the indexed DB.
