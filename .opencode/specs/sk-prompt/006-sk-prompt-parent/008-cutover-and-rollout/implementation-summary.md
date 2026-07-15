---
title: "Implementation Summary: Phase 8 cutover-and-rollout"
description: "sk-prompt clears the terminal gate: parent-skill-check.cjs STRICT passes with zero warnings, the whole 8-phase packet validates recursively at 0 errors/0 warnings, stale-reference sweeps are clean, and the parent packet is rolled up complete."
trigger_phrases:
  - "sk-prompt cutover complete"
  - "fifth canon-clean parent hub"
  - "006-sk-prompt-parent complete"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-prompt/006-sk-prompt-parent/008-cutover-and-rollout"
    last_updated_at: "2026-07-09T18:15:00Z"
    last_updated_by: "claude"
    recent_action: "Filled implementation-summary.md with the terminal-gate evidence"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/"
      - ".opencode/specs/sk-prompt/006-sk-prompt-parent/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "006-sk-prompt-parent-008-cutover-and-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "sk-prompt is the fifth canon-clean parent hub, beside sk-code/sk-design/system-deep-loop/sk-doc"
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
| **Spec Folder** | 008-cutover-and-rollout |
| **Completed** | 2026-07-09 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`sk-prompt` now stands as the fifth canon-clean parent hub in this repo, beside `sk-code`, `sk-design`, `system-deep-loop`, and `sk-doc`. This phase is the terminal gate: it doesn't add behavior, it proves the 7-phase fold-in (research, decision, scaffold, onboard-prompt-improve, foldin-prompt-models, advisor-integration, routing-benchmark) actually landed clean, then rolls up the parent packet to complete.

### Strict parent-hub check

`PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-prompt` passes every hard invariant (1a through 9b) with 0 warnings — exactly one `graph-metadata.json`, both modes carry the full canon discriminator set, `hub-router.json`'s base three outcomes and vocabulary classes all resolve, `description.json` is present with no registry-owned duplicate keys, and both the hub-level `manual_testing_playbook/` and `benchmark/` companion directories (added in phase 005 as a retroactive gap-fix) are in place.

### Recursive strict spec validation

`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-prompt/006-sk-prompt-parent --recursive --strict` returns `Errors: 0  Warnings: 0` for the parent and all 8 phase children — the whole program's documentation is internally consistent, evidence-cited, and free of scaffold placeholders.

### Stale-reference sweep

Two filtered greps across the live (non-spec, non-changelog, non-archive) tree confirm zero live references remain to the old flat `sk-prompt-models/` skill path or to a pre-fold `sk-prompt/SKILL.md` reading. The only `sk-prompt/SKILL.md` hits outside `sk-prompt/`'s own tree are two `system-skill-advisor` playbook scenario files that list real filesystem corpus snapshots — both correctly show the post-fold tree (`sk-prompt/prompt-models/SKILL.md` and `sk-prompt/SKILL.md` as separate, real entries), so they needed no fix.

### Parent metadata rollup

The parent's `spec.md` Status moved to Complete, its phase-map table marks all 8 phases Complete, and its three previously-open questions are marked resolved inline with a pointer to the deciding ADR or phase. `graph-metadata.json`'s `derived.status` was set to `"complete"` and `derived.last_active_child_id` to `"sk-prompt/006-sk-prompt-parent/008-cutover-and-rollout"` — set directly rather than via `backfill-graph-metadata.js`, because phase parents (the lean spec.md-only trio) have no `implementation-summary.md` for that script's status-deriver to read, so it only preserves an existing value rather than computing one from children. This is the doctrine's expected phase-parent rollup path, not a workaround.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/specs/sk-prompt/006-sk-prompt-parent/spec.md` | Modified | Status → Complete, phase table → all Complete, open questions marked resolved with pointers to the deciding phase. |
| `.opencode/specs/sk-prompt/006-sk-prompt-parent/description.json` | Modified | Regenerated from the updated parent `spec.md`. |
| `.opencode/specs/sk-prompt/006-sk-prompt-parent/graph-metadata.json` | Modified | `derived.status` → `"complete"`, `derived.last_active_child_id` → phase 008, `derived.last_active_at` stamped. |
| `008-cutover-and-rollout/spec.md`, `plan.md`, `tasks.md` | Modified | Level corrected 2→1 (matching the actual Level-1 file set), all tasks/checkboxes marked complete with command evidence. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Ran the two terminal gates (`parent-skill-check.cjs` STRICT, `validate.sh --recursive --strict`) and both stale-reference sweeps first, confirmed all four were clean, and only then edited parent metadata — never rolled up completion ahead of evidence. Each gate was re-run once more after the metadata rollup to confirm the edit itself didn't introduce drift.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the parent's `spec.md` Level field 2→1 rather than add a `checklist.md` | The actual file set (`spec.md`+`plan.md`+`tasks.md`+`implementation-summary.md`, all carrying `SPECKIT_LEVEL: 1` markers) is Level 1; the metadata table's "2" was a drafting-time inconsistency from the original GPT-5.5 scaffold, the same class of bug already fixed once in phase 007. Adding a checklist to match a wrong number would have been backwards. |
| Set `graph-metadata.json`'s `derived.status`/`last_active_child_id` by direct edit, not by re-running `backfill-graph-metadata.js` | Traced the actual deriver logic (`graph-metadata-parser.ts` `deriveStatus()`): for phase parents with no `implementation-summary.md`, it explicitly preserves the existing value rather than computing one from children — by design, not a bug. A direct edit of these two fields is the documented, doctrine-correct rollup path for the phase-parent lean trio. |
| Gate the rollup strictly behind clean evidence, not optimistic completion | Matches the phase's own REQ-004 acceptance criteria and the repo's "no completion claims without verification" standing rule — the metadata edit happened only after both terminal checks and both sweeps were independently confirmed clean. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-prompt` | PASS — all invariants 1a-9b, 0 warnings. |
| `bash .../validate.sh .../006-sk-prompt-parent --recursive --strict` | PASS — parent + all 8 phase children, `Errors: 0  Warnings: 0` each. |
| Stale-reference sweep: live `sk-prompt-models/` hits outside specs/changelog/archive/benchmarks | PASS — 0 hits. |
| Stale-reference sweep: live `sk-prompt/SKILL.md` hits outside `sk-prompt/`'s own tree | PASS — 0 stale hits (2 corpus-listing playbook scenarios correctly reference the post-fold tree, no fix needed). |
| Post-rollup re-run of both terminal gates | PASS — unchanged results after the `graph-metadata.json` edit. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No `checklist.md` exists for this phase.** The phase is genuinely Level 1 (corrected from a drafting-time "2"), and Level 1 does not require one — see Key Decisions.
2. **A follow-on canon-hardening tail is expected but not pre-scoped.** Every precedent hub (`sk-code` 9→28 phases, `sk-doc` 17→24) grew substantially after its MVP arc. This program scoped the core 8-phase conversion only; any future hardening opens as a new, separately-numbered packet.
3. **D1-inter and D4 benchmark dimensions remain unscored** (carried over from phase 007). Running the optional live `cli-opencode` true-verdict dispatch would close this, and is not required for the hub to be canon-clean.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
