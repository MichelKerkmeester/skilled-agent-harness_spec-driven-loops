---
title: "Feature Specification: Scorer P0 Routing Fixes (F1b)"
description: "Fix the genuine P0 scorer/routing failures: low-information ambiguous prompts mis-routing to sk-code (P0-UNC-001/002) and /speckit:plan lacking a command-intent bonus (P0-CMD-002)."
trigger_phrases:
  - "scorer P0 routing fixes"
  - "F1b ambiguity abstention"
  - "speckit plan intent bonus"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-playbook-run-and-remediation/005-finding-remediation/002-scorer-p0-routing-fixes"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-p0-remediation"
    recent_action: "Implemented and verified F1b scorer routing fixes"
    next_safe_action: "None; phase complete and verified"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "mcp-code-mode routes (not relabelled)"
      - "abstain only on ambiguous-keyword-driven winners"
---
# Feature Specification: Scorer P0 Routing Fixes (F1b)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-26 |
| **Completed** | 2026-05-27 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 028 PC-004 regression has genuine P0 failures unrelated to label drift (0/24 P0 cases use the drifted labels). Two scorer/routing defects: (1) the low-information ambiguous prompt "api chain mcp" routes to `sk-code` instead of abstaining or selecting `mcp-code-mode` (`lib/scorer/ambiguity.ts:44-57`, `lib/scorer/fusion.ts:389-404`) — fails P0-UNC-001/P0-UNC-002; (2) `/speckit:plan` appears in the command-bridge projection but lacks a primary-intent bonus, so `sk-doc` wins (`lib/scorer/projection.ts:47-55`, `lib/scorer/fusion.ts:265-268`) — fails P0-CMD-002.

### Purpose
Raise P0 pass rate by fixing the two genuine routing defects, so PC-004's P0 gate moves toward 100% (currently 50%).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Ambiguity/abstention tuning for low-information multi-domain prompts (P0-UNC-001/002).
- A `/speckit:plan` command-intent bonus parallel to the existing `/speckit:resume` special case (P0-CMD-002).
- Re-run the regression suite to confirm P0 lift.

### Out of Scope
- The metric-layer alias fix (phase 001 / F1a).
- Broad scorer-weight retuning beyond these two defects.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts` | Modify | Abstain/route mcp-code-mode for low-info ambiguous prompts |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts` | Modify | /speckit:plan command-intent bonus |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modify | Apply the intent bonus / ambiguity handling in fusion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | P0-UNC-001/002 pass | "api chain mcp" abstains or routes to mcp-code-mode, not sk-code |
| REQ-002 | P0-CMD-002 passes | "/speckit:plan ..." routes to system-spec-kit, not sk-doc |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No P0 regressions | P0-MEM-001, P0-CMD-001/003 still pass; P0 pass rate rises toward 100% |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: skill_advisor_regression.py P0 pass rate ≥ 0.92 (from 0.50), with no previously-passing P0 case regressing.
- **SC-002**: The ambiguity decision is principled (documented rule), not a per-prompt hack.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Abstention rule over-suppresses real recommendations | Lower recall | Scope to low-information multi-domain prompts; add a regression fixture |
| Risk | /speckit:plan bonus over-fires for non-command prompts | Mis-route | Mirror the bounded /speckit:resume special-case pattern |
| Dependency | mcp-code-mode route status | Affects P0-UNC-002 | Decide route-vs-relabel (open question) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

_All resolved during implementation._

- ~~Restore `mcp-code-mode` as a live route, or relabel `P0-UNC-002`?~~ **Resolved: route.** Toolchain vocabulary disambiguates toward mcp-code-mode; it is the best guess surfaced in confidence-only mode.
- ~~Should low-information ambiguity suppress all recommendations by default, or only for specific prompt shapes?~~ **Resolved: abstain only when the winner's lead is ambiguous-keyword-driven (no phrase/intent anchor)** — abstains on "api chain mcp" while terse-but-anchored prompts ("code audit") still route. Principled, not a per-prompt hack (SC-002).
<!-- /ANCHOR:questions -->
