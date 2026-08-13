---
title: "System Spec Kit"
description: "Makes AI development memory persistent: every file change gets a templated spec folder that records the reasoning. Every new session resumes that reasoning from a local indexed store."
trigger_phrases:
  - "spec kit"
  - "spec folder"
  - "memory system"
  - "hybrid search"
  - "context preservation"
  - "documentation levels"
  - "memory save"
  - "spec folder workflow"
version: 3.8.0.0
---

# System Spec Kit

> Every file change gets a documented why. Every new session picks up where the last one ended.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Capturing why code changed and resuming that reasoning across sessions |
| **Invoke with** | "spec kit", "spec folder", "memory save", "/speckit:resume" or automatic Gate 3 routing |
| **Works on** | File-modifying AI conversations that need a documentation trail and cross-session memory |
| **Produces** | Templated spec folders at four levels, a validated file structure and a searchable local index |

---

## 2. OVERVIEW

### Why This Skill Exists

AI conversations that modify files leave no reasoning trail. The session ends and the why behind every decision vanishes. A new session starts from a blank slate, so the architecture you explained on Monday is gone by Wednesday. Without enforced documentation and a persistent memory, one session cannot build on another.

### What It Does

System Spec Kit captures every file-modifying conversation in a templated spec folder, indexed at one of four documentation levels matched to task complexity. A local SQLite store makes those decisions searchable across sessions through five fused retrieval channels. `/speckit:resume` rebuilds the active context from packet-local sources. `/memory:save` routes session updates into canonical documentation surfaces so the next session picks up where the last one stopped, on any model or tool.

### How This Compares

Manual documentation is ad hoc and inconsistent. Basic RAG offers vector similarity over a stateless index. System Spec Kit replaces both with templated folders at four levels, validated structure and a five-channel hybrid search fused by Reciprocal Rank Fusion. Context survives across sessions through a local indexed-continuity store rather than copy-pasted notes. Decay follows an FSRS power-law curve tuned by content type and importance, not a flat remember-everything policy.

### Requirements

- Node.js 20.11 or newer
- TypeScript 5.0 or newer
- Bash 4.0 or newer

Embeddings are local-first. The runtime probes Ollama first with the default `nomic-embed-text` model at 768 dimensions, falls through to the pure-Node hf-local tier and only escalates to OpenAI or Voyage when an API key is set and no local tier is available. The recommended new-user setup is installing Ollama and running `ollama pull nomic-embed-text:v1.5`. The cascade auto-detects it, no API keys are required and all embeddings stay on-device.

### The Spec Folder System

| Capability | What the skill knows how to operate |
|---|---|
| **Documentation levels** | four levels matched to task complexity, from the Level 1 baseline up to the Level 3+ governance set |
| **Phase parents** | lean parent folders with the control-file trio and named child phase folders |
| **Packet-local changelogs** | `changelog/` history written beside packet roots and direct child phases at closeout |
| **Validation** | the 46-rule registry with four strict-only rules gated behind `--strict` |

### The Memory System

| Capability | What the skill knows how to operate |
|---|---|
| **Retrieval** | five fused channels, Vector, FTS5, BM25, Causal Graph and Degree, with intent-based channel selection |
| **Decay lifecycle** | six importance tiers with FSRS power-law decay and promotion through positive feedback |
| **Causal graph** | six relationship types across memories with Louvain community detection |
| **Save arbitration** | four outcomes per save, CREATE, REINFORCE, UPDATE and SUPERSEDE, behind three quality gates |

---

## 3. QUICK START

**Step 1: Create your first spec folder.**

