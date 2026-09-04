---
title: "Graph Metadata"
description: "Parser, schema, drift gate and access-telemetry store for the graph-metadata.json a spec folder carries."
trigger_phrases:
  - "graph metadata"
  - "graph-metadata.json"
  - "generated metadata drift"
  - "access telemetry"
  - "source doc hashes"
---

# Graph Metadata

> Everything that reads, validates, or proves the freshness of a spec folder's `graph-metadata.json`.

---

## 1. OVERVIEW

`lib/graph/` owns one generated artifact: the `graph-metadata.json` a spec folder carries beside its documents. Four modules cover its full life — a schema that says what the file may contain, a parser that derives runtime fields from it, a drift gate that proves the file still matches the documents it summarizes, and a telemetry store that keeps read-time signals out of the file entirely.

The separation is the point. A generated file that changes on every read cannot be checked against its sources, because its fingerprint moves for reasons that have nothing to do with content. So the parser derives, the drift gate reads and reports without ever writing, and access events land in a sidecar store.

### What It Does

- **Schema** declares the closed sets: valid `derived.status` values, save-lineage values, and the caps on trigger phrases, key topics, key files and entities. One declaration, so the schema, the status normalizer, the integrity rule and the parser cannot disagree about what a valid status is.
- **Parser** reads a packet's `graph-metadata.json` and derives normalized runtime fields: lowercase checklist-aware status, sanitized key files, deduplicated entities, and capped trigger phrases.
- **Drift gate** re-derives a folder's two synopsis fields and compares them against what is stored, so a file that fell out of sync with its documents is provable rather than silently stale. `source_doc_hashes` is the freshness key that lets a strict run skip the re-derive when no source document moved.
- **Access telemetry** records `last_accessed_at` and the phase-parent `last_active_child_id` / `last_active_at` pointers in an index-layer store. A read or a resume updates the signal without rewriting the generated file.

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| Telemetry outside the generated file | A read event that rewrites `graph-metadata.json` would dirty the file it was only supposed to observe, and break every fingerprint check downstream. |
| Drift gate never writes | A gate that repairs what it measures cannot report honestly on the next run. |
| Severity resolved by the caller | The same check backs both the grandfather report rollout and the enforced run; only the caller knows which it is. |
| Best-effort telemetry writes | An unwritable store leaves the generated file byte-identical rather than failing a read. |
| Closed status set in one place | Prose statuses ("shipped — see summary") are rejected at the boundary instead of being admitted as any non-empty string. |

---

## 2. STRUCTURE

```
graph/
  access-telemetry.ts          # Index-layer store for access and freshness signals
  generated-metadata-drift.ts  # Synopsis drift gate and source_doc_hashes freshness key
  graph-metadata-parser.ts     # Parse graph-metadata.json into normalized runtime fields
  graph-metadata-schema.ts     # Zod schema, status set, and field caps
  README.md                    # This file
```

### Key Files

| File | Purpose | Flag |
|------|---------|------|
| `graph-metadata-schema.ts` | Declares `GRAPH_METADATA_SCHEMA_VERSION`, the `derived.status` set, the save-lineage set, and the trigger-phrase (12), key-topic (12), key-file (20) and entity (24) caps | Always on |
| `graph-metadata-parser.ts` | Reads `graph-metadata.json` and derives normalized runtime fields | Always on |
| `generated-metadata-drift.ts` | Re-derives the synopsis fields, reports drift, computes `source_doc_hashes` | `SPECKIT_GENERATED_METADATA_DRIFT_GATE` |
| `access-telemetry.ts` | Records and reads access and freshness signals outside the generated file | `SPECKIT_GENERATOR_HARDENING` |

### Graph Metadata Derivation Highlights

- `status` is stored in lowercase. When explicit frontmatter status is missing, the parser falls back to `implementation-summary.md` presence and then checklist completion (`complete` vs `in_progress`).
- `key_files` are sanitized before dedupe and truncation so shell commands, version literals, title-shaped values, and other non-path noise do not occupy the 20-slot cap.
- `entities` are deduplicated by entity name with canonical packet-doc paths preferred over basename-only candidates when both exist.
- `trigger_phrases` are deduplicated and capped at 12 derived values.

### Exported Functions

| Function | File | Description |
|----------|------|-------------|
| `computeSourceDocHashes` | generated-metadata-drift.ts | Hashes the packet docs a synopsis can read, producing the freshness key |
| `checkGeneratedMetadataDrift` | generated-metadata-drift.ts | Re-derives and compares the stored synopsis fields; reads only |
| `resolveGeneratedMetadataDrift` | generated-metadata-drift.ts | Turns a drift report into a caller-chosen severity |
| `resolveTelemetryStorePath` | access-telemetry.ts | Resolves the store file, overridable so tests point at a temp path |
| `recordAccessEvent` | access-telemetry.ts | Records `last_accessed_at` for a spec folder; best-effort |
| `recordFreshnessPointer` | access-telemetry.ts | Records the phase-parent `last_active_child_id` / `last_active_at` pair |
| `readAccessRecord` | access-telemetry.ts | Returns the stored record for one folder |
| `resolveLastActiveChildFromStore` | access-telemetry.ts | Resolves the resume pointer a phase parent redirects through |

---

## 3. KEY CONCEPTS

### Freshness key

`source_doc_hashes` records a hash per readable packet document. A strict run compares the stored hashes against the current ones and re-derives only when one moved. The key is deliberately conservative: a hash change that turns out not to change the synopsis costs one re-derive, whereas a missed change would certify a stale file.

### Where each signal lives

| Signal | Home | Why |
|--------|------|-----|
| `description`, `causal_summary` | `graph-metadata.json` | Derived from the documents; drift against them is the thing being gated |
| `source_doc_hashes` | `graph-metadata.json` | The freshness key must travel with the file it attests |
| `last_accessed_at` | Access telemetry store | Changes on read; would otherwise dirty the generated file |
| `last_active_child_id`, `last_active_at` | Access telemetry store | Change on resume, for the same reason |

---

## 4. RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../description/README.md](../description/README.md) | The synopsis extractor the drift gate re-derives through |
| [../validation/README.md](../validation/README.md) | The `GENERATED_METADATA_INTEGRITY` and drift rules that consume these reports |
| [../storage/README.md](../storage/README.md) | Atomic write helpers used when a generated file is rewritten |

### Parent Module

| Resource | Description |
|----------|-------------|
| [../README.md](../README.md) | Library module overview |
| [../../../SKILL.md](../../../SKILL.md) | System Spec Kit skill documentation |

---

**Version**: 2.0.0
**Last Updated**: 2026-04-01
