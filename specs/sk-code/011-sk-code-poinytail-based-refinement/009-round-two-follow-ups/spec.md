---
title: "Feature Specification: Round-two follow-ups for sk-code"
description: "Five child phases that close the follow-ups the round-two build left open: the nine docs router check 1b flags, the ceiling report in the quality SKILL.md, a reproducing case for deep-review findings, AGENTS.md pointers instead of rule duplicates, and a deadline for the remaining hook stdin readers."
trigger_phrases:
  - "round two follow-ups"
  - "router orphan docs"
  - "agents md pointers"
  - "hook stdin deadlines"
  - "deep-review case rule"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups"
    last_updated_at: "2026-10-10T11:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built, verified and committed all five children"
    next_safe_action: "Operator reviews the worktree branch before it merges"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "round-two-follow-ups-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Round-two follow-ups for sk-code

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/092-sk-code-ponytail-refinement` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-code/011-sk-code-poinytail-based-refinement |
| **Predecessor** | 008-round-two-recommendations |
| **Successor** | None |
| **Handoff Criteria** | Every child goal's criteria pass, each child is one commit, and recursive strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The round-two build recorded five follow-ups it did not close. Router check 1b still finds nine docs no router names, so it runs only on request. The new ceiling report is missing from the sk-code-quality SKILL.md scripts list, and the packet version did not move. The deep-review agent's finding format still has no reproducing case, unlike the review mode. AGENTS.md restates content that a repo rule now owns, and its close-out list (four items) has drifted from `evidence-and-proof.md` section 10 (five items). Fourteen hook stdin readers under `.skilled/hooks/` still wait on stdin with no deadline.

### Purpose
Close each follow-up in its own child phase, planned and built by Sonnet agents and verified by the orchestrator.

> **Phase-parent note:** This spec.md is the only authored document at this level. Planning, tasks, decisions and continuity live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Route the six Obsidian docs check 1b flags and allowlist the three shared workflow docs, which the hub SKILL.md loads from each surface's symlink, then make check 1b a default leg of the router-sync guard
- List the ceiling report in sk-code-quality/SKILL.md, bump the packet version and add its changelog entry
- A reproducing-case rule in the deep-review agent's finding format, kept readable by the deep-review reducer
- Replace content in AGENTS.md that a repo rule already owns with a pointer, wherever the rule file loads in every situation the clause binds; the close-out list first
- One deadline for each of the fourteen unbounded stdin readers under `.skilled/hooks/`, keeping fail-open behavior

### Out of Scope
- The stdin readers under `.skilled/skills/system-spec-kit/runtime/hooks/` (TypeScript and `.mjs`/`.cjs`, some reached from `.skilled/hooks/` through symlinks): owned by system-spec-kit; recorded as a follow-up
- The global `~/.claude/CLAUDE.md`, which today is byte-identical to AGENTS.md: it lives outside the repository and the operator syncs it
- Round-three research findings, which land in `001-ponytail-deep-research/research/` while this phase builds

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md` and its playbook, `sk-code-opencode/assets/scripts/verify_router_sync.cjs` and a new test, `sk-code-opencode/scripts/run-all-drift-guards.sh`, both packets' changelogs | Modify, Create | 001 | Route six docs, allowlist three, make check 1b default |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md`, its `changelog/` | Modify, Create | 002 | Scripts list, version, changelog |
| `.skilled/agents/deep-review.md`, its Claude fork and mirrors, deep-review templates | Modify | 003 | Reproducing case in findings |
| `AGENTS.md` and, where a pointer needs a target, `.skilled/repo-rules/*.md` | Modify | 004 | Pointers instead of duplicates |
| `.skilled/hooks/**` (fourteen readers, the existing shared helper's header, one new test) | Modify, Create | 005 | Stdin deadlines through the existing helper |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-router-orphan-docs/ | Route six orphan docs, allowlist three, and make check 1b a default leg | Complete |
| 2 | 002-quality-report-listing/ | Ceiling report in the quality SKILL.md, version and changelog | Complete |
| 3 | 003-deep-review-case-rule/ | Reproducing case in the deep-review finding format | Complete |
| 4 | 004-agents-md-pointers/ | AGENTS.md points to repo rules instead of restating them | Complete |
| 5 | 005-hook-stdin-deadlines/ | A deadline for the fourteen unbounded hook stdin readers | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before it is committed
- The children touch disjoint files and build in parallel; the Hermes generator, which rewrites every copy, runs once in the orchestrator after the builds; commits land in folder order
- Parent spec tracks aggregate progress via this map
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-router-orphan-docs | 002-quality-report-listing | 001 goal criteria pass and it is committed | Orchestrator rerun, `validate.sh --strict` |
| 002-quality-report-listing | 003-deep-review-case-rule | 002 goal criteria pass and it is committed | Orchestrator rerun, `validate.sh --strict` |
| 003-deep-review-case-rule | 004-agents-md-pointers | 003 goal criteria pass and it is committed | Orchestrator rerun, `validate.sh --strict` |
| 004-agents-md-pointers | 005-hook-stdin-deadlines | 004 goal criteria pass and it is committed | Orchestrator rerun, `validate.sh --strict` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. The operator chose the placement, the Sonnet builders and the AGENTS.md pointer pass on 2026-10-10.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
