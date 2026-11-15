# Merge Ledger: deep-research and deep-review twin merge

Per-step decision record for merging each auto and confirm workflow twin into one file per command. Read-only analysis of the twins as they stand on branch `worktrees/382-deep-loop-workflow-logic-hardening` after commit `6667054ec0` (phases 001 to 003 closed).

## How to read this ledger

File abbreviations used in every evidence cell, all under `.skilled/commands/deep/assets/`:

| Code | File |
|------|------|
| RA | `deep-research-auto.yaml` |
| RC | `deep-research-confirm.yaml` |
| VA | `deep-review-auto.yaml` |
| VC | `deep-review-confirm.yaml` |

- `RA:302` means line 302 of `deep-research-auto.yaml`. `absent` means the twin has no such key.
- Rule numbers refer to the seven frozen merge rules in the brief. Rule 1 is "base body is the auto body", so a difference marked "rule 1" keeps the auto value.
- Differences were found by a recursive parse of both twins with PyYAML (key paths plus line marks from `yaml.compose`), then checked by reading the windows named here. Comments are not parsed, so a comment-only difference is not a row.
- An unsettled item is one sentence that opens with the word UNSETTLED and a colon and states both values. It marks a real behavior difference that the seven rules do not decide. No resolution is proposed for those. Every other mention of an unsettled item is a plain cross-reference.
- Nested steps and gates have their own rows, placed under their parent and named with their parent path.

## Top notes

### Old `confirm_parity.omitted_steps` reasons against rule 3

Rule 3 makes every step below run in confirm mode. The last column says whether the stated omission reason names a hazard that is still real once the merged file takes the auto body.

Research (`RC:2066` to `RC:2076`, 11 steps):

| Step | Runs in confirm under rule 3 | Stated reason | Real hazard after the merge |
|------|------------------------------|---------------|-----------------------------|
| `step_apply_lifecycle_request` | Yes | Confirm applies restart inside `step_classify_session.on_restart_choice` | Partly. No double archive, because after the early archive the session classifies as fresh and no prompt fires. But a confirm run with `--restart` now archives before the lock with no prompt, and the step is untagged for dry run, so `--dry-run --restart` archives before any halt (see row). |
| `step_apply_divergent_pivot_result` | Yes | The confirm pivot gate applies the pivot in its `on_A` and `on_B` branches | Yes. Gate `on_A` repeats the same `set` and the same reducer command (`RC:1123` to `RC:1127`) as the auto step (`RA:1121` to `RA:1125`). If both run in confirm, they apply twice. It also carries the rule 5 collision (section D). |
| `step_init_complete` | Yes | Covered by `gate_init_approval.on_A` | No. Both set `current_iteration: 1, current_segment: 1` (`RA:651`, `RC:686`), so running both is idempotent. The gate's jump target can skip it (section C). |
| `step_refresh_lineage_context` | Yes | Prompt line is an unattended convenience | No. Read-only (`RA:2127`). Rule 1's `step_read_state` extracts `lineage_context_prompt_line` (`RA:722`). |
| `step_rejected_pattern_cache` | Yes | Confirm `step_read_state` does not extract the registry data it consumes | Was real, removed by rule 1. Auto `step_read_state` extracts `rejected_pattern_fuzzy_threshold` and `promoted_ideas_list` (`RA:739`, `RA:743`), and the step reads `{state_paths.registry}` itself (`RA:1148`). |
| `step_ideas_backlog_lifecycle` | Yes | Same registry dependency | Was real, removed by rule 1. Auto `step_read_state` extracts `min_idea_observations`, `promoted_ideas_count`, `suppressed_ideas_count` (`RA:740`, `RA:742`, `RA:744`). |
| `step_run_now_check` | Yes | Interactive runs are operator-driven | No hazard in behavior. Needs `state_paths.run_now_sentinel`, which only auto defines (`RA:158`), so `state_paths` must take the auto block. |
| `step_run_now_restore_check` | Yes | Counterpart of the run-now check | Same as above. |
| `step_telemetry_heartbeat_started` | Yes | Interactive runs report at gates | No behavior hazard. Needs `state_paths.status_ledger` (`RA:153`, auto only). Its observability `producer` literal is `'deep-research-auto'` (`RA:636`), which mislabels confirm-mode rows (unsettled, see `step_telemetry_heartbeat_started` in Research A). |
| `step_telemetry_heartbeat_progress` | Yes | Counterpart | Same, `producer` at `RA:2236`. |
| `step_telemetry_heartbeat_terminal` | Yes | Counterpart | Same, `producer` at `RA:2493`. |

Review (`VC:2196` to `VC:2199`, 4 steps):

| Step | Runs in confirm under rule 3 | Stated reason | Real hazard after the merge |
|------|------------------------------|---------------|-----------------------------|
| `step_apply_lifecycle_request` | Yes | Confirm resolves the lineage request in `step_classify_session` | Same as research. The step moves `{state_paths.packet_dir}` (`VA:228`) and is untagged for dry run. |
| `step_init_complete` | Yes | Covered by `gate_init_approval.on_A` | No. Both set `current_iteration: 1` and zero `p0_count`, `p1_count`, `p2_count` (`VA:694`, `VC:712`). |
| `step_generate_state_summary` | Yes | Inlined into `step_dispatch_iteration.pre_dispatch.generate_summary` | No. The reason is accurate: `pre_dispatch.generate_summary` (`VA:1225`) holds the same summary text, including `{resource_map_prompt_line}`, and `pre_dispatch` is identical in both twins. Running both is a harmless duplicate with no write. |
| `step_apply_divergent_pivot_result` | Yes | The confirm pivot gate applies the pivot | Yes, same double apply as research: gate `on_A` (`VC:1191` to `VC:1195`) repeats the auto `set` and the reducer command with `--create-missing-anchors` (`VA:1120` to `VA:1124`). |

### Other facts the merge depends on

- **Census count.** REQ-004 says 10 research auto-only steps. `scratch/census-before.txt` now lists 11, because phase 003 added `step_apply_lifecycle_request` to research. Review stays at 4.
- **Rule 5 names the wrong branches.** The `if_failed` key (`RA:1128`, `VA:1127`) and the `if_failed_recoverable` and `if_failed_unrecoverable` pair (`RC:1136`, `RC:1170`, `VC:1204`, `VC:1238`) are divergent-pivot result branches, keyed on `pivot_result.status`. They are not the dispatch failure policy. The phase 002 failure policy is rule 1a of `step_check_convergence`, identical in both twins (`RA:875`, `RC:827`, `VA:846`, `VC:868`), plus the confirm-only `if_consecutive_failures` gate (`RC:892`, `VC:960`). `scratch/measure-workflows.sh:58-59` greps `if_failed[a-z_]*` and so counts the pivot branches as failure branches. The collision this creates is in section D.
- **Plan reference out of date.** `plan.md:99` places the confirm Retry, Skip or Cancel gate at `error_recovery.consecutive_failures` (`RC:1943`, `VC:2155`). Today that key is identical in both twins (`RA:2579`, `RC:2030`, `VA:2507`, `VC:2158`) and only points to rule 1a. The gate is `step_handle_convergence.if_consecutive_failures.gate_consecutive_failures` (`RC:894`, `VC:962`).
- **`--no-resource-map` is not a parsed difference.** The census counts a comment (`RA:429`, `VA:577`). Both twins of both commands bind `resource_map.emit: "{resource_map_emit}"` (`RA:431`, `RC:446`, `VA:579`, `VC:570`).
- **`confirm_parity.auto_corrections` already hold in both twins.** Research `step_resolve_session_id` is identical (`RA:396`, `RC:412`), and research `step_create_state_log` differs only by dry-run keys. Review `step_evaluate_results` is identical (`VA:2059`, `VC:1585`), and both review twins carry `step_stage_artifact_dir`.
- **`confirm_parity.step_addenda`.** `dispatch_lineage_guard` describes the PRE-DISPATCH RULE note. That note sits in `if_cli_codex.notes` (`RA:1901`, `VA:1691`), not in the cli-opencode branch that `VC:2205` names. Rule 2 runs the codex branch in both modes, so the guard now reaches confirm too. `dispatch_log_offsets` (`RC:2083`) describes `post_dispatch_validate.optional_jsonl_fields` (`RA:1922`), which rule 1 keeps for both modes.
- **`confirm_parity.gateway_wiring.auto_only_sites`.** The run-now sites (`RC:2080`) and `deep_review.recovery_baseline` (`VC:2203`) move into both modes with their steps and branch.
- **Review `lineage_mode`.** Rule 1 makes review `step_preflight_contract` require `lineage_mode` in confirm mode too. `review.md:17` and `review.md:74` bind `lineage_mode` before any workflow loads, so confirm runs pass. Checked by `grep -n lineage_mode .skilled/commands/deep/review.md`. The same check for `research.md` is NOT CHECKED, but research preflight already requires it in both twins (`RA:304`, `RC:260`).

---

## RESEARCH

### Research A. Step table

