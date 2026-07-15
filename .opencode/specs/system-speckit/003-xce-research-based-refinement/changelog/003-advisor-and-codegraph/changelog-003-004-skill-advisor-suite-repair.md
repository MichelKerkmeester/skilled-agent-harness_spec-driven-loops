---
title: "Skill-Advisor Test-Suite Repair: Deep-Loop Merge Fallout, Governor Briefs, Settings-Parity, and Symmetry Edges"
description: "The system-skill-advisor vitest suite went from 61 failing tests to 0. The repair fixed the deep-loop-workflows merge fallout at its root (scorer fixtures, corpora, ledger, Python disambiguation, metadata allowlist), aligned brief-assertion tests with the appended fable-5 governor line, retargeted the settings-parity guard to the committed portable settings.json, and added three missing reciprocal symmetry edges so the graph-health validator passes."
trigger_phrases:
  - "003/004 skill advisor suite repair changelog"
  - "skill advisor test repair shipped"
  - "deep-loop-workflows merge test fallout"
  - "fable-5 governor brief tests"
  - "027 003/004 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/004-skill-advisor-suite-repair` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

The `system-skill-advisor/mcp_server` vitest suite reported 61 of 553 tests failing in the working tree. The dominant cause was the committed deep-loop merge, which folded the five legacy deep-* skills into one `deep-loop-workflows` node but left scorer fixtures, corpora, ledgers, the Python disambiguation layer, and the metadata-category allowlist still expecting the now-deleted legacy ids. Separately, an intentional fable-5 `GOVERNOR_DIRECTIVE` capsule appended to every advisor brief in `render.ts` broke the brief-assertion tests that hard-coded the pre-governor string. This packet drove the suite to 0 failures in two passes: a first pass fixed the 26 scorer/governor failures (61 to 36), and a second pass retargeted the settings-parity guard to the committed portable `settings.json` and added three reciprocal symmetry edges to external skill graph-metadata (36 to 0). `npm run build` is clean and the verified `render.ts` governor was left untouched.

### Added

- None. The work repairs existing tests, fixtures, baselines, and two small source/data layers; no new feature surface.

### Changed

- `scripts/skill_advisor.py` — `_apply_deep_research_disambiguation` margin contract now targets the merged `deep-loop-workflows` id (with a legacy fallback), restoring the >= 0.10 routing margin the dead legacy-id lookup had silently dropped.
- `scripts/skill_graph_compiler.py` — metadata-category allowlist extended to recognize the `workflow` and `design` categories carried by `deep-loop-workflows` and `sk-design-interface`.
- Scorer-rename fallout across test data: native-scorer council fixture, the intent-prompt corpus labels, two re-baselined parity counts (61 to 62), the CLI parity council row, the Python compat lookups (SA-011/SA-012), and the regenerated local-vs-native divergence ledger (67 to 73 entries).
- Governor brief-assertion tests (renderer, brief-producer, claude/codex hooks, codex prompt-wrapper) now expect the appended fable-5 governor line; two length/token-cap checks strip the appended suffix before measuring the capped advisor portion.
- `tests/hooks/settings-driven-invocation-parity.vitest.ts` — `SETTINGS_PATH` retargeted from the gitignored machine-local `settings.local.json` (no hooks) to the committed shared `.claude/settings.json`; only the absolute-anchor + pinned-node assertion was relaxed to accept the portable `cd "${CLAUDE_PROJECT_DIR:-$PWD}"` + bare-node command form, with every real-contract guard preserved.
- Three external skill `graph-metadata.json` files gained the missing reciprocal edges: `deep-loop-runtime` (+`prerequisite_for: deep-loop-workflows`), `mcp-code-mode` (+`prerequisite_for: mcp-figma`), `deep-loop-workflows` (+`siblings: sk-prompt`).

### Fixed

- The full vitest suite went from 61 failed / 553 to 0 failed / 553 (61 to 36 in the first pass, then 36 to 0 in the second), with `npm run build` clean and zero regressions versus the re-baselined runs.
- The Python disambiguation tie was traced to a lookup of now-absent legacy ids; pointing the winner resolver at the merged node restored the routing-quality margin instead of weakening the test.
- The settings-parity guard was validating an empty hooks block from the wrong file; it now validates the committed source of truth (41/41 assertions pass) without editing `settings.json`.
- The graph-health validator gated on three SYMMETRY asymmetries; the reciprocal edges make `skill_graph_compiler.py --validate-only` print VALIDATION PASSED and exit 0.

### Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS (exit 0) |
| First-pass baseline `npx vitest run` | 61 failed / 487 passed / 5 skipped (553) |
| First-pass result `npx vitest run` | 36 failed / 512 passed / 5 skipped (553) |
| Final `npx vitest run` | PASS: 0 failed / 548 passed / 5 skipped (553) |
| settings-driven-invocation-parity (isolated) | PASS: 41/41 |
| `skill_graph_compiler.py --validate-only` | PASS: exit 0, VALIDATION PASSED, no SYMMETRY warnings |
| Checklist (Level 2) | 13/13 P0, 13/13 P1, 2/2 P2 verified |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/python-ts-parity.vitest.ts` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-corpus-parity.vitest.ts` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-parity.vitest.ts` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/python/test_skill_advisor.py` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-renderer.vitest.ts` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-brief-producer.vitest.ts` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/codex-user-prompt-submit-hook.vitest.ts` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/codex-prompt-wrapper.vitest.ts` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/settings-driven-invocation-parity.vitest.ts` | Modified |
| `.opencode/skills/deep-loop-runtime/graph-metadata.json` | Modified |
| `.opencode/skills/mcp-code-mode/graph-metadata.json` | Modified |
| `.opencode/skills/deep-loop-workflows/graph-metadata.json` | Modified |

### Follow-Ups

- One advisory WEIGHT-PARITY warning remains in the graph validator for `mcp-figma -> mcp-code-mode` (source `depends_on` 0.45 vs reciprocal `prerequisite_for` 0.7). It is advisory only and does not gate validation; matching it downward would breach the `prerequisite_for` [0.7,1.0] band, so the minimal symmetric addition was chosen and the source weight left untouched.
- Pre-existing WEIGHT-BAND warnings on `deep-loop-workflows`, `mcp-figma`, and `sk-prompt-models` predate this packet; they are advisory and non-gating and were intentionally not touched.
