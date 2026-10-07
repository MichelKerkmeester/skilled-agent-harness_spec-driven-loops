---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "cli pi opencode go route implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-review-and-cli-lineage/003-cli-pi-opencode-go-route"
    last_updated_at: "2026-10-02T18:36:37Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-040-cli-pi-opencode-go-route"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 003-cli-pi-opencode-go-route |
| **Completed** | 2026-10-02 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A deep-loop run can now send cli-pi to DeepSeek V4.1 Flash through opencode-go, by passing `--model=opencode-go/deepseek-v4.1-flash`. The DevPass route and every other literal build the same command as before.

### Let the deep-loop cli-pi executor reach DeepSeek V4.1 Flash through opencode-go

`PI_MODEL_PROVIDERS` maps the bare DeepSeek literal to DevPass, and one literal maps to one provider, so a review or research loop on Pi could not reach opencode-go. The provider-prefixed literal sits beside the bare one in both allowlists and the provider map, and the builder uses a literal that already names its provider as the full selector, so the command reads `pi -p --offline --model opencode-go/deepseek-v4.1-flash --thinking max`. The Flash max pin already matched the prefixed form.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/scripts/fanout-run.cjs` | Modified | Allowlist, provider map, selector |
| `runtime/lib/deep-loop/executor-config.ts` | Modified | Roster |
| `runtime/tests/unit/executor-config.vitest.ts`, `fanout-run.vitest.ts` | Modified | Roster and command tests |
| `cli-pi/references/providers-and-models.md`, PI-017 | Modified | Route row, roster count |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Edited on Public main, which every project reads live through `.skilled`, at the operator's choice. The three runtime test files ran before and after, the new test was shown to fail without the builder line, and a live Pi canary returned a real reply on the new selector.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A provider-prefixed literal, not a second provider for the bare one | The bare literal keeps its DevPass default for every existing run, and one literal still maps to one provider |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts tests/unit/combo-matrix.vitest.ts` | PASS, 261 tests, exit 0 |
| Same test with the selector line reverted | FAIL as expected, `opencode-go/opencode-go/deepseek-v4.1-flash` |
| `pi -p --offline --mode json --model opencode-go/deepseek-v4.1-flash --thinking max` | PASS, `CANARY-OK`, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Stdin must be closed.** A hand-run `pi -p` with an open stdin printed nothing for 400 seconds. The runtime passes empty input, so deep-loop runs are not affected.
2. **The selector mechanism changed when the doctor-audit branch merged (2026-10-03).** That branch had added the same opencode-go route plus a `cline-pass/deepseek-v4.1-flash` route, with an explicit `PI_MODEL_SELECTORS` map in `fanout-run.cjs` in place of the prefix test this packet describes. The map carries both routes. The opencode-go literal still dispatches as `--model opencode-go/deepseek-v4.1-flash` at `--thinking max`, and this packet's test still passes.
<!-- /ANCHOR:limitations -->

---


