---
title: Environment Variables Reference
description: Configuration options via environment variables for the Spec Kit system
trigger_phrases:
  - "spec kit environment variables"
  - "validation gate defaults"
  - "embedding provider env vars"
  - "script execution configuration"
importance_tier: normal
contextType: general
version: 3.6.0.59
---

# Environment Variables Reference

Configuration options via environment variables for the Spec Kit system.

---

## 1. OVERVIEW

These variables control path resolution, script execution, spec validation and generated metadata, and the shared embedding stack the package's operators configure alongside it.

This document is the orientation view. [`runtime/ENV-REFERENCE.md`](../../runtime/ENV-REFERENCE.md) is the source of truth: every row there names the file that actually reads the variable. When the two disagree, ENV-REFERENCE wins.

---

## 2. PATH RESOLUTION

`runtime/core/config.ts` resolves the package's working directories. `resolveDatabasePaths()` is still imported by `lib/storage/transaction-manager.ts` and re-exported from `api/index.ts`, so the directory-override family below stays live.

| Variable | Default | Purpose |
|----------|---------|---------|
| `SPEC_KIT_DB_DIR` / `SPECKIT_DB_DIR` | Auto-detected | Directory override consulted by `computeDatabasePaths()`. `SPEC_KIT_DB_DIR` is checked first and wins; either is resolved against `process.cwd()` and must land inside the project, home, or temporary directory |
| `MEMORY_DB_PATH` | Unset | Explicit file path whose parent directory becomes the resolved directory, used only when neither directory override is set |
| `MEMORY_BASE_PATH` | Current working directory | Workspace root used as `DEFAULT_BASE_PATH` for path validation |
| `SPECKIT_SPECS_DIR` | Unset | Fallback specs root used when a spec folder is not directly under `process.cwd()`. `SPEC_KIT_SPECS_DIR` is checked first and wins; the candidate is used only if it exists |

Point a directory override at a writable location outside read-only repo paths (for example under your home directory or `/tmp`).

### Retrieval has no daemon

Spec-folder retrieval is lexical and process-local: the generated trigger index under `data/`, read by `scripts/retrieval/lookup-trigger-index.mjs`, plus the ripgrep recipes in [`../retrieval/retrieval-conventions.md`](../retrieval/retrieval-conventions.md). No variable in this document reaches it, and there is no socket, warm-start or dist-freshness contract to tune.

The one daemon an operator still meets is the skill advisor. Its CLI family (`SYSTEM_SKILL_ADVISOR_CLI_*`, `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT`) and its scorer overrides are documented in `runtime/ENV-REFERENCE.md`.

---

## 3. EMBEDDING PROVIDERS

This section is shared, not this package's. Its readers are `shared/embeddings/**` and the launcher libraries under `.opencode/bin`, and the skill advisor is the consumer that keeps them live. Provider selection is **local-first** and follows this precedence:
1. Explicit `EMBEDDINGS_PROVIDER` setting (tries the pinned provider first, then falls back to the cascade if unreachable)
2. `ollama` when a supported model is pulled and reachable
3. Falls back to `hf-local` (Hugging Face local inference)
4. `openai` — reached as a cloud cascade fallback when local providers are unavailable and `OPENAI_API_KEY` is usable
5. `voyage` — reached as a cloud cascade fallback when local providers are unavailable and `VOYAGE_API_KEY` is usable

Cloud providers (OpenAI/Voyage) can be selected by the cascade as a last resort from usable API keys, but detected keys do not outrank local providers. Set `EMBEDDINGS_PROVIDER` explicitly to force a cloud provider first.

### Provider Selection

| Variable | Default | Purpose |
|----------|---------|---------|
| `EMBEDDINGS_PROVIDER` | `auto` | Explicit provider: `voyage`, `openai`, `ollama`, `hf-local`, or `auto` |

### Voyage AI Provider

| Variable | Default | Purpose |
|----------|---------|---------|
| `VOYAGE_API_KEY` | - | API key for Voyage AI embeddings (required for `voyage` provider) |
| `VOYAGE_EMBEDDINGS_MODEL` | `voyage-code-3` | Voyage model name (1024 dimensions) |

### OpenAI Provider

