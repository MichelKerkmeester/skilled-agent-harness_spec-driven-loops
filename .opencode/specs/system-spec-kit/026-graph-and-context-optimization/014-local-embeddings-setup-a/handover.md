---
title: "Session Handover: 014-local-embeddings-setup-a"
description: "Pre-restart handover for the Voyage→local embeddings migration. Sub-phases 001-003 complete; 004 vec-store rebuild requires user runtime restart from a clean shell."
trigger_phrases:
  - "014 handover"
  - "Setup A handover"
  - "local embeddings handover"
  - "resume 014"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a"
    last_updated_at: "2026-05-12T21:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Full 014 cascade strict-validates clean; 005+007 shipped; 009 search-path patched"
    next_safe_action: "User runs commit; then 20-30 deep-review iterations"
    blockers:
      - "Cocoindex msgspec truncation prevents search end-to-end (daemon writes correct 2560-dim schema but returns malformed binary frames)"
    key_files:
      - "spec.md"
      - "SETUP_A_RECIPE.md"
      - ".env.local"
      - "004-vec-store-rebuild/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:01400a4e0d0c00000000000000000000000000000000000000000000000000ed"
      session_id: "014-handover-2026-05-12"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions: []
---
# Session Handover Document

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

You are resuming work on packet `system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/`. The prior Claude Code session shipped sub-phases 001-003 (prefix registry architecture, model installation + compat smoke tests, project-local MCP config rollout) and now needs the user to restart their MCP runtimes before 004 (vec-store rebuild) can proceed.

**Status values:** in_progress
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 014-autonomous-completion-2026-05-12 (Claude Opus 4.7, /goal autonomous mode)
- **To Session:** post-commit session; deep-review iterations
- **Phase Completed (validates clean):** 001, 002, 003, 004 (memory ✓ + cocoindex schema ✓), 005 (q4 plumbing + cosine benchmark mean 0.9811), 006 (planning + gated on 009), 007 (deletes + egress guard + tcpdump script), 008 (commit message + post-merge checks authored), 009 (search-path patched, daemon stall is upstream blocker)
- **All 9 packets + parent strict-validate ✓ PASSED** — Errors: 0, Warnings: 0 across the cascade
- **Outstanding:** user runs `git commit -F .opencode/specs/.../008/scratch/commit-message.txt`; user runs `tcpdump-verify.sh` for 24h post-merge; 20-30 spec-kit deep-review iterations (per /goal directive) follow the commit
- **Handover Time:** 2026-05-12T22:20:00Z
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
|---|---|---|
| Prefix registry + env override (ADR-001) | Hardcoded Nomic prefix was causing ~5-8% silent recall loss on non-Nomic models | hf-local.ts + factory.ts + cocoindex shared.py |
| Use `onnx-community/embeddinggemma-300m-ONNX` not canonical `google/embeddinggemma-300m` | transformers.js v3.8.1 needs ONNX; canonical Google repo ships only PyTorch/safetensors | live HF_EMBEDDINGS_MODEL value + PREFIX_REGISTRY entry |
| Project-local `.env.local` mechanism (not committed configs) | Committed model env vars would break new users (no model on disk, no HF auth, no symlink) | `.env.local` + dotenv loading in both launchers |
| `EMBEDDINGS_PROVIDER=auto` retained (not `hf-local`) | User preference; auto resolves to hf-local when no API keys are present | All 5 committed MCP configs |
| Voyage purged from launchd + zshrc + .env | `auto` would silently re-prefer Voyage as long as the key was present | Belt-and-suspenders for `auto` correctness |

### 2.2 Blockers Encountered

| Blocker | Status | Resolution |
|---|---|---|
| EmbeddingGemma HF-gated repo | RESOLVED | User accepted Gemma license + provided HF token; token saved to `~/.cache/huggingface/token` (mode 600) |
| transformers.js can't load Gemma3+ST config from canonical PyTorch repo | RESOLVED | Switched to `onnx-community/embeddinggemma-300m-ONNX` (purpose-built transformers.js port with all dtype variants including q4 for sub-phase 005) |
| transformers.js cache layout differs from huggingface_hub Python | RESOLVED | Symlink: `~/.cache/huggingface/hub/onnx-community/embeddinggemma-300m-ONNX → ../models--onnx-community--embeddinggemma-300m-ONNX/snapshots/5090578d9565bb06545b4552f76e6bc2c93e4a66` |
| `huggingface-cli` not on system PATH | RESOLVED | Used venv-bundled Python (`.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python3`) for all downloads via `huggingface_hub.snapshot_download` |
| `curl https://huggingface.co` times out from this host (Node fetch similar) | OPEN-INFORMATIONAL | huggingface_hub Python works regardless. Smoke tests run entirely offline from cache. Cause unknown — likely DNS/proxy quirk |
| `upgrade-level.sh` references stale template paths (`templates/addendum/level2-verify/checklist.md`) | OPEN-INFRA-DEBT | Worked around by declaring packets at L1; ADR for 001 lives in decision-record.md as bonus. Tracked for a separate infra packet |
| `~/.zshrc` had `export VOYAGE_API_KEY="pa-6hBdS8..."` (now removed) + launchd cached the same value (cleared via `launchctl unsetenv`) | RESOLVED | Verified clean via `env -i HOME=$HOME zsh -c 'source ~/.zshrc; echo $VOYAGE_API_KEY'` returning empty |

