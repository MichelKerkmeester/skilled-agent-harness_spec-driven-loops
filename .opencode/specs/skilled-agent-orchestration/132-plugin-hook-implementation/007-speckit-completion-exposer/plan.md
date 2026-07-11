---
title: "Implementation Plan: Spec-Kit Completion-State Exposer (tool.register)"
description: "Wraps a runtime-neutral completion-state core in one OpenCode read-only tool plus an optional Claude CLI shim. The core shells check-completion.sh and calculate-completeness.sh, catches the exit-1 case, and merges their JSON fail-open."
trigger_phrases:
  - "completion state plan"
  - "tool.register plugin"
  - "completion-state core"
  - "runtime-neutral core adapters"
  - "check-completion exit-1 catch"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/007-speckit-completion-exposer"
    last_updated_at: "2026-07-11T08:51:12.807Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 plan: architecture, surfaces, deps, ADR"
    next_safe_action: "Author tasks.md breakdown across Setup, Implementation, and Verification"
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
      - "Confirm the vitest location convention for a .cjs core"
    answered_questions: []
---
# Implementation Plan: Spec-Kit Completion-State Exposer (tool.register)

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
| **Language/Stack** | Node.js; CommonJS core (`.cjs`), ESM plugin (`.js`), CJS CLI shim (`.cjs`) |
| **Framework** | OpenCode plugin API (`tool` from `@opencode-ai/plugin/tool`) |
| **Storage** | None; reads spec folders and shells two existing scripts |
| **Testing** | Vitest for the core (parse and fail-open) |

### Overview
This phase adds a read-only tool that merges the output of `check-completion.sh --json` and `calculate-completeness.sh --json` into one payload behind a shared `completion-state.cjs` core. The OpenCode plugin `mk-speckit-completion.js` registers `mk_speckit_completion` (first live use of `tool.register`); an optional Claude CLI shim fronts the same core over Bash. All parsing, level inference, and fail-open logic lives in the core so the adapters only map transport.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Both script JSON shapes and exit codes confirmed (`check-completion.sh` exit 1 emits JSON first)

### Definition of Done
- [ ] Core returns the merged payload and never throws
- [ ] Vitest parse and fail-open specs pass
- [ ] Docs updated (spec/plan/tasks, `plugins/README.md` section 3 row)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime-neutral policy/logic core plus thin runtime adapters. This mirrors the repo's `mk-deep-loop-guard` shape: a `.cjs` core outside `.opencode/plugins/` is imported as the ESM default by the plugin (`.opencode/plugins/mk-deep-loop-guard.js:28`), and a sibling runtime (`.opencode/skills/system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs:14`) consumes the same core. Here the core has one OpenCode adapter (the plugin) and one optional Claude adapter (the CLI shim); the Claude side has no plugin tool-register equivalent.

### Key Components
- **`completion-state.cjs` (core)**: `computeCompletionState({specFolder, projectDir, strict})`. Resolves the folder, infers level from canonical-doc presence, bounds `execFileSync` of both scripts, catches the `check-completion.sh` exit-1 throw and parses `err.stdout`, and merges into one payload. Never throws.
- **`mk-speckit-completion.js` (OpenCode adapter)**: default-export-only plugin returning `{ tool: { mk_speckit_completion: tool({...}) } }`. `execute(args, ctx)` maps `ctx.directory` to `projectDir` and returns `core.computeCompletionState(...)`. No event/before/after hooks, so it cannot touch the TUI.
- **`speckit-completion.cjs` (optional Claude adapter)**: thin CLI over the same core; maps argv to core input and prints the merged JSON to stdout.

