---
title: "Feature Specification: 103 - 101 cli-opencode regression remediation"
description: "Resolves 2 P1 regressions + 3 of 4 P2 advisories from packet 102 deep-review of the 093-101 track. P2-032 (cosmetic strategy-doc drift in 102 review artifact) deferred."
trigger_phrases:
  - "103 remediation"
  - "101 cli-opencode regression fix"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/008-remediation"
    last_updated_at: "2026-05-08T01:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Resolved P1-027 + P1-028 + P2-027 + P2-028; deferred P2-032"
    next_safe_action: "Phase complete; track release-ready"
    blockers:
      - "P2-032 strategy-doc drift in 102 review artifact (cosmetic; deferred)"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts"
      - ".opencode/commands/speckit/assets/speckit_deep-review_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: 103 - 101 cli-opencode regression remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 (release-unblocking) |
| **Status** | Complete |
| **Created** | 2026-05-08 |
| **Branch** | `main` |
| **Findings resolved** | P1-027, P1-028, P2-027, P2-027r, P2-028 (5 of 6) |
| **Deferred** | P2-032 (cosmetic strategy-doc drift in 102 review artifact) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 102 deep-review surfaced 2 NEW P1 regressions in 101's cli-opencode executor wiring plus 4 P2 advisories. Aggregate verdict: CONDITIONAL — release blocked until P1s addressed.

P1-027: All 4 if_cli_opencode YAML branches lack `--pure`, breaking dispatch under DeepSeek-family models (which reject MCP tool names containing `:`).

P1-028: `sandboxMode` declared in `EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode']` but silently ignored at runtime — schema-runtime contract violation, authorization-surface defect.

P2-027/P2-027r: cli-opencode missing from advisor scoring lanes; "use cli-opencode" routes to sk-code (the project's primary opencode-stack code-author skill) instead of cli-opencode (the CLI orchestrator skill).

P2-028: Zero unit-test coverage for cli-opencode in executor-config.vitest.ts.

### Purpose
Resolve the 2 P1 regressions + 3 of 4 P2 advisories so the deep-review verdict can flip from CONDITIONAL to PASS. P2-032 (cosmetic strategy-doc drift) deferred as advisory follow-on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- P1-027: add `--pure` to all 4 if_cli_opencode YAML branches
- P1-028: remove `sandboxMode` from `EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode']` so parser rejects (matches serviceTier-for-cli-codex pattern)
- P2-027/P2-027r: add cli-opencode disambiguation regex to explicit.ts scoring lane
- P2-028: add 4 cli-opencode unit-test cases to executor-config.vitest.ts

### Out of Scope
- P2-032 cosmetic strategy-doc drift in 102 review artifact (deferred — low value)
- Native advisor bridge stale-state issue surfaced during P2-027r verification (separate concern; local fallback works)

### Files to Change
| File | Change | Finding |
|------|--------|---------|
| `mcp_server/lib/deep-loop/executor-config.ts:37-40` | Modified | P1-028 |
| `mcp_server/dist/**` | Regenerated | P1-028 |
| 4 `commands/speckit/assets/speckit_deep-{review,research}_{auto,confirm}.yaml` | Modified | P1-027 |
| `mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:241-246` | Modified | P2-027/P2-027r |
| `mcp_server/tests/deep-loop/executor-config.vitest.ts` | Modified | P2-028 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers
| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | All 4 if_cli_opencode YAML branches include `--pure` | grep returns 1 hit per file |
| REQ-002 | `parseExecutorConfig({kind:'cli-opencode', sandboxMode:'read-only'})` throws | smoke test |
| REQ-003 | "use cli-opencode" advisor query returns cli-opencode at confidence >= 0.5 | smoke test (local fallback) |
| REQ-004 | All executor-config tests pass post-change | 25 vitest pass |

### P1 - Required
| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-010 | 4 cli-opencode test cases added | grep test file |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: P1-027 — `--pure` present in all 4 if_cli_opencode YAML branches
- **SC-002**: P1-028 — sandboxMode rejected by parser for cli-opencode
- **SC-003**: P2-027r — cli-opencode disambiguation regex routes correctly via local fallback
- **SC-004**: P2-028 — 4 new test cases pass (25 total)
- **SC-005**: P2-032 explicitly deferred with rationale in `_memory.continuity.blockers`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | --pure removes MCP tools but workflow needs them for spec_folder resolver | Med | Workflow uses node -e for resolveArtifactRoot, not MCP — verified in 101 known limitations |
| Risk | sandboxMode rejection breaks existing deep-review configs | Low | No existing config uses sandboxMode for cli-opencode (only added in 101, never invoked) |
| Risk | P2-027r regex may over-match | Low | Strict `\bcli[-\s]opencode\b|\bopencode[-\s]cli\b` only fires on explicit phrasing |
| Dependency | Packet 102 review-report.md | Required | Available |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: All edits + rebuild < 5 minutes total wall-clock
- **NFR-P02**: Validator runs < 60s per packet

### Security
- **NFR-S01**: P1-028 closes a real authorization-surface defect (silent no-op on read-only request)
- **NFR-S02**: No new env-script execution paths introduced

### Reliability
- **NFR-R01**: 25 executor-config tests pass post-change
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- spec_folder containing shell metacharacter: rejected by P1-019 (preserved)
- cli-opencode + DeepSeek model: now works with --pure
- "use opencode" prompt (without cli prefix): still routes to sk-code (preserved)
- "use cli-opencode" prompt: routes to cli-opencode at 0.95 confidence (new)

### Error Scenarios
- Operator sets cli-opencode + sandboxMode='read-only': now rejected at parse time (was silent no-op)
- DeepSeek-family model rejection on `:` tool names: now mitigated by --pure (was executor_fallback)

### State Transitions
- Phase status: draft → in_progress → complete
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 5 file changes |
| Risk | 5/25 | All edits bounded; 25 tests pass |
| Research | 4/20 | 102 review-report provided full context |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Predecessor**: `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/007-track-rereview/review/review-report.md`
- **101 originator**: `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/006-cli-opencode-executor/`
