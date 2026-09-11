---
title: "Implementation Summary"
description: "Fifteen sequential research iterations across two models produced a decision-ready synthesis for goal unification, with every D1-D8 option ranked, cited and cross-verified."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/036-goal-unification/001-goal-unification-research"
    last_updated_at: "2026-09-11T07:11:47Z"
    last_updated_by: "claude-code"
    recent_action: "Closed the research phase with two lineages and a fresh-model synthesis"
    next_safe_action: "Author phase 002 ADRs from research/synthesis.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-system-spec-kit-goals"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-goal-unification-research |
| **Completed** | 2026-09-11 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Fifteen research iterations now back every goal-unification decision with resolving citations. Ten iterations on deepseek-v4.1-flash built the decision matrix, five on glm-5.3-flash verified and corrected it without overturning a chosen option, and a fresh Opus pass reconciled both into `research/synthesis.md` and `research/research.md`.

### Phase 1: goal-unification-research

Phase 002 can now freeze eight decisions without guessing. Each has a chosen option, rejected options with reasons, an enforcement site and a confidence label. The synthesis also names three contradictions the packet must resolve rather than inherit: devin is a build item not a wiring item, criterion 5 names resume as a writer while its whitelist is read-only, and criterion 1 asks three documents to agree on a budget none of them carries today.

Two live defects surfaced along the way. The injected objective preview keeps 576 characters, so 44 percent of this packet's own operator copy reaches the model. And the parent durable slice sat six characters under the 4000 cap after the D8 amendment, which is why the D6 recommendation moved to a two-tier rule with a warning at 3000.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/deep-research-strategy.md` | Created | Charter: eight angles, 15-row allocation, evidence discipline |
| `research/deep-research-fanout-config.run1.json`, `run2.json` | Created | One cli-pi lineage each: deepseek 10 iterations, glm 5 iterations |
| `research/lineages/deepseek/` | Created | Iterations 001-010, research.md, convergence report, ledgers |
| `research/lineages/glm/` | Created | Iterations 011-015, research.md with a 27-item correction register |
| `research/synthesis.md` | Created | Ranked verdicts D1-D8, contradictions, proposed AGENTS.md wording, build facts, unknowns |
| `research/research.md` | Created | Canonical merged synthesis with provenance |
| `research/findings-registry.json`, `fanout-attribution.md` | Created | Merged registry from `fanout-merge.cjs` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two detached runs of `fanout-run.cjs` with `--stop-policy max-iterations`, sequential by model, the second seeded through the research topic and gated on iteration 11 citing run 1 (it did, and corrected one citation). Iteration counts were read from each lineage's state ledger, not the run summary. The fresh-model synthesis opened every citation it repeated and reported three that did not resolve as printed, each with the resolving line.

Both driver runs reported the lineage as failed. The cause was write containment tripping on paths another session was editing at the time (`.opencode/skills/mcp-tooling/` during run 1, sk-design and `.pi/` files during run 2). The driver reverted those files into patches; both patches were re-applied immediately and the artifacts were complete, so the runs count as done on artifact evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Sequential runs, not parallel lineages | The operator wanted GLM to build on deepseek, so run 2 read run 1's synthesis before its first iteration |
| Count runs as done despite the driver verdict | Containment fired on another session's edits, not the lineage's; artifacts were complete and the reverts were undone |
| Fresh model for the synthesis | A third family arbitrates where the two lineages disagree instead of averaging them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iteration files on disk | PASS: 10 under deepseek, 5 under glm, both state ledgers end at their cap |
| Seed gate for run 2 | PASS: iteration 11 references run 1 23 times and corrects one citation |
| Citation spot checks | PASS: goal-core.cjs:191-193 and speckit-plan.yaml:141-152 resolve as cited; synthesis lists three that did not, with fixes |
| Containment patches re-applied | PASS: `git apply --check` then `git apply` on both patches, other session's files restored |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Host injection caps are unknown** for pi, cursor, devin, claude-code and codex. Only opencode's caps are in the repo. One oversized live session per runtime would settle it.
2. **The plugin import seam is untested.** Whether the ESM plugin can import a CommonJS slice module without a build step decides if D3 ships one module or two.
<!-- /ANCHOR:limitations -->

---


