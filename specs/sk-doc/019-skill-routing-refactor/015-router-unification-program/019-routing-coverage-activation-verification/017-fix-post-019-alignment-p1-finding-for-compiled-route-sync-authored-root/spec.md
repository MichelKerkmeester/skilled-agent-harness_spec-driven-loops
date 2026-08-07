---
title: "Feature Specification: Compiled-Route Sync Authored-Root Repair"
description: "Restore reproducible compiled-route closure checks after the router implementation tree was flattened and renumbered. Keep the stable serving root while synchronizing the current authored internal topology atomically and preserving routing parity."
trigger_phrases:
  - "compiled route sync authored root"
  - "compiled routing renumber sync"
  - "promoted closure reproducibility"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/019-routing-coverage-activation-verification/017-fix-post-019-alignment-p1-finding-for-compiled-route-sync-authored-root"
    last_updated_at: "2026-07-26T07:59:02Z"
    last_updated_by: "opencode"
    recent_action: "Completed live publication, backup cleanup, metadata reconciliation, and strict validation."
    next_safe_action: "No packet-local work remains."
    blockers: []
    key_files:
      - ".opencode/bin/compiled-route-sync.cjs"
      - ".opencode/bin/tests/compiled-route-manifest.test.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Compiled-Route Sync Authored-Root Repair

<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The compiled router is serving correctly from its promoted mirror, but the tool that reproduces that mirror targets a source tree removed during authored-tree flattening. This phase reconnects read-only tracing to the current source, retains the stable serving root, and replaces its internals only through a verified atomic publication with local rollback.

**Key Decisions**: Follow current authored internal names; verify staging before publication; retain the prior closure until post-publish checks pass.

**Critical Dependencies**: Current authored phases, healthy existing promoted closure, and the recorded operator approval used before replacing the serving root.
<!-- /ANCHOR:executive-summary -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-25 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 17 of 17 |
| **Predecessor** | `016-review-remediation` |
| **Successor** | None |
| **Handoff Criteria** | Read-only check, staged rebuild, move simulation, status, and parity tests all pass |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`compiled-route-sync.cjs` still targets the removed `020-router-unification-program/007-unified-refactor-implementation` tree and its old internal phase names. The current authored source is directly under `015-router-unification-program`, where the closure phases are now numbered `003`, `004`, `005`, `008`, `009`, `013`, and `014`. Serving remains healthy only because the previously promoted mirror still exists, so the closure cannot currently be reproduced or safely refreshed.

This phase makes the sync tool follow the current authored topology while retaining `.opencode/bin/lib/compiled-routing` as the stable serving root.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Point sync tracing at the current authored parent and resolver.
- Reconcile authored rollout inputs and selected-policy identities with current hub sources.
- Preserve current authored relative phase names inside the stable promoted root.
- Update runtime consumers and tests to the new internal promoted paths.
- Build through a sibling staging directory, verify the staged closure, then atomically swap it into service.
- Bind every retained rollback to a publication identity and shared sibling lease.
- Reconcile external activation manifests from a captured baseline, preserving one-sided writes and halting on divergence.
- Preserve exact routing behavior.

### Out of Scope

- Changing routing scores, policy, manifests' serving authority, or the default-on cohort.
- Editing frozen benchmark scorer files.
- Reading spec paths from the serving runtime after promotion.
- Replacing the live serving root without separate operator authorization.

### Files to Change

