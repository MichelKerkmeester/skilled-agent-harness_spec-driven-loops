---
title: "Deep Review Report: sk-design Remediation Program"
description: "Ten-iteration detached review of the pinned 118-file remediation-program surface."
verdict: CONDITIONAL
hasAdvisories: false
releaseReadinessState: in-progress
stopReason: maxIterationsReached
sessionId: fanout-gpt-56-sol-high-1784650021792-031fvi
---

# Deep Review Report: sk-design Remediation Program

## Executive Summary

- **Verdict:** `CONDITIONAL`
- **Release readiness:** `in-progress`
- **Active findings:** P0=0, P1=10, P2=0
- **Advisories:** `hasAdvisories=false`
- **Stop reason:** `maxIterationsReached` after 10/10 forced iterations
- **Scope:** 118 unique existing files declared by `goal-file-manifest.txt`, reviewed at pinned HEAD `7b9d3b6b71`
- **Coverage:** correctness, security, traceability, and maintainability all received full passes; six additional breadth/stabilization passes followed

The implementation retained strong containment around path traversal, generation identity, legacy-by-default behavior, absent persistent-query generations, and stale-source hydration. The interface-command contract and the principal engine/database suites were repeatedly green. Release reliance is nevertheless conditional because ten required findings remain across publication integrity, stale operational/current-state authorities, stale-generation recovery semantics, operator boundary handling, and overstated parity/performance evidence.

## Planning Trigger

`/speckit:plan` is required. The review found no P0 blocker, but all ten active P1 findings require remediation or an explicit contract amendment before this program should be treated as complete.

**Planning Packet**

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    "P1-001",
    "P1-002",
    "P1-003",
    "P1-004",
    "P1-005",
    "P1-006",
    "P1-009",
    "P1-010",
    "P1-011",
    "P1-012"
  ],
  "remediationWorkstreams": [
    "publication-integrity-and-operator-boundaries",
    "current-state-documentation-and-generated-metadata",
    "generation-drift-recovery-contract",
    "parity-and-performance-evidence"
  ],
  "specSeed": [
    "Define production publication-digest enforcement and malformed/absent operator behavior.",
    "Define current-state authority and regeneration requirements for docs and graph metadata.",
    "Define post-query generation drift as requery-required or amend the governing contract.",
    "Define the exact parity projection and reproducible benchmark evidence required before cutover."
  ],
  "planSeed": [
    "Fix and test P1-001, P1-011, and P1-012.",
    "Reconcile P1-002 through P1-005 and regenerate metadata.",
    "Fix all four P1-006 consumers and add requery assertions.",
    "Narrow or reproduce P1-009 and P1-010 claims, then rerun the review."
  ],
  "findingClasses": {
    "cross-consumer": ["P1-001", "P1-005", "P1-006"],
    "matrix/evidence": ["P1-002", "P1-003", "P1-004", "P1-009", "P1-010"],
    "class-of-bug": ["P1-011"],
    "instance-only": ["P1-012"]
  },
  "affectedSurfacesSeed": [
    "published database open/query/hydration/status",
    "manual playbook and database operator README",
    "phase-parent and generated graph metadata",
    "four design-mode corpus consumers",
    "operator parser and clean-checkout status",
    "shadow comparator and performance evidence"
  ],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

