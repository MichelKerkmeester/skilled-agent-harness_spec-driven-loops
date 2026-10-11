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
    last_updated_at: "2026-10-11T19:55:30Z"
    last_updated_by: "generate-context"
    recent_action: "Closed the packet on the 167 of 167 fanout rerun"
    next_safe_action: "Monitor the cli-pi opencode-go route in later fanout runs"
    blockers: []
    key_files:
      - "specs/system-deep-loop/038-review-and-cli-lineage/003-cli-pi-opencode-go-route/scratch/evidence/lane-status-reconcile.txt"
      - "specs/system-deep-loop/038-review-and-cli-lineage/003-cli-pi-opencode-go-route/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:78829619d19880cab9ff8416929f935772059de12780901a1f49b19ec3e1d243"
      session_id: "scaffold-040-cli-pi-opencode-go-route"
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
| **Spec Folder** | 003-cli-pi-opencode-go-route |
| **Completed** | 2026-10-02 |
| **Level** | 1 |
| **Status** | Complete |
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
| Three runtime test files, original delivery run | PASS, 261 tests, exit 0 |
| Same test with the selector line reverted | FAIL as expected, `opencode-go/opencode-go/deepseek-v4.1-flash` |
| `pi -p --offline --mode json --model opencode-go/deepseek-v4.1-flash --thinking max` | PASS, `CANARY-OK`, exit 0 |
| Three runtime test files at reconcile, machine under load (`scratch/evidence/lane-status-reconcile.txt` RUN 1) | 273 tests collected, 266 passed, 7 failed as 20s or 30s child spawn timeouts, none inside this packet's selector or roster coverage |
| `fanout-run.vitest.ts` rerun at lower load (`scratch/evidence/lane-status-reconcile.txt` RERUN) | PASS, 167 of 167, exit 0 |
| Verdict | No defect, the 7 failures were machine load, and every test in the three files passes |
| `validate.sh --strict` on this packet | 2 errors, both GENERATED_METADATA (source fingerprint mismatch and description drift against the edited docs), and no other error. The 2 are the expected generated-metadata lag until the next save |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Stdin must be closed.** A hand-run `pi -p` with an open stdin printed nothing for 400 seconds. The runtime passes empty input, so deep-loop runs are not affected.
2. **The selector mechanism changed when the doctor-audit branch merged (2026-10-03).** That branch had added the same opencode-go route plus a `cline-pass/deepseek-v4.1-flash` route, with an explicit `PI_MODEL_SELECTORS` map in `fanout-run.cjs` in place of the prefix test this packet describes. The map carries both routes. The opencode-go literal still dispatches as `--model opencode-go/deepseek-v4.1-flash` at `--thinking max`, and this packet's test still passes.
<!-- /ANCHOR:limitations -->

---


