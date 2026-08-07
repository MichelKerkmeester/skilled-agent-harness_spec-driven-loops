---
title: "003 Advisor Quality: Eight Surgical Scorer and Bridge Fixes"
description: "Eight orthogonal quality gaps in the skill-advisor surface were closed: Codex timeout fallback routing, OpenCode bridge silent disabled-mode, dead renderer removal, graph-causal conflict signal preservation, distinct derived trigger and keyword fields, token-stuffing dispersion guard, ranking-score ambiguity clustering plus review-plus-write disambiguation."
trigger_phrases:
  - "advisor quality fixes"
  - "F-006-B1 F-012-C2 F-013-C3"
  - "graph-causal conflict signal"
  - "token-stuffing dispersion guard"
  - "review-plus-write disambiguation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/003-fix-skill-advisor-quality` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings`

### Summary

The skill-advisor surface had eight orthogonal quality gaps that the deep-research loop had flagged but not yet closed. The Codex hook timeout path emitted a bespoke fallback string instead of routing through the shared formatter, causing format drift whenever the shared output changed. The OpenCode bridge surfaced a model-visible disabled-state message that no other runtime emits. The Codex, Claude, Copilot plus Gemini runtimes all fail open silently. Graph-causal conflict scores were dropped at lane emit so suppressive evidence from `conflicts_with` edges never reached fusion. The SQLite projection assigned the same array reference to both `derivedTriggers` and `derivedKeywords`, effectively double-counting derived signals. The fusion task-intent confidence floor let token-stuffed prompts pass as soon as any score fragment crossed the threshold. Ambiguity computation looked only at the top two confidence values and ignored the ranking score and any third-or-deeper tied candidates. And regression fixture row 26 expected `sk-code-review` for "review and update this" despite the prompt carrying a clear write-verb signal.

Eight surgical fixes landed in a single commit (`fix(026/049/003)`) without disturbing scorer module boundaries. Sub-phase 006 owns the architecture cleanup. This packet stays surgical and scoped to the eight findings.

### Added

- `renderAdvisorTimeoutFallback()` helper in `lib/render.ts` used by the Codex hook to produce a formatted stale brief
- `advisor-quality-049-003.vitest.ts` with five describe blocks covering graph-causal conflict preservation, distinct trigger and keyword fields, token-stuffing dispersion guard, ambiguity tie-cluster computation plus review-plus-write disambiguation

### Changed

- Codex hook timeout fallback in `hooks/codex/user-prompt-submit.ts` now builds a synthetic stale `AdvisorHookResult` and routes it through `renderAdvisorBrief()`. The bespoke inline string is removed and the diagnostic stderr line still emits `reason: 'timeout-fallback'`.
- `spec-kit-skill-advisor-bridge.mjs` disabled-mode branch now returns `{ brief: null, status: 'skipped', metadata: { route: 'disabled', ... } }` to match every other runtime. The dead `renderNativeBrief()` alternate renderer (formerly lines 117-148, verified unreferenced via grep) is removed.
- `scoreGraphCausalLane` in `graph-causal.ts` filter changed from `value.score > 0` to `value.score !== 0`. Clamp widened to `Math.max(-1, Math.min(value.score, 1))`. Conflict edges with `EDGE_MULTIPLIER = -0.35` now propagate suppressive evidence to fusion.
- `projectionFromRow` and `loadFilesystemProjection` in `projection.ts` now build `derivedTriggers` from `derived.trigger_phrases` and `derivedKeywords` from `derived.key_topics` plus `derived.entities` plus `derived.key_files`. The two arrays are independent references.
- `isAmbiguousTopTwo` in `ambiguity.ts` now compares ranking `score` instead of `confidence`. The cluster includes every passing candidate within `AMBIGUITY_MARGIN` of the top score. `applyAmbiguity` populates `ambiguousWith` for every cluster member including three-way ties.
- `scoreExplicitLane` in `explicit.ts` and parity copy in `skill_advisor.py` carry a review-plus-write disambiguation rule: when the prompt contains `review` AND any of `update|edit|fix|modify`, push `+3.0` to `sk-code` and `-2.0` to `sk-code-review`. Pure review prompts with no write verb are unaffected.

### Fixed

