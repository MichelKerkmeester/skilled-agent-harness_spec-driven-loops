---
title: "Feature Specification: Round-four remediation for sk-code"
description: "Seven child phases that fix the eleven items round three left open: the review canary pins and one review doc, the Webflow link labels and playbook root, surface precedence for implementation prompts, Obsidian coverage in the quality mode, gaps in the documentation claim checker, the deep-loop findings parser and the spec-kit hook stdin deadlines."
trigger_phrases:
  - "round four remediation"
  - "review canary pins"
  - "webflow underscore labels"
  - "surface precedence obsidian webflow"
  - "hook deadline margins"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation"
    last_updated_at: "2026-10-10T16:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Scaffolded the round-four phase parent and its seven children"
    next_safe_action: "Plan each child with an Opus agent, then build and verify"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "round-four-remediation-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Round-four remediation for sk-code

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
| **Predecessor** | 010-round-three-remediation |
| **Successor** | None |
| **Handoff Criteria** | Every child goal's criteria pass, each child is one commit, and recursive strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Round three (`../010-round-three-remediation/`) closed with eleven items still open, each recorded in a child's Known Limitations or plan. Five were left out on purpose: canary pins for the AGENTS.md-level review floors, the sixteenth spec-kit stdin reader, 59 old underscore link labels in the Webflow references, the Webflow playbook root's missing overview and implementation-phrased prompts that route Webflow before Obsidian. Six more are residuals: two-surface lists in the quality mode that leave out Obsidian, four gaps in the documentation claim checker, semicolons in the moved guardrails text, a review doc that fails the document validator, a deep-loop findings parser that counts indented numbered lines and stdin deadlines that equal their host's timeout.

### Purpose
Fix all eleven in seven children that own disjoint files, plus an eighth that the operator added for the surface tie-break, planned by Opus agents, built by DeepSeek agents and verified by Sonnet agents, answering in each plan the reason round three gave for leaving an item out.

> **Phase-parent note:** This spec.md is the only authored document at this level. Planning, tasks, decisions and continuity live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The five items round three excluded on purpose, listed in `../010-round-three-remediation/goal.md` under "Not built"
- The six residuals recorded in the Known Limitations and plans of the round-three children that still reproduce

### Out of Scope
- Host timeouts in runtime settings and the hook registry, which stay as they are
- AGENTS.md, CLAUDE.md and their runtime copies, which the canary may read but no child edits
- The deep-research reducer and command assets another session is editing in the main checkout

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/sk-code/sk-code-review/**` | Modify | 001 | Canary pins and the pr-state-dedup overview |
| `.skilled/skills/sk-code/sk-code-webflow/**` | Modify | 002 | Link labels and the playbook root overview |
| sk-code hub files, `shared/**`, the sk-code canary fixtures and their archive copies | Modify | 003 | Surface precedence for implementation prompts |
| `.skilled/skills/sk-code/sk-code-quality/**` | Modify | 004 | Obsidian coverage and surface lists |
| `.skilled/skills/sk-code/sk-code-opencode/**` | Modify | 005 | Claim checker gaps and guardrails voice |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs` and its tests | Modify | 006 | Findings parser rules |
| `.skilled/skills/system-spec-kit/runtime/hooks/**` and its tests | Modify | 007 | The sixteenth reader and deadline margins |
| The compiled-routing front door and serving resolver, sk-code hub `SKILL.md` and `ROUTER.md`, the sk-code canary fixtures | Modify | 008 | Session-aware surface tie-break |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-review-canary-pins/ | AGENTS.md-level review floor pins and the pr-state-dedup overview | Complete |
| 2 | 002-webflow-labels-and-playbook/ | Underscore link labels and the Webflow playbook root overview | Complete |
| 3 | 003-hub-surface-precedence/ | Obsidian before Webflow for implementation-phrased prompts | Complete |
| 4 | 004-quality-obsidian-coverage/ | Obsidian coverage and surface lists in the quality mode | Complete |
| 5 | 005-doc-claims-hardening/ | Claim checker gaps and the guardrails semicolons | Complete |
| 6 | 006-deep-loop-findings-parser/ | Indented numbered lines and narrative findings in the parser | Complete |
| 7 | 007-hook-deadline-margins/ | The sixteenth stdin reader and deadlines under the host timeout | Complete |
| 8 | 008-session-aware-tie-break/ | The session's current work decides the lead surface on a keyword tie | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before it is committed
- The children own disjoint files and build in parallel; shared generators and re-mints run once in the orchestrator; commits land in folder order
- Parent spec tracks aggregate progress via this map
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-review-canary-pins | 002-webflow-labels-and-playbook | 001 goal criteria pass and it is committed | Sonnet verifier and orchestrator rerun |
| 002-webflow-labels-and-playbook | 003-hub-surface-precedence | 002 goal criteria pass and it is committed | Sonnet verifier and orchestrator rerun |
| 003-hub-surface-precedence | 004-quality-obsidian-coverage | 003 goal criteria pass, every hub canary passes, and it is committed | Sonnet verifier and orchestrator rerun |
| 004-quality-obsidian-coverage | 005-doc-claims-hardening | 004 goal criteria pass and it is committed | Sonnet verifier and orchestrator rerun |
| 005-doc-claims-hardening | 006-deep-loop-findings-parser | 005 goal criteria pass, including the claim checker over the whole tree, and it is committed | Sonnet verifier and orchestrator rerun |
| 006-deep-loop-findings-parser | 007-hook-deadline-margins | 006 goal criteria pass and it is committed | Sonnet verifier and orchestrator rerun |
| 007-hook-deadline-margins | 008-session-aware-tie-break | 001 to 007 committed, so the hub files 003 changed are settled | Sonnet verifier and orchestrator rerun |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. On 2026-10-10 the operator chose to plan round four now, with the same roles as round three (Opus 5.5 medium plans, DeepSeek V4.1 Flash max builds, several Sonnet 5.5 high agents verify and review), and widened the scope to all eleven items. After child 003's review showed that keyword ties are decided by generic words, the operator kept the order OPENCODE > OBSIDIAN > WEBFLOW as the fallback and added child 008: on a keyword tie, the surface of the session's current work leads.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Predecessor**: `../010-round-three-remediation/goal.md` and its children's implementation summaries
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
