---
title: "Feature Specification: Legacy Hub Compiled Routing Refresh"
description: "Plan the deferred refresh of stale compiled routing for system-deep-loop and cli-external-orchestration while preserving frozen replay and scorer artifacts"
trigger_phrases:
  - "legacy hub compiled routing refresh"
  - "stale compiled manifests"
  - "system-deep-loop cli-external-orchestration routing"
  - "cli-external-orchestration stale manifest"
  - "compiled-route-status all fresh"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/022-legacy-hub-compiled-routing-refresh"
    last_updated_at: "2026-08-16T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored deferred legacy hub refresh plan"
    next_safe_action: "Run in complete compiled-routing environment"
    blockers:
      - "system-deep-loop harness lacks prior activation manifest"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: Legacy Hub Compiled Routing Refresh

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-16 |
| **Track** | sk-doc |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `021-recursive-validation-remediation` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The class-H hubs `system-deep-loop` and `cli-external-orchestration` are serving routing through the legacy path with stale compiled manifests; `sk-prompt`, originally in this set, has since been refreshed to `compiled`/`fresh`. `node .opencode/bin/compiled-route-status.cjs --all` reports both stale hubs as `servingAuthority: legacy`, `fresh: false`, and `causeCode: stale-manifest`, while the other five hubs are compiled and fresh. Routing still works through legacy, so this is a degradation rather than a break.

The attempted refresh found a second blocker on 2026-08-16. The `sk-prompt` owner harness rebuilt cleanly and matched the target `currentPolicyHash` beginning `19ffb85d`, but the `system-deep-loop` owner harness crashed with `ENOENT` for `activation/manifest.prior.json`. Its harness reads a prior activation manifest it does not create, while the working `sk-prompt` harness creates its own. The required activation state is untracked, runtime-generated, and incomplete in this bare worktree, so it cannot be safely seeded. The partial rebuild was reverted and left no runtime mutation.

Update 2026-08-18: the two hubs folded into this same refresh are `system-deep-loop` (generation 4, selected hash `0854f3ec` versus current `18efd2b2`) and `cli-external-orchestration` (generation 5, selected hash `9d92aa12` versus current `5f36508`), which drifted after this packet was authored. The all-seven-fresh route-status gate in the requirements already binds both.

### Purpose

Plan the safe completion of both hub refreshes inside the 015 program's full compiled-routing environment, including complete activation state and the retained-rollback closure.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Fix the `system-deep-loop` owner harness so it creates, or no longer requires, its prior activation manifest in the same way as the working `sk-prompt` harness.
- Rebuild both hubs' compiled artifacts from their current authored `ROUTER.md` files.
- Refresh activation manifests and promote through `compiled-route-sync` with the retained-rollback closure.
- Run the program canary and confirm all seven hubs report compiled and fresh through `compiled-route-status.cjs --all`.
- Keep frozen replay/scorer files and their protected digests byte-identical throughout execution.
- Extend the same rebuild-and-refresh to `cli-external-orchestration`, which drifted to `stale-manifest` after this packet was authored; it follows the identical harness, activation, and promotion path as `system-deep-loop`.

### Out of Scope

