---
title: "Blocker: CocoIndex Rust Core Environment Initialization"
description: "Remaining 009 blocker after the search-only path patch."
---

# Blocker

ROOT_CAUSE: Rust core, requires upstream fork patch.

Explicit refresh/index still fails before Python `indexer.py` can sweep source-code
languages. The failing path is:

```text
ProjectRegistry.update_index()
  -> ProjectRegistry.get_project()
  -> Project.create()
  -> coco.Environment(settings, context_provider=context)
  -> cocoindex._internal.core.abi3.so core.Environment(...)
  -> RuntimeError: Operation not permitted (os error 1)
```

Evidence:

- `scratch/index-refresh.txt` captures `ccc index` failing with
  `Daemon error: Operation not permitted (os error 1)`.
- `/private/tmp/coco009/daemon.log` captures the traceback from
  `cocoindex/_internal/environment.py:231` into the compiled Rust extension.
- The existing `target_sqlite.db` remains searchable through the patched
  search-only path, but its language distribution is still `markdown: 1335`.

Impact:

- `refresh_index=false` search is unblocked by the Python patch.
- `refresh_index=true` / `ccc index` cannot satisfy REQ-006 until the Rust-core
  environment initialization error is fixed or bypassed by an indexing fallback.
