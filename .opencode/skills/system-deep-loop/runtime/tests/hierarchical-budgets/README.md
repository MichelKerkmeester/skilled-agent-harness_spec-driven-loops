---
title: "Hierarchical Budgets Tests"
description: "Contract tests for lib/hierarchical-budgets: typed budget values, hierarchical allocation, receipt-backed settlement and fail-closed evidence handling."
---

# Hierarchical Budgets Tests

---

## 1. OVERVIEW

A single vitest suite exercising `../../lib/hierarchical-budgets/` end to end on a real `AppendOnlyLedger` and `TransitionAuthorizationGateway` over a temporary directory, plus the two legacy shadow adapters (fan-out, value-of-computation). Each test builds its own harness rather than reusing `../fixtures/`.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `hierarchical-budgets.vitest.ts` | Four scenario groups: typed budget values and scope envelopes, hierarchical allocation and atomic admission, receipt-backed settlement and recovery, plus fail-closed evidence with dark-migration behavior |

## 3. RELATED

- Parent tests README: `../README.md`
- Library under test: `../../lib/hierarchical-budgets/`
- Shared primitives used by the harness: `../../lib/authorized-ledger/`, `../../lib/event-envelope/`, `../../lib/replay-fingerprint/`
