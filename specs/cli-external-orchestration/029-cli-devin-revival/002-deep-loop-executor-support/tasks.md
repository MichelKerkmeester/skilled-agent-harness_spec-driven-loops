---
title: "Tasks: Devin deep-loop executor support"
description: "Task breakdown for restoring cli-devin as a typed deep-loop executor kind across the 5 hand-synced runtime files and their tests."
trigger_phrases: ["cli-devin executor support tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/002-deep-loop-executor-support"
    last_updated_at: "2026-07-24T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Corrected permission modes; added T026-T029 for the 7-model allowlist enforcement"
    next_safe_action: "Start T001 (re-read phase 001's implementation-summary.md)."
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Devin deep-loop executor support

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel; `[ ]` pending, `[x]` complete, `[B]` blocked.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Re-read `../001-devin-contract-pin/implementation-summary.md` for the confirmed CLI flag surface, 4-mode permission contract, and model roster.
- [ ] T002 Confirm Devin's session-id environment variable via `devin --help` or a live session's environment (mark TBD in code with a comment if still unconfirmed at implementation time).
- [ ] T003 Confirm the exact `--sandbox` flag semantics (boolean presence/absence vs. a valued flag) and decide the `SandboxMode` → `--sandbox` mapping before touching the adapter.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T004 [P] Add `'cli-devin'` as the 5th member of `EXECUTOR_KINDS` in `system-deep-loop/runtime/lib/deep-loop/executor-config.ts`.
- [ ] T005 Add a `cli-devin` row to `EXECUTOR_KIND_FLAG_SUPPORT` (`executor-config.ts`).
- [ ] T006 Add a `cli-devin` row to `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` (`executor-config.ts`) so the `satisfies Record<ExecutorKind, ...>` check compiles.
- [ ] T007 Re-create `DEVIN_SUPPORTED_MODELS` (exactly 7 members: `grok-4-5-high`/`glm-5-2`/`glm-5-2-max`/`glm-5-2-1m`/`glm-5-2-max-1m`/`swe-1-7-medium`/`swe-1-7` — the phase 005 REQ-011 canonical allowlist, re-verified against a live `devin models list` before hard-coding), `DevinSupportedModel`, `DevinPermissionMode` (4 members: `auto`/`accept-edits`/`smart`/`dangerous`), and `resolveDevinPermissionMode()` in `executor-config.ts`, modeled on phase 001's live-verified contract, not the archived 2-mode shape nor the earlier-corrected `normal`/`bypass`/`autonomous` names.
- [ ] T008 [P] Add a `cli-devin` row to `EXECUTOR_BINARY_BY_KIND` (`'devin'`) in `system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`.
- [ ] T009 Add a `cli-devin` row to `EXECUTOR_SESSION_ENV_BY_KIND` in `executor-audit.ts` once T002 resolves the env var name (leave unset if still unconfirmed, per the existing `Partial<Record<...>>` typing).
- [ ] T010 Add a `cli-devin` row to `EXECUTOR_STATE_ENV_BY_KIND` and `EXECUTOR_DEFAULT_HOME_DIR_BY_KIND` (`'.devin'`) in `executor-audit.ts`.
- [ ] T011 Add a `cli-devin` row to `EXECUTOR_ENV_PREFIXES_BY_KIND` (`COGNITION_`, plus `DEVIN_` if confirmed by T002) in `executor-audit.ts`.
- [ ] T012 Add a `cli-devin` row to `SPECKIT_STATE_ENV_BY_KIND` in `system-deep-loop/runtime/scripts/fanout-run.cjs`.
- [ ] T013 Implement `buildDevinLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options)` in `fanout-run.cjs`, constructing `devin -p "<prompt>" --model <id> --permission-mode <mode> [--sandbox]` per T003's mapping decision.
- [ ] T014 Implement a fail-closed preflight (`command -v devin`) inside `buildDevinLineageCommand`, mirroring `isCodexBinaryAvailable`/`buildCodexLineageCommand` exactly; throw a clean `cli-devin executor unavailable: command -v devin failed` error, not raw ENOENT.
- [ ] T015 Register `buildDevinLineageCommand` as the `'cli-devin'` entry in `LINEAGE_COMMAND_ADAPTERS` (`fanout-run.cjs`).
- [ ] T016 [P] Add `'cli-devin'` to `KNOWN_EXECUTORS` in `system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs`.
- [ ] T017 Add a `case 'cli-devin':` branch to `buildSpawnSpec` in `dispatch-model.cjs`, honoring a `DEVIN_BIN` env override matching the existing `OPENCODE_BIN`/`CLAUDE_BIN` pattern.
- [ ] T018 Add `'cli-devin'` to `KNOWN_EXECUTORS` in `system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs`, in the same change as T016/T017.
- [ ] T026 In `buildDevinLineageCommand` (`fanout-run.cjs`), validate `model` against `DEVIN_SUPPORTED_MODELS` (T007) and throw a clean, typed error before constructing the command when it's not a member — REQ-014's fail-closed allowlist enforcement.
- [ ] T027 In `dispatch-model.cjs`'s `case 'cli-devin':` (T017), add the same `DEVIN_SUPPORTED_MODELS` validation before constructing the spawn spec — REQ-015, so the model-benchmark lane can't bypass T026's restriction.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T019 Add `cli-devin` acceptance/flag-support cases to `executor-config.vitest.ts`, mirroring the existing `cli-codex` cases (accepts supported flags; rejects unsupported ones).
- [ ] T020 Add `cli-devin` audit-map coverage to `executor-audit.vitest.ts`, mirroring the existing `cli-codex` ancestry/env-detection cases.
- [ ] T021 Add a `cli-devin` command-construction test plus a fail-closed absent-binary test to `fanout-run.vitest.ts`, mirroring the existing `'fanout-run.cjs — cli-codex adapter'` describe block, including the `'fails closed before command construction when codex is absent'` case ported to `cli-devin`.
- [ ] T022 Confirm `remediation.vitest.ts` (and any direct `KNOWN_EXECUTORS` import checks) reflect the new `cli-devin` entries in both `dispatch-model.cjs` and `profile-validator.cjs`.
- [ ] T023 Run the 4 focused Vitest files; confirm 100% pass with zero changes to any pre-existing `native`/`cli-codex`/`cli-claude-code`/`cli-opencode` assertion.
- [ ] T024 Run strict typecheck on the 2 changed `.ts` modules (`executor-config.ts`, `executor-audit.ts`).
- [ ] T025 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 002-deep-loop-executor-support --strict`.
- [ ] T028 Add an off-allowlist model test to `fanout-run.vitest.ts` (e.g. `model: 'gpt-5.6-sol'`), proving `buildDevinLineageCommand` throws before any subprocess spawn attempt — SC-006's fan-out half.
- [ ] T029 Add the equivalent off-allowlist model test to `dispatch-model.cjs`'s own test coverage (or `remediation.vitest.ts` if that's where its cases live) — SC-006's model-benchmark half.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All REQ items in `spec.md` implemented, each with passing test coverage.
- [ ] Zero regressions in existing `native`/`cli-codex`/`cli-claude-code`/`cli-opencode` test assertions.
- [ ] `checklist.md` fully verified with evidence.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- `spec.md`
- `plan.md`
- `checklist.md`
- `../001-devin-contract-pin/implementation-summary.md` (source contract)
- `../003-cli-devin-skill-packet/` (consumes this phase's runtime acceptance)
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
