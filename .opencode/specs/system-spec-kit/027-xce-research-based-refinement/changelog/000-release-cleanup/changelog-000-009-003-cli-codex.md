---
title: "Changelog: Phase 3: cli-codex Frontmatter Alignment [009-skill-frontmatter-alignment/003-cli-codex]"
description: "Chronological changelog for the Phase 3: cli-codex Frontmatter Alignment phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/003-cli-codex` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment`

### Summary

cli-codex's 7 reference and asset docs now carry exactly the canonical frontmatter contract, so the advisor doc harvest can route codex-shaped requests to the right doc. This was the first mostly-net-new authoring phase after the pilot: 6 docs had title+description only, so phrases, tiers, and contextTypes were derived from each doc body rather than normalized from existing values.

### Added

- Authored the full canonical frontmatter contract on 6 previously bare docs, deriving codex-prefixed trigger phrases from each doc body to keep signals distinctive against sibling cli-* skills.
- Completed the partial block on `hook_contract.md` by adding `importance_tier` and `contextType` while preserving its 4 existing accurate trigger phrases.

### Changed

- Captured a coverage-mode baseline showing all 7 docs failed: 6 missing the full detailed block, `hook_contract.md` missing only `importance_tier` and `contextType`.
- Authored frontmatter blocks on 5 references (`agent_delegation.md`, `cli_reference.md`, `codex_tools.md`, `integration_patterns.md`, `hook_contract.md`) and 2 assets (`prompt_quality_card.md`, `prompt_templates.md`), deriving phrases from each doc body.
- Assigned tier `important` to `cli_reference.md` (flag/invocation contract) and `hook_contract.md` (formal hook event/exit-semantics contract); `integration_patterns.md` received `contextType: planning` as the lone cross-AI workflow design doc.
- Coverage check confirmed 7/7 docs conform (0 violations).
- Python local-mode smoke with the doc-trigger flag enabled routes "codex sandbox modes reasoning effort" to cli-codex first at 0.95 confidence with a doc-signal match.

### Fixed

- None.

### Follow-Ups

- Live-daemon verification is campaign-level; the running advisor daemon adopts the doc-trigger flag only after a session cycle.
- Trigger-phrase quality across all 32 authored phrases is only fully exercised once the doc harvest goes live; per-phrase routing precision is judgment derived from doc bodies, not measurement.

### Verification

- check-skill-doc-frontmatter.sh --skill cli-codex --coverage - PASS — docs=7, carrying-detailed-block=7, violations=0 (baseline was violations=7)
- Python local-mode smoke ("codex sandbox modes reasoning effort", flag on) - PASS — cli-codex first at 0.95 with !codex sandbox modes(signal) in the match reason
- Diff hygiene - PASS — git diff shows insertions-only frontmatter hunks in the 7 files (52 insertions, 0 deletions)
- Live daemon matchedDocs smoke - DEFERRED — rides packet 145 T025 (session-cycle daemon adoption)
- Tasks complete - 13 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/cli-codex/references/cli_reference.md` | Modified | Full block added; tier important, contextType implementation |
| `.opencode/skills/cli-codex/references/hook_contract.md` | Modified | Kept 4 existing phrases; added tier important, contextType implementation |
| `.opencode/skills/cli-codex/references/agent_delegation.md` | Modified | Full block added; normal / implementation |
| `.opencode/skills/cli-codex/references/codex_tools.md` | Modified | Full block added; normal / implementation |
| `.opencode/skills/cli-codex/references/integration_patterns.md` | Modified | Full block added; normal / planning |
| `.opencode/skills/cli-codex/assets/prompt_quality_card.md` | Modified | Full block added; normal / implementation |
| `.opencode/skills/cli-codex/assets/prompt_templates.md` | Modified | Full block added; normal / implementation |


