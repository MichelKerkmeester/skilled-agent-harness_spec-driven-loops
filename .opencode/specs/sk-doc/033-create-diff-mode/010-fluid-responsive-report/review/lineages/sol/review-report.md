---
title: "Deep Review Report: Fluid-responsive create-diff report"
description: "Detached lineage synthesis after ten review iterations across correctness, security, traceability, and maintainability."
verdict: FAIL
hasAdvisories: false
releaseReadinessState: release-blocking
stopReason: maxIterationsReached
sessionId: fanout-sol-1784207165086-152crx
retrySessionId: fanout-sol-1784210154469-yt14nz
---
# Deep Review Report: Fluid-responsive create-diff report

## Executive Summary

**Verdict: FAIL.** One confirmed P0, one P1, and one P2 remain active after 10 iterations. All four dimensions and all required traceability protocols received coverage; the finding set stabilized after iteration 2, but P0-001 repeatedly failed `p0ResolutionGate`, so convergence remained blocked until the hard `maxIterationsReached` stop.

- Active findings: P0=1, P1=1, P2=1
- hasAdvisories: false (advisories are only surfaced on PASS; P2-001 remains listed below)
- Release readiness: `release-blocking`
- Scope: the completed Level 2 packet plus the 45 manifest-declared create-diff implementation, command, catalog, reference, and playbook files
- Resource-map coverage gate: skipped because no packet `resource-map.md` existed at initialization; the lineage-local synthesis map was still emitted

## Planning Trigger

`/speckit:plan` remediation is required. P0-001 must be addressed before release; P1-001 is also required. P2-001 can travel as a test-hardening advisory in the same bounded plan.

**Planning Packet**

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "findingId": "P0-001",
      "severity": "P0",
      "title": "Crafted snapshot manifest makes cleanup unlink files outside the state store",
      "file": ".opencode/skills/sk-doc/create-diff/scripts/create_diff.py:1444",
      "findingClass": "class-of-bug",
      "affectedSurfaceHints": ["cleanup command", "custom/default snapshot stores", "manifest trust boundary", "writable files reachable by the process"]
    },
    {
      "findingId": "P1-001",
      "severity": "P1",
      "title": "No-container-query fallback does not preserve shipped fixed type sizes",
      "file": ".opencode/skills/sk-doc/create-diff/scripts/create_diff.py:720",
      "findingClass": "algorithmic",
      "affectedSurfaceHints": ["no-container-query webviews", "headings and captions", "diff table type", "section rhythm"]
    },
    {
      "findingId": "P2-001",
      "severity": "P2",
      "title": "Fluid regression test does not lock named-container wiring or both refinements",
      "file": ".opencode/skills/sk-doc/create-diff/scripts/test_create_diff.py:325",
      "findingClass": "matrix/evidence",
      "affectedSurfaceHints": ["renderer regression suite", "named container wiring", "narrow and wide refinements"]
    }
  ],
  "remediationWorkstreams": [
    "WS1: validate manifest shape and contain every blob target before destructive cleanup",
    "WS2: make the unsupported-cqi fallback real or narrow the documented support contract",
    "WS3: strengthen the fluid-layer invariant test"
  ],
  "specSeed": [
    "Add an explicit snapshot-manifest trust and path-containment requirement",
    "Reconcile NFR-R02 with tested CSS fallback behavior"
  ],
  "planSeed": [
    "Add basename/schema/resolve containment checks and negative cleanup tests",
    "Implement fixed declarations or an @supports fallback for cqi consumers",
    "Assert container-name and both container-query breakpoints"
  ],
  "findingClasses": ["class-of-bug", "algorithmic", "matrix/evidence"],
  "affectedSurfacesSeed": ["snapshot cleanup", "manifest loading", "fluid CSS tokens", "renderer invariants", "catalog and playbook claims"],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

### P0-001: Crafted snapshot manifest makes cleanup unlink files outside the state store

