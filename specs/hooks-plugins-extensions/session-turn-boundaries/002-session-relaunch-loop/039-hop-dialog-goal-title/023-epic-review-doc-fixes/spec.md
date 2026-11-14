---
title: "Feature Specification: Phase 23: epic-review-doc-fixes"
description: "The whole-epic review of 2026-11-14 found one false README sentence, two undocumented behaviors, one stale comment pair and seven acceptance rows whose evidence was never saved. One child closes all of it, and adds the operator's manual check of a real hop."
trigger_phrases:
  - "epic review doc fixes"
  - "phase 23 epic review doc fixes"
  - "question guard and generated title documentation"
  - "saved acceptance evidence"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 23: epic-review-doc-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | Not chosen yet. The operator picks a worktree or the current branch before the build |
| **Parent Spec** | ../spec.md |
| **Phase** | 23 of 23 |
| **Predecessor** | 022-stop-park-notices |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 023-epic-review-doc-fixes --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 23** of the hop dialog, goal and title specification, the last child of the 2026-11-14 whole-epic review round. Parent decision D1 puts every document fix in one shared child.

**Scope Boundary**: Documents only, plus one JSDoc comment in `lib/relaunch-core.cjs` that changes no behavior. The Claude adapter README, the feature catalog entry, the Claude playbook, one comment, two lines of a closed child's summary, seven acceptance rows and one new decision record in a closed child. No test, no adapter behavior and no skill metadata.

**Dependencies**:
- Phases 020, 021 and 022 land first, because this child documents the armable guard and the large-log read and because it reruns the suites on the tree that holds them.
- Phase 017 shipped the `stop-arm.mjs` row this child corrects. Phase 022 edits the same row for its notices, so 023 runs after it.
- The seven acceptance rows belong to closed children. Editing one changes its source fingerprint, so `repair-derived.cjs --apply` runs on every folder this child edits.
- The operator asked on 2026-11-14 for a short manual check of a real hop covering the question guard, the packet goal fallback and the generated title.

**Deliverables**:
- One corrected README sentence on a failed killer spawn.
- Catalog text for the question dialog guard and the generated title carry.
- One operator-run playbook scenario that checks both behaviors and the packet goal fallback across one real hop.
- The JSDoc return shape with `generatedName`, and two dated notes in the summary of child 001.
- Saved suite output for the seven acceptance rows, with a dated note on each.
- A decision record in child 002 that supersedes its capped-tail criterion, which phase 021 reverses.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 2026-11-14 whole-epic review left four document findings.

The `stop-arm.mjs` row of `claude/README.md` says "A spawn failure leaves the record pending for the next Stop" (`:27`). The code logs the failure and returns the armed record (`claude/stop-arm.mjs:74` to `:84`, `:230`), the test asserts `status: armed` (`tests/claude-adapters.test.cjs:1001`), and the shared README and the feature catalog already say armed.

The feature catalog entry and the Claude playbook never mention the question dialog guard or the generated title carry. A search for `AskUserQuestion`, `question dialog`, `generated title` and `generatedName` in both files exits 1.

The JSDoc at `lib/relaunch-core.cjs:800` returns `{model, effort, name}` and omits `generatedName`, which the function sets at `:804` and `:823`. The summary of child 001 says only `cancel` clears a parked record (`001-sender-dialog-after-prepare/implementation-summary.md:131`), which phase 005 changed, and says no test covers a throwing record read (`:129`), which phase 020 changes.

Seven acceptance rows are marked `Met` on evidence nobody saved: 001 AC-005, 002 AC-003, 002 AC-007, 003 AC-006, 005 AC-007, 007 AC-004 and 011 AC-004. One of them, 002 AC-003, states a rule that phase 021 reverses.

### Purpose
The documents say what the shipped code does, the seven rows carry saved evidence, the one row whose rule was reversed is superseded through a decision record, and the operator has one short script to check the three headline behaviors on a real hop.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the repository root on 2026-11-14 at commit `fa6a56f0fc`. The first command prints the false README sentence. The second shows the catalog and the playbook name neither behavior. The third and fourth show the stale comment and the two stale summary lines. The last lists the seven rows.

