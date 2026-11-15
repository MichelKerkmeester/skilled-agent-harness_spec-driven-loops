---
title: "Feature Specification: Phase 10: fix-alignment-report-findings-for-speckit-command-surfaces"
description: "The alignment check of this packet found 23 open findings on the speckit command surfaces: stale step counts, text that names removed files and modes, command metadata behind its routers, shared blocks no test pins and five advisor routing misses. This phase closes them."
trigger_phrases:
  - "fix alignment report findings for speckit command surfaces"
  - "phase 10 fix alignment report findings for speckit"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: fix-alignment-report-findings-for-speckit-command-surfaces

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/381-speckit-command-gates-step-order-drift` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 11 |
| **Predecessor** | 009-resume-contract-owned-assets |
| **Successor** | 011-prerequisites-bound-folder-override |
| **Handoff Criteria** | Every row of `acceptance-criteria.md` is Met, the alignment recheck reports no finding still open that this phase owns, and `validate.sh --strict` prints `RESULT: PASSED` for this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Close the alignment report findings on the speckit command surfaces: stale step counts, references to removed files and modes, command metadata flags, missing contract tests and advisor routing gaps specification.

**Scope Boundary**: This phase closes the findings of one alignment run, `/local-skilled-alignment 99d197475d..0baf90cc77 --kind range`, that the packet owns, plus the stale compiled deep-loop contract, which the operator added on 2026-11-14 through the question tool. It changes text, metadata, two test files and advisor signal lists. It changes no step order, gate, mode contract or resume logic. Those belong to phases 1 to 8.

**Dependencies**:
- Phases 1 to 9 are Complete. Each fix reads its truth from the workflow and router files as phase 8 left them. Phase 9, `009-resume-contract-owned-assets`, landed on main while this phase was built and made the same command contract change as finding `B-2`, so the two edits merged without a conflict.
- The run folder of the alignment check holds `findings.json` and `fix-plan.md`, which name each finding by id. This spec quotes the ids so a later recheck can be matched.
- `derive-command-bridges.cjs` copies `command-metadata.json` and `scoring-compatibility.json` into the generated bridges, `projection.ts` and `skill_advisor.py`. REQ-001, REQ-003 and REQ-007 edit the sources and run the deriver.

**Deliverables**:
- Step counts of 13 for complete, 7 for plan and 5 for resume on every surface that still stated another number.
- A command contract, a feature catalog entry, a playbook scenario and a presentation file that describe the single resume workflow and its detection order.
- Command metadata whose argument hints equal the router frontmatter.
- Contract tests that fail when a shared-include pointer is dropped or `merge_on_clean` returns.
- Owned advisor signals that route the upheld probe prompts P03, P11 and P12 to the expected skill.
- Compiled deep-loop contracts whose recorded digests match their sources.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Phases 1 to 8 changed the speckit workflows and their routers, and several surfaces further out still state the old facts. An agent that reads the skill README, the command contract, the resume catalog entry or its playbook is told a step count, a file or a detection model that no longer exists. Four requests an operator would phrase naturally route to another skill or to none, and one CI step on main fails on a stale compiled contract.

### Purpose
Every finding of the alignment run that this packet owns is closed at its source, and a recheck of that run confirms it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ node .skilled/commands/assets/local-skilled-alignment/aggregate-findings.cjs --run-dir ~/.local/state/local-skilled-alignment/381-speckit-command-gates-step-order-drift/20261114T170200Z
STATUS=OK aggregate-findings: findings=26 P0=1 P1=10 P2=15 inferred=1 outside_scope=3 overturned=8 problems=0
$ node .skilled/commands/assets/local-skilled-alignment/run-probes.cjs --probes <run>/probes-input.json --out <run>/probes.json | tail -1
STATUS=FINDINGS run-probes: pass=11 fail=6 cannot_run=0
$ node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs | cut -c1-80
[CONTRACT DRIFT] command=deep/ai-council class=STALE_SOURCE_DIGEST reason=source
[CONTRACT DRIFT] command=deep/review class=STALE_SOURCE_DIGEST reason=source dig
[CONTRACT DRIFT] command=deep/research class=STALE_SOURCE_DIGEST reason=source d
$ node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs | rg 'speckit'
         ? /speckit:resume argumentHint differs from frontmatter
         ? /speckit:search argumentHint differs from frontmatter
```

