---
title: "5. Embedding and API"
description: "This document captures the implemented behavior, source references, and validation scope for 5. Embedding and API."
trigger_phrases:
  - "embedding and api"
  - "EMBEDDINGS_PROVIDER"
  - "embedding provider selection"
  - "voyage openai embedding keys"
version: 3.6.0.27
---

# 5. Embedding and API

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for 5. Embedding and API.

These settings pick which embedding and reranking providers the system uses and which credentials unlock them. They let you switch between cloud and local options without changing application logic.

---

## 2. HOW IT WORKS

> This category no longer enumerates flags — the authoritative, always-current list lives in
> [`ENV_REFERENCE.md` → Feature Flags Reference Table](../../mcp_server/ENV_REFERENCE.md#feature-flags-reference-table).
> Duplicating it here caused drift (survivor flags went missing); the catalog now points to the single source.

---

## 3. SOURCE FILES

Source file references are included in the flag tables above.

---

## 4. SOURCE METADATA
- Group: Feature Flag Reference
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `19--feature-flag-reference/5-embedding-and-api.md`
Related references:
- [4-memory-and-storage.md](4-memory-and-storage.md) — 4. Memory and Storage
- [6-debug-and-telemetry.md](6-debug-and-telemetry.md) — 6. Debug and Telemetry