- Fusion task-intent confidence floor in `fusion.ts` now guards against token-stuffing: when `liveNormalized >= 0.95` AND `directScore < directScoreLiftThreshold`, the floor does not apply. Legitimate prompts with strong direct signal still pass via the existing direct-score branch.
- Regression fixture row P1-REVIEW-007 (`"review and update this"`) `expected_top_any` corrected from `["sk-code-review"]` to `["sk-code"]`.
- `native-scorer.vitest.ts` and `plugin-bridge.vitest.ts` updated to align 4 pre-existing tests with new ambiguity, projection plus disabled-mode semantics.

### Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` (this packet) | Exit 0 errors (5 informational warnings, same pattern as worked-pilot 008) |
| `npx vitest run skill_advisor/tests/scorer/` | Exit 0. 2 files. 27 tests. |
| `npx vitest run skill_advisor/tests/` (full unit suite) | Exit 0. 38 files. 280 tests. |
| `npm run stress` (full regression) | 58 files. 195 tests. Exit 0. One environment-bound flake on `gate-d-benchmark-memory-search` p95 latency unrelated to advisor scorer. Passes on stash baseline. |
| Inline finding markers | 8 distinct `// F-NNN-XX-NN:` markers across 7 product files plus the Python advisor parity copy |
| Module boundaries preserved | No scorer module reorganization. Sub-phase 006 architecture cleanup unblocked. |
| Ship commit | `f5b815c` / `495bf32`. Message: `fix(026/049/003): advisor quality remediation (8 findings)`. Date: 2026-05-01. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `hooks/codex/user-prompt-submit.ts` | Modified | F-006-B1-01: timeout fallback routes through shared formatter. Bespoke string removed. |
| `mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Modified | F-006-B1-02: silent disabled fail-open. F-006-B1-03: dead renderer removed. |
| `mcp_server/lib/scorer/lanes/graph-causal.ts` | Modified | F-012-C2-01: negative conflict scores preserved through lane emit. |
| `mcp_server/lib/scorer/projection.ts` | Modified | F-012-C2-02: distinct arrays for derived triggers and derived keywords. |
| `mcp_server/lib/scorer/fusion.ts` | Modified | F-012-C2-03: token-stuffing dispersion guard before task-intent floor. |
| `mcp_server/lib/scorer/ambiguity.ts` | Modified | F-012-C2-04: ranking-score tie-cluster computation including three-way ties. |
| `mcp_server/lib/scorer/lanes/explicit.ts` | Modified | F-013-C3-01: review-plus-write disambiguation rule in TypeScript scorer. |
| `mcp_server/lib/render.ts` | Modified | F-006-B1-01 helper: `renderAdvisorTimeoutFallback()` added. |
| `mcp_server/scripts/skill_advisor.py` | Modified | F-013-C3-01: parity rule applied after graph boosts in Python advisor path. |
| `mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Modified | F-013-C3-01: row 26 `expected_top_any` updated to `sk-code`. |
| `mcp_server/tests/scorer/advisor-quality-049-003.vitest.ts` (NEW) | Created | Five describe blocks covering all scorer-fusion and disambiguation fixes. |
| `mcp_server/tests/scorer/native-scorer.vitest.ts` | Modified | 2 pre-existing tests aligned to new ambiguity and projection semantics. |
| `mcp_server/tests/compat/plugin-bridge.vitest.ts` | Modified | 2 pre-existing tests aligned to new disabled-mode surface. |

### Follow-Ups

- Broaden the token-stuffing dispersion guard once telemetry confirms the conservative shape (`liveNormalized >= 0.95` AND `directScore < directScoreLiftThreshold`) catches the dominant failure mode. Adversarial prompts with several strong direct anchors combined with token-stuffing still pass.
- Extend the review-plus-write disambiguation rule to cover synonym pairs like "audit and tweak" or "look at and adjust" once the corpus shows recurring misroutes on those forms.
- Consider extending ambiguity clustering to sub-threshold candidates within the margin if a use case emerges for showing near-passing alternatives.
- Graph-causal negative-score propagation is intentionally bounded to direct conflict edges only. The BFS queue still enqueues only signed > 0 neighbors. Revisit if a use case emerges for deep conflict chain propagation.
