---
title: "Feature Specification: Phase 3: registry-graph-and-skill-advisor-removal"
description: "cli-devin had registry entries (sk-prompt-models model-profiles + SKILL.md + graph-metadata), skill-graph edges across 6 graph-metadata"
trigger_phrases:
  - "cli-devin deprecation phase 3"
  - "registry-graph-and-skill-advisor-removal"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-cli-devin-deprecation/003-registry-graph-and-skill-advisor-removal"
    last_updated_at: "2026-06-08T17:34:13.174Z"
    last_updated_by: "deprecation-host"
    recent_action: "Phase 3 complete: registry-graph-and-skill-advisor-removal executed and verified"
    next_safe_action: "Proceed to phase 4"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-142-cli-devin-20260608151217"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: registry-graph-and-skill-advisor-removal

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-08 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-runtime-code-and-executor-removal |
| **Successor** | 004-docs-agents-governance-removal |
| **Handoff Criteria** | model-profiles valid; deepseek/kimi/glm retain cli-opencode executors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the cli-devin deprecation specification. The verified, line-resolved edit list lives in ../context/context-report.md §2.

**Scope Boundary**: Remove swe-1.6 model entirely; drop cli-devin executor rows from deepseek/kimi/glm

**Dependencies**:
- Predecessor phase 002-runtime-code-and-executor-removal complete

**Deliverables**:
- Remove swe-1.6 model entirely; drop cli-devin executor rows from deepseek/kimi/glm
- Remove cli-devin edges from 6 graph-metadata.json + 2 skill-graph.json + scrub swe-1.6 signal
- Remove Devin hooks (.devin/hooks.v1.json, hooks/devin/ + dist), 'devin' runtime enum, advisor docs
- Decrement skill-advisor playbook scenario count (45->44)

**Changelog**:
- Phase work recorded in implementation-summary.md.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
cli-devin had registry entries (sk-prompt-models model-profiles + SKILL.md + graph-metadata), skill-graph edges across 6 graph-metadata.json + 2 JSON exports, skill-advisor docs + the 'devin' runtime enum + Devin hooks (.devin/hooks.v1.json + hooks/devin/ sources), and the swe-1.6 model was cli-devin-exclusive.

### Purpose
Remove cli-devin/swe-1.6 from the model registry and skill-graph, remove the full Devin IDE-runtime hook surface, and leave the remaining models with valid executor paths.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove swe-1.6 model entirely; drop cli-devin executor rows from deepseek/kimi/glm
- Remove cli-devin edges from 6 graph-metadata.json + 2 skill-graph.json + scrub swe-1.6 signal
- Remove Devin hooks (.devin/hooks.v1.json, hooks/devin/ + dist), 'devin' runtime enum, advisor docs
- Decrement skill-advisor playbook scenario count (45->44)

### Out of Scope
- Agent rosters / governance docs (phase 004)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-prompt-models/assets/model-profiles.json` | Modify | swe-1.6 removed; cli-devin executor rows dropped |
| `sk-prompt-models/{SKILL.md,graph-metadata.json,description.json,...}` | Modify | cli-devin/swe-1.6 removed |
| `6 graph-metadata.json + 2 skill-graph.json` | Modify | cli-devin edges removed |
| `.devin/hooks.v1.json + system-skill-advisor/hooks/devin/` | Delete | Devin IDE-runtime hooks removed |
| `advisor-runtime-values.ts` | Modify | 'devin' runtime enum removed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | swe-1.6 model fully removed, no orphaned refs | grep 0 active + model-profiles valid JSON |
| REQ-002 | No cli-devin node/edge in graph metadata or exports | grep 0 + jq valid |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Devin hooks + 'devin' runtime enum removed | files deleted + advisor runtime-parity test green |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: model-profiles valid; deepseek/kimi/glm retain cli-opencode executors
- **SC-002**: advisor runtime-parity + playbook-count tests green (count 44)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Predecessor phase 002-runtime-code-and-executor-removal | Blocks start | Completed before this phase |
| Risk | Dangling reference after edits | Med | Global grep verification + deep review |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — phase complete and verified.
<!-- /ANCHOR:questions -->
