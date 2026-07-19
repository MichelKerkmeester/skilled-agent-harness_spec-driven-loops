---
title: "Spec folder literal naming: AI-derived slugs"
description: "Workflow YAMLs and SKILL.md rule 20 require AI agents to propose phase and remediation slugs with a specific subject token, so AI-derived spec folders never default to generic placeholders."
trigger_phrases:
  - "spec folder literal naming ai-derived slugs"
  - "remediation packet naming"
  - "ai-derived slug rule"
  - "generate literal phase names"
  - "SKILL.md rule 20"
version: 3.6.0.8
---

# Spec folder literal naming: AI-derived slugs

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Workflow YAMLs and SKILL.md rule 20 require AI agents to propose phase and remediation slugs with a specific subject token, so AI-derived spec folders never default to generic placeholders.

This is the AI-rule layer of the literal-naming discipline that complements the create.sh fallback. Two surfaces carry the rule: the four spec-kit plan and complete workflow YAML files describe a `Generate LITERAL phase names` activity, and `system-spec-kit/SKILL.md` ALWAYS rule 20 names the source and target tokens that every remediation packet slug must carry. Both surfaces share the same stoplist so a single set of validators can catch generic names regardless of which slot produced the slug.

---

## 2. HOW IT WORKS

The workflow side lives in four YAML assets at `.opencode/commands/speckit/assets/`. Each file contains a `Generate LITERAL phase names` activity that tells the active CLI agent to produce phase names with specific subject tokens drawn from the user request, naming the concrete component or behavior being changed. The activity explicitly forbids the generic stoplist (`phase-1`, `phase-2`, `remediation`, `cleanup`, `fix`, `refactor`, `setup`) when used standalone. The activity fires only when a `:with-phases` route is active, so the rule binds to the phase-decomposition entry point rather than every spec-kit command.

The SKILL.md side adds ALWAYS rule 20, `REMEDIATION PACKET NAMING`. Rule 20 governs slugs proposed by an AI agent after a deep-review FAIL verdict or other AI-derived remediation event. The slug must follow `NNN-fix-<source>-for-<target>`, where the source names the trigger (such as `deep-review-p0-p1-findings`, `verdict-fail`, or `audit-finding-NN`) and the target names the specific component being fixed (such as `skill-local-benchmarks-format` or `mk-spec-memory-handler`). Bare slugs such as `remediation`, `cleanup`, `fix`, `phase-N`, `round-N`, and `review-remediation` are forbidden as standalone names. The rule is documentation-layer guidance and is not linted by `validate.sh`; enforcement currently happens through workflow surfacing and operator review.

Together these surfaces close the loop with the create.sh fallback. The fallback prevents stale generic names from reaching disk when the operator omits `--phase-names`. The workflow YAML and SKILL.md rule push AI agents to propose literal names in the first place, so the placeholder rarely needs to fire. Stress-test scenarios PHASE-008 and PHASE-009 rotate the same prompt through multiple external CLIs and check whether each CLI honors the rule.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/commands/speckit/assets/speckit-plan-auto.yaml` | Workflow asset | Carries the Generate LITERAL phase names activity for plan in auto mode |
| `.opencode/commands/speckit/assets/speckit-plan-confirm.yaml` | Workflow asset | Carries the Generate LITERAL phase names activity for plan in confirm mode |
| `.opencode/commands/speckit/assets/speckit-complete-auto.yaml` | Workflow asset | Carries the Generate LITERAL phase names activity for complete in auto mode |
| `.opencode/commands/speckit/assets/speckit-complete-confirm.yaml` | Workflow asset | Carries the Generate LITERAL phase names activity for complete in confirm mode |
| `.opencode/skills/system-spec-kit/SKILL.md` | Skill | ALWAYS rule 20 (REMEDIATION PACKET NAMING) defining source/target slug structure for AI-derived remediation packets |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-cli-driven-slug.md` | Manual playbook | Playbook scenario PHASE-008 rotating the Generate LITERAL phase names prompt through multiple external CLIs |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-remediation-rule.md` | Manual playbook | Playbook scenario PHASE-009 rotating the rule-20 remediation prompt through multiple external CLIs |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/spec-folder-literal-naming-ai-derived-slugs.md`
Related references:
- [spec-folder-literal-naming-create-sh-fallback.md](../../feature-catalog/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md) — Spec folder literal naming: create.sh fallback
- [debug-delegation-scaffold-generator.md](../../feature-catalog/tooling-and-scripts/debug-delegation-scaffold-generator.md) — Debug-delegation scaffold generator
