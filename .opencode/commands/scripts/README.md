---
title: "Command Validation Scripts"
description: "Developer reference for command-asset referential integrity checks and their negative test fixtures."
trigger_phrases:
  - "command reference validation"
  - "command asset integrity"
  - "broken command references"
importance_tier: "normal"
---

# Command Validation Scripts

> Validation tooling that detects unresolved agent, skill asset and runtime-directory references in command assets.

---

## 1. OVERVIEW

`.opencode/commands/scripts/` owns repository-level checks shared by command families.

`validate-command-references.cjs` scans command assets for concrete references that should resolve on disk. It ignores parameterized paths, bare directories and supported runtime placeholders that cannot be resolved statically.

---

## 2. DIRECTORY TREE

```text
.opencode/commands/scripts/
+-- fixtures/
|   `-- broken-command-refs.yaml
+-- validate-command-references.cjs
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `validate-command-references.cjs` | Scans command assets and reports unresolved concrete references. |
| `fixtures/broken-command-refs.yaml` | Supplies known-broken references for the checker's negative self-test. |

---

## 4. VALIDATION SCOPE

The checker scans YAML assets under these command families by default:

- `create`
- `deep`
- `design`

It validates three reference classes:

| Class | Check |
|---|---|
| Runtime agent | Confirms the referenced agent filename exists in a supported runtime agent directory. |
| Skill asset | Confirms a concrete file-shaped path under `.opencode/skills/` exists. |
| Runtime directory | Rejects phantom agent directories outside the supported runtime roots. |

---

## 5. FILTERING RULES

The checker skips references that cannot be resolved safely from static text:

- Paths with template placeholders or variables
- Glob patterns
- Bare directory references
- Supported `.codex` runtime-mirror tokens
- Skill paths that do not identify a file

The fixture intentionally contains unresolved references. Do not repair those fixture values because they prove the failing path.

---

## 6. ENTRYPOINTS

Run the default repository scan:

```bash
node .opencode/commands/scripts/validate-command-references.cjs
```

Scan specific files or directories:

```bash
node .opencode/commands/scripts/validate-command-references.cjs <path>
```

Request machine-readable output:

```bash
node .opencode/commands/scripts/validate-command-references.cjs --json
```

---

## 7. VALIDATION

Run the self-test from the repository root:

```bash
node .opencode/commands/scripts/validate-command-references.cjs --self-test
```

Expected result:

```text
[self-test] broken fixture flags a violation: PASS
[self-test] real tree resolves clean:         PASS
```

The command exits with status `0` only when the fixture produces violations and the live command assets resolve cleanly.

---

## 8. RELATED

- [Commands directory](../)
- [Create command assets](../create/assets/)
- [Deep command assets](../deep/assets/)
- [Interface command assets](../interface/assets/)
