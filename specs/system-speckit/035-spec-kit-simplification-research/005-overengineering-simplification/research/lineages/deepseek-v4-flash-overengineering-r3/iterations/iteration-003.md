# Iteration 003 — KQ-R3c: command surface step overlap across /speckit:* assets

Session: fanout-deepseek-v4-flash-overengineering-r3-1788784311216-27elid | run 3 | focus: step lists of the 8 workflow assets under `.opencode/commands/speckit/assets/` (steps only) — one table: command, workflow owned, other commands repeating its steps.

Evidence reads (7 calls): asset listing, document structure probes, step-name extraction from all 4 auto variants, step-name extraction from all 4 confirm variants, step-body reads for plan/implement/complete tails, `generate-context.js` node lines, exact step line numbers. No node/validate/git executed.

## Step table (step names in workflow order; line numbers are the step header in the asset)

| Command (asset) | Steps owned (order) |
|---|---|
| plan (`speckit-plan-{auto,confirm}.yaml`) | 0.5 intake_branch, 0.6 intake_only_gate, 1 request_analysis(494), 2 pre_work_review(515), 3 specification(522), 4 clarification(558), 5 planning(564), 6 save_context(685), 7 handover_check(720) |
| implement (`speckit-implement-{auto,confirm}.yaml`) | 1 review_plan_and_spec, 2 task_breakdown, 3 analysis, 4 acceptance_criteria, 5 implementation_check, 6 development, 7 completion, 8 save_context(590), 9 session_handover_check(626) |
| complete (`speckit-complete-{auto,confirm}.yaml`) | 0 autopilot_envelope (auto only), 0.5 intake_branch, 1 request_analysis(622), 2 pre_work_review(651), 3 specification(681), 4 clarification(728), 5 acceptance_criteria(742), 6 planning(773), 7 task_breakdown(886), 8 analysis(926), 9 implementation_check(948), 10 development(969), 11 acceptance_verify(1047), 12 completion(1078), 12.5 autopilot_archive_verify_merge (auto only), 13 save_context(1155), 14 handover_check(1201) |
| resume (`speckit-resume-{auto,confirm}.yaml`) | 1 session_detection, 2 load_memory (confirm: 2 memory_selection, 3 load_memory), 3/4 calculate_progress, 4/5 present_resume — utility workflow, no overlap with the big three |

Repeat detection (names, in-order):
- plan steps 1-4 (request_analysis → pre_work_review → specification → clarification) appear verbatim as complete steps 1-4 (same names, same order).
- implement steps 2→3→5→6→7 (task_breakdown, analysis, implementation_check, development, completion) appear verbatim as complete steps 7→8→9→10→12 (same names, same relative order; complete inserts planning before and acceptance_verify after).
- save_context is a step in ALL THREE workflows (plan 6, implement 8, complete 13) — the only step present in every command; its node (`node …/runtime/cli/dist/continuity/generate-context.js /tmp/save-context-data-<session-id>.json …`) appears at plan:695, implement:601, complete:1155ff, plus the three confirm copies (6 copies total).
- save_context→handover_check tail sequence: plan (685/720) and complete (1155/1201); implement's equivalent tail is save_context→session_handover_check (590/626) — same sequence, two handover-step names.
- resume shares no steps with the other commands.

## Findings

**F3-10 [P2 — a command built as the union of two others] `/speckit:complete` is plan ∪ implement plus two new steps.**
- Claim side: complete's 16 steps, of which 12 names exist in plan or implement with identical order (in-plan: request_analysis, pre_work_review, specification, clarification, planning; in-implement: task_breakdown, analysis, implementation_check, development, completion; in-both: save_context, handover_check).
- Actual: only 5_acceptance_criteria(742), 11_acceptance_verify(1047), 0_autopilot_envelope, 12_autopilot_archive_verify_merge are unique to complete. The 011 contract realignment edited all eight assets separately, so every contract change must be applied three times; the step graph itself was never compared (census §4 counted checklist mentions, not step duplication).
- Severity: P2. Recommendation: **merge** — make complete reference plan's and implement's phases as sub-workflows (or a shared steps include), so the plan/implement bodies exist once; this also collapses the 011-style triple-edit burden.

