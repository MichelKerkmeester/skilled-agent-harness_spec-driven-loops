---
title: "Implementation Summary: Version-Suffix Flag-Name Cleanup [template:level_2/implementation-summary.md]"
description: "Summary of the hard clean rename that dropped the _V1 suffix from twelve live SPECKIT flags across fifty-two live files, with both mcp_server typechecks clean, the affected vitest suite green, zero of the twelve _V1 names left in the live tree, and every archived and historical record left untouched."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/004-dark-flag-graduation/005-flag-name-cleanup"
    last_updated_at: "2026-07-06T19:16:40.396Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Renamed twelve _V1 flags across fifty-two live files, typechecks and vitest green"
    next_safe_action: "User reviews the deliberate non-renames and commits"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-flag-name-cleanup"
      parent_session_id: "phase-008-flag-name-cleanup"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether the documented-dead SPECKIT_PIPELINE_V2 and the eval-harness SPECKIT_EVAL_V2 config knobs are in scope, they are not"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-flag-name-cleanup |
| **Completed** | 2026-06-24, status COMPLETE |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status COMPLETE. The `_V1` version suffix was dropped from twelve live SPECKIT flags across fifty-two live files in one hard clean rename with no backward-compatible alias. Both `mcp_server` typechecks exit 0, the affected vitest suite runs green at 331 tests across 23 files, and a repo-wide search confirms zero of the twelve `_V1` names remain in the live tree. Every archived record, dead run log and 028 spec-doc record kept its historical name.

### The twelve flags renamed

Each flag dropped its `_V1` suffix. The canonical-to-new mapping is `SPECKIT_LEXICAL_GROUNDING_V1` to `SPECKIT_LEXICAL_GROUNDING`, `SPECKIT_NOISE_FLOOR_SUBTRACTION_V1` to `SPECKIT_NOISE_FLOOR_SUBTRACTION`, `SPECKIT_EVIDENCE_GAP_VERDICT_V1` to `SPECKIT_EVIDENCE_GAP_VERDICT`, `SPECKIT_CITE_WITH_CAVEAT_V1` to `SPECKIT_CITE_WITH_CAVEAT`, `SPECKIT_ENVELOPE_FIDELITY_V1` to `SPECKIT_ENVELOPE_FIDELITY`, `SPECKIT_RETENTION_FORGETTING_V1` to `SPECKIT_RETENTION_FORGETTING`, `SPECKIT_SESSION_RETRIEVAL_STATE_V1` to `SPECKIT_SESSION_RETRIEVAL_STATE`, `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` to `SPECKIT_PROGRESSIVE_DISCLOSURE`, `SPECKIT_RESULT_CONFIDENCE_V1` to `SPECKIT_RESULT_CONFIDENCE`, `SPECKIT_RESULT_EXPLAIN_V1` to `SPECKIT_RESULT_EXPLAIN`, `SPECKIT_RESPONSE_PROFILE_V1` to `SPECKIT_RESPONSE_PROFILE`, and `SPECKIT_EMPTY_RESULT_RECOVERY_V1` to `SPECKIT_EMPTY_RESULT_RECOVERY`.

### The live rename surface

The rename ran over the reader `search-flags.ts`, which holds both the `isFeatureEnabled('...')` literal-arg readers and the `process.env.*` direct reads, plus the live consumers `progressive-disclosure.ts`, `session-state.ts`, `confidence-scoring.ts`, `recovery-payload.ts`, `result-explainability.ts` and `profile-formatters.ts`. It covered every affected vitest under `mcp_server/tests`, the eval scripts `run-retention-eval.mjs` and `run-retrieval-flag-eval.mjs`, the rerank benchmark arm `run_arm.py`, and the reference docs `ENV_REFERENCE.md`, `environment_variables.md`, the `manual_testing_playbook`, the `feature_catalog` and the `/memory:search` command surfaces.

### The drift-guard reconciliation

