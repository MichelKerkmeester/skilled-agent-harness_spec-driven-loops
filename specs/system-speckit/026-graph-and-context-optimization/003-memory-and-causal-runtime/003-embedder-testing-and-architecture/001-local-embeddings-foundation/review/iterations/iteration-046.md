# Deep Review v4 Iteration 046 - CocoIndex search-only hardening

## Focus

Verify project-root validation and unloaded sqlite status behavior.

## Findings

| ID | Severity | Location | Evidence | Recommendation |
|----|----------|----------|----------|----------------|
| P2-V3-009-001 | P2 | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:104` | Still valid from v3: `SearchResult.rankingSignals` keeps a mutable list default. This is not part of the search-only root hardening, but it remains a low-risk protocol cleanup item. | Switch to a factory/default-safe pattern supported by the struct library, or make the field required. |

## Notes

The v3 P1s are resolved. `_validate_project_root()` rejects `..` segments at `daemon.py:179`, rejects paths outside `Path.home()` at `daemon.py:184-187`, and both `search()` and `get_status()` call it before opening `target_sqlite.db` at `daemon.py:404` and `daemon.py:456`. Workspace and home-subdir paths are valid; `/etc`, `/var`, and `../` paths are rejected before sqlite access.
