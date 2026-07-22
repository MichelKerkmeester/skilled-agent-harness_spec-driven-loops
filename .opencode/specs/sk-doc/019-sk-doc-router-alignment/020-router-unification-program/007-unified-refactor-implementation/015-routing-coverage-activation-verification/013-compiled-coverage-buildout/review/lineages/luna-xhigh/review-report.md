---
title: "Deep Review Report: Compiled Coverage Buildout"
description: "Final conditional review for the detached luna-xhigh lineage."
sessionId: "fanout-luna-xhigh-1784691838667-iv78vk"
verdict: "CONDITIONAL"
---

# Deep Review Report

## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **Active findings:** 0 P0, 2 P1, 2 P2
- **Resolved findings:** 1 reducer-only summary artifact
- **Iterations:** 10/10
- **Convergence:** 1.00
- **Search debt:** none
- **Corruption:** none
- **Scope:** compiled-routing manifest refresh, resolver/cohort behavior, parity and sync controls, packet completion evidence, and regression boundaries

The runtime surfaces are substantially fail-closed and the seven-hub default-on claims have broad parity evidence. The review does not issue PASS because the refresh path lacks concurrency protection and the packet's completion metadata contradicts its own required evidence protocol.

## 2. Planning Trigger

`/speckit:plan` is required for the two active P1 remediation workstreams. The P2 items can be handled as documentation and maintenance follow-ups.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": [
    {"id":"F001","severity":"P1","title":"Concurrent refreshes can lose a generation/policy update","file":".opencode/bin/lib/compiled-route-manifest.cjs","line":588},
    {"id":"F002","severity":"P1","title":"Completion status conflicts with required packet gates","file":".opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout/checklist.md","line":58},
    {"id":"F003","severity":"P2","title":"SD-015 limitation and follow-up are stale","file":".opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout/implementation-summary.md","line":208},
    {"id":"F004","severity":"P2","title":"Default-on cohort is maintained in multiple independently edited sources","file":".opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs","line":34}
  ],
  "remediationWorkstreams": [
    "Serialize or compare-and-swap refresh writes and add a concurrent-refresh regression test.",
    "Reconcile packet statuses, task/checklist completion, P1 deferrals, and operator sign-off.",
    "Mark the SD-015 follow-up resolved with its existing test evidence.",
    "Generate or gate all default-on cohort copies from one canonical source."
  ],
  "specSeed": [
    "Document refresh concurrency semantics and the accepted rollback/locking behavior.",
    "Reconcile the packet's completion contract with remaining unchecked evidence."
  ],
  "planSeed": [
    "Add a refresh race test using two concurrent refresh processes.",
    "Choose and implement a lock or compare-and-swap protocol.",
    "Synchronize plan.md, tasks.md, decision-record.md, checklist.md, and sign-off."
  ],
  "findingClasses": ["class-of-bug","matrix/evidence","instance-only","synchronization-risk"],
  "affectedSurfacesSeed": ["canonical manifest refresh CLI","activation manifest state","packet completion metadata","runtime/advisor cohort copies"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### F001 - P1

- **Title:** Concurrent refreshes can lose a generation/policy update
- **Evidence:** `.opencode/bin/lib/compiled-route-manifest.cjs:564-588`; `.opencode/bin/tests/compiled-route-manifest.test.cjs:457-472`
- **Impact:** Two valid refreshes can read the same generation and later overwrite each other's policy state. The concurrent test covers atomic mint, not refresh.
- **Recommendation:** Serialize refreshes or use compare-and-swap on generation/hash, then add a concurrent refresh regression test.
- **Disposition:** Active, confirmed across iterations 1-10.

### F002 - P1

- **Title:** Completion status conflicts with required packet gates
- **Evidence:** `checklist.md:52-58,92,123-124,197-208`; `plan.md:11,77-82`; `tasks.md:10-20,114-121`; `decision-record.md:11-18`
- **Impact:** The packet claims complete while required P1 rows, planned metadata, stale blockers, and formal operator sign-off remain unresolved.
- **Recommendation:** Reconcile all lifecycle metadata and checklist/task state, or record explicit operator-approved deferrals before claiming complete.
- **Disposition:** Active, confirmed across iterations 4-10.

### F003 - P2

- **Title:** SD-015 limitation and follow-up are stale
- **Evidence:** `implementation-summary.md:204-220`; `compiled-routing-parity.vitest.ts:468-537`
- **Impact:** The packet understates its regression coverage and leaves an inaccurate follow-up open.
- **Recommendation:** Mark the limitation resolved and cite the positive and adversarial SD-015 tests.
- **Disposition:** Active documentation drift.

### F004 - P2

- **Title:** Default-on cohort is maintained in multiple independently edited sources
- **Evidence:** promoted resolver `resolve.cjs:29-42`; authored resolver twin; `compiled-routing-flag.ts:24-40`; `compiled-routing-foundation.vitest.ts:70-74`
- **Impact:** A future cohort change can update one source while leaving another stale. Current tests detect divergence after the fact.
- **Recommendation:** Generate all cohort consumers from one canonical source or add a pre-packaging generation gate.
- **Disposition:** Active maintainability advisory.

## 4. Remediation Workstreams

### Workstream A - Refresh Atomicity

- Add a deterministic concurrency test for `refreshCanonicalManifest`.
- Choose lock, compare-and-swap, or equivalent serialized replacement semantics.
- Preserve the existing fail-closed compile-error and manifest-validation behavior.

### Workstream B - Completion Evidence Reconciliation

- Align `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, and `handover.md`.
- Mark completed tasks with evidence and separately record unresolved acceptance follow-ups.
- Obtain or explicitly record the required operator disposition for remaining P1 rows and sign-off.

### Workstream C - Documentation and Cohort Maintenance

- Correct the SD-015 limitation and follow-up.
- Establish one canonical default-on cohort or a generated synchronization check covering runtime, authored, promoted, and advisor surfaces.

## 5. Spec Seed

- Add a requirement that concurrent manifest refreshes cannot publish a stale generation or silently lose a policy update.
- Add acceptance evidence for refresh serialization/compare-and-swap and concurrent execution.
- Define packet completion as separate from implementation shipment, with explicit P1 deferral and operator sign-off semantics.

## 6. Plan Seed

- **T1:** Reproduce the refresh race with concurrent CLI invocations.
- **T2:** Implement and test serialized or compare-and-swap refresh publication.
- **T3:** Re-run manifest and fleet regression suites.
- **T4:** Reconcile packet lifecycle metadata and checklist evidence.
- **T5:** Replace duplicated cohort literals with generated or preflight-validated sources.
- **T6:** Correct the stale SD-015 follow-up and rerun strict packet validation.

## 7. Traceability Status

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial | Runtime delivery is supported, but completion metadata conflicts with required packet state. |
| `checklist_evidence` | fail | Required unchecked rows and blank operator sign-off coexist with `complete`. |
| `feature_catalog_code` | notApplicable | No catalog mutation was evaluated in this detached lineage. |
| `playbook_capability` | partial | Parity and adversarial tests exist; the SD-015 follow-up text is stale. |
| `AC_COVERAGE` | advisory-shortfall | Level-3 packet lifecycle is active; exact covered/total counts are UNKNOWN, with open P1 evidence rows and sign-off. |

The resource map was absent at lineage initialization, so the conditional resource-map coverage gate was skipped. Synthesis still emitted `resource-map.md`; it contains zero automatically extracted references because the delta records did not identify implementation target entries.

## 8. Deferred Items

- Full seven-hub LUNA-HIGH acceptance sweep remains a separate follow-up recorded by the packet.
- The operator-gated merge to v4 remains out of scope.
- F003 and F004 are non-blocking after the P1 workstreams are dispositioned.

## Dimension Expansion Map

- Correctness: covered in iterations 1, 2, 6, 7, 8, 9, and 10.
- Security: covered in iterations 3, 7, and 8; no new security finding.
- Traceability: covered in iteration 4 and revisited in iteration 9.
- Maintainability: covered in iteration 5.
- Remaining frontier: remediation of F001/F002 and canonical packet-state reconciliation.

## 9. Search Ledger

- Search debt: none.
- Candidate coverage: no unresolved search candidates recorded.
- Ruled-out directions: path traversal, symlink escape, invalid-flag enablement, missing SD-015 tests, and parity false-pass leakage were directly checked and not confirmed.
- Clean search proof: ten iterations completed; no new findings after iteration 5.

## 10. Audit Appendix

- **Lineage:** `fanout-luna-xhigh-1784691838667-iv78vk`
- **Executor:** `cli-opencode`, `openai/gpt-5.6-luna-fast`, `xhigh`
- **Stop reason:** `maxIterationsReached`
- **Release readiness:** `release-blocking` while active P1 findings remain
- **Reducer:** `openFindingsCount=4`, `resolvedFindingsCount=1`, `convergenceScore=1`, `corruptionCount=0`
- **Iteration verification:** iterations 1-10 each passed `verify-iteration.cjs`
- **State integrity:** JSONL parsed cleanly under the reducer; canonical finding records carry content hashes for deduplication
- **Core protocols:** `spec_code`, `checklist_evidence`
- **Overlay protocols:** `feature_catalog_code` not applicable; `playbook_capability` partial
- **Resolved artifact:** `SUMMARY-P1-001` was a reducer-only summary artifact from iteration 2 and was explicitly resolved in iteration 3
- **User boundary honored:** all writes remained inside the `luna-xhigh` lineage directory; no graph/database or canonical packet files were modified

## Cross-Reference Appendix

### Core Protocols

- `spec_code`: implementation evidence confirmed; lifecycle contradiction remains F002.
- `checklist_evidence`: failed for unconditional completion because open P1 rows and sign-off remain.

### Overlay Protocols

- `feature_catalog_code`: not applicable to this lineage's review scope.
- `playbook_capability`: parity and negative-path tests are present; stale SD-015 documentation remains F003.
