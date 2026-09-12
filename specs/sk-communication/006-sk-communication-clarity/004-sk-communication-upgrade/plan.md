---
title: "Implementation Plan: Phase 4: sk-communication-upgrade"
description: "Land eight engine items and their document companions in the sk-communication skill, so the provider instruction resolves to the wording standard's reply base and the fidelity record stops certifying comparisons it never ran."
trigger_phrases:
  - "skill upgrade plan"
  - "one home for the standard"
  - "rewrite pass declaration"
  - "provider instruction reply base"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: sk-communication-upgrade

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill and command documents over the TypeScript projection package, whose source carries eight of this phase's items |
| **Framework** | The skill routes by subsystem. The package is consumed through its subpath exports and its own test runner |
| **Storage** | Version-controlled skill documents and package source. No runtime state changes here |
| **Testing** | The package gate, a duplication search for the instruction literal and the fidelity exercises the new record and omission comparisons need |

### Overview

This phase changes the engine, not only the documents. Four adopted rows from phase 002's decision record land in the projection package's source and four decision-free edits from this phase's own research land beside them, so the phase carries eight engine items plus two rewrite-command declarations. The package source is edited as a matter of course rather than only when a row forces it.

The frozen invariants are read from the code rather than assumed. The canonical original stays preserved, privacy still runs before ranking, every failed path still returns exact-original bytes and the wording standard keeps one home. Phase 007 is a hard prerequisite because the last and largest item resolves the provider instruction to the standard's reply base. That base is phase 007's output.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Phase 007's reply base exists and the engine can name it

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The package gate passes from the final state, with its output and exit status both read
- [ ] Both rewrite commands and their mirrors declare the pass they perform
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One standard, one home, many consumers. The skill holds no rubric and points at the standard, so a change to the standard reaches the skill with no edit to a command. This phase preserves that shape and extends it, because the engine becomes a runtime consumer of the standard instead of a holder of a private sentence about it. The engine lives at `.opencode/skills/sk-communication/cli-communication-projection/`. The module paths below are relative to that directory.

### Key Components

- **The skill document**: routes by subsystem, states the wording standard by reference and maintains the standard's exclusion list by hand
- **`/rewrite:response`**: an in-context re-render of the active reply, display-only
- **`/rewrite:response-by-external-agent`**: a one-shot projection through a chosen engine
- **The wording standard**: one document under `sk-doc`, restructured by phase 007 as a base plus a supplement. The base is what a reply loads and what the provider instruction resolves to
- **The two provider profiles**: `src/config/local-provider.ts` and `src/runtime/external-cli-projection.ts`, each declaring the instruction, its temperature and its thinking mode, with a third copy in `test/providers/helpers.ts`
- **The fidelity subsystem**: `src/fidelity/validator.ts` holds the guard, its five pass markers and the claim comparisons. `src/fidelity/semantics.ts` owns the set the omission comparison joins
- **`src/contracts/projection.ts`**: the accepted projection record that gains the change kind

### Data Flow

A target reply enters the rewrite path. Spans are protected, a candidate is produced and the candidate is compared against its source inside one guard that covers the structure signature and the claim comparisons. Acceptance records the kind of change the candidate made. A candidate that changed nothing records the no-op value instead. A render decision then replaces, appends, uses a sidecar or shows the original only. This phase changes what the candidate is asked to be, what the record says about it and which comparisons it must survive. Nothing else in that chain moves.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes a shared policy pointer and the engine behind it, so the table applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Local provider profile | Declares the instruction and its temperature for the HTTP path | Read one shared declaration for the pair and resolve the instruction to the reply base | Both profiles resolve to a byte-identical instruction and one temperature |
| External CLI profile | Declares the same pair plus its thinking mode | Read the shared declaration and set thinking mode to provider-default | Diff the profile against the local one |
| Provider fixture | Carries the third copy of the instruction literal | Read the shared declaration | Change the declaration and confirm the suite follows without a fixture edit |
| Fidelity validator | Stamps five pass markers after the guard closes and runs the claim comparisons inside it | Move the markers inside the guard and add the omission comparison beside its siblings | An unchanged candidate records no pass it did not earn while a dropped caveat is rejected |
| Claim comparison set | Compares facts, polarity, requirement strength and priority | Extend the set with the omission comparison | The new reason code appears in a rejection's checks |
| Accepted projection record | Says a candidate passed and nothing about what it did | Carry the kind of change and a no-op value | Read the record for a rewrite and for an unchanged candidate |
| Skill wording-standard section | Names the standard the rewrites are held to and maintains its exclusions by hand | Restate the exclusions as one row shorter once phase 007 lands | Follow the pointer and confirm the base covers a reply |
| Both rewrite command documents | The in-context and external projection contracts | Declare the pass performed, as rewording without reordering | Read both command documents |
| Claude-runtime command mirrors | The same two commands for the other runtime | Update in step | Diff each mirror against its source |
| Feature catalog and changelog | Record capabilities and versions | Record the changed capability and a version entry | Read both entries |
| Wording standard under `sk-doc` | The single home of the rubric | Read only, phase 007 owns its restructure | The pointer resolves and the reply base exists |

