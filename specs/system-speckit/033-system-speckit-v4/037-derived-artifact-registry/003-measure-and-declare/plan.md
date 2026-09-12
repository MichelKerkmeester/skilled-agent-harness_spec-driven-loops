---
title: "Implementation Plan: Phase 3: measure the residue and declare the unhealable"
description: "Extend the existing weekly freshness job with JSON output from both repair tools and a declared list of unhealable documents, then record a measured residue baseline instead of asserting a clean tree."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: measure the residue and declare the unhealable

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS for both tools, YAML for the workflow |
| **Framework** | The spec-kit CLI, no new dependency |
| **Storage** | `runtime/cli/lib/unhealable-documents.json` |
| **Testing** | Vitest parity cases plus a local run of the workflow command over a scratch worktree |

### Overview
The measurement already has a home. `.github/workflows/strict-pass-freshness-report.yml` runs weekly and already invokes `repair-derived.cjs --roots specs` read-only. This phase adds a `--format json` mode to that tool and to `heal-spec-docs.cjs`, points the workflow step at both modes and publishes the counts. The declared list at `runtime/cli/lib/unhealable-documents.json` is then checked against the healer's refusals in both directions.

The baseline is measured, not assumed. The plan-time observation is one repairable packet under `specs/sk-git` and two under `specs/hooks`, so no criterion may expect a clean tree to report zero. The refresh command is `node .opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --roots specs`, which exits 1 while repairable work remains.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Add a machine-readable mode to two existing tools, then let the existing weekly job consume both reports and compare them with one declared list.

### Key Components
- **`--format json` on `repair-derived.cjs`**: one report object carrying the same counts the text summary prints, and the same exit codes.
- **`--format json` on `heal-spec-docs.cjs`**: one report object listing every refusal with its document path and reason.
- **Declared list** (`runtime/cli/lib/unhealable-documents.json`): one entry per document with a reason, sorted by path so a diff is stable. `validator-registry.json` is the precedent for a JSON table in that directory.
- **Workflow extension**: the derived-repair step captures the report, parses it, publishes the counts with the existing artifact and warns on an undeclared refusal or a stale declaration. The step remains read-only.

