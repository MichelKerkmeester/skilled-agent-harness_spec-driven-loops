---
title: "Implementation Plan: External MCP Route Guard"
description: "Implements a warn-first MCP route guard as a runtime-neutral policy core plus two thin runtime adapters (OpenCode tool.execute.before plugin and a Claude PreToolUse hook), reusing the repo's shared-core-plus-two-adapters template."
trigger_phrases:
  - "mcp route guard plan"
  - "runtime-neutral guard core"
  - "code mode adapter plan"
  - "warn-only plugin architecture"
  - "utcp manifest family set"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/005-mcp-route-guard"
    last_updated_at: "2026-07-11T14:17:40Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 plan mapping the shared core, both adapters, and the critical path"
    next_safe_action: "Confirm the manifest-strict posture, then break the core into T-tasks in tasks.md"
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
      - "Manifest-strict vs broad advisory posture (ADR-002) decides the default warn behavior for unrouteable external servers"
    answered_questions: []
---
# Implementation Plan: External MCP Route Guard

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS core `.cjs`; ESM-default OpenCode plugin `.js`) |
| **Framework** | OpenCode plugin hooks (`tool.execute.before`) and Claude Code `PreToolUse` command hooks |
| **Storage** | None. Read-only `.utcp_config.json`; append-only bounded log `.opencode/logs/mcp-route-guard.log` |
| **Testing** | Table-driven Node test for the core plus a Claude-hook integration test |

### Overview
Build one runtime-neutral policy core that decides `allow` or `warn` for a native MCP tool call, then wire two thin adapters onto it: an OpenCode `tool.execute.before` plugin and a Claude `PreToolUse` hook. The core parses the tool name, normalizes the server token, exempts internal servers, and consults the manifest-derived family set from `.utcp_config.json`. This reuses the exact shared-core-plus-two-adapters shape already proven by `mk-deep-loop-guard` (core `dispatch-guard.cjs` + Claude twin `task-dispatch-guard.cjs`), but with a warn-only contract and no reject path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime-neutral policy/logic core plus two thin runtime adapters. The parsing, normalization, exemption, and manifest lookup live in one `.cjs` core; each adapter only maps its runtime's transport (OpenCode `tool.execute.before`, Claude `PreToolUse` stdin/stdout) onto the core and surfaces the result. This mirrors `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs` (core) with `mk-deep-loop-guard.js` (OpenCode) and `task-dispatch-guard.cjs` (Claude), minus the reject path.

### Key Components
- **`mcp-route-guard.cjs` (core)**: `evaluateNativeMcpCall({ toolName, projectDir, env })` returns `{ decision:'allow'|'warn', detail, warnings, audits }`. Parses `mcp__<server>__<tool>` (Claude) and `<server>_<tool>` (OpenCode); normalizes the server token; exempts internal servers; loads and mtime-caches the manifest family set. Never writes stdout/stderr and never writes the log.
- **`mk-mcp-route-guard.js` (OpenCode adapter)**: default-export-only plugin. On `tool.execute.before`, calls the core with `input.tool` and appends any warnings to the bounded rotated log. Never throws; fails open.
- **`mcp-route-guard.cjs` Claude hook + `.claude/settings.json` matcher**: reads the `PreToolUse` payload from stdin, calls the core, emits `hookSpecificOutput.additionalContext` on warn, exits 0 otherwise. A new `mcp__claude_ai_.*` matcher block (timeout 5) routes account-connector calls to it.
- **Manifest family-set loader**: reads `.utcp_config.json` `manual_call_templates[].name`, normalizes each name identically to the call-side token, caps read size, parses once, and caches by file mtime.

