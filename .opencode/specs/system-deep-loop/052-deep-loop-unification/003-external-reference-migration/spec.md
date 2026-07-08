---
title: "Feature Specification: External Reference Migration — system-deep-loop"
description: "Migrates every external reference to the old deep-loop-workflows/deep-loop-runtime identities across commands, agents, READMEs, hooks, the plugin, system-spec-kit, and the skill-advisor routing corpus."
trigger_phrases:
  - "external reference migration deep loop"
  - "system-deep-loop reference migration"
  - "deep-loop-workflows rename references"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/003-external-reference-migration"
    last_updated_at: "2026-07-08T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Spec authored from Plan-agent B's verified reference-migration design"
    next_safe_action: "Wait for 002 to land, then execute Stage A per plan.md"
    blockers:
      - "Depends on 002-hub-rename-and-runtime-nesting landing first (repoints TO system-deep-loop, which does not exist as a target until then)"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-003-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: External Reference Migration — system-deep-loop

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-08 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-hub-rename-and-runtime-nesting |
| **Successor** | 004-fallback-router-wiring (optional; logical successor is 005-validation-and-closeout) |
| **Handoff Criteria** | Zero residual `deep-loop-workflows`/`deep-loop-runtime` hits outside an explicit, reviewed allowlist; advisor routing accuracy re-baselined and holding; doctor/hooks/CI all pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
948 non-noise references to `deep-loop-workflows`/`deep-loop-runtime` exist outside the two skills' own folders — across `/deep:*` commands (434 hits, 24 files), doctor (15 hits incl. hardcoded constants), agents (36 hits across 2 real, non-symlinked trees), READMEs (root + 6 others), a plugin + 2 hooks, `system-spec-kit` (115 hits incl. a constitutional enforcement doc), and — highest-risk — `system-skill-advisor`'s routing corpus, which encodes the skill name as ground-truth labels in 3 fixture files plus 2 hardcoded scorer constants with no drift-guard between them.

### Purpose
Migrate every reference to the new `system-deep-loop` identity while freezing the user-facing surface (command names, agent names, mode-packet folder names) stable, in a dependency-respecting stage order, with an explicit accuracy re-baseline for the advisor corpus rather than a blind find/replace.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Identity-only rename: skill folder name, `mode-registry.json`/`hub-router.json` `skill` fields, `description.json` name/keywords, all `graph-metadata.json` edges (6+ sibling skills), hardcoded skill-id constants in `.py`/`.ts`/`.js`/`.cjs` files.
- Compiled command-contract regeneration (never hand-edited).
- `.opencode/agents/**` + `.claude/agents/**` (real duplicate, both edited).
- READMEs, plugin, git hooks, CI workflow.
- `system-skill-advisor`'s routing corpus: field-scoped label rename + a real accuracy re-baseline, plus the divergence ledger's manual re-approve step.
- The 2 "grandfather exception" worked-example files, updated in place with a new prefix-exception caveat (folder prefix `system-` now diverges from the frozen `/deep:*` command prefix).

### Out of Scope
- Renaming `/deep:*` commands, `@agent` names, or mode-packet folder names — frozen (see Decision below).
- `.opencode/specs/**` historical mentions (3622+ confirmed) and `.worktrees/**` (17 live checkouts) — left as non-breaking history, flagged as a coordination risk only.

