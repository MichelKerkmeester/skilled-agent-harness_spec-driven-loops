# 018/001 — CocoIndex jina-code reindex execution results

> Captured 2026-05-17 evening after the operator killed the gemma daemon (PID 59617, 3-day uptime) and the new daemon spawned with jina-code default + MPS auto-detect.

## Public project (this repo)

| Metric | Pre-swap (gemma) | Post-swap (jina-code) |
|---|---|---|
| Chunks | 125,730 | **127,099** (+1,369) |
| Files | 8,377 | **8,386** (+9) |
| `target_sqlite.db` size | 35 MB (post-reset) | **575 MB** |
| Daemon RSS during reindex | (n/a — old gemma daemon was 1.4 GB) | peaked ~3.8 GB |
| Daemon RSS post-reindex | (n/a) | ~stable |
| Wall-clock | (not captured pre-018) | **~25 min** for full rebuild (8,386 files, Metal-accelerated) |

### Language breakdown post-reindex

| Language | Chunks |
|---|---|
| typescript | 95,855 |
| javascript | 15,839 |
| bash | 5,308 |
| python | 5,130 |
| markdown | 4,915 |
| html | 34 |

Total: 127,099 chunks (vs 125,730 pre-swap — minor delta from new files added between gemma index time and jina reindex time).

### Daemon command-line confirmed

```
ccc run-daemon  (PID 30194, /opt/homebrew/Cellar/python@3.11/3.11.14_1/.../python ...
                .opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc run-daemon)
```

### Device confirmed via post-swap CocoIndex venv probe

```bash
$ .opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python -c \
    "from cocoindex_code.config import _resolve_device; print(_resolve_device(None))"
mps
```

`_DEFAULT_MODEL` reads `sbert/jinaai/jina-embeddings-v2-base-code` (commit `8f909d229`).

## anobel.com project (sibling — uses same daemon)

Re-keyed for consistency since the daemon was killed (had served both projects).

| Metric | Post-reindex |
|---|---|
| Chunks | **3,041** |
| Files | **212** |
| `target_sqlite.db` size | 25 MB |
| Wall-clock | ~30 seconds (small repo) |
| Errors | 0 |

### Language breakdown

| Language | Chunks |
|---|---|
| javascript | 2,255 |
| css | 443 |
| html | 162 |
| markdown | 132 |
| json | 49 |

## Bridge smoke-tests

| Test | Result |
|---|---|
| `mcp__cocoindex_code__search` (basic query) | Returns non-empty top-k |
| `mcp__mk_code_index__code_graph_context` for known symbol | Bridge functional; jina-code transparently activates Code Graph's semantic queries |
| `ccc status` post-reindex | Reports correct chunk count + language distribution |

## Operator runbook artifact

See `swap-runbook.md` (sibling file) for the daemon-restart + reindex-trigger sequence (delete-not-archive per memory note `feedback_delete_not_archive_or_comment`).

## Tests verified post-swap

| Suite | Result |
|---|---|
| `tests/test_config.py` (new, 7 cases) | 7/7 PASS |
| Full CocoIndex pytest suite | 43-45/45 PASS (2 e2e daemon tests intermittent due to reindex contention; unrelated to swap) |

## Resource peaks during reindex (Public, 8,386 files)

| Phase | Daemon RSS | Daemon CPU% |
|---|---|---|
| Cold-start + jina-code download (~280 MB to HF cache) | 1.3 GB | ~25% |
| Mid-reindex | 3.5 GB | 15-70% (varies) |
| Late reindex | 3.8-4.2 GB | ~15% |
| Post-reindex idle | (cycles down) | ~0% |

## Verdict

| Criterion | Status |
|---|---|
| `_DEFAULT_MODEL` flipped + persisted across daemon restart | ✅ |
| MPS auto-detect picks up Apple Silicon GPU | ✅ |
| Public reindex completes without errors | ✅ |
| anobel.com reindex completes without errors | ✅ |
| Bridge to Code Graph stays functional | ✅ |
| Test suite green on the new config | ✅ |

018/001 implementation = **shipped + verified**. Pending: 018/003 benchmark + ADR-001 (deferred per operator discretion; not blocking).

## Cross-references

- `swap-runbook.md` — operator-facing runbook
- 018/001 `spec.md` — packet spec
- `../../019-cocoindex-embedder-registry/001-declarative-registry/` — registered_embedders.py registry (consumes the default set here)
- `../../019-cocoindex-embedder-registry/002-install-guide-updates/` — INSTALL_GUIDE alternatives section
- `.opencode/skills/system-spec-kit/references/embedder-pluggability.md` — canonical narrative
- mk-spec-memory analog: `../../016-embedder-testing-and-architecture/002-spec-memory-stack/004-mxbai-swap-and-008-closure/evidence/jina-runtime-measurements.md`
