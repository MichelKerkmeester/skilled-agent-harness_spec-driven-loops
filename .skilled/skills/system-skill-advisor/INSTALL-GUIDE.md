---
title: "Skill Advisor Install + Setup Guide"
description: "Bootstrap, verification, runtime hooks, local scorer, rollback, operator notes and reference commands for the daemon-backed skill advisor CLI."
---

# Skill Advisor Install + Setup Guide

<!-- sk-doc-template: skill_reference_install_guide -->

This is the canonical install + setup guide for the Skill Advisor. The advisor runs as a resident daemon reached through one CLI front door, `node .opencode/bin/skill-advisor.cjs`, and owns its own SQLite database and scoring stack. It exposes nine commands: the eight public ones `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status` and `skill_graph_validate`, plus the trusted-caller-only `skill_graph_propagate_enhances`. The Python local scorer at `runtime/scripts/skill_advisor.py` answers `advisor_recommend` when the daemon is unreachable. This document merges the previously-separate `SET-UP_GUIDE.md` (runtime hooks, rollback CLI, operator states, reference commands) into the install bootstrap so there is a single source of truth.

---

## 0. AI-FIRST SETUP GUIDE

Copy and paste this prompt to your AI assistant to get setup help:

```
I want to set up the Skill Advisor from .opencode/skills/system-skill-advisor/runtime

Please help me:
1. Verify Node.js, npm and python3 are installed
2. Install dependencies and build the advisor runtime
3. Confirm the @spec-kit/shared package is linked (a missing link breaks the build)
4. Verify the advisor CLI answers: node .opencode/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json
5. Confirm the prompt-time brief appears on a work-intent prompt

Guide me through each step with the exact commands I need to run.
```

Your AI assistant will:
- Verify Node.js, npm and python3 are available
- Install and build the advisor runtime
- Check the `@spec-kit/shared` dependency link
- Confirm the CLI answers and the prompt-time brief arrives

**Expected setup time:** 3-5 minutes

---

## 1. OVERVIEW

The advisor is a TypeScript package under `.opencode/skills/system-skill-advisor/runtime/`, served through one CLI front door at `.opencode/bin/skill-advisor.cjs`. The CLI exposes 9 commands (`advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate` and the trusted-only `skill_graph_propagate_enhances`) and reaches the resident daemon over a unix socket. The package owns the handlers, schemas, tools, launcher, plus the package-local SQLite DB at `.opencode/skills/system-skill-advisor/runtime/database/skill-graph.sqlite`. The Python scorer at `runtime/scripts/skill_advisor.py` is called in production: the CLI runs it when the daemon is unreachable and marks the answer degraded. Nothing registers per runtime, because the prompt-time hooks and the OpenCode plugin ship with the repository.

---

## 2. PREREQUISITES

- Node.js and npm for the advisor runtime.
- `python3` on PATH: the local scorer and the graph scripts are Python.
- Repository root as the working directory.
- No runtime configuration: the prompt-time hooks and the OpenCode plugin are committed, and there is no MCP registration step.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset unless you are intentionally testing rollback.
- The local shared package at `.opencode/skills/system-spec-kit/shared` is present; `npm install` links it into `runtime/node_modules/@spec-kit/shared`.

---

## 3. INSTALLATION

The package ships source, not build output, so build it once:

```bash
npm --prefix .opencode/skills/system-skill-advisor/runtime install
npm --prefix .opencode/skills/system-skill-advisor/runtime run build
```

Verify the local shared package link exists. Missing this link breaks the build with `ERR_MODULE_NOT_FOUND` for `@spec-kit/shared`.

```bash
test -e .opencode/skills/system-skill-advisor/runtime/node_modules/@spec-kit/shared && echo "shared dependency linked"
```

That is the whole install. The CLI starts the daemon on first use, so there is nothing to register or start by hand.

---

## 4. VERIFICATION

Verify the CLI answers:

