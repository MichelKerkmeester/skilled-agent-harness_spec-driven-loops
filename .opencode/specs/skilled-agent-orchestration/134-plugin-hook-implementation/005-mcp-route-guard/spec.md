---
title: "Feature Specification: External MCP Route Guard"
description: "Agents sometimes call an external MCP tool natively instead of through Code Mode call_tool_chain, losing the ~98% context reduction the mcp-code-mode SKILL already mandates. This phase adds a warn-first, never-block advisory that nudges native calls toward Code Mode for the families Code Mode can actually route."
trigger_phrases:
  - "mcp route guard"
  - "code mode routing nudge"
  - "native mcp advisory"
  - "call_tool_chain warning"
  - "external mcp warn-only"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-plugin-hook-implementation/005-mcp-route-guard"
    last_updated_at: "2026-07-11T06:21:17.709Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 spec for the external MCP route guard from the research brief"
    next_safe_action: "Review the manifest-strict vs broad-advisory fork, then plan the shared core in plan.md"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs"
      - ".opencode/plugins/mk-mcp-route-guard.js"
      - ".opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs"
      - ".claude/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-mcp-route-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Manifest-strict (actionable-only) vs broad advisory (env-gated, nudges manifest registration): which posture ships first?"
    answered_questions: []
---
# Feature Specification: External MCP Route Guard

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

The External MCP Route Guard is a warn-first, never-block advisory. When an agent calls an external MCP tool natively (for example a `claude_ai_ClickUp` connector tool) instead of routing it through Code Mode `call_tool_chain`, the guard surfaces a just-in-time nudge to route through Code Mode. It warns only for families Code Mode can actually route (those present in `.utcp_config.json`), so the advice is always actionable. This is a net-new advisory layer that changes no existing runtime behavior.

**Key Decisions**: Runtime-neutral policy core plus two thin runtime adapters (OpenCode + Claude); advisory-only, fail-open posture with no reject path.

