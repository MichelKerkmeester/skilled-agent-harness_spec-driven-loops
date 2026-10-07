---
title: "Implementation Summary"
description: "The Pi classifier transport keeps its adopt verdict on a fresh same-day paired run with both arms on Typesafe's own host, so only the transport differs."
trigger_phrases:
  - "pi transport improvements implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/009-pi-transport-improvements"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "Built, reviewed and verified the phase"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-049"
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
| **Spec Folder** | 009-pi-transport-improvements |
| **Completed** | 2026-10-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Pi classifier transport keeps its adopt verdict on a fresh same-day paired run with both arms on Typesafe's own host, so only the transport differs. Pi answers at p95 299 ms against the CLI's 575 ms, and every caller now reaches Pi only on the host its jev provider names.

### Phase 1: pi-transport-improvements

`jev-transport.mjs` lets an approved caller send a Jev `choice` through Pi instead of the jev CLI. Each jev provider now maps to the Pi classifier on the same host: `official` to Pi `typesafe`/`jev-latest`, `openrouter` to Pi `openrouter`/`typesafe/jev-1.13`, and any other provider stays on the CLI. `JEV_TRANSPORT=jev` outranks a per-call `pi` option, the runtime is built once per process, the gate pins Pi 0.99.2, preflight runs once per path and provider, and the combined latency is bounded. `score-pi-transport.mjs` runs a same-day paired comparison on the provider in `JEV_PROVIDER` (default `official`), records per-call usage, backend and prompt digest, judges on raw counts and adds a margin-gated escalation arm.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` | Modified | Provider map, kill-switch precedence, runtime cache, version pin, per-provider preflight, latency budget |
| `.skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs` | Modified | Each mapping, CLI fallback for vercel and custom, kill switch, cache isolation |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs` | Modified | Paired run on the mapped host, usage and digest records, escalation arm |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/tests/score-pi-transport.test.mjs` | Modified | Paired run on official, refusal on vercel, escalation arm |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/README.md` | Modified | The provider map and the paired-provider choice |
| `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md` | Modified | Gate rows for the mapped Pi classifier |
| `.skilled/skills/cli-classifier/cli-jev/SKILL.md` | Modified | Gate rows for the mapped Pi classifier |
| `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/pi-transport-comparison.md` | Modified | Paired run on the official host |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna 6 max fast built the first pass on cli-codex, and a DeepSeek V4.1 Flash max review on cli-pi found two P1s, fixed by Luna: an omitted provider now follows `JEV_PROVIDER` then `official`, and the Pi pin follows the installed 0.99.2. The paired run then needed a jev OpenRouter key, which 003 D1 rules out. Neither opencode-go nor LLM Gateway offered a usable shared host, but Pi ships a `typesafe` classifier on the jev CLI's `official` host. The operator chose that pairing and stored `TYPESAFE_API_KEY` in the macOS Keychain. Luna built the provider map, DeepSeek reviewed it with no P0, and the session ran the paired run with the key read per process.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Pair on the official host | Pi's `typesafe` classifier and the jev CLI's `official` provider both reach `api.typesafe.ai`, so the comparison isolates the transport and Jev needs no new secret |
| Map providers, never move them | A caller reaches Pi only on its own provider's host; any provider without a Pi classifier stays on the CLI |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs .skilled/skills/cli-classifier/benchmark/pi-transport/tests/score-pi-transport.test.mjs` | 79 passed (baseline 63) |
| Paired run, `JEV_PROVIDER=official score-pi-transport.mjs --pi --cli --out ~/.skilled/.labels/runs/049-009-paired-20261003` | exit 0 in 237 s, replay fresh: `verdict pi-transport: adopt K=111 M=103 A=98 coverage=92.8 agreement=95.1 median_abs_dp=0.0100 p95_ms=299/575`; escalation threshold 0.10, 96 served by Pi, 7 deferred, agreement 98.1 |
| `validate_document.py` on the four changed docs | 0 issues each |
| `validate.sh --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Review P2s recorded.** The unmapped-provider branch of the Pi arm has no test, no paired test runs on `openrouter`, and the provider map is copied in the transport and the benchmark with no test keeping them in step.
2. **Pi on the official host needs its own credential.** Pi reads `TYPESAFE_API_KEY` from its environment; without it the credential gate skips Pi and the CLI answers, with one skip line per process.
<!-- /ANCHOR:limitations -->

---


