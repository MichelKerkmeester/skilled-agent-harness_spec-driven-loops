---
title: "Shared Library Modules"
description: "The TypeScript modules the spec-kit engine, the CLI package, the runtime hooks and the skill advisor import from one place: frontmatter and save-quality parsing, the Gate 3 classifier, the compaction merger and budget, path and workspace helpers, the RRF primitives and the advisor's embedding provider stack."
trigger_phrases:
  - "shared library modules"
  - "spec kit shared package"
  - "shared TypeScript modules"
  - "embedding provider stack"
---

# Shared Library Modules

> One package, `@spec-kit/shared`, holding the modules that more than one spec-kit surface imports. Source files are `.ts`; `tsc --build` writes ESM to `dist/`, and every consumer resolves the package through its own `node_modules` link to this directory.

---

## 1. OVERVIEW

### What is the shared/ Directory?

`shared/` is the canonical source for modules used by:

- **The spec-kit engine** (`runtime/`) - the validation orchestrator, generated metadata, the Gate 3 classifier and the hook adapters
- **The CLI package** (`runtime/cli/`) - the continuity save pipeline and the spec-folder tooling
- **The skill advisor** - the embedding provider stack under `embeddings/`, the RRF primitives and the IPC socket server

Nothing here opens a database or talks to a network on import. Modules take their inputs from callers and hand results back; the consumer decides where anything persists.

### What lives here

| Area | Modules | Consumers |
| --- | --- | --- |
| Frontmatter and spec-doc parsing | `frontmatter/parse-frontmatter.ts`, `parsing/memory-sufficiency.ts`, `parsing/memory-template-contract.ts`, `parsing/spec-doc-health.ts` | engine rules, the save pipeline, sk-doc and deep-loop scripts |
| Gate 3 | `gate-3-classifier.ts` | the prompt hooks of every runtime, the pi plugin, the spec-root registry |
| Compaction | `compact-merger.ts`, `budget-allocator.ts` | the PreCompact hook adapters |
| Paths and workspace | `workspace/repo-root.mjs`, `config.ts`, `utils/path-containment.ts`, `utils/path-security.ts`, `review-research-paths.cjs` | build scripts, CI, the deep-loop artifact root, the telemetry store |
| Text helpers | `chunking.ts`, `trigger-extractor.ts`, `unicode-normalization.ts`, `context-types.ts`, `utils/jsonc-strip.ts`, `utils/token-estimate.ts`, `utils/retry.ts`, `scoring/folder-scoring.ts` | the save pipeline, the hooks, the embedding providers |
| Predicate grammar | `predicates/boolean-expr.ts` | the typed `when:` form the speckit and deep command contracts cite as their grammar |
| Embedding providers | `embeddings/` (factory, profile, registry, auto-select, adapters, providers) | the skill advisor and the HF model server launcher |
| Ranking | `algorithms/rrf-fusion.ts` | the skill advisor's fusion scorer |
| IPC | `ipc/socket-server.ts` | the skill advisor daemon |

### What left

The package used to carry a second half that nothing imported once the memory database was retired: an in-process embeddings monolith with its circuit breaker, adaptive fusion and MMR reranking, a learned combiner with its matrix math, retrieval-trace contracts, a structure-aware chunker, a quality extractor, the database-path derivations and the barrel that re-exported all of it. They were removed together with the tests that were their only exercise. Anything that needs them again gets them back from history, not from a copy kept warm.

### Requirements

| Requirement | Minimum |
| --- | --- |
| Node.js | >=20.11.0 |

The embedding stack talks to Ollama, the local HF model server under `.opencode/bin`, OpenAI or Voyage over HTTP; it does not load a model in-process, so this package declares no ML dependency.

---

## 1B. BOUNDARY AND IMPORT POLICY

- **Import convention**: consumers import `@spec-kit/shared/<module>`; the package maps every subpath onto `dist/`. `workspace/repo-root.mjs` and `review-research-paths.cjs` are shipped as source because build and CI scripts `require()` them before any build exists.
- **No barrel**: there is no root export. Import the module you use, so a dead module has no importer to hide behind.
- **Neutrality**: `shared/` imports nothing from `runtime/` or `runtime/cli/`; the CLI's `npm run check` rejects a reverse import.
- **Stability**: a breaking change here needs coordination with every consumer in the table above.

---

## 2. QUICK START

```bash
cd .opencode/skills/system-spec-kit
npm install
( cd shared && ../node_modules/.bin/tsc --build )
```

```typescript
import { parseFrontmatter } from '@spec-kit/shared/frontmatter/parse-frontmatter';
import { classifyPrompt } from '@spec-kit/shared/gate-3-classifier';
import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
import { createEmbeddingsProvider } from '@spec-kit/shared/embeddings/factory';
```

### Verify Installation

```bash
ls .opencode/skills/system-spec-kit/shared/
# budget-allocator.ts, chunking.ts, compact-merger.ts, config.ts, context-types.ts,
# gate-3-classifier.ts, review-research-paths.cjs, trigger-extractor.ts, types.ts,
# unicode-normalization.ts, algorithms/, embeddings/, frontmatter/, ipc/, parsing/,
# predicates/, scoring/, utils/, workspace/, dist/
```

