---
title: "Config: System Spec Kit Runtime Settings"
description: "Current configuration files for the continuity writer, spec workflow support and content filtering behavior."
trigger_phrases:
  - "system spec kit config"
  - "continuity writer configuration"
  - "content filter settings"
---

# Config: System Spec Kit Runtime Settings

> Runtime settings for the continuity writer, spec workflow support and content filtering.

---

## 1. OVERVIEW

`config/` owns JSONC settings read by the spec-kit script layer. These files are operator-editable configuration, not source modules.

Current state:

- `config.jsonc` defines the workflow and continuity-writer settings that `scripts/core/config.ts` merges into `SpecKitConfig`: preview and truncation caps, conversation windowing, timezone offset, observation and file limits, and the quality abort threshold.
- `filters.jsonc` defines the noise, dedupe and quality pipeline that `scripts/lib/content-filter.ts` applies to captured session content.
- Config files are loaded by runtime code on process startup or script execution.
- Keys that no loader reads are inert. The loader takes only the fields declared in `WorkflowConfig`, so an unrecognized block changes nothing.

---

## 2. OWNERSHIP

This directory belongs to the `system-spec-kit` skill. Changes should stay compatible with the loaders under `scripts/core/` and `scripts/lib/`.

---

## 3. TREE AND KEY FILES

```text
config/
+-- README.md       # Directory orientation
+-- config.jsonc    # Workflow, continuity-writer and template settings
`-- filters.jsonc   # Content filter pipeline settings
```

| File | Role |
|---|---|
| `config.jsonc` | Shared runtime settings for the continuity writer and spec workflow support |
| `filters.jsonc` | Thresholds and scoring weights for content filtering |

---

## 4. BOUNDARIES

- Keep files valid JSONC.
- Do not add code, generated state or packet notes here.
- Add new settings only when a loader or script reads them.
- Keep defaults in code aligned with documented keys.

---

## 5. VALIDATION

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/config/README.md
```

Run the consumer script or test that reads any changed setting before claiming behavior changes.

---

## 6. RELATED

- [`../runtime/cli/core/config.ts`](../runtime/cli/core/config.ts) - Main config loader.
- [`../runtime/cli/lib/content-filter.ts`](../runtime/cli/lib/content-filter.ts) - Filter config consumer.
- [`../references/memory/memory-system.md`](../references/memory/memory-system.md) - Retrieval and continuity behavior reference.
