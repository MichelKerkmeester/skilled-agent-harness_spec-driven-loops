---
title: "Feature Specification: deep-loop-workflows — consolidate the five deep-loop skills"
description: "Merge the five deep-loop workflow skills (deep-ai-council, deep-context, deep-improvement, deep-research, deep-review) into one skill deep-loop-workflows, leaving a clean two-skill architecture with the frozen deep-loop-runtime backend. Informed by a 5-iteration deep-context sweep and a 15-iteration gpt-5.5 xhigh deep-research run with adversarial verification. Decomposed into nine parity-gated phases."
trigger_phrases:
  - "deep-loop-workflows skill"
  - "merge deep loop skills"
  - "consolidate deep-research deep-review deep-context deep-improvement deep-ai-council"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-workflows"
    last_updated_at: "2026-06-15T22:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Merged + functional; 009 gate sign-off 12/18 P0; 007 R1 descoped by decision"
    next_safe_action: "Quiescent-tree skill-graph rebuild + artifact-replay baseline (CHK-060/065)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/ (merged skill, live in 027)"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-147-deep-loop-workflows"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: deep-loop-workflows — consolidate the five deep-loop skills

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase Parent |
| **Priority** | P1 |
| **Status** | Merged & functional (351 runtime tests); formal per-phase gate sign-off pending |
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Handoff Criteria** | Each child phase ships and validates independently with byte-identical per-mode parity held; old skill dirs are deleted only in the final phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-loop capability is split across five sibling skills — `deep-ai-council`, `deep-context`, `deep-improvement`, `deep-research`, `deep-review` — that already share one backend (`deep-loop-runtime`, the MCP-free runtime created by the FULL_ISOLATE_NO_MCP consolidation). The five skills duplicate generic plumbing (capability resolvers, locking adapters, atomic-write mirrors, artifact-root resolution), spread eight `/deep:*` commands and fifteen native agent mirrors across an unmanaged surface, and force every cross-repo reference, advisor edge, and governance tree to enumerate five skill IDs. The split is only half-realized: the backend boundary exists, but the five persona surfaces remain separate, which makes routing, documentation, and maintenance brittle.

### Purpose
Collapse the five persona surfaces into ONE public skill, `deep-loop-workflows`, structured as a thin authoritative hub `SKILL.md` plus a mandatory declarative `mode-registry.json` plus five verbatim mode packets (`context`, `research`, `review`, `ai-council`, `improvement`). `deep-loop-runtime` stays the frozen backend and gains only a small, named set of promotions (capability resolver, loop-lock CLI, artifact-root resolver, terminal journal taxonomy). Routing is governed by a three-tier discriminator — `workflowMode` (all modes), `runtimeLoopType` (graph-backed modes only, explicit `null` for improvement, never inferred), and `backendKind` — sourced exclusively from the registry. Per-mode behavior is preserved, not flattened: the five distinct convergence contracts, state shapes, artifacts, and tool-permissions remain intact. The acceptance bar is byte-identical single-executor artifacts per mode pre/post — this is a structure and documentation reorganization, not a behavior change.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the phase children listed in the Phase Documentation Map below. The evidence base is `context/context-report.md` (5-iteration deep-context sweep) and `research/research.md` (15-iteration gpt-5.5 xhigh deep-research + adversarial verification).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `deep-loop-workflows` skill: thin hub `SKILL.md` + mandatory `mode-registry.json` + five verbatim mode packets carrying each prior skill's references/scripts/assets/governance.
- A small, named set of backend promotions into `deep-loop-runtime` (capability resolver, loop-lock CLI adapter, `resolveArtifactRoot`, `emitResourceMap` synthesis primitive, terminal journal taxonomy contract).
- Repointing the eight `/deep:*` commands and their YAML/presentation assets, and the five native agents across all three runtime mirrors (`.opencode/`, `.claude/`, `.codex/`).
- Advisor graph migration to one skill ID plus a mode-alias/discriminator layer, including the `sk-util`→`deep-loop` family correction for council and improvement.
- Governance consolidation (one tree partitioned by mode) and the cross-repo documentation sweep (root README, CLAUDE.md/AGENTS.md, `deep-loop-runtime` README, constitutional, sibling "Related skills" lines).
- Deletion of the five old skill directories — in the final phase only — after every gate is green.