| Variable | Default | Purpose |
|----------|---------|---------|
| `OPENAI_API_KEY` | - | API key for OpenAI embeddings (required for `openai` provider) |
| `OPENAI_EMBEDDINGS_MODEL` | `text-embedding-3-small` | OpenAI model name (1536 dimensions) |

### Hugging Face Local Provider

| Variable | Default | Purpose |
|----------|---------|---------|
| `HF_EMBEDDINGS_MODEL` | `nomic-ai/nomic-embed-text-v1.5` | hf-local model name (768 dimensions) |

### Rate Limiting

| Variable | Default | Purpose |
|----------|---------|---------|
| `EMBEDDING_BATCH_DELAY_MS` | `100` | Delay between batch embedding requests (ms) |

---

## 4. SCRIPTS

| Variable | Default | Purpose |
|----------|---------|---------|
| `DEBUG` | `false` | Enable debug logging across the script layer, including the continuity writer's folder detection and session extraction |
| `AUTO_SAVE_MODE` | `false` | Non-interactive save mode for hooks and automation; skips the interactive folder-alignment prompt only after the caller has already supplied or recovered a spec folder |
| `SPECKIT_QUIET` | `false` | Suppress non-essential output from `validate.sh` |
| `SPECKIT_TEMPLATES_BASE` | Bundled templates | Override the template root `create.sh` copies a new packet's documents from |
| `SPECKIT_POST_VALIDATE` | unset | Set to `1` for `create.sh` to run `validate.sh --quiet` after scaffolding |

---

## 5. USAGE EXAMPLES

```bash
# JSON mode (preferred for routine saves)
node scripts/dist/memory/generate-context.js --json '{"specFolder":"001-feature","sessionSummary":"..."}' specs/001-feature/

# Stdin mode with debug logging
DEBUG=1 echo '{"specFolder":"001-feature","sessionSummary":"..."}' | node scripts/dist/memory/generate-context.js --stdin

# Point the engine at a specs root outside the working directory
SPECKIT_SPECS_DIR=/path/to/specs bash scripts/spec/validate.sh specs/001-feature/ --strict

# Quiet mode for CI/CD
SPECKIT_QUIET=true bash scripts/spec/validate.sh specs/001-feature/

# Narrow a validation run to named rules; an unknown name fails the run
SPECKIT_RULES=GENERATED_METADATA_INTEGRITY bash scripts/spec/validate.sh specs/001-feature/ --strict

# Force local embeddings for the shared stack (no API key required)
EMBEDDINGS_PROVIDER=hf-local node .opencode/bin/skill-advisor.cjs advisor_status --format json

# Force a cloud provider ahead of the local-first cascade
EMBEDDINGS_PROVIDER=voyage VOYAGE_API_KEY=your-key-here \
  node .opencode/bin/skill-advisor.cjs advisor_status --format json
```

---

## 6. VALIDATION AND GENERATED METADATA

The live half of the package. `lib/validation/orchestrator.ts` runs the rule set, `lib/config/capability-flags.ts` gates generator behavior, and the `scripts/rules/*.sh` checks are invoked by `scripts/spec/validate.sh`. Boolean flags below use graduated semantics: they default ON and you disable them by setting `false`.

### Run selection

| Flag | Default | Purpose |
|------|---------|---------|
| `SPECKIT_RULES` | unset (all rules) | Narrows a run to a comma-separated subset of rule ids or aliases. An unrecognised name **throws** rather than matching nothing, so a narrowed run cannot report a clean pass for a packet nobody checked |
| `SPECKIT_VALIDATE_SCRIPT` | Bundled `scripts/spec/validate.sh` | Overrides the `validate.sh` path the strict-pass-freshness sweep invokes per folder |
| `SPECKIT_FRONTMATTER_ALLOWLIST` | Bundled allowlist JSON | Path to the spec-doc frontmatter grandfather allowlist. A path that does not exist makes the check return false rather than throwing |
| `SPECKIT_VERBOSE_RESOLVER` | unset | Exactly `1` appends the underlying cause's stack when the documentation-level contract resolver falls back |

### Advisory-to-enforce toggles

