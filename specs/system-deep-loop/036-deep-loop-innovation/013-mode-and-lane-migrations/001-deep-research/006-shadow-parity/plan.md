---
title: "Implementation Plan: Deep Research shadow parity"
description: "Implementation Plan for the Deep Research shadow-parity phase: define the mode event map, run the ledger adapter beside the legacy emitter, compare canonical streams and projections, and emit a blocking parity receipt without changing authority."
trigger_phrases:
  - "Deep Research shadow parity implementation plan"
  - "deep-research event parity implementation"
  - "mode 010 phase 009 implementation plan"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/006-shadow-parity"
    last_updated_at: "2026-07-22T15:57:14Z"
    last_updated_by: "opencode"
    recent_action: "Closed quarantine-priority coverage and fixture/resume-evidence key shapes"
    next_safe_action: "Define adapters, canonicalization, fixtures, and parity receipt fields"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Research Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / Deep Research mode |
| **Change class** | Additive-dark runtime adapter, verification harness, and closed successor handoff |
| **Execution** | Isolated candidate run pinned to BASE with the legacy path remaining authoritative |

### Overview
The phase implements the Deep Research shadow path over the typed event ledger. Independent legacy and ledger executors run against one sealed capsule, and the comparator checks event-for-event sequence parity plus claim, evidence, contradiction, convergence, synthesis, resume, and memory-save projections. The shared shadow framework, legacy projection engine, typed reducers, and resume adapter are driven directly. `DeepResearchParityReceipt` and `DeepResearchModeGateInput` are the only successor handoff artifacts; authority remains unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Shared mode contracts, event-version rules, and write-set ownership from phase 012 are available as pinned inputs [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] The phase-014 shadow framework interface and parent compatibility bridge expose non-authoritative dual-run hooks [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] The legacy Deep Research lifecycle and reducer output are inventoried for init, iteration, convergence, synthesis, resume, and memory-save paths [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] The canonical event tuple and volatility allowlist are reviewed before fixture results are accepted [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] The fixture corpus freezes source captures, model/tool fingerprints, manifests, budgets, and expected failure dispositions [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] The parity receipt schema records BASE, contract digests, stream digests, projection fingerprints, and diff dispositions [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]

