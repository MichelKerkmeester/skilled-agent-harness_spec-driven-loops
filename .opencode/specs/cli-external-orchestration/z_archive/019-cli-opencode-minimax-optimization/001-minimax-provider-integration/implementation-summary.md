---
title: "Implementation Summary: MiniMax 2.7 direct-API provider integration"
description: "Added the minimax direct-API provider (model minimax-2.7) to cli-opencode docs + the shared small-model registry, surfaced via the sk-prompt-models sentinel."
trigger_phrases:
  - "minimax provider integration summary"
  - "minimax-2.7 added cli-opencode"
  - "minimax-api registry entry"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/019-cli-opencode-minimax-optimization/001-minimax-provider-integration"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Wired minimax provider across cli-opencode + registry + sentinel; strict validate PASSED"
    next_safe_action: "Run phase 002 deep-research loop"
    blockers: []
    key_files:
      - ".opencode/skills/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-opencode/references/cli_reference.md"
      - ".opencode/skills/sk-prompt/assets/model-profiles.json"
      - ".opencode/skills/sk-prompt-models/SKILL.md"
      - ".opencode/skills/sk-prompt-models/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-minimax-provider-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Register MiniMax as active vs optional-unverified? → active per user direction"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-minimax-provider-integration |
| **Completed** | 2026-05-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

MiniMax 2.7 is now a selectable model in the cli-opencode dispatch path. You can request `--model minimax/minimax-2.7` to route through the MiniMax.io direct API (its own `minimax-api` quota pool, keyed by `MINIMAX_API_KEY`), and the small-model sentinel now surfaces MiniMax alongside the existing rotation. This extends the 114 small-model infrastructure to a new provider without rebuilding any of it.

### MiniMax direct-API provider in cli-opencode

cli-opencode now recognizes a third provider, `minimax`, mirroring the existing `deepseek` direct-API pattern. The provider auth pre-flight detects `MINIMAX_OK`, the decision tree handles explicit MiniMax requests (and asks you to `opencode providers login minimax` when it is not configured rather than substituting silently), and the model-selection table documents `minimax/minimax-2.7`.

### MiniMax 2.7 in the shared registry

The shared small-model registry (`model-profiles.json`, bumped to v1.2) gains a `minimax-2.7` entry with one active executor path (cli-opencode / minimax / `minimax-api`). The fallback router can now treat `minimax-api` as its own quota pool. Context length and `--variant` behavior are intentionally left `null`/unverified pending the phase-002 research.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-opencode/SKILL.md` | Modified | Auth pre-flight `MINIMAX_OK`, decision-tree rows, login template, override examples |
| `.opencode/skills/cli-opencode/references/cli_reference.md` | Modified | §4 pre-flight + login shape; §5 model-selection row + `--variant` matrix row |
| `.opencode/skills/sk-prompt/assets/model-profiles.json` | Modified | Appended `minimax-2.7` entry; version → 1.2 |
| `.opencode/skills/sk-prompt-models/SKILL.md` | Modified | Sentinel description + activation/keyword triggers include MiniMax |
| `.opencode/skills/sk-prompt-models/graph-metadata.json` | Modified | Added MiniMax trigger phrases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Documentation + config only, no runtime code. Mirrored the shipped `deepseek` direct-API pattern so the change stays consistent with how cli-opencode already documents providers. Verified the registry parses as valid JSON, confirmed the `minimax` rows are present across all five touched files, and ran strict validation on this spec folder.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Registered MiniMax as `active`, not `optional-unverified` | User chose active direct-API provider; documented now so it is selectable, with unknowns flagged in notes/weaknesses |
| Left `context_length` and `--variant` as null/unverified | Honest — I don't have confirmed MiniMax 2.7 specs; phase-002 research fills these rather than guessing |
| `fallback_target: null` (fail-fast) | Single executor path today, same as `qwen3.6`; no second pool to fall back to yet |
| Touched only skill/registry files, not CLAUDE.md | CLAUDE.md's small-model dispatch rule lists the rotation too, but that is the framework file — flagged as a follow-up rather than silently editing global instructions |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| `jq` parse of model-profiles.json + minimax-2.7 active | PASS — 8 models, minimax-2.7 status active |
| `rg -c minimax` across 5 touched files | PASS — SKILL.md 6, cli_reference.md 8, model-profiles.json 6, sentinel SKILL.md 4, sentinel graph-metadata 5 |
| `validate.sh --strict` on 120/001 | PASS — Errors 0, Warnings 0 |
| Live MiniMax.io dispatch | NOT RUN — depends on user's `MINIMAX_API_KEY` + `opencode providers list` exposing minimax |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Live availability unverified.** I could not run `opencode providers list` to confirm the `minimax` provider exists on this install. Dispatch requires `MINIMAX_API_KEY` set and the provider configured (`opencode providers login minimax`).
2. **MiniMax 2.7 specs are placeholders.** `context_length` is null and `--variant` behavior is marked unverified; phase-002 deep-research will fill these in.
3. **No efficiency patterns yet.** Context-budget tuple, output-verification recipe, and pattern-index rows for MiniMax are deliberately out of scope here — they are phase-002 outputs.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

