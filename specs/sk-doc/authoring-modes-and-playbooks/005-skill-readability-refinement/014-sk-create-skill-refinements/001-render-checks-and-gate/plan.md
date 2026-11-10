---
title: "Implementation Plan: Phase 1: render-checks-and-gate"
description: "Add the missing render checks and fix four defects in the shared validator, make the sk-create-skill gate strict everywhere, widen the packaging scan and add a CI sweep and a ledger ratchet. Fixtures prove each check, and the 13-skill strict loop proves the gate stays green."
trigger_phrases:
  - "render checks and gate plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: render-checks-and-gate

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 for the validator and packager, Node for the ratchet test, YAML for CI |
| **Framework** | None |
| **Storage** | JSON rule and ledger files |
| **Testing** | pytest through `run-script-tests.sh`, `node --test` |

### Overview
The checks land in `shared/scripts/validate_document.py`, which packaging already imports, so every caller gets them at once. `package_skill.py` widens its scan and fixes the fence-blind section scan, and `sk-doc-script-tests.yml` runs a fleet sweep and the new ratchet. New codes and newly scanned paths go into staged sets that print as `render advisory:` and stay warnings under `--strict`. Fixtures prove each check, and the 13-skill `--check --strict` loop proves the gate stays green with the ledger's `debt` at `{}`.

### Executors and review
Per the operator's frozen program decision D1 in `../../goal.md`, DeepSeek V4.1 Flash is the only executor model, run through `cli-opencode`, `cli-pi` or `cli-codex`, never Devin. The orchestrator reads every diff before commit. An independent opus-medium review runs before the phase commit, and a review pass alone closes nothing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed`, `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/*.test.cjs` and `node --test .skilled/bin/tests/compiled-route-*.test.cjs` both report `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One shared validator

### Key Components
- **`shared/scripts/validate_document.py`**: owns every render check. New checks register next to the existing `render_*` checks and read their section names from `shared/assets/template-rules.json`.
- **`sk-create-skill/scripts/package_skill.py`**: chooses which docs to scan, applies the ledger, labels staged findings `render advisory:` and promotes `render check:` findings under `--strict`. The hook is the `describe()` helper inside `validate_render`, which today prefixes every finding with `render check:`, the marker `STRICT_PROMOTED_MARKERS` promotes.
- **`sk-create-skill/scripts/render-known-debt.json`**: the ledger. Its `debt` stays `{}` and the ratchet test freezes it with the exempt keys.
- **Scan scopes and staged sets**: `RENDER_SCAN_SCOPES` (`SKILL.md`, `ROUTER.md`, `shared/references`, `runtime/references`) lists the widened scan targets and stays after phase 003. Each finding records the scope that selected it. `RENDER_STAGED_CODES` is a tuple of every render code this phase adds. `RENDER_STAGED_SCOPES` is a tuple of scope names still advisory: every scope this phase adds plus `README.md`, so phase 003 can add READMEs to the scan without adding to a staged set. A finding is staged when its code is in the first tuple or its scope is in the second. `RENDER_STAGED_OFF=1` turns both off. New codes must also join `RENDER_CHECK_TYPES`, or `_render_findings` drops them.
- **`.github/workflows/sk-doc-script-tests.yml`**: runs the fleet sweep and the ratchet on every push and pull request.

### Data Flow
A doc path goes to `validate_document.py`, which returns findings. `package_skill.py` collects findings for every scanned doc of a skill, subtracts ledger debt and exempt docs, labels staged findings `render advisory:`, and under `--strict` fails on the `render check:` findings that are left. CI runs that per skill and runs the ratchet against the frozen ledger snapshot.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `validate_document.py` render checks | Producer of every render finding | update | fixtures under `.skilled/skills/sk-doc/scripts/tests/render/` fire and clear |
| `package_skill.py` `_render_findings` and section scan | Consumer that picks docs and applies the ledger | update | 13-skill strict loop exits 0 |
| `validate_skill_package.py` | Wrapper that runs `package_skill.py --check` | unchanged, its `--strict` flag becomes the documented form | `rg -n "strict" .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py` |
| sk-create-skill SKILL.md, README, creation-workflow | Docs that name the gate | update | `rg -n "validate_skill_package.py"` shows one form |
| `scope-gate.py` in the 066 scratch tools | Consumer of render findings | not a consumer of the code change, phase 002 moves it to the shared loader | none in this phase |

