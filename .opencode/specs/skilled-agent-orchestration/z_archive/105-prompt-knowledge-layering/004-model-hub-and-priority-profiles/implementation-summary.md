---
title: "Implementation Summary: model-hub-and-priority-profiles"
description: "Phase 4 matured sk-prompt-models from a thin router into the per-model prompt-craft content hub: rewrote SKILL.md, authored _index.md, and delivered the two priority profiles (minimax-m3.md + mimo-v2.5-pro.md) following the fixed 6-section template."
trigger_phrases:
  - "model hub"
  - "priority profiles"
  - "sk-prompt-models hub"
  - "minimax-m3 profile"
  - "mimo profile"
  - "small model prompt craft"
importance_tier: "important"
contextType: "spec-completion"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/105-prompt-knowledge-layering/004-model-hub-and-priority-profiles"
    last_updated_at: "2026-06-02T18:30:00Z"
    last_updated_by: "agent"
    recent_action: "Populated completion docs for phase 004"
    next_safe_action: "Proceed to phase 005-backfill-remaining-profiles"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/SKILL.md"
      - ".opencode/skills/sk-prompt-models/references/models/_index.md"
      - ".opencode/skills/sk-prompt-models/references/models/minimax-m3.md"
      - ".opencode/skills/sk-prompt-models/references/models/mimo-v2.5-pro.md"
    session_dedup:
      fingerprint: "sha256:920a4c16c23cc8b74bb3707be375f277e0f10452c73265af25d0c1fe90fff177"
      session_id: "phase-004-completion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Architecture A (per-model profiles as WEIGHT) was confirmed; SKILL.md is the thin entry surface."
      - "MiniMax-M3 framework carried from minimax-2.7 (TIDD-EC + dense), status: carried."
      - "MiMo-V2.5-Pro framework empirically benchmarked (COSTAR + lean, benchmark 126/004), status: empirical."
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
| **Spec Folder** | 004-model-hub-and-priority-profiles |
| **Completed** | 2026-06-02 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`sk-prompt-models` was a thin router with no per-model content. Phase 4 flipped it into the canonical prompt-craft hub for the entire small-model rotation: per-model prompt profiles now live here in `references/models/`, executor mechanics stay in `cli-devin`/`cli-opencode`, and the SKILL.md is the thin entry surface that ties them together. The two priority profiles — `minimax-m3.md` and `mimo-v2.5-pro.md` — are the first empirically-grounded profiles in the hub.

### SKILL.md Rewrite (0.1.0 -> 0.2.0)

The old SKILL.md mixed prompt-craft prose with executor mechanics and routed between them ambiguously. The rewrite retitled the skill to "Small-Model Prompt-Craft Hub", added an explicit ALWAYS/NEVER rule set distinguishing prompt-craft ownership (here) from executor mechanics (`cli-*`), introduced the dispatch matrix, and defined the adoption protocol for adding new providers. The file was kept at exactly 199 LOC to respect the 200-LOC cap.

### references/models/_index.md

Created the thin index file that is the per-model contract surface: one row per active model (minimax-m3, mimo-v2.5-pro, minimax-2.7, swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1) with framework primary/fallback, pre-planning density, and status. The index mirrors `sk-prompt/assets/model-profiles.json` recommended_frameworks and cites that JSON as the data source of truth.

### minimax-m3.md (Priority Profile — carried)

Full 6-section profile for MiniMax-M3: identity (slug, quota pool, executor path, fallback target), recommended framework (TIDD-EC primary, RCAF fallback, dense pre-planning), benchmark evidence carried from minimax-2.7 (packet 120/003, TIDD-EC 0.767, RCAF 0.742), tuned TIDD-EC template snippet, dispatch gotchas (no `--agent`, `--variant` unverified, `</dev/null` non-TTY rule), and cross-references. The profile was labeled `status: carried` because the benchmark ran on M2.7; M3 inherits the framework contract until a fresh M3-specific run is completed.

### mimo-v2.5-pro.md (Priority Profile — empirical)

