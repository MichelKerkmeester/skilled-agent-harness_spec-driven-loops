---
title: "Summary: 016/002/007 Auto-Embedder Selection + llama-cpp Purge"
description: "Implementation summary and commit handoff for bootstrap auto-selection and llama-cpp purge."
trigger_phrases: ["016/002/007 summary", "auto embedder selection handoff"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/007-auto-embedder-selection-and-llama-cpp-purge"
    last_updated_at: "2026-05-18T22:16:45Z"
    last_updated_by: "cli-codex"
    recent_action: "Implemented bootstrap auto-selection, purge, docs, and tests"
    next_safe_action: "Run operator-side live smoke, then stage commit"
    blockers:
      - "Live daemon kill/restart smoke blocked: sandbox returned operation not permitted for ps/kill against PID 4790."
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedder-auto-selection.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002007"
      session_id: "016-002-007-summary-codex"
      parent_session_id: "016-002-007"
    completion_pct: 92
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 016/002/007 Auto-Embedder Selection + llama-cpp Purge

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|---|---|
| Status | In Progress — live-smoke blocker |
| Branch | main |
| Commit | Not committed per instruction |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. What Was Built

- Added `shared/embeddings/auto-select.ts` with bootstrap probes for Voyage, OpenAI, Ollama, then hf-local.
- Wired daemon bootstrap through `ensureActiveEmbedder()` so empty `vec_metadata` is populated with `active_embedder_name`, `active_embedder_dim`, and `active_embedder_provider`.
- Added a filesystem lock around auto-selection so concurrent daemon starts do not both write the active pointer.
- Replaced the hardcoded `embeddinggemma-300m` default with the `{ name: "auto", dim: 0 }` sentinel.
- Removed the llama-cpp provider path from source, dependency metadata, generated sidecars, tests, setup scripts, and docs under `.opencode/skills/system-spec-kit/`.
- Removed `embeddinggemma-300m` from the embedder registry.
- Added `mcp_server/tests/embedder-auto-selection.vitest.ts` covering all four tiers, fail-fast diagnostics, persistence, and write-race serialization.
- Updated architecture, resilience, install guide, provider docs, and the spec-memory-stack changelog.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. How It Was Delivered

The implementation keeps `getActiveEmbedder()` synchronous by returning the `auto` sentinel when metadata is empty. Daemon startup is the async boundary: `context-server.ts` initializes the DB, calls `ensureActiveEmbedder()`, and exits with a clear error if no tier is reachable. This avoids hiding network and Python probes in ordinary read paths.

The purge started from the required grep inventory and ended with the same grep command returning no output for `.opencode/skills/system-spec-kit/`.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. Key Decisions

- Chose an `auto` sentinel plus async daemon bootstrap rather than making `getActiveEmbedder()` async. That preserved existing handler/reindex call sites.
- Persisted provider alongside name and dimension so status/debug surfaces can distinguish `ollama` from cloud or hf-local selections.
- Kept legacy DB and GGUF artifacts untouched. Operator deletion remains a manual post-upgrade step.
- Deleted stale checked-in source sidecars under `shared/embeddings/`; rebuilt `shared/dist` and `mcp_server/dist` from TypeScript.
- Removed stale ignored dist artifacts whose sources were deleted so runtime scans no longer expose the retired native path.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. Verification

| Gate | Result |
|---|---|
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | PASS |
| `npx vitest --run embedder-auto-selection` from `mcp_server/` | PASS, 8 tests |
| `npx vitest --run embedder-ollama` from `mcp_server/` | PASS, 16 tests |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` | PASS |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | PASS |
| `git grep -l 'llama-cpp\|node-llama-cpp\|embeddinggemma\|LlamaCppProvider' .opencode/skills/system-spec-kit/` | PASS, no output |
| Live daemon restart smoke | BLOCKED by sandbox process permission: `ps` and `kill -0 4790` returned operation not permitted |

Observed existing Jina DB state:

```text
context-index__ollama__jina-embeddings-v3__1024.sqlite
vec_1024 rows: 227
vec_metadata: active_embedder_name=jina-embeddings-v3, active_embedder_dim=1024
```

`active_embedder_provider` is absent in the existing DB because the daemon could not be restarted inside this sandbox to exercise the new bootstrap writer.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. Known Limitations

- Live integration still needs an operator-side restart of the spec-memory daemon PID 4790 or equivalent launcher restart. The sandbox would not allow `ps` or `kill`.
- Broad old benchmark/manual docs were normalized as part of the purge, but only the requested targeted test gates were run.
<!-- /ANCHOR:limitations -->

## Commit Handoff

Do not physically delete these legacy artifacts until the new auto-selected DB is verified after reindex:

```text
.opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite      732M
.opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite-shm   32K
.opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite-wal   0B
```

GGUF artifacts found, not deleted:

```text
/Users/michelkerkmeester/.cache/huggingface/gguf/embeddinggemma-300m/embeddinggemma-300M-F32.gguf   1.1G
/Users/michelkerkmeester/.cache/huggingface/gguf/embeddinggemma-300m/embeddinggemma-300M-BF16.gguf  584M
/Users/michelkerkmeester/.cache/huggingface/gguf/embeddinggemma-300m/embeddinggemma-300M-Q8_0.gguf  313M
```

Suggested staging list:

```bash
git add \
  .opencode/skills/system-spec-kit/ \
  ':(exclude).opencode/skills/system-spec-kit/mcp_server/database/.mk-spec-memory-launcher.json' \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/CHANGELOG.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/007-auto-embedder-selection-and-llama-cpp-purge/
```

Deleted files include the llama-cpp availability/provider sidecars, old llama-cpp tests, install/migration scripts, and obsolete local native-runtime test/playbook/catalog files. Because this environment cannot create git index locks, use `git status --short` to review deletions before staging.

Commit subject:

```text
feat(016/002/007): auto-embedder selection + purge llama-cpp surface
```
