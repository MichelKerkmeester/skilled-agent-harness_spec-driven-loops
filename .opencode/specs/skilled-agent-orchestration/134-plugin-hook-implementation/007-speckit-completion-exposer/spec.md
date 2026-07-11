---
title: "Feature Specification: Spec-Kit Completion-State Exposer (tool.register)"
description: "The COMPLETION VERIFICATION gate needs multiple hand-composed Bash calls to read a spec folder's level, checklist status, and placeholder completeness. This phase merges those signals into one read-only OpenCode tool over a shared completion-state core, with a Claude-parity CLI shim."
trigger_phrases:
  - "completion state exposer"
  - "speckit completion tool"
  - "tool.register"
  - "check-completion json"
  - "placeholder completeness"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-plugin-hook-implementation/007-speckit-completion-exposer"
    last_updated_at: "2026-07-11T06:21:17.973Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 spec for the completion-state exposer"
    next_safe_action: "Author plan.md architecture and the affected-surfaces table from the brief"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs"
      - ".opencode/plugins/mk-speckit-completion.js"
      - ".opencode/bin/speckit-completion.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-speckit-completion-exposer"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Ship the optional CLI shim in this phase, or defer it until a Claude-side consumer needs it?"
    answered_questions: []
---
# Feature Specification: Spec-Kit Completion-State Exposer (tool.register)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

<!-- WHEN TO USE THIS TEMPLATE:
Level 3 (+Arch) is appropriate when:
- Changes affect 500+ lines of code
- Architecture decisions need formal documentation (ADRs)
- Executive summary needed for stakeholders
- Risk matrix required
- 4-8 user stories
- Multiple teams or cross-functional work

DO NOT use Level 3 if:
- Simple feature (use Level 1)
- Only verification needed (use Level 2)
- Governance approval workflow required (use Level 3+)
- Compliance checkpoints needed (use Level 3+)
- Multi-agent parallel execution coordination (use Level 3+)
-->

---

## EXECUTIVE SUMMARY

This phase activates the OpenCode `tool.register` surface for the first time with a read-only tool, `mk_speckit_completion`, that returns a spec folder's inferred level, checklist P0/P1/P2 completion plus evidence gaps, and placeholder completeness percentage merged into one structured payload. The tool wraps a new runtime-neutral `completion-state.cjs` core so the COMPLETION VERIFICATION gate stops hand-composing multiple Bash calls. Claude parity is the two underlying scripts already being Bash-runnable, optionally fronted by a thin CLI shim over the same core.

**Key Decisions**: Runtime-neutral core plus thin adapters (one OpenCode plugin, one optional Claude CLI shim); read-only advisory posture that degrades to an `unavailable` section instead of throwing.

**Critical Dependencies**: The two existing shell scripts `check-completion.sh` and `calculate-completeness.sh`. No new external dependency. This phase is scheduled after phase 001 (the higher-value CLI Dispatch Audit Trail slice) but shares no code with it.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-07-11 |
| **Branch** | `scaffold/007-speckit-completion-exposer` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-spec-mutation-gate |
| **Successor** | None |
| **Build Order** | Scheduled after 001-cli-dispatch-audit-trail (the higher-value slice); no code coupling to it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
At the COMPLETION VERIFICATION gate an agent must run `check-completion.sh --json` and `calculate-completeness.sh --json` separately, then hand-merge their JSON to reason about whether a spec folder is done. The OpenCode `tool.register` surface exists in the plugin API but has zero live use in this repo, so there is no first-class queryable way to get level, checklist priorities, evidence gaps, and placeholder completeness in one call. This is a convenience gap, not a correctness gap, since the scripts are already runnable.

### Purpose
Give the agent one read-only tool call that returns a spec folder's level, P0/P1/P2 checklist completion with evidence gaps, and placeholder completeness percentage as a single structured payload, backed by a shared core that never throws.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A runtime-neutral core `completion-state.cjs` exposing `computeCompletionState({specFolder, projectDir, strict})` that resolves the folder, infers level from canonical-doc presence, shells both scripts, and merges their JSON into one payload.
- An OpenCode plugin `mk-speckit-completion.js` that registers `mk_speckit_completion` via `tool.register` (first live use of the surface).
- An optional thin Claude CLI shim `speckit-completion.cjs` over the same core for Bash-invoked parity.
- A vitest spec covering the core's parse path and its fail-open behavior.
- A `plugins/README.md` section 3 row documenting the new plugin.