**Critical Dependencies**: `.utcp_config.json` manual manifest (source of the routable family set); the shared warn-only/log-only plugin precedent (`mk-dist-freshness-guard`) and the Claude `PreToolUse` hook precedent (`task-dispatch-guard.cjs`).

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-07-11 |
| **Branch** | `134-plugin-hook-implementation/005-mcp-route-guard` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 of 7 |
| **Predecessor** | 004-completion-evidence-sentinel |
| **Successor** | 006-spec-mutation-gate |
| **Corroboration** | both-models |
| **Verdict** | near-term (clean, cheap, low-risk; value scales with manifest coverage) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mcp-code-mode` SKILL declares Code Mode MANDATORY for all external MCP tool calls (`SKILL.md:18`) because routing through `call_tool_chain` gives roughly a 98% context reduction versus loading a native MCP server's full tool surface. Nothing at runtime reminds the agent when it drifts: a native `mcp__claude_ai_ClickUp__*` call succeeds silently while paying the full-context cost, and the mandate stays documentation-level only.

### Purpose
Surface a just-in-time, actionable advisory that nudges a native external MCP call toward Code Mode, without ever blocking or changing the call, and only for families Code Mode can actually route.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A runtime-neutral policy core `evaluateNativeMcpCall({ toolName, projectDir, env })` returning `{ decision:'allow'|'warn', detail, warnings, audits }` with name parsing, manifest-derived normalization, internal-server exemption, and mtime-cached family-set loading.
- An OpenCode `tool.execute.before` adapter (default-export-only plugin) that is warn-only and log-only, mirroring `mk-dist-freshness-guard`.
- A Claude `PreToolUse` hook plus a new `mcp__claude_ai_.*` matcher block in `.claude/settings.json` that emits `additionalContext` advisories and never `permissionDecision: deny`.
- A table-driven first test for `evaluateNativeMcpCall` plus a Claude-hook integration test.

### Out of Scope
- Any block, deny, or throw path - the guard is warn-only by contract, so enforcement is deliberately excluded.
- Baking connector-specific matchers into `.claude/settings.json` from the manifest - Claude connector server names (`claude_ai_ClickUp`) are account-scoped and not derivable from `.utcp_config.json`.
- Registering new external MCP servers or expanding manifest coverage - that is an operator/config decision, tracked as an open question, not this phase's deliverable.
- Any daemon interaction or cold-start work - the guard uses pure synchronous file reads only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs` | Create | Runtime-neutral policy core exporting `evaluateNativeMcpCall`. Parses the MCP tool name, normalizes the server token, exempts internal servers, loads the manifest family set cached by mtime, returns `allow` or `warn`. Never writes stdout/stderr or the log. |
| `.opencode/plugins/mk-mcp-route-guard.js` | Create | OpenCode `tool.execute.before` adapter, default-export-only. Calls the core with `input.tool`, appends warnings to a bounded rotated log, never throws, fails open. Dormant until an external MCP server is added to `opencode.json`. |
| `.opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs` | Create | Claude `PreToolUse` hook. Reads stdin JSON, calls the core, emits `hookSpecificOutput.additionalContext` on warn, exits 0 silently otherwise, and fails open to approve on any error. |
| `.claude/settings.json` | Modify | Add a third `PreToolUse` matcher block (`mcp__claude_ai_.*`, timeout 5) alongside the existing `Bash` and `Task` blocks. |
| `.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.test.cjs` | Create | Table-driven unit test for `evaluateNativeMcpCall` plus a Claude-hook integration test that pipes a `PreToolUse` payload and asserts `additionalContext`, exit 0, and no `permissionDecision`. |
| `.opencode/plugins/README.md` | Modify | Document `mk-mcp-route-guard.js` in the CURRENT ENTRYPOINTS table as a warn-only/log-only analog of `mk-dist-freshness-guard`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Warn-only contract: the core exposes only `allow` and `warn` decisions with no reject, deny, or throw path anywhere in the decision flow. | `rg -n "reject\|deny" mcp-route-guard.cjs` returns no decision-path match; a unit test asserts every returned `decision` is in `{allow, warn}`. |
| REQ-002 | Fail-open on every error: missing, unreadable, or oversized manifest, malformed payload, and timeout all resolve to `allow` (adapters approve). | Unit tests with an unreadable manifest and a malformed tool name both return `allow`; the Claude hook exits 0 with no `permissionDecision` on a thrown internal error. |
| REQ-003 | Name normalization bridges manifest and connector spellings: lowercase, strip `claude_ai_` prefix, strip `_official` / `_\d+` suffix, unify separators, so `clickup_official` and `claude_ai_ClickUp` both map to `clickup`. | Table test: `mcp__claude_ai_ClickUp__clickup_create_task` with manifest `{clickup_official}` returns `warn` carrying the manifest manual name. |
| REQ-004 | Internal servers are exempt: `code_mode`, `sequential_thinking`, `mk-spec-memory`, `mk_skill_advisor`, `mk_code_index`, and any `mk_` / `mk-` prefix resolve to `allow`. | Table tests: `mcp__code_mode__call_tool_chain` and `mcp__mk_code_index__code_graph_query` both return `allow`; no log line is written. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | OpenCode adapter: default-export-only plugin on `tool.execute.before` that is warn-only and log-only (bounded rotated `.opencode/logs/mcp-route-guard.log`), never writes stdout/stderr, never throws, fails open, and caches the family set by manifest mtime. | Plugin loads under the OpenCode loader; a warn appends one log line; an induced core error does not throw or block the call. |
| REQ-006 | Claude adapter: a new `PreToolUse` hook plus a new `mcp__claude_ai_.*` matcher block (timeout 5) in `.claude/settings.json` that emits `additionalContext` and never `permissionDecision`. | Integration test pipes a ClickUp `PreToolUse` JSON to the hook and asserts stdout carries an `additionalContext` advisory, exit 0, and no `permissionDecision`. |
| REQ-007 | Manifest-derived family set: loaded from `.utcp_config.json` `manual_call_templates[].name`, normalized identically, read once (single `JSON.parse`), size-capped, and cached by file mtime. | Adding a manual name to the manifest and touching its mtime expands the warn-set with no code change; a static read confirms one `JSON.parse` and a read-size cap. |
| REQ-008 | First test present and green: the table-driven `evaluateNativeMcpCall` suite (warn / manifest-strict allow / internal exempt / non-MCP) plus the Claude-hook integration test. | The test file exists at the named path and passes locally. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A native ClickUp connector call surfaces a Code Mode routing advisory (`warn`) while the call itself proceeds unblocked.
- **SC-002**: Zero false advisories on internal servers (`code_mode`, `sequential_thinking`, `mk_*`) and on non-MCP tools (`Bash`, `Read`).
- **SC-003**: The guard fails open on all error paths, so no correctly-routed or unrelated call is ever impeded.
- **SC-004**: Adding a manifest manual name expands the warn-set with no code change, so value scales automatically as manifest coverage grows.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.utcp_config.json` manual manifest | If absent or unreadable, the family set is empty and the guard stays silent | Fail-open by design; the empty-manifest path returns `allow` and is covered by a test |
| Dependency | Claude `PreToolUse` hook contract (`additionalContext`) | If the payload shape changes, advisories stop surfacing | Mirror the proven `task-dispatch-guard.cjs` shape; fail open on any parse error |
| Risk | Name normalization gap (manifest `clickup_official` vs connector `claude_ai_ClickUp`) | High: guard silently never fires | Table tests pin the official/`claude_ai_` mapping to the same token |
| Risk | OpenCode adapter wired to a throw path instead of warn-only | High: could block a working call | Mirror `mk-dist-freshness-guard` exactly; never throw; default-export-only; test the fail-open path |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The Claude hook completes well within the 5s `PreToolUse` timeout using pure synchronous file reads, no heavy `require`s, and no daemon or cold-start. The narrow `mcp__claude_ai_.*` matcher keeps fire count low and excludes internal servers entirely.

### Security
- **NFR-S01**: The guard reads no secrets. The manifest is read once with a size cap and a single `JSON.parse`; only `manual_call_templates[].name` values are used.

### Reliability
- **NFR-R01**: Fail-open on every error path (missing/unreadable/oversized manifest, malformed payload, timeout). A guard bug never blocks a call. The hard mandate remains documentation-level in `SKILL.md`, not runtime enforcement.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: an empty or non-MCP `toolName` (for example `Bash`, `Read`) returns `allow` immediately.
- Maximum length: a malformed or unparseable MCP tool name that does not match `mcp__<server>__<tool>` or `<server>_<tool>` returns `allow`; the manifest read is size-capped to bound worst-case work.

### Error Scenarios
- External service failure: a missing, unreadable, or oversized `.utcp_config.json` yields an empty family set and `allow` (silent), never an error.
- Network timeout: if the Claude hook exceeds the 5s timeout, Claude terminates it and the call proceeds (fail-open equals approve).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 4 new + 2 edits, LOC: ~200, Systems: 2 runtimes |
| Risk | 5/25 | Auth: N, API: N, Breaking: N (warn-only, fail-open, additive) |
| Research | 8/20 | Manifest/connector name normalization and the manifest-strict vs broad fork |
| Multi-Agent | 3/15 | Workstreams: 1 |
| Coordination | 6/15 | Dependencies: manifest, two adapter surfaces, optional generator wiring |
| **Total** | **30/100** | **Authored at Level 3 for planning-doc parity across the 134 packet; the change itself is small (effort S).** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Name normalization gap: manifest `clickup_official` and connector `claude_ai_ClickUp` fail to map to `clickup`, so the guard never fires | H | M | Table tests pin the mapping; normalization is the first-test invariant |
| R-002 | Manifest coverage gap caps live value to ~one family (ClickUp); Webflow/Notion/Gmail/Calendar/Drive connectors are absent from the manifest | M | H | Document the ceiling honestly; route the manifest-strict vs broad fork to the operator |
| R-003 | Per-call subprocess cost: Claude spawns a fresh node process per matched MCP call | L | M | Narrow `mcp__claude_ai_.*` matcher, no heavy requires, honor 5s timeout, fail open |
| R-004 | Redundancy: `SKILL.md` already mandates Code Mode, so the guard is a reminder, not new policy | L | M | Position as a just-in-time reminder; keep effort S so cost matches marginal value |
| R-005 | OpenCode adapter miswired to the `mk-deep-loop-guard` throw path | H | L | Mirror `mk-dist-freshness-guard`; never throw; test the fail-open path |

---

## 11. USER STORIES

### US-001: Nudge a native ClickUp call toward Code Mode (Priority: P1)

**As an** agent operator, **I want** a just-in-time advisory when a ClickUp tool is called natively, **so that** I route it through Code Mode and recover the context savings.

**Acceptance Criteria**:
1. **Given** the manifest contains `clickup_official`, **When** `mcp__claude_ai_ClickUp__clickup_create_task` is called natively, **Then** the guard returns `warn` with the manifest manual name and the call still proceeds.

---

### US-002: Stay silent on tools Code Mode cannot route (Priority: P1)

**As an** agent operator, **I want** no advisory for connectors absent from the manifest, **so that** every warning I see is actionable.

**Acceptance Criteria**:
1. **Given** the manifest lacks a `webflow` family, **When** `mcp__claude_ai_Webflow__data_cms_tool` is called natively, **Then** the guard returns `allow` and emits nothing.

---

### US-003: Never block a call (Priority: P0)

**As an** agent operator, **I want** the guard to advise but never enforce, **so that** a guard bug can never impede a correctly-routed or unrelated call.

**Acceptance Criteria**:
1. **Given** an internal server or a malformed payload, **When** the guard evaluates the call, **Then** it returns `allow`, emits no `permissionDecision`, and exits 0.

---

### US-004: Scale coverage without a code change (Priority: P1)

**As a** maintainer, **I want** the warn-set derived from the manifest, **so that** registering a new manual expands coverage automatically.

**Acceptance Criteria**:
1. **Given** a new manual name is added to `.utcp_config.json`, **When** its mtime changes, **Then** the guard warns on that family on the next call with no code edit.

---

## 12. OPEN QUESTIONS

- Manifest-strict (Option A, actionable-only, recommended) vs broad advisory (Option B, env-gated default-off, nudges manifest registration): which posture ships first? This fork sets the value ceiling and is captured as ADR-002 with an alternative.
- Should `scripts/install.sh` / `update.sh` / `doctor.sh` be extended to emit and verify the stable `mcp__claude_ai_.*` matcher block, or is a one-time manual `.claude/settings.json` edit sufficient for this phase?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
