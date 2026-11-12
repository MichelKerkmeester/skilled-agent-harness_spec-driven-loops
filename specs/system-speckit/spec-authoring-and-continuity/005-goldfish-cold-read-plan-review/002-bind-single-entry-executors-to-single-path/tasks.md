---
title: "Tasks: Phase 2: bind-single-entry-executors-to-single-path"
description: "Ordered source edits and generated-contract updates, each with a focused command that checks its result."
trigger_phrases:
  - "bind single entry executors to single path tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: bind-single-entry-executors-to-single-path

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |

**Task Format**: Each task has one action, names the file it changes, and ends with a Verify clause containing the proof command and expected result.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the pre-edit policy baseline and change nothing (`.skilled/commands/deep/research.md`). Verify: `for f in .skilled/commands/deep/assets/deep-research-presentation.txt .skilled/commands/deep/assets/deep-review-presentation.txt .skilled/commands/deep/research.md .skilled/commands/deep/review.md; do printf '%s: ' "$f"; git show "HEAD:$f" | rg -c -e 'an .--executors. value' -e '0 or 1 --executor' -e '2[+] --executor flags' -e '0–1 .--executor. flags'; done` prints 3, 3, 1 and 1 in source order. Evidence: output was `.skilled/commands/deep/assets/deep-research-presentation.txt: 3`, `.skilled/commands/deep/assets/deep-review-presentation.txt: 3`, `.skilled/commands/deep/research.md: 1`, `.skilled/commands/deep/review.md: 1` (exit 0). HEAD provides the pre-edit baseline because the working files now contain the built edits.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Each edit task names one edit file. The edit file holds the exact OLD text and the exact NEW text. Replace OLD with NEW and change nothing else. When OLD is not found exactly once, stop, mark the task `[B]` and write `Open question:` with the task id in `goal.md`.

