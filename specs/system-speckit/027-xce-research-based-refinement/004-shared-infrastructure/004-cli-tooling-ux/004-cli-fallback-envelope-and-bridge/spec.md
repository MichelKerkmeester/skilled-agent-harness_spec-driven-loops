---
title: "Feature Specification: CLI Fallback Envelope and Bridge Allowlist"
description: "Normalize the warm-fallback result envelopes and reason codes across the three hook helpers and add an explicit prompt-time allowlist to the spec-memory plugin bridge, mirroring the code-index maintenance denylist."
trigger_phrases:
  - "cli fallback envelope normalization"
  - "warm fallback reason codes"
  - "spec-memory bridge allowlist"
  - "hook helper skipped fail_open"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux/004-cli-fallback-envelope-and-bridge"
    last_updated_at: "2026-06-11T03:34:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented normalized fallback envelopes and bridge allowlist"
    next_safe_action: "No implementation action pending"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/warm-cli-fallback-envelope.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/spec-memory-cli-fallback.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/code-index-cli-fallback.ts"
      - ".opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-004-cli-fallback-envelope-and-bridge"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: CLI Fallback Envelope and Bridge Allowlist

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

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
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The three hook fallback helpers return inconsistent result envelopes, so agents and plugins handle `skipped`, `fail_open`, `exitCode`, and retryability differently per helper: spec (`hooks/spec-memory-cli-fallback.ts:148-220`), code (`hooks/code-index-cli-fallback.ts:151-220`), advisor (`hooks/lib/skill-advisor-cli-fallback.ts:158-187`). Separately, the spec-memory plugin bridge accepts an arbitrary `toolName` if invoked directly (`plugin_bridges/mk-spec-memory-bridge.mjs:206-230`); in practice the plugin only calls `brief/status`, but there is no explicit guard, unlike the code-index bridge which blocks maintenance tools with a denylist (`plugin_bridges/mk-code-graph-bridge.mjs:18-25` and `:272-282`). That is a defense-in-depth gap on the spec-memory side.

### Purpose
Normalize the warm-fallback result envelope and reason codes (`skipped`, `fail_open`, `exitCode`, retryability) across the three hook helpers so consumers handle one shape, and add an explicit prompt-time allowlist to the spec-memory plugin bridge mirroring the code-index maintenance denylist, closing the defense-in-depth gap. Envelope changes must be additive so current hook consumers keep working during rollout.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A normalized warm-fallback result envelope + reason codes (`skipped`, `fail_open`, `exitCode`, retryability) across the three hook helpers.
- An explicit prompt-time allowlist on the spec-memory plugin bridge, mirroring the code-index maintenance denylist.

### Out of Scope
- Tool coverage changes.
- The freshness/smoke, help/alias, documentation, and completion work owned by sibling sub-phases 001, 002, 003, 005.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/hooks/spec-memory-cli-fallback.ts` (`:148-220`) | Modify | Emit the normalized envelope + reason codes |
| `mcp_server/hooks/code-index-cli-fallback.ts` (`:151-220`) | Modify | Emit the normalized envelope + reason codes |
| `system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` (`:158-187`) | Modify | Emit the normalized envelope + reason codes |
| `mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs` (`:206-230`) | Modify | Add prompt-time allowlist (mirror `mk-code-graph-bridge.mjs:18-25`, `:272-282`) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The spec-memory plugin bridge enforces an explicit prompt-time allowlist | Bridge rejects any `toolName` outside the allowlist (e.g. only `brief/status`); rejection is structured and testable |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The three hook helpers emit one normalized warm-fallback envelope + reason codes | Envelope exposes `skipped`, `fail_open`, `exitCode`, and retryability consistently across all three helpers |
| REQ-003 | Envelope changes are additive; current hook consumers keep working during rollout | Existing consumer fields remain present; new fields are added, not renamed/removed (guardrail: assessment #8 additive risk) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One normalized fallback envelope is consumed identically across the three helpers.
- **SC-002**: The spec-memory bridge enforces a prompt-time allowlist matching the code-index denylist posture.
- **SC-003**: No existing hook consumer breaks (additive-only envelope change).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hook consumers depend on current envelope shapes | Med | Additive-only changes; keep existing fields and add new ones (assessment #8 guardrail) |
| Risk | Allowlist too narrow blocks a legitimate prompt-time call | Low | Mirror the proven code-index posture; allowlist exactly the plugin-called tools |
| Dependency | code-index bridge denylist pattern | Internal | Mirror `mk-code-graph-bridge.mjs:18-25`, `:272-282` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered: spec-kit hook helpers share `warm-cli-fallback-envelope.ts`; skill-advisor keeps a local duplicate to preserve skill isolation.
- Answered: the spec-memory bridge uses a static prompt-time allowlist for the two plugin routes, `brief` and `status`, mapping to `session_resume` and `memory_health`.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
