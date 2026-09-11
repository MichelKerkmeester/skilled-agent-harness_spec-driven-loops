---
title: "Implementation Summary"
description: "Ten DeepSeek iterations settled the commit grammar question with measurements: keep the subject, put the address in a final trailer block, retrofit through a mapping cascade and a mirror rewrite."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/028-crawlable-commit-history/001-research"
    last_updated_at: "2026-09-11T10:30:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the research phase with a verified synthesis"
    next_safe_action: "Open phase 002 and draft the decision record from research/research.md section 3"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/lineages/deepseek/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-skgit-028"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-research |
| **Completed** | 2026-09-11 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The question "how do commits become addressable like packets" now has a measured answer instead of an opinion. Ten iterations on one DeepSeek V4.1 Flash lineage read the hook, the skill and 9,112 commits, and every number that matters was re-measured by the conductor before it entered the synthesis.

### Phase 1: research

You get a grammar candidate the current hook already accepts, an identifier that survives rebase and rewrite, a retrofit cascade that maps two thirds of history to a packet by rule, and a rewrite runbook with its blast radius and rollback written out. You also get ten ranked contract decisions, which is what phase 002 exists to take.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/dispatch-prompt.md` | Created | The ten-angle brief with the measured facts and three non-negotiables |
| `research/lineages/deepseek/` | Created by the runner | Ten iteration files, state log, deltas, strategy, findings registry, the lineage synthesis |
| `research/research.md` | Created | The conductor's reduction: verification table, supported design, ranked recommendations |
| `plan.md`, `tasks.md`, `acceptance-criteria.md` | Modified | Filled from scaffold and closed with evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The lineage ran detached through `fanout-run.cjs` with cli-pi, `deepseek-v4.1-flash` at max thinking, ten iterations and stop policy max-iterations. It finished in 37 minutes. The conductor opened citations from the first three iterations, then re-ran six measurements: trailer extraction counts for `Refs:` and `Spec:`, the packet query, the hook on a trailer-block message and on a numeric scope, the signed-commit count and the prefix-collision count. All matched.

One thing went wrong and is recorded so it does not repeat. The conductor edited this phase's planning documents while the lineage was live. The runner's write containment attributed those edits to the lineage, reverted them and marked the run failed, after the synthesis had already completed. The research artifacts were untouched. The planning documents were re-authored afterwards.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One lineage at forced depth rather than two models | The operator named one model and ten iterations. A second lens belongs to phase 002, where a judgment is taken. |
| Brief points at files and commands, not at an answer | A brief that carries a preferred conclusion gets it back restated. This one got corrections to its own numbers instead. |
| Conductor re-measures before trusting | A delegate's confidence says nothing about accuracy. Six claims re-run, all confirmed. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Ten iteration files in the lineage | PASS, iteration-001.md to iteration-010.md |
| State log carries synthesis_complete with stopReason maxIterationsReached | PASS, 16 records |
| Citations in iterations 1 to 3 resolve | PASS, SKILL.md:405, commit-msg:72, global hooks path |
| Six measurements re-run by the conductor | PASS, see research/research.md section 1 |
| Lineage wrote nothing outside research/ | PASS, git status after the run |
| validate.sh 001-research --strict | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One model's opinion.** The factual claims are verified. The design judgment is one lens. Phase 002 adds a second before the operator decides.
2. **GitHub search behavior is unverified.** The run was offline by rule. The claim that a hyphen-only token is matched whole is local knowledge and is marked as such in iteration 3.
3. **Counts drift.** The branch moved by six commits during the run. Every retrofit number must be re-derived at execution time from a pinned SHA.
<!-- /ANCHOR:limitations -->

---
