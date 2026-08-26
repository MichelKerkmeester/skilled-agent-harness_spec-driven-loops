---
title: "Feature Specification: Phase 2: active-decisions-design [template:level-1/spec.md]"
description: "Decisions are fragmented across four stores (constitutional files, 616 per-spec ADRs, continuity blocks, native goal files) with no single active surface that loads every turn without an MCP round-trip. Design a lightweight, git-tracked DECISIONS.md surface auto-loaded by each runtime — the active replacement the constitutional deprecation hands off to."
trigger_phrases:
  - "active decisions surface"
  - "DECISIONS.md"
  - "always-loaded memory"
  - "decisions notes system"
  - "spec core"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "037-decisions-memory-redesign/002-active-decisions-design"
    last_updated_at: "2026-08-26T06:50:00Z"
    last_updated_by: "design-author"
    recent_action: "Authored active-decisions design from 001-analysis research (Grok 4.6 xhigh R2)"
    next_safe_action: "Confirm per-runtime auto-load mechanics and size budgets before creating the surface"
    blockers: []
    key_files:
      - ".opencode/DECISIONS.md"
      - ".cursor/rules/decisions.mdc"
      - "CLAUDE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-037-002-active-decisions-design"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Exact per-runtime auto-load mechanics and byte budgets (Claude line budget, Cursor alwaysApply)"
    answered_questions:
      - "Should the surface be a new DB or a new required spec-doc? (No to both — verified)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: active-decisions-design

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-26 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-analysis |
| **Successor** | 003-deprecation-mechanics |
| **Handoff Criteria** | A DECISIONS.md surface + per-runtime auto-load wiring is designed, budget-bounded, and proven to surface every turn without an MCP call; the deprecation phase (003) can retire the constitutional tier against a live replacement. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the decisions-memory-redesign packet. It designs the ACTIVE replacement surface that the constitutional-memory deprecation (phase 003) hands off to. Grounded in the 001-analysis research (Grok 4.6 xhigh lineage, recommendation R2), and the owner intent to deprecate constitutional memory completely while building a more-active, spec/skill-integrated decisions system.

**Scope Boundary**: The new decisions surface and its per-runtime auto-load wiring only. It does NOT deprecate the constitutional tier or rehome rule content (those are phases 003/004).

**Dependencies**:
- Confirmed research findings: constitutional DB tier is decorative; `includeConstitutional` (not `alwaysSurface`) is the real lever; learned-triggers verified 0 rows; 616 `decision-record.md` files / 1,623 ADR headings.
- The every-turn injection surfaces already in use (root docs loaded each turn; the hardcoded advisor `render.ts` directives).

**Deliverables**:
- A designed `.opencode/DECISIONS.md` with a Standing section (global rules) + a Recent section (pointers to packet ADRs), under a strict size budget.
- Per-runtime auto-load wiring design (Cursor `alwaysApply` rule; a CLAUDE.md `@`-import line).
- A supersession + freshness model, and an optional cheap query path.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Decisions live in four disconnected stores — 20 constitutional files, 616 per-spec `decision-record.md` ADRs, per-packet `_memory.continuity` blocks, and native goal files — with no single surface that answers "what did we decide about X" and loads on every turn without a `memory_search` MCP round-trip. The constitutional DB tier that was supposed to be that surface is decorative: its rules are already inlined in the root docs, it surfaces only when the model chooses to call `memory_search`, and its cold-start injection is dead code.

### Purpose
Provide one lightweight, git-tracked, always-loaded decisions surface — the active home the constitutional deprecation replaces the dead tier with.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Design `.opencode/DECISIONS.md`: a **Standing** section (durable global rules — native-memory ban, comment-hygiene pointer, recorded-failure-must-route, main-branch-push) + a **Recent** section (pointers to packet ADRs, not copies).
- Per-runtime auto-load wiring: a Cursor `alwaysApply` rule and a single CLAUDE.md `@`-import line.
- A size budget (Claude line budget / Cursor alwaysApply ceiling) and a supersession/freshness model.
- An optional cheap query path: `/memory:decisions` as a `memory_search` scoped to `decision-record.md` with constitutional off.

### Out of Scope
- Deprecating the constitutional tier / `includeConstitutional` / `/memory:learn` / indexer path — phase 003.
- Rehoming the 20 rule files' unique content + retargeting root-doc links — phase 004.
- Advisor `render.ts` integration — phase 005.
- Any new SQLite table or new required per-packet spec-doc (both eliminated by research).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/DECISIONS.md | Create | The active decisions surface (Standing + Recent pointers) |
| .cursor/rules/decisions.mdc | Create | Cursor `alwaysApply` rule that loads the surface every turn |
| CLAUDE.md | Modify | One `@`-import / pointer line so the surface loads in Claude runtime |
| .opencode/commands/memory/decisions.md | Create (optional) | `/memory:decisions` scoped query over `decision-record.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The decisions surface loads on every turn WITHOUT an MCP round-trip | **Given** a fresh session in each supported runtime, the DECISIONS.md content is present in context with no `memory_search` call required |
| REQ-002 | The surface stays within per-runtime size budgets | **Given** the Claude line budget and Cursor alwaysApply ceiling, DECISIONS.md never exceeds them; Recent entries are pointers, not ADR copies |
| REQ-003 | No new DB and no new required per-packet spec-doc | **Given** the design, there is no new SQLite table and no addition to the required-doc manifest (avoids versioned-contract regression) |
| REQ-004 | Standing vs Recent separation with supersession | **Given** a superseded decision, its `supersedes:` id resolves to a real packet ADR and the stale entry is demoted, not silently overwritten |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A cheap "what did we decide about X" query exists | **Given** `/memory:decisions`, a `memory_search` scoped to `decision-record.md` (constitutional off) returns relevant ADRs without the deprecated tier |
| REQ-006 | The design hands off cleanly to deprecation (phase 003) | **Given** the live replacement surface, phase 003 can retire the constitutional tier without losing every-turn steering |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A single `.opencode/DECISIONS.md` surface exists with Standing + Recent-pointer structure, budget-bounded.
- **SC-002**: Auto-load wiring is designed for each runtime (Cursor alwaysApply + CLAUDE.md import) and verified to surface content every turn with zero MCP calls.
- **SC-003**: The design carries no new DB and no new required spec-doc, and defines a supersession/freshness model — clearing the way for phase 003 deprecation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Auto-rolling all 1,623 ADRs into DECISIONS.md | High — blows the Claude/Cursor budget | Recent section holds pointers only; Standing holds a curated few |
| Risk | `@`-imports assumed to save tokens | Medium — imported files still load at launch | Treat the import as an always-load, not a lazy fetch; keep the file tiny |
| Risk | Reviving native `MEMORY.md` as the store | High — violates the owner's 2026-05-31 native-memory ban and re-splits the store | Use `.opencode/DECISIONS.md`, not native memory |
| Dependency | Phase 003 deprecation | The surface must be live before the tier is retired | Land + verify this surface first; 003 depends on it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What are the exact per-runtime auto-load mechanics and byte budgets (Claude line budget vs Cursor alwaysApply ceiling)? Confirm before creating the surface.
- Should the optional `/memory:decisions` query ship in this phase or defer to after deprecation?
<!-- /ANCHOR:questions -->

---
