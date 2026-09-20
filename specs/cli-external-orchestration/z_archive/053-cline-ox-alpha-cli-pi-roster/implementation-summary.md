---
title: "Implementation Summary: Ox Alpha via the Cline provider for cli-pi"
description: "Registered x-ai/ox-alpha on the cli-pi Cline provider — .pi config + both pi docs + the deep-loop cli-pi fan-out roster (two synced points + provider map) + guard tests. The real Cline id is x-ai/ox-alpha (vendor prefix, not cline-pass/), found by an authorized live probe after the DeepSeek-analogy guesses 404'd, and confirmed by a real PONG turn."
trigger_phrases:
  - "implementation summary"
  - "cline ox-alpha cli-pi"
  - "x-ai/ox-alpha cline-pass"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/053-cline-ox-alpha-cli-pi-roster"
    last_updated_at: "2026-08-24T10:18:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Registered x-ai/ox-alpha across config, docs, fan-out roster, and guard tests; live-verified"
    next_safe_action: "Commit when operator approves"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-053-cline-ox-alpha-cli-pi"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Ox Alpha via the Cline provider for cli-pi

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 053-cline-ox-alpha-cli-pi-roster |
| **Completed** | 2026-08-24 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

cli-pi can now select **Ox Alpha** through the config-wired **Cline** provider, at the three-segment id **`cline-pass/x-ai/ox-alpha`**, for both headless `-p` dispatch and deep-loop fan-out. It is the same underlying model as the OpenRouter route from packet 052 (`openrouter/stealth/ox-alpha`), reached through a different provider — both routes coexist.

### The Cline model id (the load-bearing fact)
Cline's real model id for the free Ox Alpha is **`x-ai/ox-alpha`** — the **`x-ai/` vendor prefix**, NOT the `cline-pass/` prefix the DeepSeek entries use. So the pi reference is `cline-pass/x-ai/ox-alpha` (`--provider cline-pass` + model id `x-ai/ox-alpha`). This was not derivable by analogy: the guesses `cline-pass/ox-alpha` and `cline-pass/ox-alpha-free` both returned `404 "model not found"`. A short operator-authorized live probe found `x-ai/ox-alpha`, and a real `PONG` turn confirmed it.

### `.pi` config (interactive + headless)
`.pi/models.json` gained a third model in the `cline-pass` block: `{ id: "x-ai/ox-alpha", reasoning: true, contextWindow: 1000000, maxTokens: 131072, thinkingLevelMap: { high: "high", xhigh: "xhigh", … } }` — the tier map mirrors the DeepSeek entries (top `xhigh`, no `max`). `.pi/settings.json` `enabledModels` gained `cline-pass/x-ai/ox-alpha`. `defaultModel` is unchanged (still DeepSeek V4 Flash).

### Deep-loop cli-pi fan-out roster (two synced points + map)
`x-ai/ox-alpha` was added to `PI_SUPPORTED_MODELS` (`executor-config.ts`) and its `fanout-run.cjs` mirror `PI_ALLOWED_MODELS`, and mapped to `cline-pass` in `PI_MODEL_PROVIDERS`. The builder composes `${provider}/${model}` → `pi -p --offline --model cline-pass/x-ai/ox-alpha`. `x-ai/ox-alpha` is not caught by the DeepSeek Flash max-pin, so it dispatches at the requested tier (target `xhigh`; Cline has no `max`).

