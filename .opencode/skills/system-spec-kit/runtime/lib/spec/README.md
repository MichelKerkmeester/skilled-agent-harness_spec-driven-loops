---
title: "Spec: Phase-Parent Detection"
description: "Single-source-of-truth phase-parent detection and manifest-size health assessment for spec folders."
trigger_phrases:
  - "phase parent"
  - "is phase parent"
  - "phase parent health"
---

# Spec: Phase-Parent Detection

---

## 1. OVERVIEW

`lib/spec/` owns the single detection rule for phase-parent folders, so no caller re-implements the traversal. A folder is a phase parent when it has at least one direct child matching `^[0-9]{3}-[a-z0-9-]+$` and at least one such child carries `spec.md` or `description.json`.

Current state:

- `is-phase-parent.ts` is the only implementation file in this folder.
- With `SPECKIT_GENERATOR_HARDENING` on, phase-parent classification and the derived children list both read the same `listPhaseChildren()` enumeration, so the two can never disagree on what a child is. With the flag off, `isPhaseParent()` falls back to the legacy direct-`readdir` detection, byte-identical to the pre-hardening behavior.
- `assessPhaseParentHealth()` gives a non-mutating manifest-size advisory (`ok` / `warning` / `error` / `not_phase_parent`) so validation and tooling can flag a phase parent whose child count is getting hard to review, without failing validation by itself.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `is-phase-parent.ts` | `isPhaseParent()`, `listPhaseChildren()`, and `assessPhaseParentHealth()` against the warning (20) and error (40) child-count thresholds. |

---

## 3. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | May import `../config/spec-doc-paths.ts` (`isSpecLeafSegment`) and `../config/capability-flags.ts` (`isGeneratorHardeningEnabled`) only. |
| Ownership | Owns the phase-parent detection rule and its manifest-size advisory. It does not decide a validation verdict; callers in `lib/validation/` do that. |

---

## 4. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `isPhaseParent(specFolderAbsPath)` | Function | Whether a folder qualifies as a phase parent. |
| `listPhaseChildren(specFolderAbsPath)` | Function | Enumerate direct phase-child directories with their qualification flag; the single contract both the classification and the derived children list read from. |
| `assessPhaseParentHealth(specFolderAbsPath)` | Function | Manifest-size advisory (`ok` / `warning` / `error` / `not_phase_parent`) with a recommendation string. |
| `PHASE_PARENT_WARNING_THRESHOLD`, `PHASE_PARENT_ERROR_THRESHOLD` | Constants | Child-count thresholds (20 and 40) behind the health advisory. |

---

## 5. VALIDATION

Run from `.opencode/skills/system-spec-kit/runtime`.

```bash
npx vitest run tests/phase-parent-health.vitest.ts tests/generator-hardening.vitest.ts
```

Expected result: phase-parent health and generator-hardening suites pass.

---

## 6. RELATED

- [`../validation/README.md`](../validation/README.md)
- [`../graph/README.md`](../graph/README.md)
- [`../resume/README.md`](../resume/README.md)
- [`../../handlers/README.md`](../../handlers/README.md)
