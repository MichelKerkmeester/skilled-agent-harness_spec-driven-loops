---
title: "Feature Specification: Phase 7: review-doc-reconciliation"
description: "The packet's deep review returned FAIL on its coverage gate with six P2 documentation findings. The packet's completion records disagree with its evidence, one README link points at a missing anchor and the hooks tree leaves out a folder that holds code."
trigger_phrases:
  - "review doc reconciliation"
  - "phase 7 review doc reconciliation"
  - "hook cleanup deep review fixes"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: review-doc-reconciliation

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/411-hook-library-cleanup` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-codex-check-and-advisory-fixes |
| **Successor** | None |
| **Handoff Criteria** | Every requirement below has its command output recorded in `implementation-summary.md`, and a rerun of the deep review passes its coverage gate |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the hook library cleanup. A five-iteration deep review of the packet, recorded in `../review/review-report.md`, found no P0 or P1 but six P2 documentation findings, and its terminal coverage gate failed with `traceability-incomplete`. The operator chose to fix all six here and rerun the review. The rerun, generation 2 in the same `../review/`, passed every terminal gate and ended CONDITIONAL with one P1 and nine P2 findings. The operator's "Fix all" covers those too, so they are fixed in this phase.

**Scope Boundary**: Text edits to the parent `spec.md` and `goal.md`, to phase 4's `spec.md`, `tasks.md` and `implementation-summary.md`, to this phase's own records and to six hook READMEs. One code change, in the dispatch audit log core and its tests. No hook registration, kill switch or concern key changes.

**Dependencies**:
- The session-handover packet in worktree 424 owns `session-handover/README.md:74`, `runtime-behavior.md:127` and `:142` and one sentence in `coverage-rationale.md`. None of the six fixes touches them.

**Deliverables**:
- The six fixes, each with the grep or count that proves it, and a deep review rerun.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
A reader of the parent spec counts four children where seven exist, and phase 4 still reports an open README sign-off and unticked completion boxes after it closed. A maintainer who follows the documented kill-switch link lands at the top of the hooks README, and the hooks tree hides the history lookup engine.

### Purpose
Every completion record in the packet agrees with its evidence, and both navigation aids in the hooks README lead where they say.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
# From the packet folder, before any edit
$ grep -n "four children\|Four phases" spec.md goal.md
goal.md:91:- [ ] `validate.sh --recursive --strict` on this packet prints `RESULT: PASSED` for the parent and all four children
spec.md:3:description: "... Four phases remove the dead files, ..."
spec.md:59:| **Handoff Criteria** | All four children are Complete, ...
$ grep -c "not signed off" 004-hook-readme-fold-and-rewrite/implementation-summary.md
1
$ grep -c "^- \[ \]" 004-hook-readme-fold-and-rewrite/tasks.md
2

# From the repository root
$ find .skilled/hooks -name README.md | wc -l
105
$ git ls-tree -r 1c88ed62854 --name-only .skilled/hooks | grep -c 'README.md$'
104
$ git log --diff-filter=A --format='%h %s' -- .skilled/hooks/session-handover/history/README.md
169da2e8cba refactor(session-handover): move the history lookup engine into the hook folder
$ grep -c 'kill-switch-index' .skilled/hooks/README.md
0
$ grep -c 'history/' .skilled/hooks/README.md
0

# Generation 2 findings, before their fixes, with the three new tests added first
$ .skilled/node_modules/.bin/vitest run .skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs
AssertionError: expected 'HTTPS_PROXY=http://alice:hunter2@prox…' not to contain 'hunter2'
AssertionError: expected 420 to be 384 // Object.is equality
      Tests  2 failed | 131 passed (133)
$ rg -n -i "long[- ]specifier|fallback specifier|test alias" .skilled/hooks --glob '*.md'
# matches at cli-dispatch/README.md:115 and :257, subagent-dispatch-guard/README.md:92,
# subagent-dispatch-guard/pi/README.md:21 and README.md:148
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Correct the parent `spec.md` and `goal.md` to name seven children, and add phase 7 to the phase map.
- Correct phase 4's implementation summary, tick its two true completion boxes and give SC-001 the history of its count.
- Add a `kill-switch-index` target above the switch table in `.skilled/hooks/README.md`.
- Add `session-handover/history/` to the hooks README tree.
- Remove the two hooks README claims that Pi adapters keep long specifiers served by a hooks Vitest alias. Phase 5 removed both, and the operator added this fix on 2026-11-16 after it was found during this phase.
- Rerun the deep review with the same executor and confirm the coverage gate.
- Fix the ten generation 2 findings: the parent status and out-of-scope line, `goal.md`'s binding table and progress rows, this phase's summary, the removed Pi fallback and alias text in four more places, four README trees, and two hardening gaps in the dispatch audit log.

### Out of Scope
- The parent's `_memory.continuity` block (`completion_pct: 0`) - it is writer-owned, a save never writes a phase parent's continuity, and the rules forbid a hand edit. The close-out reports it as a tooling gap.
- The trigger-index staleness the last save reported - regenerating it rewrites a shared generated file outside this packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../spec.md` | Modify | Description and handoff criteria name seven children; phase map row 7 and its handoff row |
| `../goal.md` | Modify | Completion criterion 6 names seven children |
| `../004-hook-readme-fold-and-rewrite/implementation-summary.md` | Modify | The sign-off sentence and the README count |
| `../004-hook-readme-fold-and-rewrite/tasks.md` | Modify | Tick the two completion criteria |
| `../004-hook-readme-fold-and-rewrite/spec.md` | Modify | SC-001 records why the count is now 105 |
| `.skilled/hooks/README.md` | Modify | The `kill-switch-index` heading, the `history/` tree line, the two stale Pi specifier lines and the tree comment on `vitest.config.ts` |
| `.skilled/hooks/cli-dispatch/README.md` | Modify | The Pi import sentence, the `vibe/` tree line and the adapter-suite notes |
| `.skilled/hooks/subagent-dispatch-guard/README.md`, `.skilled/hooks/subagent-dispatch-guard/pi/README.md` | Modify | The fallback sentences and the `vibe/` tree line |
| `.skilled/hooks/decision-capture/README.md`, `.skilled/hooks/session-lifecycle/README.md` | Modify | The missing `opencode/` and `vibe/session-start.test.mjs` tree entries |
| `.skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs` | Modify | Redact URL userinfo and create the log owner-only |
| `.skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs` | Modify | Three tests for those two changes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No completion record in the packet contradicts its evidence | From the packet folder, `grep -n "four children\|Four phases" spec.md goal.md` and `grep -c "not signed off" 004-hook-readme-fold-and-rewrite/implementation-summary.md` print nothing and 0, and `grep -c "^- \[ \]" 004-hook-readme-fold-and-rewrite/tasks.md` prints 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | SC-001's count can be reproduced | `004/spec.md` SC-001 names the README the later merge added, and `find .skilled/hooks -name README.md \| wc -l` prints the number SC-001 now gives for main |
| REQ-003 | The documented kill-switch link resolves | `.skilled/hooks/README.md` has a heading whose GitHub slug is `kill-switch-index`, directly above the switch table |
| REQ-004 | The hooks tree lists the history engine | `grep -c 'history/' .skilled/hooks/README.md` prints 1, and `validate_document.py` prints `VALID` and `hvr_scan.py` reports `hard blockers: 0` for the README |
| REQ-005 | The hooks README no longer describes the removed Pi specifiers or alias | `grep -c "long specifier\|test alias\|config's alias" .skilled/hooks/README.md` prints 0, and the vitest command the README documents passes |
| REQ-006 | No hook README describes the removed fallback or alias, and each feature tree lists its live entries | `rg -n -i "long[- ]specifier\|fallback specifier\|test alias" .skilled/hooks --glob '*.md'` prints nothing, and the four trees name `vibe/` in cli-dispatch and subagent-dispatch-guard, `opencode/` in decision-capture and `session-start.test.mjs` in session-lifecycle |
| REQ-007 | The dispatch audit log redacts URL credentials and is created owner-only | `dispatch-audit.test.mjs` passes, including a URL-userinfo test and a mode `0o600` test that failed before the change |
| REQ-008 | The packet's status records agree | The parent's status and phase map, this phase's status and `goal.md`'s binding table all name the same seven Complete phases |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `validate.sh --recursive --strict` on the packet prints `RESULT: PASSED` for the parent and all seven children.
- **SC-002**: A rerun of the deep review records the coverage gate as pass.
- **SC-003**: The dispatch audit tests pass 133 of 133, and the adapter suites the cli-dispatch README documents pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The deep review rerun uses DeepSeek through `dsh` | A provider failure leaves SC-002 unproven | Record the failure as the result and keep the text fixes, which stand on their own checks |
| Risk | A new heading in the README overview breaks the README template check | Med | Run `validate_document.py` and `hvr_scan.py` on the README after the edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None
<!-- /ANCHOR:questions -->

---
