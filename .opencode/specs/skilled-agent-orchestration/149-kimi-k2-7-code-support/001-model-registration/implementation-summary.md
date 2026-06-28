---
title: "Implementation Summary: Phase 1: model-registration"
description: "Kimi K2.7 Code is now a first-class small model across cli-opencode and sk-prompt-models; kimi-k2.6 is retired in place."
trigger_phrases:
  - "kimi-k2.7-code"
  - "kimi-for-coding"
  - "model registration summary"
  - "kimi-for-coding/k2p7"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/149-kimi-k2-7-code-support/001-model-registration"
    last_updated_at: "2026-06-15T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Registered kimi-k2.7-code across 8 files; card-sync exit 0"
    next_safe_action: "Begin 002-framework-bakeoff prompt-framework bakeoff"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/assets/model-profiles.json"
      - ".opencode/skills/sk-prompt-models/references/models/kimi-k2.7-code.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-model-registration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 001-model-registration |
| **Completed** | 2026-06-15 |
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

Kimi K2.7 Code is now a first-class small model. You can dispatch it by slug (`kimi-for-coding/k2p7`) or by the bare `kimi` alias, and the skill advisor routes Kimi prompt-framework questions to the right skills. The older `kimi-k2.6` entry is retired in place so nothing that referenced it breaks and the card-sync guard stays green.

### Register kimi-k2.7-code across the small-model surfaces

You now get a complete registration: a model-profiles.json entry (context_length 262144, executor cli-opencode -> provider kimi-for-coding -> pool kimi-for-coding, a capability block with model_slug `kimi-for-coding/k2p7` plus `variant_status` accepted-unverified, and recommended_frameworks RCAF at default-unverified status), a 7-section prompt-craft profile, ACTIVE-table placement in `_index.md`, SKILL.md aliases and a §3 dispatch-matrix row, and routing graph metadata in both the sk-prompt-models and cli-opencode skills. The model is dispatchable, alias-resolvable, and advisor-routable.

### Retire kimi-k2.6 in place

`kimi-k2.6` moves to historical without disappearing. Its executor status and recommended_frameworks status flip to historical with notes pointing at kimi-k2.7-code (mirroring the existing minimax-2.7 retire precedent), its references profile gets a HISTORICAL banner, and it moves to the Historical table in `_index.md`. The profile and index row are kept on purpose so the card-sync completeness check still passes, and the bare `kimi` alias now resolves to kimi-k2.7-code.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-prompt-models/assets/model-profiles.json` | Modified | Added the `kimi-k2.7-code` entry; retired `kimi-k2.6` (status historical, notes -> kimi-k2.7-code); updated the registry description rotation line |
| `.opencode/skills/sk-prompt-models/references/models/kimi-k2.7-code.md` | Created | New 7-section prompt-craft profile (RCAF default-unverified, bakeoff pending) |
| `.opencode/skills/sk-prompt-models/references/models/kimi-k2.6.md` | Modified | Added a HISTORICAL banner (superseded by kimi-k2.7-code) |
| `.opencode/skills/sk-prompt-models/references/models/_index.md` | Modified | Moved kimi-k2.7-code to the ACTIVE table, kimi-k2.6 to the Historical table |
| `.opencode/skills/sk-prompt-models/SKILL.md` | Modified | Frontmatter, Keywords, activation + keyword triggers, MODEL_ALIASES (`kimi` -> kimi-k2.7-code, added kimi-k2.7 / kimi-for-coding / k2p7, kept kimi-k2.6), and §3 dispatch-matrix row |
| `.opencode/skills/sk-prompt-models/graph-metadata.json` | Modified | trigger_phrases + intent_signals + enhances-context for kimi-k2.7-code / kimi-for-coding |
| `.opencode/skills/cli-opencode/graph-metadata.json` | Modified | trigger_phrases + key_topics for kimi-k2.7-code / kimi-for-coding / kimi-for-coding/k2p7 |
| `.opencode/skills/cli-opencode/SKILL.md` | Modified | Added a Kimi For Coding line to the auth-login list and the `kimi-for-coding/k2p7` model to the Model Selection paragraph |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Delivered by following the canonical "Adopting a New Provider" checklist (pattern-index.md §4, steps 1-8); step 6 (fallback_target) was intentionally skipped because kimi-for-coding is a new dedicated pool with no same-pool fallback. Confidence came from four checks: a live smoke dispatch that returned "pong" at exit 0 with cost 0 on the subscription path, the card-sync guard at exit 0, clean JSON parses on every edited file, and an advisor re-index whose routing probe surfaced both skills.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Added `kimi-k2.7-code` as a new entry rather than editing k2.6 in place | The model runs on a different provider (`kimi-for-coding`) and gateway than k2.6, so a clean new entry keeps both honest |
| Retired k2.6 but kept its profile + index row | Card-sync CHECK 3 needs the registry/profile/index to stay complete; flipping status to historical mirrors the minimax-2.7 precedent without breaking the guard |
| Repointed the bare `kimi` alias to kimi-k2.7-code | The operator now runs Kimi via the coding-plan model, so the unqualified alias should resolve to the current model |
| Recorded RCAF and `--variant high` as default/accepted-unverified | The CLI accepts both, but their output quality is not yet measured; the bakeoff in phase 2 will set the evidence-backed defaults |
| Skipped checklist step 6 (fallback_target) | kimi-for-coding is a new dedicated pool with no same-pool fallback to point at |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| Card-sync guard (`check-prompt-quality-card-sync.sh .`) | PASS, exit 0 (CHECK 1 tables-not-inlined, CHECK 2 tier-3 pointer-only, CHECK 3 registry/profile/_index complete, CHECK 4 discoverability) |
| Live smoke dispatch (`opencode run --model kimi-for-coding/k2p7 ... "Reply with exactly one word: pong"`) | PASS, returned "pong", exit 0, cost 0 (subscription/Token-Plan path) |
| JSON parse (node JSON.parse on all edited JSON) | PASS, all edited JSON files parse clean |
| Advisor routing probe ("what prompt framework ... for kimi-k2.7-code via cli-opencode") | PASS, surfaces sk-prompt-models (conf 0.94) + cli-opencode (0.90) |
| Live model facts (`opencode models kimi-for-coding`, 2026-06-15) | PASS, slug kimi-for-coding/k2p7, context 262144, output 32768; `--variant high` accepted (exit 0), effect benchmark-unverified |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Best prompt framework is unverified.** RCAF is recorded as the default at `default-unverified` status. The empirical winner is decided by the phase 2 bakeoff (`002-framework-bakeoff`) and folded in by phase 3 (`003-promote-results`).
2. **`--variant high` effect is unmeasured.** The CLI accepts the variant (exit 0), but whether it improves output quality is benchmark-unverified; it is recorded as `accepted-unverified` until the bakeoff.
3. **Smoke test is a liveness check, not a quality check.** The "pong" dispatch proves the slug dispatches and bills correctly; it says nothing about coding-task quality.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

