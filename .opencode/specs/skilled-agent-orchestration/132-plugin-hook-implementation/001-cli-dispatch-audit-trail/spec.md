---
title: "Feature Specification: CLI Dispatch Audit Trail"
description: "The repo has no post-execution telemetry: completed opencode run / claude -p dispatches leave no durable record of what ran, which model, or how much output returned. This phase appends a redacted, size-rotated JSONL audit line after each completed dispatch over a shared runtime-neutral core."
trigger_phrases:
  - "cli dispatch audit"
  - "tool.execute.after"
  - "post-execution telemetry"
  - "dispatch audit log"
  - "opencode run audit"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/001-cli-dispatch-audit-trail"
    last_updated_at: "2026-07-11T14:17:40Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 planning docs from research sheet-001 (sub-item b only)"
    next_safe_action: "Implement dispatch-audit.mjs shared core, then the two runtime adapters"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-cli-dispatch-audit-trail"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: CLI Dispatch Audit Trail

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

This is the FOUNDATION phase of packet 132, built first. It is the repo's first live use of the OpenCode `tool.execute.after` plugin surface and the repo's first post-execution telemetry loop. After each completed `opencode run` / `claude -p` dispatch, a redacted, size-rotated JSONL audit line lands in `.opencode/logs/cli-dispatch-audit.log`, capturing timestamp, session/call IDs, dispatch shape, redacted+truncated command, model, and output size. The phase establishes the `tool.execute.after` adapter pattern that phases 002 (code-graph-freshness-guard) and 003 (post-edit-quality-router) reuse.

**Key Decisions**: Runtime-neutral `dispatch-audit.mjs` core plus two thin runtime adapters (OpenCode plugin + Claude PostToolUse hook); strictly fail-open, observe-only posture with an env kill-switch.

**Critical Dependencies**: None. This phase is greenfield and blocks nothing; it activates two entirely unused surfaces additively. Its only coupling is that its dispatch regexes must stay in sync with the before-side `dispatch-preflight-lint.mjs` twin.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-11 |
| **Branch** | `001-cli-dispatch-audit-trail` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | 000-plugin-hook-opportunities |
| **Successor** | 002-code-graph-freshness-guard |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repo has zero post-execution telemetry. When an agent shells `opencode run` or `claude -p`, nothing durable records what ran, which model answered, or how much output came back. There is no log a cost dashboard, usage report, or dispatch audit could ever read, and the OpenCode `tool.execute.after` surface that would make this cheap has never been used in live code.

### Purpose
As the foundation phase of packet 132, stand up the repo's first post-execution telemetry loop: append one redacted, size-rotated JSONL audit line after every completed CLI dispatch, over a shared core reused by both runtimes and by later phases.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A runtime-neutral `dispatch-audit.mjs` core that owns all matching, metadata extraction, redaction, JSONL formatting, and size-rotated append.
- An OpenCode `tool.execute.after` plugin adapter that observes completed Bash tool calls and records dispatches.
- A Claude `PostToolUse` hook adapter (matcher `Bash`) that records the same dispatches from the Claude stdin payload shape.
- Wiring: one new `.claude/settings.json` PostToolUse entry and one `plugins/README.md` row.
- Extracting the shared dispatch regexes into the core so the before-side lint twin imports them (no regex drift).
- A vitest spec covering match, build, append round-trip, and fail-open behavior.

