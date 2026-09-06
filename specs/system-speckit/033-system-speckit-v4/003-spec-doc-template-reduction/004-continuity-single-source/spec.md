---
title: "Feature Specification: Phase 4: continuity-single-source"
description: "The _memory.continuity block repeats at roughly 16 lines across five docs, about 80 near-identical lines per L2 packet, but only implementation-summary.md is read by the resume ladder. Consolidate to one canonical block, validator-first, so strict validation does not fail fleet-wide."
trigger_phrases:
  - "memory continuity consolidation"
  - "single-source continuity"
  - "FRONTMATTER_MEMORY_BLOCK"
  - "resume ladder"
  - "spec core"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-spec-doc-template-reduction/004-continuity-single-source"
    last_updated_at: "2026-08-26T07:05:00Z"
    last_updated_by: "design-author"
    recent_action: "Authored continuity-consolidation design from 001-analysis research (R4)"
    next_safe_action: "Relax FRONTMATTER_MEMORY_BLOCK expectations BEFORE editing templates"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts"
      - ".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-036-004-continuity-single-source"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does a full generate-context.js save rewrite _memory blocks in multiple docs or only implementation-summary?"
    answered_questions:
      - "Which surfaces read the duplicated continuity copies? (resume-ladder impl-summary only; but FRONTMATTER_MEMORY_BLOCK + SESSION_LINEAGE validate all copies)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: continuity-single-source

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
| **Phase** | 4 of 6 |
| **Predecessor** | 003-template-dedup |
| **Successor** | 005-comment-extraction |
| **Handoff Criteria** | Continuity is authored once (implementation-summary) with validators relaxed first; the resume ladder, deriveStatus, and freshness gate all key on the single canonical block; no fleet-wide validation failure. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4**, consolidating the most-duplicated structure in the kit. Grounded in 001-analysis research recommendation R4. The ordering is the crux: validator expectations must be relaxed BEFORE the templates drop the redundant copies, or every packet fails `FRONTMATTER_MEMORY_BLOCK` under `--strict`.

**Scope Boundary**: The `_memory.continuity` frontmatter block and the validators/consumers that read it. No changes to the canonical doc content or the resume ladder's arbitration logic.

**Dependencies**:
- `FRONTMATTER_MEMORY_BLOCK` validates the block in every contract doc.
- `SESSION_LINEAGE` scans session ids across level docs.
- Continuity freshness gate keys on implementation-summary only.

**Deliverables**:
- One canonical continuity block (implementation-summary), templates relaxed elsewhere.
- Validator changes landed first, proven not to regress the fleet.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The ~16-line `_memory.continuity` YAML block is re-emitted in spec/plan/tasks/checklist/implementation-summary, about 80 near-identical lines across five docs in an L2 packet. Only `implementation-summary.md` is read by the resume ladder and by status derivation, so four of the five copies are dead weight. But two validators (`FRONTMATTER_MEMORY_BLOCK`, `SESSION_LINEAGE`) consume the copies, so a naive template edit fails strict validation across the whole fleet.

### Purpose
Author continuity once (in implementation-summary) and relax the validators first, so the redundant copies can be removed without breaking any existing packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Relax `FRONTMATTER_MEMORY_BLOCK` to require the continuity block only on implementation-summary (or make its absence elsewhere non-blocking).
- Review and rescope the `SESSION_LINEAGE` cross-doc session-id scan.
- Remove the redundant `_memory.continuity` emission from the four non-canonical templates.

### Out of Scope
- Changing the resume ladder's fresher-source arbitration or the freshness fingerprint algorithm.
- Folding `handover.md` into implementation-summary (eliminated — destroys resume-ladder arbitration).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| mcp-server/lib/validation/spec-doc-structure.ts | Modify | FRONTMATTER_MEMORY_BLOCK: single-canonical-doc expectation |
| mcp-server/lib/validation/orchestrator.ts | Modify | SESSION_LINEAGE scope review |
| templates/{spec,plan,tasks,checklist}.md.tmpl | Modify | Drop redundant _memory.continuity emission |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Validators relaxed BEFORE templates change | **Given** the validator change landed first, `validate.sh --strict` passes on a shipped packet that still carries the old five-copy continuity |
| REQ-002 | Single canonical continuity block preserved | **Given** the resume ladder, deriveStatus, and freshness gate, all read continuity from implementation-summary with no behavior change |
| REQ-003 | No fleet-wide regression | **Given** a representative sweep of shipped L1/L2/L3 packets, none newly fail FRONTMATTER_MEMORY_BLOCK or SESSION_LINEAGE |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | generate-context multi-doc rewrite behavior confirmed | **Given** a real save, it is verified whether _memory blocks are rewritten in multiple docs or only implementation-summary, and the template change matches |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Continuity authored once; four redundant copies removed from templates.
- **SC-002**: Validators relaxed first; zero fleet-wide strict-validation regression proven by a representative sweep.
- **SC-003**: Resume ladder + deriveStatus + freshness gate behavior unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Templates edited before validators relaxed | High — FRONTMATTER_MEMORY_BLOCK fails fleet-wide | Land the validator change first; sweep shipped packets before touching templates |
| Risk | generate-context rewrites multiple docs unexpectedly | Medium | Confirm behavior on a real save before removing template emissions |
| Dependency | resume-ladder + freshness gate | Must stay green | Keep implementation-summary as the single canonical source |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does a full `generate-context.js` save rewrite `_memory` blocks across multiple docs, or only implementation-summary? (Blocks REQ-004; verify on a real save.)
<!-- /ANCHOR:questions -->

---
