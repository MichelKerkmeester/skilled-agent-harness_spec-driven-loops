---
title: "003-install-scripts-doctor-realignment Phase 3: Advisor and Adjacent-116 Realignment"
description: "Applied safe sk-deep-* to deep-* renames in the optimizer manifest, gemini command and two test fixtures. Corrected the research findings for the advisor scorer. The sk-deep-* references are alias-protected and the 197-prompt corpus parity gate passes at HEAD, so the scorer changes were reverted."
trigger_phrases:
  - "advisor adjacent 116 realignment"
  - "advisor scorer alias sk-deep correction"
  - "corpus parity gate deep-research"
  - "optimizer manifest configpaths rename"
  - "sk-deep to deep rename phase 3"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-26

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/003-install-scripts-doctor-realignment/003-advisor-adjacent-116-realignment` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/003-install-scripts-doctor-realignment`

### Summary

The adjacent-116 rename pass (skill names from `sk-deep-*` to `deep-*`) had left stale references in four files outside the main operator surface: the optimizer manifest, a Gemini deep command and two test fixtures. Separately, a prior research phase had flagged two advisor-scorer corpus files as P1 live bugs based on misread behavior.

Safe renames were applied to the four files with verified path resolution. The advisor-scorer findings were investigated against the alias system in `lib/scorer/aliases.ts`, which puts both `deep-research` (canonical) and `sk-deep-research` (legacy alias) in the same canonicalization group. Running the advisor suite at HEAD confirmed the 197-prompt corpus parity gate passes without any scorer changes. The scorer files were reverted to HEAD to preserve the passing gate.

A flag comment was also added to `system-code-graph/mcp_server/core/config.ts` to document a latent `defaultDir` vs. documented-default mismatch with no behavior change.

### Added

- None.

### Changed

- `optimizer-manifest.json` `configPaths` entries updated from `sk-deep-research/assets/` and `sk-deep-review/assets/` to the verified `deep-research/assets/` and `deep-review/assets/` paths
- `.gemini/commands/deep/start-research-loop.toml` skill path references updated from `sk-deep-*` to `deep-*`
- `graph-aware-stop.vitest.ts` reducer fixture path updated to `deep-research/` (test passes after rename)
- `resource-map-extractor.vitest.ts` synthetic finding paths renamed in matched input and expected pairs
- `system-code-graph/mcp_server/core/config.ts` received a flag comment documenting the latent `defaultDir` vs. documented-default mismatch

### Fixed

- Stale `sk-deep-*` paths in the optimizer manifest pointed at asset directories that no longer exist at those locations. Updated to the post-116 `deep-*/assets/` paths with confirmed resolution.
- Over-flagged advisor-scorer corpus references (A-01 `skill_advisor_regression_cases.jsonl` and A-02 `labeled-prompts.jsonl`) were corrected. The alias system in `aliases.ts` makes `sk-deep-*` labels functionally equivalent to their `deep-*` canonical forms. The parity gate passes at HEAD without modification.

### Verification

| Check | Result |
|-------|--------|
| Advisor scorer suite (6 files) | PASS: 53 tests |
| Advisor corpus and python-ts parity gates | PASS (after revert) |
| optimizer-manifest.json validity and path resolution | PASS: valid JSON, deep-*/assets configs exist |
| Full advisor suite | 450 passed, 4 skipped, 1 pre-existing failure (graph-health, unrelated to this phase) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | Modified | configPaths entries renamed from sk-deep-* to deep-* with verified path resolution |
| `.gemini/commands/deep/start-research-loop.toml` | Modified | Skill path references updated from sk-deep-* to deep-* |
| `.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts` | Modified | Reducer fixture path updated to deep-research/ |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts` | Modified | Synthetic finding paths renamed in matched input and expected pairs |
| `.opencode/skills/system-code-graph/mcp_server/core/config.ts` | Modified | Flag comment added for latent defaultDir vs. documented-default mismatch |
| Advisor scorer / fixture / corpus (5 files) | Reverted to HEAD | Alias system makes sk-deep-* references correct. Corpus parity gate passes at HEAD. |

### Follow-Ups

- Reactivate the dead `fusion.ts` deep-research and deep-review bonus branches once a scorer owner re-blesses the 197-prompt corpus parity gate against canonical ids.
- Regenerate `graph-metadata.json` for `deep-research`, `deep-review` and `deep-agent-improvement` skills to clear stale `derived.key_files` entries pointing at moved reference docs.
- Reconcile the two contract-parity vitest files (marked FIXME) that assert a pre-116 unshipped contract shape against current shipped docs.