### Data Flow
Agent calls `mk_speckit_completion({specFolder, strict})`. The plugin `execute` maps args and `ctx.directory` to the core. The core infers level, shells both scripts with `{cwd: projectDir, timeout: 5000, maxBuffer}`, catches `check-completion.sh` exit 1 and parses `err.stdout`, and merges `{specFolder, level, filesPresent, checklist, placeholders, generatedAt}`. The payload returns through the tool result channel (the legitimate output, unlike stdout). The CLI path is identical, ending in `JSON.stringify` to stdout.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-completion.sh` | Producer script; emits `{status,passed,priorities:{p0,p1,p2},qualityGates}`, exit 0 complete / 1 incomplete / 2 error | Not a consumer; shelled unchanged | Exit codes at `check-completion.sh:433,450,452`; JSON keys at `:298-312` |
| `calculate-completeness.sh` | Producer script; emits `{overall_completion,files_analyzed,total_placeholders}`, exit 0 | Not a consumer; shelled unchanged | JSON keys at `calculate-completeness.sh:471-473`; exit 0 at `:584` |
| `completion-state.cjs` | New runtime-neutral core; level inference plus fail-open merge | Create | Vitest core spec (parse plus fail-open) |
| `mk-speckit-completion.js` | New OpenCode adapter; `tool.register` transport | Create | Grep single `export default`, zero named exports; smoke-load |
| `speckit-completion.cjs` | New optional Claude/Bash transport | Create | `node .opencode/bin/speckit-completion.cjs <folder>` prints JSON |
| `.opencode/plugins/README.md` section 3 | Plugin entrypoint registry | Update (add one row) | Grep the new row present |
| OpenCode plugin auto-loader | Loads every `.js` in `.opencode/plugins/` once per session | Unchanged (additive) | Session load smoke from root and symlinked workspace |

Required inventories:
- Same-class producers: `rg -n 'tool\(' .opencode/plugins` confirms `mk-goal.js` as the tool-register exemplar to mirror (`mk-goal.js:16` import, `:2933` block).
- Consumers of changed symbols: none. This phase adds files; it changes no existing symbol, so no consumer inventory is needed beyond the README registry row.
- Matrix axes: input axes are packet state (complete / incomplete / missing / malformed) crossed with runtime (OpenCode tool / CLI shim). The core tests cover the packet-state axis; the CLI path reuses the same core.
- Algorithm invariant: the core must parse `check-completion.sh` JSON from `err.stdout` on exit 1, not only from the success path. Adversarial cases: exit 1 with valid JSON (incomplete packet), exit 2 (error), missing folder, and non-JSON stdout.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the tool-register exemplar (`mk-goal.js:16,2933`) and the cjs-import exemplar (`mk-deep-loop-guard.js:28`)
- [ ] Confirm both script JSON contracts and exit codes
- [ ] Select a real Level-2 packet fixture for the first test

### Phase 2: Core Implementation
- [ ] Build `completion-state.cjs`: folder resolution, level inference, bounded `execFileSync`
- [ ] Implement the `check-completion.sh` exit-1 catch and `err.stdout` parse
- [ ] Implement fail-open section degradation and the merged payload
- [ ] Build the OpenCode adapter `mk-speckit-completion.js` (default-export-only, `tool.register`)
- [ ] Build the optional CLI shim `speckit-completion.cjs`

### Phase 3: Verification
- [ ] Vitest parse and fail-open specs pass
- [ ] Smoke-load the plugin from root and a symlinked workspace
- [ ] `plugins/README.md` section 3 row added; grep confirms no `console.*` in the plugin
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `computeCompletionState` parse path and fail-open path | Vitest |
| Integration | CLI shim round-trip (`node speckit-completion.cjs <folder>` prints JSON) | Vitest or manual Bash |
| Manual | OpenCode plugin smoke-load; tool call returns a payload for a real packet | OpenCode session |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `check-completion.sh` | Internal | Green | Core cannot read checklist status; that section reports `unavailable` |
| `calculate-completeness.sh` | Internal | Green | Core cannot read placeholder percentage; that section reports `unavailable` |
| `@opencode-ai/plugin/tool` | External (already vendored) | Green | Plugin cannot register the tool; the CLI shim still works |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The plugin fails to load, the tool returns malformed data, or the auto-loader drops any file.
- **Procedure**: Delete `.opencode/plugins/mk-speckit-completion.js` (the auto-loader stops picking it up next session). The core and CLI shim are inert unless called, so they can be removed independently. Remove the `plugins/README.md` row. No data migration and no existing path to restore.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──────────────► Core ──────────────► Adapters ──────────► Verify
(exemplars +         (completion-state    (plugin +            (vitest +
 script contracts)    .cjs)                CLI shim)            smoke-load)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Adapters, Verify |
| Adapters | Core | Verify |
| Verify | Core, Adapters | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~0.5 hour |
| Core Implementation | Low | ~2 hours (core ~120 LOC, plugin ~50 LOC, CLI ~30 LOC) |
| Verification | Low | ~1 hour |
| **Total** | Low (S) | **~3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Plugin smoke-loaded from project root and a symlinked workspace
- [ ] No `console.*` in the plugin (TUI safety)
- [ ] Vitest core specs green

### Rollback Procedure
1. Delete `.opencode/plugins/mk-speckit-completion.js` so the auto-loader stops registering the tool.
2. Optionally delete `completion-state.cjs` and `speckit-completion.cjs` (both inert unless called).
3. Restart the OpenCode session to confirm no plugin-load error remains.
4. Remove the `plugins/README.md` section 3 row.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. This phase writes no persistent state.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│   Setup     │────►│ completion-state│────►│   Verify    │
│ exemplars + │     │     .cjs core   │     │ vitest +    │
│ contracts   │     └────────┬────────┘     │ smoke-load  │
└─────────────┘              │              └─────────────┘
                    ┌────────┴────────┐
                    │  plugin + CLI   │
                    │  shim adapters  │
                    └─────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | None | Confirmed contracts | Core |
| `completion-state.cjs` | Setup | Merged payload API | Plugin, CLI, Verify |
| `mk-speckit-completion.js` | Core | Registered tool | Verify |
| `speckit-completion.cjs` | Core | CLI JSON output | Verify |
| Verify | Core, Adapters | Green tests | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup: confirm exemplars and script contracts** - ~0.5 hour - CRITICAL
2. **Core: `completion-state.cjs` with exit-1 catch and fail-open** - ~1.5 hours - CRITICAL
3. **Verify: vitest parse and fail-open specs** - ~1 hour - CRITICAL

**Total Critical Path**: ~3 hours

**Parallel Opportunities**:
- The CLI shim and the `plugins/README.md` row can be written alongside the OpenCode plugin once the core is stable.
- The Level-2 fixture selection can happen during Setup while contracts are confirmed.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Core complete | `computeCompletionState` returns the merged payload and never throws | After Phase 2 core |
| M2 | Adapters wired | Plugin registers the tool; CLI shim prints JSON | After Phase 2 adapters |
| M3 | Verified | Vitest green; plugin smoke-loads; README row added | After Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Runtime-neutral core with thin adapters

**Status**: Proposed

**Context**: Two runtimes need the same completion signal, but only OpenCode has a plugin tool-register surface. Putting logic in the plugin would strand Claude and risk the default-export-only rule.

**Decision**: Put all resolution, level inference, exec, exit-1 handling, and merge logic in `completion-state.cjs`, and keep both adapters thin (OpenCode plugin, optional Claude CLI shim).

**Consequences**:
- One source of truth for the payload shape and the fail-open contract.
- The plugin file stays a default-export-only factory, avoiding the auto-loader drop trap.

**Alternatives Rejected**:
- Logic inside the plugin: strands Claude parity and couples policy to the ESM plugin loader. See `decision-record.md` ADR-001 for the full evaluation.

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
</content>
