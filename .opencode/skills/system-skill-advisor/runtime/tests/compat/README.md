---
title: "Skill Advisor Compat Tests"
description: "Compatibility coverage for the advisor daemon, Python parity and redirect contracts."
trigger_phrases:
  - "skill advisor compat tests"
  - "advisor daemon probe tests"
  - "advisor python parity tests"
---

# Skill Advisor Compat Tests

<!-- sk-doc-template: skill_readme -->

> Compatibility coverage for the advisor daemon, Python parity and redirect contracts.

---

## 1. OVERVIEW

`tests/compat/` verifies compatibility seams around the TypeScript advisor and the Python fallback path.

Current state:

- Confirms daemon freshness probing in `lib/compat/daemon-probe.js`.
- Runs Python compatibility coverage through Vitest.

---

## 2. DIRECTORY TREE

```text
compat/
+-- daemon-probe.vitest.ts          # Advisor daemon availability states
+-- python-compat.vitest.ts         # Python suite runner from Vitest
+-- redirect-metadata.vitest.ts     # Redirect metadata compatibility
+-- shim.vitest.ts                  # Compatibility shim behavior
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `daemon-probe.vitest.ts` | Verifies live, stale, absent, unavailable and disabled daemon probe states. |
| `python-compat.vitest.ts` | Runs `tests/python/test_skill_advisor.py` from the Vitest suite. |
| `redirect-metadata.vitest.ts` | Checks the redirect metadata contract callers rely on. |
| `shim.vitest.ts` | Covers the compatibility shim's behavior. |

---

## 4. VALIDATION

Run from the repository root.

```bash
npx vitest run .opencode/skills/system-skill-advisor/runtime/tests/compat
```

Expected result: all compatibility tests pass.

---

## 5. RELATED

- [`../README.md`](../README.md)
- [`../python/README.md`](../python/README.md)
- [`../../README.md`](../../README.md)
