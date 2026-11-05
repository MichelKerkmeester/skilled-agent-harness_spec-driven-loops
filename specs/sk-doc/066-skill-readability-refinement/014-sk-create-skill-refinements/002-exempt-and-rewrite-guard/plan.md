---
title: "Implementation Plan: Phase 2: exempt-and-rewrite-guard"
description: "Write one exempt and pinned loader in sk-doc shared scripts and move its three callers onto it, then port the seven 066 scratch guards into one shipped doc-rewrite-guard.py with tests, a replay fixture and a step in the two update workflows."
trigger_phrases:
  - "exempt and rewrite guard plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: exempt-and-rewrite-guard

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 |
| **Framework** | None |
| **Storage** | `render-known-debt.json` for the exempt map and the pinned list |
| **Testing** | pytest through `run-script-tests.sh` |

### Overview
A new loader in `.skilled/skills/sk-doc/shared/scripts/` reads the exempt map and the pinned list, validates both and serves the validator, packaging and the 066 scope gate. `doc-rewrite-guard.py` ports `lost-lines.py`, `intro-diff.py`, `code-blocks.py`, `citations.py`, `frontmatter-diff.py`, `inbound-anchors.py` and `scope-links.py` from the 066 scratch tools into one script. A replay of `013-system-spec-kit/scratch/diff-1.patch` proves the guard, and the 13-skill strict loop proves the loader changed no verdict it should not.

