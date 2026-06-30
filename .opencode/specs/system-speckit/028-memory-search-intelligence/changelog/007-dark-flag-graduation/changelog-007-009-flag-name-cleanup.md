---
title: "Changelog: Version-Suffix Flag-Name Cleanup [007-dark-flag-graduation/009-flag-name-cleanup]"
description: "Chronological changelog for the version-suffix flag-name cleanup phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-24

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/009-flag-name-cleanup` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation`

### Summary

This phase performed a hard clean rename that dropped the `_V1` version suffix from twelve live SPECKIT feature flags across fifty-two live files. The rename covered the primary flag reader, every live consumer, every vitest that set or asserted the literal env-var name and all live reference and command docs. No backward-compatible alias was introduced. Every archived record, dead run log and 028 spec-doc record was deliberately left untouched as a historical record. Both `mcp_server` typechecks exit 0 and 331 vitest tests across 23 files pass, including the `flag-ceiling` drift guard.

### Added

- Six tokens added to the `flag-ceiling.vitest.ts` drift-guard acknowledged list: the five renamed flags that the guard was already failing on before the rename plus the unrelated `SPECKIT_RELEVANCE_AWARE_GAP`.

### Changed

- All twelve `_V1` flag names renamed to their suffix-less forms in `search-flags.ts` (24 occurrences) and the live consumers `progressive-disclosure.ts`, `session-state.ts`, `confidence-scoring.ts`, `recovery-payload.ts`, `result-explainability.ts` and `profile-formatters.ts`.
- Every affected vitest under `mcp_server/tests` updated to set and assert the new suffix-less flag names.
- Live eval scripts `run-retention-eval.mjs` and `run-retrieval-flag-eval.mjs` and the rerank benchmark arm `run_arm.py` updated to the renamed flag names.
- Operator-facing reference docs `ENV_REFERENCE.md` and `references/config/environment_variables.md` updated to the renamed flag names.
- Live `manual_testing_playbook` and `feature_catalog` entries updated to the renamed flag names.
- `/memory:search` command surfaces `commands/memory/search.md` and `commands/memory/assets/search_presentation.txt` updated to the renamed flag names.

### Fixed

- No behavioral defects were addressed. This phase was a pure spelling change to the env-var contract with no change to flag default state or reader semantics.

### Verification

 - `tsc --noEmit --composite false` in `system-spec-kit/mcp_server` - PASS, exit 0, no output
 - `tsc --noEmit --composite false` in `system-code-graph` root tsconfig - PASS, exit 0, no output
 - Affected vitest suite - PASS, 331 tests across 23 files including the `flag-ceiling` drift guard
 - `rg -o 'SPECKIT_[A-Z0-9_]*_V[0-9]+' .opencode/skills` - PASS, zero occurrences of the twelve `_V1` names
 - No archived record, dead log or 028 spec-doc record modified - PASS, rename ran over an explicit live-file list excluding those paths

### Files Changed

- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`: renamed all twelve flag readers, 24 occurrences
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/*.ts` and `lib/response/profile-formatters.ts`: renamed flag names in the live consumers
- `.opencode/skills/system-spec-kit/mcp_server/tests/*.vitest.ts`: renamed flag names in every set and assert across the affected vitest files
- `.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts`: added the renamed flags and `SPECKIT_RELEVANCE_AWARE_GAP` to the drift-guard acknowledged list
- `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-retention-eval.mjs` and `run-retrieval-flag-eval.mjs` and `benchmarks/.../run_arm.py`: renamed flag names in the live eval and benchmark consumers
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` and `references/config/environment_variables.md`: renamed flag names in the operator-facing reference docs
- `.opencode/skills/system-spec-kit/manual_testing_playbook/**` and `feature_catalog/**`: renamed flag names in the live testing-playbook and feature-catalog entries
- `.opencode/commands/memory/search.md` and `commands/memory/assets/search_presentation.txt`: renamed flag names in the live `/memory:search` command surfaces

### Follow-Ups

- The 028 spec-doc record tree under `.opencode/specs/system-spec-kit/028-memory-search-intelligence` still carries the `_V1` names as they stood at ship time. The user was asked to review whether any rollup doc among them is live enough to warrant a separate rename.
- The documented-dead `SPECKIT_PIPELINE_V2` was left as written. Its live-doc occurrences describe a removed flag by its historical name. Modernising that prose is a separate documentation decision.
- The eval-harness `SPECKIT_EVAL_V2_OUTPUT`, `SPECKIT_EVAL_V2_KS` and `SPECKIT_EVAL_V2_LIMIT` knobs were left as written. They name the harness rather than a versioned feature flag.
