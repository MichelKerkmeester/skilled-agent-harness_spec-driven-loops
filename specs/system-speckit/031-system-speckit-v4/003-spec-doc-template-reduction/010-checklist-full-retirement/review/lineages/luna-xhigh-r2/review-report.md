---
title: "Deep Review Report"
trigger_phrases: []
---
# Deep Review Report

## Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** false
- **Active findings:** P0=0, P1=6, P2=3
- **Scope:** Level 3 checklist-retirement packet, its linked upgrade producer, document contract, evidence rules, fingerprint generation/validation, resume and graph path boundaries, repair utility, tests, template documentation, and feature catalog.
- **Stop reason:** `maxIterationsReached` after four iterations. The configured `max-iterations` policy treated convergence as telemetry and dispatched all four dimensions.
- **Dimension coverage:** correctness, security, traceability, and maintainability all completed.
- **Release readiness:** `in-progress`. Active P1 findings and a failed hard checklist-evidence protocol prevent PASS.
- **Resource map:** `resource-map.md` was absent at initialization, so the conditional Resource Map Coverage Gate was skipped. A lineage-local resource map was emitted from review deltas as a synthesis artifact.

## Planning Trigger

`/speckit:plan` is required for the six active P1 findings. No P0 was confirmed. P2 items remain advisory.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["F001", "F002", "F003", "F004", "F005", "F006", "F007", "F008", "F009"],
  "remediationWorkstreams": [
    "retirement test-contract alignment",
    "canonical path and symlink confinement",
    "packet closure and generated-status reconciliation",
    "catalog and evidence citation parity",
    "interruption-safe fingerprint test isolation"
  ],
  "specSeed": [
    "Define the supported workspace-root and symlink boundary for resume reads and generated-metadata writes.",
    "Make the P1 verification deferral protocol agree with the packet's closure and summary metadata.",
    "Define the current feature-catalog document set after standalone checklist retirement.",
    "Require current producer citations and reproducible evidence for the full REQ-005 inventory."
  ],
  "planSeed": [
    "Rewrite test-validation-system.cjs Level 2 fixtures to use acceptance-criteria.md and assert no checklist.md.",
    "Canonicalize resume candidates, phase redirects, graph destinations, and configured roots before read/write authorization.",
    "Complete or explicitly approve CHK-FIX-006, regenerate graph metadata, and reconcile status/summary/closure fields.",
    "Remove or qualify feature-catalog checklist entries and refresh the stale upgrade-level citation.",
    "Run fingerprint probes against a temporary packet or restore tracked files from an interruption-safe trap."
  ],
  "findingClasses": ["test-isolation", "cross-consumer", "instance-only", "matrix/evidence", "class-of-bug"],
  "affectedSurfacesSeed": [
    "scripts/tests/test-validation-system.cjs",
    "mcp-server/lib/resume/resume-ladder.ts",
    "mcp-server/lib/graph/graph-metadata-parser.ts",
    "mcp-server/scripts/repair-graph-metadata.mjs",
    "tasks.md and acceptance-criteria.md closure evidence",
    "feature-catalog/feature-catalog.md",
    "scripts/tests/fingerprint-docset-generation.sh"
  ],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

