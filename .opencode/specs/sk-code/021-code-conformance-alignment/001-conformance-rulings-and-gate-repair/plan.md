---
title: "Implementation Plan: Conformance Rulings and Gate Repair"
description: "Repair the enforcement mechanism for the sk-code code-opencode standard before any code batch runs: reconcile the duplicated hook pairs to one installed path each, correct the standard's pointers, decide the three-guard scan root and the exact-header automation status, close three comment-checker vocabulary holes behind paired fixtures, amend the test-filename vocabulary, and capture the program baseline every later child reports its delta against."
trigger_phrases:
  - "gate repair plan"
  - "comment checker vocabulary holes"
  - "drift verifier baseline capture"
  - "test discovery contract"
importance_tier: "high"
contextType: "planning"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/001-conformance-rulings-and-gate-repair"
    last_updated_at: "2026-07-31T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Executed the gate-repair plan through evidence capture and documented the remaining blockers"
    next_safe_action: "Verifier to exercise the live Write smoke and review the repo-wide baseline"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Conformance Rulings and Gate Repair

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
| **Language/Stack** | Bash 3.2+ (hooks, checker, guard wrapper), Node 20 CJS/ESM (post-edit adapter, test runner), Python 3.11 (alignment verifier), Markdown (standard references) |
| **Framework** | None. Hook adapters are plain scripts; the verifier is stdlib-only argparse |
| **Storage** | None. All gates are stateless and offline |
| **Testing** | `check-comment-hygiene.test.sh` (shell), `run-node-tests.mjs` (`node --test`), Vitest for package suites, `verify_alignment_drift.py` as the machine gate |

### Overview

Three edits make the gate real — one installed hook path per lifecycle event, a scan root that matches its stated contract, and a checker vocabulary that covers the forms actually in the tree. Everything else in this phase is evidence work: fixtures that prove each new rule, a canary that proves the runner sees what a glob sees, and a captured baseline that turns every later child's `PASS` into a delta. The standard amendment is a documentation change with a machine test attached: no listed pattern may match zero files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] **[OPERATOR-DECISION: Q4 — exact-header automated check]** resolved, or the phase explicitly proceeds with header shape left manual and records why
- [ ] **[OPERATOR-DECISION: Q5 — three-guard scan scope]** resolved
- [ ] **[OPERATOR-DECISION: Q2 — the non-runtime deep-loop border]** resolved so the 020 amendment can be written

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
- [ ] Each new checker rule has a recorded pre-change failing fixture run
- [ ] The program baseline is captured verbatim and referenced by name
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Read the child contract and every target file before editing.
- Keep edits inside the named sk-code, shared-runner, checker-fixture, and child-document scope.
- Capture command output, direct exit codes, and SHA-256 digests for load-bearing claims.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope lock | Do not modify files outside the child contract; do not make git mutations. |
| Comment hygiene | Durable WHY only in code comments; no packet, task, finding, or spec identifiers. |
| Gate honesty | Record failing gates and environment blockers; do not convert them to passes. |
| Documentation | Keep the child In Progress until the live smoke and orchestrator review are complete. |

### Status Reporting Format

```text
Phase 001 status: [in-progress|blocked|verified]
Changed files: [scoped paths]
Gates: [command + verdict + direct rc + SHA]
Next safe action: [one task id or verifier action]
```

### Blocked Task Protocol

When a required gate fails or a required tool is unavailable, preserve the full output, record the direct rc, leave the task open when success was not evidenced, and report the exact blocker to the verifier.

<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Gate-first remediation. The enforcement surface is repaired and baselined before any population is touched, so that every later change is measured rather than asserted.

### Key Components

- **Post-edit adapter** (`.opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs`): invoked by `.claude/settings.json:175` on every `Write|Edit`; shells out to the shared comment-hygiene checker for the edited file.
- **Pre-commit hook** (`.opencode/scripts/git-hooks/pre-commit`, installed via `.git/hooks/pre-commit` symlink): runs the same checker against the staged code file set and blocks the commit.
- **Shared checker** (`check-comment-hygiene.sh`): the single rule engine both hooks call. Its vocabulary is the thing with holes.
- **Alignment verifier** (`verify_alignment_drift.py`): the machine gate. Flags: `--root` (repeatable), `--fail-on-warn`, `--check-router`. It checks strict mode, shebangs and language integrity — **not** header shape.
- **Three-guard wrapper** (`run-all-drift-guards.sh`): the mandated completion entry point. Runs the alignment verifier, the stack-folder verifier, and the router-sync suite.
- **Node test runner** (`run-node-tests.mjs`): discovers `*.test.mjs` under a fixed `ROOTS` list that omits `.opencode/hooks`.
- **The standard** (`references/shared/**`): the authority the verifier only partially automates.

