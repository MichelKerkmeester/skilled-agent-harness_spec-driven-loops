---
title: "Shared Library Modules"
description: "The TypeScript modules the spec-kit engine, the CLI package, the runtime hooks and the skill advisor import from one place: frontmatter and save-quality parsing, the Gate 3 classifier, the compaction merger and budget, path and workspace helpers and the RRF primitives."
trigger_phrases:
  - "shared library modules"
  - "spec kit shared package"
  - "shared TypeScript modules"
version: 1.0.4.0
---

# Shared Library Modules

> One package, `@spec-kit/shared`, holding the modules that more than one spec-kit surface imports. Source files are `.ts`; `tsc --build` writes ESM to `dist/`, and every consumer resolves the package through its own `node_modules` link to this directory.

---

## 1. OVERVIEW

### What is the shared/ Directory?

`shared/` is the canonical source for modules used by:

- **The spec-kit engine** (`runtime/`) - the validation orchestrator, generated metadata, the Gate 3 classifier and the hook adapters
- **The CLI package** (`runtime/cli/`) - the continuity save pipeline and the spec-folder tooling
- **The skill advisor** - the RRF primitives and the IPC socket server

Nothing here opens a database or talks to a network on import. Modules take their inputs from callers and hand results back; the consumer decides where anything persists.

### What lives here

| Area | Modules | Consumers |
| --- | --- | --- |
| Frontmatter and spec-doc parsing | `frontmatter/parse-frontmatter.ts`, `parsing/memory-sufficiency.ts`, `parsing/memory-template-contract.ts`, `parsing/spec-doc-health.ts` | engine rules, the save pipeline, sk-doc and deep-loop scripts |
| Gate 3 | `gate-3-classifier.ts` | the prompt hooks of every runtime, the pi plugin, the spec-root registry |
| Compaction | `compact-merger.ts`, `budget-allocator.ts` | the PreCompact hook adapters |
| Paths and workspace | `workspace/repo-root.mjs`, `workspace/package-root.ts`, `config.ts`, `utils/path-containment.ts`, `utils/path-security.ts`, `review-research-paths.cjs` | build scripts, CI, the deep-loop artifact root, the telemetry store |
| Text helpers | `trigger-extractor.ts`, `unicode-normalization.ts`, `context-types.ts`, `utils/jsonc-strip.ts`, `utils/token-estimate.ts` | the engine, the CLI and the hooks |
| Predicate grammar | `predicates/boolean-expr.ts` | the typed `when:` form the speckit and deep command contracts cite as their grammar |
| Ranking | `algorithms/rrf-fusion.ts` | the skill advisor's fusion scorer |
| IPC | `ipc/socket-server.ts` | the skill advisor daemon |

### What left

The package used to carry a second half that nothing imported once the memory database was retired: an in-process embeddings monolith with its circuit breaker, adaptive fusion and MMR reranking, a learned combiner with its matrix math, retrieval-trace contracts, a structure-aware chunker, a quality extractor, the database-path derivations and the barrel that re-exported all of it. They were removed together with the tests that were their only exercise. Anything that needs them again gets them back from history, not from a copy kept warm.

### Requirements

| Requirement | Minimum |
| --- | --- |
| Node.js | 22.23.4, 24.22.1, 26.12.1 or newer on those lines |

---

### Boundary and Import Policy

- **Import convention**: consumers import `@spec-kit/shared/<module>`; the package maps every subpath onto `dist/`. `workspace/repo-root.mjs` and `review-research-paths.cjs` are shipped as source because build and CI scripts `require()` them before any build exists.
- **No barrel**: there is no root export. Import the module you use, so a dead module has no importer to hide behind.
- **Neutrality**: `shared/` imports nothing from `runtime/` or `runtime/cli/`; the CLI's `npm run check` rejects a reverse import.
- **Stability**: a breaking change here needs coordination with every consumer in the table above.
- **Root resolution**: three implementations survive, one per runtime boundary, and a parity test in the CLI feeds them the same trees.
  - `workspace/repo-root.mjs` finds the repository root by sentinel and ships as source because build and CI scripts run it before any build exists.
  - `workspace/package-root.ts` finds the skill package root by its marker directories (`shared`, `runtime`, `runtime/cli`) and is the compiled walk every TypeScript caller uses: `config.ts` and the CLI's architecture and dist-alignment checks call it rather than walking themselves.
  - `runtime/cli/lib/shell-common.sh` and `runtime/cli/common.sh` resolve the repository root for bash, where no Node module can be imported.

