---
title: "MCP Server Utilities"
description: "Shared validators, JSON helpers, batch processing helpers, and DB utility functions."
trigger_phrases:
  - "MCP utilities"
  - "input validation"
  - "batch processing"
importance_tier: "normal"
---

# MCP Server Utilities

## Overview

`utils/` provides reusable helpers used by handlers and core modules.

- `validators.ts`: query and input-length validation, file-path validator factory.
- `json-helpers.ts`: safe parse/stringify helpers.
- `batch-processor.ts`: retry-aware batch and sequential processors.
- `db-helpers.ts`: DB guard and error-message helpers.
- `index.ts`: barrel exports.

## Implemented State

Primary exports are camelCase (with TypeScript-first signatures):
- `validateQuery`, `validateInputLengths`, `createFilePathValidator`, `getDefaultAllowedPaths`
- `safeJsonParse`, `safeJsonStringify`, `safeJsonParseTyped`
- `processWithRetry`, `processBatches`, `processSequentially`
- `requireDb`, `toErrorMessage`

Security and reliability behavior:
- Input limits align with core constants (`MAX_QUERY_LENGTH`, `INPUT_LIMITS`).
- Path validation aligns with centralized allowed-path policy.
- Batch processing includes bounded retry behavior for transient failures.

## Hardening Notes

- Utility APIs are now aligned with current camelCase usage across handlers.
- Shared DB error conversion reduces inconsistent thrown-error formatting.
- Validation helpers are part of query/input hardening used after Spec 125/126 stabilization.

## Related

- `../core/README.md`
- `../handlers/README.md`
- `../formatters/README.md`