### Data Flow
A native MCP tool call reaches an adapter transport. The adapter passes the raw tool name to the core. The core parses the server segment, normalizes it, and short-circuits to `allow` for non-MCP or internal servers. Otherwise it compares the normalized token against the mtime-cached manifest family set. A match returns `warn` (carrying the manifest manual name); a miss returns `allow` (silent under manifest-strict). The OpenCode adapter appends a warn to the log; the Claude adapter emits it as `additionalContext`. No path returns a block, deny, or throw.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.utcp_config.json` (`manual_call_templates[].name`, lines 14-165) | Source of truth for families Code Mode can route (`chrome_devtools_1/2`, `clickup_official`, `figma`, `github`, `gitkraken`, `open_design`, `refero`) | Read-only consumer; not mutated | `rg -n '"name"' .utcp_config.json`; unit test asserts the normalized family set |
| `.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs` | New policy core | Create | Table-driven unit test on `evaluateNativeMcpCall` |
| `.opencode/plugins/mk-mcp-route-guard.js` | New OpenCode adapter | Create (mirror `mk-dist-freshness-guard`, not `mk-deep-loop-guard`) | Plugin loads; warn appends one log line; never throws |
| `.opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs` | New Claude `PreToolUse` hook | Create (mirror `task-dispatch-guard.cjs` shape, warn branch only) | Integration test: `additionalContext`, exit 0, no `permissionDecision` |
| `.claude/settings.json` (`PreToolUse`, lines 14-35) | Existing `Bash` + `Task` matcher blocks | Add a third `mcp__claude_ai_.*` block (timeout 5); do not touch the existing two | `python3 -c 'import json'` parse; grep the new matcher; existing blocks unchanged |
| `mcp-code-mode` `SKILL.md` (`:18`, `:271`, `:338`) | Declares Code Mode MANDATORY and documents manifest-only routing | Unchanged; the guard is a runtime reminder of the existing doc mandate | Cite in decision-record; no edit |

Required inventories:
- Same-class producers: `rg -n 'tool.execute.before|PreToolUse' .opencode/plugins .claude/settings.json` to confirm the guard joins, not replaces, existing hooks.
- Consumers of changed symbols: none - the core is net-new; `rg -n 'evaluateNativeMcpCall' .` should show only the two adapters and the test after implementation.
- Matrix axes: tool-name shape (Claude `mcp__a__b`, OpenCode `a_b`, non-MCP) x server class (external-routable, external-unrouteable, internal) x manifest state (present, absent, unreadable).
- Algorithm invariant: normalize(callSideServer) equals normalize(manifestName) for the same family; adversarial cases are `clickup_official` vs `claude_ai_ClickUp`, `chrome_devtools_1` vs `claude_ai_Chrome`, and any `mk_`/`mk-` internal prefix.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Create the `runtime/lib` and `runtime/hooks/claude` subtree under `mcp-code-mode`
- [ ] Confirm the shared bounded-logger pattern to reuse (256KB + `.1` backup + age-prune)
- [ ] Fix the manifest-strict vs broad posture (ADR-002) before coding step 6 of the core

### Phase 2: Core Implementation
- [ ] Implement `evaluateNativeMcpCall`: parse, normalize, exempt, manifest lookup, warn/allow
- [ ] Implement the OpenCode adapter (`mk-mcp-route-guard.js`): warn-only, log-only, fail-open
- [ ] Implement the Claude hook and add the `mcp__claude_ai_.*` matcher block to `.claude/settings.json`

### Phase 3: Verification
- [ ] Manual testing complete
- [ ] Edge cases handled (unreadable manifest, malformed payload, non-MCP tool, internal server)
- [ ] Documentation updated (`.opencode/plugins/README.md` entry; spec/plan/tasks synchronized)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `evaluateNativeMcpCall` truth table: warn (ClickUp), manifest-strict allow (Webflow absent), internal exempt (code_mode, mk_code_index), non-MCP (Bash, Read) | Node table-driven test |
| Integration | Claude hook: pipe a `PreToolUse` JSON for the ClickUp tool, assert `additionalContext`, exit 0, no `permissionDecision` | Node child process piping stdin |
| Manual | Trigger a native connector call in a Claude session with connectors enabled; confirm the advisory surfaces and the call still runs | Claude Code session |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.utcp_config.json` manual manifest | Internal | Green | None at runtime: empty/unreadable manifest fails open to `allow` |
| Shared bounded logger (256KB rotation) | Internal | Green | OpenCode adapter needs a rotated log target; reuse the `mk-dist-freshness-guard` / dispatch-guard logger |
| Claude account connectors (`mcp__claude_ai_*`) | External | Yellow | Account/session-scoped; when disabled the Claude surface is dormant but the code is harmless |
| Manifest-strict vs broad posture decision (ADR-002) | Decision | Yellow | Gates the default behavior for unrouteable external servers |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The guard emits noisy or wrong advisories, or any report of a blocked call (which should be impossible under the warn-only contract).
- **Procedure**: Delete the `mcp__claude_ai_.*` matcher block from `.claude/settings.json` and remove `.opencode/plugins/mk-mcp-route-guard.js`. The core and hook files then become inert. Because the feature is purely additive and fail-open, removal restores the prior behavior exactly.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Posture decision ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Posture decision (ADR-002) | Setup | Core (step 6 warn/allow default) |
| Core | Setup, Posture decision | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Create subtree, confirm logger, resolve posture |
| Core Implementation | Med | ~120-line core plus two ~40-line adapters and one settings block |
| Verification | Low | Table-driven test plus one integration test |
| **Total** | | **Effort S: reuses the proven shared-core-plus-two-adapters template; the only non-trivial work is name normalization and the posture fork** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) - N/A, no data changes
- [ ] Feature flag configured - the env kill-switch / broad-mode flag is documented before enabling
- [ ] Monitoring alerts set - N/A; the bounded log is the only observability surface

