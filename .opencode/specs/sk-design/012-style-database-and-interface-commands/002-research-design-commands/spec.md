---
title: "Feature Specification: Deep research — design command redesign"
description: "Twenty-iteration deep research (SOL) plus GLM lineage into how to rebuild the sk-design commands into genuine creation templates under an /interface namespace, modeled on Claude design, Open Design, and aura.build/skills."
trigger_phrases:
  - "design command research"
  - "interface command redesign"
  - "creation-template prompts"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/002-research-design-commands"
    last_updated_at: "2026-07-19T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author research-phase spec"
    next_safe_action: "Run /deep:research: 20 iters GPT-5.6-SOL HIGH fast + a few GLM-5.2 max, parallel"
    blockers: []
    key_files:
      - ".opencode/commands/design/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Deep research — design command redesign

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `012-style-database-and-interface-commands` |
| **Predecessor** | `001-research-style-database` |
| **Successor** | `004-interface-commands` (implementation, gated on this research) |
| **Phase** | 2 of 4 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The five design commands (`.opencode/commands/design/{interface,audit,foundations,motion,md-generator}.md`) are thin routers: each resolves an execution mode and defers to the `sk-design` hub, carrying routing contracts and sibling discriminators but no generative scaffolding. There is no structured design-brief intake, no exemplar-driven prompting, and no scaffolded build flow of the kind Claude's design tooling, Open Design, and the aura.build skills provide. A user invoking `/design:interface` gets a router, not a design partner. There is no agreed model for what a genuinely useful design-creation command should contain.

### Purpose

Run a bounded deep-research loop that produces a converged, evidence-backed recommendation for the redesigned command surface: the final command set and names under an `/interface` namespace, and the per-command creation-prompt templates (brief intake, exemplar grounding, scaffolded build flow) modeled on Claude design, Open Design, and aura.build/skills — concrete enough for phase `004-interface-commands` to implement.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Study why the current thin-router commands fail to help create designs, and how Claude design template prompts, Open Design, and aura.build/skills structure design-creation.
- Recommend the final command set + names under `/interface`, and per-command creation-prompt templates (brief intake, exemplar grounding, scaffolded build flow).
- Confirm the rename mapping (`design`→`interface` namespace; `interface`→`design`, `audit`→`design-audit`, `foundations`→`design-foundations`, `motion`→`design-motion`, `md-generator`→`design-md-creation`) or recommend a refinement.

### Out of Scope

- Implementing the renamed/rewritten commands (that is phase `004-interface-commands`).
- Redefining `sk-design`'s design judgment (modes, numeric laws, audit rubric) — commands serve those modes.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `research.md` | Create | 002-research-design-commands | Synthesized findings + convergence record |
| `implementation-summary.md` | Create | 002-research-design-commands | Final command-set + prompt-template recommendation, handoff to phase 004 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Grounded in real references | Recommendations cite the current command files, Claude design / Open Design patterns, and aura.build/skills concretely. |
| REQ-002 | Final command set + names | The synthesis names the exact `/interface:*` command set and each command's purpose, not a menu. |
| REQ-003 | Per-command prompt templates | Each command has a recommended creation-prompt template (brief intake, exemplar grounding, scaffolded build flow). |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Router→creation gap analysis | The research explains, per command, what the thin router lacks and what the creation template adds. |
| REQ-005 | Hub/mode integration | The recommendation states how the redesigned commands still route to the `sk-design` modes rather than duplicating judgment. |
| REQ-006 | Convergence recorded | The loop records convergence before synthesis; the GLM lineage's dissent is preserved, not averaged. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The deep-research loop converges and records convergence across the SOL and GLM lineages.
- `implementation-summary.md` states the final `/interface:*` command set + per-command creation-prompt templates, ready for phase 004 to implement.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Dependency:** the current `commands/design/*` files and the `sk-design` modes they route to.
- **Risk:** copying external tools' surface without fitting the `sk-design` hub/mode architecture — mitigate by requiring hub/mode integration (REQ-005).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- Recommended prompts must stay within a practical command-file size; scaffolding should not bloat dispatch.

### Security

- No new external network surface introduced by the command redesign itself.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the final set stay at five commands, or split/merge (e.g., a dedicated brief-intake command)? (The research answers this.)
- How much exemplar grounding belongs in the command prompt vs pulled from the style database (phase 001/003)?
<!-- /ANCHOR:questions -->