The run reported 26 findings, of which 3 are outside the scope. Of the 23 in scope, 21 are closed here and two, `PRB-02` and `PRB-06`, are answered in section 10. Of the 3 outside, the stale contract (`BAT-01`, with `A-4` as its lane copy) is closed here on the operator's instruction and 2 stay out. Six probes failed. The critic upheld five, and those five are findings `PRB-01` to `PRB-04` and `PRB-06`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Correct the step counts that still say 14, `14+`, 8 or 4 (findings `B-1`, `A-1`, `B-6`).
- Rewrite the text that names the removed resume workflow pair, the removed detection model and the old include layout (`B-2`, `B-3`, `K-1`, `B-4`, `B-5`, `D-4`, `K-2`).
- Bring `command-metadata.json` argument hints and the implement `checkpoints` order in line with their owners (`D-6`, `D-7`, `A-2`).
- Extend two existing test files so the shared-include pointers and the removal of `merge_on_clean` are pinned, and make the goal-hook scenario check each file on its own (`K-3`, `A-3`, `B-7`).
- Add owned advisor signals for autopilot planning and spec search, then rebuild the skill graph (`PRB-01`, `PRB-03`, `PRB-04`, `D-10`).
- Regenerate the three compiled deep-loop contracts (`BAT-01`).

### Out of Scope
- Root `README.md` line 546, which still gives `/speckit:save` an `apply` mode (`C-3`) - the operator chose to skip the findings outside the packet, and the file is unchanged in the range.
- The literal-naming playbook scenario that names four retired workflow files (`B-8`) - the critic showed it was broken before the range, and the same operator choice excludes it.
- Any change to the advisor scorer, its weights or its thresholds - the routing fixes add phrases to lists that already exist.
- The defect in `run-lanes.cjs` that missed lane C's printed result - it belongs to the alignment command, not to this packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/README.md` | Modify | Command table: complete 13, resume 5 |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modify | `sequential_13_step` and `13-step workflow` |
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Modify | `checkpoints` lists `step_6_7_acceptance_verify` after `step_6_development` |
| `.skilled/commands/speckit/assets/speckit-resume-presentation.txt` | Modify | Detection tokens, and a panel for the not-matched candidate list |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | One resume workflow asset in place of the auto and confirm pair |
| `.skilled/skills/system-spec-kit/command-metadata.json` | Modify | Resume and search argument hints |
| `.skilled/skills/system-spec-kit/graph-metadata.json` | Modify | Four phrases added at the end of `intent_signals` for autopilot planning and spec search |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modify | Generated by `skill_graph_compiler.py --export-json`, never by hand |
| `.skilled/skills/system-spec-kit/feature-catalog/retrieval/session-recovery-spec-kit-resume.md` | Modify | Resume modes and detection as the single workflow states them |
| `.skilled/skills/system-spec-kit/feature-catalog/lifecycle/speckit-autopilot-lifecycle.md` | Modify | Plan carries the same autopilot contract as implement and complete |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-folder-literal-naming-ai-derived-slugs.md` | Modify | The activity lives in the shared include |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/session-recovery-spec-kit-resume.md` | Modify | Scenario tests the detection order the workflow has |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md` | Modify | One check per file, each with the wording that file holds |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` | Modify | Pin the `predicate_grammar`, `checkpoint_options` and `documentation_levels` pointers |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/speckit-autopilot-contract.vitest.ts` | Modify | Fail when `merge_on_clean` is in the lifecycle sequence |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Modify | Python rows: plan 7 steps, complete 13 steps |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json`, `runtime/lib/scorer/projection.ts`, `runtime/scripts/skill_advisor.py` | Modify | Generated by `derive-command-bridges.cjs`, never by hand |
| `.skilled/commands/deep/assets/compiled/deep-{ai-council,review,research}.contract.markdown` | Modify | Generated by `compile-command-contracts.cjs --write` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No surface states a step count other than 13 for complete, 7 for plan and 5 for resume. `rg -n '14\+? ?-?step|sequential_14|8-step' .skilled/commands/speckit .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` prints nothing, and the README rows for `/speckit:complete` and `/speckit:resume` read 13 and 5 |
| REQ-002 | No text in scope names a removed resume asset or the removed detection model. `rg -n 'speckit-<name>-(auto\|confirm)\.yaml' .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` prints nothing, `rg -n 'strongest session candidate\|strong candidate\|top results cluster\|2-3 alternatives\|high-confidence candidate'` over the resume catalog entry, its playbook and the resume presentation prints nothing, and the presentation `Detection:` line lists exactly the five values of `step_1_session_detection.outputs.detection_method` |
| REQ-003 | `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` prints no `/speckit:` line |
| REQ-004 | In `speckit-implement.yaml` the `checkpoints` list names the checkpoints in the order their step keys appear in the `workflow:` block |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Removing one `shared_tail` pointer to `#predicate_grammar`, `#checkpoint_options` or `#documentation_levels` from a lifecycle workflow makes `test-phase-command-workflows.js` exit 1, and adding `merge_on_clean` to a workflow's `lifecycle_sequence` makes `speckit-autopilot-contract.vitest.ts` fail |
| REQ-006 | The goal-hook scenario's command reports each of its three files separately, and each check uses wording that file holds, so the command fails when any one file loses its fence rule |
| REQ-007 | `advisor_recommend` returns the expected skill top-1 for the prompts of probes P03, P11 and P12 and for `plan this feature with the autopilot execution mode`, and the eleven probes that passed still pass |
| REQ-008 | `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` exits 0 and prints `[CONTRACT DRIFT] OK commands=3`, with no line that names a drifted command |
| REQ-009 | No gate regresses: `/local-skilled-alignment --recheck` on the run folder reports no new failing row, and the catalog entries B-4 and B-5 name the shared include and the plan autopilot contract |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The recheck of run `20261114T170200Z` lists every literal finding this phase owns as resolved and no battery row as newly failing.
- **SC-002**: `run-probes.cjs` on the same probe file prints `fail=3` or fewer, where the three left are P13, which the critic held, and P08 and P14, which section 10 answers.
- **SC-003**: `check-contract-drift.cjs` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `derive-command-bridges.cjs` and the advisor parity suites | A new owned signal can move another skill's golden prompt, and the divergence ratchet then fails | Run the ratchet and the routing drift guard before and after. A signal that moves a pinned prompt is reworded or dropped, never the pin |
| Risk | Packet `system-skill-advisor/routing-and-scoring/008-command-surfacing` is being built in another worktree and edits the same owned-signal lists | Med | Add list entries only, change no existing entry, and name the overlap in the summary so the merge is expected |
| Risk | The compiled deep-loop contracts belong to another session's change | Low | Regenerate with the compiler only, hand-edit nothing, and name it in the summary |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->

