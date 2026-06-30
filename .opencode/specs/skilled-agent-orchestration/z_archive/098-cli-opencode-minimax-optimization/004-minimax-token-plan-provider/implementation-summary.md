---
title: "Implementation Summary: MiniMax Token Plan default provider [template:level_2/implementation-summary.md]"
description: "Switched the default MiniMax dispatch path to the Token Plan provider minimax-coding-plan (MiniMax-M3-highspeed default, MiniMax-M2.7-highspeed fallback) and retained the pay-per-token Direct API provider minimax as a selectable alternative."
trigger_phrases:
  - "minimax token plan summary"
  - "minimax coding plan default shipped"
  - "implementation"
  - "summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/004-minimax-token-plan-provider"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped Token Plan default; strict validate PASSED"
    next_safe_action: "User reconfigures the opencode minimax-coding-plan provider in their env"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/assets/model-profiles.json"
      - ".opencode/skills/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-opencode/references/cli_reference.md"
      - ".opencode/skills/sk-prompt-models/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-minimax-token-plan-provider"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Replace API or both? → both, default Token Plan"
      - "Provider names? → minimax-coding-plan (Token Plan) + minimax (Direct API), per live machine"
      - "Default/fallback model? → MiniMax-M3-highspeed default, MiniMax-M2.7-highspeed fallback"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-minimax-token-plan-provider |
| **Completed** | 2026-06-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The MiniMax Token Plan is now the default MiniMax path in cli-opencode. When you dispatch MiniMax through cli-opencode you get the subscription provider `minimax-coding-plan/MiniMax-M3-highspeed` (falling back to `MiniMax-M2.7-highspeed`) instead of the old pay-per-token `minimax/MiniMax-M2.7` id, which errors on the current opencode install. The pay-per-token Direct API stays available as the explicit `minimax` provider, so both billing modes coexist.

### Token Plan as the default MiniMax provider

cli-opencode now treats `minimax-coding-plan` (MiniMax Token Plan, subscription) as the default MiniMax route. The auth pre-flight detects it separately from the Direct API provider, the model-selection tables lead with `minimax-coding-plan/MiniMax-M3-highspeed`, and the login/setup guidance points at `opencode auth login` plus the Anthropic-compatible endpoint (`https://api.minimax.io/anthropic/v1`, with the China `minimaxi.com` variant noted). The dispatch contract records two live-machine facts: omit `--agent` (rejected on opencode 1.15.13) and confirm ids with `opencode models minimax-coding-plan`.

### Direct API retained + registry restructure

The shared registry gains a `minimax-m3` entry (token-plan default, `fallback_target: minimax-2.7`) and the `minimax-2.7` entry now carries two executor paths: the Token Plan highspeed fallback (`minimax-coding-plan`) and the pay-per-token Direct API (`minimax`, pool `minimax-api`). The fallback router reads the same `executors[].quota_pool` / `fallback_target` contract, so no router code changed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-prompt/assets/model-profiles.json` | Modified | Added `minimax-m3`; dual-executor `minimax-2.7`; description + `version` bump |
| `.opencode/skills/cli-opencode/SKILL.md` | Modified | Auth options, pre-flight tree, login/setup template, model selection, override example |
| `.opencode/skills/cli-opencode/references/cli_reference.md` | Modified | §4 pre-flight + setup; §5 model rows + `--variant` matrix |
| `.opencode/skills/cli-opencode/assets/prompt_templates.md` | Modified | MiniMax dispatch template → `minimax-coding-plan/MiniMax-M3-highspeed` |
| `.opencode/skills/cli-opencode/assets/prompt_quality_card.md` | Modified | Per-model override slugs |
| `.opencode/skills/cli-opencode/graph-metadata.json` | Modified | Trigger phrases |
| `.opencode/skills/sk-prompt-models/SKILL.md` | Modified | Description, activation/keyword triggers, dispatch matrix |
| `.opencode/skills/sk-prompt-models/description.json` | Modified | Description + keywords + trigger example |
| `.opencode/skills/sk-prompt-models/references/pattern-index.md` | Modified | Ownership-boundary provider row |
| `.opencode/skills/sk-prompt-models/graph-metadata.json` | Modified | Trigger phrases |
| `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md` | Modified | MiniMax mentions |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` | Modified | Fallback default model → `minimax-coding-plan/MiniMax-M2.7-highspeed` (Fix 2) |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts` | Modified | Fixture model id → token-plan slug; assertion keys off `label`, unaffected (Fix 2) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Documentation, metadata, and registry only — no runtime code. Provider names were corrected mid-flight from an initial assumption (`minimax` for the token plan) to the live-machine truth (`minimax-coding-plan`) after the `minimax-model-id-drift` memory surfaced. Every touched JSON file was `jq`-validated immediately after editing; a repo-wide `rg` confirmed the Token Plan default is present and that the only remaining `minimax/MiniMax-M2.7` mentions are the legitimate Direct-API alternative (plus two out-of-scope 003-benchmark code artifacts). The packet was strict-validated.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two concurrent providers (`minimax-coding-plan` default + `minimax` alt) | User asked to support both and default to the Token Plan; opencode resolves provider by name, so concurrent paths need distinct provider names |
| Provider name `minimax-coding-plan`, not `minimax`, for the Token Plan | That is the actual provider id on the live install (memory: minimax-model-id-drift); the old `minimax/MiniMax-M2.7` id errors |
| Default `MiniMax-M3-highspeed`, fallback `MiniMax-M2.7-highspeed` | User direction; M2.7-highspeed is independently confirmed live, M3-highspeed is account-holder-asserted and flagged for `opencode models` verification |
| Updated 003-benchmark `dispatch-model.cjs` fallback default + `executor-config.vitest.ts` fixture (Fix 2) | User authorized the follow-up; used confirmed-live `MiniMax-M2.7-highspeed` (not unverified M3) for a code default; 46 tests pass |
| Left `changelog/*.md` untouched | Changelogs record historical state and must not be rewritten |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `jq` parse: model-profiles.json + 2× graph-metadata.json + description.json | PASS — all valid; 9 models; `minimax-m3` fallback → `minimax-2.7` |
| `rg` Token Plan default present across 4 core files | PASS — `minimax-coding-plan` in SKILL.md, cli_reference.md, model-profiles.json, sentinel SKILL.md |
| `rg` no stale `minimax/MiniMax-M2.7` in live-dispatch examples (changelogs excepted) | PASS — remaining hits are the Direct-API alt + 2 out-of-scope 003 code artifacts |
| `validate.sh --strict` on this folder | PASS (recorded in this session after template-anchor alignment) |
| `node --check` on `dispatch-model.cjs` | PASS — syntax OK after Fix 2 |
| vitest `executor-config` + `fanout-pool` | PASS — 2 files, 46 tests after fixture id update |
| Live MiniMax dispatch | NOT RUN — depends on the user's configured `minimax-coding-plan` provider |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`MiniMax-M3-highspeed` slug unverified on the tier.** The live note confirms only M2.7 ids on `minimax-coding-plan`. Run `opencode models minimax-coding-plan` to confirm; the documented fallback `MiniMax-M2.7-highspeed` is confirmed.
2. **Changelogs retain the old `minimax/MiniMax-M2.7` id.** Intentional — changelog files record historical state and are not rewritten. All live code + docs now use the token-plan ids (the `dispatch-model.cjs` default and `executor-config.vitest.ts` fixture were updated in Fix 2; `fanout-pool.vitest.ts` only uses lineage labels).
3. **No live dispatch performed.** Provider availability and model resolution depend on the user's machine credentials.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
