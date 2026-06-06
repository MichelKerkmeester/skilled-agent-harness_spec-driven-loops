---
title: "Feature Specification: Devin Static Scenarios (Code Graph Playbook 002)"
description: "Run the 7 static/build/infra + Devin-hook code-graph playbook scenarios via cli-devin SWE-1.6 and capture command evidence."
trigger_phrases:
  - "devin static scenarios"
  - "code graph post-rename infra scenarios"
  - "029 phase 002 devin static"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/002-devin-static-scenarios"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 002 spec for static/infra/hook scenario dispatch"
    next_safe_action: "Author RCAF dispatch prompt + agent-config recipe for SWE-1.6"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure"
      - ".opencode/skills/system-code-graph/manual_testing_playbook/10--devin-hooks/devin-session-start.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-26-code-graph-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Devin Static Scenarios (Code Graph Playbook 002)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
7 of the 22 playbook scenarios are static/source-inspection or build-verification checks (MCP manifest post-rename, launcher startup prefix, mcp.json server key, database path, TypeScript build/entry point, unicode-normalization fix) plus the Devin CLI SessionStart hook scenario. These do not need the live MCP runtime; they need bounded, clearly-defined inspection of files, build output, and the Devin hook registration.

### Purpose
Run these 7 scenarios through `cli-devin` SWE-1.6 (coding-specialized, free-tier, fast) with the SWE-1.6 prompt-quality contract (RCAF + medium-density pre-planning + agent-config recipe + sequential_thinking 2-layer) and capture command evidence for the parent matrix.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Scenarios 016 (MCP tool manifest post-rename), 017 (launcher startup prefix), 018 (mcp.json server key rename), 019 (database path verification), 020 (TypeScript build and entry point), 021 (unicode-normalization fix), 025 (Devin CLI SessionStart hook).
- Dispatch via `devin --prompt-file <path> --model swe-1.6 --permission-mode auto`.

### Out of Scope
- Live-MCP / coverage / doctor scenarios (phase 001).
- Fixing defects surfaced by a FAIL verdict.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/devin-prompt-*.md` | Create | RCAF dispatch prompts with pre-planning blocks |
| `scratch/agent-config-*.json` | Create | Scoped permission recipe for SWE-1.6 dispatch |
| `evidence.md` | Create | Per-scenario verdict table with command evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 7 scenarios dispatched, verdict recorded | 7 rows in `evidence.md`, each PASS/FAIL/SKIP + reason |
| REQ-002 | SWE-1.6 prompt-quality contract honored | RCAF framing + pre-planning block + agent-config recipe + sequential_thinking enforced |
| REQ-003 | Verdicts cite command/file evidence | Each row links to captured command output or file excerpt |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Single-dispatch discipline honored | One cli-devin dispatch at a time, SIGKILL before next, unless operator authorizes parallel |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 7/7 static/infra/hook scenarios have a recorded verdict with evidence.
- **SC-002**: Any FAIL is logged with reproducing command, not silently fixed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | devin auth + SWE-1.6 free tier | Blocks dispatch | Confirmed authenticated at pre-flight (`devin auth status`) |
| Risk | SWE-1.6 underwhelms without pre-planning | Weak output | Enforce RCAF + medium-density pre-planning per cli-devin contract |
| Risk | agent-config mcp_servers field rejected | Dispatch error | Use 2-layer sequential_thinking pattern (devin mcp add + system_instructions), NOT recipe mcp_servers field |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: SWE-1.6 default timeout 10-15 min/dispatch is sufficient.

### Security
- **NFR-S01**: `--permission-mode auto` (never `dangerous`); no secrets in prompts.

### Reliability
- **NFR-R01**: `2>&1 </dev/null` capture; failures surface to orchestrator.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Post-rename scenarios assert the `mk-code-index` / `mk_code_index` naming is consistent across launcher, mcp.json, db path.
- Build scenario (020) asserts tsc compiles and entry point resolves.

### Error Scenarios
- SWE-1.6 returns defensive prose instead of evidence: re-dispatch with tightened pre-planning (keep bundle-gate at "standard").
- Devin hook scenario (025): assert `.devin/hooks.v1.json` SessionStart registration + session-start.ts presence.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 7 scenarios, mostly read/build checks |
| Risk | 8/25 | Read-only inspection; no live mutation |
| Research | 6/20 | Playbook + infra already mapped |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Run all 7 in one SWE-1.6 dispatch, or split the Devin-hook scenario (025) into its own dispatch?
<!-- /ANCHOR:questions -->
