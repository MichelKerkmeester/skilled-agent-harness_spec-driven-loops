---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will build a prod-mode completeRecall@3 gate from a multi-target gold set, a PROMOTION and REGRESSION wrapper, and a stored baseline. No code change has landed."
trigger_phrases:
  - "prod mode recall gate"
  - "complete recall at 3"
  - "spec corpus golden"
  - "run spec recall gate"
  - "retrieval regression gate"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/015-c2-prodmode-recall-gate"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase impl doc for C2 prod-mode recall gate scaffold"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-corpus-golden.json"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-spec-recall-gate.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-recall-baseline.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
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
| **Spec Folder** | 015-c2-prodmode-recall-gate |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Multi-target spec-corpus gold set

The phase will author a `spec-corpus-golden.json` whose every query carries a relevance set across the enumerated measurability classes. Today the shipped goldens are single-target and saturate, so they hide wins because a single-target query has nothing to be incomplete about. The new gold set gives completeRecall@3 multiple targets per query, so every query contributes a measurable incompleteness and the metric stops saturating.

### Prod-mode completeRecall@3 gate

The phase will build a `run-spec-recall-gate.mjs` wrapper with a PROMOTION mode and a REGRESSION mode that read only the prod-lens completeRecall@3 column. PROMOTION asserts the prod column rises over a stored baseline, and REGRESSION asserts it does not fall below the baseline by more than the configured tolerance. The gate emits a real recall-verdict exit code distinct from the existing crash handler at line 357, so a retrieval-class change can be promoted only on a measured prod-column rise and regressed when it falls.

### Stored baseline and narrow harness export

The phase will write a `spec-recall-baseline.json` that records the prod-column completeRecall@3 per class and overall, with a generated-at stamp and source DB path. It will add one narrow export to the unchanged `run-eval-v2.mjs` so the gate consumes the prod lens and the measurability classes through `buildSearchLenses`, `meanCompleteRecallProfile`, and `MEASURABILITY_CLASSES` rather than re-implementing the lenses. The baseline freezes only after the first non-saturating prod run.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-corpus-golden.json` | Planned create | Multi-target gold set, one relevance set per query across the measurability classes |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-spec-recall-gate.mjs` | Planned create | PROMOTION and REGRESSION gate reading only the prod-lens completeRecall@3 column |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-recall-baseline.json` | Planned create | Stored prod-column completeRecall@3 baseline with provenance |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs` | Planned modify | Add a narrow export for the prod lens and classes, lenses unchanged |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned sequence authors the multi-target gold set first, then builds the gate against the harness copy DB, then freezes the first baseline from a non-saturating prod run. The regression proof that a degraded prod profile exits with the recall-verdict code, and the promotion proof that a measured rise passes while an unchanged profile does not, land with the gate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read only the prod column | The K=3 prod floor hides the recall band, so an eval-lens or external @K read would repeat the 028 saturation mistake |
| Reuse the harness lenses through one export | The dual-mode harness already ships, so a thin wrapper avoids forking the lens body and the eval-versus-prod measurement drift |
| Freeze the baseline only after a non-saturating run | A baseline frozen on a saturating gold set would mis-calibrate the per-class thresholds |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet. The planned gate command is `node run-spec-recall-gate.mjs --mode regression` and the planned docs gate is `validate.sh --strict`.

| Check | Result |
|-------|--------|
| A degraded scratch prod profile fails REGRESSION mode with the recall-verdict code | PLANNED, not yet run |
| A measured prod completeRecall@3 rise passes PROMOTION mode and an unchanged profile does not | PLANNED, not yet run |
| The gold set has no single-target query and every query carries a class tag | PLANNED, not yet run |
| The gate refuses an eval-lens input | PLANNED, not yet run |
| A missing baseline seeds a first baseline rather than scoring as complete | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Baseline precondition.** The first baseline cannot freeze until a multi-target prod run measures non-saturating, so the per-class thresholds stay uncalibrated until then.
3. **Open threshold question.** Whether the per-class completeRecall@3 thresholds are calibrated from the first prod baseline or set as fixed floors before the first run is unresolved.
<!-- /ANCHOR:limitations -->

---