### Data Flow
The job runs both tools over `specs`, captures their JSON, compares refusals against the declared list, writes the counts into the job summary and the artifact and never writes to the packet tree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is not a bug fix. The section is filled because the phase changes the output contract of two tools that other callers already read.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/spec/repair-derived.cjs` | Human report, exit 0, 1 or 2 | update, additive `--format json` | Parity case comparing both modes on one fixture |
| `runtime/cli/spec/heal-spec-docs.cjs` | Human census with a top-ten refusal table | update, additive `--format json` | New census case naming every refusal with its reason |
| `.github/workflows/strict-pass-freshness-report.yml` | Weekly read-only report | update, the derived-repair step consumes both JSON reports | Local run in a scratch worktree with `git status --porcelain` equality |
| `.opencode/scripts/git-hooks/pre-commit` | Calls `repair-derived.cjs` in text mode | unchanged, text mode stays the default | Existing harness cases still pass |
| `runtime/cli/tests/repair-derived.vitest.ts` | Covers argument parsing and repairs | update, parity cases added | The suite itself |

Required inventories:
- Consumers of `repair-derived.cjs` output: `rg -n 'repair-derived' .opencode .github --glob '!**/node_modules/**'`.
- Consumers of `heal-spec-docs.cjs` output: `rg -n 'heal-spec-docs' .opencode .github --glob '!**/node_modules/**'`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | JSON shape and text parity for both tools | Vitest |
| Unit | Declaration comparison over a fixture refusal set, including the stale direction | Vitest |
| Integration | A local run of the extended workflow command in a scratch worktree, asserting the counts appear and the tree is unchanged | Shell |
| Manual | Read the published artifact from a workflow dispatch run and compare its counts with a local run | GitHub Actions |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The weekly workflow and its cron | Internal | Green | The measurement has no scheduled home |
| `repair-derived.cjs` existing counts | Internal | Green | The JSON mode has nothing to mirror |
| `heal-spec-docs.cjs` refusal list | Internal | Green | The declared list has no source |
| `runtime/cli/lib/` as a JSON table home | Internal | Green | None, the precedent exists |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The JSON mode changes an existing caller's behavior, or the workflow step starts failing the job
- **Procedure**: Revert the two tools and the workflow. Text mode is the default, so reverting the tools restores every existing caller.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
JSON modes ────────────┐
                       ├──► Declared list ──► Workflow extension ──► Baseline
Refusal census read ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Implementation | Med | 3 to 4 hours |
| Verification | Med | 2 hours |
| **Total** | | **6 to 7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm text mode stays the default for both tools
- [ ] Confirm the workflow passes no `--apply`
- [ ] Confirm the declared list is sorted by path

### Rollback Procedure
1. Revert the two tools to text-only output
2. Revert the workflow step
3. Remove `runtime/cli/lib/unhealable-documents.json`
4. Run both tools in text mode and confirm the previous output is back

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ JSON modes      │────►│ Declared list   │────►│ Workflow step   │
│ both tools      │     │ with reasons    │     │ counts + flags  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| repair-derived JSON | Existing text summary | Counts for the job | Workflow step |
| Healer JSON | Existing refusal census | Refusal list | Declaration comparison |
| Declared list | Healer refusal reasons | One entry per document | Declaration comparison |
| Workflow step | Both JSON modes and the list | Published counts and flags | Baseline |
| Baseline | One measured run | A recorded count | Later gate changes |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **JSON modes on both tools** - 2 hours - CRITICAL
2. **Declared list from the refusal census** - 1 hour - CRITICAL
3. **Workflow step consuming both reports** - 2 hours - CRITICAL
4. **Recorded baseline from one run** - 1 hour - CRITICAL

**Total Critical Path**: About 6 hours

**Parallel Opportunities**:
- The two JSON modes are separate files and can land independently
- The baseline can be recorded as soon as the repair JSON lands, without waiting for the healer work
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Machine-readable modes exist | Both tools print JSON matching their text counts | End of Implementation |
| M2 | Declared list checked both ways | An undeclared refusal and a stale entry both appear in a fixture report | End of Implementation |
| M3 | Baseline recorded | The published count and the recorded baseline agree, and a second run reproduces them | End of Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Extend the weekly job instead of adding a sweep

**Status**: Proposed

**Context**: `.github/workflows/strict-pass-freshness-report.yml` already runs weekly, already invokes the repair tool read-only over `specs`, and already publishes an artifact. A new sweep tool would duplicate that schedule, that scope and that artifact.

**Decision**: Extend the existing step. Add `--format json` to the tools it already calls, and add the count and declaration logic to the same job.

**Consequences**:
- One schedule and one artifact carry the measurement
- The job grows a comparison responsibility, which is why its report stays read-only and its failures stay visible

**Alternatives Rejected**:
- A new `derived-drift` sweep tool: a second walk over the same corpus with the same schedule
- A second workflow: two artifacts that can disagree

### ADR-002: Check the declared list in both directions

**Status**: Proposed

**Context**: A one-way check only catches a refusal that was never declared. It cannot notice the opposite, a document that was healed or removed while its declaration stayed behind.

**Decision**: The report carries two lists, an undeclared refusal set and a stale declaration set, and both are published.

**Consequences**:
- The declared list shrinks by evidence rather than by memory
- The report has two failure directions to render, which the tests cover on fixtures

**Alternatives Rejected**:
- A one-way allow-list: leaves stale entries invisible and lets the list grow without bound

---

<!-- ANCHOR:ai-execution-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm the weekly workflow's current derived-repair step was read before it is extended
- [ ] Confirm both tools' text output was captured on the current tree so the JSON modes can be compared against it
- [ ] Confirm the plan-time baseline was re-measured rather than copied from this document

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Land both JSON modes before the workflow step consumes them, so the step is never pointed at an output that does not exist |
| TASK-SCOPE | No new sweep file appears in the diff. A second walk over the corpus stops the phase and is raised instead |

### Status Reporting Format
Report phase status as: `Phase 003 - <Draft|Implementation|Verified> - baseline repairable=<N> refused=<M> - blocking on: <none | the named step>`.

### Blocked Task Protocol
If a refusal cannot be given a reason from the document itself, it is listed as undeclared rather than guessed at. If the weekly job's artifact contract cannot carry the counts without changing its name, stop and raise the contract change instead of renaming it.
<!-- /ANCHOR:ai-execution-protocol -->

---

