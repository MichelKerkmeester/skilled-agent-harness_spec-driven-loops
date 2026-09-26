---
title: "Implementation Plan: Two-Model Deep Review of the Advisor Refinements"
description: "Run /deep:review:auto as a two-lineage fan-out through cli-pi on LLM Gateway, three forced iterations each, over a manifest of the files phases 2 to 5 changed, then check every P0 and P1 finding against the code."
trigger_phrases:
  - "fan-out deep review plan"
importance_tier: "normal"
contextType: "review"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Two-Model Deep Review of the Advisor Refinements

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | The deep-loop review workflow and its fan-out runner |
| **Framework** | `/deep:review:auto`, `deep-review-auto.yaml`, `fanout-run.cjs` with the `cli-pi` executor kind |
| **Storage** | `review/` in this folder: lineage state, merged registry, report and ledger events |
| **Testing** | Iteration counts per lineage, the fan-out summary, and the orchestrator's check of each P0 and P1 finding |

### Overview
The review target is this folder with type `spec-folder`, so the workflow takes its scope from `goal-file-manifest.txt` and nothing else. Two lineages run in parallel through cli-pi on LLM Gateway: `mimo` on `mimo-v2.6-pro` at `high` and `deepseek` on `deepseek-v4.1-flash` at `max`, each for three iterations under `--stop-policy=max-iterations`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out review: independent lineages, one merged registry, one report. Agreement across two model families is evidence only where each lineage found the issue on its own.

### Key Components
- **Manifest** (`goal-file-manifest.txt`): repo-relative paths, validated by the workflow before dispatch.
- **Fan-out runner**: one lineage per `--executor` group under `review/lineages/<label>/`.
- **Merge and close**: `fanout-merge.cjs` writes the root registry; the convergence step, fixed in phase 5, records `synthesis_complete` without a root dashboard.

### Data Flow
Setup binds the target, type, dimensions and executors, and writes `review/deep-review-config.json`. Each lineage runs three iterations and writes its own state, deltas and report. The merge rolls findings up by severity, the synthesis writes `review/review-report.md`, and the orchestrator checks each P0 and P1 finding against the cited code.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Before launch, ping both models through the exact route the fan-out builds. After the run, count iteration records per lineage, read each terminal stop reason, read the fan-out summary for containment advisories, and open every cited line behind a P0 or P1 finding.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 005-follow-up-fixes for the review close.
- LLM Gateway credit for both models.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The run writes only under `review/`. Removing that directory undoes it.
<!-- /ANCHOR:rollback -->

---