---

## 3. STRUCTURE

```
shared/
├── budget-allocator.ts         # Prompt/token budget allocation for compaction
├── chunking.ts                 # Semantic chunking of long text
├── compact-merger.ts           # Compacted context merge helpers
├── config.ts                   # Telemetry store directory and its env override
├── context-types.ts            # Canonical context types and legacy aliases
├── gate-3-classifier.ts        # File-modification Gate 3 classifier
├── review-research-paths.cjs   # Deep-loop artifact-root path contract
├── trigger-extractor.ts        # Trigger phrase extraction
├── types.ts                    # Cross-package types
├── unicode-normalization.ts    # Unicode normalization helpers
├── algorithms/
│   └── rrf-fusion.ts           # Reciprocal rank fusion primitives
├── embeddings/                 # Provider stack owned by the skill advisor
│   ├── factory.ts              # Provider selection and auto-cascade
│   ├── profile.ts              # Embedding profiles and database naming
│   ├── registry.ts             # Model manifests and canonical fallbacks
│   ├── auto-select.ts          # Reachability probes for the cascade
│   ├── adapters/               # Backend adapters
│   └── providers/              # ollama, hf-local, openai, voyage
├── frontmatter/
│   └── parse-frontmatter.ts    # The frontmatter parser every reader shares
├── ipc/
│   └── socket-server.ts        # Shared IPC socket server helper
├── parsing/
│   ├── memory-sufficiency.ts          # Save-quality sufficiency gate
│   ├── memory-template-contract.ts    # Template contract for continuity artifacts
│   └── spec-doc-health.ts             # Spec document health checks
├── predicates/
│   └── boolean-expr.ts         # Typed predicate grammar the command contracts cite
├── scoring/
│   └── folder-scoring.ts       # Composite folder ranking logic
├── utils/
│   ├── jsonc-strip.ts          # JSONC comment stripping
│   ├── path-containment.ts     # Path containment checks
│   ├── path-security.ts        # Path validation
│   ├── retry.ts                # Retry and backoff classification for the cloud providers
│   └── token-estimate.ts       # Token count estimation
├── workspace/
│   └── repo-root.mjs           # Repository root resolution, shipped as source
├── dist/                       # Compiled JS output
├── package.json
├── tsconfig.json
└── README.md
```

### Key Files

| File | Purpose |
| --- | --- |
| `frontmatter/parse-frontmatter.ts` | The one frontmatter parser; more than twenty importers |
| `gate-3-classifier.ts` | Decides whether a prompt will write, for every runtime's prompt hook |
| `compact-merger.ts`, `budget-allocator.ts` | Merge and budget the payload the PreCompact hooks carry |
| `config.ts` | Resolves the telemetry store directory and honours the database-directory override the skill advisor also uses |
| `embeddings/factory.ts` | Selects and constructs the embedding provider the skill advisor runs |
| `algorithms/rrf-fusion.ts` | Rank fusion for the advisor's five-lane scorer |
| `workspace/repo-root.mjs` | Repository root resolution for scripts that run before a build |
| `review-research-paths.cjs` | The artifact-root contract the deep-loop runtime requires |

---

## 4. FEATURES

### Frontmatter and Save Gates

`parseFrontmatter` is the single parser behind validation rules, the save pipeline and the sk-doc and deep-loop scripts. The three `parsing/` modules gate a continuity save: sufficiency, template contract and document health. Their names still say "memory" because they were born in the memory pipeline; the gates themselves are live.

### Gate 3 Classification

`classifyPrompt` owns the vocabulary that decides whether a turn will write a file. Every runtime's prompt hook, the pi plugin and the spec-root registry call it, and `SYSTEM_SPEC_GATE_ENFORCE` governs whether the verdict blocks.

### Compaction

The PreCompact adapters merge the payload through `compact-merger.ts` and size it through `budget-allocator.ts`.

### Embedding Providers

`embeddings/factory.ts` selects a provider, either the explicit `EMBEDDINGS_PROVIDER` or the local-first cascade (Ollama, then the local HF model server, then OpenAI, then Voyage), and constructs it. `profile.ts` names the database a profile writes so two profiles never share one. The stack produces vectors and returns them; the skill advisor, its only consumer, decides where they are stored.

### Rank Fusion

`algorithms/rrf-fusion.ts` fuses ranked lists deterministically. The advisor's scorer imports it directly.

---

## 5. CONFIGURATION

Every variable this package reads, grouped by the code that reads it. Provider credentials and model names are the skill advisor's; the root `.env.example` carries the same entries with their defaults.

