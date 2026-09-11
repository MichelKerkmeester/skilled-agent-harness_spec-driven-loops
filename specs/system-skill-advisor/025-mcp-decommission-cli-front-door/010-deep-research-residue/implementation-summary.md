---
title: "Implementation Summary"
description: "Five research iterations on what a transport removal teaches: the fallback-only failure class, eight classes of residue and which instrument finds each, and a checklist ordered so each step fails cheaply."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/025-mcp-decommission-cli-front-door/010-deep-research-residue"
    last_updated_at: "2026-09-11T18:01:53Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the research loop's run and its synthesis"
    next_safe_action: "Act on the eight record defects the study found"
    blockers: []
    key_files:
      - "research/lineages/deepseek-research/research.md"
      - "prompts/research-target.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-025-advisor-mcp-decommission"
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
| **Spec Folder** | 010-deep-research-residue |
| **Status** | Complete |
| **Completed** | 2026-09-11 |
| **Level** | 1 |
| **Base Commit** | `afd10f291f` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A study of what this decommission teaches, run as a research loop over the same subject the review
loop audited but along a different axis. The review asked what is still wrong. This asked what
the work reveals, and it returned an answer worth keeping: the defects that mattered were not
introduced by the migration, they were **activated** by it.

### Phase 10: deep-research-residue

Three claims carry the study, each with evidence from this packet.

**A fallback is a defect incubator.** A code path whose only trigger is another path's failure can
sit in a repository for months having never once succeeded, because when it breaks the operation
has already degraded and the degradation is correctly explained by the primary's failure. The
fallback's own defect is attributed to the thing it was answering. Promoting that path to primary
converts a defect of exposure zero into one of exposure one, which is what makes it findable. Six
members of this class are documented, and five were found only because the promotion forced a
comparison against the primary.

**Residue falls into eight classes, and what finds each is a property of the search key rather
than the class.** A token-keyed sweep is complete for residue that carries the removed token and
structurally blind to residue whose carrier never names the removed thing, even inside the swept
directory. This packet demonstrates both halves: zero retired tool ids survive in scope, while
live documents in the same tree still assert an env alias no code honors.

**Checklist order should follow availability before cost.** Checks that can only run while the old
and new paths coexist are gates on the removal. Checks that can only run afterwards are a battery.
Cost orders within each set, not across them. The study ends in a twenty-two step checklist built
on that split.

The study also audited this packet's own record and found eight defects, all of them staleness at
the edges rather than inflation, which is the opposite of the usual failure and is what makes the
packet usable as a case study. Two of those eight, the parent's Pending progress rows and the
untouched phase logs, are the same defect the review loop raised as its ninth required finding.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `prompts/research-target.txt` | Created | The loop's target, aimed at what the work teaches rather than at defects |
| `research/lineages/deepseek-research/research.md` | Created | The synthesis: six findings, recommendations, the twenty-two step checklist |
| `research/lineages/deepseek-research/iterations/` | Created | Five per-iteration records |
| `research/lineages/deepseek-research/convergence-report.md` | Created | Novelty and stop telemetry for a run with convergence disabled |
| `research/lineages/deepseek-research/findings-registry.json` | Created | Machine-readable findings |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Through `/deep:research:auto` with a pre-bound spec folder, convergence disabled so the run could
not stop itself early, and the same executor the parent directive freezes: DeepSeek V4.1 Flash at
max thinking through the LLM gateway on cli-pi. The target was written through the prompt improver
alongside the review target, so the two loops covered one subject from two angles rather than
duplicating a defect hunt.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Aim the second loop at a different question, not a second opinion | Two defect hunts over one tree mostly agree with each other. Asking what the work teaches produced the fallback-exposure model, which no audit would have surfaced |
| Disable convergence | A five-iteration audit floor is the parent's requirement. Convergence telemetry was kept as a reading, not as a stop |
| Let the study audit the packet's own record | The record is part of what shipped. Eight of its defects were found here, and two of them duplicate the review's ninth finding from an independent direction |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Loop completed its iteration ceiling | PASS. Five of five, terminal `stopReason: maxIterationsReached`, convergence `off` |
| Synthesis written | PASS. `research.md`, 324 lines, executive summary through checklist |
| Per-iteration artifacts complete | PASS. Five iteration records and five delta files |
| Findings cite the tree, not the summaries | PASS. Each of the eight record defects names the file or commit that proves it |
| Lineage status in the runner | FAIL, and the failure is bookkeeping. See limitation 1 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The runner marked this lineage failed after the work was already complete.** The post-run
   write-containment check scans the tree for writes outside the lineage's scope. It found
   nineteen untracked paths and reverted the lineage on them. All nineteen belong to phase 9's
   review output, which was sitting untracked from the earlier run: the research lineage wrote
   none of them and was blamed for another loop's leftovers. The files were preserved rather than
   deleted, so nothing was lost, and every artifact this phase owes is on disk and complete. The
   fix is to commit a loop's output before starting the next one. The containment check's
   inability to tell a sibling's untracked output from its own is a runtime defect worth raising
   against the deep-loop packet.
2. **The study's eight record defects are recorded, not fixed.** They are inputs to phase 8.
3. **One external figure in the driving brief did not reproduce.** The brief cited 26 retired
   bridge tests and 7 inverted contract tests; the suites count differently. The study recorded the
   discrepancy so the number would stop propagating, which is the right handling, but it means the
   packet's own commit messages carry a count that the tree does not support.
<!-- /ANCHOR:limitations -->
