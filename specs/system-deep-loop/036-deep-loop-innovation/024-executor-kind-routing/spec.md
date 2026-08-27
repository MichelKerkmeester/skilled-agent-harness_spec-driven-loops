---
title: "Feature Specification: Deterministic Single-Executor Dispatch for cli-cursor/devin/pi"
description: "Close the silent-native gap where a single --executor=cli-cursor/cli-devin/cli-pi on /deep:review, /deep:research, or /deep:alignment has no phase_main_loop branch and degrades to native. Add deterministic per-kind branches that dispatch per-iteration through the shared fan-out command builder (buildLineageCommand), failing closed when the binary is absent or the model is off the allowlist."
trigger_phrases:
  - "executor kind routing cli-cursor cli-devin cli-pi"
  - "single executor silent native fallback deep loop"
  - "phase_main_loop branch buildLineageCommand"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/024-executor-kind-routing"
    last_updated_at: "2026-08-27T09:10:00.000Z"
    last_updated_by: "claude"
    recent_action: "Added cli-cursor/devin/pi branches to the 3 auto loop YAMLs; proven dispatch + fail-loud"
    next_safe_action: "Commit; push v4 + main"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep-review-auto.yaml"
      - ".opencode/commands/deep/assets/deep-research-auto.yaml"
      - ".opencode/commands/deep/assets/deep-alignment-auto.yaml"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Routing through fanout-run would reintroduce model-dependence (config.fanout is resolved in the model-driven setup with no deterministic promotion hook), so per-kind branches (deterministic branch_on) are the correct fix."
      - "The branches reuse fanout-run.cjs's buildLineageCommand, so each CLI's binary preflight, model allowlist, and headless write flags stay one source of truth and fail closed — never a silent native fallback."
---
# Feature Specification: Deterministic Single-Executor Dispatch for cli-cursor/devin/pi

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-27 |
| **Source** | Cross-session report: a single `--executor=cli-devin` on `/deep:review` silently ran native |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 023-cross-runtime-dispatch |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The single-executor path of the auto loop YAMLs (`deep-review-auto`, `deep-research-auto`, `deep-alignment-auto`) dispatches per iteration via `phase_main_loop`'s `branch_on: config.executor.kind` (research uses `config.executor.type`). That block has hand-written branches for `native`, `cli-copilot`, `cli-claude-code`, `cli-opencode`, and `cli-codex`, but **none for `cli-cursor`, `cli-devin`, or `cli-pi`**. A run requested with one of those three executors matches no branch and silently falls through to the native dispatch — the operator asks for cli-devin and gets a native review instead, with no error.

`fanout-run.cjs` already dispatches all three kinds robustly through `buildLineageCommand` (per-kind binary preflight, enforced model allowlist, headless write-mode flags, fail-loud on absence), but that path is only reached by the multi-executor fan-out (`config.fanout`), never by a single `--executor`.

### Purpose

Make a single `--executor=cli-cursor/cli-devin/cli-pi` dispatch that executor per iteration, deterministically, and fail closed if it cannot — never silently native. Add explicit `if_cli_cursor/devin/pi` branches to the single-executor `branch_on` that dispatch through the same `buildLineageCommand` the fan-out path uses, so each CLI's invocation contract stays one source of truth.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `if_cli_cursor`, `if_cli_devin`, `if_cli_pi` branches to the single-executor `branch_on` of the three auto loop YAMLs. Each branch:
  - reads the requested kind from the YAML's executor field (`config.executor.kind`, or `config.executor.type` for research);
  - reads the iteration prompt, calls `buildLineageCommand(lineage, prompt, sandbox, permission, {env, cwd})` (imported from `fanout-run.cjs` via `createRequire`) with `sandboxMode: 'workspace-write'` so the leaf can write its iteration file/delta/state record;
  - dispatches through `runAuditedExecutorCommand` (INTENT + COMPLETION receipts) and enforces write-containment, mirroring the existing `cli-codex` branch;
  - fails closed — `buildLineageCommand` throws when the binary is absent or the model is off the enforced allowlist, so the branch exits non-zero rather than degrading to native.

### Out of Scope

- The confirm-mode YAMLs and `deep-ai-council` — the reported gap and the headless CLI-executor path are the auto loops; the confirm variants also carry pre-existing per-kind inconsistencies (e.g. missing `cli-codex`) that are a separate cleanup.
- Any change to the fan-out path, `buildLineageCommand`, or the executor config schema — the fix reuses them unchanged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `commands/deep/assets/deep-review-auto.yaml` | Modify | Add `if_cli_cursor/devin/pi` branches (field `config.executor.kind`, dispatchId `review-*`) |
| `commands/deep/assets/deep-research-auto.yaml` | Modify | Add the three branches (field `config.executor.type`, dispatchId `research-*`) |
| `commands/deep/assets/deep-alignment-auto.yaml` | Modify | Add the three branches (field `config.executor.kind`, dispatchId `alignment-*`) |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A single cli-cursor/devin/pi executor dispatches that CLI, not native | The branch calls `buildLineageCommand` and dispatches the returned `command` (`cursor-agent`/`devin`/`pi`) per iteration. |
| REQ-002 | The path fails closed, never silently native | A disallowed model or absent binary makes `buildLineageCommand` throw before dispatch; the branch exits non-zero. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | All three auto loops covered | `deep-review-auto`, `deep-research-auto`, and `deep-alignment-auto` each gain the three branches with the correct executor field and dispatchId prefix. |
| REQ-004 | One source of truth for the CLI contract | The branches import `buildLineageCommand` rather than re-deriving each CLI's binary/allowlist/flags. |
| REQ-005 | No whole-suite regression | The runtime vitest suite and `run-node-tests.mjs` show no new code-caused failures vs baseline. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A stubbed-dispatch run of each inserted branch prints `command=cursor-agent`/`devin`/`pi` with the correct dispatchId prefix and exit 0.
- **SC-002**: A disallowed model throws "not in the enforced allowlist" before any dispatch (fail-loud negative control).
- **SC-003**: All three YAMLs parse; the targeted auto-YAML vitest tests and both whole-suite gates show no new failures.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The single-executor path differs structurally from the fan-out (per-iteration vs whole-loop) | Reusing the wrong builder could mis-dispatch | `buildLineageCommand` is a pure command factory (adapters read only `options.env`/`options.cwd`); called with the iteration prompt it yields a per-iteration invocation, proven by a stubbed end-to-end run. |
| Risk | Reversal of the earlier "route through fanout-run" choice | Approach mismatch | The reversal was surfaced and approved: routing would reintroduce model-dependence (config.fanout is model-resolved at setup), whereas `branch_on` is deterministic. |
| Dependency | `fanout-run.cjs` `buildLineageCommand` export + guarded main | The reused builder | Verified exported and `require`-safe (main is `require.main === module` guarded). |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The confirm-mode YAMLs carry the same class of per-kind branch gaps (and additional pre-existing omissions). Extending the deterministic branches there is a reasonable follow-up but was out of scope for the reported headless (auto) path.

<!-- /ANCHOR:questions -->
