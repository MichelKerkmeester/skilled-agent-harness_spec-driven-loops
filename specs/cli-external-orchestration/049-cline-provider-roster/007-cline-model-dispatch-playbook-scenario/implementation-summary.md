---
title: "Implementation Summary: PI-023 cline model-dispatch playbook scenario added to cli-pi"
description: "cli-pi's manual testing playbook now has PI-023, a Model Dispatch scenario for the config-wired cline-pass provider's slashed model-id contract, wired into the index. sk-doc VALID and a live positive control observed."
trigger_phrases:
  - "PI-023 cline scenario done"
  - "cli-pi cline playbook coverage added"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/007-cline-model-dispatch-playbook-scenario"
    last_updated_at: "2026-08-18T18:42:01Z"
    last_updated_by: "claude"
    recent_action: "PI-023 cline scenario authored and indexed; sk-doc VALID; live control observed"
    next_safe_action: "Commit and push to v4 and main"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/cline-provider-id-format-dispatch.md"
      - ".opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/manual-testing-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-cline-model-dispatch-playbook-scenario |
| **Completed** | 2026-08-18 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The cli-pi manual testing playbook now covers the cline provider. Before this phase the playbook's Model Dispatch group (PI-017, PI-018) never mentioned cline, and the only cli-pi file that did was the provider roster. PI-023 adds the missing coverage: the config-wired cline-pass provider and its slashed model-id dispatch contract.

### The PI-023 scenario

`model-dispatch/cline-provider-id-format-dispatch.md` documents that pi forwards a model object's `id` verbatim as the API `model`, that the Cline API requires the slashed `cline-pass/<model>` form, and that a bare id returns `400 "invalid model format"`. It gives the id-format inspection (grep `.pi/models.json` for slashed ids, confirm three-segment settings), a credentialed positive-control dispatch, and pass/skip/fail rules that follow the playbook's output-first, credential-boundary policy. It is deliberately separate from PI-017, whose allowlist is the deep-loop executor roster the Cline provider is not part of.

### The index wiring

`manual-testing-playbook.md` now reads 23 scenarios, lists PI-023 under the Model Dispatch group, and carries a `.pi` config cross-reference row so the scenario is discoverable and not orphaned.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/cline-provider-id-format-dispatch.md` | Created | The PI-023 scenario |
| `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/manual-testing-playbook.md` | Modified | Count, Model Dispatch group entry, cross-reference row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read the existing PI-017/PI-018 scenarios for the template shape and the index for the group and cross-reference structure, confirmed PI-023 as the next id, then authored the scenario from the phase-6 contract and a live positive control run this session. Validated both docs with sk-doc before wiring the phase.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put the scenario in the Model Dispatch group | It is a provider/model-selection contract, the same class as PI-017/PI-018 |
| Keep it distinct from PI-017 | PI-017 checks the deep-loop executor allowlist, which the Cline provider is intentionally not part of |
| Document the bare-id 400 as a negative control, not a success path | The 400 is the pre-fix symptom; the scenario guards against reintroducing a bare id |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| sk-doc validate the PI-023 scenario | PASS (`playbook_feature`, 0 issues) |
| sk-doc validate the playbook index | PASS (VALID, 0 issues) |
| Live positive control `pi ... --model cline-pass/cline-pass/deepseek-v4-flash` | PASS (returned `CLI_PI_FLASH_OK`, no `400 invalid model format`) |
| Index count and group updated | PASS (`23` scenarios; PI-023 under Model Dispatch) |
| `validate.sh 049-cline-provider-roster --recursive --strict` | PASS (exit 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live control needs a key in the operator's environment.** The positive control was observed this session with a credentialed pi. On a machine without `CLINE_API_KEY` (or a `pi /login cline-pass`), the scenario's live turn correctly SKIPs with the named blocker; only the static id-format inspection runs unconditionally.
<!-- /ANCHOR:limitations -->
