---
title: "Phase 2: Governor Capsule Parity Fix"
description: "Close the fallback parity gap: the OpenCode bridge fallback renderer omits proof-over-appearance while canonical render.ts carries it; plus sync the stale Fable-5 label in injection-contract.md."
trigger_phrases:
  - "governor parity"
  - "bridge fallback proof"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/002-governor-parity"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "Phase authored from research synthesis"
    next_safe_action: "Implement parity fix in bridge fallback"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/scripts/mk-skill-advisor-bridge.mjs"
      - ".opencode/skills/system-spec-kit/references/hooks/injection-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-cli-038-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 2: Governor Capsule Parity Fix

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-04 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of N |
| **Predecessor** | 001-research |
| **Successor** | 003-pi-directive-capsule |
| **Handoff Criteria** | Bridge fallback carries proof directive; label synced; tests pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The per-turn governor capsule is inconsistent across runtimes: canonical composition points carry hygiene + governor + proof-over-appearance (`render.ts:53-69,204-215`, `mk-skill-advisor.js:48-52`), but the OpenCode bridge's inline fallback omits the proof directive (`mk-skill-advisor-bridge.mjs:319-373`), and its fallback branch falls back to drift-prone inline code (`:376-379`). Separately, `injection-contract.md:50-58` still labels the capsule "Fable-5" while the code is model-agnostic.

### Purpose
Every runtime's per-turn capsule carries the same three directives (hygiene, governor, proof), and the docs say what the code does.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Bridge fallback parity: route the fallback through the parity-preserving renderer (same composition as canonical paths)
- Label sync in injection-contract.md

### Out of Scope
- Capsule wording changes (research said keep wording)
- Pi directive (phase 003)
- Enforcement (phase 004)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/scripts/mk-skill-advisor-bridge.mjs` | Modify | Fallback block (319-373, 376-379) uses parity renderer; proof directive included |
| `.opencode/skills/system-spec-kit/references/hooks/injection-contract.md` | Modify | "Fable-5" label → model-agnostic governor wording |
| `.opencode/skills/system-skill-advisor/tests/` | Modify | Parity test: fallback output contains proof directive |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Bridge fallback emits hygiene + governor + proof (same three directives as `render.ts`) | Grep fallback composition includes TERMINAL_PROOF_DIRECTIVE; rendered fallback string contains the proof line |
| REQ-002 | Fallback consumes the parity-preserving renderer, not inline drift-prone code | Diff shows fallback delegates to the shared renderer |
| REQ-003 | `injection-contract.md` label matches the code (no "Fable-5" in capsule description) | grep injection-contract.md returns no "Fable-5" |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Advisor test suite passes with the parity change | `npx vitest run` in system-skill-advisor exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Fallback output byte-equal to canonical composition for the same inputs
- **SC-002**: No "Fable-5" label remains; tests green
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fallback path discovery differs from research snapshot | Low | Re-grep before editing; lines may shift |
| Dependency | Advisor vitest suite | Medium | Run suite before/after; fix tests in same change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Research phase 001 pinned the exact gap locations.
<!-- /ANCHOR:questions -->
