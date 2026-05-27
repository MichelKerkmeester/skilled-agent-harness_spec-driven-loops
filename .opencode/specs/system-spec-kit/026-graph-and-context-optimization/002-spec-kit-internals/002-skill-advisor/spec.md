---
title: "Feature Specification: Skill Advisor [system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/spec]"
description: "Skill advisor system: search/routing tuning, skill graph + advisor unification, advisor docs and standards, smart-router, hook surface, plugin hardening, hook improvements, and the /doctor:skill-advisor setup command. Consolidated active parent for 12 direct child phase packet(s)."
trigger_phrases:
  - "006-skill-advisor"
  - "skill advisor"
  - "skill advisor system"
  - "skill advisor hook"
  - "search/routing tuning, skill graph and advisor unification, advisor docs and standards, smart-router, hook surface, plugin hardening, and hook improvements"
  - "001-memory-search-routing-tuning"
  - "001-skill-graph-metadata-routing-boosts"
  - "002-advisor-phrase-booster-tuning"
  - "001-documentation-code-alignment"
  - "003-smart-remediation-opencode-plugin"
  - "001-deferred-remediation-telemetry-run"
  - "004-advisor-hook-surface-integration"
  - "002-skill-graph-daemon-native-advisor-tools"
  - "002-advisor-plugin-hardening"
  - "003-advisor-standards-alignment"
  - "001-advisor-hook-brief-improvements"
  - "005-advisor-setup-command"
  - "/doctor:skill-advisor"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor"
    migration_aliases:
      - "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor"
    last_updated_at: "2026-04-25T11:50:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Consolidated"
    next_safe_action: "Use context-index.md for local phase navigation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:8350b5dfe24e762cf2362790200b12b377034fd828359f13991f01cae70b7fd7"
      session_id: "026-phase-root-flatten-2026-04-21"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Skill Advisor

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-21 |
| **Branch** | `026-graph-and-context-optimization` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../000-release-cleanup-playbooks/spec.md |
| **Successor** | ../007-deep-review-remediation/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skill advisor work was scattered across two phase wrappers (`006-skill-advisor/` for search/routing/graph/smart-router, and parts of `007-hook-parity/` for hook surface, daemon unification, plugin hardening, standards alignment, and hook improvements). The split made it hard to see the advisor system as one coherent surface and forced cross-wrapper navigation when reasoning about advisor changes.

### Purpose
Keep this theme as the single active parent for the full skill advisor system. Every original phase packet — whether it came from the search/routing thread or the hook/plugin/standards thread — is a direct child folder under this phase root, so the advisor surface is browsable in one place.
<!-- /ANCHOR:problem -->

---

## 2. PHASE CHILDREN

| ID | Slug | Summary |
|----|------|---------|
| 001 | skill-graph | Skill graph infrastructure covering metadata quality, structural migration, daemon/advisor unification, and extraction across 7 children |
| 002 | scorer | Skill advisor scoring optimization across 8 children: embed cache, cosine wiring, ablation/weight/corpus sweeps, and routing calibration |
| 003 | router | Intent routing optimization across 5 children: search-and-routing tuning, phrase booster tailoring, smart router remediation, hook surface integration, and setup command |
| 004 | hardening | Skill-advisor hardening and safety improvements across 4 children: deferred remediation, telemetry measurement, plugin hardening, standards alignment, and CLI Devin integration |
| 005 | docs | Skill-advisor documentation work across 3 children: docs/code alignment, code-folder READMEs, and doc/config drift fixes |
| 006 | playbook-run-and-remediation | Manual-testing playbook run + finding remediation (F1-F5) + P1 routing/abstention tuning, across 14 sub-phases (moved from former top-level `028-skill-advisor-playbook-run`) |

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Keep the active thematic parent at `006-skill-advisor/`.
- Place old phase packets directly under this root.
- Maintain `context-index.md` as the bridge from old phase identity to current child folder.

### Out of Scope
- Rewriting child-owned requirements or historical implementation narratives.
- Moving root `research/`, `review/`, or `scratch/` support folders.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `context-index.md` | Modify | Bridge index for the direct child phases in this theme. |
| `006-skill-advisor/00N-*/` | Move | Original phase packet roots now live directly under this parent. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| 1 | `001-memory-search-routing-tuning/` | Complete | Feature Specification: Search and Routing Tuning Coordination Parent |
| 2 | `001-skill-graph-metadata-routing-boosts/` | Implemented | Feature Specification: Skill Advisor Graph |
| 3 | `002-advisor-phrase-booster-tuning/` | Draft | Feature Specification: Advisor Phrase-Booster Tailoring |
| 4 | `001-documentation-code-alignment/` | Spec Ready | Feature Specification: Skill-Advisor Docs + Phase 020 Code Alignment |
| 5 | `003-smart-remediation-opencode-plugin/` | Spec Ready | Feature Specification: Smart-Router Remediation + OpenCode Plugin |
| 6 | `001-deferred-remediation-telemetry-run/` | Spec Ready | Feature Specification: Deferred Remediation + Telemetry Measurement Run |
| 7 | `004-advisor-hook-surface-integration/` | In Progress | Feature Specification: Skill-Advisor Hook Surface |
| 8 | `002-skill-graph-daemon-native-advisor-tools/` | In Progress | Feature Specification: 027 - Skill Graph Daemon and Advisor Unification |
| 9 | `002-advisor-plugin-hardening/` | Complete | Feature Specification: Skill-Advisor Plugin Hardening |
| 10 | `003-advisor-standards-alignment/` | Complete | Feature Specification: Skill-Advisor Standards Alignment |
| 11 | `001-advisor-hook-brief-improvements/` | Research Queued | Feature Specification: Skill-Advisor Hook Improvements |
| 12 | `005-advisor-setup-command/` | Implemented | Feature Specification: Skill Advisor Setup Command |
| 13 | `006-playbook-run-and-remediation/` | Complete (F4 cold-env residual) | Skill Advisor Manual Testing Playbook Run + remediation + P1 tuning (sub-parent; moved from top-level 028) |
<!-- /ANCHOR:phase-map -->

<!-- The 4 daemon-corruption packets that were briefly registered here (006-009) were
     moved 2026-05-18 under a new phase parent at
     `016-embedder-testing-and-architecture/006-mcp-launcher-concurrency-arc/` with
     phase children 001-004 (formerly 006/007/008/009). See that arc for the
     full work history. The MCP-launcher concurrency code they ship still lives
     under system-skill-advisor + the 3 .opencode/bin/mk-*-launcher.cjs files,
     but the spec-folder docs now sit under the embedder umbrella where they
     were operationally discovered. -->


---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve original child packet evidence. | Every mapped old phase exists as a direct child folder with root docs and metadata retained. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Expose a concise context bridge. | `context-index.md` lists child phase names, statuses, summaries, open/deferred items, and current paths. |
| REQ-003 | Keep root support folders discoverable. | Root `research/`, `review/`, and `scratch/` remain referenced as root-level support surfaces. |
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

**Given** this wrapper is opened, **when** a maintainer lists the folder, **then** the original original phases appear as direct child folders.

**Given** a maintainer needs an original phase packet, **when** they open `context-index.md`, **then** they can find the old status, summary, and current child path.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The active parent validates independently.
- **SC-002**: Mapped source packets are direct child folders.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Direct child folders may contain older validation debt | Medium | Validate the active parent separately and preserve child docs unchanged unless requested. |
| Dependency | Root packet phase map | High | Root docs own the active nine-phase map. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. This parent records the requested flattened layout.
<!-- /ANCHOR:questions -->