Required inventories:
- Same-class producers: `rg -n "def _render_|render_[a-z_]+" .skilled/skills/sk-doc/shared/scripts/validate_document.py`.
- Consumers of changed symbols: `rg -n "_render_findings|render-known-debt|validate_document" .skilled --glob '*.py' --glob '*.cjs' --glob '*.yml' --glob '*.md'`.
- Matrix axes: doc type (reference, asset, SKILL.md, ROUTER.md), fenced or not, staged code or not, staged scope or not, `RENDER_STAGED_OFF` set or not.
- Algorithm invariant: a heading inside a fence or frontmatter is never a section, and a check never fires on a clean doc.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup takes baselines. Implementation adds the checks, the gate wording, the wider scan and the CI steps in that order. Verification reruns every suite from the final state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each new or fixed check, one bad and one good fixture | pytest through `run-script-tests.sh` |
| Integration | `package_skill.py --check --strict` on all 13 skills with and without `RENDER_STAGED_OFF=1`, the ratchet against a copy with a debt entry or a staged code added | bash loop, `node --test` |
| Manual | Orchestrator reads the diff and the sweep output before commit | terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/010-sk-prompt/scratch/tools/rubric.md` line 4 and `inbound-anchors.py` | Internal | Green | Intro pointer and section reference checks lack their phrase list and regex |
| pytest 8.4.2 and Node 22 as pinned in `sk-doc-script-tests.yml` | External | Green | Tests cannot run in CI |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the 13-skill strict loop fails after a check lands, or a fixture shows a check firing on a clean doc.
- **Procedure**: revert the phase commit with `git revert <sha>`. Each check lands in its own task, so a single bad check can also be reverted alone before the phase commit.
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
| Setup | None | Implementation |
| Implementation | Setup baselines | Verification |
| Verification | Implementation | Phase 002 start |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│ Check fixes │────►│  New checks  │────►│ Staged sets  │
│ (11,13,14)  │     │  (1, 7, 8)   │     │  + ratchet   │
└─────────────┘     └──────┬───────┘     └──────┬───────┘
                           │                    │
                     ┌─────▼──────┐       ┌─────▼──────┐
                     │ Wider scan │──────►│  CI sweep  │
                     │    (3)     │       │  (3, 4)    │
                     └────────────┘       └────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Check fixes | None | Correct `render_section_order`, `h2_numbering`, `bold_label_join`, section scan | New checks |
| New checks | Check fixes | `render_overview_subsections`, `render_section_reference`, intro checks | Staged sets |
| Wider scan | New checks | SKILL.md, ROUTER.md and shared tree findings | Staged sets, CI sweep |
| Staged sets and ratchet | New checks, wider scan | `RENDER_SCAN_SCOPES`, `RENDER_STAGED_CODES`, `RENDER_STAGED_SCOPES`, `render advisory` marker, `RENDER_STAGED_OFF`, frozen fixture, ratchet test | CI sweep |
| CI sweep | Staged sets | Workflow steps | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Check fixes and new checks** - one session - CRITICAL
2. **Wider scan and staged sets** - one session - CRITICAL
3. **CI steps and full verification** - one session - CRITICAL

**Total Critical Path**: three executor sessions plus review

**Parallel Opportunities**:
- The gate wording task (item 2) and the check fixes can run at the same time
- The ratchet test can be written while the wider scan runs
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Checks land | `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed` | Implementation |
| M2 | Staged sets in force | The 13-skill strict loop exits 0 for every skill with staged findings printed as `render advisory:`, and `debt` prints `{}` | Implementation |
| M3 | Phase ready | Every row in `acceptance-criteria.md` is Met and the opus-medium review passes | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Advisory until 003 through staged sets

**Status**: Accepted

**Context**: The new checks and the wider scan raise findings across the fleet the moment they land. Under `--strict` those would fail the gate for most skills, but the fleet fix belongs to phase 003. The ledger's rule is "never add an entry to excuse a new finding". The operator decided on 2026-11-05: "Advisory until 003: the new checks ship as warnings, and only `--strict` makes them errors. Phase 001 doesn't put the new codes under strict until phase 003 has cleared the fleet. The ledger stays empty and its rule stays intact."

**Decision**: `package_skill.py` lists the widened scan targets in `RENDER_SCAN_SCOPES` (`SKILL.md`, `ROUTER.md`, `shared/references`, `runtime/references`) and records on each finding the scope that selected it. Two staged sets keep findings advisory. `RENDER_STAGED_CODES` holds every render code this phase adds. `RENDER_STAGED_SCOPES` holds every scope this phase adds plus `README.md`, so even an existing code stays advisory on a newly scanned file. Staging by scope name, not by path pattern, keeps the docs the old scan already read under `references/` and `assets/` enforced, including a `README.md` inside them. The `describe()` helper in `validate_render` prefixes a staged finding with `render advisory:` in place of `render check:`. `STRICT_PROMOTED_MARKERS` matches `render check` and not `render advisory`, so `_partition_strict` leaves staged findings as warnings with no other change. `RENDER_STAGED_OFF=1` makes both sets inert. The ratchet freezes both sets and allows only removals. Phase 003 empties them as its last task, and `RENDER_SCAN_SCOPES` stays.

**Consequences**:
- The gate stays green between phases, the ledger's `debt` stays `{}` and its rule stays intact.
- Staged findings print on every run, so the work left stays visible.
- A staged finding does not block a commit until phase 003. Mitigation: the ratchet forbids adding to the staged sets, and phase 003 cannot close until both are empty.

**Alternatives Rejected**:
- Seed the current hits into the ledger: rejected by the operator, since it breaks the ledger's "never add an entry to excuse a new finding" rule.
- Fix every hit in this phase: it mixes fleet rewrites into a code phase before the rewrite guard from phase 002 exists.

### ADR-002: Host the sweep and the ratchet in sk-doc-script-tests.yml

**Status**: Proposed

**Context**: The review asks for a CI sweep and a ratchet. The routing ratchet runs in `routing-registry-drift.yml`, but `sk-doc-script-tests.yml` already runs every sk-doc script test on every push.

**Decision**: Add both steps to `.github/workflows/sk-doc-script-tests.yml`.

**Consequences**:
- One workflow file changes, matching the scope.
- The job's 10-minute timeout must hold. Mitigation: time the sweep locally in T001 and raise the timeout in the same step if needed.

**Alternatives Rejected**:
- A new workflow file: one more file to keep in step with the CI switch convention for no gain.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] Read the task's row in `tasks.md`, the requirement it serves in `spec.md` and the review item it cites in `../scratch/review-report.md`
- [ ] Re-locate each cited line with `rg -n` before editing, since line numbers may have drifted
- [ ] Before a worker dispatch, read `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`, `cli-pi/SKILL.md` or `cli-codex/SKILL.md`

### Execution Rules

| Rule | Meaning |
|------|---------|
| TASK-SEQ | Run tasks in `tasks.md` order. Baselines in T001 to T003 come before any code |
| TASK-SCOPE | Change only the files in `spec.md` section 3, and note anything else in `goal.md` section 4 |
| TASK-VERIFY | A task is done when its Verify command, run by the orchestrator, prints the expected output |

### Status Reporting Format

One line per task in `goal.md` section 4: `T### PASS|FAIL|BLOCKED <what happened> <evidence path or command output>`.

### Blocked Task Protocol

Mark the task `[B]`, record the blocking command and its output in `goal.md` section 4 and stop every task that depends on it. A block that needs a decision, such as a check that cannot be staged cleanly or an exhausted executor quota, goes to the operator as a question.

---