**F3-11 [P2 — the only triple-appearing step] save_context (the generate-context.js node) is a separate step in all three lifecycle commands, duplicated six times.**
- Claim side: plan:695, implement:601, complete:1155 (and the three confirm twins) each declare `node .opencode/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js /tmp/save-context-data-<session-id>.json …` as their own step body.
- Actual: the tail sequence save_context→handover_check appears in three commands under two handover names (handover_check vs session_handover_check). The generate-context.js invocation contract (structure the JSON first, run the writer, regenerate the trigger index on trigger_phrase change — plan:696-698) is re-stated per copy, so a contract change to the continuity writer must be applied in six places, and the plan copy still says `{spec_path}` where implement/complete use `[spec-folder-path]` — two different placeholder conventions for the same argument (plan:695 vs implement:601).
- Severity: P2. Recommendation: **merge** — one shared tail (single asset, referenced by all three commands) plus one placeholder convention.

**F3-12 [P2 — same full-tree gate re-run inside one workflow] `validate.sh [SPEC_FOLDER] --strict` occurs 4× in plan, 3× in implement, 7× in complete.**
- Claim side: grep counts of the identical command string per workflow (4/3/7).
- Actual: each occurrence re-runs the whole 39-rule gate over the same folder after a different document write. 14 occurrences across the three commands, 7 in one. Whether each site is phase-necessary (progressive validation) or redundant (final gate suffices) is unverified — the assets carry no note explaining the cadence; and the post-011 contract means each run now also evaluates acceptance closure, making the 7-run cadence more expensive per run than at census time.
- Severity: P2. Recommendation: **document** the cadence per site, or **consolidate** (one gate per write milestone; exact redundancy per site unread — open question).

**F3-13 [P2 — auto/confirm twins] plan, implement and complete each maintain two near-identical 700-1300-line assets differing only in `use: present_options_to_user` insertion points.**
- Claim side: step-name extraction shows plan-auto ≡ plan-confirm, implement-auto ≡ implement-confirm, complete-auto ≡ complete-confirm (resume-confirm genuinely differs: adds memory_selection and splits present_resume into two steps).
- Actual: 6 files maintain 3 workflows; every contract edit must be applied twice, and the present-to-user nodes are the only diff (their presence implies the confirm variants were generated by inserting one token at each checkpoint into the auto variant).
- Severity: P2. Recommendation: **merge** — one workflow asset per command with an execution_mode branch rendering the `use: present_options_to_user` nodes at declared checkpoints (the assets already carry `operating_mode` sections; they could carry the checkpoint list instead of a second file).

## Verified correct this iteration

- Resume is genuinely distinct: utility workflow (4-5 steps, session detection → memory → progress → present), no step shared with the lifecycle trio.
- Complete's autopilot header/merge steps (0_autopilot_envelope, 12.5_autopilot_archive_verify_merge) are activation-gated to autopilot mode — not gratuitous duplication for interactive runs.
- The 011 contract fixes landed in all eight assets (no checklist.md scaffold remains in the step surfaces inspected; acceptance-criteria.md appears in implement step 4 and complete step 5), so what remains is structural duplication, not stale content.
- Step names within each command are internally ordered consistently (plan: 1-7, implement: 1-9, complete: 0-14), so the duplication is between commands, not within.

## Open questions

1. Are validate.sh's 7 occurrences in complete each after a distinct write (spec/plan/AC/tasks/summary/…), or do some re-validate unchanged state? Occurs-per-step not mapped (budget).
2. Do plan's and complete's duplicated step bodies (1-4) carry identical content or have they drifted in prose (e.g., the `{spec_path}` vs `[spec-folder-path]` difference already found in the save node)? Body diff not performed (budget).
3. Is the auto/confirm twin generation scripted (a generator keeping them in sync) or manual? No generator found in the assets dir listing; root-level generators not searched (budget).
