---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. The Stage 4 flag graduation benchmark is scaffolded and HARD-GATED on phase 039, the full-repo migration, being done. It will run a real before-and-after on live data and queries for every default-OFF program flag, reusing the phase 025 false-confirm driver and the phase 029 benchmark harness, graduate the flags that measurably earn it to default-ON, keep the rest off with the reason recorded, and write the verdicts to benchmark-status.md and keep-off-flag-roadmap.md per the 028 earn-or-delete discipline."
trigger_phrases:
  - "flag graduation benchmark"
  - "stage 4 before and after benchmark"
  - "default off flag earn or delete"
  - "graduate flag to default on"
  - "keep off flag roadmap verdict"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/040-flag-graduation-benchmark"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the Stage 4 graduation benchmark phase at PLANNED"
    next_safe_action: "Confirm phase 039 done, then wire the per-flag before-and-after harness"
    blockers:
      - "HARD-GATED on phase 039, the full-repo migration, being done"
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/graph/flag-graduation-benchmark.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-040-flag-graduation-benchmark"
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
| **Spec Folder** | 040-flag-graduation-benchmark |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. Nothing is built yet. This phase is scaffolded and HARD-GATED on phase 039, the full-repo migration, being done. The sections below describe the intended Stage 4 benchmark so the work is ready to start the moment the gate clears.

### Intended scope

The benchmark will run a real before-and-after on live data and live queries for every default-OFF flag from this program, `SPECKIT_LEXICAL_GROUNDING_V1`, `SPECKIT_IDENTITY_MERGE_SAFETY`, `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES`, `SPECKIT_ENVELOPE_FIDELITY_V1`, the phase 037 `SPECKIT_GENERATED_METADATA_DRIFT_GATE`, the phase 038 generator-hardening source-fingerprint flag, and the 028-scoring-hardening flags `SPECKIT_CITE_WITH_CAVEAT_V1`, `SPECKIT_EVIDENCE_GAP_VERDICT_V1`, `SPECKIT_GROUNDING_SIGNAL_V1` and `SPECKIT_NOISE_FLOOR_SUBTRACTION_V1`. Each flag will be toggled in isolation against the same corpus and query set.

### Intended measurement and decision

The measurement will reuse the phase 025 false-confirm driver for the safety metric and the phase 029 benchmark harness for the retrieval and scoring metrics, no new harness will be built. Each graduation will be gated on the measured before-and-after clearing the bar on both metrics. A flag that earns it flips to default-ON, the rest stay off with the reason recorded, per the 028 earn-or-delete discipline. The verdicts will land in `benchmark-status.md` and `keep-off-flag-roadmap.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/graph/flag-graduation-benchmark.ts` | Create | The Stage 4 driver, toggle each flag in isolation, run the two harnesses and emit the before-and-after delta |
| `benchmark-status.md` | Create | Per-flag before-and-after numbers and the graduation verdict |
| `keep-off-flag-roadmap.md` | Create | Every kept-off flag with its reason and revisit condition |
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Modify | Flip each graduated flag's default to ON, leave the kept-off flags default-OFF |
| `.opencode/skills/system-spec-kit/scripts/tests/flag-graduation-benchmark.vitest.ts` | Create | Prove single-flag isolation, the dual safety gate and the kept-off default |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The intended delivery order is to confirm phase 039 is done so the corpus is fully migrated, build the flag-set iterator and the before-and-after runner over the two existing harnesses, implement the dual graduation gate, then write the verdict docs and flip the earners default-ON.

### Deviations from the plan

- None yet, the phase is at PLANNED.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the phase 025 false-confirm driver and the phase 029 benchmark harness | The measurement machinery already exists and is validated, building a new harness would re-derive a solved problem |
| Toggle each flag in isolation | A combined toggle cannot attribute a delta to one flag, isolation keeps each verdict defensible |
| Gate graduation on a dual metric | A flag that helps retrieval but raises false confirms must not graduate, the safety metric is a hard side of the gate |
| Keep a neutral flag off with the reason recorded | The 028 earn-or-delete discipline requires a measurable earn, a neutral result is not an earn |
| Record verdicts in two docs | `benchmark-status.md` holds the numbers and decisions, `keep-off-flag-roadmap.md` holds the kept-off reasons and revisit conditions so the keep-off is auditable |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Not yet run, the phase is at PLANNED. The intended verification is below.

| Check | Result |
|-------|--------|
| `npx vitest run scripts/tests/flag-graduation-benchmark.vitest.ts` | Pending |
| Benchmark run over the migrated corpus, per-flag before-and-after | Pending, expect a delta per flag |
| Dual-gate check, false-confirm regression blocks graduation | Pending |
| `bash scripts/spec/validate.sh <040> --strict` | Exit 0 on the scaffold, see DOCS gate |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Blocked until phase 039 lands.** The before-and-after is only meaningful on a fully-migrated corpus, so the phase is inert at PLANNED until the migration is done.
2. **Measures and graduates, does not re-implement.** The flags are delivered by their owning phases, this phase decides their default state on evidence.
3. **Keep-off records a verdict, not a deletion.** A permanently-rejected flag's code deletion is a separate cleanup, this phase records the keep-off reason and revisit condition.
<!-- /ANCHOR:limitations -->

---
</content>
