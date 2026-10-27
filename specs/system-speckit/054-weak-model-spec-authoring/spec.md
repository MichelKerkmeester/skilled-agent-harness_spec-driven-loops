---
title: "Feature Specification: Make system-spec-kit templates and authoring docs followable by a DeepSeek V4.1 Flash agent swarm"
description: "Nine phases that repair the spec-kit templates, gate unfilled placeholders on new docs, add per-section fill guidance and an authoring card, then measure whether a weak-model worker, benchmarked on cli-devin deepseek-v4-1-flash-1017-max, authors better packets."
trigger_phrases:
  - "weak model spec authoring phase parent spec"
  - "deepseek flash spec authoring"
  - "followable spec templates"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring"
    last_updated_at: "2026-10-26T05:35:00Z"
    last_updated_by: "conductor"
    recent_action: "Timed the refined tree with the speed loop: no measurable difference against 054 now"
    next_safe_action: "Merge origin/main into the branch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Make system-spec-kit templates and authoring docs followable by a DeepSeek V4.1 Flash agent swarm

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-23 |
| **Branch** | `worktrees/217-weak-model-spec-authoring`, where every phase ran. The branch reached `main` on 2026-10-25 |
| **Parent Spec** | None. The track folder `specs/system-speckit/` holds no `spec.md` |
| **Parent Packet** | system-speckit/054-weak-model-spec-authoring |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every phase in the phase map is Complete, `validate.sh --recursive --strict` on this packet prints `RESULT: PASSED`, and phase 009 reports a measured before and after for the five authoring metrics |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A weak-model worker (the benchmark subject is cli-devin `deepseek-v4-1-flash-1017-max`, and single-change swarm lanes run on DeepSeek V4.1 Flash) that authors a spec packet from the system-spec-kit templates leaves scaffold hints in place and still passes `validate.sh --strict`. A fresh Level 2 scaffold holds 97 bracketed hint occurrences and validates clean. The hand-written examples the worker imitates carry leaked description text and stale lines. The authoring guidance is a 1,200-line template guide that a weak model cannot follow in one pass. Together these let a swarm produce packets that look finished and are not.

### Purpose
Make the templates, the examples, the validator and the authoring docs good enough that a weak-model swarm, measured on cli-devin `deepseek-v4-1-flash-1017-max`, authors a valid, filled packet without a frontier model correcting it. Phase 001 measures the starting point and the last phase measures the result, so the claim rests on numbers.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repair the known template, example and reference defects, found by a census and fixed by exact text swap.
- Gate unfilled placeholders on new docs only, through a template version marker.
- Add a one-line fill instruction with a good and a weak example to each core template section.
- Add a short authoring card and route the skill router to it.
- Check and update the speckit and doctor commands and the doc-authoring agents such as markdown.
- Align the playbook, catalog and READMEs of system-spec-kit, then run the playbooks in a disposable worktree.
- Measure the authoring baseline before any change and again at the end.
- One write-recipe fix, tracked as a child of the earlier write-recipe series.

