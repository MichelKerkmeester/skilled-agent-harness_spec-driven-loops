---
title: "Implementation Summary: advisor packed BM25F lexical shadow helper"
description: "Added a default-off packed BM25F lexical shadow helper for advisor skill fields while preserving existing live recommendation ranking."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/003-advisor-packed-bm25-lexical"
    last_updated_at: "2026-06-10T21:14:49Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Shipped BM25F shadow helper"
    next_safe_action: "Future promotion requires advisor_validate gate"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/bm25.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/scorer/bm25-lexical-shadow.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-advisor-packed-bm25-lexical"
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
| **Spec Folder** | 003-advisor-packed-bm25-lexical |
| **Completed** | 2026-06-10 |
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

The advisor now has a packed BM25F lexical scorer available for shadow evaluation without changing live recommendations. Existing token-overlap lexical scoring remains the only live lexical contribution, and the BM25 flag is default-off so ranking order and scores stay unchanged until a future promotion phase explicitly changes fusion.

> **Shadow-lane status:** The BM25F lane is deliberately not consumed by live fusion. This is intentional inert-until-promotion infrastructure, not an unfinished wiring step. Validation evidence for this phase is the vitest parity suite (live output proven byte-identical with the shadow flag on and off), not advisor_validate baselines. Wiring the lane into advisor_validate shadow recording is a scheduled future phase; wiring it now would violate the no-ranking-drift guardrail.

### Packed BM25F Shadow Helper

The helper builds a term dictionary over advisor skill fields and compacts postings into typed arrays after warmup. Each posting stores per-field term frequencies for name, keywords, domains, intent signals, derived triggers, and description; query-time BM25F weights emphasize authored identity fields above generic descriptions.

### Default-Off Guardrail

The live `scoreLexicalLane` function stays unchanged. `scoreLexicalShadowLanes` calls BM25 only when `SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW` is set to an enabled value, and `scoreAdvisorPrompt` does not consume BM25 output in this phase.

### Files Changed

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/bm25.ts` | Created | Packed BM25F helper with typed-array postings, query-time field weights, and footprint stats |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts` | Modified | Added default-off shadow wrapper while preserving live lexical scoring |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts` | Modified | Added BM25 shadow metadata outside live fusion lanes |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/bm25-lexical-shadow.vitest.ts` | Created | Added BM25F, footprint, corpus non-regression, and live parity tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Delivered as an additive shadow helper. The parity test serializes live `scoreAdvisorPrompt` output with the BM25 flag off, enables the flag, reruns the same prompt/projection, and asserts the JSON string is identical.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Keep BM25 outside `SCORER_LANES` | Adding it to live lane enumeration would change response shape and violate the no-ranking-drift guardrail because `fusion.ts` is out of scope. |
| Use typed arrays after helper construction | Query-time search only needs compact postings; tests assert mutable warmup postings are cleared. |
| Keep field weights query-time tunable | Future validation can tune field emphasis without rebuilding the packed index. |
| Leave promotion for a future phase | Live fusion and advisor_validate handler wiring are explicitly outside the allowed-write scope for this phase. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| `npx vitest run tests/scorer/bm25-lexical-shadow.vitest.ts` | PASS: 1 file, 5 tests |
| `npm run typecheck` | PASS |
| `npx vitest run tests/scorer/*.vitest.ts lib/scorer/lanes/__tests__/*.vitest.ts tests/handlers/advisor-validate.vitest.ts tests/handlers/advisor-validate-shapes.vitest.ts` | PASS: 9 files, 74 tests |
| `npm run build` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **No live promotion in this phase.** BM25F is evaluable as shadow output only. A future phase must wire the helper into advisor_validate baselines and then make a separate promotion decision.
2. **No handler changes.** `handlers/advisor-validate.ts` was not modified because it was not in the user-approved write paths.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
