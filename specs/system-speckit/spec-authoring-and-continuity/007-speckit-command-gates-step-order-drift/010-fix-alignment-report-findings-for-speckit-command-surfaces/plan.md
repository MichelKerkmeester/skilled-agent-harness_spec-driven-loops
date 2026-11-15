---
title: "Implementation Plan: Phase 10: fix-alignment-report-findings-for-speckit-command-surfaces"
description: "Close the alignment findings at their sources: text and metadata by direct edit, generated copies by their generators, and routing by new entries in the owned-signal lists. Two existing test files gain the assertions the findings show are missing. The proof is a recheck of the alignment run plus five named commands."
trigger_phrases:
  - "fix alignment report findings for speckit command surfaces plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: fix-alignment-report-findings-for-speckit-command-surfaces

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML and JSON, with one CommonJS test file and one TypeScript test file |
| **Framework** | None. Two generators own the copies: `derive-command-bridges.cjs` and `compile-command-contracts.cjs` |
| **Storage** | None |
| **Testing** | `node` for `test-phase-command-workflows.js`, vitest for the autopilot contract test and the advisor parity suites |

### Overview
Close the alignment findings at their sources: text and metadata by direct edit, generated copies by their generators, and routing by new entries in the owned-signal lists. Two existing test files gain the assertions the findings show are missing. The proof is a recheck of the alignment run plus five named commands.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `node .skilled/commands/assets/local-skilled-alignment/recheck.cjs` on run `20261114T170200Z` reports no literal finding of this phase still open and no new failing battery row
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Source then generator. A fact is edited where it is owned, and every copy is produced by the script that owns the copy.

### Key Components
- **`command-metadata.json` and `scoring-compatibility.json`**: the two hand-written sources of the advisor command bridges. Argument hints and the Python bridge descriptions are edited here.
- **`system-spec-kit/graph-metadata.json`**: holds the skill's `intent_signals`, where the four routing phrases are added. `skill_graph_compiler.py --export-json` copies the list into `skill-graph.json`.
- **`derive-command-bridges.cjs`**: writes `command-bridges.generated.json`, the generated block of `projection.ts` and the generated block of `skill_advisor.py` from those sources.
- **`compile-command-contracts.cjs`**: writes the three compiled deep-loop contracts and their source digests.
- **The speckit workflow, presentation, catalog and playbook files**: edited directly. No new file is added.

### Data Flow
A router frontmatter line is copied by hand into `command-metadata.json`, and the deriver copies that into the three generated advisor files. The mirror check compares the first copy, and `derive-command-bridges.cjs --check` compares the second.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `command-metadata.json` | Source of each command's description and argument hint | update | Mirror check prints no `/speckit:` line |
| `system-spec-kit/graph-metadata.json` and the generated `skill-graph.json` | Source and compiled copy of the skill's intent signals | update, then regenerate | `skill-graph-freshness.cjs --strict` exits 0 |
| `scoring-compatibility.json` | Source of the Python bridge rows | update | `rg -n '14\+ step\|8-step'` prints nothing |
| `command-bridges.generated.json`, `projection.ts`, `skill_advisor.py` | Generated consumers of both sources | regenerate | `derive-command-bridges.cjs --check` exits 0 |
| Advisor parity suites and the divergence ratchet | Pin routing for golden prompts | unchanged | Both vitest runs pass after the signals are added, as they did before |
| `speckit-resume.yaml` | Owner of the detection order the catalog, playbook and presentation describe | unchanged | The three documents quote its `priority_order` values |
| `.skilled/agents/{ai-council,deep-review,deep-research}.md` | Sources whose digests the compiled contracts record | unchanged | `check-contract-drift.cjs` exits 0 |
| Runtime mirrors of the speckit commands | Copies of the router and asset files under each runtime folder | regenerate if the mirror check asks | `sync-runtime-mirrors.cjs --check` exits 0 |

Same-class producers of a stale count: `rg -n '14\+? ?-?step|sequential_14|8-step|\| 14 \||\| 4 \|' .skilled/commands/speckit .skilled/skills/system-spec-kit/README.md .skilled/skills/system-skill-advisor/runtime/scripts`. Matrix axes for the routing fix: six prompts (probes P03, P08, P11, P12, P14 and the D-10 prompt) by one expected skill each, plus the eleven probes that already pass.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup records the baselines: the mirror check, the contract drift check, the two parity suites and the seventeen probes. Implementation edits the sources named in `spec.md` and runs `derive-command-bridges.cjs` and `compile-command-contracts.cjs --write`. Verification reruns each baseline command, the alignment recheck and `validate.sh --strict`.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The shared-include pointers and the autopilot lifecycle sequence. Each new assertion is watched failing on a scratch copy with the defect put back | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js`, vitest `speckit-autopilot-contract.vitest.ts` |
| Integration | Routing of the seventeen probe prompts, and the advisor parity suites | `run-probes.cjs`, vitest `local-native-divergence-ratchet` and `routing-registry-drift-guard` |
| Gate | The whole alignment battery from the final state | `recheck.cjs` and `run-battery.cjs` on the run folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `node`, `python3`, `rg` and the installed vitest of the advisor runtime | Internal | Green | Without vitest the ratchet cannot run and REQ-007 stays unproven |
| No new package | Internal | Green | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A parity suite or the divergence ratchet fails because of a new owned signal and rewording does not clear it, or a generated file differs from its source after the deriver ran.
- **Procedure**: Nothing is committed until the gates pass, so `git -c core.fsmonitor=false checkout -- <file>` restores one file and the phase folder is deleted to drop the packet docs. After a commit, revert that one commit.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 1 to 9 Complete, the alignment run folder present | Implementation |
| Implementation | The baselines Setup records | Verification |
| Verification | Every source edit and both generators run | Close of the phase and the parent |
<!-- /ANCHOR:phase-deps -->

---

