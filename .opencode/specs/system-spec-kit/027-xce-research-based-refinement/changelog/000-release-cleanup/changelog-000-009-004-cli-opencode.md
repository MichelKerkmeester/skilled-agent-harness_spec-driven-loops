---
title: "Changelog: Phase 4: cli-opencode Frontmatter Alignment [009-skill-frontmatter-alignment/004-cli-opencode]"
description: "Chronological changelog for the Phase 4: cli-opencode Frontmatter Alignment phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/004-cli-opencode` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment`

### Summary

cli-opencode's 9 reference/asset docs now carry exactly the canonical frontmatter contract, turning the skill's doc corpus into valid routing signal for the advisor doc harvest. This was the campaign's first pure net-new authoring phase: where the pilot only normalized existing blocks, every cli-opencode doc started at title+description and needed its trigger phrases derived from a full body read.

### Added

- None.

### Changed

- Captured a coverage-mode baseline showing all 9 docs carried `title`+`description` only, with all three detailed-block fields missing.
- Read all 9 doc bodies before authoring 4-7 opencode-prefixed trigger phrases per doc, keeping signals distinctive against sibling cli-claude-code and cli-codex skills.
- Authored the full canonical frontmatter block on the 7 references (`agent_delegation.md`, `cli_reference.md`, `context-budget.md`, `destructive_scope_violations.md`, `integration_patterns.md`, `opencode_tools.md`, `permissions-matrix.md`) and 2 assets (`prompt_quality_card.md`, `prompt_templates.md`).
- Elevated three docs to tier `important`: `cli_reference.md` (the pinned invocation contract), `integration_patterns.md` (owner of the non-interactive rule and self-invocation guard), and `destructive_scope_violations.md` (the RM-8 safety playbook required before every deep-loop dispatch).
- Assigned varied `contextType` values: `implementation` for operational references, `planning` for the prompt quality card (pre-dispatch composition), and `general` for the pointer mirror (`context-budget.md`) and capability comparison (`opencode_tools.md`).
- Coverage check confirmed 9/9 docs conform (0 violations).
- Python local-mode smoke with the doc-trigger flag enabled routes "opencode self-invocation guard" to cli-opencode first at 0.95 confidence with a doc-signal match.

### Fixed

- None.

### Follow-Ups

- Live-daemon verification is campaign-level; the running advisor daemon adopts the doc-trigger flag only after a session cycle.
- Diff hygiene evidence is hunk-scoped, not file-scoped. Three of the nine files share the working tree with unrelated in-flight edits from another branch; this phase's hunks touch only the leading frontmatter fence.

### Verification

- check-skill-doc-frontmatter.sh --skill cli-opencode --coverage - PASS — PASS mode=coverage scope=cli-opencode docs=9 carrying-detailed-block=9 violations=0
- Python local-mode smoke ("opencode self-invocation guard", flag on) - PASS — cli-opencode first at 0.95 with !opencode self-invocation guard(signal) in the match reason
- Diff hygiene - PASS with caveat — this phase's hunks are leading-fence-only on all 9 files; prompt_quality_card.md, prompt_templates.md, and cli_reference.md also carry pre-existing uncommitted body hunks from the in-flight 028 branch session, not touched by this phase
- Live daemon matchedDocs smoke - DEFERRED — rides packet 145 T025 (session-cycle daemon adoption)
- Tasks complete - 11 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/cli-opencode/references/agent_delegation.md` | Modified | Authored block; normal / implementation |
| `.opencode/skills/cli-opencode/references/cli_reference.md` | Modified | Authored block; important / implementation |
| `.opencode/skills/cli-opencode/references/context-budget.md` | Modified | Authored block; normal / general (pointer mirror) |
| `.opencode/skills/cli-opencode/references/destructive_scope_violations.md` | Modified | Authored block; important / implementation |
| `.opencode/skills/cli-opencode/references/integration_patterns.md` | Modified | Authored block; important / implementation |
| `.opencode/skills/cli-opencode/references/opencode_tools.md` | Modified | Authored block; normal / general (capability comparison) |
| `.opencode/skills/cli-opencode/references/permissions-matrix.md` | Modified | Authored block; normal / implementation |
| `.opencode/skills/cli-opencode/assets/prompt_quality_card.md` | Modified | Authored block; normal / planning (prompt composition) |
| `.opencode/skills/cli-opencode/assets/prompt_templates.md` | Modified | Authored block; normal / implementation |