Required inventories:
- Same-class producers: every place the instruction literal or a voice rubric could have been copied. `rg -n 'Rewrite only the user message|plain English|hard blocker' .opencode/skills/sk-communication .opencode/commands/rewrite .claude/commands/rewrite`
- Consumers of changed symbols: every reader of the instruction declaration, the change kind and the pass markers, plus every document pointing at the wording standard. `rg -n 'COPY_EDITING_INSTRUCTION|changeKind|hvr-rules|sk-create-with-human-voice' . --glob '*.ts' --glob '*.md'`
- Matrix axes: provider profile by runtime mirror. Both profiles times both command runtimes is the required row set.
- Algorithm invariant: a rewrite never changes what the original claimed. The adversarial cases are a dropped caveat, a compressed pair of claims and a reorder that inverts a cause.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and the task state. The eight engine items land in this order, with risk rising:

1. Collapse the duplicated instruction and its temperature into one declaration, so the pair stops being declared twice with a third literal in the test fixture.
2. Correct the instruction's target noun, which names a role the profiles do not declare. This phase's research settled it as a labelling defect rather than a mis-target risk.
3. Move the five pass markers inside the guard whose comparisons they describe, because an unchanged candidate skips every structure and semantic comparison and still records all five as passed.
4. Record the kind of change a candidate made on the accepted projection record, from values the comparisons already compute.
5. Give that field a no-op value, so an unchanged candidate becomes visible instead of hiding inside a pass.
6. Add the claim-based omission comparison inside the existing guard, rejecting a candidate when a claim, a caveat or a requirement present in the source is absent from it.
7. Set both provider profiles to provider-default thinking mode, the operator's choice of compatibility over failing closed. Two providers can then default differently, so phase 005 records which provider produced each result.
8. Resolve the provider instruction to the wording standard's reply base instead of the thirteen-word literal, which is the item that closes the program's largest single finding.

Beside the engine items, both rewrite commands declare the pass they perform and declare it as rewording without reordering, per the lane decision. The skill's exclusion list, its feature catalog and its changelog follow those declarations.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The eight engine items, including a candidate identical to its source and a candidate that drops a caveat | `npm run test` in the package directory |
| Integration | The package gate from the final state, output and exit status both read | `npm run check` in the package directory |
| Manual | A rewrite of a reply that carries a caveat, checking the caveat survives, plus an unchanged candidate checked for the no-op value | Invoke the in-context command and read the record |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 decision record | Internal | Green, its five engine decisions are Accepted | The four engine rows would lose their authority |
| Phase 002 allocation table | Internal | Red until phase 002 closes | An item without an adopted row cannot ship and REQ-002 fails |
| Phase 007 wording-standard restructure | Internal | Red until phase 007 closes | The instruction cannot resolve to a reply base that does not exist, so the largest item and the phase handoff stay blocked |
| Phase 003 | Internal | Red until phase 003 closes | The skill would point at rule text still being edited |
| A working package build | Internal | Green | The gate cannot certify the final state |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A rewrite is observed changing what the original claimed, the package gate fails from the final state or a provider that completed a rewrite before now fails to compile.
- **Procedure**: Revert the instruction declaration before the profile alignment, because the alignment reads it. Then revert the fidelity items and the skill document with both command documents and their mirrors together, because a half-reverted pair leaves two runtimes describing different behavior. The enablement flag is off by default, so a reverted state rewrites nothing.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Re-read invariants ──► Shared declaration and target noun ──► Fidelity record items ──► Omission comparison ──► Profile alignment ──► Command declarations and mirrors ──► Catalog and changelog ──► Package gate ──► Handoff to 005
```

| Step | Depends On | Blocks |
|------|------------|--------|
| Re-read invariants | Phase 003 closed | Every later step |
| Shared declaration and target noun | Re-read invariants | Instruction resolution, profile alignment and the fixture |
| Fidelity record items | Shared declaration, because one file holds the guard and the record path | Omission comparison |
| Omission comparison | Fidelity record items | Package gate |
| Profile alignment | Phase 007's reply base, because the alignment is asserted against the resolved instruction | Package gate |
| Command declarations and mirrors | Phase 003 closed, because the skill points at rule text phase 003 edits | Catalog and changelog |
| Catalog and changelog | Every code and document change landed | Package gate |
| Package gate | Every item landed | Handoff to 005 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 45 to 60 minutes re-reading the package's public surfaces and confirming the reply base exists |
| Core Implementation | High | 6 to 9 hours across the eight engine items, the skill, the two commands and their mirrors |
| Verification | Medium | 2 hours for the gate, the duplication search and the two fidelity exercises |
| **Total** |  | **About 9 to 12 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline package gate result captured before the first edit
- [ ] Phase 007's reply base confirmed to exist before the instruction resolves to it
- [ ] The enablement flag read and confirmed off by default

### Rollback Procedure
1. Confirm the enablement flag is off, so no live path is rewriting while the revert runs
2. Revert the instruction declaration, then the profile alignment that reads it
3. Revert the fidelity items, which are independent of the document changes
4. Revert the skill document and both command documents together with their runtime mirrors
5. Re-run the package gate and read its output and exit status
6. Re-run the duplication search, so a reverted state leaves no orphaned instruction copy

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable, this phase writes package source and documents while no persisted run state changes
<!-- /ANCHOR:enhanced-rollback -->

---
