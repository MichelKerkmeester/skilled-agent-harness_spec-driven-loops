---
title: Deep Review Strategy - 044 Named Sub-Tracks and Host Repos
description: Runtime strategy for the fan-out deep-review lineage deepseek over the named sub-track implementation and host-repository fixes.
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

## 1. OVERVIEW

### Purpose

Serves as the persistent brain for this review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next.

### Usage

- Init: seeded with the review charter, bounded context snapshot, and per-file coverage table.
- Per iteration: the iteration narrative is written, strategy commentary is appended, and the reducer refreshes the machine-owned sections.
- Mutability: mutable; machine-owned blocks are refreshed by the reducer.

---

## 2. TOPIC
Review of `specs/system-speckit/044-named-subtracks-and-host-repos` implementation in commits `ac32d66fed..7714ff26b1`: declared sub-track support in spec-kit track tooling (track roots, refresh, sweep, create.sh, validate, parent derivation, repair-derived, archive.sh), the doctor `project_owned` entry and host `.skilled` build, and the host trigger-index docs.

**Workspace conflict recorded at init:** the repository moved during a server restart from the dispatch-time layout to a reorganized tree. The reviewed commit range still resolves, and the implementation files remain at their reviewed paths. The packet itself was renamed/relocated to `specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos` by commit `26cc92b728a` after the reviewed range. This lineage keeps the dispatch-bound write surface `specs/system-speckit/044-named-subtracks-and-host-repos/review/lineages/deepseek` and reviews the named commits, not the relocated packet copy.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- No fixes are implemented during review; findings are reported only.
- No `.env` file is opened at any depth.
- No file under `barter/` is opened.
- No write outside the dispatch-bound lineage directory.
- No review of commits after `7714ff26b1` except where a later path move explains a missing dispatch-time path.

---

## 5. STOP CONDITIONS
- Hard ceiling: `maxIterations = 5` with `stopPolicy = max-iterations`; convergence is telemetry only.
- Each iteration must cover its dimension plus the operator review focus.
- Synthesis runs after iteration 5 regardless of convergence signals.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 2
- P2 (Suggestions): 14
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading the two views side by side (`readWorkingTreeTracks` versus `readCommitTracks`) exposed their different metadata-symlink behavior, which a one-view read would miss. (iteration 1)
- The shared fixture tree (`subtrack-tree.mjs`) made it possible to check declaration, flat, undeclared and symlinked shapes against the same expectations. (iteration 1)
- Checking the move destinations against `expectedParentId`'s branch conditions found a destination class (specs root, other track) that the tests do not exercise. (iteration 1)
- Comparing every copy of the declaration rule side by side found two write/read splits: `create.sh` follows a symlinked sub-track, and a linked `description.json` is accepted by validation/archive but refused by track-roots. (iteration 2)
- Reading `create.sh` from `--track` parsing through `mkdir -p` showed no resolved-path check on the normal branch; the subfolder/`--path` branches do not cover it. (iteration 2)
- Cross-reading the declaration table, the fixture and every reader separated a documentation requirement (`specId`) from the enforced contract (`level` only) and found the example's missing parent prefix. (iteration 3)
- Reading the packet's own decision table downgraded the iteration-1 P1 to a documented limitation instead of carrying an inflated blocker. (iteration 3)
- Lining up the six declaration copies and the two view return shapes turned "looks similar" into a concrete drift and a latent API trap. (iteration 4)
- Checking the changed code files for `REQ-`/`AC-`/`CHK-`/`T0xx`/`ADR-` ids confirmed the packet's comment-hygiene claim instead of trusting it. (iteration 4)

---

