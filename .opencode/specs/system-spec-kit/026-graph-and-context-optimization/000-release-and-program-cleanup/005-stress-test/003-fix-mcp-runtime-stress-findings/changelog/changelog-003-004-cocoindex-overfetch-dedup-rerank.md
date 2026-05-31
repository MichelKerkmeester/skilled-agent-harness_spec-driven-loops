---
title: "CocoIndex over-fetch, canonical-identity dedup, path-class rerank"
description: "All six REQs from the 005 stress-test mirror-duplicate and ranking findings landed in the vendored cocoindex-code soft-fork as version 0.2.3+spec-kit-fork.0.2.0. Over-fetch, dedup by canonical identity, bounded path-class reranking now ship together."
trigger_phrases:
  - "cocoindex dedup rerank"
  - "cocoindex mirror duplicate fix"
  - "cocoindex over-fetch canonical identity"
  - "REQ-018 REQ-019 remediation"
  - "path class reranking cocoindex"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/004-cocoindex-overfetch-dedup-rerank` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

The 005 stress-test surfaced two CocoIndex retrieval defects. REQ-018 showed the same research markdown chunk returning ten times under mirror paths (`.gemini/`, `.agents/`, `.claude/`, `.codex/`, `specs/`, `.opencode/specs/`). Effective unique-result rate was 10%. REQ-019 showed implementation-intent queries returning nine duplicate markdown notes ahead of the actual implementation source.

The patch set resolved both defects by landing all six requirements in the vendored `cocoindex-code` soft-fork, bumped to version `0.2.3+spec-kit-fork.0.2.0`. The layered fix excludes mirror roots at index time, adds canonical identity fields for reliable dedup at query time. It also applies bounded path-class reranking so implementation source surfaces above research notes for code-intent queries. Live daemon probes (`ccc index`, `ccc search`) were blocked by sandbox AF_UNIX and log-write restrictions and remain pending outside the Codex environment.

### Added

- `source_realpath` and `content_hash` fields on every chunk row in `indexer.py` plus `schema.py` for canonical identity
- `path_class` field per the 007 taxonomy (`implementation`, `tests`, `docs`, `spec_research`, `generated`, `vendor`) on every chunk row
- Over-fetch logic in `query.py` fetching `limit * 4` nearest-neighbor candidates before dedup
- Dedup pass in `query.py` grouping by `(source_realpath, start_line, end_line)` with `content_hash` fallback
- `dedupedAliases` plus `uniqueResultCount` telemetry fields on query responses
- `rankingSignals` field per result row listing applied boosts and penalties

### Changed

- `query.py` rerank pass applies a bounded `+0.05` boost for `implementation` results and a `-0.05` penalty for `spec_research` and `docs` results on implementation-intent queries
- `protocol.py`, `daemon.py`, `server.py`, `cli.py` updated to pass the new telemetry fields through daemon IPC, MCP, CLI display
- `.cocoindex_code/settings.yml` exclude list expanded to cover `.gemini/specs`, `.codex/specs`, `.claude/specs`, `.agents/specs` mirror roots

### Fixed

- REQ-018: mirror-path duplicates no longer flood query results. Dedup by canonical identity collapses alias rows to one unique chunk per logical location.
- REQ-019: implementation source no longer ranks behind nine markdown duplicates. Path-class reranking surfaces `implementation`-class files above `spec_research`-class notes for code-intent queries.

### Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Source location identified | PASS | Vendored source at `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/` |
| Vendor-vs-fork decision | PASS | Phase 1 soft-fork commit `3711ad221` moved source into repo |
| `ccc --version` | PASS | Reports `0.2.3+spec-kit-fork.0.2.0` |
| Reinstall editable fork | PASS | `bash .opencode/skill/mcp-coco-index/scripts/install.sh` completed |
| `ccc reset` | PASS | `ccc reset --force` deleted `cocoindex.db` and `target_sqlite.db` |
| Query dedup unit probe | PASS | `_dedup_and_rank_rows` produced `dedupedAliases=1`, `uniqueResultCount=2`, implementation result above spec research |
| Protocol telemetry round-trip | PASS | `SearchResponse` msgpack round-trip preserved `dedupedAliases=2`, `uniqueResultCount=1`, `rankingSignals=['implementation_boost']` |
| Python syntax | PASS | `python3 -m py_compile` passed for all patched files |
| `ccc index` live probe | BLOCKED | Sandbox denies daemon log/socket startup (`AF_UNIX path too long` or `Operation not permitted`) |
| `pytest` | BLOCKED | `No module named pytest` in sandbox venv |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | Adds `source_realpath`, `content_hash`, `path_class` fields per chunk in the write path |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Adds over-fetch, canonical-identity dedup, bounded path-class reranking, raw score preservation, telemetry signals |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/schema.py` | Extends chunk and result dataclasses with the six 009-requirement fields |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | Extends the CocoIndex table schema dataclass with the new columns |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | Passes `dedupedAliases`, `uniqueResultCount`, `rankingSignals` through daemon IPC |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Forwards new telemetry fields from the query response through the daemon layer |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py` | Exposes new telemetry fields in MCP query responses |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | Displays `dedupedAliases`, `uniqueResultCount`, `rankingSignals` in `ccc search` output |
| `.opencode/skill/mcp-coco-index/mcp_server/pyproject.toml` | Version bumped to `0.2.3+spec-kit-fork.0.2.0` |
| `.cocoindex_code/settings.yml` | Exclude patterns added for `.gemini/specs`, `.codex/specs`, `.claude/specs`, `.agents/specs` mirror roots |

### Follow-Ups

- Run `ccc reset && ccc index` outside the Codex sandbox after schema migration to confirm live dedup and rerank behavior with the new index.
- Verify REQ-018 repro ("semantic search vector embedding implementation") returns one unique chunk per logical location after reindex.
- Verify REQ-019 repro ("code graph traversal callers query") returns implementation source in top 3 after reindex.
- Add `pytest` to the sandbox venv or run the test suite in a normal shell environment to close the blocked test gate.
