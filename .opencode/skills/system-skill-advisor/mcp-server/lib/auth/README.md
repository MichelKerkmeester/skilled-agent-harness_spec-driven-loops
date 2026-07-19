---
title: "Auth Library: Trusted Caller Checks"
description: "Trusted-caller helper for skill-advisor library paths that need caller validation."
trigger_phrases:
  - "trusted caller"
  - "advisor auth helper"
---

# Auth Library: Trusted Caller Checks

<!-- sk-doc-template: skill_readme -->

---

## 1. OVERVIEW

`lib/auth/` contains trusted-caller logic used by skill-advisor paths that need to distinguish expected local callers from untrusted invocation contexts. It keeps this check isolated from scoring and rendering modules.

Current state:

- Provides a single trusted-caller module.
- Keeps caller validation separate from advisor scoring logic.
- Supports auth-related behavior without owning transport registration.

---

## 2. DIRECTORY TREE

```text
auth/
+-- trusted-caller.ts   # Trusted caller validation helper
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `trusted-caller.ts` | Validates whether a caller context should be treated as trusted. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Keep dependencies small and local to caller validation. |
| Exports | Export caller trust helpers only. |
| Ownership | Put auth and trust checks here. Put prompt policy in `../prompt-policy.ts`. |

Main flow:

```text
caller context
  -> trusted caller helper
  -> trusted or untrusted result
  -> advisor caller decides behavior
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `trusted-caller.ts` | TypeScript module | Trusted caller validation helper. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp-server/lib/auth/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../prompt-policy.ts`](../prompt-policy.ts)
