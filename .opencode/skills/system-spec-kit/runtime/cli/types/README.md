---
title: "Type Definitions"
description: "Shared TypeScript interfaces for Spec Kit script session payloads and generated context data."
trigger_phrases:
  - "session types"
  - "type definitions"
  - "session data interface"
---

# Type Definitions

> Shared TypeScript interfaces for script payloads, session extraction, decisions, conversations and diagrams.

---

## 1. OVERVIEW

`runtime/cli/types/` contains shared TypeScript types used by extractors, simulation helpers and context-generation modules. The folder keeps data contracts and one small ambient module declaration in a few source files so script modules can share session payload shapes without redefining them.

Current state:

- Source of truth for session payload shapes is `session-types.ts`.
- `save-mode.ts` defines the `SaveMode` enum and resolves the effective save mode from caller input.
- `js-yaml.d.ts` is an ambient module declaration for the untyped `js-yaml` package.
- Runtime declarations are generated into `runtime/cli/dist/types/` by the TypeScript build.
- These definitions model script data only. They are not runtime package API contracts.

---

## 2. PACKAGE TOPOLOGY

```text
runtime/cli/types/
+-- session-types.ts      # Shared session, decision, conversation and diagram interfaces
+-- save-mode.ts          # SaveMode enum and resolveSaveMode() input resolution
+-- js-yaml.d.ts          # Ambient module declaration for js-yaml
`-- README.md
```

Generated output:

```text
runtime/cli/dist/types/
+-- session-types.js
+-- session-types.d.ts
+-- save-mode.js
+-- save-mode.d.ts
`-- *.js.map / *.d.ts.map
```

`js-yaml.d.ts` is an ambient declaration file and produces no compiled output.

Allowed direction:

- Script source modules may import from `runtime/cli/types/session-types.ts` and `runtime/cli/types/save-mode.ts`.
- Extractors may provide imported field types used by `SessionData`.
- Build output may be inspected by runtime smoke tests.

Disallowed direction:

- Source modules should not import from `runtime/cli/dist/types/`.
- Type files should not contain runtime behavior beyond `save-mode.ts`'s pure input-resolution helper.
- Runtime package public API types should not be defined here.

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `session-types.ts` | Defines decision, conversation, diagram and session payload interfaces. |
| `save-mode.ts` | Defines the `SaveMode` enum, `SaveModeInput` and `resolveSaveMode()`. |
| `js-yaml.d.ts` | Ambient module declaration for the untyped `js-yaml` package. |
| `../extractors/file-extractor.ts` | Provides file-change and observation types consumed by session types. |
| `../extractors/session-extractor.ts` | Provides tool-count and spec-file entry types consumed by session types. |

Primary type groups:

| Group | Purpose |
|---|---|
| `DecisionData` | Decision records, options, evidence and confidence fields. |
| `ConversationData` | Messages, tool calls, phases and conversation flow metadata. |
| `DiagramData` | Diagram output, decision trees and pattern summaries. |
| `SessionData` | Root generated-context payload used by save and render workflows. |

---

## 4. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `resolveSaveMode` | Function (`save-mode.ts`) | Resolves the effective `SaveMode` from explicit fields, input mode hints or legacy source markers. |

This folder has no standalone CLI. Consumers import the types from source during TypeScript development or from generated declarations after build.

Example source import:

```typescript
import type { SessionData } from '../types/session-types'
import { resolveSaveMode } from '../types/save-mode'
```

Example declaration check:

```bash
test -f .opencode/skills/system-spec-kit/runtime/cli/dist/types/session-types.d.ts
```

---

## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| Ownership | This folder owns script payload interfaces only. |
| Runtime | Keep runtime logic in extractors, core modules or libraries. |
| Imports | Prefer type-only imports when consumers only need compile-time shapes. |
| Public APIs | Runtime package request and response contracts belong under `runtime/`. |

---

## 6. VALIDATION

Run the README validator after editing this file:

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/system-spec-kit/runtime/cli/types/README.md
```

Run the script build after changing type definitions:

```bash
npm --prefix .opencode/skills/system-spec-kit/runtime/cli run build
```

Expected result: TypeScript compiles and emits declarations for `session-types.ts` and `save-mode.ts`.

---

## 7. RELATED

- [`../extractors/README.md`](../extractors/README.md)
- [`../core/README.md`](../core/README.md)
- [`../README.md`](../README.md)
