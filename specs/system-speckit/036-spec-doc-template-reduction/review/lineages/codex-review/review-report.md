---
title: "Deep Review Report"
trigger_phrases: []
---
# Deep Review Report

## 1. Executive summary

Review target: `specs/system-speckit/036-spec-doc-template-reduction`.

The ten-iteration autonomous review covered correctness, security, traceability, and maintainability. It reached the configured hard ceiling with no P0 findings, five accepted unresolved P1 findings, and four active P2 findings. The final verdict is **CONDITIONAL** and release readiness is **release-blocking** until the scope, runtime-reference, packet-state, and execution-path issues are reconciled.

## 2. Review setup and scope

| Binding | Value |
|---|---|
| Session | `fanout-codex-review-1787856238501-fiz898` |
| Executor | `cli-codex model=gpt-5.6-luna` |
| Mode | review |
| Target type | spec-folder |
| Dimensions | all |
| Lineage mode | auto |
| Stop policy | convergence |
| Maximum iterations | 10 |
| Convergence threshold | 0.1 |
| Artifact directory | `specs/system-speckit/036-spec-doc-template-reduction/review/lineages/codex-review` |

The artifact resolver was bound directly to the supplied lineage override. The resolver command was not run. The target and repository sources were read-only; generated files are confined to this lineage directory.

The target has nine child phases. No target `resource-map.md` exists, so the resource-map gate was not applicable. Code-graph coverage was unavailable to this detached worker; every iteration records graphless fallback and direct search-ledger evidence.

## 3. Method and evidence

Each iteration has a write-once markdown record, a JSONL delta, a fresh prompt, a route marker, cited file/line evidence, and a final verdict line. Typed loop events were appended through the deep-review event gateway. Claims F001-F004 and F009 have typed adjudication records in their iteration packets and were rechecked during stabilization.

The state and evidence protocol used the required core cross-references `spec_code` and `checklist_evidence`, plus the overlays `feature_catalog_code` and `playbook_capability`. The direct-read search ledger has one disposition link per row.

## 4. Findings

### P1 — release-gating

| ID | Finding | Evidence |
|---|---|---|
| F001 | Declared review scope is invalid after the template move | `goal-file-manifest.txt:30-39` names removed `templates/manifest/*` paths; `:71-72` names packet 037 files |
| F002 | Debug-delegation scaffold resolves a removed template path | `scripts/spec/scaffold-debug-delegation.sh:126,136` constructs `manifest/debug-delegation.md.tmpl`; current source is in `templates/addons/` |
| F003 | Completed summaries contradict Draft specs and unchecked task ledgers | phase 007/008 specs remain Draft, tasks remain unchecked, while summaries record `Completed: 2026-08-27` |
| F004 | Phase 007/008 execution documents target the removed manifest tree | phase specs/plans/tasks cite `templates/manifest/*`; current sources use `core/`, `addons/`, `packet-types/`, and root contract assets |
| F009 | Manifest omits in-target phase coverage while admitting packet 037 files | `goal-file-manifest.txt:64-72` omits phase 008/009 document sets while root graph metadata names all nine children |

### P2 — follow-up

| ID | Finding | Evidence |
|---|---|---|
| F005 | Parent completion state is stale relative to the child phase map | root `spec.md:49,103-109` remains Draft with roughly 95% completion while phase 009 summary records completion |
| F006 | Feature-name substitution is fragile for replacement metacharacters | `scripts/spec/create.sh:529-545` interpolates feature-derived values into Perl replacements without local escaping |
| F007 | Maintainer guides still describe the removed manifest directory | templates README/CONTRACT/MIGRATION and changelog retain present-tense `manifest/` references |
| F008 | Packet templates retain template-session and template-tag defaults | `templates/packet-types/review.spec.md.tmpl` and core summary source retain template-only defaults without one post-render invariant |

## 5. Dimension results

| Dimension | Result | Coverage |
|---|---|---|
| Correctness | CONDITIONAL | scope/runtime references, packet state, generator composition, template output residue |
| Security | CONDITIONAL | generator replacement boundary reviewed; no P0, secret exposure, or authorization bypass observed |
| Traceability | CONDITIONAL | manifest, phase docs, parent/child state, graph metadata, and checklist evidence reviewed |
| Maintainability | CONDITIONAL | role-folder docs, template defaults, and stale maintainer references reviewed |

## 6. Cross-reference protocol status

| Protocol | Status | Reason |
|---|---|---|
| `spec_code` | partial | direct claims were read, but stale execution paths and incomplete manifest coverage remain |
| `checklist_evidence` | fail | completed summaries are not backed by checked task ledgers in phases 007/008 |
| `feature_catalog_code` | partial | referenced implementation surfaces were read directly; graph search unavailable |
| `playbook_capability` | partial | direct workflow consumer coverage found F002; graph search unavailable |

## 7. Convergence and stop decision

The final convergence observation had novelty ratio `0`, coverage ratio `1`, finding-stability ratio `0.9`, evidence density `0.96`, and hotspot saturation `0.95`. The weighted observation score was approximately `0.762`. Convergence remained legally blocked by unresolved P1 findings and manifest scope failure. The stop decision was the configured `max-iterations` ceiling at iteration 10, not an early legal convergence.

## 8. Incomplete or blocked gates

- P0/P1 resolution gate: blocked by F001, F002, F003, F004, and F009.
- Scope-complete gate: blocked by stale, incomplete, and cross-packet manifest entries.
- Graph convergence: unavailable, represented by graphless fallback with direct search proof.
- Continuity save: intentionally not requested because the user constrained all writes to this lineage directory and forbade `generate-context.js`.
- Repository validation: intentionally not run because the user forbade `validate.sh` and all out-of-scope writes.

## 9. Remediation direction

1. Regenerate and scope-lock `goal-file-manifest.txt` to the nine in-target phases and current role-based template paths.
2. Repair `scaffold-debug-delegation.sh` through the shared role-folder lookup and add a direct render-path regression.
3. Reconcile Draft/status/task/summary state for phases 007 and 008 before declaring them shipped.
4. Update phase execution documents and maintainer guides to the current template tree.
5. Re-run the authoritative repository validation and targeted generator checks in a separate authorized implementation workflow.

Final verdict: CONDITIONAL
