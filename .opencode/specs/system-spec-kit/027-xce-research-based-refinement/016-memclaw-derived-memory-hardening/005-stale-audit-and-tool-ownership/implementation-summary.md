---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "PLANNED STUB for Phase 5 stale-exclusion audit + derived tool-ownership lint. Not implemented; plan only. No work has been done yet."
trigger_phrases:
  - "stale exclusion audit implementation status"
  - "tool ownership lint planned stub"
  - "phase 5 not implemented plan only"
  - "derived ownership map implementation summary"
  - "recall diagnostic planned not started"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-memclaw-derived-memory-hardening/005-stale-audit-and-tool-ownership"
    last_updated_at: "2026-06-06T10:10:50Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffold Phase 5 planned-stub impl doc"
    next_safe_action: "Implement T001 intended-exclusion policy"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-stale-audit-and-tool-ownership"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 005-stale-audit-and-tool-ownership |
| **Status** | Planned (not implemented) |
| **Completed** | Not started — plan only |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

Nothing has been built yet. This is a planning stub for Phase 5; the work below is planned and not implemented. No code, tests, or docs have changed. The two planned deliverables are a read-only stale/status hard-exclusion audit (distinguishing intended exclusion from silent drop of relevant rows) and a derived MCP tool-ownership lint generated from `TOOL_DEFINITIONS`, both wired into health, `/doctor`, and pre-commit.

### Planned: Stale/Status Hard-Exclusion Audit (not implemented)

Once built, this read-only audit will let you see when default `memory_search` silently drops a deprecated-but-relevant row, surfaced as a diagnostic in startup health and `/doctor memory` — without changing recall policy. Not implemented yet.

### Planned: Derived Tool-Ownership Lint (not implemented)

Once built, the 37-tool MCP ownership/stability map will be generated from `TOOL_DEFINITIONS` rather than hand-maintained, and a pre-commit gate will hard-block ownership drift. Not implemented yet.

### Files Changed (planned)

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/search/hybrid-search.ts` | Modify (planned) | Expose intended-vs-actual exclusion predicates for the audit (no recall change) |
| `mcp_server/handlers/memory-crud-health.ts` | Modify (planned) | Run the read-only stale-exclusion audit and emit diagnostics in health |
| `.opencode/commands/doctor/assets/doctor_memory.yaml` | Modify (planned) | Extend `staleness_signals` with the hard-exclusion-risk diagnostic |
| `mcp_server/tool-schemas.ts` | Modify (planned) | Derive the tool-ownership/stability map from `TOOL_DEFINITIONS` |
| `.opencode/scripts/git-hooks/pre-commit` | Modify (planned) | Add a blocking tool-ownership drift gate to the existing chain |
| `mcp_server/references/config/hook_system.md` | Modify (planned) | Document the audit + ownership-lint surfaces and where they fire |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Not delivered. This phase is planned only. When implemented, the plan is vitest unit coverage on audit classification and lint drift detection, plus manual verification through `/doctor memory` and `/doctor skill-budget`, with the default `memory_search` result set confirmed unchanged.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Audit reports exclusion risk but does not change recall policy | We do not want to silently widen recall; flag the risk and let a separate decision change behavior |
| Derive the ownership map from `TOOL_DEFINITIONS`, treat docs as outputs | Hand-maintained docs drift; the normalized definitions are the only trustworthy source |
| Reject op-dispatch tool consolidation | Collapsing the 37-tool surface harms LLM tool discoverability, which matters more than tidiness here |
| Reject SemVer / release-please governance | This is a single-user local system, not a public-versioned package; that governance adds cost with no payoff |
| Keep runtime exclusion checks in health/`/doctor`, not pre-commit | A commit gate is not a runtime safety guarantee; pre-commit only gates ownership drift |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this spec folder | Not started — plan only |
| vitest: stale-exclusion audit separates intended vs silent exclusion | Not started — plan only |
| vitest: tool-ownership lint detects a synthetic ownership drift | Not started — plan only |
| Manual: `/doctor memory` plus `/doctor skill-budget` surface the diagnostics | Not started — plan only |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Not implemented.** This is a planning stub; no audit, lint, tests, or docs exist yet. Implementation starts at T001 (define the intended status-exclusion policy).
2. **Recall policy is intentionally unchanged.** Even after implementation, the audit only reports exclusion risk; widening recall to include deprecated rows requires a separate policy decision, not this phase.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

