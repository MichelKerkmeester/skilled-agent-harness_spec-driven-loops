---
title: "Feature Specification: Phase 5: advisor-integration [template:level-1/spec.md]"
description: "Advisor cleanup after the constitutional tier is retired. Keep the three hardcoded render.ts capsules (hygiene/governor/proof), fix the timeout-fallback render so it still carries them, and correct the stale cold-start/constitutional claim in the injection-contract doc. No new decisions surface is referenced (that approach was dropped)."
trigger_phrases:
  - "advisor cleanup"
  - "render.ts directives"
  - "every-turn injection"
  - "injection contract stale claim"
  - "spec core"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "037-decisions-memory-redesign/005-advisor-integration"
    last_updated_at: "2026-08-26T08:12:00Z"
    last_updated_by: "design-author"
    recent_action: "Re-scoped: DECISIONS.md pointer dropped; advisor cleanup only"
    next_safe_action: "Keep render.ts capsules, fix timeout fallback, correct injection-contract doc"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/hooks/injection-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-037-005-advisor-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
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
| **Handoff Criteria** | The three every-turn capsules remain intact in both normal and timeout-fallback renders; the injection-contract doc no longer claims constitutional cold-start injection; no MCP round-trip is added to the per-turn hot path. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5**, cleaning up the skill/advisor system after the constitutional tier is retired. Grounded in 001-analysis research R8. The key finding: the three directives (hygiene/governor/proof) are hardcoded in `render.ts`, not read from the constitutional files — so the deprecation did not touch the steering. Since the `DECISIONS.md` replacement surface was dropped, this phase adds no pointer; it only preserves the capsules and corrects stale docs.

**Scope Boundary**: The advisor `render.ts` directive block and the injection-contract doc. NOT the search plumbing (phase 3) or the rule content (phase 4).

**Dependencies**:
- Phase 003 retired the tier; nothing else in the advisor read the constitutional files.
- The advisor hook is fail-open when the daemon is cold — the hot path must not depend on an MCP call.

**Deliverables**:
- Capsules retained in normal + timeout-fallback renders.
- Injection-contract doc corrected (stale constitutional cold-start claim removed).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor injects three hardcoded directives every turn. The timeout-fallback render currently omits them, and the injection-contract doc still claims a constitutional cold-start injection that is dead code. After the tier is retired, these stale references and the fallback gap should be cleaned up so the every-turn steering stays reliable.

### Purpose
Keep the every-turn steering intact through both render paths and correct the docs, without adding any hot-path MCP call or new surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Keep the three `render.ts` capsules (hygiene/governor/proof) exactly as they are.
- Fix the timeout-fallback render to include the three directives.
- Correct the injection-contract doc: remove the stale constitutional cold-start claim.

### Out of Scope
- Any new decisions surface, pointer, or file (the `DECISIONS.md` approach was dropped).
- Reintroducing an MCP `memory_search` on the per-turn hot path.
- The search plumbing (phase 3) and rule content (phase 4).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| system-skill-advisor/mcp-server/lib/render.ts | Modify | Keep capsules; fix timeout fallback to include the directives |
| .opencode/hooks/injection-contract.md | Modify | Remove the stale constitutional cold-start injection claim |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every-turn directives preserved | **Given** a normal advisor render and the timeout-fallback render, both carry hygiene/governor/proof |
| REQ-002 | No MCP round-trip added to the hot path | **Given** the per-turn injection, no `memory_search` or blocking file read is introduced |
| REQ-003 | Injection-contract doc corrected | **Given** the injection-contract doc, it no longer claims constitutional cold-start injection |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No new surface referenced | **Given** the advisor brief and docs, no `DECISIONS.md` or replacement surface is referenced |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Capsules intact in both normal and timeout-fallback renders.
- **SC-002**: No hot-path MCP call or fail-open file read added.
- **SC-003**: Injection-contract doc corrected; no reference to a dropped replacement surface.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Timeout fallback still omits directives | Medium — steering lost on daemon timeout | Fix the fallback to include the three capsules |
| Risk | Editing the capsule text while "cleaning up" | Medium — changes live steering | Keep the three capsules byte-for-byte; only touch the fallback path and the stale doc claim |
| Dependency | Phase 003 tier retirement | Sequence after 003 | Do not start until the tier is retired |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the timeout-fallback render live in `render.ts` alongside the normal path, or in a separate fallback function? (Confirm the exact site during planning.)
<!-- /ANCHOR:questions -->

---
