---
title: "Search Tests"
description: "Focused search regressions that sit outside the broader root-level search suites."
trigger_phrases:
  - "search tests"
  - "search remediation tests"
  - "retrieval tests"
---

# Search Tests

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. OWNERSHIP](#2--ownership)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)

## 1. OVERVIEW

`tests/search/` holds focused search regression suites that are easier to keep separate from the larger root-level search tests.

## 2. OWNERSHIP

These tests belong to `lib/search/` and related retrieval behavior.

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `deep-review-remediation.vitest.ts` | Guards search fixes raised by review. |

## 4. BOUNDARIES

- Keep corpus setup minimal and explicit.
- Do not write to production database paths.
- Put broad pipeline integration tests in root-level `tests/*.vitest.ts`.

## 5. ENTRYPOINTS

Run from `mcp_server/`.

## 6. VALIDATION

```bash
npx vitest run tests/search
```
