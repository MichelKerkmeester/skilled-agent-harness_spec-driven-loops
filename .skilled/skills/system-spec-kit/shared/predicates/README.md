---
title: "Predicates: Typed YAML predicate grammar"
description: "Shared parser, validator and evaluator for typed YAML when-field predicates."
trigger_phrases:
  - "boolean expression"
  - "when field validation"
  - "YAML predicate grammar"
  - "typed predicates"
  - "parse when field"
---

# Predicates: Typed YAML predicate grammar

> Typed predicate utilities for command YAML `when:` fields.

---

## 1. OVERVIEW

`shared/predicates/` owns the typed predicate grammar used for YAML `when:` values that need mechanical evaluation. It accepts the canonical object form and the bounded legacy string form, then returns typed results instead of evaluating arbitrary text.

Current state:

- `BooleanExpr` supports `==`, `!=`, `in` and `not_in` operators.
- Legacy strings such as `intake_only == TRUE` still parse through a restricted grammar.
- Prose timing notes are rejected from `when:` and should move to `after:`.

---

## 2. DIRECTORY TREE

```text
predicates/
+-- boolean-expr.ts
`-- boolean-expr.test.ts
```

---

## 3. KEY FILES

| Filename | Responsibility |
| -------- | -------------- |
| `boolean-expr.ts` | Defines predicate types, parsers, object validation, evaluation and prose-bleed detection |
| `boolean-expr.test.ts` | Covers string parsing, object validation, unified `when:` parsing and evaluator behavior |

---

## 4. STABLE API

| Function | Purpose |
| -------- | ------- |
| `parseBooleanExprString` | Parses a legacy string predicate into a typed `BooleanExpr` result |
| `validateBooleanExpr` | Validates YAML object-form predicates with `{ field, op, value }` shape |
| `parseWhenField` | Accepts either string or object `when:` values and normalizes them to one result shape |
| `evaluateBooleanExpr` | Evaluates a typed predicate against runtime bindings and reports unbound fields |
| `findProseBleed` | Detects timing prose that should not live inside executable `when:` fields |

---

## 5. BOUNDARIES

No internal imports within `predicates/`. Module exists for typed YAML when-field validation. Current production callers: TBD as the validator is wired into the YAML intake path.

Keep this folder focused on grammar, validation and pure evaluation. Runtime YAML loading, command execution and workflow routing should stay in their owning packages.

---

## 6. VALIDATION

Run predicate coverage from the repository root:

```bash
vitest run shared/predicates
```

Expected result: exit `0`.

Validate this README with:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/shared/predicates/README.md
```

---

## 7. RELATED

| Document | Purpose |
| -------- | ------- |
| [shared/parsing/README.md](../parsing/README.md) | Peer shared package README pattern |
| runtime executor hardening research | S7 and M11 source context for typed YAML predicate grammar |
