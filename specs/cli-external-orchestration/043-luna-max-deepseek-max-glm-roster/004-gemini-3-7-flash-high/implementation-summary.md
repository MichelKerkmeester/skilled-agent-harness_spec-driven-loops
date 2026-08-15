---
title: "Implementation Summary: Gemini 3.7 Flash High Dispatch Support (cli-cursor + cli-devin)"
description: "cli-cursor and cli-devin can now dispatch Gemini 3.7 Flash High — the first Gemini id in either curated scope — list-verified AND dispatch-tested end-to-end on 2026-08-15."
trigger_phrases:
  - "gemini 3.7 flash high summary"
  - "gemini phase 004 summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/043-luna-max-deepseek-max-glm-roster/004-gemini-3-7-flash-high"
    last_updated_at: "2026-08-15T12:00:00Z"
    last_updated_by: "pi"
    recent_action: "Shipped Gemini 3.7 Flash High to both allowlists; dispatch-tested"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-043-phase-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Gemini 3.7 Flash High Dispatch Support (cli-cursor + cli-devin)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-gemini-3-7-flash-high |
| **Completed** | 2026-08-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Gemini 3.7 Flash High is now dispatchable on both external-CLI modes — the first Gemini id in either curated scope, and the first roster addition in this program that was dispatch-tested end-to-end rather than list-verified only.

### On cli-cursor
`gemini-3.7-flash-high` joins `CURSOR_SUPPORTED_MODELS` (20 → 21 ids). Cursor's live listing displays it as "Gemini 3.7 Flash" — the High tier lives in the id suffix, and the low/medium sibling tiers stay out of scope.

### On cli-devin
`gemini-3-7-flash-high` joins `DEVIN_SUPPORTED_MODELS` (23 → 24 uids), growing the curated scope from five families to six. Devin labels it "Gemini 3.7 Flash High" with a 1M context window; the minimal/low/medium sibling tiers stay out of scope.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `executor-config.ts` | Modified | `CURSOR_SUPPORTED_MODELS` +1, `DEVIN_SUPPORTED_MODELS` +1, sorted; honest dispatch-tested comments |
| `fanout-run.cjs` | Modified | `CURSOR_ALLOWED_MODELS` / `DEVIN_ALLOWED_MODELS` mirrors kept byte-identical |
| `executor-config.vitest.ts`, `fanout-run.vitest.ts` | Modified | Cursor +1, Devin +1 fixtures; negatives for sibling tiers |
| `cli-cursor/**` (SKILL, README, references, prompt-templates, playbook, providers, changelog) | Modified | Roster row + count 20→21 sweep + out-of-scope wording + changelog v1.4.1.0 |
| `cli-devin/**` (SKILL, README, cli-reference, providers, changelog) | Modified | Gemini row + 5→6 families sweep + changelog v1.4.1.0 |
| `cli-external-orchestration/changelog/v1.4.1.0.md`, `system-deep-loop/changelog/v2.2.1.0.md` | Created | Hub + runtime changelogs |
| `shared/references/smart-routing.md` | Modified | Devin roster mention adds Gemini |
| `004-gemini-3-7-flash-high/evidence/` | Created | Live listings + dispatch receipts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every id was list-verified against the live `cursor-agent --list-models` and `devin models list` output on 2026-08-15 before any file changed — no id was fabricated. Then, per operator decision, both ids were dispatch-tested end-to-end: `cursor-agent -p --model gemini-3.7-flash-high` and `devin -p --model gemini-3-7-flash-high` each returned a live model response (exit 0, marker echoed, empty stderr); the receipts are on file in `evidence/`. The two hand-synced enforcement points were edited together and their cross-check tests confirm they stay identical. The deep-loop unit suite ran green (Test Files 3 passed, Tests 190 passed) as final-state proof. A residual grep sweep confirmed no stale count, family, or "Gemini out of scope" claim survived.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| High tier only | Operator chose the literal request scope; the low/medium/minimal sibling tiers can follow additively later |
| Dispatch-tested, not just list-verified | Operator chose the stronger evidence level for this phase, reversing the 2026-08-14 list-verified-only precedent; the comments and docs claim exactly what ran |
| Cursor display-name footgun documented | "Gemini 3.7 Flash" display vs `-high` id suffix could mislead readers into thinking the tiered id is absent |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deep-loop vitest (executor-config, fanout-run, combo-matrix) | PASS - Test Files 3 passed, Tests 190 passed (2026-08-15) |
| `tsc --noEmit` | PASS for changed files - only a pre-existing tsconfig TS5107 deprecation surfaces |
| Live listings 2026-08-15 | PASS - both ids printed verbatim (`evidence/live-listings.txt`) |
| Dispatch probes 2026-08-15 | PASS - cursor exit 0 stdout `GEMINI37-CURSOR-OK`; devin exit 0 stdout `GEMINI37-DEVIN-OK`; empty stderr both |
| Residual grep (`20-id`/`20 ids`/`five families`/`Claude / Gemini / Kimi`, non-changelog) | PASS - empty |
| New ids present in canonical rosters | PASS - cursor 1 hit, devin 1 hit |
| `validate.sh --strict` (phase 004) + `--recursive --strict` (parent) | PASS - Errors 0, Warnings 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Probe prompts were trivial marker echoes.** The dispatch tests prove dispatchability and live model resolution, not task-quality; real-task behavior was not exercised.
2. **No Gemini prompt-craft profile.** `sk-prompt-models/model-profiles.json` gains no Gemini entry; a Gemini dispatch inherits the closest existing persona profile, consistent with the 033/043 deferrals.
3. **Sibling tiers not added.** Only High was in scope; the other Gemini 3.7 Flash tiers can be added additively if requested.
<!-- /ANCHOR:limitations -->
