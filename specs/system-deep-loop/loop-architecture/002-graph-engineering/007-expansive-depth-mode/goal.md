---
title: "Goal: Expansive-depth sub-mode for deep-research and deep-review"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode"
    last_updated_at: "2026-11-17T20:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Amended D2 and the objective: flag-scoped, per operator decision"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-17-expansive-depth-goals"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Expansive-depth sub-mode for deep-research and deep-review

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Ship the completed-run extension, the defect fixes and an opt-in expansive-depth sub-mode for deep-research and deep-review, documented and aligned, while default runs change only through the named defect fixes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Build order: 001 merges first; 005 before 004; 012 before 010 and 011; 010 after 004-007; 011 after 003, 004 and 008-010; 014 last. |
| D2 | `--depth-mode=expansive` is opt-in and adds nothing without the flag. Default runs change only through a defect fix a phase's spec names, each with a test. |
| D3 | No new mode-registry entry, no change to the gateway upcast beyond phase 006's accepted decision, and `wave_orchestration` stays reference-only. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING
<!-- FILL: List each child phase and its goal path. Name the precedence rule. GOOD: 001 and 002. Decisions here outrank child detail. WEAK: Children are bound. -->

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-completed-run-extension | `001-completed-run-extension/goal.md` |
| 002-research-claude-config-dir | `002-research-claude-config-dir/goal.md` |
| 003-review-min-iterations-floor | `003-review-min-iterations-floor/goal.md` |
| 004-focus-hijack-fix | `004-focus-hijack-fix/goal.md` |
| 005-prompt-pack-contract-alignment | `005-prompt-pack-contract-alignment/goal.md` |
| 006-state-log-leaf-fields | `006-state-log-leaf-fields/goal.md` |
| 007-source-diversity-quality-class | `007-source-diversity-quality-class/goal.md` |
| 008-review-dimension-coverage | `008-review-dimension-coverage/goal.md` |
| 009-fanout-review-coverage-merge | `009-fanout-review-coverage-merge/goal.md` |
| 010-research-frontier-mode | `010-research-frontier-mode/goal.md` |
| 011-review-frontier-mode | `011-review-frontier-mode/goal.md` |
| 012-pivot-hygiene | `012-pivot-hygiene/goal.md` |
| 013-no-redispatch-landed-iteration | `013-no-redispatch-landed-iteration/goal.md` |
| 014-docs-playbooks-alignment | `014-docs-playbooks-alignment/goal.md` |
| 015-reducer-test-focus-contract | `015-reducer-test-focus-contract/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `rg -c '^- \[ \]' 0*/goal.md` run in this folder prints nothing: no open criterion in any of the 15 phase goals.
- [x] `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` prints `RESULT: PASSED` for this folder and each of its 15 phase folders.
- [x] `rg -c '\| Unmet \|' 0*/acceptance-criteria.md` run in this folder prints nothing.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` on this folder with `--strict --recursive` prints `RESULT: PASSED` for all 16 folders.
- [x] After phase 014 lands, `npx vitest run` in `.skilled/skills/system-deep-loop/runtime` prints no failure absent from the runtime suite baseline in this goal's log.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Research (generations 1 and 2) | Done | `research/research.md` is the canonical synthesis |
| Phase goals 001-014 authored | Done | 2026-11-17, one `goal.md` per phase folder, bound above |
| Runtime suite baseline | Done | 2026-11-17 on `main` at `c9d8ff4` (dirty only outside `system-deep-loop`): `npx vitest run` in `.skilled/skills/system-deep-loop/runtime` exit 0, 185 files passed, 3095 tests passed, 9 skipped, **0 failed**. So any failure after a phase is new. `check-ledger-stem-producers.cjs`, `check-projection-coverage.cjs` and `check-contract-drift.cjs` exit 0. The three `system-spec-kit` suites 001 names (`deep-review-contract-parity`, `deep-review-reducer-schema`, `deep-review-auto-restart-contract`) pass 17 of 17. Copy in `001-completed-run-extension/scratch/baseline.txt` |
| Step-0 probes | Done | 2026-11-17, one-turn reply-only probes, model pinned, stdin closed. Pi `llmgateway/deepseek-v4.1-flash-1017 --thinking max`: `OK` in 5 s. OpenCode 2.3.0 `opencode-go/deepseek-v4.1-flash#max`: `OK` in 11 s, no 429. Vibe 3.1.2 `deepseek-flash`: `OK` in 3 s, `export.json` `0`/`finished`. OpenCode `probe-worktree-confinement.cjs --root-line --set-pwd`: exit 0, 5 tool paths, 0 outside |
| Implementation | In progress | Integration (wt 455) merge order so far: 001 `238c4e95ccb`, 005, 007, 009, 003 `c898b3ad9a3`, wave-1 docs `29d3359f1c5`, AC-010 amendment `83708e4e42a`, 004 `227d594603e`, 006 `e60d466d50f`, 013 `20dda00e4b9` (shared `verify-iteration.vitest.ts` resolved by keeping both describe blocks), playbook path fix `4be8de5d0b7`, 012 `79ae240955e`, 002 `b5fb87abad8`. The gate on `20dda00e4b9` found 1 failure, the `check-documentation-drift` facts check: four wave-1 playbook scenarios named `tests/unit/...` paths the checker cannot resolve outside `runtime/`. Fixed in `4be8de5d0b7` (file-stem filters), and the drift test passes. The `fanout-pool` failure did not recur there. Building: 008 (wt 468, Go) and 010 (wt 467, Pi). Waiting: 011 (wt 469) for 008 and 010, then 014. Open docs: `@markdown` pass for 004, 006, 012, 013 and 002 (playbooks, changelogs, the 012 catalog pages). |
| Stop-integrity defects outside this packet (review pilot run 2) | Open, for a follow-up packet | (1) a leaf's stop reason is never checked against a stop-decision row: synthesis-closeout.cjs:104 only requires --stop-reason, the gateway took pi-1 converged and pi-3 maxDurationReached with no row (deep-review.yaml:1168), and fanout-merge.cjs:1771 checks node coverage only; (2) a leaf can skip step_check_max_duration (deep-review.yaml:1149), and the timestamp_anomaly flags lead to no refusal;... |
| Final gate 2026-11-19 | Done | Integration tip 1d2b49e4306: vitest 190 files, 3520 passed, 11 skipped, 0 failed; ledger-stem, projection-coverage and contract drift exit 0; spec-kit parity 18 of 18; validate --strict --recursive 15 of 15 PASSED; check-goal PASSED on parent and 14 phases; no open criterion and no Unmet row; review snapshot --check OK. Phase 014 criterion 5 closed on doc run-11 and skilled run-17 under the ame... |
| Operator routing 2026-11-18 | Recorded | Chat rulings: use cli vibe with deepseek flash max; do all remaining work with opus medium agents natively; testing, playbook and busy work on deepseek flash via cli-vibe or opencode-go, implementation and review on native Opus; increase parallelism; continue autonomously until perfection |
| Post-program dogfood and fix rounds 4-6 | done | gen 3-4 research, gen 3 live review 90b12e8b176, rounds landed on main through 8170db46079; gate 3845 passed, 0 failed |
| Phase 015 bound, 2026-11-21 | Done | Added the 015-reducer-test-focus-contract binding row and its goal.md. Criteria now count 15 phase goals and 16 validate folders. D2 and three criteria reworded, same meaning, to fit the 4,000-character budget (3999). check-goal.cjs RESULT: PASSED (5/5 checks) |
| Research stage run, from the deleted parent summary | Done | A 7-iteration /deep:research:auto run on the native executor. verify-iteration.cjs passed 7 of 7, each warning that the route proof came from the delta file (D7). Convergence stopped on all_questions_answered, graph STOP_ALLOWED, at the iteration-8 check; one blocked_stop recovered in iteration 7. Next_focus was set by hand in iterations 2-7, so the run is no evidence of default focus selection. |
| Research stage decisions, from the deleted parent summary | Done | A separate --depth-mode flag, not a fifth --convergence-mode value: it composes with divergent and sliding-window. A modifier flag, not a mode-registry entry: a registry mode binds one command, agent and loop type, and expansive applies to both loop types. Default-path defects ship as their own phases, since each changes default behaviour. |
| Parent implementation-summary removed 2026-11-21 | Done | Operator ruling on the LOGIC-SYNC: the docs win. save-workflow.md Phase Parent Output Location says a phase parent holds no implementation-summary.md and its continuity is the graph-metadata.json pointer. Durable content moved to the two rows above; metadata re-derived by a plan-only generate-context save. |
| Research stage plan and tasks, from the deleted parent plan.md and tasks.md | Done | Gen 1 changed no runtime code. T001-T010 all [x]. Archive research_archive/20261117T103614Z/: 7 iteration files, synthesis_complete stopReason converged, totalIterations 7, resource-map.md, research.md §17 Convergence Report. Q1-Q6 answered in §4-8 and §10, Q7 in the executive summary and the §13 D2 row. |
| Parent plan.md and tasks.md removed 2026-11-21 | Done | Operator ruling: keep decision-record.md for cross-phase decisions. phase-definitions.md §3: a phase parent needs only spec.md, description.json and graph-metadata.json. Durable content moved to spec.md §3 and the row above; metadata re-derived by a plan-only generate-context save. |

