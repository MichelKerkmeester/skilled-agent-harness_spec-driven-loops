---
title: "Corpus Library: Advisor Text Weighting"
description: "DF-IDF helper for corpus-style prompt and skill text scoring in the skill-advisor library."
trigger_phrases:
  - "advisor corpus"
  - "df idf advisor"
  - "skill advisor text scoring"
---

# Corpus Library: Advisor Text Weighting

<!-- sk-doc-template: skill_readme -->

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES AND FLOW](#4--boundaries-and-flow)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

---

<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

`lib/corpus/` contains text weighting logic used by advisor scoring paths. The folder currently owns a DF-IDF helper for corpus-style matching between prompts, skill metadata and routing evidence.

Current state:

- Provides a focused DF-IDF implementation.
- Keeps corpus weighting separate from lane scoring and rendering.
- Supports scorer modules that need lexical weighting signals.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-directory-tree -->
## 2. DIRECTORY TREE

```text
corpus/
+-- df-idf.ts   # DF-IDF text weighting helper
`-- README.md
```

---

<!-- /ANCHOR:2-directory-tree -->

<!-- ANCHOR:3-key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `df-idf.ts` | Computes corpus-style term weights for advisor scoring inputs. |

---

<!-- /ANCHOR:3-key-files -->

<!-- ANCHOR:4-boundaries-and-flow -->
## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Keep dependencies limited to scoring input processing. |
| Exports | Export text weighting helpers only. |
| Ownership | Put corpus weighting here. Put final advisor scoring in `../scorer/`. |

Main flow:

```text
prompt and corpus text
  -> DF-IDF weighting
  -> weighted lexical evidence
  -> scorer combines with other advisor signals
```

---

<!-- /ANCHOR:4-boundaries-and-flow -->

<!-- ANCHOR:5-entrypoints -->
## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `df-idf.ts` | TypeScript module | Corpus text weighting helper. |

---

<!-- /ANCHOR:5-entrypoints -->

<!-- ANCHOR:6-validation -->
## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp_server/lib/corpus/README.md
```

Expected result: exit code `0`.

---

<!-- /ANCHOR:6-validation -->

<!-- ANCHOR:7-related -->
## 7. RELATED

- [`../README.md`](../README.md)
- [`../scorer/README.md`](../scorer/README.md)

<!-- /ANCHOR:7-related -->