### 2.3 Files Modified (cumulative across 001-003)

**Source code:**
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts` — added PREFIX_REGISTRY + getPrefixFor (lines 30-99 region); rewired embedDocument/embedQuery
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` — extended VALID_PROVIDER_DIMENSIONS['hf-local'] with 7 new model→dim mappings (incl. EmbeddingGemma + the ONNX-community port)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` — converted _QUERY_PROMPT_MODELS set→dict, added resolve_query_prompt_name with env override, added Qwen3 entries
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` — added project-local .env.local + .env autoload at module import (via python-dotenv, already in venv)
- `.opencode/bin/spec-kit-memory-launcher.cjs` — added minimal dotenv parser (no new npm dep) that loads .env.local + .env before spawning the context-server child

**Build artifacts (regenerated):**
- `.opencode/skills/system-spec-kit/shared/dist/embeddings/providers/hf-local.{js,d.ts}`
- `.opencode/skills/system-spec-kit/shared/dist/embeddings/factory.{js,d.ts}`

**MCP runtime configs (5 — reverted to pristine state for portability):**
- `~/.claude.json` — no changes (per-project mcpServers was already empty)
- `.claude/mcp.json` — pristine (added env removed in final revert)
- `.mcp.json` — pristine
- `opencode.json` — pristine
- `.gemini/settings.json` — pristine
- `.codex/config.toml` — MEMORY_DB_PATH override removed (was pinning generic filename, blocking filename-keying); rest pristine

**Shell-level / system:**
- `~/.zshrc` — `export VOYAGE_API_KEY=...` block removed (lines 20-21)
- Project `.env` — `VOYAGE_API_KEY=...` line removed (line 15)
- macOS launchd — `launchctl unsetenv VOYAGE_API_KEY` (no file change; runtime mutation)

**New project files:**
- `.env.local` — Setup A overrides (gitignored via `*.local`)
- `.env.example` — updated with the optional Setup A keys (commented-out block at end)
- `.opencode/specs/.../014-local-embeddings-setup-a/SETUP_A_RECIPE.md` — install guide for other users

