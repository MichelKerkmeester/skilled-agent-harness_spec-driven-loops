---
title: "Implementation Summary"
description: "The router generator check passes again: the command contract now names each speckit router's real workflow assets, and an asset can be limited to the routers it applies to."
trigger_phrases:
  - "speckit router contract drift summary"
  - "generate-command-routers clean"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/007-speckit-router-contract-drift"
    last_updated_at: "2026-10-04T05:02:38Z"
    last_updated_by: "speckit-router-contract-drift"
    recent_action: "Aligned the command contract with the merged speckit workflows"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-command/assets/command-contract.json"
      - ".skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "speckit-router-contract-drift"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 007-speckit-router-contract-drift |
| **Completed** | 2026-10-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The router generator check passes again, with all 32 routers clean. `/speckit:plan`, `/speckit:implement` and `/speckit:complete` each run one workflow that branches on execution mode, while `/speckit:resume` keeps its auto/confirm pair. The contract can now say so.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.schema.json` | Modified | A `workflow` purpose and an optional `commands` list on asset and execution-target entries |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | The speckit family names one workflow for three commands and the pair for resume |
| `.skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs` | Modified | An asset applies only to the routers its `commands` list names |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fix went where the drift came from: the contract, not the routers. The merge decision had already settled that resume stays a pair, so the contract needed a way to express per-router assets. The generator change is one predicate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A `commands` filter instead of a second family | The four routers share one input gate, mode matrix and destructive policy; only their workflow files differ |
| A new `workflow` purpose | `auto_workflow` and `confirm_workflow` would misdescribe a file that serves every mode |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `generate-command-routers.cjs --check` | `routers=32 clean=32 path-drift=0 shape-drift=0`, exit 0; before: `clean=29 path-drift=3`, exit 1 |
| Removing `speckit-plan.yaml` from `plan.md`, then `speckit-resume-auto.yaml` from `resume.md` | Exit 1 each time, naming the removed path; both restored from git |
| Ajv against `command-contract.schema.json` | Valid; a malformed command id and an unknown purpose are rejected; the old schema rejects the new contract |
| `doctor-update-contract.test.cjs` | 12 of 12 pass |
| `compiled-route-guard.cjs` | Exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The generator has no test suite of its own.** It reads fixed repository paths, so the filter was proven by removing a path from a live router and restoring it rather than by a committed test.
<!-- /ANCHOR:limitations -->

---


