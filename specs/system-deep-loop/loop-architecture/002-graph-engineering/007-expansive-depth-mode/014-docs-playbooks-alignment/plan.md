---
title: "Implementation Plan: Playbook coverage, feature catalogs and alignment for the expansive-depth program"
description: "Verify that phases 001-013 each wrote their playbook scenarios, update the feature catalogs through the sk-doc create command, then run the doc and skilled alignment checks and fix findings until both report clean."
trigger_phrases:
  - "docs playbooks alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Playbook coverage, feature catalogs and alignment for the expansive-depth program

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown feature catalog entries and live docs; playbook scenarios are read, not written |
| **Framework** | sk-doc create commands, operator-local alignment commands |
| **Storage** | None |
| **Testing** | `rg` presence checks, the coverage table, `check-contract-drift` and the two alignment reports |

### Overview
Each of phases 001-013 has already written its playbook scenarios through `/create:manual-testing-playbook` (operator decision 2026-11-17). This phase checks that every row of the Feature to Playbook Map has one, and routes a gap to its owning phase. The four feature catalogs gain entries through `/create:feature-catalog`. `/local-doc-alignment` then reads every live doc on the topic against the code, and `/local-skilled-alignment` checks the 001-013 change against every connected surface. Doc findings are fixed here, code findings go to their owning phase, and both checks rerun until each reports no open finding.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Every 001-013 child goal has all completion criteria checked, including its playbook task
- [ ] The two Measured Behavior commands in `spec.md` rerun and their output is recorded in `goal.md` §4
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Both alignment reports show zero open findings
- [ ] `check-contract-drift.vitest.ts` passes after the last doc fix
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: coverage check, command-driven catalog update, then a check-and-fix loop.

### Key Components
- **Coverage check**: one `rg` per Feature to Playbook Map row over the category the owning phase wrote into; without it a phase that skipped its scenario goes unnoticed until an operator looks for it.
- **`/create:feature-catalog`**: writes catalog entries and the catalog index the same way.
- **`/local-doc-alignment` and `/local-skilled-alignment`**: each writes `findings.json`, `fix-plan.md` and `report.md` under its `--out` folder; without them nothing proves the new docs match the code.

### Data Flow
The playbook packages the phases wrote feed the coverage check. Each phase's spec and shipped code feed `/create:feature-catalog`. The alignment commands read every live doc against the code and write a report into `scratch/`. Doc findings feed the fix step here; code findings go to the owning phase. A doc fix that changes a digested document triggers a contract regeneration. The loop repeats until both reports are clean.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup confirms 001-013 are done and records the Measured Behavior output. Implementation checks playbook coverage per map row and runs the catalog command per catalog. Verification runs both alignment checks, fixes doc findings, routes code findings and reruns until clean. Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

From the repository root, rerun the two Measured Behavior commands from `spec.md`; each must print at least one file in every named directory. Fill the coverage table in `goal.md` §4 with one scenario file per map row. Then read the `report.md` of the final `/local-doc-alignment` and `/local-skilled-alignment` runs under `scratch/`; each must report zero open findings. Finally run `npm test -- tests/unit/check-contract-drift.vitest.ts` from `.skilled/skills/system-deep-loop/runtime`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

Phases 001-013 complete, each with its own playbook scenarios. The three commands `/create:feature-catalog`, `/local-doc-alignment` and `/local-skilled-alignment`, plus `compile-command-contracts.cjs` when a doc fix changes a digested document. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a catalog entry or doc fix describes behavior the code does not have. Revert the docs commit for this phase and regenerate any compiled contract it touched; no runtime file changes, so nothing else moves.
<!-- /ANCHOR:rollback -->

---
