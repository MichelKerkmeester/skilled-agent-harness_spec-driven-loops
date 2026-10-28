---
title: "Implementation Summary: Remove the llmgateway GPT-6 Luna route"
description: "GPT-6 Luna and Sol no longer route through DevPass: Pi drops its llmgateway Luna model and the Hermes allowlist drops gpt-6-luna and gpt-6-sol, while the openai routes on Pi and cli-codex stay."
trigger_phrases:
  - "remove llmgateway luna route implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/084-remove-llmgateway-luna-route"
    last_updated_at: "2026-10-28T13:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Removed gateway Luna and Sol routes; verified"
    next_safe_action: "Operator reviews the uncommitted diff and commits it"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-084-remove-llmgateway-luna-route"
      parent_session_id: null
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
| **Spec Folder** | 084-remove-llmgateway-luna-route |
| **Completed** | 2026-10-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

GPT-6 Luna and GPT-6 Sol can no longer bill through DevPass. Pi lists both only under `openai`, and the Hermes fan-out refuses `gpt-6-luna` and `gpt-6-sol` before it builds a command.

### Remove the llmgateway GPT-6 Luna route from Pi, OpenCode and Hermes rosters

Pi's `llmgateway` block now registers two models, DeepSeek V4.1 Flash 1017 and GLM-5.3-Flash, and its picker no longer offers the gateway Luna. Hermes pins every roster id to `--provider llmgateway`, so its roster drops from seven ids to six. The docs, changelogs and launch examples that offered the gateway Luna route now name only the routes that remain. OpenCode needed no change: it lists Luna only as `openai/gpt-6-luna`.

### Extend the removal to GPT-6 Sol

The operator extended the packet to Sol on 2026-10-28. Pi never registered a gateway Sol, so the only DevPass Sol route was the Hermes pair. Hermes's roster drops from six ids to five, none of them a GPT model, and its docs, hub summary and released v1.0.2.0 note no longer offer Sol through the gateway.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/models.json`, `.pi/settings.json` | Modified | Drop the gateway Luna model and its `enabledModels` entry |
| `.pi/custom-providers.md`, `cli-pi/references/providers-and-models.md` | Modified | Describe a two-model DevPass block |
| `cli-pi/changelog/v1.5.7.0.md`, `v1.5.8.0.md`, `cli-hermes/changelog/v1.0.2.0.md`, `.skilled/changelog/skilled/v4.0.0.1.md` | Modified | Scrub the gateway Luna mentions from released notes |
| `system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `runtime/scripts/fanout-run.cjs` | Modified | Remove `gpt-6-luna` and `gpt-6-sol` from `HERMES_SUPPORTED_MODELS` and `HERMES_ALLOWED_MODELS` |
| `system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modified | Expect five Hermes ids and assert Luna and Sol are rejected |
| `cli-hermes/SKILL.md`, `README.md`, `references/providers-and-models.md`, `assets/prompt-quality-card.md`, `feature-catalog/feature-catalog.md`, `feature-catalog/fanout-dispatch/closed-model-roster.md`, `manual-testing-playbook/manual-testing-playbook.md`, `manual-testing-playbook/cli-invocation/off-roster-model-rejection.md` | Modified | Roster of five ids, no Luna or Sol row |
| `cli-external-orchestration/README.md`, `cli-external-orchestration/graph-metadata.json` | Modified | Hub summary says five ids |
| `.skilled/hooks/session-relaunch/README.md`, `system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md` | Modified | Hermes launch examples use `deepseek-v4.1-flash-1017` |
| `.hermes/skills/cli-hermes/SKILL.md` | Regenerated | `sync-skills-hermes.cjs` mirror |
| `system-spec-kit/runtime/data/trigger-index.json` and its three retrieval fixtures | Regenerated | `generate-trigger-index.mjs` output |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline listing and the baseline test run came first. The config edits followed, then `pi --list-models gpt-6`, the code and test edits, the docs, both generators and their checks, the vitest rerun, the residue search and strict validation. Nothing was committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Leave Pi's `PI_MODEL_PROVIDERS` alone | It already maps the bare `gpt-6-luna` literal to `openai`, so the Pi fan-out never used the gateway |
| Keep counts in released changelogs that are not about Luna | The operator asked to scrub the mention and keep every other number; `seven ids` in older Hermes notes was true when shipped |
| Point the Hermes launch examples at `deepseek-v4.1-flash-1017` | It is the Hermes rotation default and stays on the roster |
| Rewrite the `cli-hermes` v1.0.2.0 note as the retirement of the GPT-5.6 ids | The note was about the GPT-6 gateway cutover; scrubbing both GPT-6 ids, as the Luna removal did for Luna, left only that fact. Its `roster stays at seven ids` clause went with them, since it held only with the GPT-6 ids in place |
| Keep Sol on every GPT-provider route and in non-gateway history | The operator rule removes gateway and DevPass routes only; `openai`, `openai-codex` and cli-codex Sol entries stay, and so do changelogs that name Sol on those routes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `pi --list-models gpt-6` | PASS: `openai gpt-6-luna` listed, no `llmgateway gpt-6-luna` row (baseline had one) |
| JSON parse of `.pi/models.json`, `.pi/settings.json`, hub `graph-metadata.json` | PASS: all parsed |
| Vitest, `executor-config.vitest.ts` and `fanout-run.vitest.ts` | PASS: `Test Files  2 passed (2)`, `Tests  281 passed (281)`, exit 0; baseline was the same 281 because the Luna rejection is a new assertion inside an existing test |
| `npm run typecheck` in the deep-loop runtime | PASS: exit 0, no diagnostics |
| `sync-skills-hermes.cjs --check` | PASS: `67 Hermes skill copies in sync`, exit 0 |
| `generate-trigger-index.mjs --check` | PASS: 0 stale documents, exit 0 |
| `parent-skill-check.cjs` on `cli-external-orchestration` | PASS: all hard invariants, 0 warnings |
| Residue search outside `specs/` | PASS: Luna appears beside `llmgateway` only on openai-route or keyword lines, and in index rows whose source is a `specs/` doc |
| Sol residue search (`rg -n -i 'gpt-6-sol\|gpt-6\.0-sol\|6-sol'` outside `specs/`) | PASS: no line offers Sol through `llmgateway` or DevPass; the rest are cli-codex, `openai`, `openai-codex`, Copilot or Cursor routes, history, or index fixture rows |
| `pi --list-models gpt-6` after the Sol edits | PASS: `openai gpt-6-sol` listed, no `llmgateway gpt-6-sol` row |
| Vitest and typecheck after the Sol edits | PASS: `Test Files  2 passed (2)`, `Tests  281 passed (281)`; `npm run typecheck` exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`gpt-6-sol` on Hermes had no live probe.** It was catalog-listed only, so no dispatch record shows it ever ran; its removal changes no proven route.
<!-- /ANCHOR:limitations -->

---
