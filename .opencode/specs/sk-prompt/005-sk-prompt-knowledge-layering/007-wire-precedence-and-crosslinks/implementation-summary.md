---
title: "Implementation Summary: Phase 7 — Wire precedence + crosslinks"
description: "Inserted a uniform 3-tier prompt-composition precedence block into all 5 cli-* SKILL.md files, reconciled cli-devin's bespoke compose mandate, refreshed the canonical card's Mirror Sync section, and repointed pattern-index.md to hub profiles."
trigger_phrases:
  - "wire precedence"
  - "crosslinks"
  - "3-tier prompt composition"
  - "cli-* precedence block"
  - "sk-prompt-models hub crosslink"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/005-sk-prompt-knowledge-layering/007-wire-precedence-and-crosslinks"
    last_updated_at: "2026-06-02T18:04:15Z"
    last_updated_by: "agent"
    recent_action: "Phase 7 complete: 3-tier block in all 5 cli-* SKILL.md; hub card + pattern-index refreshed"
    next_safe_action: "Proceed to phase 008-validate-sweep-changelog-reindex"
    blockers: []
    key_files:
      - ".opencode/skills/cli-devin/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-gemini/SKILL.md"
      - ".opencode/skills/sk-prompt-models/references/pattern-index.md"
      - ".opencode/skills/sk-prompt-models/SKILL.md"
    session_dedup:
      fingerprint: "sha256:38fe68bc403651b05e50bebfeb0c4b0a661aede11c5927a95189818c2d58772d"
      session_id: "007-wire-precedence-and-crosslinks-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "How should cli-devin's bespoke compose mandate coexist with the 3-tier rule? Reconciled: honor the swe-1.6 profile + the 3-tier rule."
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
| **Spec Folder** | 007-wire-precedence-and-crosslinks |
| **Completed** | 2026-06-02 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 5 cli-* SKILL.md files now carry an identical 3-tier prompt-composition precedence block that enforces a consistent decision order — fast path first, model override in tier 2 (pointing back to the sk-prompt-models hub), deep path last. Before this phase, each CLI skill defined composition guidance independently, making it impossible for a caller to predict which rule prevailed when two tiers both matched. Now every consumer reads the same three-tier cascade.

### 3-tier Precedence Block in All 5 CLI Skills

The block defines: (1) fast path — use the model's native syntax when no hub profile exists; (2) model override — consult the sk-prompt-models hub profile for any model with a registered entry; (3) deep path — compose via sk-prompt frameworks when richness is required. All 5 files — cli-devin, cli-opencode, cli-claude-code, cli-codex, cli-gemini — received the same block, verbatim, to prevent tier-order drift.

### cli-devin Mandate Reconciliation

cli-devin carried a bespoke "MUST be composed through sk-prompt" requirement in both `SKILL.md` and `prompt_templates.md`. That mandate was narrowed and reconciled: the new wording honors the swe-1.6 profile in the hub AND observes the 3-tier rule, so the two constraints no longer conflict. The stronger mandate (`sk-prompt` always) now yields to the hub profile when one exists.

### Canonical Card Mirror Sync Refresh

The sk-prompt-models SKILL.md canonical card had a stale "Mirror Sync" section that described a sync process that no longer existed. It was replaced with a duplication-guard description explaining that the hub profile is the single source of truth and cli-* skills must not maintain local copies.

### pattern-index.md Repoints

The MiniMax and MiMo rows in `sk-prompt-models/references/pattern-index.md` previously pointed to framework-level notes inside individual cli-* skill trees. They now point to the hub profiles (`references/models/minimax-2.7.md`, `references/models/minimax-m3.md`, and `references/models/mimo-v2.5-pro.md`). The cli-opencode ownership cell was updated from a generic "framework guidance" description to "craft-vs-mechanics" to reflect that cli-opencode owns executor mechanics while sk-prompt-models owns the prompt craft for each model.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-devin/SKILL.md` | Modified | Inserted 3-tier precedence block; reconciled bespoke compose mandate to honor swe-1.6 profile + 3-tier rule |
| `.opencode/skills/cli-opencode/SKILL.md` | Modified | Inserted 3-tier precedence block; updated ownership cell description to craft-vs-mechanics |
| `.opencode/skills/cli-claude-code/SKILL.md` | Modified | Inserted 3-tier precedence block with sk-prompt-models tier 2 reference |
| `.opencode/skills/cli-codex/SKILL.md` | Modified | Inserted 3-tier precedence block with sk-prompt-models tier 2 reference |
| `.opencode/skills/cli-gemini/SKILL.md` | Modified | Inserted 3-tier precedence block with sk-prompt-models tier 2 reference |
| `.opencode/skills/cli-devin/references/prompt_templates.md` | Modified | Reconciled bespoke compose mandate to align with 3-tier rule |
| `.opencode/skills/sk-prompt-models/SKILL.md` | Modified | Replaced stale Mirror Sync section with duplication-guard description |
| `.opencode/skills/sk-prompt-models/references/pattern-index.md` | Modified | Repointed MiniMax and MiMo rows to hub profiles; updated cli-opencode ownership cell to craft-vs-mechanics |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each cli-* SKILL.md was read before editing to capture the exact insertion point. The 3-tier block was inserted once per file; no file was edited twice. cli-devin's `prompt_templates.md` was read alongside `SKILL.md` to ensure the mandate reconciliation covered both surfaces. After all edits, the canonical card and pattern-index changes were applied and the validate.sh strict pass was run to confirm structural integrity.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Identical verbatim block in all 5 cli-* files | Prevents per-file tier-order drift; a single diff is sufficient to detect any future desync |
| Narrow cli-devin mandate rather than remove it | The swe-1.6 profile-awareness requirement is still correct — it just must not override the hub profile when one exists |
| Replace Mirror Sync with duplication-guard description | Mirror Sync described a dead process; duplication-guard explains the actual invariant callers must observe |
| Repoint pattern-index rows to hub profiles, not cli-* trees | Hub profiles are the canonical source; pointing elsewhere would recreate the split-brain that this phase was designed to eliminate |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| validate.sh --strict on 007 folder | PASS — exit 0 |
| All 5 cli-* SKILL.md contain 3-tier block | PASS — verified by read after edit |
| cli-devin mandate language consistent in SKILL.md + prompt_templates.md | PASS |
| pattern-index.md MiniMax and MiMo rows point to hub profiles | PASS |
| sk-prompt-models canonical card no longer contains Mirror Sync section | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No automated drift detection** The 3-tier block must remain identical across all 5 cli-* files. There is no CI check enforcing this yet — a future grep-based lint step would catch accidental divergence.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
