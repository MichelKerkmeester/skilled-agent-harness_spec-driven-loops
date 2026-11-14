---
title: "Goal: Phase 23: epic-review-doc-fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "epic review doc fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/023-epic-review-doc-fixes"
    last_updated_at: "2026-11-14T16:20:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned the four document findings and the saved evidence"
    next_safe_action: "The builder runs the suites and edits the documents"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/README.md", ".skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md", ".skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md", ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-023-epic-review-doc-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the app title follow --name for a generated title? The operator-run scenario records both."
    answered_questions:
      - "Is 002 AC-003 rewritten? No, it is superseded through ADR-001."
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 23: epic-review-doc-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The Claude adapter README, the feature catalog and the Claude playbook say what the relaunch code does, the JSDoc and the two stale summary lines are corrected, the seven acceptance rows carry saved evidence, and one operator-run scenario checks a real hop.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | One shared child for findings F3, F5, F6 and F7, per parent D1 and the operator's choice of 2026-11-14. |
| D2 | Documents only. The one code file touched is a JSDoc line in `relaunch-core.cjs`, and no adapter, test or skill metadata changes. |
| D3 | The seven named acceptance rows get a dated note that names a saved run under `scratch/`. A row stays `Met` only when a test on the final tree proves it. |
| D4 | 002 AC-003 is `Superseded` through ADR-001 in a new `decision-record.md`, because phase 021 reverses its rule. |
| D5 | The live-hop check is written for the operator, marked operator-run, and not claimed as run. |
| D6 | No version bump and no trigger index rebuild, following phase 019. Nothing is merged or pushed without the operator, per parent D4. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `rg -c 'A spawn failure leaves the record pending for the next Stop' .skilled/hooks/session-relaunch/claude/README.md` prints nothing with exit 1, and `rg -c 'AskUserQuestion'` and `rg -c 'generatedName'` print 1 or more for the catalog and the playbook. Observed 2026-11-14: exit 1 with no output, and each count prints 1 (`scratch/checks.txt`).
- [x] `rg -c '@returns \{\{model: string, effort: string, name: string\}\}' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints nothing with exit 1, and both stale lines of the child 001 summary carry a dated note. Observed: exit 1 with no output, and `rg -c '2026-11'` on the summary prints 8 (`scratch/checks.txt`).
- [x] `scratch/final-suite.txt`, `scratch/goal-suite.txt` and `scratch/pi-suite.txt` each hold a passing run, and all seven acceptance rows name one of them. Observed: 1555 of 1555, 200 of 200 and 62 of 62, each exit 0, and every row names a file and its count.
- [x] `rg -c 'ADR-001'` prints 1 or more for `002-packet-goal-fallback/decision-record.md` and its `acceptance-criteria.md`, and 002 AC-003 is `Superseded`. Observed: 3 and 2, and the row is `Superseded` with `ADR-001` in its Waiver cell.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title --recursive --strict` prints `RESULT: PASSED` for every folder and never `RESULT: FAILED`. Observed: exit 0, 24 folders passed and none failed (`scratch/validate-recursive.txt`).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Review findings | Done | 2026-11-14, the whole-epic review findings F3, F5, F6 and F7, CONFIRMED against the tree at `fa6a56f0fc` |
| Operator answer | Done | 2026-11-14: fix all seven P2 findings as new children from 020, the document fixes in one shared child, and add a short manual check of a real hop |
| Code and document read | Done | 2026-11-14 at `fa6a56f0fc`: the false README sentence at `claude/README.md:27`, the empty catalog and playbook search, the JSDoc at `lib/relaunch-core.cjs:800`, and the two summary lines at `001-sender-dialog-after-prepare/implementation-summary.md:129` and `:131` |
| Plan documents | Done | 2026-11-14: spec, plan, tasks, criteria and this goal written |
| Build | Done | 2026-11-14 at `2638731a9d`: T001 to T022 and T024 ran and are ticked in `tasks.md`, with T023's working-tree substitute recorded and its commit-scope run left to the orchestrator |
| Evidence | Done | `scratch/final-suite.txt` 1555 of 1555, `scratch/goal-suite.txt` 200 of 200, `scratch/pi-suite.txt` 62 of 62, all exit 0. `scratch/validate-folders.txt` and `scratch/validate-recursive.txt` hold `RESULT: PASSED` for 7 and 24 folders |
| Same-class producers | Done | `scratch/producers.txt`. `AskUserQuestion` has 36 hits: the three session-relaunch files this phase named (guard, adapter README, guard test), the hooks README, the Claude playbook, the catalog, `.claude/settings.json`, `hook-registry.json`, and the rest in the ask-surface-guard and decision-capture concerns with their benchmark reports, retrieval fixtures and changelog entry, which own a different feature. `generatedName` has 5 hits: the catalog entry this phase edited, `relaunch-core.cjs`, `context-usage.cjs`, `context-usage.test.cjs` and `session-relaunch.cjs`, all in the relaunch concern |
| Fix commit | Pending | The orchestrator commits. `git status --porcelain -uall` lists the allowed documents, the one JSDoc comment, the derived metadata and the `scratch/` files, with no test and no adapter file |
| Merge and push | Pending | Parent decision D4: nothing is merged or pushed without the operator |

### Deviations and findings

| Item | Note |
|------|------|
| The summary gains two notes, not one | Finding F6 names line 131. Phase 020 adds the throwing-read test that line 129 says does not exist, so line 129 would become false. Both lines get a dated note. |
| A new decision record in a closed child | The closure gate needs an ADR to drop a criterion. The ADR keeps the row's id and records what was true when it was written, and the new rule is held by the criteria of phase 021. |
| The live-hop check is not run here | It is an operator step, and the packet records no live result. Its evidence list names what to keep. |
| The JSDoc line had moved | The plan named `relaunch-core.cjs:800` and the shape was at `:866` when read. The edit added one line, so four engine citations below it moved by one, and `scratch/citations.txt` holds the corrected numbers. |
| The commit-scope check waits on the orchestrator | `T023`, `CHK-010` and the last clause of `AC-007` name `git show --name-status FIX`, and no `FIX` exists yet. The working-tree `git status --porcelain -uall` stands in and is recorded in `tasks.md` and the summary. |
| `CHK-040` named a search that never held | The row said all three documents name `F3` to `F7`. `spec.md` names the findings by description and `plan.md` does not say "live hop", so the row was rewritten to the state that holds: `plan.md` and `tasks.md` name the F ids, and `spec.md` names the four findings and the live-hop check without them. |
| The P1 checklist count was one short | The table said 11 P1 items and the checklist holds 12. The summary table now says 12, and every one is verified. |
<!-- /ANCHOR:log -->
