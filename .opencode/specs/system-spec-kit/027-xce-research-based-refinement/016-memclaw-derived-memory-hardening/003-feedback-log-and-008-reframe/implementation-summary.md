---
title: "Implementation Summary: Phase 3: feedback-log-and-008-reframe [template:level_1/implementation-summary.md]"
description: "Planned-stub summary for Phase 3 feedback-log-and-008-reframe. Nothing implemented: records the intended shadow-only feedback ledger confirmation, reserved system feedback types, future-reducer invariants, and 008 reducer rescope coordination before any code is written."
trigger_phrases:
  - "feedback event ledger shadow only summary"
  - "008 reducer reframe diagnostics first"
  - "reserve system feedback artifact types"
  - "constitutional immunity rare-but-correct guard"
  - "asymmetric damping anti-pattern memory"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-memclaw-derived-memory-hardening/003-feedback-log-and-008-reframe"
    last_updated_at: "2026-06-06T10:10:48Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffold Phase 3 planned-stub impl doc"
    next_safe_action: "Begin T001 audit of feedback-ledger shadow-only guarantees"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-feedback-log-and-008-reframe"
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
| **Spec Folder** | 003-feedback-log-and-008-reframe |
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

Nothing has been built yet. This is a planning stub for Phase 3 of the Memclaw-derived memory hardening, written before any code is touched. The phase exists to lock in the central safety posture: feedback in this single-user store stays event-capture plus diagnostics only and never mutates ranking, retention, or FSRS state. The plan rests on a key research finding — caura-memclaw's feedback loop applies direct, immediate, asymmetric weight mutation (success +0.10 / failure -0.15) with no shadow state, and low weight feeds stale-archival, so one mis-attributed failure can irrecoverably demote a rare-but-correct memory. That validates Spec Kit's existing default-off, shadow-first posture, so this phase is largely validation, scoping, and documentation on top of substrate that already exists.

### Planned: keep the feedback ledger shadow-only (REQ-002)

The plan confirms `lib/feedback/feedback-ledger.ts` stays shadow-only with its five fixed event types (`search_shown`, `result_cited`, `query_reformulated`, `same_topic_requery`, `follow_on_tool_use`) and no ranking side-effects, and that `query-flow-tracker.ts` and the shadow-gated `batch-learning.ts` stay diagnostic-only. Active reducers (retrieval-score, retention, FSRS mutation) remain deferred until measured ledger quality justifies one. No new behavior is added here — the work is to assert and test the absence of live side-effects.

### Planned: reserve system feedback types at the write boundary (REQ-001)

The plan reserves the system-generated feedback event/artifact types server-side at the schema boundary (`schemas/tool-input-schemas.ts`), so a user or agent write cannot forge a learning signal. There is no public feedback-write tool today, and the plan keeps it that way: the server stamps the feedback type, and a write attempting to supply a reserved type is rejected.

### Planned: record future-reducer invariants and coordinate the 008 rescope (REQ-003, REQ-004)

The plan documents three invariants any future reducer must honor — symmetric/soft damping (no asymmetric penalty), a rare-but-correct guard for high-tier / constitutional / user-confirmed / sparse-domain memories, and constitutional immunity (feedback may never demote or archive constitutional/protected memories). It also adds a coordination note flagging the `008-learning-feedback-reducers/{001-aggregator,003-causal-reducer,004-retention-reducer,005-env-tests-integration}` children for rescope to diagnostics-first; those specs are not edited from this phase.

### Files Changed (planned)

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts` | Planned (Modify) | Confirm/assert shadow-only capture; no ranking side-effects introduced |
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts` | Planned (Modify) | Confirm follow-on / requery events stay diagnostic-only |
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts` | Planned (Modify) | Confirm shadow-gated batch learning keeps active effects deferred |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Planned (Modify) | Confirm follow-on tool-use logging emits system-stamped events only |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Planned (Modify) | Reserve system feedback artifact types; reject forged feedback writes |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/` | Planned (Coordinate, no edit) | Flag active-reducer children for rescope to diagnostics-first |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Not delivered. The planned approach is to confirm the shadow-only ledger, reserve the system feedback types at the schema boundary, document the future-reducer invariants, and prove the posture with vitest unit tests (forged feedback rejected; ledger path mutates no live ranking / retention / FSRS columns). Nothing has been tested or shipped.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Treat 008 as event-capture + diagnostics only; defer all active reducers | A single mis-attributed failure under caura-memclaw's asymmetric -0.15 mutation can irrecoverably demote a rare-but-correct memory in a sparse single-user corpus; we wait for measured ledger quality before any reducer |
| Reserve system feedback types server-side instead of exposing a feedback-write tool | If callers could supply a feedback type they could forge a learning signal; stamping the type on the server keeps reducer inputs trustworthy |
| Record symmetric-damping + rare-but-correct + constitutional-immunity invariants now | The anti-pattern is asymmetric damping plus stale-archival; documenting the guardrails up front stops a future reducer from rebuilding it |
| Coordinate (not edit) the 008 active-reducer children's rescope | Keeps this phase's scope frozen to validation/docs while flagging the downstream children as diagnostics-first / deferred |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| vitest: forged feedback writes rejected (reserved-type rejection) | Not started — plan only |
| vitest: ledger path produces no ranking / retention / FSRS side-effects | Not started — plan only |
| Manual: no public feedback-write tool exposed; invariant docs + 008 coordination note present | Not started — plan only |
| `validate.sh --strict` on this spec folder | Not started — plan only |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Not implemented.** This document is a planned stub; no code, tests, or schema changes exist yet. All claims above describe intended work, not shipped behavior.
2. **Depends on Phase 001 provenance.** Reserving the `feedback` artifact types assumes Phase 001's `source_kind` provenance lands first; until then a future reducer cannot distinguish system-stamped feedback from forged writes.
3. **Concrete ledger-quality gates are undefined.** The thresholds (volume, mis-attribution rate, signal/noise) that would justify enabling any active reducer are deferred to the 008 rescope coordination and are not set here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

