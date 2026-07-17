---
title: "Feature Specification: Scoped Backfill Boundary and Exclusion Unification [template:level_2/spec.md]"
description: "The graph-metadata backfill CLI ignores a positional folder and defaults to the repo-wide root, collection does not match writer rules so one corrupt folder aborts the whole run, and the z_* exclusion policy is split across backfill, memory-index, code-graph, and the description scanner whose local skip list omits z_*. This phase adds an explicit scoped backfill boundary, makes collection match writer rules and isolate failures, and introduces an authoritative z_* exclusion helper with a descriptions.json guard, every behavioral fix shipping behind a default-off flag or a grandfather report mode so existing prefixed paths and prose statuses do not mass-fail."
trigger_phrases:
  - "scoped backfill boundary"
  - "backfill spec folder positional"
  - "collection matches writer rules"
  - "authoritative z exclusion helper"
  - "descriptions json z guard"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/002-scoped-backfill-boundary"
    last_updated_at: "2026-07-04T17:11:58.400Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded scoped backfill boundary and exclusion unification spec"
    next_safe_action: "Run speckit plan to decompose the boundary and exclusion build"
    blockers: []
    key_files:
      - "../031-generated-metadata-quality-research/research/research.md"
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-034-scoped-backfill-boundary"
      parent_session_id: "phase-034-scoped-backfill-boundary"
    completion_pct: 0
    open_questions:
      - "Whether the scoped boundary lands as a required positional or as a --spec-folder flag with --all for broad mode"
    answered_questions:
      - "Whether existing prefixed paths and prose statuses block rollout, they do not because every behavioral fix ships behind a default-off flag or a grandfather report mode"
---
# Feature Specification: Scoped Backfill Boundary and Exclusion Unification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope and verification evidence.
- Remove placeholders, stale status and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-22 |
| **Branch** | `034-scoped-backfill-boundary` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../001-identity-resolver-merge-safety/spec.md |
| **Successor** | ../003-idempotent-writes-cache-upsert/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The spec-kit generators that produce `graph-metadata.json` and `description.json` over-reach and churn, and the 031 research traced three residual defects in the backfill and exclusion paths. First, the backfill CLI ignores a positional folder and defaults to the repo-wide root, then refreshes every collected folder, and unsupported paths only fail later inside `refreshGraphMetadataForSpecFolder` (`backfill-graph-metadata.ts`), so a single-packet intent silently walks the whole tree and dirties unrelated sessions' folders. Second, collection does not match the writer rules and does not isolate failures, the walk admits candidates whose `graph-metadata.json` path fails `canClassifyAsGraphMetadataPath`, and one corrupt folder aborts the whole run rather than reporting skipped or failed, which is the structural form of the z_future crash class the seats found. Third, the z_* exclusion policy is split across backfill, memory-index, code-graph, and description discovery, and the description scanner in `folder-discovery.ts` carries a local skip list that omits z_*, so the global `descriptions.json` cache can pull prefixed staging or future folders into a scoped commit while the by-design z_archive memory inclusion at `index-scope.ts:183-186` must be preserved through a separate generatedMetadata policy. The net effect is unscoped cross-session commit churn that buries real diffs and a split policy that lets the same defect regress in four places.

### Purpose
Add an explicit scoped backfill boundary so a default run refreshes one packet only, make collection match the writer rules and isolate per-folder failures so one corrupt folder cannot abort a run, and introduce one authoritative z_* exclusion helper used at every traversal boundary with a descriptions.json guard that closes the description-scanner gap. Every behavioral fix ships behind a default-off flag or a grandfather report mode, because existing files carry the prose statuses and prefixed paths the new contract rejects and a hard cutover would mass-fail them. The result is that backfill stops walking the repo-wide root by default, a corrupt folder reports without aborting, and the exclusion policy has one source of truth rather than four divergent skip lists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An explicit scoped backfill boundary on the backfill CLI (rec 1), a required positional target or `--spec-folder` that refreshes one packet only, rejects unknown args, validates the resolved folder through the supported-root checks, and keeps broad mode behind an explicit `--all` flag default-off.
- A collection path that matches the writer rules and isolates failures (rec 4), skipping candidates whose `graph-metadata.json` path fails `canClassifyAsGraphMetadataPath` and wrapping each folder refresh so one corrupt folder reports skipped or failed without aborting the whole run.
- One authoritative z_* exclusion helper with a descriptions.json guard (rec 12), a single helper applied at every traversal boundary including the description scanner whose local skip list omits z_*, with the by-design z_archive memory inclusion preserved through a separate generatedMetadata policy.
- A default-off flag or a grandfather report mode for every behavioral fix, so existing prefixed paths and prose statuses surface as a report on first rollout rather than a hard failure.
- A vitest that proves the scoped boundary, the collection-rule match and failure isolation, and the unified exclusion plus descriptions.json guard.

