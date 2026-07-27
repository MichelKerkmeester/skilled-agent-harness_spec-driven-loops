---
title: "Decision Record: Compiled-Route Closure Promotion Topology"
description: "Architecture decision for preserving a stable serving root while following the current authored phase topology safely."
trigger_phrases:
  - "compiled route promotion decision"
  - "stable serving root decision"
importance_tier: "critical"
contextType: "decision"
status: "accepted"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/019-routing-coverage-activation-verification/017-fix-post-019-alignment-p1-finding-for-compiled-route-sync-authored-root"
    last_updated_at: "2026-07-26T06:21:16Z"
    last_updated_by: "opencode"
    recent_action: "Accepted publication binding, locking, and three-way reconciliation."
    next_safe_action: "Validate evidence, then request live-publication approval."
    blockers:
      - "Live serving-root replacement requires explicit operator approval."
    key_files: []
---
# Decision Record: Compiled-Route Closure Promotion Topology

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep The Stable Root And Publish Current Internals Atomically

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-25 |
| **Deciders** | OpenCode execution session |

<!-- ANCHOR:adr-001-context -->
### Context

The authored compiled-routing implementation was flattened and renumbered, but the sync tool still targets the removed wrapper tree. The existing promoted mirror serves correctly from a stable runtime root with old internal phase names, so read-only closure tracing fails and future rebuilds are impossible.

### Constraints

- The public serving root must remain stable.
- Runtime serving must read no paths under `.opencode/specs`.
- Existing activation state and routing outputs must remain unchanged.
- A failed build must not expose a partial closure.
- Concurrent writers must not be silently overwritten during a retained-rollback window.
- Finalize and revert must not accept an arbitrary or stale rollback path.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Retain `.opencode/bin/lib/compiled-routing` as the stable serving root, follow the current authored phase names inside that root, and publish only a fully verified sibling staging directory.

**Details**: The sync tool traces the current resolver under `014-runtime-engine`, copies touched files with their current paths, restores bounded external activation manifests, verifies the staging resolver with zero spec reads, renames the current root to a rollback sibling, and atomically renames staging into service. Publication and canonical manifest writers acquire the same fixed sibling lease atomically, closing the writer/publication check-then-act race. Publication state binds the publication identity, expected rollback basename, baseline external-manifest fingerprints, and prior/current fingerprints over the inventory bytes plus every ordered closure path, mode, and file-content hash. Finalize and revert validate those bindings, reconcile external manifests against the captured baseline, preserve a one-sided update, never propagate deletion automatically, and halt with both roots retained if both sides diverge. Terminal cleanup removes old roots before releasing the lease and retains state as an idempotent publication receipt, so a newer publication cannot lose its state after unlock. Runtime status binds one coherent layout per operation and reloads when atomic replacement changes the runtime-root identity.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Stable root, current internals, atomic publish** | Direct source traceability, no partial serving state, exact rollback | Bounded runtime consumers need path updates | 9/10 |
| Recreate the removed wrapper tree | Old sync code works | Restores stale topology and duplicates consolidated source | 3/10 |
| Rewrite copied imports to old numbers | Preserves old promoted internals | Breaks byte-preserving promotion and adds transformations | 4/10 |
| Treat promoted mirror as source | No source mapping needed | Cannot compare or rebuild from authored implementation | 2/10 |

**Why Chosen**: The accepted option preserves stable external entry points while restoring direct, reproducible source-to-runtime promotion and deterministic rollback.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- `--check` can trace the actual current source.
- A broken candidate cannot replace healthy serving code.
- Rollback is an exact directory rename.
- Concurrent one-sided activation writes are preserved without choosing a winner for divergent writes.
- Long-lived status processes rebind after an atomic generation replacement.
- Cleanup retries cannot remove a newer publication's state after the old lease is released.

**Negative**:
- Internal runtime imports change once. Mitigation: exact-text inventory and contract tests.
- Staging needs temporary sibling disk space. Mitigation: bounded closure size and cleanup after green post-publish gates.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missed path consumer | H | Search inventory plus route/status tests |
| Publication interruption | H | Retained rollback sibling and guarded renames |
| Manifest state loss | H | Byte-preserving capture/restore tests |
| Arbitrary rollback path | H | Fixed naming, real-directory validation, publication identity, and closure fingerprints |
| Concurrent two-sided manifest changes | H | Baseline-aware three-way conflict that retains both roots |
| Cleanup interruption | H | Terminal phase receipt plus remove-before-unlock ordering |
| Persistent serving-path rename failures | H | Retry verified staging; retain staging, rollback, state, and lease for manual recovery |
| Routing drift | H | Existing parity and kill-switch gates |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

| Check | Result | Evidence |
|-------|--------|----------|
| Necessary | Pass | Current `--check` targets a removed source tree |
| Beyond Local Maxima | Pass | Compared stale-wrapper, transform, and mirror-as-source alternatives |
| Sufficient | Pass | Covers trace, staging, publication, verification, and rollback |
| Fits Goal | Pass | Closes the sealed sync reproducibility finding without policy changes |
| Open Horizons | Pass | Future source renumbering remains detectable and testable |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes

**Affected Systems**:
- `.opencode/bin/compiled-route-sync.cjs`
- `.opencode/bin/compiled-route-status.cjs`
- `.opencode/bin/compiled-route.cjs`
- `.opencode/bin/lib/compiled-route-manifest.cjs`
- `.opencode/bin/tests/compiled-route-manifest.test.cjs`
- Generated `.opencode/bin/lib/compiled-routing/**`

**Rollback**: Before publication, discard only staging. After publication, validate the fixed lock and publication state, reconcile safe one-sided external changes, rename the retained prior closure back to the stable serving root, and rerun status and parity checks. If reconciliation diverges or restored-root verification fails, retain both roots and stop without cleanup.
<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->
