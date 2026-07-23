---
title: "Test Fixtures"
description: "Shared TypeScript fixtures for the runtime/ unit test suites: event registries, policy registries and a child-process worker for concurrency tests."
---

# Test Fixtures

---

## 1. OVERVIEW

Reusable fixture data and helpers consumed by suites under `../unit/`. These are test-only building blocks, not runtime code: they construct minimal event and policy registries so a suite can exercise `lib/authorized-ledger/` and `lib/event-envelope/` without repeating registry setup in every file.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `authorized-ledger-fixtures.ts` | Builds a fixture event-type registry, a fixture policy registry (allow, throwing and never-resolving evaluators) and helpers to construct a validated fixture event and a ledger-bound authorization request |
| `authorized-ledger-worker.ts` | Child-process worker script. Appends one fixture event to an `AppendOnlyLedger` through `TransitionAuthorizationGateway`, retrying up to 40 attempts on a denied or conflicting authorization and prints the resulting receipt as JSON on stdout |
| `event-envelope-producers.ts` | A frozen list of one payload fixture per real event-producer family (observability, council round state, executor audit, fan-out status, iteration state) for event-envelope contract tests |
| `council-value/` | Council graph value-report fixtures, documented in its own `council-value/README.md` |

## 3. CONSUMERS

- `authorized-ledger-fixtures.ts` and `authorized-ledger-worker.ts`: `../unit/authorized-ledger.vitest.ts`, `../unit/replay-fingerprint.vitest.ts`, `../unit/next-focus.vitest.ts`, `../unit/shadow-parity-harness.vitest.ts`, `../unit/legacy-projections.test.ts`, `../unit/locks-and-fencing.vitest.ts`
- `event-envelope-producers.ts`: `../unit/event-envelope.vitest.ts`

## 4. RELATED

- Parent tests README: `../README.md`
- Libraries under test: `../../lib/authorized-ledger/`, `../../lib/event-envelope/`
