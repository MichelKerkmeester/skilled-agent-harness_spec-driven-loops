---
title: "MCP Server Formatters"
description: "Response formatting for search results, anchor filtering metrics, and safe content shaping."
trigger_phrases:
  - "formatters"
  - "search results"
  - "token metrics"
importance_tier: "normal"
---


# MCP Server Formatters

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📌 IMPLEMENTED STATE](#2--implemented-state)
- [3. 📝 HARDENING NOTES](#3--hardening-notes)
- [4. 📚 RELATED](#4--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. 📖 OVERVIEW

This section provides an overview of the MCP Server Formatters directory.

`formatters/` converts internal search results into MCP-ready payloads.

- `search-results.ts`: formats results, optional content embedding, anchor extraction, and path checks.
- `token-metrics.ts`: token estimation and savings metrics.
- `index.ts`: barrel exports.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. 📌 IMPLEMENTED STATE


- Anchor filtering works only when `includeContent: true` and `anchors` are provided.
- Result payloads include content-level token metrics when anchor filtering is active.
- Path validation uses canonical allowed paths from `core/config.ts`.
- Constitutional result counts are surfaced in formatted output where applicable.


<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:hardening-notes -->
## 3. 📝 HARDENING NOTES


- File path checks are defense-in-depth for content embedding.
- JSON parsing helpers are safe-fallback based and do not throw on malformed optional payload fields.
- Formatter logic is compatible with Spec 126 document-type indexing output (spec docs, readmes, memories).


<!-- /ANCHOR:hardening-notes -->
<!-- ANCHOR:related -->
## 4. 📚 RELATED


- `../handlers/README.md`
- `../core/README.md`
- `../utils/README.md`
<!-- /ANCHOR:related -->