```text
$ rg -n -o 'A spawn failure leaves the record pending for the next Stop' .skilled/hooks/session-relaunch/claude/README.md
27:A spawn failure leaves the record pending for the next Stop
exit=0

$ rg -c 'AskUserQuestion|question dialog|generated title|generatedName' .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md
exit=1

$ rg -n -o '@returns \{\{model: string, effort: string, name: string\}\}|generatedName: typeof found.generatedName' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs
800:@returns {{model: string, effort: string, name: string}}
823:generatedName: typeof found.generatedName
exit=0

$ rg -n -o 'A pending record that Stop cannot arm keeps refusing questions|No test covers a throwing record read' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare/implementation-summary.md
129:No test covers a throwing record read
131:A pending record that Stop cannot arm keeps refusing questions
exit=0
```

The README sentence is false. Neither document names the dialog guard or the title carry. The JSDoc omits `generatedName`, which the function sets. Both summary lines are stale. The seven acceptance rows the review names are listed in the Problem Statement above.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Correct the `stop-arm.mjs` sentence in `claude/README.md` to say a spawn failure leaves the record armed and the next Stop re-arms it.
- Add one catalog sentence on the question dialog guard in the Nudge Prepare And Arm section, and one on the generated title carry in the Killer And Wrapper section. Each names the source file and the phase that shipped it.
- Add one operator-run scenario to the Claude playbook that walks a real hop through the question guard, the packet goal fallback and the generated title carry, with evidence and pass or fail signals. Mark it operator-run in its heading and its first line.
- Add `generatedName: string` to the JSDoc return shape at `lib/relaunch-core.cjs:800`.
- Correct the two stale lines of `001-sender-dialog-after-prepare/implementation-summary.md` with dated notes.
- Rerun the relaunch and OpenCode plugin suites, the goal hook suites and the Pi suite on the final tree, and save each output under `scratch/`.
- Append a dated evidence note to the seven rows, each naming the saved file and the count.
- Add `002-packet-goal-fallback/decision-record.md` with ADR-001, which supersedes 002 AC-003 because phase 021 reverses its rule.
- Run the sk-doc playbook and catalog validators, the runtime mirror check and strict validation on every folder this child edits.

