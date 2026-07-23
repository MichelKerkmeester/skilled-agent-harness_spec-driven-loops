---
title: "runtime/ Tests"
description: "Test harnesses for the runtime/ library primitives, organized into seven directory suites from council and unit coverage through lifecycle, integration and hierarchical-budget checks, plus three root-level executor-audit and receipt-crypto regression files."
---

# runtime/ Tests

---

## 1. OVERVIEW

vitest harnesses validating runtime primitives. Run via the system-spec-kit vitest config.

## 2. TEST SUITES

| Directory | Purpose | README |
|-----------|---------|--------|
| `council/` | Council primitives: multi-seat dispatch, verdict scoring, cost guards, round state and session hierarchy | [`council/README.md`](council/README.md) |
| `fixtures/` | Shared fixture data (including `council-value/`) consumed by the integration and unit suites | [`fixtures/README.md`](fixtures/README.md) |
| `helpers/` | Shared fixtures and child-process helpers used by multiple suites | [`helpers/README.md`](helpers/README.md) |
| `hierarchical-budgets/` | Tests for the hierarchical-budgets domain: reserve, settle and replay across the scope hierarchy | [`hierarchical-budgets/README.md`](hierarchical-budgets/README.md) |
| `integration/` | Direct script invocation, review-depth coverage-graph fixtures, council graph script and value scenarios, plus divergent-pivot transaction and recovery coverage | [`integration/README.md`](integration/README.md) |
| `lifecycle/` | SQLite open, close and writer-lock lifecycle checks | [`lifecycle/README.md`](lifecycle/README.md) |
| `unit/` | Per-module unit tests for deep-loop runtime primitives | [`unit/README.md`](unit/README.md) |

## 3. ROOT-LEVEL TESTS

Three regression files sit directly under `runtime/tests/` instead of inside one of the seven directory suites above. `vitest.config.ts`'s `runtime/tests/**/*.{vitest,test}.ts` include pattern matches them the same as the directory suites.

| File | Purpose |
|------|---------|
| `executor-audit-cli-branch-receipts.test.ts` | One regression cell per `deep_*_auto.yaml` CLI-branch dispatch style (copilot, claude-code, opencode), asserting forwarded argv/env and an INTENT plus COMPLETION receipt |
| `executor-audit-receipts.test.ts` | Executor audit dispatch receipts and key-containment tests for `lib/deep-loop/executor-audit.ts` |
| `receipt-crypto.test.ts` | HMAC-SHA256 receipt key derivation, signing and verification for `lib/deep-loop/receipt-crypto.ts` |

## 4. TEST HELPERS

Shared utilities live at `helpers/`, renamed from `_helpers` per no-underscore convention. See `helpers/README.md`.

## 5. HOW TO RUN

```bash
cd .opencode/skills/system-spec-kit/mcp-server
node_modules/.bin/vitest run --no-coverage \
  /absolute/path/to/.opencode/skills/system-deep-loop/runtime/tests/<subdir-or-file>
```

## 6. RELATED RESOURCES

- Library being tested: `.opencode/skills/system-deep-loop/runtime/lib/`
- vitest config: `.opencode/skills/system-spec-kit/mcp-server/vitest.config.ts`
