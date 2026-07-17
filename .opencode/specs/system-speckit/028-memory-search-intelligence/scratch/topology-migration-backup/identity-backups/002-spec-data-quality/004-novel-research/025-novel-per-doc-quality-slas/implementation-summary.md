---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Per-doc quality SLA. PLANNED scaffold, nothing built yet, no completion claimed."
trigger_phrases:
  - "per doc quality sla status"
  - "sla scaffold"
  - "report only ticket"
  - "planned not built"
  - "host queue dependency"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/004-novel-research/025-novel-per-doc-quality-slas"
    last_updated_at: "2026-07-06T19:16:37.597Z"
    last_updated_by: "markdown-agent"
    recent_action: "Scaffolded planned per-doc quality SLA doc set"
    next_safe_action: "Build SLA evaluator once a host queue ships"
    blockers:
      - "Host queue (freshness decay queue or B3 refinement_queue) must exist before build"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/quality/quality-loop.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/pe-gating.ts"
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
| **Spec Folder** | 025-novel-per-doc-quality-slas |
| **Status** | PLANNED, scaffold only |
| **Completed** | Not yet implemented |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This phase is a PLANNED scaffold. The spec, plan, tasks and checklist describe the intended work, and no code has been written. The phase builds only after a host maintenance queue exists.

### Per-Doc Quality SLA (planned)

The planned work adds a named per-doc quality SLA, a threshold over the score that `computeMemoryQualityScore` already produces on the save path (`quality-loop.ts:392`). A thin evaluator in `quality-sla.ts` will read that score and the declared threshold from the description.json governance block, then return an at-risk verdict for a doc below its bar. A report-only emitter in `sla-ticket.ts` will file one ticket into an existing host queue and will never mutate the doc. The whole path will sit behind a default-off flag.

### Files Changed

No files changed yet. The table below lists the planned surfaces.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/quality/quality-sla.ts` | Planned (create) | Thin SLA evaluator over the already-computed quality score |
| `.opencode/skills/system-spec-kit/mcp_server/lib/quality/sla-ticket.ts` | Planned (create) | Report-only ticket emitter behind the default-off flag |
| `.opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts` | Planned (modify) | Additive SLA threshold field on the governance block |
| `.opencode/skills/system-spec-kit/mcp_server/tests/quality-sla.vitest.ts` | Planned (create) | Threshold, report-only and default-off tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. This is a PLANNED scaffold. The intended rollout keeps the evaluator behind a default-off flag, files only report-only tickets and builds after a host queue (freshness decay queue or B3 `refinement_queue`) ships. Verification will run the planned Vitest suite plus a manual flag-off check before any completion claim.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the shipped pure scorer and add no second scorer | The SLA reads the already-computed score so it stays thin and a parallel scorer is an explicit NO-GO |
| Declare the threshold on the description governance block | The block already carries the A8 governance fields so the SLA is one additive field through the existing passthrough schema |
| File report-only and never auto-action | Keeps the phase a flag for triage and leaves any later action to the host queue's own governance |
| Build only after a host queue exists | The SLA files a ticket and has nowhere to file until a host queue ships |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this scaffold doc set | PASS (documents only, feature not built) |
| `quality-sla.vitest.ts` suite | Not run, feature not built |
| Manual flag-off byte-for-byte check | Not run, feature not built |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This phase is a PLANNED scaffold. No evaluator, emitter or schema field exists yet.
2. **Blocked on a host queue.** The SLA cannot file a ticket until a freshness decay queue or a B3 `refinement_queue` exists. The evaluator degrades to a no-op until then.
3. **Reuses the shipped scorer only.** The SLA reads the existing computed score and adds no scoring path of its own.
<!-- /ANCHOR:limitations -->