| ID | Severity | Finding | Evidence | Class | Disposition |
|----|----------|---------|----------|-------|-------------|
| `P1-001` | P1 | Published SQLite opens do not enforce the manifest content digest. | `.opencode/skills/sk-design/styles/lib/database/schema.mjs:343-356`; `generation-manifest.mjs:204-234` | cross-consumer | Active; enforce digest or prove immutable publication. |
| `P1-002` | P1 | The mandatory manual playbook uses removed `_db` and `_engine` paths. | `.opencode/skills/sk-design/styles/docs/manual-testing-playbook.md:13-49` | matrix/evidence | Active; rewrite and replay the scenario matrix. |
| `P1-003` | P1 | The phase-parent map reports shipped children as planned. | `.opencode/specs/sk-design/015-styles-database-evolution/spec.md:54-74` | matrix/evidence | Active; reconcile parent state while preserving explicit deferrals. |
| `P1-004` | P1 | The database README sends five operator commands to a removed executable. | `.opencode/skills/sk-design/styles/lib/database/README.md:69-92` | matrix/evidence | Active; update and execute all examples. |
| `P1-005` | P1 | Generated graph metadata carries stale lifecycle state and dead `_db` targets. | `012/.../graph-metadata.json:41-57`; `015/.../001.../graph-metadata.json:41-64`; `004-growth/graph-metadata.json:35-55` | cross-consumer | Active; regenerate and verify current targets/status. |
| `P1-006` | P1 | Four corpus consumers classify generation drift as `no-fit`, suppressing `requery-required`. | `.opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:374-409,503-508` plus corresponding foundations/interface/motion branches | cross-consumer | Active; fix all four consumers and assertions. |
| `P1-009` | P1 | The 10/10 shadow result proves projected cards/eligibility, not full facade DTO parity. | `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:115-141`; `adapter.test.mjs:42-61` | matrix/evidence | Active; narrow the claim or commit full-DTO evidence. |
| `P1-010` | P1 | The p95 1150→53 ms gate lacks a reproducible trace and methodology. | `015/.../006.../checklist.md:64-67`; `adapter.test.mjs:31-40,107-132` | matrix/evidence | Active; commit immutable benchmark evidence or reopen the gate. |
| `P1-011` | P1 | Valueless/unknown operator options can silently select defaults. | `.opencode/skills/sk-design/styles/lib/database/operator.mjs:49-52,213-217` | class-of-bug | Active; supersedes identity-collided `P1-007`. |
| `P1-012` | P1 | Status throws `ENOENT` when the clean-checkout database parent is absent. | `.opencode/skills/sk-design/styles/lib/database/operator.mjs:58-62,81-94` | instance-only | Active; supersedes identity-collided `P1-008`. |

`P1-007` and `P1-008` are resolved in reducer state only as append-only identity-repair supersessions. Their defects remain active as `P1-011` and `P1-012`.

## Remediation Workstreams

1. **Publication integrity and operator boundaries:** Address `P1-001`, `P1-011`, and `P1-012`; add production-open tamper coverage, parser-matrix tests, and missing-directory status coverage.
2. **Current-state authorities:** Address `P1-002`, `P1-003`, `P1-004`, and `P1-005`; update operational docs and parent state, then regenerate metadata and verify every target exists.
3. **Generation-drift recovery:** Address `P1-006` in all four corpus consumers; preserve no-source-influence while emitting and testing `requery-required`.
4. **Evidence honesty:** Address `P1-009` and `P1-010`; define parity fields, commit the ten-query evidence or narrow claims, and add a reproducible representative-trace p95 artifact.

## Spec Seed

- Production database opens must authenticate the published SQLite artifact against its publication identity or document and enforce an equivalent immutable guarantee.
- Operator CLI parsing must reject unknown options and present options without required values; clean-checkout status must return the modeled unpublished DTO.
- Post-query generation mismatch semantics must be explicit and consistent across audit, foundations, interface, and motion consumers.
- Current operational docs, phase maps, and generated graph metadata must reference only current paths and lifecycle states.
- Shadow parity must name compared and tolerated fields. Performance gates must retain raw samples, environment, warm-up policy, timing boundaries, and percentile method.

## Plan Seed

1. Add failing regression tests for production artifact tampering, malformed options, absent database root, and all four generation-drift branches.
2. Implement the smallest code fixes for `P1-001`, `P1-006`, `P1-011`, and `P1-012`; rerun the database, engine, and four mode suites.
3. Correct playbook/README/phase-parent authorities and regenerate affected metadata through the canonical owner.
4. Add or amend parity and benchmark evidence, preserving the legacy default and human-gated cutover.
5. Run a fix-completeness replay over all ten active IDs, including producer, consumer, test, and metadata surfaces.

## Traceability Status

| Protocol | Gate | Status | Evidence / Gap |
|----------|------|--------|----------------|
| `spec_code` | hard | fail | Child implementation and test-count claims largely resolve, but publication, parent-state, generation-drift, parity, and performance claims remain contradicted or overstated. |
| `checklist_evidence` | hard | partial | In-manifest 012/008, 015/005, and 015/006 checklists were replayed; the 015/001 checklist is absent from the frozen manifest. |
| `feature_catalog_code` | advisory | notApplicable | No feature catalog is named by the manifest. |
| `playbook_capability` | advisory | fail | Mandatory playbook commands use removed paths. |
| `AC_COVERAGE` | advisory | exempt | The Level-2 review target has no target-local `checklist.md` or `implementation-summary.md`, so the lifecycle predicate is inactive. |

The hard traceability protocols did not converge. The max-iteration terminal ceiling permits synthesis but does not convert these gate failures into a pass.

## Deferred Items