- [x] T002 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path/scratch/edit-T002.txt`: replace its OLD block with its NEW block in the research command policy paragraph (`.skilled/commands/deep/research.md`). Verify: `f=.skilled/commands/deep/research.md; test "$(rg -c -F 'expands to exactly one lineage' "$f")" = 1 && test "$(rg -c -F 'expands to two or more lineages' "$f")" = 1 && ! rg -q 'an .--executors. value' "$f" && echo OK` prints OK. Evidence: command printed OK (exit 0).
- [x] T003 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path/scratch/edit-T003.txt`: replace its OLD block with its NEW block in the review command policy paragraph (`.skilled/commands/deep/review.md`). Verify: `f=.skilled/commands/deep/review.md; test "$(rg -c -F 'expands to exactly one lineage' "$f")" = 1 && test "$(rg -c -F 'expands to two or more lineages' "$f")" = 1 && ! rg -q 'an .--executors. value' "$f" && echo OK` prints OK. Evidence: command printed OK (exit 0).
- [x] T004 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path/scratch/edit-T004.txt`: replace its OLD block with its NEW block in the research flag-parsing policy bullets (`.skilled/commands/deep/assets/deep-research-presentation.txt`). Verify: `f=.skilled/commands/deep/assets/deep-research-presentation.txt; test "$(rg -c -F 'write config.executor from that entry' "$f")" = 1 && test "$(rg -c -F 'two or more lineages, or any count>1: write config.fanout' "$f")" = 1 && ! rg -q -F -e '--executors, or any count>1' "$f" && echo OK` prints OK. Evidence: command printed OK (exit 0).
- [x] T005 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path/scratch/edit-T005.txt`: replace its OLD text with its NEW text in the research `Fan-out default policy` sentence (`.skilled/commands/deep/assets/deep-research-presentation.txt`). Verify: `f=.skilled/commands/deep/assets/deep-research-presentation.txt; test "$(rg -c 'two or more lineages, or any .--count > 1.' "$f")" = 1 && ! rg -q '.--executors., or any .--count > 1.' "$f" && echo OK` prints OK. Evidence: command printed OK (exit 0).
- [x] T006 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path/scratch/edit-T006.txt`: replace its OLD block with its NEW block in the review flag-parsing policy bullets (`.skilled/commands/deep/assets/deep-review-presentation.txt`). Verify: `f=.skilled/commands/deep/assets/deep-review-presentation.txt; test "$(rg -c -F 'write config.executor from that entry' "$f")" = 1 && test "$(rg -c -F 'two or more lineages, or any count>1: write config.fanout' "$f")" = 1 && ! rg -q -F -e '--executors, or any count>1' "$f" && echo OK` prints OK. Evidence: command printed OK (exit 0).
- [x] T007 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path/scratch/edit-T007.txt`: replace its OLD text with its NEW text in the review `Fan-out default policy` sentence (`.skilled/commands/deep/assets/deep-review-presentation.txt`). Verify: `f=.skilled/commands/deep/assets/deep-review-presentation.txt; test "$(rg -c 'two or more lineages, or any .--count > 1.' "$f")" = 1 && ! rg -q '.--executors., or any .--count > 1.' "$f" && echo OK` prints OK and `rg -c -F 'Native and CLI fan-out lineages run under' .skilled/commands/deep/assets/deep-review-presentation.txt` prints 1. Evidence: command printed OK then 1 for the preserved review lineage check (exit 0).
- [x] T008 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path/scratch/edit-T008.txt`: replace its OLD block with its NEW block in the feature catalog entry (`.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md`). Verify: `f=.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md; test "$(rg -c -F 'expands to exactly one lineage' "$f")" = 1 && ! rg -q '2\+ / .--executors. /' "$f" && echo OK` prints OK. Evidence: command printed OK (exit 0).
- [x] T009 Regenerate the research contract by running `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/research --write`. Do not edit the contract by hand (`.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`). Verify: `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/research | diff -q - .skilled/commands/deep/assets/compiled/deep-research.contract.markdown && rg -c -F 'expands to exactly one lineage' .skilled/commands/deep/assets/compiled/deep-research.contract.markdown` prints 2 and no `differ` line. Evidence: `../scratch/build-evidence.md:50` records the `--write` command exiting 0. This closeout ran the non-writing fresh compile; `diff -q` emitted no difference and `rg -c` printed 2 (exit 0).
- [x] T010 Regenerate the review contract by running `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/review --write`. Do not edit the contract by hand (`.skilled/commands/deep/assets/compiled/deep-review.contract.markdown`). Verify: `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/review | diff -q - .skilled/commands/deep/assets/compiled/deep-review.contract.markdown && rg -c -F 'expands to exactly one lineage' .skilled/commands/deep/assets/compiled/deep-review.contract.markdown` prints 2 and no `differ` line. Evidence: `../scratch/build-evidence.md:50` records the `--write` command exiting 0. This closeout ran the non-writing fresh compile; `diff -q` emitted no difference and `rg -c` printed 2 (exit 0).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Audit the seven policy-bearing files for the new wording and for leftovers of the old wording and change nothing (`.skilled/commands/deep/research.md`). Verify: `rg -c -F 'expands to exactly one lineage' .skilled/commands/deep/research.md .skilled/commands/deep/review.md .skilled/commands/deep/assets/deep-research-presentation.txt .skilled/commands/deep/assets/deep-review-presentation.txt .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md .skilled/commands/deep/assets/compiled/deep-research.contract.markdown .skilled/commands/deep/assets/compiled/deep-review.contract.markdown | awk -F: '{s+=$2} END {print s}'` prints 11, and `rg -n -e 'an .--executors. value' -e '--executors, or any count>1' -e '.--executors., or any .--count > 1.' -e '2\+ / .--executors. /' .skilled/commands/deep/research.md .skilled/commands/deep/review.md .skilled/commands/deep/assets/deep-research-presentation.txt .skilled/commands/deep/assets/deep-review-presentation.txt .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md .skilled/commands/deep/assets/compiled/deep-research.contract.markdown .skilled/commands/deep/assets/compiled/deep-review.contract.markdown; test $? -eq 1 && echo 'no old policy wording'` prints `no old policy wording`. Evidence: this closeout printed `11`, then `no old policy wording` (exit 0).
- [x] T012 Validate this packet's documents and change nothing (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path --strict --quiet` prints `RESULT: PASSED`. Evidence: final strict validation printed `RESULT: PASSED (errors=0 warnings=0)` (exit 0).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks with passing Verify commands are marked [x]. Evidence: T001 confirmed the pre-edit baseline from HEAD with counts 3, 3, 1 and 1; T002-T011 passed their focused checks; T012 passed strict validation. No task remains open or blocked.
- [x] No [B] blocked tasks remaining. Evidence: search printed No blocked task lines. (exit 0).
- [x] Focused checks show both policy branches in the four maintained sources, the feature catalog entry and both generated contracts; the strict child validator prints RESULT: PASSED. Evidence: T011 printed 11 and no old policy wording. Strict validation printed RESULT: PASSED (errors=0 warnings=0) (exit 0).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
<!-- /ANCHOR:cross-refs -->

