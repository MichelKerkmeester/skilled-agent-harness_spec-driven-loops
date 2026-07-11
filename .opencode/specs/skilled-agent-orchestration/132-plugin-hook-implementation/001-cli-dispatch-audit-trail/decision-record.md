---
title: "Decision Record: CLI Dispatch Audit Trail"
description: "Architecture decisions for the CLI dispatch audit trail phase: the shared-core-plus-two-thin-adapters boundary and the observe-only fail-open posture with an env kill-switch."
trigger_phrases:
  - "cli dispatch audit decisions"
  - "shared core plus adapters"
  - "fail-open posture"
  - "tool.execute.after adr"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/001-cli-dispatch-audit-trail"
    last_updated_at: "2026-07-11T14:17:40Z"
    last_updated_by: "spec-author"
    recent_action: "Authored ADR-001 (core+adapters boundary) and ADR-002 (fail-open posture)"
    next_safe_action: "Implement per ADR-001 boundary; hold fail-open invariant from ADR-002"
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
# Decision Record: CLI Dispatch Audit Trail

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Runtime-neutral core plus two thin adapters

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-11 |
| **Deciders** | spec-author (packet 132) |

---

<!-- ANCHOR:adr-001-context -->
### Context

Two runtimes must record the same audit line from different transport shapes. OpenCode delivers a completed Bash call to `tool.execute.after(input, output)` with `input.args.command` and `output.metadata`. Claude delivers a PostToolUse payload on stdin with `tool_input.command` and `tool_response`. The tool name arrives lowercase `bash` under OpenCode and `Bash` under Claude. If each runtime owns its own parsing, redaction, and JSONL format, the two will drift and the log stops being one consistent stream.

### Constraints

- The dispatch-shape regexes already exist in the before-side lint twin at `dispatch-preflight-lint.mjs:20-23` and must not be duplicated.
- OpenCode plugins load as ESM `.js`; the shared core must be importable as ESM, so it ships as `.mjs` next to `dispatch-rule-checks.mjs`.
- The repo already proves this shape with `dispatch-guard.cjs` behind `mk-deep-loop-guard.js:52` and `task-dispatch-guard.cjs:14`.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Put all matching, metadata extraction, redaction, JSONL formatting, and rotated append in one runtime-neutral `dispatch-audit.mjs` core, and keep each adapter to pure transport mapping.

**How it works**: The core exports `matchDispatchShape`, `extractDispatchMeta`, `buildAuditLine`, and `appendAuditLog`, plus the two dispatch regexes. The OpenCode plugin and the Claude hook each normalize their tool name, read their command and metadata fields, and hand a plain record to the core. The before-lint twin imports the same regexes, so before and after can never disagree on what a dispatch is.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared core plus two thin adapters** | One redaction path, one schema, zero drift, matches an in-repo exemplar | One extra file boundary | 9/10 |
| Inline logic in each adapter | Fewer files | Duplicate redaction and format, guaranteed drift, two places to audit | 3/10 |
| One adapter now, second runtime later | Ships faster | Leaves Claude parity undone and re-opens the schema question later | 4/10 |

**Why this one**: The two-runtime requirement makes a single source of truth for redaction and schema mandatory, and the repo already runs this exact pattern for dispatch-guard.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Redaction and the JSONL schema live in one place, so both runtimes emit identical lines.
- Phases 002 and 003 inherit a proven `tool.execute.after` adapter contract instead of inventing their own.

**What it costs**:
- One additional module boundary. Mitigation: the core is small and every function has a single responsibility.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Regex copies drift between the audit core and the lint twin | M | The lint twin imports the core regexes; a grep proves a single declaration. |
| A named export breaks the OpenCode plugin load | M | Default-export-only, with the test surface hung on `Plugin.__test`. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two runtimes must emit one consistent line; without a shared core they drift. |
| 2 | **Beyond Local Maxima?** | PASS | Inline-per-adapter and single-runtime options were weighed and scored lower. |
| 3 | **Sufficient?** | PASS | Four core functions plus two adapters cover the whole flow with no extra layers. |
| 4 | **Fits Goal?** | PASS | This is the foundation phase; the boundary is the pattern 002 and 003 reuse. |
| 5 | **Open Horizons?** | PASS | A future consumer reads one stable schema regardless of runtime. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- New `dispatch-audit.mjs` core with the shared regexes and the four functions.
- New OpenCode plugin `mk-cli-dispatch-audit.js` and new Claude hook `dispatch-audit-posttooluse.mjs`, each a thin adapter.
- `dispatch-preflight-lint.mjs` switches from a local regex declaration to importing the core.

