---
title: "Config: Spec Document Paths and Capability Flags"
description: "Canonical spec-document and graph-metadata path classification, spec-folder identity resolution, and the runtime's capability-flag vocabulary."
trigger_phrases:
  - "spec document paths"
  - "capability flags"
  - "spec folder identity"
---

# Config: Spec Document Paths and Capability Flags

---

## 1. OVERVIEW

`lib/config/` owns two things: the canonical spec-document and graph-metadata path classification (including spec-folder identity resolution), and the runtime's capability-flag vocabulary. Domain modules read these instead of re-deriving path rules or re-parsing an environment variable's tristate.

Current state:

- `spec-doc-paths.ts` names the canonical spec-document filename set, classifies which paths count as spec documents or `graph-metadata.json`, excludes working-artifact segments (`scratch/`, `temp/`, iteration dirs), and resolves a folder's specs-root-relative identity (`specFolder`, `parentId`, `childrenIds`).
- `capability-flags.ts` resolves each `SPECKIT_*` capability flag's tristate (opt-in / opt-out / default) from `process.env`, re-reading on every call so tests can flip a flag mid-run. It has no imports of its own.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────╮
│ lib/config/                                  │
│ Path classification and capability flags     │
╰──────────────────────────────────────────────╯
                    │
                    ▼
┌──────────────────────────────────────────────┐
│ spec-doc-paths.ts                            │
│ Path normalization, spec/graph-metadata      │
│ gates, and spec-folder identity resolution   │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ ../utils/index-scope.ts                      │
│ shouldIndexForMemory() exclusion gate        │
└────────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ capability-flags.ts                          │
│ SPECKIT_* tristate resolution (no imports)   │
└──────────────────────────────────────────────┘
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `spec-doc-paths.ts` | Canonical spec-document filename set, spec/graph-metadata path gates, working-artifact exclusion, and `resolveSpecFolderIdentity()` / `SpecFolderIdentityError`. |
| `capability-flags.ts` | `parseFlagTristate()` plus one documented env var and one derived boolean function per graduated capability (identity/merge safety, generated-metadata grandfather mode, the drift gate, generator hardening, idempotent description writes, the status-completion-consistency gate). |

Imports used by this folder:

| Import | Used by | Purpose |
|---|---|---|
| `../utils/index-scope.js` | `spec-doc-paths.ts` | `shouldIndexForMemory()` exclusion gate |
| `node:fs` | `spec-doc-paths.ts` | Direct-child enumeration for `resolveSpecFolderIdentity()` |

`capability-flags.ts` imports nothing; every flag reads `process.env` directly.

---

## 4. BOUNDARIES AND FLOW

Allowed imports:

- Config modules may import root-level utility seams (`../utils/`) only.
- Domain modules import the specific config file that owns the surface they need.

Disallowed ownership:

- Config does not read or write generated JSON files. It only classifies paths and resolves flags.
- Config does not decide a rule verdict; `lib/validation/` owns that.

Path-classification flow:

```text
Candidate filesystem path
          │
          ▼
Normalize path (forward slashes, lowercase)
          │
          ▼
Reject excluded segments (scratch/, temp/, memory/, iterations working files)
          │
          ▼
Classify as spec document, graph-metadata.json, or neither
          │
          ▼
Extract the owning spec folder (specs-root-relative)
```

---

## 5. ENTRYPOINTS

Spec-document and identity imports:

```typescript
import {
  SPEC_DOCUMENT_FILENAMES,
  GRAPH_METADATA_FILENAME,
  canClassifyAsSpecDocument,
  canClassifyAsGraphMetadataPath,
  matchesSpecDocumentPath,
  isGraphMetadataPath,
  extractSpecFolderFromSpecDocumentPath,
  extractSpecFolderFromGraphMetadataPath,
  resolveSpecFolderIdentity,
  SpecFolderIdentityError,
} from './spec-doc-paths.js'

import type { SpecFolderIdentity } from './spec-doc-paths.js'
```

Capability-flag imports:

```typescript
import {
  parseFlagTristate,
  isIdentityMergeSafetyEnabled,
  isGeneratedMetadataGrandfatherEnabled,
  isGeneratedMetadataDriftGateEnabled,
  isGeneratorHardeningEnabled,
  isIdempotentDescriptionWritesEnabled,
  isStatusCompletionConsistencyGateEnabled,
} from './capability-flags.js'
```

There is no `index.ts` in this folder. Import from the file that owns the needed surface.

---

## 6. VALIDATION

Run from the repository root after editing this README:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/runtime/lib/config/README.md
```

Use the package TypeScript checks (`npm run typecheck` from `runtime/`) when changing either module in this folder.

---

## 7. RELATED

| Resource | Relationship |
|---|---|
| `../README.md` | Parent library map |
| `../../ENV-REFERENCE.md` | Documented defaults for every `SPECKIT_*` capability flag |
| `../validation/README.md` | The rule set that reads these flags and path classifications |
