---
title: "Skill Advisor Install + Setup Guide"
description: "Bootstrap, verification, runtime hooks, compatibility shim, rollback, operator notes and reference commands for the native advisor_recommend architecture (merged INSTALL_GUIDE + SET-UP_GUIDE)."
---

# Skill Advisor Install + Setup Guide

<!-- sk-doc-template: skill_reference_install_guide -->

This is the canonical install + setup guide for the standalone Skill Advisor MCP server. The advisor runs as `mk_skill_advisor`, separate from `mk-spec-memory`. It preserves the public tool ids `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate` plus one internal trusted-caller tool `skill_graph_propagate_enhances`. This document merges the previously-separate `SET-UP_GUIDE.md` (runtime hooks, rollback CLI, operator states, reference commands) into the install bootstrap so there is a single source of truth.

---

## 0. AI-FIRST INSTALL GUIDE

Copy and paste this prompt to your AI assistant to get installation help:

```
I want to install the Skill Advisor MCP server (mk_skill_advisor) from .opencode/skills/system-skill-advisor/mcp_server

Please help me:
1. Verify Node.js and npm are installed
2. Install dependencies and build the advisor MCP server
3. Confirm the @spec-kit/shared package is linked (a missing link breaks startup with ERR_MODULE_NOT_FOUND)
4. Register or refresh the mk_skill_advisor server in my runtime (I'm using: [OpenCode / Claude Code / OpenCode])
5. Verify advisor_status and advisor_recommend respond

Guide me through each step with the exact commands I need to run.
```

Your AI assistant will:
- Verify Node.js and npm are available
- Install and build the standalone advisor MCP server
- Check the `@spec-kit/shared` dependency link
- Configure `mk_skill_advisor` for your runtime
- Confirm the 8 public advisor tools register and respond

**Expected setup time:** 3-5 minutes

---

## 1. OVERVIEW

The native advisor is a TypeScript package under `.opencode/skills/system-skill-advisor/mcp_server/`. It exposes 8 public MCP tools (`advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`) plus 1 internal trusted-caller tool (`skill_graph_propagate_enhances`, gated behind auth). The standalone MCP server owns the advisor handlers, schemas, launcher, plus the package-local SQLite DB at `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`. The Python `skill_advisor.py` shim remains as the compatibility surface for scripts and prompt hooks.

---

## 2. PREREQUISITES

- Node.js and npm available for the standalone system-skill-advisor MCP server.
- Repository root as the working directory.
- Runtime MCP configuration includes both `mk-spec-memory` and `mk_skill_advisor`.
- Native MCP trusted mutations require `MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted` in the daemon environment; callers cannot supply this trust grant per request.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset unless intentionally testing rollback.
- The local shared package at `.opencode/skills/system-spec-kit/shared` is present; `npm install` links it into `mcp_server/node_modules/@spec-kit/shared`.

---

## 3. INSTALLATION

Install dependencies and build the advisor MCP server:

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server install
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build
```

Verify the local shared package link exists. Missing this link causes MCP startup to fail with `ERR_MODULE_NOT_FOUND` for `@spec-kit/shared`.

```bash
test -e .opencode/skills/system-skill-advisor/mcp_server/node_modules/@spec-kit/shared && echo "shared dependency linked"
```

Start or refresh the `mk_skill_advisor` MCP server in the active runtime. The launcher is:

```bash
node .opencode/bin/mk-skill-advisor-launcher.cjs
```

---

## 4. VERIFICATION

Verify native tool registration through `mk_skill_advisor`:

```text
mk_skill_advisor.advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
mk_skill_advisor.advisor_recommend({"prompt":"save this conversation context to memory","options":{"topK":1}})
mk_skill_advisor.advisor_validate({"confirmHeavyRun":true,"skillSlug":null})
```

Also verify the active runtime lists both MCP servers: `mk-spec-memory` for memory/context tools and `mk_skill_advisor` for advisor tools.

Expected:

- `advisor_status` returns `freshness`, `generation`, `trustState`, `lastGenerationBump`, `lastScanAt`, `skillCount` and `laneWeights`.
- `advisor_recommend` returns prompt-safe `recommendations[]`, cache state, lifecycle redirect metadata and freshness trust.
- `advisor_rebuild` rebuilds stale, absent or unavailable advisor state and returns before/after freshness diagnostics.
- `advisor_validate` returns real corpus, holdout, parity, safety and latency measurements.

---

## 5. NATIVE PACKAGE CHECKS

Run before declaring bootstrap complete:

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build
node -e "import('./.opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/lib/scorer/lanes/semantic-shadow.js')"
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run test -- tests/compat/plugin-bridge-smoke.vitest.ts tests/handlers/advisor-recommend.vitest.ts --reporter=default
```

