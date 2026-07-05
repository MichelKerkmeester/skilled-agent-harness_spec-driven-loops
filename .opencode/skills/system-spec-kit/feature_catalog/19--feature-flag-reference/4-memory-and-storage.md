---
title: "4. Memory and Storage"
description: "This document captures the implemented behavior, source references, and validation scope for 4. Memory and Storage."
trigger_phrases:
  - "memory and storage"
  - "memory database path"
  - "SPEC_KIT_DB_DIR"
  - "index scan batch settings"
version: 3.6.0.16
---

# 4. Memory and Storage

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for 4. Memory and Storage.

These variables define where memory files and databases live and how indexing batches are processed. In practice, they control storage location, path safety boundaries, and scan throughput.

---

## 2. HOW IT WORKS

> This category no longer enumerates flags — the authoritative, always-current list lives in
> [`ENV_REFERENCE.md` → Feature Flags Reference Table](../../mcp_server/ENV_REFERENCE.md#feature-flags-reference-table).
> Duplicating it here caused drift (survivor flags went missing); the catalog now points to the single source.

---

## 3. SOURCE FILES

Source file references are listed in the ENV_REFERENCE.md flag table linked above.

---

## 4. SOURCE METADATA
- Group: Feature Flag Reference
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `19--feature-flag-reference/4-memory-and-storage.md`
Related references:
- [3-mcp-configuration.md](3-mcp-configuration.md) — 3. MCP Configuration
- [5-embedding-and-api.md](5-embedding-and-api.md) — 5. Embedding and API
