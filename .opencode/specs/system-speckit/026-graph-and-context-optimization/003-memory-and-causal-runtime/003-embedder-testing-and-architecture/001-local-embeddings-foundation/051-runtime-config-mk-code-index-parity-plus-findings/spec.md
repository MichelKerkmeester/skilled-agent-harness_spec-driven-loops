---
title: "Feature Specification: Runtime config mk-code-index parity plus findings"
description: "Tracks runtime MCP config parity for the mk-code-index rename plus bounded remediation of two deep-review finding reports."
trigger_phrases:
  - "runtime config mk-code-index parity"
  - "016 findings sweep"
  - "deep-review findings remediation"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/051-runtime-config-mk-code-index-parity-plus-findings"
    last_updated_at: "2026-05-14T19:27:55Z"
    last_updated_by: "codex"
    recent_action: "Runtime config parity and bounded findings remediated"
    next_safe_action: "Review deferred packets before broad runner hardening"
    blockers: []
    key_files:
      - "opencode.json"
      - ".codex/config.toml"
      - ".gemini/settings.json"
      - "_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs"
    session_dedup:
      fingerprint: "sha256:0160160160160160160160160160160160160160160160160160160160160160"
      session_id: "016-runtime-config-mk-code-index-parity-plus-findings"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Canonical runtime server id is mk_code_index; launcher path is .opencode/bin/mk-code-index-launcher.cjs."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Runtime config mk-code-index parity plus findings

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Runtime MCP configs still carried the legacy `system_code_graph` server key in three active client mirrors after the code-graph server was renamed to `mk-code-index`. This packet aligns those mirrors, confirms `.claude/mcp.json` was already correct, and closes the bounded P1/P2 findings from the two cited deep-review reports.

**Key Decisions**: use `mk_code_index` as the config key, keep tool IDs such as `code_graph_scan` unchanged, and defer only P2 work that is broader than a small bounded fix.

**Critical Dependencies**: the local rename commit is `50cfabb6e2`, matching the requested subject even though the dispatch SHA `7cfc16ed9` is not present in this checkout.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `mk-code-index` rename had landed in source and `.claude/mcp.json`, but `opencode.json`, `.codex/config.toml`, and `.gemini/settings.json` still used the legacy `system_code_graph` config key and launcher path. Two deep-review reports also carried open finding ledgers that needed either bounded remediation or explicit named deferral.

### Purpose

Bring runtime config identity into parity and leave a traceable ledger for every P1/P2 finding that was fixed, accepted as already fixed, or deferred into a named follow-on packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename runtime MCP config keys and launcher paths from `system_code_graph` to `mk_code_index`.
- Verify the current launcher/state files use `mk-code-index` paths and no legacy launcher remains.
- Triage both deep-review reports and apply bounded fixes.
- Create this Level 3 packet and record fixed/deferred counts.

### Out of Scope

