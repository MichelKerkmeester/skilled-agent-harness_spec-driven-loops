---
title: "Code Graph Tests: Structural Index Coverage"
description: "Vitest coverage for code graph indexing, readiness, query, context, recovery and change-detection behavior."
trigger_phrases:
  - "code graph tests"
  - "structural index tests"
  - "detect changes tests"
  - "code graph apply tests"
---

# Code Graph Tests: Structural Index Coverage

> Unit and integration coverage for the `mk-code-index` runtime package.

---

## 1. OVERVIEW

`mcp-server/tests/` contains Vitest coverage for the code graph package. The suite checks structural indexing, SQLite persistence behavior, readiness gates, query and context handlers, seed resolution, verification, apply-mode recovery and diff-to-symbol attribution.

Current state:

- Most tests build temporary workspaces and isolate database state between cases.
- Handler tests mock readiness and database calls where safety contracts matter.
- `assets/code-graph-gold-queries.json` stores the gold-query battery fixture used by verification coverage.
- Stress and degraded-mode coverage lives in `../stress-test/code-graph/`.

---

## 2. PACKAGE TOPOLOGY

```text
tests/
+-- assets/code-graph-gold-queries.json        # Static verification battery
+-- __fixtures__/index-scope.ts                # Reusable test-only policy fixture
+-- lib/*.vitest.ts                            # Focused library and hardening coverage
+-- code-graph-*.vitest.ts                     # Indexer, DB, query, context, readiness and apply coverage
+-- parser-skip-list.vitest.ts                 # Parser skip-list and quarantine resilience coverage
+-- detect-changes.test.ts                     # Diff parser and affected-symbol safety coverage
+-- edge-*.test.ts                             # Edge drift and metadata sanitization coverage
`-- phase-runner.test.ts                       # Phase dependency ordering and failure coverage
```

Primary dependency direction:

```text
tests -> ../lib
tests -> ../handlers
tests -> assets
```

---

## 3. KEY TEST AREAS

| Area | Representative Files | Coverage |
|---|---|---|
| Indexing and persistence | `code-graph-indexer.vitest.ts`, `code-graph-atomic-persistence.vitest.ts` | Symbol IDs, content hashes, stale detection, node and edge writes. |
| Scope policy and doc-language | `code-graph-indexer.vitest.ts`, `code-graph-scan.vitest.ts`, `code-graph-doc-language.test-d.ts` | Default excludes, env and per-call precedence, granular `sk-*` list selection and doc-language row behavior. |
| Parser skip-list resilience | `parser-skip-list.vitest.ts` | B1/B2 classification, UPSERT behavior, fail-open SQLite handling, summary output and production seeding. |
| Readiness and scope fingerprint | `code-graph-scope-readiness.vitest.ts`, `code-graph-siblings-readiness.vitest.ts`, `code-graph-status-readiness-snapshot.vitest.ts` | Freshness gates, workspace scope decisions and v2 scope-fingerprint round-trip. |
| Query and context handlers | `code-graph-query-handler.vitest.ts`, `code-graph-context-handler.vitest.ts` | MCP handler output contracts, seed telemetry and graph context shaping. |
| Apply-mode recovery | `code-graph-apply-orchestrator.vitest.ts`, `code-graph-apply-e2e.vitest.ts`, `code-graph-recovery-procedures.vitest.ts` | Verification-gated repair, rollback, dry-run behavior and recovery playbook scenarios. |
| Seed and subject resolution | `code-graph-seed-resolver.vitest.ts`, `code-graph-resolve-subject-typed.vitest.ts` | File, symbol and external seed mapping. |
| Change detection | `detect-changes.test.ts` | Blocked responses on stale or failed readiness and line-range overlap attribution. |
| Graph quality | `edge-drift.vitest.ts`, `edge-metadata-sanitize.test.ts`, `code-graph-gold-battery.vitest.ts` | Drift checks, metadata sanitization and gold-query verification. |
| Phase execution | `phase-runner.test.ts` | Topological ordering, duplicate output rejection, missing dependencies and cycle errors. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| State | Tests may create temporary workspaces and SQLite files. They should not depend on the developer's live graph database. |
| Imports | Tests may import public handlers, library entrypoints and focused internals under test. |
| Runtime | Keep pressure tests in `../stress-test/code-graph/`; keep ordinary unit and integration coverage here. |
| Fixtures | Shared verification fixtures live under `assets/`. |

---

## 5. VALIDATION

Run from the repository root.

```bash
.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run code-graph
```

For focused change-detection coverage:

```bash
.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run detect-changes
```

Expected result: the selected Vitest suite exits `0`.

---

## 6. RELATED

| Document | Purpose |
|---|---|
| [../../README.md](../../README.md) | Skill-level overview and operator guide. |
| [../lib/README.md](../lib/README.md) | Core graph library modules covered by tests. |
| [../handlers/README.md](../handlers/README.md) | Handler modules covered by tests. |
| [lib/README.md](./lib/README.md) | Focused library and hardening tests. |
| [assets/README.md](./assets/README.md) | Static JSON verification fixtures. |
| [__fixtures__/README.md](./__fixtures__/README.md) | Reusable TypeScript test fixtures. |
| [../stress-test/code-graph/README.md](../stress-test/code-graph/README.md) | Stress and degraded-mode coverage map. |
| [assets/code-graph-gold-queries.json](./assets/code-graph-gold-queries.json) | Gold-query battery fixture. |
