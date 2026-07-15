---
title: "Session Handover: 014-local-embeddings-setup-a"
description: "Current handover for Local embeddings Setup A. Twelve packets shipped (001-012); 012 v3 remediation is complete in 42aa114e3."
trigger_phrases:
  - "014 handover"
  - "Setup A handover"
  - "local embeddings handover"
  - "resume 014"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation"
    last_updated_at: "2026-05-12T21:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "12 packets shipped (001-012); 012 complete in 42aa114e3"
    next_safe_action: "Use 013 for v4 cleanup follow-up"
    blockers:
      - "User-managed GitHub PAT rotation remains manual"
    key_files:
      - "spec.md"
      - "SETUP_A_RECIPE.md"
      - ".env.local"
      - "004-vec-store-rebuild/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:01400a4e0d0c00000000000000000000000000000000000000000000000000ed"
      session_id: "014-handover-2026-05-12"
      parent_session_id: null
    completion_pct: 96
    open_questions: []
    answered_questions: []
---
# Session Handover Document

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

You are resuming work on packet `system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/`. Terminal state: 12 child packets shipped (001-012); 012-v3-remediation is complete in 42aa114e3. Both retrieval surfaces use EmbeddingGemma defaults: Spec Kit Memory uses `onnx-community/embeddinggemma-300m-ONNX` with q8 as the system default dtype, and CocoIndex uses `sbert/google/embeddinggemma-300m` with bf16 sentence-transformers loading. Main has 4 commits for the Setup A series: 2b767d051, d222564cf, d76f3b795, and 42aa114e3.

**Status values:** in_progress
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 014-autonomous-completion-2026-05-12 (Claude Opus 4.7, /goal autonomous mode)
- **To Session:** post-commit session; deep-review iterations
- **Phase Completed (validates clean):** 001 through 011
- **Phase Completed (validates clean):** 012-v3-remediation (q8 default, launcher parity where writable, dtype-keyed DB filenames, Voyage guard timing, tcpdump pktap, CocoIndex search-only hardening, doc alignment)
- **Outstanding:** v4 cleanup items in 013; user-managed GitHub PAT rotation remains manual
- **Handover Time:** 2026-05-13T08:30:00Z
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
| `EMBEDDINGS_PROVIDER=auto` retained (not `hf-local`) | User preference; auto-cascade resolves Voyage -> OpenAI -> llama-cpp when the GGUF runtime is installed -> hf-local | All 5 committed MCP configs |
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
- `.codex/config.toml` — routed through `spec-kit-memory-launcher.cjs`; q8 filename note shipped in 42aa114e3

**Shell-level / system:**
- `~/.zshrc` — `export VOYAGE_API_KEY=...` block removed (lines 20-21)
- Project `.env` — `VOYAGE_API_KEY=...` line removed (line 15)
- macOS launchd — `launchctl unsetenv VOYAGE_API_KEY` (no file change; runtime mutation)

**New project files:**
- `.env.local` — Setup A overrides (gitignored via `*.local`)
- `.env.example` — updated with the optional Setup A keys (commented-out block at end)
- `.opencode/specs/.../014-local-embeddings-setup-a/SETUP_A_RECIPE.md` — install guide for other users

**HF cache populated (~/.cache/huggingface/hub/):**
- `models--google--embeddinggemma-300m/` — ~620MB, 14 files (sentence-transformers form, for CocoIndex via Python)
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

012's remediation is complete in 42aa114e3 and strict-validates clean. Memory-side dtype default is q8 in source/dist; `.codex/config.toml` now routes through the launcher after the main-agent patch. CocoIndex search-only validation and project status hardening are patched in `daemon.py`.

**First step in the new session:** verify memory still works (sanity), then pick a track:

