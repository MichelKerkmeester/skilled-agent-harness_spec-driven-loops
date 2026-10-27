---
title: "Implementation Summary: Phase 24: typed-command-ambiguity"
description: "The advisor stops calling a prompt ambiguous because of a confidence floor or the typed-command bound, so flags fall from 110 to 78 of 261 labelled prompts with no routing change."
trigger_phrases:
  - "typed command ambiguity implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/024-typed-command-ambiguity"
    last_updated_at: "2026-10-27T11:00:00Z"
    last_updated_by: "conductor"
    recent_action: "Built option (d) and verified it on 261 labelled prompts"
    next_safe_action: "Push on the operator's instruction"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-024-typed-command-ambiguity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-typed-command-ambiguity |
| **Status** | Complete |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A typed `/deep:research :auto` prompt now routes to system-deep-loop with no ambiguity flag, and the flag as a whole stops firing on noise: 78 of 261 labelled prompts are flagged instead of 110, with the same 202 correct top skills and no top skill changed.

### Phase 24: typed-command-ambiguity

The thin margin from phase 22 turned out to be only part of the story. A fresh Opus high review measured the flag across the advisor's labelled prompts and found most of it came from the task-intent confidence floor, which lifts unrelated skills to 0.82 and so within 0.05 of a top that earned its confidence. Option (d) from that review was built: a floored skill clusters on score alone when the top is not floored, a skill held below a typed command's owner never clusters with it, the brief trusts the scorer's answer, and the low-information abstention still sees the wider cluster.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts` | Modified | `heldBelow` and `confidenceFloored` on a recommendation |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modified | Record the holding seed and floored confidence; abstention reads the wide set |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts` | Modified | Held-pair and floor exceptions; `wideAmbiguityMembers` |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`, `lib/skill-advisor-brief.ts` | Modified | Trust the scorer's boolean; "vs" names a cluster member |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`, `handlers/advisor-recommend.ts`, `hooks/lib/skill-advisor-cli-fallback.ts` | Modified | Carry `heldBelow` through the public output |
| `.skilled/skills/system-skill-advisor/runtime/tests/` (typed-command routing, quality 049-003, legacy renderer) | Modified | Failing-first tests |
| `.skilled/skills/system-skill-advisor/SKILL.md`, `changelog/v0.17.7.0.md`, Hermes copy | Modified, Created | Release 0.17.7.0 |
| `.gitignore` | Modified | `/specs/other/` kept local, at the operator's request |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An Opus medium agent built the held-pair change and found that the floor kept the flag on. A fresh Opus high agent then measured five rule variants over 261 labelled prompts and recommended (d), which the operator chose. DeepSeek V4.1 Flash 1017 at max, through cli-pi on LLM Gateway, built (d) in six one-change briefs, four of them in parallel. The conductor checked every diff, ran each new test against the old rule, then reran the harness, the regression sets, the full suite and the live probes on the rebuilt runtime.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Option (d) over a heavier explicit-lane weight | Both skills read 0.8235 confidence, so a score change alone leaves the confidence tie and the flag |
| Apply the floor exception only when the top is not floored | Excluding every floored skill (option b) let one under-specified prompt route instead of abstaining |
| Mark floored confidence with a field, not by testing for 0.82 | A test on the value breaks when the constants change |
| Leave the Python twin as is | It has no seed bound and no floor rule; its path re-derives the flag the old way |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Held-pair tests on the old code | 2 of 8 failed; 8 of 8 pass after |
| Floor test with the exception off | `1 failed \| 17 passed (18)`; passes with it on |
| 261-prompt harness on the real build | Flags 110 to 78, correct 202 to 202, top changes 0 |
| P0 regression set | `overall_pass: true`, `failures: []` |
| Python twin | `pass=85, fail=0` |
| Full advisor suite | `Test Files 150 passed (150)`, `Tests 1253 passed \| 8 skipped (1261)`, rc 0 |
| Live probe, typed `/deep:research :auto` | system-deep-loop 0.56469, `ambiguous: false` |
| Typecheck and build | exit 0 |
| Packet validation | `validate.sh --strict --recursive` on packet 054 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The Python fallback re-derives the flag the old way.** When the advisor falls back to `skill_advisor.py`, the brief has no scorer verdict and clusters by the plain 0.05 rule. Port the floor rule to the twin if that path matters.
2. **A related uncertainty bump keeps the floor noise.** `fusion.ts` adds 0.04 uncertainty when adjacent candidates' confidences are within 0.05, which floored skills still trigger.
3. **cli-classifier replay baselines will move.** They build clusters from `ambiguousWith`; refresh them on their next run.
<!-- /ANCHOR:limitations -->
