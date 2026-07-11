---
title: "Implementation Plan: CLI Dispatch Audit Trail"
description: "Implements a post-execution CLI dispatch audit trail as a runtime-neutral dispatch-audit.mjs core plus two thin adapters: an OpenCode tool.execute.after plugin and a Claude PostToolUse(Bash) hook. Both observe completed dispatches and append a redacted, size-rotated JSONL line."
trigger_phrases:
  - "cli dispatch audit plan"
  - "tool.execute.after adapter"
  - "dispatch-audit.mjs"
  - "post-execution telemetry"
  - "shared core plus adapters"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/001-cli-dispatch-audit-trail"
    last_updated_at: "2026-07-11T09:03:29.684Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 plan: architecture, affected surfaces, phases, ADRs"
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
# Implementation Plan: CLI Dispatch Audit Trail

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
| **Language/Stack** | Node.js ESM (`.mjs`) core; ESM `.js` OpenCode plugin; ESM `.mjs` Claude hook |
| **Framework** | `@opencode-ai/plugin` (tool.execute.after); Claude Code PostToolUse hooks |
| **Storage** | Append-only, size-rotated JSONL at `.opencode/logs/cli-dispatch-audit.log` (+ `.1` backup) |
| **Testing** | vitest (co-located `dispatch-audit.test.mjs`) |

### Overview
This is the foundation phase of packet 132 and the repo's first live use of `tool.execute.after`. A single runtime-neutral core (`dispatch-audit.mjs`) owns all matching, redaction, formatting, and rotated append. Two thin adapters map each runtime's transport shape into that core: an OpenCode plugin (`tool.execute.after`) and a Claude PostToolUse(Bash) hook. Both are observe-only and fail-open, so telemetry can never affect a dispatch. The pattern here is the adapter contract that phases 002 and 003 reuse.
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
Runtime-neutral policy/logic core plus two thin runtime adapters. This mirrors the repo's existing `dispatch-guard.cjs` core with its `mk-deep-loop-guard.js` OpenCode adapter (`.opencode/plugins/mk-deep-loop-guard.js:52`) and its Claude twin (`.opencode/skills/system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs:14`). The core owns all parsing and formatting; adapters only map transport in and out.

### Key Components
- **`dispatch-audit.mjs` (core)**: Exports `matchDispatchShape(command)` (the two dispatch regexes, shared with the before-lint twin), `extractDispatchMeta(command, meta)` (model, target, duration, bytes), `buildAuditLine(record)` (one JSONL string with a scrubbed, length-bounded command), and `appendAuditLog(logPath, line)` (size-based copy+truncate rotation mirroring `.opencode/plugins/mk-dist-freshness-guard.js:80-96`). Sibling of `.opencode/skills/cli-external/cli-opencode/scripts/lib/dispatch-rule-checks.mjs`.
- **`mk-cli-dispatch-audit.js` (OpenCode adapter)**: Default-export-only plugin implementing only `'tool.execute.after'(input, output)`. Fast-exits unless `String(input.tool).toLowerCase() === 'bash'`; reads `input.args?.command` and `output.output`/`output.metadata`; calls the core; appends inside try/catch. Never writes stdout/stderr, never throws.
- **`dispatch-audit-posttooluse.mjs` (Claude adapter)**: PostToolUse hook, matcher `Bash`. Reads the stdin payload (`payload.tool_name === 'Bash'`, `payload.tool_input.command`, `payload.tool_response`), calls the same core, then exits 0 with no output and no `permissionDecision`.

