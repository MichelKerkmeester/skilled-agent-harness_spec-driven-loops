---
title: "Implementation Summary: Phase 1: model-registration"
description: "GLM-5.2 is now a first-class small model across cli-opencode and sk-prompt-models via the Z.AI GLM Coding Plan (zai-coding-plan/glm-5.2)."
trigger_phrases:
  - "glm-5.2"
  - "zai-coding-plan"
  - "model registration summary"
  - "zai-coding-plan/glm-5.2"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/120-glm-5-2-support/001-model-registration"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Registered glm-5.2 across 10 surfaces; verified green"
    next_safe_action: "Begin 002-framework-bakeoff"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/assets/model_profiles.json"
      - ".opencode/skills/sk-prompt-models/references/models/glm-5.2.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "glm-support-001-model-registration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Live provider id = zai-coding-plan (authed); live slug = zai-coding-plan/glm-5.2 (confirmed via opencode models)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-model-registration |
| **Completed** | 2026-06-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

GLM-5.2 is now a first-class small model. You can dispatch it by slug (`zai-coding-plan/glm-5.2`) or by the `glm` / `zai` aliases, and the skill advisor routes GLM-5.2 prompt-framework questions to `sk-prompt-models` + `cli-opencode`. It runs on the Z.AI GLM Coding Plan subscription (provider `zai-coding-plan`), on a quota pool independent of the kimi / minimax / xiaomi pools, and supersedes the gateway-only `glm-5.1` that cli-opencode v1.3.15.0 removed when no direct provider existed.

### Register glm-5.2 across the small-model surfaces

You now get a complete registration: a `model_profiles.json` entry (context_length 1000000, executor cli-opencode → provider zai-coding-plan → pool zai-coding-plan, a capability block with model_slug `zai-coding-plan/glm-5.2`, agent_policy omit-general, variant_status accepted-unverified, and recommended_frameworks CRAFT at `default-unverified` status), a per-model prompt-craft profile, an ACTIVE-table row in `_index.md`, SKILL.md aliases + a §3 dispatch-matrix row, and routing graph metadata in both skills. The model is dispatchable, alias-resolvable, and advisor-routable.

### Reconcile the stale glm-5.1 references

