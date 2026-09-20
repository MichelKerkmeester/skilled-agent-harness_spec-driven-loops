---
title: "Feature Specification: sk-design Dissolution — Compiled-Routing 6-Hub Re-Activation"
description: "The sk-design hub was dissolved from the skill tree, leaving the compiled-routing engine encoding a stale 7-hub topology; migrate the engine to the 6 surviving hubs, remove the mcp-tooling cross-hub judgment coupling to sk-design, and re-run the freshness ceremony so all 6 hubs resolve compiled again."
trigger_phrases:
  - "sk-design dissolution routing"
  - "compiled routing 6 hub migration"
  - "sk-design hub removed compiled routing"
  - "mcp-tooling sk-design judgment coupling"
  - "compiled routing topology reduction"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/023-sk-design-dissolution-routing-reactivation"
    last_updated_at: "2026-08-22T08:56:00Z"
    last_updated_by: "claude-code"
    recent_action: "Ceremony complete; whole gate 794/0; validate Errors:0"
    next_safe_action: "Commit by explicit pathspec, push v4 + cherry-pick main"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "evidence/baseline.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "023-sk-design-dissolution-routing-reactivation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "mcp-tooling's sk-design judgment coupling is REMOVED, not repointed: sk-design-md-generator (the skill mcp-tooling now pairs to) has no mode-registry.json to feed the judgment compiler; any route-gold delta is adjudicated as a stale handoff to a dissolved hub"
      - "Workspace: current branch skilled/v4.0.0.0, commits scoped by explicit pathspec (shared dirty tree)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-design Dissolution — Compiled-Routing 6-Hub Re-Activation

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-22 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/015-router-unification-program` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The compiled-routing engine encodes a **7-hub topology** (`sk-code, system-deep-loop, mcp-tooling, cli-external-orchestration, sk-prompt, sk-design, sk-doc`). The `sk-design` hub was **dissolved** from the skill tree after this program shipped: `.opencode/skills/sk-design/` has zero files in git HEAD, and only 6 hubs now carry `.opencode/skills/<hub>/mode-registry.json`. The design capability now lives as the standalone `sk-design-md-generator` tool plus the mcp-figma transport; `sk-vision` is an unrelated new OCR skill, not a rename.

Because the engine still references the removed hub, `compiled-route-manifest.test.cjs` fails 16 subtests: `sync.build` throws `authored closure failed to resolve hubs` because every hub's `resolveRoute` returns null. Two failure classes, one root cause:

- **compile-error (2 hubs):** `sk-design` (its own source is gone) and `mcp-tooling` (its snapshot enumerates `.opencode/skills/sk-design/{SKILL.md,mode-registry.json}` as a cross-hub "judgment registry") throw ENOENT.
- **stale-manifest (5 hubs):** `sk-code, system-deep-loop, cli-external-orchestration, sk-prompt, sk-doc` — `generation` matches but `effectivePolicyHash` drifted since the `013-live-activation` manifests were last pinned.

The whole fleet already serves legacy (baseline: 7/7 stale, guard failures:7). Restoring green means migrating the topology 7→6 and re-running the shipped freshness ceremony for the 6 survivors so compiled serving is coherent again.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — removing `sk-design` from every compiled-routing topology site (runtime + authored `HUB_CHILD` and `DEFAULT_ON_HUBS`, `compiled-route-sync` `HUBS`, `compiled-route-guard` `HUBS`, advisor `COMPILED_ROUTING_HUBS`/`DEFAULT_ON_HUBS` + advisor dist rebuild, cutover-controller order); removing the mcp-tooling→sk-design judgment coupling at the authored + runtime snapshot generator; retiring the `009-parent-hub-rollout/006-sk-design` and `013-live-activation/activation/sk-design` subtrees; refreshing the 6 surviving hubs' manifests through the shipped `refresh` verb; re-baselining the 6 rollout canaries with written delta adjudication; re-minting/promoting via the `compiled-route-sync` precedent lane; and updating the `compiled-route-manifest.test.cjs` 7→6 contract.

Out of scope — changing the compiled-routing engine/compiler/resolver/guard *algorithms* (only the hub-topology constants change); altering advisor scoring semantics beyond the hub-set constant; any behavioral routing change to a surviving hub beyond what removing the dissolved hub forces (adjudicated, not absorbed); re-homing or resurrecting the design capability (sk-design-md-generator stands as-is).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Topology reduced 7→6 in lockstep across every hardcoded site | `compiled-routing-foundation.vitest.ts` passes: `sort(COMPILED_ROUTING_HUBS) === sort(keys(HUB_CHILD))`, all four `DEFAULT_ON_HUBS` copies equal, `DEFAULT_ON_HUBS.size === 6` |
| REQ-002 | mcp-tooling compiles without the dissolved hub | mcp-tooling's snapshot no longer reads `sk-design/*`; `compiled-route-status --all` reports mcp-tooling `causeCode` no longer `compile-error`; the judgment-coupling removal's route-gold impact is adjudicated in `009-parent-hub-rollout/ceremony-deltas.md` |
| REQ-003 | The 6 surviving hubs refresh fresh through the shipped tooling | `compiled-route-manifest.cjs refresh --hub <h>` regenerates each manifest `fresh:true`; no manifest hand-edited; the 6 canaries validate REAL-GREEN with updated `AUTHORED_DIGESTS` |
| REQ-004 | The fleet re-mints and promotes through the precedent sync lane | `compiled-route-sync.cjs` rebuilds the promoted mirror; `--verify` reports all 6 hubs resolve with 0 reads under `.opencode/specs`; `--finalize` retires the rollback after gates pass |
| REQ-005 | The guard passes and the original failing test goes green | `compiled-route-guard.cjs` exits 0 with 6/6 fresh; `compiled-route-manifest.test.cjs` passes (all subtests) with the 7→6 contract |
| REQ-006 | Routing behavior proven unchanged where already correct | Full routing gate battery (foundation, flag-propagation, golden-prompts vitest, fleet Lane C parity, `run-node-tests.mjs`) shows zero movement except the intended sk-design removal and adjudicated deltas |
| REQ-007 | Any engine-defect or unexpected behavioral delta is escalated, not absorbed | A delta that is not a clean consequence of the dissolution is recorded and escalated with evidence rather than papered over |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

All 6 surviving hubs report fresh and resolve compiled; `compiled-route-manifest.test.cjs` and the cross-system foundation/flag-propagation/golden-prompts vitest suites pass; the guard exits 0 (6/6 fresh); the fleet Lane C parity harness is green; the full `run-node-tests.mjs` shows the compiled-route suite green with no new failures; every canary delta and the mcp-tooling judgment removal is adjudicated in writing; and no manifest was hand-edited and no engine algorithm changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Re-activating compiled serving for 6 hubs changes production routing vs the current all-legacy fallback | Lane C parity harness proves compiled == legacy per hub before finalize; any drift is stop-and-diagnose |
| Risk | Removing the mcp-tooling judgment coupling silently drops a real design handoff | Canary re-baseline surfaces any route-gold delta; each is adjudicated in `ceremony-deltas.md` (accept-as-authored-evolution vs dissolve-as-stale) before gold moves |
| Risk | Topology edits drift the four DEFAULT_ON_HUBS copies out of lockstep | `compiled-routing-foundation.vitest.ts:69` is the hard gate run after P1 before proceeding |
| Risk | A commit sweeps in the 3,436 unrelated dirty files (notion migration) | Every commit uses explicit pathspec; never `git commit` without paths |
| Dependency | The shipped refresh/sync/guard tooling behaves as the 034 precedent recorded | Toolchain re-verified read-only before use; deviations halt |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Answered — (1) mcp-tooling's sk-design judgment coupling is removed, not repointed, because the skill it now pairs to (`sk-design-md-generator`) has no `mode-registry.json` for the judgment compiler to read; (2) the 6 survivors' manifests already declare `servingAuthority: compiled` on disk (stale, not un-flipped), so `refresh` re-pinning the hash implicitly restores compiled serving without an explicit `flip-serving` call; (3) workspace is the current branch with pathspec-scoped commits. Open — whether any surviving hub's canary re-baseline surfaces a behavioral delta that is NOT a clean dissolution consequence (would trigger REQ-007 escalation); resolved during P2.
<!-- /ANCHOR:questions -->
