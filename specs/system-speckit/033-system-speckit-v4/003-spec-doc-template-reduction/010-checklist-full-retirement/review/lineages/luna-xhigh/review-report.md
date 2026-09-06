---
title: "Deep Review Report"
trigger_phrases: []
---
# Deep Review Report

## Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** false
- **Active findings:** P0=0, P1=7, P2=2
- **Scope:** Completed Level 3 checklist-retirement packet, its producer and consumer surfaces, fingerprint generation/validation, path and repair boundaries, and named test evidence.
- **Stop reason:** maxIterationsReached after three iterations. Correctness, security, and traceability were reviewed. Maintainability was not independently covered.
- **Release readiness:** in-progress. Active P1 findings and incomplete dimension coverage prevent PASS.

## Planning Trigger

`/speckit:plan` is required for the active P1 findings. The review reached the configured iteration ceiling before all dimensions were covered.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["P1-001", "P1-002", "P1-003", "P1-004", "P1-005", "P1-006", "P1-007", "P2-001", "P2-002"],
  "remediationWorkstreams": ["fingerprint document-set integrity", "path and write confinement", "packet closure evidence", "test and citation evidence"],
  "specSeed": ["Define acceptance-criteria fingerprint inclusion or explicit exclusion", "Define canonical-root and unknown-generation behavior", "Align REQ-005 and AC-007 evidence scope", "Resolve the unchecked P1 closure item"],
  "planSeed": ["Add fingerprint generation fixtures for stale, current-clean, and current-drift cases", "Add canonical-root and symlink boundary tests", "Reconcile CHK-FIX-006 with the P1 protocol", "Refresh acceptance citations and retained search evidence"],
  "findingClasses": ["cross-consumer", "instance-only", "matrix/evidence"],
  "affectedSurfacesSeed": ["graph metadata parser", "generated metadata integrity validator", "resume ladder", "spec-doc path classifier", "repair-graph-metadata script", "tasks and acceptance-criteria evidence"],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

| ID | Severity | Dimension | Location | Status | Finding |
|----|----------|-----------|----------|--------|---------|
| P1-001 | P1 | correctness | `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:52-62,670-676` | active | Current-generation fingerprints omit `acceptance-criteria.md` from the hashed source set, so edits to that recognized packet document are not detected by the cited validator path. |
| P1-002 | P1 | security | `.opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:895-918,214-225,993-1050` | active | Lexical containment checks can accept an in-root symlink that redirects resume reads outside the workspace. |
| P1-003 | P1 | security | `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:63-87; .opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:1693-1739` | active | The graph metadata write guard accepts arbitrary external paths containing a `specs` segment instead of proving membership in the current workspace roots. |
| P1-004 | P1 | security | `.opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts:161-176; .opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-schema.ts:82-84` | active | Any non-current positive fingerprint generation is skipped, so an unknown future marker can suppress mismatch reporting. |
| P1-005 | P1 | traceability | `tasks.md:116-119,163-164,200-208` | active | `CHK-FIX-006` is an unchecked P1 item without the approval required by the packet's own verification protocol, while the packet claims closure and reports zero P1 items. |
| P1-006 | P1 | traceability | `spec.md:131-143; acceptance-criteria.md:64` | active | AC-007's retained evidence covers only a subset of the rules/server/scripts scope required by REQ-005. |
| P1-007 | P1 | traceability | `tasks.md:163; acceptance-criteria.md:60-61` | active | The 16-row test-matrix claim includes fingerprint generation, but the cited evidence-rule suite does not exercise the fingerprint producer/validator or name a retained generation fixture. |
| P2-001 | P2 | security | `.opencode/skills/system-spec-kit/mcp-server/scripts/repair-graph-metadata.mjs:90-105,351-360` | active | Repair discovery rejects symlink entries, but the later write path has a scan-to-write replacement race. |
| P2-002 | P2 | traceability | `acceptance-criteria.md:58; tasks.md:66` | active | AC-001 and T004 cite `upgrade-level.sh:798`, while the current producer block is at `upgrade-level.sh:729-740`. |

All findings have concrete evidence, finding classes, scope proofs, and affected-surface hints in the iteration deltas. P0/P1 findings also have typed adjudication packets in their iteration narratives.

## Remediation Workstreams

1. **Fingerprint document-set integrity:** P1-001 and P1-004. Align recognized packet documents and generation-version handling with the validator contract. Add producer/consumer fixtures.
2. **Path and write confinement:** P1-002, P1-003, and P2-001. Canonicalize roots and destinations, then test in-root symlinks, arbitrary external paths, and replacement races.
3. **Packet closure evidence:** P1-005. Complete or formally approve the deferred P1 item and reconcile the verification summary and closure claim.
4. **Test and citation evidence:** P1-006, P1-007, and P2-002. Retain full-scope search output, fingerprint test evidence, and current producer line references.

## Spec Seed

- Define whether `acceptance-criteria.md` is part of the source fingerprint document set. If it is, update generation and compatibility fixtures. If it is not, state and test that exclusion.
- Define canonical workspace-root authorization for resume reads and graph metadata writes.
- Distinguish known legacy fingerprint generations from unknown or future markers.
- Make the closure protocol and acceptance evidence agree on the treatment of deferred P1 items.
- Make REQ-005, AC-007, and the retained search evidence describe the same path inventory.

