---
title: "Feature Specification: cli devin executor wiring"
description: "Add cli-devin as a wired deep-loop executor kind so fan-out lineages can dispatch through Devin CLI, with an enforced model allowlist, a live-verified flag mapping, and audit-table entries matching the existing cli-cursor adapter."
trigger_phrases:
  - "cli-devin executor wiring"
  - "devin deep loop executor"
  - "add devin executor kind"
  - "devin fanout lineage"
  - "041 cli devin executor"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/041-cli-devin-executor-wiring"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Wired cli-devin as a deep-loop executor kind"
    next_safe_action: "Smoke-test one cli-devin lineage, then run the research fan-out"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-041-cli-devin-executor-wiring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: cli devin executor wiring

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None |
| **Parent Packet** | system-deep-loop |
| **Predecessor** | 038-deep-alignment-multi-executor |
| **Successor** | None |
| **Handoff Criteria** | A cli-devin lineage dispatches end to end, and the runtime suite is green with the new adapter covered |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`EXECUTOR_KINDS` in `runtime/lib/deep-loop/executor-config.ts` shipped five kinds — `native`, `cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-cursor` — with no `cli-devin`. The `cli-devin` skill exists and its CLI is installed and authenticated, but a `/deep:research` or `/deep:review` fan-out cannot select it: the config parser rejects the kind before a lineage is ever expanded. That blocks any multi-model run that wants a Devin-hosted model, including the free GLM-5.2 High tier that is only reachable through Devin.

### Purpose
Make `cli-devin` a first-class fan-out executor with the same shape as the other CLI kinds: an enforced model allowlist, a flag mapping derived from the live CLI rather than from documentation, audit-table entries for binary, state, home, and env-prefix resolution, and unit coverage that mirrors the cli-cursor adapter tests.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Adding `cli-devin` to `EXECUTOR_KINDS`, the flag-support table, and the web-search capability matrix.
- A `DEVIN_SUPPORTED_MODELS` allowlist with `isDevinModelAllowed()` and a default model.
- A `buildDevinLineageCommand()` fan-out adapter with a PATH preflight and hard allowlist rejection.
- Audit-table entries for binary name, state-dir env, default home dir, and env prefixes.
- Unit tests covering command shape, sandbox mapping, allowlist behaviour, defaults, and fail-closed absence.

### Out of Scope
- Devin subagent delegation, cloud handoff, or session resume — dispatch only.
- A session-id env entry: none is documented or observed, and guessing one would be fabrication.
- `configDir` support: Devin's `--config` takes a config *file*, not a home directory.
- Any change to the four existing executor kinds.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/lib/deep-loop/executor-config.ts` | Modify | Kind, flag support, capability matrix, model allowlist |
| `runtime/lib/deep-loop/executor-audit.ts` | Modify | Binary, state-env, home-dir, env-prefix entries |
| `runtime/scripts/fanout-run.cjs` | Modify | Lineage adapter, allowlist mirror, PATH preflight, export |
| `runtime/tests/unit/fanout-run.vitest.ts` | Modify | cli-devin adapter test block |
| `runtime/tests/unit/executor-config.vitest.ts` | Modify | Extend the literal capability-matrix assertion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `cli-devin` parses as a valid executor kind | `parseExecutorConfig({ kind: 'cli-devin' })` succeeds |
| REQ-002 | Model allowlist is enforced before command construction | An id outside the allowlist throws, and no command is built |
| REQ-003 | Flag mapping matches the live CLI | Only flags present in `devin --help` are emitted |
| REQ-004 | The adapter fails closed when the binary is absent | A PATH without `devin` throws before construction |
| REQ-005 | Typecheck and the runtime suite pass | `npm run typecheck` clean; `vitest run` green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Sandbox modes map to real permission modes | read-only, workspace-write, and danger-full-access each produce a distinct documented mode |
| REQ-007 | No fabricated env var or flag is introduced | Every entry traces to `devin --help` or `devin models list` output |
| REQ-008 | Reasoning effort and service tier are never forwarded | Devin encodes both in the model uid; neither becomes a flag |
| REQ-009 | Model tier names are read from the live roster | `glm-5-2` is recorded as GLM-5.2 High and free, not inferred from the skill's reference table |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fan-out config naming `cli-devin` expands into a dispatchable lineage.
- **SC-002**: The runtime suite is green, with the new adapter covered by its own tests.
- **SC-003**: A live smoke dispatch on `glm-5-2` returns output and exits cleanly.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Adding a kind breaks an exhaustive `Record<ExecutorKind, …>` | Compile failure elsewhere | Typecheck is a P0 gate; two exhaustive maps were updated |
| Risk | Guessing a flag Devin does not have | Dispatch fails at runtime | Every flag read from live `devin --help` |
| Risk | Allowlist too narrow for later use | Operators blocked on a valid model | Allowlist is data, extendable without touching the adapter |
| Dependency | Devin CLI installed and authenticated | Lineage cannot dispatch | Verified: binary on PATH, `devin auth status` reports logged in |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the allowlist grow to cover the full 37-family roster, or stay curated to ids with known prompt-craft behaviour?
- Does Devin expose a session identifier that could be captured for audit receipts?
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
