---
title: "Implementation Summary"
description: "A reply harness with a pre-change baseline and a negative control ran once: the rules lifted the weighted score from 0.60 to 0.74 with no dimension falling, and two rules showed no measurable effect."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/006-sk-communication-clarity/001-research-communication-context/research/luna-fanout/lineages/luna/containment/quarantine/content/specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/research/lineages/deepseek/containment/baseline/specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/luna-fanout/lineages/luna/containment/baseline/specs/system-deep-loop/045-fanout-write-containment-hardening/007-worktree-removal/research/lineages/live-a/containment/baseline/specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout"
    last_updated_at: "2026-09-14T13:24:00Z"
    last_updated_by: "claude-conductor"
    recent_action: "Harness built and run, results recorded"
    next_safe_action: "Operator decides whether to iterate the two rules with no measured effect"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/benchmark/reply-harness"
      - "specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/scratch/harness-smoke.md"
      - "specs/sk-communication/006-sk-communication-clarity/003-root-doc-and-repo-rules/scratch/measurement-baseline.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-verification-and-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-verification-and-rollout |
| **Completed** | 2026-09-14, part one |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reply harness that measures whether the program's rules changed what a model writes, with a baseline captured before any rule changed and a negative control. It ran once across both conditions. The rules moved the weighted score from 0.60 to 0.74 with no dimension falling and the control unchanged. Two rules showed no measurable effect, so the release gate does not certify release, and it says so rather than rounding up.

### Reply harness and the measured result

Seven frozen cases, six keyed to an adopted rule and one negative control, live in `.opencode/skills/sk-communication/benchmark/reply-harness/cases.json` beside a weighted rubric with one blocking class. `generate-prompts.mjs` assembles the rule set from the recorded pre-change commit or the working tree, `score.mjs` scores each reply mechanically through the wording standard's scanner plus one predicate per case, `blind.mjs` masks both sides under random labels with a sealed order record, and `compare.mjs` prints the per-dimension delta, the control's observable and the blocking rows, exiting non-zero when the gate fails.

You gain a repeatable before-and-after measurement for any future rule change: regenerate, feed the prompts to one model, score, compare.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-communication/benchmark/reply-harness/` | Created | cases, rubric, four scripts, release gate, README |
| `.opencode/skills/sk-communication/benchmark/README.md` | Modified | Layout row for the harness |
| `runs/` in this folder | Created | Both prompt sets, fourteen replies with meta files, results, masked copies, the comparison, and attempt 1 kept aside |
| `scratch/model-step.md` | Created | The model step and the three harness corrections |
| `.opencode/skills/sk-communication/changelog/v1.3.0.0.md` | Modified | The measured result beside the change |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The harness was built by a GLM-5.3-Flash leaf that never called a model. The conductor ran the model step: each prompt to `llmgateway/glm-5.3-flash` through pi print mode at medium thinking, identical on both sides. Attempt 1 produced five empty replies because three frozen prompts were research descriptions rather than runnable prompts, so each case gained a concrete `operatorPrompt` shared by both conditions, the scorer was made to refuse empty replies, and the control was made to compare its observable rather than a noisy score. Attempt 2 produced fourteen replies and the results above. The rollout step needed no regeneration: all three runtime synchronizers reported no drift.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Instantiate the abstract case prompts once, shared by both sides | "Run the tests and tell me" made the model run the whole suite and time out. The frozen prompt stays as the case's definition, the instantiation is the runnable form, and the observable is unchanged |
| Judge the control on its observable | Its weighted score moved 0.01 on the scanner's tell count between two honest wordings. The observable, a restatement present, is what the control exists to hold |
| Report the two non-effects and fail the gate | C1 and C6 fail their keyed observable on both sides. Rounding that into a pass would make the harness measure the label, not the rules |
| Medium thinking for the measurement subjects | The same setting on both sides is what makes the comparison fair. Max effort is the build pin, not a measurement condition |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node compare.mjs --before results/before.json --after results/after.json` | Exit 1 by design. Weighted mean 0.6008 to 0.7442, every dimension up or flat, control observable true on both sides, no-op rows 0 and 0, after-side blocking rows C1 and C6 |
| Release gate conditions | 1 control held: PASS. 2 correctness and safety within 0.1 or better: PASS. 3 weighted mean beats baseline: PASS. 4 no blocking class fired: FAIL on C1 and C6. 5 no-op rows apart: PASS. GAP: the human study is unobservable and unmet |
| Runtime synchronizers | `sync-gate1-pointers.cjs --check`, `sync-runtime-mirrors.cjs --check`, `sync-hook-registrations.cjs --check` all PASS |
| `validate.sh --recursive --strict` on the parent | Recorded in tasks.md T018 from the final state |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Deep Review

A five-iteration deep review ran on Sonnet 5 at xhigh effort through the claude CLI executor, target the whole program packet, all four dimensions, report at `../review/program-review/lineages/sonnet5-xhigh/review-report.md`. Verdict CONDITIONAL with 0 P0, 2 P1, 4 P2. Adjudication against the files:

- F003, P1, an unticked goal row: confirmed and fixed, the row now reads ticked.
- F005, P1, no tests for the claim-omission veto and the no-op record: refuted. Both are tested by name in `test/config/copy-editing-instruction.test.ts`, which the reviewer did not open. No change.
- F004, P2, stale acceptance frontmatter: confirmed and fixed on every closed phase.
- F006, P2, no playbook scenario for the phase 004 additions: confirmed and fixed, COMM-010 added with its feature file.
- F001, P2, the checks array shrinks on the no-op path: confirmed as designed, recorded in the phase 004 summary.
- F002, P2, an unconstructed contract type gained a field: confirmed as pre-existing shape, recorded in the phase 004 summary.

## Known Limitations

1. **One sample per case per condition.** The deltas are directional evidence from seven cases, not a powered result. The gate's GAP section says so.
2. **Two rules had no measurable effect on this model.** The first-line contract and the visible-item cap did not change the model's opening sentence or its list grouping. Iterating those rules is the operator's decision.
3. **The mechanical scorer is a proxy.** It reads the scanner and one predicate per case. A blinded judge reading `runs/blind/` would add what no predicate sees.
<!-- /ANCHOR:limitations -->
