---
title: SpecKit Manifest Migration Maintainer Guide
description: Maintainer guide for legacy template marker support and manifest migration compatibility policy.
trigger_phrases:
  - manifest migration
  - legacy marker support
  - spec-kit-docs.json
  - template compatibility policy
importance_tier: normal
contextType: reference
---

# SpecKit Template Migration Guide
<!-- Lives at templates/manifest/ (not references/) because it co-locates with the manifest assets it documents. -->

Private maintainer notes for template marker and frontmatter compatibility.

Use this guide when maintaining manifest compatibility with legacy packets, marker formats, and current-version write policy.

---

## 1. LEGACY MARKER SUPPORT

Legacy markers such as `<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.1 -->` remain supported indefinitely.
Readers should parse the template basename and version when present, but they must not reject historical packets only because the marker predates v2.2.

Writers always emit the current manifest-backed marker version from `spec-kit-docs.json.versions`.

---

## 2. BROAD DOCUMENT LIST DERIVATION

When a legacy packet does not have manifest-aware metadata, derive its document list from files on disk:

- Always include existing core docs: `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md`.
- Include add-on docs when present: `checklist.md`, `decision-record.md`, `resource-map.md`, and `context-index.md`.
- Include command-owned docs only when present: `handover.md`, `debug-delegation.md`, and `research/research.md`.
- For phase parents, prefer the lean trio: `spec.md`, `description.json`, and `graph-metadata.json`.

The derived list is read-only compatibility data. Do not rewrite old packets only to normalize marker style.

---

## 3. SUNSET POLICY

There is no planned sunset date for v2.1 marker parsing.
The migration policy is indefinite read support plus current-version writes.

---

## 4. EXTENSION PROCESS LINK

For new document types, follow `EXTENSION-GUIDE.md` and add both the manifest document entry and a per-document `sectionGates` profile.
