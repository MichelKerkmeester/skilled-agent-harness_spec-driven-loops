---
title: "Implementation Summary: Deep loop executor config-dir override"
description: "Deep-loop fan-out can now route individual cli-claude-code seats through a caller-provided Claude config directory."
trigger_phrases:
  - "deep-loop configDir implementation"
  - "Fable Claude account routing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/013-deep-loop-executor-config-dir"
    last_updated_at: "2026-06-10T16:50:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed per-executor Claude config-dir routing"
    next_safe_action: "Use --config-dir for Fable Claude fan-out seats"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-executor-config-dir-20260610"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The override is implemented as CLAUDE_CONFIG_DIR in the spawned process env, not as a new Claude CLI arg."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/skilled-agent-orchestration/140-deep-loop-executor-config-dir` |
| **Completed** | 2026-06-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep-loop fan-out can now route an individual `cli-claude-code` lineage through a caller-provided Claude config directory. This lets a Fable 5 seat use the account at `~/.claude-account2` without applying that account override to Codex, OpenCode, native seats, or the parent process.

### Executor Config Field

`executorConfigSchema` now includes `configDir` as an optional nullable string. It trims and rejects blank input, and per-kind support permits it only for `cli-claude-code`, so non-Claude executors cannot silently accept Claude account routing fields.

### Fanout Environment Injection

`fanout-run.cjs` now expands `~` and `~/...` with `os.homedir()` and merges `CLAUDE_CONFIG_DIR` into the per-lineage env only when the lineage kind is `cli-claude-code` and `configDir` is set. The merge happens after `buildExecutorDispatchEnv(lineage, process.env)`, so it composes with the existing `CLAUDE_` allowlist and with per-replica state-dir isolation.

### Command Setup Plumbing

`start-review-loop.md` and the shared `start-research-loop.md` setup contracts now document `--config-dir=PATH`, the `executor_config_dir` marker field, and repeatable fan-out group support. The review auto YAML also carries `configDir` through the single-executor binding and documents `CLAUDE_CONFIG_DIR` export for single auto Claude dispatches.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modified | Added `configDir` schema field and `cli-claude-code` support. |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified | Added home expansion and scoped `CLAUDE_CONFIG_DIR` injection. |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts` | Modified | Added configDir validation coverage. |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modified | Added set/absent env propagation coverage. |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-audit.vitest.ts` | Modified | Aligned typed fixtures with parsed executor shape. |
| `.opencode/skills/deep-loop-runtime/tests/unit/dispatch-failure.vitest.ts` | Modified | Aligned typed fixtures with parsed executor shape. |
| `.opencode/commands/deep/start-review-loop.md` | Modified | Documented `--config-dir=PATH` mapping. |
| `.opencode/commands/deep/start-research-loop.md` | Modified | Kept sibling setup contract aligned. |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modified | Added `configDir` binding and single auto Claude env hint. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change stayed inside the deep-loop executor configuration and fanout spawn path. Verification used focused schema/unit tests plus a stubbed `claude` binary, so the exact spawned command and environment were proven without running a full Claude dispatch.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `CLAUDE_CONFIG_DIR` in the spawned env instead of a Claude CLI argument | The verified working command uses the environment variable, and `buildExecutorDispatchEnv` already allowlists `CLAUDE_` for this executor kind. |
| Support `configDir` only for `cli-claude-code` | Other executors do not consume Claude account directories, so accepting the field there would hide user mistakes. |
| Expand only `~` and `~/...` | This matches the requested account path without introducing user-home lookup or shell-specific expansion behavior. |
| Keep real Claude dispatch out of verification | A stub proves argv and env propagation without consuming account quota or writing real lineage artifacts. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Requested `cd .opencode/skills/deep-loop-runtime && npx tsc --noEmit -p tsconfig.json` | FAIL: `error TS5058: The specified path does not exist: 'tsconfig.json'.` The skill has no local tsconfig. |
| Focused TypeScript no-emit with temp config | PASS: `npx tsc --noEmit -p /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode/deep-loop-tsconfig.json` completed with no output. `noImplicitAny` was disabled only to bypass existing transitive `better-sqlite3` declaration gaps outside the changed executor files. |
| Requested bare Vitest command | FAIL: bare `npx vitest run tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts tests/unit/executor-audit.vitest.ts` reported `No test files found` because the local default include excludes `*.vitest.ts`. |
| Focused Vitest with temp include config | PASS: 3 test files passed, 78 tests passed. |
| Stub smoke with `configDir=~/.claude-account2` | PASS: captured `COMMAND=claude`, argv contains `--model claude-fable-5`, and env contains `CLAUDE_CONFIG_DIR=/Users/michelkerkmeester/.claude-account2`. |
| Stub smoke without `configDir` | PASS: captured `CLAUDE_CONFIG_DIR=` and no account path. |
| Comment hygiene | PASS: modified code/test files clean when run through the Python hygiene checker. |
| Alignment drift: `.opencode/skills/deep-loop-runtime` | PASS: scanned 77 files, findings 0, errors 0, warnings 0, violations 0. |
| Alignment drift: `.opencode/commands/deep` | PASS: scanned 0 files, findings 0, errors 0, warnings 0, violations 0. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No local deep-loop tsconfig exists.** The exact requested TypeScript command cannot run until the skill grows a local `tsconfig.json` or the root config includes deep-loop sources.
2. **Bare Vitest does not discover `.vitest.ts` files in this directory.** A temporary Vitest config was required to run the requested focused files.
3. **Confirm-mode YAML was not changed.** The requested writable YAML surface named the review auto YAML; fan-out behavior is covered because confirm/auto fan-out both route through `fanout-run.cjs` when given fanout JSON.
<!-- /ANCHOR:limitations -->
