---
title: "Command Validation Fixtures"
description: "Reference for negative fixtures used by the command-reference integrity self-test."
trigger_phrases:
  - "command validation fixtures"
  - "broken command reference fixture"
  - "command checker self-test"
importance_tier: "normal"
---

# Command Validation Fixtures

> Deliberately invalid command references that prove the validator rejects broken assets.

---

## 1. OVERVIEW

`.opencode/commands/scripts/fixtures/` contains negative test data for `validate-command-references.cjs`.

The fixture values are intentionally broken. They must remain unresolved so the self-test can verify the checker's failing path.

---

## 2. DIRECTORY TREE

```text
fixtures/
+-- broken-command-refs.yaml
`-- README.md
```

---

## 3. KEY FILE

| File | Responsibility |
|---|---|
| `broken-command-refs.yaml` | Provides one invalid example for each supported violation class, plus valid forms that must not produce false positives. |

---

## 4. FIXTURE CASES

The fixture covers these invalid references:

| Case | Expected finding |
|---|---|
| Retired runtime agent filename | `agent` violation |
| Removed skill template path | `skill-asset` violation |
| Phantom `.agents/` directory | `runtime-dir` violation |

It also includes valid agent, templated skill and supported runtime-directory examples.

---

## 5. BOUNDARIES

Do not make the broken references resolve.

Do not remove the valid comparison values. They guard against matching valid references too broadly.

Add a new fixture only when the validator gains a distinct reference class or parsing rule.

---

## 6. CONTROL FLOW

```text
validate-command-references.cjs --self-test
   |
   +-- scan broken-command-refs.yaml --> require one or more violations
   |
   `-- scan live command assets --> require zero violations
```

Both conditions must pass for the self-test to succeed.

---

## 7. VALIDATION

Run from the repository root:

```bash
node .opencode/commands/scripts/validate-command-references.cjs --self-test
```

Expected result:

```text
[self-test] broken fixture flags a violation: PASS
[self-test] real tree resolves clean:         PASS
```

---

## 8. RELATED

- [Command validation script](../validate-command-references.cjs)
- [Commands directory](../../)
