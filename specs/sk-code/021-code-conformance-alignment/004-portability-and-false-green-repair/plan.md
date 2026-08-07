---
title: "Implementation Plan: Portability and False-Green Repair"
description: "Make the audit helpers location-independent, turn every silent skip into a loud failure, give the flowchart validator a verdict on every input, replace an eval of generated assignments with a structured return, and adopt errexit command by command in the scripts whose missing errexit is deliberate — each tolerated non-zero exit guarded before the flag goes on, with failure-injection cases asserting exit semantics are unchanged."
trigger_phrases:
  - "portability repair plan"
  - "guarded errexit adoption"
  - "silent skip loud failure"
  - "worktree portability verification"
importance_tier: "high"
contextType: "planning"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/004-portability-and-false-green-repair"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the implementation plan for portability and false-green repair"
    next_safe_action: "Run T001; may proceed in parallel with child 001"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Portability and False-Green Repair

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2+ (git-coordination scripts, pre-push harness, flowchart validator, prerequisites script), Python 3.11 (advisor test, audit helpers), TypeScript (MCP Vitest suites) |
| **Framework** | Vitest for the MCP suites; plain `bash`/`python3` elsewhere |
| **Storage** | None, but the shell lane **mutates git state** — that is the whole risk profile of this child |
| **Testing** | Failure-injection cases for the git scripts; a `git worktree` at a different path for the portability claim; the no-box regression fixture for the validator; the repaired suites themselves |

### Overview

Three independent lanes with different verification shapes. **Portability** is verified by reproducing the defect's own failure mode: run the helper from a worktree at a different path and demand identical output. **False green** is verified by the absence of skips — this child treats a skipped case as a failure, which is the only way a repaired silent skip can be proven repaired. **Errexit** is the dangerous one and is verified by *unchanged* behaviour: the failure-injection cases must show that fetch failure, rebase failure and fast-forward failure exit exactly as they did before, because the goal is conformance without a semantic change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] A per-command tolerance inventory exists for each of the three git-coordination scripts, before any flag is added
- [ ] The pre-change behaviour of every failure-injection case is captured as the specification

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
- [ ] Zero skipped cases in any repaired suite
- [ ] `.opencode/bin` verifier delta reported: FAIL/3 errors → PASS/0 errors
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Defect-reproduction-driven repair. For each finding, the verification is the defect's own failure mode run as a test: a different checkout path for portability, a missing fixture for the false green, an injected git failure for errexit, a no-box input for the validator.

### Key Components

- **The four audit helpers**: currently anchored to one absolute checkout root; become location- or argument-derived.
- **The three git-coordination scripts**: `git-sync.sh`, `git-live-follow.sh`, `worktree-status.sh`. Each runs `set -uo pipefail` deliberately. Each gains a per-command tolerance inventory, then guarded conditionals, then `-e`.
- **The two MCP Vitest suites**: currently skip on a missing absolute packet path; become either in-tree-fixtured or loudly failing.
- **The advisor Python test**: currently resolves a path that no longer exists and raises; becomes repointed and registered, or retired.
- **The flowchart validator**: currently aborts before emitting a verdict on a no-box input; gains a regression fixture and then a verdict on every input.
- **The prerequisites script**: currently `eval`s generated assignments; gains a structured return.

### Data Flow

Nothing here shares a data path. The unifying property is the *claim* each component makes — "I ran", "I verified", "I succeeded" — and that each claim is currently false in a specific, reproducible way.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Four spec-kit audit helpers | Anchored to one absolute checkout root (7 literals) | update — derive the root | Run from a `git worktree` at a different path and from a symlinked path; output must be identical |
| `test_dual_threshold.py` | Resolves an advisor path that has not existed since the advisor moved; raises rather than fails | update or retire | The repaired test executes as part of the advisor package's verification command |
| The advisor's real package location | The actual home of `skill_advisor.py` | not a consumer — target of the repointing | `ls` confirms the real path at T001 |
| Two MCP Vitest suites | Skip on a missing absolute packet path, reporting green | update — in-tree fixture or loud failure | Zero skips; a deliberately removed fixture produces a named, actionable failure |
| `validate-flowchart.sh` | Aborts after "Checking for misaligned boxes…" on a no-box input, emitting no verdict | update — verdict on every input | No-box regression fixture, added and demonstrated failing before the fix |
| `.opencode/bin/git-sync.sh` | Deliberately non-errexit git coordination | update — guarded errexit | Fetch, rebase and fast-forward failure injection; exit code and tree state unchanged |
| `.opencode/bin/git-live-follow.sh` | Deliberately non-errexit git coordination | update — guarded errexit | Same injection matrix |
| `.opencode/bin/worktree-status.sh` | Deliberately non-errexit git coordination | update — guarded errexit | Same injection matrix |
| `.opencode/scripts/git-hooks/tests/pre-push.test.sh` | Test harness without errexit (verifier WARN) | update | Harness still passes; a deliberately failing case now fails the harness |
| Prerequisites script | `eval "$(get_feature_paths)"` | update — structured return | Test with a space-containing path; `grep` shows no generated-assignment `eval` |
| `.opencode/scripts/git-hooks/lib/{autostash-orphan-guard,memory-drift-marker}.sh` | Two `SH-STRICT-MODE` errors named by no finding | decide at T001 — this child or 003 | Whichever child takes them records the decision |
| Child 003's lane A | Sweeps `.opencode/bin` headers | not a consumer — coordinated exclusion | 003 leaves these three scripts alone; their 3 errors persist through 003 and close here |