### Deviations and findings

| Item | Note |
|------|------|
| Parent scope text | Resolved 2026-11-17: `spec.md` §3 now puts the build of phases 001-014 in scope. The generated findings block in `spec.md` still shows pre-decision text until the next deep-research synthesis rewrites it from `research/research.md`. |
| D1 amendment 2026-11-17 | Build order changed per the plan review's X-4: 005 before 004, 012 before 010 and 011, 003 and 004 before 011. Operator decision: 001 merges first, and each phase writes its own playbook scenarios. Resend the chat slice. |
| D2 conflict | Resolved 2026-11-17. D2 and the objective said default runs behave as before, while phases 003-008 change default-path behavior on purpose as defect fixes. The operator chose "Flag-scoped", recorded in the D2 amendment row below. |
| D2 amendment 2026-11-17 | Operator decision "Flag-scoped": D2 now scopes the opt-in guarantee to `--depth-mode=expansive`, and default runs change only where a phase's spec names the defect fix, each with a test. The objective's closing clause changed to match. Resend the chat slice. |
| Child goal sources | Only 001, 010 and 011 have `acceptance-criteria.md`; the other child goals take their criteria from the REQ table in their `spec.md`. |
| Template order | `create.sh --with-goal` renders the template marker above the title, unlike `goal.md.tmpl`. All 15 goals here follow `goal.md.tmpl`. |
| Vibe write probe 2026-11-17 | A throwaway detached worktree took two file writes (one at its root, one under `specs/`) from a `tmp/` run folder with `--add-dir`, `export.json` `0`/`finished`, both with and without `--auto-approve`. Both exports report `enable_auto_approve: true`, so print mode approves writes without the flag. A run with approval off was never observed. Vibe has no confinement, and Pi's is UNKNOWN, so every dispatch on every lane diffs `git -C <main> status --porcelain` before and after. |
| Packet not committed | Resolved 2026-11-17: operator approved a packet-only local commit, `21c4b325b5a` (103 files, packet plus the parent's derived `graph-metadata.json`). The spec-remint pre-commit gate rejects a pathspec-narrowed commit of spec docs, so phase commits commit the whole index after checking it holds only phase paths. |
| Operator decisions 2026-11-17 (session 2) | Integration target: the sk-git worktree `worktrees/455-expansive-depth-integration` (`~/worktrees/public/455-expansive-depth-integration`) takes every phase merge, the contract regeneration and the authoritative full-suite gate. Main is untouched until one final merge the operator approves. Provisioning: the allocator's per-worktree `npm ci` is allowed. Standing yes for local commits on phase branches and the integration branch, and for merges into integration. No push, and no merge into main, without a separate yes. Option B stays not taken (strategy recommendation A). 013's two open questions take their recommended defaults. |
| Playbook and changelog timing | Deviation 2026-11-17. `/create:manual-testing-playbook` and `/create:changelog` stop at a Phase 0 self-check unless they run as `@markdown` (`.skilled/commands/create/assets/create-manual-testing-playbook-presentation.txt:10`, `create-changelog-auto.yaml:13`), and a fork cannot start an agent. Several phases also share one changelog folder and the playbook index files, so writing on separate branches would collide on numbering. Each phase's scenario and changelog entry is therefore written by an `@markdown` agent in the integration worktree, right after that phase merges, in merge order. The work stays with its phase, and phase 014 still writes none. |
| Wave-1 gate 2026-11-17 | Integration tip `c898b3ad9a3`: 185 files, 3136 passed, 9 skipped, **1 failed**: `tests/unit/fanout-pool.vitest.ts` "does not orphan an exited-but-still-writing worker while artifact progress continues" (38 ms). Observed: the file passes 42 of 42 when run alone, five runs in a row on the same tip. Derived: no fan-out pool file changed between `21c4b325b5a` and the tip. Inferred, unconfirmed: the case is load-sensitive, with a 15 ms `postExitGraceMs` and a `setTimeout` writer, and the full suite ran under concurrent machine load. Not owned by this packet, so not fixed here. The final full-suite rerun must not show it, or it becomes a finding. The check scripts exit 0, the spec-kit suites pass 18 of 18, and recursive validate passes 15 of 15 folders. |
| AUTONOMOUS MODE 2026-11-17 ~21:30 until 06:00 | Operator, verbatim: "do all autonomously from here im asleep untill 06:00. add it to goals or handovers so you just keep going untill perfect graph loop style". Standing rule for every later turn and any resumed session: never stop to ask. Decide each fork on the evidence, record the decision and its rollback in the owning decision record or this log, and keep going. Loop each phase as build, verify, review, fix and re-verify until its gate is clean, then merge, gate and move on, through wave 5 (014) and a final full-suite rerun. Stays local: no push, and no merge into `main`. The final integration-to-main merge waits for the operator at 06:00, so the work ends on `worktrees/455-expansive-depth-integration` ready to merge. Decisions made while the operator sleeps are listed under "Night decisions" below for morning review. |
| Night decisions | (1) AC-010: operator chose to amend REQ-010 and drop `.vibe/agents` from the grep, since `sync-agents-vibe.cjs --check` proves mirror parity (OD-005 in 001). (2) 006 `focusAlignment`: replaying this packet's five real generation-2 deltas fails the newly live guard in 4 of 5 (iterations 2, 3 and 5 answered a question missing from their own `keyQuestions`, and iteration 4 wrote the bare id `Q6`). The operator's accepted ADR-001 and ADR-002 named this risk and mitigated it: the latest-record scope lets a run recover, `maxIterations` still bounds a run, and 006 now defines `keyQuestions` in the prompt pack as the exact question text. So 006 merges as decided, and the replay goes in its changelog. Rollback: revert 006's `convergence.cjs` hunk, or the 006 merge on integration. Morning: decide whether bare ids (`Q6`) should resolve through the question registry. |
| Gate `b5fb87abad8` (after 012 and 002) | Clean. 186 files, 3185 passed, 11 skipped (9 baseline plus 002's two shim cases, `it.skipIf(underClaudeAncestry)`), 0 failed. Check scripts exit 0, spec-kit suites 18/18, validate 15/15. The two shim cases were then run outside Claude Code's process tree (double-forked so `launchd` is the parent) in wt 465: `dispatch-iteration.vitest` and `executor-audit-cli-branch-receipts` passed 19 of 19, with 0 skipped. |
| 001 AC-004 live walk | Walk worktree `471-detached-ed-extend-walk` (detached, from `b5fb87abad8`): a small completed `/deep:research` fixture run on the Pi lane, then `--extend=3`, counting exactly 3 new dispatches. The 7-of-10 cap half is already proven by `workflow-restart-lifecycle.vitest.ts`. The worktree is throwaway and never merges. |
| DR-065 walk result 2026-11-17 22:2x | PASS on behavior (wt 471, fixture `specs/z_scratch/999-extend-walk-fixture`, cli-pi). A completed 2-iteration run with `--extend=3` went from 2 to 5 iteration files and rows, with exactly 3 new dispatch receipts and no duplicate. Exactly 1 `run_extended`: ledger frame `0000000000000010`, receipt `deep-research.ledger.run-extended` seq 10, projected as 1 `extended` state-log row. 0 `resumed` rows. `.lineage` kept sessionId `2026-11-17T21:05:53.000Z` and generation 1, with lineageMode `completed-continue`, continuedFromRun 2 and maxIterations 5. Snapshot `research/synthesis-v1-r2.md` has the same sha256 as the old `research.md` (`cc19d695…`). `--extend=0` printed `--extend needs a positive integer, and got "0".` with exit 2 and no state change. This closes 001 AC-004's dispatch half. Caveat: the walker drove the workflow by hand, not through the Skill tool, so the ledger and dispatch receipts are the independent evidence. To fix in integration: DR-065 (and likely DRV-070) commands 5 and 6. Command 5 greps the state log for `run_extended`, but it should count the `extended` row there and/or `run_extended` in the ledger. Command 6 should read `.lineage.*`. |
| Findings outside this packet (morning) | (1) `synthesis-closeout.cjs` exits 2 with `synthesis_incomplete` (`count_only_state_findings_not_reconstructed`) on every single-executor research run, because only the fan-out merge writes `registry.metrics.sourceFindings`. The config still ends `complete`, since the status step runs unconditionally, so the ledger and the config disagree. (2) `parseExecutorConfig` accepts an off-allowlist cli-pi model id, and the refusal comes only at dispatch, not at config write as the setup contract says. Neither is in this packet's scope. Both were seen in the DR-065 walk and are not fixed. |
| Fork layout | Two background forks orchestrate wave 1: one for 001 (Pi lane), one for 005, 007, 009 and 003 in series on their assigned lanes. Forks run only their phase's named suites, and the full suite runs once per merge in the integration worktree. Forks never edit this parent folder's docs, which stay on main. |
| Night result 2026-11-18 04:2x | **Build done; integration ready for operator review.** Integration tip `9f174a8c8df` on `worktrees/455-expansive-depth-integration` holds all 14 phases. Final gate on `f49c7ddd5eb`: 190 files, 3383 passed, 11 skipped, 0 failed (baseline `c9d8ff4`: 3095 passed, 0 failed). Contract drift OK, spec-kit suites 18/18, `validate --strict --recursive` 15/15 PASSED, check-goal PASSED for the parent and all 14 children. **Not pushed and not merged into `main`.** |
| Parent criteria status 04:2x | (1) Open goal criteria: 010 (pilot), 011 (golden waiver, pilot) and 014 (zero-open alignment), so NOT met. (2) check-goal: PASSED for all 15. (3) Unmet rows: 010 AC-014 and 011 AC-011 (live pilots), so NOT met. (4) Recursive validate: PASSED. (5) Full suite after 014: no failure absent from the baseline, so MET. |
| Fixes found by live walks and pilots | `6953b67c5dd` review extend counts runs by integer iteration. `2c9405692a1` frontier visits match a reworded focus, and the golden test tokenizes `<CWD>`. `1642d622a3b` merges the research pilot fixes: graph upsert as a JSON array, answered wins over the budget close, and an iteration-1 seed reduce. `43eb6d47b8e` merges the review pilot fixes: root depth-1 cap 8, git-range relevance against reviewScopeFiles, lineage-qualified merged ids, and the `frontier_partition` key named in the docs. `65eb3c029d0` adds the review seed reduce. `f49c7ddd5eb` merges the alignment fixes: the extension warning read the wrong stopPolicy field, the stop-order and gate lists, presentation bindings, the persona link and custom dimensions, and errored visits skipped. Each has a fail-first test. |
| Operator decisions needed | (a) Ratify or reject ADR-006 (010) and ADR-005 (011): the golden test strips one expansive-only persona paragraph, so AC-001 is `Waived` in both. Rollback: remove the strip and accept the bytes. (b) The pilot stop: both live pilots stop on the iteration cap. `deep-research.yaml` sets `maxFrontierNodes = max_iterations`, the cap check runs before the all-answered candidate, and the default-path quality guards block. Decouple the node cap or amend AC-014, AC-011 and SC-002. Also: a lineage keeps running after its node is answered, and store rows stay open (slot count). (c) Accept the hand-edited golden lines for the two persona doc fixes (rollback: revert `42a28b79b4b`), and decide whether to rewrite the two prune lines inside the protected paragraph. (d) 014 criterion 5: add a handed-off status to `aggregate-findings.cjs`, or accept the counted findings, then rerun the lanes. (e) Approve the three alignment deviations: critics killed at 20 minutes, no lane re-read of the last fixes, and two catalog leaves written by hand. (f) Remove the `expansive-depth` key added to the operator-local `topics.json`, or keep it (backup in the session scratchpad). (g) The integration-to-main merge. |
| Still outside this packet | synthesis-closeout needs `registry.metrics.sourceFindings`, which no single-executor producer writes (exit 2 on every single-executor research run, seen live 3 times). The cli-pi off-allowlist model passes config. The YAML example `next_safe_action` "Act on..." fails MEMORY_007 in both YAMLs. Verify demands an exact findings-count match. A graph upsert FOREIGN KEY error fires when a delta links undeclared nodes. 34 of 60 merges carry their own conflict-resolution diffs. Routing words for expansive depth are missing in mode-registry/hub-router/description.json (D3). `validate-command-references.cjs` needs a runtime-database exemption. |
<!-- /ANCHOR:log -->
