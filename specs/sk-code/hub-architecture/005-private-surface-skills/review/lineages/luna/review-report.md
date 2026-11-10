# Deep Review Report — Private Surface Skills

## 1. Executive Summary

- **Overall verdict:** CONDITIONAL
- **hasAdvisories:** false
- **Active findings:** 0 P0, 1 P1, 2 P2
- **Review scope:** the `specs/sk-code/013-private-surface-skills` packet and its named commit guard, advisor scan, retrieval, CI, catalog, and playbook surfaces. Five iterations covered correctness, security, traceability, and maintainability, with the fifth pass used for stabilization.
- **Stop reason:** `maxIterationsReached` after iteration 5. Convergence remained telemetry through the cap.
- **Release readiness:** in-progress.

The packet's parent and goal claim completion while phase 2's closure criterion AC-014 remains Unmet. Two lower-severity findings concern a staged type-change edge in the local-skill commit guard and an omitted CI freshness scan in the phase 3 scanner inventory. The final stabilization pass rechecked the active findings and found the retrieval corpus and advisor readers/watchers apply their ignore or trusted-root checks before traversing local skill content.

This lineage is **not scope-clean**. Iteration 1 records an earlier continuity/context write outside the authorized lineage. The YAML's graph upserts were skipped, and configured resource-map emission was skipped because its output would be outside this lineage. These execution conflicts do not change the review verdict.

## 2. Planning Trigger