The `flag-ceiling.vitest.ts` drift guard enumerates the live `SPECKIT_*` tokens in `search-flags.ts` and asserts each is in its known or acknowledged list. Running the renamed tree surfaced that this guard was already failing on the pre-existing names, six tokens were unknown to it before the rename, five of the renamed flags plus the unrelated `SPECKIT_RELEVANCE_AWARE_GAP`. The five renamed flags plus `SPECKIT_RELEVANCE_AWARE_GAP` were added to the acknowledged list so the guard recognises the live tokens.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modified | Renamed all twelve flag readers, the most-touched file at 24 occurrences |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/*.ts` and `lib/response/profile-formatters.ts` | Modified | Renamed the flag names in the live consumers |
| `.opencode/skills/system-spec-kit/mcp_server/tests/*.vitest.ts` | Modified | Renamed every set and assert across the affected vitest files |
| `.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts` | Modified | Added the renamed flags to the drift-guard acknowledged list |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/*.mjs` and `benchmarks/.../run_arm.py` | Modified | Renamed the flag names in the live eval and benchmark consumers |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`, `references/config/environment_variables.md`, `manual_testing_playbook/**`, `feature_catalog/**`, `.opencode/commands/memory/**` | Modified | Renamed the flag names in the live reference and command docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The full version-flag set was enumerated first with `rg -oN 'SPECKIT_[A-Z0-9_]*_V[0-9]+' .opencode | sort -u`. That surfaced seventeen distinct tokens, of which twelve are the named targets. The remaining five were each classified. `SPECKIT_PIPELINE_V2` is documented dead, the feature catalog states it is not read by any code, so its only live-tree occurrences describe a removed flag by its historical name. The `SPECKIT_EVAL_V2_OUTPUT`, `SPECKIT_EVAL_V2_KS` and `SPECKIT_EVAL_V2_LIMIT` knobs in `run-eval-v2.mjs` are eval-harness config where `V2` names the harness and the env-var suffix is `_OUTPUT`/`_KS`/`_LIMIT`, not a versioned feature flag. `SPECKIT_FUSION_POLICY_SHADOW_V2` and `SPECKIT_GRAPH_QUERY_GATING_V1` live only in `z_archive` and a dead run log. `SPECKIT_GROUNDING_SIGNAL_V1` lives only in 028 spec-doc and benchmark records with no live-code reader.

The live-file list was computed by searching the twelve names under the live tree and excluding the archives, then an exact-name substitution stripped `_V1` from only the twelve names. The pattern never matched a prefix, so the eval-harness `_V2_OUTPUT` knobs and the documented-dead `PIPELINE_V2` were untouched.

The 028 spec-doc record tree under `.opencode/specs` was skipped and is listed for review. Those completed phase children, benchmark results and research deltas record the old names as they stood at ship time, so they are a historical record rather than live code or a live reference. Skipping them does not affect the live-tree zero-occurrence verification, because that verification scopes to `.opencode/skills`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Hard rename with no alias | A flag name is a runtime contract, an alias that still reads `_V1` would defeat the cleanup and leave two names live, so a stale export resolves to the unset default instead |
| Rename only the twelve exact names | A prefix match would have caught the eval-harness `SPECKIT_EVAL_V2_OUTPUT` knobs, which are not versioned feature flags |
| Leave `SPECKIT_PIPELINE_V2` as written | The catalog and changelog document it as a removed flag, so the occurrences are a record of a dead flag by its real name, renaming would corrupt that record |
| Skip the 028 spec-doc record tree | Completed phase children and benchmark records carry the old name as it stood at ship time, so they are a historical record, not a live reference |
| Acknowledge the renamed flags in the drift guard | The guard enumerates live tokens, it was already drifting on the pre-existing names, so the renamed flags were added to its acknowledged list to make the live tokens match |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Typecheck command `npx tsc --noEmit --composite false -p tsconfig.json` was run in `.opencode/skills/system-spec-kit/mcp_server` and in `.opencode/skills/system-code-graph`. The code-graph tree has no tsconfig at the literal `mcp_server` path, its tsconfig is at the skill root and covers the mcp_server sources, and no code-graph file was touched by the rename. The vitest command ran the 23 affected files under `mcp_server/tests`. The live-tree search command is `rg -o 'SPECKIT_[A-Z0-9_]*_V[0-9]+' .opencode/skills`.

| Check | Result |
|-------|--------|
| `tsc` clean in `system-spec-kit/mcp_server` | PASS, exit 0, no output |
| `tsc` clean in `system-code-graph` (root tsconfig covering mcp_server) | PASS, exit 0, no output |
| The affected vitest suite passes | PASS, 331 tests across 23 files, including the `flag-ceiling` drift guard |
| Zero of the twelve `_V1` names remain in `.opencode/skills` | PASS, zero occurrences |
| No archived record, dead log or 028 spec-doc record modified | PASS, the rename ran over an explicit live-file list excluding the archives and the spec-doc tree |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The 028 spec-doc record tree still names the old flags.** Completed phase children, benchmark results and research deltas under `.opencode/specs/system-spec-kit/028-memory-search-intelligence` carry the `_V1` names as they stood at ship time. These were skipped as historical records and are listed for the user to review whether any rollup doc among them is live enough to warrant a rename.
2. **The documented-dead `SPECKIT_PIPELINE_V2` was left as written.** Its four live-doc occurrences describe a removed flag by its historical name. If the user wants the prose modernised that is a separate documentation decision, not a flag rename.
3. **The eval-harness `SPECKIT_EVAL_V2_*` knobs were left as written.** They are harness config rather than versioned feature flags. Renaming the harness from v2 would be a separate decision.
4. **The code-graph typecheck used the skill-root tsconfig.** The verification brief named `system-code-graph/mcp_server`, which has no tsconfig of its own. The root `tsconfig.json` compiles the mcp_server sources and was used instead. No code-graph file was touched, so this target is unaffected by the rename either way.
<!-- /ANCHOR:limitations -->

---
