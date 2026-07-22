---
title: "Scripts: System Skill Advisor Doctor"
description: "Read-only health check script for the system-skill-advisor MCP server build and its native runtime dependencies."
---

# Scripts: System Skill Advisor Doctor

---

## 1. OVERVIEW

`scripts/` holds the standalone doctor script for the `system-skill-advisor` skill. It checks that the `mcp-server` package has been built and that its critical native and runtime imports resolve, without mutating anything.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `doctor.sh` | Confirms `mcp-server/dist/` exists, confirms a `node` interpreter is on `PATH`, and requires each of `@huggingface/transformers`, `better-sqlite3`, `@modelcontextprotocol/sdk`, and `zod` to `require()` cleanly from inside `mcp-server/`. |

## 3. VALIDATION

Run from the repository root:

```bash
bash .opencode/skills/system-skill-advisor/scripts/doctor.sh [--strict]
```

Exit codes: `0` health checks pass (or a warning fell through in non-strict mode), `1` invalid arguments, `20` `mcp-server/dist` missing, `26` a runtime import failed (strict mode only, or no `node` on `PATH` in strict mode).

## 4. RELATED

- [`../SKILL.md`](../SKILL.md)
- [`../README.md`](../README.md)