When an AI assistant asks "Which spec folder?" at Gate 3, choose Option B (New):

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/create.sh 042-my-feature
```

The script creates `specs/042-my-feature/` with the Level 1 starters, initializes `description.json` and prepares the packet docs plus a `scratch/` workspace:

- `spec.md`: what the feature is and why it exists
- `plan.md`: how to implement it
- `tasks.md`: the step-by-step task breakdown
- `implementation-summary.md`: written after implementation completes

Continuity no longer writes to `[spec]/memory/*.md`. Use `/memory:save` to route updates into the canonical packet docs:

- `implementation-summary.md`
- `decision-record.md`
- `handover.md`

**Step 2: Save context at the end of a session.**

```bash
node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js \
  --json '{"specFolder":"042-my-feature","user_prompts":["Implement login form validation"],"observations":["Added client-side validation for empty email and password"],"recent_context":["Touched auth form schema and submit handler"],"toolCalls":["npm test -- auth"],"exchanges":["Verified the error states render before submit"]}' \
  specs/042-my-feature/
```

The command updates the canonical continuity surfaces for the target folder, refreshes `description.json.lastUpdated` and rewrites the derived fields in `graph-metadata.json`. The `/memory:save 042-my-feature` shorthand does the same. Direct MCP `memory_save({ filePath })` indexes content only and returns a `metadataRefresh` advisory with `refreshed: false` when packet metadata should be regenerated through the save lane.

**Step 3: Resume work from a previous session.**

```text
/speckit:resume
```

The system resolves the requested folder first. For a phase parent it follows the valid `derived.last_active_child_id` pointer into the active child. It then compares folder-local `handover.md` and `_memory.continuity` freshness and falls back to the packet's canonical spec docs. It presents the current state, prior decisions, touched files and next steps before you start.

**Step 4: Search for context.**

```text
/memory:search "how did we decide on the auth architecture?"
```

The system reads the question, classifies the task intent and routes to the right search strategy automatically.

**Step 5: Validate a spec folder.**

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  specs/[project]/042-my-feature/
```

The default validation set runs the non-strict rules from the 46-rule registry. Exit 0 means all rules pass, exit 1 is a user error, exit 2 is a validation error and exit 3 is a system error.

**Step 6: Verify the memory server is up.**

```json
{
  "tool": "memory_health",
  "arguments": { "reportMode": "full" }
}
```

The response returns `status: "ok"` with database table counts. The same check runs from a shell through the daemon-backed CLI, which fronts the identical 41-tool surface:

```bash
node .opencode/bin/spec-memory.cjs list-tools --format text
node .opencode/bin/spec-memory.cjs memory_health --json '{"reportMode":"full"}' --format json
```

`list-tools` answers offline. Every other command speaks JSON-RPC to the daemon over the IPC socket. Exit codes are `0` success, `1` runtime error, `64` usage or schema error, `69` protocol or dist mismatch and `75` retryable daemon error. Pass `--warm-only` in prompt-time contexts so a cold daemon yields exit `75` instead of a cold spawn. The exit taxonomy is shared with the `code-index` and `skill-advisor` CLI front doors.

### Common Patterns

| Pattern | Command or script | When to use |
|---|---|---|
| New feature, small scope | `create.sh NNN-name` | under 100 LOC, single file |
| New feature, needs QA | `create.sh NNN-name` at Level 2 | 100 to 499 LOC |
| Architecture change | `create.sh NNN-name` at Level 3 | 500+ LOC, multiple systems |
| Multi-phase work | `create.sh NNN-name --phase` | large features, multiple sessions |
| Save session progress | `/memory:save [folder]` | before ending any session |
| Recover after crash | `/speckit:resume` | session interrupted unexpectedly |
| Check prior decisions | `/memory:search "query"` | starting a related task |
| Upgrade documentation level | `upgrade-level.sh [folder] [level]` | scope grew beyond the original level |
| Create always-surface rule | `/memory:learn` | team standards, workflow rules |
| Validate before claiming done | `validate.sh [folder]` | before any completion claim |

---

## 4. HOW IT WORKS

### The Packet Lifecycle

Every conversation that modifies files gets a spec folder. Gate 3 in AGENTS.md enforces this by asking "Which spec folder?" before any file modification begins. The only exemptions are single-file fixes under 5 characters, typo or whitespace corrections.

```text
Session starts
  └─► Gate 3 asks: "Which spec folder?"
       ├─► Option A: Use existing folder
       ├─► Option B: Create new folder (create.sh)
       └─► Option E: Skip documentation
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

### Spec Folder Structure

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
├── changelog/                   # Packet-local changelog history for packet roots and phase parents
└── scratch/                     # Temporary workspace files (gitignored)
```

`implementation-summary.md` is required at all levels but created after implementation completes, not at folder creation time. `generate-context.js` updates the packet continuity state for `/speckit:resume`, refreshes `description.json.lastUpdated` and rewrites the derived fields in `graph-metadata.json` on every save-lane run. Direct MCP `memory_save({ filePath })` does not refresh those metadata files and returns a `metadataRefresh` advisory when packet metadata may lag.

### Documentation Levels

Not every change needs the same amount of paperwork. A one-line bug fix does not need an architecture decision record. A multi-system refactor does. Four levels match documentation depth to task complexity:

| Level | LOC guidance | Required files | When to use |
|---|---|---|---|
| **1** | under 100 | `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | small features, bug fixes, single-file changes |
| **2** | 100 to 499 | Level 1 plus `checklist.md` | features needing QA verification, multi-file changes |
| **3** | 500 and up | Level 2 plus `decision-record.md` | architecture changes, complex refactors |
| **3+** | complexity 80 and up | Level 3 plus approval workflow, compliance and stakeholders | high-complexity work needing review tracking |
| **Phase Parent** | control files only | `spec.md`, `description.json`, `graph-metadata.json` | folder contains phase children with their own spec docs |

The LOC ranges are guidance, not hard rules. Risk, complexity and the number of affected files can push a task to a higher level. When in doubt, choose the higher level.

### Checklist Priority System

Level 2 and up uses a priority system so reviewers know what blocks shipping:

| Priority | Meaning | Deferral |
|---|---|---|
| **P0** | hard blocker, cannot ship without this | cannot defer |
| **P1** | required, must complete or get user approval to defer | needs explicit approval to skip |
| **P2** | optional, nice to have | can defer without approval |

### Phase Parents

A folder is a phase parent when it has at least one direct child that matches `[0-9]{3}-[a-z0-9-]+` with its own `spec.md` or `description.json`. The parent then needs only the lean control trio. Heavy docs live exclusively in the children where they stay accurate to that phase's actual work. The parent `spec.md` carries a Phase Documentation Map. `graph-metadata.json` carries `derived.last_active_child_id` and `derived.last_active_at` pointer fields that the generator updates atomically on every save. Parent saves write `null` and child saves bubble up the child's `packet_id`.

`/speckit:resume` reads the pointer first when the target is a phase parent and follows valid bare child ids or track-relative child paths under the parent. The redirect is bounded and escape-safe. Missing, malformed, stale-to-missing-child or non-child pointers leave resume on the requested folder instead of escaping the packet tree. Detection is a single source of truth: `is_phase_parent()` in shell and `isPhaseParent()` in ESM JavaScript MUST agree.

### Phase Decomposition

When a feature is too large for a single spec folder, split it into a parent folder and child folders. The parent holds the overall specification. Each child holds one phase of the work.

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

Use `create.sh --phase` to create a parent with its first child in one step. Run `validate.sh --recursive` to validate the parent and all children together. The validator's phase-parent branch skips Level-N expectations on the lean parent: `check-files.sh`, `check-level-match.sh`, `check-anchors.sh`, `check-section-counts.sh` and `check-template-headers.sh`. Tolerant migration policy: legacy phase parents that retain heavy docs continue to validate without churn.

### Packet-Local Changelogs

The `/speckit:implement` and `/speckit:complete` commands plus the nested changelog workflow can write packet history into a local `changelog/` directory when the target is a packet root or a direct child phase, using the canonical root and phase naming rules. Packet-local changelogs are additive, not a replacement for `implementation-summary.md`.

### Template Rendering

Templates live in one manifest source and render through the Level contract resolver. `create.sh` asks the resolver which files belong to each level, then the inline renderer expands only the sections allowed for that level.

```text
Level 1:  spec.md, plan.md, tasks.md, implementation-summary.md
Level 2:  Level 1 + checklist.md
Level 3:  Level 2 + decision-record.md
Level 3+: Level 3 + extended governance sections
Phase:    lean parent trio plus child phase folders
```

Optional support documents such as `handover.md`, `debug-delegation.md`, `research.md` and `resource-map.md` render through the workflow that owns them. Templates use ANCHOR markers to mark logical sections. Validation checks required anchors, section ordering, template version alignment and cross-reference consistency. The `template-compliance-contract.md` reference defines which anchors are required at each level.

`create.sh` rejects `--path` values that traverse outside the repository with a clear error before any write. Set `SPECKIT_POST_VALIDATE=1` when a strict workflow should run full validation immediately after scaffolding. A mkdir-based advisory lock protects `description.json` and `graph-metadata.json` writes during canonical save so two parallel `/memory:save` calls for the same packet do not race.

### The Search Pipeline

Every search runs through four stages:

1. **Gather** collects candidates from the active channels in parallel. Constitutional memories always inject regardless of score.
2. **Score** fuses channel results with Reciprocal Rank Fusion, then applies the post-fusion scoring signals in one authoritative pass. Those signals cover session boost, recency, causal boost, co-activation spreading, community co-retrieval, graph signals, the FSRS testing effect, intent weights, artifact routing, feedback and anchor and validation metadata enrichment. Intent weights apply here only for non-hybrid search, so hybrid results are never double-weighted.
3. **Rerank** applies MMR diversity reranking without a model to reduce near-duplicate results, then collapses chunks back to parent memories.
4. **Filter** enforces score immutability, applies state filtering, annotates results with confidence labels and truncates at the confidence gap.

### Query Intelligence

Before any search runs, the system figures out what kind of help you need:

- **Complexity routing** sizes up the question and picks how many channels to use, 2 for simple, 4 for moderate and all 5 for complex questions
- **Intent classification** maps the query to one of 7 task types, each with its own channel weight profile
- **Query decomposition** splits multi-topic questions into focused sub-queries without an LLM call
- **HyDE fallback** writes a hypothetical answer and searches for real documents matching it, surfacing content the original wording missed

### Memory Lifecycle

The store uses FSRS to track freshness, a decay model validated on millions of Anki flashcard users.

| Tier | Description | Decay behavior |
|---|---|---|
| **Constitutional** | always-surface rules | never decays |
| **Critical** | high-importance decisions | never decays or decays at 2x slower rate |
| **Important** | significant patterns | 1.5x slower than normal |
| **Normal** | standard session context | standard FSRS decay |
| **Temporary** | quick scratch notes | fast decay |
| **Deprecated** | superseded content | fastest decay |

Decay speed is also controlled by content type. Decisions decay slower than general notes. Memories earn promotions through positive feedback: 5 thumbs-up promotes normal to important, 10 promotes to critical.

Four cognitive states track access patterns: **HOT** for just-used memories, **WARM** for recently used, **COLD** and **DORMANT** for older content. Hot memories get full content in results. Warm ones appear as summaries. Cold and dormant content surfaces only if it still scores well enough.

### Save Intelligence

Every save runs an arbitration process before storing anything. Prediction Error gating compares the incoming content against existing records and picks one of four outcomes:

| Outcome | When | What happens |
|---|---|---|
| **CREATE** | nothing similar exists | stored as new knowledge |
| **REINFORCE** | similar exists and the new one adds value | both kept, existing gets a confidence boost |
| **UPDATE** | similar exists and the new one is better | old version replaced in place |
| **SUPERSEDE** | new knowledge contradicts the old | new version active, old one demoted |

Quality gates run before storage:

- a structure check for the required format and metadata
- a semantic sufficiency check for enough real content to be useful
- a duplicate detection pass

Short decision-type memories can bypass the content-length gate when `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS=true` and at least two structural signals are present, for example a title and a `specFolder` or an anchor.

### The Causal Graph

The system tracks how decisions relate to each other. Six relationship types connect memories: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from` and `supports`. Community detection with the Louvain algorithm clusters related memories automatically, so finding one surfaces its neighbors.

`memory_search` results carry an additive `trustBadges` payload per result envelope. The badges read existing causal-edge columns at response time, so callers can judge whether a causal claim looks fresh and well-supported without changing storage.

| Badge | Source |
|---|---|
| `confidence` | clamped from the strongest connected edge strength |
| `extractionAge` | human-readable age from the newest connected `extracted_at` |
| `lastAccessAge` | human-readable age from the newest connected `last_accessed` |
| `orphan` | true when the result has no incoming causal edges |
| `weightHistoryChanged` | true when any connected edge has a `weight_history` row |

The formatter derives the badges from existing causal-edge tables, fails open when the database handle or `weight_history` table is unavailable and preserves any precomputed payload a caller supplied. Response profile shaping keeps the badge payload on `results[]` and `topResult`. Display only. Storage and schema stay unchanged. No new relation types and no new facts about code, process or tools are stored.

### Index Health and Self-Maintenance

`memory_index_scan` is self-maintaining. Overlapping scan calls return a `coalesced: true` success envelope instead of a rate-limit error. Rows become text-searchable immediately as `pending` while vectors drain, reported as `complete_with_pending_vectors` with a `pendingVectors` count, so content is always searchable even when the embedding queue is backed up. Move reconciliation heals renamed spec folders by packet identity without re-embedding. Each scan also runs a bounded global orphan sweep.

`memory_health` includes an `index` block with a summary enum:

| Summary value | Meaning |
|---|---|
| `healthy_fresh` | index is current and all vectors are resolved |
| `healthy_lagging_vectors` | index is current but some vectors are still pending |
| `stale_needs_scan` | index has not been scanned recently |
| `degraded_needs_repair` | failed rows require `memory_embedding_reconcile` |
| `unavailable` | index state could not be read |

`memory_embedding_reconcile` converges embedding status for stale rows and resets genuinely missing-vector retry rows inside one guarded transaction. The default mode is `dry-run`. No writes happen unless `mode: "apply"` is passed.

After a checkpoint restore that swaps the live database files, the runtime writes a `.needs-rebuild` sentinel beside the restored database. The next boot detects it and rebuilds the derived FTS5 and BM25 shadow plus the vector profile before serving, so a restored snapshot never serves from a stale shadow. The sentinel clears once the rebuild completes.

The SQLite index schema advanced eight migrations (v34 through v41). Each is additive and applied automatically at server boot:

| Migration | Adds |
|---|---|
| **v34** | `memory_trigger_embeddings` table and status index for semantic trigger shadow matching |
| **v35** | `memory_index.source_kind` with provenance backfill into human, agent, system, import or feedback |
| **v36** | idempotency receipts, `delete_after`, `near_duplicate_of` and `last_dedup_checked_at` behind `SPECKIT_MEMORY_IDEMPOTENCY` |
| **v37** | `deleted_at`, active recall index and purgeable retention index for soft-delete tombstones |
| **v38** | bi-temporal validity windows preserving `valid_at` and `invalid_at` alongside the new columns |
| **v39** | causal-edge closure-provenance marker |
| **v40** | derived-identity provenance for generated causal edges with backfill |
| **v41** | retention-forgetting partitions and the semantic-edge layer schema |

### Hardening Defaults

The memory-hardening surface is intentionally conservative. Semantic trigger scoring, feedback retention learning, session-trace causal inference, idempotency receipts, soft-delete tombstones and completion freshness all default OFF. When enabled, the first step is shadow, audit or advisory output so operators can compare behavior before changing live recall or retention.

| Feature | Default | Operator-facing behavior |
|---|---|---|
| Semantic-trigger shadow | OFF | computes semantic trigger candidates while lexical triggers stay primary |
| Idempotency and provenance | OFF for receipts | adds replay receipts and near-duplicate hints only when enabled |
| Soft-delete tombstones | OFF | adds tombstone-aware delete and retention partitions behind `SPECKIT_SOFT_DELETE_TOMBSTONES` |
| Retrieval observability | OFF | `SPECKIT_RESPONSE_TRACE=true` adds search trace payloads without changing the default response shape |
| Feedback reducers | OFF | session-trace causal inference and feedback-aware retention run only behind explicit gates |
| Completion freshness | OFF | strict validation compares stored continuity fingerprints with packet content |

Stale-audit and tool-ownership lint run as live guardrails around this surface. Health checks report stale conditions. Pre-commit compares the generated tool-ownership map against live tool definitions so command ownership cannot drift silently.

### Front-Proxy and Daemon Recycle

The launcher fronts the backend daemon with a session proxy. The proxy keeps one stable client-facing stdio session while the backend behind it recycles in place, for example when the RSS-ceiling watchdog restarts the daemon or when a new build replaces the backend. Read-only replayable tools such as `memory_search` and `memory_context` retry transparently across a recycle, so a routine restart looks like a brief pause.

Three operator-visible error codes surface from this behavior:

| Code | Retryable | Meaning |
|---|---|---|
| `E429` | legacy | the former index rate-limit class, replaced by the `coalesced: true` success envelope |
| `-32001` | yes | `RETRYABLE_RECYCLE_ERROR`, the live launcher recycle signal, retry and reconnect |
| `-32002` | no | `PROTOCOL_MISMATCH_ERROR`, a fail-closed protocol break, reconnect from scratch |

### Evaluation Infrastructure

The store includes built-in tools for measuring search quality:

- **Ablation studies** turn off one search component at a time to measure its contribution
- **12-metric computation** covers MRR, NDCG, MAP and nine other information retrieval metrics
- **Synthetic ground truth** ships 110 test questions with known correct answers, keyed to live parent-memory IDs. Rerun `scripts/evals/map-ground-truth-ids.ts` after database rebuilds or imports before trusting ablation or reporting comparisons
- **Reporting dashboard** shows performance trends across work periods and search channels

---

## 5. COMMANDS

### Spec Kit Commands

| Command | Steps | Purpose |
|---|---|---|
| `/speckit:plan --intake-only` | none | standalone intake interview that publishes `spec.md`, `description.json` and `graph-metadata.json` |
| `/speckit:plan` | 7 | planning only, spec through plan, no implementation |
| `/speckit:implement` | 9 | execute pre-planned work, requires an existing `plan.md` |
| `/speckit:complete` | 14 | full end-to-end workflow from spec through implementation, verification and closeout |
| `/speckit:resume` | 4 | resume a previous session on an existing spec folder |
| `/deep:research` | none | autonomous research loop with convergence detection |
| `/deep:review` | none | autonomous review loop with convergence detection |

When intake is still needed, `/speckit:plan` and `/speckit:complete` use the shared intake contract from `references/workflows/intake-contract.md`. Downstream callers consume the returned `start_state` as the canonical intake enum.

### Mode Suffixes

| Suffix | Behavior |
|---|---|
| `:auto` | execute without approval gates |
| `:autopilot`, `:unattended` or `--unattended` | run the branch-preserved unattended lifecycle and emit `SPECKIT_AUTOPILOT_RESULT` on terminal exits |
| `:confirm` | pause at each step for approval |
| `:with-phases` | phase decomposition mode on planning or completion flows |
| `:with-research` | dispatch deep research before verification, `/speckit:complete` only |

Autopilot is distinct from `:auto`. It requires unattended task metadata during planning, preserves the branch on hard failure, skips merge unless verification is clean and limits terminal reasons to `no_eligible_tasks`, `retry_exhausted`, `verification_failed` and `uncertainty_blocked`.

Command source files: `.opencode/commands/speckit/`.

### Memory Commands

| Command | Tool count | Purpose |
|---|---|---|
| `/memory:save` | 4 | update packet continuity surfaces with semantic indexing |
| `/memory:search` | 13 | search, retrieve and analyze knowledge with auto-detected intent from 7 task types |
| `/memory:manage` | 20 | database maintenance and lifecycle operations |
| `/memory:learn` | 6 | constitutional memory management, create, list, edit and remove rules |

Some commands own their tools while others borrow from `/memory:search` or `/memory:manage`. A borrowed tool works the same way, it is just administered somewhere else.

Command source files: `.opencode/commands/memory/`.

---

## 6. CONFIGURATION

### Embedding Providers

The store converts text to numerical embeddings for vector search. Four providers are supported. The default cascade when `EMBEDDINGS_PROVIDER=auto` or unset is local-first: Ollama, then hf-local, then OpenAI, then Voyage.

| Tier | Provider | Dimensions | Notes |
|---|---|---|---|
| 1 | Ollama | 768 | default. Probes `/api/tags` and uses `nomic-embed-text-v1.5`. Recommended new-user setup |
| 2 | HuggingFace local | 768 | pure-Node `@huggingface/transformers` model server, same model family as the Ollama default |
| 3 | OpenAI | 1536 | cloud opt-in, requires `OPENAI_API_KEY` |
| 4 | Voyage AI | 1024 | cloud opt-in, requires `VOYAGE_API_KEY`, gated by the egress guard |

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `EMBEDDINGS_PROVIDER` | no | `auto` follows the local-first cascade. Set to `ollama`, `hf-local`, `openai` or `voyage` to pin a tier |
| `VOYAGE_API_KEY` | no | Voyage AI cloud embeddings, opt-in |
| `OPENAI_API_KEY` | no | OpenAI cloud embeddings, opt-in |
| `OLLAMA_EMBEDDINGS_MODEL` | no | override the Ollama model, listed defaults derive dimensions at runtime |
| `HF_EMBEDDINGS_MODEL` | no | override the hf-local model, listed defaults derive dimensions at runtime |
| `SPEC_KIT_DB_DIR` / `SPECKIT_DB_DIR` | no | preferred database-directory override, filename derives from the active embedding profile |
| `MEMORY_DB_PATH` | no | explicit file override for the active SQLite database path |
| `LOG_LEVEL` | no | log verbosity: `debug`, `info`, `warn` or `error` |
| `SPECKIT_LAUNCHER_RSS_SELF_EXIT` | no | set `1` to enable the launcher RSS-ceiling watchdog, default off |
| `SPECKIT_BACKEND_ONLY` | no | backend-only stdio gate read at server boot, default off |

The full environment variable reference, including evaluation and telemetry overrides plus the feature flag table, lives in `references/config/environment-variables.md`.

OpenCode note: if the MCP server runs in a restricted or read-only repo context, point `SPEC_KIT_DB_DIR` at a writable directory such as one under your home folder or `/tmp`. Use `MEMORY_DB_PATH` only when you intentionally need one fixed sqlite file.

### MCP Server Configuration

For generic MCP clients that use `mcpServers` syntax such as Claude Desktop, add the server like this:

```json
{
  "mcpServers": {
    "mk-spec-memory": {
      "command": "node",
      "args": [
        "/absolute/path/to/.opencode/skills/system-spec-kit/mcp-server/dist/context-server.js"
      ],
      "env": {
        "EMBEDDINGS_PROVIDER": "auto"
      }
    }
  }
}
```

Claude Code, Codex, Cursor, Devin and the OpenCode plugin bridge use checked-in repo-specific config shapes. Use `mcp-server/INSTALL-GUIDE.md` for the runtime-specific examples instead of pasting the generic block into every client.

### Feature Flags

The store uses runtime-resolved feature flags rather than import-time snapshots. Long-lived MCP processes re-read the relevant environment values during search, scoring, rollout and telemetry checks, so operator flips take effect without a module reload.

| Group | Controls |
|---|---|
| Search Pipeline | 5-channel retrieval, fallback routing, reranking, graph-walk rollout, confidence and token-budget policies |
| Session and Cache | embedding cache, session deduplication, crash recovery, database rebind invalidation |
| Memory and Storage | save quality gate, reconsolidation, governed save and retrieval scopes, causal graph maintenance |
| Embedding and API | startup provider resolution, fail-fast dimension checks, structured fallback metadata |
| Evaluation and Telemetry | ablation guardrails, reporting dashboard output, optional trace and eval logging |

For the full flag reference and rollback procedures, see `references/workflows/rollback-runbook.md`.

### Dynamic Token Budget

The store adjusts token budgets per tier to control how much context is injected:

| Tier | Budget |
|---|---|
| Working | 3,500 tokens |
| Core | 3,500 tokens |
| Constitutional | 4,000 tokens |

---

## 7. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for System Spec Kit whenever a conversation is about to modify files, when a session ends and context should survive or when a new session needs to pick up prior work.

- Gate 3 asks "Which spec folder?" and the work needs a new or existing packet
- A session ends and the reasoning behind the changes should survive
- A new session starts on work from a previous one
- A feature is large enough to split into phases
- A spec folder needs validation before completion

### Boundaries

System Spec Kit owns four surfaces: the spec folder workflow, the validation surface, the indexed-continuity store and the commands that drive them. It does not own the other disciplines a working session touches. `sk-code` owns application-code standards. `sk-git` owns git workflow orchestration. `sk-doc` owns documentation quality and DQI scoring. The memory store indexes spec docs and saved memory, not arbitrary application code.

### Files and Folders

```
.opencode/skills/system-spec-kit/
├── SKILL.md                    # AI workflow instructions (when to use, gates, rules)
├── README.md                   # This file (what it does, how to use it)
├── ARCHITECTURE.md             # Boundary contract: scripts/ vs mcp-server/
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
├── mcp-server/                 # Spec Kit Memory MCP (TypeScript)
│   ├── context-server.ts       # MCP server entry point and tool registration
│   ├── handlers/               # Tool handlers, save pipeline, response assembly
│   ├── lib/                    # Search pipeline, cognitive engine, graph, governance
│   ├── matrix-runners/         # F1-F14 x CLI adapter manifest and runner
│   ├── stress-test/            # Opt-in stress, load, matrix-cell, degraded-state suites
│   ├── tests/                  # MCP test suite
│   ├── INSTALL-GUIDE.md        # Full installation walkthrough
│   └── README.md               # MCP server reference (tool API, pipeline, configuration)
├── shared/                     # Shared workspace (@spec-kit/shared)
│   ├── algorithms/             # Fusion, reranking, lab algorithms
│   ├── contracts/              # Typed trace/envelope contracts
│   ├── embeddings/             # Provider implementations
│   └── ...                     # Chunker, scoring, parsing, utilities
├── references/                 # Reference documentation (27 files)
├── assets/                     # Decision matrices, YAML configs
├── constitutional/             # Always-surface rules (never decay)
├── feature-catalog/            # Feature documentation catalog
└── manual-testing-playbook/    # Manual validation scenarios
```

### Key Files

| File | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | AI agent instructions: routing rules, gates, validation procedures, template application |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | API boundary contract between `scripts/` and `mcp-server/` |
| [`mcp-server/README.md`](./mcp-server/README.md) | full MCP architecture, 41-tool API reference, search pipeline and configuration |
| [`mcp-server/INSTALL-GUIDE.md`](./mcp-server/INSTALL-GUIDE.md) | step-by-step installation with embedding providers and environment setup |
| [`scripts/spec/create.sh`](./scripts/spec/create.sh) | create spec folders with level-appropriate template files |
| [`scripts/spec/validate.sh`](./scripts/spec/validate.sh) | run the validation set from the 46-rule registry on any spec folder |
| `scripts/dist/memory/generate-context.js` | update packet continuity state from structured JSON |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | complete catalog of implemented features |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | manual scenarios that validate the catalog |

### Related Skills

| Skill | Relationship |
|---|---|
| [`sk-doc`](../sk-doc/SKILL.md) | owns documentation quality, DQI scoring and HVR compliance |
| [`sk-code`](../sk-code/SKILL.md) | owns application-code standards and stack-aware workflows |
| [`sk-git`](../sk-git/SKILL.md) | owns git workflow orchestration, worktrees and PRs |
| [`system-skill-advisor`](../system-skill-advisor/SKILL.md) | owns prompt-time skill routing, including the advisor hook this skill uses |
| [`system-deep-loop`](../system-deep-loop/SKILL.md) | owns the `/deep:*` loop commands that anchor into spec folders |

---

## 8. TROUBLESHOOTING

### MCP Tools Return "Tool Not Found"

Calling `memory_match_triggers()` returns an error or the tool is not recognized. The MCP server is not running or not registered in your MCP config.

```bash
node .opencode/skills/system-spec-kit/mcp-server/dist/context-server.js
node --version
```

The server should start and Node.js should report 20.11 or newer. Verify `mk-spec-memory` appears in your `opencode.json` or equivalent MCP config file.

### Memory Save Fails or Creates an Empty File

`generate-context.js` runs but the output file is empty or the script exits with an error. Invalid structured JSON input, a missing explicit spec-folder target or TypeScript sources not compiled to `dist/` cause this.

```bash
cd .opencode/skills/system-spec-kit && npm run build
```

Rebuild the scripts, then retry with a valid structured payload and an explicit spec-folder target.

### Memory Save Rejected by Quality Gate

The save completes but the record is rejected by the semantic sufficiency gate or the structure gate. The content is too thin or missing required structure. Use `dryRun: true` in the `memory_save` tool call to preview gate results without saving. Read the post-save quality review output for specific issues.

### Validation Fails With "Missing Required Files"

`validate.sh` reports missing files such as `spec.md` or `plan.md`. This happens when the folder was created manually without `create.sh` or when wrong level templates were applied.

```bash
ls -la specs/[project]/NNN-feature/
bash .opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh specs/[project]/NNN-feature/
bash .opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh specs/[project]/NNN-feature/ [target-level]
```

### Memory Search Returns Poor Results

`memory_context()` returns irrelevant results or misses content you know exists. The embedding index is stale or the query is too vague for intent classification. Force a re-index with `memory_index_scan`, check `memory_health` with full report mode and try a more specific query with an intent hint such as `find_decision:`.

### memory_health Reports Corruption or FTS5 Integrity Failure

`memory_health` returns `corrupt` or the server logs show an FTS5 shadow index corruption at boot. When the `.unclean-shutdown` crash marker is present, the server runs two probes. A whole-database `PRAGMA quick_check` guards the main index and writes the checkpoint `.needs-rebuild` sentinel on failure, refusing to start rather than serving corrupted data. The `memory_fts` shadow check auto-heals by default because the shadow table is fully derived from `memory_index`. Set `SPECKIT_BOOT_FTS_AUTOHEAL=0` for detect-only mode. Clean shutdowns skip both probes.

```bash
SPECKIT_BOOT_FTS_AUTOHEAL=1 node .opencode/bin/mk-spec-memory-launcher.cjs
```

If `degraded_needs_repair` appears in the `index.summary` field, run `memory_embedding_reconcile({ mode: "apply" })` after the rebuild.

### Memory Save Fails While a Live Daemon Is Running

A standalone script save and a live daemon session can conflict when both try to acquire the write lock on the same database file. The store uses a single-writer lease. Use the MCP tool path when a daemon is running: `/memory:save [spec-folder]`. The daemon serializes writes through its own handler queue. Fall back to `generate-context.js` directly only when no daemon is active, for example in CI or headless batch jobs.

### Quick Fixes

| Problem | Fix |
|---|---|
| `generate-context.js` not found | run `npm run build` in `system-spec-kit/` |
| Spec folder fails validation | run `validate.sh --verbose` and read each failing rule |
| Memory context seems wrong | call `memory_stats({})` to check index counts |
| Session context lost after crash | use `/speckit:resume` to select the fresher folder-local source |
| Placeholder check fails | run `check-placeholders.sh` and replace all `[PLACEHOLDER]` values |
| Stale results after save | call `memory_index_scan({ specFolder: "..." })` to force re-index |
| Too many near-duplicate results | check that the interference penalty is active in feature flags |
| `spec-memory.cjs` exits 69 | CLI dist is missing or stale, run `npm run build --workspace=@spec-kit/mcp-server` |
| `spec-memory.cjs` exits 75 with `--warm-only` | expected when the daemon is cold, retry without `--warm-only` or start a session that spawns it |

### Diagnostic Commands

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/calculate-completeness.sh specs/[project]/NNN-feature/
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/[project]/NNN-feature/ --verbose
bash .opencode/skills/system-spec-kit/scripts/check-api-boundary.sh
# memory_health({ reportMode: "full" })
```

---

## 9. FAQ

**Q: Is System Spec Kit mandatory for every file change?**

A: Yes, for any conversation that modifies files. The only exemption is single-file fixes under 5 characters, typo or whitespace corrections. Gate 3 in AGENTS.md enforces this by asking "Which spec folder?" before any file modification begins.

**Q: When do I need Level 2 instead of Level 1?**

A: Level 2 adds a `checklist.md` for QA verification. Use it when the change touches multiple files, needs testing verification or has edge cases worth documenting. The LOC guidance is 100 to 499, but risk and complexity matter more than line count.

**Q: When do I need Level 3?**

A: Level 3 adds a `decision-record.md` for architecture decisions. Use it for changes that affect system architecture, involve trade-offs between alternatives or touch 500+ lines across multiple systems. If future developers will ask why, Level 3 captures the answer.

**Q: How do spec folders and memory work together?**

A: Spec folders capture what happened in structured documentation. `generate-context.js` updates the packet's canonical continuity surfaces. `/speckit:resume` rebuilds the next session from those sources, comparing folder-local `handover.md` and `_memory.continuity` freshness before falling back to packet docs. The MCP server indexes those sources so deeper retrieval still works through `session_bootstrap()`, `memory_context()`, `memory_match_triggers()` and `memory_search()`. One side captures, the recovery surfaces retrieve.

**Q: Can I use memory without spec folders?**

A: The store can index any markdown file, beyond spec folder contents. For implementation work the canonical continuity path is the spec folder itself. You can still save standalone memories with `memory_save`, but Gate 3 will still ask about a spec folder for file modifications.

**Q: What is the difference between this README and the MCP server README?**

A: This README covers the whole skill: spec folders, documentation levels, commands, templates and scripts, plus the indexed-continuity store at a high level. The MCP server README goes deep on the store: the 41-tool API reference, the retrieval channels, the save pipeline, the causal graph and the evaluation infrastructure.

**Q: What is the difference between SKILL.md and this README?**

A: SKILL.md contains instructions for AI agents: when to activate, routing rules, gate procedures and validation workflows. This README is for humans and AI alike: what the skill does, how to use it, where to find things and which commands drive it. SKILL.md is the employee handbook, this README is the product brochure.

**Q: What is Constitutional Memory?**

A: Constitutional memories are rules that always surface in every retrieval, regardless of recency or score. They carry a 3.0x scoring multiplier and never decay. Use `/memory:learn` to create them. Typical uses include team coding standards and mandatory workflow steps, plus known failure modes. They work like pinned messages in a chat, always visible no matter how far you scroll.

**Q: How do I upgrade a Level 1 folder to Level 2 after the fact?**

A: Run `upgrade-level.sh` with the target level. It renders and injects the additional Level contract sections into the existing folder. Then run `check-placeholders.sh` to find new placeholder values that need filling.

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh specs/[project]/NNN-feature/ 2
```

---

## 10. VERIFICATION

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/README.md --type readme` reports zero issues |
| Human Voice Rules | the em dash, semicolon and Oxford comma greps return zero prose hits |
| Link resolution | the link guard reports no failures in this README |
| Spec folder validation | `validate.sh` on a spec folder exits 0 |
| Memory health | `memory_health({ reportMode: "full" })` returns `status: "ok"` |

### Scripts That Manage Spec Folders

| Script | Purpose |
|---|---|
| `create.sh` | create spec folders with level-appropriate templates, `--phase` for parent plus child folders |
| `validate.sh` | run the validation set from the 46-rule registry, `--strict` for strict-only rules, `--recursive` for phase folders, `--verbose` for details |
| `upgrade-level.sh` | render additional Level contract sections for a higher level |
| `recommend-level.sh` | analyze scope and risk to recommend the right level |
| `calculate-completeness.sh` | calculate spec folder completeness as a percentage |
| `check-completion.sh` | verify all completion criteria are met |
| `check-placeholders.sh` | find remaining `[PLACEHOLDER]` values after a level upgrade |
| `check-template-staleness.sh` | detect templates that need regeneration |
| `progressive-validate.sh` | progressive validation for in-progress work |
| `quality-audit.sh` | run a quality audit on spec folder content |
| `archive.sh` | archive completed spec folders |
| `test-validation.sh` | test the validation rules themselves |

### Scripts That Maintain the Memory Store

| Script | Purpose |
|---|---|
| `generate-context.ts` | source for the runtime entry point `scripts/dist/memory/generate-context.js` |
| `backfill-frontmatter.ts` | add missing frontmatter to generated context artifacts |
| `backfill-research-metadata.ts` | backfill missing metadata files under `research/*/iterations/` |
| `rank-memories.ts` | rank memories by relevance for a query |
| `reindex-embeddings.ts` | rebuild embedding vectors for stored records |
| `cleanup-orphaned-vectors.ts` | remove vector entries with no matching record |
| `rebuild-auto-entities.ts` | regenerate the auto-extracted entity catalog |
| `validate-memory-quality.ts` | run quality checks on stored record content |
| `ast-parser.ts` | parse markdown AST for section extraction |
| `fix-memory-h1.mjs` | fix heading levels in older generated artifacts |

TypeScript sources compile to `scripts/dist/`.

### Validation Helper Scripts

| Script | Purpose |
|---|---|
| `continuity-freshness.ts` | warn when `_memory.continuity.last_updated_at` lags `graph-metadata.json` |
| `evidence-marker-audit.ts` | bracket-depth audit and optional rewrap pass for malformed `EVIDENCE` markers |
| `evidence-marker-lint.ts` | strict wrapper that fails on malformed or unclosed markers |

The manual testing playbook runs every scenario behind these checks.

---

## 11. RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | AI agent instructions, routing, gates and validation |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | API boundary contract between `scripts/` and `mcp-server/` |
| [`mcp-server/README.md`](./mcp-server/README.md) | full MCP architecture, 41-tool API reference, search pipeline and configuration |
| [`mcp-server/INSTALL-GUIDE.md`](./mcp-server/INSTALL-GUIDE.md) | installation walkthrough with embedding providers and environment variables |
| [`references/memory/memory-system.md`](./references/memory/memory-system.md) | detailed memory system reference |
| [`references/workflows/intake-contract.md`](./references/workflows/intake-contract.md) | shared spec-folder intake contract for plan, complete and resume re-entry |
| [`references/workflows/rename-pattern.md`](./references/workflows/rename-pattern.md) | mechanical rename workflow and live-vs-historical surface discipline |
| [`references/workflows/spec-folder-write-recipe.md`](./references/workflows/spec-folder-write-recipe.md) | step-by-step recipe for a spec folder that passes strict validation on the first try |
| [`references/workflows/spec-folder-authoring-checklist.md`](./references/workflows/spec-folder-authoring-checklist.md) | companion checklist for the Level contract, continuity frontmatter and metadata files |
| [`references/workflows/rollback-runbook.md`](./references/workflows/rollback-runbook.md) | feature-flag rollback and smoke-test procedures |
| [`references/validation/validation-rules.md`](./references/validation/validation-rules.md) | validation rule reference, the 46-rule registry is authoritative |
| [`references/templates/template-guide.md`](./references/templates/template-guide.md) | template usage and composition rules |
| [`references/config/environment-variables.md`](./references/config/environment-variables.md) | full environment variable reference |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | complete catalog of implemented features |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | manual scenarios that validate the catalog |

### Cross-Skill Alignment

| Skill | Purpose |
|---|---|
| [`sk-doc`](../sk-doc/SKILL.md) | documentation quality standard, DQI scoring and HVR compliance |
| [`sk-code`](../sk-code/SKILL.md) | stack-aware code workflow and quality standard |
| [`sk-git`](../sk-git/SKILL.md) | git workflow orchestration, conventional commits and PRs |
| [`system-skill-advisor`](../system-skill-advisor/SKILL.md) | prompt-time skill routing and the advisor hook contract |
| [`system-deep-loop`](../system-deep-loop/SKILL.md) | deep research and review loops that anchor into spec folders |

### Project-Level References

| Resource | Purpose |
|---|---|
| `AGENTS.md` (project root) | gate definitions, AI behavior framework and mandatory workflow rules |
| `specs/` | all spec folders created by Spec Kit (`.opencode/specs` is a compat symlink to this same tree) |
| `.opencode/commands/speckit/` | speckit command definitions |
| `.opencode/commands/memory/` | memory command definitions |

### External Resources

| Resource | Purpose |
|---|---|
| [Model Context Protocol](https://modelcontextprotocol.io/) | MCP specification |
| [FSRS algorithm](https://github.com/open-spaced-repetition/fsrs4anki) | Free Spaced Repetition Scheduler, the memory decay model |
| [sqlite-vec](https://github.com/asg017/sqlite-vec) | SQLite vector search extension |
