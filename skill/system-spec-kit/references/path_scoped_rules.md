# Path-Scoped Validation Rules

> ✅ **IMPLEMENTED** - v1.0.0 (2024-12-24)
> 
> This document describes the path-scoped validation system.
> See `validate-spec.sh` for the implementation.

---

## 1. 📖 Overview

Path-scoped rules enable differentiated validation based on:
- File location (scratch/, memory/, templates/)
- Documentation level (1/2/3)
- File type (spec.md, decision-record.md, etc.)

### Why This Matters

| Scenario                | Without Scoping        | With Scoping                   |
| ----------------------- | ---------------------- | ------------------------------ |
| scratch/ prototypes     | Full validation blocks | Skipped entirely               |
| Level 3 decision record | Same as notes          | ADR-specific checks            |
| Template files          | Placeholder errors     | Exempt from content validation |

---

## 2. 🏗️ Rule Hierarchy

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

## 3. 📂 Path Patterns

### By Directory

| Pattern                                         | Behavior                     |
| ----------------------------------------------- | ---------------------------- |
| `**/scratch/**`                                 | Skip all validation          |
| `**/memory/**`                                  | Minimal validation (planned) |
| `.opencode/skill/system-spec-kit/templates/**` | Skip content validation      |
| `specs/*/`                                      | Level-appropriate validation |

### By Level

| Level | Required Files                                      | Checks Applied                              |
| ----- | --------------------------------------------------- | ------------------------------------------- |
| 1     | spec.md, plan.md, tasks.md                          | FILE_EXISTS, PLACEHOLDER_FILLED, SECTIONS   |
| 2     | Level 1 + checklist.md                              | + P0/P1 section headers                     |
| 3     | Level 2 + decision-record.md                        | + Context/Decision/Consequences sections    |

---

## 4. ✅ Validation Rules

### Implemented Rules

| Rule ID              | Severity | Description                                      |
| -------------------- | -------- | ------------------------------------------------ |
| `FILE_EXISTS`        | ERROR    | Required files present for documentation level   |
| `PLACEHOLDER_FILLED` | ERROR    | No unfilled `[YOUR_VALUE_HERE:]` placeholders    |
| `SECTIONS_PRESENT`   | WARNING  | Required markdown sections exist                 |
| `LEVEL_DECLARED`     | INFO     | Level explicitly stated in spec.md metadata      |
| `PRIORITY_TAGS`      | WARNING  | Validate P0/P1/P2 format in checklists           |
| `EVIDENCE_CITED`     | WARNING  | Verify `[EVIDENCE:]` on completed P0/P1 items    |
| `ANCHORS_VALID`      | ERROR    | Validate `<!-- ANCHOR:id -->` pairs in memory files |

### Placeholder Patterns Detected

- `[YOUR_VALUE_HERE: ...]` - Template placeholder, must be filled
- `[NEEDS CLARIFICATION: ...]` - Ambiguity marker, must be resolved
- `[OPTIONAL: ...]` - NOT flagged (intentionally optional content)

### Section Requirements

| File                | Required Sections                          |
| ------------------- | ------------------------------------------ |
| spec.md             | Problem Statement, Requirements, Scope     |
| plan.md             | Technical Context, Architecture, Implementation |
| checklist.md        | P0, P1 headers                             |
| decision-record.md  | Context, Decision, Consequences            |

---

## 5. 🔧 Usage

### Basic Validation

```bash
# Validate a spec folder
.opencode/skill/system-spec-kit/scripts/validate-spec.sh specs/007-feature/

# JSON output for tooling
.opencode/skill/system-spec-kit/scripts/validate-spec.sh specs/007-feature/ --json

# Strict mode (warnings become errors)
.opencode/skill/system-spec-kit/scripts/validate-spec.sh specs/007-feature/ --strict
```

### Environment Variables

| Variable           | Default | Description                          |
| ------------------ | ------- | ------------------------------------ |
| `SPECKIT_VALIDATION` | true  | Set to `false` to disable validation |
| `SPECKIT_STRICT`   | false   | Set to `true` for strict mode        |
| `SPECKIT_JSON`     | false   | Set to `true` for JSON output        |
| `SPECKIT_VERBOSE`  | false   | Set to `true` for verbose output     |

### Exit Codes

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 0    | Validation passed                    |
| 1    | Validation passed with warnings      |
| 2    | Validation failed (errors found)     |

---

## 6. 🔗 Integration Points

### AGENTS.md Gate 6

Gate 6 (Completion Verification) requires running validation before claiming completion:

```bash
.opencode/skill/system-spec-kit/scripts/validate-spec.sh <spec-folder>
```

### /spec_kit:complete Step 11

Step 11 (Completion) runs validation as the first action.

---

## 7. 🚀 Future Enhancements

Planned but not yet implemented:

1. **Autofix** - Automatic correction of common issues

---

## 8. 🔗 Related Resources

### Reference Files
- [validation_rules.md](./validation_rules.md) - Detailed rule reference
- [level_specifications.md](./level_specifications.md) - Complete Level 1-3 requirements
- [quick_reference.md](./quick_reference.md) - Commands and troubleshooting

### Scripts
- `validate-spec.sh` - Main validation script
- `test-validation.sh` - Test suite for validation

### Related Skills
- `system-spec-kit` - Spec folder workflow orchestrator
