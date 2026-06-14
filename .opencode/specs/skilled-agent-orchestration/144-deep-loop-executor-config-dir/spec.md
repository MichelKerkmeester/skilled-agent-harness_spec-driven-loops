---
title: "Feature Specification: Deep loop executor config-dir override"
description: "Add a per-executor configDir override so cli-claude-code fan-out seats can route through a specific Claude account without wrapping the whole run environment."
trigger_phrases:
  - "deep-loop configDir"
  - "CLAUDE_CONFIG_DIR fanout"
  - "cli-claude-code config-dir"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/144-deep-loop-executor-config-dir"
    last_updated_at: "2026-06-10T16:50:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented per-executor Claude config-dir override"
    next_safe_action: "Use --config-dir=PATH with cli-claude-code fan-out seats when account routing is required"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts"
      - ".opencode/commands/deep/start-review-loop.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-executor-config-dir-20260610"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "configDir is scoped to cli-claude-code and maps to CLAUDE_CONFIG_DIR in fanout-run."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Deep loop executor config-dir override

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-10 |
| **Branch** | Current workspace, no git workflow requested |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Deep-loop fan-out can dispatch `cli-claude-code` seats with a selected model, but it had no per-executor way to select a Claude account directory. Operators could route Fable 5 through `CLAUDE_CONFIG_DIR=~/.claude-account2` only by wrapping the whole run environment, which incorrectly affects every seat instead of the intended Claude lineage.

### Purpose
Allow a specific `cli-claude-code` executor or fan-out lineage to carry `configDir`, validate it, and inject `CLAUDE_CONFIG_DIR` only for that spawned Claude process.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `configDir` to deep-loop executor schema and per-kind flag support for `cli-claude-code`.
- Inject expanded `CLAUDE_CONFIG_DIR` in `fanout-run.cjs` for Claude Code lineages only.
- Document `--config-dir=PATH` in deep-review and shared deep-research setup contracts.
- Extend focused executor-config and fanout-run tests.

### Out of Scope
- Hardcoding any Claude account path. The caller provides `configDir`.
- Changing package manifests, lockfiles, git state, daemon configuration, or deep-improvement-owned files.
- Running a real Claude dispatch as part of verification.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modify | Add `configDir` schema field and kind support validation. |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | Expand `~` and inject `CLAUDE_CONFIG_DIR` for `cli-claude-code` lineages. |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts` | Modify | Cover configDir acceptance, blank rejection, kind rejection, and fan-out parsing. |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modify | Cover injected and absent Claude config-dir env behavior. |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-audit.vitest.ts` | Modify | Keep typed fixtures aligned with the parsed executor shape. |
| `.opencode/skills/deep-loop-runtime/tests/unit/dispatch-failure.vitest.ts` | Modify | Keep typed fixtures aligned with the parsed executor shape. |
| `.opencode/commands/deep/start-review-loop.md` | Modify | Document and map `--config-dir=PATH`. |
| `.opencode/commands/deep/start-research-loop.md` | Modify | Keep the sibling shared setup contract aligned. |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modify | Carry `configDir` in executor binding and document single auto Claude env export. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Executor configs can express an optional Claude config directory. | `parseExecutorConfig({ kind: 'cli-claude-code', configDir: '~/.claude-account2' })` succeeds and blank strings fail validation. |
| REQ-002 | Non-Claude executor kinds do not silently accept Claude account routing. | `cli-codex` with `configDir` is rejected by per-kind support validation. |
| REQ-003 | Fan-out Claude lineages receive the resolved config directory. | Stubbed `cli-claude-code` lineage with `configDir=~/.claude-account2` spawns with `CLAUDE_CONFIG_DIR=/Users/michelkerkmeester/.claude-account2`. |
| REQ-004 | Absent configDir does not inject an account override. | Stubbed `cli-claude-code` lineage without `configDir` has no account path in `CLAUDE_CONFIG_DIR`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Deep-review setup docs expose `--config-dir=PATH` for single and repeatable executor groups. | `start-review-loop.md` maps `--config-dir` to `config.executor.configDir` and lists it in fan-out group fields. |
| REQ-006 | Deep-research sibling setup docs stay aligned with the shared parser contract. | `start-research-loop.md` includes the same field, marker, table row, and parser mapping. |
| REQ-007 | Existing executor tests remain green. | Focused Vitest run reports 3 files and 78 tests passing. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A Fable 5 fan-out lineage can be described as `kind=cli-claude-code`, `model=claude-fable-5`, `configDir=~/.claude-account2` and spawns with the expanded `CLAUDE_CONFIG_DIR` value.
- **SC-002**: The environment override is scoped to the spawned Claude lineage and does not require wrapping the parent process.
- **SC-003**: Existing focused executor validation, fan-out, and audit tests remain green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Claude Code honors `CLAUDE_CONFIG_DIR` | Account selection depends on the CLI environment contract | Verified by user-provided working command and stub smoke env propagation. |
| Risk | Leaking Claude configDir to non-Claude seats | Other seats could inherit an unintended account path | Per-kind validation rejects `configDir` outside `cli-claude-code`; fanout injection is kind-gated. |
| Risk | Shell `~` expansion inconsistency | Spawn env would receive a literal tilde | `fanout-run.cjs` expands `~` and `~/...` through `os.homedir()`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Env construction remains synchronous and constant time per lineage.
- **NFR-P02**: No additional subprocesses are created for config-dir resolution.

### Security
- **NFR-S01**: No account path is hardcoded in runtime code.
- **NFR-S02**: Config directory values are not added to executor audit records.

### Reliability
- **NFR-R01**: Existing dispatch stack and per-lineage state-dir isolation continue to apply.
- **NFR-R02**: Absent configDir leaves inherited env behavior unchanged except for existing allowlist filtering.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: blank and whitespace-only `configDir` values fail schema validation.
- Maximum length: no artificial limit is added beyond runtime argument and environment limits.
- Invalid format: unsupported executor kinds report the existing field-support error path.

### Error Scenarios
- External service failure: not exercised; the smoke uses a stub and does not call Claude.
- Network timeout: unchanged from existing `timeoutSeconds` behavior.
- Concurrent access: unchanged because per-lineage state directory isolation remains intact.

### State Transitions
- Partial completion: failed lineages still use the existing pool failure summary and salvage path.
- Session expiry: unchanged because account routing is per spawned process env.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One schema field, fanout env merge, command docs, focused tests. |
| Risk | 10/25 | Environment routing can affect account selection, but kind gating limits blast radius. |
| Research | 6/20 | Existing executor and fanout patterns were already present. |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
