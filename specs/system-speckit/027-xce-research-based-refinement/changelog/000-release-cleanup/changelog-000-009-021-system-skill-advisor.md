---
title: "Changelog: Phase 21: system-skill-advisor Frontmatter Alignment [009-skill-frontmatter-alignment/021-system-skill-advisor]"
description: "Chronological changelog for the Phase 21: system-skill-advisor Frontmatter Alignment phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/021-system-skill-advisor` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment`

### Summary

system-skill-advisor's 15 reference docs now carry exactly the canonical frontmatter contract. This skill owns both the checker and the doc-harvest consumer, so its own references are the largest single slice of the campaign and the one where drift would be most embarrassing: before this phase every doc lacked contextType, 8 lacked importance_tier, the hook operator contract had no trigger phrases at all, and five docs sat at important tier without meeting the contract's formal-contract criterion.

### Added

- Full frontmatter detailed block authored on `hooks/skill_advisor_hook.md` — five trigger phrases derived from its runtime matrix and shared-behavior sections ("user prompt submit hook", "advisor hook fail-open", "copilot next-prompt freshness", "advisor doc harvest lifecycle", "hook runtime lifecycle promise"), tier `important` (the doc names itself an operator contract), contextType `implementation`.
- contextType assigned across all 15 reference docs: `implementation` for 12 runtime/scoring/graph-mechanics docs, `planning` for the extraction roadmap (`graph/skill_graph_extraction_plan.md`), `research` for validation baselines (`scoring/validation_baselines.md`), and `general` for the deferred-decisions history (`decisions/deferred_decisions.md`).

### Changed

- Tier policy applied across all 15 docs. Five previously `important` docs demoted to `normal` (deferred-decisions history, drift-reconciliation runbook, query cookbook, lane-weight tuning guide, and validation baselines) because they are operational references, not formal contracts. The `legacy_tool_bridge.md` promoted to `important` because it states an invariant compatibility contract: public tool IDs stay stable unless an ADR changes them.
- Weak trigger phrases repaired on `graph/skill_graph_extraction_plan.md`: single-token `lib/skill-graph` replaced with "skill graph library ownership", generic `skill graph database` replaced with "skill graph migration status".

### Fixed

- None.

### Verification

- check-skill-doc-frontmatter.sh --skill system-skill-advisor --coverage - PASS — docs=15, carrying-detailed-block=15, violations=0
- Python local-mode smoke ("advisor hook fail-open", flag on) - PASS — system-skill-advisor first at 0.95 with !advisor hook fail-open(signal) in the match reason
- Diff hygiene - PASS — git diff shows only frontmatter hunks in the 15 files (36 insertions, 7 deletions)
- Live daemon matchedDocs smoke - DEFERRED — rides packet 145 T025 (session-cycle daemon adoption)
- Tasks complete - 11 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md` | Modified | Full detailed block authored (phrases, tier important, contextType) |
| `.opencode/skills/system-skill-advisor/references/config/db_path_policy.md` | Modified | Tier important + contextType added |
| `.opencode/skills/system-skill-advisor/references/runtime/{daemon_lease_contract,freshness_contract}.md` | Modified | contextType added (tier already important) |
| `.opencode/skills/system-skill-advisor/references/runtime/legacy_tool_bridge.md` | Modified | Tier important + contextType added |
| `.opencode/skills/system-skill-advisor/references/runtime/{standalone_mcp_shape,tool_ids_reference}.md` | Modified | Tier normal + contextType added |
| `.opencode/skills/system-skill-advisor/references/graph/{propagate_enhances}.md` | Modified | Tier normal + contextType added |
| `.opencode/skills/system-skill-advisor/references/graph/{skill_graph_drift,skill_graph_query_cookbook}.md` | Modified | Tier demoted to normal; contextType added |
| `.opencode/skills/system-skill-advisor/references/graph/skill_graph_extraction_plan.md` | Modified | Phrases repaired; tier normal + contextType planning added |
| `.opencode/skills/system-skill-advisor/references/decisions/deferred_decisions.md` | Modified | Tier demoted to normal; contextType general added |
| `.opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md` | Modified | Tier normal + contextType added |
| `.opencode/skills/system-skill-advisor/references/scoring/{lane_weight_tuning,validation_baselines}.md` | Modified | Tier demoted to normal; contextType added |

### Follow-Ups

- Live-daemon verification is campaign-level. The running advisor daemon predates the launcher allowlist fix, so matchedDocs cannot be observed live until every advisor-attached session cycles and a fresh session respawns it.
- The five tier demotions are judgment calls. If a downstream consumer weighted on the old `important` values, restore the prior tiers via git history and re-run the coverage check.
