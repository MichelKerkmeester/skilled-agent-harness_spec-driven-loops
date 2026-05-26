---
title: "Lifecycle Tests"
description: "Database open/close + writer-lock lifecycle verification for the deep-loop-runtime coverage graph."
---

# Lifecycle Tests

---

## 1. OVERVIEW

Verifies the SQLite connection lifecycle invariant: the DB is opened inside a `try`, closed in a `finally`, and the single-writer lock under `database/.deep-loop-graph-writer.lock` is acquired and released correctly. Guards the open/close discipline that every script entry point depends on.

## 2. CONTENTS

| File | Surface under test |
|------|--------------------|
| `db-open-close.vitest.ts` | `coverage-graph-db.ts` open/close + `database/` writer-lock acquire/release |

## 3. RELATED RESOURCES

- Parent tests README: `.opencode/skills/deep-loop-runtime/tests/README.md`
- Coverage-graph schema: `.opencode/skills/deep-loop-runtime/references/coverage_graph_schema.md`
