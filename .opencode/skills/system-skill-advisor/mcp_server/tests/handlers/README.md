---
title: "Skill Advisor Handler Tests"
description: "Vitest coverage for advisor MCP handler response shapes, status reporting and validation contracts."
trigger_phrases:
  - "skill advisor handler tests"
  - "advisor recommend tests"
---

# Skill Advisor Handler Tests

<!-- sk-doc-template: skill_readme -->

> Vitest coverage for advisor MCP handler response shapes, status reporting and validation contracts.

---

## 1. OVERVIEW

`tests/handlers/` verifies the MCP-facing skill advisor handlers and their typed response contracts.

Current state:

- Covers recommendation success, unavailable states, status reads and validation shapes.
- Uses Vitest mocks for scorer and status dependencies where handler behavior is isolated.
- Checks prompt-safe output boundaries and threshold metadata.

---

## 2. DIRECTORY TREE

```text
handlers/
+-- advisor-recommend-unavailable.vitest.ts  # Unavailable recommendation path
+-- advisor-recommend.vitest.ts              # Recommendation handler contract
+-- advisor-status.vitest.ts                 # Status handler freshness states
+-- advisor-validate-shapes.vitest.ts        # Validation response shape checks
+-- advisor-validate.vitest.ts               # Advisor validation handler behavior
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `advisor-recommend.vitest.ts` | Verifies recommendation payloads, attribution, freshness and dispatch integration. |
| `advisor-status.vitest.ts` | Verifies live, stale, absent and unavailable status output. |
| `advisor-validate.vitest.ts` | Covers validation handler behavior for advisor regression checks. |

---

## 4. VALIDATION

Run from the repository root.

```bash
npx vitest run .opencode/skills/system-skill-advisor/mcp_server/tests/handlers
```

Expected result: all handler tests pass.

---

## 5. RELATED

- [`../README.md`](../README.md)
- [`../fixtures/README.md`](../fixtures/README.md)
- [`../../README.md`](../../README.md)
