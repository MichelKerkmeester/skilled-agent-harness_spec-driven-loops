---
title: "Implementation Summary: Relocate model registry + benchmarks into sk-prompt-small-model hub [template:level_3/implementation-summary.md]"
description: "Consolidates model-profiles.json and six benchmark datasets into sk-prompt-small-model, strips sk-prompt of all small-model coupling, and locks deep-improvement model-benchmark routing to the hub."
trigger_phrases:
  - "model registry implementation summary"
  - "benchmark hub summary"
  - "sk-prompt forkable summary"
  - "deep-improvement hub routing summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-relocate-model-registry-and-benchmarks"
    last_updated_at: "2026-06-03T04:03:34Z"
    last_updated_by: "claude-sonnet"
    recent_action: "authored implementation-summary"
    next_safe_action: "Spec complete — no further action required"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-small-model/assets/model-profiles.json"
      - ".opencode/skills/sk-prompt-small-model/benchmarks/"
      - ".opencode/skills/deep-improvement/commands/auto.yaml"
      - ".opencode/skills/deep-improvement/commands/confirm.yaml"
      - ".opencode/skills/sk-prompt/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/131-relocate-model-registry-and-benchmarks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 131-relocate-model-registry-and-benchmarks |
| **Completed** | 2026-06-03 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The model registry and all benchmark history now live in one place: `sk-prompt-small-model`. Before this work, `model-profiles.json` sat inside `sk-prompt/assets/` despite sk-prompt-small-model being the canonical small-model dispatch skill, and six sets of benchmark run-data were scattered across individual spec sub-phase folders where no cross-session query could find them. This migration consolidates both surfaces, removes the markdown mirror that caused registry drift, strips sk-prompt of every small-model reference so it can be forked as a generic prompt-framework engine, and locks deep-improvement model-benchmark routing so all future runs land in the hub automatically.

### Registry Hub

`sk-prompt-small-model/assets/model-profiles.json` is now the single authoritative registry for all dispatched model profiles. All 8 profiles (MiMo-V2.5-Pro, MiniMax-M3, MiniMax-M2.7, Kimi-k2.6, SWE-1.6, DeepSeek-v4-pro, Qwen3.6, GLM-5.1) resolve at the hub path. The stale markdown mirror (`sk-prompt/references/model-profiles.md`) is deleted. All ~121 cross-references in SKILL.md files, YAML configs, and .cjs scripts were repointed in a single path-swap pass.

### Benchmark Hub

`sk-prompt-small-model/benchmarks/` now holds run-data for all six historical evaluations: MiniMax M2.7 bakeoff (spec 120/003), MiMo V2.5 bakeoff (spec 126/004), SWE-1.6 eval (spec 113/003), SWE-1.6 rerun (spec 113/005), sweep run 127/004, and sweep run 127/006. Each gutted sub-phase directory keeps its spec-kit documentation and a `BENCHMARK-RELOCATED.md` pointer to the hub path, so navigating the old location does not result in a dead end.

### sk-prompt as Forkable Framework Engine

sk-prompt's SKILL.md and `references/cli_prompt_quality_card.md` are now grep-clean of small-model references. The per-model override note, Budget-Awareness small-model section, model-profiles.json pointer, and the sk-prompt-small-model path in the Tier-2 precedence rule are all removed. The generic `framework-registry.json` stays. You can now fork sk-prompt for any model or provider without inheriting MiMo- or MiniMax-specific overrides.

### deep-improvement Hub-Only Routing

The model-benchmark command in deep-improvement writes exclusively to `sk-prompt-small-model/benchmarks/{run_label}`. Both `auto.yaml` and `confirm.yaml` set `output_dir` to the hub path; no spec-local default exists and no per-invocation override is offered. Agent-improvement and prompt-improvement modes are unchanged and remain spec-local. The .cjs harness scripts required no changes: they read `output_dir` from YAML config and were already path-agnostic.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The migration ran in three sequenced passes. First, the hub directories were created and the registry and benchmark data moved, with `BENCHMARK-RELOCATED.md` pointers written in each gutted sub-phase. Second, sk-prompt was stripped of all small-model references and the deep-improvement YAML routing was updated. Third, grep verification confirmed zero dangling references to the old registry path in any active surface, `rg` confirmed sk-prompt is clean, and a `node -e` require check confirmed all 8 hub profiles load without error.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Benchmarks moved wholesale to hub (no per-spec copies) | Spec sub-phases are work records, not durable storage; wholesale move gives permanent discoverability without duplication |
| `model-profiles.md` deleted outright | The markdown mirror was always derived and had drifted; the JSON is sufficient and auto-generates with `jq` or `node -e` |
| deep-improvement model-benchmark hub-only with no override | An optional local path recreates the fragmentation problem immediately; hub-only enforces consolidation permanently |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg 'sk-prompt/assets/model-profiles'` in active surfaces | PASS — zero hits |
| `rg -r 'model-profiles\|small.model\|Budget-Awareness' sk-prompt/` (excl. changelog) | PASS — zero hits |
| 8/8 hub profiles resolve via `node -e` require | PASS |
| Six gutted sub-phases each have `BENCHMARK-RELOCATED.md` | PASS |
| `deep-improvement/commands/auto.yaml` and `confirm.yaml` cite hub output_dir | PASS |
| speckit validate --strict on spec folder | PASS — exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No auto-generation of model-profiles.md.** If a human-readable markdown view of the registry is needed in the future, it must be generated manually with `jq` or a small script. No tooling exists to auto-generate it on update.

2. **deep-improvement model-benchmark has no offline/local output option.** If the hub path is unavailable (unusual for a local skill tree), benchmark outputs have nowhere to go. In practice this is not a constraint since deep-improvement always runs in the same working tree as sk-prompt-small-model.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