### Rollback Procedure
1. Remove the `mcp__claude_ai_.*` matcher block from `.claude/settings.json` (disables the Claude surface immediately)
2. Delete `.opencode/plugins/mk-mcp-route-guard.js` (disables the OpenCode surface)
3. Smoke test: run any native and any Code Mode call and confirm both proceed normally
4. No stakeholder notification required; the change is advisory-only and non-user-facing

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The only written artifact is the bounded rotated log, which can be deleted safely.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │ Adapters  │
                    │ OC + Claude│
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Policy core (`mcp-route-guard.cjs`) | Manifest, normalization design | `evaluateNativeMcpCall` | OpenCode adapter, Claude hook, tests |
| OpenCode adapter | Core, bounded logger | Warn log line | Verification |
| Claude hook + settings matcher | Core | `additionalContext` advisory | Verification |
| Tests | Core, both adapters | Truth-table + integration proof | Completion claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Resolve the manifest-strict vs broad posture (ADR-002)** - unblocks the core's warn/allow default - CRITICAL
2. **Implement the policy core with name normalization** - the load-bearing invariant - CRITICAL
3. **Wire the Claude hook + settings matcher and prove the integration test** - the only live surface today - CRITICAL

**Total Critical Path**: posture decision -> core -> Claude adapter -> tests.

**Parallel Opportunities**:
- The OpenCode adapter and the Claude hook can be built simultaneously once the core exists
- The table-driven unit test can be written against the core signature before the adapters are finished
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Core complete | `evaluateNativeMcpCall` passes the truth table (warn/allow/internal/non-MCP) | Phase 2 |
| M2 | Adapters wired | OpenCode plugin logs a warn; Claude hook emits `additionalContext` with no `permissionDecision` | Phase 2 |
| M3 | Verified and documented | Integration test green; README entry added; spec/plan/tasks synchronized | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Runtime-neutral core plus two thin adapters

**Status**: Proposed

**Context**: The guard must run under both OpenCode and Claude with identical policy. Duplicating the parse/normalize/exempt/lookup logic in two files would drift.

**Decision**: Put all policy in one `.cjs` core and keep each adapter a thin transport map, exactly as `dispatch-guard.cjs` does for `mk-deep-loop-guard.js` and `task-dispatch-guard.cjs`.

**Consequences**:
- One source of truth for the warn policy; both runtimes stay in lockstep.
- The core must never write stdout/stderr or the log; adapters own I/O. This constraint is easy to violate and is covered by review plus tests.

**Alternatives Rejected**:
- Two independent implementations: rejected because they drift and double the test surface.

See `decision-record.md` for the full ADR set, including the advisory/fail-open posture (ADR-002) and the manifest-strict vs broad fork.

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->


---

<!-- ANCHOR:ai-protocol -->
## AI EXECUTION PROTOCOL

Execution discipline for this Level 3 phase. This plugin/hook pair ships a runtime-neutral core with thin per-runtime adapters (an OpenCode plugin and a Claude hook), so every rule below applies to both surfaces.

### Pre-Task Checklist

Before editing, confirm:
- The shared core and both adapter entrypoints have been read in full (READ FIRST).
- The change stays inside this plugin's own core, adapters, and tests; adjacent plugins are out of scope (SCOPE LOCK).
- The kill-switch env var and the fail-open contract are understood before any advise or deny path is touched.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Land the runtime-neutral core first, then the adapters, then the tests. |
| TASK-SCOPE | The OpenCode plugin never writes to stdout or stderr; no deny predicate is widened beyond its documented surface. |
| TASK-VERIFY | Every behavior change is covered by a unit test that runs green before completion is claimed. |

### Status Reporting Format

Report per component (core, adapter(s), tests) with the real test counts (N pass / N fail) and the kill-switch plus fail-open verification result. Distinguish confirmed (cited test output) from inferred.

### Blocked Task Protocol

If the core contract conflicts with an adapter surface, or a test cannot run, HALT and escalate with the conflicting facts and a one-sentence root cause rather than shipping a silent workaround. Preserve state and name the next safe action.
<!-- /ANCHOR:ai-protocol -->
