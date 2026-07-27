---
title: "Tasks: Compiled-Route Sync Authored-Root Repair"
description: "Implementation and verification tasks for safe closure tracing and atomic promotion after source-tree renumbering."
trigger_phrases:
  - "compiled route sync repair tasks"
  - "promoted closure tasks"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/019-routing-coverage-activation-verification/017-fix-post-019-alignment-p1-finding-for-compiled-route-sync-authored-root"
    last_updated_at: "2026-07-26T07:59:02Z"
    last_updated_by: "opencode"
    recent_action: "Completed all implementation, publication, cleanup, metadata, and validation tasks."
    next_safe_action: "No packet-local work remains."
    blockers: []
    key_files: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->
# Tasks: Compiled-Route Sync Authored-Root Repair

<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description [EVIDENCE: command or file]`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce the missing authored-root failure. [EVIDENCE: `compiled-route-sync.cjs --check` cannot load the removed resolver]
- [x] T002 Identify the current authored phase topology and resolver. [EVIDENCE: current phases `003`, `004`, `005`, `008`, `009`, `013`, and `014` read from disk]
- [x] T003 Inventory runtime consumers of old internal promoted paths. [EVIDENCE: exact-text search under `.opencode/bin`]
- [x] T004 Record the atomic publish and rollback decision. [EVIDENCE: `decision-record.md`]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Synchronize authored CLI inputs and three selected-policy identities. [EVIDENCE: authored `--check` resolves all seven hubs]
- [x] T006 Update sync tracing to the current authored root. [EVIDENCE: `node .opencode/bin/compiled-route-sync.cjs --check` exits 0]
- [x] T007 Implement staged verification, content-bound publication state, shared leasing, three-way reconciliation, terminal cleanup receipts, and atomic publication. [EVIDENCE: manifest/publication suite 35/35]
- [x] T008 Update runtime consumers to select one coherent promoted layout. [EVIDENCE: foundation suite 25/25]
- [x] T009 Add source-root, check, writer-race, closure-drift, cleanup-race, runtime-rebind, rename-failure, and promotion regression coverage. [EVIDENCE: manifest/publication suite 35/35]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run read-only `--check` before publication. [EVIDENCE: 55 authored closure files; all seven hubs resolve]
- [x] T011 Obtain operator approval and run the serving-root build. [EVIDENCE: explicit approval and `go`; publication `62958-1785049921029` finalized]
- [x] T012 Run live `--verify`, status, route, manifest, parity, and kill-switch gates. [EVIDENCE: 7/7 hubs fresh and compiled-serving; move simulation 0 spec reads; foundation and flag suites 34/34]
- [x] T013 Confirm frozen scorer hashes and zero spec imports. [EVIDENCE: `shasum -a 256` matches all three pins; `check-no-spec-imports.cjs` passes 71/71 runtime files]
- [x] T014 Reconcile checklist, summary, metadata, and strict validation. [EVIDENCE: `validate.sh --strict` passes with 0 errors and 0 warnings]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The sealed authored-root sync finding cannot be reproduced.
- [x] Isolated lifecycle tests prove the prior closure remains recoverable throughout publication.
- [x] All seven hubs retain compiled-serving status and routing parity.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Decision**: `decision-record.md`
- **Verification**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
