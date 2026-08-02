---
title: "Feature Specification: Phase 1 - Deep research for Webflow MCP 2.0"
description: "Run two five-iteration deep-research lineages to map Webflow MCP 2.0 capabilities, authentication, constraints, safety boundaries, and mcp-tooling integration choices."
trigger_phrases:
  - "webflow mcp deep research"
  - "webflow mcp 2 features research"
  - "mcp-webflow phase 1"
  - "webflow mcp safety research"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/001-deep-research"
    last_updated_at: "2026-08-02T14:00:00Z"
    last_updated_by: "pi"
    recent_action: "Authored the exact two-lineage research contract"
    next_safe_action: "From a non-Pi conductor, run the command-owned dry-run before live research"
    blockers:
      - "A Pi conductor may not self-dispatch the required cli-pi lineage"
      - "The live command must prove cli-pi fan-out acceptance before writes"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the command entrypoint accept cli-pi through the JSON fan-out escape hatch?"
    answered_questions:
      - "Research depth is fixed at five iterations per model with no early convergence"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1 - Deep research for Webflow MCP 2.0

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 8 |
| **Predecessor** | None |
| **Successor** | `002-architecture-and-safety-contract` |
| **Handoff Criteria** | Ten productive iterations, complete workflow-owned state, cited synthesis, capability map, safety findings, and explicit architecture recommendations. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This read-only investigation gates every implementation phase. It creates research artifacts only inside this child and must not install tools, edit hub code, connect to a production site, or invoke Webflow mutations.

**Dependencies**:
- `/deep:research:auto` and its externalized state machine.
- `cli-pi` for `deepseek-v4-flash` with maximum thinking.
- `cli-opencode` for the low-latency GPT-5.6 Luna tier with maximum documented effort.
- A non-Pi conductor for the live mixed-executor run.
- Official Webflow documentation, starting with the supplied MCP 2.0 article.

**Deliverables**:
- Two lineage packets under `research/lineages/`.
- Exactly five completed iterations per lineage.
- `research/research.md`, resource map, convergence report, attribution, and orchestration summary.
- A recommendation for mode kind, backend, auth, permissions, safety gates, and `sk-design` pairing.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The phrase "Webflow MCP 2.0" does not by itself establish the real tool inventory, authentication flow, client support, permission boundary, rate limits, draft-versus-publish semantics, or safe repository integration. Guessing could register the wrong transport or expose high-impact Webflow operations without confirmation and rollback controls.

### Purpose
Produce a source-cited evidence base that Phase 2 can convert into an architecture and safety contract without repeating discovery or relying on marketing language.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Compare MCP 2.0 with the earlier Webflow MCP surface.
- Inventory official tools for sites, pages, components, CMS, assets, variables/styles, localization, custom code, and publishing where supported.
- Verify transport, endpoint, authentication, OAuth/scopes, account requirements, supported clients, and setup flow.
- Map pagination, rate limits, errors, retries, idempotency, concurrency, and session behavior.
- Classify read-only, draft-write, destructive, publish-capable, and deployment-capable operations.
- Investigate rollback, versioning, staging, confirmation, and non-production smoke-test options.
- Decide whether the mode is a workflow or transport and whether `sk-design` pairing is mandatory.
- Identify exact repository configuration and secret-handling requirements without storing credentials.

### Out of Scope
- Installing or registering the MCP server.
- Editing `.utcp_config.json`, `.env.example`, or hub files.
- Running mutating or publishing Webflow tools.
- Building the skill package.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/**` | Create | Workflow-owned config, state, lineages, iterations, logs, deltas, prompts, synthesis, and reports |
| `spec.md` | Bounded workflow update | Generated findings fence only, following the deep-research spec-check protocol |
| `implementation-summary.md` | Modify at phase close | Record evidence and handoff state after research completes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Invoke through `/deep:research:auto`, never a manual loop | Command-owned workflow creates the canonical packet and route-proof state |
| REQ-002 | Run DeepSeek v4 Flash with maximum thinking for five iterations | One `cli-pi` lineage records model `deepseek-v4-flash`, reasoning `max`, and five valid iterations |
| REQ-003 | Run GPT-5.6 Luna maximum-effort fast tier for five iterations | One `cli-opencode` lineage records model `openai/gpt-5.6-luna-fast`, reasoning `xhigh`, and five valid iterations |
| REQ-004 | Prevent early stopping | Stop policy is `max-iterations`, convergence mode is `off`, and both lineages reach five iterations |
| REQ-005 | Run the dry-run/preflight before live dispatch | The command proves mixed-executor config acceptance and emits no persistent research mutation during preview |
| REQ-006 | Keep research non-mutating toward Webflow | No Webflow create/update/delete/publish/deploy tool is called |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Triangulate load-bearing claims | Official sources lead; material claims carry URLs and contradictions are documented |
| REQ-008 | Produce actionable architecture recommendations | Synthesis explicitly recommends mode kind, backend, permissions, auth, confirmations, rollback, and design pairing |
| REQ-009 | Preserve negative knowledge | Failed searches, unsupported capabilities, ambiguities, and eliminated approaches appear in iterations and synthesis |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Ten valid iteration artifacts exist, five per named lineage.
- **SC-002**: Workflow state, deltas, logs, attribution, synthesis, and convergence evidence are internally consistent.
- **SC-003**: Every key research question is answered or explicitly marked unresolved with the source gap named.
- **SC-004**: Phase 2 can decide architecture and safety without another broad landscape pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Contract | Command docs lag runtime support for `cli-pi` | Live run may reject the requested executor | Dry-run from a non-Pi conductor; halt rather than hand-roll a substitute |
| Runtime | Current conductor is Pi | Pi self-dispatch is forbidden | Resume this child from OpenCode, Claude, or another non-Pi conductor |
| Source | Marketing and implementation docs may differ | Incorrect capability claims | Prefer official developer references and record contradictions |
| Safety | Webflow tools can mutate external content | Accidental production impact | Research uses web/docs only; no Webflow MCP mutation calls |
| Credential | Auth details may expose secrets | Secret leakage | Record variable names and setup patterns only; never values |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the live `/deep:research` parser accept `cli-pi` inside `--executors` despite stale presentation text?
- Which official Webflow operations are reversible, and which cross publish or deployment boundaries?
- Is there an official sandbox or disposable-site path for later live smoke?
<!-- /ANCHOR:questions -->

---

## Seed Sources
- [Webflow MCP 2.0 features](https://webflow.com/blog/mcp-2-features)
- Official Webflow developer, API, authentication, MCP, and changelog documentation discovered from the supplied article.