### Out of Scope
- Sub-item (a) Spec-Kit Completion-State Exposer (`tool.register`) - authored separately as phase 007-speckit-completion-exposer.
- Any consumer of the log (cost dashboard, usage report, analytics) - the payoff stays latent until a later phase reads the log.
- Blocking, enforcement, or any change to dispatch behavior - this phase is observe-only.
- Daemon or MCP calls from either surface - the hot path stays a regex fast-exit plus a bounded append.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external/cli-opencode/scripts/lib/dispatch-audit.mjs` | Create | Runtime-neutral core: `matchDispatchShape`, `extractDispatchMeta`, `buildAuditLine`, `appendAuditLog`, and the exported dispatch-shape regexes. |
| `.opencode/plugins/mk-cli-dispatch-audit.js` | Create | OpenCode adapter: default-export-only plugin implementing `tool.execute.after`. |
| `.opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-audit-posttooluse.mjs` | Create | Claude adapter: PostToolUse(Bash) hook reading the stdin payload, exit 0 with no output. |
| `.opencode/skills/cli-external/cli-opencode/scripts/lib/dispatch-audit.test.mjs` | Create | Vitest spec: match/build/append round-trip plus fail-open assertions. |
| `.claude/settings.json` | Modify | Add a `{ matcher: "Bash" }` sibling to the existing PostToolUse Write\|Edit matcher. |
| `.opencode/plugins/README.md` | Modify | Add a §3 registry row for `mk-cli-dispatch-audit.js`. |
| `.opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs` | Modify | Import the shared dispatch-shape regexes from the core so before/after never desync. |
| `.opencode/logs/cli-dispatch-audit.log` | Create (runtime) | New rotated log file, written at runtime by the core (not authored by hand). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The shared core matches only real dispatch shapes and fast-exits everything else. | `matchDispatchShape('opencode run --model gpt-5.5 "x"')` returns `{ skill: 'cli-opencode' }`; `matchDispatchShape('git status')` returns `null`. |
| REQ-002 | The core is strictly fail-open: no match/parse/log-write error ever throws into the observed tool call. | `appendAuditLog` to an unwritable path returns without throwing; a malformed record degrades to a best-effort or skipped line, never an exception. |
| REQ-003 | Commands are redacted and length-bounded before they reach the log. | `buildAuditLine` truncates the command to a fixed cap and scrubs secret-shaped tokens; no raw multi-KB prompt body or env-injected secret appears in the JSONL. |
| REQ-004 | The log is size-rotated and cannot grow unbounded. | A write past the size cap triggers a copy to `.1` and truncates the primary log, mirroring `appendGuardLog` (`mk-dist-freshness-guard.js:80-96`). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The OpenCode plugin is default-export-only and never writes to stdout/stderr. | The plugin file has exactly one default export; no `console.*` calls; any test surface hangs on `Plugin.__test`. |
| REQ-006 | The Claude PostToolUse(Bash) hook records the same dispatches and exits 0 with no output. | Given a Bash PostToolUse payload for a dispatch, the hook appends one audit line and emits no `permissionDecision` and no stdout. |
| REQ-007 | The before-side lint twin imports the dispatch regexes from the shared core. | `dispatch-preflight-lint.mjs` no longer declares its own `DISPATCH_SKILLS` regexes; a grep shows a single source of truth. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A completed `opencode run` or `claude -p` dispatch produces exactly one parseable JSONL audit line in `.opencode/logs/cli-dispatch-audit.log` under both runtimes.
- **SC-002**: Non-dispatch Bash commands (for example `git status`) produce zero audit lines and add no measurable latency beyond a single regex test.
- **SC-003**: No audit-path failure (unwritable log, malformed record, oversized command) ever changes, delays, or errors the observed tool result.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Before-side twin `dispatch-preflight-lint.mjs` DISPATCH_SKILLS regexes | If the two copies desync, before/after disagree on what a dispatch is | Extract the regexes into the shared core and import them from the lint twin (REQ-007). |
| Risk | Secret or multi-KB prompt body leaking into the log | High: prompts carry env-injected secrets | `buildAuditLine` scrubs and truncates before writing; never log the raw command (REQ-003). |
| Risk | Log growth over long sessions | Medium: unbounded disk usage | Size-based copy+truncate rotation with a `.1` backup (REQ-004). |
| Risk | Plugin named-export mistake silently drops the whole file | Medium: telemetry silently stops | Default-export-only, verified by a grep and the `Plugin.__test` surface (REQ-005). |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The `tool.execute.after` hook runs on the hot path of every Bash tool call. Non-dispatch commands must cost no more than the two dispatch-shape regex tests before returning; no daemon, MCP, or network call is permitted.

### Security
- **NFR-S01**: The audit line must never contain unredacted secrets. The command field is scrubbed for secret-shaped tokens and truncated to a fixed byte cap before serialization.

### Reliability
- **NFR-R01**: The audit path is fail-open. Every error is swallowed inside a try/catch so the observed dispatch and its result are untouched. An env kill-switch disables the whole surface without code changes.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a Bash call with no `command` string fast-exits with no log line.
- Maximum length: a multi-KB command is truncated to the fixed cap and marked as truncated in the line.

### Error Scenarios
- External service failure: not applicable; the surface makes no external calls.
- Log write failure (unwritable path, full disk): the error is swallowed, no line is written, and the dispatch result is unaffected.
- Missing `output.metadata` (OpenCode) or `tool_response` (Claude): the line is written with the available fields and the missing metadata omitted.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 4 new + 3 edits, LOC: ~245, Systems: 2 runtimes over 1 shared core |
| Risk | 6/25 | Auth: N, API: N, Breaking: N; only redaction and fail-open are load-bearing |
| Research | 4/20 | Surfaces are greenfield but every piece has an exact in-repo exemplar |
| Multi-Agent | 2/15 | Workstreams: 1 |
| Coordination | 5/15 | Dependencies: 1 (regex sync with the before-twin) |
| **Total** | **25/100** | **Level 3 by architecture-decision weight, not raw size** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Secret or prompt body leaks into the JSONL log | H | M | Scrub + truncate in `buildAuditLine`; never log the raw command. |
| R-002 | Regex drift between the after-audit core and the before-lint twin | M | M | Single regex source in the core, imported by the lint twin. |
| R-003 | Named export silently drops the OpenCode plugin | M | L | Default-export-only; grep + `Plugin.__test` guard. |
| R-004 | Log grows unbounded across long sessions | M | M | Size-based copy+truncate rotation with a `.1` backup. |
| R-005 | Hot-path latency on every Bash call | L | L | Regex fast-exit first; no daemon/MCP/network calls. |

---

## 11. USER STORIES

### US-001: Durable dispatch record (Priority: P1)

**As a** framework maintainer, **I want** every completed `opencode run` / `claude -p` dispatch recorded as one JSONL line, **so that** a later cost or usage report has a real source to read.

**Acceptance Criteria**:
1. Given a completed `opencode run --model gpt-5.5 "..."`, When the tool call finishes, Then exactly one parseable JSONL line is appended with timestamp, session/call IDs, shape, model, and output size.

---

### US-002: Safe, redacted logging (Priority: P1)

**As a** security-conscious operator, **I want** the logged command scrubbed and truncated, **so that** prompt bodies and env-injected secrets never land on disk.

**Acceptance Criteria**:
1. Given a dispatch command containing a secret-shaped token and a multi-KB prompt, When the line is built, Then the command field is scrubbed and truncated to the fixed cap, and the raw body is absent.

---

### US-003: Zero interference (Priority: P0)

**As an** agent running dispatches, **I want** the audit path to never affect my tool result, **so that** telemetry can never break a dispatch.

**Acceptance Criteria**:
1. Given the log path is unwritable, When a dispatch completes, Then the write error is swallowed, no exception propagates, and the dispatch result is returned unchanged.

---

### US-004: Runtime parity (Priority: P1)

**As a** maintainer running both OpenCode and Claude, **I want** the same audit line under either runtime, **so that** the telemetry is complete regardless of where the dispatch ran.

**Acceptance Criteria**:
1. Given the same dispatch under OpenCode's `tool.execute.after` and Claude's PostToolUse(Bash) hook, When each fires, Then both produce an equivalent audit line through the same shared core, and the Claude hook emits no output.

---

## 12. OPEN QUESTIONS

- Should the audit line schema pin a `schema_version` field now so a future dashboard can migrate cleanly, or defer until the first consumer phase?
- Should the size-cap and rotation thresholds be env-tunable at launch, or hard-coded to the `mk-dist-freshness-guard` defaults until a real volume signal appears?
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
