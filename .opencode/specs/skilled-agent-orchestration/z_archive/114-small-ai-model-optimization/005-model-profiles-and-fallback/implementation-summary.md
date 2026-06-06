---
title: "Implementation Summary: shared model intelligence"
description: "Phase 005 shipped shared small-model registry, Bayesian scoring contracts, and quota-pool-aware fallback."
trigger_phrases:
  - "shared intelligence summary"
  - "phase 005 implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/005-model-profiles-and-fallback"
    last_updated_at: "2026-05-18T16:58:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented Phase 005 registry, Bayesian scoring, and quota-pool-aware fallback"
    next_safe_action: "Review diffs and commit the explicit Phase 005 path list"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/assets/model-profiles.json"
      - ".opencode/skills/sk-prompt/references/model-profiles.md"
      - ".opencode/skills/cli-devin/references/quota-fallback.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/bayesian-scorer.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000045"
      session_id: "114-005-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Haiku and Gemini Flash remain optional-unverified stubs until the operator adopts and verifies them."
      - "Cross-packet Bayesian aggregation remains future work; Phase 005 state is per-iter scratch."
    answered_questions:
      - "Registry scope is 4 required active models plus 2 optional stubs; GLM-5.1, gpt-5.5, Opus, and Sonnet are excluded."
      - "Fallback is quota-pool-aware fail-fast by default, not small-to-frontier escalation."
      - "All new recipe features remain off by default: bayesian_scoring_enabled false, fallback_chain empty, verification_enabled false."
---

# Implementation Summary: shared model intelligence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status**: Implemented. Registry is data-only; Bayesian scoring and fallback remain opt-in / fail-fast by default.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | skilled-agent-orchestration/114-small-ai-model-optimization/005-model-profiles-and-fallback |
| **Level** | 3 |
| **Status** | Implemented |
| **Effort** | ~20 hours planned; implemented in focused pass |
| **Priority** | P2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Built

- Created `sk-prompt/assets/model-profiles.json` with 6 entries: 4 active required models (`swe-1.6`, `deepseek-v4-pro`, `kimi-k2.6`, `qwen3.6`) plus 2 optional-unverified stubs (`haiku`, `gemini-flash`).
- Created `sk-prompt/references/model-profiles.md` covering schema fields, active model table, optional stub adoption checklists, quota-pool semantics, update protocol, and RQ3 / iter-008 citations.
- Updated `cli-devin/SKILL.md` and `cli-opencode/SKILL.md` §3 with cross-references to the shared registry.
- Updated the three cli-devin agent-config recipes with `bayesian_scoring_enabled: false`, `bayesian_score_file`, `fallback_chain: []`, and conditional system-instruction contracts.
- Added per-iter Bayesian score-file format documentation to `cli-devin/references/output-verification.md`.
- Created `system-spec-kit/mcp_server/lib/deep-loop/bayesian-scorer.ts` with `computeScore()` and `shouldDemote()`.
- Added `system-spec-kit/mcp_server/tests/deep-loop/bayesian-scorer.vitest.ts` with Laplace smoothing, threshold, and validation coverage.
- Created `cli-devin/references/quota-fallback.md` documenting the revised ADR-001 fallback rules, pool table, algorithm, worked examples, adoption checklists, and error templates.
- Created `system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts` with one-step quota-pool-aware fallback resolution.
- Added `system-spec-kit/mcp_server/tests/deep-loop/fallback-router.vitest.ts` covering 16 required source/target combinations plus optional Haiku/Gemini adoption and error paths.
- Updated `sk-small-model/references/pattern-index.md` to mark model-profile registry, Bayesian tool scoring, and quota-pool-aware fallback as shipped.
- Updated `sk-prompt/assets/cli_prompt_quality_card.md` with a model-profile registry cross-reference.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Actual sequence

1. Re-read the Phase 005 spec, plan, tasks, checklist, revised ADR-001, RQ3 + iter-008 research, Phase 004 budget asset, cli-devin/cli-opencode model-selection sections, recipe JSON files, prompt quality card, output-verification doc, and small-model pattern index.
2. Authored the registry first with the revised slim scope and `fallback_target: null` for every entry.
3. Added the registry reference doc and CLI cross-references without restructuring the owning skills.
4. Added Bayesian opt-in fields and instructions to all three cli-devin recipes, preserving `verification_enabled: false`.
5. Added the minimal scorer helper and focused tests for the Laplace formula and demotion threshold.
6. Authored the quota-fallback reference doc and one-step fallback router helper.
7. Added fallback-router tests for required model pairs, default fail-fast, optional target adoption, unknown source, and missing target.
8. Updated cross-reference assets and packet docs, then ran JSON, TypeScript, unit, empirical, and strict validation checks.

