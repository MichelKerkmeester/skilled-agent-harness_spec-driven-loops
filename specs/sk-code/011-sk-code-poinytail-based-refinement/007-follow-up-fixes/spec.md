---
title: "Feature Specification: Follow-up fixes for the sk-code Ponytail refinement"
description: "Five independent fixes for gaps found while building phases 002 to 006: the review final-line checker, the leaf-manifest generator, the Codex agent-mirror gate, the hook stdin deadline and the retired router-sync guard."
trigger_phrases:
  - "ponytail follow-up fixes"
  - "review checker gaps"
  - "router-sync guard"
  - "codex mirror gate"
  - "hook stdin deadline"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes"
    last_updated_at: "2026-10-10T08:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Scaffolded the follow-up phase parent and its five children"
    next_safe_action: "Plan each child with a haiku agent, then build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "follow-up-fixes-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Follow-up fixes for the sk-code Ponytail refinement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/092-sk-code-ponytail-refinement` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-code/011-sk-code-poinytail-based-refinement |
| **Predecessor** | 006-guard-retirement-notes |
| **Successor** | None |
| **Handoff Criteria** | Every child goal's criteria pass, each child is one commit, and recursive strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Building phases 002 to 006 surfaced five gaps that were out of scope at the time. The new review final-line checker accepts outputs its own contract forbids. The leaf-manifest generator reads files git ignores, so a stray `__pycache__` makes a manifest look stale. A change that touches only `.codex/agents/` passes the agent-mirror gate unchecked. The shared hook stdin reader has no deadline. The retired router-sync suite left four routing checks with no guard.

### Purpose
Close each gap in its own child phase, built by haiku agents and verified by the orchestrator, so every check the refinement relies on does what its documentation says.

> **Phase-parent note:** This spec.md is the only authored document at this level. Planning, tasks, decisions and continuity live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The four review-checker gaps the live `@review` run found in phase 005
- Making the leaf-manifest generator skip git-ignored files
- Recognizing Codex agent mirrors in the mirror checker and both pre-commit hooks
- One deadline in the shared hook stdin reader, with the post-edit adapters switched to it, keeping fail-open behavior
- A guard that restores the retired router-sync checks, wired into the drift-guard umbrella, and retirement notes updated to name it

### Out of Scope
- The sk-code advisor-accuracy failure and the deep-loop lineage reducer work, which stay with their own packets
- Fixing routing drift the restored guard finds, beyond reporting it; that is a decision for the operator

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js` | Modify | 001 | Skip status, spacing, read-error cause, banner |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` | Modify | 001 | New tamper cases |
| `.skilled/skills/sk-code/sk-code-review/scripts/README.md` | Modify | 001 | Exact checker rules |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` | Modify | 002 | Skip git-ignored files |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-ignores.test.cjs`, `tests/README.md` | Create, Modify | 002 | Ignore and fallback cases |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs` | Modify | 003 | Codex path pattern |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-agent-mirror-sync.vitest.ts` | Modify | 003 | Codex regression cases |
| `.skilled/hooks/git/pre-commit`, `.skilled/scripts/git-hooks/pre-commit` | Modify | 003 | Codex paths reach the checker |
| `.skilled/hooks/shared/hook-adapter-shared.cjs` | Modify | 004 | Stdin deadline |
| `.skilled/hooks/shared/hook-adapter-shared.test.cjs`, `.skilled/hooks/shared/README.md` | Create, Modify | 004 | Deadline tests, helper description |
| `.skilled/hooks/post-edit-quality/{claude,codex,devin}/` | Modify | 004 | Use the shared reader |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/` | Create, Modify | 005 | Router-sync guard and umbrella wiring |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-review-checker-gaps/ | Make the final-line checker enforce its full contract | Complete |
| 2 | 002-leaf-generator-ignores/ | Leaf manifests ignore files git ignores | Complete |
| 3 | 003-codex-mirror-gate/ | Codex-only agent changes reach the mirror checker | Complete |
| 4 | 004-hook-stdin-deadline/ | One stdin deadline for every CommonJS hook adapter | Complete |
| 5 | 005-router-sync-guard/ | Restore the router-sync checks as a drift guard | In Progress |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before it is committed
- The children touch disjoint files, so they may be planned and built in parallel; commits land in folder order
- Parent spec tracks aggregate progress via this map
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-review-checker-gaps | 002-leaf-generator-ignores | 001 goal criteria pass and it is committed | Orchestrator rerun, `validate.sh --strict` |
| 002-leaf-generator-ignores | 003-codex-mirror-gate | 002 goal criteria pass and it is committed | Orchestrator rerun, `validate.sh --strict` |
| 003-codex-mirror-gate | 004-hook-stdin-deadline | 003 goal criteria pass and it is committed | Orchestrator rerun, `validate.sh --strict` |
| 004-hook-stdin-deadline | 005-router-sync-guard | 004 goal criteria pass and it is committed | Orchestrator rerun, `validate.sh --strict` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Answered 2026-10-10: the restored guard passes checks 1a, 2, 3 and 4 and fails 1b on nine docs no router names. The operator chose to wire the four passing checks now and route the nine docs in a later follow-up; 1b runs only on request until then.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