| step | twins | chosen body | what the merge adds or changes | evidence |
|------|-------|-------------|--------------------------------|----------|
| step_resolve_artifact_root | identical | auto | None. Read-only resolver call. | RA:180, RC:191 |
| step_bind_reducer_artifact_arg | identical | auto | None. | RA:198, RC:209 |
| step_apply_lifecycle_request | auto-only | auto | Rule 3: runs in both modes. Needs a NEW `dry_run_boundary: state-mutation` and halt event for REQ-006. Its `command` moves `{state_paths.packet_dir}` into the archive (`RA:251`), it runs before the first carried boundary (`step_fanout_spawn`), and no twin tags it, so rule 4 does not reach it. Its `instructions` (`RA:211`) say the restart flag is authorization "In auto mode" and need mode-neutral wording (rule 2). Consequence: confirm with `--restart` archives before the lock with no prompt. | RA:208, RC: absent |
| step_fanout_spawn | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: carry `dry_run_boundary: child-spawn` (`RC:222`) and its `dry_run_halt_event` (`RC:223`). | RA:265, RC:219 |
| step_fanout_spawn_cli (nested in step_fanout_spawn.sub_steps) | identical | auto | None. | RA:279, RC:235 |
| step_preflight_contract | differs | auto + `verify.dry_run_normalized` | `verify`: confirm inserts one item, `dry_run_normalized` (`RC:262`), saying the flag is boolean and an absent flag is false. Carry it under rule 4's first sentence. The key is outside rule 4's named list (section C). | RA:302, RC:258 |
| step_create_directories | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `dry_run_boundary: state-mutation` (`RC:270`), `dry_run_halt_event` (`RC:271`). | RA:311, RC:268 |
| step_detect_resource_map | identical | auto | None. | RA:315, RC:274 |
| step_resolve_canonical_names | identical | auto | None. | RA:326, RC:285 |
| step_acquire_lock | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | `on_acquire`: auto fails closed when `acquired=false` (`RA:346`). Confirm says stop and present recovery choices (`RC:307`) but lists none. Rule 7: the auto rule is the both-mode body, the confirm sentence goes to an `applies_to: confirm` note or `mode_overrides.confirm`. Rule 4: `dry_run_boundary: state-mutation` (`RC:304`), `dry_run_halt_event` (`RC:305`). | RA:342, RC:301 |
| step_classify_session | differs | auto + `on_resume.show_dashboard`, `ask`, `after_gate_refresh_lock`, `options`, `on_resume_choice`, `on_restart_choice`, `on_cancel_choice` | `classify.resume`: auto adds that missing wait-checkpoint fields read as `nextRunAt:null` and `remainingDelayMs:null` (`RA:368`), rule 1. `on_resume`: auto continues by rule with `gate3_classification`, `gate3_rationale`, `log`, a `resumed` `append_jsonl` and `skip_to: phase_loop` (`RA:376` to `RA:380`). Confirm shows the dashboard and asks resume, restart or cancel through `show_dashboard`, `ask`, `after_gate_refresh_lock`, `options`, `on_resume_choice` (`skip_to: gate_init_approval`, `RC:347`), `on_restart_choice` (archive inside the held lock, `RC:348`) and `on_cancel_choice` (`RC:395`). Rule 7: the ask and its three choices become an `applies_to: confirm` block, the auto body stays for both modes. Auto `on_restart` (`RA:381`) and `note_deferred_branches` (`RA:383`) stay. Confirm `on_resume.note` (`RC:399`) says the same as `note_deferred_branches` and drops. Rule 4: the tags inside `on_resume_choice` (`RC:341`, `RC:342`) and `on_restart_choice` (`RC:349`, `RC:350`) guard writes that exist only in the confirm block, so they ride inside it. That is the one place rule 4's "outside any applies_to block" cannot hold literally. The step sits after the `step_acquire_lock` boundary, so a dry run halts first. The confirm `on_resume_choice` row (`RC:346`) and the auto `resumed` row (`RA:379`) carry the same fields in a different order. | RA:360, RC:319 |
| step_resolve_session_id | identical | auto | None. Confirm `auto_corrections` item 1 already holds here. | RA:396, RC:412 |
| step_create_config | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | UNSETTLED: `populate.executionMode` is the literal `"auto"` in auto (`RA:434`) and `"confirm"` in confirm (`RC:449`), and neither literal is right for one file that serves both modes. An `rg` for `executionMode` over the runtime scripts, runtime lib and both mode folders (tests excluded) found no reader of this config field. Rule 4: `dry_run_boundary: state-mutation` (`RC:425`), `dry_run_halt_event` (`RC:426`). | RA:408, RC:423 |
| step_create_state_log | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `dry_run_boundary` (`RC:461`), `dry_run_halt_event` (`RC:462`). The `command` is identical. | RA:444, RC:459 |
| step_record_restarted_run | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `RC:523`, `RC:524`. | RA:501, RC:518 |
| step_create_strategy | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `RC:529`, `RC:530`. | RA:508, RC:527 |
| step_create_registry | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `RC:543`, `RC:544`. | RA:520, RC:541 |
| step_enrich_strategy_context | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `RC:551`, `RC:552`. | RA:525, RC:548 |
| step_enrich_strategy_resource_map | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `RC:558`, `RC:559`. | RA:531, RC:556 |
| step_detect_spec_present | differs | auto + `dry_run_event_policy` | Rule 4: `dry_run_event_policy` (`RC:564`), which previews the `spec_check_result` row and never appends it. | RA:536, RC:562 |
| gate_preinit_spec_mutation_approval | confirm-only | confirm | Marked `applies_to: confirm`. Rule 3. `on_A` proceeds to `step_preinit_spec_branch` (`RC:604`), the next step in both orders, so nothing is skipped. `on_C` cancels and releases the lock. | RA: absent, RC:578 |
| step_preinit_spec_branch | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | `branches.spec-just-created-by-this-run.note` exists only in auto (`RA:589`): treat an already-seeded `spec.md` as a no-op guard. Rule 1. Rule 4: `RC:610`, `RC:611`. | RA:551, RC:608 |
| step_validate_preinit_spec_doc | identical | auto | None. | RA:595, RC:653 |
| gate_init_approval | confirm-only | confirm | Marked `applies_to: confirm`. Rule 3. Routing hazard (section C): `on_A` sets `current_iteration: 1, current_segment: 1` and proceeds to `phase_loop` (`RC:686`). At its confirm position, before the auto-only `step_telemetry_heartbeat_started` and `step_init_complete`, that jump skips both in confirm mode. Placed after `step_init_complete` it skips nothing. | RA: absent, RC:660 |
| step_telemetry_heartbeat_started | auto-only | auto | Rule 3. Needs `state_paths.status_ledger` (`RA:153`, section B). UNSETTLED: the observability `producer` is the literal `'deep-research-auto'` (`RA:636`). Confirm has no heartbeat, so it offers no other value, and under rule 3 the literal would label confirm-mode rows too. Writes after the lock boundary, so an existing boundary halts a dry run first. | RA:601, RC: absent |
| step_init_complete | auto-only | auto | Rule 3. Same `set` as `gate_init_approval.on_A` (`RA:651`), idempotent. | RA:649, RC: absent |
| step_refresh_lock | identical | auto | None. | RA:662, RC:699 |
| step_check_max_duration | identical | auto | None. | RA:667, RC:704 |
| step_record_artifact_migration | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `RC:733`, `RC:734`. | RA:693, RC:730 |
| step_read_state | differs | auto | `extract`: auto has 13 fields confirm lacks: `resource_map_present` (`RA:720`), `resource_map_prompt_line` (`RA:721`), `lineage_context_prompt_line` (`RA:722`), `nextRunAt` (`RA:726`), `remainingDelayMs` (`RA:727`), and `rejected_patterns_count`, `rejected_candidate_matches`, `rejected_pattern_fuzzy_threshold`, `min_idea_observations`, `observed_ideas_count`, `promoted_ideas_count`, `promoted_ideas_list`, `suppressed_ideas_count` (`RA:737` to `RA:744`). Confirm has no field auto lacks, only another order. Rule 1. This removes the omission hazard of two auto-only steps (top notes). | RA:699, RC:738 |
| step_run_now_check | auto-only | auto | Rule 3. Needs `state_paths.run_now_sentinel` (`RA:158`). Stages `run_now_*` events through the gateway (`RA:750`), after the lock boundary. | RA:748, RC: absent |
| step_check_pause_sentinel | differs | auto + `if_exists.dry_run_event_policy` | Rule 4: `RC:778`. | RA:827, RC:774 |
| step_validate_convergence_config | differs | auto + `dry_run_event_policy` under three branches | Rule 4: under `if_min_iterations_missing` (`RC:789`), `if_min_iterations_clamped` (`RC:793`) and `if_convergence_mode_invalid` (`RC:797`). UNSETTLED: `if_convergence_mode_invalid.bookkeeping_log` names the field `"convergenceMode"` in auto (`RA:847`) and `"antiConvergence.convergenceMode"` in confirm (`RC:798`). Rule 1 would keep auto, but the confirm value is the key `step_create_config` writes (`RA:422`) and the value both review twins use (`VA:798`). | RA:838, RC:786 |
| step_graph_convergence | differs | auto + `dry_run_event_policy` | Rule 4: `RC:803`. | RA:850, RC:801 |
| step_check_convergence | identical | auto | None. Holds rule 1a, the phase 002 three-failure stop (`RA:875`, `RC:827`). | RA:868, RC:820 |
| step_emit_min_iterations_guard_pass | differs | auto + `if_pass.dry_run_event_policy` | Rule 4: `RC:887`. Order: auto runs this step before `step_emit_blocked_stop` (`RA:921`, `RA:927`), confirm after it (`RC:873`, `RC:884`). Rule 1 keeps the auto order. | RA:921, RC:884 |
| step_emit_blocked_stop | differs | auto + `if_blocked.dry_run_event_policy` | Rule 4: `RC:876`. Order as in the row above. | RA:927, RC:873 |
| step_handle_convergence | differs | auto + `if_consecutive_failures`, `gate_divergent_pivot_choice`, pivot `dry_run_boundary` and `dry_run_halt_event`, `if_stuck_recovery.dry_run_event_policy` | Section D walks every sub-key. In short: the whole `if_consecutive_failures` branch becomes `applies_to: confirm` (rule 6), the pivot steps take their dry-run tags (rule 4), `gate_divergent_pivot_choice` stays under rule 7 with the rule 5 collision left unsettled (section D), and `skip_to` targets and `if_continue.log` come from auto (rule 1). | RA:937, RC:890 |
| gate_consecutive_failures (nested in step_handle_convergence.if_consecutive_failures) | confirm-only | confirm | The whole parent branch `if_consecutive_failures` is marked `applies_to: confirm`. Rule 6. `on_A` Retry and `on_B` Skip proceed to `step_dispatch_iteration` (`RC:909`, `RC:910`). That skips `step_rejected_pattern_cache`, `step_ideas_backlog_lifecycle`, `step_normalize_pause_events`, `step_marker_scan` and `gate_pre_iteration`. The confirm twin already skipped the last three. The first two are auto-only steps that rule 3 now runs in confirm. `on_C` cancels with no synthesis (`RC:911`). | RA: absent, RC:894 |
| step_prepare_divergent_pivot (nested in step_handle_convergence.if_stop.if_divergent_eligible.steps) | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `dry_run_boundary: state-mutation` (`RC:924`), `dry_run_halt_event` (`RC:925`). | RA:948, RC:922 |
| step_dispatch_pivot_seat_001 (nested, same parent) | differs | auto + `dry_run_boundary` | Rule 4: `dry_run_boundary: dispatch` (`RC:979`). REQ-012 collapses the three seat pairs into one parameterized pair, which must keep one `dispatch` boundary. | RA:1000, RC:976 |
| step_record_pivot_seat_001 (nested, same parent) | identical | auto | None. | RA:1019, RC:996 |
| step_dispatch_pivot_seat_002 (nested, same parent) | differs | auto + `dry_run_boundary` | Rule 4: `RC:1013`. | RA:1033, RC:1010 |
| step_record_pivot_seat_002 (nested, same parent) | identical | auto | None. | RA:1052, RC:1030 |
| step_dispatch_pivot_seat_003 (nested, same parent) | differs | auto + `dry_run_boundary` | Rule 4: `RC:1047`. | RA:1066, RC:1044 |
| step_record_pivot_seat_003 (nested, same parent) | identical | auto | None. | RA:1085, RC:1064 |
| step_finalize_divergent_pivot (nested, same parent) | identical | auto | None. | RA:1099, RC:1078 |
| step_resolve_divergent_pivot_result (nested, same parent) | identical | auto | None. | RA:1111, RC:1090 |
| step_apply_divergent_pivot_result (nested, same parent) | auto-only | auto | Rules 3 and 7: the both-mode body. `if_completed` sets `next_focus`, `pivot_lineage` and `saturated_directions`, reruns the research reducer (`RA:1125`) and proceeds to `step_rejected_pattern_cache` (`RA:1127`). `if_failed` (`RA:1128`) logs and skips to `phase_synthesis`. The rule 5 collision is unsettled (section D). Hazard: if this step and the confirm gate both run, the `set` and reducer run twice. | RA:1117, RC: absent |
| gate_divergent_pivot_choice (nested, same parent) | confirm-only | confirm | Marked `applies_to: confirm`. Rule 7. Branch detail in section D. Routing hazard: `if_completed.on_A` and `if_failed_recoverable.on_B` proceed to `gate_pre_iteration` (`RC:1128`, `RC:1165`), which skips the auto-only `step_rejected_pattern_cache` and `step_ideas_backlog_lifecycle` in confirm mode. The auto step proceeds to `step_rejected_pattern_cache` instead. | RA: absent, RC:1096 |
| step_rejected_pattern_cache | auto-only | auto | Rule 3. Its omission hazard is gone under rule 1 (top notes). `if_all_candidates_suppressed` halts and releases the lock, now in confirm too. | RA:1144, RC: absent |
| step_ideas_backlog_lifecycle | auto-only | auto | Rule 3. Same as the row above. No write key. | RA:1188, RC: absent |
| step_normalize_pause_events | identical | auto | None. | RA:1210, RC:1188 |
| step_marker_scan | identical | auto | None. | RA:1220, RC:1198 |
| gate_pre_iteration | confirm-only | confirm | Marked `applies_to: confirm`. Rule 3. `on_A` and `on_B` proceed to `step_dispatch_iteration` (`RC:1239`, `RC:1240`), the next step. `on_C` records `manualStop` (`RC:1243`) and proceeds to `gate_pre_synthesis` (`RC:1245`), skipping `step_fanout_merge` and `step_hydrate_summary_metrics`, as the confirm twin already does. | RA: absent, RC:1218 |
| step_dispatch_iteration | differs | auto + `dry_run_boundary`, `dry_run_preview`, `dry_run_halt_event`, `pre_dispatch.render_prompt_pack.dry_run_output`, the `pre_dispatch_audit.skip_when` clause | Section D walks every sub-key. | RA:1240, RC:1248 |
| step_run_now_restore_check | auto-only | auto | Rule 3. Uses `run_now_sentinel`. Writes after the dispatch boundary. | RA:1950, RC: absent |
| step_check_executor_unavailable | identical | auto | None. | RA:2006, RC:1487 |
| step_reduce_state | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | `outputs`: auto lists six, adding `question_conflict` and `idea_promoted` events and the idea lifecycle fields (`RA:2028`), confirm lists three (`RC:1511`). `failure_modes.question_conflict` exists only in auto (`RA:2039`). The reducer `command` is identical, so both are documentation. Rule 1. Rule 4: `dry_run_boundary: reducer-refresh` (`RC:1504`), `dry_run_halt_event` (`RC:1505`). | RA:2021, RC:1502 |
| step_graph_upsert | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `RC:1523`, `RC:1524`. | RA:2042, RC:1521 |
| step_refresh_lineage_context | auto-only | auto | Rule 3. Read-only. Feeds `lineage_context_prompt_line`, which rule 1's `generate_summary` renders. | RA:2127, RC: absent |
| step_evaluate_results | identical | auto | None. Appends the iteration error row in both twins (`RA:2171`). | RA:2143, RC:1608 |
| gate_post_iteration | confirm-only | confirm | Marked `applies_to: confirm`. Rule 3. Routing hazard: `on_A` and `on_B` proceed to `step_update_tracking` (`RC:1663`, `RC:1664`). At its confirm position, right after `step_evaluate_results`, the jump skips the auto-only `step_telemetry_heartbeat_progress`. Placed after that step it skips nothing. `on_C` records `manualStop` (`RC:1667`) and proceeds to `gate_pre_synthesis`. | RA: absent, RC:1637 |
| step_telemetry_heartbeat_progress | auto-only | auto | Rule 3. Same unsettled `producer` literal as `step_telemetry_heartbeat_started` (`RA:2236`). | RA:2173, RC: absent |
| step_update_tracking | differs | auto | `log` exists only in auto (`RA:2253`): it reports `newInfoRatio` and the findings count. Rule 1. | RA:2249, RC:1672 |
| step_loop_decision | identical | auto | None. | RA:2255, RC:1677 |
| step_fanout_merge | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `dry_run_boundary: reducer-refresh` (`RC:1695`), `dry_run_halt_event` (`RC:1696`). | RA:2266, RC:1692 |
| step_hydrate_summary_metrics | identical | auto | None. | RA:2276, RC:1704 |
| gate_pre_synthesis | confirm-only | confirm | Marked `applies_to: confirm`. Rule 3. `on_A` proceeds to `step_read_all_iterations` (`RC:1753`), the next step. `on_B` returns to `phase_loop`. | RA: absent, RC:1731 |
| step_read_all_iterations | identical | auto | None. | RA:2302, RC:1757 |
| step_emit_resource_map | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `dry_run_boundary: reducer-refresh` (`RC:1768`), `dry_run_halt_event` (`RC:1769`). | RA:2311, RC:1766 |
| step_compile_research | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | `instructions`: auto adds one item to each of its two branches: if `resource_map_present` is true, cite `{spec_folder}/resource-map.md` in References (`RA:2331` block). Rule 1. Rule 4: `RC:1788`, `RC:1789`. | RA:2329, RC:1786 |
| step_convergence_report | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `RC:1811`, `RC:1812`. | RA:2352, RC:1809 |
| gate_post_synthesis_spec_writeback | confirm-only | confirm | Marked `applies_to: confirm`. Rule 3. `on_C` defers write-back with a `spec_synthesis_deferred` row and proceeds to `step_update_config_status` (`RC:1877`), which skips nothing auto-only. Its own `dry_run_event_policy` (`RC:1878`) guards a write that exists only in this gate, so it stays inside it. | RA: absent, RC:1850 |
| step_writeback_spec_findings | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | `instructions`: auto adds a fifth item, emit `spec_synthesis_deferred` instead of partial output when write-back is unsafe (`RA:2404` list). Rule 1. Rule 4: `RC:1884`, `RC:1885`. | RA:2391, RC:1882 |
| step_validate_post_synthesis_spec_doc | identical | auto | None. | RA:2412, RC:1904 |
| step_update_config_status | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `RC:1910`, `RC:1911`. | RA:2417, RC:1908 |
| step_telemetry_heartbeat_terminal | auto-only | auto | Rule 3. Same unsettled `producer` literal as `step_telemetry_heartbeat_started` (`RA:2493`). | RA:2422, RC: absent |
| step_stage_artifact_dir | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | `command`: auto stages `{state_paths.packet_dir}` (`RA:2509`), confirm `{state_paths.artifact_dir}` (`RC:1920`). `state_paths` defines `packet_dir` (`RA:150`) and has no `artifact_dir` key, so the confirm placeholder does not resolve. Rule 1. `note`: confirm adds the label "(028)" to the same text (`RC:1921`). Rule 1. Rule 4: `RC:1918`, `RC:1919`. | RA:2506, RC:1915 |
| gate_post_synthesis | confirm-only | confirm | Marked `applies_to: confirm`. Rule 3. `on_A` proceeds to `phase_save` (`RC:1945`). `on_C` proceeds to `completion` (`RC:1947`), which skips `phase_save` and its `step_release_lock`. That is existing confirm behavior. Whether the lock is released elsewhere on that path is NOT CHECKED. | RA: absent, RC:1925 |
| step_compose_save_payload | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `RC:1958`, `RC:1959`. | RA:2520, RC:1956 |
| step_generate_context | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `RC:1976`, `RC:1977`. | RA:2537, RC:1974 |
| step_verify_save | identical | auto | None. | RA:2542, RC:1981 |
| step_release_lock | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `RC:1988`, `RC:1989`. | RA:2547, RC:1986 |

