---
title: "Hook Parity Phase 002: Copilot CLI hook parity remediation"
description: "Copilot receives startup context and advisor briefs through a managed custom-instructions block. Copilot hook output cannot mutate prompts, so file-based next-prompt delivery is the supported transport."
trigger_phrases:
  - "phase 009/002 changelog"
  - "copilot hook parity"
  - "copilot custom instructions"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-22

> Spec folder: `026-graph-and-context-optimization/007-hook-parity/002-copilot-hook-parity-remediation` (Level 3)
> Parent packet: `026-graph-and-context-optimization/007-hook-parity`

### Summary

Copilot CLI has no supported prompt-mutation hook surface. This phase implemented Outcome B: file-based custom instructions. The managed `SPEC-KIT-COPILOT-CONTEXT` block in `$HOME/.copilot/copilot-instructions.md` now receives startup context and advisor briefs on every prompt cycle. Copilot reads the refreshed block on the next prompt. Hook stdout stays `{}` per GitHub's documented hook contract.

### Added

- `hooks/copilot/custom-instructions.ts` renders and merges the managed `SPEC-KIT-COPILOT-CONTEXT` block. The merge preserves human instructions outside the markers, replaces stale managed content in place, and supports `SPECKIT_COPILOT_INSTRUCTIONS_PATH` and `SPECKIT_COPILOT_INSTRUCTIONS_DISABLED` for tests and opt-out.
- `hooks/copilot/user-prompt-submit.ts` builds the advisor brief, refreshes the custom-instructions file, emits privacy-safe diagnostics, and returns `{}`.
- `hooks/copilot/session-prime.ts` refreshes startup context into the same managed block.
- `.github/hooks/scripts/user-prompt-submitted.sh` wires the repository `userPromptSubmitted` event through the compiled writer before the Superset notification.
- cli-copilot `SKILL.md`, `README.md`, and `hooks/copilot/README.md` document the file-based parity model.
- `cli-copilot/assets/shell_wrapper.md` ships an optional `cpx()` pattern for non-interactive `copilot -p` calls that need in-turn context prepending.

### Changed

- `.github/hooks/superset-notify.json` `userPromptSubmitted` now routes through the repo-local Spec Kit wrapper before optional Superset notification.
- Copilot documentation across feature catalog entries, manual testing playbooks, and architecture docs now describes the custom-instructions transport instead of in-turn `additionalContext`.

### Fixed

- Copilot CLI sessions previously received no startup context and no advisor brief. Both are now visible through the managed custom-instructions block.
- The managed block is scoped by workspace root. Copilot is instructed to ignore the block when the active project differs.

### Verification

- `npm run typecheck`: PASS
- `npm run build`: PASS
- Focused vitest (4 files, 28 tests): PASS
- Shell syntax check on repo-local hooks: PASS
- Real Copilot smoke: PASS (managed advisor line visible)
- Temp-file doc smoke: PASS (`SPECKIT_COPILOT_INSTRUCTIONS_PATH` run returned `{}` and wrote the managed block)

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts` (NEW) | Managed block renderer preserving human instructions outside markers. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts` (NEW) | Advisor brief builder with file refresh and privacy-safe diagnostics. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts` (NEW) | Startup context refresh into the managed block. |
| `.github/hooks/scripts/user-prompt-submitted.sh` (NEW) | Repo-local wrapper for `userPromptSubmitted`. |
| `.github/hooks/superset-notify.json` | Routes through Spec Kit writer before Superset notification. |
| `.opencode/skills/cli-copilot/SKILL.md` and `README.md` | Document file-based parity model and next-prompt freshness. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts` (NEW) | Asserts file writes and privacy-safe diagnostics. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts` (NEW) | Parity tests mirroring Claude's test surface. |

### Follow-Ups

- Next-prompt freshness: Copilot sees the managed block on the next prompt after the file changes, not as true in-turn prompt mutation.
- ACP (Agent Client Protocol) remains deferred as a future dynamic-injection path once the public-preview API stabilizes.
- Packet 006 addresses a schema crash in Copilot's hook executor discovered after ship.