The prior gateway-only `glm-5.1` left dead references behind. GLM-scoped reconciliation: the `prompt_quality_card.md` catch-all row dropped `glm-5.1` (and its dead profile link) in favour of a dedicated `glm-5.2` row, and `cli-opencode/graph-metadata.json` swapped `glm-5.1` → `glm-5.2` (+ added `zai-coding-plan` triggers). Unrelated dead links (`kimi-k2.6.md`, `qwen3.6.md`) were left untouched as separate, out-of-scope debt.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-prompt-models/assets/model_profiles.json` | Modified | Added the `glm-5.2` entry (1M context, capability block, CRAFT default-unverified); updated the registry description rotation line |
| `.opencode/skills/sk-prompt-models/references/models/glm-5.2.md` | Created | New 7-section prompt-craft profile (CRAFT default-unverified, bakeoff pending) |
| `.opencode/skills/sk-prompt-models/references/models/_index.md` | Modified | Added `glm-5.2` to the ACTIVE table |
| `.opencode/skills/sk-prompt-models/SKILL.md` | Modified | Frontmatter, Keywords, activation + keyword triggers, MODEL_ALIASES (`glm`/`zai` → glm-5.2), §3 dispatch-matrix row, ALWAYS active-model set |
| `.opencode/skills/sk-prompt-models/references/pattern_index.md` | Modified | §3 ownership-boundary line (+ GLM-5.2 via the Z.AI GLM Coding Plan) |
| `.opencode/skills/sk-prompt-models/graph-metadata.json` | Modified | enhances context + intent_signals + trigger_phrases for glm-5.2 / zai-coding-plan |
| `.opencode/skills/cli-opencode/SKILL.md` | Modified | Keywords header, Model Selection paragraph (GLM-5.2 sentence), provider login list |
| `.opencode/skills/cli-opencode/references/cli_reference.md` | Modified | Provider table row, variant table row, login command shape |
| `.opencode/skills/cli-opencode/assets/prompt_quality_card.md` | Modified | Dedicated glm-5.2 row; removed the dead glm-5.1 reference |
| `.opencode/skills/cli-opencode/graph-metadata.json` | Modified | trigger_phrases + key_topics: glm-5.1 → glm-5.2 + zai-coding-plan |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Discovery-first, then the canonical "Adopting a New Provider" checklist (pattern_index.md §4). Discovery confirmed the Z.AI Coding Plan provider is authed (`opencode providers list`), the live provider id is `zai-coding-plan` (auth.json keys), and the live slug is `zai-coding-plan/glm-5.2` (`opencode models zai-coding-plan` → glm-4.5-air/glm-4.7/glm-5-turbo/glm-5.1/glm-5.2/glm-5v-turbo). Context window (1M) / max output (128K) and the dispatch quirks (reasoning_effort, thinking-by-default, tool_choice=auto, tool_stream) came from official Z.AI docs (gathered via a GPT-5.5 research dispatch) and are recorded as doc-sourced with a re-verify note — `opencode models` did not expose limits. Confidence came from four checks: a live smoke dispatch that returned "pong" at exit 0, the card-sync guard at exit 0, clean JSON parses on every edited file, and an advisor re-index whose routing probe surfaced both skills.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Recorded CRAFT as primary at `default-unverified` | Z.AI's official prompting guidance (Goal/Context/Constraints/Done-when + plan-before-execute, long-horizon framing) maps to CRAFT; the empirical winner is phase 2's job, so status stays default-unverified |
| context_length 1,000,000 / output 131,072 recorded from Z.AI docs | `opencode models` did not expose limits; values are doc-sourced with an explicit re-verify note (no fabrication) |
| `--variant` status accepted-unverified | GLM has native reasoning_effort (high/max), but whether opencode `--variant` forwards to it is unconfirmed; smoke-test before relying on it |
| Reconciled glm-5.1 → glm-5.2, left kimi-k2.6/qwen3.6 dead links | GLM-5.2 supersedes the removed gateway-only glm-5.1; the other dead profile links are unrelated pre-existing debt, out of this phase's scope |
| Single executor path, no fallback_target | zai-coding-plan is a new dedicated pool with no same-pool fallback to point at |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Live smoke dispatch (`opencode run --model zai-coding-plan/glm-5.2 ... "Reply with exactly one word: pong"`) | PASS — returned "pong", exit 0 (default `build` agent) |
| Card-sync guard (`check-prompt-quality-card-sync.sh .`) | PASS, exit 0 (CHECK 3 registry/profile/_index complete, CHECK 4 discoverability) — baseline was also PASS |
| JSON parse (node) on all edited JSON | PASS — model_profiles.json + both graph-metadata.json parse clean |
| Advisor routing probe (glm-5.2 / Z.AI prompt) | PASS — sk-prompt-models conf 0.95, cli-opencode conf 0.94 |
| Live facts (`opencode providers list`, `opencode models zai-coding-plan`, 2026-06-28) | PASS — provider zai-coding-plan authed; slug zai-coding-plan/glm-5.2 present |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Best prompt framework is unverified.** CRAFT is recorded at `default-unverified` from Z.AI doc guidance. The empirical winner is decided by phase 2 (`002-framework-bakeoff`) and folded in by phase 3 (`003-promote-results`).
2. **`--variant` ↔ reasoning_effort mapping is unverified.** GLM has native high/max; whether opencode forwards `--variant` to it is not confirmed. Smoke-test before relying on a reasoning bump.
3. **context_length / max-output are doc-sourced** (1,000,000 / 131,072). `opencode models` did not expose limits; re-verify on the install.
4. **Smoke test is a liveness check, not a quality check.** "pong" proves the slug dispatches; it says nothing about coding-task quality.
5. **Out-of-scope debt noted, not fixed:** `prompt_quality_card.md` still links dead `kimi-k2.6.md` / `qwen3.6.md` profiles (unrelated to GLM) — flagged for a separate cleanup.
<!-- /ANCHOR:limitations -->