```bash
node .opencode/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json
node .opencode/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" --format json
node .opencode/bin/skill-advisor.cjs advisor_validate --confirm-heavy-run true --format json
```

The first two answer in about a second. `advisor_validate --confirm-heavy-run true` runs the heavier validation bundle and takes around ten seconds.

Expected:

- `advisor_status` returns `freshness`, `generation`, `trustState`, `lastGenerationBump`, `lastScanAt`, `skillCount` and `laneWeights`.
- `advisor_recommend` returns prompt-safe `recommendations[]`, cache state, lifecycle redirect metadata and freshness trust.
- `advisor_rebuild` rebuilds stale, absent or unavailable advisor state and returns before/after freshness diagnostics.
- `advisor_validate` returns real corpus, holdout, parity, safety and latency measurements.

---

## 5. PACKAGE CHECKS

Run before declaring setup complete:

```bash
npm --prefix .opencode/skills/system-skill-advisor/runtime run typecheck
npm --prefix .opencode/skills/system-skill-advisor/runtime run build
node -e "import('./.opencode/skills/system-skill-advisor/runtime/dist/runtime/lib/scorer/lanes/semantic-shadow.js')"
npm --prefix .opencode/skills/system-skill-advisor/runtime run test -- tests/handlers/advisor-recommend.vitest.ts tests/compat/shim.vitest.ts --reporter=default
```

For routing accuracy, run the validator and treat its JSON output as the baseline. One call returns the corpus, holdout, parity, safety and latency slices:

```bash
node .opencode/bin/skill-advisor.cjs advisor_validate --confirm-heavy-run true --format json
```

---

## 6. RUNTIME HOOKS AND PLUGIN

The prompt-time brief ships with the repository, so there is nothing to register:

| Runtime | Hook Surface |
| --- | --- |
| Claude Code | `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`, with the runtime shim at `.opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` |
| Codex and Devin | shims at `.opencode/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts` and `.../devin/user-prompt-submit.ts`, which delegate to the Claude shim |
| Cursor | `.opencode/skills/system-spec-kit/runtime/hooks/cursor/user-prompt-submit.ts` |
| Pi | `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, loaded as a Pi extension through the symlink at `.pi/extensions/prompt-advisor.ts` |
| OpenCode | `.opencode/plugins/system-skill-advisor.js` |

Every surface ends at the same stable entrypoint, the CLI:

```bash
node .opencode/bin/skill-advisor.cjs advisor_recommend --prompt "<request>" --format json
```

The CLI attaches to the daemon, starts it when the socket is cold and falls back to the Python local scorer when the daemon stays unreachable. The OpenCode plugin spawns this same CLI with a bounded timeout and fails open on expiry or exit `75`.

---

## 7. COMPAT SHIMS

`runtime/scripts/skill_advisor.py` is the advisor's local scorer. The CLI runs it in production whenever `advisor_recommend` cannot reach the daemon, and the answer it returns is marked degraded rather than live. Called directly, it probes the advisor first and falls back to local scoring when the probe is unavailable.

```bash
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "help me commit my changes"
printf '%s' "help me commit my changes" | python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --stdin
```

Mode meanings:

| Mode | Behavior |
| --- | --- |
| default | Probe the advisor. Use it when live or stale. Otherwise score locally with Python. |
| `--stdin` | Read one prompt from stdin. |
| `--force-native` | Require the advisor and fail prompt-safely when it is unavailable. |
| `--force-local` | Bypass the advisor and score locally. |

Testing controls:

```bash
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-native "save this context"
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-local "save this context"
```

Prompt-time surfaces run the same scorer, which is why a shim smoke test doubles as a hook smoke test. There is no plugin bridge or MCP client in the chain: the hooks and the OpenCode plugin shell out to `.opencode/bin/skill-advisor.cjs`, and the CLI starts the daemon through `.opencode/bin/system-skill-advisor-launcher.cjs` when the socket is cold.

---

## 8. ROLLBACK

Use rollback only long enough to diagnose or recover the daemon path.

| Control | Scope |
| --- | --- |
| `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | Disables prompt-time advisor briefs and makes the CLI and the scorer skip advisor work. |
| `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1` | Forces the Python local scorer instead of the daemon, in the shim and in the CLI's compat checks. |
| `--force-local` | Python scorer flag: bypass the advisor and score locally. |
| `--force-native` | Python scorer flag: require the advisor and fail prompt-safely. |

