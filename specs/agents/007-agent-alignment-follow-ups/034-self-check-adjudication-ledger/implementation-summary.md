---
title: "Implementation Summary"
description: "The deep-review self-check now records each per-finding call in the ledger, so a downgrade or false positive lowers the registry counts the verdict, report and closeout use."
trigger_phrases:
  - "self check adjudication ledger implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/034-self-check-adjudication-ledger"
    last_updated_at: "2026-11-16T05:46:11Z"
    last_updated_by: "generate-context"
    recent_action: "Built phase 034 self-check ledger persistence"
    next_safe_action: "Commit phase 034, merge main and push"
    packet_purpose: "Purpose: Let the self-check's per-finding calls reach the registry, and derive the verdict from the registry after them."
    blockers: []
    key_files:
      - "specs/agents/007-agent-alignment-follow-ups/034-self-check-adjudication-ledger/implementation-summary.md"
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts"
      - ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs"
      - ".skilled/commands/deep/assets/deep-review.yaml"
      - ".skilled/skills/system-deep-loop/runtime/tests/unit/self-check-adjudication.vitest.ts"
    session_dedup:
      fingerprint: "sha256:97c3eabd1ceddaa7975efe7dec09ae939794795f41f051f55bf89ebfc7f05fb5"
      session_id: "scaffold-034-self-check-adjudication-ledger"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a84f4eed-26f9-49ac-91eb-e2375c207e96"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-16T05:46:11Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 034-self-check-adjudication-ledger |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A finding the adversarial self-check downgrades or rejects now stops counting at its first severity. Before this phase the ledger refused a self-check row naming a finding, so the call stayed in the report and the verdict counted the finding as raised.

### Phase 34: self-check-adjudication-ledger

`deep_review.claim_adjudication` in `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts` takes two optional fields, `findingId` and `finalSeverity` (`none`, `P0`, `P1`, `P2`), and the payload type carries them. Gate rows without them stay valid. The state-log projection already copies every declared field. `reduce-state.cjs` already applied a P0 to P2 final severity by finding id; it now reads `none` as a false positive and moves that finding to resolved findings with `resolution: false_positive`. In `deep-review.yaml` the self-check appends one row per call through the gateway, repeating the latest gate row's fields so the gate reading stays the same, then refreshes the registry once. `step_derive_verdict` now runs after the self-check, so the verdict, the report and the closeout read counts that include its calls. A fan-out root keeps the calls in the report only.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts` | Modified | Two optional fields |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts` | Modified | Two optional fields |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modified | False positive moves a finding to resolved |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-ledger-schema.vitest.ts` | Modified | Accept, refuse and plain cases |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/self-check-adjudication.vitest.ts` | Created | Gateway append, projection, registry and verdict counts |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modified | Self-check writes its calls; verdict after it |
| `.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/adversarial-self-check.md` | Modified | Where the calls go |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerated | Source digests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash at `--thinking max` through cli-pi built each task in its own dispatch, and the conductor read every diff and reran the checks. The scratch probe from phase 30 was rerun on the final code: the row it had been refused with now appends with exit 0, and the projected row carries `findingId` F001 and `finalSeverity` P2. The workflow task found that the reducer dropped `none` with a warning; the reducer task fixed it, and its test fails with the false-positive helper disabled.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Optional fields on the existing gate stem | The convergence gate and the dashboard already read this stem, and the richer typed stem has no writer |
| Repeat the latest gate row's fields | Readers take the last claim_adjudication row's `passed` flag, so a per-finding row must not change it |
| Derive the verdict after the self-check | One derivation that reads the refreshed registry, instead of a second verdict |
| Fan-out root stays report-only | It has no root state log before closeout; each lineage's own registry is what the merge counts |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Gateway probe | Refused before; exit 0 now, projected row carries both fields |
| Ledger, gateway and projection tests | PASS: 205 of 205 in ten files |
| Reducer, verdict and dashboard tests | PASS: 216 of 216 in eight files |
| Workflow YAML tests | PASS: 319 of 319 in 19 files |
| Runtime suite | PASS: 185 files, 3,095 passed, 9 skipped (baseline 184 files, 3,092 passed) |
| `npm run typecheck` | PASS: no errors |
| Contract drift and snapshot check | PASS |
| spec-kit `deep-review-contract-parity.vitest.ts` | PASS: 12 of 12 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The appends are workflow guidance.** The loop agent writes the pairs; a call it leaves out does not reach the registry.
2. **A fan-out review's self-check does not change its counts.** Its lineages each count their own findings, and the merge reads those.
<!-- /ANCHOR:limitations -->

---