## 9. WHAT FAILED
- Assuming "a move recomputes the parent" covered every valid destination; the repair only covers into a sub-track, between sub-tracks, out to the same track and into an archive. (iteration 1)
- Assuming the working-tree and commit views agree on a symlinked metadata file because they agree on a symlinked description file; they do not. (iteration 1)
- Assuming `archive.sh`'s link refusal implied the same policy in `create.sh`; it does not, and the two tools disagree on the same sub-track path. (iteration 2)
- Assuming the declaration predicate is shared because every tool reads `description.json`; each tool has its own copy, and they disagree on a linked description and on a `z_` track. (iteration 2)
- Taking the packet's "every task done" continuity line at face value; the `completion_pct: 90` field still says otherwise. (iteration 3)
- Treating "a deeper layout is reported" as implemented; the readers scan only direct children of a track. (iteration 3)
- Assuming the two view functions share a return type because they share the module; the working-tree view hides diagnostics on the array. (iteration 4)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "`completion_pct: 90` is a template placeholder": ruled out by the surrounding continuity fields (`recent_action`, `next_safe_action`) carrying real values; this is a written completion state. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "`completion_pct: 90` is a template placeholder": ruled out by the surrounding continuity fields (`recent_action`, `next_safe_action`) carrying real values; this is a written completion state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`completion_pct: 90` is a template placeholder": ruled out by the surrounding continuity fields (`recent_action`, `next_safe_action`) carrying real values; this is a written completion state.

### "`create.sh` follows a symlinked single-segment track": deliberate per `validate_track_value` and not counted as a new finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "`create.sh` follows a symlinked single-segment track": deliberate per `validate_track_value` and not counted as a new finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`create.sh` follows a symlinked single-segment track": deliberate per `validate_track_value` and not counted as a new finding.

### "`R2-P1-001` is only a symlinked-track behavior": ruled out; the two-segment sub-track is the new form, and the readers skip it while the writer follows it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "`R2-P1-001` is only a symlinked-track behavior": ruled out; the two-segment sub-track is the new form, and the readers skip it while the writer follows it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`R2-P1-001` is only a symlinked-track behavior": ruled out; the two-segment sub-track is the new form, and the readers skip it while the writer follows it.

### "`R2-P1-002` is harmless because the validator and the reader are allowed to disagree": ruled out by the user-visible split (validation/archive accept a container that refresh/sweep cannot see) and by the spec's declaration-is-the-container rule. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "`R2-P1-002` is harmless because the validator and the reader are allowed to disagree": ruled out by the user-visible split (validation/archive accept a container that refresh/sweep cannot see) and by the spec's declaration-is-the-container rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`R2-P1-002` is harmless because the validator and the reader are allowed to disagree": ruled out by the user-visible split (validation/archive accept a container that refresh/sweep cannot see) and by the spec's declaration-is-the-container rule.

### "`tracks.diagnostics` is lost by the sweep": ruled out; the sweep reads the property directly. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "`tracks.diagnostics` is lost by the sweep": ruled out; the sweep reads the property directly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`tracks.diagnostics` is lost by the sweep": ruled out; the sweep reads the property directly.

### "A symlinked sub-track is followed by the track readers": ruled out by `entry.isSymbolicLink()` and `mode === '120000'` in both views. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "A symlinked sub-track is followed by the track readers": ruled out by `entry.isSymbolicLink()` and `mode === '120000'` in both views.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A symlinked sub-track is followed by the track readers": ruled out by `entry.isSymbolicLink()` and `mode === '120000'` in both views.

### "A symlinked sub-track is followed in one view": ruled out by the explicit `entry.isSymbolicLink()` / `mode === '120000'` branches and the parity test. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "A symlinked sub-track is followed in one view": ruled out by the explicit `entry.isSymbolicLink()` / `mode === '120000'` branches and the parity test.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A symlinked sub-track is followed in one view": ruled out by the explicit `entry.isSymbolicLink()` / `mode === '120000'` branches and the parity test.

### "Archive writes through a symlinked sub-track": ruled out by `reject_linked_argument`; the path is refused before `is_packet_home`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "Archive writes through a symlinked sub-track": ruled out by `reject_linked_argument`; the path is refused before `is_packet_home`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Archive writes through a symlinked sub-track": ruled out by `reject_linked_argument`; the path is refused before `is_packet_home`.

