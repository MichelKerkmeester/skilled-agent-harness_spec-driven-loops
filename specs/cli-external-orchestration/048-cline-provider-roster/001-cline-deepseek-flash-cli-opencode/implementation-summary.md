---
title: "Implementation Summary: Cline provider added to the cli-opencode roster"
description: "cline-pass/cline-pass/deepseek-v4-flash is now catalogued in the cli-opencode roster across three docs, with its true no-max reasoning tiers."
trigger_phrases:
  - "cline provider roster implementation summary"
  - "cli-opencode cline-pass shipped"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/048-cline-provider-roster/001-cline-deepseek-flash-cli-opencode"
    last_updated_at: "2026-08-18T08:49:05Z"
    last_updated_by: "claude"
    recent_action: "Roster add shipped; validate --strict clean"
    next_safe_action: "Proceed to Phase 2 pi investigation"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-048-001"
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
| **Spec Folder** | 001-cline-deepseek-flash-cli-opencode |
| **Completed** | 2026-08-18 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The cli-opencode roster now documents the Cline provider. Before this, a dispatcher who wanted DeepSeek V4 Flash through Cline had nowhere in the skill to learn the model id, the login flow, or that its reasoning tiers differ from the direct and OpenRouter Flash ids. You can now look up `cline-pass/cline-pass/deepseek-v4-flash`, see that it tops out at `--variant xhigh`, and dispatch it correctly.

### Cline provider catalog entry

`providers-and-models.md` gained a `### cline-pass` section describing the provider (Cline Pass account, base `https://api.cline.bot/api/v1`, OpenAI-compatible), the three-segment model id, and the `cline` vs `cline-pass` naming trap (`opencode models cline` errors "Provider not found"). The entry states the real reasoning behavior taken from live metadata: `reasoning: true`, tiers `none`→`xhigh`, and **no `max` tier**, so the top thinking level is `--variant xhigh`. It also flags that the fan-out `--variant max` auto-pin does not apply — Cline Flash is a direct-dispatch roster entry, not a fan-out executor.

### Operator entry points

`SKILL.md` picks up Cline in its discovery keywords, its "Common alternates" model list, and its honor-user-overrides examples. `cli-reference.md` gains a Cline line in the missing-providers login menu so the auth pre-flight can point an operator at `opencode auth login` for the `cline-pass` provider.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modified | `### cline-pass` provider section + §4 effort-lever row |
| `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modified | Keywords, Common alternates, honor-overrides examples |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md` | Modified | Cline login-menu entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every fact in the entry came from live `opencode models cline-pass --verbose` output, not assumption, and the edit points were taken from the packet-047 OpenRouter diff so the new provider slots in identically. The model was list-verified, not dispatch-tested — the same evidence bar prior roster additions used for `opencode-go/glm-5.3`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Document as `cline-pass`, not `cline` | That is the real provider id in `auth.json` and `opencode models`; `cline` errors "Provider not found", so calling it `cline` would send dispatchers to a dead id |
| State `--variant xhigh`, not `--variant max` | Cline's Flash exposes tiers only up to `xhigh`; it has no `max` tier, unlike the direct/opencode-go Flash ids the roster pins to `max` |
| Keep Cline out of the fan-out executor registry | Its id matches the `deepseek-v4-flash` `--variant max` auto-pin regex, which Cline cannot satisfy; wiring it in is a separate, deliberate change outside this task's scope |
| List-verify only (no live dispatch) | Matches the evidence bar of prior roster adds; a paid dispatch was not warranted for a catalog entry |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `opencode models cline-pass` lists `cline-pass/cline-pass/deepseek-v4-flash` | PASS |
| `opencode models cline-pass --verbose` shows `reasoning: true`, tiers none→xhigh, no `max` | PASS |
| Model id present in `providers-and-models.md` and `SKILL.md` | PASS (grep) |
| `validate.sh --strict` on this phase folder | PASS (exit 0) — see parent packet closeout |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **List-verified, not dispatch-tested.** No live `opencode run` against `cline-pass/cline-pass/deepseek-v4-flash` was executed. If a future consumer needs a proven dispatch, run one turn and add the date to the roster note.
2. **Fan-out unreachable by design.** Cline Flash cannot be driven through the deep-loop fan-out until the `--variant max` auto-pin is reconciled with Cline's `xhigh` ceiling. Direct `opencode run` dispatch works today.
<!-- /ANCHOR:limitations -->
