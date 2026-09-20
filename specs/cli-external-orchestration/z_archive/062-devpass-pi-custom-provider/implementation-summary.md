---
title: "Implementation Summary: DevPass reaches cli-pi, with the model-id rule proven rather than copied"
description: "Four DevPass models now dispatch through pi via a config-declared provider. The one thing that could not be copied from the neighbouring Cline block was the model-id form, because LLM Gateway requires the exact inverse."
trigger_phrases:
  - "implementation"
  - "devpass pi wired"
  - "llmgateway bare id"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/062-devpass-pi-custom-provider"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Four models verified; credential path proven end to end"
    next_safe_action: "None - work is complete"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/custom-providers.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-062-devpass-pi"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 062-devpass-pi-custom-provider |
| **Completed** | 2026-09-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

DevPass is now a provider inside pi. Four models — DeepSeek V4 Flash, its Vision variant, GLM-5.3-Flash and Gemini 3.8 Flash — are selectable in the picker and dispatch from `pi -p`, through the same subscription and the same key opencode already uses. No pi code changed, no extension was installed, and no secret entered the repo.

The interesting part was the one thing that could not be copied. The `cline-pass` block sits directly above the new one in the same file, and it requires a **slashed** `modelType/model` id — a bare id gets `400 invalid model format`. LLM Gateway requires the exact opposite: a **bare** id, with a prefixed one returning `400 "Provider llmgateway does not support model deepseek-v4-flash"`. Two providers, adjacent in one file, with inverted rules, and the Cline packets record that this class of error passes `pi --list-models` and `pi auth check` and surfaces only on a real dispatch.

So the id form was settled first, by negative control against the live API, before any config was written. Both directions were observed: bare returned 200, prefixed returned 400. Both rules are now documented where each block lives, stated as an inversion of the other so neither gets copied into its neighbour.

Because the pi reference is `<provider>/<id>` and the id is bare, these references are **two-segment** (`llmgateway/glm-5.3-flash`) where cline-pass's are three.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/models.json` | Modified | `providers.llmgateway` block, four models, per-model thinking ladders |
| `.pi/settings.json` | Modified | Four `enabledModels` entries |
| `.pi/custom-providers.md` | Modified | New §3; key section now covers both providers; verify/remove extended; sections renumbered |
| `cli-pi/references/providers-and-models.md` | Modified | New `llmgateway` section; residual GLM ceiling claim corrected; provider count 6 → 7 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Precedent first: the three cline-pass gotchas were read from their own packets rather than recalled — `api` must be `openai-completions`, the id goes on the wire verbatim, and the credential placeholder is pi's `${VAR}` and never opencode's `{env:VAR}`.

Then the wire contract was established with `curl`, independently of pi, in both directions. Only then was the block written, as a text-level insert rather than a JSON round-trip so the operator's own formatting survived — including the deliberate absence of a trailing newline.

Verification ran at two levels because one is not enough. `curl` proved the gateway accepts each id; `pi -p` proved pi resolves and sends them correctly. All four returned their markers, each at its own ceiling.

One attempt went wrong and is worth recording. The first dispatch used an isolated `PI_CODING_AGENT_DIR` to stop a stored credential from masking the config path — the rigor packet 049 phase 009 established. But that variable relocates provider config too, so it disabled the very block under test; pi reported `Unknown provider "llmgateway"` and warned that *every* pre-existing model pattern was unmatched, which is what gave it away. The isolation was unnecessary here anyway: pi's auth store holds no `llmgateway` entry, so there was nothing to mask, and the config path was the only one that could have resolved.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Prove the id format before writing config | The neighbouring block requires the opposite form, and this failure class is invisible to every check short of a real dispatch |
| No provider-level `compat.thinkingFormat` | The block spans three model families; a provider-wide hint would apply one family's format to the other two. pi's default parsing handled all four |
| Per-model `thinkingLevelMap`, no provider-wide effort policy | Unlike cline-pass's uniform `xhigh`, these four have four different ladders — one tops at `high`, one has a sparse ladder with no `medium` |
| Direct-dispatch only, not added to the fan-out roster | The bare literals collide with opencode-go's in `PI_MODEL_PROVIDERS`, and one literal maps to one provider — the same constraint that keeps the Cline GLM route direct-only |
| Stop before writing the key to `~/.zshenv` | It puts a credential in a machine file outside the repo. The precedent existed and the pattern was already there for Cline, but it stayed the operator's call — and they set it themselves |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Wire contract, negative control | PASS — bare id 200, prefixed id 400, both observed |
| All four ids on the wire | PASS — 200 each |
| `pi --list-models` | PASS — four rows with the declared limits |
| Live pi dispatch, four models | PASS — `DEVPASS-PI-OK`, `PI-VIS`, `PI-GLM`, `PI-GEM` |
| Credential path | PASS — pi's auth store has no `llmgateway`, so the env reference resolved it |
| JSON validity and formatting | PASS — both parse; operator formatting preserved |
| Dispatched-shell auth | PASS — `env -u LLMGATEWAY_API_KEY zsh -c` scrubbed the variable, `~/.zshenv` restored it, dispatch returned `ZSHENV-OK` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The credential lives on this machine only.** `~/.zshenv` carries it, so any other machine, container, or a session with a different `HOME` needs its own export before the provider authenticates.
2. **Vision was verified as text only.** `deepseek-v4-flash-vision-exp` completed a text round-trip; no image was attached, so its image capability is declared from the provider catalog and not yet proven through pi.
3. **Not reachable from the deep-loop fan-out.** Deliberate, and it means these four cannot be used in a fan-out lineage until the literal-collision question is solved.
4. **The global `defaultThinkingLevel` is wrong for half this roster.** It is `xhigh`; Gemini 3.8 Flash has no `xhigh` and the Vision variant has no `xhigh` either. An unqualified dispatch to those two relies on pi clamping via `thinkingLevelMap` rather than on an explicit tier.
<!-- /ANCHOR:limitations -->