N/A. This phase edits documents, metadata and two test files. It runs no service and adds no code path.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a prompt with no owned signal still returns no recommendation. The fix adds phrases and does not lower the confidence threshold.
- Maximum input: the pointer test loops over all three lifecycle workflows, so a workflow that gains a fourth include pointer is not checked until its name is added to the list.
- Failure path: `derive-command-bridges.cjs --check` exits non-zero when a generated copy differs from its source, which is what a hand edit of `skill_advisor.py` would cause.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 20 files across the speckit commands, three skills and the advisor bridges, most of them text |
| Risk | 9/25 | New owned signals can move a pinned routing prompt. The ratchet and drift guard catch it |
| Research | 5/20 | Each finding names its file and line. The signal wording is found by probing |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Should probe P14, `author a new speckit command router and its presentation asset`, route to `sk-doc`? Decision: it stays as it is. The advisor scores `system-spec-kit` and `sk-doc` equally at 0.82, the prompt names speckit, and making `sk-doc` win would mean changing the scorer or weakening a spec-kit signal, which this phase excludes. `PRB-06` is recorded as accepted, not fixed.
- Should probe P08, `recover the last session's spec context and tell me the next step`, return `system-spec-kit`? Decision: it stays as it is. The words "tell me" trigger the scorer's `readOnlyExplainerFloor: 0.25` in `scoring-constants.ts`, so a read-only explainer prompt gets no recommendation by design. `recover the last session spec context` routes to `system-spec-kit` at 0.90. Making P08 pass would mean changing the scorer, which this phase excludes. `PRB-02` is recorded as accepted, not fixed.
<!-- /ANCHOR:questions -->

---


