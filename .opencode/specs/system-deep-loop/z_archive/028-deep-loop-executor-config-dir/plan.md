---
title: "Implementation Plan: Deep loop executor config-dir override"
description: "Implement a validated cli-claude-code configDir field and fanout-run environment injection, then prove it with focused executor and smoke tests."
trigger_phrases:
  - "deep-loop configDir plan"
  - "Claude config-dir fanout plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/028-deep-loop-executor-config-dir"
    last_updated_at: "2026-06-10T16:50:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Planned and implemented configDir executor routing"
    next_safe_action: "Use the verified --config-dir flag with cli-claude-code lineages"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/commands/deep/start-review-loop.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-executor-config-dir-20260610"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deep loop executor config-dir override

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and Node CommonJS scripts |
| **Framework** | Deep-loop runtime command workflow |
| **Storage** | None |
| **Testing** | Vitest, TypeScript no-emit, stubbed fanout smoke |

### Overview
The implementation adds `configDir` to the executor config model and permits it only for `cli-claude-code`. `fanout-run.cjs` expands `~` and merges `CLAUDE_CONFIG_DIR` into the spawned lineage environment after the existing per-kind allowlist, so the override remains lineage-scoped.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified.

### Definition of Done
- [x] All acceptance criteria met.
- [x] Focused tests passing.
- [x] Command docs and spec docs updated.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Schema-first executor configuration with per-kind support validation and spawn-time environment construction.

### Key Components
- **Executor config schema**: Owns accepted fields and rejects unsupported per-kind flags.
- **Fanout runner**: Owns CLI lineage process spawning and environment isolation.
- **Command setup docs**: Define how operator flags map into `config.executor` and `config.fanout`.

### Data Flow
`--config-dir=PATH` or `executor_config_dir` becomes `config.executor.configDir` or a fanout lineage `configDir`; fanout JSON is parsed by `parseFanoutConfig`; `fanout-run.cjs` expands `~` and injects `CLAUDE_CONFIG_DIR` only when `lineage.kind === 'cli-claude-code'`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Executor schema | Producer of validated executor shape | Added `configDir` and per-kind support | `executor-config.vitest.ts` configDir cases pass. |
| Fanout runner | Consumer of lineage config and producer of spawn env | Injected expanded `CLAUDE_CONFIG_DIR` for Claude Code only | `fanout-run.vitest.ts` env cases pass; stub smoke confirms. |
| Command setup docs | Producer of config JSON fields | Added parser mapping and repeatable group docs | Readback confirms `--config-dir` mapping in review and research docs. |
| Single review auto YAML | Consumer of `config.executor` | Added `configDir` binding and render hint for Claude env export | Readback confirms binding and note. |

Required inventories:
- Same-class producers checked: executor schema, fanout runner, review/research setup contracts.
- Consumers checked: focused tests, review auto YAML, fanout CLI spawn path.
- Matrix axes: kind (`cli-claude-code`, `cli-codex`), configDir (`set`, `blank`, `absent`), path expansion (`~/...`).
- Algorithm invariant: only Claude Code lineages receive `CLAUDE_CONFIG_DIR`; other executor kinds reject `configDir` at validation time.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read executor schema, fanout runner, command docs, YAML, and focused tests.
- [x] Scaffold Level 2 spec folder.
- [x] Confirm requested packet number was free.

### Phase 2: Core Implementation
- [x] Add `configDir` schema field and kind support validation.
- [x] Add fanout-run `~` expansion and Claude env injection.
- [x] Add command setup documentation for `--config-dir=PATH`.
- [x] Extend tests and align typed executor fixtures.

### Phase 3: Verification
- [x] Run focused TypeScript no-emit check with temporary config.
- [x] Run focused Vitest suite.
- [x] Run stubbed fanout smoke for set and absent configDir.
- [x] Run OpenCode alignment and comment hygiene checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Schema validation and fanout env behavior | Vitest |
| Static | TypeScript compatibility for changed runtime/test files | `npx tsc --noEmit` with temporary config because the skill has no local tsconfig |
| Smoke | Stubbed `claude` spawn with Fable model and account path | `fanout-run.cjs` with temp stub binary |
| Hygiene | OpenCode comment and alignment checks | `check-comment-hygiene.sh`, `verify_alignment_drift.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Claude Code `CLAUDE_CONFIG_DIR` behavior | External CLI env contract | Green, user verified | Per-account routing would not work despite env propagation. |
| Existing deep-loop runtime tests | Internal | Green | Regression would block completion. |
| Local `tsconfig.json` in deep-loop-runtime | Internal | Missing | Exact requested tsc command cannot run; temporary config used for focused no-emit check. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: ConfigDir validation or env injection causes fanout regressions.
- **Procedure**: Remove `configDir` from schema/support docs/tests and remove the `CLAUDE_CONFIG_DIR` merge from `fanout-run.cjs`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Completed in-session |
| Core Implementation | Medium | Completed in-session |
| Verification | Medium | Completed in-session |
| **Total** | | **Completed** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration required.
- [x] No feature flag required.
- [x] Existing fanout timeout and salvage behavior unchanged.

### Rollback Procedure
1. Revert the schema field and fanout env injection.
2. Remove command documentation for `--config-dir`.
3. Rerun the focused Vitest suite and stub smoke.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