- Executing the refresh from this bare worktree before the complete activation environment is available.
- Seeding `manifest.prior.json` from the live-serving manifest or from incomplete runtime-generated state.
- Changes to routing policy intent, frozen replay/scorer content, protected digests, or unrelated hubs.
- Running `generate-context.js` or writing the SQLite memory database.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/harness/build-artifacts.cjs` | Modify during deferred execution | Create or remove the unsafe requirement for the prior activation manifest |
| Owner harness outputs for the stale hubs (`system-deep-loop`, `cli-external-orchestration`) | Regenerate during deferred execution | Compile each stale hub from its current `ROUTER.md` files |
| Each stale hub's activation manifests and `compiled-route-sync` promotion state | Refresh during deferred execution | Promote only with retained rollback and complete activation state |
| Frozen replay/scorer files and protected digests | Verify unchanged | Preserve byte identity; do not edit |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `system-deep-loop` owner harness handles the prior activation manifest safely | The build no longer fails with `ENOENT` for `activation/manifest.prior.json`, and its behavior mirrors the working `sk-prompt` harness without seeding live-serving state |
| REQ-002 | Both stale hubs are rebuilt from authored router policy | The `sk-prompt` and `system-deep-loop` owner harnesses compile from their current `ROUTER.md` files and produce policy hashes matching the current authored policy |
| REQ-003 | Activation and promotion use the complete rollout environment | Both activation manifests are refreshed and `compiled-route-sync` promotes them with the retained-rollback closure present |
| REQ-004 | The promoted fleet passes the canary and route-status gate | The program canary passes and `compiled-route-status.cjs --all` reports all seven hubs as `servingAuthority: compiled` and `fresh: true` |
| REQ-005 | Frozen routing evidence remains byte-identical | Frozen replay/scorer files and their protected digests compare byte-for-byte before and after the refresh |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The work runs in the correct compiled-routing environment | Execution uses the 015 program environment with complete activation state and retained-rollback closure, not the incomplete bare worktree |
| REQ-007 | The refresh has a reversible failure path | Any harness, activation, promotion, canary, status, or frozen-artifact check failure stops promotion and uses the retained rollback before reattempting |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the complete 015 compiled-routing environment, **When** the `system-deep-loop` owner harness builds, **Then** it completes without the missing prior-manifest `ENOENT`.
- **SC-002**: **Given** both current authored `ROUTER.md` files, **When** the two owner harnesses rebuild, **Then** each compiled policy hash matches the current authored policy hash.
- **SC-003**: **Given** refreshed activation manifests and the retained-rollback closure, **When** `compiled-route-sync` promotes, **Then** the canary completes without a promotion or rollback-integrity failure.
- **SC-004**: **Given** the successful promotion, **When** `node .opencode/bin/compiled-route-status.cjs --all` runs, **Then** all seven hubs report compiled and fresh.
- **SC-005**: **Given** the pre-refresh frozen replay/scorer baseline, **When** post-refresh bytes and digests are compared, **Then** every protected artifact is byte-identical.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Complete 015 compiled-routing environment | Activation and retained-rollback state are incomplete in the bare worktree | Execute only where the full state and rollback closure are present |
| Dependency | `system-deep-loop` owner harness | The current harness reads a prior manifest it never creates | Repair the harness before attempting the full refresh |
| Risk | Unsafe prior-manifest seeding | A copied live-serving or incomplete manifest could misrepresent rollback state | Do not seed; create or eliminate the requirement in the owner harness |
| Risk | Promotion changes routing authority | A high-blast-radius promote can affect all seven hubs | Require retained rollback, canary, and route-status gates in sequence |
| Risk | Frozen evidence drift | Rebuild or promotion tooling could touch protected replay/scorer artifacts | Capture baseline bytes/digests and compare after every execution stage |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Integrity

- **NFR-I01**: Compiled artifacts must derive from the current authored `ROUTER.md` files.
- **NFR-I02**: Frozen replay/scorer files and protected digests must remain byte-identical.

### Reliability

- **NFR-R01**: The refresh must preserve a retained rollback path through promotion and canary execution.
- **NFR-R02**: A failed gate must stop the sequence before claiming a fresh compiled fleet.

### Observability

- **NFR-O01**: The final route-status output must expose compiled authority and freshness for all seven hubs.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Activation State

- Missing `manifest.prior.json`: the owner harness creates it or no longer requires it before any rebuild is accepted.
- Incomplete runtime-generated state: execution pauses until the complete 015 environment is available.
- Live-serving manifest mismatch: the live manifest is not treated as a safe prior-manifest substitute.

### Failure and Recovery

- Partial rebuild: revert the partial output before retrying the complete pipeline.
- Promotion or canary failure: retain the previous serving state and use the retained rollback closure.
- One hub remains legacy or stale: do not close the packet; investigate the failed stage.

### Artifact Integrity

- Any protected replay/scorer byte or digest changes: stop and restore the unchanged baseline before continuing.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Two class-H hubs, owner harnesses, compiled outputs, activation manifests, promotion, and canary |
| Risk | 22/25 | High routing-runtime blast radius and retained-rollback dependency |
| Research | 10/20 | Requires confirmation of the full activation environment and harness contract |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which complete 015 environment instance provides the authoritative activation state and retained-rollback closure for the execution run?
- Does the `system-deep-loop` harness need to create `manifest.prior.json`, or can the prior-manifest read be removed without weakening rollback safety?
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `021-recursive-validation-remediation` |
| **Successor** | None |