**How to roll back**: Delete `mk-cli-dispatch-audit.js`, remove the `.claude/settings.json` PostToolUse Bash entry, and revert the `dispatch-preflight-lint.mjs` import back to its local `DISPATCH_SKILLS` block. The core and log file go inert once no adapter calls them.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Observe-only, fail-open posture with an env kill-switch

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-11 |
| **Deciders** | spec-author (packet 132) |

---

<!-- ANCHOR:adr-002-context -->
### Context

The OpenCode `tool.execute.after` hook runs on the hot path of every Bash tool call, and both hooks fire after execution completes. A telemetry surface that throws, blocks, or writes to stdout could corrupt the TUI, add latency, or break a dispatch result. The sibling PreToolUse lint emits a `permissionDecision`, which would be wrong for a post-execution audit.

### Constraints

- No stdout or stderr from the OpenCode plugin, ever, because it corrupts the TUI.
- The Claude PostToolUse hook must exit 0 with no output and no `permissionDecision`.
- No daemon, MCP, or network call is allowed on the Bash hot path.
- Dispatch commands carry multi-KB prompt bodies and possibly env-injected secrets.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Make the surface strictly observe-only and fail-open, wrap every audit action in try/catch, and gate the whole surface behind an env kill-switch.

**How it works**: Each adapter fast-exits on a non-Bash tool or a non-dispatch command. On a match it calls the core inside try/catch and swallows any match, parse, or write error. `buildAuditLine` scrubs secret-shaped tokens and truncates the command before serialization. The kill-switch env var short-circuits the whole path so an operator can disable telemetry without a code change.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Observe-only, fail-open, env kill-switch** | Telemetry can never break or slow a dispatch; operator can disable instantly | A dropped line is silent | 9/10 |
| Fail-closed on write error | Loud failures surface bugs fast | A telemetry bug would break real dispatches | 2/10 |
| Log the raw command untruncated | Richest record | Leaks secrets and multi-KB bodies to disk | 1/10 |

**Why this one**: A post-execution audit has no business affecting a dispatch, and the redaction plus kill-switch keep the surface safe by construction.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A telemetry defect can never change, delay, or error a dispatch result.
- Secrets and prompt bodies stay off disk because redaction runs before every write.

**What it costs**:
- Silent line loss is possible on error. Mitigation: rotation and the vitest fail-open case keep the failure mode understood and bounded.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A secret slips past the scrubber | H | Adversarial redaction tests for secret-shaped tokens, embedded newlines, and oversized commands. |
| The log grows unbounded | M | Size-based copy+truncate rotation with a `.1` backup, per `mk-dist-freshness-guard.js:80-96`. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The hot path and secret exposure make fail-open and redaction non-optional. |
| 2 | **Beyond Local Maxima?** | PASS | Fail-closed and raw-logging options were weighed and scored lower. |
| 3 | **Sufficient?** | PASS | try/catch, redaction, rotation, and a kill-switch cover every known failure mode. |
| 4 | **Fits Goal?** | PASS | A telemetry loop that cannot harm dispatches is the whole point of the phase. |
| 5 | **Open Horizons?** | PASS | The kill-switch and stable schema keep future tuning cheap and reversible. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Both adapters wrap the core call in try/catch and read the env kill-switch first.
- `buildAuditLine` scrubs and truncates; `appendAuditLog` rotates by size.
- The Claude hook exits 0 with no output and no `permissionDecision`.

**How to roll back**: Set the kill-switch env var to disable the surface immediately, then remove the adapters and the `.claude/settings.json` entry if a full revert is needed. Delete the log and its `.1` backup, since they hold no downstream state.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
