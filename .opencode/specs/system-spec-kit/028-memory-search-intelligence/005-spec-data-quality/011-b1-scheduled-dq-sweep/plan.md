---
title: "Implementation Plan: B1 Scheduled DQ Sweep [template:level_2/plan.md]"
description: "A thin fan-out entrypoint over the A1 detectors plus validate.sh --json runs the whole corpus on a timer and on demand. CI reports only. A guarded operator-local apply path applies safe-class fixes via the shipped backfill contract."
trigger_phrases:
  - "scheduled dq sweep"
  - "data quality sweep"
  - "github actions schedule"
  - "post-merge hook"
  - "guarded auto-fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/011-b1-scheduled-dq-sweep"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored plan for the scheduled DQ sweep build"
    next_safe_action: "Author tasks and checklist for the sweep build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: B1 Scheduled DQ Sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, run through the spec-kit script runner |
| **Framework** | None, a CLI fan-out caller plus a GitHub Actions workflow |
| **Storage** | None of its own, the sweep reads the spec corpus and never owns a store |
| **Testing** | vitest for the caller, a dirty scratch packet fixture for the CI and apply paths |

### Overview
The sweep is one new entrypoint at `scripts/sweep/dq-sweep.ts` that iterates the A1 detector set from the shared registry, runs each detector in report mode, and folds in `validate.sh --json` over the same corpus. A new `.github/workflows/dq-corpus-sweep.yml` runs it report-only on a `schedule:` cron and on `workflow_dispatch`. A guarded `--apply` mode runs operator-local only and applies only `safe` fixClass fixes through the shipped `backfill-frontmatter.ts` contract.
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
Thin fan-out caller over shipped machinery, no new engine and no new store.

### Key Components
- **dq-sweep.ts**: Iterates the A1 detector set from the shared registry, runs each detector in report mode, folds in `validate.sh --json` over the corpus, and in apply mode executes only `fix()` for detectors whose `fixClass` is `safe`.
- **dq-corpus-sweep.yml**: A report-only workflow with a `schedule:` cron plus `workflow_dispatch`, no commit step and no write credential.
- **post-merge hook**: An opt-in hook wired by the existing globbing installer with no installer change, firing the report-only sweep after a merge.

### Data Flow
The caller resolves a corpus subtree from the `--roots` contract, fans out the A1 detectors and `validate.sh --json` across each spec folder, and folds the findings into a report. In apply mode it routes only safe-class fixes through the `backfill-frontmatter.ts` dry-run and apply contract, which carries the idempotency and scoping.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| A1 detector registry (`detector-registry.ts`) | Owns the detector set and the frozen `fixClass` allow-list | Not a consumer, consumed verbatim | grep the registry import in `dq-sweep.ts` after build |
| `backfill-frontmatter.ts` | Owns the dry-run, apply, and `--roots` write contract | Not a consumer, reused verbatim for the apply path | grep the contract call sites at `backfill-frontmatter.ts:131-143,152-235,429` |
| `.github/workflows/*.yml` | Eight `pull_request`-only change-triggered gates | Unchanged, the sweep adds a parallel timing tier | grep `schedule:` and `cron:` across the workflow dir stays empty until the new file lands |
| Git hook installer | Globs hook files at install time | Unchanged, the opt-in hook registers without an installer edit | grep the installer glob, confirm no installer diff is needed |

Required inventories:
- Same-class producers: `rg -n 'fixClass|detector-registry' .opencode/skills/system-spec-kit/scripts`.
- Consumers of changed symbols: this sweep adds no new public symbol, it only consumes the engine and the backfill contract.
- Matrix axes: report mode versus apply mode, CI versus operator-local, and the three escape classes are the axes the verification fixtures must cover.
- Algorithm invariant: apply mutates only `safe` fixClass targets and a second apply on a fixed corpus is a no-op.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm 026-shared-safe-fix-engine has landed the engine, the registry, and the frozen `fixClass` allow-list
- [ ] Confirm the `backfill-frontmatter.ts` dry-run, apply, and `--roots` contract is callable
- [ ] Stand up a dirty scratch packet fixture with a mixed safe and risky defect set

### Phase 2: Core Implementation
- [ ] Build `dq-sweep.ts` as a fan-out caller over the A1 detectors plus `validate.sh --json`, report mode default
- [ ] Add the guarded `--apply` mode that routes only safe-class fixes through the backfill contract
- [ ] Add `.github/workflows/dq-corpus-sweep.yml` with `schedule:` plus `workflow_dispatch`, report-only and no commit step
- [ ] Register the opt-in `post-merge` hook through the existing globbing installer

### Phase 3: Verification
- [ ] Report run on a dirty scratch packet exits non-zero with findings and leaves the working tree clean
- [ ] Apply run on the mixed fixture mutates only safe-class targets, a second apply is an empty diff
- [ ] Edge cases handled (empty subtree, missing metadata file, malformed validate output, detector throw)
- [ ] Documentation updated (spec/plan/tasks/checklist)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The fan-out caller, the safe-class filter, the report fold | vitest |
| Integration | CI report path and operator-local apply path against a scratch fixture | dirty scratch packet, `validate.sh --json` |
| Manual | A manual `workflow_dispatch` run and a local `--apply` on a corrupted packet | GitHub Actions, local shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 026-shared-safe-fix-engine | Internal | Red | No engine, registry, or `fixClass` to call, the sweep cannot be built |
| `backfill-frontmatter.ts` contract | Internal | Green | The apply path has no write contract to reuse, it would add a parallel write path the scope forbids |
| `validate.sh --json` | Internal | Green | The sweep loses its cross-surface coherence signal |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The first scheduled run finds nothing the change-triggered tiers missed, or the apply path mutates a non-safe target.
- **Procedure**: Disable the `schedule:` trigger and run on demand only, or revert the new workflow and caller. The apply path is operator-local with no CI commit step, so no corpus rollback is needed for a CI run.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Fixture) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 026 engine, backfill contract | Core, Fixture |
| Fixture | Setup | Verify |
| Core | Setup | Verify |
| Verify | Core, Fixture | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 4-8 hours |
| Verification | Med | 2-4 hours |
| **Total** | | **7-14 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Scratch fixture backed up before any apply run
- [ ] `schedule:` cadence agreed before the workflow lands
- [ ] CI confirmed to carry no write credential and no commit step

### Rollback Procedure
1. Disable the `schedule:` trigger in the workflow and keep `workflow_dispatch` for on-demand runs
2. Revert the workflow and the caller via git if the tier is removed
3. Run a report-only smoke pass on a clean packet to confirm no residual mutation
4. No stakeholder notification needed, the tier is internal infra

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A for CI report runs. An operator-local apply is git-tracked and batched, revert via git if a fix is wrong.
<!-- /ANCHOR:enhanced-rollback -->
