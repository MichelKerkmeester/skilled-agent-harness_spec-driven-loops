---
title: "Feature Specification: Fleet-wide Root ROUTER.md Standard"
description: "Lean phase parent for defining, authoring, adopting, and verifying a mandatory root ROUTER.md across the seven class-H parent hubs without changing routing policy or frozen replay/scorer code."
trigger_phrases:
  - "root router document standard"
  - "class-H root ROUTER.md"
  - "seven hub router adoption"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This parent stays lean: purpose, direct-child map, shared gates, and constraints.
  Detailed scope, plans, tasks, checklists, decisions, and evidence live in the four child folders.
-->

# Feature Specification: Fleet-wide Root `ROUTER.md` Standard

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase parent with Level-3 children |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-15 |
| **Completed** | 2026-08-16 |
| **Worktree** | `.worktrees/010-root-router-document-standard` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `019-routing-coverage-activation-verification` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Six class-H parent skills still keep their second-stage leaf router at `shared/references/smart-routing.md`, while the mcp-tooling pilot already uses a root `ROUTER.md`. The split weakens authoring, validation, migration, and fleet-status guarantees even though replay already prefers the root location.

### Purpose

Establish one mandatory root control-plane document for every class-H parent hub, teach create-skill and doctor tooling to enforce it, migrate the seven-hub fleet serially, and close only after compiled-serving freshness and parity are proven for all seven hubs.

> **Phase-parent note:** This parent owns only the program purpose, child sequence, common invariants, and handoffs. All implementation detail and evidence belong in children `001` through `004`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A required root `ROUTER.md` with exactly two states: `router_state: active` or `router_state: stage1-only`.
- All seven current hubs as `active`; `stage1-only` remains the valid scaffold for future/simple hubs without a leaf map.
- Preservation of stage-one authority in `hub-router.json` plus `mode-registry.json`, and stage-two leaf selection in active `ROUTER.md`.
- create-skill templates, generator, command workflows, validator, parent doctor, tests, seven serial hub adoptions, parity, manifest refresh, promotion, rollback, and final 7/7 status.

### Out of Scope

- Standalone-skill router requirements or advisor indexing of `ROUTER.md`.
- Moving leaf maps into `SKILL.md` or `hub-router.json`.
- Editing frozen `router-replay.cjs`, scorer files, their protected digests, or route-scoring policy.
- Rewriting immutable changelogs, benchmark reports, unrelated advisor behavior, packet design, or product features.

### Shared Program Constraints

- Preserve each hub's zero-signal `defaultResource`; repoint only values that literally name the legacy smart-router path.
- Keep the sk-code exception explicit: remove its router self-reference from the live leaf set, but never classify root `ROUTER.md` as a typed leaf.
- Work in the isolated owner-first worktree. Roll back with Git plus the retained compiled-route-sync rollback closure; never restore prose without matching policy and manifest state.
- Execute children and hub checkpoints serially with receipt-backed handoffs.
- Stop remediation if bounded routing-only repairs cannot reach seven green canaries and 7/7 compiled/fresh status.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-contract-and-fleet-audit/` | Freeze the two-state contract, seven-hub baseline, default-resource matrix, sk-code exception, protected digests, and adoption receipts before live edits. | Complete |
| 002 | `002-create-skill-template-and-validator-alignment/` | Align templates, generator, command workflows, pure validator, parent doctor, package validation, and positive/negative tests. | Complete |
| 003 | `003-seven-hub-root-adoption/` | Adopt root `ROUTER.md` serially across all seven hubs, preserving semantics and deleting each legacy file only after its hub passes. | Complete |
| 004 | `004-parity-regression-and-closeout/` | Rebuild artifacts, run seven canaries, refresh manifests, promote with rollback, prove parity and kill-switch behavior, and close at 7/7 compiled/fresh. | Complete |

> **Program status (2026-08-16)**: all four children are complete. The seven hubs serve root `ROUTER.md` with `router_state: active`, zero live legacy files remain, and the fleet reports 7/7 compiled-serving and fresh. Canonical metadata is current; final searchable-index refresh is deferred after two retryable daemon timeouts (see child 004 `scratch/closeout/final-index-status.md`). Git integration is not performed from this worktree.

### Phase Transition Rules

- Executed `001 → 002 → 003 → 004` serially (2026-08-15/16); each child started only after its predecessor's P0 handoff checks passed.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` exited 0 for all four children; recursive strict validation exited 0 for both the 020 phase parent and the 015 program.
- Replay/scorer files and protected digests stayed byte-identical throughout all children (`14f169a4…`/`05bf38b8…`/`f5b44150…`; re-verified 2026-08-16).
- The retained rollback closure was preserved through post-publish verification and finalized in child 004 after all fleet gates passed (0 external manifests).

### Phase Handoff Criteria

| From | To | Criteria | Outcome |
|------|----|----------|---------|
| 001 | 002 | Contract approved; baseline receipts cover seven hubs; no live hub edits occurred. | Met; ADR-001..005 accepted; seven machine hashes reproduced; no-live-edit gate passed. |
| 002 | 003 | Stage1-only scaffold and active fixture pass; negative fixtures fail at stable codes; no legacy creation instruction remains. | Met; RRC-001..008 asserted; 23 Python + 9 parity + contract/journey/doctor suites green. |
| 003 | 004 | Exactly seven root routers are active; zero live legacy files remain; all per-hub source and canary gates pass. | Met; seven checkpoint receipts; legacy count 0; 7/7 active (re-verified 2026-08-16). |
| 004 | Closeout | Seven canaries and authored manifests are green/fresh; promotion verifies; status reports the seven canonical hubs compiled-serving and fresh. | Met; 7/7 rebuilds, canaries, refresh, verify, probes, status; rollback finalized; canonical metadata current; final index freshness explicitly deferred. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None at authoring time. Any requirement for unrelated advisor, command, packet, or product changes triggers `LOGIC-SYNC` and stops the program rather than widening scope.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Approved plan**: `/Users/michelkerkmeester/.pi/agent/plans/01a00512-29e3-7bf3-8288-4454ffb94865.md`
- **Phase children**: `001-contract-and-fleet-audit/` through `004-parity-regression-and-closeout/`
- **Program parent**: `../spec.md`
- **Program context index**: `../context-index.md`
