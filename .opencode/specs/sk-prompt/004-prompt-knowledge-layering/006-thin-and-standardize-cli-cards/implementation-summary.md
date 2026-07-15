---
title: "Implementation Summary: Phase 6: Thin + standardize CLI cards"
description: "Five CLI prompt-quality cards thinned from 90-line inline duplicates to lean delegating mirrors. cli-devin semantic fork reconciled. Duplication guard passes GREEN on all 5 cards."
trigger_phrases:
  - "cli cards thinned"
  - "thin standardize cli"
  - "cli prompt card delegation"
  - "duplication guard cli"
  - "cli-devin fork reconciled"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/004-prompt-knowledge-layering/006-thin-and-standardize-cli-cards"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "sonnet-impl"
    recent_action: "Phase 6 complete"
    next_safe_action: "Proceed to phase 007: wire 3-tier precedence rule + sentinel cross-link into all 5 CLI SKILL.md"
    blockers: []
    key_files:
      - ".opencode/skills/cli-opencode/assets/prompt_quality_card.md"
      - ".opencode/skills/cli-gemini/assets/prompt_quality_card.md"
      - ".opencode/skills/cli-codex/assets/prompt_quality_card.md"
      - ".opencode/skills/cli-claude-code/assets/prompt_quality_card.md"
      - ".opencode/skills/cli-devin/assets/prompt_quality_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-006-thin-and-standardize-cli-cards"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "How to handle cli-devin STAR/BUILD/ATLAS mechanics? -> Reframed as Devin model-selection MECHANICS, kept as addendum, not CLEAR axes"
      - "Where does the 3-tier precedence rule live? -> Added to the canonical card; per-model note in each delegating mirror repoints to the hub"
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
| **Spec Folder** | 006-thin-and-standardize-cli-cards |
| **Completed** | 2026-06-02 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four CLI prompt-quality cards that each inlined the full framework table (ranging from 89 to 96 lines) were refactored into lean delegating mirrors that link to the canonical card for the framework table and CLEAR scoring, and point per-model override notes to the hub profiles. The result is a single source of truth for framework selection: sk-prompt owns the table; the CLI cards own only the per-executor dispatch mechanics. The duplication guard now passes GREEN across all five cards.

### CLI card thinning (cli-opencode, cli-gemini, cli-codex, cli-claude-code)

The four cards that inline-duplicated the framework table were each replaced with a delegating mirror. cli-opencode shrank from 96 to 37 lines, cli-gemini from 89 to 35, cli-codex from 90 to 28, and cli-claude-code from 90 to 44. Each mirror retains the executor-specific dispatch mechanics and cross-links to the canonical card for framework selection logic and CLEAR scoring. Per-model framework preferences are pointed at the hub profiles in sk-prompt-models.

### cli-devin semantic fork reconciliation (49 LOC)

cli-devin used STAR/BUILD/ATLAS as its prompt framework labels rather than COSTAR/TIDD-EC/RACE. These were reframed as Devin model-selection MECHANICS (which model to pick given a task type) rather than prompt-construction frameworks. The card now adopts the canonical CLEAR axes and framework table link. The permission-mode check was moved to a "not a CLEAR axis" addendum. The SWE-1.6 contract was delegated to its profile in the hub.

### 3-tier precedence rule + hub repoint

The 3-tier precedence rule (hub profile > card default > CLEAR baseline) was added to the canonical card in sk-prompt. Each delegating mirror's per-model note now repoints to the hub rather than embedding override text inline.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-opencode/assets/prompt_quality_card.md` | Modified | Thinned 96 -> 37 lines; delegating mirror linking canonical card + hub |
| `.opencode/skills/cli-gemini/assets/prompt_quality_card.md` | Modified | Thinned 89 -> 35 lines; delegating mirror |
| `.opencode/skills/cli-codex/assets/prompt_quality_card.md` | Modified | Thinned 90 -> 28 lines; delegating mirror |
| `.opencode/skills/cli-claude-code/assets/prompt_quality_card.md` | Modified | Thinned 90 -> 44 lines; delegating mirror |
| `.opencode/skills/cli-devin/assets/prompt_quality_card.md` | Modified | Reconciled semantic fork; STAR/BUILD/ATLAS reframed as model-selection mechanics; canonical CLEAR adopted |
| `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md` | Modified | Added 3-tier precedence rule; refreshed per-model note to point to hub |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each card was edited in place. After each edit the duplication guard was re-run to confirm the inline framework table was no longer present. Final verification ran the duplication guard across all 5 cards simultaneously, returning GREEN. The cli-devin reconciliation was validated by checking that STAR/BUILD/ATLAS no longer appeared as CLEAR-axis labels and that the SWE-1.6 contract reference resolved to the hub profile path.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delegating mirrors rather than card deletion | CLI skills need a local reference for executor dispatch mechanics; full deletion would leave executors with no guidance on prompt construction at point of use |
| Reframe STAR/BUILD/ATLAS as model-selection mechanics, not framework labels | The three tags describe which Devin task profile to invoke, not how to structure a prompt; conflating them with COSTAR/TIDD-EC caused confusion in downstream dispatch |
| 3-tier precedence rule on canonical card, not per mirror | The rule governs the whole system; keeping it in one place prevents divergence if the rule changes |
| SWE-1.6 contract delegated to hub profile | The hub is the canonical home for per-model prompt-craft contracts; the card is the wrong layer for model-specific token budgets and output verification rules |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Duplication guard: cli-opencode card | PASS — framework table absent, canonical link present |
| Duplication guard: cli-gemini card | PASS — framework table absent, canonical link present |
| Duplication guard: cli-codex card | PASS — framework table absent, canonical link present |
| Duplication guard: cli-claude-code card | PASS — framework table absent, canonical link present |
| Duplication guard: cli-devin card | PASS — STAR/BUILD/ATLAS reframed, CLEAR adopted, SWE-1.6 delegated |
| All 5 cards duplication guard sweep | GREEN |
| Line count reductions verified | cli-opencode 96->37, cli-gemini 89->35, cli-codex 90->28, cli-claude-code 90->44 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **cli-claude-code card at 44 lines** The claude-code card retained more lines than the others because its executor dispatch mechanics are more involved; further thinning is possible in a follow-on pass but was out of scope here.
2. **3-tier precedence rule not yet wired into CLI SKILL.md files** The rule lives on the canonical card but is not yet referenced from the SKILL.md for each CLI skill. That cross-link work is phase 007.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