### Executors and review
Per the operator's frozen program decision D1 in `../../goal.md`, DeepSeek V4.1 Flash is the only executor model, run through `cli-opencode`, `cli-pi` or `cli-codex`, never Devin. The orchestrator reads every diff before commit. An independent opus-medium review runs before the phase commit, and a review pass alone closes nothing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Phase 001 committed and its handoff criteria met

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed`, and `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/*.test.cjs` and `node --test .skilled/bin/tests/compiled-route-*.test.cjs` both report `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared loader, single guard

### Key Components
- **Exempt loader**: reads `exempt` and `pinned` from `render-known-debt.json`, fails on a missing doc or a consumer that does not name the doc, and returns doc to consumer maps.
- **`validate_document.py`**: asks the loader whether a doc is exempt and labels its findings with the consumer. The DESIGN.md and style-reference skips move into the map with their consumers.
- **`package_skill.py`**: drops `load_render_exempt` and calls the loader.
- **`doc-rewrite-guard.py`**: compares each changed doc with `--base`, runs hard checks and advisory checks, and asks the loader for exempt and pinned docs.

### Data Flow
The guard lists changed `.md` paths since `--base`, reads the base and working copies, and runs each check per file. Hard findings exit 1. Advisory findings print and exit 0. The validator and packager call the loader once per run and cache its maps.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `validate_document.py` `FORMAT_SPEC_FILES` and the style-reference skip | Skip all validation with no consumer | update, move into the map | `rg -n "FORMAT_SPEC_FILES" .skilled/skills/sk-doc` prints no live list |
| `package_skill.py` `load_render_exempt` | Skips render checks for exempt docs | update, call the loader | 13-skill strict loop matches its pre-change output |
| 066 `scope-gate.py` | Re-implements the exempt rule | update, call the loader | rerun on one finished leaf prints the same `render_warnings` |
| `check-rule-copies.js` | Pins strings in two docs | not a consumer, it is the evidence for the first pinned entries | `rg -n "code-quality-standards.md" .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` |
| sk-design DESIGN.md tests | Read the format docs by heading | not a consumer of the loader | the sk-design tests pass before and after |

Required inventories:
- Same-class producers: `rg -n "exempt|FORMAT_SPEC_FILES|style-reference" .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`.
- Consumers of changed symbols: `rg -n "load_render_exempt|render-known-debt" .skilled specs/sk-doc/066-skill-readability-refinement --glob '*.py' --glob '*.cjs' --glob '*.mjs'`.
- Matrix axes: entry kind (exempt, pinned), doc present or missing, consumer present or missing, consumer names the doc or not.
- Algorithm invariant: a doc is exempt only when its file exists and its consumer file exists and contains the doc's name.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup freezes the replay fixture and the pre-change outputs. Implementation builds the loader, moves its callers, then builds the guard and the workflow steps. Verification reruns every suite from the final state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Loader entry matrix, each guard check with a bad and a good pair | pytest |
| Integration | Guard replay of `diff-1.patch`, 13-skill strict loop before and after the loader | pytest, bash loop |
| Manual | Orchestrator reads the diff and the guard output on the replay | terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 commit | Internal | Yellow, not started | Loader and guard have no final ledger shape |
| 066 scratch tools in `010-sk-prompt/scratch/tools/` | Internal | Green | Guard has no source to port |
| `git` on PATH | External | Green | Guard cannot read `--base` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the 13-skill strict loop output differs from its pre-change capture, or the guard flags an unchanged tree.
- **Procedure**: revert the phase commit with `git revert <sha>`. The loader and the guard land in separate tasks, so the guard can ship alone if the loader move fails review.
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
| Setup | Phase 001 commit | Implementation |
| Implementation | Setup captures | Verification |
| Verification | Implementation | Phase 003 start |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Loader    │────►│ Caller moves │────►│ Pinned list  │
│ (exempt map)│     │ (3 callers)  │     │  + scan      │
└──────┬──────┘     └──────────────┘     └──────┬───────┘
       │                                        │
       └──────────────►┌──────────────┐◄────────┘
                       │ Rewrite guard│
                       │ + workflows  │
                       └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Loader | Phase 001 ledger | Validated exempt and pinned maps | Caller moves, guard |
| Caller moves | Loader | One exempt rule | Verification |
| Pinned list and scan | Loader | Filled `pinned` list, advisory report | Guard |
| Rewrite guard and workflow steps | Loader, pinned list | `doc-rewrite-guard.py`, two doc steps | Phase 003 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Loader and caller moves** - one session - CRITICAL
2. **Guard port and replay fixture** - one to two sessions - CRITICAL
3. **Workflow steps and full verification** - one session - CRITICAL

**Total Critical Path**: three to four executor sessions plus review

**Parallel Opportunities**:
- The guard's diff checks can be ported while the loader callers move
- The two workflow doc steps can be written once the guard's CLI is fixed
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | One exempt rule | `rg -n "def load_render_exempt" .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` prints nothing and the strict loop output is unchanged | Implementation |
| M2 | Guard ships | The guard reports the replayed `diff-1.patch` and is quiet on an unchanged tree | Implementation |
| M3 | Phase ready | Every row in `acceptance-criteria.md` is Met and the opus-medium review passes | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: One guard script with hard and advisory tiers

**Status**: Accepted

**Context**: 066 used seven separate scratch tools. A refinement step that asks for seven commands is skipped.

**Decision**: Ship one `doc-rewrite-guard.py --base <ref> <paths>`. Frontmatter, fenced blocks, citations, cited H2 numbers and anchors, and exempt or pinned docs are hard checks. Lost lines and intro diffs are advisory, because a form-only rewrite moves lines on purpose.

**Consequences**:
- One step to run, one exit code to read.
- Advisory output can be ignored. Mitigation: the workflow step tells the author to read every advisory line before commit.

**Alternatives Rejected**:
- Ship the seven tools as they are: seven entry points and duplicate diff logic.

### ADR-002: Pinned is a list, not an exempt entry

**Status**: Accepted

**Context**: The operator decided on 2026-11-05 that docs whose strings code pins are protected from rewrites while render checks still run.

**Decision**: Add a `pinned` list to the ledger. The validator ignores it. The guard refuses any change to a pinned doc.

**Consequences**:
- Pinned docs still get render findings, which phase 003 fixes only through an operator-approved path.
- Two lists to keep. Mitigation: the loader validates both with the same rules.

**Alternatives Rejected**:
- Put pinned docs in the exempt map: it would hide their render findings, which the operator ruled out.

### ADR-003: The DESIGN.md format spec stays a validator skip

**Status**: Accepted

**Context**: The plan moved both of the validator's hard-coded skips into the exempt map. An exempt entry must name a consumer file that names the doc, and the two Style Reference DESIGN.md files have one in `apply-design-md.cjs`. The five format-spec files in `FORMAT_SPEC_FILES` (`design-md-format.md` and four example DESIGN.md files) have no code consumer: they are skipped because other docs cite their section numbers as the format's ids.

**Decision**: The operator chose on 2026-11-05 to keep the five format-spec files as a validator skip and move only the two Style Reference files into the exempt map. The consumer rule stays strict.

**Consequences**:
- The exempt rule still has one other home, `FORMAT_SPEC_FILES`, for docs no code reads.
- AC-001 named that list as removed, so it is superseded by AC-014.

**Alternatives Rejected**:
- Allow a doc as a consumer: it loosens the rule that a consumer is code.
- Validate the five files normally: it renumbers sections other docs cite by number.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] Read the task's row in `tasks.md`, the requirement it serves in `spec.md` and the review item it cites in `../scratch/review-report.md`
- [ ] Confirm phase 001 has handed off, shown by its `goal.md` criteria all ticked
- [ ] Before a worker dispatch, read `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`, `cli-pi/SKILL.md` or `cli-codex/SKILL.md`

### Execution Rules

| Rule | Meaning |
|------|---------|
| TASK-SEQ | Run tasks in `tasks.md` order. The T001 captures come before any code |
| TASK-SCOPE | Change only the files in `spec.md` section 3, and note anything else in `goal.md` section 4 |
| TASK-VERIFY | A task is done when its Verify command, run by the orchestrator, prints the expected output |

### Status Reporting Format

One line per task in `goal.md` section 4: `T### PASS|FAIL|BLOCKED <what happened> <evidence path or command output>`.

### Blocked Task Protocol

Mark the task `[B]`, record the blocking command and its output in `goal.md` section 4 and stop every task that depends on it. A block that needs a decision, such as a pinned doc that must change, goes to the operator as a question.

---
