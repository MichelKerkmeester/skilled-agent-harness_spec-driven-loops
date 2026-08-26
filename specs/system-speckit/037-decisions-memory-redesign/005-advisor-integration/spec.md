---
title: "Feature Specification: Phase 5: advisor-integration [template:level-1/spec.md]"
description: "Wire the DECISIONS.md surface into the every-turn advisor injection. Keep the three hardcoded render.ts capsules (hygiene/governor/proof), add an optional stable pointer to DECISIONS.md, and fix the timeout-fallback path so it still carries the directives — without reintroducing an MCP round-trip on the hot path."
trigger_phrases:
  - "advisor integration"
  - "render.ts directives"
  - "every-turn injection"
  - "decisions pointer"
  - "spec core"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "037-decisions-memory-redesign/005-advisor-integration"
    last_updated_at: "2026-08-26T07:30:00Z"
    last_updated_by: "design-author"
    recent_action: "Authored advisor-integration design from 001-analysis research (R8)"
    next_safe_action: "Decide whether the advisor brief points to DECISIONS.md or keeps directives hardcoded"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/hooks/injection-contract.md"
      - ".opencode/DECISIONS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-037-005-advisor-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the advisor read decisions from DECISIONS.md at render time, or keep them hardcoded with a pointer?"
    answered_questions:
      - "Where do the 3 every-turn directives live? (Hardcoded in render.ts, not read from constitutional/*.md)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: advisor-integration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-26 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-rehome-rules-content |
| **Successor** | 006-verify-rollout |
| **Handoff Criteria** | The three every-turn capsules remain intact; a stable DECISIONS.md pointer is added if chosen; the timeout fallback carries the directives; no MCP round-trip added to the per-turn hot path. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5**, integrating the new decisions surface with the skill/advisor system that already injects steering every turn. Grounded in 001-analysis research R8. The key finding: the three directives (hygiene/governor/proof) are hardcoded in `render.ts`, not read from the constitutional files — so deprecation did not touch them, and this phase decides how the advisor references the new DECISIONS.md surface.

**Scope Boundary**: The advisor `render.ts` directive block and the injection contract. NOT the search plumbing (phase 3) or the rule content (phase 4).

**Dependencies**:
- DECISIONS.md exists (phase 2) and rules are rehomed (phase 4).
- The advisor hook is fail-open when the daemon is cold — the hot path must not depend on an MCP call.

**Deliverables**:
- Retained capsules + an optional stable pointer to DECISIONS.md.
- A fixed timeout-fallback that still includes the directives.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor injects three hardcoded directives every turn, independent of the (now-deprecated) constitutional files. With the active surface moving to DECISIONS.md, the advisor should reference it coherently — but reading a file at render time, or calling `memory_search`, on the per-turn hot path risks latency and a fail-open miss when the daemon is cold. The timeout-fallback render also currently omits the directives.

### Purpose
Keep the every-turn steering intact and coherently point at DECISIONS.md, without adding an MCP round-trip or a hot-path file read that can fail open.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Keep the three `render.ts` capsules (hygiene/governor/proof).
- Add an optional stable one-line pointer to DECISIONS.md in the advisor brief.
- Fix the timeout-fallback render to include the directives.

### Out of Scope
- Reintroducing an MCP `memory_search` on the per-turn hot path (eliminated — latency + cold-daemon fail-open).
- Making render.ts the decisions store (eliminated — TS edit per decision).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| system-skill-advisor/mcp-server/lib/render.ts | Modify | Keep capsules; optional DECISIONS.md pointer; fix timeout fallback to include directives |
| .opencode/hooks/injection-contract.md | Modify | Update the documented injection contract to reflect DECISIONS.md + remove the stale constitutional cold-start claim |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every-turn directives preserved | **Given** a normal advisor render and the timeout-fallback render, both carry hygiene/governor/proof |
| REQ-002 | No MCP round-trip added to the hot path | **Given** the per-turn injection, no `memory_search` or blocking file read is introduced |
| REQ-003 | Injection contract doc updated | **Given** the injection-contract doc, it no longer claims constitutional cold-start injection and reflects DECISIONS.md |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Stable DECISIONS.md pointer (if chosen) | **Given** the advisor brief, a one-line stable pointer to DECISIONS.md is present and does not bloat the brief |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Capsules intact in both normal and timeout-fallback renders.
- **SC-002**: No hot-path MCP call or fail-open file read added.
- **SC-003**: Injection-contract doc corrected; optional DECISIONS.md pointer added.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reading DECISIONS.md at render time | Medium — latency + cold-daemon fail-open | Use a stable pointer, not a hot-path read; keep directives hardcoded |
| Risk | Timeout fallback still omits directives | Medium — steering lost on daemon timeout | Fix the fallback to include the three capsules |
| Dependency | DECISIONS.md (phase 2) + rehome (phase 4) | Pointer target must exist | Sequence after phases 2 and 4 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the advisor keep directives fully hardcoded with only a pointer to DECISIONS.md, or eventually read a small curated slice at daemon warm-up (not per turn)? (Decide during planning.)
<!-- /ANCHOR:questions -->

---