---


## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked P0 keeps the packet open. A P1 deferral needs user approval and a recorded reason. A P2 deferral needs a recorded reason. No deferral replaces strict validation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] REQ-001 and REQ-002 each have one acceptance row. Verify: `rg -n 'REQ-001|REQ-002' spec.md acceptance-criteria.md` prints both requirements and both criterion rows. Evidence: rg output showed REQ-001 and REQ-002 in spec.md and their AC rows in acceptance-criteria.md (exit 0).
- [x] CHK-002 [P0] Compiler source mapping includes each command and presentation source. Verify: `rg -n 'commandPath:|presentationPath:|sourcePaths:' .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` prints the research and review definitions. Evidence: rg output showed review definitions at lines 176-183 and research definitions at lines 278-285 (exit 0).
- [x] CHK-003 [P1] Dependencies are identified and no new package is required. Verify: `rg -n 'Node.js|No new package' plan.md` prints the dependency statements. Evidence: rg output showed Node.js at plan.md:23 and no new package at plan.md:103 (exit 0).
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P2] No source-code lint or format change applies because this packet updates documentation and generated Markdown only. Verify: `rg -ni 'Command parsing|workflow YAML|test, hook' spec.md` prints the out-of-scope boundaries. Evidence: rg output showed the exclusions at spec.md:40 and 100-101 (exit 0).
- [x] CHK-011 [P2] No Vitest suite is in scope for this documentation change. Verify: `rg -n 'No Vitest suite' plan.md` prints the test boundary. Evidence: rg output showed the no-suite boundary at plan.md:93 (exit 0).
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 passes when T011 counts the one-lineage branch in every policy-bearing file and confirms the blanket matrix rule is absent. Verify: T011's two commands print 11 and `no old policy wording`. Evidence: T011 printed 11 and no old policy wording (exit 0).
- [x] CHK-021 [P0] AC-002 passes when T009 and T010 regenerate their contracts and both branches appear in both outputs. Verify: `rg -n -F -e 'expands to exactly one lineage' -e 'expands to two or more lineages' .skilled/commands/deep/assets/compiled/deep-research.contract.markdown .skilled/commands/deep/assets/compiled/deep-review.contract.markdown` prints both branches for both contracts. Evidence: this closeout's read-only fresh compiles matched both contracts, each one-lineage count printed 2, and the search showed both branches in both outputs (exit 0); the build record confirms the earlier `--write` runs.
- [x] CHK-022 [P1] Strict packet validation passes. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path --strict --quiet` prints `RESULT: PASSED`. Evidence: command printed RESULT: PASSED (errors=0 warnings=0) (exit 0).
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class is cross-consumer because four maintained policy sources feed two generated contracts. Verify: `rg -n 'four maintained|two generated|cross-consumer' plan.md` prints the finding class and affected surfaces. Evidence: rg output showed the cross-consumer finding, four maintained files and two generated outputs in plan.md (exit 0).
- [x] CHK-FIX-002 [P0] Same-class producer inventory covers the four policy sources. Verify: `rg -n 'Fan-out policy|Fan-out default policy|--executors' .skilled/commands/deep/research.md .skilled/commands/deep/review.md .skilled/commands/deep/assets/deep-research-presentation.txt .skilled/commands/deep/assets/deep-review-presentation.txt` prints the clauses. Evidence: rg output matched policy clauses in both command files and both presentation assets (exit 0).
- [x] CHK-FIX-003 [P1] Generated-contract consumers are mapped through the compiler and renderer. Verify: `rg -n 'sourcePaths:' .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` and `rg -n 'compiledContractPath' .skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs` print the mappings. Evidence: rg output showed the compiler sourcePaths and renderer compiledContractPath mappings (exit 0).
- [x] CHK-FIX-004 [P2] Security, path, parser and persistence adversarial cases are not applicable because no runtime code changes. Verify: `rg -ni 'Command parsing|workflow YAML|test, hook' spec.md` prints the exclusions. Evidence: rg output showed the exclusions at spec.md:40 and 100-101 (exit 0).
- [x] CHK-FIX-005 [P1] The matrix, repeated-flag and count axes include their required policy rows. Verify: `rg -n 'Matrix axes|matrix cardinality|repeated --executor|--count' plan.md` prints the inventory. Evidence: rg output showed matrix cardinality, repeated-flag and count axes at plan.md:132 (exit 0).
- [x] CHK-FIX-006 [P2] No hostile environment variant applies because this phase reads no runtime environment state. Verify: `rg -n 'no parser or runner algorithm changes' plan.md` prints the boundary. Evidence: rg output showed the no-parser-or-runner invariant at plan.md:133 (exit 0).
- [x] CHK-FIX-007 [P1] Every task pins its evidence to a file or command path. Verify: `rg -c '^- \[[ x]\] T0(0[1-9]|1[0-2]).*Verify:' tasks.md` prints 12. Evidence: command printed 12 task lines with Verify clauses (exit 0).
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P2] No hardcoded secret check is not applicable because no code or secret-bearing file changes. Verify: `rg -ni 'Command parsing|workflow YAML|test, hook' spec.md` prints the scope boundary. Evidence: rg output showed the exclusions at spec.md:40 and 100-101 (exit 0).
- [x] CHK-031 [P2] Input validation is unchanged because command parsing is out of scope. Verify: `rg -n 'Command parsing' spec.md` prints the exclusion. Evidence: rg output showed the command-parsing exclusion at spec.md:100 (exit 0).
- [x] CHK-032 [P2] Authentication and authorization are unchanged. Verify: `rg -n 'authentication, authorization' spec.md` prints the security N/A statement. Evidence: rg output showed the authentication and authorization boundary at spec.md:164 (exit 0).
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Spec, plan, tasks and acceptance criteria state the same routing rule. Verify: `rg -n 'config.executor|config.fanout|two or more lineages|count above 1' spec.md plan.md tasks.md acceptance-criteria.md` prints both branches and retained triggers. Evidence: rg output matched policy branches and preserved count-above-one triggers in spec.md, plan.md, tasks.md and acceptance-criteria.md (exit 0).
- [x] CHK-041 [P1] No authoring placeholders remain in the packet. Verify: `python3 -c 'from pathlib import Path; import re; d=Path("specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path"); pattern=re.compile(r"\[YOUR[_]VALUE_HERE:|<!--\s*FILL:"); files=[f for f in d.rglob("*") if f.is_file() and f.suffix in {".md",".json",".txt"}]; matches=[str(f) for f in files if pattern.search(f.read_text())]; assert not matches, matches; print("No authoring placeholders remain in packet files.")'` prints the marker. Evidence: the final packet-wide scan printed `No authoring placeholders remain in packet files.` (exit 0).
- [x] CHK-042 [P2] No README update is required for this command-policy and generated-contract correction. Verify: `rg -n 'Files to Change|Out of Scope' spec.md` prints the bounded documentation scope. Evidence: rg output showed Out of Scope and Files to Change at spec.md:99 and 103 (exit 0).
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No .backup-* directory remains in the packet. Verify: `test -z "$(find specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path -maxdepth 1 -type d -name '.backup-*' -print -quit)" && printf 'No backup directories remain.\n'` prints the marker. Evidence: command printed No backup directories remain. (exit 0).
- [x] CHK-051 [P1] scratch/ contains only .gitkeep and the `edit-T*.txt` edit files. Verify: `test -z "$(find specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path/scratch -mindepth 1 -maxdepth 1 ! -name .gitkeep ! -name 'edit-T*.txt' -print -quit)" && printf 'scratch is clean.\n'` prints the marker. Evidence: command printed scratch is clean. (exit 0).
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 8 | 8/8 |
| P2 Items | 8 | 8/8 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---
