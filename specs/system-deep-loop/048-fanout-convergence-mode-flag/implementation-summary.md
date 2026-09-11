---
title: "Implementation Summary"
description: "A documented flag the fan-out path never read now reaches the lineage it was always meant to configure."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/048-fanout-convergence-mode-flag"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Shipped and verified the flag threading"
    next_safe_action: "None outstanding"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-deeploop-048"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 048-fanout-convergence-mode-flag |
| **Status** | Complete |
| **Completed** | 2026-09-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A flag that had been documented for some time and read by nobody now reaches the
lineage it configures.

The command surface documents `--convergence-mode` with four values. On a
fan-out run the runner never read it, so every lineage took the default while
the caller believed otherwise. The stored config of a completed run recorded
`convergenceMode: "standard"` and `maxIterations: 6` against a caller that had
asked for `off` and `5`.

What hid it is worth keeping in mind: `--stop-policy=max-iterations` is carried,
and it produces the same visible outcome. The loop runs to its ceiling either
way. The two only diverge in what the config records and in what a mode other
than `off` would have done, so the gap never announced itself.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/scripts/fanout-run.cjs` | Modified | Normalizer, parse, and three emission points |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Following the path the threshold and stop policy already take, rather than
inventing one. The value is `null` when the flag is absent and every emission is
conditional, so a caller who does not pass it gets a byte-identical prompt.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reject an unknown value rather than fall back to the default | Falling back is what produced the original silence |
| Keep absent meaning absent | Existing callers should see no change at all |
| Follow the threshold's existing path | Two values already travel this route; a third needs no new mechanism |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` on the runner | PASS |
| Unknown value | PASS. `convergenceMode must be one of: default, off, sliding-window, divergent`, code `INPUT_VALIDATION` |
| Accepted value | PASS. Run proceeds past input validation |
| Emission points | PASS. Prompt config, leaf command line, and setup bindings all carry it; both prompt call sites thread it |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The leaf's handling of each mode is unchanged and untested here.** This
   packet carries the value; what `sliding-window` and `divergent` do once it
   arrives is the anti-convergence implementation's business.
2. **Runs completed before this change recorded the default.** Their stored
   configs say `standard` regardless of what was asked for, and no longer reflect
   caller intent. Read them with that in mind.
<!-- /ANCHOR:limitations -->
