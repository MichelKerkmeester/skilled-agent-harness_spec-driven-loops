---
title: "Utils"
description: "Utility functions for output formatting, path security, canonical path deduplication, and structured logging."
trigger_phrases:
  - "utility functions"
  - "format helpers"
  - "path security"
  - "canonical path"
  - "logger"
---

# Utils

> Utility functions for output formatting, path security, canonical path deduplication, and structured logging.

---

## 1. OVERVIEW

The utils module provides foundational utilities used throughout the MCP server. These include date formatting and path traversal security (re-exported from `@spec-kit/shared`).

Those utilities support the Gate E continuity model where `/spec_kit:resume` restores packet context from `handover.md` -> `_memory.continuity` -> spec docs. Generated memory artifacts remain supporting only.

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Security** | Path traversal protection (CWE-22 mitigation) via `@spec-kit/shared` |
| **Consistency** | Shared formatting across the codebase |

### Module Statistics

| Metric | Value |
|--------|-------|
| Utility modules | 4 |
| Source | `format-helpers.ts`, `canonical-path.ts` and `logger.ts` are local. `path-security.ts` re-exports from `@spec-kit/shared` |

## 2. STRUCTURE

```
utils/
 canonical-path.ts   # Canonical path identity for deduplication
 format-helpers.ts   # Output formatting utilities
 logger.ts           # Structured logging utilities
 path-security.ts    # Re-exports from @spec-kit/shared/utils/path-security
 README.md           # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `canonical-path.ts` | Canonical path identity for symlink-aware deduplication (`getCanonicalPathKey`) |
| `format-helpers.ts` | Human-readable date formatting (`formatAgeString`) |
| `logger.ts` | Structured logging utilities for MCP server operations |
| `path-security.ts` | Re-exports path validation and regex escaping from `@spec-kit/shared/utils/path-security` |
| `index-scope.ts` | Shared path-policy module (Packet 026/010/002). Exports `shouldIndexForMemory`, `shouldIndexForCodeGraph`, `resolveCanonicalPath`, `GOVERNANCE_AUDIT_ACTIONS`, `recordTierDowngradeAudit`, `buildGovernanceLogicalKey`. Single source of truth for `z_future/` + `/external/` exclusions and constitutional-tier normalization |

## 3. FEATURES

### Format Helpers (`format-helpers.ts`)

| Function | Signature | Purpose |
|----------|-----------|---------|
| `formatAgeString` | `(dateString: string \| null) => string` | Convert date to human-readable age ("2 days ago", "yesterday", "never") |

### Canonical Path (`canonical-path.ts`)

| Function | Purpose |
|----------|---------|
| `getCanonicalPathKey` | Resolve a file path to its canonical identity (via `realpathSync`), collapsing symlink aliases for deduplication |

### Index Scope (`index-scope.ts`)

Shared path-policy module (Packet 026/010/002) used as the single source of truth for memory indexing and code-graph scanning exclusions. Enforces permanent exclusion of `z_future/` and `/external/` subtrees across memory discovery, spec-doc classification, parser admissibility, and code-graph recursive scans. Exported helpers are consumed by `memory-index-discovery.ts`, `spec-doc-paths.ts`, `memory-parser.ts`, `memory-save.ts`, `vector-index-mutations.ts`, `post-insert-metadata.ts`, `checkpoints.ts`, `code_graph/lib/indexer-types.ts`, and `code_graph/lib/structural-indexer.ts`.

| Function | Purpose |
|----------|---------|
| `shouldIndexForMemory` | Predicate: is a given path admissible for the spec-doc record index under current policy? Rejects `z_future/` and `/external/` paths; callers use this at both discovery and save time for defense-in-depth |
| `shouldIndexForCodeGraph` | Predicate: is a given path admissible for code-graph scanning? Shares exclusion rules with `shouldIndexForMemory` but may accept packet-specific overlays where additive |
| `resolveCanonicalPath` | Resolve a path via `realpathSync` before policy evaluation so symlinked / aliased escape attempts cannot bypass exclusion checks |
| `GOVERNANCE_AUDIT_ACTIONS` | Stable string constants for governance-audit `action` values: `tier_downgrade_non_constitutional_path` (save-time normalization) and `tier_downgrade_non_constitutional_path_cleanup` (CLI cleanup). Part of the operator-facing contract — do not rename |
| `recordTierDowngradeAudit` | Shared helper that emits a durable `governance_audit` row when a non-constitutional-path memory is normalized away from `constitutional`; used by save / update / post-insert / checkpoint-restore paths and by the cleanup CLI |
| `buildGovernanceLogicalKey` | Build the stable logical key used to correlate governance-audit rows across processes |

Excluded-from-index rule: the constitutional `README.md` at `.opencode/skills/system-spec-kit/constitutional/README.md` is intentionally **not** indexed — it is an overview doc, not a rule surface (ADR-005 superseded ADR-004). Only real constitutional rule files in that directory carry the `constitutional` tier.

Operator maintenance CLI for pre-existing pollution: `scripts/dist/memory/cleanup-index-scope-violations.js` with `--apply` / `--verify`. Target verify counts: `constitutional_total=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0`.

#### Index scope vs scoring decay (SSOT)

Two distinct mechanisms govern how content surfaces in retrieval. Reasoning about them as one mechanism is the bug that packet 113 fixed.

| Mechanism | Defined in | Behavior |
|-----------|------------|----------|
| Scope exclusion | `index-scope.ts:EXCLUDED_FOR_MEMORY` | Binary: a path is either admissible for indexing or absent from the index entirely. Cannot be retrieved at any score. |
| Scoring decay | `shared/scoring/folder-scoring.ts:ARCHIVE_MULTIPLIERS` | Multiplicative penalty on indexed content. Path stays in the index but its score is multiplied by 0.05-0.2 before ranking. |

Path placement is intentional and not interchangeable:

| Path | Mechanism | Reason |
|------|-----------|--------|
| `z_future/` | scope-excluded | Speculative content with no decay multiplier defined; indexing at 1.0 would surface unproven ideas as authoritative |
| `external/` | scope-excluded | Vendor / third-party content outside this repo's authority; indexing pollutes the spec-doc surface |
| `z_archive/` | decay-only (0.1) | Shipped-but-archived spec content. Retrievable for pattern lookup, historical context, and continuity recovery — but deprioritized 10× so it doesn't drown current packets |
| `scratch/`, `temp/`, `research/iterations/`, `review/iterations/`, `prototype/`, `*-test*/` | decay-only (0.2) | Working artifacts, iter outputs, prototypes. Indexed for discovery but penalized 5× |

Packet 113 (commit `b062b12b4`) removed a redundant `z_archive` entry from `EXCLUDED_FOR_MEMORY` that was overriding the decay design. The SSOT rule going forward: if a path category has a multiplier in `ARCHIVE_MULTIPLIERS`, it stays out of `EXCLUDED_FOR_MEMORY`. Adding both makes the decay unreachable and removes archived content from retrieval entirely.

### Path Security (`path-security.ts`)

Re-exports from `@spec-kit/shared/utils/path-security`:

| Function | Purpose |
|----------|---------|
| `validateFilePath` | Validate path is within allowed directories |
| `escapeRegex` | Escape special regex characters |

### Logger (`logger.ts`)

| Function | Purpose |
|----------|---------|
| Structured logging | Consistent log output for MCP server operations |

## 4. USAGE EXAMPLES

### Format Helpers

```typescript
import { formatAgeString } from './format-helpers';

formatAgeString('2024-01-15T10:00:00Z'); // "2 weeks ago"
formatAgeString(null);                    // "never"
```

### Path Security

```typescript
import { validateFilePath, escapeRegex } from './path-security';

const allowed = ['/home/user/project', '/tmp'];
const userPath = '../../../<blocked-path>';

const safe = validateFilePath(userPath, allowed);
// Returns null - path traversal blocked

const escaped = escapeRegex('file.name (1)');
// Returns: "file\\.name \\(1\\)"
```

## 5. RELATED RESOURCES

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../README.md](../README.md) | Parent lib directory overview |
| [../providers/](../providers/) | Uses path security for file loading |
| [../parsing/](../parsing/) | Uses `escapeRegex` for trigger matching |

### Security References

| Topic | Reference |
|-------|-----------|
| Path Traversal | CWE-22: Improper Limitation of Pathname |

---

**Version**: 1.7.2
**Last Updated**: 2026-02-16