`/speckit:plan` is required to reconcile the active P1 completion-state finding and plan the two P2 remediations. The active finding data below combines the reducer's active registry with structured `findingDetails` from the iteration records.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "LUNA-R1-P1-001",
      "severity": "P1",
      "title": "Packet completion status contradicts active phase records",
      "file": "specs/sk-code/013-private-surface-skills/spec.md:50",
      "findingClass": "phase_status_drift",
      "affectedSurfaceHints": ["packet-status", "phase-transition", "completion-gate"]
    },
    {
      "id": "LUNA-R2-P2-001",
      "severity": "P2",
      "title": "Staged type-change paths bypass the local-skill guard",
      "file": ".skilled/scripts/git-hooks/pre-commit:111",
      "findingClass": "commit_guard_diff_filter_gap",
      "affectedSurfaceHints": ["pre-commit-guard", "private-skill-path", "publication-boundary"]
    },
    {
      "id": "LUNA-R4-P2-001",
      "severity": "P2",
      "title": "The scanner inventory omits the derived-freshness root scan",
      "file": "specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/spec.md:164",
      "findingClass": "scanner_inventory_omission",
      "affectedSurfaceHints": ["scanner-inventory", "local-skill-exclusion", "derived-freshness-gate"]
    }
  ],
  "remediationWorkstreams": [
    {
      "priority": "P1",
      "title": "Reconcile packet completion with phase 2 closure evidence",
      "findingIds": ["LUNA-R1-P1-001"],
      "actions": ["Resolve AC-014 using its stated commit, push, and validator evidence; then align parent and goal status with the child phase records."]
    },
    {
      "priority": "P2",
      "title": "Close the staged type-change guard edge",
      "findingIds": ["LUNA-R2-P2-001"],
      "actions": ["Include type-change entries in the staged-path guard scan and add focused harness coverage for a tracked local-* path changing type."]
    },
    {
      "priority": "P2",
      "title": "Inventory and align the derived-freshness scanner",
      "findingIds": ["LUNA-R4-P2-001"],
      "actions": ["List the CI freshness scan in the phase 3 inventory and use the canonical root enumerator or explicitly exclude local-* names."]
    }
  ],
  "specSeed": [
    "Reconcile the root completion claim with phase 2 AC-014 and current phase status.",
    "Document the derived-freshness gate as a separate skill-root scan and define its local-* behavior."
  ],
  "planSeed": [
    "Update the pre-commit status filter to cover staged type changes and prove the edge in the real-hook harness.",
    "Align ci-skill-derived-freshness root enumeration with the canonical local-* exclusion policy.",
    "Re-run the phase acceptance and parent-status evidence after remediation."
  ],
  "findingClasses": ["phase_status_drift", "commit_guard_diff_filter_gap", "scanner_inventory_omission"],
  "affectedSurfacesSeed": ["packet-status", "phase-transition", "completion-gate", "pre-commit-guard", "private-skill-path", "publication-boundary", "scanner-inventory", "local-skill-exclusion", "derived-freshness-gate"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### LUNA-R1-P1-001 — P1: Packet completion status contradicts active phase records

- **Dimension / class:** correctness / `phase_status_drift`
- **Location:** `specs/sk-code/013-private-surface-skills/spec.md:50`
- **Evidence:** parent Status is Complete at `spec.md:50`; its phase map still shows phase 2 in progress and phase 3 pending at `spec.md:136`; goal completion boxes are checked at `goal.md:89`; phase 2's closure rule requires every row to be Met, Waived, or Superseded at `002-hub-surface-removal/acceptance-criteria.md:33-35`; AC-014 remains Unmet at line 70.
- **Impact:** the parent and goal present the packet as complete while a child phase's explicit closeability contract remains unsatisfied.
- **Recommendation:** satisfy AC-014 with its stated evidence, then reconcile parent and goal status with the phase records.
- **Disposition:** active; first seen iteration 1, rechecked iteration 5.
- **Scope proof:** the conflicting status and acceptance records are inside the target packet.
- **Affected surfaces:** packet-status, phase-transition, completion-gate.

### LUNA-R2-P2-001 — P2: Staged type-change paths bypass the local-skill guard

- **Dimension / class:** security / `commit_guard_diff_filter_gap`
- **Location:** `.skilled/scripts/git-hooks/pre-commit:111`
- **Evidence:** the guard matches local skill path names at line 105 but reads staged paths through `git diff --cached --name-only -z --diff-filter=ACMR` at line 111. The phase 1 contract documents the same filter at `001-ignore-and-commit-guard/spec.md:136`.
- **Impact:** a previously tracked `local-*` path whose index entry changes type has Git status `T`, which the filter omits. The gap is limited to this staged type-change case; newly added private paths remain caught.
- **Recommendation:** include type-change entries or inspect all changed index paths before applying the path guard, with focused coverage in the existing real-hook harness.
- **Disposition:** active; first seen iteration 2, rechecked iteration 5.
- **Scope proof:** the hook and guard contract are named implementation surfaces.
- **Affected surfaces:** pre-commit-guard, private-skill-path, publication-boundary.

### LUNA-R4-P2-001 — P2: The scanner inventory omits the derived-freshness root scan

- **Dimension / class:** maintainability / `scanner_inventory_omission`
- **Location:** `specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/spec.md:164`
- **Evidence:** the phase 3 inventory claims sixteen skill-root scans and lists the regenerator at lines 164-183. The workflow invokes `ci-skill-derived-freshness.cjs` at `.github/workflows/routing-registry-drift.yml:202`; that script separately enumerates the same root at lines 51-54 and does not explicitly exclude `local-*`. The canonical regenerator does exclude such names at `regenerate-skill-derived.cjs:213-217`.
- **Impact:** maintainers have an incomplete scan inventory and two root enumerators with different local-name policy. A real local directory can reach this read-only checker; the supported symlink layout is skipped incidentally because `Dirent.isDirectory()` is false. No tracked-file write from this checker was demonstrated.
- **Recommendation:** inventory the CI scanner and share the canonical root enumerator or explicitly exclude `local-*` by name.
- **Disposition:** active; first seen iteration 4, rechecked iteration 5.
- **Scope proof:** the omitted inventory row and workflow gate are both in the named review scope.
- **Affected surfaces:** scanner-inventory, local-skill-exclusion, derived-freshness-gate.

## 4. Remediation Workstreams

1. **P1 — Phase and packet status.** Resolve AC-014 under its own stated contract, then make the parent and goal completion fields agree with the resulting child phase state.
2. **P2 — Pre-commit type changes.** Extend the staged path scan to include type changes and add a focused case for a previously tracked local-* path that changes type.
3. **P2 — Derived freshness.** Add the CI freshness scan to the phase 3 inventory and align its root selection with the canonical local-* exclusion policy.

## 5. Spec Seed

- Replace the contradictory parent completion state only after phase 2's AC-014 closure evidence is resolved.
- Extend the phase 3 inventory to include every workflow-invoked skill-root scan, including the derived-freshness gate.
- State the local-* exclusion contract for every enumerator that can inspect skill-root metadata.

## 6. Plan Seed

- Inspect the staged diff-filter contract and update it so a `T` type-change path reaches the private-name check.
- Add and run a focused real-hook harness case for the staged type-change edge.
- Refactor the freshness gate to use the canonical root enumerator, or add an explicit local-* exclusion if the call contract differs.
- Update phase 3 inventory evidence and re-evaluate the parent/goal completion state against all child acceptance rows.

## 7. Traceability Status

### Core Protocols

- **spec_code — fail:** phase 3's scanner inventory omits the workflow-invoked derived-freshness root scan; finding LUNA-R4-P2-001.
- **checklist_evidence — fail:** phase 2 AC-014 is Unmet under the phase's explicit closure rule; finding LUNA-R1-P1-001.
- **scope_boundary — conflict:** graph upserts and configured resource-map emission target paths outside the authorized lineage. Graph writes and resource-map emission were skipped and recorded as conflicts.

### Overlay Protocols

- **skill_agent — pass:** advisor Python metadata readers use the shared trusted-link and scan-eligibility helpers.
- **agent_cross_runtime — pass:** TypeScript and Python helpers both canonicalize trusted roots and reject parent traversal through relative-path checks.
- **feature_catalog_code — pass:** the feature catalog describes the public sk-code hub; exact removed/local skill identifiers are absent, consistent with frozen D1/D6.
- **playbook_capability — pass:** the manual playbook covers live sk-code scenarios; local routing and invisibility are assigned to phase 5 rather than the hub playbook.

**AC_COVERAGE:** exempt. The root packet has no `checklist.md` or `implementation-summary.md`, so the lifecycle-active coverage signal does not apply.

**Resource map:** absent (`resource_map_present: false`), so the conditional Resource Map Coverage Gate does not apply. Configured emission was skipped because its target would be outside the lineage.

## 8. Deferred Items

No separate backlog item was added. The two P2 findings remain active advisories in the remediation workstreams above; graph and resource-map workflow steps remain scope conflicts for this lineage.

## Dimension Expansion Map

- **Completed review dimensions:** correctness, security, traceability, maintainability.
- **Completed pivots:** 0.
- **Failed pivots:** 0.
- **Audited overrides:** 0.
- **Saturated directions:** none recorded.
- **Council artifacts:** none.
- **Selected review directions:** packet completion records; staged-path guard; derived-freshness root enumeration; corpus ignore traversal; advisor Python readers and TypeScript watcher; feature catalog and manual playbook.
- **Remaining frontier:** none recorded by the reducer. The loop stopped at the five-iteration cap.

## 9. Search Ledger

- **Latest search coverage:** `private_scan_visibility`, `advisor_index_containment`, and `hub_overlay_scope` were covered; ignored corpus traversal, untrusted local link, and missing hub overlay scenario were ruled out. Graph mode was `graphless_fallback`.
- **Candidate coverage:** 10 bug classes covered; 8 ruled out; 0 deferred; 0 blocked. Covered classes: `acceptance_status_propagation`, `advisor_index_containment`, `evidence_reference_mismatch`, `hub_overlay_scope`, `local_root_policy_drift`, `phase_status_drift`, `private_scan_visibility`, `scanner_inventory_omission`, `staged_type_change_guard_bypass`, `trusted_root_escape`. Ruled-out classes: `cross_language_containment_drift`, `evidence_reference_mismatch`, `hub_overlay_scope`, `ignored_corpus_traversal`, `missing_hub_overlay_scenario`, `private_scan_visibility`, `trusted_root_escape`, `untrusted_local_link`.
- **Search debt:** none.
- **Ruled-out candidates:** SL-003 trusted-root escape (canonical realpath and relative containment); SL-005 sampled phase 5 evidence-reference mismatch (pointers and result values matched); SL-007 cross-language containment drift (TypeScript and Python boundary checks align); SL-008 ignored corpus traversal/untrusted advisor link (guards occur before reading); SL-009 missing hub catalog/playbook coverage (D1/D6 keep local skills outside the public hub).
- **Clean search proof:** reducer records evidence for SL-003, SL-005, SL-007, SL-008, and SL-009. The final pass rechecked corpus ignored-path order at `corpus.mjs:275-280`, Python advisor reader calls at `skill_advisor.py:1215` and `1271`, and watcher trusted-link discovery at `watcher.ts:197-206`.

## 10. Audit Appendix

### Convergence and Coverage

- Iterations: 5 of 5.
- Dimension coverage: 4 of 4 review dimensions.
- Active findings: P0 0, P1 1, P2 2; resolved findings 0.
- Reducer convergence score after iteration 5: 1.0. The configured stop policy is max-iterations, so the terminal stop reason is `maxIterationsReached`.
- No tests or repository validation commands were run; this was a read-only review apart from lineage artifacts.

### Ruled-Out Claims

- No ignored local skill traversal was found in the retrieval corpus; ignored-path filtering precedes link and directory handling.
- No trusted-root escape was found in the TypeScript/Python advisor helpers or watcher.
- No required local-skill scenario was missing from the hub feature catalog or manual playbook under the packet's D1/D6 boundary.
- Sampled phase 5 final-tip and corpus-boundary evidence references resolved and matched the recorded summaries.

### Sources Reviewed

The parent spec and goal; phase 1 guard contract; phase 2 acceptance criteria; phase 3 scanner inventory; phase 5 evidence excerpts; the pre-commit hook; derived-freshness and root-metadata scripts; routing-registry-drift workflow; retrieval corpus; TypeScript and Python private-skill containment and advisor readers; daemon watcher; sk-code feature catalog and manual-testing playbook; and reducer-owned registry, dashboard, and strategy state.

### Cross-Reference Appendix

#### Core Protocols

| Protocol | Status | Evidence / unresolved drift |
|---|---|---|
| spec_code | fail | Phase 3 inventory omits the live derived-freshness scan; LUNA-R4-P2-001. |
| checklist_evidence | fail | Phase 2 AC-014 is Unmet; root completion claims conflict. |
| scope_boundary | conflict | Graph and resource-map outputs were skipped because their targets are outside this lineage. |

#### Overlay Protocols

| Protocol | Status | Evidence / unresolved drift |
|---|---|---|
| skill_agent | pass | Advisor Python readers call the shared trusted-link eligibility helper. |
| agent_cross_runtime | pass | TypeScript and Python helpers use matching canonical-root/relative-path logic. |
| feature_catalog_code | pass | No exact removed/local surface identifiers; hub-only catalog scope matches D1/D6. |
| playbook_capability | pass | No exact removed/local identifiers; phase 5 owns local routing and invisibility scenarios. |