### Out of Scope
- A code behavior change. The only code file touched is a comment line in `relaunch-core.cjs`.
- Running the live-hop scenario. It is written for the operator and marked operator-run. No live hop is claimed.
- The Pi and OpenCode playbook. The guard and the title carry are Claude only, and the wrapper evidence already names the shared suite.
- A trigger index rebuild. This repository rebuilds its index on its own after a packet's documents land.
- A version bump or changelog for the skill documents. Phase 019 changed the same two documents with neither, and this child follows it.
- The four code fixes themselves, which phases 020 to 022 own.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/claude/README.md` | Modify | The `stop-arm.mjs` row says a spawn failure leaves the record armed |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` | Modify | The dialog guard and the generated title carry gain one sentence each |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` | Modify | One operator-run hop scenario covering the guard, the packet goal and the title |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | The JSDoc return shape includes `generatedName` |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare/implementation-summary.md` | Modify | Dated notes on the throwing-read test and on the parked record |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare/acceptance-criteria.md` | Modify | A dated note on AC-005 that names the saved run and the test phase 020 adds |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/002-packet-goal-fallback/acceptance-criteria.md` | Modify | AC-003 is Superseded by ADR-001, and AC-007 gains a dated note |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/002-packet-goal-fallback/decision-record.md` | Create | ADR-001 records that a log over the cap is now read whole |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/003-generated-title-carry/acceptance-criteria.md` | Modify | A dated note on AC-006 that names the saved runs |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/005-parked-record-escape/acceptance-criteria.md` | Modify | A dated note on AC-007 that names the saved run |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/007-killer-test-margin/acceptance-criteria.md` | Modify | A dated note on AC-004 that names the saved run |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/011-goal-fallback-bound/acceptance-criteria.md` | Modify | A dated note on AC-004 that names the saved run |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The `stop-arm.mjs` row of `claude/README.md` says a spawn failure leaves the record armed and the next Stop re-arms it. The old sentence returns no match. |
| REQ-002 | The feature catalog names the question dialog guard and the generated title carry, each with the file or phase that owns it. `rg -c 'AskUserQuestion'` and `rg -c 'generatedName'` on the catalog each print 1 or more. |
| REQ-003 | The Claude playbook holds one scenario marked operator-run that checks the question guard, the packet goal fallback and the generated title carry across one real hop, with evidence and pass or fail signals. `rg -c 'operator-run'` prints 1 or more and `rg -c 'AskUserQuestion'` prints 1 or more. |
| REQ-004 | The JSDoc at `lib/relaunch-core.cjs:800` names `generatedName`, and the two stale lines of the child 001 summary carry dated notes that name the phase that changed each. |
| REQ-005 | The seven named acceptance rows carry a dated note that names a saved suite run under `scratch/`. 001 AC-005 names the throwing-read test phase 020 adds, and 002 AC-003 is no longer `Met`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `002-packet-goal-fallback/decision-record.md` declares ADR-001, and AC-003 of that child is `Superseded` with `ADR-001` in its Waiver cell. The closed child's closure statement accepts that state. |
| REQ-007 | The sk-doc playbook and catalog validators, the runtime mirror check and `validate.sh --strict` pass for this child and for every folder this child edits. No adapter behavior, test or skill metadata changes. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The old README sentence and the old JSDoc shape return no match, and the catalog and playbook counts for the dialog guard and the title carry are each 1 or more.
- **SC-002**: `scratch/final-suite.txt`, `scratch/goal-suite.txt` and `scratch/pi-suite.txt` each show a passing run, and all seven rows name one of them.
- **SC-003**: The four sk-doc checks and the mirror check exit 0.
- **SC-004**: `validate.sh 023-epic-review-doc-fixes --strict` prints `RESULT: PASSED`, and so does the same command for every folder this child edits.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 020 to 022 land first | The saved runs would not cover the fixes the rows depend on | T001 checks each fix commit is an ancestor of `HEAD` |
| Risk | A playbook edit breaks the operator contract the CI validator checks | Med | The strict validator runs in verification, and the new scenario copies the shape of HS-8 |
| Risk | A superseded row in a closed child changes what that child claimed | Low | The ADR records what was true when the row was written and what replaced it, and the row keeps its id |
| Risk | The suite run is slow or noisy on a busy machine | Med | The runs happen one after another, with `AI_SESSION_CHILD` and `OPENCODE_DB` unset, and the counts are read from the saved files |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: documents and one comment, with no runtime path change.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: N/A: no executable text changes.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: Every new sentence names a source line, a test or a saved run that a reader can open.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a catalog section with nothing new to say is left as it is.
- Maximum input: the catalog gains one sentence per section, and the playbook gains one scenario.
- Failure path: a validator that fails on a pre-existing problem is reported with its output and compared with the same command at the start commit. Only a new failure blocks the phase.
- A row whose saved run cannot prove it: the note says so, and the row stays `Met` only when a test on the final tree proves it. 002 AC-003 cannot be proved because phase 021 reverses it, so it is superseded.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Three skill and command documents, one comment and nine packet documents |
| Risk | 4/25 | CI validates the playbook and the catalog |
| Research | 4/20 | Four findings from one review, each checked against the code |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the operator-run scenario have a harness to reuse? It can start a wrapper by hand in a throwaway checkout, and no harness is committed here. The scenario names the commands and the evidence to keep.
- Does the app title follow `--name` for a generated title? Unconfirmed in the packet's research. The scenario checks the receiver's command line and the app title, and records both.
<!-- /ANCHOR:questions -->

---