### Data Flow
1. A Bash tool call completes under either runtime.
2. The adapter normalizes the tool name (lowercase `bash` in OpenCode, `Bash` in Claude) and pulls the command plus available output metadata.
3. `matchDispatchShape(command)` returns a shape or `null`; on `null` the adapter fast-exits.
4. On a match, `extractDispatchMeta` + `buildAuditLine` produce one redacted, truncated JSONL string.
5. `appendAuditLog` writes it with size rotation, all inside a try/catch that swallows every error.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `dispatch-audit.mjs` (new core) | Owns matching, redaction, JSONL formatting, rotated append | Create | `rg -n 'buildAuditLine\|appendAuditLog\|matchDispatchShape' .opencode/skills/cli-external/cli-opencode/scripts/lib/dispatch-audit.mjs` + vitest |
| `mk-cli-dispatch-audit.js` (new OpenCode plugin) | Observes completed Bash tool calls via `tool.execute.after` | Create | `rg -n 'tool.execute.after' .opencode/plugins/mk-cli-dispatch-audit.js`; grep confirms single default export |
| `dispatch-audit-posttooluse.mjs` (new Claude hook) | Observes completed Bash tool calls via PostToolUse | Create | `rg -n 'tool_response\|tool_input.command' .opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-audit-posttooluse.mjs` |
| `.claude/settings.json` PostToolUse block | Wires PostToolUse for Write\|Edit only (`.claude/settings.json:14-123`) | Update: add `{ matcher: "Bash" }` sibling | `rg -n 'matcher.*Bash' .claude/settings.json` (post-change) |
| `dispatch-preflight-lint.mjs` DISPATCH_SKILLS | Declares the before-side dispatch regexes (`:20-23`) | Update: import shared regexes from the core | `rg -n 'DISPATCH_SKILLS\|import.*dispatch-audit' .../dispatch-preflight-lint.mjs` shows import, not local declaration |
| `.opencode/plugins/README.md` §3 | Plugin registry table | Update: add one row | `rg -n 'mk-cli-dispatch-audit' .opencode/plugins/README.md` |
| `.opencode/logs/cli-dispatch-audit.log` | Does not exist yet | Create at runtime | Written by `appendAuditLog`; not authored by hand |

Required inventories:
- Same-class producers: `rg -n 'appendGuardLog\|copyFileSync\|truncateSync' .opencode/plugins/mk-dist-freshness-guard.js` (rotation exemplar at `:80-96`).
- Consumers of changed symbols: `rg -n 'DISPATCH_SKILLS' . --glob '*.mjs' --glob '*.js'` before and after extracting the regexes.
- Matrix axes: runtime (OpenCode after-hook vs Claude PostToolUse) x command class (dispatch match vs non-dispatch fast-exit) x log-write outcome (writable vs unwritable). All rows enumerated in the first test.
- Algorithm invariant: `buildAuditLine` output is always a single line, always parseable JSON, always with a command field bounded to the fixed cap and free of secret-shaped tokens. Adversarial cases: multi-KB command, embedded newlines, secret-shaped token, empty command, non-string command.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm `.opencode/logs/` exists and the rotation exemplar (`mk-dist-freshness-guard.js:80-96`) is the pattern to copy
- [ ] Confirm the two before-side regexes at `dispatch-preflight-lint.mjs:20-23` are the exact shapes to reuse
- [ ] Scaffold the co-located vitest spec next to `dispatch-rule-checks.test.mjs`

### Phase 2: Core Implementation
- [ ] Implement `dispatch-audit.mjs`: shared regexes, `matchDispatchShape`, `extractDispatchMeta`, `buildAuditLine` (scrub + truncate), `appendAuditLog` (size rotation)
- [ ] Implement the OpenCode adapter `mk-cli-dispatch-audit.js` (default-export-only, `tool.execute.after`)
- [ ] Implement the Claude adapter `dispatch-audit-posttooluse.mjs` (stdin payload, exit 0 no output)
- [ ] Wire `.claude/settings.json` PostToolUse `{ matcher: "Bash" }` and the `plugins/README.md` row
- [ ] Repoint `dispatch-preflight-lint.mjs` to import the shared regexes

