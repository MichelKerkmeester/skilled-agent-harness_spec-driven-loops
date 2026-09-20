---
title: "Implementation Summary: GPT-5.6 Luna Max Dispatch Support (cli-cursor + cli-devin)"
description: "cli-cursor and cli-devin can now dispatch GPT-5.6 Luna Max — the first GPT-5.6 persona in either curated scope — live-verified, additive, and doc-consistent."
trigger_phrases:
  - "luna max roster summary"
  - "luna max phase 001 summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/043-roster-update-luna-deepseek-glm-gemini/001-gpt-5-6-luna-max"
    last_updated_at: "2026-08-15T13:00:00Z"
    last_updated_by: "pi"
    recent_action: "Shipped Luna Max roster additions + honesty sweep; deep-loop vitest 190/190 green"
    next_safe_action: "None; phase complete. Optional follow-up is dispatch-testing the list-verified ids"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-043-roster-update-luna-deepseek-glm-gemini"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: GPT-5.6 Luna Max Dispatch Support (cli-cursor + cli-devin)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-gpt-5-6-luna-max |
| **Completed** | 2026-08-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

GPT-5.6 Luna Max is now dispatchable on both external-CLI modes, each id confirmed present in the live CLI listing before it was added. This phase shipped inside the combined 2026-08-14 roster change (phases 001 + 002 together); this summary scopes the Luna Max portion.

### On cli-cursor
`gpt-5.6-luna-max` and `gpt-5.6-luna-max-fast` join `CURSOR_SUPPORTED_MODELS` — the first GPT-5.6 persona ids in the curated Cursor scope.

### On cli-devin
`gpt-5-6-luna-max` and `gpt-5-6-luna-max-priority` join `DEVIN_SUPPORTED_MODELS`. Devin's Fast speed tier is the `-priority` suffix, not `-fast`, so a dispatch that wants Fast picks `gpt-5-6-luna-max-priority`.

### Files Changed (Luna Max portion)

| File | Action | Purpose |
|------|--------|---------|
| `executor-config.ts` | Modified | `CURSOR_SUPPORTED_MODELS` +2, `DEVIN_SUPPORTED_MODELS` +2 luna uids, sorted; honest comments |
| `fanout-run.cjs` | Modified | `CURSOR_ALLOWED_MODELS` / `DEVIN_ALLOWED_MODELS` mirrors kept byte-identical |
| `executor-config.vitest.ts`, `fanout-run.vitest.ts` | Modified | Cursor +2, Devin +2 luna fixtures; cursor count assertion updated |
| `cli-cursor/**` (SKILL, README, references, prompt-templates, playbook, providers, changelog) | Modified | Roster rows + count honesty sweep + changelog v1.4.0.0 |
| `cli-devin/**` (SKILL, README, cli-reference, providers, changelog) | Modified | Luna rows + family list gains GPT-5.6 + changelog v1.4.0.0 |
| `shared/references/smart-routing.md` | Modified | Devin roster mention adds GPT-5.6 Luna Max |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every id was list-verified against the live `cursor-agent --list-models` and `devin models list` output on 2026-08-14 before any file changed — no id was fabricated. The two hand-synced enforcement points were edited together and their cross-check tests confirm they stay identical. The deep-loop unit suite ran green (Test Files 3 passed, Tests 190 passed) as final-state proof. A residual grep sweep confirmed no stale count or family-list claim survived.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| List-verified, not dispatch-tested | Operator chose to trust the live listings and skip the per-id external API spend; the comments say so honestly rather than claiming a test that did not run |
| Max tier only | The request said "max thinking levels", so only the Max tier was added; the other tiers can follow additively later |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deep-loop vitest (executor-config, fanout-run, combo-matrix) | PASS - Test Files 3 passed, Tests 190 passed (2026-08-14) |
| `tsc --noEmit` | PASS for changed files - only a pre-existing tsconfig TS5107 deprecation surfaces |
| Residual-count grep (non-changelog) | PASS - empty |
| New ids present in canonical rosters | PASS - cursor 2 hits, devin 2 hits |
| Live listings 2026-08-14 | PASS - every added id printed verbatim |
| `validate.sh --strict` | Errors: 0; two endemic benign warnings (EVIDENCE_CITED, DESCRIPTION_SHAPE) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Ids are list-verified, not dispatch-tested.** If a later dispatch reveals an id that lists but does not resolve, that is a follow-up, not a regression of this phase's stated evidence.
2. **No Luna prompt-craft profile.** `sk-prompt-models/model-profiles.json` gains no Luna entry; a Luna dispatch inherits the closest existing persona profile, consistent with packet 033's flash-profile deferral.
<!-- /ANCHOR:limitations -->