Current native advisor baseline:

| Metric | Expected |
| --- | --- |
| Full corpus top-1 | 80.5% |
| Holdout top-1 | 77.5% |
| UNKNOWN count | <= 10 |
| Python-correct regressions | 0 |
| Python regression suite | regression harness available |
| Package-local tests | 23 files / 167 tests |

---

## 6. RUNTIME HOOKS AND PLUGIN

Prompt-time routing is available across runtime adapters:

| Runtime | Hook Surface |
| --- | --- |
| Claude Code | `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` |
| OpenCode | `.opencode/skills/system-skill-advisor/hooks/opencode/user-prompt-submit.ts` plus `prompt-wrapper.ts` fallback and `lib/opencode-hook-policy.ts` |
| OpenCode | `.opencode/plugins/mk-skill-advisor.js` plus the cross-process gateway at `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` |

The OpenCode bridge must use the stable package entrypoint:

```text
.opencode/skills/system-skill-advisor/mcp_server/compat/index.ts
```

After build, plugin consumers load:

```text
.opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/compat/index.js
```

---

## 7. COMPAT SHIMS

`skill_advisor.py` remains the CLI compatibility surface. In one-shot mode it probes the native advisor first and translates `advisor_recommend` output back to the legacy JSON-array shape. If the native probe is unavailable, it falls back to the local Python scorer.

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "help me commit my changes"
printf '%s' "help me commit my changes" | python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --stdin
```

Mode meanings:

| Mode | Behavior |
| --- | --- |
| default | Probe native. Use native if live/stale. Otherwise local Python fallback. |
| `--stdin` | Read one prompt from stdin. |
| `--force-native` | Require native routing and fail prompt-safely when unavailable. |
| `--force-local` | Bypass native routing and run local Python scoring. |

Testing controls:

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-native "save this context"
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-local "save this context"
```

The OpenCode plugin bridge follows the same pattern: MCP-level `mk_skill_advisor.advisor_recommend` delegation with prompt-safe fail-open behavior. Plugin consumers must use the stable bridge entrypoint:

```text
.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs
```

If a package-level import is needed inside a subprocess fallback, it must target the standalone advisor package, never the old system-spec-kit advisor path. After build, the standalone server entrypoint is:

```text
.opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/advisor-server.js
```

---

## 8. ROLLBACK

Use rollback only long enough to diagnose or recover the native path.

| Control | Scope |
| --- | --- |
| `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | Disables prompt-time advisor surfaces and native recommendations across Claude, OpenCode, OpenCode hooks. |
| `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1` | Forces Python fallback in shim or plugin bridge diagnostics. |
| `--force-local` | CLI-only Python scorer path. |
| `--force-native` | CLI-only native-required path. |

```bash
# Disable prompt-time advisor surfaces and native recommendation output.
export SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1

# Keep hooks enabled but force Python compatibility where supported.
export SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1

