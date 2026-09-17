---
title: Path-Scoped Validation Rules
description: Path-scoped validation system for differentiated validation based on file location, level, and type
trigger_phrases:
  - "path-scoped validation rules"
  - "validation rule hierarchy"
  - "placeholder pattern detection"
  - "location-based validation"
importance_tier: important
contextType: implementation
version: 3.6.0.26
---

# Path-Scoped Validation Rules - Location-Based Validation

Path-scoped validation for differentiated rules based on file location, level, and type.

---

## 1. OVERVIEW

Path-scoped rules enable differentiated validation based on:
- File location (scratch/, memory/, templates/)
- Documentation level (1/2/3/3+/phase parent)
- File type (spec.md, decision-record.md, etc.)

### Why This Matters

| Scenario                | Without Scoping        | With Scoping                   |
| ----------------------- | ---------------------- | ------------------------------ |
| scratch/ prototypes     | Full validation blocks | Skipped entirely               |
| Level 3 decision record | Same as notes          | ADR-specific checks            |
| Template files          | Placeholder errors     | Exempt from content validation |

---

## 2. RULE HIERARCHY

```
GLOBAL RULES (always apply)
    ↓
LEVEL RULES (by documentation level)
    ↓
PATH RULES (by file pattern)
    ↓
ENVIRONMENT OVERRIDES (runtime control)
```

---

## 3. PATH PATTERNS

### By Directory

| Pattern                                        | Behavior                     |
| ---------------------------------------------- | ---------------------------- |
| `**/scratch/**`                                | Skip all validation          |
| `**/memory/**`                                 | Minimal validation (generated continuity support artifacts validated by ANCHORS_VALID only) |
| `.opencode/skills/system-spec-kit/templates/**` | Skip content validation      |
| `specs/**/`                                    | Level-appropriate validation (recursive through nested packet families) |
| `<active-spec-folder>/**/`                          | Level-appropriate validation (recursive through nested packet families) |

### By Level

| Level | Required Files               | Checks Applied                            |
| ----- | ---------------------------- | ----------------------------------------- |
| 1     | spec.md, plan.md, tasks.md   | FILE_EXISTS, PLACEHOLDER_FILLED, SECTIONS |
| 2     | Level 1 + acceptance-criteria.md       | + P0/P1 section headers                   |
| 3     | Level 2 + decision-record.md | + Context/Decision/Consequences sections  |

---

## 4. VALIDATION RULES

### Implemented Rules

| Rule ID              | Severity | Description                                         |
| -------------------- | -------- | --------------------------------------------------- |
| `FILE_EXISTS`        | ERROR    | Required files present for documentation level      |
| `PLACEHOLDER_FILLED` | ERROR    | No unfilled `[YOUR_VALUE_HERE:]` placeholders       |
| `LEVEL_DECLARED`     | INFO     | Level explicitly stated in spec.md metadata         |
| `ANCHORS_VALID`      | ERROR    | Validate `<!-- ANCHOR:id -->` pairs in spec docs (spec.md, plan.md, tasks.md, acceptance-criteria.md, decision-record.md, implementation-summary.md) and generated continuity support artifacts |

> **Partial reference:** This table lists a commonly-encountered subset. The authoritative, complete rule set lives in [`runtime/cli/lib/validator-registry.json`](../../runtime/cli/lib/validator-registry.json).

### Placeholder Patterns Detected

- `[YOUR_VALUE_HERE: ...]` - Template placeholder, must be filled
- `[NEEDS_CLARIFICATION: ...]` / `[NEEDS CLARIFICATION: ...]` - Ambiguity marker, must be resolved
- `[OPTIONAL: ...]` - NOT flagged (intentionally optional content)

### Section Requirements

| File               | Required Sections                               |
| ------------------ | ----------------------------------------------- |
| spec.md            | Problem Statement, Requirements, Scope          |
| plan.md            | Technical Context, Architecture, Implementation |
| tasks.md           | P0, P1 headers in the verification region        |
| decision-record.md | Context, Decision, Consequences                 |

---

## 5. USAGE

### Basic Validation

```bash
# Validate a spec folder
.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/007-feature/

# JSON output for tooling
.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/007-feature/ --json

# Strict mode (strict-only rules run; warnings stay advice)
.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/007-feature/ --strict
```

### Environment Variables

| Variable                  | Default | Description                                          |
| ------------------------- | ------- | ---------------------------------------------------- |
| `SPECKIT_VALIDATION`      | true    | Set to `false` to disable validation                 |
| `SPECKIT_STRICT`          | false   | Set to `true` for strict mode                        |
| `SPECKIT_JSON`            | false   | Set to `true` for JSON output                        |
| `SPECKIT_VERBOSE`         | false   | Set to `true` for verbose output                     |
| `SPECKIT_SKIP_VALIDATION` | unset   | Set to any value to skip validation entirely         |
| `SPECKIT_QUIET`           | false   | Set to `true` for quiet output                       |
| `SPECKIT_RULES`           | unset   | Comma-separated rule subset (e.g. `FILE_EXISTS,LEVEL_DECLARED`). Narrows which rules run; it never changes how a rule decides. An unrecognised name is a hard error, so a typo cannot silently reduce the run to nothing. |

### Exit Codes

| Code | Meaning                          |
| ---- | -------------------------------- |
| 0    | Success                          |
| 1    | User error such as bad flags     |
| 2    | Validation error                 |
| 3    | System error such as missing folder or file I/O failure |

---

## 6. INTEGRATION POINTS

### AGENTS.md Completion Verification Rule

The Completion Verification Rule requires running validation before claiming completion:

```bash
.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh <spec-folder>
```

### /speckit:complete Step 11

Step 11 (Completion) runs validation as the first action.

---

## 7. FUTURE ENHANCEMENTS

Planned but not yet implemented:

1. **Autofix** - Automatic correction of common issues

---

## 8. RELATED RESOURCES

### Reference Files
- [Validation Rules](validation-rules.md) - Detailed rule reference
- Level specifications reference - Complete Level 1-3 requirements
- [Quick Reference](../workflows/quick-reference.md) - Commands and troubleshooting

### Scripts
- `../../runtime/cli/spec/validate.sh` - Main validation script
- `../../runtime/cli/tests/test-validation.sh` - Test suite for validation

### Related Skills
- `system-spec-kit` - Spec folder workflow orchestrator

---