```bash
# Disable prompt-time advisor surfaces and native recommendation output.
export SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1

# Keep hooks enabled but force Python compatibility where supported.
export SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1

# CLI-only Python path.
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-local "your prompt"
```

Unset variables after recovery:

```bash
unset SPECKIT_SKILL_ADVISOR_HOOK_DISABLED
unset SPECKIT_SKILL_ADVISOR_FORCE_LOCAL
```

---

## 9. OPERATOR CHECKS

`skill_graph_*` commands are served by the advisor daemon and reached through the CLI; the command ids are stable.

Use `advisor_status` as the prompt-safe health source:

```bash
node .opencode/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json
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
.opencode/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md
```

### Indexer scan-vs-index counts

`skill_graph_scan` reports two numbers: `scannedFiles` (every `graph-metadata.json` discovered) and `indexedFiles` (real skills indexed into SQLite). The delta is normally 1 or 2 files. The indexer skips `scripts/test-fixtures/*/graph-metadata.json` (test scaffolding) and emits a `NON-SKILL-METADATA: skipped` warning. A larger delta means real skills are being filtered, so inspect the warning list.

H5 operator scenarios live in the manual playbook under `operator-h5/`.

---

## 10. TROUBLESHOOTING

| What You See | Cause | Fix |
| --- | --- | --- |
| Build or CLI startup fails with `ERR_MODULE_NOT_FOUND` for `@spec-kit/shared` | The advisor package is installed but the local shared package link is missing from `runtime/node_modules`. | Run `npm --prefix .opencode/skills/system-skill-advisor/runtime install` then `npm --prefix .opencode/skills/system-skill-advisor/runtime run build`. |
| The brief says `Advisor: stale`, or `advisor_recommend` returns `degraded: true` | The daemon was unreachable, so the CLI answered from the Python local scorer. | A degraded answer is usable. Check `python3` is on PATH and retry; pass `--warm-only` to make the CLI fail instead of degrading. |

---

## 11. REFERENCE COMMANDS

```bash
# Build and typecheck the runtime package
npm --prefix .opencode/skills/system-skill-advisor/runtime run build
npm --prefix .opencode/skills/system-skill-advisor/runtime run typecheck

# Advisor health and recommendation through the CLI
node .opencode/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json
node .opencode/bin/skill-advisor.cjs advisor_recommend --prompt "create a pull request on github" --format json

# Trusted graph mutation
node .opencode/bin/skill-advisor.cjs skill_graph_scan --trusted --format json

# Python local scorer, direct
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "create a pull request on github"
printf '%s' "save this conversation context to memory" | \
  python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --stdin

# Native required
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-native "save this context"

# Python fallback required
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-local "save this context"

# Regression compatibility
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor_regression.py \
  --dataset .opencode/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl
```

---

## 12. CHOOSING AN EMBEDDER

The skill-advisor `semantic_shadow` lane runs against a pluggable embedder layer. As of phase `003/006` the contract surface (adapter interface, types, manifest registry, Ollama adapter) lives in `@spec-kit/shared/embeddings/`, which the advisor now owns. Skill-advisor's local `runtime/lib/embedders/` files are thin re-export shims plus a skill-advisor-specific `schema.ts` integration that targets the package-local SQLite database at `runtime/database/skill-graph.sqlite`. This section is the new-user onboarding view; the canonical embedder narrative lives at [embedder-pluggability.md](../system-spec-kit/references/memory/embedder-pluggability.md).

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