### Out of Scope
- The shared spec-folder identity resolver, the merge-path lineage guard, the description idempotency, the status enum, the global-cache upsert, and the first-class validator (recs 2, 3, 5, 6, 8, 9). Those are the convergent root-cause cluster and the enforcement gate, scoped to their own phases, not this boundary-and-exclusion phase.
- The legacy-status re-derive, the drift gate, and the shared synopsis extractor (recs 7, 10, 11), separate P1 hardening outside this phase.
- The P2 refinements, the graph-metadata source fingerprint and the access-telemetry split (recs 13, 14).
- Any change to the by-design z_archive memory inclusion or the ARCHIVE_MULTIPLIERS deprioritization at `index-scope.ts:183-186`, which the 031 verification confirms is documented and intentional, not a bug.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` | Modify | Add the scoped boundary positional or `--spec-folder`, reject unknown args, validate through supported-root checks, keep broad mode behind `--all` default-off, match the writer rules in collection and wrap each refresh to isolate failures |
| `.opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js` | Modify | Rebuild the dist from the source change so the live CLI carries the scoped boundary and the failure-isolating collection |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Modify | Apply the authoritative z_* exclusion helper to the description scanner whose local skip list omits z_*, behind a default-off flag or a grandfather report mode |
| `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts` | Modify | Add the authoritative z_* exclusion helper and the separate generatedMetadata policy that preserves the by-design z_archive memory inclusion |
| `.opencode/skills/system-spec-kit/scripts/tests/scoped-backfill-boundary.vitest.ts` | Create | Prove the scoped boundary, the writer-rule match and failure isolation, and the unified exclusion plus descriptions.json guard |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The backfill CLI MUST refresh one packet only by default, accepting a required positional target or `--spec-folder`, rejecting unknown args, and validating the resolved folder through the supported-root checks (rec 1) | A default invocation with one folder refreshes only that packet and touches no sibling, an invocation with no target or an unknown arg exits non-zero with a clear contract error, and a resolved folder failing the supported-root checks is rejected before any write |
| REQ-002 | Broad repo-wide refresh MUST require an explicit `--all` flag that is default-off (rec 1) | Running without `--all` never walks the repo-wide root, and `--all` is the only path that collects more than the single resolved packet |
| REQ-003 | Collection MUST match the writer rules and isolate per-folder failures, skipping candidates whose `graph-metadata.json` path fails `canClassifyAsGraphMetadataPath` and wrapping each refresh so one corrupt folder reports skipped or failed without aborting the run (rec 4) | A candidate path the writer would reject is skipped during collection, and a run over a set containing one corrupt folder completes with that folder reported skipped or failed while every healthy folder still refreshes |
| REQ-004 | One authoritative z_* exclusion helper MUST be applied at every traversal boundary including the description scanner in `folder-discovery.ts`, and the global `descriptions.json` cache MUST NOT admit a z_* prefixed folder (rec 12) | The description scanner uses the shared helper rather than its local skip list, a z_* prefixed folder never enters the `descriptions.json` cache through the scanner, and a grep proves no second divergent skip list remains in the description path |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Every behavioral fix in REQ-001 through REQ-004 SHALL ship behind a default-off flag or a grandfather report mode, so existing prefixed paths and prose statuses surface as a report on first rollout rather than a hard failure | Toggling the flag off restores the prior behavior, the grandfather mode reports the existing prefixed-path and prose-status offenders without failing the run, and the default state does not mass-fail the existing tree |
| REQ-006 | The separate generatedMetadata policy SHALL preserve the by-design z_archive memory inclusion and the ARCHIVE_MULTIPLIERS deprioritization at `index-scope.ts:183-186` (rec 12) | The memory index still includes z_archive deprioritized at the documented multiplier, the generatedMetadata policy excludes z_* from generated JSON generation only, and a unit assertion confirms the two policies do not collide |
| REQ-007 | A vitest SHALL prove the scoped boundary, the writer-rule match with failure isolation, and the unified exclusion plus descriptions.json guard | The vitest covers a single-packet default run, an unknown-arg rejection, a supported-root rejection, a corrupt-folder isolation case, and a z_* prefixed folder refused by the description scanner, and it passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A default backfill invocation with one folder refreshes only that packet and dirties no sibling, while a run without `--all` never walks the repo-wide root, proving the scoped boundary closes the broad-walk over-reach.
- **SC-002**: A backfill run over a set containing one corrupt folder completes with that folder reported skipped or failed and every healthy folder refreshed, proving collection matches the writer rules and isolates failures.
- **SC-003**: A z_* prefixed folder never enters the `descriptions.json` cache through the description scanner, and a grep shows one authoritative exclusion helper rather than four divergent skip lists, proving the policy has a single source of truth.
- **SC-004**: Toggling the default-off flag or the grandfather report mode reports the existing prefixed-path and prose-status offenders without mass-failing the tree, proving the rollout is safe over files that still carry the rejected shapes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A hard cutover mass-fails existing files that carry prefixed paths and prose statuses | High | Ship every behavioral fix behind a default-off flag or a grandfather report mode, graduate only after a scoped migration |
| Risk | Unifying the exclusion helper accidentally drops the by-design z_archive memory inclusion | High | Keep the memory z_archive inclusion in a separate generatedMetadata policy, assert the two policies do not collide |
| Risk | The scoped boundary breaks a legitimate broad-walk caller that relied on the default repo-wide behavior | Med | Keep broad mode reachable behind an explicit `--all` flag and document the migration in the rollout |
| Dependency | The backfill CLI and the writer-rule check `canClassifyAsGraphMetadataPath` | Internal | Reuse the writer-rule check in collection rather than re-deriving the path classification |
| Dependency | The by-design z_archive policy at `index-scope.ts:183-186` documented in 031 | Internal | Preserve it through the separate generatedMetadata policy, do not change the exclusion |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A scoped default run touches only the single resolved packet, so the common path does no repo-wide walk and stays bounded by one folder.

### Reliability
- **NFR-R01**: One corrupt folder is reported skipped or failed and never aborts the run, so a broad `--all` run is resilient to a single bad folder.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A target folder that resolves outside a supported specs root: the CLI rejects it before any write rather than failing later inside the refresh.
- A z_* prefixed folder reached by the description scanner: the authoritative helper excludes it from the `descriptions.json` cache, while the memory index still includes z_archive deprioritized through the separate generatedMetadata policy.

### Error Scenarios
- A corrupt `graph-metadata.json` in one folder during an `--all` run: that folder reports skipped or failed and the run continues over every healthy folder.
- An unknown CLI arg: the gate exits non-zero with a clear contract error rather than silently defaulting to the repo-wide root.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Three CLI and helper-level changes plus a dist rebuild and one vitest, no schema or merge-path change |
| Risk | 8/25 | Behavioral cutover risk over existing prefixed paths, mitigated by the default-off flag and grandfather report mode |
| Research | 3/20 | Seams already verified to file:line in the 031 research, section 4 ranks 1, 4, and 12 |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether the scoped boundary lands as a required positional target or as a `--spec-folder` flag, given that `--all` carries the broad mode either way.
- Whether the grandfather report mode reports to stdout or writes a scoped offender list, given the existing prefixed-path and prose-status population in the live tree.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

Buildable-now safety fix. The three recs this phase ships, the scoped backfill boundary (rec 1), the writer-rule match with failure isolation (rec 4), and the authoritative z_* exclusion helper with a descriptions.json guard (rec 12), are the highest-leverage scope fix and its P1 hardening from the 031 research, all verified to file:line. The change touches the backfill CLI, the description scanner, and one shared exclusion helper, not the merge path or the schema, so it is independent of the identity-resolver and validator cluster scoped elsewhere. Every behavioral fix ships behind a default-off flag or a grandfather report mode, because the 031 verification confirms many existing files carry the prose statuses and prefixed paths the new contract rejects and a hard cutover would mass-fail them. The by-design z_archive memory inclusion is preserved through a separate generatedMetadata policy, so the exclusion unification removes the description-scanner gap without touching the documented memory behavior.
<!-- /ANCHOR:verdict -->