| Group | Variables | Read by |
| --- | --- | --- |
| Provider selection | `EMBEDDINGS_PROVIDER`, `EMBEDDING_DIM` | `embeddings/factory.ts`, `embeddings/profile.ts` |
| Ollama | `OLLAMA_EMBEDDINGS_MODEL`, `OLLAMA_BASE_URL`, `OLLAMA_REQUEST_TIMEOUT_MS` | `embeddings/providers/ollama.ts`, `embeddings/profile.ts` |
| Local HF model server | `HF_EMBEDDINGS_MODEL`, `HF_EMBEDDINGS_DTYPE`, `HF_EMBED_AUTH_TOKEN`, `HF_EMBED_SERVER_READY_TIMEOUT_MS`, `SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS`, `SPECKIT_HF_READY_LATCH_TTL_MS` | `embeddings/providers/hf-local.ts` |
| OpenAI | `OPENAI_API_KEY`, `OPENAI_EMBEDDINGS_MODEL`, `OPENAI_BASE_URL` | `embeddings/providers/openai.ts`, `embeddings/factory.ts` |
| Voyage | `VOYAGE_API_KEY`, `VOYAGE_EMBEDDINGS_MODEL`, `VOYAGE_BASE_URL` | `embeddings/providers/voyage.ts`, `embeddings/profile.ts`, `embeddings/auto-select.ts` |
| Cascade probes | `SPECKIT_CASCADE_PROBE_TIMEOUT_MS`, `SPECKIT_CASCADE_LOCK_STALE_MS`, `SPECKIT_CASCADE_SLEEP_MS` | `embeddings/auto-select.ts` |
| Database directory | `SPEC_KIT_DB_DIR` or `SPECKIT_DB_DIR`, `MEMORY_DB_PATH` | `config.ts`, `embeddings/factory.ts`, `embeddings/profile.ts` |
| IPC | `SPECKIT_IPC_SOCKET_DIR`, `SPECKIT_MAX_SECONDARY_CLIENTS` | `ipc/socket-server.ts` |
| Rank fusion | `SPECKIT_RRF`, `SPECKIT_RRF_K`, `SPECKIT_SCORE_NORMALIZATION`, `SPECKIT_CALIBRATED_OVERLAP_BONUS`, `SPECKIT_RETRIEVAL_PROFILE_WEIGHTS` | `algorithms/rrf-fusion.ts` |

Two spellings of the database-directory override are honoured because both appear in operator configs; `SPEC_KIT_DB_DIR` is checked first. `MEMORY_DB_PATH` keeps its historical name: the retired memory server was the directory's original owner, and the skill-advisor launcher now points the variable at its own database.

### Where embeddings are stored

`shared/` owns no store. The skill advisor keeps its database beside its own server; `config.ts` resolves the telemetry directory under `runtime/database/`, where the engine writes `access-telemetry.json`.

---

## 6. USAGE EXAMPLES

### Parse frontmatter the way the validator does

```typescript
import { parseFrontmatter } from '@spec-kit/shared/frontmatter/parse-frontmatter';

const { frontmatter, body } = parseFrontmatter(markdown);
console.log(frontmatter.trigger_phrases, body.length);
```

### Ask Gate 3 whether a prompt will write

```typescript
import { classifyPrompt } from '@spec-kit/shared/gate-3-classifier';

const verdict = classifyPrompt('rename the helper and update its test');
console.log(verdict.triggersGate, verdict.reason);
```

### Fuse two ranked lists

```typescript
import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';

const fused = fuseResultsMulti([lexicalHits, graphHits]);
console.log(fused[0].rrfScore, fused[0].sources);
```

### Construct the advisor's embedding provider

```typescript
import { createEmbeddingsProvider } from '@spec-kit/shared/embeddings/factory';

const provider = await createEmbeddingsProvider();
const vector = await provider.embedQuery('routing parity for parent hubs');
console.log(provider.getMetadata().model, vector.length);
```

---

## 7. TROUBLESHOOTING

| Problem | What to check |
| --- | --- |
| A provider is not selected | `echo $EMBEDDINGS_PROVIDER`; with `auto`, confirm Ollama or the HF model server is reachable, or that a cloud key is set |
| The HF client waits and gives up | The socket directory the client expects must equal the one the model server binds; `embeddings/model-server-constants.test.ts` asserts it |
| A vector store rejects a dimension | The profile filename encodes provider, model, dimension and dtype; a store built under another profile has to be rebuilt |
| Telemetry lands in the wrong place | `config.ts` derives the directory from `SPEC_KIT_DB_DIR` or `SPECKIT_DB_DIR`, else `runtime/database/` under the skill root |

### Diagnostic Commands

```bash
cd .opencode/skills/system-spec-kit/shared
npm test
node --input-type=module -e "const { extractTriggerPhrases } = await import('./dist/trigger-extractor.js'); console.log(extractTriggerPhrases('memory search trigger extraction'))"
```

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
| --- | --- |
| [embeddings/README.md](./embeddings/README.md) | The provider stack in detail |
| [algorithms/README.md](./algorithms/README.md) | The RRF primitives |
| [utils/README.md](./utils/README.md) | Path, retry and estimation helpers |
| [runtime/ENV-REFERENCE.md](../runtime/ENV-REFERENCE.md) | Every environment variable the packages read |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | The dependency matrix between the three packages |
| [SKILL.md](../SKILL.md) | Parent skill documentation |
