---
title: "Skill Advisor Hook Tests"
description: "Regression coverage for settings-driven skill advisor hook invocation shape."
trigger_phrases:
  - "skill advisor hook tests"
  - "settings driven invocation parity"
---

# Skill Advisor Hook Tests

<!-- sk-doc-template: skill_readme -->

> Regression coverage for settings-driven skill advisor hook invocation shape.

---

## 1. OVERVIEW

`tests/hooks/` guards the checked-in Claude settings shape used by skill advisor hook invocation.

Current state:

- Confirms each hook event uses the nested matcher-group shape.
- Ensures hook commands point at `dist/hooks/claude/*` handlers.
- Blocks accidental `hooks/copilot/` adapter references in Claude settings.

---

## 2. DIRECTORY TREE

```text
hooks/
+-- settings-driven-invocation-parity.vitest.ts  # Claude settings hook shape guard
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `settings-driven-invocation-parity.vitest.ts` | Verifies `UserPromptSubmit`, `PreCompact`, `SessionStart` and `Stop` hook definitions. |

---

## 4. VALIDATION

Run from the repository root.

```bash
npx vitest run .opencode/skills/system-skill-advisor/mcp_server/tests/hooks
```

Expected result: the settings shape and adapter checks pass.

---

## 5. RELATED

- [`../README.md`](../README.md)
- [`../compat/README.md`](../compat/README.md)
- [`../../README.md`](../../README.md)
