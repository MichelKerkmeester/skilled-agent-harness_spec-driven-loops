---
title: "Feature Specification: Playbook coverage, feature catalogs and alignment for the expansive-depth program"
description: "Phases 001-013 add --extend=N, --depth-mode=expansive for research and review, custom review dimensions and several defect fixes with user-visible behavior. Each phase writes its own manual testing playbook scenarios. This phase verifies that coverage, updates the feature catalogs, runs both alignment checks, fixes their findings and reruns until both report clean."
trigger_phrases:
  - "docs playbooks alignment"
  - "expansive depth playbooks and catalogs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Playbook coverage, feature catalogs and alignment for the expansive-depth program

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 14 of 14 |
| **Predecessor** | 013-no-redispatch-landed-iteration (depends on all of 001-013) |
| **Successor** | None |
| **Handoff Criteria** | Every phase 001-013 is complete before this phase starts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the expansive-depth program, and it runs last.

**Scope Boundary**: Documentation only. Operator decision 2026-11-17: each implementation phase writes its own manual testing playbook scenarios through `/create:manual-testing-playbook`. This phase verifies that coverage, updates the feature catalogs, runs the two alignment checks, fixes the doc findings and reruns. It changes no runtime script, command workflow or agent behavior.

**Dependencies**:
- All of `../001-completed-run-extension/` through `../013-no-redispatch-landed-iteration/` complete, so every documented behavior exists in code and every phase has written its scenarios.

**Deliverables**:
- A coverage check showing every row of the Feature to Playbook Map has a scenario its phase wrote.
- Updated feature catalog entries.
- A clean `/local-doc-alignment` report and a clean `/local-skilled-alignment` report.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Phases 001-013 add `--extend=N`, `--depth-mode=expansive` for deep-research and deep-review, custom review dimensions and defect fixes that change what an operator sees, but no system-deep-loop manual testing playbook or feature catalog mentions any of them. An operator cannot find a scenario that exercises the new flags, and a reviewer cannot check the catalogs against the shipped code.

### Purpose
Confirm that every user-visible feature and fix of 001-013 has the playbook scenario its phase wrote, give each a catalog entry, and close the program with both alignment checks reporting no open finding.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
Run on `main` at 2026-11-17 from the repository root (`D=.skilled/skills/system-deep-loop`), before any of 001-013 is built.
```text
$ rg -l -- "--extend=|--depth-mode|depthMode" $D/manual-testing-playbook $D/deep-research/manual-testing-playbook $D/deep-review/manual-testing-playbook $D/runtime/manual-testing-playbook $D/feature-catalog $D/deep-research/feature-catalog $D/deep-review/feature-catalog $D/runtime/feature-catalog; echo "rg exit=$?"
rg exit=1
$ rg -il "custom review dimension" $D/deep-review/manual-testing-playbook $D/deep-review/feature-catalog; echo "rg exit=$?"
rg exit=1
```
No playbook or catalog file names either flag or custom review dimensions.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Verify playbook coverage: each row of the Feature to Playbook Map below has a scenario in its category, written by its owning phase through `/create:manual-testing-playbook`. A missing scenario is a finding for the owning phase, which adds it through the same command; this phase does not write scenarios.
- Update the system-deep-loop feature catalogs through `/create:feature-catalog system-deep-loop update --path <catalog dir>`.
- Run `/local-doc-alignment` on the expansive-depth topic and `/local-skilled-alignment` on the 001-013 change.
- Fix each doc finding: a playbook gap through its owning phase, a catalog finding through `/create:feature-catalog`, and a finding in a reference doc, `README.md`, `SKILL.md` or command doc by a direct edit here. Regenerate a compiled contract when a fix changes a document it digests. Rerun both checks until neither reports an open finding.

### Out of Scope
- Writing playbook scenarios. Each implementation phase owns its own (operator decision 2026-11-17).
- Runtime, command workflow or agent behavior changes. A finding that shows a behavior bug is a code finding: it is recorded in `goal.md` §4 and handed to the owning phase, which reopens with a fix task. This phase cannot close while a code finding is open, unless the operator records a waiver for it in `goal.md` §4.
- Changelog entries and release notes. Each implementation phase owns its own; `../scratch/cross-phase-handoff.md` lists which phases add one.

### Feature to Playbook Map

Category folders are where each owning phase writes its scenarios. The create command decides the final file names; this phase checks that a file exists in each category.

| Owning phase | User-visible behavior | Playbook category |
|-------|-----------------------|-------------------|
| 001 | `--extend=N` on a completed run | `deep-research/.../entry-points-and-modes/`, `deep-review/.../entry-points-and-modes/` |
| 002 | Research on `cli-claude-code` honors the configured Claude config dir | `runtime/.../executor/` |
| 003 | A review run never stops before `minIterations` | `deep-review/.../convergence-and-recovery/` |
| 004 | Next Focus ignores answered free text, review picks an uncovered dimension | `deep-research/.../iteration-execution-and-state-discipline/`, `deep-review/.../iteration-execution-and-state-discipline/` |
| 005 | The research prompt pack allows `research/research.md` and uses `Recommended Next Focus` | `runtime/.../prompt-rendering/` |
| 006 | The `findings_not_enumerated` gate and the `focusAlignment` guard run on real leaf fields | `deep-research/.../iteration-execution-and-state-discipline/` |
| 007 | Source diversity reads derived `quality_class` values | `runtime/.../coverage-graph/` |
| 008 | Custom review dimensions are tracked and can be covered | `deep-review/.../initialization-and-state-setup/`, `deep-review/.../review-depth-v2-rollout/` |
| 009 | A merged fan-out review keeps its coverage surfaces | `deep-review/.../fanout/` |
| 010 | `--depth-mode=expansive` on deep-research | `deep-research/.../entry-points-and-modes/`, `deep-research/.../convergence-and-recovery/` |
| 011 | `--depth-mode=expansive` on deep-review | `deep-review/.../entry-points-and-modes/`, `deep-review/.../fanout/` |
| 012 | Council seat cap of 3 per attempt and one quorum retry per pivot | `runtime/.../council/` |
| 013 | A landed iteration is not dispatched a second time | `runtime/.../executor/` |