### Research B. Top-level keys

| key | exact difference | proposed merged form |
|-----|------------------|----------------------|
| `purpose` | Auto "Iterative deep research with convergence detection" (`RA:21`). Confirm adds "and user approval gates" (`RC:7`). | Auto value at top level, confirm value in `mode_overrides.confirm.purpose`. |
| `action` | Auto "Run deep-research loop from initialization through synthesis" (`RA:22`). Confirm "Run deep-research loop with user confirmation at each phase transition" (`RC:8`). | Auto value, confirm value in `mode_overrides.confirm.action`. |
| `operating_mode` | `workflow_execution`: `autonomous` (`RA:26`) against `interactive` (`RC:12`). `approvals`: `none` (`RA:27`) against `multi_gate` (`RC:13`). Other fields identical. | Auto values, confirm values in `mode_overrides.confirm`. |
| `operating_principles` | `approach`: "evaluate convergence, repeat or stop" (`RA:36`) against "show results, get approval, repeat or stop" (`RC:22`). `mandate`: confirm appends "Pause for user at each gate." (`RC:23`). | Auto values, confirm values in `mode_overrides.confirm`. |
| `rules` | `ALWAYS`: auto-only `refresh_lineage_context_before_next_prompt` (`RA:2586` list), confirm-only `pause_at_approval_gates` and `present_clear_options_at_each_gate` (`RC:2040` list). `NEVER`: auto-only `proceed_without_state_file_verification` (`RA:2594` list), confirm-only `proceed_past_approval_gate_without_user_response` and `auto_approve_on_behalf_of_user` (`RC:2049` list). `DRY_RUN_OVERRIDES` exists only in confirm (`RC:2037`). | Auto lists at top level, keeping `refresh_lineage_context_before_next_prompt` because rule 3 now runs that step in both modes. The four approval items go to `mode_overrides.confirm`. `DRY_RUN_OVERRIDES` at top level for both modes (rule 4 first sentence, key not in rule 4's named list). |
| `error_recovery` | `agent_dispatch_timeout`: auto marks the iteration `timeout` and continues (`RA:2577`), confirm shows it to the user for a decision (`RC:2028`). `state_file_missing`: auto says "during loop" (`RA:2578`, `RC:2029`). `continuity_save_failure`: "Log warning" (`RA:2580`) against "Inform user" (`RC:2031`). `consecutive_failures` identical. | `agent_dispatch_timeout` under rule 7: auto rule for both modes, the confirm ask as `mode_overrides.confirm` wording. The other two are wording: auto value, confirm wording in `mode_overrides.confirm`. |
| `user_inputs` | Confirm adds `dry_run` (`RC:36`). | Union (rule 4). |
| `state_paths` | Auto adds `status_ledger` (`RA:153`) and `run_now_sentinel` (`RA:158`). | Auto block. The heartbeat and run-now steps that rule 3 runs in both modes need both paths. |
| `state_write_protocol` | `pinned_bookkeeping.events`: auto `config_warning, graph_convergence, lock_released, schema_mismatch, maxDurationReached` (`RA:113`). Confirm adds `manualStop` and `pivot_confirm_accepted` (`RC:129`). `contract`: auto lists the run-now sentinels and the restored-sentinel row among the canonical ledger events (`RA:116` block), confirm drops them (`RC:132` block). | `events`: union, because the kept confirm gates emit both through `bookkeeping_log` (`RC:1122`, `RC:1133`, `RC:1243`, `RC:1667`). `contract`: auto (rules 1 and 3). Separate flag, not a twin difference: `state_write_protocol.applies_to` (`RA:110`, `RC:126`) reuses the key name of the new mode marker with the value "every append_to_jsonl and append_jsonl directive in this workflow". A guard that looks for `applies_to` blocks must tell the two apart. |
| `reference_only_appendix` | Auto adds `wave_orchestration` (`RA:2611`). | Auto block. |
| `confirm_parity` | Confirm-only (`RC:2064` to `RC:2086`). | Drop. With every step present once, the omission census has no subject. Each entry is dispositioned in the top notes. |
| `dry_run_control` | Confirm-only (`RC:41` to `RC:65`). Its own field `applies_to: "confirm workflow"` (`RC:44`). | Carry at top level outside any `applies_to` block (rule 4). The `applies_to: "confirm workflow"` field must change, because dry run now runs in both modes and the key name collides with the mode marker. |
| `workflow.phase_loop.purpose` | "Dispatch agent iterations until convergence" (`RA:657`) against "with approval at each step" (`RC:694`). | Auto value, confirm wording in `mode_overrides.confirm`. |
| `workflow.phase_save.purpose` | "Preserve research context in the packet's canonical continuity documents" (`RA:2517`) against "in packet continuity" (`RC:1953`). | Auto value (rule 1). |
| `workflow.completion.message` | Last artifact line: "Continuity update routed into the canonical spec document" (`RA:2556` block) against "Memory context saved" (`RC:1997` block). | Auto value (rule 1). |
| New keys | Neither twin has `execution_mode` or `mode_overrides`. | Add both after `speckit-plan.yaml:16-37`. Not a twin difference. |

### Research C. Behavior only one twin had

Each item would be lost or silently defeated if the merge just took the auto body.

1. **Confirm-only write containment in `if_cli_opencode`.** Confirm snapshots out-of-scope dirty paths before dispatch and calls `enforceWriteContainment` after it, reporting violations and contested paths (`RC:1348`, `RC:1390`, `RC:1403`, `RC:1419`). The auto opencode branch (`RA:1690` to `RA:1768`) has none of it, although auto's cursor, devin, pi and codex branches do (`RA:1384`, `RA:1485`, `RA:1586`, `RA:1783`). Unsettled, see Research D `if_cli_opencode.command`.
2. **Confirm-only pivot override.** `gate_divergent_pivot_choice.if_failed_recoverable` (`RC:1136`) lets the operator name an accepted candidate with a rationale and appends `pivot_override_accepted` (`RC:1157`, `RC:1159`). Auto fails closed to synthesis on every failed pivot (`RA:1128`). Rule 7 keeps it as an `applies_to: confirm` block, which collides with rule 5 (unsettled, section D).
3. **Confirm-only pivot approval.** `gate_divergent_pivot_choice.if_completed` asks accept, an unavailable ranked choice, or `manualStop` (`RC:1100`, `RC:1122`, `RC:1133`). Auto adopts the pivot with no event (`RA:1120`). Rule 7 keeps it.
4. **Confirm-only interactive resume and restart.** `step_classify_session.on_resume` asks resume, restart or cancel (`RC:333` to `RC:398`). Its `on_restart_choice` archives every child of `packet_dir` except the lock file while the lock is held (`RC:389`). Auto archives the whole `packet_dir` before the lock, only on `--restart` (`RA:251`). Rule 7 keeps the confirm block.
5. **Confirm-only Retry, Skip or Cancel gate.** `if_consecutive_failures` with `gate_consecutive_failures` (`RC:892` to `RC:912`). Rule 6 keeps it. The whole branch must be confirm-only (section D).
6. **Confirm dry-run wiring outside rule 4's named keys.** `user_inputs.dry_run` (`RC:36`), `rules.DRY_RUN_OVERRIDES` (`RC:2037`), `step_preflight_contract.verify.dry_run_normalized` (`RC:262`), `step_dispatch_iteration.pre_dispatch.render_prompt_pack.dry_run_output` (`RC:1279`), the `or dry_run == true` clause in `step_dispatch_iteration.pre_dispatch_audit.skip_when` (`RC:1299`) and `gate_post_synthesis_spec_writeback.on_C.dry_run_event_policy` (`RC:1878`). A merge that copies only `dry_run_boundary`, `dry_run_halt_event`, `dry_run_preview`, `dry_run_event_policy` and `dry_run_control` drops the first five.
7. **Accurate `config_warning` field name.** Confirm logs `"antiConvergence.convergenceMode"` (`RC:798`), the key written at `RA:422`. Auto logs `"convergenceMode"` (`RA:847`). Unsettled, see Research A `step_validate_convergence_config`.
8. **Pinned bookkeeping events for the kept gates.** `manualStop` and `pivot_confirm_accepted` (`RC:129`). Without the union the gates' `bookkeeping_log` rows fall outside the pinned list.
9. **Fixed Claude permission mode.** Confirm always passes `--permission-mode acceptEdits` (`RC:1325`). Auto maps `sandboxMode` through `resolveClaudePermissionMode` (`RA:1335`), which returns `plan` for `read-only` and `bypassPermissions` for `danger-full-access` (`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:596-604`). Rule 1 settles it. Listed because confirm runs with a `sandboxMode` set change behavior.
10. **Confirm-only interactive wording settled by rule 7.** `step_acquire_lock.on_acquire` "stop and present recovery choices" (`RC:307`) and `error_recovery.agent_dispatch_timeout` "show to user for decision" (`RC:2028`).
11. **Gate routing that would silently defeat rule 3 in confirm mode.** Each confirm jump target was written for a file without the auto-only steps:
    - `gate_init_approval.on_A` to `phase_loop` (`RC:686`) skips `step_telemetry_heartbeat_started` and `step_init_complete` when the gate keeps its confirm position.
    - `gate_post_iteration.on_A` and `on_B` to `step_update_tracking` (`RC:1663`, `RC:1664`) skip `step_telemetry_heartbeat_progress` when the gate keeps its confirm position.
    - `gate_divergent_pivot_choice.if_completed.on_A` and `if_failed_recoverable.on_B` to `gate_pre_iteration` (`RC:1128`, `RC:1165`) skip `step_rejected_pattern_cache` and `step_ideas_backlog_lifecycle` at any position.
    - `gate_consecutive_failures.on_A` and `on_B` to `step_dispatch_iteration` (`RC:909`, `RC:910`) skip the same two steps at any position.
12. **Auto-only `step_apply_lifecycle_request` has no dry-run tag in either twin.** It is reachable before the first boundary (`RA:208`, `RA:251`). REQ-006 needs a NEW tag that rule 4 cannot carry.

### Research D. The two largest differing steps

#### `step_dispatch_iteration` (RA:1240, RC:1248)

| sub-key | difference | merged form |
|---------|------------|-------------|
| `dry_run_boundary` | Confirm only, `dispatch` (`RC:1258`). | Carry (rule 4). |
| `dry_run_preview` | Confirm only (`RC:1259`): before halting, generate the state summary, render the prompt pack to terminal preview without writing it, and show the executor branch and command that would run. | Carry (rule 4). |
| `dry_run_halt_event` | Confirm only (`RC:1264`). | Carry (rule 4). |
| `pre_dispatch.generate_summary` | Auto adds the `{resource_map_prompt_line}` and `{lineage_context_prompt_line}` lines (`RA:1254`), confirm lacks both (`RC:1269`). | Auto (rule 1). Rule 1's `step_read_state` extracts both. |
| `pre_dispatch.render_prompt_pack.dry_run_output` | Confirm only (`RC:1279`): render in memory and print to preview, never write `output_path`. | Carry (rule 4 first sentence, key outside its named list). |
| `pre_dispatch_audit.skip_when` | Auto `config.executor.kind == 'native'` (`RA:1285`). Confirm adds `or dry_run == true` (`RC:1299`). | Auto plus the confirm clause (rule 4 first sentence). |
| `if_native` | Identical (`RA:1292`, `RC:1306`). | Auto. |
| `if_cli_deepseek_harness` | Auto only (`RA:1299`): fails closed with exit 2 because this executor runs only as a fan-out lineage. | Keep (rule 2). |
| `if_cli_claude_code.command` | Auto runs `claude` through `runAuditedExecutorCommand` with dispatch receipts, maps `sandboxMode` to the permission mode and adds `--effort` itself (`RA:1310`, `RA:1335`, `RA:1340`). Confirm shells `claude -p` directly with fixed `acceptEdits` and no receipt (`RC:1314`, `RC:1325`). | Auto (rule 1). Behavior change for confirm, section C item 9. |
| `if_cli_claude_code.render_hint` | Confirm only, `optional_effort_flag` (`RC:1331`). | Drops with the confirm command. Auto handles effort in code (`RA:1340`). |
| `if_cli_claude_code.notes` | As sets: auto-only "sandboxMode maps to permission-mode" (`RA:1373`), confirm-only "default permission-mode is plan, we override to acceptEdits" (`RC:1336`). | Auto (rule 1). |
| `if_cli_cursor`, `if_cli_devin`, `if_cli_pi`, `if_cli_codex` | Auto only (`RA:1376`, `RA:1477`, `RA:1578`, `RA:1769`). Each carries write containment. Codex notes carry the PRE-DISPATCH RULE (`RA:1901`). | Keep, outside any `applies_to` (rule 2, REQ-003). |
| `record_executor_audit` | Identical body. Position differs: auto between `if_cli_pi` and `if_cli_opencode` (`RA:1681`), confirm after `post_dispatch_validate` (`RC:1477`). | Auto (rule 1). |
| `if_cli_opencode.command` | Both build the command with `buildLineageCommand` and run it through `runAuditedExecutorCommand`. Confirm also imports and calls `snapshotOutOfScopeDirtyPaths` before dispatch and `enforceWriteContainment` after it, printing advisory violations and contested paths, then exits with the dispatch status (`RC:1340`, `RC:1390`, `RC:1403`, `RC:1419`). Auto has no containment in this branch (`RA:1691`). | UNSETTLED: the auto opencode branch has no write containment (`RA:1691`), while the confirm branch snapshots dirty paths before dispatch and calls `enforceWriteContainment` after it (`RC:1390`, `RC:1403`). Rule 1 would drop the confirm containment for both modes, although the other four auto CLI branches do contain writes. |
| `if_cli_opencode.notes` | As sets: auto-only notes on the route-proof preamble and the `reasoningEffort` mapping (`RA:1765`, `RA:1766`). Confirm-only notes on structural write containment and the `</dev/null` requirement (`RC:1436`, `RC:1440`). | Follows the command decision above. |
| `post_dispatch_validate.optional_jsonl_fields` | Auto only (`RA:1922`): `logOffset`, `logSize`, `logPath`, `skippedCount`, `slotDurationMs`. | Auto (rule 1). |
| `post_dispatch_validate.on_failure` and the rest | Identical (`RA:1931`, `RC:1459`). No `if_failed` key exists in this step. | Auto. |

#### `step_handle_convergence` (RA:937, RC:890)

| sub-key | difference | merged form |
|---------|------------|-------------|
| `if_consecutive_failures` | Confirm only (`RC:892`). `when` (`RC:893`) says it runs when `stop_decision.reasonDetail == 'consecutiveFailures'` and runs instead of `if_stop`. It holds `gate_consecutive_failures` (`RC:894`) with Retry, Skip and Cancel, and a `note` that the count is rebuilt from the state log (`RC:912`). | Rule 6: the whole branch, `when` included, is marked `applies_to: confirm`. Marking only the inner gate would leave the outer `when` diverting auto runs away from `if_stop` to a gate auto skips. In auto the same stop falls through `if_stop` to `if_existing_terminal_path` and synthesis, because `error` is an excluded pivot reason (`RA:945`). |
| `if_stop.if_divergent_eligible.steps.step_prepare_divergent_pivot` | Confirm adds `dry_run_boundary` and `dry_run_halt_event` (`RC:924`, `RC:925`). | Carry (rule 4). |
| `...steps.step_dispatch_pivot_seat_001/002/003` | Confirm adds `dry_run_boundary: dispatch` (`RC:979`, `RC:1013`, `RC:1047`). | Carry (rule 4), one tag on the REQ-012 parameterized seat step. |
| `...steps.step_apply_divergent_pivot_result` | Auto only (`RA:1117`): `if_completed` (`RA:1120`) adopts the pivot, reruns the reducer and proceeds to `step_rejected_pattern_cache`. `if_failed` (`RA:1128`) fails closed to `phase_synthesis`. | Both-mode body (rules 3 and 7). |
| `...steps.gate_divergent_pivot_choice` | Confirm only (`RC:1096`). `if_completed` (`RC:1100`): accept with `pivot_confirm_accepted` and proceed to `gate_pre_iteration`, an unavailable ranked choice, or `manualStop` to `gate_pre_synthesis`. `if_failed_recoverable` (`RC:1136`), when `recoverableByOverride` is true and the agreement reason is `insufficient_endorsement`: fail closed, operator override with `pivot_override_accepted`, or `manualStop`. `if_failed_unrecoverable` (`RC:1170`): log and skip to `gate_pre_synthesis`. | Rule 7: `applies_to: confirm`. UNSETTLED: rule 7 keeps auto `if_failed` as the both-mode body and this gate as a confirm block, so `if_failed` and the `if_failed_recoverable` and `if_failed_unrecoverable` pair both remain, which rule 5 and REQ-005 forbid. Auto `if_failed` fails closed on every failed pivot. Confirm `if_failed_recoverable` offers an override on one failure class, and `if_failed_unrecoverable` fails closed on the rest. Placement also decides whether the confirm gate preempts the auto step or both run (double apply, top notes). |
| `if_stop.if_divergent_eligible.on_error` | `log` says "existing synthesis path" (`RA:1132`) against "existing pre-synthesis gate" (`RC:1175`). `skip_to: phase_synthesis` (`RA:1133`) against `gate_pre_synthesis` (`RC:1176`). | Auto (rule 1). Confirm mode then runs `step_fanout_merge` (self-skips without fan-out) and `step_hydrate_summary_metrics` before it reaches `gate_pre_synthesis`. |
| `if_stop.if_existing_terminal_path.skip_to` | `phase_synthesis` (`RA:1136`) against `gate_pre_synthesis` (`RC:1179`). | Auto (rule 1), same consequence. |
| `if_stop.branch_on`, `eligibility_contract` | Identical. | Auto. |
| `if_stuck_recovery.dry_run_event_policy` | Confirm only (`RC:1181`). | Carry (rule 4). |
| `if_stuck_recovery` other keys | Identical (`RA:1137`). | Auto. |
| `if_continue.log` | Auto "Continuing. Focus: {next_focus}" (`RA:1142`), confirm "Continuing." (`RC:1186`). | Auto (rule 1). |

---

## REVIEW

### Review A. Step table

Review confirm carries only 7 dry-run keys, all in `phase_loop`. Rows below name a NEW tag by analogy with the research step of the same name. A review step with no research namesake is classified from its own write keys (`command`, `bash`, `append_jsonl`, `write`, `output`, `edit`) and says "no research namesake".

| step | twins | chosen body | what the merge adds or changes | evidence |
|------|-------|-------------|--------------------------------|----------|
| step_resolve_artifact_root | identical | auto | None. Read-only resolver call. | VA:157, VC:156 |
| step_bind_reducer_artifact_arg | identical | auto | None. | VA:175, VC:174 |
| step_apply_lifecycle_request | auto-only | auto | Rule 3. Same as research: its `command` moves `{state_paths.packet_dir}` (`VA:228`) before any boundary, untagged in both twins. NEW `state-mutation` tag for REQ-006. Instructions need mode-neutral wording. | VA:185, VC: absent |
| step_fanout_spawn | identical | auto | NEW `dry_run_boundary: child-spawn` and halt event, by analogy with research (`RC:222`). | VA:242, VC:184 |
| step_fanout_spawn_cli (nested in step_fanout_spawn.sub_steps) | identical | auto | None. | VA:264, VC:206 |
| step_preflight_contract | differs | auto | `verify.required_values_present`: auto includes `lineage_mode` (`VA:292`), confirm does not (`VC:234`). Rule 1. `review.md:17` and `review.md:74` bind it in both modes. NEW `dry_run_normalized` item by analogy (`RC:262`). | VA:289, VC:231 |
| step_create_directories | identical | auto | NEW `state-mutation` tag by analogy (`RC:270`). Its `command` (`VA:300`) creates directories. | VA:298, VC:240 |
| step_detect_resource_map | identical | auto | None. | VA:302, VC:244 |
| step_migrate_legacy_review_state | identical | auto | No research namesake. Its `command` (`VA:348`) runs `mkdir -p` and `mv` on legacy scratch files. NEW `state-mutation` tag. | VA:313, VC:255 |
| step_acquire_lock | differs | auto | `on_acquire`: auto fails closed (`VA:366`), confirm stops and presents recovery choices (`VC:308`). Rule 7, as in research. NEW `state-mutation` tag by analogy (`RC:304`). | VA:362, VC:304 |
| step_classify_session | differs | auto + `on_resume.show_dashboard`, `ask`, `after_gate_refresh_lock`, `options`, `on_resume_choice`, `on_restart_choice`, `on_cancel_choice` | `lifecycle_routing` exists only in auto (`VA:395`): a restart was archived by `step_apply_lifecycle_request`, so the session runs `on_fresh`. `on_resume`: auto adds `before_append`, `log`, a `deep_review.run_resumed` `append_jsonl` and `skip_to: phase_loop` (`VA:399` to `VA:402`). Confirm has `show_dashboard`, `ask`, `after_gate_refresh_lock`, `options`, `on_resume_choice`, `on_restart_choice` (archive at `VC:389`), `on_cancel_choice` and `note` (`VC:336` to `VC:399`). Auto-only `on_restart` and `note_deferred_branches` (`VA:403`, `VA:405`). Rule 7: confirm ask and choices become `applies_to: confirm`, the auto body serves both modes. NEW `state-mutation` tags on `on_resume_choice` and `on_restart_choice` by analogy (`RC:341`, `RC:349`), riding inside the confirm block as in research. | VA:380, VC:320 |
| step_scope_discovery | differs | auto | No research namesake. `resolve.spec-folder`: auto also reads `goal-file-manifest.txt`, validates each path and fails before dispatch on a bad entry (`VA:465`). Confirm only discovers files from the spec docs (`VC:459`). Rule 1. No write key. | VA:462, VC:456 |
| step_order_dimensions | differs | auto | No research namesake. `algorithm`: auto adds a step that reserves a traceability pass to cross-check `target_files` against `resource-map.md` when `resource_map_present` (`VA:497` block). Rule 1. No write key. | VA:495, VC:487 |
| step_normalize_review_dimensions | identical | auto | No research namesake. No write key. | VA:511, VC:502 |
| step_normalize_review_focus | identical | auto | No research namesake. No write key. | VA:523, VC:514 |
| step_resolve_session_id | identical | auto | None. | VA:531, VC:522 |
| step_create_config | differs | auto | UNSETTLED: `populate.executionMode` is the literal `"auto"` in auto (`VA:583`) and `"confirm"` in confirm (`VC:574`), and neither literal is right for one file that serves both modes. NEW `state-mutation` tag by analogy (`RC:425`). | VA:541, VC:532 |
| step_create_state_log | differs | auto | `command` passes its own workflow path into the run-open event: `deep-review-auto.yaml` (`VA:631`) against `deep-review-confirm.yaml` (`VC:622`). Both become `deep-review.yaml` (REQ-001, REQ-008). NEW tag by analogy (`RC:461`). | VA:586, VC:577 |
| step_record_restarted_run | identical | auto | NEW tag by analogy (`RC:523`). Writes through `append_jsonl` (`VA:641`). | VA:638, VC:629 |
| step_create_findings_registry | identical | auto | NEW `state-mutation` tag by analogy with research `step_create_registry` (`RC:543`), a different name. Writes `output` (`VA:646`). | VA:643, VC:634 |
| step_create_strategy | identical | auto | NEW tag by analogy (`RC:529`). | VA:648, VC:639 |
| step_seed_coverage_graph | identical | auto | No research namesake. Its `bash` (`VA:672`) runs `upsert.cjs`, a graph write. NEW `state-mutation` tag. | VA:662, VC:653 |
| step_enrich_strategy_context | identical | auto | NEW tag by analogy (`RC:551`). | VA:681, VC:672 |
| step_enrich_strategy_resource_map | identical | auto | NEW tag by analogy (`RC:558`). | VA:687, VC:678 |
| gate_init_approval | confirm-only | confirm | Marked `applies_to: confirm`. Rule 3. Routing hazard: `on_A` sets `current_iteration: 1` and zero counts then proceeds to `phase_loop` (`VC:712`). At its confirm position, before `step_init_complete`, the jump skips that step. Placed after it, nothing is skipped. | VA: absent, VC:684 |
| step_init_complete | auto-only | auto | Rule 3. Same `set` as the gate (`VA:694`), idempotent. | VA:692, VC: absent |
| step_refresh_lock | identical | auto | None. | VA:705, VC:725 |
| step_check_max_duration | identical | auto | None. Its research namesake is also untagged. | VA:710, VC:730 |
| step_record_artifact_migration | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `dry_run_boundary: state-mutation` (`VC:759`), `dry_run_halt_event` (`VC:760`). Today this is review confirm's first boundary, so all of review `phase_init` writes before any dry-run halt. | VA:736, VC:756 |
| step_read_state | identical | auto | None. | VA:742, VC:764 |
| step_check_pause_sentinel | identical | auto | No tag needed. Unlike research, its `if_exists` only sets fields and skips to `step_normalize_pause_events` (`VA:786` to `VA:791`), with no append. | VA:783, VC:805 |
| step_validate_convergence_config | identical | auto | NEW `dry_run_event_policy` on `if_convergence_mode_invalid`, by analogy (`RC:797`). Its `bookkeeping_log` (`VA:798`) already names `antiConvergence.convergenceMode`. | VA:795, VC:817 |
| step_graph_convergence | identical | auto | NEW `dry_run_event_policy` by analogy (`RC:803`). Appends at `VA:814`. | VA:801, VC:823 |
| step_check_convergence | identical | auto | None. Holds rule 1a (`VA:846`, `VC:868`). | VA:839, VC:861 |
| step_emit_blocked_stop | identical | auto | NEW `if_blocked.dry_run_event_policy` by analogy (`RC:876`). Appends at `VA:931`. | VA:928, VC:950 |
| step_handle_convergence | differs | auto + `if_consecutive_failures`, `gate_divergent_pivot_choice`, pivot `dry_run_boundary` and `dry_run_halt_event` | Section D walks every sub-key. | VA:936, VC:958 |
| gate_consecutive_failures (nested in step_handle_convergence.if_consecutive_failures) | confirm-only | confirm | The whole parent branch `if_consecutive_failures` is marked `applies_to: confirm`. Rule 6. `on_A` Retry and `on_B` Skip proceed to `step_dispatch_iteration` (`VC:977`, `VC:978`), skipping `step_normalize_pause_events`, the auto-only `step_generate_state_summary`, `step_marker_scan` and `gate_pre_iteration`. `on_C` cancels with no synthesis (`VC:979`). | VA: absent, VC:962 |
| step_prepare_divergent_pivot (nested in step_handle_convergence.if_stop.if_divergent_eligible.steps) | differs | auto + `dry_run_boundary`, `dry_run_halt_event` | Rule 4: `VC:992`, `VC:993`. | VA:947, VC:990 |
| step_dispatch_pivot_seat_001 (nested, same parent) | differs | auto + `dry_run_boundary` | Rule 4: `dispatch` (`VC:1047`). One tag on the REQ-012 parameterized step. | VA:999, VC:1044 |
| step_record_pivot_seat_001 (nested, same parent) | identical | auto | None. | VA:1018, VC:1064 |
| step_dispatch_pivot_seat_002 (nested, same parent) | differs | auto + `dry_run_boundary` | Rule 4: `VC:1081`. | VA:1032, VC:1078 |
| step_record_pivot_seat_002 (nested, same parent) | identical | auto | None. | VA:1051, VC:1098 |
| step_dispatch_pivot_seat_003 (nested, same parent) | differs | auto + `dry_run_boundary` | Rule 4: `VC:1115`. | VA:1065, VC:1112 |
| step_record_pivot_seat_003 (nested, same parent) | identical | auto | None. | VA:1084, VC:1132 |
| step_finalize_divergent_pivot (nested, same parent) | identical | auto | None. | VA:1098, VC:1146 |
| step_resolve_divergent_pivot_result (nested, same parent) | identical | auto | None. | VA:1110, VC:1158 |
| step_apply_divergent_pivot_result (nested, same parent) | auto-only | auto | Rules 3 and 7: the both-mode body. `if_completed` (`VA:1119`) sets `next_dimension`, `pivot_lineage`, `saturated_directions`, reruns the reducer with `--create-missing-anchors` (`VA:1124`) and proceeds to `step_normalize_pause_events` (`VA:1126`). `if_failed` (`VA:1127`) skips to `phase_synthesis`. The rule 5 collision is unsettled (section D). Same double-apply hazard as research. | VA:1116, VC: absent |
| gate_divergent_pivot_choice (nested, same parent) | confirm-only | confirm | Marked `applies_to: confirm`. Rule 7. Detail in section D. Routing hazard: `if_completed.on_A` and `if_failed_recoverable.on_B` proceed to `gate_pre_iteration` (`VC:1196`, `VC:1233`), which skips `step_normalize_pause_events`, the auto-only `step_generate_state_summary` and `step_marker_scan`. The auto step proceeds to `step_normalize_pause_events` instead. | VA: absent, VC:1164 |
| step_normalize_pause_events | identical | auto | Its research namesake has no write key and no tag. The review step appends at `VA:1156` and `VA:1165`, so it needs a NEW `dry_run_event_policy` for REQ-006, classified from its own keys. | VA:1153, VC:1264 |
| step_generate_state_summary | auto-only | auto | Rule 3. No write key. Duplicates `pre_dispatch.generate_summary` (`VA:1225`), harmless. | VA:1175, VC: absent |
| step_marker_scan | identical | auto | None. | VA:1190, VC:1286 |
| gate_pre_iteration | confirm-only | confirm | Marked `applies_to: confirm`. Rule 3. `on_A` and `on_B` proceed to `step_dispatch_iteration` (`VC:1331`, `VC:1332`), the next step. `on_C` proceeds to `gate_pre_synthesis` (`VC:1333`) with no `manualStop` record, unlike research, skipping `step_fanout_merge`, `step_hydrate_summary_metrics` and `step_derive_verdict`, as the confirm twin already does. | VA: absent, VC:1308 |
| step_dispatch_iteration | differs | auto | Section D walks every sub-key. Review confirm has no dry-run key here. NEW by analogy with research: `dry_run_boundary: dispatch`, `dry_run_preview`, `dry_run_halt_event` (`RC:1258` to `RC:1264`), `pre_dispatch.render_prompt_pack.dry_run_output` (`RC:1279`) and the `or dry_run == true` clause in `pre_dispatch_audit.skip_when` (`RC:1299`). | VA:1211, VC:1336 |
| step_evaluate_results | identical | auto | None. Its `command` (`VA:2092`) stages the iteration error row in both twins. Confirm `auto_corrections` item 1 already holds. | VA:2059, VC:1585 |
| step_post_iteration_claim_adjudication | identical | auto | No research namesake. Its `command` (`VA:2116`, `VA:2132`) appends claim-adjudication rows through the gateway. NEW `state-mutation` tag for REQ-006. Reached only after the dispatch boundary. | VA:2104, VC:1630 |
| step_reduce_review_state | identical | auto | NEW `reducer-refresh` tag by analogy with research `step_reduce_state` (`RC:1504`), a different name. `command` (`VA:2147`), `write` (`VA:2153`). | VA:2145, VC:1671 |
| step_graph_upsert | identical | auto | NEW `state-mutation` tag by analogy (`RC:1523`). Its `bash` (`VA:2178`) runs `upsert.cjs`. | VA:2164, VC:1690 |
| gate_post_iteration | confirm-only | confirm | Marked `applies_to: confirm`. Rule 3. `on_A` and `on_B` proceed to `step_update_tracking` (`VC:1739`, `VC:1740`), the next step in the merged order, with no auto-only step between. `on_C` proceeds to `gate_pre_synthesis` (`VC:1741`). | VA: absent, VC:1711 |
| step_update_tracking | differs | auto | `log` exists only in auto (`VA:2188`): it reports dimensions, `newFindingsRatio` and P0 to P2 counts. Rule 1. | VA:2184, VC:1744 |
| step_loop_decision | identical | auto | None. | VA:2190, VC:1749 |
| step_fanout_merge | identical | auto | NEW `reducer-refresh` tag by analogy (`RC:1695`). | VA:2201, VC:1760 |
| step_hydrate_summary_metrics | identical | auto | None. | VA:2215, VC:1774 |
| step_derive_verdict | identical | auto | No research namesake. No write key. | VA:2242, VC:1801 |
| gate_pre_synthesis | confirm-only | confirm | Marked `applies_to: confirm`. Rule 3. `on_A` proceeds to `step_read_all_iterations` (`VC:1844`), the next step. | VA: absent, VC:1821 |
| step_read_all_iterations | identical | auto | None. | VA:2261, VC:1848 |
| step_build_finding_registry | identical | auto | No research namesake. No write key. | VA:2266, VC:1853 |
| step_adversarial_selfcheck | identical | auto | No research namesake. No write key. | VA:2294, VC:1881 |
| step_emit_resource_map | identical | auto | NEW `reducer-refresh` tag by analogy (`RC:1768`). `command` (`VA:2306`), `write` (`VA:2310`). | VA:2303, VC:1890 |
| step_resource_map_coverage_gate | identical | auto | No research namesake. No write key. | VA:2315, VC:1902 |
| step_compile_review_report | identical | auto | NEW `state-mutation` tag by analogy with research `step_compile_research` (`RC:1788`), a different name. Writes `output` (`VA:2379`). | VA:2319, VC:1906 |
| step_derive_release_readiness_state | identical | auto | No research namesake. No write key. | VA:2381, VC:1968 |
| step_convergence_report | identical | auto | NEW tag by analogy (`RC:1811`). `command` at `VA:2396`. | VA:2394, VC:1981 |
| step_update_config_status | identical | auto | NEW tag by analogy (`RC:1910`). | VA:2427, VC:2014 |
| step_stage_artifact_dir | differs | auto | `note` only: auto states the staging rationale briefly (`VA:2436`), confirm adds the label "(028)" and the `git add review-report.md` scenario (`VC:2023`). The `command` is identical. Rule 1. NEW tag by analogy (`RC:1918`). | VA:2432, VC:2019 |
| gate_post_synthesis | confirm-only | confirm | Marked `applies_to: confirm`. Rule 3. `on_A` and `on_B` proceed to `phase_save`, `on_C` returns, `on_D` proceeds to `completion` (`VC:2053`). | VA: absent, VC:2027 |
| step_compose_save_payload | identical | auto | NEW tag by analogy (`RC:1958`). | VA:2446, VC:2062 |
| step_generate_context | identical | auto | NEW tag by analogy (`RC:1976`). | VA:2463, VC:2079 |
| step_verify_save | identical | auto | None. | VA:2468, VC:2084 |
| step_release_lock | identical | auto | NEW tag by analogy (`RC:1988`). | VA:2473, VC:2089 |

### Review B. Top-level keys

| key | exact difference | proposed merged form |
|-----|------------------|----------------------|
| `purpose` | Auto ends "across review dimensions" (`VA:7`), confirm ends "and user approval gates" (`VC:7`). | Auto value, confirm value in `mode_overrides.confirm.purpose`. |
| `action` | "from initialization through synthesis" (`VA:8`) against "with user confirmation at each phase transition" (`VC:8`). | Auto value, confirm value in `mode_overrides.confirm.action`. |
| `operating_mode` | `workflow_execution` `autonomous` against `interactive`, `approvals` `none` against `multi_gate` (`VA:12`, `VA:13`, `VC:12`, `VC:13`). | Auto values, confirm values in `mode_overrides.confirm`. |
| `operating_principles` | `approach`: "evaluate convergence" against "show results, get approval" (`VA:22`, `VC:22`). `mandate`: confirm adds "Pause for user at each gate." (`VC:23`). | Auto values, confirm wording in `mode_overrides.confirm`. |
| `rules` | `ALWAYS`: confirm adds `pause_at_approval_gates`, `present_clear_options_at_each_gate` (`VC:2165` list). `NEVER`: auto-only `proceed_without_state_file_verification` (`VA:2524` list), confirm-only `proceed_past_approval_gate_without_user_response`, `auto_approve_on_behalf_of_user` (`VC:2177` list). No `DRY_RUN_OVERRIDES` in either twin. | Auto lists at top level, the four approval items in `mode_overrides.confirm`. NEW `DRY_RUN_OVERRIDES` by analogy with `RC:2037`. |
| `error_recovery` | `agent_dispatch_timeout`: auto continues after a second timeout (`VA:2505`), confirm shows it to the user (`VC:2156`). `state_file_missing` "during loop" (`VA:2506`, `VC:2157`). `continuity_save_failure` "Log warning" against "Inform user" (`VA:2508`, `VC:2159`). | Same as research: rule 7 for `agent_dispatch_timeout`, wording overrides for the rest. |
| `user_inputs` | Auto adds `config.fanout_lineage_artifact_dir` (`VA:40`). Neither twin has `dry_run`. | Auto block plus a NEW `dry_run` input by analogy with `RC:36`. |
| `confirm_parity` | Confirm-only (`VC:2194` to `VC:2208`). | Drop. Each entry is dispositioned in the top notes. |
| `dry_run_control` | Absent in both twins. | NEW top-level block by analogy with `RC:41`, with `mode: review` events and without the `applies_to: "confirm workflow"` field. |
| `state_write_protocol` | Identical in both twins. `pinned_bookkeeping.events` already lists `pivot_confirm_accepted`, `manualStop` and `pivot_override_accepted` (`VA:104`). | Auto. Same `applies_to` naming flag as research (`VA:101`). |
| `state_paths`, `reference_only_appendix` | Identical. | Auto. |
| `workflow.phase_loop.purpose` | "until convergence" (`VA:700`) against "with approval at each step" (`VC:720`). | Auto value, confirm wording in `mode_overrides.confirm`. |
| New keys | Neither twin has `execution_mode` or `mode_overrides`. | Add both after `speckit-plan.yaml:16-37`. |

### Review C. Behavior only one twin had

1. **Two different opencode guards, neither in the other twin.** Auto `if_cli_opencode` fails closed before dispatch unless the rendered prompt holds the write-containment sections (`VA:1401`), the artifact directory is a strict descendant of the worktree (`VA:1408`), the run is in an isolated linked worktree (`VA:1419`), the primary main or master worktree resolves and is clean (`VA:1427`, `VA:1432`) and every current change is inside the artifact directory by name and after symlink resolution (`VA:1471`, `VA:1473`). It then stages a `deep_review.recovery_baseline` ledger event (`VA:1481`, `VA:1483`). Confirm instead snapshots dirty paths and enforces advisory containment after dispatch (`VC:1477`, `VC:1490`). UNSETTLED: rule 1 drops the confirm containment for both modes and imposes the isolated-worktree precondition on every confirm-mode opencode run.
2. **Confirm-only pivot override.** `if_failed_recoverable` (`VC:1204`) with operator override and `pivot_override_accepted` (`VC:1225`, `VC:1227`). Auto fails closed on every failed pivot (`VA:1127`). Rule 7 keeps it, rule 5 collides (unsettled, section D).
3. **Confirm-only pivot approval.** `if_completed` accept with `pivot_confirm_accepted` (`VC:1190`) or `manualStop` (`VC:1201`). Rule 7 keeps it.
4. **Confirm-only interactive resume and restart.** `on_resume` ask with `on_restart_choice` archiving inside the held lock (`VC:336` to `VC:398`, archive at `VC:389`). Rule 7 keeps it.
5. **Confirm-only Retry, Skip or Cancel gate.** `if_consecutive_failures` (`VC:960` to `VC:980`). Rule 6 keeps it, whole branch confirm-only.
6. **The seven confirm dry-run keys.** `step_record_artifact_migration` (`VC:759`, `VC:760`), `step_prepare_divergent_pivot` (`VC:992`, `VC:993`) and the three seat boundaries (`VC:1047`, `VC:1081`, `VC:1115`). Rule 4 carries them. They are the only dry-run wiring review has, so every NEW tag in Review A is needed for REQ-006.
7. **Confirm-only interactive wording settled by rule 7.** `on_acquire` (`VC:308`) and `agent_dispatch_timeout` (`VC:2156`).
8. **Gate routing that would silently defeat rule 3 in confirm mode.**
    - `gate_init_approval.on_A` to `phase_loop` (`VC:712`) skips `step_init_complete` when the gate keeps its confirm position.
    - `gate_divergent_pivot_choice.if_completed.on_A` and `if_failed_recoverable.on_B` to `gate_pre_iteration` (`VC:1196`, `VC:1233`) skip `step_generate_state_summary` at any position.
    - `gate_consecutive_failures.on_A` and `on_B` to `step_dispatch_iteration` (`VC:977`, `VC:978`) skip `step_generate_state_summary` at any position.
9. **Auto-only `step_apply_lifecycle_request` has no dry-run tag in either twin** (`VA:185`, `VA:228`). REQ-006 needs a NEW tag.

### Review D. The two largest differing steps

#### `step_dispatch_iteration` (VA:1211, VC:1336)

| sub-key | difference | merged form |
|---------|------------|-------------|
| `dry_run_boundary`, `dry_run_preview`, `dry_run_halt_event` | Absent in both review twins. | NEW by analogy with `RC:1258` to `RC:1264` (REQ-006). |
| `pre_dispatch` | Identical (`VA:1224`, `VC:1349`). No `dry_run_output`. | Auto plus NEW `render_prompt_pack.dry_run_output` by analogy with `RC:1279`. |
| `pre_dispatch_audit` | Identical (`VA:1260`, `VC:1385`), `skip_when` without a dry-run clause. | Auto plus NEW `or dry_run == true` by analogy with `RC:1299`. |
| `if_native` | Identical (`VA:1268`, `VC:1393`). | Auto. |
| `if_cli_deepseek_harness` | Auto only (`VA:1275`), fails closed outside fan-out. | Keep (rule 2). |
| `if_cli_claude_code.command` | Auto runs through `runAuditedExecutorCommand` with receipts, fixed `acceptEdits`, `--effort` in code and an optional `CLAUDE_CONFIG_DIR` (`VA:1286`). Confirm shells `claude -p` with fixed `acceptEdits` and no receipt (`VC:1401`). | Auto (rule 1). The auto command does everything the confirm one does. |
| `if_cli_claude_code.render_hint` | Auto `optional_claude_config_dir` (`VA:1361`), confirm `optional_effort_flag` (`VC:1419`). | Auto (rule 1). |
| `if_cli_claude_code.notes` | As sets: auto-only notes on receipts, `CLAUDE_CONFIG_DIR` and `acceptEdits` (`VA:1365` to `VA:1367`), confirm-only notes on the `plan` default and serviceTier (`VC:1423`, `VC:1424`). | Auto (rule 1). |
| `if_cli_opencode.command` | Auto pre-dispatch fail-closed guard plus `recovery_baseline` (`VA:1370`). Confirm post-dispatch advisory containment (`VC:1427`). Detail in Review C item 1. | Unsettled, see Review C item 1. |
| `if_cli_opencode.notes` | As sets: auto-only notes on the fail-closed guard, the route-proof preamble, effort mapping and the fan-out exception to the self-invocation guard (`VA:1553`, `VA:1555`, `VA:1556`, `VA:1558`). Confirm-only notes on structural containment, the plain self-invocation guard and `</dev/null` (`VC:1523`, `VC:1526`, `VC:1527`). | Follows the command decision. |
| `if_cli_codex`, `if_cli_cursor`, `if_cli_devin`, `if_cli_pi` | Auto only (`VA:1559`, `VA:1697`, `VA:1798`, `VA:1899`). Codex notes carry the PRE-DISPATCH RULE (`VA:1691`). | Keep, outside any `applies_to` (rule 2, REQ-003). |
| `post_dispatch_validate`, `record_executor_audit` | Identical (`VA:2002`, `VC:1528`, `VA:2049`, `VC:1575`). No `if_failed` key in this step. | Auto. |

#### `step_handle_convergence` (VA:936, VC:958)

| sub-key | difference | merged form |
|---------|------------|-------------|
| `if_consecutive_failures` | Confirm only (`VC:960`): `when` (`VC:961`) runs it instead of `if_stop` on `consecutiveFailures`, `gate_consecutive_failures` (`VC:962`) with Retry, Skip and Cancel, and a `note` (`VC:980`). | Rule 6: whole branch, `when` included, marked `applies_to: confirm`, for the same reason as research. |
| `...steps.step_prepare_divergent_pivot` | Confirm adds `dry_run_boundary`, `dry_run_halt_event` (`VC:992`, `VC:993`). | Carry (rule 4). |
| `...steps.step_dispatch_pivot_seat_001/002/003` | Confirm adds `dry_run_boundary: dispatch` (`VC:1047`, `VC:1081`, `VC:1115`). | Carry (rule 4), one tag on the REQ-012 parameterized seat step. |
| `...steps.step_apply_divergent_pivot_result` | Auto only (`VA:1116`): `if_completed` (`VA:1119`) proceeds to `step_normalize_pause_events`, `if_failed` (`VA:1127`) skips to `phase_synthesis`. | Both-mode body (rules 3 and 7). |
| `...steps.gate_divergent_pivot_choice` | Confirm only (`VC:1164`): `if_completed` (`VC:1168`), `if_failed_recoverable` (`VC:1204`) with override `pivot_override_accepted` (`VC:1227`) written through `bookkeeping_log`, unlike research's `append_jsonl`, and `if_failed_unrecoverable` (`VC:1238`). | Rule 7: `applies_to: confirm`. UNSETTLED: this is the research rule 5 collision again. Auto `if_failed` (`VA:1127`) fails closed on every failed pivot, confirm `if_failed_recoverable` (`VC:1204`) offers an override on the `insufficient_endorsement` class and `if_failed_unrecoverable` (`VC:1238`) fails closed on the rest, and rule 7 would leave both key sets in one file, which rule 5 forbids. |
| `if_stop.if_divergent_eligible.on_error` | `log` "existing synthesis path" against "existing pre-synthesis gate" (`VA:1131`, `VC:1243`). `skip_to` `phase_synthesis` against `gate_pre_synthesis` (`VA:1132`, `VC:1244`). | Auto (rule 1). Confirm mode then runs `step_fanout_merge` (self-skips without fan-out), `step_hydrate_summary_metrics` and `step_derive_verdict` before `gate_pre_synthesis`. |
| `if_stop.if_existing_terminal_path.skip_to` | `phase_synthesis` (`VA:1135`) against `gate_pre_synthesis` (`VC:1247`). | Auto (rule 1), same consequence. |
| `if_blocked` | Identical (`VA:1136`). | Auto. |
| `if_stuck_recovery.pivot_target` | Auto only (`VA:1144`): pivot to the least-covered dimension. | Auto (rule 1). |
| `if_stuck_recovery.set.next_dimension` | "Least-covered dimension" (`VA:1146`) against "Least-explored dimension" (`VC:1257`). | Auto (rule 1). No append in this branch, so no dry-run policy is needed. |
| `if_continue.log` | Auto adds "Dimension: {next_dimension}" (`VA:1151`), confirm "Continuing." (`VC:1262`). | Auto (rule 1). |
