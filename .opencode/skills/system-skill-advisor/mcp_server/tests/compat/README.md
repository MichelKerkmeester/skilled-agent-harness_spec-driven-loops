---
title: "Skill Advisor Compat Tests"
description: "Compatibility coverage for advisor daemon, plugin bridge, Python parity and redirect contracts."
trigger_phrases:
  - "skill advisor compat tests"
  - "advisor plugin bridge tests"
---

# Skill Advisor Compat Tests

<!-- sk-doc-template: skill_readme -->

> Compatibility coverage for advisor daemon, plugin bridge, Python parity and redirect contracts.

---

## 1. OVERVIEW

`tests/compat/` verifies compatibility seams around the TypeScript advisor, plugin bridge and Python fallback path.

Current state:

- Confirms daemon freshness probing in `lib/compat/daemon-probe.js`.
- Locks plugin bridge output shape and threshold metadata.
- Runs Python compatibility coverage through Vitest.

---

## 2. DIRECTORY TREE

```text
compat/
+-- daemon-probe.vitest.ts          # Advisor daemon availability states
+-- plugin-bridge-smoke.vitest.ts   # Bridge smoke coverage
+-- plugin-bridge.vitest.ts         # Bridge contract and fallback coverage
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
| `plugin-bridge.vitest.ts` | Checks bridge output, thresholds, routes and prompt privacy. |
| `python-compat.vitest.ts` | Runs `tests/python/test_skill_advisor.py` from the Vitest suite. |

---

## 4. VALIDATION

Run from the repository root.

```bash
npx vitest run .opencode/skills/system-skill-advisor/mcp_server/tests/compat
```

Expected result: all compatibility tests pass.

---

## 5. RELATED

- [`../README.md`](../README.md)
- [`../python/README.md`](../python/README.md)
- [`../../README.md`](../../README.md)