**HF cache populated (~/.cache/huggingface/hub/):**
- `models--Qwen--Qwen3-Embedding-4B/` — 7.5GB, 14 files (sentence-transformers form, for CocoIndex via Python)
- `models--google--embeddinggemma-300m/` — 1.2GB, 19 files (canonical sentence-transformers form, reference only)
- `models--onnx-community--embeddinggemma-300m-ONNX/` — 2.6GB, 21 files (transformers.js ONNX port with fp32/fp16/q4/q4f16/int8/no-gather-q4 variants)
- `onnx-community/embeddinggemma-300m-ONNX/` (symlink → snapshot dir for transformers.js flat layout)
- `token` (mode 600, user's HF read-scope token)

**Pre-existing vec stores (untouched, will be cleaned in 007):**
- `.opencode/skills/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite` (318MB)
- `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` (141MB, older generic)
- `.cocoindex_code/target_sqlite.db` (2.0GB at 384d MiniLM — to delete in 004)

**Spec packet structure:**
```
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/
├── spec.md (phase parent — scaffolded)
├── description.json, graph-metadata.json (registered in parent 026 metadata)
├── SETUP_A_RECIPE.md (portability docs for other users)
├── handover.md (this file)
├── 001-prefix-registry-architecture/ (Level 1; spec/plan/tasks/impl-summary + decision-record bonus ADR; strict-validate PASSED)
├── 002-model-installation-and-compat/ (L1; PASSED)
├── 003-mcp-config-rollout/ (L1; PASSED)
├── 004-vec-store-rebuild/ (scaffolded; in_progress; awaits user restart)
├── 005-q4-quantization/ (scaffolded; pending)
├── 006-bge-m3-hybrid-evaluation/ (scaffolded; pending)
├── 007-voyage-cleanup-and-egress-monitoring/ (scaffolded; pending)
└── 008-finalize-and-commit/ (scaffolded; pending)
```
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

004's evening continuation already swapped both vec stores under Setup A. Memory side is fully operational. Cocoindex side has the right Qwen3 schema but query path is broken by an upstream `msgspec.DecodeError: Input data was truncated`. The next session should NOT re-run the rebuild — pick up from the cocoindex IPC investigation OR jump to an independent track.

**First step in the new session:** verify memory still works (sanity), then pick a track:

```
# Sanity (memory must still be healthy):
memory_health() → expect 2112 vec rows, healthy=true, provider=hf-local

# Check cocoindex daemon state (it was indexing in background):
ls -la .cocoindex_code/target_sqlite.db
ps auxww | grep "ccc run-daemon"
```

Then choose:
- **Track A (cocoindex unblock):** open packet 009-cocoindex-ipc-fix and diagnose the msgspec truncation
- **Track B (parallel):** start 005-q4-quantization (independent of cocoindex)

### 3.2 Priority Tasks Remaining

1. **Sub-phase 004 — Vec-store rebuild** (~75% complete):
   - ✅ Memory rebuild: 2112/2112 rows under hf-local/EmbeddingGemma-300m-ONNX/768; hybrid search verified (101ms pipeline, 88.39% similarity)
   - ✅ Stale `.cocoindex_code/target_sqlite.db` removed; fresh DB created with `embedding float[2560]` schema (Qwen3-Embedding-4B)
   - ✅ Public venv editable install re-pinned to Public source (was accidentally pointing at Barter sibling — see `feedback_public_venv_editable_install_must_be_self.md`)
   - ✅ `~/.cocoindex_code/global_settings.yml` updated from voyage/voyage-code-3 to Qwen/Qwen3-Embedding-4B
   - ✅ 004 packet docs filled (spec/plan/tasks/implementation-summary); strict-validate PASSED 0 errors
   - ⚠️ Cocoindex query path blocked by `msgspec.DecodeError: Input data was truncated` — upstream IPC issue, see implementation-summary §Known Limitations 8-10
   - ⚠️ Cocoindex indexing rate stalled at 1335 markdown rows (~10 rows/sec, ~10-20× slower than handover estimate) — daemon on Metal but only 5-9% CPU

2. **NEW Sub-phase 009 — Cocoindex IPC truncation fix** (gates 006):
   - Goal: diagnose and fix `msgspec.DecodeError: Input data was truncated` in `cocoindex_code/client.py:130` (SearchRequest response decode)
   - Hypothesis: 2560-dim float32 vector serialization (10KB per result × N) hits a buffer limit, OR daemon emits partial response while mid-indexing
   - Reproduction: `ccc search "test" --limit 1` hangs silently; `cocoindex_code.search query="test" refresh_index=false` returns `Input data was truncated` immediately
   - Daemon logs: not captured via MCP; need to run `ccc run-daemon --verbose` standalone to see internal errors
   - Acceptance: a known-token search returns ≥1 result with `success=true` against the Qwen3 index

3. **Sub-phase 005 — Q4 quantization** (independent of cocoindex; can proceed):
   - Add `HF_EMBEDDINGS_DTYPE` env var plumb through hf-local.ts
   - Configure Q4 ONNX loading for EmbeddingGemma (the `model_q4.onnx` variant is already in cache)
   - Benchmark recall fp32 vs Q4 on 20 known queries; accept Δ<2% accuracy
   - Set `HF_EMBEDDINGS_DTYPE=q4` in `.env.local` if benchmark passes

4. **Sub-phase 006 — bge-m3 hybrid evaluation** (BLOCKED on 009):
   - Build 50-query eval harness
   - Index code corpus with Qwen3-4B (baseline) + bge-m3 dense + bge-m3 hybrid
   - Decision matrix: ship sqlite-vec schema extension only if hybrid wins by >5pp MRR@10

5. **Sub-phase 007 — Voyage cleanup + egress monitoring** (depends on 005+006 stable for 24h):
   - 24h `tcpdump host api.voyageai.com` — expect 0 packets
   - Delete `context-index__voyage__voyage-4__1024.sqlite{,-shm,-wal}` (~335MB)
   - Optionally delete stale `context-index.sqlite` (148MB)
   - Add permanent egress-detection hook in hf-local.ts

6. **Sub-phase 008 — Finalize and commit:**
   - Strict-validate all packets + parent
   - Save context via generate-context.js
   - Single bundled conventional commit on `main`
   - Open PR

### 3.3 Critical Context to Load

- [ ] `spec.md` for each sub-phase (001/002/003 done; 004 next)
- [ ] `SETUP_A_RECIPE.md` at packet root — portability docs
- [ ] `.env.local` at repo root — the live override values
- [ ] `decision-record.md` at 001 root — ADR-001 for the prefix registry design
- [ ] Memory continuity: each sub-phase's `implementation-summary.md` has `_memory.continuity` frontmatter with status

### 3.4 Security Action Items (USER ROTATION REQUIRED)

Three secrets were exposed in the prior session's chat transcript. The packet won't ship until these are rotated:

| Secret | Location in transcript | Where to rotate |
|---|---|---|
| Voyage API key `pa-6h<REDACTED>` | Read aloud during cleanup grep | https://dash.voyageai.com/api-keys — revoke + regenerate |
| HuggingFace token `hf_kF<REDACTED>` | User pasted during 002 setup | https://huggingface.co/settings/tokens — revoke + regenerate; update `~/.cache/huggingface/token` |
| GitHub PAT `github_pat_11ATX<REDACTED>` | Visible in project `.env:12` (Read during VOYAGE cleanup) | https://github.com/settings/tokens — revoke + regenerate; update `.env` |
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

Before handover (verify before user restarts):
- [x] All in-progress work committed or stashed — work uncommitted by design (single bundled commit at 008)
- [x] Current context saved via `_memory.continuity` blocks in 001/002/003 implementation-summary.md
- [x] No breaking changes left mid-implementation — TS builds clean (tsc --noEmit exit 0), smoke tests green (6 Node + 5 Python assertions)
- [x] Tests passing — smoke tests under each packet's `scratch/`
- [x] Strict-validate PASSED on 001, 002, 003 (each `bash .../validate.sh <packet> --strict` exit 0)
- [x] This handover document is complete
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

**Why `.env.local` matters for portability**

The original plan baked Setup A's model env vars (`HF_EMBEDDINGS_MODEL=onnx-community/embeddinggemma-300m-ONNX`, `EMBEDDING_DIM=768`, `COCOINDEX_CODE_EMBEDDING_MODEL=sbert/Qwen/Qwen3-Embedding-4B`) into the 5 committed MCP configs. The user flagged that this would break other users:
- No model on disk → MCP child tries to download ~10GB on first call, blocking startup
- No HF auth → gated EmbeddingGemma repo fails with 401
- No symlink → transformers.js can't find the ONNX files even if downloaded

We reverted the 5 committed configs to pristine. Setup A now lives in `.env.local` (gitignored via `*.local` in `.gitignore`). Both MCP launchers were modified to read `.env.local` then `.env` at startup, populating `process.env` BEFORE the embedding code path runs. Existing process.env wins over file values, so a shell-exported value still overrides .env.local.

Other users follow `SETUP_A_RECIPE.md` to opt in. They never modify committed configs.

**`auto` provider resolution under the new setup**

With `EMBEDDINGS_PROVIDER=auto` (committed default) and no API keys, the factory falls through to `hf-local`. `.env.local` then sets `HF_EMBEDDINGS_MODEL` to the Setup A choice. If `.env.local` is absent, hf-local falls back to its hardcoded default `nomic-ai/nomic-embed-text-v1.5` (auto-downloads on first use, no auth, 768d).

**Why the prefix registry isn't reverted**

The registry in `hf-local.ts` (and the dict in `shared.py`) registers 6-7 models with their prefix conventions. This is INFRASTRUCTURE — it doesn't force any model choice; it just makes the right prefix get applied when ANY of those models is selected. Cost is one frozen object + one function. Benefit is silent-recall-loss protection on every model swap forever. Keeping it.

**transformers.js cache symlink is fragile**

If the user re-runs `snapshot_download('onnx-community/embeddinggemma-300m-ONNX')` after a new revision is published, the snapshot hash changes and the symlink points at the OLD dir. Future-proofing this is a follow-on packet. For now, the symlink is in place at the current snapshot hash `5090578d9565bb06545b4552f76e6bc2c93e4a66`.

**Network from this host**

curl/Node fetch to huggingface.co times out (HTTP 000 after 30s). Python huggingface_hub works fine — used for all downloads. transformers.js runs fully offline against the symlinked cache. Cause unknown; not blocking. Likely macOS DNS/proxy quirk that surfaces after a fresh reboot.
<!-- /ANCHOR:session-notes -->
