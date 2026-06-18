---
title: "Changelog: Phase 2: cli-claude-code Frontmatter Alignment [009-skill-frontmatter-alignment/002-cli-claude-code]"
description: "Chronological changelog for the Phase 2: cli-claude-code Frontmatter Alignment phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/002-cli-claude-code` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment`

### Summary

cli-claude-code's 6 reference/asset docs now carry exactly the canonical frontmatter contract, making them valid routing signal for the advisor doc harvest. Unlike the 008 pilot (pure normalization of an existing block), this was the campaign's first net-new authoring phase: every doc carried title+description only, so trigger_phrases, importance_tier, and contextType were authored fresh from each doc's actual body.

### Added

- Authored the full canonical frontmatter contract (`trigger_phrases`, `importance_tier`, `contextType`) on all 6 reference and asset docs, deriving 4-7 executor-prefixed trigger phrases from each doc body so the advisor doc harvest can route claude-code-shaped requests to the right doc.
- Elevated `cli_reference.md` to tier `important` as the formal flag/invocation contract for dispatching the binary; the other 5 descriptive docs remain `normal` with `contextType: implementation`.

### Changed

- Captured a coverage-mode baseline confirming all 6 docs lacked the full detailed block before changes.
- Authored frontmatter blocks on the 4 references (`agent_delegation.md`, `claude_tools.md`, `cli_reference.md`, `integration_patterns.md`) and 2 assets (`prompt_quality_card.md`, `prompt_templates.md`), each with phrases derived from the doc body.
- Coverage check confirmed 6/6 docs conform (0 violations) after the edits.
- Python local-mode smoke with the doc-trigger flag enabled routes "claude code permission modes" to cli-claude-code first at 0.95 confidence with a doc-signal match.

### Fixed

- None.

### Follow-Ups

- Live-daemon verification is campaign-level, not per-phase. The running advisor daemon predates the launcher allowlist fix, so `matchedDocs` cannot be observed live until every advisor-attached session ends and a fresh session respawns it.

### Verification

- check-skill-doc-frontmatter.sh --skill cli-claude-code --coverage - PASS — docs=6, carrying-detailed-block=6, violations=0
- Python local-mode smoke ("claude code permission modes", flag on) - PASS — cli-claude-code first at 0.95 with !claude code permission modes(signal) in the match reason
- Diff hygiene - PASS — git diff shows only frontmatter addition hunks in the 6 files (51 insertions, 0 deletions)
- Live daemon matchedDocs smoke - DEFERRED — rides packet 145 T025 (session-cycle daemon adoption)
- Tasks complete - 10 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/cli-claude-code/references/agent_delegation.md` | Modified | Full contract block authored; tier normal |
| `.opencode/skills/cli-claude-code/references/claude_tools.md` | Modified | Full contract block authored; tier normal |
| `.opencode/skills/cli-claude-code/references/cli_reference.md` | Modified | Full contract block authored; tier important |
| `.opencode/skills/cli-claude-code/references/integration_patterns.md` | Modified | Full contract block authored; tier normal |
| `.opencode/skills/cli-claude-code/assets/prompt_quality_card.md` | Modified | Full contract block authored; tier normal |
| `.opencode/skills/cli-claude-code/assets/prompt_templates.md` | Modified | Full contract block authored; tier normal |


