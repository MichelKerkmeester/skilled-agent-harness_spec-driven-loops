---
title: Deep Review Report — mcp-obsidian Plugin Coverage
description: Final synthesis for the detached luna-max review lineage.
---

# Deep Review Report

## 1. Executive Summary

- Verdict: `CONDITIONAL`
- `hasAdvisories`: `false`
- Active findings: P0=0, P1=2, P2=2
- Stop reason: `maxIterationsReached` after 10 of 10 iterations
- Dimension coverage: 4/4 (`correctness`, `security`, `traceability`, `maintainability`)
- Release-readiness state: `in-progress`
- Scope: read-only review of `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review` and the declared mcp-obsidian skill surfaces.

The shipped router and plugin inventory cover all eleven reviewed plugin families. The material gaps are the missing normative inputs in the declared spec-folder target and stale overview prose in the shared plugin-operation contract. Two lower-severity maintainability issues remain around explicit verification boundaries and playbook metadata.

`resource-map.md` was absent when the lineage initialized, so the Resource Map Coverage Gate was skipped.

## 2. Planning Trigger

The conditional verdict routes to `/speckit:plan`. Remediation should first restore the target packet's normative evidence files, then reconcile the shared contract prose with the eleven-row implementation map. The P2 items can follow in the same documentation-maintenance workstream but do not independently block the conditional review.

## 3. Active Finding Registry

| ID | Severity | Dimension | Status | Evidence | First seen | Last seen |
|---|---|---|---|---|---:|---:|
| F001 | P1 | traceability | active | `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:3` | 3 | 10 |
| F002 | P1 | traceability | active | `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/plugin-operation-logic.md:26`, `:118` | 3 | 10 |
| F003 | P2 | maintainability | active | `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/charts/data-model.md:133` | 4 | 10 |
| F004 | P2 | maintainability | active | `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:3` | 4 | 10 |

### F001 — Target packet lacks normative review inputs

The declared spec-folder target has no `spec.md`, `plan.md`, `tasks.md`, or `checklist.md`. That leaves the hard `spec_code` and `checklist_evidence` protocols without normative evidence inputs.

### F002 — Shared plugin contract omits six newer plugin families

The operation contract's overview and loader note name only Beancount, Tables, BRAT, Health.md, and Iconic, while the surrounding data map and router cover eleven families. The omitted families are Charts, Dataview, Excalidraw, Git, Outliner, and Minimal.

### F003 — Newer data models retain explicit verification debt

Seventeen `VERIFY` markers remain across six newer data models. The uncertainty is labeled and bounded, so this remains P2 rather than an unsupported-fact P1.

### F004 — Playbook package metadata is stale

The playbook frontmatter and opening description still say three plugin tie-ins, while the body and scenario index enumerate eleven.

## 4. Remediation Workstreams

1. **Restore core packet evidence — F001.** Add the target packet's normative `spec.md`, `plan.md`, `tasks.md`, and `checklist.md`; link each acceptance claim to the shipped skill and replay evidence.
2. **Reconcile the shared contract — F002.** Update the overview and loader note to describe all eleven plugin families, or explicitly label the five-family prose as historical scope.
3. **Close bounded verification debt — F003.** Resolve the seventeen explicit `VERIFY` boundaries or keep them in a maintained, clearly non-authoritative section with source references.
4. **Refresh playbook metadata — F004.** Change the package description and opening inventory to match the eleven tie-ins and current scenario count.

## 5. Spec Seed

- Define the eleven-plugin coverage invariant across router intent signals, resource mappings, reference sets, catalog cards, and manual-testing tie-ins.
- Define the target packet's required evidence files and the `spec_code` / `checklist_evidence` reconciliation rule.
- Record the distinction between authoritative schema claims and explicitly bounded `VERIFY` assertions.
- Require shared overview prose and package metadata to reconcile with the current eleven-row inventory.

## 6. Plan Seed

| Order | Task | Findings | Evidence to close |
|---:|---|---|---|
| 1 | Create and populate the missing target packet docs. | F001 | All four files exist and cite implementation and checklist evidence. |
| 2 | Expand or relabel the shared plugin-operation overview and loader note. | F002 | The prose reconciles with all eleven rows and the router. |
| 3 | Resolve or explicitly maintain the seventeen verification boundaries. | F003 | Each marker has an authoritative source or an approved bounded status. |
| 4 | Update playbook frontmatter and opening metadata. | F004 | Metadata matches the eleven tie-ins and current index. |
| 5 | Re-run the review's core traceability checks. | F001, F002 | `spec_code` and `checklist_evidence` both pass; overlay checks remain consistent. |

## 7. Traceability Status

| Protocol | Gate | Status | Evidence |
|---|---|---|---|
| `spec_code` | hard | partial | Target packet has no normative `spec.md` or `plan.md`; see F001. |
| `checklist_evidence` | hard | partial | Target packet has no `checklist.md`; see F001. |
| `feature_catalog_code` | advisory | pass | Feature catalog declares eleven plugin entries and all eleven cards are present. |
| `playbook_capability` | advisory | partial | Eleven tie-ins are indexed, but package metadata is stale; see F004. |

The route/resource/selection matrix covered 11/11 plugin rows. The scoped Markdown link sweep checked 132 files and 458 relative links with no missing target in the reviewed package.

## 8. Deferred Items

- F003 and F004 remain P2 suggestions and should be included in the remediation plan.
- The review did not infer live Obsidian behavior where the references explicitly mark a `VERIFY` boundary.
- Prior stale claims that Health.md routing was absent and that the Beancount scenario lacked scratch isolation were ruled out against the current tree; no new P0 or implementation-coverage finding was supported.
- No resource-map coverage findings were emitted because the target had no `resource-map.md` at initialization.

## 9. Audit Appendix

### Iteration Replay

| Iteration | Focus dimension | New-finding ratio | Findings P0/P1/P2 | Stop telemetry |
|---:|---|---:|---|---|
| 1 | correctness | 0.00 | 0/0/0 | continue — max-iterations policy |
| 2 | security | 0.00 | 0/0/0 | continue — max-iterations policy |
| 3 | traceability | 1.00 | 0/2/0 | continue — max-iterations policy |
| 4 | maintainability | 0.50 | 0/2/2 | continue — max-iterations policy |
| 5 | correctness | 0.00 | 0/2/2 | continue — convergence is telemetry only |
| 6 | security | 0.00 | 0/2/2 | continue — convergence is telemetry only |
| 7 | traceability | 0.00 | 0/2/2 | continue — convergence is telemetry only |
| 8 | maintainability | 0.00 | 0/2/2 | continue — convergence is telemetry only |
| 9 | correctness | 0.00 | 0/2/2 | continue — convergence is telemetry only |
| 10 | maintainability | 0.00 | 0/2/2 | stop — `maxIterationsReached` |

### Evidence and State Checks

- All ten iteration narratives end with exactly one machine-readable review verdict.
- All ten canonical state records include `mode=review`, `target_agent=deep-review`, `agent_definition_loaded=true`, and a resolved route proof.
- All ten per-iteration delta files are present and contain an iteration record.
- The append-only state log contains ten iterations, two passing claim-adjudication events for F001/F002, and one synthesis-complete event.
- The reducer produced a registry with P0=0, P1=2, P2=2, four covered dimensions, and zero JSONL corruption warnings.
- All generated artifacts are bound to `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review/lineages/luna-max`.

Review verdict: CONDITIONAL