### Out of Scope
- Any change to `sk-prompt`. All logic lives in system-spec-kit.
- Any change that alters the verdict for an existing packet, because external-repo users would break on `/doctor:update`.
- Measuring models other than cli-devin deepseek-v4-1-flash-1017-max for the deciding benchmark. The first final set ran on swe-2-max and is history.
- Pushing. Each phase ends in one local commit on the worktree branch and nothing is pushed.
  - Correction 2026-10-25: after phase 009 the operator directed a push, and the worktree branch reached `main` at `10e8df7d25`. This line records that operator-directed push. Later commits stay local until the operator asks for the next push.
  - Correction 2026-10-27: the operator directed later pushes too. The latest reached `main` at `558570a83e`, carrying phases 021 and 022.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/system-spec-kit/templates/examples/**` | Modify | 002, 004 | Example descriptions, stale lines, skeleton alignment |
| `.skilled/skills/system-spec-kit/references/**` | Modify | 002, 005, 006 | Style guide, checklist, template guide, new card |
| `.skilled/skills/system-spec-kit/templates/core/*.tmpl` | Modify | 003, 004, 005 | Token form, v2.3 marker, fill guidance, task `Verify:` slot |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh` and its TypeScript mirror | Modify | 003 | Versioned placeholder gate |
| `.skilled/skills/system-spec-kit/SKILL.md`, `leaf-manifest.json`, `leaf-aliases.json` | Modify | 005 | Router loads the card |
| `.skilled/commands/speckit/`, `.skilled/agents/markdown.md` and other doc-authoring agents | Modify | 006 | Commands and agents match the new templates, gate and card |
| `.skilled/commands/doctor/` speckit entries | Audited, unchanged | 006 | The re-audit found 0 authoring findings in 91 doctor files, so phase 006 changed none (`goal.md` log row "Doctor commands in phase 006") |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/` guard scripts | Create | 004, 005 | Example drift guard and card sync guard |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/`, `feature-catalog/`, READMEs | Modify | 007 | Scenarios and docs for the new behavior |
| `.skilled/skills/system-spec-kit/benchmark/reports/` | Create | 008, 009 | Playbook run report and benchmark report |
| `specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination/` | Create | 041-006 | Write-recipe move destination fix |

### Launch preconditions

The operator meets all four before the first phase runs. The conductor records each as met in `goal.md` section 4 and stops when one is not.

1. **Workspace.** The operator chooses A) a git worktree or B) the current branch, following `sk-git`. The conductor never chooses. The chosen path becomes `WORKTREE` in `goal.md` section 4.
2. **Provider login.** `devin auth status` reports a Devin login. A rate limit or refusal on cli-devin stops the run.
3. **Lane authorization.** At most 3 parallel lanes and never two on one file. The operator has already given this.
4. **Conductor placement.** The conductor is a Claude Code session. Execution and verification run on Sonnet 5.5 high subagents, plus cli-pi DeepSeek V4.1 Flash for single-change lanes, and every review runs on cli-devin `swe-2-max`, except the phase 009 closeout review, which the operator moved to cli-codex `gpt-6-luna` at max effort on the fast tier (approved 2026-10-25, recorded in the phase 009 `goal.md` section 4). The benchmark subject is cli-devin `swe-2-max`. Superseded 2026-10-25: D7 and D8 in `goal.md` replace this precondition. Subagents run on Opus 5.5, the operator ruled out the swe-2 models, and the benchmark subject is cli-devin `deepseek-v4-1-flash-1017-max`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-template-drift-census-and-baseline/ | Census every template, example and reference defect into a verified ledger and measure the authoring baseline | Complete |
| 2 | 002-template-and-example-defect-repair/ | Apply the ledger rows owned by this phase with a tested exact-match applier | Complete |
| 3 | 003-versioned-placeholder-gate/ | Make unfilled `[YOUR_VALUE_HERE: ...]` tokens a Draft warning and a later error, for v2.3 docs only | Complete |
| 4 | 004-template-section-fill-guidance/ | Add a fill instruction and a good and weak example to each core section, and guard example drift | Complete |
| 5 | 005-weak-model-authoring-card/ | Write the authoring card, route the skill to it and guard the sync | Complete |
| 6 | 006-speckit-command-and-agent-alignment/ | Check and update the speckit and doctor commands and the doc-authoring agents such as markdown for the new templates, gate and card | Complete |
| 7 | 007-playbook-catalog-readme-alignment/ | Update the playbook, catalog and READMEs for the new behavior | Complete |
| 8 | 008-playbook-run-in-worktree/ | Run every new or changed playbook scenario in a disposable worktree and report PASS or FAIL | Complete |
| 9 | 009-authoring-benchmark-and-closeout/ | Rerun the baseline, report the delta per metric and close the packet | Complete |
| 10 | 010-deep-review-finding-fixes/ | Fix the nine P1 findings and every reproducing P2 from the 2026-10-25 deep review, plus the three tooling gaps it hit | Complete |
| 11 | 011-authoring-speed-research/ | Research where spec authoring and upkeep spend model time, then rank changes that make them faster without losing the quality this packet added | Complete |
| 12 | 012-authoring-speed-fixes-and-alignment/ | Build the speed changes phase 011 ranks as safe, then align the skill, README, catalog and playbook docs with phases 010 and 012 | Complete |
| 13 | 013-addon-removal-and-speed-refinements/ | Drop the before-after, roadmap and resource-map add-on templates, then build the six speed refinements the speed-loop analysis ranked | Complete |
| 14 | 014-removed-template-reality-sweep/ | Sweep READMEs, skill docs, commands and agents for the removed add-on templates, and fix every doc that no longer matches the shipped behavior | Complete |
| 15 | 015-template-example-neutralization/ | Replace the benchmark task in every template fill-note example with a neutral feature, so a benchmark run cannot copy hints about its own task | Complete |
| 16 | 016-scaffold-filler-section-trim/ | Stop scaffolding the sections models fill with generic text, make fix completeness optional, and fix the card and plan-template step contradiction and the stale decision-record pointers | Complete |
| 17 | 017-measured-behavior-and-draft-metadata/ | Add an optional measured-behavior block that quotes real command output, and repair derived metadata automatically while a packet is a Draft | Complete |
| 18 | 018-benchmark-redesign-and-remeasure/ | Rescore the 24 existing packets with deterministic checks, then benchmark a task no template mentions at the level the helper picks, with saved per-packet grades | Complete |
| 19 | 019-follow-up-fixes/ | Turn fsmonitor off in the goal-file manifest check, and rebuild a dirty speed-loop sandbox between rounds instead of dropping its variant | Complete |
| 20 | 020-alignment-audit-fixes/ | Fix every misalignment a four-lane audit found in the files 054 touched: code, skill docs, playbooks, catalog, READMEs, changelogs, routing, advisor, commands and agents | Complete |
| 21 | 021-ci-gate-regressions/ | Clear the two CI gates an alignment run found failing on main: stop changed-packet validation grading benchmark packets under `scratch/`, and stop the advisor sending `/deep:research :auto` prompts to spec-kit; then fix the run's in-range P1 and P2 findings | Complete |
| 22 | 022-advisor-routing-and-local-install/ | Close the four items left open after phase 21: the `/doctor:git hooks` routing test, the live `/deep:research :auto` near-tie, prompts naming the draft auto-repair, and a provision step that links private `local-*` commands into new worktrees | Complete |
| 23 | 023-deep-review-remediation/ | Fix every finding of the 2026-10-27 two-lineage deep review: the placeholder fence and `--path` symlink P1s, the `--track` requirement wording, the recursive auto-repair doc gap, and the P2 record, doc and code findings | Complete |
| 24 | 024-typed-command-ambiguity/ | Stop the advisor reporting a typed command's owner as ambiguous with a skill the graph seed bound held below it, so `/deep:research :auto` prompts route without an ambiguity flag | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-template-drift-census-and-baseline | 002-template-and-example-defect-repair | `ledger.jsonl` exists, every row reproduces and the baseline holds three runs | `jq -c . ledger.jsonl` exits 0 and `baseline.json` holds 3 runs |
| 002-template-and-example-defect-repair | 003-versioned-placeholder-gate | Every owner-002 row no longer reproduces and the suite result matches the phase 001 start | Row evidence commands print nothing and the suite summary lines match `suite-start.txt` |
| 003-versioned-placeholder-gate | 004-template-section-fill-guidance | Core hints are tokens, the marker is v2.3 and recursive strict counts are unchanged | The failing-first test passes and the before and after counts match |
| 004-template-section-fill-guidance | 005-weak-model-authoring-card | Every core section has guidance, goldens pass and the drift guard passes | The golden test and the drift guard script exit 0 |
| 005-weak-model-authoring-card | 006-speckit-command-and-agent-alignment | The card exists, the router loads it and the sync guard passes | The sync guard script exits 0 and the workflow invariance test passes |
| 006-speckit-command-and-agent-alignment | 007-playbook-catalog-readme-alignment | Every speckit and doctor command and every doc-authoring agent names the card, the v2.3 token and the guard scripts where it describes authoring | The phase 006 audit table has no open row |
| 007-playbook-catalog-readme-alignment | 008-playbook-run-in-worktree | Every new scenario file exists and the playbook index lists it | The playbook index lists each scenario id |
| 008-playbook-run-in-worktree | 009-authoring-benchmark-and-closeout | Every scenario has a recorded PASS or an escalated FAIL | The report folder holds a row for each scenario |
| 009-authoring-benchmark-and-closeout | 010-deep-review-finding-fixes | The deep review of the closed packet is committed with its P1 and P2 registry | `review/review-report.md` lists the nine P1 findings this phase fixes |
| 010-deep-review-finding-fixes | 011-authoring-speed-research | The operator asked on 2026-10-25 that authoring stay fast as well as correct; the research runs beside phase 010 | `011-authoring-speed-research/research/research.md` ranks each recommendation with its evidence |
| 011-authoring-speed-research | 012-authoring-speed-fixes-and-alignment | Every ranked change is assigned to a lane or deferred with a reason | `rg -c '\*\*(build now|defer)\*\*' 011-authoring-speed-research/research/research.md` prints 12 |
| 012-authoring-speed-fixes-and-alignment | 013-addon-removal-and-speed-refinements | The speed loop ran on 2026-10-26 and its analysis ranked six refinements; the operator chose to drop three add-ons and build all six | `011-authoring-speed-research/goal.md` logs the loop result |
| 013-addon-removal-and-speed-refinements | 014-removed-template-reality-sweep | The operator asked on 2026-10-26 for a separate check that no doc still names a removed template and that the docs match the shipped behavior | `014-removed-template-reality-sweep/scratch/audit-*.md` record both sweeps |
| 014-removed-template-reality-sweep | 015-template-example-neutralization | A fresh Opus xhigh review on 2026-10-26 found the core templates use the benchmark task as their worked example, and the operator asked for phases that act on every recommendation | `rg -c -e '--quiet' -e 'recommend-level' templates/core/` counts the examples phase 015 replaces |
| 015-template-example-neutralization | 016-scaffold-filler-section-trim | No core template, golden snapshot or rendered example names the benchmark task | The phase 015 sweep over `templates/` prints no benchmark-task term |
| 016-scaffold-filler-section-trim | 017-measured-behavior-and-draft-metadata | The trimmed sections no longer scaffold and no existing packet changed verdict | The before and after strict census match |
| 017-measured-behavior-and-draft-metadata | 018-benchmark-redesign-and-remeasure | The measured-behavior block and the Draft metadata repair ship with tests | Both new tests pass and the strict census is unchanged |
| 018-benchmark-redesign-and-remeasure | 019-follow-up-fixes | The closeout named two follow-ups: the manifest test hung on fsmonitor, and one dirty sandbox dropped main-no054 for rounds 3 to 5 | `018-benchmark-redesign-and-remeasure/scratch/report.md` records the dropped rounds and the top-up |
| 019-follow-up-fixes | 020-alignment-audit-fixes | The operator asked on 2026-10-26 for a check that everything 054 touched aligns with its standards | `020-alignment-audit-fixes/scratch/audit/findings.json` holds the 46 findings |
| 020-alignment-audit-fixes | 021-ci-gate-regressions | A local alignment audit run's completeness critic found changed-packet validation and the Routing Registry Drift ratchet failing on main | CI run 40380947180 on `b51a341a07` reads `failure` with 81 `New packet does not validate` annotations, and the divergence ratchet now prints `Tests 9 passed (9)` |
| 021-ci-gate-regressions | 022-advisor-routing-and-local-install | The operator asked on 2026-10-27 to fix the four items phase 21's closeout left open | The advisor suite's one failing case, doctor-a-08, predates this packet and is recorded in the phase 21 closeout |
| 022-advisor-routing-and-local-install | 023-deep-review-remediation | The operator asked on 2026-10-27 to fix every finding of the deep review run after phase 22 | `review/review-report.md` holds the adjudicated findings: 2 P1 and 9 P2 |
| 023-deep-review-remediation | 024-typed-command-ambiguity | The operator asked on 2026-10-27 to act on the thin advisor margin once the live advisor showed `ambiguous: true` for the typed `/deep:research :auto` prompt | The live probe prints system-deep-loop 0.564694 and system-spec-kit 0.564693 with `ambiguous: true` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Resolved 2026-10-24: LLM Gateway ran out of usage after phase 001, and the operator moved every remaining run to cli-codex `gpt-6-luna` and cli-devin `swe-2-max`. The benchmark subject was then `swe-2-max`, rebaselined at the start commit. Superseded on 2026-10-25: the operator ruled out the swe-2 models and the subject is `deepseek-v4-1-flash-1017-max` (parent goal D8). Cli-opencode rule 15 no longer applies, because no OpenCode executor runs.
- Whether phase 003 also fixes the post-edit scanner `spec/check-placeholders.sh`, which flags regex classes inside fenced code blocks, is decided in ADR-003 of the phase 003 `plan.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: None, because the track folder holds no `spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