| ID | Severity | Dimension | Location | Status | Finding |
|----|----------|-----------|----------|--------|---------|
| F001 | P1 | correctness | `.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.cjs:290-297,410-417` | active | The active validation-system test helper creates `checklist.md` for Level 2 and passes only when it exists, despite the retired contract. |
| F002 | P1 | security | `.opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:895-918,971-1006` | active | Lexical containment accepts an in-root symlink that can redirect resume reads outside the workspace. |
| F003 | P1 | security | `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:1709-1737,1754-1767` | active | Graph metadata write authorization checks unresolved root membership while writing to a canonical path, allowing an in-root symlink to an external `/specs/` path to pass. |
| F004 | P2 | security | `.opencode/skills/system-spec-kit/mcp-server/scripts/repair-graph-metadata.mjs:107-135,346-360` | active | Repair discovery and write are separated by a scan-to-write replacement race without immediate type or canonical destination revalidation. |
| F005 | P1 | traceability | `tasks.md:116-119,163-164,200-208` | active | CHK-FIX-006 is an unchecked P1 deferral without the approval required by the packet protocol, while the packet claims Complete and Closeable. |
| F006 | P1 | traceability | `.opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md:705-718,5060-5068` | active | The feature catalog still documents checklist.md as a live indexed spec document after the executable allowlist removed it. |
| F007 | P1 | traceability | `graph-metadata.json:42`; `graph-metadata-parser.ts:1289-1307` | active | Generated metadata reports `in_progress` because an open verification item remains, while canonical packet documents report Complete. |
| F008 | P2 | traceability | `acceptance-criteria.md:58`; `tasks.md:66` | active | AC-001 and T004 cite `upgrade-level.sh:632`, but the current producer block is at `upgrade-level.sh:729-744`. |
| F009 | P2 | maintainability | `.opencode/skills/system-spec-kit/scripts/tests/fingerprint-docset-generation.sh:20-38,40-95` | active | The fingerprint test mutates a tracked reference packet and its trap removes only temporary state, so interruption can leave persistent packet changes. |

Every active finding has file-and-line evidence, a finding class, scope proof, affected surface hints, and a content hash in the reducer registry. F001-F003 and F005-F007 carry typed adjudication packets with evidence references, counterevidence, alternative explanations, final severity, confidence, and downgrade triggers. No P0 candidate survived adversarial review.

## Remediation Workstreams

1. **Retirement test-contract alignment — F001.** Replace the obsolete Level 2 fixture producer and expectation with the acceptance-criteria-only contract. Add a negative no-checklist assertion.
2. **Canonical path and symlink confinement — F002, F003, F004.** Canonicalize candidates and configured roots before authorization. Recheck destinations immediately before repair writes. Add external-target symlink and replacement-race fixtures.
3. **Packet closure and generated-status reconciliation — F005, F007.** Resolve CHK-FIX-006 under the packet's own P1 protocol, regenerate metadata, and reconcile `spec.md`, `implementation-summary.md`, `tasks.md`, acceptance closure, and `graph-metadata.json`.
4. **Catalog and evidence citation parity — F006, F008.** Remove or qualify stale feature-catalog claims and update the producer citation to the current implementation block.
5. **Interruption-safe test isolation — F009.** Run fingerprint probes against a temporary packet copy or make the exit trap restore every tracked mutation before cleanup.

## Spec Seed

- Define canonical workspace-root authorization for resume reads and graph metadata writes. A lexical `specs` path is not sufficient when symlinks are possible.
- Define the status contract for an open P1 verification row. Closure, acceptance criteria, generated metadata, and verification summary must use one source of truth.
- Define the retirement-era feature catalog surface. Historical checklist references must be explicitly labeled or removed from present-tense scanner documentation.
- Require acceptance evidence to identify the current producer block and retain reproducible scope evidence for every path category named by REQ-005.
- Require fixture tests that cannot leave tracked reference packets mutated after interruption.

## Plan Seed

1. Update `scripts/tests/test-validation-system.cjs` to stop creating and requiring `checklist.md` for Level 2 fixtures.
2. Add canonical realpath containment helpers for resume and graph-write boundaries, covering both configured specs roots and in-root symlink targets.
3. Resolve CHK-FIX-006 with evidence or recorded approval, then regenerate graph metadata and recalculate the packet's final status.
4. Reconcile feature-catalog entries with `SPEC_DOCUMENT_FILENAMES` and refresh AC-001/T004 line references.
5. Isolate `fingerprint-docset-generation.sh` from tracked packet mutation and preserve current/old/future generation probes.
6. Run the repository's authoritative validation and test gates in the implementation follow-up; this review lineage intentionally did not run them.

## Traceability Status

### Core Protocols

