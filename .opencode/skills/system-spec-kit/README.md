---
title: "System Spec Kit"
description: "Unified spec-folder documentation and persistent context preservation: template-backed levels, validated structure and local-first searchable memory across AI sessions."
trigger_phrases:
  - "spec kit"
  - "spec folder"
  - "memory system"
  - "hybrid search"
  - "context preservation"
  - "documentation levels"
  - "memory save"
  - "spec folder workflow"
version: 3.6.0.99
---

# System Spec Kit

> Documentation and memory for AI-assisted development. Every file change gets a spec folder. Every session gets persistent context.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Capturing why code changed and resuming that reasoning across sessions |
| **Invoke with** | "spec kit", "spec folder", "memory save", "speckit resume" or automatic Gate 3 routing |
| **Works on** | File-modifying AI conversations that need a documentation trail and cross-session memory |
| **Produces** | Templated spec folders at four levels, a validated file structure and a searchable local index |

---

## 2. OVERVIEW

### Why This Skill Exists

AI conversations that modify files leave no reasoning trail. The session ends and the why behind every decision vanishes. AI assistants also start every session from a blank slate, so the architecture you explained on Monday is gone by Wednesday. Without enforced documentation and a persistent memory, one session cannot build on another.

### What It Does

System Spec Kit captures every file-modifying conversation in a templated spec folder, indexed at one of four documentation levels matched to task complexity. The local SQLite index makes those decisions searchable across sessions using five fused retrieval channels, and `/speckit:resume` rebuilds the active context from the packet-local handover chain. `/memory:save` routes session updates into canonical documentation surfaces so the next session picks up where the last one left off, regardless of which AI model or tool you use.

### How This Compares

Manual documentation is ad hoc and inconsistent. Basic RAG offers vector similarity over a stateless index. System Spec Kit replaces both with templated spec folders at four levels, validated structure and a five-channel hybrid search fused via Reciprocal Rank Fusion. Context survives across sessions through a local indexed-continuity store rather than copy-paste from notes. Decay follows an FSRS power-law curve tuned by content type and importance, not a flat "remember everything" or naive exponential.

### Requirements

Requires Node.js >= 20.11, TypeScript 5.0+ and Bash 4.0+. Embeddings are local-first (ADR-014): the runtime probes Ollama first (default, `nomic-embed-text`, 768-dim), falls through to pure-Node hf-local and only escalates to OpenAI or Voyage when an API key is set and no local tier is available. The recommended new-user setup is installing Ollama and running `ollama pull nomic-embed-text:v1.5`. The cascade auto-detects it, no API keys required and all embeddings stay on-device.

---

## 3. QUICK START

### Create Your First Spec Folder

When an AI assistant asks "Which spec folder?" at Gate 3, choose Option B (New) to create one:

```bash
# Create a Level 1 spec folder
bash .opencode/skills/system-spec-kit/scripts/spec/create.sh 042-my-feature

# Creates: specs/042-my-feature/
# Files: spec.md, plan.md, tasks.md (Level 1 starters)
```

The script sets up the folder, copies the right templates for the chosen level, initializes `description.json` and prepares the packet docs plus `scratch/` workspace. Continuity no longer writes to `[spec]/memory/*.md`. Use `/memory:save` to route updates into canonical packet docs such as `implementation-summary.md`, `decision-record.md` and `handover.md`.

### Save Context at the End of a Session

When your work session ends, save what happened so the next session can continue:

```bash
# Update the canonical continuity surfaces from structured JSON
node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js \
  --json '{"specFolder":"042-my-feature","user_prompts":["Implement login form validation"],"observations":["Added client-side validation for empty email and password"],"recent_context":["Touched auth form schema and submit handler"],"toolCalls":["npm test -- auth"],"exchanges":["Verified the error states render before submit"]}' \
  specs/042-my-feature/

# Result: canonical continuity surfaces updated for the target spec folder
```

Or use the command shorthand:

```text
/memory:save 042-my-feature
```

The `/memory:save` command's generate-context lane refreshes `description.json.lastUpdated` and `graph-metadata.json.derived.*`. Direct MCP `memory_save({ filePath })` indexes content only; on mutating packet-doc saves it returns a `metadataRefresh` advisory with `refreshed:false` and points callers back to the generate-context save lane when packet metadata must be current.

### Resume Work From a Previous Session

Start a new session on work you did before:

```text
/speckit:resume
```

The system first resolves the requested folder. If it is a phase parent with a valid `derived.last_active_child_id`, resume follows that pointer into the active child before comparing folder-local `handover.md` and `_memory.continuity` in `implementation-summary.md`; it then falls back to the packet's canonical spec docs. It presents the current state, prior decisions, touched files and next steps before you start.

### Search for Context

Ask the indexed-continuity store a question in plain language:

```text
/memory:search "how did we decide on the auth architecture?"
```

The system reads your question, figures out you are looking for a past decision and routes to the right search strategy automatically.

### Validate a Spec Folder

```bash
# Run the default validation set (36 non-strict rules; registry has 38 total)
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/[project]/042-my-feature/

# Exit 0 = success, Exit 1 = user error, Exit 2 = validation error, Exit 3 = system error
```

### Verify the MCP Is Running

Check that Spec Kit Memory tools are available:

```json
{
  "tool": "memory_health",
  "arguments": { "reportMode": "full" }
}
```

