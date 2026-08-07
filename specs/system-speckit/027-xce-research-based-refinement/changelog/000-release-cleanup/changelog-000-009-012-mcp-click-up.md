---
title: "Changelog: Phase 12: mcp-click-up Frontmatter Alignment [009-skill-frontmatter-alignment/012-mcp-click-up]"
description: "Chronological changelog for the Phase 12: mcp-click-up Frontmatter Alignment phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/012-mcp-click-up` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment`

### Summary

mcp-click-up's 3 reference docs now carry exactly the canonical frontmatter contract, so every doc is valid routing signal for the advisor doc harvest. The drift profile differed from the pilot: instead of an out-of-enum contextType: reference, all three docs were simply missing importance_tier and contextType while their titles, descriptions, and trigger phrases (6 each, content-derived) already conformed.

### Added

- Appended `importance_tier: normal` and `contextType` to all three mcp-click-up reference docs, which already carried valid titles, descriptions, and six content-derived trigger phrases each. The drift was two missing fields per doc, not enum drift.

### Changed

- Captured a coverage-mode baseline showing all three docs failed on missing `importance_tier` and `contextType` only.
- Assigned `contextType: implementation` to the two invocation references (`cupt_commands.md` specifies `cupt` command call shapes; `mcp_tools.md` specifies Code Mode `call_tool_chain()` invocation patterns) and `contextType: general` to `troubleshooting.md` (an operational diagnostic playbook, not a specification of how anything is implemented).
- Passed the coverage check (`check-skill-doc-frontmatter.sh --coverage`) with three of three docs carrying the detailed block and zero violations.
- All patches were frontmatter-only: six inserted lines, zero deletions across the three files.

### Fixed

- None.

### Verification

- check-skill-doc-frontmatter.sh --skill mcp-click-up --coverage - PASS — docs=3, carrying-detailed-block=3, violations=0
- Python local-mode smoke ("cupt done wrong status on team filter", flag on) - PASS — mcp-click-up first at 0.95 with !cupt done wrong status(signal) and !cupt done(signal)
- Diff hygiene - PASS — git diff shows 6 inserted frontmatter lines, 0 deletions, across the 3 files
- Live daemon matchedDocs smoke - DEFERRED — rides packet 145 T025 (session-cycle daemon adoption)
- Tasks complete - 9 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/mcp-click-up/references/cupt_commands.md` | Modified | Add tier normal + contextType implementation |
| `.opencode/skills/mcp-click-up/references/mcp_tools.md` | Modified | Add tier normal + contextType implementation |
| `.opencode/skills/mcp-click-up/references/troubleshooting.md` | Modified | Add tier normal + contextType general |

### Follow-Ups

- Live-daemon `matchedDocs` verification is deferred to a later campaign-level session cycle; the running advisor daemon predates the launcher allowlist fix and cannot observe doc triggers until restarted.
