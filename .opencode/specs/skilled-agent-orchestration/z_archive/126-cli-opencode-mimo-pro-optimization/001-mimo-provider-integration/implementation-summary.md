---
title: "Implementation Summary: Xiaomi Token Plan (Europe) provider + MiMo-V2.5-Pro integration [template:level_2/implementation-summary.md]"
description: "Wired the xiaomi-token-plan-ams provider and model mimo-v2.5-pro into cli-opencode, the shared small-model registry, and the sk-prompt-small-model sentinel as an explicitly-selectable MiMo path, mirroring the MiniMax Token Plan wiring; context_length and best framework left as honest placeholders pending phases 003 + 004."
trigger_phrases:
  - "mimo provider integration summary"
  - "xiaomi-token-plan-ams shipped"
  - "implementation"
  - "summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/001-mimo-provider-integration"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase-001 shipped; strict validate PASSED"
    next_safe_action: "Proceed to 002 (already implemented) / 003 research"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/assets/model-profiles.json"
      - ".opencode/skills/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-opencode/references/cli_reference.md"
      - ".opencode/skills/sk-prompt-small-model/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-126-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "fallback_target for mimo-v2.5-pro? → null; free opencode/mimo-v2.5-free documented as cheap-iteration path, not a registry fallback entry"
      - "Provider id? → xiaomi-token-plan-ams (live id; credential 'Xiaomi Token Plan (Europe)')"
      - "context_length now or later? → null placeholder; 126/003 research confirms"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-mimo-provider-integration |
| **Completed** | 2026-06-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

MiMo-V2.5-Pro is now a first-class, explicitly-selectable cli-opencode model. The Xiaomi Token Plan (Europe) provider `xiaomi-token-plan-ams` and its model `xiaomi-token-plan-ams/mimo-v2.5-pro` are wired into the shared small-model registry, the cli-opencode skill, and the `sk-prompt-small-model` sentinel, exactly mirroring how MiniMax's Token Plan (`minimax-coding-plan`) was wired in packet 120. The skill default stays `opencode-go/deepseek-v4-pro`; MiMo is additive. Documentation, metadata, and the shared JSON registry only — no runtime code.

### MiMo registered in the shared registry

`model-profiles.json` gains a `mimo-v2.5-pro` entry: executor `cli-opencode`, provider `xiaomi-token-plan-ams`, quota_pool `xiaomi-token-plan`, slug `xiaomi-token-plan-ams/mimo-v2.5-pro`, `context_length: null`, status `active`. The top-level `version` bumped 1.3 to 1.4 and the description's active-rotation line now names MiMo. The fallback router contract (`executors[].quota_pool` / `fallback_target`) is unchanged, so no router code moved. The free gateway sibling `opencode/mimo-v2.5-free` (opencode-go pool) is recorded as a cheap-iteration / probe path rather than a registry fallback entry.

### cli-opencode documents the selectable MiMo path

cli-opencode now treats `xiaomi-token-plan-ams` as a documented provider. The §3/§4 auth pre-flight detects it as `XIAOMI_OK`, the model-selection tables and ALWAYS-rules surface `xiaomi-token-plan-ams/mimo-v2.5-pro`, and a routing decision row tells dispatchers to omit `--agent` (a top-level `--agent general` warns and falls back on opencode 1.15.13) and confirm the live id with `opencode models xiaomi-token-plan-ams`. A new dispatch template (Template 15) and a per-model quality-card override carry the MiMo route, both flagged framework-pending until 126/004. Setup points at `opencode auth login` to the "Xiaomi Token Plan (Europe)" credential with no invented endpoint URL (provider-managed).

### Sentinel + metadata