Required inventories:
- Same-class producers: `rg -n '/Users/' --glob '*.py' --glob '*.sh' --glob '*.ts' --glob '*.cjs' --glob '!node_modules'` — every remaining hardcoded checkout root, not just the four named files.
- Same-class producers: `rg -n '\.skip\(|it\.skip|describe\.skip|skipIf' --glob '*.ts'` — every other conditional skip that could be a silent false green.
- Consumers of changed symbols: `rg -n 'get_feature_paths' .` — every caller of the function whose return shape changes.
- Matrix axes: {script: git-sync, git-live-follow, worktree-status} × {injected failure: fetch, rebase, fast-forward}. Nine rows, each asserting unchanged exit code and unchanged tree state.
- Algorithm invariant for errexit adoption: **for every command that may legitimately exit non-zero, the guarded form must produce the same control flow and the same exit code as the unguarded form did under `set -uo pipefail`.** Adversarial cases: a probe whose non-zero exit is its success signal; a command in a pipeline whose failure is already masked by `pipefail`; a command inside a conditional where `-e` is already suspended; a command whose failure previously fell through to a later cleanup block.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm each finding against HEAD, including the four unverified ones
- [ ] Capture the pre-change behaviour of all nine failure-injection cases as the specification
- [ ] Build the per-command tolerance inventory for the three git-coordination scripts
- [ ] Add the no-box flowchart regression fixture and demonstrate it failing

### Phase 2: Core Implementation
- [ ] Portability lane: derive the roots in the four helpers
- [ ] False-green lane: repair the Python test and the two MCP suites; replace the `eval`
- [ ] Shell lane: guard each tolerated non-zero exit, then adopt errexit, script by script
- [ ] Flowchart validator: emit a verdict on every input

### Phase 3: Verification
- [ ] Manual testing complete — helpers run from a worktree and a symlinked path
- [ ] Edge cases handled — all nine injection cases show unchanged semantics
- [ ] Documentation updated — spec, plan, tasks, checklist and decision record reconciled
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Portability | Each repaired helper, run from a different checkout path | `git worktree add` to a temp path, plus a symlinked path; output diff |
| Failure injection | 3 scripts × 3 injected git failures | A test harness that stubs `git` to fail on a named subcommand |
| Regression | Flowchart validator on a no-box input | The regression fixture, added before the fix |
| Contract | No suite skips | Test-runner output parsed for skip counts; any skip fails this child |
| Contract | No remaining hardcoded checkout root | `rg -n '/Users/'` over authored code |
| No-regression gate | `.opencode/bin` shell strict mode | `python3 .opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root .opencode/bin` — baseline FAIL/3 errors, target PASS/0 |
| Integration | Advisor package verification command | The package's documented command, which must now exercise the repaired test |
| Manual | Per-command tolerance inventory review | Reading each script against its inventory before the flag lands |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child 001 | Internal | Green — **not blocking** | This child runs in parallel; if child 001's baseline is unavailable, capture the `.opencode/bin` baseline here and record that it was self-captured |
| Child 003 | Internal | Green | 003 must leave the three git-coordination scripts alone; confirm before starting the shell lane |
| Security register's harness child | External to this program | Yellow | Adopt its silent-failure doctrine; if it has not landed, record the doctrine used and flag it for later reconciliation |
| The advisor's package location | Internal | Green | Confirmed to exist under the advisor's own package; the referenced legacy path does not |
| In-flight spec reorganisation | External | Yellow | The MCP fixture path may be moving; T001 re-checks before the fix |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an injection case shows changed exit semantics; a repaired suite fails in a way that blocks unrelated work; a helper's derived root resolves incorrectly on any tested path shape.
- **Procedure**: each lane is separately committed, and within the shell lane each script is its own commit. `git revert <commit>` restores the prior behaviour. **The shell lane's revert must be exercised, not assumed** — after reverting, re-run all nine injection cases and confirm they match the captured pre-change specification, because a partially-guarded script is more dangerous than an unguarded one.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm + capture) ──┬──► Portability lane ──┐
                              ├──► False-green lane ──┼──► Phase 3 (Verify)
                              └──► Shell lane ────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm + capture | None | All three lanes |
