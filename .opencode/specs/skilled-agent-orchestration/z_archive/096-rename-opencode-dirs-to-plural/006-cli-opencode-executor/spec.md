---
title: "Feature Specification: 101 - cli-opencode executor support"
description: "Adds cli-opencode as a supported executor for the deep-review/deep-research workflows; enables hands-off iteration dispatch via opencode run."
trigger_phrases:
  - "101 cli-opencode executor"
  - "opencode executor"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/006-cli-opencode-executor"
    last_updated_at: "2026-05-07T21:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Added cli-opencode to EXECUTOR_KINDS + 4 YAML if_cli_opencode branches"
    next_safe_action: "Dispatch deep-review re-run with cli-opencode for verdict-flip confirmation"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts"
      - ".opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: 101 - cli-opencode executor support

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-07 |
| **Branch** | `main` |
| **Findings resolved** | (n/a — feature add) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-review/deep-research workflows support 4 executors (`native`, `cli-codex`, `cli-gemini`, `cli-claude-code`) but not `cli-opencode`. Users cannot dispatch deep-loop iterations via OpenCode CLI even though the cli-opencode skill exists for cross-AI handback. Requested explicitly during the post-100 verdict-flip re-run.

### Purpose
Add `cli-opencode` as a 5th executor kind. Wire the corresponding `if_cli_opencode` YAML branch in all 4 deep-loop workflow assets (deep-review auto+confirm, deep-research auto+confirm). Map `--variant` flag to `reasoningEffort`. Enable hands-off automation via `--dangerously-skip-permissions`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend `EXECUTOR_KINDS` to include `cli-opencode`
- Add allowed-fields entry: `model`, `reasoningEffort`, `sandboxMode`, `timeoutSeconds`
- Add `if_cli_opencode` YAML branch to deep-review_auto.yaml, deep-review_confirm.yaml, deep-research_auto.yaml, deep-research_confirm.yaml
- Rebuild dist
- Verify all 33 executor-config + executor-audit tests still pass

### Out of Scope
- Adding cli-opencode model whitelist (similar to cli-gemini's GEMINI_SUPPORTED_MODELS) — opencode supports many providers, no narrow whitelist
- Adversarial test fixture for cli-opencode dispatch — advisory follow-on
- Self-invocation guard at YAML level (cli-opencode skill SKILL.md remains authoritative)

### Files to Change
| File | Change |
|------|--------|
| `mcp_server/lib/deep-loop/executor-config.ts` | Extend EXECUTOR_KINDS + EXECUTOR_KIND_FLAG_SUPPORT |
| 4 deep-loop workflow YAMLs | Insert if_cli_opencode branch after if_cli_claude_code |
| `mcp_server/dist/**` | Regenerated |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers
| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | `EXECUTOR_KINDS` includes `cli-opencode` | source diff |
| REQ-002 | All 4 deep-loop YAMLs have `if_cli_opencode:` branch | grep returns 4 |
| REQ-003 | All existing executor tests pass | vitest run all 33 |

### P1 - Required
| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-010 | Deep-review re-run dispatch via cli-opencode succeeds | 099-style packet emitted |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `EXECUTOR_KINDS` includes `cli-opencode`
- **SC-002**: 4 YAMLs have `if_cli_opencode:` branch (1 each)
- **SC-003**: All 33 executor tests pass
- **SC-004**: deep-review re-run via cli-opencode produces valid review-report.md
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | opencode tool-name pattern incompatible with `:` in MCP tool names | Med | Try opencode-go/deepseek-v4-pro first; fall back if rejection |
| Risk | --dangerously-skip-permissions allows unbounded writes | Low | Flag is required for hands-off automation; default sandbox is workspace-write equivalent |
| Dependency | cli-opencode skill v1.3.0.0 SKILL.md self-invocation guard | Required | Existing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: TS rebuild <60s
- **NFR-P02**: YAML edits idempotent

### Security
- **NFR-S01**: Self-invocation guard preserved at cli-opencode skill level

### Reliability
- **NFR-R01**: All 33 executor tests pass post-change
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- model='opencode-go/deepseek-v4-pro': supported (provider/model format)
- variant unset: opencode runs with default (no `--variant` flag)
- sandboxMode='read-only': no opencode equivalent; documented

### Error Scenarios
- opencode binary missing: dispatch fails with command-not-found
- DeepSeek tool-name pattern rejection: documented as known limitation; orchestrator can retry with different model

### State Transitions
- Phase status: draft → in_progress → complete
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 1 source file + 4 YAMLs |
| Risk | 6/25 | Low; existing patterns |
| Research | 4/20 | cli-opencode SKILL.md provided invocation shape |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Predecessor**: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/005-remediation/`
- **Implementation Summary**: `implementation-summary.md`