The response should return `status: "ok"` and database table counts. If it returns an error, see [Troubleshooting](#7-troubleshooting).

The same check works from a shell through the daemon-backed CLI, which fronts the identical 39-tool surface:

```bash
# Enumerate the tools without touching the daemon
node .opencode/bin/spec-memory.cjs list-tools --format text

# Call a tool against the live daemon (auto-spawns it when cold)
node .opencode/bin/spec-memory.cjs memory_health --json '{"reportMode":"full"}' --format json
```

Exit codes: `0` success, `1` runtime error, `64` usage/schema error, `69` protocol/dist mismatch, `75` retryable daemon error. Pass `--warm-only` in prompt-time contexts so a cold daemon yields exit `75` instead of a cold spawn.

OpenCode note: if the MCP server runs in a restricted or read-only repo context, point `SPEC_KIT_DB_DIR` at a writable directory such as one under your home folder or `/tmp`. Use `MEMORY_DB_PATH` only when you intentionally need one fixed sqlite file.

---

## 4. FEATURES

### 4.1 SPEC FOLDER WORKFLOWS

#### What Spec Folders Are

A spec folder is a numbered directory (like `specs/042-my-feature/`) that holds the documentation for a single unit of work. Think of it as a project folder for an AI conversation. It keeps the specification, plan, task list and implementation summary together so the reasoning behind every change is preserved. For packet roots and direct child phases, closeout can also produce packet-local changelog entries that live beside the packet instead of only in the global release stream.

Every conversation that modifies files gets a spec folder. This is enforced by Gate 3 in the project's AGENTS.md. The AI assistant asks "Which spec folder?" before any file modification begins. The only exemptions are single-file fixes under 5 characters (typo or whitespace corrections).

#### Documentation Levels

Not every change needs the same amount of paperwork. A one-line bug fix does not need an architecture decision record. A multi-system refactor does. Spec Kit uses four levels to match documentation depth to task complexity.

| Level  | LOC Guidance   | Required Files                                        | When to Use                                          |
| ------ | -------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| **1**  | < 100          | spec.md, plan.md, tasks.md, implementation-summary.md | Small features, bug fixes, single-file changes       |
| **2**  | 100 - 499      | Level 1 + checklist.md                                | Features needing QA verification, multi-file changes |
| **3**  | 500+           | Level 2 + decision-record.md                          | Architecture changes, complex refactors              |
| **3+** | Complexity 80+ | Level 3 + approval workflow, compliance, stakeholders  | High-complexity work needing review tracking          |
| **Phase Parent** | n/a (control file only) | spec.md, description.json, graph-metadata.json | Folder contains phase children (`[0-9]{3}-name/` subdirs with their own spec.md/description.json) |

The LOC ranges are guidance, not hard rules. Risk, complexity and the number of affected files can push a task to a higher level. When in doubt, choose the higher level.

**Implementation-summary.md** is required at all levels but created **after** implementation completes, not at spec folder creation time.

Packet-local changelogs are additive, not a replacement for `implementation-summary.md`. When the target is a packet root or direct child phase, `/speckit:implement`, `/speckit:complete` and the nested changelog workflow can write packet history into a local `changelog/` directory using the canonical root/phase naming rules.

#### Spec Folder Structure

When `create.sh` builds a spec folder, it produces this layout:

```text
specs/<###-feature-name>/
├── description.json             # Spec identity and memory tracking metadata
├── spec.md                      # What the feature is and why it exists
├── plan.md                      # How to implement it
├── tasks.md                     # Step-by-step task breakdown
├── checklist.md                 # QA validation gates (Level 2+)
├── decision-record.md           # Architecture decisions (Level 3+)
├── implementation-summary.md    # Post-implementation summary (all levels)
├── handover.md                  # Operator-facing session handoff for /speckit:resume
├── resource-map.md              # Optional lean path catalog (any level)
├── changelog/                   # Packet-local changelog history for packet roots / phase parents
└── scratch/                     # Temporary workspace files (gitignored)
```

`generate-context.js` updates the packet's continuity state for `/speckit:resume`, refreshes `description.json.lastUpdated` and rewrites `graph-metadata.json` derived fields on every generate-context save-lane run. Direct MCP `memory_save({ filePath })` does not refresh those metadata files; its success response includes a `metadataRefresh` advisory when packet metadata may now lag. Recovery then compares folder-local `handover.md` and `_memory.continuity` freshness, with packet docs as fallback.

**Phase parents** are an exception. When a folder contains phase children (matching `^[0-9]{3}-[a-z0-9-]+$` with their own `spec.md` or `description.json`), the parent only requires the **lean trio**: `spec.md`, `description.json`, `graph-metadata.json`. Heavy docs (`plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) live exclusively in the children where they stay accurate to that phase's actual work. The parent's `spec.md` carries a Phase Documentation Map. The parent's `graph-metadata.json` carries `derived.last_active_child_id` + `derived.last_active_at` pointer fields that the generator atomically updates on every save (parent saves write `null`, child saves bubble up the child's `packet_id`). `/speckit:resume` reads `derived.last_active_child_id` first when the target is a phase parent and follows valid bare child ids (`001-phase`) or track-relative child paths under the parent. The redirect is bounded and escape-safe; missing, malformed, stale-to-missing-child, or non-child pointers leave resume on the requested folder instead of escaping the packet tree. Detection is a single source of truth: `is_phase_parent()` (shell) and `isPhaseParent()` (ESM JS) MUST agree.

#### Checklist Priority System (Level 2+)

Checklists use a priority system so reviewers know what blocks shipping and what can wait:

| Priority | Meaning                                                 | Deferral                        |
| -------- | ------------------------------------------------------- | ------------------------------- |
| **P0**   | Hard blocker, cannot ship without this                | Cannot defer                    |
| **P1**   | Required, must complete or get user approval to defer | Needs explicit approval to skip |
| **P2**   | Optional, nice to have                                | Can defer without approval      |

#### Phase Decomposition

When a feature is too large for a single spec folder, use phase decomposition to split it into parent and child folders. The parent holds the overall specification. Each child holds one phase of the work.

```text
specs/022-big-feature/             # Parent spec folder
├── spec.md                        # Overall specification
├── 001-data-model/                # Phase 1 child
│   ├── spec.md
│   └── ...
├── 002-api-endpoints/             # Phase 2 child
│   ├── spec.md
│   └── ...
└── 003-frontend/                  # Phase 3 child
    ├── spec.md
    └── ...
```

Use `create.sh --phase` to create a parent with its first child in one step. The parent and child folders render from the manifest template source through the Level contract resolver. Run `validate.sh --recursive` to validate the parent and all children together. The validator's phase-parent branch automatically skips Level-N expectations on the lean parent (rules with branches: `check-files.sh`, `check-level-match.sh`, `check-anchors.sh`, `check-section-counts.sh`, `check-template-headers.sh`).

Tolerant migration policy: legacy phase parents that retain heavy docs continue to validate without churn. Soft deprecation is a separate follow-on packet.

#### Validation

The `validate.sh` script runs 20+ rules against a spec folder and reports what passes and what needs fixing. Rules check for required files, template compliance, placeholder detection, anchor markers and cross-reference consistency. The new `PHASE_PARENT_CONTENT` rule (severity: warn) scans phase-parent `spec.md` for forbidden migration-history tokens (consolidation/merge/rename narratives) and is code-fence + HTML-comment aware. In strict flows, the validation surface includes `_memory.continuity` freshness checks plus strict `EVIDENCE` marker linting, with the bracket-depth audit script available for repair sweeps before rerunning validation.

| Exit Code | Meaning          | Action                              |
| --------- | ---------------- | ----------------------------------- |
| 0         | All rules pass   | Ready to proceed                    |
| 1         | User error       | Fix the flag or input and retry     |
| 2         | Validation error | Fix the spec folder before claiming completion |
| 3         | System error     | Check file I/O, missing manifest or environment |

Run with `--verbose` to see the details behind each rule or `--recursive` to validate a parent and all child phase folders.

---

<!-- divider:4.2 -->

### 4.2 MEMORY SYSTEM

The indexed-continuity store lives in an MCP server that gives AI assistants persistent memory across sessions, models and tools. It stores context in a local SQLite database and retrieves exactly what is relevant when a new session starts.

Think of it like a personal librarian that keeps notes on every conversation, files them by topic and hands you the right ones when you start a new task. Switch from Claude to GPT and back. The spec-doc record stays the same because it lives on your machine, not inside any AI's context window.

For full architecture details, the 39-tool API reference, search pipeline internals and configuration, see [`mcp_server/README.md`](./mcp_server/README.md).

#### Dual-Stack Access: MCP and CLI

The memory surface is dual-stack. The `mk-spec-memory` MCP registration stays the native in-session path today, and `node .opencode/bin/spec-memory.cjs` is a full-parity CLI front door over the **same daemon** with the identical 39 tools — nothing about the daemon changed, only the IPC transport. Use MCP for live in-session calls. Use the CLI for hooks, cron jobs, CI, operator shell diagnostics and transport-down recovery: when an MCP transport drops mid-session and the client never reconnects it, the CLI still reaches every tool. Prompt-time callers must probe warm-only first; exit `75` means retryable daemon or IPC unavailability. `list-tools` answers offline; every other command speaks JSON-RPC to the daemon over the IPC socket. Shared exit taxonomy across the three sibling CLIs (`spec-memory`, `code-index`, `skill-advisor`): `0`/`1`/`64`/`69`/`75`. The shim refuses to run a stale build (exit `69`; `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1` for dev loops), and `--warm-only` plus the prompt-time env flags keep prompt-time hooks from ever cold-spawning the daemon. Because this CLI already has full parity, a later evolution could make the CLI the primary or sole transport without breaking existing MCP workflows; that is a possible direction, not a committed plan. See [`mcp_server/ENV_REFERENCE.md`](./mcp_server/ENV_REFERENCE.md) for the CLI env-flag table.

#### Hybrid Search

When you search, the system checks five sources at once, like a librarian who checks the card catalog, the shelf labels, the reading room sign-out sheet, the recommendation board and the "related topics" corkboard all at the same time.

| Channel          | How It Works                                        | Good For                                       |
| ---------------- | --------------------------------------------------- | ---------------------------------------------- |
| **Vector**       | Compares meaning via embeddings (`nomic-embed-text-v1.5` 768d local default) | Finding related content even when words differ |
| **FTS5**         | Full-text search on exact words and phrases         | Specific terms and error messages              |
| **BM25**         | Keyword relevance scoring                           | Ranking when you know roughly what you want    |
| **Causal Graph** | Follows cause-and-effect links between memories     | "Why did we choose this?" questions            |
| **Degree**       | Scores by graph connectivity, weighted by edge type | Finding important hub decisions                |

Results from all channels are combined using Reciprocal Rank Fusion (RRF) with a K parameter tuned per query intent. A spec-doc record that scores well in multiple channels rises to the top.

#### Search Pipeline

Every search goes through four stages, like an assembly line where each station has one clear job:

1. **Gather**: collect candidates from active channels in parallel. Constitutional memories are always injected regardless of score.
2. **Score**: fuse channel results with RRF, then apply the post-fusion scoring signals in one authoritative pass (session boost, recency fusion, causal boost, co-activation spreading, community co-retrieval, graph signals, FSRS testing effect, intent weights, artifact routing, feedback signals, anchor and validation metadata enrichment). Intent weights are applied here only for non-hybrid search, so hybrid results are never double-weighted.
3. **Rerank**: apply MMR diversity reranking (algorithmic, no model) to reduce near-duplicate results, then collapse chunks back to parent memories.
4. **Filter**: enforce score immutability, apply state filtering, annotate with confidence labels (high/medium/low) and truncate at the confidence gap.

#### Query Intelligence

Before any search runs, the system figures out what kind of help you need, like a triage nurse who reads your symptoms and routes you to the right specialist.

- **Complexity routing** sizes up your question and picks how many channels to use (2 for simple, 4 for moderate, all 5 for complex)
- **Intent classification** maps your query to one of 7 task types (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision), each with its own channel weight profile
- **Query decomposition** splits multi-topic questions into focused sub-queries without needing an LLM call
- **HyDE fallback** writes a hypothetical answer to your question, then searches for real documents matching it, surfacing content your original wording missed

#### Memory Lifecycle

Not all spec-doc records are equally useful forever. The system uses FSRS (Free Spaced Repetition Scheduler) to track freshness, a decay model validated on 100M+ Anki flashcard users.

| Tier               | Description                       | Decay Behavior                           |
| ------------------ | --------------------------------- | ---------------------------------------- |
| **Constitutional** | Always-surface rules (3.0x boost) | Never decays                             |
| **Critical**       | High-importance decisions         | Never decays or decays at 2x slower rate |
| **Important**      | Significant patterns              | 1.5x slower than normal                  |
| **Normal**         | Standard session context          | Standard FSRS decay                      |
| **Temporary**      | Quick scratch notes               | Fast decay                               |
| **Deprecated**     | Superseded content                | Fastest decay                            |

Decay speed is also controlled by content type (decisions decay slower than general notes). Memories earn promotions through positive feedback: 5 thumbs-up promotes normal to important, 10 promotes to critical.

Four active cognitive states track access patterns: **HOT** (just used), **WARM**, **COLD** and **DORMANT**. Hot memories get full content in results. Warm ones appear as summaries. Cold and dormant content only surfaces if it still scores well enough.

#### Causal Graph

The system tracks how decisions relate to each other, like a corkboard with sticky notes connected by string. One note says "we chose JWT tokens." A string connects it to "because the session store was too slow." Another string connects that to "the Redis outage on March 5th."

Six relationship types: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`. Community detection (Louvain algorithm) automatically clusters related memories so finding one surfaces its neighbors.

#### Causal Trust Display Badges (012/005)

`memory_search` results now carry an additive `trustBadges` payload per `MemoryResultEnvelope`. The badges read existing causal-edge columns at response time, so callers can judge whether a causal claim looks fresh and well-supported without changing storage.

| Badge | Source |
|-------|--------|
| `confidence` | clamped from the strongest connected edge `strength` |
| `extractionAge` | human-readable age from the newest connected `extracted_at` |
| `lastAccessAge` | human-readable age from the newest connected `last_accessed` |
| `orphan` | `true` when the result has no incoming causal edges |
| `weightHistoryChanged` | `true` when any connected edge has a `weight_history` row |

The formatter at `mcp_server/formatters/search-results.ts` batch-derives the badges from existing causal-edge tables, fails open when the DB handle or `weight_history` table is unavailable and preserves any precomputed `trustBadges` payload a caller already supplied. Response-profile shaping in `mcp_server/lib/response/profile-formatters.ts` preserves the badge payload through `quick`, `research` and `resume` outputs on `results[]` and `topResult` rather than dropping it. Display only: no schema change, no new relation types, no new storage of code/process/tool facts (ADR-012-005).

#### Save Intelligence

When you save new content, the system runs an arbitration process before storing anything. Prediction Error gating compares incoming content against existing spec-doc records and picks one of four outcomes:

| Outcome       | When                               | What Happens                                |
| ------------- | ---------------------------------- | ------------------------------------------- |
| **CREATE**    | Nothing similar exists             | Stored as new knowledge                     |
| **REINFORCE** | Similar exists, new one adds value | Both kept, existing gets a confidence boost |
| **UPDATE**    | Similar exists, new one is better  | Old version replaced in place               |
| **SUPERSEDE** | New knowledge contradicts the old  | New version active, old one demoted         |

Three quality gates run before storage: structure check (required format and metadata), semantic sufficiency check (enough real content to be useful) and duplicate detection.
Short decision-type memories can bypass the content-length gate when SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS=true and at least two structural signals (title, specFolder or anchor) are present.

#### Embedding Reconciliation

`memory_embedding_reconcile` is a maintenance tool on the mk-spec-memory surface. It converges `embedding_status` for vector-present stale rows and resets genuinely missing-vector retry rows inside one guarded `BEGIN IMMEDIATE` transaction. The default mode is `dry-run`: no writes happen unless `mode: "apply"` is passed. Use it after an embedder swap or after the health report shows a high pending/failed count.

```json
{ "tool": "memory_embedding_reconcile", "arguments": { "mode": "dry-run" } }
```

#### Index Scan Self-Maintaining Behavior

`memory_index_scan` is self-maintaining from spec 026 onward. Overlapping scan calls return a `coalesced: true` success envelope instead of a raw E429 error. Rows become BM25/FTS-searchable immediately as `pending` while vectors drain (`complete_with_pending_vectors` with a `pendingVectors` count), so content is always text-searchable even when the embedding queue is backed up. Move reconciliation heals renamed spec folders by packet identity without re-embedding. Each scan also runs a bounded global orphan sweep.

`memory_health` now includes an `index` block with a `summary` enum and row counts:

| Summary value | Meaning |
| --- | --- |
| `healthy_fresh` | Index is current and all vectors are resolved |
| `healthy_lagging_vectors` | Index is current but some vectors are still pending |
| `stale_needs_scan` | Index has not been scanned recently |
| `degraded_needs_repair` | Failed rows require `memory_embedding_reconcile` |
| `unavailable` | Index state could not be read |

#### Index Schema History (v34 -> v41) and the `.needs-rebuild` Sentinel

The SQLite index schema (`mcp_server/lib/search/vector-index-schema.ts`, `SCHEMA_VERSION = 41`) advanced eight migrations during the shipped memory hardening work. Each is additive and applied automatically at server boot:

| Migration | Adds | Effect |
| --- | --- | --- |
| **v34** | `memory_trigger_embeddings` table and status index | Stores derived trigger-phrase embeddings for default-off semantic trigger shadow matching. Lexical trigger matching remains primary unless the semantic trigger flags are explicitly enabled. |
| **v35** | `memory_index.source_kind` with provenance backfill | Normalizes saved row provenance into `human`, `agent`, `system`, `import` or `feedback` while preserving safe defaults for older rows. |
| **v36** | `memory_idempotency_receipts`, `delete_after`, `near_duplicate_of`, `last_dedup_checked_at` | Adds server-derived replay receipts for save/update paths and advisory near-duplicate hints without making the feature active unless `SPECKIT_MEMORY_IDEMPOTENCY=true`. |
| **v37** | `deleted_at`, active recall index, purgeable retention index | Adds tombstone-ready partitions so delete and retention paths can use soft-delete tombstones when `SPECKIT_SOFT_DELETE_TOMBSTONES=true`. |
| **v38** | Bi-temporal validity windows | Preserves `valid_at` and `invalid_at` legacy columns alongside the new validity-window columns so temporal queries can reason about both ingest time and validity time. |
| **v39** | Causal-edge closure-provenance marker | Adds an edge presence and currentness marker so causal-edge closure can record its provenance. |
| **v40** | Generated causal-edge derived identity | Adds derived-identity provenance to generated causal edges and backfills existing rows. |
| **v41** | Retention-forgetting and semantic-edge schema support | Adds retention-forgetting partitions and the semantic-edge layer schema. |

After a checkpoint restore that swaps the live DB files, the runtime writes a `.needs-rebuild` sentinel (`NEEDS_REBUILD_SENTINEL_NAME` in `mcp_server/lib/storage/checkpoints.ts`) beside the restored DB. The next boot detects it through `repairNeedsRebuildSentinel()` and rebuilds the derived indexes (FTS5/BM25 shadow and vector profile) before serving, so a restored snapshot never serves from a stale shadow. The sentinel is cleared once the rebuild completes.

#### Memory Hardening and Observability

The shipped memory-hardening surface is intentionally conservative. Semantic trigger scoring, feedback retention learning, session-trace causal inference, idempotency receipts, soft-delete tombstones and completion freshness all default OFF. When enabled, the first step is shadow, audit or advisory output so operators can compare behavior before changing live recall or retention.

| Feature | Default | Operator-facing behavior |
| --- | --- | --- |
| Semantic-trigger shadow | OFF | Computes semantic trigger candidates while lexical triggers remain primary; `union` mode still requires the master flag. |
| Idempotency and provenance | OFF for receipts; `source_kind` always present | Adds replay receipts and near-duplicate hints only when enabled; provenance is normalized as `human`, `agent`, `system`, `import` or `feedback`. |
| Soft-delete tombstones | OFF | Adds tombstone-aware delete and retention partitions behind `SPECKIT_SOFT_DELETE_TOMBSTONES`. Keep OFF until recall filters tombstoned rows consistently. |
| Retrieval observability | OFF by default | `SPECKIT_RESPONSE_TRACE=true` adds search trace payloads for debugging without changing the default concise response shape. |
| Feedback reducers | OFF | Session-trace causal inference and feedback-aware retention run only behind explicit gates; retention is shadow-first unless active mode has evidence. |
| Completion freshness | OFF | Strict validation can compare stored continuity fingerprints with packet content and optionally promote stale findings to errors. |

Stale-audit and tool-ownership lint are live guardrails around this surface: health checks report stale conditions, and pre-commit compares the generated tool-ownership map against live `TOOL_DEFINITIONS` so command ownership cannot drift silently.

#### MCP Front-Proxy and In-Place Daemon Recycle

The mk-spec-memory launcher fronts the backend daemon with a session proxy (`bridgeStdioThroughSessionProxy` in `.opencode/bin/mk-spec-memory-launcher.cjs`, implemented in `.opencode/bin/lib/launcher-session-proxy.cjs`). The proxy keeps one stable client-facing stdio session while the backend behind it can be recycled in place, for example when the RSS-ceiling watchdog (`SPECKIT_LAUNCHER_RSS_SELF_EXIT`) restarts the daemon or when a new build replaces the backend. Read-only replayable tools (`memory_search`, `memory_context` and similar) are transparently retried across a recycle so a routine restart looks like a brief pause rather than a hard failure to the caller.

This recycle/reconnect behavior surfaces three operator-visible error codes:

| Code | Retryable | Meaning |
| --- | --- | --- |
| `E429` | Legacy | The former index rate-limit class. The self-maintaining `memory_index_scan` contract replaced it with a `coalesced: true` success envelope, so a routine overlapping scan no longer returns `E429`. |
| `-32001` | **Yes** | `RETRYABLE_RECYCLE_ERROR`, the **live** launcher recycle signal (`backend recycled; retry`, `data.retryable: true`). The front-proxy emits it when the backend is recycling under it, and clients retry and reconnect. This code is **not removed**: only the index vector-drain *outage* path stopped surfacing its own `-32001` class. |
| `-32002` | No | `PROTOCOL_MISMATCH_ERROR`, a fail-closed protocol break (`backend protocol version changed; client reconnect required`, `data.retryable: false`). The proxy moves to a terminal CLOSED state and the client must reconnect from scratch, and it is never auto-retried. |

#### Evaluation Infrastructure

The indexed-continuity store includes built-in tools for measuring search quality:

- **Ablation studies**: turn off one search component at a time to measure its contribution, like removing one ingredient from a recipe to see if the dish still tastes good
- **12-metric computation**: MRR, NDCG, MAP and 9 other information retrieval metrics
- **Synthetic ground truth corpus**: 110 test questions with known correct answers for benchmarking, keyed to live parent-memory IDs. Rerun `scripts/evals/map-ground-truth-ids.ts` after DB rebuilds or imports before trusting ablation or reporting comparisons
- **Reporting dashboard**: performance trends across work periods and search channels, sourced from parent-memory-normalized eval rows even when retrieval hits came from chunks

---

<!-- divider:4.3 -->

### 4.3 COMMANDS

Spec Kit exposes its core workflow through the `/speckit:*` commands (`complete`, `implement`, `plan` and `resume`, where `plan` also has an `--intake-only` variant) plus the `/memory:*` operations. Repository-wide command entry points also include the `/deep:*` loop commands (one of which, `agent-improvement`, supersedes the former `improve` commands), the `/create:*` commands, the `/doctor` diagnostics and the `agent_router` and `prompt` utilities. Each command opens access to a specific set of tools.

#### Spec Kit Commands

| Command                 | Steps | Purpose                                                                                                                          |
| ----------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------- |
| `/speckit:plan --intake-only` | N/A   | Standalone intake interview that publishes `spec.md`, `description.json` and `graph-metadata.json`                        |
| `/speckit:complete`    | 14    | Full end-to-end workflow: spec through implementation, verification and packet-local changelog closeout, with the shared intake contract from [intake_contract.md](./references/workflows/intake_contract.md) when intake is still needed |
| `/speckit:plan`        | 7     | Planning only: spec through plan, no implementation, with the shared intake contract from [intake_contract.md](./references/workflows/intake_contract.md) for `no-spec`, `partial-folder`, `repair-mode` or `placeholder-upgrade` packets |
| `/speckit:implement`   | 9     | Execute pre-planned work. Requires existing `plan.md`. Packet-aware targets also generate local changelog output during closeout |
| `/speckit:resume`      | 4     | Resume a previous session on an existing spec folder                                                                             |
| `/deep:research` | N/A | Autonomous research loop with convergence detection plus bounded `spec.md` anchoring under [spec_check_protocol.md](../deep-loop-workflows/deep-research/references/protocol/spec_check_protocol.md) |
| `/deep:review` | N/A   | Autonomous code review loop with convergence detection                                                                           |

**Mode Suffixes** change how commands run:

| Suffix           | Behavior                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| `:auto`          | Execute without approval gates                                                                        |
| `:autopilot` / `:unattended` / `--unattended` | Run the branch-preserved unattended lifecycle; emit `SPECKIT_AUTOPILOT_RESULT` on terminal exits |
| `:confirm`       | Pause at each step for approval                                                                       |
| `:with-phases`   | Phase decomposition mode on planning / completion flows, not a standalone command                     |
| `:with-research` | Dispatch deep research before verification (`/speckit:complete` only)                               |

Autopilot is distinct from `:auto`: it requires unattended task metadata during planning, preserves the branch on hard failure, skips merge unless verification is clean and limits terminal failure/no-op reasons to `no_eligible_tasks`, `retry_exhausted`, `verification_failed` and `uncertainty_blocked`.

**Command source files**: `.opencode/commands/speckit/`

#### Memory Commands

| Command          | Tool Count | Purpose                                                                                                                                 |
| ---------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `/memory:save`   | 4          | Update packet continuity surfaces and supporting generated context artifacts with semantic indexing                                      |
| `/memory:search` | 13         | Search, retrieve and analyze knowledge. Auto-detects task intent from 7 types                                                           |
| `/memory:manage` | 20         | Database maintenance and lifecycle operations: stats, scan, cleanup, bulk-delete, checkpoints and ingest |
| `/memory:learn`  | 6          | Constitutional memory manager: create, list, edit, remove always-surface rules                                                          |

Session recovery lives in `/speckit:resume`, which compares folder-local `handover.md` and `_memory.continuity` in `implementation-summary.md`, selects the fresher source, then falls back to canonical spec docs before deeper memory retrieval is needed.

Some commands own their tools (they are the primary home) while others borrow tools from `/memory:search` or `/memory:manage`. A borrowed tool works the same way, it is just administered somewhere else.

**Command source files**: `.opencode/commands/memory/`

---

<!-- divider:4.4 -->

### 4.4 TEMPLATES

#### Manifest Architecture

Templates live in one manifest source and render through the Level contract resolver. `create.sh` asks the resolver which files belong to Level 1, Level 2, Level 3, Level 3+ or phase-parent packets, then the inline renderer expands only the sections allowed for that Level.

```text
Level 1:  spec.md, plan.md, tasks.md, implementation-summary.md
Level 2:  Level 1 + checklist.md
Level 3:  Level 2 + decision-record.md
Level 3+: Level 3 + extended governance sections
Phase:    lean parent trio plus child phase folders
```

Optional support documents such as `handover.md`, `debug-delegation.md`, `research.md` and `resource-map.md` are rendered by the workflow that owns them. New spec folders should be created through the CLI:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/create.sh --level 2 --path /tmp/example-spec --name "example spec"
```

Set `SPECKIT_POST_VALIDATE=1` when a strict workflow should run full validation immediately after scaffolding. The default path skips full post-create validation so normal scaffolds stay fast.

`create.sh` rejects `--path` values that traverse outside the repository (for example `--path "../etc/foo"`) with a clear error before any filesystem write happens.

A `mkdir`-based advisory lock protects `description.json` and `graph-metadata.json` writes during canonical save, so two parallel `/memory:save` calls for the same packet do not race.

#### Template Compliance

Templates use ANCHOR markers (`<!-- ANCHOR:section --> ... <!-- /ANCHOR:section -->`) to mark logical sections. Validation checks for required anchors, proper section ordering and template version alignment. The `template_compliance_contract.md` reference defines which anchors are required at each level.

---

<!-- divider:4.5 -->

### 4.5 SCRIPTS AND VALIDATION

#### Spec Management Scripts

The `scripts/spec/` directory holds the scripts that manage the full lifecycle of spec folders:

| Script                        | Purpose                                                                                        |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| `create.sh`                   | Create spec folders with level-appropriate templates. Use `--phase` for parent + child folders |
| `validate.sh`                 | Run the 36-rule default validation set from the 38-rule registry; strict-only rules are gated by `--strict` and env. Use `--recursive` for phase folders, `--verbose` for details |
| `upgrade-level.sh`            | Render additional Level contract sections for a higher documentation level                     |
| `recommend-level.sh`          | Analyze scope and risk to recommend the right documentation level                              |
| `calculate-completeness.sh`   | Calculate spec folder completeness as a percentage                                             |
| `check-completion.sh`         | Verify all completion criteria are met                                                         |
| `check-placeholders.sh`       | Find remaining `[PLACEHOLDER]` values after level upgrade                                      |
| `check-template-staleness.sh` | Detect templates that need regeneration                                                        |
| `progressive-validate.sh`     | Progressive validation for in-progress work                                                    |
| `quality-audit.sh`            | Run quality audit on spec folder content                                                       |
| `archive.sh`                  | Archive completed spec folders                                                                 |
| `test-validation.sh`          | Test the validation rules themselves                                                           |

#### Memory Scripts

The `scripts/memory/` directory holds the scripts for the indexed-continuity store:

| Script                        | Purpose                                                     |
| ----------------------------- | ----------------------------------------------------------- |
| `generate-context.ts`         | Source for the runtime memory-save entrypoint `scripts/dist/memory/generate-context.js` |
| `backfill-frontmatter.ts`     | Add missing frontmatter to existing generated context artifacts |
| `backfill-research-metadata.ts` | Backfill missing `description.json` and `graph-metadata.json` files under `research/*/iterations/` |
| `rank-memories.ts`            | Rank memories by relevance for a query                      |
| `reindex-embeddings.ts`       | Rebuild embedding vectors for stored spec-doc records               |
| `cleanup-orphaned-vectors.ts` | Remove vector entries with no matching spec-doc record               |
| `rebuild-auto-entities.ts`    | Regenerate auto-extracted entity catalog                    |
| `validate-memory-quality.ts`  | Run quality checks on stored spec-doc record content                 |
| `ast-parser.ts`               | Parse markdown AST for section extraction                   |
| `fix-memory-h1.mjs`           | Fix heading levels in older generated context artifacts     |

TypeScript sources compile to `scripts/dist/`. The runtime entry point for memory saves is `scripts/dist/memory/generate-context.js`.

#### Validation Helper Scripts

The `scripts/validation/` directory contains focused helpers that support `validate.sh` and one-off remediation work:

| Script                        | Purpose                                                                 |
| ----------------------------- | ----------------------------------------------------------------------- |
| `continuity-freshness.ts`     | Warn when `_memory.continuity.last_updated_at` lags `graph-metadata.json` |
| `evidence-marker-audit.ts`    | Bracket-depth audit and optional rewrap pass for malformed `EVIDENCE` markers |
| `evidence-marker-lint.ts`     | Strict wrapper used by validation to fail on malformed or unclosed markers |

#### Template Rendering

Template changes flow through the manifest source, Level contract resolver and inline renderer. Use `create.sh` for generated packet fixtures and `validate.sh` for explicit validation.

---

## 5. STRUCTURE

```
.opencode/skills/system-spec-kit/
├── SKILL.md                    # AI workflow instructions (when to use, gates, rules)
├── README.md                   # This file (what it does, how to use it)
├── ARCHITECTURE.md             # Boundary contract: scripts/ vs mcp_server/
├── templates/                  # Manifest template source
│   └── manifest/               # Rendered by Level contract resolver + inline renderer
├── scripts/                    # CLI tools (TypeScript source + Bash)
│   ├── spec/                   # Spec folder management scripts
│   ├── memory/                 # Memory system scripts
│   ├── templates/              # Template composition (manifest renderer)
│   ├── core/                   # Core library (17 modules)
│   ├── extractors/             # Session data extractors (12 extractors)
│   ├── utils/                  # Utility modules (20 utilities)
│   └── dist/                   # Compiled JavaScript output
├── mcp_server/                 # Spec Kit Memory MCP (TypeScript)
│   ├── context-server.ts       # MCP server entry point and tool registration
│   ├── handlers/               # Tool handlers, save pipeline, and response assembly
│   ├── lib/                    # Search pipeline, cognitive engine, graph, governance
│   ├── matrix_runners/         # F1-F14 x CLI adapter manifest and runner
│   ├── stress_test/            # Opt-in stress, load, matrix-cell, and degraded-state suites
│   ├── tests/                  # MCP test suite
│   ├── INSTALL_GUIDE.md        # Full installation walkthrough
│   └── README.md               # MCP server reference (tool API, pipeline, configuration)
├── shared/                     # Shared workspace (@spec-kit/shared)
│   ├── algorithms/             # Fusion, reranking, and lab algorithms
│   ├── contracts/              # Typed trace/envelope contracts
│   ├── embeddings/             # Provider implementations
│   └── ...                     # Chunker, scoring, parsing, utilities
├── references/                 # Reference documentation (27 files)
├── assets/                     # Decision matrices, YAML configs
├── constitutional/             # Always-surface rules (never decay)
├── feature_catalog/            # Feature documentation catalog
└── manual_testing_playbook/    # Manual validation scenarios
```

### Key Files

| File                                                                         | Purpose                                                                                              |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [`SKILL.md`](./SKILL.md)                                                     | AI agent instructions: routing rules, gates, validation procedures, template application             |
| [`README.md`](./README.md)                                                   | This file: what Spec Kit does, how to use it, where to find things                                 |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md)                                       | API boundary contract between `scripts/` and `mcp_server/`                                           |
| [`mcp_server/README.md`](./mcp_server/README.md)                             | Full MCP architecture: 39-tool API reference, search pipeline, graph intelligence and configuration |
| [`mcp_server/INSTALL_GUIDE.md`](./mcp_server/INSTALL_GUIDE.md)               | Step-by-step installation with embedding providers and environment                                   |
| [`scripts/spec/create.sh`](./scripts/spec/create.sh)                         | Create spec folders with level-appropriate template files                                            |
| [`scripts/spec/validate.sh`](./scripts/spec/validate.sh)                     | Run 38-rule validation on any spec folder                                                            |
| `scripts/dist/memory/generate-context.js`                                    | Primary workflow for updating packet continuity state from structured JSON                            |
| [`feature_catalog/feature_catalog.md`](./feature_catalog/feature_catalog.md) | Complete catalog of implemented features                                    |
| [`feature_catalog/05--lifecycle/speckit-autopilot-lifecycle.md`](./feature_catalog/05--lifecycle/speckit-autopilot-lifecycle.md) | Branch-preserved unattended Speckit lifecycle for plan, implement and complete |

### How the Pieces Connect

Think of Spec Kit as a filing system with a librarian attached.

The **spec folder workflow** is the filing system. Every time you modify files, it creates a numbered folder with the right paperwork (specification, plan, tasks). Templates make sure every folder follows the same structure. Validation checks that nothing is missing.

The **memory system** is the librarian. When a session ends, `generate-context.js` updates the packet's canonical continuity surfaces so the next session can recover from packet-local sources first. The MCP server indexes those packet docs into vector, FTS5 and BM25 surfaces, while graph and degree signals are computed at retrieval time. When a new session starts, `/speckit:resume` compares folder-local `handover.md` and `_memory.continuity` in `implementation-summary.md`, selects the fresher source, then falls back to the packet docs. If you need deeper retrieval after that, `session_bootstrap()` bundles resume context, health and structural readiness into one follow-up recovery call before broader `memory_context` work begins.

The **commands** are the doors into the system. Each command opens access to the tools it needs. `/speckit:plan --intake-only` owns the standalone intake surface, `/speckit:plan` and `/speckit:complete` reuse the shared intake contract from [intake_contract.md](./references/workflows/intake_contract.md) when the Step 0 local `folder_state` requires delegation, and downstream callers should consume the returned `start_state` as the canonical intake enum. `/deep:research` anchors research to `spec.md` through [spec_check_protocol.md](../deep-loop-workflows/deep-research/references/protocol/spec_check_protocol.md). `/memory:save` updates packet continuity. `/speckit:resume` recovers or continues a previous session.

The common packet lifecycle now uses `/speckit:plan --intake-only` for standalone trio creation or repair. `/deep:research` can enrich that packet under the bounded `spec_check_protocol.md` rules. `/speckit:plan` or `/speckit:complete` then continue from the same folder without reopening intake unless the local `folder_state` still requires repair. When intake does run, `start_state` is the canonical downstream field.

```text
Session starts
  └─► Gate 3 asks: "Which spec folder?"
       ├─► Option A: Use existing folder
       ├─► Option B: Create new folder (create.sh)
       └─► Option D: Skip documentation
            │
            ▼
  AI modifies files, tracks tasks in tasks.md
            │
            ▼
  Session ends
  └─► generate-context.js updates canonical continuity surfaces
       └─► MCP reindexes packet docs (vector + BM25 + graph)
            │
            ▼
  Next session starts
  └─► /speckit:resume compares handover.md and _memory.continuity freshness, then falls back to packet docs
       └─► session_bootstrap() or memory_context() deepen retrieval when needed
       └─► AI resumes with context + health + structural readiness
```

---

## 6. CONFIGURATION

### Embedding Providers

The indexed-continuity store converts text to numerical embeddings for vector search. Four providers are supported. The default cascade (when `EMBEDDINGS_PROVIDER=auto` or unset) is **local-first** (ADR-014): Ollama -> hf-local -> OpenAI -> Voyage.

| Tier | Provider          | Dimensions | Notes                                                            |
| ---- | ----------------- | ---------- | ---------------------------------------------------------------- |
| 1    | Ollama            | 768        | **Default.** Probes `/api/tags`, uses `nomic-embed-text-v1.5`. Recommended new-user setup. |
| 2    | HuggingFace Local | 768        | Pure-Node `@huggingface/transformers` HTTP model server (local-first fallback). Default model: `nomic-ai/nomic-embed-text-v1.5` (same family as the Ollama default, ADR-014). |
| 3    | OpenAI            | 1536       | Cloud opt-in. Requires `OPENAI_API_KEY`.                         |
| 4    | Voyage AI         | 1024       | Cloud opt-in. Requires `VOYAGE_API_KEY`. Gated by egress guard.  |

### Environment Variables

| Variable             | Required    | Description                                          |
| -------------------- | ----------- | ---------------------------------------------------- |
| `EMBEDDINGS_PROVIDER` | No         | `auto` (default) follows the ADR-014 cascade. Set to `ollama`, `hf-local`, `openai` or `voyage` to pin a specific tier |
| `VOYAGE_API_KEY`     | No          | Voyage AI cloud embeddings (opt-in)                  |
| `OPENAI_API_KEY`     | No          | OpenAI cloud embeddings (opt-in)                     |
| `OLLAMA_EMBEDDINGS_MODEL` | No     | Override Ollama model (listed default: `nomic-embed-text-v1.5`, unlisted local models derive dimension at runtime) |
| `HF_EMBEDDINGS_MODEL` | No         | Override hf-local model (listed default: `nomic-ai/nomic-embed-text-v1.5`, unlisted local models derive dimension at runtime) |
| `SPEC_KIT_DB_DIR` / `SPECKIT_DB_DIR` | No | Preferred database-directory override. Runtime derives the sqlite filename from the active embedding profile |
| `MEMORY_DB_PATH`     | No          | Explicit file override for the active SQLite database path |
| `LOG_LEVEL`          | No          | Log verbosity: `debug`, `info`, `warn`, `error`      |
| `SPECKIT_LAUNCHER_RSS_SELF_EXIT` | No | Set `1` to enable the launcher RSS-ceiling watchdog. When the mk-spec-memory process tree breaches `SPECKIT_CONTEXT_SERVER_MAX_RSS_MB`, the launcher sends SIGTERM and exits with crash-loop backoff. Default off. |
| `SPECKIT_BACKEND_ONLY` | No | Backend-only stdio gate read at server boot (`mcp_server/context-server.ts`). Set `1` so the process runs purely as the recyclable backend behind the MCP front-proxy and skips front-facing stdio wiring. The launcher's `bridgeStdioThroughSessionProxy` then owns the client-facing transport. Default off (direct stdio). |

For the full list of environment variables (including evaluation, telemetry and feature flag overrides), see [`references/config/environment_variables.md`](./references/config/environment_variables.md).

### MCP Server Configuration

For generic MCP clients that use `mcpServers` syntax (for example Claude Desktop), add the Spec Kit Memory server like this:

```json
{
  "mcpServers": {
    "mk-spec-memory": {
      "command": "node",
      "args": [
        "/absolute/path/to/.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js"
      ],
      "env": {
        "EMBEDDINGS_PROVIDER": "auto"
      }
    }
  }
}
```

OpenCode, Claude Code, OpenCode and VS Code / Copilot use checked-in repo-specific config shapes, so use [`mcp_server/INSTALL_GUIDE.md`](./mcp_server/INSTALL_GUIDE.md) for the runtime-specific examples instead of pasting the generic block above into every client.

### Feature Flags

The indexed-continuity store uses runtime-resolved feature flags rather than import-time snapshots. Long-lived MCP processes re-read relevant `process.env` values during search, scoring and rollout checks, so operator flips take effect without requiring a module reload.

| Group                    | Controls                                                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Search Pipeline          | 5-channel retrieval, fallback routing, reranking, graph-walk rollout, confidence and token-budget policies |
| Session and Cache        | Embedding cache, session deduplication, crash recovery, DB rebind invalidation                             |
| Memory and Storage       | Save quality gate, reconsolidation, governed save/retrieval scopes, causal graph maintenance               |
| Embedding and API        | Startup provider resolution, fail-fast dimension checks, structured fallback metadata                      |
| Evaluation and Telemetry | Ablation guardrails, reporting dashboard output, optional trace and eval logging                           |

For the full flag reference and rollback procedures, see [`references/workflows/rollback_runbook.md`](./references/workflows/rollback_runbook.md).

### Dynamic Token Budget

The indexed-continuity store adjusts token budgets per tier to control how much context is injected:

| Tier           | Budget       |
| -------------- | ------------ |
| Working        | 3,500 tokens |
| Core           | 3,500 tokens |
| Constitutional | 4,000 tokens |

---

## 7. USAGE EXAMPLES

### Example 1: Start a New Feature

A new feature affects 3 files and needs QA verification. Level 2 is the right fit.

```bash
# Create the spec folder at Level 2
bash .opencode/skills/system-spec-kit/scripts/spec/create.sh 043-user-profile-update

# Validate it was created correctly
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/[project]/043-user-profile-update/
```

Fill `spec.md`, `plan.md`, `tasks.md` and `checklist.md` by running `create.sh --level 2` and editing the rendered Level 2 files.

**Result**: A Level 2 spec folder with QA verification gates, ready for implementation.

### Example 2: Resume Work From a Previous Session

You worked on a feature yesterday and want to pick up where you left off:

```text
/speckit:resume
```

The system searches for your most recent context, presents your prior decisions and the files you changed, then routes you to the right next command. If it finds multiple candidates, it presents alternatives for you to choose from.

**Result**: The AI starts with full knowledge of your prior work, no re-explanation needed.

### Example 3: Save Context at End of Session

After implementing the first phase, save context so the next session can resume:

```bash
# Using the generate-context.js script directly
node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js \
  --json '{"specFolder":"043-user-profile-update","user_prompts":["Capture the completed backend phase"],"observations":["Implemented the data model and API endpoints"],"recent_context":["Frontend work is still pending for the next session"]}' \
  .opencode/specs/[project]/043-user-profile-update/
```

Or use the command:

```text
/memory:save 043-user-profile-update
```

**Result**: The packet's continuity surfaces and any supporting generated context artifacts are updated, indexed and searchable within seconds.

### Example 4: Create a Phase Decomposition

A large feature needs three phases of work across multiple sessions:

```bash
# Create parent spec folder with first phase child
bash .opencode/skills/system-spec-kit/scripts/spec/create.sh \
  022-big-feature --phase

# This creates:
# .opencode/specs/[project]/022-big-feature/         (parent)
# .opencode/specs/[project]/022-big-feature/001-phase/ (first child)
```

Use `/speckit:plan :with-phases` or `/speckit:complete :with-phases` to create phase structures, track progress across children, validate the entire hierarchy and keep packet-local changelog history in the parent packet as phases close.

**Result**: A coordinated parent/child folder structure for multi-session work.

### Example 5: Run Validation on a Spec Folder

Before claiming a feature is complete, run validation:

```bash
# Standard validation
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/[project]/043-user-profile-update/

# Verbose mode (shows detail behind each rule)
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/[project]/043-user-profile-update/ --verbose

# Recursive mode (parent + all phase children)
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/[project]/022-big-feature/ --recursive
```

**Result**: A pass/warn/error report for the selected validation set from the 38-rule registry, with actionable fix instructions.

### Common Patterns

| Pattern                       | Command / Script                    | When to Use                       |
| ----------------------------- | ----------------------------------- | --------------------------------- |
| New feature, small scope      | `create.sh NNN-name`                | < 100 LOC, single file            |
| New feature, needs QA         | `create.sh NNN-name` + Level 2      | 100-499 LOC                       |
| Architecture change           | `create.sh NNN-name` + Level 3      | 500+ LOC, multiple systems        |
| Multi-phase work              | `create.sh NNN-name --phase`        | Large features, multiple sessions |
| Save session progress         | `/memory:save [folder]`             | Before ending any session         |
| Recover after crash           | `/speckit:resume`                  | Session interrupted unexpectedly  |
| Check prior decisions         | `/memory:search "query"`            | Starting a related task           |
| Upgrade documentation level   | `upgrade-level.sh [folder] [level]` | Scope grew beyond original level  |
| Create always-surface rule    | `/memory:learn`                     | Team standards, workflow rules    |

---

## 8. TROUBLESHOOTING

### MCP Tools Return "Tool Not Found"

**What you see**: Calling `memory_match_triggers()` returns an error or the tool is not recognized.

**Common causes**: The MCP server is not running or not registered in your MCP config.

**Fix**:

```bash
# Check the server can start
node .opencode/skills/system-spec-kit/mcp_server/dist/context-server.js

# If it fails, check Node.js version (requires >= 20.11)
node --version
```

Verify `mk-spec-memory` appears in your `opencode.json` or equivalent MCP config file (see [Configuration](#5-configuration)).

---

### Memory Save Fails or Creates an Empty File

**What you see**: `generate-context.js` runs but the output file is empty or the script exits with an error.

**Common causes**: Invalid structured JSON input, a missing explicit spec-folder target or TypeScript source not compiled to `dist/`.

**Fix**:

```bash
# Rebuild the scripts
cd .opencode/skills/system-spec-kit && npm run build

# Retry with a valid structured payload
node scripts/dist/memory/generate-context.js \
  --json '{"specFolder":"NNN-feature","user_prompts":["Summarize the completed work"],"observations":["Captured the main change and verification"],"recent_context":["List the files or packet areas touched"]}' \
  specs/NNN-feature
```

---

### Memory Save Rejected by Quality Gate

**What you see**: The save completes but reports the spec-doc record was rejected by the semantic sufficiency gate or structure gate.

**Common causes**: The content is too thin (not enough substance) or missing required structure (headings, metadata).

**Fix**: Add more detail to the session summary. Use `dryRun: true` in the `memory_save` tool call to preview gate results without saving. Check the post-save quality review output for specific issues.

---

### Validation Fails With "Missing Required Files"

**What you see**: `validate.sh` reports missing files like `spec.md` or `plan.md`.

**Common causes**: The spec folder was created manually without `create.sh`, or wrong level templates were applied.

**Fix**:

```bash
# Check what files exist
ls -la .opencode/specs/[project]/NNN-feature/

# Get a level recommendation
bash .opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh \
  .opencode/specs/[project]/NNN-feature/

# Upgrade if needed
bash .opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh \
  .opencode/specs/[project]/NNN-feature/ [target-level]
```

---

### Memory Search Returns Poor Results

**What you see**: `memory_context()` returns irrelevant results or misses content you know exists.

**Common causes**: The embedding index is stale, or the query is too vague for intent classification.

**Fix**:

```bash
# Force index rebuild (run as MCP tool call)
# memory_index_scan({ specFolder: "NNN-feature" })

# Check database health
# memory_health({ reportMode: "full" })

# Try a more specific query with intent hints
# memory_context({ input: "find_decision: why did we choose JWT?", mode: "deep" })
```

### memory_health Reports `corrupt` or FTS5 Integrity Failure

**What you see**: `memory_health` returns a status of `corrupt` or the server logs show `FTS5 SHADOW INDEX CORRUPTION DETECTED` at boot.

**What happens**: At boot, when the `.unclean-shutdown` crash marker is present, the server runs two probes. A whole-database `PRAGMA quick_check` guards the main index: on failure it writes the checkpoint `.needs-rebuild` sentinel and refuses to start rather than serve corrupted data. The `memory_fts` shadow check is auto-healed by default because the shadow table is fully derived from `memory_index`; the server rebuilds it and re-runs the integrity probe; if the rebuild fails to verify, it logs the failure and continues serving in a degraded state with the health flag set. Set `SPECKIT_BOOT_FTS_AUTOHEAL=0` for detect-only mode, where a failure is logged and the server continues in degraded state. Clean shutdowns skip both probes.

**Fix**:

```bash
# Stop the MCP server. FTS5 rebuild runs automatically at boot via the
# auto-heal path (SPECKIT_BOOT_FTS_AUTOHEAL is on by default; set =0 to opt out).
# Just restart the server to trigger the rebuild:
SPECKIT_BOOT_FTS_AUTOHEAL=1 node .opencode/bin/mk-spec-memory-launcher.cjs
# Or call the MCP health tool after restart to confirm recovery
# memory_health({ reportMode: "full" })
```

If `degraded_needs_repair` appears in the `index.summary` field, run `memory_embedding_reconcile({ mode: "apply" })` after the FTS rebuild.

---

### Memory Save Fails While a Live Daemon Is Running

**What you see**: Running `generate-context.js` or `memory_save` from a script fails with a lock or writer-conflict error when a live MCP daemon is already serving requests.

**What is expected**: The indexed-continuity store uses a single-writer lease. A standalone script save and a live daemon session can conflict when both try to acquire the write lock on the same database file.

**Fix**: Use the MCP tool path instead of the standalone script when a daemon is running:

```text
/memory:save [spec-folder]
```

The MCP daemon serializes writes through its own handler queue. Only fall back to `generate-context.js` directly when no daemon is active (for example in CI or headless batch jobs where no MCP process is started).

---

### Quick Fixes

| Problem                          | Fix                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------- |
| `generate-context.js` not found  | Run `npm run build` in `system-spec-kit/`                                       |
| Spec folder fails validation     | Run `validate.sh --verbose` and read each failing rule                          |
| Memory context seems wrong       | Call `memory_stats({})` to check index counts                                   |
| Session context lost after crash | Use `/speckit:resume` to select the fresher folder-local handover or continuity source, with packet docs as fallback |
| Placeholder check fails          | Run `check-placeholders.sh` and replace all `[PLACEHOLDER]` values              |
| Stale results after save         | Call `memory_index_scan({ specFolder: "..." })` to force re-index               |
| Too many near-duplicate results  | Check that interference penalty is active in feature flags                      |
| `spec-memory.cjs` exits 69       | CLI dist is missing or stale: run `npm run build --workspace=@spec-kit/mcp-server` |
| `spec-memory.cjs` exits 75 with `--warm-only` | Expected when the daemon is cold: retry without `--warm-only` or start a session that spawns it |

### Diagnostic Commands

```bash
# Check spec folder completeness
bash .opencode/skills/system-spec-kit/scripts/spec/calculate-completeness.sh \
  .opencode/specs/[project]/NNN-feature/

# Run detailed validation
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/[project]/NNN-feature/ --verbose

# Check API boundary (scripts/ vs mcp_server/)
bash .opencode/skills/system-spec-kit/scripts/check-api-boundary.sh

# View memory system health
# memory_health({ reportMode: "full" })
```

---

## 9. FAQ

**Q: Is System Spec Kit mandatory for every file change?**

A: Yes, for any conversation that modifies files. The only exemption is single-file fixes under 5 characters (typo or whitespace corrections). Gate 3 in AGENTS.md enforces this by asking "Which spec folder?" before any file modification begins.

---

**Q: When do I need Level 2 instead of Level 1?**

A: Level 2 adds a `checklist.md` for QA verification. Use it when the change touches multiple files, needs testing verification or has edge cases worth documenting. The LOC guidance is 100-499, but risk and complexity matter more than line count.

---

**Q: When do I need Level 3?**

A: Level 3 adds a `decision-record.md` for architecture decision records. Use it for changes that affect system architecture, involve trade-offs between alternatives or touch 500+ lines across multiple systems. If you are making decisions that future developers will ask "why?", Level 3 captures the answer.

---

**Q: How do spec folders and memory work together?**

A: Spec folders capture what happened in structured documentation. `generate-context.js` updates the packet's canonical continuity surfaces, and `/speckit:resume` rebuilds the next session by comparing folder-local `handover.md` and `_memory.continuity` freshness, then falling back to packet docs. The MCP server indexes those packet-local sources so deeper retrieval can still use `session_bootstrap()`, `memory_context()` or `memory_match_triggers()` after the canonical resume step. One side captures, the recovery surfaces retrieve.

---

**Q: Can I use memory without spec folders?**

A: The indexed-continuity store can index any markdown file, beyond spec folder contents. But for implementation work the canonical continuity path is the spec folder itself: `generate-context.js` updates packet-local continuity surfaces and `/speckit:resume` recovers from those packet sources first. You can still save standalone memories with `memory_save`, but Gate 3 will still ask about a spec folder for file modifications.

---

**Q: What is the difference between this README and the MCP server README?**

A: This README covers the whole skill: spec folders, documentation levels, commands, templates, scripts and a high-level summary of the indexed-continuity store. The MCP server README (`mcp_server/README.md`) goes deep on the indexed-continuity store: the 39-tool API reference, 5 core retrieval channels, session lifecycle tooling, canonical resume and bootstrap behavior, save pipeline, causal graph, query intelligence and evaluation infrastructure.

---

**Q: What is the difference between SKILL.md and this README?**

A: SKILL.md contains instructions for AI agents: when to activate, routing rules, gate procedures, validation workflows and template application procedures. This README is for humans and AI alike: what Spec Kit does, how to use it and where to find things. Think of SKILL.md as the employee handbook and this README as the product brochure.

---

**Q: What is Constitutional Memory?**

A: Constitutional memories are rules that always surface in every retrieval, regardless of recency or score. They carry a 3.0x boost and never decay. Use `/memory:learn` to create them. Typical use cases: team coding standards, mandatory workflow steps, known failure modes. They work like pinned messages in a chat, always visible no matter how far you scroll.

---

**Q: How do I upgrade a Level 1 folder to Level 2 after the fact?**

A: Run `upgrade-level.sh` with the target level. It renders and injects the additional Level contract sections into the existing folder. Then run `check-placeholders.sh` to find all new placeholder values that need filling in.

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh \
  .opencode/specs/[project]/NNN-feature/ 2
```

---

## 10. RELATED DOCUMENTS

### Internal Documentation

| Document                                                                                         | Purpose                                                                                              |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| [`SKILL.md`](./SKILL.md)                                                                         | AI agent instructions: routing, gates, validation, template application                              |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md)                                                           | API boundary contract between `scripts/` and `mcp_server/`                                           |
| [`mcp_server/README.md`](./mcp_server/README.md)                                                 | Full MCP architecture: 39-tool API reference, search pipeline, graph intelligence and configuration |
| [`mcp_server/INSTALL_GUIDE.md`](./mcp_server/INSTALL_GUIDE.md)                                   | Step-by-step installation with embedding providers and environment variables                         |
| [`references/memory/memory_system.md`](./references/memory/memory_system.md)                     | Detailed memory system reference                                                                     |
| [`references/memory/embedder_architecture.md`](./references/memory/embedder_architecture.md)     | Active embedder pointer, vector shard, dim-table and swap architecture                              |
| [`references/memory/embedding_resilience.md`](./references/memory/embedding_resilience.md)       | Embedder fallback, degraded search, retry and cache-boundary behavior                               |
| [`references/memory/embedder_pluggability.md`](./references/memory/embedder_pluggability.md)     | Cross-MCP embedder defaults, swap flows, device selection and support matrix                        |
| [`references/workflows/intake_contract.md`](./references/workflows/intake_contract.md)           | Shared spec-folder intake contract for `/speckit:plan`, `/speckit:complete` and resume re-entry     |
| [`references/workflows/rename_pattern.md`](./references/workflows/rename_pattern.md)             | Mechanical rename workflow and live-vs-historical surface discipline                                 |
| [`references/validation/validation_rules.md`](./references/validation/validation_rules.md)       | Partial validation-rule reference; the 38-rule registry is authoritative                             |
| Level specifications reference                                                                    | Level definitions and template size guidance                                                         |
| [`references/templates/template_guide.md`](./references/templates/template_guide.md)             | Template usage and composition rules                                                                 |
| [`references/config/environment_variables.md`](./references/config/environment_variables.md)     | Full environment variable reference                                                                  |
| [`references/config/launcher_lease.md`](./references/config/launcher_lease.md)                   | mk-spec-memory launcher single-writer lease and stale-reclaim behavior                               |
| [`references/hooks/skill_advisor_hook.md`](./references/hooks/skill_advisor_hook.md)             | Prompt-time Skill Advisor hook contract across supported runtimes                                    |
| [`references/hooks/skill_advisor_hook_validation.md`](./references/hooks/skill_advisor_hook_validation.md) | Skill Advisor hook validation playbook                                                     |
| [`references/workflows/rollback_runbook.md`](./references/workflows/rollback_runbook.md)         | Feature-flag rollback and smoke-test procedures                                                      |
| [`feature_catalog/feature_catalog.md`](./feature_catalog/feature_catalog.md)                     | Complete catalog of implemented features                                                |
| [`../../changelog/system-spec-kit/`](../../changelog/system-spec-kit/) | Release changelog history for system-spec-kit |

### Cross-Skill Alignment

| Skill                                                | Purpose                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| [`sk-doc`](../sk-doc/SKILL.md)                       | Documentation quality standard (DQI scoring, HVR compliance) |
| [`sk-code`](../sk-code/SKILL.md)                   | Stack-aware code workflow and quality standard, surface detected at dispatch time |
| [`sk-git`](../sk-git/SKILL.md)                       | Git workflow orchestration: numbered `wt/{NNNN}-{name}` branches in `.worktrees/{NNNN}-{name}` (4-digit zero-padded global `max+1` counter), conventional commits, PRs |

### Project-Level References

| Resource                      | Purpose                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `AGENTS.md` (project root)    | Gate definitions, AI behavior framework, mandatory workflow rules            |
| `.opencode/specs/`            | All spec folders created by Spec Kit                                         |
| `.opencode/commands/speckit/` | Spec Kit command folder: 4 speckit command Markdown files plus README/assets; the command index lists 7 rows including deep workflow and intake-only entries |
| `.opencode/commands/memory/`   | Memory command definitions (4 top-level commands plus subcommand namespaces) |

### External Resources

| Resource                                                              | Purpose                                               |
| --------------------------------------------------------------------- | ----------------------------------------------------- |
| [Model Context Protocol](https://modelcontextprotocol.io/)            | MCP specification                                     |
| [FSRS algorithm](https://github.com/open-spaced-repetition/fsrs4anki) | Free Spaced Repetition Scheduler (memory decay model) |
| [sqlite-vec](https://github.com/asg017/sqlite-vec)                    | SQLite vector search extension                        |