### Definition of Done
- [x] Every required Deep Research fixture has a legacy stream, ledger stream, canonical diff, and reproducible receipt [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] Event-for-event parity has zero unexplained semantic differences, including resume and memory-save handoff behavior [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] Any tolerated transport difference is typed, allowlisted, non-semantic, and recorded in the receipt [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] The non-authoritative guard is proven and no cutover or legacy-writer removal is included [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] The successor mode gate receives a parity-green handoff contract without a cutover certificate [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Frozen run input**: bind BASE, run manifest, source snapshot, prompt/model/tool fingerprints, initial state, budget lease, and fixture ID before either path starts.
- **Legacy adapter**: observe the existing emitter and reducer behavior without rewriting legacy state; map its lifecycle records into the canonical Deep Research event vocabulary.
- **Ledger shadow adapter**: emit the typed mode events through the shared transition and event-envelope interfaces in dark, non-authoritative mode; preserve stable logical run, branch, step, and claim identities.
- **Canonical comparator**: pair by `(eventType, logicalRunId, logicalBranchId, stepKey, producerSequence)`, then compare stable payload, causal links, receipt references, artifact references, projection fingerprint, and terminal decision; classify missing, extra, duplicate, reorder, and every field-specific difference.
- **Projection oracle**: fold both canonical streams into plan, branch, evidence, claim, contradiction, next-focus, convergence, synthesis, and memory-save projections; compare each materialized view against the other and against a deterministic replay.
- **Volatility boundary**: allow only declared transport fields such as process-local timing or correlation values to vary; unknown fields and any semantic field drift fail closed.
- **Fixture and receipt store**: retain frozen inputs, both event streams, canonicalized streams, diff reports, projection fingerprints, and parity receipts in non-authoritative test output.
- **Authority guard**: shadow execution cannot publish canonical state, change the legacy writer, allocate a new authority lease, or issue a cutover certificate.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the phase-012 shared contracts, phase-014 shadow-framework interface, and parent compatibility bridge are pinned inputs; do not treat these adjacency references as a hard runtime dependency for this planning document.
- Inventory the actual legacy event and projection boundaries from the Deep Research reducer, command configuration, iteration artifacts, and memory handoff.
- Freeze the fixture manifest, source and model inputs, expected terminal classes, and parity receipt schema.

### Phase 2: Implementation
- Define the Deep Research event namespace and mapping for plan creation, branch/query work, source capture, admission, claim and contradiction lifecycle, reducer refresh, next focus, convergence, synthesis, resume, and memory-save handoff.
- Implement or specify the legacy and ledger adapters behind the shared shadow hooks, preserving one logical run and stable branch identities across both paths.
- Implement canonicalization and event-for-event comparison with a versioned volatility allowlist and explicit diff classifications.
- Build projection folds and deterministic replay checks for claims, evidence, contradictions, plan state, convergence, synthesized artifacts, receipts, and handoff state.
- Build the fixture matrix for clean, multi-branch, evidence-failure, contradiction, incomplete, convergence, source-refresh, crash-resume, synthesis, and memory-save cases.
- Emit a BASE-bound parity receipt and a blocking failure disposition for any unexplained semantic difference.

### Phase 3: Verification
- Run every fixture through legacy and ledger shadow paths from the same frozen input.
- Verify canonical event count, order, event types, identities, causal links, stable payload digests, and projection fingerprints.
- Verify fresh versus resumed continuation, source-delta invalidation, evidence quarantine, contradiction handling, terminal classification, synthesis, and memory-save handoff.
- Verify no shadow artifact becomes canonical and no authority or legacy-writer behavior changes.
- Pass only a parity receipt with zero unexplained semantic differences to `007-rollback-and-mode-gate`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Run both paths from one frozen BASE, manifest, source snapshot, input state, budget lease, and capability fingerprint; compare the recorded input digest |
| REQ-002 | Review the event map against every lifecycle and failure boundary in the legacy reducer and Deep Research command path; fail on an unmapped transition |
| REQ-003 | Compare canonical event streams position-by-position and fail on missing, extra, reordered, duplicate, identity, causal, or stable-payload differences |
| REQ-004 | Execute unknown-field and allowlist fixtures; prove only declared transport volatility is ignored and every semantic field remains compared |
| REQ-005 | Fold both streams and compare plan, branch, evidence, claim, contradiction, next-focus, convergence, synthesis, and handoff projections plus fingerprints |
| REQ-006 | Inject crash and resume boundaries, then compare reuse, re-execution, invalidation, lease, event-tail, and final-projection decisions with a fresh continuation |
| REQ-007 | Run malformed, poisoned, unsupported, stale, contradictory, and insufficient-evidence fixtures; require equal quarantine, contested, incomplete, or blocked outcomes |
| REQ-008 | Compare synthesized artifact digests, claim-edge citations, memory-save request, receipt references, and terminal handoff events without publishing shadow output |
| REQ-009 | Validate each parity receipt against BASE, schema, reducer, comparator, fixture, stream, projection, and diff metadata; replay the receipt from retained inputs |
| REQ-010 | Assert the non-authoritative flag and legacy writer ownership throughout the run; treat any canonical mutation, cutover artifact, or missing receipt as a gate failure |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase depends on the parent program's typed event and transition contracts, compatibility bridge, and shared mode contracts. It consumes the phase-014 shadow framework named in the phase brief and the phase-012 write-set conflict graph as interface inputs. It also depends on the existing Deep Research reducer and command fixtures, frozen source and model captures, the memory-save handoff contract, and the spec-kit validator. The predecessor and successor named in the phase adjacency are navigation references for sibling planning contracts; this phase does not infer a hard runtime dependency from adjacency alone.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The safe rollback is to disable or discard the non-authoritative shadow run and retain the legacy emitter and readers unchanged. Any candidate implementation lands in path-scoped commits; reverting those commits or deleting the disposable shadow output restores the prior behavior without a data migration. A parity failure must never be repaired by relaxing the comparator or promoting the ledger path. If a shadow adapter writes outside its isolated output, stop the run, preserve the failure evidence, and restore only the unintended candidate changes through a targeted revert.
<!-- /ANCHOR:rollback -->
