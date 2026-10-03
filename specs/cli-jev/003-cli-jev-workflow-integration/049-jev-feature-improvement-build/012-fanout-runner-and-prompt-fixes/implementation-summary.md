---
title: "Implementation Summary"
description: "The fan-out merge now reads every delta finding a lineage writes, and the iteration prompt states the field, contradiction and path rules; the runner part waits on another packet."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/012-fanout-runner-and-prompt-fixes"
    last_updated_at: "2026-10-03T05:30:12Z"
    last_updated_by: "template-author"
    recent_action: "Built and reviewed the merge and prompt parts"
    next_safe_action: "Build REQ-002 and REQ-004 in fanout-run.cjs once 040 lands"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-049"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-fanout-runner-and-prompt-fixes |
| **Completed** | 2026-10-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Re-merging 048's 008 lineages from their original rows now yields all 53 findings and passes closeout, where the old merge kept 26 and refused. The runner part waits on another packet.

### Phase 1: merge and prompt

`fanout-merge.cjs` reads a delta finding's text from `claim` and `summary` as well as the older fields, and writes a `delta_finding_unreadable` warning naming the file and row when it cannot read one. `prompt-pack-iteration.md.tmpl` tells a lineage to put a finding's text in `label`, to record a contradiction as a finding and keep going because no operator is present, and to write each artifact at the exact lineage path it is given.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modified | Read `claim` and `summary`, warn on unreadable rows |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Modified | Cases for `claim` rows and the warning |
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Modified | Label field, contradiction rule, verbatim lineage-path rule |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts` | Modified | Render assertions for the three instructions |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.md` | Modified | Template hash regenerated |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash max built the merge and prompt changes on cli-pi. Luna 6 max fast reviewed them on cli-codex and found two P1s on REQ-003. The session moved the absolute lineage path into the runner work as REQ-004, and DeepSeek added the render assertions. The session ran the suites and the re-merge proof.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move the absolute lineage path to the runner | The runner passes the base directory as the caller wrote it, so only the runner can resolve it |
| Leave the runner part blocked | `fanout-run.cjs` carries another session's uncommitted 040 change in the primary checkout |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/unit/fanout-merge.vitest.ts tests/unit/deep-research-run-open.vitest.ts tests/unit/check-contract-drift.vitest.ts` | 78 passed |
| `npx vitest run tests/unit/prompt-pack.vitest.ts` | 11 passed |
| Re-merge of 048/008 from original delta rows | 53 findings, closeout exit 0; HEAD merge 26 findings, closeout exit 2 |
| `validate.sh --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Runner part not built.** REQ-002 (projection refusal is non-retryable) and REQ-004 (absolute lineage directory) wait on `system-deep-loop/040-cli-pi-opencode-go-route`.
2. **Containment advisories stay noisy.** Advisories that flag the orchestrator's own writes on a shared checkout cannot attribute a write to its process.
<!-- /ANCHOR:limitations -->

---


