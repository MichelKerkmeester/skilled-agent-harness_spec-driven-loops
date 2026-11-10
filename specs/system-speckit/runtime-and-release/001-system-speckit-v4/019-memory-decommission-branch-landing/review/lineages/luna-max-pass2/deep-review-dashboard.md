# Deep Review Dashboard - Session Overview

Auto-generated from the lineage JSONL state and strategy.

## Status

- Target: `.opencode/specs/system-speckit/052-memory-decommission-landing` (spec-folder)
- Session: `fanout-luna-max-pass2-1788552418848-3us41r` (generation 1, lineage new)
- Status: COMPLETE
- Release Readiness: release-blocking
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasAdvisories: false

## Findings Summary

| Severity | Active | New | Resolved |
|----------|-------:|----:|---------:|
| P0 | 0 | 0 | 0 |
| P1 | 4 | 4 | 0 |
| P2 | 8 | 8 | 0 |

## Dimension Coverage

| Dimension | Status | Iterations |
|-----------|--------|------------|
| correctness | covered (conditional) | 1 |
| security | covered (conditional) | 2 |
| traceability | covered (conditional) | 3 |
| maintainability | covered (conditional) | 4 |

## Traceability Coverage

- Core: `spec_code=partial`, `checklist_evidence=blocked`
- Overlay: `feature_catalog_code=blocked`, `playbook_capability=blocked`

## Progress

| # | Focus | Files | New P0/P1/P2 | Ratio | Status |
|---|-------|------:|--------------|------:|--------|
| 1 | retrieval recipe parity and CLI boundaries | 8 | 0/1/2 | 1.00 | complete |
| 2 | embedding authorization, model identity and IPC boundaries | 8 | 0/1/2 | 1.00 | complete |
| 3 | packet requirements, acceptance evidence and completion metadata | 9 | 0/1/0 | 1.00 | complete |
| 4 | parser contracts, duplicate payload types, mirrors and decommission documentation | 9 | 0/0/2 | 1.00 | complete |
| 5 | forced-depth state integrity, executor guards and containment | 7 | 0/0/1 | 1.00 | complete |
| 6 | provider factory, registry and custom-model dimensions | 8 | 0/0/1 | 1.00 | complete |
| 7 | retrieval ranking, determinism and corpus boundaries | 8 | 0/1/0 | 1.00 | complete |
| 8 | command/template mirrors and decommission residue | 12 | 0/0/0 | 0.00 | complete |
| 9 | cross-domain adversarial carried-finding revalidation | 12 | 0/0/0 | 0.00 | complete |
| 10 | final packet and lineage reconciliation | 12 | 0/0/0 | 0.00 | complete |

## Next Focus

Terminal reason: maxIterationsReached. Synthesis follows; release readiness remains blocked by four active P1 findings and unverified gates.

## Synthesis

- Stop reason: maxIterationsReached
- Final verdict: CONDITIONAL
- Active findings: P0=0, P1=4, P2=8
- Release readiness: release-blocking
- Report: review-report.md
