---
title: "Implementation Summary: GLM-5.3-Flash + Gemini 3.7 Flash on the CLI OpenRouter roster"
description: "Retired Ox Alpha and routed Z.AI GLM-5.3-Flash across OpenRouter/opencode-go/Cline plus Google Gemini 3.7 Flash on OpenRouter, in both CLI docs, .pi config, and the deep-loop cli-pi fan-out roster (two synced points + provider map + flash max-pin) with guard tests. Every slug live-verified; committed 125d22ffaf and pushed to origin/v4 + origin/main; live-verified (PONG)."
trigger_phrases:
  - "implementation summary"
  - "glm-5.3-flash gemini roster"
  - "retire ox-alpha glm gemini openrouter"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/055-glm-5-3-flash-gemini-roster"
    last_updated_at: "2026-08-27T07:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Retired Ox Alpha; routed GLM-5.3-Flash + Gemini 3.7 Flash into docs and roster; live-verified"
    next_safe_action: "None — committed, pushed, live-verified"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-055-glm-5-3-flash-gemini"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: GLM-5.3-Flash + Gemini 3.7 Flash on the CLI OpenRouter roster

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 055-glm-5-3-flash-gemini-roster |
| **Completed** | 2026-08-27 |
| **Level** | 2 |
| **Status** | Complete |
| **Feature commit** | `125d22ffaf` |
| **On remotes** | `origin/skilled/v4.0.0.0` (`4f53f4a2b6`); `origin/main` (`26b253b22c`, v4→main merge) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The CLI OpenRouter allowlist — through both **cli-opencode** and **cli-pi** — now carries exactly three models: **DeepSeek V4 Flash**, **GLM-5.3-Flash** (`z-ai/glm-5.3-flash`, top tier `max`), and **Gemini 3.7 Flash** (`google/gemini-3.7-flash`, top tier `high`). **Ox Alpha** is retired from every surface it touched. GLM-5.3-Flash is additionally registered on **opencode-go** (`opencode-go/glm-5.3-flash`) and the **Cline** provider (`cline-pass/z-ai/glm-5.3-flash`, `xhigh` ceiling), and pi's `defaultModel` is repointed to it.

