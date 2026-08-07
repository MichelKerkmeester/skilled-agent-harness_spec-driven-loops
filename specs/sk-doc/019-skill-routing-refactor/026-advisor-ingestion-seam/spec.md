---
title: "Feature Specification: Advisor Ingestion Seam"
description: "Close the seam between skill creation and advisor discovery: a newly created skill root is invisible to a warm advisor daemon because the watcher only watches roots that existed at startup, refresh runs only on already-watched events, and neither skill's docs name the re-ingestion step. Decide and build the automatic path, document the manual one, and tie authored routing evidence to the fields the scorer actually reads."
trigger_phrases:
  - "advisor ingestion seam"
  - "new skill not discovered by advisor"
  - "watcher does not see new skill root"
  - "skill graph refresh after create"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/026-advisor-ingestion-seam"
    last_updated_at: "2026-07-28T16:27:03Z"
    last_updated_by: "claude-code"
    recent_action: "Delivered and verified"
    next_safe_action: "None"
    blockers: []
      - "Execution awaits operator authorization"
      - "Mechanism choice (watcher-learns-roots vs gate-triggers-scan vs documented-manual) is the design phase's output"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-advisor-ingestion-seam"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which closure mechanism: watcher learns new top-level roots, the fleet gate/scaffolder triggers a scan, or documented manual refresh only?"
      - "Should the creation workflows require a routing-evidence quality pass (intent signals vs slug defaults) before a skill counts as done?"
    answered_questions:
      - "The watcher discovers paths from top-level skill directories at startup and refreshTargets() runs only after an already-watched event, so a new sibling root cannot self-announce"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Advisor Ingestion Seam

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor` |
| **Parent Spec** | ../spec.md |
| **Research Source** | `../024-create-journey-gate-fixes/research/swarm/lens3-report.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The creation journey ends at "gates pass" — but passing gates does not make a skill routable. The advisor daemon's watcher enumerates skill roots once at startup and watches those exact files; its refresh path runs only after an event on an already-watched file. A brand-new root therefore produces no event, no ingestion, and no routing until a rebuild, full scan, daemon restart, or unrelated watched event happens to fire. Neither create-skill nor system-skill-advisor documents this: the author follows every step, everything is green, and the advisor has never heard of their skill. Compounding it, scaffolds ship slug-only routing evidence (`domains`, `intent_signals`, triggers all default to the skill name) and no workflow step connects the author's trigger design to the fields the explicit and lexical scorers actually read — so even once ingested, a by-the-book skill routes weakly.

### Purpose

A skill whose creation journey completes is discoverable by the advisor — automatically where a safe mechanism exists, and by a documented, tested step where it does not — with routing evidence the scorer can actually use.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Design phase weighing the three closure mechanisms (watcher learns new top-level roots; fleet gate/scaffolder triggers a graph scan; documented manual refresh) against daemon-safety and hook-latency constraints, producing a decision record.
- Implementation of the chosen mechanism inside system-skill-advisor's daemon/watcher or tooling surface.
- Documentation of the refresh step in BOTH journeys (create-skill workflow end; advisor SKILL.md lifecycle notes) regardless of mechanism.
- Routing-evidence guidance: the creation workflows tie trigger design to `intent_signals`/keywords/description fields the scorers read, with an attributed-recommendation smoke test as the acceptance step.

### Out of Scope

- Scorer/threshold changes (settled frozen surfaces).
- The journey-breaking template/scaffolder fixes (sibling 024) and prose sweep (sibling 025).

### Files to Change

| Surface | Nature |
|---------|--------|
| `system-skill-advisor/mcp-server/lib/daemon/watcher.ts` (+ orchestrator) | Mechanism implementation (option-dependent) |
| `create-skill/SKILL.md` both workflows | Refresh step + routing-evidence step |
| `system-skill-advisor/SKILL.md` / references | Lifecycle documentation |
| advisor daemon tests | Mechanism coverage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The seam is closed by a decided mechanism | Decision record with the daemon-safety trade-offs; implementation matches it |
| REQ-002 | A new conforming root becomes advisor-visible without a daemon restart | Integration test: scaffold → (mechanism) → advisor query resolves the new skill |
| REQ-003 | Both journeys document the refresh step | create-skill workflow end + advisor lifecycle notes name it explicitly |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Routing-evidence guidance lands in the workflows | Trigger-design step names the scored fields; scaffold notes flag slug-only defaults as placeholders |
| REQ-005 | Attributed-recommendation smoke test defined | A documented one-liner the author runs to see their skill recommended with attribution |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The integration test proves create → discover with a warm daemon, no restart.
- **SC-002**: Both docs name the same refresh step; no undocumented gap remains between "gates pass" and "advisor routes".
- **SC-003**: Advisor daemon test suite green; no watcher-latency regression on existing roots.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Watching the skills dir for new roots could storm on worktree/branch churn | Design phase weighs debounce + top-level-only scoping; the gate-triggered-scan option avoids fs-watch entirely |
| Risk | Daemon changes have shared-runtime blast radius | Own worktree, advisor test suite as the bar, SOL adversarial review before landing |
| Dependency | Lens-3 evidence and the live watcher source | Re-verify the startup-only discovery claim at execution tip |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Mechanism choice (design-phase output; leaning gate-triggered scan for determinism, but watcher-learns-roots keeps zero manual steps).
- Does the smoke test belong in the fleet gate (`--verify-routing`?) or stay a documented manual step?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research Source**: `../024-create-journey-gate-fixes/research/swarm/lens3-report.md`
- **Siblings**: `../024-create-journey-gate-fixes/spec.md`, `../025-doctrine-coherence-sweep/spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `025-doctrine-coherence-sweep` |
| **Successor** | none |
