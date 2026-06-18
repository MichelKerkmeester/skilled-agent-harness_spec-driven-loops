---
title: "Implementation Summary: MiMo + MiniMax as selectable deep-skills executors [template:level_2/implementation-summary.md]"
description: "Removed the hard-coded --agent general from the cli-opencode dispatch paths of the deep skills (four deep YAMLs + the deep-improvement benchmark dispatcher) so MiMo-V2.5-Pro and MiniMax token-plan models dispatch cleanly through the existing cli-opencode executor kind, and documented the model examples across the deep command setup surfaces."
trigger_phrases:
  - "deep skills executor integration summary"
  - "mimo minimax deep loop shipped"
  - "implementation"
  - "summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/002-deep-skills-executor-integration"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase-002 shipped; vitest 56/56; strict validate PASSED"
    next_safe_action: "Proceed to 003 research"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-research-loop_auto.yaml"
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs"
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-deep-skills-executor-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Add a new cli-mimo executor kind? → no, MiMo/MiniMax route through the existing cli-opencode kind"
      - "How to fix the --agent general blocker? → remove the hard-coded flag; the executor-config schema has no agent field, so the default agent is correct"
      - "Does the ai-council path need editing? → no, it dispatches seats via an injected dispatchSeat with no hard-coded --agent general"
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
| **Spec Folder** | 002-deep-skills-executor-integration |
| **Completed** | 2026-06-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The deep skills can now use MiMo-V2.5-Pro and MiniMax token-plan models as clean `cli-opencode` executors. The deep skills already reached external models through the `cli-opencode` executor kind, which accepts any `provider/model` string. The one blocker was a hard-coded `--agent general` on every cli-opencode dispatch: on opencode 1.15.13 `--agent general` warns ("agent general is a subagent, not a primary agent. Falling back to default agent") and falls back for gateway models, and token-plan providers reject it outright. The executor-config schema has no `agent` field, so the fix was to remove the hard-coded flag and let the default agent run.

### Hard-coded `--agent general` removed from the deep dispatch paths

The `--agent general` token was removed from the `if_cli_opencode` dispatch branch in all four deep YAMLs: `deep_start-review-loop_auto.yaml` (was L893), `deep_start-review-loop_confirm.yaml` (was L854), `deep_start-research-loop_auto.yaml` (was L778), and `deep_start-research-loop_confirm.yaml` (was L694). The `{optional_variant_flag}` render-hint pattern and the surrounding block structure were preserved intact. `rg -rn "agent general" deep/assets/*.yaml` is now clean.

### Benchmark dispatcher emits `--agent` only for an explicit non-general agent

The Lane-B dispatcher `dispatch-model.cjs` changed its cli-opencode arg builder from always pushing `--agent` to `if (agent && agent !== 'general') args.push('--agent', agent)` — it omits `--agent` for the default/unset case and keeps it for an explicit non-general primary agent. The resolved `TARGET.agent` default of `'general'` stays for record-keeping; only the emitted args changed. A new `describe('cli-opencode --agent handling')` block in `remediation.vitest.ts` covers omit-for-general, omit-for-unset, and include-for-explicit-orchestrate.

### MiMo + MiniMax documented as selectable cli-opencode models

