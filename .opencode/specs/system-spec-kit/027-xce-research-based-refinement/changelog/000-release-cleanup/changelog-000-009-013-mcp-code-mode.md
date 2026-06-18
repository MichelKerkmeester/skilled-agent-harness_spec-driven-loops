---
title: "Changelog: Phase 13: mcp-code-mode Frontmatter Alignment [009-skill-frontmatter-alignment/013-mcp-code-mode]"
description: "Chronological changelog for the Phase 13: mcp-code-mode Frontmatter Alignment phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/013-mcp-code-mode` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment`

### Summary

mcp-code-mode's 7 reference and asset docs now carry exactly the canonical frontmatter contract, so the skill's Code Mode guidance (naming pattern, UTCP config, workflow patterns, templates) is valid routing signal for the advisor doc harvest. Unlike the pilot, this was pure net-new authoring: every doc carried title+description only, so all trigger phrases were composed fresh from each body.

### Added

- None.

### Changed

- Inserted trigger_phrases, importance_tier, and contextType into the existing frontmatter fences of all 7 mcp-code-mode reference and asset docs, turning the skill's Code Mode guidance into valid routing signal for the advisor doc harvest. Phrases were composed fresh from each body.
- naming_convention.md was tiered important because the `{manual}.{manual}_{tool}` naming pattern is a UTCP protocol invariant that breaks tool calls when violated. architecture.md and tool_catalog.md received contextType general as conceptual explainers; the remaining five docs received contextType implementation.

### Fixed

- None.

### Verification

- check-skill-doc-frontmatter.sh --skill mcp-code-mode --coverage - PASS — docs=7, carrying-detailed-block=7, violations=0 (baseline was violations=7)
- Python local-mode smoke ("call_tool_chain patterns", flag on) - PASS — mcp-code-mode sole result at 0.62 with !call_tool_chain patterns(signal)
- Diff hygiene - PASS — git diff shows only 8-line frontmatter-addition hunks in the 7 files; the mcp_server/package-lock.json hunk predates this phase
- Live daemon matchedDocs smoke - DEFERRED — rides packet 145 T025 (session-cycle daemon adoption)
- Tasks complete - 10 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/mcp-code-mode/references/architecture.md` | Modified | Contract fields added; general/normal |
| `.opencode/skills/mcp-code-mode/references/configuration.md` | Modified | Contract fields added; implementation/normal |
| `.opencode/skills/mcp-code-mode/references/naming_convention.md` | Modified | Contract fields added; implementation/important |
| `.opencode/skills/mcp-code-mode/references/tool_catalog.md` | Modified | Contract fields added; general/normal |
| `.opencode/skills/mcp-code-mode/references/workflows.md` | Modified | Contract fields added; implementation/normal |
| `.opencode/skills/mcp-code-mode/assets/config_template.md` | Modified | Contract fields added; implementation/normal |
| `.opencode/skills/mcp-code-mode/assets/env_template.md` | Modified | Contract fields added; implementation/normal |

### Follow-Ups

- Live-daemon matchedDocs verification is deferred until every advisor-attached session ends and a fresh session respawns the daemon with the doc-trigger flag enabled.
- Local-mode advisor confidence is moderate (0.62) on bare trigger phrases; full-sentence prompts with intent tokens raise the score above the 0.8 routing bar.
