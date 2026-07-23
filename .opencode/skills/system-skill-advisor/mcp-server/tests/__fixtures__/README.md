---
title: "Test Fixtures: Error Envelope Builder"
description: "Fixture-only folder for the skill-advisor mcp-server test suite, not product code."
---

# Test Fixtures: Error Envelope Builder

---

## 1. OVERVIEW

`tests/__fixtures__/` is a fixtures-only folder for the skill-advisor `mcp-server/tests/` suite. It provides an error class and an error-response builder that advisor handler tests assert against, kept separate from the handlers themselves so tests do not duplicate the redaction logic.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `errors.ts` | Defines `MemoryError` (a named error with a `code` and `context`) and `buildErrorResponse(toolName, error, input)`, which redacts the raw prompt string out of the error message, context, and echoed input before returning the tool error envelope. |

## 3. CONSUMERS

- `.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-recommend.vitest.ts`

## 4. RELATED

- [`../README.md`](../README.md)