### Files to Change

All paths sit under `.skilled/skills/system-deep-loop/` unless they start with `.skilled/commands/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `deep-research/manual-testing-playbook/`, `deep-review/manual-testing-playbook/`, `runtime/manual-testing-playbook/`, `manual-testing-playbook/manual-testing-playbook.md` | Read | Coverage check only; the owning phases wrote the scenarios and the package indexes |
| `deep-research/feature-catalog/` | Modify | `loop-lifecycle/` and `convergence/` entries for the extension and the research frontier, written by `/create:feature-catalog` |
| `deep-review/feature-catalog/` | Modify | `review-dimensions/` and `loop-lifecycle/` entries for custom dimensions, the extension and the review frontier, written by `/create:feature-catalog` |
| `runtime/feature-catalog/` | Modify | `coverage-graph/`, `council/`, `executor/`, `prompt-rendering/` and `fanout/` entries for the runtime fixes, written by `/create:feature-catalog` |
| `feature-catalog/feature-catalog.md` | Modify | Hub catalog, for the `--depth-mode` flag beside the existing mode classification |
| Live docs an alignment finding names: `*/references/*.md`, `*/README.md`, `*/SKILL.md`, `.skilled/commands/deep/*.md` | Modify | Doc fixes only, each tied to a finding id |
| `.skilled/commands/deep/assets/compiled/deep-*.contract.markdown` | Regenerate | Only when a doc fix changes a digested document; through `compile-command-contracts.cjs`, never by hand |
| This phase's `scratch/` | Create | Alignment run folders (`--out`) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `--extend=N` has a playbook scenario on both loops | `rg -l -- "--extend=" $D/deep-research/manual-testing-playbook $D/deep-review/manual-testing-playbook` prints at least one file in each directory |
| REQ-002 | `--depth-mode=expansive` has a playbook scenario on both loops | `rg -l -- "--depth-mode=expansive" $D/deep-research/manual-testing-playbook $D/deep-review/manual-testing-playbook` prints at least one file in each directory |
| REQ-003 | Custom review dimensions have a playbook scenario and a catalog entry | `rg -il "custom review dimension" $D/deep-review/manual-testing-playbook $D/deep-review/feature-catalog` prints at least one file in each directory |
| REQ-004 | Each row of the Feature to Playbook Map has a scenario in its category, written by its owning phase | The coverage table in `goal.md` §4 names one scenario file per 001-013 row; a row with no file is routed to its phase and rechecked after that phase adds it |
| REQ-005 | Both alignment checks end clean | The final `/local-doc-alignment` run and the final `/local-skilled-alignment` run each report zero open findings in their `report.md`; a code finding counts as open until its owning phase lands a fix or the operator records a waiver in `goal.md` §4 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The feature catalogs describe the new flags | `rg -l -- "--extend="` and `rg -l -- "--depth-mode"`, each over `$D/deep-research/feature-catalog` and `$D/deep-review/feature-catalog`, print at least one file in each directory |
| REQ-007 | No runtime or workflow file changes in this phase | `git diff --name-only` for this phase's commits lists no file outside `specs/` ending in `.cjs`, `.ts`, `.js`, `.yaml`, `.json`, `.toml` or `.txt`; doc fixes are `.md` files and regenerated contracts are `.markdown` files |
| REQ-008 | A doc fix never leaves a compiled contract stale | After the last doc fix, `npm test -- tests/unit/check-contract-drift.vitest.ts` run from `$D/runtime` exits 0 |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The two Measured Behavior commands each print at least one file, where today they print none, without this phase writing a scenario.
- **SC-002**: The final runs of `/local-doc-alignment` and `/local-skilled-alignment` each report zero open findings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001-013 complete, each with its own playbook scenarios | The coverage check would fail on work not yet done | Start only when every 001-013 goal has all criteria checked |
| Risk | A phase closed without its playbook scenario | Medium | The coverage check names the gap and the owning phase reopens to add it through `/create:manual-testing-playbook` |
| Risk | An alignment finding points at code, not docs | Medium | Record it in `goal.md` §4 and hand it to the owning phase, which reopens with a fix task; do not change code here |
| Risk | The alignment loop does not converge | Low | Rerun at most three times; on a third run with open findings, record them and escalate to the operator |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Which topic string does `/local-doc-alignment` take for this program? Proposed: `expansive depth`, with `--extend` and `depth-mode` as terms if the command's topic config allows extra terms.
- Does phase 006 or 007 count as user-visible enough for its own scenario, or does a line in an existing scenario suffice? The owning phase decides when it runs the playbook command, and this phase accepts either.
<!-- /ANCHOR:questions -->

---