### Files to Change
See plan.md's Stage C-J tables for the full, dependency-ordered file list (~948 hits across ~80 distinct files/fixtures).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `parent-skill-check.cjs`'s own constants fixed first | `/doctor parent-skill` self-check passes before trusting any other doctor output |
| REQ-002 | Compiled command contracts regenerated, never hand-edited | `compile-command-contracts.cjs` re-run; diff against committed output is byte-identical |
| REQ-003 | Advisor routing corpus re-baselined, not silently degraded | `score-routing-corpus.py --min-advisor-accuracy <Stage-A baseline>` passes |
| REQ-004 | Divergence ledger entries needing rename get manual re-approve | `local-native-divergence-ratchet.vitest.ts` passes with reviewed `reason` updates, not silent drift |
| REQ-005 | Both `.opencode/agents/**` and `.claude/agents/**` updated | Per-file scoped grep for old names returns zero hits in both trees |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Pre-commit hook + GitHub Actions workflow updated as a matched pair | Both `MIRROR_CHECKER`/`CHECKER` paths resolve identically |
| REQ-007 | Grandfather-example files updated with the prefix-exception caveat, not a blind rename | `skill-parent.md` + its 2 asset YAMLs render a factually correct prefix-derivation example |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -l 'deep-loop-workflows|deep-loop-runtime'` (excluding `node_modules`, `.opencode/specs`, `.worktrees`, `dist/`) returns zero hits minus an explicit, reviewer-visible allowlist.
- **SC-002**: Advisor routing accuracy on the affected slice matches or exceeds the pre-migration baseline (not just "doesn't crash").
- **SC-003**: `check-agent-mirror-sync.cjs`, doctor's skill-graph rebuild, and a full `system-skill-advisor` + `system-spec-kit` vitest run all pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `MERGED_DEEP_SKILL_ID` is hand-authored, duplicated, and unguarded in both `skill_advisor.py` and `aliases.ts` — no drift-guard cross-checks the pair | Medium — one could be updated and the other silently missed | Explicit manual-verify pair in Stage C; flag to extend the drift-guard as follow-up hardening |
| Risk | A naive whole-file find/replace on the advisor's labeled-prompt fixtures could rewrite historical narration or (if it existed) prompt text itself | Medium | Confirmed the skill name never appears inside prompt text; scope the replace to label field-keys only (`skill_top_1`, `nativeTop`, `localTop`) |
| Risk | Compiled `.contract.md` files carry a runtime-consumed content hash; a well-intentioned hand-edit desyncs it and fails silently at command-invocation time, not migration time | Medium | Never hand-edit; always regenerate via `compile-command-contracts.cjs` |
| Risk | `mk-deep-loop-guard.js`'s failure mode on a missing path is unverified (loud throw vs. silent no-op) | Low-Medium | Read and confirm during Stage C, not assumed |
| Risk | 17 live worktrees can reintroduce stale references on a later merge, evading a one-time residual-grep run against main | Low | Flagged for a bounded re-sweep after worktree merges; not this phase's responsibility to fix pre-emptively |
| Dependency | 002-hub-rename-and-runtime-nesting must land first | This phase repoints TO `system-deep-loop`, which doesn't exist as a target until 002 completes | Explicitly sequenced |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does a singleton `deep-loop` family still warrant a `family` tag in `system-skill-advisor`'s `skill-graph.json`? Left for whoever runs the advisor rebuild in this phase to decide, informed by 001's research if it addressed this.
<!-- /ANCHOR:questions -->

---

## 8. DECISION: naming scope

**Rename the skill IDENTITY (folder, routing keys, advisor constants, graph edges) everywhere. Freeze the `/deep:*` command names, `@agent` names, and mode-packet folder names exactly as they are.**

Reasoning: both source SKILL.md files already narrate this exact split (`deep-loop-workflows` = "the public, advisor-routable home"; `deep-loop-runtime` = "the frozen backend it consumes"). The `/deep:*` commands and `@agent` names sit *above* both as the stable public surface and don't need to move because their two backing skills become one. The repo has an established `system-*` naming lane (`system-spec-kit`, `system-code-graph`, `system-skill-advisor`) for exactly this kind of cross-cutting infrastructure — `system-deep-loop` continues that taxonomy cleanly. Renaming commands/agents too would be a second, unrelated, much larger migration for zero clarity gain, since the confusion being fixed is "two skill IDs for one concept," not "the command names are unclear."

One documented consequence: the skill-folder prefix (`system-`) and command-namespace prefix (`/deep:*`) now diverge — this is deliberate, not an oversight, and the grandfather-example files (REQ-007) get an explicit caveat noting `system-deep-loop` as the repo's one documented exception to "folder prefix == command-namespace prefix."