# CLI-only Python path.
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-local "your prompt"
```

Unset variables after recovery:

```bash
unset SPECKIT_SKILL_ADVISOR_HOOK_DISABLED
unset SPECKIT_SKILL_ADVISOR_FORCE_LOCAL
```

---

## 9. OPERATOR CHECKS

`skill_graph_*` tools are owned by the `mk_skill_advisor` MCP server as of `013/009/008`. Public tool ids remain unchanged.

Use `advisor_status` as the prompt-safe health source:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

State interpretation:

| State | Meaning | Action |
| --- | --- | --- |
| `live` | Current graph generation is trusted | No action. |
| `stale` | Source files are newer than graph state | Run `skill_graph_scan` or restart the watcher. |
| `absent` | Graph state is missing | Rebuild from source; `advisor_recommend` should return an empty fail-open set. |
| `unavailable` | Status cannot be read | Inspect daemon logs and rebuild source state. |
| `degraded` | Runtime can only provide limited trust | Follow OP-001 in the manual playbook. |
| `quarantined` | Malformed skill metadata was isolated | Follow OP-002 in the manual playbook. |

Manual recovery scenarios live at:

```text
.opencode/skills/system-skill-advisor/mcp_server/manual_testing_playbook/manual_testing_playbook.md
```

### Indexer scan-vs-index counts

`skill_graph_scan` reports two numbers: `scannedFiles` (every `graph-metadata.json` discovered) and `indexedFiles` (real skills indexed into SQLite). The delta is normally 1 or 2 files. The indexer skips `scripts/test-fixtures/*/graph-metadata.json` (test scaffolding) and emits a `NON-SKILL-METADATA: skipped` warning. A larger delta means real skills are being filtered, so inspect the warning list.

H5 operator scenarios live in the manual playbook under `operator-h5/`.

---

## 10. TROUBLESHOOTING

| What You See | Cause | Fix |
| --- | --- | --- |
| MCP startup logs show `ERR_MODULE_NOT_FOUND` for `@spec-kit/shared` from `semantic-shadow.js` | The advisor package was built, but its local shared package link is missing from `mcp_server/node_modules`. | Run `npm --prefix .opencode/skills/system-skill-advisor/mcp_server install` and `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build`, then restart `mk_skill_advisor`. |
| `/doctor:mcp debug --server mk_skill_advisor` fails `shared_dependency` or `shared_import` | Doctor detected the same missing local package link before runtime startup. | Run `/doctor:mcp debug --server mk_skill_advisor --fix` or run the commands above manually. |

---

## 11. REFERENCE COMMANDS

```bash
# Build native package
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build

# Typecheck native package
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck

# Python shim default
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "create a pull request on github"

# Python shim stdin
printf '%s' "save this conversation context to memory" | \
  python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --stdin

# Native required
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-native "save this context"

# Python fallback required
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-local "save this context"

# Regression compatibility
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py \
  --dataset .opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl
```

---

## 12. CHOOSING AN EMBEDDER

The skill-advisor `semantic_shadow` lane runs against a pluggable embedder layer. As of phase `003/006` the contract surface (adapter interface, types, manifest registry, Ollama adapter) lives in `@spec-kit/shared/embeddings/` and is shared with `mk-spec-memory`. Skill-advisor's local `mcp_server/lib/embedders/` files are thin re-export shims plus a skill-advisor-specific `schema.ts` integration that targets the package-local SQLite database at `mcp_server/database/skill-graph.sqlite`. This section is the new-user onboarding view; the canonical multi-MCP narrative lives at [embedder_pluggability.md](../system-spec-kit/references/memory/embedder_pluggability.md).

### 12.1 Current active default

The persisted default is the `'auto'` sentinel. On daemon startup, `ensureActiveEmbedder()` invokes the shared cascade and persists the winner to `vec_metadata`. The cascade probes (in order):

| Tier | Probe | Picks |
| --- | --- | --- |
| 1 | Ollama running with a known text manifest pulled | `nomic-embed-text-v1.5` (first match in priority list) |
| 2 | hf-local model server reachable (pure-Node `@huggingface/transformers` HTTP client, zero Python) | `nomic-ai/nomic-embed-text-v1.5` (hf-local) |
| 3 | `OPENAI_API_KEY` present | `text-embedding-3-small` (1536-dim) |
| 4 | `VOYAGE_API_KEY` present | `voyage-code-3` (1024-dim, acknowledged compromise for prose memory) |

If every probe fails the daemon logs a warning and `semantic_shadow` scoring may degrade. The cascade only fires when the persisted pointer is `'auto'` or references a manifest the shared registry no longer knows about (legacy `embeddinggemma-300m` from a pre-phase-007 install). Manual `setActiveEmbedder()` calls take precedence — they pin the pointer and the cascade skips on subsequent restarts.

Phase `002/jina-swap-and-reindex` runbook plus phase `004/skill-graph-db-writer-cross-wire` together make the swap safe end-to-end. The writer dispatcher (`refreshSkillEmbeddings()`) routes through `refreshSkillEmbeddingsViaAdapter` when an active pointer is set and falls back to the legacy `createEmbeddingsProvider` factory only when the cascade has not yet resolved (e.g. cold start before any probe succeeds).

### 12.2 Registered alternatives

Source of truth: [`@spec-kit/shared/embeddings/registry.ts`](../system-spec-kit/shared/embeddings/registry.ts). Skill-advisor's local `mcp_server/lib/embedders/registry.ts` is a re-export shim — adding manifests is a single edit in the shared package. The seven text-tuned manifests registered today, each as a frozen `EmbedderManifest`:

| Name | Dim | Backend | Ollama tag | Max input | Notes |
| --- | ---: | --- | --- | ---: | --- |
| `nomic-embed-text-v1.5` | 768 | `ollama` | `nomic-embed-text:v1.5` | 5000 | 768-dim retrieval specialist. Local-first cascade default per ADR-014. Uses `search_query: ` / `search_document: ` prefix tokens. |
| `mxbai-embed-large-v1` | 1024 | `ollama` | `mxbai-embed-large:latest` | 1200 | Phase `016/004` paraphrase-strong candidate. |
| `bge-small-en-v1.5` | 384 | `ollama` | `bge-small-en-v1.5:latest` | n/a | Compact 33M-param baseline. |
| `bge-large-en-v1.5` | 1024 | `ollama` | `bge-large-en-v1.5:latest` | n/a | BAAI flagship retrieval model. |
| `jina-embeddings-v3` | 1024 | `ollama` | `hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M` | 8000 | Multilingual + paraphrase-tuned. Matryoshka representation allows 256 / 512 / 768 / 1024 truncation. |
| `bge-m3` | 1024 | `ollama` | `bge-m3:latest` | 8000 | Multilingual hybrid (dense + sparse + colbert). |
| `snowflake-arctic-embed-l-v2.0` | 1024 | `ollama` | `snowflake-arctic-embed2:latest` | 8000 | Snowflake late-2024 flagship. 8192 context, multilingual, top MTEB retrieval scores. |

> **Content-type split.** The TS shared registry is text-tuned by design. The `contentType: 'text' \| 'code'` parameter on the shared cascade preserves the conceptual split for any future TS code consumer. The previous skill-advisor-specific `jina-embeddings-v2-base-code` entry was removed because it was code-tuned and did not belong in a text-only registry.

Adding a new candidate is a single registry row in the shared package plus, if the backend is new, a single adapter under `shared/embeddings/adapters/`. No call sites change. The adapter contract (`EmbedderAdapter` in `@spec-kit/shared/embeddings/adapter.ts`) is small — `embed()` plus `ready()`.

### 12.3 Swap mechanism: `'auto'` sentinel + `setActiveEmbedder()`

There are two operator-facing surfaces. **Neither is an environment variable.**

**Sentinel-driven (default).** `vec_metadata` starts unpopulated; `getActiveEmbedder()` returns `{ name: 'auto', dim: 0 }`. The first daemon start invokes `ensureActiveEmbedder()` which calls the shared cascade and persists the winner. Subsequent daemon starts read the persisted pointer and skip the cascade.

**Manual override.** [`setActiveEmbedder()`](./mcp_server/lib/embedders/schema.ts) writes a specific manifest into `vec_metadata` and creates the matching `vec_<dim>` table:

```typescript
import Database from 'better-sqlite3';
import { setActiveEmbedder } from './mcp_server/dist/.../lib/embedders/schema.js';

const db = new Database('.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite');
setActiveEmbedder(db, 'jina-embeddings-v3', 1024);
```

Effect of the call:

- `vec_metadata.active_embedder_name` -> `jina-embeddings-v3`
- `vec_metadata.active_embedder_dim` -> `1024`
- `vec_1024` table created (if absent), schema `(skill_id, embedding BLOB, model_id, content_hash, updated_at)`
- `hasActiveEmbedderPointer(db)` returns `true`, so both read path (`semantic-shadow.ts`, `loadSkillEmbeddings()`) and write path (`refreshSkillEmbeddingsViaAdapter`) target `vec_<active.dim>`
- The shared cascade is skipped on subsequent restarts (a manual override pins the pointer)

The mk-spec-memory `embedder_set` / `embedder_status` MCP tools are intentionally NOT mirrored here. Skill-advisor's surface is one database helper plus the cascade-driven sentinel. Operator discipline owns any manual swap workflow; there is no async re-index orchestrator on the skill-advisor side.

### 12.4 Operator-safe swap runbook

The writer cross-wire shipped in phase `004` and the cascade-driven default shipped in phase `003/006`. The pointer flip is now safe end-to-end:

1. Stop the daemon.
2. Snapshot `mcp_server/database/skill-graph.sqlite`.
3. (Optional) Call `setActiveEmbedder()` to override the cascade choice.
4. Restart the daemon. `ensureActiveEmbedder()` either honours your override or runs the cascade. The first scan or watcher tick populates `vec_<active.dim>` via the adapter dispatcher.
5. Smoke-test via the `advisor_recommend` MCP tool against three queries (`"memory save"`, `"code search"`, `"spec folder"`) and confirm top-3 picks are sane.

The full runbook (snapshot + stop + override + restart + smoke test + rollback) is documented at [`002-jina-swap-and-reindex/evidence/swap-runbook.md`](../../<spec-folder>). The "Architecture Context" and "Half-wired state" sections are now historical — the half-wired state was closed by phase `004`.

### 12.5 Device selection

Skill-advisor does not ship an explicit `_resolve_device()` shim. Device selection inherits from the underlying backend:

| Backend | Device handling |
| --- | --- |
| `ollama` (default after cascade picks tier 1) | Ollama owns runtime device handling. It already covers Metal / CUDA / CPU autonomously based on its own daemon configuration. |
| `hf-local` (fallback tier 2) | Pure-Node `@huggingface/transformers` HTTP model server (zero Python). Device handling (MPS / CUDA / CPU) is resolved by the model server's own runtime. |
| `api` (OpenAI or Voyage fallback) | Remote inference; device handling is the provider's concern. |

If you need MPS-style auto-detect for a local model, the Ollama backend already provides it on Apple Silicon by default — install Ollama, pull a manifest, the cascade picks it.

### 12.6 Cross-references

- Canonical shared-embedder narrative: [`embedder_pluggability.md`](../system-spec-kit/references/memory/embedder_pluggability.md) — covers `mk-spec-memory`, skill-advisor and shared design rationale.
- Shared contract surface: [`@spec-kit/shared/embeddings/`](../system-spec-kit/shared/embeddings/) — the canonical adapter, types, registry and Ollama adapter.
- Shared cascade: [`@spec-kit/shared/embeddings/auto-select.ts`](../system-spec-kit/shared/embeddings/auto-select.ts) — file-locked Ollama → hf-local → OpenAI → Voyage probe chain (ADR-014 local-first). Accepts optional `contentType: 'text' \| 'code'` parameter (default `'text'`).
- Memory-side analog (full MCP tool surface): [`system-spec-kit/mcp_server/INSTALL-GUIDE.md`](../system-spec-kit/mcp_server/INSTALL-GUIDE.md).
- Skill-advisor schema helpers: [`mcp_server/lib/embedders/schema.ts`](./mcp_server/lib/embedders/schema.ts).
- Architecture-gap follow-on: packet `003/006-shared-embedder-logic-with-spec-memory` (shipped phase 003/006).

## 13. RELATED RESOURCES

| Document | Purpose |
| --- | --- |
| [README.md](./README.md) | Operator overview, quick start, runtime integrations. |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Package-local architecture and public API entrypoints. |
| [Hook reference](./references/hooks/skill_advisor_hook.md) | Claude, Copilot, OpenCode and OpenCode plugin hook contract. |
| [Manual testing playbook](./manual_testing_playbook/manual_testing_playbook.md) | OP-001 / OP-002 operator scenarios + indexer edge cases. |
| [Embedder pluggability narrative](../system-spec-kit/references/memory/embedder_pluggability.md) | Canonical two-MCP / two-embedder / two-mechanism reference. |
