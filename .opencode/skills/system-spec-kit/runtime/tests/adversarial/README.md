# Adversarial Runtime Tests

> Focused runtime regressions for hostile inputs and race-sensitive behavior.

---

## 1. OVERVIEW

`runtime/tests/adversarial/` holds focused regression tests for adversarial interleavings and hostile inputs that are easier to reason about outside broader test suites.

Current state:

- The folder contains one compact-prime identity race regression.
- Tests run under the runtime package Vitest setup.
- Coverage here complements nearby regression suites instead of duplicating them.

---

## 2. OWNERSHIP

This directory belongs to the runtime test suite. Add tests here when the scenario is security-sensitive, race-sensitive or intentionally adversarial.

---

## 3. TREE AND KEY FILES

```text
runtime/tests/adversarial/
+-- README.md
`-- compact-prime-identity-race.vitest.ts
```

| File | Role |
|---|---|
| `compact-prime-identity-race.vitest.ts` | Verifies stale compact-prime clears do not erase fresher payloads |

---

## 4. BOUNDARIES

- Keep adversarial tests deterministic and local to runtime behavior.
- Do not store phase history or audit notes here.
- Put broad integration coverage in the nearest existing runtime regression suite.
- Name new files with a short scenario slug and `.vitest.ts` suffix.

---

## 5. VALIDATION

```bash
npx vitest run .opencode/skills/system-spec-kit/runtime/tests/adversarial/compact-prime-identity-race.vitest.ts
```

---

## 6. RELATED

- [`../`](../) - Runtime tests.
- [`../../`](../../) - Runtime package root.
