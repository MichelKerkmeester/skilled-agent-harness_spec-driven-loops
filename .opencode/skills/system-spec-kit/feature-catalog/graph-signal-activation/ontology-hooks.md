---
title: Ontology-Guided Extraction Hooks
description: "Catalog reference for Ontology-Guided Extraction Hooks."
trigger_phrases:
  - "ontology-guided extraction hooks"
  - "SPECKIT_ONTOLOGY_HOOKS"
  - "OntologySchema entity relation extraction"
  - "validateExtraction domain ontology"
  - "schema-guided entity extraction"
flag: SPECKIT_ONTOLOGY_HOOKS
status: graduated
default: 'true'
category: graph_signal_activation
version: 3.6.0.8
---

# Ontology-Guided Extraction Hooks

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Enable schema-guided entity and relation extraction by providing a domain ontology that validates extracted entity types and relation pairs against allowed patterns.

## 2. HOW IT WORKS

- File: `mcp-server/lib/extraction/ontology-hooks.ts` (5.8KB)
- `OntologySchema` defines allowed `entityTypes`, `relationTypes`, and optional `extractionRules`
- `loadOntologySchema()` loads schema from an explicit JSON file path or `SPECKIT_ONTOLOGY_SCHEMA`, then normalizes to lowercase
- `validateExtraction()` checks entity and relation pairs case-insensitively and enforces optional rule pairs when present
- No LLM calls - pure schema validation with default-schema fallback

## 3. SOURCE FILES

No source files are listed yet.

## 4. SOURCE METADATA
- Group: Graph Signal Activation
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `graph-signal-activation/ontology-hooks.md`

### Feature Flag

- Name: `SPECKIT_ONTOLOGY_HOOKS`
- Default: ON (graduated)
- Set `SPECKIT_ONTOLOGY_HOOKS=false` to disable

### Related

- `17-temporal-edges.md` - temporal validity management
- `18-contradiction-detection.md` - edge conflict detection
Related references:
- [contradiction-detection.md](../../feature-catalog/graph-signal-activation/contradiction-detection.md) — Contradiction detection