### "The `create.sh` probe failure is reported elsewhere": ruled out; `refresh_track_root` returns 0 before any `report_missing_generator` call when the reader fails. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The `create.sh` probe failure is reported elsewhere": ruled out; `refresh_track_root` returns 0 before any `report_missing_generator` call when the reader fails.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The `create.sh` probe failure is reported elsewhere": ruled out; `refresh_track_root` returns 0 before any `report_missing_generator` call when the reader fails.

### "The `project_owned` entry is undocumented": the manifest is the config surface and the spec's REQ-009 names it; no separate user doc is claimed. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The `project_owned` entry is undocumented": the manifest is the config surface and the spec's REQ-009 names it; no separate user doc is claimed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The `project_owned` entry is undocumented": the manifest is the config surface and the spec's REQ-009 names it; no separate user doc is claimed.

### "The docs omit the sub-track level from one of the three named files": ruled out by the diff and the files' headings. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The docs omit the sub-track level from one of the three named files": ruled out by the diff and the files' headings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The docs omit the sub-track level from one of the three named files": ruled out by the diff and the files' headings.

### "The doctor fallback overwrites a host's `.env.example`": ruled out by the `project_owned` branch and the byte-preservation test. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The doctor fallback overwrites a host's `.env.example`": ruled out by the `project_owned` branch and the byte-preservation test.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The doctor fallback overwrites a host's `.env.example`": ruled out by the `project_owned` branch and the byte-preservation test.

### "The doctor mirrors a host-relative link when the host target is absent": ruled out by `linkTargetExists`; the setup test asserts the alias is omitted. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The doctor mirrors a host-relative link when the host target is absent": ruled out by `linkTargetExists`; the setup test asserts the alias is omitted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The doctor mirrors a host-relative link when the host target is absent": ruled out by `linkTargetExists`; the setup test asserts the alias is omitted.

### "The host index command names a flag the CLI does not accept": ruled out by the target CLI usage and argument parsers. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The host index command names a flag the CLI does not accept": ruled out by the target CLI usage and argument parsers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The host index command names a flag the CLI does not accept": ruled out by the target CLI usage and argument parsers.

### "The host index docs point at a file the lookup does not read": ruled out by the `--index` parser and the `DEFAULT_INDEX_PATH` fallback. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The host index docs point at a file the lookup does not read": ruled out by the `--index` parser and the `DEFAULT_INDEX_PATH` fallback.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The host index docs point at a file the lookup does not read": ruled out by the `--index` parser and the `DEFAULT_INDEX_PATH` fallback.

### "The host-index duplication is a current contradiction": ruled out; the three command blocks name the same flags, so this is a maintainability advisory. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The host-index duplication is a current contradiction": ruled out; the three command blocks name the same flags, so this is a maintainability advisory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The host-index duplication is a current contradiction": ruled out; the three command blocks name the same flags, so this is a maintainability advisory.

### "The p2 completion-percentage mismatch blocks release": ruled out; it is a documentation/metadata advisory, not a P1. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The p2 completion-percentage mismatch blocks release": ruled out; it is a documentation/metadata advisory, not a P1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The p2 completion-percentage mismatch blocks release": ruled out; it is a documentation/metadata advisory, not a P1.

### "The parent track's children set changed for flat tracks": ruled out by the byte-identical flat-tree test and by the unchanged `numberedChildren` filter. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The parent track's children set changed for flat tracks": ruled out by the byte-identical flat-tree test and by the unchanged `numberedChildren` filter.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The parent track's children set changed for flat tracks": ruled out by the byte-identical flat-tree test and by the unchanged `numberedChildren` filter.

### "The six predicate copies produce the same answer today for a normal folder": they agree on the plain `level` case; the divergence requires a linked description or a `z_` track. The finding is the drift risk plus the two live splits. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The six predicate copies produce the same answer today for a normal folder": they agree on the plain `level` case; the divergence requires a linked description or a `z_` track. The finding is the drift risk plus the two live splits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The six predicate copies produce the same answer today for a normal folder": they agree on the plain `level` case; the divergence requires a linked description or a `z_` track. The finding is the drift risk plus the two live splits.

