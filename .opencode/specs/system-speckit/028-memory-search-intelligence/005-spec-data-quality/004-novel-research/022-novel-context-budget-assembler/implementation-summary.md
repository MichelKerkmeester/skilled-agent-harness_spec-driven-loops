---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Scaffold record for the novel context-budget-fitting assembler. Status PLANNED, the feature is not built yet."
trigger_phrases:
  - "context budget assembler"
  - "near duplicate dedup"
  - "diverse packet selection"
  - "context density"
  - "token per relevant row"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/004-novel-research/022-novel-context-budget-assembler"
    last_updated_at: "2026-07-04T17:12:06.511Z"
    last_updated_by: "markdown-agent"
    recent_action: "Scaffolded phase docs as planned"
    next_safe_action: "Build the assembler module then verify"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/context-budget-assembler.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-novel-context-budget-assembler |
| **Status** | PLANNED (scaffolded, not yet implemented) |
| **Completed** | Pending |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does plus why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     For Level 1-2, a Files Changed table after the narrative is fine. -->

Nothing is built yet. This phase is scaffolded and PLANNED. The notes below describe the intended change so the build has a fixed target. No module, no seam edit and no test exists at this point.

### Context-Budget-Fitting Assembler (planned)

The planned change adds a pure `context-budget-assembler.ts` module plus one seam edit in `hybrid-search.ts`. Once built, the assembler will run after the confidence floor on the returned set, drop near-duplicate results and prefer diverse packets within a token budget so a caller spends its context on distinct information rather than repeated packets. It will land default-off behind `SPECKIT_CONTEXT_BUDGET_ASSEMBLER`, need no re-index and change no recall. None of this is implemented yet.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/context-budget-assembler.ts` | Planned (Create) | Pure dedup, diversity and floor-preserving assembler that reports density metrics |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Planned (Modify) | Post-floor assembleByBudget call behind the default-off flag |
| `.opencode/skills/system-spec-kit/mcp_server/tests/context-budget-assembler.vitest.ts` | Planned (Create) | Dedup, diversity, floor-preservation, flag-off and density-metric tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     For a scaffold, state that delivery has not started and name the intended path. -->

Not delivered yet. The phase holds spec.md, plan.md, tasks.md, checklist.md and this scaffold record only. The intended path is the vitest suite plus a flag-off no-op proven byte-for-byte against the live search path, then a default-off rollout gated by `SPECKIT_CONTEXT_BUDGET_ASSEMBLER`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you are explaining to a colleague. -->

| Decision | Why |
|----------|-----|
| Run after the floor, not as a retrieval change | Keeps recall fixed and avoids the C2 prod-recall gate, since the assembler only reshapes what the floor already returned |
| Default-off behind a flag | Lets prod pay nothing until the density gain is proven on this corpus |
| Reuse per-row vectors or text with no re-embed | Avoids an embedding-coverage dependency and keeps the step cheap on the hot path |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes. For a scaffold, mark code checks PLANNED. -->

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this scaffold doc set | PASS (doc set valid, feature not yet built) |
| `context-budget-assembler.vitest.ts` suite | PLANNED, not yet written |
| Flag-off byte-for-byte no-op against the search path | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable. -->

1. **Not implemented.** This phase is PLANNED. The module, the seam edit and the tests do not exist yet. The `SPECKIT_CONTEXT_BUDGET_ASSEMBLER` flag will have no effect until the build lands.
2. **Open thresholds.** The near-duplicate similarity threshold and the token-budget default are open questions in spec.md and are not yet fixed.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
