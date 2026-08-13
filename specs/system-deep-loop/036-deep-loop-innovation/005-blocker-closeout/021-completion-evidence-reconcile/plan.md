---
title: "Implementation Plan: Reconcile Migration-Program Completion Claims Against the Current Suites"
description: "Capture real suite baselines, reopen and re-evidence or strike each unreproducible completion claim, replace count-and-line-number citations with test-name + suite-digest + candidate-SHA citations, bound the review scope manifest and the recursive validation child glob, and discharge the 016 pre-cutover-artifact disposition."
trigger_phrases:
  - "completion evidence reconcile"
  - "blocker 4 evidence drift"
  - "migration program completion claims"
  - "recursive validation child manifest"
  - "deep loop 021 reconcile"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/021-completion-evidence-reconcile"
    last_updated_at: "2026-07-31T03:16:25Z"
    last_updated_by: "claude"
    recent_action: "Closed out 021: ADRs accepted, checklist reconciled, 016 fixed"
    next_safe_action: "None; monitor 031 Lane B for the alignment RED-anchor re-verify"
    blockers:
      - "OPERATOR-DECISION OD-1 gates REQ-007 only"
    key_files:
      - "plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

# Implementation Plan: Reconcile Migration-Program Completion Claims Against the Current Suites

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec documents, Bash (`validate.sh`), JSON (rollout config, graph metadata) |
| **Framework** | system-spec-kit validation + the four system-deep-loop test runners |
| **Storage** | Repository files only; no database, no migration |
| **Testing** | vitest (`runtime`, council, improvement), `node --test` (alignment, review scripts), `validate.sh --strict` |

### Overview
Capture real baselines from all four runners first, because every claim this child issues is a delta against them. Then enumerate the full reopen set, re-evidence or strike each item with the new citation format, and only then repair the two acceptance mechanisms. The manifest and validator work lands last so it validates the reconciled tree rather than the drifting one.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `021`'s hashed-child-manifest boundary has landed, so this child can be scaffolded without widening the parent recursive glob
- [ ] All four runner baselines captured at a named SHA, including the `F-ORC-01` RED alignment baseline
- [ ] T001 classification complete for all 9 scoped findings
- [ ] The full reopen set enumerated, including parent rollups that would be left contradicting a reopened child

### Definition of Done
- [ ] Every reopened item re-evidenced or struck, with test-name + digest + SHA citations
- [ ] Bounded child manifest in place and demonstrated to fail on an unlisted child
- [ ] 015 status honest; 016 disposition recorded
- [ ] Rollout validator rejecting incomplete `fix` entries
- [ ] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass complete
- [ ] `validate.sh --strict` exits 0 for this child
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Audit-and-boundary: reconcile the evidence, then fix the mechanism that let it drift

### Key Components
- **Baseline capture**: One recorded run per runner, at a named SHA, before any edit — the anchor every later delta is measured against
- **Reopen set**: The enumerated list of completion items whose evidence does not reproduce, with parent rollups included
- **Citation format**: test name + suite-content digest + candidate SHA, replacing counts and line anchors
- **Bounded child manifest**: A frozen, hashed list of the phase children that make up the parent acceptance set
- **Rollout validator**: A check that a `fix` promotion entry carries capture manifest, fallback hash, comparator runs, and baseline divergence

### Data Flow
Suite run -> discovered test names + content digest -> citation string embedded in the checklist item -> validated at gate time by re-running the named suite at the cited SHA. The child manifest flows the other way: parent manifest hash -> recursive validation acceptance set -> per-child strict validation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This child plans from a deep-review CONDITIONAL verdict, so the fix addendum applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `013/**/checklist.md` (4 files) | Carry the completion claims under audit | update | Re-run the cited suite; grep for bare run counts returns none |
| `013/**/implementation-summary.md` | Narrates completion state that must not contradict the checklist | update where contradicted | `F-025-03` contradiction resolved; summary and checklist agree |
| `015/{checklist.md,tasks.md,graph-metadata.json}` | Declares a status the evidence does not support | update | 0/29 checklist and `planned` metadata stated consistently |
| `016/goal-file-manifest.txt` | Defines the review acceptance corpus | update | Every entry tracked; frozen benchmark baseline present |
| `spec/validate.sh` | Recursive acceptance mechanism, shared repo-wide | update, opt-in | Whole-repo recursive run before/after reported as a delta; unlisted child fails |
| `shared/rollout/command-injection-rollout.json` + `promotion-rule.md` | Promotion evidence contract | update | Validator rejects a synthetic incomplete `fix` entry |
| Parent rollups (`013`, `036` phase map) | Aggregate completion state | update | No parent claims Complete over a reopened child |

