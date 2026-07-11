---
title: "3. MCP Configuration"
description: "This document captures the implemented behavior, source references, and validation scope for 3. MCP Configuration."
trigger_phrases:
  - "mcp configuration"
  - "save-time validation limits"
  - "mcp token budget"
  - "duplicate threshold preflight"
version: 3.6.0.16
---

# 3. MCP Configuration

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for 3. MCP Configuration.

These are guardrail settings for save-time validation. They define size limits, token estimates, duplicate thresholds, and anchor strictness so problematic files can be caught before indexing.

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
- Feature file path: `feature-flag-reference/3-mcp-configuration.md`
Related references:
- [2-session-and-cache.md](2-session-and-cache.md) — 2. Session and Cache
- [4-memory-and-storage.md](4-memory-and-storage.md) — 4. Memory and Storage