Source of truth: [`@spec-kit/shared/embeddings/registry.ts`](../system-spec-kit/shared/embeddings/registry.ts). Skill-advisor's local `runtime/lib/embedders/registry.ts` is a re-export shim — adding manifests is a single edit in the shared package. The seven text-tuned manifests registered today, each as a frozen `EmbedderManifest`:

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

**Manual override.** [`setActiveEmbedder()`](./runtime/lib/embedders/schema.ts) writes a specific manifest into `vec_metadata` and creates the matching `vec_<dim>` table:

```typescript
import Database from 'better-sqlite3';
import { setActiveEmbedder } from './runtime/dist/.../lib/embedders/schema.js';

const db = new Database('.opencode/skills/system-skill-advisor/runtime/database/skill-graph.sqlite');
setActiveEmbedder(db, 'jina-embeddings-v3', 1024);
```

Effect of the call:

- `vec_metadata.active_embedder_name` -> `jina-embeddings-v3`
- `vec_metadata.active_embedder_dim` -> `1024`
- `vec_1024` table created (if absent), schema `(skill_id, embedding BLOB, model_id, content_hash, updated_at)`
- `hasActiveEmbedderPointer(db)` returns `true`, so both read path (`semantic-shadow.ts`, `loadSkillEmbeddings()`) and write path (`refreshSkillEmbeddingsViaAdapter`) target `vec_<active.dim>`
- The shared cascade is skipped on subsequent restarts (a manual override pins the pointer)

There are intentionally no embedder-administration commands here. Skill-advisor's surface is one database helper plus the cascade-driven sentinel. Operator discipline owns any manual swap workflow; there is no async re-index orchestrator on the skill-advisor side.

### 12.4 Operator-safe swap runbook

The writer cross-wire shipped in phase `004` and the cascade-driven default shipped in phase `003/006`. The pointer flip is now safe end-to-end:

1. Stop the daemon.
2. Snapshot `runtime/database/skill-graph.sqlite`.
3. (Optional) Call `setActiveEmbedder()` to override the cascade choice.
4. Restart the daemon. `ensureActiveEmbedder()` either honours your override or runs the cascade. The first scan or watcher tick populates `vec_<active.dim>` via the adapter dispatcher.
5. Smoke-test `advisor_recommend` through the CLI against three queries (`"memory save"`, `"code search"`, `"spec folder"`) and confirm top-3 picks are sane.

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

- Canonical shared-embedder narrative: [`embedder-pluggability.md`](../system-spec-kit/references/memory/embedder-pluggability.md) — covers skill-advisor and the shared design rationale.
- Shared contract surface: [`@spec-kit/shared/embeddings/`](../system-spec-kit/shared/embeddings/) — the canonical adapter, types, registry and Ollama adapter.
- Shared cascade: [`@spec-kit/shared/embeddings/auto-select.ts`](../system-spec-kit/shared/embeddings/auto-select.ts) — file-locked Ollama → hf-local → OpenAI → Voyage probe chain (ADR-014 local-first). Accepts optional `contentType: 'text' \| 'code'` parameter (default `'text'`).
- Skill-advisor schema helpers: [`runtime/lib/embedders/schema.ts`](./runtime/lib/embedders/schema.ts).
- Architecture-gap follow-on: packet `003/006-shared-embedder-logic-with-spec-memory` (shipped phase 003/006).

---

## 13. RELATED RESOURCES

| Document | Purpose |
| --- | --- |
| [README.md](./README.md) | Operator overview, quick start, runtime integrations. |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Package-local architecture and public API entrypoints. |
| [Hook reference](./hooks/skill-advisor-hook.md) | Prompt-time hook surfaces for each runtime. |
| [Manual testing playbook](./manual-testing-playbook/manual-testing-playbook.md) | OP-001 / OP-002 operator scenarios + indexer edge cases. |
| [Embedder pluggability narrative](../system-spec-kit/references/memory/embedder-pluggability.md) | Canonical embedder-pluggability reference. |