- Severity / dimension: P0 / security
- Evidence: `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py:1178-1184`, `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py:1431-1448`
- Impact: a crafted or corrupt manifest can escape the selected snapshot subdirectory and delete another writable file during non-dry-run cleanup.
- Scope proof: capture emits a safe basename, but `_load_manifest` accepts arbitrary JSON and the only destructive unlink joins `s["blob"]` without schema, basename, or resolved-path containment validation.
- Adversarial disposition: confirmed after Hunter/Skeptic/Referee replay in iterations 2 and 6. Local-state reachability and optional dry-run reduce reachability, not impact or containment.
- Fix recommendation: reject invalid manifest entries; require a canonical basename and a regular-file target whose resolved path remains under the selected snapshot directory; add traversal, absolute-path, symlink, malformed-shape, and dry-run/real parity tests.
- findingClass: `class-of-bug`
- affectedSurfaceHints: cleanup command, custom/default snapshot stores, manifest trust boundary, writable files reachable by the process
- Status: active

### P1-001: No-container-query fallback does not preserve shipped fixed type sizes

- Severity / dimension: P1 / correctness
- Evidence: `.opencode/specs/sk-doc/033-create-diff-mode/010-fluid-responsive-report/spec.md:137`, `.opencode/specs/sk-doc/033-create-diff-mode/010-fluid-responsive-report/spec.md:153`, `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py:720-727`, `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py:731-804`
- Impact: in an engine that does not understand `cqi`, variable-backed consuming declarations become invalid at computed-value time rather than selecting the documented `clamp()` bounds, so prior per-surface fixed sizes are not preserved.
- Scope proof: all `cqi` tokens and consumers were traced in `_CSS`; no fixed fallback declarations or `@supports` branch exists.
- Adversarial disposition: sustained at P1. Modern Chromium takes the supported path, limiting impact to the explicit unsupported-engine compatibility promise.
- Fix recommendation: provide fixed declarations before supported fluid overrides or guard the fluid values with a feature query; alternatively amend the unsupported-engine contract with verified behavior.
- findingClass: `algorithmic`
- affectedSurfaceHints: no-container-query webviews, headings and captions, diff-table type, section rhythm
- Status: active

### P2-001: Fluid regression test does not lock named-container wiring or both refinements

- Severity / dimension: P2 / correctness
- Evidence: `.opencode/skills/sk-doc/create-diff/scripts/test_create_diff.py:325-332`, `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py:732`, `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py:807-811`
- Impact: the test can remain green if `container-name:report` or either breakpoint is removed, even though the current renderer is correctly wired.
- Scope proof: the only focused fluid invariant asserts generic substrings rather than the name and two exact rule signatures.
- Disposition: advisory; no active renderer failure was found on the supported path.
- Fix recommendation: assert `container-name:report` and both `max-width:34rem` / `min-width:80rem` blocks.
- findingClass: `matrix/evidence`
- affectedSurfaceHints: renderer regression suite, named-container wiring, narrow and wide refinements
- Status: active

## Remediation Workstreams

1. **WS1, release blocker**: introduce a validated manifest-entry boundary and path containment before every cleanup unlink; add security negative tests; align catalog/playbook language with the enforced contract.
2. **WS2, required compatibility fix**: implement and test a real unsupported-`cqi` fallback, or amend the spec/checklist/summary claims if unsupported engines are intentionally excluded.
3. **WS3, advisory hardening**: expand `test_fluid_type_layer_is_container_keyed` to pin the named container and both refinements.

## Spec Seed

- Add a P0 snapshot-cleanup invariant: no manifest-controlled path may resolve outside its source snapshot directory, including absolute, traversal, and symlink variants.
- Add acceptance criteria for malformed manifest shapes and cleanup failure behavior.
- Replace the inferred unsupported-container-query behavior with an executable acceptance test or explicitly constrain support to engines that implement container query units.
- Keep current supported-path layout, CSP, and accessibility requirements unchanged; the review found those surfaces aligned.

## Plan Seed

