---
description: "How validate.sh automates spec folder validation, quality gates, template level checks, memory save readiness, and configuration safety."
---
# Validation Workflow

Automated validation of spec folder contents via `validate.sh`.

**Usage:** `.opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder>`

**Exit Codes:**

| Code | Meaning                         | Action                       |
| ---- | ------------------------------- | ---------------------------- |
| 0    | Passed (no errors, no warnings) | Proceed with completion      |
| 1    | Passed with warnings            | Address or document warnings |
| 2    | Failed (errors found)           | MUST fix before completion   |

**Completion Verification:**
1. Run validation: `./scripts/spec/validate.sh <spec-folder>`
2. Exit 2 → FIX errors
3. Exit 1 → ADDRESS warnings or document reason
4. Exit 0 → Proceed with completion claim

**Full documentation:** See [validation_rules.md](../references/validation/validation_rules.md) for all rules, configuration, and troubleshooting.

## Cross-Skill Bridges

- [Document Quality Mode](../../sk-documentation/nodes/mode-document-quality.md) - DQI and markdown quality verification
- [OpenCode Quick Reference](../../sk-code--opencode/nodes/quick-reference.md) - TypeScript/Python/Shell config and standards
- [Web Implementation Workflow](../../sk-code--web/nodes/implementation-workflow.md) - Frontend verification and rollout checks