---

## 14. TUNING THE ADVISOR

Installation makes the advisor run; tuning makes it route *your* skills accurately. The advisor scores each prompt against every skill's `graph-metadata.json` signals plus the scorer lane tables (`TOKEN_BOOSTS`, `PHRASE_BOOSTS`, `CATEGORY_HINTS`). There are two tuning paths — a fast signal-only loop and the full gated workflow.

### 14.1 Quick tuning (no rebuild) — recommended for external clones

Most "match my setup" needs are signal additions, not lane-weight changes:

1. Edit `intent_signals` (and optionally `derived.trigger_phrases` / `derived.key_topics`) in the per-skill `graph-metadata.json`:
   ```bash
   $EDITOR .opencode/skills/<name>/graph-metadata.json
   ```
2. Re-index the SQLite graph — REQUIRED, or the edit has ZERO effect on routing:
   - Trusted CLI: `node .opencode/bin/skill-advisor.cjs skill_graph_scan --trusted --format json`
3. Verify: `node .opencode/bin/skill-advisor.cjs advisor_recommend --prompt "your test phrase" --format json` — your skill should now appear.

> **Critical:** the advisor reads scoring inputs from `.opencode/skills/system-skill-advisor/runtime/database/skill-graph.sqlite`, NOT from `graph-metadata.json` directly. Editing JSON without re-indexing produces identical pre-edit scores.

### 14.2 Full tuning — `/doctor skill-advisor`

For batch optimization across all skills plus lane-weight tuning, run the gated doctor workflow:

| Use case | Command |
| --- | --- |
| First-time tuning / re-tune after adding a skill | `/doctor skill-advisor` |
| Preview without writing | `/doctor skill-advisor --dry-run` |
| Tune one lane only | `/doctor skill-advisor --scope=explicit` (or `derived` / `lexical`) |
| Skip post-apply tests (not recommended) | `/doctor skill-advisor --skip-tests` |

Five phases gated behind operator approval: Discovery → Analysis → Proposal → Apply → Verify. Phase 3 (Apply) rebuilds `dist/`, runs `skill_graph_scan`, runs the advisor test suite, and writes a per-run rollback script. Full reference: `.opencode/commands/doctor/speckit.md` and `.opencode/commands/doctor/assets/doctor_skill-advisor_{auto,confirm}.yaml`.

### 14.3 What tuning touches

Mutates only:

- `.opencode/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` (`TOKEN_BOOSTS`, `PHRASE_BOOSTS`)
- `.opencode/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts` (`CATEGORY_HINTS`)
- `.opencode/skills/<name>/graph-metadata.json` (`intent_signals`, `derived.trigger_phrases`, `derived.key_topics`)

Never touches any `SKILL.md` content, `weights-config.ts`, the fusion scorer, or daemon code. Any MANUAL edit to these files (e.g. the Quick-tuning recipe above) requires a re-index (`skill_graph_scan`) — the SQLite graph is the runtime source of truth.

### 14.4 Tuning rollback

`/doctor skill-advisor` Phase 3 writes a per-run rollback script at `<packet_scratch>/rollback-<timestamp>.sh` (under `<spec-folder>/scratch/` or `.opencode/scratch/`) that restores only the files that run modified — unrelated WIP is preserved — and rebuilds the package at the end. Prefer it over a broad `git checkout HEAD -- ...`, which would discard unrelated WIP.

If the per-run script is unavailable (the run failed before Phase 3 completed), stash unrelated WIP first, then restore from HEAD and rebuild:

```bash
git stash push -m "skill-advisor-rollback-safety" -- \
  .opencode/skills/system-skill-advisor/runtime/lib/ \
  .opencode/skills/*/graph-metadata.json

git restore --source=HEAD -- \
  .opencode/skills/system-skill-advisor/runtime/lib/ \
  .opencode/skills/*/graph-metadata.json

npm --prefix .opencode/skills/system-skill-advisor/runtime run build
```