### Out of Scope
- Any behavior change to a mode's convergence math, state shape, artifacts, or tool-permissions (the merge must be byte-identical per mode).
- Reintroducing any MCP tool to `deep-loop-runtime` (its MCP-free boundary is frozen).
- The external Lane-D Python loop, its kill-switches, scoring, and promotion semantics — owned by external packaging; this epic only updates doc/comment references and requires NO Barter contract-version bump.
- Adding an `improvement` `loopType` to the runtime convergence engine (improvement stays host-driven, never graph-backed).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children. The chain is serial 001→009; old skill directories are deleted only in phase 009.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-parity-baseline-and-runtime-ownership-adr/` | Capture byte-level baseline of all 5 modes' artifacts + 8 commands + advisor outputs; author the runtime-ownership ADR; run the nested-`SKILL.md` advisor-discovery test (gate B5); decide Lane D baseline = dry-run-only (B8) | Complete |
| 2 | `002-runtime-backend-promotions/` | Promote the capability resolver, loop-lock CLI adapter, `resolveArtifactRoot`, `emitResourceMap`, and the terminal journal taxonomy (6 stopReason + 4 sessionOutcome) into `deep-loop-runtime`; add NO improvement loopType | Complete (worktree) |
| 3 | `003-merged-hub-and-mode-packets/` | Build `deep-loop-workflows/` hub `SKILL.md` + `mode-registry.json` build artifact (B4) + five verbatim mode packets with multi-segment internal path rewrites | Complete (worktree) |
| 4 | `004-command-surface-repoint/` | Repoint the 8 `/deep:*` commands + YAML assets to the new packet paths and `skill:` keys; requires the Python↔TS `{skill,mode}` contract finalized (B2) | Complete |
| 5 | `005-agent-mirror-repoint/` | Repoint the 5 native agent bodies across the 3 runtime mirrors; hold 3-way parity (Path-Convention line whitelisted) | Complete |
| 6 | `006-advisor-graph-mode-routing/` | Correct council+improvement family `sk-util`→`deep-loop` FIRST (B7), then collapse the 5 skill IDs → `deep-loop-workflows` + mode-alias layer; resolve `deep-context` Candidate-3 asymmetry (B3) and the `aliases.ts` schema (B6) | Complete |
| 7 | `007-governance-consolidation/` | One unified governance tree partitioned by mode; mode-qualify CP- ID collisions at the index (no file renumber); normalize council casing | Complete — R1 (one-root) superseded by decision-record; per-mode trees intentional |
| 8 | `008-framework-docs-sweep/` | Rewrite framework docs from the 5-skill to the 2-skill model (root README, CLAUDE.md/AGENTS.md, runtime README, constitutional, sibling lines); stamp v1.0.0; preserve per-mode changelog history | Complete |
| 9 | `009-old-skill-deletion-and-validation/` | Delete the 5 old skill directories; run the full-surface Acceptance Gate set; resolve the `/doctor` council-graph coverage blocker (B1) | Partial — 12/18 P0 (deletion + B1 + advisor/mirror/registry/strict-validation verified; skill-graph rebuild deferred to a quiescent tree; byte-parity replay not cleanly replayable) |
| 10 | `010-deep-loop-skill-system-review/` | Post-merge release-readiness deep review of the 152/153/155 trio (read-only — review-report + remediation plan; appended, not part of the serial 001→009 parity chain) | Complete |

### Phase Transition Rules
- Each phase MUST pass `validate.sh` independently before the next phase begins.
- The parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.
- Every behavior-touching phase must hold byte-identical per-mode parity against the phase-001 baseline; rollback is per-strata (per phase child), never whole-tree, because the old directories survive until phase 009.

### Phase Handoff Criteria
| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Baseline snapshot recorded for all 8 commands + 5 modes; nested-`SKILL.md` test proves no extra advisor nodes; runtime-ownership ADR authored | `context/context-report.md` + `research/research.md` present; `validate.sh --strict` green |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

Carried from `research/research.md` §Open Items / Blockers (resolved inside the named phases):
- **B1** — `/doctor deep-loop` covers only `deep-loop-graph.sqlite`, not `council-graph.sqlite`; extend coverage before phase 009 (Acceptance Gate).
- **B2** — Python↔TypeScript advisor `{skill, mode}` contract must be finalized before phase 004.
- **B3** — `deep-context` is absent from `aliases.ts`; phase 006 decides extend-vs-document-as-metadata-routed.
- **B4** — `mode-registry.json` does not yet exist; it is a phase-003 build artifact with a completeness test.
- **B5** — nested-`SKILL.md` advisor discoverability is unproven; phase 001 gate must prove no extra rankable nodes before any directory move.
- **B6/B7/B8** — `aliases.ts` restructuring schema, the family-correction-before-ID-removal ordering, and the Lane-D dry-run baseline are resolved in phases 006, 006, and 001 respectively.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: see sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md (and plan.md/tasks.md once each phase is planned).
- **Context Report**: `context/context-report.md` — the verified architecture map from the 5-iteration deep-context sweep.
- **Research**: `research/research.md` — the converged recommendation, per-decision resolutions, 9-phase plan, acceptance gates, risk register, and blockers from the 15-iteration gpt-5.5 xhigh deep-research run with adversarial verification. Per-iteration analyses in `research/iterations/`.
- **The frozen backend**: `.opencode/skills/deep-loop-runtime/` (consumed by the merged skill; gains only the named promotions).
- **Graph Metadata**: see `graph-metadata.json` for the `derived.last_active_child_id` pointer.
