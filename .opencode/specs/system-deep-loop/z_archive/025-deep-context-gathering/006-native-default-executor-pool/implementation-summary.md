---
title: "Implementation Summary: Deep-context native-only default executor pool"
description: "The deep-context loop now defaults to a native-only pool (2 @deep-context seats); the pool question is Native / Custom and no longer names specific models."
trigger_phrases:
  - "deep-context native default summary"
  - "executor pool default done"
  - "native only pool summary"
  - "deep-context pool restructure done"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/025-deep-context-gathering/006-native-default-executor-pool"
    last_updated_at: "2026-06-07T11:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped native-only default and Native/Custom pool question"
    next_safe_action: "Proceed to the deep-command Phase 0 + setup gating packet"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/assets/deep_context_config.json"
      - ".opencode/commands/deep/start-context-loop.md"
      - ".opencode/commands/deep/assets/deep_start-context-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml"
      - ".opencode/skills/deep-context/SKILL.md"
      - ".opencode/skills/deep-context/README.md"
      - ".opencode/agents/deep-context.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-134-006-native-default-executor-pool"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Default pool? -> native-only (2 seats)."
      - "Options? -> A) Native only (default), B) Custom."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-native-default-executor-pool |
| **Completed** | 2026-06-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Running `/deep:start-context-loop` no longer spawns paid CLI executors by default. The default pool is now native-only (2 `@deep-context` seats), and the pool question stops enumerating a specific model list.

### Native-only default

The one behavioral change is in `deep_context_config.json`: `fanout.executors` now holds two native seats instead of the old five-seat heterogeneous pool. The `by-model-shared-scope` mode enum and the YAML dispatch logic are untouched, so two native seats still sweep the shared scope and the CLI-pool step simply skips when no CLI seats are configured.

### A cleaner pool question

The setup prompt's Q-Pool is now exactly two options: **A) Native only** (the default) and **B) Custom — Native, through CLI Skill, or Combined** via `--executor`/`--executors`. The specific model list (`MiMo + gpt + deepseek`) survives only as a clearly labeled Custom example, never as the default, across the command, both YAMLs, the skill, and the README.

### Agent wording kept honest

The canonical agent body now says the seat is one member of a shared-scope agreement pool with "native, and optionally CLI" executors and that the default pool is native-only. Because the body changed, both runtime mirrors were rebuilt from the canonical, keeping all three byte-identical.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `deep_context_config.json` | Modified | `fanout.executors` → 2 native (the default flip) |
| `start-context-loop.md` | Modified | Q-Pool A/B, default-policy prose, examples, PRE-BOUND marker |
| `deep_start-context-loop_auto.yaml` / `_confirm.yaml` | Modified | `executor_pool` description line de-named |
| `deep-context/SKILL.md` | Modified | Description, §3 example relabel, Quick-Ref default-pool row |
| `deep-context/README.md` | Modified | Default-executor-pool row |
| `agents/deep-context.md` (+ `.claude` `.md`, `.codex` `.toml`) | Modified | Soften wording; mirrors re-synced |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The default flip was verified with `jq` (2 native, mode unchanged). A grep across the command, YAMLs, skill, and README confirmed the model list now appears only under Custom/example labels. The agent re-sync reused the 005 build-from-canonical approach, and the three bodies were re-diffed byte-identical with the Codex TOML re-parsed. The packet passed `validate.sh --strict`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Flip the config default, not the YAML | The loop reads `config.fanout.executors`; the config is the single source of the default |
| Keep `by-model-shared-scope` mode enum | It is bound across both YAMLs; 2 native still sweep the shared scope, so no logic change is needed |
| Keep the heterogeneous pool as a labeled Custom example | The capability stays one `--executor` flag away; only the default and the option wording changed |
| Re-sync mirrors after the agent edit | The 005 convention requires all three runtime agent files to match the canonical body |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `jq '.fanout.executors'` | PASS, exactly 2 native; `mode` still `by-model-shared-scope` |
| Q-Pool wording | PASS, exactly A) Native only (default) / B) Custom |
| Het list only under Custom/example | PASS, no "default = het" text remains |
| Mirror body parity (3-way) | PASS, byte-identical after soften edit |
| Codex TOML parse | PASS, soften wording present |
| `validate.sh --strict` (this packet) | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two same-model native seats give a weaker agreement signal** than diverse models. This is the deliberate trade for a cheap, always-available default; opt into the heterogeneous pool with one `--executor` flag when diversity matters.
2. **Existing saved configs are unchanged.** Only the template default flipped; packets that already persisted a heterogeneous pool keep it.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