Required inventories (run before implementation, record the output):
- Reopen set: `rg -n "^- \[x\]" .opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations --glob checklist.md` then filter to items whose evidence cites a count or a line number.
- Bare-count citations: `rg -n "[0-9]+/[0-9]+ (passing|tests|scenarios)" .opencode/specs/system-deep-loop/036-deep-loop-innovation`.
- Manifest tracked-ness: compare every `goal-file-manifest.txt` entry against `git ls-files`.
- Recursive-glob consumers: `rg -n "recursive" .opencode/skills/system-spec-kit/scripts/spec/validate.sh` and every caller of `validate.sh --recursive` in the repo.

**Algorithm invariant.** A completion claim is valid only if a second party, given the claim string alone, can check out the cited SHA, run the cited suite, find the cited test name, and observe the cited outcome. Adversarial cases: a renamed test, a deleted suite, a suite that is RED, a count inflated by duplicate test registration, and a line anchor that drifted.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm and baseline
- [ ] T001 classification of all 9 findings at HEAD
- [ ] Capture baselines from all four runners at a named SHA
- [ ] Record the `F-ORC-01` RED alignment baseline as a delta anchor and assign its 5 failures to `031`

### Phase 2: Enumerate the reopen set
- [ ] Enumerate every completion item citing an unreproducible count or line anchor
- [ ] Include the parent rollups that would be left contradicting a reopened child
- [ ] Freeze the reopen set before editing anything

### Phase 3: Re-evidence or strike
- [ ] Re-evidence each reopened item with test name + suite digest + candidate SHA, or strike it with a rationale
- [ ] Resolve the `F-025-03` checklist/summary contradiction
- [ ] Reconcile 015 status and its gating relationship to 016

### Phase 4: Repair the acceptance boundary
- [ ] Bound `goal-file-manifest.txt` to tracked in-scope files including the frozen benchmark baseline
- [ ] Add the hashed child-manifest boundary to recursive strict validation, opt-in per parent
- [ ] Add the rollout `fix`-entry validator and update `promotion-rule.md`

### Phase 5: Disposition and gate
- [ ] Record the OD-1 016 disposition once answered
- [ ] Record the `F-022-01` re-open trigger enforcement
- [ ] Re-run all four runners and the whole-repo recursive validation; report deltas
- [ ] Independent adversarial verification pass
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Baseline | All four runners, pre-edit, at a named SHA | vitest, `node --test` |
| Delta | All four runners, post-edit, same command set | vitest, `node --test` |
| Boundary | Recursive strict validation with and without an unlisted child | `validate.sh --recursive --strict` |
| Negative | A synthetic incomplete `fix` rollout entry must be rejected | The new rollout validator |
| Repo-wide regression | Recursive validation across every packet, before and after the `validate.sh` change | `validate.sh --recursive --strict` |

### Named verification commands

