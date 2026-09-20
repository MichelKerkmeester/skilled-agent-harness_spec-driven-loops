---
title: "Implementation Summary: Advisory Research"
description: "Ten forced-depth passes across two model families produced a state-gated advisory design, refuted three of five originally proposed rules, and confirmed one live footgun with no rule today."
trigger_phrases:
  - "advisory research summary"
  - "git advisory research outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/001-advisory-research"
    last_updated_at: "2026-07-27T21:55:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Completed the ten-pass program and merged the corpus into research.md"
    next_safe_action: "Operator reviews findings; phase 002 encodes only the confirmed set"
    blockers: []
    key_files:
      - "research.md"
      - "research/RUNNING-NOTES.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-001"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Should the confirmed config-filter footgun be split into its own remediation?"
    answered_questions:
      - "The noise threshold is roughly 1 advisory per 100 git mutations per rule."
      - "The existing evaluator is command-only and cannot express state-gated git rules."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Advisory Research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-advisory-research |
| **Completed** | Research complete 2026-07-27; operator review outstanding |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Ten forced-depth research passes across two model families, producing 325 KB of transcripts merged
into a ranked findings document. The central question — which git operations warrant a preflight
advisory, and where the noise threshold sits — is answered with measurements rather than assertion.

The measured result that matters: 93% of resets in this repository are unstage-only, so a rule
gated on the `reset` verb fires on one operation in seven, while the same rule gated on old SHA
differing from new SHA fires on roughly one in a hundred. The discriminator is the rule; the verb is
not. Every retained candidate follows that shape.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research.md` | Created | Ranked findings, refutations, handoff order |
| `research/` | Created | One SOL lineage, five GLM transcripts, briefing, running notes |
| `checklist.md` | Modified | Evidence recorded against completed items |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The SOL half ran as a single iterating fan-out lineage under `stopPolicy: max-iterations`, so
convergence stayed telemetry: it reached 0.75 and kept going to the fifth iteration. The GLM half ran
as five independent hand-driven dispatches, because `cli-devin` is not a deep-loop executor kind and
cannot host a lineage. Each GLM pass was aimed at a surface the iterating lineage was unlikely to
reach — operation enumeration, noise measurement, rule classification, prior art, and failure modes
with no rule.

Verification was pointed at the claims most likely to be fabricated. The reflog measurements were
re-derived independently by the orchestrator and matched to the tenth of a percent. The single
confirmed finding was re-checked directly against `git show HEAD:opencode.json` rather than trusted
from a transcript.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Research before encoding any rule | Three of five rules proposed from memory did not survive contact with measurement |
| Two model families | The halves were complementary and, on the reset numbers, independently corroborating |
| Forced depth, no early convergence | The lineage hit 0.75 convergence and still produced new ruled-out directions afterwards |
| GLM passes aimed at gaps, not the incident list | The incident list was given as a floor; restating it would have been confirmation, not research |
| Devin re-run at `accept-edits` | The first pass completed, produced findings, and could not write them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| 10 passes completed | PASS — 5 SOL iterations, 5 GLM dispatches, all with artifacts |
| No early convergence | PASS — stop reason `max-iterations` at score 0.75 |
| Every GLM pass wrote an artifact | PASS — 5 of 5 after the permission fix; the first attempt produced 0 of 1 |
| Reflog measurements re-derived independently | PASS — 201/1486 = 13.5%, matching both halves |
| Confirmed finding re-checked at source | PASS — `git show HEAD:opencode.json` diverges from the working copy as reported |
| Findings tiered confirmed versus inferred | PASS — §4.1 confirmed, §4.2 mechanism-confirmed and frequency-inferred |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Reflog rates are prevalence ceilings, not advisory fire rates.** The repository has no Bash-hook
   invocation log, so true fire rates cannot be derived. Every frequency number is an upper bound.
2. **GLM pass 01 carries zero measured numbers.** Every `git` invocation is rejected by the runtime
   guard in Devin's non-interactive session. Its 67-operation enumeration is taxonomy plus inference;
   read it as a candidate map, not as evidence.
3. **The §4.2 candidates are mechanism-confirmed and frequency-inferred.** The prior research program
   re-tested six claims and two were wrong. Assume a comparable rate here.
4. **The evaluator cannot express these rules today.** `evaluate(command, rules)` takes no repository
   state. Phase 003's central design question was not visible when the packet was scaffolded, and if
   the evaluator cannot be extended, phases 002 and 003 invert in order.
<!-- /ANCHOR:limitations -->