| Portability lane | Confirm | Verify |
| False-green lane | Confirm | Verify |
| Shell lane | Confirm, tolerance inventory, child 003 exclusion confirmed | Verify |
| Verify | All lanes | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm + capture + tolerance inventory | Med | 3-5 hours |
| Portability lane | Low | 2-3 hours |
| False-green lane | Med | 4-7 hours (unknown: what the repaired suites surface) |
| Shell lane | High | 5-8 hours |
| Verification | Med | 2-4 hours |
| **Total** | | **16-27 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) — no data, but the captured pre-change injection-case behaviour is the artifact that makes rollback verifiable
- [ ] Feature flag configured — N/A
- [ ] Monitoring alerts set — N/A; the injection cases are the signal

### Rollback Procedure
1. Identify the failing lane and, within the shell lane, the specific script.
2. `git revert <commit>` for that script or lane alone.
3. Re-run all nine failure-injection cases and confirm they match the captured pre-change specification.
4. Re-run the portability checks from a worktree if the portability lane was involved.
5. Confirm no script is left partially guarded — a half-adopted errexit is worse than none.

### Data Reversal
- **Has data migrations?** No. The shell lane mutates git state at runtime but persists nothing this phase must reverse.
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────────┐
│ Confirm + capture  │
│ pre-change specs   │
└─────────┬──────────┘
          │
   ┌──────┼───────────────┬──────────────────┐
   ▼      ▼               ▼                  ▼
┌────────────┐  ┌──────────────────┐  ┌──────────────┐
│Portability │  │ False green      │  │ Shell lane   │
│(worktree)  │  │ (no skips)       │  │ (injection)  │
└──────┬─────┘  └────────┬─────────┘  └──────┬───────┘
       └─────────────────┴───────────────────┘
                         ▼
                ┌──────────────────┐
                │  Verify + delta  │
                └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Pre-change capture | None | The specification every repair is measured against | All lanes |
| Tolerance inventory | Pre-change capture | Per-command guard design | Shell lane |
| Portability lane | Capture | Location-independent helpers | Verify |
| False-green lane | Capture | Zero-skip suites | Verify |
| Shell lane | Inventory, 003 exclusion | Guarded errexit, PASS on `.opencode/bin` | Verify |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Pre-change capture of the nine injection cases** - 2-3 hours - CRITICAL
2. **Per-command tolerance inventory for the three scripts** - 2-3 hours - CRITICAL
3. **Guarded errexit adoption, script by script** - 5-8 hours - CRITICAL

**Total Critical Path**: 9-14 hours

**Parallel Opportunities**:
- The portability and false-green lanes are fully independent of the shell lane and of each other.
- The no-box flowchart fixture can be written while the tolerance inventory is being built.
- This entire child runs in parallel with child 001.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Pre-change specification captured | All nine injection cases recorded with exit code and tree state | End of Phase 1 |
| M2 | Portability proven | Every repaired helper identical from a worktree and a symlinked path | Mid Phase 2 |
| M3 | Green means it ran | Zero skips across the repaired Python test and both MCP suites | Mid Phase 2 |
| M4 | Errexit adopted without semantic change | All nine injection cases match the captured specification; `.opencode/bin` PASS/0 errors | End of Phase 2 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Errexit is adopted command by command, never as a flag flip

**Status**: Proposed

**Context**: Three `.opencode/bin` git-coordination scripts run `set -uo pipefail` deliberately because they tolerate expected non-zero exits from probe commands. The verifier reports this as 3 `SH-STRICT-MODE` errors, and the naive fix — adding `-e` — will abort a rebase mid-flight.

**Decision**: Build a per-command tolerance inventory first; convert each tolerated non-zero exit into an explicit guarded conditional; only then add `-e`. Verify with nine failure-injection cases asserting **unchanged** exit semantics.

**Consequences**:
- The scripts become conformant without a behaviour change, and the tolerance that was implicit becomes documented in the code.
- The lane is slow relative to its line count, and it is the highest-risk work in the whole program.

**Alternatives Rejected**:
- *Blanket `set -e`*: not behaviour-preserving; the archetype of a conformance fix that breaks production.
- *Document the omission as an accepted exception*: leaves a real hard-blocker unaddressed and keeps the verifier permanently red on this root.

### ADR-002: A skip is a failure for this child

**Status**: Proposed

**Context**: Two MCP suites skip when a hardcoded absolute packet path is absent, reporting green for coverage that never ran. Repairing them will surface work that was always missing.

**Decision**: For the duration of this child, a skipped case counts as a failure. Coverage either runs or fails loudly with a message naming the expected path.

**Consequences**:
- Green becomes meaningful on these suites.
- The repair may surface a body of genuinely failing coverage that must be triaged rather than re-muted, and that triage may exceed this child's scope — in which case it is escalated, not silenced.

**Alternatives Rejected**:
- *Keep the skip but log it*: a logged skip is still green on a dashboard, which is the defect.
- *Delete the suites*: removes the false green by removing the coverage, which is worse.
