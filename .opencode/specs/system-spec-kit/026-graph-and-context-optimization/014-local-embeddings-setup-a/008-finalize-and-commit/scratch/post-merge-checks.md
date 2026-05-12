---
title: "014 Post-Merge Verification Checklist"
description: "Manual verification steps to run after the 014 bundled commit lands on main."
---

# 014 Post-Merge Verification Checklist

Run these checks after `git commit` lands, in roughly this order.

## 1. Memory side (immediate)

```bash
# In Claude Code or any MCP-connected runtime:
memory_health()
```

Expected:
- `embeddingProvider.provider == "hf-local"`
- `embeddingProvider.model == "onnx-community/embeddinggemma-300m-ONNX"`
- `embeddingProvider.dimension == 768`
- `embeddingProvider.healthy == true`
- `consistency.status == "healthy"`
- `vecRowsTotal == ftsRowsTotal == memoryCount` (currently 2112)
- `embeddingRetry.circuitBreakerOpen == false`

If any are off → see `004-vec-store-rebuild/implementation-summary.md §Known Limitations`.

## 2. Cocoindex side (after 009 ships)

```bash
# Once 009 lands:
ccc search "embedding initialization" --limit 3
```

Expected (post-009):
- Returns ≥1 result without hanging or msgspec errors
- Top result has plausible file path + score

If still broken → 009 is the open follow-on packet.

## 3. Voyage egress check (24h)

```bash
bash .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/007-voyage-cleanup-and-egress-monitoring/scratch/tcpdump-verify.sh
```

Run for 24h. Expected: 0 packets captured. If non-zero, investigate which process is calling api.voyageai.com (lsof + ps) and confirm whether it's a system-level tool (e.g. Zed) or a project-level regression.

## 4. q4 opt-in (optional)

If you want the smaller-RAM / faster-warm-path q4 variant:

```bash
echo 'HF_EMBEDDINGS_DTYPE=q4' >> .env.local
```

Restart Claude Code or `/mcp reconnect spec_kit_memory`. Verify:

```bash
# Next memory_health() should report unchanged dim (still 768) but dtype isn't in the standard health output.
# Confirm via launcher stderr:
grep "dtype=q4" ~/Library/Caches/claude-cli-nodejs/.../mcp-logs-spec-kit-memory/*.jsonl | tail
```

If you flip q4 on, run `memory_index_scan({ force: true })` to re-embed under the new dtype. **Caveat**: existing fp32 vectors and new q4 queries occupy the same DB until the rescan completes; transient mismatch is expected.

## 5. Disk reclaim verification

```bash
ls -lah .opencode/skills/system-spec-kit/mcp_server/database/context-index*
```

Expected: ONLY the hf-local sqlite triplet (`.sqlite`, `.sqlite-shm`, `.sqlite-wal`). No `voyage` or generic `context-index.sqlite` files.

## 6. Secrets rotation (one-time, P0)

The following secrets appeared in this session's chat transcript and should be rotated:

1. **Voyage API key** `pa-6hBdS8...`: https://dash.voyageai.com/api-keys
2. **HF read token** `hf_...`: https://huggingface.co/settings/tokens (then update `~/.cache/huggingface/token` mode 600)
3. **GitHub PAT** `github_pat_11ATXQZPA...`: https://github.com/settings/tokens (then update `.env` line 12)

## 7. 009 follow-on

If 009 hasn't shipped at commit time, the cocoindex query path is broken. Workarounds:

- Direct sqlite-vec KNN (see `004-vec-store-rebuild/implementation-summary.md §Known Limitations 8`)
- Use spec-kit-memory `memory_search` for code-related queries (it doesn't cover code chunks, but covers spec docs which include code references)

Track 009's status: `009-cocoindex-ipc-fix/tasks.md`.

## 8. Re-pin the venv if you clone elsewhere

If you set up Setup A on a new machine, the cocoindex venv may default to an editable install pointing at a sibling repo (Barter, fs-enterprises, etc). To self-pin:

```bash
cd .opencode/skills/mcp-coco-index/mcp_server
./.venv/bin/pip install -e . --no-deps
cat .venv/lib/python3.11/site-packages/cocoindex_code-*.dist-info/direct_url.json
# Should report the Public path, not any sibling.
```

See memory note `feedback_public_venv_editable_install_must_be_self.md` for the full rationale.