### Out of Scope
- Sub-item (b) CLI Dispatch Audit Trail (`tool.execute.after`) - that is a separate phase (001), never authored here.
- Any enforcement, blocking, or write behavior - the tool is strictly read-only and cannot affect a session.
- Any `.claude/settings.json` hook wiring - Claude has no plugin tool-register surface, so parity is scripts plus the optional CLI shim, with no settings.json entry.
- Daemon or MCP calls of any kind - the core shells the two scripts only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs` | Create | Runtime-neutral core `computeCompletionState`; level inference, bounded `execFileSync` of both scripts, exit-1 catch, fail-open merge |
| `.opencode/plugins/mk-speckit-completion.js` | Create | Default-export-only OpenCode plugin; registers `mk_speckit_completion` via `tool.register`; no event/before/after hooks |
| `.opencode/bin/speckit-completion.cjs` | Create | Optional thin CLI shim over the same core for Claude/Bash parity; prints merged JSON to stdout |
| `.opencode/skills/system-spec-kit/scripts/lib/completion-state.test.mjs` | Create | Vitest spec: real Level-2 packet parse assertions plus nonexistent-folder fail-open assertion (exact location confirmed at implementation) |
| `.opencode/plugins/README.md` | Modify | Add a section 3 entrypoint row for `mk-speckit-completion.js` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `computeCompletionState` returns one merged payload `{specFolder, level, filesPresent, checklist, placeholders, generatedAt}` | Unit test against a real Level-2 packet asserts every top-level key is present |
| REQ-002 | The core catches the non-zero exit of `check-completion.sh` (exit 1 = incomplete) and parses `err.stdout` for its JSON | Run against a known-incomplete packet: `result.checklist.status` reflects the real status, never `unavailable` |
| REQ-003 | The core never throws; any script or parse failure sets that section to `{status:'unavailable', error}` | Pass a nonexistent folder: returns an object with `checklist.status === 'unavailable'` and raises no exception |
| REQ-004 | `mk-speckit-completion.js` is default-export-only and registers `mk_speckit_completion` via `tool.register` with no event/before/after hooks | `grep` shows a single `export default` and zero named exports; the file loads without being dropped by the auto-loader |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The optional CLI shim `speckit-completion.cjs` fronts the same core for Claude/Bash parity | `node .opencode/bin/speckit-completion.cjs <folder>` prints one parseable JSON object identical in shape to the tool result |
| REQ-006 | Level inference from canonical-doc presence (checklist to at least 2, decision-record to at least 3) | A decision-record packet reports `level: 3`; a checklist-only packet reports `level: 2` |
| REQ-007 | The plugin emits no stdout or stderr; the tool RETURN value is the only output channel | `grep` shows no `console.*` in the plugin; README section 3 row present |
| REQ-008 | `execFileSync` is bounded (`timeout: 5000`, `maxBuffer`, `cwd: projectDir`) and no daemon or MCP is called | Code review confirms bounds; a slow script is capped by the timeout rather than hanging the tool |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A single `mk_speckit_completion` call returns level, P0/P1/P2 completion with evidence gaps, and placeholder completeness, replacing the multi-Bash hand-merge at the COMPLETION VERIFICATION gate.
- **SC-002**: Zero regressions to existing execution paths; the only runtime change is the plugin auto-loader picking up one new file.
- **SC-003**: No packet state (missing, incomplete, or error) causes a thrown exception or any TUI corruption; the worst case is an `unavailable` section.
- **SC-004**: The first test passes: a real Level-2 packet returns a present `checklist.status` and `placeholders.overall_completion`, and a nonexistent folder returns `checklist.status === 'unavailable'` without throwing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `check-completion.sh` and `calculate-completeness.sh` | If either script changes its JSON shape or exit codes, the core parses stale fields | Pin the parsed field names in the core; the vitest spec asserts the merged shape against a real packet |
| Risk | A named export slips into the plugin file | High: the auto-loader drops the whole file and the tool never registers | Default-export-only rule; test surface on `Plugin.__test`; smoke-test the load |
| Risk | The core forgets the `check-completion.sh` exit-1 catch | Medium: every incomplete packet silently reports `unavailable` | REQ-002 test runs against a known-incomplete packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each shelled script is bounded by a 5000ms `execFileSync` timeout; the tool never cold-starts a daemon and does no network I/O, so a call completes within the two scripts' bounded budget.

### Security
- **NFR-S01**: Read-only surface. It reads the resolved spec folder and runs the two repo-owned scripts only. It logs nothing, so no command redaction or secret scrubbing is required, and it exposes no write path.

### Reliability
- **NFR-R01**: The core never throws. Any resolution, exec, or parse failure degrades the affected section to `{status:'unavailable', error}` while other sections still populate.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: no `specFolder` argument resolves against `projectDir`; an unresolvable folder yields `unavailable` sections rather than an exception.
- Maximum length: a very large packet output is capped by `maxBuffer`; on overflow the affected section is set to `unavailable` with the error captured.

### Error Scenarios
- `check-completion.sh` non-zero exit: exit 1 (incomplete) still emits JSON on stdout first, so the core catches the throw and parses `err.stdout`.
- Malformed JSON from either script: the affected section becomes `unavailable`; the other section is unaffected.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 6/25 | Files: 5 (4 create, 1 modify), LOC: ~200, Systems: 1 (spec-kit scripts) |
| Risk | 4/25 | Auth: N, API: N, Breaking: N (additive read-only) |
| Research | 3/20 | Every piece has an in-repo exemplar to copy |
| Multi-Agent | 2/15 | Single workstream |
| Coordination | 3/15 | Scheduled after phase 001; no code dependency |
| **Total** | **18/100** | **Level 3 doc depth inherited from the phased-packet governance standard, not raw complexity** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A named export is added to the plugin file, so OpenCode loads it as a plugin, throws, and silently drops the whole file | H | M | Default-export-only; hang test surface on `Plugin.__test`; smoke-test load from root and symlinked workspace |
| R-002 | The core omits the `check-completion.sh` exit-1 try/catch, so incomplete packets report `unavailable` | M | M | REQ-002 vitest against a known-incomplete packet asserts a real status |
| R-003 | The plugin writes to stdout or stderr and corrupts the OpenCode TUI | M | L | No `console.*`; the tool RETURN value is the only channel; grep gate in verification |
| R-004 | An unbounded or slow script call hangs the tool | L | L | Bounded `execFileSync` (timeout, maxBuffer); read-only tool sits on no hot loop |

---

## 11. USER STORIES

### US-001: One-call completion snapshot (Priority: P0)

**As an** AI agent at the COMPLETION VERIFICATION gate, **I want** one tool call that returns a spec folder's level, P0/P1/P2 completion, evidence gaps, and placeholder percentage, **so that** I stop hand-composing and merging multiple Bash calls.

**Acceptance Criteria**:
1. Given a resolved spec folder, When I call `mk_speckit_completion({specFolder})`, Then I get `{specFolder, level, filesPresent, checklist, placeholders, generatedAt}` in one payload.

---

### US-002: Claude-side parity via CLI shim (Priority: P1)

**As a** Claude-runtime agent with no plugin tool-register surface, **I want** a thin CLI shim over the same core, **so that** I get the identical merged payload through a Bash invocation.

**Acceptance Criteria**:
1. Given the shim exists, When I run `node .opencode/bin/speckit-completion.cjs <folder>`, Then it prints one parseable JSON object matching the tool result shape.

---

### US-003: Fail-safe degradation (Priority: P1)

**As a** maintainer, **I want** the tool to never throw or corrupt the TUI, **so that** a broken or incomplete packet degrades to an `unavailable` section instead of crashing the session.

**Acceptance Criteria**:
1. Given a nonexistent or malformed spec folder, When the tool runs, Then the affected section reports `status: 'unavailable'` with the error captured and no exception propagates.

---

## 12. OPEN QUESTIONS

- Ship the optional CLI shim in this phase, or defer it until a Claude-side consumer actually calls it? Current lean: ship it, since it is roughly 30 LOC and delivers full Claude parity.
- Confirm the exact vitest location convention for a `.cjs` core (co-located `.test.mjs` next to the core versus under `scripts/tests/`); resolve at implementation.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
</content>
</invoke>