| File | Change |
|------|--------|
| `.opencode/bin/compiled-route-sync.cjs` | Current authored root, staged atomic promotion, current internal paths |
| `.opencode/bin/compiled-route-status.cjs` | Current promoted activation and engine paths |
| `.opencode/bin/compiled-route.cjs` | Current promoted resolver path |
| `.opencode/bin/lib/compiled-route-manifest.cjs` | Current promoted compiler, engine, and activation paths |
| `.opencode/bin/lib/compiled-route-layout.cjs` | Select one complete runtime generation and expose the fixed publication-lock path |
| `.opencode/bin/tests/compiled-route-manifest.test.cjs` | Sync-root and check/build regression coverage |
| `.opencode/bin/lib/compiled-routing/**` | Generated promoted closure after operator-approved build |
| `015-router-unification-program/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs` | Include the registered `cli-cursor` workflow input |
| `015-router-unification-program/013-live-activation/activation/{cli-external-orchestration,sk-design,sk-doc}/manifest.json` | Refresh stale authored policy identities |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Priority | Requirement | Acceptance Criteria |
|----|----------|-------------|---------------------|
| REQ-001 | P0 | `--check` must trace the live authored resolver and resolve all seven hubs. | Command exits 0 and reports seven resolved hubs. |
| REQ-002 | P0 | Serving must continue from the stable runtime root with no spec-tree reads. | `--verify` reports zero reads under `.opencode/specs`. |
| REQ-003 | P0 | Promotion must not expose a partial closure. | Build uses a verified sibling staging root and atomic rename. |
| REQ-004 | P0 | Existing non-fleet activation manifests must survive byte-for-byte. | Capture/restore tests pass before and after promotion. |
| REQ-005 | P0 | Routing decisions must remain unchanged. | Existing manifest, status, route, and parity tests pass. |
| REQ-006 | P1 | The generated manifest must identify the current authored root and current internal file paths. | `generatedFrom` and `files[]` match the current topology. |
| REQ-007 | P1 | Failure must leave the prior runtime closure recoverable. | Rollback rename path is documented and tested without changing serving authority. |
| REQ-008 | P1 | Frozen scorer files must remain byte-identical. | Existing SHA-256 guard exits 0 before and after promotion. |
| REQ-009 | P0 | The authored closure must resolve every currently registered hub. | CLI input coverage is complete and all seven authored manifests match their compiled snapshots. |
| REQ-010 | P0 | Finalize and revert must accept only the rollback bound to the active publication. | Arbitrary, symlinked, renamed, stale, and closure-drifted rollback paths fail without mutation. |
| REQ-011 | P0 | Canonical manifest writers must not race publication. | Writers and publication atomically acquire the same sibling lease across their complete mutation windows. |
| REQ-012 | P0 | Concurrent external-manifest writes must not be overwritten silently. | Three-way reconciliation preserves one-sided changes and retains both roots on divergent changes. |
| REQ-013 | P0 | Rollback identity must cover executable closure bytes, not only an inventory file. | Ordered paths, modes, and SHA-256 content hashes are checked before finalize or revert. |
| REQ-014 | P0 | Interrupted terminal cleanup must be retryable without deleting newer publication state. | Cleanup removes old artifacts before unlock and retains a publication-bound terminal receipt. |
| REQ-015 | P0 | Long-lived status consumers must follow atomic runtime replacement. | One layout verdict is rebound when the runtime-root device/inode identity changes. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The sealed alignment sync finding is no longer reproducible.
- **SC-002**: Isolated build, authored check, lifecycle, status, and manifest tests pass before publication; live verify passes only after the approved swap.
- **SC-003**: Frozen scorer hashes and routing outputs are unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Partial replacement of serving closure | Fleet-wide routing failure | Stage and verify before one atomic directory swap. |
| Risk | Internal path consumers remain on old numbers | Load failures | Exact-text inventory plus contract tests. |
| Risk | External manifest loss during rebuild | Non-fleet state loss | Byte-preserving capture/restore and conflict tests. |
| Risk | Concurrent activation writers diverge across serving and rollback roots | Silent state overwrite | Shared writer/publication lease plus baseline-aware three-way reconciliation. |
| Risk | Stale or attacker-chosen rollback path is finalized | Wrong-tree deletion or restoration | Publication-state binding, real-directory checks, and closure fingerprints. |
| Dependency | Current authored phases under `015-router-unification-program` | Sync source unavailable | Fail before touching the serving root. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability

- Staging verification must complete before any serving-root rename.
- A failed publication must restore the exact prior directory.

### Security

- Canonical activation-manifest path and symlink checks remain unchanged.
- Serving verification must prove zero reads under `.opencode/specs`.

### Performance

- Routing remains a direct load from the stable promoted root with no additional runtime I/O.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- The authored source is absent or a traced hub does not resolve before staging begins.
- A non-fleet external activation manifest exists during promotion.
- A staging or rollback sibling already exists after an interrupted process.
- Publication rename succeeds but post-publish verification fails.
- A finalize or revert request names an arbitrary, symlinked, renamed, or stale rollback root.
- Only one activation root changes after baseline capture.
- Both activation roots change differently after baseline capture.
- A canonical manifest writer runs while a retained rollback is active.
- Cleanup fails while removing rollback, displaced-root, or lock artifacts.
- A new publication begins immediately after terminal unlock.
- Initial staging installation and rollback restoration both fail.
- The explicit kill-switch forces legacy routing during verification.
<!-- /ANCHOR:edge-cases -->

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Sync tool, bounded runtime consumers, generated closure |
| Risk | 23/25 | Serving-root replacement can affect seven hubs |
| Research | 12/20 | Rename history and current topology verified |
| Multi-Agent | 4/15 | Single execution stream |
| Coordination | 12/15 | Operator-gated publication and rollback |
| **Total** | **69/100** | **Level 3** |

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Partial serving closure | H | L | Verified sibling staging and atomic rename |
| R-002 | Missed internal path consumer | H | M | Exact-text inventory plus contract tests |
| R-003 | External manifest loss | H | L | Byte-preserving capture/restore |
| R-004 | Routing output drift | H | L | Existing parity and kill-switch suites |
<!-- /ANCHOR:risk-matrix -->

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Reproduce The Promoted Closure (Priority: P0)

**As a** routing maintainer, **I want** `compiled-route-sync.cjs --check` to trace the current authored source, **so that** a healthy serving closure can be reproduced after source-tree changes.

**Acceptance Criteria**:
1. Given the current authored tree, When `--check` runs, Then all seven hubs resolve.
2. Given a missing authored phase, When `--check` runs, Then it fails before any serving mutation.

### US-002: Publish Without Partial Serving State (Priority: P0)

**As an** operator, **I want** staged verification and atomic publication, **so that** a failed rebuild cannot expose an incomplete routing closure.

**Acceptance Criteria**:
1. Given staging verification fails, When build stops, Then the serving root is unchanged.
2. Given post-publish verification fails, When rollback runs, Then the exact prior closure is restored.
<!-- /ANCHOR:user-stories -->

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None. Repository history and current source establish the required topology.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Architecture Decision**: `decision-record.md`
- **Verification Checklist**: `checklist.md`
<!-- /ANCHOR:related-docs -->