### Docs
`.pi/custom-providers.md` §2 and the cli-pi `### cline-pass` roster now list Ox Alpha, both flagging the `x-ai/` prefix gotcha (and that `cline-pass/ox-alpha` 404s).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/models.json` | Modified | `cline-pass` block: +`x-ai/ox-alpha` model (reasoning, xhigh-topped map) |
| `.pi/settings.json` | Modified | `enabledModels`: +`cline-pass/x-ai/ox-alpha` |
| `.../runtime/lib/deep-loop/executor-config.ts` | Modified | `PI_SUPPORTED_MODELS`: +`x-ai/ox-alpha` |
| `.../runtime/scripts/fanout-run.cjs` | Modified | `PI_ALLOWED_MODELS` mirror + `PI_MODEL_PROVIDERS` (`x-ai/ox-alpha → cline-pass`) |
| `.../cli-pi/references/providers-and-models.md` | Modified | Ox Alpha row + `x-ai/` prefix gotcha under `### cline-pass` |
| `.pi/custom-providers.md` | Modified | Ox Alpha listed in §2 (models, dispatch, verify, remove) + prefix gotcha |
| `.../runtime/tests/unit/executor-config.vitest.ts` | Modified | Exact-roster assertion: +`x-ai/ox-alpha` |
| `.../runtime/tests/unit/fanout-run.vitest.ts` | Modified | `providerByModel`: +`x-ai/ox-alpha → cline-pass` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The 049 Cline DeepSeek treatment was the template: a config-declared provider plus a two-file fail-closed fan-out roster. All eight surfaces were edited to add `x-ai/ox-alpha`, then verified. The one non-mechanical step was pinning the real Cline id: the DeepSeek-analogy `cline-pass/ox-alpha` 404'd on the first live dispatch, so — with operator authorization — a short candidate probe (`cline-pass/ox`, `…-preview`, `…-1`, `…-beta`, `stealth/ox-alpha`, `x-ai/ox-alpha`) was run against the live provider; `x-ai/ox-alpha` returned a real `PONG`. Cline's own docs confirm Ox Alpha as a free rotating stealth model but do not publish the exact API id (they point to the model selector), so the live dispatch is the authority. The config, roster, and docs were then corrected from the placeholder to `x-ai/ox-alpha`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Route Ox Alpha via the Cline provider (not only OpenRouter) | Operator ask; the model is a free ClinePass tune. The OpenRouter route (052) stays as a second path to the same model |
| Model id `x-ai/ox-alpha`, not `cline-pass/ox-alpha` | Live evidence: `cline-pass/ox-alpha` and `cline-pass/ox-alpha-free` both 404; `x-ai/ox-alpha` returned a real reply |
| Wire the deep-loop fan-out too | Explicit operator decision (unlike the 049 DeepSeek add, which stayed out of fan-out) |
| Mirror the DeepSeek `xhigh` ceiling in the tier map | "Do same as DeepSeek Flash"; Cline has no `max` tier, and pi's global default is already `xhigh`. Ox Alpha's picker offers lower tiers, but the config keeps one consistent cline-pass policy |
| Leave cli-opencode untouched | Ask was cli-pi-scoped; opencode's cline-pass is a native login with no config roster to change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| JSON valid | `python3 -m json.tool .pi/models.json` / `settings.json` | PASS — both OK |
| Syntax | `node --check fanout-run.cjs` | PASS — exit 0 |
| Roster present | `pi --list-models \| grep cline-pass` | PASS — `cline-pass  x-ai/ox-alpha  1M  131.1K  yes` row |
| Builder wiring | `node -e buildLineageCommand(cli-pi, x-ai/ox-alpha)` | PASS — `["-p","--offline","--model","cline-pass/x-ai/ox-alpha","probe"]` |
| Guard suite | `npx vitest run executor-config.vitest.ts fanout-run.vitest.ts` | PASS — 199 passed / 0 failed |
| Wrong-slug ruled out | live `pi -p --model cline-pass/cline-pass/ox-alpha` / `…/ox-alpha-free` | Both returned `404 model not found` (negative control) |
| Live turn | `pi -p --provider cline-pass --model cline-pass/x-ai/ox-alpha --thinking xhigh` | PASS — returned `PONG` (also `--thinking off`) |
| `validate.sh --strict` | packet folder | PASS — Errors:0 (recorded this session) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Free/stealth channel** — Ox Alpha is a Cline free-tier stealth tune (limited usage, separate from ClinePass quota). Its availability and upstream id can change without notice; re-confirm via a live dispatch if it starts failing.
2. **Manual mirror** — `executor-config.ts` and `fanout-run.cjs` are hand-synced by design; the guard tests keep them honest.
3. **`x-ai/` prefix is Ox-Alpha-specific** — do NOT assume the `cline-pass/` prefix generalizes to other Cline models; each model's exact `modelType/model` must be confirmed live.
4. **cli-opencode parity not done** — a matching Ox Alpha row for the cli-opencode roster doc is an optional follow-up, deliberately out of scope.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Model id `cline-pass/ox-alpha` (analogy) | `x-ai/ox-alpha` | The analogy guess 404'd; the real id uses the `x-ai/` vendor prefix, found by an authorized live probe |
| — | Also checked Cline's public docs | Operator asked; docs confirm the free-model existence but do not publish the API id |
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:out-of-scope-followups -->
## Out-of-Scope Findings (not fixed here)

- **Pre-existing `combo-matrix.vitest.ts` failure** — the test's `expectedRepresentativeArgs` for **cli-devin** does not include `--respect-workspace-trust false` (a packet-046 devin-CLI repair). Reproduced with this packet's edits stashed out (negative control), so it is unrelated to this change and left untouched (Law 2 scope lock). Worth a small separate fix.
<!-- /ANCHOR:out-of-scope-followups -->
