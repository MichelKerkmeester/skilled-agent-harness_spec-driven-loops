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
    packet_pointer: "sk-communication/006-sk-communication-clarity/005-verification-and-rollout"
    last_updated_at: "2026-09-14T13:24:00Z"
    last_updated_by: "claude-conductor"
    recent_action: "Harness built and run, results recorded"
    next_safe_action: "Operator decides whether to iterate the two rules with no measured effect"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/benchmark/reply-harness"
      - "specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/scratch/harness-smoke.md"
      - "specs/sk-communication/006-sk-communication-clarity/003-root-doc-and-repo-rules/baselines/measurement-baseline.md"
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
## Second Run, Sonnet 5

The operator asked for the same harness on a second model before touching the two rules with no measured effect. Both conditions were regenerated on `claude-sonnet-5` through the claude CLI with reads and the two case commands pre-approved, identical on both sides, replies under `runs/sonnet/`, results under `runs/sonnet/results/`, the comparison in `runs/sonnet/results/compare.txt`.

- Weighted mean 0.71 to 0.73. Answer position 0.50 to 0.83, receipts 0.50 to 0.33, tone 1.00 to 0.83, the other four dimensions flat or within 0.01. The control held on its observable.
- The first-line contract works on Sonnet: C1 failed before and passed after. On GLM it failed both sides. The non-effect there was model-specific.
- The visible-item cap fails on both models and both sides: a twelve-item flat list every time. That is the one rule with no measured effect on either model.
- The receipts rule fails on both sides on Sonnet only: both replies report the checker's result without naming the command that ran. On GLM both sides passed. Model-specific in the other direction.
- Gate: conditions 1, 3 and 5 pass, condition 2 fails on receipts and tone by 0.17 each, condition 4 fails on C3 and C6. The gate does not certify release on Sonnet either, and says so.

## Deep Review

A five-iteration deep review ran on Sonnet 5 at xhigh effort through the claude CLI executor, target the whole program packet, all four dimensions, report at `../review/program-review/lineages/sonnet5-xhigh/review-report.md`. Verdict CONDITIONAL with 0 P0, 2 P1, 4 P2. Adjudication against the files:

- F003, P1, an unticked goal row: confirmed and fixed, the row now reads ticked.
- F005, P1, no tests for the claim-omission veto and the no-op record: refuted. Both are tested by name in `test/config/copy-editing-instruction.test.ts`, which the reviewer did not open. No change.
- F004, P2, stale acceptance frontmatter: confirmed and fixed on every closed phase.
- F006, P2, no playbook scenario for the phase 004 additions: confirmed and fixed, COMM-010 added with its feature file.
- F001, P2, the checks array shrinks on the no-op path: confirmed as designed, recorded in the phase 004 summary.
- F002, P2, an unconstructed contract type gained a field: confirmed as pre-existing shape, recorded in the phase 004 summary.

## Third Run, Iterated Rules

The two rules with no measured effect were rewritten as directives on 2026-09-15, the visible item cap in `communication.md` §8 and the closing contract in `handoff-and-questions.md` §1, and the after condition was regenerated on both models from the same seven prompts. Results under `runs/iterated/`, prompts, replies, scores and both comparisons.

- GLM-5.3-Flash: weighted mean 0.74 against 0.74 on the first after run, flat. The item cap now holds: the twelve-item case came back as four labelled groups of four, three, three and two, where both earlier runs printed a flat twelve. The first-line contract now passes where it failed on both earlier sides. The closing contract regressed: the checker case named the result and the exit code but never the command, so the receipts row fails and blocks on this side where it passed on both earlier sides.
- Sonnet 5: weighted mean 0.80 against 0.73 on the first after run. The closing contract now holds: the checker case names the command, then the status, then nothing else, where the earlier after run reported the result with no command behind it. The item cap still does not hold: a flat twelve-item list, the same shape as every earlier Sonnet side.
- Gate: control held on both models. Condition 4 still fails, on one row per model, receipts on GLM and the item cap on Sonnet. The gate does not certify release and says so.

What this measures. Each rule moved exactly one model. The directive item cap changed GLM's list shape and not Sonnet's, the directive closing contract changed Sonnet's close and not GLM's. With one sample per case per condition the GLM receipts regression may be noise. The Sonnet flat list was the fourth identical observation, so the operator was asked to choose between a mechanism and accepting the list, and chose to accept it, recorded as ADR-010.

## Rescored Under ADR-010

The coverage case now keys on retention of the eleven rule files present in both conditions, and the group sizes are recorded without deciding the row. Every reply set was rescored, so the numbers below replace the ones above, which counted the flat list as a blocking failure.

| Side | Weighted mean | Blocking rows |
|------|---------------|---------------|
| GLM before | 0.68 | C1 |
| GLM after, first run | 0.77 | C1 |
| GLM after, iterated rules | 0.74 | C3 |
| Sonnet before | 0.73 | C1, C3 |
| Sonnet after, first run | 0.75 | C3 |
| Sonnet after, iterated rules | 0.83 | none |

On Sonnet with the iterated rules the gate passes every observable condition: control held, correctness and safety within tolerance, mean above baseline, no blocking row, no-op rows apart. The human study stays a GAP. On GLM the receipts row blocks, one observation after two passes.

## Harness Hardening, 2026-09-15

The checklist pass named two adversarial runs the phase had not exercised, and one bound it had not coded. Every subprocess the harness starts now carries a timeout, 60 seconds for the two git calls in `generate-prompts.mjs` and 120 seconds for the scanner in `score.mjs`. The prompt manifest records `casesHash`, the digest of `cases.json` at generation time, and `score.mjs --prompts <dir>` refuses to score when the digest on disk differs or when the manifest was generated for the other condition. Four runs exercised it: the frozen before replies rescored through the new path with rows identical to `runs/results/before.json`, a manifest from the other condition refused with exit 1, a forged digest refused with exit 1 and no result file, and `blind.mjs` over both reply sets, whose 14 masked files carry no baseline commit, reply directory, change kind or condition label. The prompt generator also follows the rule-set baseline to `003/baselines/`, where the three phase 003 baselines now live.

## Known Limitations

1. **One sample per case per condition.** The deltas are directional evidence from seven cases, not a powered result. The gate's GAP section says so.
2. **The item cap is advisory on the models measured.** Sonnet printed the flat list four times, the operator accepted it as ADR-010, and the harness now scores retention. GLM's receipts miss on the iterated run is one observation after two passes and may be noise.
3. **The mechanical scorer is a proxy.** It reads the scanner and one predicate per case. A blinded judge reading `runs/blind/` would add what no predicate sees.
<!-- /ANCHOR:limitations -->
