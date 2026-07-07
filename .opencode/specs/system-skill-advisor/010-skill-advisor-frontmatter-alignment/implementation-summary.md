---
title: "Implementation Summary: Phase 21: system-skill-advisor Frontmatter Alignment"
description: "All 15 system-skill-advisor references now conform to the canonical contract; the contract-owner skill models its own rules."
trigger_phrases:
  - "system-skill-advisor frontmatter summary"
  - "advisor doc contract evidence"
  - "phase 21 frontmatter complete"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/010-skill-advisor-frontmatter-alignment"
    last_updated_at: "2026-06-11T09:31:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase complete: 15 docs conform and smoke passed"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-021-system-skill-advisor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-skill-advisor-frontmatter-alignment |
| **Completed** | 2026-06-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

system-skill-advisor's 15 reference docs now carry exactly the canonical frontmatter contract. This skill owns both the checker and the doc-harvest consumer, so its own references are the largest single slice of the campaign and the one where drift would be most embarrassing: before this phase every doc lacked `contextType`, 8 lacked `importance_tier`, the hook operator contract had no trigger phrases at all, and five docs sat at `important` tier without meeting the contract's formal-contract criterion.

### Net-new authoring

`hooks/skill_advisor_hook.md` carried title+description only. It now declares 5 trigger phrases drawn from its runtime matrix and shared-behavior sections (`user prompt submit hook`, `advisor hook fail-open`, `copilot next-prompt freshness`, plus two more), tier `important` because the doc names itself an operator contract, and contextType `implementation`.

### Tier policy application

The contract reserves `important` for formal contract/invariant docs. Five docs qualify: the db path policy, daemon lease contract, freshness contract, legacy tool bridge (tool ids are the stated compatibility contract) and the hook operator contract. Five previously `important` docs do not — the deferred-decisions history, the drift-reconciliation runbook, the query cookbook, the tuning guide and the validation baselines — so they moved to `normal`, dampening their doc signal relative to the true contracts.

### contextType assignment

12 docs document runtime, scoring or graph mechanics and got `implementation`. Three exceptions: the extraction roadmap is `planning`, the validation baselines are `research`, and the deferred-decisions history is `general`.

### Phrase repair

The extraction roadmap carried the single-token phrase `lib/skill-graph` and the generic `skill graph database`; both were replaced with distinctive multi-word phrases (`skill graph library ownership`, `skill graph migration status`).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md` | Modified | Full detailed block authored (phrases, tier `important`, contextType) |
| `.opencode/skills/system-skill-advisor/references/config/db_path_policy.md` | Modified | Tier `important` + contextType added |
| `.opencode/skills/system-skill-advisor/references/runtime/{daemon_lease_contract,freshness_contract}.md` | Modified | contextType added (tier already `important`) |
| `.opencode/skills/system-skill-advisor/references/runtime/legacy_tool_bridge.md` | Modified | Tier `important` + contextType added |
| `.opencode/skills/system-skill-advisor/references/runtime/{standalone_mcp_shape,tool_ids_reference}.md` | Modified | Tier `normal` + contextType added |
| `.opencode/skills/system-skill-advisor/references/graph/{propagate_enhances}.md` | Modified | Tier `normal` + contextType added |
| `.opencode/skills/system-skill-advisor/references/graph/{skill_graph_drift,skill_graph_query_cookbook}.md` | Modified | Tier demoted to `normal`; contextType added |
| `.opencode/skills/system-skill-advisor/references/graph/skill_graph_extraction_plan.md` | Modified | Phrases repaired; tier `normal` + contextType `planning` added |
| `.opencode/skills/system-skill-advisor/references/decisions/deferred_decisions.md` | Modified | Tier demoted to `normal`; contextType `general` added |
| `.opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md` | Modified | Tier `normal` + contextType added |
| `.opencode/skills/system-skill-advisor/references/scoring/{lane_weight_tuning,validation_baselines}.md` | Modified | Tier demoted to `normal`; contextType added |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Frontmatter-only in-place patches, verified by the contract checker in coverage mode and a Python local-mode advisor smoke that needs no live daemon.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Demote 5 docs from `important` to `normal` | The contract reserves `important` for formal contract/invariant docs. A decisions history, a reconciliation runbook, a query cookbook, a tuning guide and SHA-pinned baseline numbers are operational references, not contracts; keeping them at `important` would dilute the tier's meaning inside the skill that defines it. Git history preserves the prior values. |
| `legacy_tool_bridge.md` promoted to `important` | The doc states the invariant directly: server namespaces may move, public `advisor_*`/`skill_graph_*` ids stay stable unless an ADR changes them. That is a compatibility contract, the same class as the lease and freshness contracts. |
| `validation_baselines.md` gets contextType `research` | The campaign maps analysis/baseline content to `research`; the doc is baseline metrics plus a troubleshooting playbook pinned to a remediation SHA, not runtime mechanics. |
| Smoke via Python local mode, not the live daemon | The live daemon adopts the doc-trigger flag only after a session cycle (packet 145 T025); the Python path reads the same files under the same flag and proves routing now. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-skill-doc-frontmatter.sh --skill system-skill-advisor --coverage` | PASS — docs=15, carrying-detailed-block=15, violations=0 |
| Python local-mode smoke ("advisor hook fail-open", flag on) | PASS — system-skill-advisor first at 0.95 with `!advisor hook fail-open(signal)` in the match reason |
| Diff hygiene | PASS — git diff shows only frontmatter hunks in the 15 files (36 insertions, 7 deletions) |
| Live daemon `matchedDocs` smoke | DEFERRED — rides packet 145 T025 (session-cycle daemon adoption) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live-daemon verification is campaign-level, not per-phase.** The running advisor daemon predates the launcher allowlist fix, so `matchedDocs` cannot be observed live until every advisor-attached session ends and a fresh session respawns it (tracked as packet 145 T025).
2. **Tier demotions are judgment calls.** The five demoted docs were deliberately `important` before the campaign fixed the tier criterion; if a consumer weighted on the old values, restore via git history and re-run the coverage check.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