### Data Flow

A Write/Edit fires the post-edit adapter, which calls the shared checker on one file. A commit fires the pre-commit hook, which calls the same checker on the staged set. A completion claim fires the three-guard wrapper, which calls the verifier over its scan root. Each of the three paths was blind in a different way; repairing them is repairing three call sites of one rule engine plus one scan root.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-comment-hygiene.sh` | Sole rule engine for the hard-block comment gate | update — three new rules | `check-comment-hygiene.test.sh` with paired fixtures per rule |
| `.opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs` | Wired post-edit adapter (per `.claude/settings.json:175`) | update — parse-integrity regression fixture | `node --check`; live Write-tool smoke on a violating scratch file |
| `.opencode/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.sh` | Second, unwired post-edit adapter | retire or document as non-installed | `grep -rn "claude-posttooluse" .claude .opencode --include=*.json --include=*.sh` shows one wired path |
| `.opencode/scripts/git-hooks/pre-commit` | Installed pre-commit (symlink target of `.git/hooks/pre-commit`) | update — absorb any unique rule from the other file | `ls -la .git/hooks/pre-commit`; rule-by-rule diff recorded |
| `.opencode/hooks/git/pre-commit` | Second, uninstalled pre-commit | retire or document as non-installed | Same diff evidence |
| `naming-and-commenting.md:243-244` | Names the enforcing hooks | update — point at the installed paths | Every path named in the doc exists and is installed |
| `directory-and-test-conventions.md:292-295` | Documents test filename vocabulary | update — adopt the real convention | No listed pattern globs to zero at HEAD |
| `run-node-tests.mjs` | Canonical Node test discovery | update — add `.opencode/hooks`, recognise `.test.cjs` | Discovery canary compares runner count to an independent glob |
| `run-all-drift-guards.sh:23,47` | Mandated completion gate, scan root `.opencode/skills/sk-code` | update per Q5 | Wrapper run with output captured as the program baseline |
| `verify_alignment_drift.py` | Machine gate; no header-shape check | update per Q4 (opt-in flag) or unchanged | Flag run against a known header-less file reports it; against an exception-class file, skips with a reason |
| Vitest configs (`mcp-server/vitest.config.ts:18-21`, `runtime/vitest.config.ts:17`) | Already discover `{vitest,test}.ts` | not a consumer of this change — read only, cited as evidence for the amendment | Re-read at T001 |
| `020-sk-code-opencode-alignment/spec.md` | Sibling program's scope authority | update — border amendment | The spec states the resolved scope and cross-reference |

Required inventories:
- Same-class producers: `rg -n 'check-comment-hygiene' .opencode --glob '!node_modules'` — every caller of the rule engine.
- Consumers of changed symbols: `rg -n 'run-all-drift-guards|verify_alignment_drift|run-node-tests' . --glob '*.md' --glob '*.sh' --glob '*.json' --glob '*.yml'` — every doc, gate and CI job that names a changed entry point.
- Matrix axes: {runtime: Claude, Codex, OpenCode} × {lifecycle: post-edit, pre-commit, completion-claim}. Every cell must have exactly one installed path or an explicit "not wired on this runtime".
- Algorithm invariant for the generic-label matcher: *a label is forbidden when it identifies an external artifact, permitted when it names a durable concept.* Adversarial cases: a durable protocol name containing a numeral; a packet directory name with no numeric prefix; a label inside a string literal rather than a comment; a label inside a URL.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm every finding and every cited line against HEAD; strike non-reproducing findings with evidence
- [ ] Re-freeze the directory manifest three children's work lists derive from
- [ ] Capture the pre-change drift-verifier output for every lane root as the program baseline
- [ ] Resolve or escalate the operator decisions this phase depends on

### Phase 2: Core Implementation
- [ ] Reconcile the hook pairs and correct the standard's enforcement pointers
- [ ] Add the parse-integrity regression fixture for the post-edit adapter
- [ ] Close the three comment-checker vocabulary holes, fixture-first
- [ ] Amend the test-filename vocabulary and unify the discovery contract; add the discovery canary
- [ ] Apply the Q5 scan-root change and, if adopted, the Q4 exact-header flag
- [ ] Write the six rulings, the two-lane doctrine and the generic-label boundary into `decision-record.md`
- [ ] Apply the 020 border amendment

### Phase 3: Verification
- [ ] Manual testing complete — the live Write-tool smoke blocks a violating scratch file
- [ ] Edge cases handled — negative fixtures green, exception-class files skipped with reasons
- [ ] Documentation updated — spec, plan, tasks, checklist and decision record reconciled
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each new comment-checker rule, positive and negative | `check-comment-hygiene.test.sh` |
| Integration | Post-edit adapter parses and invokes the checker end to end | `node --check`, plus a Write-tool smoke on a violating scratch file |
| Integration | Test discovery agrees with an independent glob | Discovery canary under `run-node-tests.mjs` |
| Integration | Three-guard wrapper runs to completion at its new scan root | `bash .opencode/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` |
| Contract | No documented test-filename pattern matches zero files | A scripted assertion over the amended table |
| Manual | Rule-by-rule diff of the two pre-commit files before either is retired | `diff` plus a recorded rule inventory |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator decision Q4 | Internal | Red | The exact-header flag cannot be designed; 003's gate falls back to a scripted per-file header assertion outside the verifier |
| Operator decision Q5 | Internal | Red | The scan-root change cannot land; the wrapper stays near-vacuous and later children's deltas must be captured per-root by hand |
| Operator decision Q2 | Internal | Yellow | The 020 amendment cannot be written; 002 and 003 work lists stay provisional at the deep-loop border |
| Existing hotfix `a83080a83b` | Internal | Green | Already landed; this phase must not re-apply it, only fixture the failure mode |
| `verify_alignment_drift.py` flag surface | Internal | Green | Confirmed at HEAD: `--root` (repeatable), `--fail-on-warn`, `--check-router` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The widened drift gate blocks unrelated completion claims; a new checker rule produces false positives on durable prose; the retained hook drops a rule the retired one carried.
- **Procedure**: Every change in this phase is a single-file revert. Restore `run-all-drift-guards.sh:47` to `--root "${SK_CODE_DIR}"` to re-narrow the gate; `git revert` the checker commit to withdraw a rule; restore the retired hook file from git history and re-point `.git/hooks/pre-commit`. No data migration and no generated artifact is involved, so rollback is complete at the file level.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm + baseline) ──┐
                               ├──► Phase 2 (Repair + amend) ──► Phase 3 (Verify)
Operator decisions Q2/Q4/Q5 ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm + baseline | None | Repair, Amend |
| Operator decisions | None | Repair (scan root, header flag), 020 amendment |
| Repair + amend | Confirm, Decisions | Verify |
| Verify | Repair | Children 002, 003, 005 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm + baseline | Med | 2-3 hours |
| Repair + amend | High | 6-10 hours |
| Verify | Med | 2-3 hours |
| **Total** | | **10-16 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) — N/A, no data changes; the pre-change baseline output is the artifact worth preserving
- [ ] Feature flag configured — the exact-header check ships opt-in, which is the flag
- [ ] Monitoring alerts set — N/A; the gate's own output is the signal

### Rollback Procedure
1. Re-narrow the completion gate: restore `--root "${SK_CODE_DIR}"` in `run-all-drift-guards.sh`.
2. Revert the checker rule commit and re-run `check-comment-hygiene.test.sh` to confirm the suite is green at the prior rule set.
3. Restore any retired hook file from git history and re-point the installed path.
4. Confirm the post-edit smoke still blocks a violating scratch file — rollback must not re-break the gate.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Confirm HEAD    │────►│  Hook reconcile  │────►│  Live smoke      │
│  + baseline      │     │  + pointer fix   │     │  + canary        │
└────────┬─────────┘     └────────┬─────────┘     └──────────────────┘
         │                        │
         │               ┌────────▼─────────┐
         │               │ Checker rules    │
         │               │ (fixture-first)  │
         │               └──────────────────┘
         │
   ┌─────▼──────────┐    ┌──────────────────┐
   │ Standard       │───►│ Discovery        │
   │ amendment      │    │ contract + canary│
   └────────────────┘    └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Confirm + baseline | None | Struck-finding list, program baseline | All repair work |
| Hook reconciliation | Confirm | One installed path per lifecycle event | Pointer fix, live smoke |
| Checker rules | Confirm, generic-label boundary | Three closed vocabulary holes | Child 002 |
| Standard amendment | Confirm | Real test vocabulary | Discovery contract |
| Discovery contract | Amendment | Canonical runner behaviour + canary | Nothing downstream in this phase |
| Scan-root change | Q5 | A gate that sees the repo | Children 003, 004 delta claims |
| Exact-header flag | Q4 | A self-gating header check | Child 003's gate design |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Confirm findings against HEAD + capture baseline** - 2-3 hours - CRITICAL
2. **Hook reconciliation and enforcement-pointer correction** - 3-4 hours - CRITICAL
3. **Live post-edit smoke proving the gate blocks** - 1 hour - CRITICAL

**Total Critical Path**: 6-8 hours

**Parallel Opportunities**:
- The standard amendment and the checker-rule work are independent and can run simultaneously.
- The 020 border amendment is independent of everything except its operator decision.
- Child 004 runs entirely in parallel with this phase.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline frozen | Per-root verifier output recorded verbatim; packet-scoped tree clean at capture time | End of Phase 1 |
| M2 | Gate demonstrably live | A violating scratch file is blocked by the post-edit gate | Mid Phase 2 |
| M3 | Rulings binding | Decision record carries all six rulings, the two-lane doctrine, and the generic-label boundary | End of Phase 2 |
| M4 | Children unblocked | 002, 003 and 005 have the gates, baselines and rulings they depend on | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Repair the gate before sweeping the population

**Status**: Proposed

**Context**: 79 nonconformance findings exist because three enforcement mechanisms were blind. Sweeping first would produce a large diff whose conformance claim rests on the same broken gate that let the drift in.

**Decision**: No code batch runs until the gate parses, the completion wrapper's scan root is a recorded decision, and a per-root baseline is captured.

**Consequences**:
- Later children can claim "N warnings closed, zero new" against a real number instead of a bare `PASS`.
- The program's start is delayed by the length of this phase, and two operator decisions sit on the critical path.

**Alternatives Rejected**:
- *Sweep first, repair later*: the sweep would be unverifiable and would re-drift behind the same blind gate.
- *Repair only the parse failure*: leaves the scan-root and manual-header blindness intact, which are the structural causes.

### ADR-002: Amend the standard rather than migrate 1,228 files

**Status**: Proposed

**Context**: The documented test vocabulary names `*.test.js` (0 files at HEAD) and omits `*.vitest.ts` (1,228 files). The Vitest configs and the alignment verifier already recognise the real convention.

**Decision**: Amend the documented table to the repository's real vocabulary with explicit discovery contracts. No filename migration.

**Consequences**:
- The standard becomes checkable: no listed pattern may glob to zero.
- One documented rule changes, which means anything that quoted the old table needs a consumer sweep.

**Alternatives Rejected**:
- *Rename 1,228 files*: enormous blast radius to satisfy a document that describes 43 files, argued against independently by four research iterations.
- *Leave both*: keeps a false-green contract in which the documented convention and the discovered convention disagree.

### ADR-003: Widen the completion gate with warnings non-blocking

**Status**: Proposed — **[OPERATOR-DECISION: Q5 — three-guard scan scope]**

**Context**: The wrapper scans one skill tree, so the mandated completion gate has been near-vacuous. Widening it immediately surfaces the entire backlog on every completion claim until children 003 and 004 land.

**Decision**: Widen the scan root now, run without `--fail-on-warn` until the sweep completes, then promote warnings to blocking.

**Consequences**:
- The gate starts telling the truth immediately, without blocking unrelated work.
- There is a window in which the gate reports a large known backlog, which reviewers must be told to expect.

**Alternatives Rejected**:
- *Widen and accept blocking noise*: disruptive to every unrelated completion claim for the duration of the program.
- *Keep narrow, add a separate CI job*: leaves the mandated gate itself misleading, which is the defect.
