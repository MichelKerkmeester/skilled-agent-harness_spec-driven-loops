# Deep Review Strategy - Detached Codex Lineage

## 1. OVERVIEW

Review the phase-parent packet `specs/system-speckit/036-spec-doc-template-reduction` and the implementation surfaces it names. This lineage is autonomous and read-only with respect to the target; all generated review state is confined to this lineage directory.

## 2. REVIEW DIMENSIONS

<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness — generator, validator, status, and packet-state behavior (iterations 1-5, 7, 9-10)
- [x] D2 Security — path handling, input handling, trust boundaries, and unsafe omission (iterations 5, 9-10)
- [x] D3 Traceability — spec claims, checklist evidence, manifests, graph metadata, and cross-references (iterations 1-4, 8-10)
- [x] D4 Maintainability — template structure, stale documentation, duplication, and operator legibility (iterations 6-7, 9-10)
<!-- MACHINE-OWNED: END -->

## 3. STOP CONDITIONS

- Legal convergence under the review contract: rolling ratio threshold, MAD, dimension coverage, weighted score, coverage age, evidence, scope, and no active P0/P1 gate failure.
- Hard ceiling: 10 iterations.
- Active P0 overrides convergence; active P1 keeps the release-readiness verdict conditional/blocking.

## 4. RUNNING FINDINGS

<!-- MACHINE-OWNED: START -->
- P0: 0
- P1: 0
- P2: 0
- Delta this iteration: initialization
<!-- MACHINE-OWNED: END -->

## 5. REVIEW ORDER AND SEARCH LEDGER

1. Inventory and scope integrity, including the goal-file manifest and role-based template move.
2. Correctness of the direct runtime consumers and scaffold paths.
3. Traceability across parent/child packet state, implementation summaries, tasks, and graph metadata.
4. Security and input-boundary review of generator and validator paths.
5. Maintainability and stale-reference sweep, followed by an adversarial stabilization pass.

The graph is unavailable to this detached worker, so every iteration records `graphless_fallback` coverage with direct-read and search proof. Each search-ledger row has exactly one disposition link.

## 6. CROSS-REFERENCE PROTOCOLS

<!-- MACHINE-OWNED: START -->
| Protocol | Type | Status | Evidence |
|----------|------|--------|----------|
| `spec_code` | core | partial | F001, F003, F004, F009 |
| `checklist_evidence` | core | fail | F003 |
| `feature_catalog_code` | overlay | partial | direct reads; graphless fallback |
| `playbook_capability` | overlay | partial | F002 direct consumer read; graphless fallback |
<!-- MACHINE-OWNED: END -->

## 7. KNOWN CONTEXT

- The target has nine child phases; the root graph metadata names all nine children.
- The goal-file manifest still names the removed `templates/manifest/` tree and also names two files from packet 037.
- The actual template tree is split into `core/`, `addons/`, and `packet-types/`, with the contract at the template root.
- `scaffold-debug-delegation.sh` directly constructs a `manifest/` template path.
- Phases 007 and 008 have completed implementation summaries while their specs remain Draft and their task lists remain unchecked.
- No `resource-map.md` is present in the target; the resource-map gate is not applicable.

## 8. WRITE BOUNDARY

Only this lineage directory may be created or changed. The target, repository tooling, Git state, generated context, and validators are not modified or invoked.

## 9. NEXT FOCUS

Initialization complete. Begin with D1/D3 scope and cross-reference integrity.

## 10. FINAL STATE

<!-- MACHINE-OWNED: START -->
- Iterations completed: 10/10
- Stop reason: max-iterations
- Final verdict: CONDITIONAL
- Release readiness: release-blocking
- Active findings: P0=0, P1=5, P2=4
- Dimensions covered: correctness, security, traceability, maintainability
- Graph mode: graphless_fallback
- Continuity save: skipped by explicit containment constraint
<!-- MACHINE-OWNED: END -->

## 11. RULED OUT DIRECTIONS

- Root graph child linkage is present for all nine phases; no orphan-graph finding was retained.
- No target resource map exists; resource-map coverage is not applicable.
- No P0, secret exposure, or authorization-bypass finding was observed in the reviewed surfaces.

## 12. NEXT FOCUS

Synthesis complete. Route F001-F004 and F009 to an authorized implementation/remediation workflow; retain F005-F008 as follow-up.

## 13. KNOWN CONTEXT

- The actual template tree is role-based: `core/`, `addons/`, `packet-types/`, and root contract assets.
- The manifest and several phase documents still describe the removed `manifest/` layout.
- Phase 007/008 task evidence and status metadata are inconsistent with their implementation summaries.
- The graph was unavailable to this detached worker; direct-read fallback evidence is recorded in all ten iterations.

## 14. CROSS-REFERENCE STATUS

<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | F001, F003, F004, F009 |
| `checklist_evidence` | core | fail | F003 |
| `feature_catalog_code` | overlay | partial | direct reads; graphless fallback |
| `playbook_capability` | overlay | partial | F002 |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW

The complete machine scope is recorded in `deep-review-config.json`. It covers the root packet, all nine child phases, current role-based templates, direct runtime consumers, and maintainer documentation cited by the findings.

## 16. REVIEW BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.10
- Stop policy: convergence
- Session: `fanout-codex-review-1787856238501-fiz898`
- Artifact-only writes: this lineage directory
- No target fixes, generated context, repository validation, or Git write operations