### Phase 3: Verification
- [ ] Run the vitest spec (match, build, append round-trip, fail-open)
- [ ] Grep-verify default-export-only, no `console.*`, single regex source of truth
- [ ] Confirm a non-dispatch command produces zero log lines and a dispatch produces exactly one
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `matchDispatchShape`, `extractDispatchMeta`, `buildAuditLine`, `appendAuditLog` | vitest |
| Integration | Adapter-to-core mapping for both transport shapes (simulated payloads) | vitest |
| Manual | One real `opencode run` and one `claude -p` dispatch, then inspect the log line | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@opencode-ai/plugin` tool.execute.after signature (`dist/index.d.ts:249-258`) | Internal | Green | None; signature confirmed in the type defs |
| Before-twin regexes `dispatch-preflight-lint.mjs:20-23` | Internal | Green | Must extract to core to avoid drift; no external blocker |
| Rotation pattern `mk-dist-freshness-guard.js:80-96` | Internal | Green | Copy exemplar; no blocker |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: TUI corruption, unexpected latency on the Bash hot path, or any sign of a leaked secret in the log.
- **Procedure**: Delete `.opencode/plugins/mk-cli-dispatch-audit.js` (auto-loader stops picking it up), remove the `.claude/settings.json` PostToolUse Bash entry, and revert the `dispatch-preflight-lint.mjs` import. The core lib and log file are inert once no adapter calls them.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5-1 hour |
| Core Implementation | Med | 3-5 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **4.5-8 hours (S slice)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Disable the surface via the env kill-switch (no code change).
2. Delete `mk-cli-dispatch-audit.js` and remove the `.claude/settings.json` PostToolUse Bash entry.
3. Revert the `dispatch-preflight-lint.mjs` regex-import change so the before-lint keeps working.
4. Confirm dispatches still run and no log line is written.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Delete `.opencode/logs/cli-dispatch-audit.log` and `.1`; they are pure append-only telemetry with no downstream state.
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
                    │  Phase 2b │
                    │  Adapters │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `dispatch-audit.mjs` core | None | match/build/append API + shared regexes | Adapters, lint-import |
| OpenCode adapter | Core | Runtime audit line under OpenCode | Verify |
| Claude adapter | Core | Runtime audit line under Claude | Verify |
| Wiring (settings.json, README, lint-import) | Core | Live registration + single regex source | Verify |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 2 core (`dispatch-audit.mjs`)** - 2-3 hours - CRITICAL
2. **Phase 2 adapters (OpenCode + Claude)** - 1-2 hours - CRITICAL
3. **Phase 3 verification (vitest + manual)** - 1-2 hours - CRITICAL

**Total Critical Path**: 4-7 hours

**Parallel Opportunities**:
- The OpenCode adapter and Claude adapter can be built simultaneously once the core lands.
- The `plugins/README.md` row and `dispatch-preflight-lint.mjs` regex-import can proceed in parallel with adapter work.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Core landed | `matchDispatchShape`, `buildAuditLine`, `appendAuditLog` pass vitest | Phase 2 start |
| M2 | Both adapters wired | Dispatch produces one line under OpenCode and one under Claude | Phase 2 end |
| M3 | Verified + drift-free | vitest green; lint-twin imports shared regexes; grep confirms single default export | Phase 3 end |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Runtime-neutral core plus two thin adapters

**Status**: Accepted

**Context**: Two runtimes (OpenCode `tool.execute.after` and Claude PostToolUse) must produce the same audit line from different transport shapes.

**Decision**: Put all matching, redaction, and formatting in one `dispatch-audit.mjs` core; keep each adapter to transport mapping only, mirroring the existing `dispatch-guard.cjs` + `mk-deep-loop-guard.js` + `task-dispatch-guard.cjs` shape.

**Consequences**:
- Single source of truth for redaction and JSONL schema; the two runtimes cannot diverge.
- One more file boundary, justified by the two-runtime requirement.

**Alternatives Rejected**:
- Inline logic in each adapter: rejected because it duplicates redaction and invites drift.

### ADR-002: Observe-only, fail-open posture with env kill-switch

**Status**: Accepted

**Context**: The after-hook runs on the hot path of every Bash tool call and must never affect a dispatch result.

**Decision**: Swallow every error inside try/catch, write nothing to stdout/stderr, emit no `permissionDecision`, and gate the whole surface behind an env kill-switch.

**Consequences**:
- Telemetry can never break or slow a dispatch.
- A silent failure is possible (a dropped line), accepted for a pure telemetry surface.

**Alternatives Rejected**:
- Fail-closed or enforcing behavior: rejected; a post-execution audit has no business blocking anything.

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
