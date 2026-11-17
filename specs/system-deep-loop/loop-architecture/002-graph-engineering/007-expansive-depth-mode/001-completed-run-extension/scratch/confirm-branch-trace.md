# `:confirm` branch trace for an extended config (T004)

Traced 2026-11-17 by code reading on worktree HEAD `21c4b325b5a`, before any YAML edit. Input: a packet whose config, state log and strategy all exist and agree, whose config status the pre-classify step has rewritten from `complete` to `initialized`, and whose state log ends with `synthesis_complete` followed by the projected `extended` row.

## Classification (both modes)

| Loop | Rule | file:line | Result for status `initialized` |
|------|------|-----------|-------------------------------|
| research | `completed-session: "Resume artifacts exist and config.status == 'complete'"` | `.skilled/commands/deep/assets/deep-research.yaml:436` | no match: status is not `complete` |
| research | `resume: "Config, JSONL, and strategy all exist and agree on topic/spec folder"` | `deep-research.yaml:435` | match: **resume** |
| research | `invalid-state: "Any partial, missing, or contradictory combination"` | `deep-research.yaml:437` | no match if the classifier reads `synthesis_complete` then `extended` as consistent. See risk 1 |
| review | `completed-session` same rule | `.skilled/commands/deep/assets/deep-review.yaml:458` | no match |
| review | `resume` plus `config.mode == 'review'` | `deep-review.yaml:457` | match: **resume** |
| review | `invalid-state` same rule | `deep-review.yaml:459` | as research, risk 1 |

No other step in either YAML reads `config.status` before the loop. `rg -n "status ?==|\.status|'complete'|initialized"` on both files prints only the classifier line, the init write of `initialized` (`deep-research.yaml:565`, `deep-review.yaml:715`) and the synthesis write of `complete` (`:1927`, `:2165`).

## `:confirm` branches from `step_classify_session` onward

| # | Loop | Branch | file:line | Lands on |
|---|------|--------|-----------|----------|
| 1 | research | `on_resume.confirm_choice` preempts the auto keys and asks resume / restart / cancel | `deep-research.yaml:448-450` | the operator's pick; the classification itself is `resume` |
| 2 | research | `on_resume_choice`: sets `lineage_mode: resume`, appends `resumed`, `skip_to: gate_init_approval` | `deep-research.yaml:452-461` | **resume**, then the approval gate |
| 3 | research | `gate_init_approval` (`applies_to: confirm`): A proceeds to `phase_loop`, B returns to the gate, C cancels | `deep-research.yaml:784-810` | A: `phase_loop` (resume continues). No status read |
| 4 | research | `on_restart_choice` / `on_cancel_choice` | `deep-research.yaml:462-511` | operator-chosen exits, not reached unless the operator picks them |
| 5 | review | `on_resume.confirm_choice`, same three options | `deep-review.yaml:470-477` | the operator's pick; classification `resume` |
| 6 | review | `on_resume_choice`: sets `lineage_mode: resume`, appends `run_resumed`, `skip_to: gate_init_approval` | `deep-review.yaml:478-486` | **resume**, then the approval gate |
| 7 | review | `gate_init_approval` (`applies_to: confirm`): A proceeds to `phase_loop` | `deep-review.yaml:838-876` | A: `phase_loop`. No status read |
| 8 | review | `on_completed_session` (`skip_to: phase_synthesis`) | `deep-review.yaml:584-587` | **not reached**: status is `initialized`, so the review defect D11 path is bypassed by the pre-classify mutation, as REQ-008 requires |

Verdict: every classification path for status `initialized` lands on `resume`. Under `:confirm` the operator is still asked resume / restart / cancel, which is the existing resume contract, and picking resume reaches `phase_loop` through `gate_init_approval` with no status check.

## What the YAML edit must carry (found by this trace)

1. **Risk 1, invalid-state reading.** The classifier is prose read by the orchestrating model. A state log ending `synthesis_complete` then `extended` with a non-complete config could be read as contradictory. The pre-classify step therefore binds `extension_pending: true`, and the classify block gains one line saying an extension's `extended` row after `synthesis_complete` is consistent and classifies as resume.
2. **ADR-004 in both confirm branches.** `on_resume_choice` (rows 2 and 6) appends `resumed` / `run_resumed` and sets `lineage_mode: resume`. For an extension both the auto `on_resume` keys and `on_resume_choice` must skip that append (the pre-classify step already appended `run_extended`) and keep `lineage_mode: completed-continue`.
3. **`max_iterations` binding.** `max_repeats: "{max_iterations}"` (`deep-research.yaml:818`, `deep-review.yaml:874`) and the YAML stop rule `iteration_count >= max_iterations` (`:969`, `:1023`) read the command binding, default 10 (research) and 7 (review), not the config. `convergence.cjs:1049` reads `config.maxIterations`. The pre-classify step must also set the `max_iterations` binding to the new `maxIterations`, or the YAML cap and the script cap disagree.
