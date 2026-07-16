---
title: "Skill Graph Phase 004: Metadata Fixes and Seeded Sweep Re-run"
description: "Applied top-8 audit recommendations from 015/005 to skill graph-metadata.json plus SKILL.md frontmatter across 8 skills. Invalidated the embedding cache. Re-ran the 7-vector seeded sweep. Documented zero delta vs the 015/004 baseline. Recommendation: stay at semantic weight 0.05."
trigger_phrases:
  - "metadata fixes seeded sweep"
  - "skill metadata audit apply"
  - "advisor seeded resweep"
  - "graph-metadata trigger phrases update"
  - "skill embedding cache invalidation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `027-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/004-metadata-fixes-and-seeded-sweep-rerun` (Level 2)
> Parent packet: `027-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph`

### Summary

The skill advisor's graph-metadata and SKILL.md frontmatter descriptions across the cli-star and deep-star skill families had accumulated generic, low-signal vocabulary that reduced routing precision. Phase 015/005 had audited every active skill and ranked the 8 lowest-scoring entries with concrete WHAT and EXAMPLE phrasing changes. Those recommendations were advisory only and no skill files had been modified.

This phase applied all 8 concrete audit recommendations. Affected skills received updated `derived.trigger_phrases` plus `derived.key_topics`. Three skills also received updated `description:` frontmatter: `cli-codex` got Codex-specific wording. `cli-gemini` got Google-Search-backed wording. `cli-claude-code` got Anthropic-backed wording. The remaining five skills (`deep-review`, `deep-ai-council`, `sk-code`, `deep-research`, `sk-code-review`) received scoped topic and phrase refinements.

The embedding cache was deleted before the re-run to force cold re-embedding. The 7-vector seeded sweep produced zero delta across all vectors versus the 015/004 baseline, confirming the corpus is lexically saturated on this prompt set. The recommendation stays at semantic weight 0.05.

### Added

- `research/sweep-results-after-fixes.md` documenting per-vector delta columns and per-case routing diff table

### Changed

- `cli-codex` SKILL.md: description updated to OpenAI-backed executor wording. Trigger phrases replaced with Codex repo analysis, PR review, web research, cross-model validation. Key topics replaced with `openai-codex-codegen`, `codex-exec`, `codex-pr-review`, `codex-web-research`, `cross-model-validation`
- `cli-gemini` SKILL.md: description updated to Google Search-backed wording. Trigger phrases replaced with Gemini-specific research, architecture sweep, large-context analysis. Key topics updated to match
- `cli-claude-code` SKILL.md: description updated to Anthropic-backed executor with deep reasoning and structured handoff vocabulary. Key topics replaced with Anthropic Claude Code, extended-thinking review, structured handoff topics
- `deep-review` graph-metadata.json: key topics replaced with multi-pass code audit, P0/P1/P2 findings, review-state JSONL, release readiness, review convergence
- `deep-ai-council` graph-metadata.json: trigger phrases extended with council-specific multi-seat strategy, decision comparison, planning artifacts, convergence check phrases. Key topics updated to seat perspectives, decision matrix, council state artifacts
- `sk-code` graph-metadata.json: trigger phrases replaced with surface-aware implementation and verification intent phrases
- `deep-research` graph-metadata.json: key topics replaced with research question decomposition, evidence synthesis, research-state JSONL, source triangulation, research convergence
- `sk-code-review` graph-metadata.json: key topics replaced with findings-first PR review, security/correctness minimums, merge-readiness risk, surface-specific evidence

### Fixed

- All 8 lowest-scoring skills had generic CLI-family or topic-family vocabulary that reduced disambiguation. Scoped phrasing derived from per-skill EXAMPLE blocks replaced the generic terms.

### Verification

| Gate | Status | Evidence |
|------|--------|----------|
| Strict spec validation | Pass | This packet and parent 015 both exited 0 with 0 errors and 0 warnings |
| Typecheck | Pass | `npm run typecheck` from `mcp_server/` exited 0 |
| TypeScript build | Pass | `npx tsc --build` from `.opencode/skills/system-spec-kit` exited 0 |
| Sweep re-run | Pass with expected variance failure | Default provider: 1 passed / 1 skipped. Explicit `EMBEDDINGS_PROVIDER=hf-local` ran with `cacheMisses 12`. All 7 vectors stayed at `accuracyTotal 0.6667`. Variance assertion correctly failed confirming the delta is real. |
| All 17 skills discoverable | Pass | Node discovery sanity parsed 17 `graph-metadata.json` files and 17 `SKILL.md` frontmatter blocks with 0 failures |
| No new regressions | Pass | `npm exec --workspace=@spec-kit/mcp-server -- vitest run skill_advisor`: 300 passed / 1 failed / 1 skipped. Failure is the known `plugin-bridge.vitest.ts` forced-local fail-open baseline. |
| Sweep delta documented | Pass | `research/sweep-results-after-fixes.md` includes per-vector delta columns and per-case routing diff table |
| Recommendation cited with numbers | Pass | Recommendation stays at `0.05` because all measured deltas are `+0.0000` across all vectors |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/cli-codex/SKILL.md` | Description, trigger phrases, key topics updated to Codex-specific vocabulary |
| `.opencode/skills/cli-codex/graph-metadata.json` | Derived trigger phrases and key topics updated |
| `.opencode/skills/cli-gemini/SKILL.md` | Description, trigger phrases, key topics updated to Google Search-backed vocabulary |
| `.opencode/skills/cli-gemini/graph-metadata.json` | Derived trigger phrases and key topics updated |
| `.opencode/skills/cli-claude-code/SKILL.md` | Description and key topics updated to Anthropic-backed executor vocabulary |
| `.opencode/skills/cli-claude-code/graph-metadata.json` | Key topics updated |
| `.opencode/skills/deep-ai-council/graph-metadata.json` | Trigger phrases and key topics updated with council-specific terms |
| `.opencode/skills/deep-review/graph-metadata.json` | Key topics updated with multi-pass audit, P0/P1/P2 findings terms |
| `.opencode/skills/deep-research/graph-metadata.json` | Key topics updated with research decomposition and convergence terms |
| `.opencode/skills/sk-code/graph-metadata.json` | Trigger phrases updated with surface-aware implementation intent phrases |
| `.opencode/skills/sk-code-review/graph-metadata.json` | Key topics updated with findings-first PR review and merge-readiness terms |
| `research/sweep-results-after-fixes.md` (NEW) | Per-vector delta report vs 015/004 baseline |

### Follow-Ups

- Author a harder prompt corpus specifically designed to surface lexical false-positives between skills with overlapping vocabulary.
- Populate `derived.intent_signals` plus `manual.depends_on`/`manual.related_to` across the 17 active skills. The 015/005 audit found these fields are universally absent. This is a separate intervention from description rewording.
- Revisit the semantic weight recommendation if SKILL.md descriptions change materially outside this packet or a richer corpus is available.