1. Add a manifest parser/validator that returns typed snapshot entries and rejects unknown or malformed path fields.
2. Resolve each cleanup target and prove containment beneath `sub` before unlinking; define symlink handling explicitly.
3. Add automated cleanup tests for generated manifests, traversal, absolute paths, symlink escapes, wrong JSON types, missing keys, dry-run immutability, and preview/real parity.
4. Add fixed-size fallback declarations or a feature-gated fluid override, then add a compatibility-focused assertion.
5. Strengthen the named-container test and update affected catalog/playbook/spec evidence.
6. Re-run the full renderer suite, report validator, strict packet validation, and a focused security replay.

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved Drift |
|----------|--------|----------|------------------|
| `spec_code` | fail | `spec.md:137,153`; `create_diff.py:720-727,731-804` | P1-001 contradicts the unsupported-engine fallback promise. |
| `checklist_evidence` | partial | `checklist.md:75-79,124-143`; `test_create_diff.py:325-332` | Current-path literals are supported; unsupported-engine fallback and full named-container regression coverage are not. |

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved Drift |
|----------|--------|----------|------------------|
| `feature_catalog_code` | fail | `snapshot-state-management.md:20-28`; `create_diff.py:1431-1448` | Catalog describes safe disposable-store cleanup without the containment needed to enforce it. |
| `playbook_capability` | partial | `snapshot-status-and-cleanup.md:24-68`; `hostile-content-escaped.md:24-66` | Ordinary cleanup and hostile report-content flows are executable; corrupt-manifest cleanup is uncovered. |

- `AC_COVERAGE`: advisory-shortfall, 20/21 checklist items checked; CHK-070 live IDE-webview visual acceptance remains explicitly deferred. Enforcement floor: UNKNOWN (the validation signal is advisory/default-off).
- Resource Map Coverage Gate: not applicable because `resource_map_present=false` at initialization.

## Deferred Items

- P2-001 is advisory and should be included when WS2 touches the fluid regression test.
- CHK-070 remains operator-owned live IDE-webview visual acceptance.
- The lineage-local resource map is reducer-generated from finding deltas and is intentionally narrower than the 45-file review manifest.
- Continuity save was skipped because this detached lineage was explicitly forbidden from writing outside its artifact directory.

## Dimension Expansion Map

- Saturated directions: correctness fallback semantics; security manifest-to-unlink flow; traceability core/overlay replay; maintainability state/test ownership.
- Completed pivots: none.
- Failed pivots: none.
- Audited overrides: none.
- Council artifacts: none.
- Remaining frontier: remediation verification after fixes; no additional in-scope review direction remained productive before the hard ceiling.

## Search Ledger

- `hasSearchDebt: false`
- Graph coverage mode: graphless fallback because detached-lineage containment prohibited coverage-graph writes outside the artifact directory.
- Candidate classes covered: spec/code drift, checklist evidence drift, catalog/code drift, playbook capability drift, path traversal, absolute paths, symlink escape, malformed manifest, and preview parity.
- Search debt: none.
- Ruled-out candidates: supported-path container wiring failure; renderer HTML injection; CSP/allowlist bypass; separate cleanup root causes; preview-parity defect.
- Clean-search proof: current supported renderer path, escaping path, CSP/validator boundary, and command/YAML ownership were directly read and reconciled.

## Audit Appendix

### Convergence

- Stop reason: `maxIterationsReached`
- Iterations: 10/10
- Final three new-finding ratios: 0.00, 0.00, 0.00
- Reducer convergence score: 1.00
- Dimension coverage: 4/4
- Blocked stops: iterations 5-9; `p0ResolutionGate` remained false because P0-001 is active
- Replay result: stored severity totals, dimension coverage, and terminal FAIL agree with the synthesized verdict

### Coverage

| Dimension | First reducer-visible pass | Stabilization passes | Active findings |
|-----------|----------------------------|----------------------|-----------------|
| Correctness | 5 | 10 | P1-001, P2-001 |
| Security | 2 | 6, 9 | P0-001 |
| Traceability | 3 | 7 | none distinct; protocols reference active findings |
| Maintainability | 4 | 8 | none distinct; refinements reference active findings |

### Core Protocols

- `spec_code`: executed, fail, P1-001.
- `checklist_evidence`: executed, partial, P1-001/P2-001.

### Overlay Protocols

- `feature_catalog_code`: executed, fail, P0-001.
- `playbook_capability`: executed, partial, P0-001.

### Artifacts

- Config, append-only state, reducer registry, strategy, dashboard, 10 iteration narratives, 10 delta streams, resource map, and this report are present under the detached lineage directory.
- JSONL corruption warnings: 0.
- Reducer field advisory: iteration 1 used a legacy `findingsSummary`/`dimensions` shape; correctness was replayed in iteration 5 so final coverage is canonical.
