---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Planned status for the report-only contradiction detector. Nothing is implemented yet and this packet is a scaffold blocked on two upstream deps."
trigger_phrases:
  - "contradiction detection"
  - "staleness detection"
  - "cross-doc consistency"
  - "llm entailment scoring"
  - "candidate-pair gating"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/004-novel-research/001-novel-contradiction-detection"
    last_updated_at: "2026-07-06T18:49:46.032Z"
    last_updated_by: "markdown-agent"
    recent_action: "Scaffolded planned status for the detector build"
    next_safe_action: "Build the detector after deps land"
    blockers: []
    key_files: []
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
| **Spec Folder** | 019-novel-contradiction-detection |
| **Status** | PLANNED, scaffold not yet implemented |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This packet is a planned scaffold. The spec, plan, tasks and checklist describe a report-only contradiction detector. No detector code exists. This record stays at PLANNED until the build starts.

### Planned: report-only contradiction detector

The plan is a single new detector class at `scripts/sweep/detectors/contradiction.ts` registered with `fixClass: none` in the shared `detector-registry.ts`. It will pair only docs that share an `entity_catalog` entity or a causal edge, score each candidate pair as agree, contradict or stale with an LLM entailment check and emit a finding into the existing B1 report channel. It will write no vector row and mutate no body. The build is blocked on 026-shared-safe-fix-engine for the registry and report channel and on 011-scheduled-dq-sweep for the fan-out it mounts on.

### Files Changed

No files have been created or modified for the detector. The table lists the planned targets only.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/sweep/detectors/contradiction.ts` | Planned create | Candidate-pair generation, entailment scoring and finding emission |
| `.opencode/skills/system-spec-kit/scripts/sweep/detector-registry.ts` | Planned modify | Register the contradiction detector with `fixClass: none` |
| `.opencode/skills/system-spec-kit/scripts/sweep/dq-sweep.ts` | Planned modify | Fold the detector into report mode behind a default-off flag |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The build has not started. When it runs, the detector ships dark behind a default-off flag so it never blocks an existing gate. Its value proof is the first flag-on report run that surfaces a real cross-doc conflict on the live corpus.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

These are the design decisions the spec already locked. None are implemented.

| Decision | Why |
|----------|-----|
| Register with `fixClass: none` | A `none` class means the engine never offers an apply path, so the detector stays report-only by construction with no write path to the corpus |
| Gate candidate pairs by shared entity or causal edge | Pairing only docs that share an `entity_catalog` entity or a causal edge keeps the LLM-call count bounded by connectivity rather than the all-pairs quadratic |
| Land behind a default-off flag | Shipping dark lets the detector mount on the B1 sweep without changing any existing gate until a reviewer opts in |
| Emit a finding, never a vector row | A contradiction is a finding for a human to triage, so it bypasses the retrieval floor and never touches ranking |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No build verification has run because no detector code exists.

| Check | Result |
|-------|--------|
| Detector implementation | Not started (PLANNED) |
| Unit and integration tests | Not run, no code to test |
| Spec-kit doc-set (validate.sh --strict) | PASS on the scaffold, doc structure only, no build verified |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This packet is a planned scaffold. The detector build is blocked on 026-shared-safe-fix-engine and 011-scheduled-dq-sweep landing first.
2. **Entailment scorer is undesigned.** The LLM choice and the agree-or-contradict-or-stale rubric are open questions carried in spec.md section 10.
3. **Confidence threshold unset.** The cutoff that separates a reported contradiction from a discarded low-confidence pair is not yet chosen.
4. **Staleness time axis undecided.** Whether the stale tag reads the `last_updated_at` continuity field or a git-history timestamp is still open.
<!-- /ANCHOR:limitations -->
