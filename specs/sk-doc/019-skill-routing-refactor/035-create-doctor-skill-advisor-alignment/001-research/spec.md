---
title: "Feature Specification: Create/Doctor/Skill-Advisor Alignment Research"
description: "20-iteration deep-research pass (cli-codex, gpt-5.6-luna, max reasoning effort, fast service tier, convergence forced off) into aligning the /create:* skill-authoring commands, the /doctor diagnostic surface, and system-skill-advisor index setup with the current live skill/command system."
trigger_phrases:
  - "create doctor skill advisor alignment research"
  - "skill creation friction research"
  - "doctor skill advisor gap research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/035-create-doctor-skill-advisor-alignment/001-research"
    last_updated_at: "2026-07-30T20:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "20/20 iterations complete; research.md synthesized with prioritized recommendations"
    next_safe_action: "Plan the next phase (002) from research.md Section 6's dependency-ordered recommendations"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-strategy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-20260730-182352-create-doctor-skill-advisor"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Canonical-contract artifact shape (Markdown-only vs Markdown+machine-readable fixture)"
      - "Generalizing --repo/source-selection beyond the Codex-hook checker (Track B, deferred)"
    answered_questions:
      - "Create/doctor share a field vocabulary, never a byte-identical formatter"
      - "skill_graph_validate is live but absent from every doctor declaration surface"
      - "description.json stays descriptive; never validated against graph vocabulary"
      - "leaf-manifest.json generation belongs to the scoped generator, never the fleet --fix gate"
---
# Feature Specification: Create/Doctor/Skill-Advisor Alignment Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-30 |
| **Branch** | `sk-doc/0128-create-doctor-skill-advisor-alignment` |
| **Parent Spec** | `../spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
It is not currently easy or reliable to create a new skill: the `/create:*` command family and `sk-create-skill`'s guides describe authoring, `/doctor` diagnoses and repairs skill-advisor/skill-routing state, and `system-skill-advisor`'s own index (mode-registry, hub-router, advisor rebuild, skill-graph validate) is the live substrate both of those have to satisfy — and these three surfaces may have drifted out of sync with each other and with the current parent-hub canon.

### Purpose
Run a deep, iterative research pass (20 forced iterations, no early convergence) that maps the current end-to-end skill-creation path, enumerates every `/doctor` route touching skill-advisor/skill-routing, audits skill-advisor index setup, and surfaces concrete, evidence-backed alignment and automation gaps a later implementation phase can act on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `/create:*` commands and `sk-create-skill` guides/templates
- `/doctor` skill-advisor, skill-routing, and skill-graph diagnostic/repair routes
- `system-skill-advisor` index setup: mode-registry/hub-router coverage, `advisor_rebuild`, `skill_graph_scan`/`validate`, hub-identity metadata contracts
- Gaps between the above and the live parent-hub canon (skill-root metadata contract, leaf-manifest, command-metadata)

### Out of Scope
- Compiled-routing runtime engine/guard/sync tooling - owned by this track's router-unification work
- Advisor scorer internals - owned by `system-skill-advisor/001-scorer-saturation-root-fix`
- Any implementation during this phase - findings and recommendations only

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Deep-research synthesis (workflow-owned) |
| `research/resource-map.md` | Create | Converged-delta resource inventory (workflow-owned) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run the full 20-iteration `/deep:research:auto` loop against this packet, executor `cli-codex` / model `gpt-5.6-luna` / reasoning `max` / service tier `fast`, convergence forced off | `research/deep-research-state.jsonl` has 20 `type:"iteration"` records; loop stopped on `maxIterationsReached`, not early convergence |
| REQ-002 | Every iteration passes the executor invariants (non-empty iteration file, required JSONL fields) | `research/iterations/iteration-{01..20}.md` all exist and are non-empty; each JSONL record has `type`, `run`, `status`, `focus`, `newInfoRatio` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Synthesize `research/research.md` covering all 20 iterations with file:line evidence | `research/research.md` exists, cites concrete evidence, and ends with a prioritized, dependency-ordered recommendation list |
| REQ-004 | Save continuity via `generate-context.js` after the loop closes | `description.json`/`graph-metadata.json` refreshed; `implementation-summary.md` reflects final state |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 20 iterations run to completion with no early convergence stop
- **SC-002**: `research/research.md` hands a concrete, prioritized fix/automation list to the next phase
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `codex` CLI availability + auth | Loop cannot dispatch without it | Confirmed present (`/opt/homebrew/bin/codex`) before init |
| Risk | Max reasoning effort per iteration may run long (up to the 3600s hard ceiling) | Total loop wall-clock could span hours | Timeout set generously; each iteration dispatched and awaited individually, not batched |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None yet — will surface through the research loop itself (autonomous mode makes best-judgment calls per iteration).
<!-- /ANCHOR:questions -->
