---
title: Deep Review Strategy - scorer-attach-4 lineage
description: Runtime strategy tracking review progress for the scorer-attach fan-out lineage, fourth pass of command surfacing.
version: 1.11.14.0
---

# Deep Review Strategy - scorer-attach-4 lineage

## 1. OVERVIEW

### Purpose

Persistent brain for this fan-out lineage. It records which dimensions remain, what was found
(P0/P1/P2), which review approaches worked or failed, and where to focus next. Read at every
iteration before any review action.

### Ownership

Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human
commentary and operator overrides live outside those markers.

---

## 2. TOPIC

Review pass four of `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
in the `scorer-attach` area. Scope: the eleven changed paths listed in
`review/review-scope-4.txt` whose area is `scorer-attach` — the attach module, the recommend
handler, the scorer modules that gate command rows, and their tests — plus shared docs that
describe them. The change range is `0cdc9fa3ef..400c90e158` (HEAD at dispatch).

The operator focus is the pass-four brief: checks on claude, codex, opencode, pi, devin and dsh;
a refusal, question or bare mention of a command still attaching or starting a mutating command;
the transcript scorer's load/followed/offer arithmetic; holdout hygiene; and docs that disagree
with code.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

---

## 4. NON-GOALS

- The renderer, hooks, plugin, session readers and doctor command docs are the
  `render-hooks-plugin-4` and `doctor-docs-4` lineages' scope. This lineage reads them only as
  context evidence.
- The transcript scorer, command-offer harness, capture baseline and corpus files are the
  `accuracy-runner-4` lineage's scope. The operator focus asks about their arithmetic; this
  lineage records the boundary and does not raise code findings outside it.
- Holdout prompt text is never read or printed. Corpus work is limited to counts and
  `jq 'del(.prompt)'` rows.
- No code changes: review is observation-only.

---

## 5. STOP CONDITIONS

- Convergence: `newFindingsRatio` at or below the 0.10 threshold with no active P0.
- Cap: `maxIterations` 4.
- Stuck: two consecutive iterations with no new evidence (stuckThreshold 2).
- Any active P0 blocks PASS regardless of convergence.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

---

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 7
- Resolved: 0

<!-- /ANCHOR:running-findings -->

---

## 8. WHAT WORKED

- Reading the three guards as one ordering chain instead of three independent checks: the retired-name gap only appears because `typedCommandIn` rewrites before `commandOnlyMentioned` reads, and the coordinated-refusal gap only appears because the lead must sit directly before each occurrence (iteration 1).
- Probing the handler's real attach path: `scoreAdvisorPrompt` put `sk-doc` and `system-deep-loop` first for the two refusal prompts, and `typedCommandForTop` returned the command for both, so the defect was proven at the public recommendation boundary rather than only at the helper (iteration 1).
- Running the compiled-route front door for the same prompts: it returned `action: defer`, which narrowed the live path to the typed attach and kept the finding honest about its caller (iteration 1).
- Running the six changed test files first: 191 passed, so the new tests are green and the gaps are uncovered inputs rather than a failing suite (iteration 1).
- Comparing the direct `what does /doctor:update do?` case with the `Is the /doctor:update command safe?` case: the first lost its command row and the second kept it, which isolated the missing `the ... command` gap in the bare-ask lead instead of blaming the doctor row (iteration 2).
- Reading `publicRecommendation` before judging the probe: `scoreAdvisorPrompt` reports `command: null` on a command row, but the handler copies the generated row's command at `handlers/advisor-recommend.ts:358-362`, so the public offer is real (iteration 2).
- Reading the packet's accepted limits before keeping a P1: phase 020 T017 records the retired-alias refusal as a known limit, which moved that finding to P2 and kept the active set honest (iteration 3).
- Comparing a requirement row with its acceptance row: `REQ-007` says the weak-cue bar is 10 and `AC-007` records 9, which located the stale side in the spec rather than asking the code to move (iteration 3).
- Checking the generated bridge table with the deriver's `--check` before reporting doc drift: `status: fresh`, `changed: []`, so the projection is not hand-edited (iteration 3).
- Treating each residual prompt as a would-be table row: the coordinated refusal, the `make sure` correction and the `Is the X command` question each fail at the assertion line, which proves the test gap without changing the suite (iteration 4).
- Reading `CHK-FIX-004` against the table it cites: the "two commands" row is the request `use /speckit:plan, not /speckit:complete`, so the checklist claim is broader than the fence (iteration 4).

---

## 9. WHAT FAILED

- Reading the mention reader as a complete refusal guard failed: its documented "every occurrence has to carry a lead" rule is what lets a coordinated refusal's second name through, so the reading produced finding `SA4-P1-002` instead of a clean pass (iteration 1).
- Reading the small-edit gate's creation guard as a document-creation check failed: `make sure`, `add a` and `new` are ordinary correction clauses, and the gate stands down on all three, so the reading produced `SA4-P1-003` (iteration 1).
- Reading the mention reader as covering every question form failed: the `Is the X command safe?` shape puts the noun between the ask word and the name, so the command row survived; it became `SA4-P2-001` rather than a clean security pass (iteration 2).
- Reading `advisor-recommend.md:39` as still true failed: the changed head-row condition and its test prove the head keeps a command the partner row also carries, so the doc sentence is stale (iteration 3).
- Reading the meaning-anchor doc's 17-case inventory as a subset failed: the new withhold cases are in the same file, and the whole file now holds 28 `it(` declarations (iteration 3).
- Reading the changed test tables as a fence for the four residual behaviors failed: none of the four inputs has a row, so the suite stays green while they are live; it became `SA4-P2-005` (iteration 4).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`commandOnlyMentioned` can read a longer command as the shorter one.** Ruled out by `(?![a-z0-9_-])` and the changed test for `/create:sk-skill-parent`; the guard returns false for the shorter name. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`commandOnlyMentioned` can read a longer command as the shorter one.** Ruled out by `(?![a-z0-9_-])` and the changed test for `/create:sk-skill-parent`; the guard returns false for the shorter name.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`commandOnlyMentioned` can read a longer command as the shorter one.** Ruled out by `(?![a-z0-9_-])` and the changed test for `/create:sk-skill-parent`; the guard returns false for the shorter name.

### **A read-only command is withheld by the scorer on a no-edit request.** Ruled out: `withholdWritingCommandsOnNoEdit` returns the `command-doctor-env` row unchanged and the changed test asserts it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A read-only command is withheld by the scorer on a no-edit request.** Ruled out: `withholdWritingCommandsOnNoEdit` returns the `command-doctor-env` row unchanged and the changed test asserts it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A read-only command is withheld by the scorer on a no-edit request.** Ruled out: `withholdWritingCommandsOnNoEdit` returns the `command-doctor-env` row unchanged and the changed test asserts it.

### **Holdout rows are read by a changed source path.** Ruled out: no changed source file references either corpus file; the only corpus readers are tests that select tune ids and assert the split. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Holdout rows are read by a changed source path.** Ruled out: no changed source file references either corpus file; the only corpus readers are tests that select tune ids and assert the split.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Holdout rows are read by a changed source path.** Ruled out: no changed source file references either corpus file; the only corpus readers are tests that select tune ids and assert the split.

### **The `advisor-recommend.md:39` sentence is still true because the head and the row are different recommendations.** Ruled out: the changed test expects the head's `command` to equal the row's command and still finds the row, so the same command takes two slots. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The `advisor-recommend.md:39` sentence is still true because the head and the row are different recommendations.** Ruled out: the changed test expects the head's `command` to equal the row's command and still finds the row, so the same command takes two slots.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `advisor-recommend.md:39` sentence is still true because the head and the row are different recommendations.** Ruled out: the changed test expects the head's `command` to equal the row's command and still finds the row, so the same command takes two slots.

### **The `REFUSE8` table's name is the defect.** Ruled out: the name encodes eight rows but the table is data-driven; the missing class, not the name, is the finding. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The `REFUSE8` table's name is the defect.** Ruled out: the name encodes eight rows but the table is data-driven; the missing class, not the name, is the finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `REFUSE8` table's name is the defect.** Ruled out: the name encodes eight rows but the table is data-driven; the missing class, not the name, is the finding.

### **The compiled route can attach the refused command.** Ruled out for the exact probe prompts: `compiled-route.cjs` returns `action: defer` for `do not run /create:skill` and for `do not run /deep:review or /deep:research`. The live attach is the typed path. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The compiled route can attach the refused command.** Ruled out for the exact probe prompts: `compiled-route.cjs` returns `action: defer` for `do not run /create:skill` and for `do not run /deep:review or /deep:research`. The live attach is the typed path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The compiled route can attach the refused command.** Ruled out for the exact probe prompts: `compiled-route.cjs` returns `action: defer` for `do not run /create:skill` and for `do not run /deep:review or /deep:research`. The live attach is the typed path.

### **The doctor command row can be offered on a direct `what does` question.** Ruled out by the probe: `what does /doctor:update do?` passes only `system-skilled-doctor`; the command row is withheld. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The doctor command row can be offered on a direct `what does` question.** Ruled out by the probe: `what does /doctor:update do?` passes only `system-skilled-doctor`; the command row is withheld.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The doctor command row can be offered on a direct `what does` question.** Ruled out by the probe: `what does /doctor:update do?` passes only `system-skilled-doctor`; the command row is withheld.

### **The doctor question is covered by the direct `what does` case.** Ruled out: the direct case passes and withholds the row; the noun form does not. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The doctor question is covered by the direct `what does` case.** Ruled out: the direct case passes and withholds the row; the noun form does not.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The doctor question is covered by the direct `what does` case.** Ruled out: the direct case passes and withholds the row; the noun form does not.

### **The generated projection was hand-edited.** Ruled out by the deriver's `--check`: `status: fresh`, `changed: []`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The generated projection was hand-edited.** Ruled out by the deriver's `--check`: `status: fresh`, `changed: []`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The generated projection was hand-edited.** Ruled out by the deriver's `--check`: `status: fresh`, `changed: []`.

### **The mention reader's 17-case inventory is an intentional subset.** Ruled out by the sentence's own list (cosine, margin, stand-in refusal, eligibility, ranking), which cannot include the six new withhold cases. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The mention reader's 17-case inventory is an intentional subset.** Ruled out by the sentence's own list (cosine, margin, stand-in refusal, eligibility, ranking), which cannot include the six new withhold cases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The mention reader's 17-case inventory is an intentional subset.** Ruled out by the sentence's own list (cosine, margin, stand-in refusal, eligibility, ranking), which cannot include the six new withhold cases.

### **The question case can silently write.** Ruled out for this command: `commandRowFor('command-doctor-update')?.policy` is `ask` (generated row, `command-attach.ts:178`), so the command asks before it acts. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The question case can silently write.** Ruled out for this command: `commandRowFor('command-doctor-update')?.policy` is `ask` (generated row, `command-attach.ts:178`), so the command asks before it acts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The question case can silently write.** Ruled out for this command: `commandRowFor('command-doctor-update')?.policy` is `ask` (generated row, `command-attach.ts:178`), so the command asks before it acts.

### **The retired-name rewrite itself is wrong.** Ruled out: `typedCommandIn('/create:skill')` returning `/create:sk-skill` is the phase's stated behavior, and the changed test pins it. The finding is the guard ordering, not the mapping. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The retired-name rewrite itself is wrong.** Ruled out: `typedCommandIn('/create:skill')` returning `/create:sk-skill` is the phase's stated behavior, and the changed test pins it. The finding is the guard ordering, not the mapping.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The retired-name rewrite itself is wrong.** Ruled out: `typedCommandIn('/create:skill')` returning `/create:sk-skill` is the phase's stated behavior, and the changed test pins it. The finding is the guard ordering, not the mapping.

### **The small-edit gate can withhold a genuine creation request.** Ruled out for the control prompts: `write a readme for the doctor scripts folder` and `create a readme for the payments module, check it for typos when done` still return `/create:readme`; the existing tests cover both. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The small-edit gate can withhold a genuine creation request.** Ruled out for the control prompts: `write a readme for the doctor scripts folder` and `create a readme for the payments module, check it for typos when done` still return `/create:readme`; the existing tests cover both.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The small-edit gate can withhold a genuine creation request.** Ruled out for the control prompts: `write a readme for the doctor scripts folder` and `create a readme for the payments module, check it for typos when done` still return `/create:readme`; the existing tests cover both.

### **The small-edit suite's creation controls already cover the generic words.** Ruled out: the controls use `write a readme` and `create a readme ... check it for typos`, where the creation verb is the sentence's verb; the missing cases use `make sure` and `new` as modifiers. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The small-edit suite's creation controls already cover the generic words.** Ruled out: the controls use `write a readme` and `create a readme ... check it for typos`, where the creation verb is the sentence's verb; the missing cases use `make sure` and `new` as modifiers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The small-edit suite's creation controls already cover the generic words.** Ruled out: the controls use `write a readme` and `create a readme ... check it for typos`, where the creation verb is the sentence's verb; the missing cases use `make sure` and `new` as modifiers.

### **The test suite is failing and the gaps are visible as red.** Ruled out: 191 passed; the gaps are missing inputs. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The test suite is failing and the gaps are visible as red.** Ruled out: 191 passed; the gaps are missing inputs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The test suite is failing and the gaps are visible as red.** Ruled out: 191 passed; the gaps are missing inputs.

### **The weak-cue code is wrong and should be 10.** Ruled out by the accepted `T025` evidence: the tune row at 9.51 loses its command at 10, and `AC-007` records the bar of 9. The finding is the stale spec text, not the constant. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The weak-cue code is wrong and should be 10.** Ruled out by the accepted `T025` evidence: the tune row at 9.51 loses its command at 10, and `AC-007` records the bar of 9. The finding is the stale spec text, not the constant.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The weak-cue code is wrong and should be 10.** Ruled out by the accepted `T025` evidence: the tune row at 9.51 loses its command at 10, and `AC-007` records the bar of 9. The finding is the stale spec text, not the constant.

### `agent_cross_runtime` -- partial: no runtime branch; live proof belongs to the phase 007 arm. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `agent_cross_runtime` -- partial: no runtime branch; live proof belongs to the phase 007 arm.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` -- partial: no runtime branch; live proof belongs to the phase 007 arm.

### `agent_cross_runtime` -- partial. `command-attach.ts` and `advisor-recommend.ts` carry no runtime branch; the typed-command attach is shared by every runtime's handler call. Live per-runtime proof is not available in this lineage and belongs to the phase 007 arm. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `agent_cross_runtime` -- partial. `command-attach.ts` and `advisor-recommend.ts` carry no runtime branch; the typed-command attach is shared by every runtime's handler call. Live per-runtime proof is not available in this lineage and belongs to the phase 007 arm.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` -- partial. `command-attach.ts` and `advisor-recommend.ts` carry no runtime branch; the typed-command attach is shared by every runtime's handler call. Live per-runtime proof is not available in this lineage and belongs to the phase 007 arm.

### `agent_cross_runtime` -- partial. No runtime branch in the changed modules; live per-runtime proof belongs to the phase 007 arm. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `agent_cross_runtime` -- partial. No runtime branch in the changed modules; live per-runtime proof belongs to the phase 007 arm.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` -- partial. No runtime branch in the changed modules; live per-runtime proof belongs to the phase 007 arm.

### `agent_cross_runtime` -- partial. The scorer and handler have no runtime branch. The third-row rendering question is a renderer/plugin concern owned by `render-hooks-plugin-4`; this lineage records the scorer row, not the rendered brief. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `agent_cross_runtime` -- partial. The scorer and handler have no runtime branch. The third-row rendering question is a renderer/plugin concern owned by `render-hooks-plugin-4`; this lineage records the scorer row, not the rendered brief.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` -- partial. The scorer and handler have no runtime branch. The third-row rendering question is a renderer/plugin concern owned by `render-hooks-plugin-4`; this lineage records the scorer row, not the rendered brief.

### `checklist_evidence` -- partial: the phase checklist's `CHK-FIX-004` overstates the two-command coverage; `AC-007` records 9 against `REQ-007`'s 10. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `checklist_evidence` -- partial: the phase checklist's `CHK-FIX-004` overstates the two-command coverage; `AC-007` records 9 against `REQ-007`'s 10.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` -- partial: the phase checklist's `CHK-FIX-004` overstates the two-command coverage; `AC-007` records 9 against `REQ-007`'s 10.

### `checklist_evidence` -- partial. `AC-002`, `AC-003`, `AC-004`, `AC-006` and `AC-007` are marked Met with evidence. `AC-004`'s evidence correctly limits the gate to the three commands; `AC-007` records the bar of 9 while `REQ-007` says 10. `CHK-FIX-004` claims a "two commands" adversarial case, but the table's two-command case is a request (`use /speckit:plan, not /speckit:complete`), not a coordinated refusal. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence` -- partial. `AC-002`, `AC-003`, `AC-004`, `AC-006` and `AC-007` are marked Met with evidence. `AC-004`'s evidence correctly limits the gate to the three commands; `AC-007` records the bar of 9 while `REQ-007` says 10. `CHK-FIX-004` claims a "two commands" adversarial case, but the table's two-command case is a request (`use /speckit:plan, not /speckit:complete`), not a coordinated refusal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` -- partial. `AC-002`, `AC-003`, `AC-004`, `AC-006` and `AC-007` are marked Met with evidence. `AC-004`'s evidence correctly limits the gate to the three commands; `AC-007` records the bar of 9 while `REQ-007` says 10. `CHK-FIX-004` claims a "two commands" adversarial case, but the table's two-command case is a request (`use /speckit:plan, not /speckit:complete`), not a coordinated refusal.

### `checklist_evidence` -- pending. No checklist claim is in this iteration's focus; deferred to iteration 3. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence` -- pending. No checklist claim is in this iteration's focus; deferred to iteration 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` -- pending. No checklist claim is in this iteration's focus; deferred to iteration 3.

### `checklist_evidence` -- pending. No packet checklist claim is under review in this iteration; the phase 020 checklist rows are read at the traceability iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence` -- pending. No packet checklist claim is under review in this iteration; the phase 020 checklist rows are read at the traceability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` -- pending. No packet checklist claim is under review in this iteration; the phase 020 checklist rows are read at the traceability iteration.

### `feature_catalog_code` -- partial (unchanged from iteration 3): the two stale docs are P2s. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `feature_catalog_code` -- partial (unchanged from iteration 3): the two stale docs are P2s.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` -- partial (unchanged from iteration 3): the two stale docs are P2s.

### `feature_catalog_code` -- partial. `advisor-recommend.md:39` is false after the head-row change; `command-meaning-matching.md:65` is stale; `doctor-command-routing.md`'s handoff description remains true at the level it states. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code` -- partial. `advisor-recommend.md:39` is false after the head-row change; `command-meaning-matching.md:65` is stale; `doctor-command-routing.md`'s handoff description remains true at the level it states.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` -- partial. `advisor-recommend.md:39` is false after the head-row change; `command-meaning-matching.md:65` is stale; `doctor-command-routing.md`'s handoff description remains true at the level it states.

### `feature_catalog_code` -- pending; iteration 3. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `feature_catalog_code` -- pending; iteration 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` -- pending; iteration 3.

### `feature_catalog_code` -- pending. The `command-meaning-matching.md` and `advisor-recommend.md` claims are deferred to iteration 3. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code` -- pending. The `command-meaning-matching.md` and `advisor-recommend.md` claims are deferred to iteration 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` -- pending. The `command-meaning-matching.md` and `advisor-recommend.md` claims are deferred to iteration 3.

### `playbook_capability` -- notApplicable. -- BLOCKED (iteration 4, 3 attempts)
- What was tried: `playbook_capability` -- notApplicable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` -- notApplicable.

### `skill_agent` -- notApplicable; no agent definition changed in this area. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `skill_agent` -- notApplicable; no agent definition changed in this area.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` -- notApplicable; no agent definition changed in this area.

### `skill_agent` -- notApplicable; no agent-definition change in this area. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `skill_agent` -- notApplicable; no agent-definition change in this area.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` -- notApplicable; no agent-definition change in this area.

### `skill_agent` -- notApplicable. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `skill_agent` -- notApplicable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` -- notApplicable.

### `skill_agent`, `playbook_capability` -- notApplicable for this iteration; no playbook surface changed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent`, `playbook_capability` -- notApplicable for this iteration; no playbook surface changed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`, `playbook_capability` -- notApplicable for this iteration; no playbook surface changed.

### `spec_code` -- partial (unchanged from iteration 3): the one active P1 is the coordinated refusal; the two accepted limits are recorded as P2s; the REQ-007 text is stale. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code` -- partial (unchanged from iteration 3): the one active P1 is the coordinated refusal; the two accepted limits are recorded as P2s; the REQ-007 text is stale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` -- partial (unchanged from iteration 3): the one active P1 is the coordinated refusal; the two accepted limits are recorded as P2s; the REQ-007 text is stale.

### `spec_code` -- partial. `REQ-003` and `REQ-004` name their exact prompts and those pass; `REQ-007` is stale against the accepted T025 decision; the coordinated refusal is an uncovered class, which is `SA4-P1-002`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code` -- partial. `REQ-003` and `REQ-004` name their exact prompts and those pass; `REQ-007` is stale against the accepted T025 decision; the coordinated refusal is an uncovered class, which is `SA4-P1-002`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` -- partial. `REQ-003` and `REQ-004` name their exact prompts and those pass; `REQ-007` is stale against the accepted T025 decision; the coordinated refusal is an uncovered class, which is `SA4-P1-002`.

### `spec_code` -- partial. Phase 020's purpose says a correction inside an existing document carries no writing command; finding 3 names the generic-word path that still carries one. `REQ-004`'s two exact control prompts pass (`update the README typo in line 3` and `fix the typo in the README` return no command). Phase 024's mention reader is present and its tested cases pass; findings 1 and 2 are inputs the phase's purpose names but its tables do not cover. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code` -- partial. Phase 020's purpose says a correction inside an existing document carries no writing command; finding 3 names the generic-word path that still carries one. `REQ-004`'s two exact control prompts pass (`update the README typo in line 3` and `fix the typo in the README` return no command). Phase 024's mention reader is present and its tested cases pass; findings 1 and 2 are inputs the phase's purpose names but its tables do not cover.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` -- partial. Phase 020's purpose says a correction inside an existing document carries no writing command; finding 3 names the generic-word path that still carries one. `REQ-004`'s two exact control prompts pass (`update the README typo in line 3` and `fix the typo in the README` return no command). Phase 024's mention reader is present and its tested cases pass; findings 1 and 2 are inputs the phase's purpose names but its tables do not cover.

### `spec_code` -- partial. The phase 020 purpose says a command the prompt only asks about is not offered; the direct `what does` form passes, but the `is the X command` form does not. The three P1s from iteration 1 remain the larger spec mismatch. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code` -- partial. The phase 020 purpose says a command the prompt only asks about is not offered; the direct `what does` form passes, but the `is the X command` form does not. The three P1s from iteration 1 remain the larger spec mismatch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` -- partial. The phase 020 purpose says a command the prompt only asks about is not offered; the direct `what does` form passes, but the `is the X command` form does not. The three P1s from iteration 1 remain the larger spec mismatch.

<!-- /ANCHOR:exhausted-approaches -->

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- **The compiled route attaches the refused command.** Ruled out for `do not run /create:skill` and `do not run /deep:review or /deep:research`: `compiled-route.cjs` returns `action: defer`, so the typed attach is the live path (iteration 1, evidence: probe output and `handlers/advisor-recommend.ts:704`).
- **The retired-name rewrite is itself wrong.** Ruled out: the changed test pins `/create:skill` → `/create:sk-skill`, and the phase decision chose that mapping; only the guard ordering is defective (iteration 1).
- **`commandOnlyMentioned` reads a longer command as its shorter prefix.** Ruled out by the `(?![a-z0-9_-])` boundary and the `/create:sk-skill-parent` test (iteration 1).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining; synthesis
- Focus area: the compiled review report, the planning packet and the final verdict.
- Reason: all four dimensions are covered; one active P1 and seven P2s are recorded.
- Rotation status: correctness, security, traceability and maintainability complete (CONDITIONAL).
- Blocked/productive carry-forward: no blocked approach; the four-iteration trail is complete.
- Required evidence: the registry's active counts, the iteration final lines and the synthesis report.

<!-- /ANCHOR:next-focus -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `runtime/lib/command-attach.ts`, `runtime/lib/scorer/fusion.ts`,
  `runtime/lib/scorer/doctor-helper-handoff.ts`, `runtime/lib/scorer/projection.ts`,
  `runtime/handlers/advisor-recommend.ts`, and the six changed test files.
- Behavior claims: phase 020 spec `REQ-003`, `REQ-004`, `REQ-006`, `REQ-007`; phase 024's mention
  reader decisions P022 and P024; phase 021's head-row parity decision P015.
- Reuse and conventions: the generated command tables are outputs of
  `runtime/scripts/command-bridges/derive-command-bridges.cjs`; the `--check` run is fresh.
  Review doctrine is `sk-code-review/references/review-core.md` §2.
- Review risks and gaps: the local compiled dist is stale (system reminder). Tests read source
  through vitest, so a source-level probe is valid, but a live runtime could still load dist.
  No live per-runtime session is available; cross-runtime claims rest on the runtime-neutral
  handler and the shared tests.
- Out of scope: transcript scorer arithmetic, renderer output, holdout prompt text.

---

<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3 | REQ-003/004 exact prompts pass; REQ-007 says 10 while AC-007 and the code use 9; the coordinated refusal is an uncovered class (SA4-P1-002). |
| `checklist_evidence` | core | partial | 3 | AC-002/003/004/006/007 are Met with evidence; AC-007 records 9 while REQ-007 says 10; CHK-FIX-004's "two commands" case is a request, not a coordinated refusal. |
| `skill_agent` | overlay | notApplicable | 3 | No agent definition changed in this area. |
| `agent_cross_runtime` | overlay | partial | 3 | No runtime branch in the changed attach/handler files; live per-runtime proof belongs to the phase 007 arm. |
| `feature_catalog_code` | overlay | partial | 3 | `advisor-recommend.md:39` stale after the head-row change; `command-meaning-matching.md:65` stale count; doctor routing text still true. |
| `playbook_capability` | overlay | notApplicable | - | No playbook surface in the changed files |
<!-- /ANCHOR:cross-reference-status -->
