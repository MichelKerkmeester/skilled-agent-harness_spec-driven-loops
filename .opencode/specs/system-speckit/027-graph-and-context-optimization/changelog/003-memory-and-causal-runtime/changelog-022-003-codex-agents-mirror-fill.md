---
title: "022/003 Codex Agents Mirror Investigation and Qualifier Removal"
description: "Investigation confirmed .codex/agents/ fully mirrored with 11 .toml files and [agents.ai-council] declared at config.toml:139. Audit P0 was stale. Two P1 qualifier removals shipped: stripped the stale (proposed) tag from deep-ai-council references in deep-research.md and deep-review.md."
trigger_phrases:
  - "022 003 codex agents investigation"
  - "proposed qualifier removal deep-ai-council"
  - "codex agents mirror fill"
  - "stale audit P0 closure"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-24

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/003-codex-agents-mirror-fill`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc`

### Summary

Packet 021 audit reported two findings for codex agents: a P0 claiming `.codex/agents/` was empty and `[agents.ai-council]` was missing, plus a P1 noting the `deep-ai-council (proposed)` qualifier was stale after the rename arc shipped. Pre-edit investigation confirmed the P0 sub-claims were stale: `.codex/agents/` already contained 11 .toml files mirroring `.opencode/agents/` and `[agents.ai-council]` was declared at `.codex/config.toml:139`. Phase 003 therefore reduced to two token deletions. The `(proposed)` qualifier was removed from `deep-ai-council` references in `.opencode/agents/deep-research.md` and `.opencode/agents/deep-review.md`. Both audit findings are now closed with investigation evidence preserved in the spec docs.

### Added

None.

### Changed

- `.opencode/agents/deep-research.md`: removed ` (proposed)` from the `deep-ai-council` comparison line so the reference reads `deep-ai-council` uses 0.20 default on adjudicator-verdict stability
- `.opencode/agents/deep-review.md`: same removal applied to the matching comparison line

### Fixed

- Stale `(proposed)` qualifier on `deep-ai-council` references in two `.opencode/agents/` files. The deep-ai-council rename arc had shipped making the qualifier inaccurate.

### Verification

- `rg "deep-ai-council \(proposed\)" .opencode/agents/ .claude/agents/ .codex/agents/ .gemini/agents/` returned 0 hits across all 4 runtime agent directories.
- `grep "(proposed) on adjudicator-verdict stability" .opencode/agents/ai-council.md` returned 1 hit (threshold-value reference preserved as out-of-scope per spec).
- `ls .codex/agents/*.toml | wc -l` returned 11 confirming full mirror parity.
- `grep "^\[agents.ai-council\]" .codex/config.toml` returned 1 hit at line 139.
- Strict-validate phase 003: exit 0.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/agents/deep-research.md` | Removed ` (proposed)` qualifier from `deep-ai-council` comparison line at line 51. |
| `.opencode/agents/deep-review.md` | Removed ` (proposed)` qualifier from `deep-ai-council` comparison line at line 45. |

### Follow-Ups

- Audit research.md in packet 021 records the now-stale P0 claim. That document is treated as an immutable historical record so no retroactive update is needed.
- `.claude/agents/` and `.gemini/agents/` deep-research and deep-review mirrors do not contain the threshold-comparison block at the equivalent lines due to layout divergence. No action needed as the qualifier was never present there.