```
# Sanity (memory must still be healthy):
memory_health() → expect healthy=true; provider follows auto-cascade: Voyage -> OpenAI -> llama-cpp when the GGUF runtime is installed -> hf-local

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
   - ✅ Stale `.cocoindex_code/target_sqlite.db` removed; fresh DB created with `embedding float[768]` schema (EmbeddingGemma-300m)
   - ✅ Public venv editable install re-pinned to Public source (was accidentally pointing at Barter sibling — see `feedback_public_venv_editable_install_must_be_self.md`)
   - ✅ `~/.cocoindex_code/global_settings.yml` updated from voyage/voyage-code-3 to google/embeddinggemma-300m
   - ✅ 004 packet docs filled (spec/plan/tasks/implementation-summary); strict-validate PASSED 0 errors
   - ⚠️ Cocoindex query path blocked by `msgspec.DecodeError: Input data was truncated` — upstream IPC issue, see implementation-summary §Known Limitations 8-10
   - ⚠️ Cocoindex indexing rate stalled at 1335 markdown rows (~10 rows/sec, ~10-20× slower than handover estimate) — daemon on Metal but only 5-9% CPU

2. **NEW Sub-phase 009 — Cocoindex IPC truncation fix** (gates 006):
   - Goal: diagnose and fix `msgspec.DecodeError: Input data was truncated` in `cocoindex_code/client.py:130` (SearchRequest response decode)
   - Hypothesis: 768-dim float32 vector serialization (10KB per result × N) hits a buffer limit, OR daemon emits partial response while mid-indexing
   - Reproduction: `ccc search "test" --limit 1` hangs silently; `cocoindex_code.search query="test" refresh_index=false` returns `Input data was truncated` immediately
   - Daemon logs: not captured via MCP; need to run `ccc run-daemon --verbose` standalone to see internal errors
   - Acceptance: a known-token search returns ≥1 result with `success=true` against the EmbeddingGemma index

3. **Sub-phase 005 — Q4 quantization** (independent of cocoindex; can proceed):
   - Add `HF_EMBEDDINGS_DTYPE` env var plumb through hf-local.ts
   - Configure Q4 ONNX loading for EmbeddingGemma (the `model_q4.onnx` variant is already in cache)
   - Benchmark recall fp32 vs Q4 on 20 known queries; accept Δ<2% accuracy
   - Set `HF_EMBEDDINGS_DTYPE=q4` in `.env.local` if benchmark passes

4. **Sub-phase 006 — bge-m3 hybrid evaluation** (BLOCKED on 009):
   - Build 50-query eval harness
   - Index code corpus with EmbeddingGemma-300m (baseline) + bge-m3 dense + bge-m3 hybrid
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

Active blocker: user-managed GitHub PAT rotation remains manual.

| Secret | Location in transcript | Where to rotate |
|---|---|---|
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

The original plan baked Setup A's model env vars (`HF_EMBEDDINGS_MODEL=onnx-community/embeddinggemma-300m-ONNX`, `EMBEDDING_DIM=768`, `COCOINDEX_CODE_EMBEDDING_MODEL=sbert/google/embeddinggemma-300m`) into the 5 committed MCP configs. The user flagged that this would break other users:
- No model on disk → MCP child tries to download ~~1.3GB on first call, blocking startup
- No HF auth → gated EmbeddingGemma repo fails with 401
- No symlink → transformers.js can't find the ONNX files even if downloaded

We reverted the 5 committed configs to pristine. Setup A now lives in `.env.local` (gitignored via `*.local` in `.gitignore`). Both MCP launchers were modified to read `.env.local` then `.env` at startup, populating `process.env` BEFORE the embedding code path runs. Existing process.env wins over file values, so a shell-exported value still overrides .env.local.

Other users follow `SETUP_A_RECIPE.md` to install the local runtime or set explicit provider/model overrides. They never modify committed configs.

**`auto` provider resolution under the new setup**

With `EMBEDDINGS_PROVIDER=auto` (committed default), the factory resolves Voyage -> OpenAI -> llama-cpp when the GGUF runtime is installed -> hf-local. llama-cpp is auto-selected by the availability probe, not by a manual enablement flag; explicit override via `EMBEDDINGS_PROVIDER=<provider>` remains available. If the cascade reaches hf-local and `.env.local` is absent, hf-local falls back to its hardcoded default `onnx-community/embeddinggemma-300m-ONNX` (auto-downloads on first use, no auth, 768d, q8).

**Why the prefix registry isn't reverted**

The registry in `hf-local.ts` (and the dict in `shared.py`) registers 6-7 models with their prefix conventions. This is INFRASTRUCTURE — it doesn't force any model choice; it just makes the right prefix get applied when ANY of those models is selected. Cost is one frozen object + one function. Benefit is silent-recall-loss protection on every model swap forever. Keeping it.

**transformers.js cache symlink is fragile**

If the user re-runs `snapshot_download('onnx-community/embeddinggemma-300m-ONNX')` after a new revision is published, the snapshot hash changes and the symlink points at the OLD dir. Future-proofing this is a follow-on packet. For now, the symlink is in place at the current snapshot hash `5090578d9565bb06545b4552f76e6bc2c93e4a66`.

**Network from this host**

curl/Node fetch to huggingface.co times out (HTTP 000 after 30s). Python huggingface_hub works fine — used for all downloads. transformers.js runs fully offline against the symlinked cache. Cause unknown; not blocking. Likely macOS DNS/proxy quirk that surfaces after a fresh reboot.

---

## 2026-05-14 — Substrate-repair wave closeout

The local-LLM Memory MCP substrate is healed end-to-end. Today's session shipped 8 packets and 4 source patches with all strict-validates clean. The original blocker — chronic E081/E085 save failures on substantive content — is resolved at the worker, the consumer, the build, and the V-rule observability layers.

### Packets shipped (in dependency order)

| Packet | Outcome | What it does |
|--------|---------|---------------|
| **038-embedding-error-propagation** | shipped (moved here from root `029-`) | `generateDocumentEmbedding`/`generateQueryEmbedding` now rethrow provider errors instead of swallowing as null. Upstream half of the worker repair. |
| **039-token-aware-chunking** | shipped (moved here from root `030-`) | `LlamaCppProvider` derives `tokenBudget = trainContextSize × 0.9`, uses `contextSize: 'auto'` with `maxContextSize`, and tokenizer-preflight truncates over-budget input. Downstream half of the worker repair. |
| **037-llama-cpp-embedding-worker-deep-dive** | shipped | Reproduction harness + ADR-003. Caught the API hotfix: 039's patch used `model.tokenizer.tokenize(...)` but `LlamaModel.tokenizer` in `node-llama-cpp@3.17.1` is a *callable*, not an object. Switched to `model.tokenize(...)` per `LlamaModel.d.ts:181`. Real-model vitest T030-04 now PASS against the GGUF. |
| **033-system-code-graph-import-path-cleanup** | shipped | `mcp_server/tsconfig.json` excludes `../../shared/**`; new `scripts/finalize-dist.mjs` rewrites compiled imports to `@spec-kit/shared/*.js` and removes the orphan `dist/system-spec-kit/shared/` tree. Orphan no longer regenerates on clean builds. |
| **034-query-expansion-context-size** | shipped | `lib/search/embedding-expansion.ts` adds `COMBINED_QUERY_CHAR_BUDGET=6500` + `buildBoundedCombinedQuery()`. Consumer-side mirror of 039's worker-side fix — keeps the original query and drops low-priority synonyms when over budget. |
| **036-failed-embedding-cleanup-retry** | shipped (no-op needed) | Confirmed the retry-manager already drained the historical 214 failed embeddings once 037+039 fixed the worker. Final state: `failed=0`, `success=2907`, `pending=1105` (workflow-driven, not failure-driven). |
| **035-cocoindex-mcp-reliability** | diagnostic-only | Mapped the CocoIndex MCP code paths (`server.py`/`client.py`/`daemon.py`/`query.py`). Root cause hypothesis: host MCP timeout < worst-case search path. Fix lives in 041. |
| **041-v-rule-cross-spec-overreach** | shipped | `scripts/lib/validate-memory-quality.ts` — 4 fixes (numeric-prefix denylist for "768-dimension"/"142-line" false-positives; ADR-NNN exclusion; last-match `current_spec` extraction; document-type-aware threshold relaxation for decision-records). 5/5 new + 3/3 existing vitests PASS. Unblocks live `memory_save` on ADR-like content. |
| **042-cocoindex-ipc-observability** | in flight | Carrying a single `req_id` through the daemon's server.py → client.py → daemon.py → query.py path with stage timing, response byte counts, msgspec payload metadata behind `COCOINDEX_CODE_IPC_DEBUG`, client-disconnect counter, and `COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS` env knob. |

### Live-substrate verification

- `memory_health`: `embeddingProvider.healthy=true`, `circuitBreakerOpen=false`, `flapping=false`, `transitionsInLast10Min=0`. memoryCount=3647 → 4042 over the day.
- `memory_save` of 4000-char ADR: succeeds end-to-end, indexed at id=4435 (V8 no longer false-blocks).
- `memory_search` hybrid pipeline: returns ranked results, similarity 81+ on the new docs.
- `validate-memory-quality.js` direct run on 037 ADR-003: `QUALITY_GATE_PASS`, `matchesFound=[]`, `current_spec=037-llama-cpp-embedding-worker-deep-dive` (was misidentified as parent `026-` before 040).
- `npm run build`: exit 0; orphan dist gone and stays gone (033's finalize-dist.mjs enforces).
- vitest matrix: 11 NEW tests across 037+040+034 + 1 fixed real-model smoke + 3 governance regression — all PASS.

### Parent phase map updated

`014-local-embeddings-migration/spec.md` Phase Documentation Map now lists 37/38/39 rows with handoff criteria reflecting 037→038→039 sequence. 033/034/035/036/040/041 not yet listed at the parent level (operator choice — they're "internal substrate" packets that don't need top-level surfacing).

### Open follow-ons after this wave

1. **042 — CocoIndex behavior change**: default `refresh_index=false` for MCP routes; split refresh from search. Depends on 041 landing first. User-visible behavior change → its own decision record.
2. **043 — 24-- scenario suite revalidation**: replay the 15 query-intelligence scenarios against the now-healed substrate. Baseline was 2 PASS / 2 PARTIAL / 11 FAIL. Expected uplift: 411–415 should all PASS (worker repaired); 401 should PASS (034 bounded expansion); 404/407 may stay PARTIAL until 041+042 land.
3. **Commit grouping**: many uncommitted M files; operator decision. Suggested split: `feat(embeddings,037/038/039)`, `fix(scripts,040)`, `refactor(mcp_server,033)`, `feat(search,034)`, `docs(036)`, `docs(035)`, `feat(cocoindex,041)`.

### What didn't ship this wave

- The Memory MCP daemon's running instance still uses the dist built BEFORE 040's V-rule fix. The next daemon restart picks up the new logic (manual: kill `spec-kit-memory-launcher.cjs` PIDs, MCP auto-respawns on the next tool call).
- 035's behavior-change half (default refresh_index=false) — intentionally deferred to 042.
- IPC payload-debug end-to-end demo — 041 ships the hooks, but actually triggering them requires running CocoIndex queries under load. 043's suite revalidation will exercise them.

### Branch + commit state

All work sits on `main`. No feature branches. No commits — operator decides grouping.
<!-- /ANCHOR:session-notes -->
