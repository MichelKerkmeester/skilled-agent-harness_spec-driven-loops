---
title: "Runtime Executor Hardening Phase 004/002: SK Deep CLI Runtime Execution"
description: "Executor selection for sk-deep-research and sk-deep-review is now a first-class YAML-owned dispatch branch. Two sub-phases shipped: 001-executor-feature (native + cli-codex) and 002-runtime-matrix (cli-gemini + cli-claude-code). 116 tests. Native path byte-for-byte identical to baseline."
trigger_phrases:
  - "phase 004/002 changelog"
  - "cli executor selection"
  - "executor config dispatch"
  - "cli-codex deep research"
  - "executorkind flag support"
  - "prompt pack template"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-2-merges/004-runtime-executor-hardening` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-2-merges/004-runtime-executor-hardening`

### Summary

`sk-deep-research` and `sk-deep-review` originally hardcoded `model: opus` at YAML dispatch and forbade direct CLI-in-a-loop. This phase made executor selection a first-class, YAML-owned dispatch branch with a Zod-validated config schema, per-kind flag compatibility, and JSONL audit logging. The feature built itself using the executor it was shipping (cli-codex gpt-5.4 high fast dogfooding). Two sub-phases shipped on the same day: 001-executor-feature (native + cli-codex, 62 new tests) and 002-runtime-matrix (cli-gemini + cli-claude-code, adding 54 more tests). A 30-iteration deep-research dogfood pass via cli-codex produced 12 R-IDs (R1-R12), closed in a downstream remediation packet.

### Added

- `executor-config.ts` with Zod schema, `parseExecutorConfig`, and discriminated-union validation. Rejects invalid kind/flag combinations at config-write time via `EXECUTOR_KIND_FLAG_SUPPORT` per-kind compatibility map.
- 4 YAMLs patched with `branch_on: "config.executor.kind"` dispatch branching (sk-deep-research auto + confirm, sk-deep-review auto + confirm).
- Prompt-pack templates: `sk-deep-research/assets/prompt_pack_iteration.md.tmpl` and `sk-deep-review/assets/prompt_pack_iteration.md.tmpl`. Executor-agnostic markdown that strips model-specific directives from the iteration prompt.
- Setup phase flag parsing: `--executor`, `--model`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`.
- JSONL audit field `executor: {kind, model, reasoningEffort, serviceTier}` per iteration in both skills.
- SKILL.md CONTRACT sections updated for both iterative skills documenting the executor-selection surface.
- Three additional executor kinds beyond cli-codex: `cli-gemini`, `cli-claude-code`, `cli-copilot`. Each has per-kind flag validation rejecting invalid combinations (e.g., service-tier on non-codex kinds).
- Copilot 3-concurrent dispatch cap preserved per user memory `feedback_copilot_concurrency_override`.

### Changed

- YAML dispatch invariants preserved across all executors. The `step_dispatch_iteration` step now branches on `config.executor.kind` rather than hardcoding `model: opus`. State ownership, reducer exclusivity, convergence detection, and lifecycle events remain skill-owned regardless of executor kind.
- CF-026 remediation (2026-04-24): codex/gemini/claude permission controls made executable. Subprocess smoke coverage added for Copilot wrapper. Audited failure paths documented.

### Fixed

- Native path regression: byte-for-byte identical iteration output compared to pre-feature baseline.
- R1-R12 findings from the 30-iteration deep-research dogfood pass closed in the downstream `002-cli-executor-remediation` packet.
- Known blocker: cli-copilot still requires `--allow-all-tools`. No narrower CLI permission surface available at this time.

### Verification

- Sub-phase 001 (executor-feature): 40/40 vitest tests pass. `tsc --noEmit` clean. 22 files touched. ~2h wall-clock via cli-codex dogfooding.
- Sub-phase 002 (runtime-matrix): 54/54 vitest tests across 5 suites. `tsc --noEmit` clean. ~1.5h wall-clock.
- Combined: 116 tests (up from 54 pre-feature). 13 test files (up from 5). Zero TypeScript errors.
- CF-026 remediation (2026-04-24): additional subprocess smoke coverage for Copilot wrapper.

### Files Changed

| File | What changed |
|------|--------------|
| `executor-config.ts` (NEW) | Zod schema + `parseExecutorConfig` + discriminated-union validation + `EXECUTOR_KIND_FLAG_SUPPORT`. |
| `sk-deep-research/assets/prompt_pack_iteration.md.tmpl` (NEW) | Executor-agnostic iteration prompt template. |
| `sk-deep-review/assets/prompt_pack_iteration.md.tmpl` (NEW) | Executor-agnostic iteration prompt template. |
| 4 YAML dispatch files | `branch_on: "config.executor.kind"` for native, cli-codex, cli-gemini, cli-claude-code, cli-copilot. |
| SKILL.md (both skills) | CONTRACT sections updated with executor-selection surface. |
| Test suites (13 files) | executor-audit, post-dispatch-validate, dispatch-failure, prompt-pack render, per-kind flag validation. |

Two sub-phase commits plus CF-026 remediation commit. Consolidation at packet level had zero source code changes (folder structure and cross-references only).

### Follow-Ups

- **cli-copilot `--allow-all-tools` blocker**: Copilot CLI requires broad tool permissions. Narrower permission surface is a future enhancement.
- **Downstream remediation**: R1-R12 findings from dogfood pass closed in `002-cli-executor-remediation` packet.