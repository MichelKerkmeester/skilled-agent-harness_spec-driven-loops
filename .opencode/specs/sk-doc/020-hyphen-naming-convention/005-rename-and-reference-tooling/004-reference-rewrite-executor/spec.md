---
title: "Feature Specification: static reference-rewrite executor (032 phase 005.004)"
description: "The checker only records reference sites read-only and the engine only moves files, so nothing deterministically rewrites in-file references to renamed paths. This phase defines a compare-and-swap-protected static reference-rewrite executor that consumes the disposition ledger and semantic map, verifies each site's preimage blob before writing, and regenerates rather than force-applies a rewrite plan whose base moved."
trigger_phrases:
  - "static reference-rewrite executor"
  - "compare-and-swap reference rewrite"
  - "preimage blob hash rewrite"
  - "deterministic reference rewrite"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/004-reference-rewrite-executor"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the static reference-rewrite executor phase contract"
    next_safe_action: "Implement CAS-protected static rewrite against the 002 ledger and 006 map"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The executor rewrites only static reference sites the checker already dispositioned; it never discovers references itself."
      - "Each rewrite records the preimage blob hash; a changed blob regenerates the plan instead of force-applying a stale textual patch."
      - "Dynamic references are routed to their producer or flagged, never blindly patched to a guessed path."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Static Reference-Rewrite Executor

> Phase adjacency under the 005 parent (grouping order, not a runtime dependency): predecessor `003-fixture-corpus-and-dry-run-harness`; successor `006-inventory-and-frozen-map`.

> **Origin — execution-readiness reconciliation (2026-07-15).** The rename engine (`001`) performs `git mv` only and the reference checker (`002`) is explicitly read-only, so no phase deterministically APPLIES the reference rewrites that a rename requires. Rewriting references by hand per lane is the single largest source of rework under concurrent drift, because a stale textual patch silently corrupts a file another session just edited. This phase closes that gap with a compare-and-swap executor. See the packet's execution-parallelization-strategy.md.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/004-reference-rewrite-executor |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | sk-doc |
| **Origin** | Child phase 004 of the 032 rename-and-reference-tooling program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The migration moves filesystem names with `git mv` (phase 001) and discovers every reference to those names with a read-only
checker (phase 002), but neither phase rewrites the references themselves. Left to per-lane hand editing, reference repair
becomes the dominant rework cost during a moving-base migration: the moment a concurrent session edits a file, a
previously-planned textual patch no longer matches the file it targeted, and applying it blindly either fails or silently
corrupts the concurrent edit.

This phase defines a deterministic executor that consumes the phase 002 disposition ledger and the phase 006 semantic map and
rewrites only the static reference sites the checker already dispositioned. Every planned rewrite records the preimage blob hash
and a stable semantic site identifier. Before writing, the executor compares the current blob against the recorded preimage; if
they differ it does not force-apply a stale patch — it regenerates that batch's rewrite plan from the current blob. The executor
is dry-run by default, operates one dependency-closed batch at a time, is idempotent, and can reverse its own applied rewrites.
This is the mechanism that lets a drifted batch re-derive rather than be hand-fixed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A deterministic executor that consumes the phase 002 disposition ledger (static reference sites) and the phase 006 semantic map.
- Compare-and-swap semantics: each planned rewrite records the preimage blob hash and semantic site ID; a changed blob triggers
  rescan-and-regenerate for that batch, never a stale textual apply.
- Static reference classes only, as enumerated by the checker: module import/require string paths, Markdown links, JSON/YAML/TOML
  path values, shell `source` paths, symlink targets, and registry path entries.
- Dry-run by default, explicit apply, idempotent reruns, a per-site rewrite journal, and rollback of rewrites owned by the executor.
- Exemption-aware writes: frozen, generated, vendored/third-party, and tool-mandated surfaces are never rewritten; a dynamic
  reference site is routed to its producer or flagged, never patched to a guessed path.
- Batch-scoped operation over one dependency-closed reference-graph SCC at a time, so a drifted batch regenerates in isolation.

### Out of Scope
- The filesystem rename itself (`git mv`); phase 001 owns path moves and their inverse journal.
- Reference discovery, classification, and the disposition ledger; phase 002 is the read-only checker that produces this phase's input.
- Freezing the repository map or partitioning dependency-closed SCCs; phase 006 owns the executable frozen map.
- Rewriting dynamic references by guessing a target, or altering code identifiers, JSON/YAML/TOML keys, or frontmatter fields.
- The actual repo-wide reference rewrite; this authoring pass invokes nothing against the real tree.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The executor is dry-run by default and writes only on an explicit apply action. | A disposable Git repository produces a complete rewrite plan in dry-run mode and its tracked tree, index, and file contents are unchanged. |
| REQ-002 | The executor rewrites only static sites already dispositioned by the phase 002 ledger, keyed to the phase 006 map. | No reference site absent from the ledger is rewritten; every rewrite cites the ledger site ID and the map entry it satisfies. |
| REQ-003 | Each rewrite carries compare-and-swap semantics on the preimage blob hash. | A fixture whose target blob is mutated after planning does not receive the stale textual patch; the batch's rewrite plan is regenerated from the current blob before any write. |
| REQ-004 | The executor operates one dependency-closed batch at a time and is idempotent. | A second run after an apply reports zero pending rewrites; regenerating one drifted batch does not touch the sites of any other batch. |
| REQ-005 | Exemption and dynamic-site safety are enforced before any write. | Frozen, generated, vendored, and tool-mandated surfaces are never rewritten; a dynamic reference site is routed to its producer or flagged with a reason, never patched to a guessed path. |
| REQ-006 | The executor provides a rollback contract for its own applied rewrites. | An inverse journal restores an applied batch's reference sites, and a failed apply cannot leave an unreported partial rewrite. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The executor produces a deterministic, reviewable rewrite plan from the ledger and map, and never applies a stale textual patch over a changed blob.
- **SC-002**: A drifted SCC mechanically regenerates its rewrite plan and reverifies in isolation, with no hand-editing of generated patches.
- **SC-003**: Apply, rerun, and rollback behavior is proven in a disposable Git repository without touching the real migration tree.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The phase inherits the 032 program risks: over-broad rewrites, exemption leakage, broken references, concurrent worktrees, and
non-reproducible execution. Its specific risks are a stale textual patch corrupting a concurrently-edited file, a dynamic
reference rewritten to a guessed path, a partial apply that leaves references half-rewritten, and a rewrite reaching an exempt
or generated surface.

Mitigations are compare-and-swap on the preimage blob hash with regenerate-not-force-apply, routing dynamic sites to their
producer or flagging them, a per-batch inverse journal, and the exemption classifier inherited from phases 001 and 006. The
ledger contract is owned by phase 002, the map and SCC partition by phase 006, and execution only in the isolated worktree
defined by phase 000.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The implementation may choose concrete command and journal formats, but must preserve compare-and-swap on the
preimage blob, the dry-run default, per-batch isolation, and the regenerate-rather-than-force-apply rule even if command names
differ.
<!-- /ANCHOR:questions -->
