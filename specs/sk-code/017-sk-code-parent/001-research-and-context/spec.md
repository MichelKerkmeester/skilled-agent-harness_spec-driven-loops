---
title: "Feature Specification: Phase 1 — research and context"
description: "Run a focused deep-research pass (code mode taxonomy + two-axis mapping + fold-in/migration) alongside a deep-context sweep (current-state map + full blast-radius inventory) to produce a decision-ready sk-code parent architecture input, before any build."
trigger_phrases:
  - "sk-code research and context"
  - "sk-code taxonomy research"
  - "sk-code blast-radius context"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/001-research-and-context"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-1 research-and-context spec"
    next_safe_action: "Confirm the cli-opencode GPT-5.5 executor, then write the deep-research fan-out config and the deep-context sweep config"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1 — research and context

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete (awaiting 002 human-review gate) |
| **Created** | 2026-07-03 |
| **Branch** | `main` (dedicated `system-speckit/124-sk-code-parent` recommended before build phases) |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 9 |
| **Predecessor** | None |
| **Successor** | ../002-architecture-decision/spec.md (planned) |
| **Handoff Criteria** | `research/research.md` + `context/context-map.md` produced; decision-ready mode taxonomy, structural-model recommendation, and full blast-radius map exist for human review |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the sk-code parent-skill conversion. It is the **research gate**: it produces the evidence that the architecture decision (002) and every build phase (003+) depend on. Nothing is built, migrated, or scaffolded here.

Unlike an open-ended pattern search, the **structural pattern is already settled** — the nested parent-hub pattern shipped in `117-parent-nested-skill-pattern` / `119-parent-skill-native-invocability` and is proven by the `sk-design` family (`design/008-sk-design-parent`, 45 phases). So this phase is **applied**: it decides the *code-specific* shape, not whether to use a hub.

**Two tracks run together:**
- **Track R — deep-research** (`/deep:research`): the code **mode taxonomy**, the two-axis (surface × activity) mapping, the `sk-code-review` fold-in boundary, the migration/cutover strategy, and native-invocability requirements.
- **Track C — deep-context** (`/deep:context`): an authoritative **current-state map** of both skills' internals + a **full blast-radius inventory** across commands, agents, the skill-advisor source-of-truth, registries, adjacent skills, governance docs, feature catalogs, and specs.

**Scope Boundary**: run and synthesize the research + context passes only. No skills are built, migrated, or scaffolded in this phase.

**Dependencies**:
- The two target skills: `.opencode/skills/sk-code/` (v3.5, flat) and `.opencode/skills/sk-code-review/` (v1.5, standalone).
- The settled pattern: `117-parent-nested-skill-pattern/`, `119-parent-skill-native-invocability/`, and the `sk-design` reference implementation.
- The deep-loop engines (`/deep:research`, `/deep:context`, `deep-loop-runtime`).
- CLI executor: `cli-opencode` (GPT-5.5 high) as the primary lineage, per the orchestration directive.

**Deliverables**:
- `research/research.md` — merged, cited research synthesis (taxonomy + two-axis mapping + fold-in + migration + native-invocability).
- `context/context-map.md` — current-state classification of both skills' content (hub-shared vs mode-specific) + full blast-radius inventory with file paths.
- A **decision-ready** mode taxonomy (2–5 modes, each with scope + owned content), a structural-model confirmation, and a migration/cutover recommendation — all for the 002 human-review gate.

### Seed Inputs (this-session reconnaissance — verify and extend; 001 produces the authoritative map)

Two read-only scouts already surfaced the load-bearing facts below. Track C must confirm and complete them; they are the starting evidence, not the deliverable.

