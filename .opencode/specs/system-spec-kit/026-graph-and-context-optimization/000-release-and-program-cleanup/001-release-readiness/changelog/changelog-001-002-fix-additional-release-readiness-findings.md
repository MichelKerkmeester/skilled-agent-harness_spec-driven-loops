---
title: "Release Readiness 001-002: Tier 2 Remediation, Close D/E/F/G Findings"
description: "Fifteen actionable findings from the Tier 2 deep-review program were closed across four source packets. Copilot hook transport was documented, plugin-loader path drift was corrected, Copilot hook routing was restored and deep-research-review state hygiene was resolved. Tier 2 H (license audit P0) was deferred to a human-action gate."
trigger_phrases:
  - "tier 2 remediation findings"
  - "copilot hook next-prompt limitation"
  - "plugin-loader path drift correction"
  - "superset-notify hook routing fix"
  - "deep-research-review state hygiene"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-28

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/002-fix-additional-release-readiness-findings` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness`

### Summary

The Tier 2 deep-review program returned four CONDITIONAL verdicts and one FAIL across five packets (D through H). The CONDITIONAL packets carried 8 P1 and 7 P2 findings. The FAIL on H was a license-audit P0 that could not be resolved without a human reading the actual gitignored `external/LICENSE` file on disk.

This remediation phase closed all 15 actionable findings across D/E/F/G and left H in a documented human-action gate. Finding D (008/007 skill-advisor hook surface) was resolved by accepting and documenting the Copilot next-prompt transport limitation as an explicit caveat in the decision record, then aligning the checklist with implementation evidence. Finding E (009/005 plugin-loader) was resolved by correcting stale `.opencode/plugin-helpers/` path evidence across canonical docs to the live `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/` location. Compact plugin output-array guards and cache keys were also hardened in code. Finding F (009/002 Copilot hook parity) was resolved by restoring repo-local wrappers before Superset notification and adding a workspace-scoped custom-instructions retention contract with per-target lock and atomic rename. Finding G (006/008 deep-research-review) was resolved by correcting lifecycle state, metadata path drift and sibling 006/007 ledger contradictions.

Focused vitest suites across 4 test files passed (36 tests) and the TypeScript build exited 0. Packet validator runs surfaced structural template debt in several touched packets but did not block the substantive closures.

### Added

- Acceptance criteria (AC-008-1 through AC-008-6) added to 006/008 spec to satisfy missing scope-readiness gate
- Artifact contract listing actual prompts/deltas/logs/iterations added to 006/008 spec
- `__tier2-h-deferred.md` documenting the required human-action steps for the P0 license audit
- Workspace-scoped custom-instructions managed-block contract covering retention, per-target lock and atomic rename
- `buildCopilotPromptArg` large-prompt `@path` behavior verified by existing focused real-subprocess coverage in `.opencode/skills/deep-loop-runtime/tests/unit/cli-matrix.vitest.ts`

### Changed

- 006/008 deep-research-review spec updated from planned-to-start framing to completed-loop status (convergence 0.93)
- 006/008 description.json and graph-metadata.json corrected from stale `010` path prefix to live `006` prefix
- 006/007 tasks, checklist and implementation-summary aligned to completed state with backfilled evidence
- 009/005 canonical docs updated from stale `.opencode/plugin-helpers/` paths to live `mcp_server/plugin_bridges/` paths
- 008/007 checklist marked complete with file-and-line evidence. Copilot next-prompt limitation caveat added to spec.

### Fixed

- `.github/hooks/superset-notify.json` repo-local Copilot hook wrappers restored so `sessionStart` and `userPromptSubmitted` route through the Spec Kit writer before optional Superset notification
- Plugin compact output guards and stable object-sessionID cache keys corrected in `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/`
- 006/008 metadata path drift from `010` to `006` corrected across description.json, graph-metadata.json and spec frontmatter
- 006/007 sibling contradictions resolved by aligning tasks, checklist and implementation-summary to completed state

### Verification

- Focused vitest suite: 4 test files, 36 tests passed (`copilot-user-prompt-submit-hook.vitest.ts`, `copilot-hook-wiring.vitest.ts`, `opencode-plugin.vitest.ts`, `.opencode/skills/deep-loop-runtime/tests/unit/cli-matrix.vitest.ts`)
- TypeScript build (`npm run build`): exit 0
- All 15 D/E/F/G findings documented with disposition in implementation-summary.md Finding Disposition table
- H-P0 license audit deferred to human action in `__tier2-h-deferred.md`
- Strict packet validator: surfaced template-anchor debt in touched packets. Focused test gate passed.

### Files Changed

| File | What changed |
|------|--------------|
| `.github/hooks/superset-notify.json` | Repo-local Copilot hook wrappers restored for `sessionStart` and `userPromptSubmitted` |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs` | Output-array guards added. Object-sessionID cache keys stabilized. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts` | Verification tests for Copilot hook routing |
| `.opencode/skills/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts` | Verification tests for Copilot user-prompt-submit hook |
| `.opencode/skills/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts` | Verification tests for plugin output guards and cache keys |
| `002-fix-additional-release-readiness-findings/__tier2-h-deferred.md` (NEW) | Human-action gate documenting P0 license audit steps |

### Follow-Ups

- Verify actual `external/LICENSE` on disk and close H-P0. The automated pass could not substitute or auto-remediate canonical license text.
- Copilot next-prompt freshness is an accepted transport limitation until upstream supports same-turn prompt mutation or stable ACP context injection.
- Re-run strict packet validator against touched packets (008/007, 009/002, 006/008) after template-anchor debt is resolved in a separate hygiene pass.