## Plan Seed

- Add current-generation acceptance-criteria edit coverage and future-generation mismatch coverage to the fingerprint test surface.
- Add resume and graph-write tests for external-target symlinks and arbitrary external paths containing `specs`.
- Harden the repair write boundary against destination replacement between discovery and write.
- Resolve CHK-FIX-006 with evidence or recorded approval, then recompute the verification summary.
- Attach reproducible full-scope search evidence for rules, MCP modules, and scripts.
- Correct the stale `upgrade-level.sh` citation.

## Traceability Status

### Core Protocols

| Protocol | Gate | Status | Evidence |
|----------|------|--------|----------|
| `spec_code` | hard | partial | Producer retirement is present, but the fingerprint document boundary and full REQ-005 evidence scope are not aligned with the packet claims. |
| `checklist_evidence` | hard | fail | `CHK-FIX-006` is unchecked and lacks the approval required for a P1 deferral; the verification summary reports `0/0` despite populated P1 rows. |

### Overlay Protocols

| Protocol | Gate | Status | Evidence |
|----------|------|--------|----------|
| `feature_catalog_code` | advisory | notApplicable | No catalog entry was named by this spec-folder target. |
| `playbook_capability` | advisory | notApplicable | No named playbook claim was reviewed. |

`AC_COVERAGE`: advisory-shortfall. The packet has eight rows marked `Met`, but the retained evidence has the gaps documented above.

## Deferred Items

- P2-001: repair scan-to-write symlink race; requires a local concurrent replacement to exploit.
- P2-002: stale line citation; producer behavior itself is present.
- Maintainability dimension: not independently reviewed before the hard ceiling.
- Code graph and semantic-memory evidence: unavailable; direct source reads and bounded searches were used.
- No repository validation, repair, build, memory-save, or external CLI command was run by this lineage, per the write-surface contract.

## Dimension Expansion Map

- Completed pivots: none.
- Failed pivots: none.
- Audited overrides: none.
- Swept dimensions: correctness, security, traceability.
- Remaining frontier: maintainability.
- Selected review directions: producer/consumer boundaries; path and generation trust boundaries; packet evidence reconciliation.
- Council artifacts: none.

## Search Ledger

- `path_confinement`: covered in iteration 2; P1-002 and P1-003 active.
- `symlink_handling`: covered in iteration 2; P1-002 active and P2-001 advisory.
- `generation_skip`: covered in iteration 2; P1-004 active.
- `repair_write_boundary`: covered in iteration 2; P2-001 active.
- `evidence_matrix`: covered in iteration 3; P1-005 through P1-007 active.
- `stale_citation`: covered in iteration 3; P2-002 active.
- `cross_consumer`: covered across iterations 1-3; P1-001, P1-003, P1-006, and P1-007 active.
- `searchDebt`: empty.
- `cleanSearchProof`: unavailable because the code graph was unavailable and no repository test command was permitted.

## Audit Appendix

### Iteration Summary

| Iteration | Dimension | New P0/P1/P2 | Ratio | Verdict |
|-----------|-----------|--------------|-------|---------|
| 1 | correctness | 0/1/0 | 0.00 | CONDITIONAL |
| 2 | security | 0/3/1 | 0.7619 | CONDITIONAL |
| 3 | traceability | 0/3/1 | 0.4324324324 | CONDITIONAL |

### Coverage

- Dimensions covered: 3/4. Maintainability remains uncovered because `maxIterations=3`.
- Core protocol results: `spec_code=partial`, `checklist_evidence=fail`.
- Applicable overlays: both `feature_catalog_code` and `playbook_capability` were not applicable.
- Active registry: 7 P1, 2 P2, 0 P0.
- State JSONL contains three iteration records and no malformed lines. The authoritative projection was repaired from the canonical delta records after the append gateway reported the compatibility projection path; no review target file was modified.

### Replay and Adjudication

- Stop policy: `max-iterations`; convergence was telemetry only before the ceiling.
- Recorded ratios: `0.00`, `0.7619`, `0.4324324324`.
- P0 replay: no P0 findings were emitted. P1 findings were re-read and carry typed adjudication packets with evidence references, counterevidence, alternative explanations, final severity, confidence, and downgrade triggers.
- Evidence gate: active findings are cited to source locations; packet evidence gaps remain active findings rather than inferred passes.
- Scope gate: review conclusions remained within the declared spec-folder review scope; target files were read-only.
- Coverage gate: maintainability is incomplete and the hard checklist evidence protocol is failed.
- State integrity: three write-once iteration narratives, three structured deltas, gateway ledger frames, root state records, registry, strategy, and dashboard are present. Synthesis was completed without running phase_save.

### Sources Reviewed

- Packet: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, and `implementation-summary.md`.
- Producer and contract: `upgrade-level.sh`, `spec-kit-docs.json`, and `template-structure.js`.
- Runtime consumers: fingerprint parser/validator, document-path classifier, resume ladder, folder discovery, graph schema, graph metadata writer, handlers, and repair script.
- Tests and evidence: acceptance-coverage shell tests, scaffold golden snapshots, level-contract resolver, integration tests, validation scripts, and upgrade tests.