- **Advisor identity = directory-scan, not a flat registry.** The advisor enumerates direct child dirs of `.opencode/skills/` (`system-skill-advisor/mcp_server/lib/daemon/watcher.ts` `walkSkillDirectories`) and keys each identity off that skill's `graph-metadata.json`. *Consequence:* moving `sk-code-review/` into a nested packet **and deleting its `graph-metadata.json`** removes the second identity automatically — the same mechanism that makes sk-design's five modes invisible as top-level identities.
- **`skill-graph.json` is generated.** `system-skill-advisor/mcp_server/scripts/skill-graph.json` (peer node + adjacency for `sk-code-review`) is rebuilt by `advisor-rebuild`, not hand-maintained. Regenerate after the move; do not hand-edit.
- **No `/code-review` or `/code` slash command.** The real dispatch surface is agents: `code`, `review`, `orchestrate`, `deep-review`, `ai-council` (`.opencode/agents/**` + `.claude/agents/**`). `deep-review.md` **hardcodes** the absolute path `sk-code-review/references/review_core.md` (and `check-rule-copies.js` keeps consumer copies in sync) — both break on a naive move.
- **Mirror sk-design, not deep-loop.** All modes `routingClass: "metadata"` ⇒ **no** Python/TS projection-map edits and **no** drift-guard test. `family` stays `sk-code` (closed set: cli/mcp/sk-code/deep-loop/sk-util/system).
- **Hub must pass `parent-skill-check.cjs`** (`.opencode/commands/doctor/scripts/`, 11 invariants: exactly one `graph-metadata.json`, none nested, registry+advisorRouting per mode). Frontmatter versioning (118) requires a 4-part `version` on every new/moved doc.
- **Highest-risk surfaces** (a wrong edit breaks routing system-wide): hub `sk-code/SKILL.md`, hub `sk-code/graph-metadata.json`, the new `mode-registry.json`, generated `skill-graph.json`, `agents/review.md`, `agents/deep-review.md`, `agents/code.md` + `orchestrate.md`, `parent-skill-check.cjs`.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` (if the parent maintains one) using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code family's mode composition and migration path are undecided. We hold two mature skills — a flat surface-aware router (`sk-code`, a two-axis surface × phase engine) and a standalone review baseline already coupled to it (`sk-code-review`) — plus a large web of dependent commands, agents, advisor metadata, and docs. Building the parent before deciding the mode taxonomy, the two-axis mapping, and the exact blast radius would lock in an arbitrary shape and risk routing regressions across the whole system.

### Purpose
Produce, from a focused deep-research pass and a deep-context sweep, a decision-ready mode taxonomy, a structural-model confirmation, a fold-in boundary for `sk-code-review`, and a complete blast-radius map — the binding inputs for the 002 architecture decision.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `research/deep-research-config.json` (Track R) and `context/deep-context-config.json` (Track C), each with the cli-opencode GPT-5.5 executor.
- Run Track R over the two skills + the settled pattern; produce `research/research.md` + a findings registry answering R1–R5 (below).
- Run Track C over the repo; produce `context/context-map.md` covering the current-state classification (C1–C2) and the full blast-radius inventory (C3–C5, below).
- Merge both tracks into a single decision-ready recommendation summary; STOP for the human-review gate.

### Out of Scope
- The architecture decision itself (owned by `002-architecture-decision`) — this phase recommends, it does not bind.
- Scaffolding the hub, onboarding content, folding in `sk-code-review`, or any advisor/command/agent edits (phases 003+).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/deep-research-config.json` | Create | Track R config (cli-opencode GPT-5.5 primary; optional cross-check lineage) |
| `research/research.md` | Create | Merged, cited research synthesis (loop-generated) |
| `research/` (state, findings registry) | Create | Deep-research loop artifacts |
| `context/deep-context-config.json` | Create | Track C sweep config |
| `context/context-map.md` | Create | Current-state classification + full blast-radius inventory |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Track R (deep-research) runs to convergence via cli-opencode GPT-5.5 | `research/deep-research-state.jsonl` shows convergence or its iteration cap; `research/research.md` exists with citations |
| REQ-002 | Track C (deep-context) produces the full blast-radius map | `context/context-map.md` enumerates every dependent surface (commands, agents, advisor source-of-truth, registries, adjacent skills, governance, feature catalogs, specs) with file paths |
| REQ-003 | Decision-ready mode taxonomy exists | 2–5 named modes, each with scope + which current sk-code/sk-code-review content it owns, captured for the 002 review |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Two-axis mapping resolved | Research states whether surface detection is hub-shared or per-mode, and how the phase pipeline maps onto modes |
| REQ-005 | `sk-code-review` fold-in boundary defined | Research recommends the `review` mode boundary (owned doctrine/checklists/playbooks) + advisor-identity retire-vs-alias options |
| REQ-006 | Advisor single-identity change surface located | Context map pinpoints the exact advisor source-of-truth file(s)/entries that change so sk-code becomes one hub identity and sk-code-review de-registers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` answers R1–R5 with citations to the actual skill files and the 117/119/sk-design precedent.
- **SC-002**: `context/context-map.md` is complete enough that 002 can bind the taxonomy and 007 can repoint every dependent surface with no discovery gaps.
- **SC-003**: A single merged recommendation (taxonomy + structural model + fold-in + migration) is ready for the human-review gate; nothing downstream is started.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:research-questions -->
## 6. RESEARCH QUESTIONS (Track R) & CONTEXT TARGETS (Track C)

### Track R — deep-research
- **R1 — Mode taxonomy.** Activity lanes (`implement` / `review` / `verify` / `debug`) vs surface lanes (`webflow` / `opencode` / `motion`) vs hybrid. Recommend a 2–5 mode set; assign each current content area to a mode. *Seed hypothesis to prune/confirm:* activity lanes, surface smart-routing retained inside `implement`, `review` = folded `sk-code-review`.
- **R2 — Two-axis mapping.** Should surface detection live in `shared/` (hub-level, consumed by `implement`) or per-mode? How does the phase pipeline (research→implement→quality→debug→verify) project onto modes?
- **R3 — Fold-in boundary.** Confirm `sk-code-review` becomes the `review` mode owning findings doctrine + checklists + playbooks, consuming sk-code surface evidence from `shared/`.
- **R4 — Migration/cutover.** The sequence that preserves current behavior (surface precedence, phase pipeline, review baseline) with zero routing regression; back-compat handling for the `sk-code-review` advisor identity.
- **R5 — Native invocability.** Per 119: how parent + each mode stay independently invocable; the frontmatter each mode's `SKILL.md` needs.

### Track C — deep-context
- **C1 — sk-code internals.** Classify `SKILL.md`, `references/` (smart_routing, stack_detection, phase_detection, motion_dev, opencode, universal, webflow), `assets/`, `scripts/` as hub-shared vs mode-specific.
- **C2 — sk-code-review internals.** Classify `SKILL.md`, `references/` (review_core, review_ux_single_pass, pr_state_dedup, quick_reference), `assets/` (checklists), `scripts/`.
- **C3 — Blast-radius inventory.** Every reference across commands, agents (`.opencode`/`.claude`/`.codex`), registries/YAMLs, adjacent skills, governance docs, feature catalogs, playbooks, specs.
- **C4 — Advisor change surface.** The exact source-of-truth file(s)/entries for the single-identity change.
- **C5 — Command/agent repoint surface.** `/code-review`, the `code` and `review` agents, and any dispatch references that must repoint to hub modes.
<!-- /ANCHOR:research-questions -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deep-loop MCP tools unavailable from the active runtime | Loops cannot launch via MCP | Drive `/deep:research` + `/deep:context` through cli-opencode (Bash transport); the `opencode` binary is present |
| Risk | Blast-radius map misses a dependent surface | 007 breaks routing at cutover | Track C greps the literal skill tokens repo-wide + cross-checks against the advisor source-of-truth |
| Risk | Research over-fits the seed hypothesis | Taxonomy is assumed, not earned | Require the research to argue against the seed (surface-lane + hybrid alternatives) before recommending |
| Dependency | `cli-opencode` GPT-5.5 executor | Track R/C cannot run | Confirm executor + model id before launch (Setup) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- Whether Track R needs a second cross-check lineage (e.g., Opus via cli-claude-code, or a small model via cli-opencode) or GPT-5.5 alone suffices given the settled pattern — resolved at Setup with the user.
- Whether `verify` / `debug` warrant first-class modes or remain phases inside `implement` — the research recommends; 002 binds.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