- Tool ID renames. `code_graph_*`, `detect_changes`, and `ccc_*` remain locked.
- Broad runner refactors, safe object-literal parser replacement, or env allowlist redesign. Those are named follow-ons.
- Advisor server/lib changes. `opencode mcp list` showed an unrelated `system_skill_advisor` failure; this packet does not edit advisor code.
- Pre-existing runtime state timestamp churn and unrelated dirty search-decision logs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `opencode.json` | Modify | Rename the stale config key and launcher path to `mk_code_index` / `mk-code-index-launcher.cjs`. |
| `.codex/config.toml` | Modify | Rename the stale config table and launcher path. |
| `.gemini/settings.json` | Modify | Rename the stale config key and launcher path. |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify | Derive fallback nested dist path from the skill directory basename. |
| `_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs` | Modify | Broaden shared-daemon error response detection. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/shared-daemon-runner-helpers.vitest.ts` | Modify | Exercise primary `spec_kit_memory` and `cocoindex_code` client keys. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/HANDOVER-2026-05-14-evening.md` | Modify | Reconcile 045 handover state with shipped CocoIndex wiring. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/046-shared-daemon-suite-runner/spec.md` | Modify | Add two-client requirements and success criteria. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/046-shared-daemon-suite-runner/implementation-summary.md` | Modify | Document the two-transport trade-off. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/051-runtime-config-mk-code-index-parity-plus-findings/` | Create | Packet docs and metadata. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Runtime configs use the canonical server id. | `rg "system_code_graph|system-code-graph-launcher" opencode.json .claude/mcp.json .codex/config.toml .gemini/settings.json` returns no matches. |
| REQ-002 | Launcher path parity is real, not only textual. | `.opencode/bin/mk-code-index-launcher.cjs` exists and `.opencode/bin/system-code-graph-launcher.cjs` does not. |
| REQ-003 | P1 findings from both reports are closed or explicitly deferred. | 017 P1 fixed count is 1; 048 P1 fixed count is 2 from the local report. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Low-cost P2 findings are remediated. | 017 bounded P2 fixes are recorded, and 048 F004/F008/F009/F010/F011 are fixed. |
| REQ-005 | Non-bounded P2 findings are not silently skipped. | Deferred findings are listed with named follow-on packet recommendations. |
| REQ-006 | Packet validation passes. | `validate.sh <016 packet> --strict` exits 0 with 0 errors and 0 warnings. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four runtime config files are verified with `mk_code_index` and no legacy config key or launcher path.
- **SC-002**: `opencode mcp list` shows `mk_code_index` connected through `.opencode/bin/mk-code-index-launcher.cjs`.
- **SC-003**: The 017 P1 finding and the local 048 P1 findings are fixed.
- **SC-004**: Every deferred finding has a named follow-on packet.
- **SC-005**: Packet 016 strict validation passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Dispatch listed SHA `7cfc16ed9`, but local history has `50cfabb6e2` for the same rename subject. | Wrong evidence source if uncorrected. | Use the local commit with the matching subject and record the mismatch. |
| Risk | 048 report count in the dispatch differs from the local report. | Binding counts could appear lower than expected. | Count against the checked-in report: 2 P1 and 12 P2. |
| Risk | Broad P2 remediations can destabilize evidence tooling. | Over-scoped fixes could introduce production bugs. | Defer broad runner hardening to named packets. |
| Dependency | OpenCode CLI is the only direct runtime MCP smoke available. | Cannot smoke Claude, Codex, or Gemini directly. | Validate config syntax and run `opencode mcp list`. |
<!-- /ANCHOR:risks -->

---
<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Runtime config changes do not add startup work beyond using the existing launcher.

### Security
- **NFR-S01**: No secrets are added to configs or packet docs.

### Reliability
- **NFR-R01**: The config rename must preserve existing tool IDs and code-graph env var names.

---

## 8. EDGE CASES

### Data Boundaries
- Missing legacy launcher: configs must point to the existing `mk-code-index-launcher.cjs`.
- Already-correct config: `.claude/mcp.json` is verified but left unchanged.

### Error Scenarios
- Unrelated MCP server failure: record it without broadening scope into advisor fixes.
- Report/source drift: prefer current source evidence and record the drift in the implementation summary.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Runtime configs, runner evidence code, packet docs, and two review ledgers. |
| Risk | 16/25 | MCP startup identity and evidence runner behavior. |
| Research | 15/20 | Required commit and report adjudication. |
| Multi-Agent | 0/15 | SpawnAgent and nested CLI dispatch were forbidden. |
| Coordination | 10/15 | Dirty worktree and deferred packet accounting. |
| **Total** | **59/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Rename breaks a runtime config. | High | Low | Syntax checks plus OpenCode MCP smoke. |
| R-002 | Deep-review P2 fix grows beyond bounded scope. | Medium | Medium | Apply only small fixes; defer broad refactors. |
| R-003 | Dirty generated state enters commits. | Medium | Medium | Stage only scoped source/config/spec files. |

---

## 11. USER STORIES

### US-001: Runtime operator sees the renamed server (Priority: P0)

**As a** runtime operator, **I want** every client config to use `mk_code_index`, **so that** MCP server identity matches the renamed launcher.

**Acceptance Criteria**:
1. Given the four runtime configs, When they are searched, Then no `system_code_graph` or legacy launcher path remains.

---

### US-002: Maintainer can audit finding outcomes (Priority: P1)

**As a** maintainer, **I want** each review finding outcome recorded, **so that** follow-up work is explicit instead of implied.

**Acceptance Criteria**:
1. Given the implementation summary, When reviewing fixed/deferred tables, Then every P1 and P2 finding from the local reports has a fixed, accepted, or deferred status.

---

## 12. OPEN QUESTIONS

- None. The dispatch SHA mismatch and 048 count mismatch were resolved against local repository evidence.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
