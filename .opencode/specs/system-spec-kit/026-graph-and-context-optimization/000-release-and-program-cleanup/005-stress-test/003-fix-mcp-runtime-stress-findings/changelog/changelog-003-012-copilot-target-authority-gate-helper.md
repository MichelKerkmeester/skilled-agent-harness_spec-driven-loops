---
title: "Copilot Target-Authority Helper: close P0 cli-copilot Gate 3 bypass"
description: "Closes the v1.0.2 cli-copilot Gate 3 bypass at the executor-config layer. Every cli-copilot deep-loop dispatch now carries a typed authority token that names the workflow-resolved spec folder. Recovered context (memory hits, bootstrap-context folders, graph pointers) cannot pose as write authority."
trigger_phrases:
  - "copilot target authority helper"
  - "buildCopilotPromptArg"
  - "cli-copilot Gate 3 bypass fix"
  - "targetAuthority discriminated union"
  - "P0 cli-copilot mutation remediation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/012-copilot-target-authority-gate-helper` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

The v1.0.2 stress-test rerun caught cli-copilot autonomously selecting and mutating `009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/graph-metadata.json` without operator authorization. The root cause was a target-authority failure: `deep_start-research-loop_auto.yaml` and `deep_start-review-loop_auto.yaml` passed rendered prompts directly to `copilot --allow-all-tools --no-ask-user` with no schema to distinguish the workflow-approved write target from recovered context (memory hits, bootstrap folders, graph `last_active_child_id`). The model treated any plausible folder name in the prompt body as a valid mutation target.

This packet closes the bypass at the executor-config layer. A `buildCopilotPromptArg` helper and a `CopilotTargetAuthority` discriminated union were added next to `resolveCopilotPromptArg` in `executor-config.ts`. Approved authority prepends a `## TARGET AUTHORITY` preamble naming the spec folder and explicitly forbids recovered-context override. Missing authority on a write-intent dispatch replaces the entire prompt with a Gate-3 clarifying question and strips `--allow-all-tools`, turning the dispatch into a plan-only ask. Both `_auto.yaml` call sites were rewired through the helper. The deep-review path was unified onto Node-based dispatch in the process. A 29-test vitest suite verifies all three branches, override resistance, large-prompt `@PROMPT_PATH` wrapper behavior, specFolder validation against malformed inputs plus I1-style zero-mutation replay.

### Added

- `CopilotTargetAuthority` discriminated union (`{ kind:'approved', specFolder }` or `{ kind:'missing', writeIntent }`) exported from `executor-config.ts`
- `buildCopilotPromptArg` helper function (roughly +150 LOC) with two sub-builders: `buildTargetAuthorityPreamble` and `buildMissingAuthorityGate3Prompt`
- `validateSpecFolder` validator rejecting empty strings, whitespace, literal-template placeholders, `undefined`/`null`/`none` sentinels plus strings containing control characters
- `promptFileBody` output field so `@PROMPT_PATH` wrapper paths carry the authority preamble inside the referenced file rather than only in argv
- `executor-config-copilot-target-authority.vitest.ts` with 29 test cases across 6 describe blocks covering the behavior matrix, override resistance, large-prompt fallback, specFolder validation (12 cases) plus I1-replay zero-mutation

### Changed

- `deep_start-review-loop_auto.yaml` `if_cli_copilot.command` block replaced with a helper-routed Node script. Unifies on Node-based dispatch, removing the prior bash and `wc -c` heredoc shape. Adds 2 explanatory notes lines.
- `deep_start-research-loop_auto.yaml` `if_cli_copilot.command` block replaced with the same helper-routed Node script. Resolves `targetAuthority` from the `{spec_folder}` template. Falls back to Gate-3 enforcement when the template is absent or resolves to a sentinel value.

### Fixed

- cli-copilot could mutate any spec folder whose name appeared in session-bootstrap or memory-hit context. The `## TARGET AUTHORITY` preamble and the `validateSpecFolder` guard together close this pathology.
- Large-prompt `@PROMPT_PATH` wrapper path previously placed the authority preamble only in argv, not in the file Copilot read via `@path`. Bootstrap-folder mentions inside the file could still anchor the model. The `promptFileBody` output field patches the file before dispatch.
- Literal `{spec_folder}` placeholders, whitespace-only strings plus `"undefined"` sentinels in YAML template resolution were previously treated as approved authority. `validateSpecFolder` now coerces all of these to `kind:'missing', writeIntent:true` (safe-fail to plan-only).

### Verification

| Check | Result |
|-------|--------|
| New vitest (`executor-config-copilot-target-authority.vitest.ts`) | PASS. Tests 29 passed (29). Exit 0. |
| Existing executor-config vitest (`tests/unit/executor-config.vitest.ts`) | PASS. Tests 24 passed (24). Exit 0. |
| Combined executor-config surface | PASS. Tests 53 passed (53). Exit 0. 218ms. |
| `buildCopilotPromptArg` exported from `executor-config.ts` | PASS. `grep -n "export function buildCopilotPromptArg"` returns 1 hit. |
| `deep_start-review-loop_auto.yaml` imports `buildCopilotPromptArg` | PASS. Import and call site present at lines 798 and 822. |
| `resolveCopilotPromptArg` body byte-stable | PASS. Sibling helper added below it. Existing function untouched. |
| `validate.sh --strict` on packet | PASS (structural). 0 structural errors. SPEC_DOC_INTEGRITY false-positives accepted as known noise matching the 010 and 011 baseline. |
| Override resistance | PASS. Vitest case confirms preamble appears first and contains the explicit "cannot override" line even when the prompt body embeds a competing folder name. |
| I1-style zero-mutation replay | PASS. Vitest describe block confirms `enforcedPlanOnly === true`. `--allow-all-tools` absent. Recovered-context folder name absent from the rendered prompt body. |
| Read-only behavior unchanged | PASS. `kind:'missing', writeIntent:false` cases confirm prompt and argv match prior contract. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modified | `CopilotTargetAuthority` type. `buildCopilotPromptArg` helper. `validateSpecFolder`. `buildTargetAuthorityPreamble`. `buildMissingAuthorityGate3Prompt`. `promptFileBody` output field on approved over-threshold path. Roughly +210 LOC total across both authoring passes. |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modified | `if_cli_copilot.command` block replaced with helper-routed Node script. Node-based dispatch replaces bash + `wc -c` shape. Two explanatory notes lines added. `promptFileBody` write step added. |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Modified | `if_cli_copilot.command` block replaced with helper-routed Node script. Resolves `targetAuthority` from `{spec_folder}`. Falls back to Gate-3 enforcement on absent or sentinel value. |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-config-copilot-target-authority.vitest.ts` (NEW) | Created | 29 test cases across 6 describe blocks. |

### Follow-Ups

- Port `buildCopilotPromptArg` into `deep_start-research-loop_confirm.yaml` and `deep_start-review-loop_confirm.yaml` for symmetry. These paths require operator confirmation per dispatch and do not exhibit the v1.0.2 pathology, so this is operator preference rather than a P0.
- Run a live cli-copilot dispatch on the next deep-research or deep-review run. Confirm the `## TARGET AUTHORITY` preamble appears in the rendered iteration prompt and zero unauthorized folder mutations occur.
- If any consumer imports `executor-config` from a compiled `dist/` artifact, run `tsc -b` to rebuild parity. The YAML uses `--experimental-strip-types` to load TS directly, so the rebuild is not strictly required for the helper to take effect.
