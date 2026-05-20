---
title: "Spec folder literal naming: AI-derived slugs"
description: "Workflow YAMLs and SKILL.md rule 20 require AI agents to propose phase and remediation slugs with a specific subject token, so AI-derived spec folders never default to generic placeholders."
---

# Spec folder literal naming: AI-derived slugs

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 1. OVERVIEW

Workflow YAMLs and SKILL.md rule 20 require AI agents to propose phase and remediation slugs with a specific subject token, so AI-derived spec folders never default to generic placeholders.

This is the AI-rule layer of the literal-naming discipline that complements the create.sh fallback. Two surfaces carry the rule: the four spec-kit plan and complete workflow YAML files describe a `Generate LITERAL phase names` activity, and `system-spec-kit/SKILL.md` ALWAYS rule 20 names the source and target tokens that every remediation packet slug must carry. Both surfaces share the same stoplist so a single set of validators can catch generic names regardless of which slot produced the slug.

---

## 2. CURRENT REALITY

The workflow side lives in four YAML assets at `.opencode/commands/spec_kit/assets/`. Each file contains a `Generate LITERAL phase names` activity that tells the active CLI agent to produce phase names with specific subject tokens drawn from the user request, naming the concrete component or behavior being changed. The activity explicitly forbids the generic stoplist (`phase-1`, `phase-2`, `remediation`, `cleanup`, `fix`, `refactor`, `setup`) when used standalone. The activity fires only when a `:with-phases` route is active, so the rule binds to the phase-decomposition entry point rather than every spec-kit command.

The SKILL.md side adds ALWAYS rule 20, `REMEDIATION PACKET NAMING`. Rule 20 governs slugs proposed by an AI agent after a deep-review FAIL verdict or other AI-derived remediation event. The slug must follow `NNN-fix-<source>-for-<target>`, where the source names the trigger (such as `deep-review-p0-p1-findings`, `verdict-fail`, or `audit-finding-NN`) and the target names the specific component being fixed (such as `skill-local-benchmarks-format` or `mk-spec-memory-handler`). Bare slugs such as `remediation`, `cleanup`, `fix`, `phase-N`, `round-N`, and `review-remediation` are forbidden as standalone names. The rule is documentation-layer guidance and is not linted by `validate.sh`; enforcement currently happens through workflow surfacing and operator review.

Together these surfaces close the loop with the create.sh fallback. The fallback prevents stale generic names from reaching disk when the operator omits `--phase-names`. The workflow YAML and SKILL.md rule push AI agents to propose literal names in the first place, so the placeholder rarely needs to fire. Stress-test scenarios PHASE-008 and PHASE-009 rotate the same prompt through multiple external CLIs and check whether each CLI honors the rule.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/commands/spec_kit/assets/spec_kit_plan_auto.yaml` | Workflow asset | Carries the Generate LITERAL phase names activity for plan in auto mode |
| `.opencode/commands/spec_kit/assets/spec_kit_plan_confirm.yaml` | Workflow asset | Carries the Generate LITERAL phase names activity for plan in confirm mode |
| `.opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml` | Workflow asset | Carries the Generate LITERAL phase names activity for complete in auto mode |
| `.opencode/commands/spec_kit/assets/spec_kit_complete_confirm.yaml` | Workflow asset | Carries the Generate LITERAL phase names activity for complete in confirm mode |
| `.opencode/skills/system-spec-kit/SKILL.md` | Skill | ALWAYS rule 20 (REMEDIATION PACKET NAMING) defining source/target slug structure for AI-derived remediation packets |

### Validation And Tests

| File | Focus |
|------|-------|
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/008-spec-folder-literal-naming-cli-driven-slug.md` | Playbook scenario PHASE-008 rotating the Generate LITERAL phase names prompt through multiple external CLIs |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/009-spec-folder-literal-naming-remediation-rule.md` | Playbook scenario PHASE-009 rotating the rule-20 remediation prompt through multiple external CLIs |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/40-spec-folder-literal-naming-ai-derived-slugs.md`
