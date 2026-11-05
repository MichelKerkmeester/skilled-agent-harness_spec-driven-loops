---
title: "Implementation Plan: Phase 3: templates-and-fleet"
description: "Fix the sk-create-skill templates and README rules so they pass the phase 001 checks, then clear every staged render finding across the fleet one skill at a time, form only, with the phase 002 rewrite guard on every commit."
trigger_phrases:
  - "templates and fleet plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: templates-and-fleet

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown templates and docs, one Python check, JSON rules |
| **Framework** | None |
| **Storage** | `render-known-debt.json`, staged sets in `package_skill.py` |
| **Testing** | pytest through `run-script-tests.sh`, `node --test`, `package_skill.py --check --strict` |

### Overview
Template and rule fixes land first, so the README render checks and the one REFERENCES name are in force before the fleet pass. The fleet pass then works one skill at a time: run `RENDER_STAGED_OFF=1 package_skill.py --check --strict` to list its staged findings, fix each in form only, run `doc-rewrite-guard.py`, commit. The last task empties `RENDER_STAGED_CODES` and `RENDER_STAGED_SCOPES`, so every code is enforced. The ledger `debt` stays `{}` throughout.

### Executors and review
Per the operator's frozen program decision D1 in `../../goal.md`, DeepSeek V4.1 Flash is the only executor model, run through `cli-opencode`, `cli-pi` or `cli-codex`, never Devin. The orchestrator reads every diff before commit. An independent opus-medium review runs before each phase commit, and a review pass alone closes nothing. Fleet commits follow the 066 parent goal D5: one commit per skill with changelog, version bump and Hermes mirror sync.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Phases 001 and 002 committed and their handoff criteria met

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Both staged sets are empty, the ledger `debt` prints `{}`, `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed`, and both node suites report `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Templates first, fleet after

### Key Components
- **sk-create-skill templates**: the source new skills copy. They must validate clean against the phase 001 checks.
- **`template-rules.json`**: turns README render checks on and names the one REFERENCES section.
- **`validate_document.py` inventory check**: extended to WHAT IS IN THE PACKAGE and structure trees.
- **Fleet docs**: fixed per skill, guarded by `doc-rewrite-guard.py`.

### Data Flow
For each skill, `RENDER_STAGED_OFF=1 package_skill.py --check --strict` lists its findings with every staged code and scope enforced. The executor fixes them in form only. The guard compares the change with the phase start commit. The orchestrator reads the diff and the advisory output, then commits the skill.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| sk-create-skill reference, asset, README, SKILL.md and scaffold templates | Source of new skill docs | update | `validate_document.py` on each prints 0 findings |
| `template-rules.json` readme and skill rules | Rule data for the validator | update | README fixtures fire and clear |
| `package_skill.py` scan scopes and staged sets | Decides which findings `--strict` enforces | update: add `README.md` to the scan, empty both staged sets last | `RENDER_STAGED_OFF=1` loop before, plain strict loop after |
| `_code_folder_has_flat_inventory` | Inventory check | update | fixture with a WHAT IS IN THE PACKAGE tree fires and clears |
| Fleet READMEs, references, assets, SKILL.md and ROUTER.md | Docs the checks flag | update, form only | guard reports no hard finding per skill |
| Docs that cite a moved section | Inbound citations | update with the section | guard citation check passes |
| Pinned docs | Code depends on their text | unchanged, operator decides | guard refuses changes |

Required inventories:
- Same-class producers: `rg -n "AT A GLANCE" .skilled/skills --glob 'README.md'` before and after.
- Consumers of changed symbols: `rg -n "REFERENCES AND RELATED RESOURCES|## 5. REFERENCES" .skilled/skills/sk-doc --glob '*.py' --glob '*.json' --glob '*.md'`.
- Matrix axes: doc kind (README, reference, asset, SKILL.md, ROUTER.md), skill, finding type.
- Algorithm invariant: every claim in a base doc appears in the changed doc, and every fenced block is byte-identical.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup lists the staged findings per skill. Implementation fixes the templates and rules, then the fleet one skill at a time. Verification reruns every suite and confirms the ledger is empty.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | README render rules and the extended inventory check | pytest |
| Integration | Per-skill strict check with the entry removed, the ratchet, the compiled-route suite | `package_skill.py`, `node --test` |
| Manual | Orchestrator reads each skill's diff and the guard's advisory lines, then the opus-medium review checks claims | terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 commit | Internal | Yellow, not started | No checks to clear |
| Phase 002 commit | Internal | Yellow, not started | Fleet edits run unguarded |
| Executor quota on the D1 routes | External | Yellow | A quota stop halts for the operator, per D1 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a skill commit drops a claim, breaks a citation or fails the compiled-route suite.
- **Procedure**: revert that skill's commit with `git revert <sha>` and fix its findings again before the staged sets are emptied. Template and rule commits revert on their own, since each skill sits in its own commit.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 002 commit | Implementation |
| Implementation | Setup staged-finding list | Verification |
| Verification | Every skill committed | Program close |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Templates   │────►│ README rules │────►│  Fleet pass  │
│ (1, 8, 10,12)│     │ + inventory  │     │ one skill at │
└──────────────┘     │     (9)      │     │    a time    │
                     └──────────────┘     └──────┬───────┘
                                                 │
                                          ┌──────▼───────┐
                                          │ Empty staged │
                                          └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Templates | Phase 002 | Clean reference, asset, README, SKILL.md and scaffold templates | README rules |
| README rules and inventory | Templates | `renderChecks` on for readme, extended inventory check | Fleet pass |
| Fleet pass | README rules, guard | One commit per skill, no staged finding left | Empty staged sets |
| Empty staged sets | Fleet pass | `RENDER_STAGED_CODES` and `RENDER_STAGED_SCOPES` empty, `debt` still `{}` | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Templates and README rules** - one session - CRITICAL
2. **Fleet pass, 13 skills** - one session per skill - CRITICAL
3. **Final verification** - one session - CRITICAL

**Total Critical Path**: about 15 executor sessions plus reviews

**Parallel Opportunities**:
- Skills with no shared docs can be fixed in parallel workers, with commits still serial
- The size table and the REFERENCES fix can run while the README templates change
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Templates clean | `validate_document.py` on each changed template prints 0 findings | Implementation |
| M2 | READMEs open with OVERVIEW | `rg -n "^## 1\. AT A GLANCE" .skilled/skills --glob 'README.md'` prints nothing | Implementation |
| M3 | Every code enforced | Both staged sets print `()`, `debt` prints `{}` and the 13-skill strict loop exits 0 | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Every fleet commit passes the rewrite guard

**Status**: Accepted

**Context**: The 066 review found 237 rewrite findings, most of them dropped content, changed code blocks and broken section citations.

**Decision**: Each skill commit runs `doc-rewrite-guard.py --base <phase start sha>` on its changed docs and lands only with no hard finding. The orchestrator reads every advisory line.

**Consequences**:
- Claims, code and citations survive the restructure.
- A pinned doc with a finding cannot be fixed in this pass. Mitigation: escalate it to the operator.

**Alternatives Rejected**:
- Review-only protection: 066 showed reviews alone let dropped content through.

### ADR-002: Skill READMEs open with OVERVIEW

**Status**: Accepted

**Context**: The rules and the sk-create-readme template open with OVERVIEW, the skill README templates with AT A GLANCE.

**Decision**: The operator chose OVERVIEW on 2026-11-05. AT A GLANCE content moves into or after OVERVIEW, with every claim kept.

**Consequences**:
- README render checks can turn on with no rule exception.
- About 52 READMEs change. Mitigation: one commit per skill under the guard.

**Alternatives Rejected**:
- Change the rule to AT A GLANCE: it would split README rules from sk-create-readme.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] Read the task's row in `tasks.md`, the requirement it serves in `spec.md` and the review item it cites in `../scratch/review-report.md`
- [ ] Confirm phases 001 and 002 have handed off, shown by their `goal.md` criteria all ticked
- [ ] Before a worker dispatch, read `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`, `cli-pi/SKILL.md` or `cli-codex/SKILL.md`

### Execution Rules

| Rule | Meaning |
|------|---------|
| TASK-SEQ | Templates and rules before the fleet. In the fleet, one skill per commit |
| TASK-SCOPE | Change only the files in `spec.md` section 3, form only, and note anything else in `goal.md` section 4 |
| TASK-VERIFY | A task is done when its Verify command, run by the orchestrator, prints the expected output and the guard reports no hard finding |

### Status Reporting Format

One line per task in `goal.md` section 4: `T### PASS|FAIL|BLOCKED <what happened> <evidence path or command output>`.

### Blocked Task Protocol

Mark the task `[B]`, record the blocking command and its output in `goal.md` section 4 and stop every task that depends on it. A pinned doc with a finding, a claim that cannot survive the restructure or an exhausted executor quota goes to the operator as a question.

---
