---
title: "Skill-graph handlers"
description: "MCP-facing handlers for skill-graph scanning, relationship queries, status and validation."
trigger_phrases:
  - "skill graph handlers"
  - "skill graph MCP tools"
---

# Skill-graph handlers

---

## 1. OVERVIEW

`skill-graph/` owns the MCP-facing handler layer for the SQLite-backed skill graph. The handlers parse tool arguments, call the package-local graph library and return redacted response envelopes.

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `index.ts` | Re-exports the handler entrypoints. |
| `propagate-enhances.ts` | Handles enhancement propagation operations. |
| `query.ts` | Handles relationship traversal queries. |
| `response-envelope.ts` | Formats success and error responses and redacts local paths. |
| `scan.ts` | Handles skill-graph scanning and freshness publication. |
| `status.ts` | Reports graph status, schema and validation summaries. |
| `validate.ts` | Checks graph integrity, derived freshness and sanitizer-version state. |

## 3. BOUNDARIES

Keep MCP response formatting in `response-envelope.ts`. Database and traversal logic belongs in `../../lib/skill-graph/`. Handler modules stay thin and do not write graph tables directly.

## 4. VALIDATION

Run the owning MCP server test command from the repository root:

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp-server test -- --no-file-parallelism --maxWorkers=1
```

## 5. RELATED

- [`Skill-graph library`](../../lib/skill-graph/README.md)