- Code Graph was unavailable throughout; structural-impact analysis was replaced with direct manifest enumeration, exact search, pinned Git evidence, and source rereads.
- The md-generator backend dependencies were absent, so its Vitest suite was not executed; source/test reads verified moved paths and child-process handling only.
- The target did not contain an input `resource-map.md`; its coverage gate was skipped. The reducer emitted a lineage-local `resource-map.md` from observed finding evidence.
- Bundle contents, concurrent system-deep-loop work, persistent cutover, human relevance judgments, the full live scenario matrix, and Checkpoint B remain outside scope or intentionally open.

## Dimension Expansion Map

- Correctness: iterations 1, 5, 9, and 10 covered inventory, consumer closure, parity/performance challenge, and final replay.
- Security: iterations 2 and 6 covered publication/hydration boundaries and stale-generation recovery classification.
- Traceability: iterations 3 and 7 covered packet/checklist protocols and test-to-claim closure.
- Maintainability: iterations 4 and 8 covered stale authorities/metadata and operator/API parity.
- Divergent pivots: none; `stopPolicy=max-iterations` broadened angles directly through the planned dimension rotation.
- Remaining frontier: remediation and fix-completeness replay, not further discovery on unchanged inputs.

## Search Ledger

- `hasSearchDebt: false`
- Review-depth v2 search state was not emitted; records use the accepted legacy v1 schema.
- Direct fallback ledger: manifest validation, scoped exact searches, pinned Git comparisons, direct producer/consumer rereads, targeted executable suites, and read-only boundary probes.
- Scope incidents: iterations 4 and 7 recorded over-broad searches; all out-of-manifest hits were discarded and no finding relies on them.

## Audit Appendix

### Iteration Replay

| Iteration | Dimension | New/refined findings | Ratio | Verdict |
|-----------|-----------|----------------------|------:|---------|
| 1 | correctness | 0 | 0.0000 | PASS |
| 2 | security | 1 new | 1.0000 | CONDITIONAL |
| 3 | traceability | 2 new, 1 refined | 0.8333 | CONDITIONAL |
| 4 | maintainability | 2 new | 0.4000 | CONDITIONAL |
| 5 | correctness | 0 | 0.0000 | PASS |
| 6 | security | 1 new | 0.1667 | CONDITIONAL |
| 7 | traceability | 1 refined | 0.0833 | CONDITIONAL |
| 8 | maintainability | 2 new | 0.2500 | CONDITIONAL |
| 9 | correctness | 2 new, 2 refined | 0.3000 | CONDITIONAL |
| 10 | correctness | 2 superseding IDs, 2 identity resolutions | 0.2000 | CONDITIONAL |

### Gate Replay

- Config/lineage validity: PASS.
- Strategy initialization and bounded context: PASS.
- State consistency: PASS, 10 canonical iteration records and 10 matching narrative/delta pairs.
- Iteration final-line contract: PASS, every narrative ends with an exact verdict line.
- Finding evidence/schema: PASS after iteration-10 identity repair; ten active P1 entries have file:line evidence, finding class, affected surfaces, content hash, and adjudication.
- Claim adjudication: PASS at terminal state. Iterations 2 and 6 recorded failed packets, then iterations 3 and 7 repaired them before the terminal replay.
- Dimension coverage: PASS, 4/4 dimensions plus six stabilization/breadth passes.
- Required traceability: FAIL/PARTIAL as recorded above; terminal max-iteration stop preserves the shortfall.
- P0 adversarial replay: vacuous PASS, no P0 candidate survived any iteration.
- Security-sensitive stabilization: two security passes plus a final all-claim replay completed; no fixed finding was claimed closed.
- Target packet strict validation: FAIL outside the writable lineage boundary. The Level-2 packet lacks `plan.md`, `tasks.md`, and `checklist.md`, and its existing template/anchor metadata is inconsistent. This does not invalidate the lineage artifacts, but it is an additional documentation-readiness blocker that remediation planning must address in the target packet.

### Convergence Evidence

- Stop policy: `max-iterations`
- Iterations: 10/10
- Final reducer convergence score: 0.80
- Final active registry: P0=0, P1=10, P2=0
- Final verdict derivation: no P0 and active P1 present -> `CONDITIONAL`
- Graph convergence: unavailable/no decision; direct fallback evidence is recorded per iteration

### Source Boundary

All findings derive from the target's validated 118-entry manifest. The review did not modify files under review, inspect bundle contents, flip the persistent default, generate target database state, or stage/commit artifacts.
