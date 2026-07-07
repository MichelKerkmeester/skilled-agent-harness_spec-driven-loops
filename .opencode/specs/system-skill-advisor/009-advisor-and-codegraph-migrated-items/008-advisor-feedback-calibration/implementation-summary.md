---
title: "Implementation Summary: Shadow-only advisor feedback calibration"
description: "The advisor now records default-off calibration proposals from validate outcomes without changing live recommendation weights or ranking."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/005-advisor-feedback-calibration"
    last_updated_at: "2026-06-10T23:45:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed shadow feedback calibration reducer"
    next_safe_action: "Review advisory reports only; no automatic promotion"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-advisor-feedback-calibration"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Future promotion requires a separately approved held-out validation gate."
    answered_questions:
      - "The calibration lane is default-off, shadow-only, and not consumed by live scoring."
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
| **Spec Folder** | 008-advisor-feedback-calibration |
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

The advisor can now turn `advisor_validate` accepted/corrected/ignored outcomes into reviewable calibration reports without changing recommendations. The calibration lane is default-off, shadow-only, and records proposed lane-weight/threshold signals for inspection rather than promotion.

### Shadow Calibration Reducer

The reducer aggregates retained and current-run outcome records, applies sample guards, and emits proposed-vs-current weights and thresholds with explicit no-auto-promotion metadata. Low-sample sets are excluded, concentrated samples are excluded as poisoning-prone, and outcome-only records without lane attribution do not invent lane deltas.

### Validate Integration

`advisor_validate` now invokes the reducer only when `SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW` is explicitly enabled. Reports are written to a bounded JSONL inspection path; the recommendation handler and live scorer do not read them.

### Files Changed

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts` | Created | Adds the default-off reducer, guardrails, and advisory record persistence |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/weights-config.ts` | Modified | Adds a read-only proposal builder while leaving live defaults unchanged |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts` | Modified | Records shadow calibration reports from validate outcomes only when enabled |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/advisor-feedback-calibration.vitest.ts` | Created | Covers reducer behavior and byte-identical live scoring with flag off vs on |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-validate.vitest.ts` | Modified | Covers validate-handler report recording under the explicit shadow flag |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/005-advisor-feedback-calibration/{spec.md,plan.md,tasks.md,implementation-summary.md}` | Modified | Reconciles phase status, tasks, continuity, and evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

The implementation ships behind an unset-by-default flag. Targeted vitest coverage proves reducer behavior, validate integration, and byte-identical recommendation order, scores, and contribution weights with the shadow flag both disabled and enabled.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Keep calibration reports advisory only | Outcome feedback can be poisoned or biased; promotion needs a separate held-out validation decision. |
| Exclude lane deltas without lane attribution | The current validate event schema records outcomes and skills, not prompt-level lane evidence, so the reducer must not fabricate causal lane learning. |
| Persist bounded JSONL reports instead of changing scorer config | Operators can inspect proposed changes while live weights and thresholds remain frozen. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| `npm run test -- tests/scorer/advisor-feedback-calibration.vitest.ts tests/handlers/advisor-validate.vitest.ts` | PASS: 2 files, 11 tests |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| `npm run test` | BASELINE FAIL: 73 passed, 1 skipped, 1 failed file, 451 passed tests, 5 skipped, 35 failed in known out-of-scope `tests/hooks/settings-driven-invocation-parity.vitest.ts` |
| `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh <modified-code-file>` | PASS: no output for each modified TypeScript file |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/005-advisor-feedback-calibration --strict` | PASS: 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **No automatic promotion.** Calibration output is advisory only; any promotion requires future held-out validation and a separate change.
2. **No lane attribution in current validate events.** The reducer records no lane deltas for outcome-only records unless a future source supplies safe lane attribution.
3. **Full suite baseline.** The known out-of-scope parity failure remains outside this phase; targeted tests, typecheck, and build pass.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
