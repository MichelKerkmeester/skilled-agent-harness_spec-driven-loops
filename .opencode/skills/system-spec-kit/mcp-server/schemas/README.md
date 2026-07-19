---
title: "MCP Server Schemas"
description: "Zod input schemas, strict-mode guards and typed validation errors for MCP tool arguments."
trigger_phrases:
  - "tool input schemas"
  - "zod validation"
  - "schema validation"
  - "tool args"
  - "strict schemas"
---

# MCP Server Schemas

---

## 1. OVERVIEW

`mcp-server/schemas/` owns the Zod schema registry used to validate MCP tool arguments. Tool handlers call this layer before executing user-provided input.

Current state:

- `TOOL_DEFINITIONS.length` is the public tool-count source of truth.
- `TOOL_SCHEMAS` is the validation registry and may include compatibility or helper entries.
- Strict mode is on unless `SPECKIT_STRICT_SCHEMAS=false`.
- Validation errors include tool name, issue summaries and unknown-parameter lists.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         mcp-server/schemas                       │
╰──────────────────────────────────────────────────────────────────╯

┌─────────────┐      ┌────────────────┐      ┌────────────────┐
│ Tool caller │ ───▶ │ Tool handler   │ ───▶ │ validateToolArgs│
└──────┬──────┘      └───────┬────────┘      └────────┬───────┘
       │                     │                        │
       │                     ▼                        ▼
       │             ┌───────────────┐        ┌───────────────┐
       └──────────▶  │ TOOL_SCHEMAS  │ ───▶   │ Zod schema    │
                     └───────┬───────┘        └───────┬───────┘
                             │                        │
                             ▼                        ▼
                     ┌───────────────┐        ┌───────────────┐
                     │ Parsed args   │        │ Typed error   │
                     └───────────────┘        └───────────────┘

Dependency direction: tool handlers ───▶ schema registry ───▶ shared validators
```

---

## 3. DIRECTORY TREE

```text
schemas/
+-- tool-input-schemas.ts  # Zod registry, shared validators and error formatting
`-- README.md
```

No subfolders exist in this directory.

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `tool-input-schemas.ts` | Defines tool input schemas, shared validators, `validateToolArgs()`, `getToolSchema()`, `formatZodError()`, `getSchema()` and `ToolSchemaValidationError`; `memory_update` accepts optional `expectedHash` for constitutional self-edit compare-and-swap guards. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Tool modules import validation helpers from this folder or the parent `tool-schemas.ts` barrel. |
| Exports | Export schema helpers and typed validation errors only. |
| Ownership | Keep input validation here. Keep tool execution in `mcp-server/tools/`. |
| Paths | Use `pathString()` or `optionalPathString()` for path-like parameters. |
| Constitutional updates | `memory_update.expectedHash` is optional schema input used by the handler to reject stale protected-row updates before mutation. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ Tool handler receives arguments          │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ validateToolArgs() selects schema        │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ getSchema() applies strict mode          │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Zod parses or rejects arguments          │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Parsed args or ToolSchemaValidationError │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `validateToolArgs()` | Function | Validates raw arguments for a named tool. |
| `getToolSchema()` | Function | Returns the Zod schema for a tool name. |
| `formatZodError()` | Function | Converts Zod issues into a typed tool error. |
| `getSchema()` | Function | Applies strict or passthrough object behavior. |
| `ToolSchemaValidationError` | Class | Carries validation failure details to callers. |
| `memory_update.expectedHash` | Parameter | Optional compare-and-swap hash accepted by the schema for guarded constitutional updates. |

---

## 7. VALIDATION

Run from the repository root:

```bash
npm test -- --run mcp-server/tests/review-fixes.vitest.ts
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp-server/schemas/README.md
```

Expected result: schema tests pass and README validation exits `0` with no HVR violations.

---

## 8. RELATED

- [Tool schema barrel](../tool-schemas.ts)
- [Tool handlers](../tools/README.md)
- [MCP server core](../core/README.md)
- [Schema validation tests](../tests/review-fixes.vitest.ts)