Full 6-section profile for MiMo-V2.5-Pro: identity (1M-token context, xiaomi-token-plan-ams provider, Xiaomi Token Plan Europe quota pool), recommended framework (COSTAR primary, RACE fallback, lean pre-planning), full benchmark evidence from the 126/004 run (10 real MiMo dispatches, COSTAR 1.0000 composite, RACE 0.9934 statistical tie, TIDD-EC last at ~2.4× token overhead), tuned COSTAR and RACE fallback template snippets, dispatch gotchas (`--variant high` required, `--agent` must be omitted, `</dev/null` non-TTY rule), and cross-references. The key discriminator finding is documented explicitly: COSTAR beats TIDD-EC on format adherence + token efficiency, not correctness — all six frameworks were 100% correct.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-prompt-models/SKILL.md` | Modified | Rewrote to "Small-Model Prompt-Craft Hub"; flipped ALWAYS/NEVER rules; added dispatch matrix; bumped version 0.1.0 -> 0.2.0; kept at 199 LOC |
| `.opencode/skills/sk-prompt-models/references/models/_index.md` | Created | Thin per-model index: framework primary/fallback, pre-planning density, status for all 8 active models |
| `.opencode/skills/sk-prompt-models/references/models/minimax-m3.md` | Created | Priority profile for MiniMax-M3: TIDD-EC + dense, carried from minimax-2.7 (120/003) |
| `.opencode/skills/sk-prompt-models/references/models/mimo-v2.5-pro.md` | Created | Priority profile for MiMo-V2.5-Pro: COSTAR + lean, empirical (126/004, confidence high) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All four files were authored within a single session against the main branch. The SKILL.md rewrite was verified to land at 199 LOC (under the 200-LOC cap). The two priority profiles follow the fixed 6-section template (Identity, Recommended Framework, Benchmark Evidence, Tuned Template Snippet, Dispatch Gotchas, See Also) to ensure structural consistency with the profiles that will be authored in phase 005. The `_index.md` rows for the 6 remaining models (minimax-2.7, swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1) were added as roadmap pointers — the profiles for those models are the subject of phase 005.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Architecture A: per-model profiles as hub WEIGHT, SKILL.md as thin entry surface | Keeps the entry surface scannable (<=200 LOC) while putting the actual prompt-craft content on-demand in `references/models/<id>.md`. Profiles are loaded only when that model is being dispatched. |
| minimax-m3.md status: carried, not empirical | The benchmark (120/003) ran on minimax-2.7, not M3. Labeling the inherited framework contract "carried" is honest and prevents operators from treating M3 data as verified — a fresh M3 run should be done before the status is promoted. |
| mimo-v2.5-pro.md discriminator: format adherence + token efficiency, NOT correctness | All 6 frameworks scored 100% on assertions in the 126/004 benchmark. Documenting the real discriminator prevents future misinterpretation (e.g., choosing TIDD-EC because it "works for MiniMax" without understanding the MiMo counter-case). |
| TIDD-EC explicitly forbidden for MiMo | TIDD-EC produced output ~2.4x longer per run, breaking code-only contracts. Marking it "avoid" in the profile — and the index — propagates the finding to every future operator picking a framework for this model. |
| COSTAR/RACE tie documented as within noise | The 126/004 sample is 2 fixtures, single-sample per framework. Claiming a strict winner would misrepresent the evidence; both are safe and the profile says so explicitly. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `wc -l SKILL.md` | PASS — 199 LOC (under 200-LOC cap) |
| SKILL.md version field | PASS — `version: 0.2.0` |
| SKILL.md title | PASS — "Small-Model Prompt-Craft Hub" |
| `references/models/_index.md` exists | PASS — 8 active models indexed |
| `minimax-m3.md` 6-section template complete | PASS — all sections present (Identity, Framework, Evidence, Template, Gotchas, See Also) |
| `mimo-v2.5-pro.md` 6-section template complete | PASS — all sections present (Identity, Framework, Evidence, Template, Gotchas, See Also) |
| minimax-m3.md status label | PASS — `status: carried`; source benchmark named (120/003); fresh-run caveat documented |
| mimo-v2.5-pro.md status label | PASS — `status: empirical`; benchmark 126/004, 10 real runs, confidence high |
| Executor mechanics absent from profiles | PASS — binary flags, invocation wrappers, budgets not duplicated from cli-* |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **minimax-m3.md is carried, not empirical.** The framework contract (TIDD-EC + dense) was benchmarked on minimax-2.7, not M3. A fresh 7+ fixture benchmark on the M3-highspeed slug is needed before the status can be elevated to `empirical`.
2. **mimo-v2.5-pro.md sample size.** The 126/004 benchmark used 2 fixtures with single-sample per framework per fixture. The COSTAR/RACE tie is within noise; the TIDD-EC failure is consistent and reliable, but a larger fixture set would improve confidence in the COSTAR/RACE delta.
3. **Remaining 6 profiles are roadmap pointers.** The _index.md rows for minimax-2.7, swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, and glm-5.1 point to profile files that have not yet been authored; those are the subject of phase 005.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