### The load-bearing facts (all live-verified 2026-08-27)
- **OpenRouter**: `z-ai/glm-5.3-flash` — `reasoning: true`, variants `low`/`high`/`max`, 1.31M context / 131K output, released 2026-08-26. `google/gemini-3.7-flash` — `reasoning: true`, variants `low`/`medium`/`high`, released 2026-08-13. Both confirmed in `opencode models openrouter --verbose`.
- **opencode-go**: `opencode-go/glm-5.3-flash` confirmed in `opencode models opencode-go`.
- **Cline**: the working id is `z-ai/glm-5.3-flash` (the `z-ai/` vendor prefix, like Ox Alpha's `x-ai/`), taken from the operator's own Cline runtime logs (`~/.cline/data/logs/cline.log` + `providers.json`: `provider: cline-pass, model: z-ai/glm-5.3-flash`, dispatched 2026-08-27). Cline's `opencode models cline-pass` list does NOT show it (list-invisible, dispatch-works — the documented Cline behavior).

### `.pi` config
`.pi/models.json` `cline-pass` block: the `x-ai/ox-alpha` model became `{ id: "z-ai/glm-5.3-flash", reasoning: true, contextWindow: 1310720, maxTokens: 131072, thinkingLevelMap topping at xhigh }`. `.pi/settings.json`: `defaultModel` → `z-ai/glm-5.3-flash`; `enabledModels` dropped `cline-pass/x-ai/ox-alpha` and `openrouter/stealth/ox-alpha`, and added `openrouter/z-ai/glm-5.3-flash`, `openrouter/google/gemini-3.7-flash`, `opencode-go/glm-5.3-flash`, `cline-pass/z-ai/glm-5.3-flash`.

### Deep-loop cli-pi fan-out roster
`PI_SUPPORTED_MODELS` (`executor-config.ts`) and its `fanout-run.cjs` mirror `PI_ALLOWED_MODELS` dropped `stealth/ox-alpha` + `x-ai/ox-alpha` and gained `z-ai/glm-5.3-flash`, `google/gemini-3.7-flash`, and the bare `glm-5.3-flash`. `PI_MODEL_PROVIDERS` maps the first two to `openrouter` and the bare literal to `opencode-go`. `isFlashMaxPinnedModel` was extended to match `glm-5.3-flash`/`z-ai/glm-5.3-flash` (both have a `max` tier); Gemini is intentionally excluded (tops at `high`).

### The one code constraint (collision)
OpenRouter and Cline both use the id string `z-ai/glm-5.3-flash`, and a `modelId→provider` map holds one provider per id. The fan-out therefore routes the shared literal via **OpenRouter**; the Cline GLM-5.3-Flash stays a **direct-dispatch** route (which is how the operator already runs it), documented as such.

### Files Changed (feature commit `125d22ffaf`, 9 files)

| File | Action | Purpose |
|------|--------|---------|
| `.../cli-opencode/references/providers-and-models.md` | Modified | OpenRouter callout+rows (retire ox-alpha, +glm/gemini); opencode-go glm-5.3-flash row |
| `.../cli-opencode/SKILL.md` | Modified | Fix "OpenRouter routes DeepSeek only" → three-model allowlist |
| `.../cli-pi/references/providers-and-models.md` | Modified | OpenRouter + opencode-go + Cline sections (ox-alpha→glm; default note) |
| `.pi/models.json` | Modified | `cline-pass` block: Ox Alpha model → `z-ai/glm-5.3-flash` |
| `.pi/settings.json` | Modified | `defaultModel` + `enabledModels` swap |
| `.../runtime/lib/deep-loop/executor-config.ts` | Modified | `PI_SUPPORTED_MODELS` roster + `isFlashMaxPinnedModel` |
| `.../runtime/scripts/fanout-run.cjs` | Modified | `PI_ALLOWED_MODELS` mirror + `PI_MODEL_PROVIDERS` + pin regex |
| `.../runtime/tests/unit/executor-config.vitest.ts` | Modified | Roster assertion + max-pin cases |
| `.../runtime/tests/unit/fanout-run.vitest.ts` | Modified | `providerByModel` coverage + pin regex |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Verification-first, not a text swap. Before any edit, every slug and tier was confirmed live via `opencode models openrouter|opencode-go|cline-pass`. The one non-mechanical step was the Cline id: `opencode models cline-pass` lists only `glm-5.2`/`glm-5.3` (no `-flash`), so the id looked absent — but the operator's running Cline session proved otherwise, and their `~/.cline` runtime logs gave the exact working id `z-ai/glm-5.3-flash`. The nine surfaces were then edited to retire Ox Alpha and add the two new models, keeping the two byte-mirrored fan-out rosters and their guard tests in sync. The work was committed (`125d22ffaf`), pushed to `origin/skilled/v4.0.0.0` (after merging 10 concurrent incoming deep-loop commits, `fanout-run.cjs` auto-merged clean), and merged v4→main (only 2 generated-JSON conflicts, resolved to v4's versions) so `origin/main` carries it too.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Retire Ox Alpha everywhere, not just OpenRouter | Operator ask; GLM-5.3-Flash is the replacement across all of Ox Alpha's routes |
| Add Gemini 3.7 Flash to the OpenRouter allowlist | Operator follow-up ask; makes the allowlist three models |
| Fan-out routes the shared `z-ai/glm-5.3-flash` via OpenRouter | One `modelId→provider` map can't hold the id twice; Cline GLM stays direct-dispatch (as the operator already runs it) |
| GLM max-pinned, Gemini not | GLM tops at `max`; Gemini tops at `high` and there is no high-pin mechanism to reuse — a Gemini pin would be scope creep |
| No Ox Alpha PONG timestamps carried onto GLM entries | Honesty: new entries marked "list-verified 2026-08-27, not dispatch-tested"; the Cline entry is dispatch-confirmed from the operator's own runtime logs |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Slugs live | `opencode models openrouter --verbose` | PASS — glm-5.3-flash (low/high/max), gemini-3.7-flash (low/medium/high) |
| JSON valid | `node -e JSON.parse(.pi/models.json / settings.json)` | PASS — both OK |
| Syntax | `node --check fanout-run.cjs` | PASS — exit 0 |
| Guard suite | `npx vitest run executor-config.vitest.ts fanout-run.vitest.ts` | PASS — 203 passed / 0 failed (re-run green after the v4 merge) |
| Typecheck | `npm run typecheck` | PASS — 0 new errors in touched files (56 pre-existing in unrelated `legacy-projections/*`) |
| Stray-id sweep | `rg -in "ox[ _-]?alpha"` over enforcement points | PASS — only 2 historical provenance notes remain, no model id |
| Live turn — opencode GLM | `opencode run --model openrouter/z-ai/glm-5.3-flash --variant max` | PASS — `PONG` |
| Live turn — opencode Gemini | `opencode run --model openrouter/google/gemini-3.7-flash --variant high` | PASS — `PONG` |
| Live turn — pi GLM | `pi -p --model openrouter/z-ai/glm-5.3-flash --thinking max` | PASS — `PONG` (with benign "using custom model id" warning) |
| `validate.sh --strict` | packet folder | PASS — Errors:0 (recorded this session) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **opencode-go GLM dispatch not confirmed live** — a real `opencode-go/glm-5.3-flash` turn timed out (>2min) during verification; the id is list-verified and the gateway is a known-slower subsidized route, so this is inconclusive, not a failure.
2. **Gemini not code-pinned to a tier** — its top tier is `high` and no high-pin mechanism exists; the pin is a documented dispatch convention only.
3. **Cline GLM is direct-dispatch only in the fan-out** — the shared `z-ai/glm-5.3-flash` literal routes via OpenRouter there; the Cline route is reachable directly (as the operator runs it), just not as a distinct fan-out literal.
4. **pi "using custom model id" warnings** — pi's static catalog lags live OpenRouter, so it warns for the new ids but dispatches succeed (same behavior documented for Cline).
5. **Manual mirror** — `executor-config.ts` and `fanout-run.cjs` are hand-synced by design; the guard tests keep them honest.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Cline may lack a GLM-5.3-Flash variant | Cline serves `z-ai/glm-5.3-flash` | The operator's running session + `~/.cline` logs proved it; the `opencode models cline-pass` list is not authoritative for Cline |
| Simple push to main + v4 | v4 needed a merge of 10 concurrent commits; main needed a v4→main merge in an isolated worktree | The branch was actively updated by concurrent sessions; a stalled concurrent rebase in the primary checkout was aborted (operator-approved) before recovery |
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:out-of-scope-followups -->
## Out-of-Scope Findings (not fixed here)

- **opencode-go GLM live confirmation** — worth a follow-up live dispatch once the gateway is responsive, to upgrade `opencode-go/glm-5.3-flash` from list-verified to dispatch-verified.
- **Concurrent-rebase hygiene** — a `git rebase` started by a background process (likely a live-follow/sync) detached HEAD in the primary checkout during the push; worth investigating so it does not recur on future pushes to this branch.
<!-- /ANCHOR:out-of-scope-followups -->