The cli-opencode invocation line and the `executor_model` PRE-BOUND examples in `start-research-loop.md` and `start-review-loop.md` now drop `--agent general` and add `cli-opencode e.g. xiaomi-token-plan-ams/mimo-v2.5-pro, minimax-coding-plan/MiniMax-M2.7-highspeed`. The same model examples were added to the PRE-BOUND `model` line in `start-model-benchmark-loop.md` and `ask-ai-council.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modified | Removed hard-coded `--agent general` from `if_cli_opencode` (was L893) |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modified | Removed hard-coded `--agent general` from `if_cli_opencode` (was L854) |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Modified | Removed hard-coded `--agent general` from `if_cli_opencode` (was L778) |
| `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml` | Modified | Removed hard-coded `--agent general` from `if_cli_opencode` (was L694) |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` | Modified | cli-opencode arg builder omits `--agent` for general/unset (L198) |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts` | Modified | Added `cli-opencode --agent handling` describe block (3 tests, L247) |
| `.opencode/commands/deep/start-research-loop.md` | Modified | cli-opencode invocation line + `executor_model` MiMo/MiniMax examples |
| `.opencode/commands/deep/start-review-loop.md` | Modified | cli-opencode invocation line + `executor_model` MiMo/MiniMax examples |
| `.opencode/commands/deep/start-model-benchmark-loop.md` | Modified | PRE-BOUND `model` line MiMo/MiniMax examples |
| `.opencode/commands/deep/ask-ai-council.md` | Modified | PRE-BOUND `model` line MiMo/MiniMax examples |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Surgical edits across the deep dispatch paths plus doc updates — one test-gated runtime behavior change. The four deep YAMLs lost only the hard-coded `--agent general` token; their `if_cli_opencode` block and `{optional_variant_flag}` render hint were preserved. The benchmark dispatcher swapped its always-push `--agent` for a gated push, and the matching vitest block was added before the suite was run so it stayed green. The ai-council path was verified rather than edited: it dispatches seats via an injected `dispatchSeat` function (`orchestrate-topic.cjs` → `deep-loop-runtime/lib/council/multi-seat-dispatch.cjs`), and grep found no hard-coded `--agent general`/`opencode run` in the council code or YAML, so it needed no change (covered by the shared dispatcher fix where applicable). No new EXECUTOR_KIND was added — MiMo/MiniMax route through the existing `cli-opencode` kind, and the native / cli-codex / cli-gemini / cli-claude-code / cli-devin branches were left untouched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the hard-coded `--agent general` rather than add an agent field | The executor-config schema has no `agent` field; the default agent is the correct primary agent, and the cli-opencode contract is to omit `--agent` for the default case |
| Gate the benchmark dispatcher on `agent !== 'general'` instead of dropping `--agent` entirely | Preserves the optional explicit non-general agent path while omitting the flag for the default/unset case |
| Keep the resolved `TARGET.agent` default of `'general'` | Record-keeping only; just the emitted args change, so existing fixtures that read the default stay valid |
| Verify, not edit, the ai-council path | Seats dispatch via an injected `dispatchSeat`; no hard-coded `--agent general`/`opencode run` exists in council code or YAML |
| Route MiMo/MiniMax through the existing `cli-opencode` kind | cli-opencode already accepts any `provider/model`; a new `cli-mimo` kind would be redundant |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -n "agent general"` across `deep/assets/*.yaml` | PASS — clean across all four edited YAMLs and the two ai-council YAMLs |
| `rg -n "agent general"` in `dispatch-model.cjs` | PASS — no hard-coded dispatch arg remains |
| `node --check dispatch-model.cjs` | PASS — syntax OK after the arg-builder edit |
| Full model-benchmark vitest suite | PASS — 6 files, 56 tests, ALL PASSED |
| `rg -n "mimo-v2.5-pro\|MiniMax-M2.7-highspeed"` across the four deep command docs | PASS — slugs present in start-research-loop, start-review-loop, start-model-benchmark-loop, ask-ai-council |
| ai-council dispatcher hard-coded agent/opencode-run check | PASS — `multi-seat-dispatch.cjs` carries no `--agent general`/`opencode run` |
| `validate.sh --strict` on this folder | PASS (recorded in this session after authoring the Level-2 doc set) |
| Live MiMo / MiniMax dispatch | NOT RUN — depends on the user's configured `xiaomi-token-plan-ams` / `minimax-coding-plan` providers |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live dispatch performed.** Provider availability and model resolution depend on the user's machine credentials for `xiaomi-token-plan-ams` and `minimax-coding-plan`; the arg-builder fix and docs land regardless.
2. **`--agent general` removal is behavior-equivalent for gateway models.** Those already fell back to the default agent (with a warning) before the change; the fix strictly removes the warning and unblocks the token-plan providers that rejected the flag. No deep loop relied on `--agent orchestrate` (grep showed only `general`), and the optional non-general path is preserved if ever needed.
3. **MiMo provider/registry slug depends on 001.** This phase references `xiaomi-token-plan-ams/mimo-v2.5-pro` in docs; the provider/registry entry is owned by 001-mimo-provider-integration.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
