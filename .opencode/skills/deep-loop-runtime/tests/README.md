---
title: "deep-loop-runtime Tests"
description: "Test harnesses for deep-loop-runtime primitives. Grouped by library domain: council, coverage-graph, deep-loop."
---

# deep-loop-runtime Tests

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. TEST SUITES](#2--test-suites)
- [3. TEST HELPERS](#3--test-helpers)
- [4. HOW TO RUN](#4--how-to-run)
- [5. RELATED RESOURCES](#5--related-resources)

---

## 1. OVERVIEW

vitest harnesses validating runtime primitives. Run via the system-spec-kit vitest config.

## 2. TEST SUITES

| Directory | Purpose |
|-----------|---------|
| `council/` | Council primitives: multi-seat dispatch, verdict scoring, cost guards, round state, and session hierarchy |
| `helpers/` | Shared fixtures and child-process helpers used by multiple suites |
| `integration/` | Direct script invocation and review-depth coverage-graph fixtures |
| `lifecycle/` | SQLite open, close, and writer-lock lifecycle checks |
| `unit/` | Per-module unit tests for deep-loop runtime primitives |

## 3. TEST HELPERS

Shared utilities live at `helpers/`, renamed from `_helpers` per no-underscore convention. See `helpers/README.md`.

## 4. HOW TO RUN

```bash
cd .opencode/skills/system-spec-kit/mcp_server
node_modules/.bin/vitest run --no-coverage \
  /absolute/path/to/.opencode/skills/deep-loop-runtime/tests/<subdir-or-file>
```

## 5. RELATED RESOURCES

- Library being tested: `.opencode/skills/deep-loop-runtime/lib/`
- vitest config: `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts`
