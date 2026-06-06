---
title: "Strict Zod schema validation"
description: "Strict Zod schema validation adds runtime input validation across the schema-backed MCP tool surface, rejecting hallucinated parameters from calling LLMs."
trigger_phrases:
  - "strict zod schema validation"
  - "zod runtime validation"
  - "reject hallucinated parameters"
  - "MCP tool input validation"
  - "schema-backed tool surface"
---

# Strict Zod schema validation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Strict Zod schema validation adds runtime input validation across the schema-backed MCP tool surface, rejecting hallucinated parameters from calling LLMs.

AI assistants sometimes invent parameters that do not exist when calling tools. This feature checks every incoming request against a strict rulebook and rejects anything that does not match. It is like a bouncer who checks your ID against the guest list: if your name is not on the list, you do not get in. This prevents made-up inputs from causing unexpected behavior.

---

## 2. HOW IT WORKS

**IMPLEMENTED (Sprint 019, later expanded by session/code-graph additions).** The L1-L7 tool surface has Zod runtime schemas defined in `mcp_server/schemas/tool-input-schemas.ts` (re-exported via `tool-schemas.ts`), controlled by `SPECKIT_STRICT_SCHEMAS` (`.strict()` vs `.passthrough()`). Hallucinated parameters from calling LLMs are rejected with clear Zod errors and logged to stderr for audit trail (CHK-029). The L8 code-graph/Code Graph dispatch helpers currently rely on lighter required-field guards rather than the same `validateToolArgs` path. Adds `zod` dependency.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod input schemas |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/tool-input-schema.vitest.ts` | Automated test | Tool input schema tests |

---

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `14--pipeline-architecture/strict-zod-schema-validation.md`
Related references:
- [dbpath-extraction-and-import-standardization.md](dbpath-extraction-and-import-standardization.md) — DB_PATH extraction and import standardization
- [dynamic-server-instructions-at-mcp-initialization.md](dynamic-server-instructions-at-mcp-initialization.md) — Dynamic server instructions at MCP initialization