### "The sub-track's packets are counted in the parent's children as well": ruled out by the fixture expectation and `numberedTreeChildren` filtering only numbered entries. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The sub-track's packets are counted in the parent's children as well": ruled out by the fixture expectation and `numberedTreeChildren` filtering only numbered entries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The sub-track's packets are counted in the parent's children as well": ruled out by the fixture expectation and `numberedTreeChildren` filtering only numbered entries.

### "The sweep's diagnostics change its exit code": ruled out by code reading (`drifted` is incremented only for unreadable metadata or a mismatch) and by the test's exit-0 assertion. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The sweep's diagnostics change its exit code": ruled out by code reading (`drifted` is incremented only for unreadable metadata or a mismatch) and by the test's exit-0 assertion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The sweep's diagnostics change its exit code": ruled out by code reading (`drifted` is incremented only for unreadable metadata or a mismatch) and by the test's exit-0 assertion.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Dispatch-time path `specs/system-speckit/044-named-subtracks-and-host-repos`: treated as a recorded workspace conflict, not a code finding (iteration 1, evidence: `26cc92b728a` relocates the packet; the reviewed code paths still resolve).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Dimension: synthesis. Focus area: compile the nine-section review report from the registry, carry the two active P1s into the Planning Packet, record the terminal synthesis event with `stopReason: maxIterationsReached`, and mark the config complete. Reason: the loop reached `maxIterations = 5` with every dimension and the operator focus covered; no P0 exists, two P1s remain active. Rotation status: all dimensions complete. Required evidence: the registry counts, the five iteration files, the two P1 cases, and the synthesis-closeout invariant check. Recovery note: none.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `ac32d66fed..7714ff26b1`; 36 changed files. Core implementation: `track-roots.mjs`, `refresh-track-roots.mjs`, `sweep-track-roots.mjs`, `create.sh`, `validate.sh`, `repair-derived.cjs`, `archive.sh`, `orchestrator.ts`, `graph-metadata-parser.ts`, doctor `symlink-engine.cjs`, `trigger-index.json`, and the packet docs.
- Behavior claims: a declared sub-track (`description.json` with `level: "sub-track"`) behaves like a track in every track-level tool; flat tracks behave exactly as before; sub-track packets derive `parent_id` from the sub-track and recompute it on move; undeclared non-numbered folders are reported, not skipped; symlinked sub-tracks are skipped in both views; one named level only.
- Reuse and conventions: existing `track-roots.mjs` working-tree and commit views, `create.sh` refresh contract, `validate.sh` recursion and orchestrator exemptions, doctor symlink engine `project_owned` convention, trigger-index generation script.
- Review risks and gaps: reviewed commits predate the current HEAD; some reviewed paths moved with the packet reorg; no resource map; tests were not executed because the review is observation-only and running repo tooling is out of scope for this lineage.
- Out of scope: `.env` files, `barter/` files, Barter priority numbering and sub-track maps, writes through a linked specs root, nested sub-tracks, symlinked sub-track traversal.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | - | - | - | pending |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs` | - | - | - | pending |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs` | - | - | - | pending |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | - | - | - | pending |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | - | - | - | pending |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | - | - | - | pending |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | - | - | - | pending |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | - | - | - | pending |
| `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts` | - | - | - | pending |
| `.skilled/commands/doctor/scripts/symlink-engine.cjs` | - | - | - | pending |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | - | - | - | pending |
| `.skilled/skills/system-spec-kit/references/structure/folder-structure.md` | - | - | - | pending |
| `specs/system-speckit/044-named-subtracks-and-host-repos/spec.md` | - | - | - | pending |
| `specs/system-speckit/044-named-subtracks-and-host-repos/acceptance-criteria.md` | - | - | - | pending |
| `specs/system-speckit/044-named-subtracks-and-host-repos/tasks.md` | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10 (telemetry only under max-iterations)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-1794073077587-4hefyi, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T07:37:45Z
<!-- MACHINE-OWNED: END -->
