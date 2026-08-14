---
title: "Implementation Summary"
description: "cli-cursor and cli-devin can now dispatch GPT-5.6 Luna Max, cli-devin can dispatch the DeepSeek V4 max tiers, and the opencode-go catalog documents GLM 5.3 — all live-verified, additive, and doc-consistent."
trigger_phrases:
  - "luna max roster summary"
  - "deepseek max glm 5.3 summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/043-luna-max-deepseek-max-glm-roster"
    last_updated_at: "2026-08-14T11:37:36Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped all roster additions + honesty sweep; deep-loop vitest 190/190 green"
    next_safe_action: "Packet complete; optional follow-up is dispatch-testing the list-verified ids"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-043-luna-max-deepseek-max-glm-roster"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 043-luna-max-deepseek-max-glm-roster |
| **Completed** | 2026-08-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now dispatch four more models across the external-CLI orchestration modes, each one confirmed present in the live CLI listing before it was added. Grok 4.6 at all thinking levels, which the request also named, was already shipped in packet 036, so this packet verified that and added nothing there.

### GPT-5.6 Luna Max on cli-cursor and cli-devin
`gpt-5.6-luna-max` and `gpt-5.6-luna-max-fast` join the enforced Cursor allowlist; `gpt-5-6-luna-max` and `gpt-5-6-luna-max-priority` join the enforced Devin allowlist. These are the first GPT-5.6 persona ids in either curated scope. On Devin the Fast speed tier is the `-priority` suffix, not `-fast`, so a dispatch that wants Fast picks `gpt-5-6-luna-max-priority`.

### DeepSeek V4 Max tiers on cli-devin
`deepseek-v4-pro-max` and `deepseek-v4-flash-max` join the Devin allowlist. Only the Max tier was requested, so the `-low` and `-high` tiers Devin also exposes stay out.

### GLM 5.3 on cli-opencode
The opencode-go catalog now documents `opencode-go/glm-5.3`. This one is documentation only: cli-opencode has no code-enforced allowlist, so the model was already dispatchable and the gap was purely in the catalog.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `executor-config.ts` | Modified | `CURSOR_SUPPORTED_MODELS` +2, `DEVIN_SUPPORTED_MODELS` +4, sorted; honest comments |
| `fanout-run.cjs` | Modified | `CURSOR_ALLOWED_MODELS` / `DEVIN_ALLOWED_MODELS` mirrors kept byte-identical |
| `executor-config.vitest.ts`, `fanout-run.vitest.ts` | Modified | Cursor +2, Devin +4 fixtures; cursor 18→20 assertion |
| `cli-cursor/**` (SKILL, README, 4 references, prompt-templates, playbook, providers, changelog) | Modified | Roster rows + count 18→20 honesty sweep + changelog v1.4.0.0 |
| `cli-devin/**` (SKILL, README, cli-reference, providers, changelog) | Modified | +4 rows + 4→5 families sweep + changelog v1.4.0.0 |
| `cli-opencode/providers-and-models.md`, `changelog/v1.4.2.0.md`, SKILL | Modified | opencode-go +glm-5.3 row + changelog |
| `cli-external-orchestration/changelog/v1.4.0.0.md` | Created | Hub-level roll-up changelog for the three-mode roster expansion |
| `system-deep-loop/changelog/v2.2.0.0.md` | Created | Runtime changelog for the executor-config + fanout-run allowlist additions |
| `shared/references/smart-routing.md` | Modified | Devin roster mention adds GPT-5.6 Luna Max |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every id was list-verified against the live `cursor-agent --list-models`, `devin models list`, and `opencode models opencode-go` output on 2026-08-14 before any file changed, so no id was fabricated. The two hand-synced enforcement points were edited together and their cross-check tests confirm they stay identical. The deep-loop unit suite ran green twice: once after the code and test edits, and again as final-state proof (Test Files 3 passed, Tests 190 passed). A residual grep sweep across the whole hub tree confirmed no stale "18" count or "four families" claim survived.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| List-verified, not dispatch-tested | Operator chose to trust the live listings and skip the per-id external API spend that packets 033/036 paid; the comments say so honestly rather than claiming a test that did not run |
| DeepSeek max tier only | The request said "max thinking levels", so only `-max` was added; the other tiers can follow additively later |
| Corrected two pre-existing stale "10" counts | SKILL.md and cli-reference.md still said "10 allowed ids" from before packet 036 grew the roster to 18; fixed to the current 20 since they are the same class of claim |
| Dropped decision-record.md | Level 2 does not require it; the decisions live in spec.md answered_questions and this table |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deep-loop vitest (executor-config, fanout-run, combo-matrix) | PASS - Test Files 3 passed, Tests 190 passed (2026-08-14) |
| `tsc --noEmit` | PASS for changed files - only a pre-existing tsconfig TS5107 (`moduleResolution=node10`) deprecation surfaces |
| Residual-count grep (`18-id`/`four families`/`10 allowed`, non-changelog) | PASS - empty |
| New ids present in canonical rosters | PASS - cursor 4 hits, devin 6 hits, opencode 1 hit |
| Live listings 2026-08-14 | PASS - every added id printed verbatim |
| `validate.sh --strict` | Errors: 0. Two benign warnings remain (EVIDENCE_CITED on planning-doc checkboxes; DESCRIPTION_SHAPE on the tool-generated description.json) - both endemic across the track (the shipped 036 sibling currently carries 7 errors + 3 warnings) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Ids are list-verified, not dispatch-tested.** If a later dispatch reveals an id that lists but does not resolve, that is a follow-up, not a regression of this packet's stated evidence.
2. **No Luna prompt-craft profile.** `sk-prompt-models/model-profiles.json` gains no Luna entry; a Luna dispatch inherits the closest existing persona profile, consistent with packet 033's flash-profile deferral.
3. **DeepSeek `-low`/`-high` tiers not added.** Only the Max tier was in scope; the other tiers can be added additively if requested.
<!-- /ANCHOR:limitations -->