### Deviations

- The stale packet wording around "8 models", "gpt-5.5 escalation", and `escalation.md` was corrected in task/checklist evidence to match the user prompt and revised ADR-001.
- No separate Bayesian reference doc was created. The protocol lives in recipe contracts and `output-verification.md`, as requested.
- No memory DB save or advisor re-index was run because this was an implementation handoff, not a `/memory:save` request. Packet continuity frontmatter was updated.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- ADR-001 accepted: quota-pool-aware fallback with one-step max; same-pool fallback rejected; fail-fast when no different-pool target is configured.
- Registry scope follows the 2026-05-18 slim user direction: 4 active + 2 optional, no GLM-5.1, no gpt-5.5, no Opus, no Sonnet.
- All active `fallback_target` values stay `null` today.
- Bayesian scoring is opt-in and per-iter scratch state only.
- The TS helpers are pure and standalone; recipe defaults preserve current behavior.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Commands run

| Check | Command / Log | Result |
| --- | --- | --- |
| JSON validity | `jq empty .opencode/skills/sk-prompt/assets/model-profiles.json ...agent-config*.json` | PASS |
| Registry count | `jq` count command | PASS: `6 total / 4 active / 2 optional` |
| Reference doc size | `wc -l model-profiles.md quota-fallback.md` | PASS: 417 LOC and 479 LOC |
| Focused unit tests + empirical simulations | `/tmp/phase-005-tests.log` | PASS: 2 files, 15 tests; SWE fail-fast, Haiku adoption fallback, Cognition Pro fail-fast |
| TypeScript strict check | `npm run typecheck -- --pretty false` from `mcp_server` | PASS |
| Final strict validate | `/tmp/validate-005.log` | PASS |

### Empirical results

- `resolveFallback("swe-1.6", registry)` returns fail-fast with `cognition-free pool exhausted, no separate-pool fallback configured for swe-1.6`.
- In-memory `swe-1.6.fallback_target = "haiku"` returns fallback to `haiku`.
- `resolveFallback("deepseek-v4-pro", registry)` returns fail-fast with `cognition-pro pool exhausted, no separate-pool fallback configured for deepseek-v4-pro`.
- Bayesian scorer demotes only when `score < 0.5` and `totalCalls >= 3`; exactly `0.5` does not demote.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

### Current limitations

- Haiku and Gemini Flash remain optional-unverified metadata stubs. They must not become routing targets until the operator adopts and verifies them.
- Fallback is not recursive and does not search for a target. It only honors an explicit `fallback_target`.
- The fallback helper compares `quota_pool` labels. If the user's billing reality changes, update the registry before relying on fallback.
- Bayesian score files are per-iter scratch state; cross-packet aggregation is deferred.
- Recipe workers are instructed to record scoring state, but no dispatcher-side writer is wired in this packet.

### Next safe action

Main agent can review the explicit path list below, commit the Phase 005 changes, and re-index advisor/memory metadata if desired.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:commit-handoff -->
## Commit Handoff

### Explicit path list

- `.opencode/skills/sk-prompt/assets/model-profiles.json`
- `.opencode/skills/sk-prompt/references/model-profiles.md`
- `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md`
- `.opencode/skills/cli-devin/SKILL.md`
- `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json`
- `.opencode/skills/cli-devin/assets/agent-config-deep-review-iter.json`
- `.opencode/skills/cli-devin/assets/agent-config-synthesis.json`
- `.opencode/skills/cli-devin/references/output-verification.md`
- `.opencode/skills/cli-devin/references/quota-fallback.md`
- `.opencode/skills/cli-opencode/SKILL.md`
- `.opencode/skills/sk-small-model/references/pattern-index.md`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/bayesian-scorer.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/bayesian-scorer.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/fallback-router.vitest.ts`
- `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/005-model-profiles-and-fallback/tasks.md`
- `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/005-model-profiles-and-fallback/checklist.md`
- `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/005-model-profiles-and-fallback/decision-record.md`
- `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/005-model-profiles-and-fallback/implementation-summary.md`
<!-- /ANCHOR:commit-handoff -->