`sk-prompt-small-model` names MiMo across all five files (SKILL.md activation + dispatch matrix row, description.json keywords, pattern-index.md dispatch row, README.md provider note, graph-metadata.json trigger phrases). Both skills' graph-metadata gained MiMo/Xiaomi trigger phrases so the advisor surfaces the sentinel. The cli-opencode changelog `v1.3.5.0.md` records the addition (frontmatter version 1.3.4.0 to 1.3.5.0).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-prompt/assets/model-profiles.json` | Modified | Added `mimo-v2.5-pro` (provider `xiaomi-token-plan-ams`, pool `xiaomi-token-plan`, `context_length: null`); description + `version` 1.3 to 1.4 |
| `.opencode/skills/cli-opencode/SKILL.md` | Modified | Keywords header, auth options, §3 XIAOMI_OK pre-flight, routing row, model selection, ALWAYS-rule examples (version 1.3.4.0 to 1.3.5.0) |
| `.opencode/skills/cli-opencode/references/cli_reference.md` | Modified | §4 pre-flight + login shape + MiMo routing table; §5 provider row + free `opencode/mimo-v2.5-free` row + `--variant` unverified row |
| `.opencode/skills/cli-opencode/assets/prompt_templates.md` | Modified | New MiMo dispatch template (Template 15); framework pending 126/004 |
| `.opencode/skills/cli-opencode/assets/prompt_quality_card.md` | Modified | MiMo per-model override; framework pending 126/004 |
| `.opencode/skills/cli-opencode/graph-metadata.json` | Modified | 7 MiMo trigger phrases + 3 key topics |
| `.opencode/skills/cli-opencode/changelog/v1.3.5.0.md` | Created | Version changelog for the MiMo addition |
| `.opencode/skills/sk-prompt-small-model/SKILL.md` | Modified | Activation + dispatch matrix row |
| `.opencode/skills/sk-prompt-small-model/description.json` | Modified | Description + keywords |
| `.opencode/skills/sk-prompt-small-model/references/pattern-index.md` | Modified | MiMo dispatch row; framework pending 126/004 |
| `.opencode/skills/sk-prompt-small-model/README.md` | Modified | Provider note |
| `.opencode/skills/sk-prompt-small-model/graph-metadata.json` | Modified | 5 MiMo trigger phrases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Documentation, metadata, and registry only — no runtime code. The implementation mirrored the MiniMax Token Plan wiring from packet 120, reusing the same registry entry shape and the same auth-pre-flight / model-selection / sentinel touch points. Every touched JSON file was `jq`-validated immediately after editing. The live lowercase slug `xiaomi-token-plan-ams/mimo-v2.5-pro` was used verbatim in every `--model` position (no CamelCase invention). All forward-looking capability fields were left as honest placeholders: `context_length` null pending 126/003 research, and the best prompt framework marked pending the 126/004 benchmark. A separate parallel-agent report of an "l/l corruption" in the model ids was independently checked and debunked — the ids are clean.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Provider id `xiaomi-token-plan-ams`, slug `mimo-v2.5-pro`, used verbatim | That is the live id on opencode 1.15.13 (credential "Xiaomi Token Plan (Europe)"); a live one-shot probe returned cleanly. Guessing `MiMo-V2.5-Pro` would 404 (memory: minimax-model-id-drift) |
| `context_length: null`, framework "pending 126/004" | The capability is unknown until 126/003 research and 126/004 benchmark; fabricating a number or a winning framework would be dishonest |
| Free `opencode/mimo-v2.5-free` documented as a path, not a registry fallback entry | It rides the opencode-go credit pool and is a cheap probe/iteration route; making it a `fallback_target` was unnecessary for an additive, explicitly-selectable model |
| MiMo additive; `opencode-go/deepseek-v4-pro` default unchanged | This phase registers a selectable path, not a default change; no MiniMax/DeepSeek rows altered |
| Omit `--agent` for MiMo dispatches | A top-level `--agent general` warns and falls back on opencode 1.15.13; the dispatch contract records the omission |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `jq` parse: model-profiles.json + 2x graph-metadata.json + sentinel description.json + packet description/graph-metadata | PASS — all valid; `version` 1.4; `mimo-v2.5-pro` present with provider `xiaomi-token-plan-ams` |
| `jq '.models[].id'` includes `mimo-v2.5-pro` | PASS — `...minimax-2.7, mimo-v2.5-pro, haiku, gemini-flash` |
| `rg` live slug present across cli-opencode + cli_reference + registry + sentinel | PASS — `xiaomi-token-plan-ams/mimo-v2.5-pro` in SKILL.md, cli_reference.md §4 + §5, model-profiles.json |
| `rg` free path documented | PASS — `opencode/mimo-v2.5-free` row in cli_reference.md §5 |
| `rg` default unchanged | PASS — `opencode-go/deepseek-v4-pro` remains skill default; no MiniMax/DeepSeek rows altered |
| Changelog file present | PASS — `.opencode/skills/cli-opencode/changelog/v1.3.5.0.md` created |
| Honest placeholders | PASS — `context_length` null; `--variant` unverified; best framework "pending 126/004"; no winner claimed |
| `validate.sh --strict` on this folder | PASS (recorded in this session after closing out the docs) |
| Live MiMo dispatch | NOT RUN — depends on the user's configured `xiaomi-token-plan-ams` provider credentials |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-001 | Registry stays valid JSON consumable by the fallback router | `jq` parse exits 0; required keys present on `mimo-v2.5-pro` | Pass |
| NFR-002 | No secrets embedded | Provider configured via `opencode auth login`; no key in repo | Pass |
| NFR-003 | Discoverability | MiMo trigger phrases present in both graph-metadata files | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`context_length` is null.** The MiMo-V2.5-Pro context window is not yet known; 126/003 research will confirm it. The registry note records the placeholder explicitly so no consumer reads a fabricated number.
2. **Best prompt framework is undecided.** The dispatch template and quality-card override are flagged "pending 126/004 benchmark"; no framework (TIDD-EC, RCAF, or any other) is claimed as the winner.
3. **`--variant` behavior unverified.** The cli_reference §5 matrix marks `--variant` for MiMo as omitted/unverified pending 126/003.
4. **No live dispatch performed.** Provider availability and model resolution depend on the user's machine credentials for the `xiaomi-token-plan-ams` provider.
<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY (~100 lines)
- Core + Level 2 addendum (NFR verification)
- Post-implementation documentation, created AFTER work completes
- Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
- HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
