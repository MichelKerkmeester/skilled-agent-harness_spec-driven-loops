---
title: "sk-create-goal References"
description: "Index of goal-authoring standards, examples, parent and child workflows, system-spec-kit tools and goal-hook documents."
trigger_phrases:
  - "goal mode references"
  - "goal template renderer"
  - "parent goal chat slice"
  - "nested goal workflow"
  - "goal hook boundary"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---
# sk-create-goal References

Use this index to find the goal contract, content checks, phase binding workflows and owners for session handoff. The packet workflow lives in [`../SKILL.md`](../SKILL.md).

---

## 1. REFERENCE MAP

| Resource | Owner and use |
|---|---|
| [`authoring-standards.md`](authoring-standards.md) | Reader checks for goal objectives, frozen decisions, completion criteria, the volatile log and human voice. |
| [`budget-and-handoff.md`](budget-and-handoff.md) | Durable budget measurement, ordered cuts, chat and objective projections and runtime handoff. |
| [`goal-exemplars.md`](../assets/goal-exemplars.md) | Cited goal excerpts with rubric outcomes for objective and criteria checks. |
| [`parent-and-nested-goals.md`](parent-and-nested-goals.md) | Ordered top-level, phase-parent and child-goal authoring, retrofit, phase-add, precedence and amendment workflows. |
| [`goal.md.tmpl`](../../../system-spec-kit/templates/addons/goal.md.tmpl) | System-spec-kit template for every packet goal. |
| [`create.sh`](../../../system-spec-kit/runtime/cli/spec/create.sh) | System-spec-kit packet scaffolder with the `--with-goal` option. |
| [`inline-gate-renderer.sh`](../../../system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh) | System-spec-kit renderer for a selected goal level. |
| [`goal-set-string-playbook.md`](../../../system-spec-kit/references/workflows/goal-set-string-playbook.md) | Durable budget and chat-slice handoff rules, including objective text. |
| [Goal hooks README](../../../../hooks/goal/README.md) | Runtime goal ownership and session-state boundary. |
| [`goal.cjs`](../../../../hooks/goal/bin/goal.cjs) | Session-free printer for a packet's file-derived goal slices. |
| [`check-goal.cjs`](../scripts/check-goal.cjs) | Read-only checks for phase bindings, template placeholders, criterion count and parent durable budget. |
