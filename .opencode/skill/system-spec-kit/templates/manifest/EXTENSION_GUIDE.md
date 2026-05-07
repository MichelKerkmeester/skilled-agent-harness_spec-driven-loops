---
title: SpecKit Manifest Extension Maintainer Guide
description: Maintainer guide for adding new manifest-backed document types to the SpecKit template system.
trigger_phrases:
  - manifest extension
  - spec-kit-docs.json
  - document type addition
  - template version workflow
importance_tier: normal
contextType: reference
---

# SpecKit Template Extension Guide
<!-- Lives at templates/manifest/ (not references/) because it co-locates with the manifest assets it documents. -->

Private maintainer guide for adding a new manifest-backed document type.

Use this guide when extending the manifest taxonomy, template version map, or level contract anchors while keeping docs and manifest entries aligned.

---

## 1. ADD A DOCUMENT TYPE

1. Add the template file under `templates/manifest/` using the `*.md.tmpl` suffix.
2. Add an entry in `spec-kit-docs.json.documents` with:
   - `template`: the template filename.
   - `owner`: `author`, `command`, `agent`, or `workflow`.
   - `creationTrigger`: the workflow that creates it.
   - `absenceBehavior`: `hard-error`, `warn`, or `silent-skip`.
3. Add the template filename to `spec-kit-docs.json.versions`.
4. Add the document name to the appropriate level row:
   - `requiredCoreDocs` for files every packet at that level must have.
   - `requiredAddonDocs` for level add-ons such as `checklist.md`.
   - `lazyAddonDocs` for command-owned or explicit-option files.
5. Add per-document anchors under `levels.<level>.sectionGates.<doc-name>`.
6. Run the Level contract and golden snapshot tests.

---

## 2. VERSION WORKFLOW

Template versions live in `spec-kit-docs.json.versions[<template basename>]`.
Writers should emit `SPECKIT_TEMPLATE_SOURCE` markers with the current manifest version.
Readers must accept legacy marker formats indefinitely, including v2.1 inline markers.

Version bump policy:

- Patch-level content edits that do not change anchors may keep the same marker version.
- Header, anchor, required document, or frontmatter contract changes require a version bump.
- New document types start at the current manifest version.

---

## 3. MANIFEST SCHEMA REFERENCE

`documents` describes the private document taxonomy.
`levels` describes which documents are active for each level.
`levels.<level>.sectionGates` is a per-document anchor profile. Keep legacy flat keys only when compatibility requires it; new anchors belong under the document basename.
`versions` is the source of truth for template version checks.

---

## 4. VALIDATION CHECKLIST

- `resolveLevelContract(level).templateVersions` exposes the new template version.
- `serializeLevelContract()` preserves `sectionGatesByDocument`.
- `scaffold-golden-snapshots.vitest.ts` snapshots the rendered output.
- `validate.sh --strict` passes on fresh scaffolds for every level touched.
