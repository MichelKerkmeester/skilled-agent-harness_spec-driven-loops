---
title: "Implementation Plan: Phase 1: git-workflow-run-failures"
description: "A five-iteration analysis lineage reproduced fourteen run-failing git behaviors, three serial cli-pi dispatches fixed the ten that live in the hooks, sk-git scripts and bin scripts, and a fresh lineage settled clean afterwards."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: git-workflow-run-failures

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash hooks and scripts, ES module rule engine, sk-code opencode standards |
| **Framework** | deep-research fan-out for the analysis, cli-pi one-change dispatches for the fixes |
| **Storage** | research/ for the analysis and the proof lineage |
| **Testing** | eight shell harnesses and one node suite, each extended with the reproduced case |

### Overview
Analysis first, with reproductions in throwaway repositories, then one brief per producer group. Every adjustment fixed the producer and kept the interactive gate, shipped a harness case, and was re-run by the conductor. The proof is a fresh lineage on the adjusted tree that settled with succeeded 1.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Analyze, then fix each producer, then prove with a run

### Key Components
- **Analysis lineage**: fourteen behaviors, reproduced or ruled out, ranked
- **Hooks dispatch**: autostash anchor, bypass lines, trailer length, installer status
- **sk-git scripts dispatch**: advisory effective directory, allocator lock reclaim
- **bin scripts dispatch**: reaper safety, base persistence, sync rewrite log
- **Proof lineage**: one iteration, settled clean

### Data Flow
The observed list seeds the lineage. The lineage's reproductions seed the briefs. The briefs produce commits with harness cases. The proof lineage runs on the result.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| git-rule-checks.mjs, git-context.mjs | advisory state source | update | 25 node cases |
| commit-id-naming.sh | lock and high-water | update | 39 harness cases |
| autostash-orphan-guard.sh, post-commit, pre-commit, commit-msg, install-git-hooks.sh | hook gates | update | 2, 25, 11, 43 cases, installer harness |
| worktree-reaper.sh, worktree-session.sh, git-sync.sh | session lifecycle | update | 24, 18, 7 cases |
| write-containment.ts, fanout-run.cjs | runtime containment and watchdog | unchanged, named for their own packet | research.md section 2 |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
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
| Unit | rule engine cases | node --test |
| Integration | hook, allocator, reaper, session and sync harnesses in throwaway repos | bash harnesses |
| Manual | a fresh fan-out lineage on the adjusted tree | fanout-run.cjs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| phase 005 dispatches settled | Internal | Green | containment would fail the analysis lineage |
| pi through the gateway | External | Green | no analysis |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a harness regresses on the main clone after merge
- **Procedure**: revert the three fix commits; each is independent
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | 17-minute lineage plus the reduction |
| Core Implementation | Med | three serial dispatches, about 40 minutes |
| Verification | Low | harness reruns and a four-minute proof lineage |
| **Total** | | **about 90 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Not applicable
- [x] Every gate keeps its bypass variable
- [x] Not applicable

### Rollback Procedure
1. Set the affected gate's bypass variable
2. Revert the fix commit
3. Rerun its harness
4. Not user-facing

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Analysis | quiet tree | research.md | Briefs |
| Briefs | analysis | three commits | Proof |
| Proof | commits | succeeded 1 | 006 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Analysis lineage** - 17 minutes - CRITICAL
2. **Three dispatches** - 40 minutes - CRITICAL
3. **Proof lineage** - 4 minutes - CRITICAL

**Total Critical Path**: about one hour

**Parallel Opportunities**:
- None: the analysis and the proof need a frozen tree, and the dispatches ran serially after three were killed for memory
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Analysis settled | succeeded 1, five iterations | 2026-09-11, done |
| M2 | Ten adjustments landed | three commits, all harnesses green | 2026-09-11, done |
| M3 | Proof settled | succeeded 1 in 259 seconds | 2026-09-11, done |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Runtime seams are named, not edited

**Status**: Accepted

**Context**: Four confirmed failures live in the deep-loop runtime: containment failing a lineage for another writer's same-packet edit, the stall watchdog reading buffered output as a hang, containment inheriting host-global git configuration, and a killed child leaving no cause.

**Decision**: They are recorded with producer lines in research.md and left for a system-deep-loop packet. This packet edits sk-git, the hooks and the bin scripts only.

**Consequences**:
- The shared runtime keeps its own blast radius and review
- The containment failure that hit this packet stays possible until that packet lands; the delegation rule now tells the orchestrator to freeze

**Alternatives Rejected**:
- Patch fanout-run.cjs here: a shared runtime change outside the frozen scope

---