- `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck`
- `cd .opencode/skills/system-deep-loop/runtime && npm test`
- `node --test .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/*.test.cjs`
- `npx vitest run --config .opencode/skills/system-deep-loop/deep-ai-council/vitest.config.mjs`
- `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs`
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/021-completion-evidence-reconcile --strict`
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation --recursive --strict`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The four system-deep-loop test runners | Internal | Green (files confirmed present) | No baseline is possible; the child cannot start |
| `git ls-files` for manifest tracked-ness | Internal | Green | Manifest check must fail closed rather than pass |
| OPERATOR-DECISION OD-1 | External | Yellow (unanswered) | REQ-007 only; the rest of the child proceeds |
| `031` Lane B de-duplication | Internal | Red (not started) | Citations may need re-verification after `031` lands |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Whole-repo recursive validation regresses for packets outside 036, or a reopened item cannot be re-evidenced and its parent rollup cannot be reconciled in the same change.
- **Procedure**: Revert the `validate.sh` change first (it has the widest blast radius), leaving the documentation reconcile in place; the reconcile is honest even without the boundary. If the reconcile itself must revert, restore the four checklists and the 015 metadata from the pre-change SHA and re-record the reopen set as an open task.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm + baseline) ──► Phase 2 (Enumerate) ──► Phase 3 (Re-evidence)
                                                              │
                                                              ▼
                                             Phase 4 (Acceptance boundary)
                                                              │
                                                              ▼
                                             Phase 5 (Disposition + gate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Confirm + baseline | None | 2, 3, 4, 5 |
| 2 Enumerate | 1 | 3 |
| 3 Re-evidence | 2 | 4 |
| 4 Acceptance boundary | 3 | 5 |
| 5 Disposition + gate | 4 | Every other child in the tree |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm + baseline | Medium | 4-6 hours |
| Enumerate | Medium | 3-5 hours |
| Re-evidence | High | 8-14 hours |
| Acceptance boundary | High | 6-10 hours |
| Disposition + gate | Medium | 4-6 hours |
| **Total** |  | **25-41 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [ ] Baseline captured for every runner this child touches, at a named SHA
- [ ] Work runs in an isolated git worktree (a concurrent session moved the review target mid-run)
- [ ] Whole-repo recursive validation baseline captured before touching `validate.sh`
- [ ] Reopen set frozen and reviewed before any checklist edit

### Rollback Procedure
1. Revert the `validate.sh` boundary change and re-run whole-repo recursive validation to confirm the prior state returns.
2. If the documentation reconcile must also revert, restore the four `013` checklists, the `015` metadata, and `goal-file-manifest.txt` from the pre-change SHA.
3. Re-record the reopen set as an open task so the drift is not silently re-closed.
4. Notify the operator that Blocker 4 remains open and `014` stays blocked.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — all changes are repository files under version control.
<!-- /ANCHOR:l2-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐   ┌──────────────┐   ┌────────────────┐
│ Baselines (x4)   │──►│ Reopen set   │──►│ Re-evidence    │
└──────────────────┘   └──────────────┘   └───────┬────────┘
                                                  │
                        ┌─────────────────────────▼──────────────────────┐
                        │ Acceptance boundary (manifest + validate.sh)   │
                        └─────────────────────────┬──────────────────────┘
                                                  ▼
                                     ┌────────────────────────┐
                                     │ 022 023 024 ... 032    │
                                     └────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | Four recorded runner baselines + the RED alignment anchor | Reopen set, every later delta claim |
| Reopen set | Baseline capture | Frozen list of unreproducible claims | Re-evidence |
| Re-evidence | Reopen set | Reconciled checklists with drift-proof citations | Acceptance boundary |
| Acceptance boundary | Re-evidence | Bounded manifest + recursive gate + rollout validator | Scaffolding of children 022-032 |
| Disposition | OD-1 | 016 relocate-or-re-scope record | A future reader of 016 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Capture four runner baselines** - 4-6 hours - CRITICAL
2. **Enumerate and freeze the reopen set** - 3-5 hours - CRITICAL
3. **Re-evidence or strike every reopened item** - 8-14 hours - CRITICAL
4. **Land the bounded child manifest** - 6-10 hours - CRITICAL

**Parallel Opportunities**:
- The rollout validator (`F-035-01`) is independent of the checklist reconcile and can run alongside Phase 3.
- The `015` status reconcile (`F-029-02`) is independent of the `013` checklist work.
- Child `033`'s disposition record can be authored in parallel; it has no dependency on this child.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baselines captured | Four runner baselines recorded at a named SHA, including the RED alignment anchor | End of Phase 1 |
| M2 | Reopen set frozen | Every unreproducible claim enumerated, parents included | End of Phase 2 |
| M3 | Evidence reconciled | Zero bare-count or bare-line-number citations remain in the reopened set | End of Phase 3 |
| M4 | Boundary landed | Unlisted child makes the recursive gate fail; whole-repo delta clean | End of Phase 4 |
| M5 | Blocker 4 discharged | All 9 findings closed; independent verification pass recorded | End of Phase 5 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Completion evidence cites a test name, a suite-content digest, and a candidate SHA | Proposed |
| ADR-002 | Recursive strict validation accepts a bounded, hashed child manifest | Proposed |

Full context, alternatives, and consequences: `decision-record.md`.
<!-- /ANCHOR:l3-adr-summary -->