| Flag | Default | Purpose |
|------|---------|---------|
| `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE` | ON | A `description.json` / `graph-metadata.json` path mismatch against the folder's on-disk path fails `--strict` |
| `SPECKIT_STATUS_CROSS_DOC_ENFORCE` | ON | A classified-status disagreement between `spec.md` and `implementation-summary.md` fails `--strict` |
| `SPECKIT_CHILD_DRIFT_ENFORCE` | ON | A phase parent whose `graph-metadata.json.children_ids` misses an on-disk child fails `--strict`, and enforce mode fails closed when the child scanner is stale |
| `SPECKIT_AC_CLOSURE` | ON | Closure gate for Levels 2/3/3+: unmet acceptance criteria block a completion claim, and a waiver must cite an ADR that exists in `decision-record.md` |
| `SPECKIT_AC_CLOSURE_CUTOFF` | `2026-08-30` | Forward-only rollout boundary; packets created on or before it stay advisory |
| `SPECKIT_AC_COVERAGE` | ON | Advisory, non-blocking acceptance-criteria coverage scan |
| `SPECKIT_AC_COVERAGE_FLOOR` | `0.9` | Minimum covered-criteria ratio for that advisory scan |

### Completion freshness (opt-in)

| Flag | Default | Purpose |
|------|---------|---------|
| `SPECKIT_COMPLETION_FRESHNESS` | OFF | Enables the strict-only rule that recomputes the packet content fingerprint and compares it with stored continuity metadata |
| `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` | OFF | Promotes an enabled freshness rule's stale findings from warning to error |

### Generator hardening

| Flag | Default | Purpose |
|------|---------|---------|
| `SPECKIT_IDENTITY_MERGE_SAFETY` | ON | Shared spec-folder identity resolver and lineage-merge guard, so a scoped re-derive cannot erase lineage |
| `SPECKIT_GENERATOR_HARDENING` | ON | Persists the graph-metadata `source_fingerprint`, routes phase classification through one enumeration, and keeps telemetry out of the generated JSON |
| `SPECKIT_GENERATED_METADATA_DRIFT_GATE` | ON | Routes `description` and `causal_summary` through one synopsis extractor and fails strict validation on drift |
| `SPECKIT_GENERATED_METADATA_GRANDFATHER` | OFF | Restores non-blocking report mode for `GENERATED_METADATA_INTEGRITY` on a tree that has not been restamped |
| `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE` | OFF | Cross-checks a stored `derived.status: complete` against `completion_pct` and open tasks; report-only until set |
| `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES` | ON | Content-gates `description.json` and global-cache writes so a stamp-only delta is skipped |
| `SPECKIT_GENERATED_METADATA_Z_EXCLUSION` | ON | Excludes `z_*` staging and archive folders from the spec-folder discovery scanner |
| `SPECKIT_FOLDER_DISCOVERY_TOKEN_THRESHOLD` | `0.45` | Per-token similarity threshold for folder-discovery name matching |
| `SPECKIT_ROLLOUT_PERCENT` | `100` | Global rollout percentage (0-100) read by `getRolloutPercent()` |

### Gate-3 policy

The runtime-neutral spec-gate envs (`SYSTEM_SPEC_GATE_ENFORCE`, `SYSTEM_SPEC_GATE_DISABLED`, `SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION`, `AI_SESSION_CHILD`) are read by `runtime/hooks/lib/spec-gate/spec-gate-core.mjs`. Defaults, retention and sweep tuning: [`../../runtime/hooks/lib/spec-gate/README.md`](../../runtime/hooks/lib/spec-gate/README.md).

### Production recommendations

- Leave every graduated-ON flag at its default. Reach for a `false` only when you are deliberately isolating one rule.
- `SPECKIT_VERBOSE_RESOLVER=1` and `SPECKIT_RULES` are the two diagnostics worth reaching for first when a validation run behaves unexpectedly.

---

## 7. RELATED RESOURCES

- [Execution Methods](../workflows/execution-methods.md)
- [Troubleshooting](../debugging/troubleshooting.md)
- [Quick Reference](../workflows/quick-reference.md)
- [Retrieval and Continuity Reference](../memory/memory-system.md)
- [SPECKIT Environment Variable Reference](../../runtime/ENV-REFERENCE.md)

---

## 8. CLEAN TRANSPORT (HOOK STDOUT)

The runtime hook adapters under `runtime/hooks/` write to a host that parses their stdout. Keep stdout reserved for the hook's declared output contract and send diagnostics, warnings and startup logs to stderr, so a host such as OpenCode or Claude does not read extra stdout as a malformed payload.

---
