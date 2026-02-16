---
title: "Core Templates"
description: "Shared base templates used by all documentation levels."
trigger_phrases:
  - "core templates"
  - "base structure"
  - "composition source"
importance_tier: "normal"
---

# Core Templates

Shared base components for level template composition.

## Overview
<!-- ANCHOR:overview -->

Core templates define the common structure reused across levels.
They are source artifacts, not direct user-facing copies.

<!-- /ANCHOR:overview -->

## Contents
<!-- ANCHOR:contents -->

| File | Purpose |
|---|---|
| `spec-core.md` | base specification layout |
| `plan-core.md` | base implementation plan layout |
| `tasks-core.md` | base task tracking layout |
| `impl-summary-core.md` | base implementation summary layout |

<!-- /ANCHOR:contents -->

## Architecture
<!-- ANCHOR:architecture -->

Core plus addendum composition:

```text
level_1 = core
level_2 = core + level2-verify
level_3 = level_2 + level3-arch
level_3+ = level_3 + level3plus-govern
```

<!-- /ANCHOR:architecture -->

## Usage Rules
<!-- ANCHOR:usage-rules -->

- Do not copy from `core/` into spec folders.
- Copy from `../level_N/` directories.
- Keep core files stable and move level-specific content into addendums.

<!-- /ANCHOR:usage-rules -->

## Related
<!-- ANCHOR:related -->

- `../README.md`
- `../addendum/README.md`
- `../../references/templates/template_guide.md`

<!-- /ANCHOR:related -->
