---
title: "Deep Loop Library: Executor Support"
description: "Executor configuration, audit, prompt rendering and post-dispatch validation helpers for deep-loop workflows."
trigger_phrases:
  - "deep-loop executor"
  - "post-dispatch validation"
---

# Deep Loop Library: Executor Support

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. ENTRYPOINTS](#4--entrypoints)
- [5. BOUNDARIES](#5--boundaries)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

---

## 1. OVERVIEW

`lib/deep-loop/` is a legacy documentation surface for helper modules used by deep research and review loops after a workflow chooses an executor. Current runtime-owned deep-loop helpers live under `.opencode/skills/deep-loop-runtime/lib/deep-loop/`.

Current state:

- Supports native and external CLI executor configuration parsing.
- Records non-native executor provenance in state logs.
- Validates that each dispatch wrote the expected iteration outputs.
- Points maintainers to migrated arc 009 helpers: `loop-lock.ts`, `jsonl-repair.ts`, and `atomic-state.ts`.

---

## 2. DIRECTORY TREE

```text
deep-loop/
+-- executor-audit.ts          # JSONL executor provenance and dispatch failure events
+-- executor-config.ts         # Executor schemas, sandbox mapping and prompt authority helpers
+-- post-dispatch-validate.ts  # Iteration output and state-log validation
+-- prompt-pack.ts             # Prompt template token rendering and validation
`-- README.md

Migrated runtime modules now live in `deep-loop-runtime/lib/deep-loop/`:

```text
deep-loop-runtime/lib/deep-loop/
+-- atomic-state.ts
+-- jsonl-repair.ts
`-- loop-lock.ts
```
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `executor-config.ts` | Defines executor kinds, validates configuration and builds Copilot target-authority prompts. |
| `executor-audit.ts` | Adds executor records and dispatch failure events to JSONL state logs. |
| `post-dispatch-validate.ts` | Checks iteration files, state-log appends, delta files and required JSONL fields. |
| `prompt-pack.ts` | Renders braced-token prompt templates and reports missing variables. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts` | Current single-writer loop lock helper. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts` | Current JSONL corrupt-tail repair helper. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` | Current atomic state-log write helper. |

---

## 4. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `parseExecutorConfig` | Function | Parse and validate merged executor options. |
| `buildCopilotPromptArg` | Function | Add target authority or enforce Gate 3 plan-only dispatch for Copilot. |
| `runAuditedExecutorCommand` | Function | Run an external executor and log timeout or crash events. |
| `validateOrThrow` | Function | Fail a workflow when iteration outputs are incomplete. |
| `renderPromptPack` | Function | Render prompt templates with required variables. |

---

## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | May use Node standard modules, `zod` and sibling deep-loop helpers. |
| Exports | Exposes library helpers to workflow handlers and command surfaces. |
| Ownership | Owns executor-level checks only. Workflow state machines decide when to call these helpers. |

---

## 6. VALIDATION

Run from the repository root.

```bash
npm test -- --runInBand
```

Expected result: TypeScript and workflow tests that cover deep-loop dispatch helpers pass.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../../handlers/README.md`](../../handlers/README.md)
