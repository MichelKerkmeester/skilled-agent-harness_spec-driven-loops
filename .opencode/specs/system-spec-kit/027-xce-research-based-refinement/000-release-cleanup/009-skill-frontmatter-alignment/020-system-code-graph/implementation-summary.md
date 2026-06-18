---
title: "Implementation Summary: Phase 20: system-code-graph Frontmatter Alignment"
description: "All 7 system-code-graph references now conform to the canonical contract, including a net-new detailed block for launcher_lease.md."
trigger_phrases:
  - "system-code-graph frontmatter summary"
  - "code graph frontmatter complete"
  - "code graph doc contract evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/020-system-code-graph"
    last_updated_at: "2026-06-11T09:29:13Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase complete: 7 docs conform and smoke passed"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/references/runtime/launcher_lease.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-020-system-code-graph"
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
| **Spec Folder** | 020-system-code-graph |
| **Completed** | 2026-06-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

system-code-graph's 7 reference docs now carry exactly the canonical frontmatter contract, so all of them are valid routing signal for the advisor doc harvest. Six docs needed only the missing `importance_tier`/`contextType` pair; `launcher_lease.md` had no detailed block at all and received net-new trigger phrases derived from its lease mechanism.

### Contract normalization

The 6 partial-block docs kept their existing titles, descriptions, and (good) trigger phrases and gained the two missing fields. One phrase drift was fixed along the way: `code_graph_readiness_check.md` carried `ensureCodeGraphReady` — a camelCase single token outside the lowercase multi-word phrase rule — now "ensure code graph ready". Four docs are formal contract/policy sources and moved to `important` tier: `naming_conventions.md` and `ownership_boundary.md` (the two contract archetypes the campaign policy names), `database_path_policy.md` (launcher-enforced path invariant), and `readiness_and_scope_fingerprint.md` (the false-safe read-path refusal contract). `code_graph_readiness_check.md` (implementation internals) and `tool_surface.md` (operator map that defers to the schema array) stay `normal`, as does the new `launcher_lease.md` block. The two contract maps that describe identities and ownership across layers use contextType `general`; the five runtime-behavior docs use `implementation`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-code-graph/references/config/database_path_policy.md` | Modified | tier `important`, contextType `implementation`; 4th phrase added |
| `.opencode/skills/system-code-graph/references/readiness/code_graph_readiness_check.md` | Modified | tier `normal`, contextType `implementation`; camelCase phrase fixed |
| `.opencode/skills/system-code-graph/references/readiness/readiness_and_scope_fingerprint.md` | Modified | tier `important`, contextType `implementation` |
| `.opencode/skills/system-code-graph/references/runtime/launcher_lease.md` | Modified | net-new detailed block: 4 phrases, tier `normal`, contextType `implementation` |
| `.opencode/skills/system-code-graph/references/runtime/naming_conventions.md` | Modified | tier `important`, contextType `general` |
| `.opencode/skills/system-code-graph/references/runtime/ownership_boundary.md` | Modified | tier `important`, contextType `general` |
| `.opencode/skills/system-code-graph/references/runtime/tool_surface.md` | Modified | tier `normal`, contextType `implementation` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Frontmatter-only in-place patches on the leading YAML fence of each doc, verified by the contract checker in coverage mode and a Python local-mode advisor smoke that needs no live daemon.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Four docs at tier `important` | Each is the source of truth for an invariant: naming stability, package ownership, the skill-local DB path guard, and the blocked-payload read contract. Docs that merely describe code-owned behavior stay `normal`. |
| `tool_surface.md` stays `normal` despite "contract" in its description | The doc itself says the schema array wins on disagreement, so it is a descriptive operator map, not the invariant source. |
| contextType `general` for the two boundary/naming maps | They guide where things live and what they are called across layers; the other five specify runtime behavior and use `implementation`. |
| Replace `ensureCodeGraphReady` instead of keeping it | The checker tolerates it, but the campaign contract requires lowercase multi-word phrases; "ensure code graph ready" keeps the same routing intent. |
| Smoke via Python local mode, not the live daemon | The live daemon adopts the doc-trigger flag only after a session cycle (packet 145 T025); the Python path reads the same files under the same flag and proves routing now. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-skill-doc-frontmatter.sh --skill system-code-graph --coverage` | PASS — docs=7, carrying-detailed-block=7, violations=0 |
| Python local-mode smoke ("code graph launcher lease stale reclaim", flag on) | PASS — system-code-graph first at 0.95 with `!code graph launcher lease(signal)` in the match reason |
| Diff hygiene | PASS — git diff shows only frontmatter hunks in the 7 files |
| Live daemon `matchedDocs` smoke | DEFERRED — rides packet 145 T025 (session-cycle daemon adoption) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live-daemon verification is campaign-level, not per-phase.** The running advisor daemon predates the launcher allowlist fix, so `matchedDocs` cannot be observed live until every advisor-attached session ends and a fresh session respawns it (tracked as packet 145 T025).
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
