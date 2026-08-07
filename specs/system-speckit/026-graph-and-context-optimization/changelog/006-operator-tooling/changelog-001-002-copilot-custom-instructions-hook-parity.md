---
title: "Hook Parity 002: Copilot CLI Custom-Instructions Parity"
description: "Shipped outcome B: a managed custom-instructions block written to $HOME/.copilot/copilot-instructions.md so Copilot CLI sessions receive the skill-advisor brief and workspace context, while hook stdout remains {} as GitHub's hook contract requires."
trigger_phrases:
  - "copilot custom instructions parity"
  - "copilot hook parity remediation"
  - "copilot managed context block"
  - "copilot advisor brief workaround"
  - "copilot user-prompt-submit hook"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-22

> Spec folder: `026-graph-and-context-optimization/006-operator-tooling/001-hook-parity/002-copilot-custom-instructions-hook-parity` (Level 3)
> Parent packet: `026-graph-and-context-optimization/006-operator-tooling/001-hook-parity`

### Summary

Claude Code sessions received startup code-graph context and per-prompt skill-advisor briefs through native hooks. Copilot CLI sessions received nothing because GitHub's hook contract silently discards hook output: `sessionStart` output is ignored and `userPromptSubmitted` cannot modify the model-visible prompt. No amount of TypeScript hook logic could bridge this gap by returning `additionalContext`.

Investigation across 10 research iterations confirmed that `$HOME/.copilot/copilot-instructions.md` is Copilot CLI's supported local custom-instructions surface. Outcome B was selected: write a managed `SPEC-KIT-COPILOT-CONTEXT` block into that file on each hook event. Copilot reads the refreshed block on the next submitted prompt, which is the closest achievable parity without an unsupported API.

The implementation added a custom-instructions writer (`hooks/copilot/custom-instructions.ts`) and rewired the `userPromptSubmitted` repo hook through a repo-local wrapper that invokes the writer before optional Superset notification. A real `copilot -p` smoke on 2026-04-22 confirmed that the managed advisor line was visible from custom instructions. Hook parity for Codex CLI is covered by a successor phase.

### Added

- `hooks/copilot/custom-instructions.ts` writer that renders the advisor brief and workspace context into a managed `SPEC-KIT-COPILOT-CONTEXT` block, preserving human-authored Copilot instructions outside the markers
- `hooks/copilot/user-prompt-submit.ts` hook that builds the advisor brief, refreshes the custom-instructions file, and returns `{}` as required by GitHub's hook contract
- `hooks/copilot/session-prime.ts` hook that refreshes startup context into the managed block at session start
- `.github/hooks/scripts/user-prompt-submitted.sh` repo-level wrapper that routes `userPromptSubmitted` events through the Spec Kit writer before Superset notification
- Workspace-scoped managed block with a Copilot ignore-mismatch instruction, so stale context from a different repository root is not treated as current
- Atomic write path using a per-target lock and temp-file rename to prevent partial writes
- `SPECKIT_COPILOT_INSTRUCTIONS_PATH` and `SPECKIT_COPILOT_INSTRUCTIONS_DISABLED` env vars for test overrides and operator opt-out
- Optional `cpx()` shell wrapper pattern in `cli-copilot/assets/shell_wrapper.md` for non-interactive `copilot -p` callers that need the managed block prepended in the same invocation

### Changed

- `cli-copilot/SKILL.md` and `README.md` updated to state the file-based parity model explicitly: next-prompt fresh, not in-turn `additionalContext`
- `hooks/copilot/README.md` updated with the actual parity transport and lifecycle contract
- Feature catalog entries updated to reflect outcome B and the managed block approach
- Manual testing playbook (`22--context-preservation-and-code-graph/252-cross-runtime-fallback.md`) updated with the Copilot custom-instructions smoke procedure
- Parent `001-hook-parity/implementation-summary.md` updated with phase outcome and reference to this packet

### Fixed

- Copilot CLI sessions had no skill-advisor brief or startup context. The managed custom-instructions block closes the user-visible gap for the next submitted prompt.
- Hook stdout was previously returning partial advisor data instead of `{}`, violating GitHub's hook contract. The writer now separates file output from hook return value.

### Verification

| Check | Result |
|-------|--------|
| `npm run typecheck -- --pretty false` | PASS |
| `npm run build` | PASS |
| Focused Vitest: `tests/copilot-user-prompt-submit-hook.vitest.ts`, `tests/copilot-hook-wiring.vitest.ts`, `skill-advisor/tests/legacy/advisor-runtime-parity.vitest.ts`, `tests/claude-user-prompt-submit-hook.vitest.ts` | PASS, 4 files / 28 tests |
| Focused ESLint on touched TypeScript files | PASS |
| Shell syntax: `bash -n .github/hooks/scripts/session-start.sh .github/hooks/scripts/superset-notify.sh .github/hooks/scripts/user-prompt-submitted.sh` | PASS |
| Real Copilot smoke: `copilot -p` returned `Advisor: stale; use sk-code-opencode 0.92/0.00 pass.` from custom instructions | PASS |
| Copilot temp-file smoke: `SPECKIT_COPILOT_INSTRUCTIONS_PATH` run returned `{}` and wrote `SPEC-KIT-COPILOT-CONTEXT` with advisor line | PASS |
| Operator doc sweep: hook reference, runtime hook matrix, feature catalog, manual testing playbook, README, architecture docs | PASS |
| `npm run check` | FAIL: package-wide lint reports 15 unused-variable errors in files outside this packet's write scope. No touched file is in the failure list. |
| Parent validation under `--strict` | FAIL: pre-existing PHASE_LINKS warning among sibling child specs. All other parent checks passed with `--no-recursive`. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts` (NEW) | Managed-block writer with workspace scoping, lock/atomic rename, env-var overrides |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts` (NEW) | `userPromptSubmitted` hook: builds advisor brief, calls writer, returns `{}` |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts` (NEW) | `sessionStart` hook: refreshes startup context into managed block |
| `.github/hooks/scripts/user-prompt-submitted.sh` (NEW) | Repo-local wrapper routing `userPromptSubmitted` through Spec Kit writer before Superset |
| `.opencode/skills/cli-copilot/SKILL.md` | Updated hook parity status: file-based, next-prompt fresh |
| `.opencode/skills/cli-copilot/README.md` | Updated with outcome B parity model and cpx() wrapper reference |
| `.opencode/skills/cli-copilot/assets/shell_wrapper.md` (NEW) | Optional cpx() shell pattern for non-interactive copilot -p callers |

### Follow-Ups

- Address next-prompt freshness gap. Copilot reads the managed block on the next submitted prompt after the file changes, not as true in-turn prompt mutation. A future phase could investigate ACP once the public-preview API stabilizes.
- Fix repo-wide unused-variable lint. The 15 unused-variable errors in unrelated files block `npm run check` for this packet and others. A dedicated cleanup pass should resolve these without touching this packet's scope.
- Resolve spec validation drift. This packet's strict spec validation has pre-existing template/anchor/spec-doc drift that needs a documentation cleanup pass to reach exit 0.
- Fix memory indexing failure. `generate-context.js` refreshed graph metadata but canonical spec-doc indexing failed and the post-save reviewer returned `REVIEWER_ERROR (EISDIR)`. Investigate the indexing path.
- Patch Superset wrapper generator conflict. The Superset wrapper at `~/.superset/bin/copilot` rewrites `.github/hooks/superset-notify.json` on every launch, bypassing the repo-local Spec Kit writer. A follow-on packet must either inject the writer command into the Claude wrapper entry or patch the Superset generator so the managed block refreshes per-prompt.