| Protocol | Gate | Status | Evidence |
|----------|------|--------|----------|
| `spec_code` | hard | partial | Retirement producer and filename allowlist are present, but generated status and feature-catalog documentation disagree with the final packet claim (`graph-metadata.json:42`, `feature-catalog.md:705-718`). |
| `checklist_evidence` | hard | fail | CHK-FIX-006 is unchecked and lacks the required approval; the verification summary simultaneously reports P1 `0/0` and no date (`tasks.md:116-119,163-164,200-208`). |

### Overlay Protocols

| Protocol | Gate | Status | Evidence |
|----------|------|--------|----------|
| `feature_catalog_code` | advisory | fail | Present-tense catalog sections retain `checklist.md`, while `spec-doc-paths.ts:8-20` excludes it. |
| `playbook_capability` | advisory | notApplicable | No packet-local playbook scenario or executable playbook claim was named for this target. |
| `skill_agent` | advisory | notApplicable | Target type is `spec-folder`, not `skill`. |
| `agent_cross_runtime` | advisory | notApplicable | Target type is `spec-folder`, not `agent`. |

`AC_COVERAGE`: exempt. The lifecycle predicate requiring a `checklist.md` document is not active for this packet because the standalone checklist file is absent. This advisory signal does not override the failed hard checklist-evidence protocol.

`resource-map.md`: absent at initialization; the conditional Resource Map Coverage Gate was skipped.

## Deferred Items

- F004: repair scan-to-write race; advisory because exploitation requires concurrent local control of the maintenance workspace.
- F008: stale producer citation; producer behavior itself is present.
- F009: interruption-only tracked-packet mutation risk; normal completion restores the packet.
- Code graph and semantic-memory evidence were unavailable; direct source and packet reads supplied graphless fallback evidence.
- Repository validation, repair, build, memory-save, and git-write commands were not run under the explicit detached lineage contract.
- Phase save was intentionally skipped. `generate-context.js` and any write outside this lineage were forbidden by the caller's write-surface binding.

## Dimension Expansion Map

- Completed dimensions: correctness, security, traceability, maintainability.
- Completed pivots: none.
- Failed pivots: none.
- Audited overrides: none.
- Swept directions: active test contract; symlink/path boundaries; fingerprint generation; packet closure evidence; catalog parity; generated status; test isolation.
- Remaining frontier: none for this four-iteration lineage.
- Pivot artifacts: none.

## Search Ledger

- `retired_producer`: ruled out in iteration 1. `upgrade-level.sh:729-744` creates acceptance criteria only.
- `contract_boundary`: ruled out in iteration 1. `spec-kit-docs.json:545-585` and resolver tests omit the standalone add-on.
- `test_contract`: finding F001 in iteration 1. Active validation tests still require the old Level 2 artifact.
- `symlink_handling`: findings F002 and F003 in iteration 2. Resume and graph write paths use mismatched lexical/canonical identities.
- `generation_skip`: ruled out in iteration 2. Equal/newer markers compare and the future-marker fixture remains present.
- `repair_write_boundary`: finding F004 in iteration 2. Scan-to-write replacement is not revalidated.
- `completion_claim`: finding F005 in iteration 3. P1 protocol, summary, and closure claim conflict.
- `catalog_parity`: finding F006 in iteration 3. Feature catalog is stale against executable allowlist.
- `generated_status`: finding F007 in iteration 3. Current-generation graph metadata says `in_progress` while packet docs say Complete.
- `stale_citation`: finding F008 in iteration 3. AC-001/T004 cite a moved line.
- `test_isolation`: finding F009 in iteration 4. Tracked reference packet is mutated during fingerprint probes.
- `searchDebt`: none recorded by the reducer.
- `cleanSearchProof`: direct graphless evidence only; no code graph was available.

## Audit Appendix

### Iteration Summary

| Iteration | Dimension | New P0/P1/P2 | Ratio | Verdict |
|-----------|-----------|--------------|-------|---------|
| 1 | correctness | 0/1/0 | 1.00 | CONDITIONAL |
| 2 | security | 0/2/1 | 1.00 | CONDITIONAL |
| 3 | traceability | 0/3/1 | 1.00 | CONDITIONAL |
| 4 | maintainability | 0/0/1 | 1.00 | PASS |

