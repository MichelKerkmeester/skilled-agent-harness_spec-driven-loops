---
title: "Feature Specification: Command Alignment"
description: "Align command-doc content accuracy for flags, behavior, and CLI front doors without changing structural router or presentation ownership."
trigger_phrases:
  - "command alignment"
  - "027 release cleanup 006-command-alignment"
  - "shipped 027 alignment"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/006-command-alignment"
    last_updated_at: "2026-06-10T15:29:29Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Aligned command-doc content to shipped 027 reality"
    next_safe_action: "Defer structural split to 027/011"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-006-command-alignment-planned"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned release-cleanup scaffolds."
---
# Feature Specification: Command Alignment

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
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Completion** | 100% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Align command-doc content accuracy for flags, behavior, and CLI front doors without changing structural router or presentation ownership.

### Purpose
Inventory the owned surface, align its current-state claims to shipped 027 reality, and verify that the resulting surface is coherent with schema v37, default-off flags, CLI front doors, constitutional rules, memory features, and doctrine.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory current claims on .opencode/commands/**.
- Align references to schema v37 and the shipped default-off flags.
- Align references to phase 010 CLI front doors where this surface mentions tooling.
- Align references to the two new constitutional rules and shipped memory behaviors where applicable.
- Verify that peck, gem, memclaw, and openltm doctrine is represented only where relevant.
- Note: Coordinate with 027/011, which owns the structural router and presentation split; this phase is content-only.

### Out of Scope
- Source-code changes.
- Command route, command asset, agent, skill, or YAML structure edits.
- Structural router or presentation split changes owned by 027/011.
- Claiming implementation before verification evidence exists.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/commands/memory/manage.md | Modified | Correct schema v37 health output and add retention, tombstone, idempotency, and observability notes |
| .opencode/commands/memory/search.md | Modified | Add semantic-trigger shadow, trace/why_ranked, session-trace causal inference, and 37-tool CLI fallback notes |
| .opencode/commands/memory/save.md | Modified | Add source_kind, idempotency, provenance, and retention flag notes; remove stale `shared` retention value |
| .opencode/commands/speckit/complete.md | Modified | Replace stale validator list with current shipped validation surface |
| .opencode/commands/speckit/implement.md | Modified | Replace stale post-save `memory_save` guidance with targeted `memory_index_scan` freshness guidance |
| .opencode/commands/speckit/resume.md | Modified | Add restore-panel, authored continuity snapshot, and 37-tool CLI fallback notes |
| .opencode/commands/doctor/speckit.md | Modified | Add v37 diagnostic and tri-daemon CLI front-door notes |
| .opencode/commands/doctor/mcp.md | Modified | Clarify five MCP servers versus three daemon-backed CLI front doors |
| .opencode/commands/doctor/update.md | Modified | Add tri-daemon CLI fallback and v37 readiness notes |
| implementation-summary.md | Modified | Record drift inventory, evidence, and 027/011 coordination note |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R1 | Inventory before alignment | Existing outward claims are listed before edits begin |
| R2 | Preserve command structure | This phase does not edit source, agents, skills, YAML, or command routing/structure |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R3 | Align shipped 027 claims | Surface mentions schema v37, default-off flags, CLI front doors, constitutional rules, memory features, and doctrine only when accurate |
| R4 | Verify current-state coherence | Strict validation passes and implementation evidence names the checks used |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The phase has a clear inventory -> align -> verify handoff.
- Completion is 100% with verification evidence in `implementation-summary.md`.
- The surface does not conflict with 027/011 ownership boundaries.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shipped 027 source of truth | Inaccurate outward docs if the current reality is misread | Inventory before alignment and cite verified checks |
| Risk | Scope collision with 027/011 | Command structural work could be duplicated | Keep this phase content-only and defer structural split to 027/011 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for scaffold. Implementation may discover surface-specific conflicts.
<!-- /ANCHOR:questions -->
