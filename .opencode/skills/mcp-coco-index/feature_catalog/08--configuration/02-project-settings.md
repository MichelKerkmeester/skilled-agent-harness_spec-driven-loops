---
title: "02. Project settings"
description: "Controls include patterns, exclude patterns and language overrides per project."
---

# 02. Project settings

Controls include patterns, exclude patterns and language overrides per project. Project settings define which files enter the index and how custom extensions map to languages.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Project settings define which files enter the index and how custom extensions map to languages.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`ccc init` writes project settings under `.cocoindex_code/settings.yml`. Missing project settings are an initialization error for normal CLI commands, while empty files load as defaults. The current default include set is code-oriented; markdown/text documentation formats were removed from defaults, and repo-local spec/changelog directories are excluded by checked-in project settings.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py:86` | Settings | Defines project settings. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py:259` | Settings | Serializes include, exclude and override fields. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py:311` | Settings | Loads project settings from YAML. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skills/mcp-coco-index/tests/test_settings.py:53` | Unit | Covers default project settings. |
| `.opencode/skills/mcp-coco-index/tests/test_settings.py:78` | Unit | Covers project settings save and load. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Configuration
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `08--configuration/02-project-settings.md`

<!-- /ANCHOR:source-metadata -->