---

## 2. QUICK START

```bash
cd .skilled/skills/system-spec-kit
npm install
( cd shared && ../node_modules/.bin/tsc --build )
# `dist/` is untracked. system-deep-loop and sk-doc declare this package as a file: dependency
# and resolve its compiled subpaths, so run the build above before their tests on a fresh checkout.
```

```typescript
import { parseFrontmatter } from '@spec-kit/shared/frontmatter/parse-frontmatter';
import { classifyPrompt } from '@spec-kit/shared/gate-3-classifier';
import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
```

### Verify Installation

```bash
ls .skilled/skills/system-spec-kit/shared/
# budget-allocator.ts, compact-merger.ts, config.ts, context-types.ts,
# gate-3-classifier.ts, review-research-paths.cjs, trigger-extractor.ts, types.ts,
# unicode-normalization.ts, algorithms/, frontmatter/, ipc/, parsing/,
# predicates/, utils/, workspace/, dist/
```

---

## 3. STRUCTURE

```
shared/
├── budget-allocator.ts         # Prompt/token budget allocation for compaction
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
├── utils/
│   ├── jsonc-strip.ts          # JSONC comment stripping
│   ├── path-containment.ts     # Path containment checks
│   ├── path-security.ts        # Path validation
│   └── token-estimate.ts       # Token count estimation
├── workspace/
│   └── repo-root.mjs           # Repository root resolution, shipped as source
├── scripts/
│   └── env-reader-table.mjs    # Generates and checks the environment-variable table below
├── tests/                      # node:test suites for every module above (`npm test`)
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
| `config.ts` | Resolves the telemetry store directory from the database-directory override, else `runtime/database/` under the skill root |
| `algorithms/rrf-fusion.ts` | Rank fusion for the advisor's lane fusion scorer |
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

### Rank Fusion

`algorithms/rrf-fusion.ts` fuses ranked lists deterministically. The advisor's scorer imports it directly.

---

## 5. CONFIGURATION

Every variable this package reads, one row per variable, with the files that read it. The table is generated by `scripts/env-reader-table.mjs` (`node scripts/env-reader-table.mjs --write` rewrites it, `--check` fails on drift, and `tests/readme-env-readers.test.ts` runs the check under `npm test`). Provider credentials and model names are the skill advisor's; the root `.env.example` carries the same entries with their defaults.

| Group | Variable | Read by |
| --- | --- | --- |
| Database directory | `SPEC_KIT_DB_DIR` | `config.ts` |
| Database directory | `SPECKIT_DB_DIR` | `config.ts` |
| IPC | `SPECKIT_IPC_SOCKET_DIR` | `ipc/socket-server.ts` |
| IPC | `SPECKIT_MAX_SECONDARY_CLIENTS` | `ipc/socket-server.ts` |
| Rank fusion | `SPECKIT_RRF` | `algorithms/rrf-fusion.ts` |
| Rank fusion | `SPECKIT_RRF_K` | `algorithms/rrf-fusion.ts` |
| Rank fusion | `SPECKIT_SCORE_NORMALIZATION` | `algorithms/rrf-fusion.ts` |
| Rank fusion | `SPECKIT_CALIBRATED_OVERLAP_BONUS` | `algorithms/rrf-fusion.ts` |

Two spellings of the database-directory override are honoured because both appear in operator configs; `SPEC_KIT_DB_DIR` is checked first.

### Where data is stored

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

---

## 7. TROUBLESHOOTING

| Problem | What to check |
| --- | --- |
| Telemetry lands in the wrong place | `config.ts` derives the directory from `SPEC_KIT_DB_DIR` or `SPECKIT_DB_DIR`, else `runtime/database/` under the skill root |

### Diagnostic Commands

```bash
cd .skilled/skills/system-spec-kit/shared
npm test
node --input-type=module -e "const { extractTriggerPhrases } = await import('./dist/trigger-extractor.js'); console.log(extractTriggerPhrases('memory search trigger extraction'))"
```

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
| --- | --- |
| [algorithms/README.md](./algorithms/README.md) | The RRF primitives |
| [utils/README.md](./utils/README.md) | Path and estimation helpers |
| [runtime/ENV-REFERENCE.md](../runtime/ENV-REFERENCE.md) | Every environment variable the packages read |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | The dependency matrix between the three packages |
| [SKILL.md](../SKILL.md) | Parent skill documentation |
