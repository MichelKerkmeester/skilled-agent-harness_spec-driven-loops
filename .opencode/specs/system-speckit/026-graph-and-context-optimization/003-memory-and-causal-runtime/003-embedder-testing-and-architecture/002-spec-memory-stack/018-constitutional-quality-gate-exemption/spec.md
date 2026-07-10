---
title: "Feature Specification: Phase 1: constitutional-quality-gate-exemption [template:level_1/spec.md]"
description: "Constitutional markdown files were hard-rejected by memory_index_scan because they lack ANCHOR tags and primary-evidence sections by design. Add isConstitutional to the warn-only branch so constitutional policy text passes the strict sufficiency gate like spec docs do."
trigger_phrases:
  - "constitutional warn-only exemption"
  - "INSUFFICIENT_CONTEXT_ABORT constitutional"
  - "memory-index isConstitutional gate"
  - "policy markdown sufficiency exempt"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/018-constitutional-quality-gate-exemption"
    last_updated_at: "2026-05-19T19:50:00Z"
    last_updated_by: "claude-code"
    recent_action: "Patch landed in handlers/memory-index.ts:474, mcp_server rebuilt clean"
    next_safe_action: "ready to commit packet plus restart daemon to pick up the new dist"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-002-018-constitutional-exemption"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Why exempt? Constitutional files are policy text, not evidence-bearing memory records."
      - "Why warn-only instead of an outright skip? Frontmatter still validates and rows still land in memory_index, only the sufficiency hard-reject is suppressed."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: constitutional-quality-gate-exemption

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-19 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 18 |
| **Predecessor** | 017-factory-shard-fallback-for-hf-voyage-openai |
| **Successor** | 019-lineage-and-metadata-repair-runner |
| **Handoff Criteria** | Packet committed on main, daemon restarted, post-restart scan reports 0 INSUFFICIENT_CONTEXT_ABORT rejections for `.opencode/skills/*/constitutional/*.md` files |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** under `002-spec-memory-stack`. The packet closes one of the two remediation classes surfaced by the 503-rejection investigation that followed packet 016/002/016 (see scratch file `2026-05-19-503-failed-rejection-investigation.md` in the 016 packet).

**Scope Boundary**: one 5-line patch to a single handler file. No schema migrations, no MCP-tool contract changes, no other code paths.

**Dependencies**:
- The 016/002/016 fix that unblocked semantic search must be in place. Without it the constitutional indexing pipeline is unreachable.
- The 016/002/016 scan that produced the rejection list provided the diagnostic evidence used here.

**Deliverables**:
- `handlers/memory-index.ts:474` patched to OR `isConstitutional` into the `useWarnOnly` branch.
- Inline rationale comment naming this packet so future readers can find the why.
- Daemon restart after rebuild so the new dist takes effect.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Constitutional markdown files under `.opencode/skills/*/constitutional/` hard-rejected during `memory_index_scan` with `INSUFFICIENT_CONTEXT_ABORT`. The rejection fires because `memory-sufficiency.ts:372` requires `support >= 3` and `anchors >= 1` when primary evidence is absent. Constitutional files carry policy text without ANCHOR tags and without the primary-evidence sections the gate scans for. The 016/002/016 scan logged 2 such rejections: `cli-dispatch-skill-preload.md` and `post-implementation-deep-review.md`.

### Purpose
Pass constitutional files through the same warn-only sufficiency mode that spec docs use today, so policy text indexes successfully without forcing it to adopt evidence-bearing structure.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One handler patch at `handlers/memory-index.ts:474`.
- Build of `@spec-kit/mcp-server` so the dist reflects the source.
- Daemon restart so the live process loads the patched dist.

### Out of Scope
- Backfilling ANCHOR tags or primary-evidence sections into constitutional files. The gate exists for a reason: bypassing it is the right call for policy text, not retrofitting policy text to look like evidence.
- The 501 non-sufficiency failures from the same scan. Lineage and graph-metadata schema issues are owned by packet 019.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | Add `isConstitutional` to the `useWarnOnly` branch and add a rationale comment |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Constitutional files must pass through warn-only sufficiency mode during scan | After patch plus daemon restart, `memory_index_scan` reports 0 `INSUFFICIENT_CONTEXT_ABORT` rejections for files under `.opencode/skills/*/constitutional/` |
| REQ-002 | The patch must not weaken validation for non-constitutional files | The `useWarnOnly` OR chain only adds the `isConstitutional` term, spec-doc and force paths stay unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Rationale must be discoverable in source | Comment block above the `isConstitutional` line names "Packet 018" and explains the policy-text reasoning |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Post-daemon-restart `memory_index_scan` results show the 2 constitutional rejections collapse to 0.
- **SC-002**: Strict validate passes for this packet on first run, no doc gymnastics required.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Future constitutional files contain accidental low-quality content that should be flagged | Low | Reviewers catch this at PR time, warn-only still surfaces issues in the index response without blocking |
| Dependency | Daemon must reload dist | Med | Documented restart step, no special tooling needed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The exemption is the narrower of the two options the investigation surfaced. The alternative was retrofitting ANCHOR tags into every constitutional file, which conflicts with their policy-not-evidence nature.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
