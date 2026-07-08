---
title: "runtime/ Tests"
description: "Test harnesses for runtime/ primitives. Grouped by library domain: council, coverage-graph, deep-loop."
---

# runtime/ Tests

---

## 1. OVERVIEW

vitest harnesses validating runtime primitives. Run via the system-spec-kit vitest config.

## 2. TEST SUITES

| Directory | Purpose | README |
|-----------|---------|--------|
| `council/` | Council primitives: multi-seat dispatch, verdict scoring, cost guards, round state, and session hierarchy | [`council/README.md`](council/README.md) |
| `helpers/` | Shared fixtures and child-process helpers used by multiple suites | [`helpers/README.md`](helpers/README.md) |
| `integration/` | Direct script invocation, review-depth coverage-graph fixtures, council graph script coverage, and council graph value scenarios | [`integration/README.md`](integration/README.md) |
| `lifecycle/` | SQLite open, close, and writer-lock lifecycle checks | [`lifecycle/README.md`](lifecycle/README.md) |
| `unit/` | Per-module unit tests for deep-loop runtime primitives | [`unit/README.md`](unit/README.md) |

## 3. TEST HELPERS

Shared utilities live at `helpers/`, renamed from `_helpers` per no-underscore convention. See `helpers/README.md`.

## 4. HOW TO RUN

```bash
cd .opencode/skills/system-spec-kit/mcp_server
node_modules/.bin/vitest run --no-coverage \
  /absolute/path/to/.opencode/skills/system-deep-loop/runtime/tests/<subdir-or-file>
```

## 5. RELATED RESOURCES

- Library being tested: `.opencode/skills/system-deep-loop/runtime/lib/`
- vitest config: `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts`
