---
title: "Implementation Summary"
description: "Mistral's DeepSeek V4.1 Flash 1017 and GLM-5.3-Flash are now roster routes on cli-opencode and cli-pi, each backed by a live OK reply."
trigger_phrases:
  - "mistral provider roster implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/002-mistral-provider-roster"
    last_updated_at: "2026-11-14T13:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Added both Mistral ids to both rosters after live probes"
    next_safe_action: "Operator replaces Pi's stored Mistral key, then reads the Mistral usage counter"
    blockers: []
    key_files:
      - "evidence/probes.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Do these routes draw on the subscription pool or on pay-as-you-go?"
    answered_questions:
      - "Both ids answer on OpenCode 2.3.0 and Pi 1.5.2"
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
| **Spec Folder** | 002-mistral-provider-roster |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now dispatch `mistral/deepseek-v4-1-flash-1017` and `mistral/zai-glm-5-3-flash` through cli-opencode and cli-pi. Both rosters list them as non-default routes beside DevPass.

### Phase 2: mistral-provider-roster

Each roster gained a `mistral` section that names the dash-form ids, warns that the DevPass dot-form ids do not resolve there, and marks the billing source UNKNOWN. On Pi the routes are direct dispatch only, so the deep-loop fan-out keeps sending DeepSeek and GLM through DevPass.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modified | `mistral` section, effort row, version 1.4.19.0 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modified | Five reachable providers, version 1.5.11.0 |
| `.skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modified | `mistral` section, five providers, version 1.5.11.0 |
| `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` | Modified | Five reachable providers, version 1.5.22.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The ids were listed on both CLIs, then each was probed beside a DevPass control (`evidence/probes.md`). OpenCode answered on all four Mistral runs and refused `#ultra`. Pi returned `401` with its stored key while the control passed, then answered at four thinking levels with the valid key passed per run. The docs were written after the probes, then checked with the sk-doc validator and the default-model test.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Pi rows are direct dispatch only | The request was roster options. Fan-out wiring changes `PI_SUPPORTED_MODELS`, the fan-out map and their tests, and the opencode-go GLM row already stands this way |
| No default changes | DevPass is cheaper per token at list price, and the Mistral billing source is unconfirmed |
| Pi verified with a per-run key | The stored key is malformed, and replacing a credential is the operator's step |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| OpenCode probes | PASS: `OK` on both ids, plain and `#max`; `#ultra` refused |
| Pi probes | PASS with a valid per-run key; FAIL `401` with the stored key, control `OK` |
| `validate_document.py` on four files | PASS: `Total issues: 0` each |
| `default-model-id.test.cjs` | PASS: 6 of 6 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pi's stored Mistral key is malformed.** A plain Pi dispatch returns `401` until the operator runs `pi auth login mistral --api-key` with the `mst` key.
2. **Billing source unconfirmed.** Read the Mistral console's usage counter after a run to learn whether it drew on the plan pool.
3. **Pi rule wording.** `cli-pi/SKILL.md` says a new model goes in `PI_SUPPORTED_MODELS`, while the existing direct-dispatch-only row shows otherwise. Proposed amendment: "To add a fan-out model, amend the roster and `PI_SUPPORTED_MODELS`; a direct-dispatch-only row needs the roster alone."
<!-- /ANCHOR:limitations -->

---