The `max-iterations` stop policy was honored. Convergence was telemetry only before the fourth pass. Final active counts are P0=0, P1=6, P2=3.

### Replay Validation

- State log records: four sequential `type=iteration` records plus claim-adjudication events and a final synthesis event.
- Iteration narratives: four write-once files exist, each is non-empty and ends with exactly one parseable `Review verdict:` line.
- Structured deltas: four files exist, each begins with the matching canonical iteration record and includes structured finding/classification/ruled-out rows.
- Reducer refresh: registry, dashboard, strategy, and lineage resource map were regenerated from the full JSONL/delta history. Reducer reported `corruptionCount=0` and `openFindingsCount=9`.
- Severity replay: active P1=6 and P2=3; no P0. Verdict is therefore CONDITIONAL.
- Stop replay: `stopPolicy=max-iterations`, `maxIterations=4`, and four iterations were completed. Early convergence was not used.
- Gate replay: evidence is cited; scope stayed within the declared target plus explicitly named integration surfaces; hard checklist-evidence failed; code graph fallback remained graphless.

### Core Protocols

- `spec_code`: partial. Producer and current executable filename allowlist match retirement, but test, catalog, generated-status, and symlink-boundary evidence leave the final contract unresolved.
- `checklist_evidence`: fail. CHK-FIX-006 is an unchecked P1 without approval, and the summary/closure fields overstate completion.

### Overlay Protocols

- `feature_catalog_code`: fail, advisory. The feature catalog retains a present-tense checklist indexing contract.
- `playbook_capability`: notApplicable. No playbook scenario was named.
- `skill_agent` and `agent_cross_runtime`: notApplicable for a spec-folder target.

### Scope and Write Audit

- Review target files were read-only. No target packet, implementation, test, template, catalog, or runtime source file was modified.
- All task-created review artifacts are under `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/review/lineages/luna-xhigh-r2`.
- `resolveArtifactRoot` was not run. The caller-provided fan-out artifact override was bound directly.
- `validate.sh`, `generate-context.js`, git writes, repository builds/tests, graph upsert, and graph convergence commands were not run under the caller's explicit restriction.
- The external cli-pi binary was not recursively invoked because the active runtime is Pi and cli-pi's self-invocation guard forbids that route. The bound leaf review executed in-process with the requested model binding.

### Sources Reviewed

- Packet: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json`.
- Producer and contract: `scripts/spec/upgrade-level.sh`, `templates/spec-kit-docs.json`, and `scripts/utils/template-structure.js`.
- Evidence/test surfaces: `scripts/rules/check-evidence.sh`, `scripts/rules/check-ac-coverage.sh`, `scripts/tests/check-ac-coverage.sh`, `scripts/tests/fingerprint-docset-generation.sh`, `scripts/tests/level-contract-resolver.vitest.ts`, `scripts/tests/scaffold-golden-snapshots.vitest.ts`, `scripts/tests/test-integration.vitest.ts`, and `scripts/tests/test-validation-system.cjs`.
- Runtime consumers: `mcp-server/lib/graph/graph-metadata-parser.ts`, `mcp-server/lib/validation/generated-metadata-integrity.ts`, `mcp-server/lib/config/spec-doc-paths.ts`, `mcp-server/lib/resume/resume-ladder.ts`, `mcp-server/lib/graph/graph-metadata-schema.ts`, `mcp-server/lib/search/validation-metadata.ts`, `mcp-server/handlers/memory-index-discovery.ts`, and `mcp-server/scripts/repair-graph-metadata.mjs`.
- Documentation overlay: `feature-catalog/feature-catalog.md`, `templates/README.md`, and `templates/examples/README.md`.

### Continuity

The canonical memory-save phase was not executed because the caller prohibited `generate-context.js` and all writes outside this lineage. The disk packet is the ground truth for this detached run.
