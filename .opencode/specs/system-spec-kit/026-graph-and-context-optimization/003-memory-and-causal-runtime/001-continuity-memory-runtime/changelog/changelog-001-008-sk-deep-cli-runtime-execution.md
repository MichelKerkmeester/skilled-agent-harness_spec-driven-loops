---
title: "CLI Runtime Executors for Iterative Skills"
description: "Executor selection shipped as a YAML-owned dispatch branch for sk-deep-research and sk-deep-review. Two sub-phases covered: 001-executor-feature wired native and cli-codex with Zod validation plus 62 tests plus prompt-pack templates. 002-runtime-matrix added cli-gemini and cli-claude-code with per-kind flag-compatibility validation. Combined 116 tests passing, tsc clean, regression path byte-for-byte identical."
trigger_phrases:
  - "cli runtime executor selection"
  - "executor-config.ts deep-loop"
  - "sk-deep-research cli-codex dispatch"
  - "EXECUTOR_KIND_FLAG_SUPPORT"
  - "prompt pack iteration template"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/008-sk-deep-cli-runtime-execution`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime`

### Summary

`sk-deep-research` and `sk-deep-review` previously hardcoded `model: opus` at YAML dispatch and forbade CLI-in-a-loop execution. Operators had no way to route an iteration through an external CLI executor without abandoning skill-owned state, convergence detection, reducer exclusivity.

Two sub-phases shipped together on 2026-04-18. The first (001-executor-feature, ex-018) introduced `executor-config.ts` with a Zod-validated discriminated-union schema, wired `native` and `cli-codex` as the initial two executor kinds inside the existing `step_dispatch_iteration` YAML branch, extracted executor-agnostic prompt-pack templates for both skills, added setup flag parsing, then locked the regression floor at 62 new tests. The second (002-runtime-matrix, ex-019) completed the executor matrix by wiring `cli-gemini` and `cli-claude-code`, adding `EXECUTOR_KIND_FLAG_SUPPORT` per-kind flag-compatibility validation, then extending the dispatch branches across all four YAMLs. The native path was verified byte-for-byte identical to the pre-feature baseline throughout.

### Added

- `executor-config.ts` Zod schema with `parseExecutorConfig`, `resolveExecutorConfig` plus a discriminated-union validator for five executor kinds
- `EXECUTOR_KIND_FLAG_SUPPORT` per-kind flag-compatibility map rejecting invalid combinations at config-load time
- `prompt-pack.ts` template renderer with unbound-variable detection
- `post-dispatch-validate.ts` iteration file and JSONL delta invariant checker
- `executor-audit.ts` JSONL audit-field merger (skipped for native kind)
- Prompt-pack templates for deep-research and deep-review at `.opencode/skills/deep-research/assets/prompt_pack_iteration.md.tmpl` and `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl`
- 116 new vitest tests across executor-config, executor-audit, post-dispatch-validate, prompt-pack, cli-matrix suites (up from 54 pre-feature)

### Changed

- All four dispatch YAMLs (deep-research auto+confirm, deep-review auto+confirm) patched with `branch_on: "config.executor.kind"` and per-kind dispatch branches for all five executor kinds
- Both `SKILL.md` files updated with Executor Selection Contract tables marking all four CLI executors as Shipped
- `loop_protocol.md` Executor Resolution subsection expanded to document all five executor kinds with canonical dispatch shapes
- Setup flags for both command docs extended from the native-only set to include `--executor`, `--model`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`

### Fixed

- `cli-copilot`, `cli-gemini`, `cli-claude-code` executor kinds were reserved in the enum but threw `ExecutorNotWiredError` at config load. All three are now fully wired with dispatch branches and flag validation.
- Per-kind flag combinations (such as `--service-tier` on non-codex kinds) previously had no validation path. `EXECUTOR_KIND_FLAG_SUPPORT` now rejects invalid combinations with typed errors naming the incompatible field and kind.

### Verification

- Vitest (001-executor-feature): 40 of 40 tests pass. `tsc --noEmit` clean.
- Vitest (002-runtime-matrix): 54 of 54 tests pass across 5 suites. `tsc --noEmit` clean.
- Combined post-merge: 116 tests passing across 13 test files.
- Native path regression: iteration output byte-for-byte identical to pre-feature baseline.
- Changelogs published: `.opencode/changelog/deep-research/v1.8.0.0.md`, `v1.9.0.0.md`. `.opencode/changelog/deep-review/v1.5.0.0.md`, `v1.6.0.0.md`.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Zod schema, `parseExecutorConfig`, `resolveExecutorConfig`, `EXECUTOR_KIND_FLAG_SUPPORT` per-kind flag map, five executor kinds wired. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/prompt-pack.ts` (NEW) | Executor-agnostic template renderer with unbound-variable detection. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` (NEW) | Iteration file and JSONL delta invariant checker. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` (NEW) | JSONL audit-field merger, skipped for native kind. |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts` (NEW) | Config schema and flag-compatibility tests. |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-audit.vitest.ts` (NEW) | Audit field merger tests. |
| `.opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts` (NEW) | Iteration invariant checker tests. |
| `.opencode/skills/deep-loop-runtime/tests/unit/prompt-pack.vitest.ts` (NEW) | Template renderer tests. |
| `.opencode/skills/deep-loop-runtime/tests/unit/cli-matrix.vitest.ts` (NEW) | Per-kind dispatch command shape tests. |
| `.opencode/skills/deep-research/assets/prompt_pack_iteration.md.tmpl` (NEW) | Executor-agnostic prompt-pack template for deep-research. |
| `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl` (NEW) | Executor-agnostic prompt-pack template for deep-review. |
| `.opencode/skills/deep-research/SKILL.md` | Executor Selection Contract table added. All four CLI executors marked Shipped. |
| `.opencode/skills/deep-review/SKILL.md` | Executor Selection Contract table added. All four CLI executors marked Shipped. |

### Follow-Ups

- Downstream R1-R12 remediation findings from the 30-iteration deep-research dogfood pass landed in `../002-cli-executor-remediation/` (ex-020). Verify that pass is fully closed.
- `cli-copilot` still requires `--allow-all-tools` with no narrower CLI permission surface available. Track whether the Copilot CLI gains a scoped permission flag in a future release.
