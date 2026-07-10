---
title: "Feature Specification: Cache-Stability Audit of Prompt Prefixes"
description: "Audit our hook/prompt-prefix injection for volatile tokens (UUIDs, ISO-8601 timestamps, JWTs, hex hashes, session IDs) that bust the provider prompt cache, and relocate them after the stable cached prefix. Applies CacheAligner principle with zero Headroom dependency."
trigger_phrases:
  - "cache stability audit"
  - "prompt cache busting"
  - "volatile token audit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-headroom-utilization/002-cache-stability-audit"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the cache-stability-audit phase"
    next_safe_action: "Identify the hook sites that contribute to the cached prefix"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-029-002-cache-stability-audit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Cache-Stability Audit of Prompt Prefixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/154-design-context-loading` |
| **Parent Spec** | ../spec.md |
| **Rec** | #1 — Cache-stability audit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Applies CacheAligner's detection principle (cache_aligner.py classifies UUIDs, ISO-8601 timestamps, JWT-shapes, and hex hashes as volatile) to our own injected context — with **zero Headroom dependency**. The provider gives a large discount when the front of the prompt is byte-identical across turns; a single volatile token in that cached prefix silently voids the discount.

**Dependencies**: None — this is a read-only audit of our own injected context; it does not install or run Headroom.

**Status**: Planned — not yet started. Scaffolded as a tracked phase under packet 029.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Our hooks inject context (advisor briefs, SessionStart summaries, UserPromptSubmit context) at the top of every turn. If any of that injected prefix carries a volatile token — a session id, a UUID, an ISO-8601 timestamp, a JWT, or a hex hash — it changes turn to turn and silently busts the provider's prompt-cache discount, so we pay full input price every turn instead of the cached rate. Headroom's CacheAligner exists to detect exactly these patterns; we can apply the same principle directly.

### Purpose
Audit our prompt-prefix and hook injection for volatile tokens in the cached region and relocate them after the stable prefix so cache hits are restored.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only audit of hook output and injected startup/advisor context that lands in the cached prompt prefix.
- Identify each volatile-token occurrence by the four CacheAligner shapes (UUID / ISO-8601 / JWT / hex-hash) plus session ids.
- Propose and (for low-risk cases) apply reordering that moves volatile content after the cached prefix.

### Out of Scope
- Installing or running Headroom (handled in 004).
- Changing hook semantics or the meaning of injected content.
- Compressing anything.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/audit-report.md` | Create | Per-occurrence volatile-token findings in the cached prefix with file:line |
| hook-injection sites | Modify | Targeted reordering to move volatile tokens after the stable prefix (low-risk only) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Produce a cited audit of volatile tokens in the cached prefix | Each occurrence listed with `file:line` and which of the four shapes (or session-id) it matches |
| REQ-002 | Name the fix for each occurrence | Each finding has a move-after-prefix (or justified-keep) recommendation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Apply the low-risk fixes | Volatile tokens relocated after the cached prefix where semantics are unaffected |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The cached prompt prefix is free of volatile tokens, or each remaining one is explicitly justified.
- **SC-002**: The audit is reproducible — anyone can re-grep the same sites and get the same findings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Mis-identifying the cached-prefix boundary | Audit fixes the wrong region | Confirm the provider cache boundary for our setup before reordering |
| Risk | Reordering changes meaning | Behavior regression | Read-only audit first; apply only semantics-preserving moves; review each |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which hook sites (SessionStart, UserPromptSubmit, advisor brief) actually land in the cached prefix?
- How does the provider define the cache-prefix boundary for our request shape?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Research basis**: `../001-research/research/research.md`
