---
title: "Implementation Plan: Batch the P2 Backlog and the Three Doc-Contract P1s"
description: "Lane A replaces duplicated facts with links to one source and adds a drift check that derives counts from the registry; Lane B applies four small code-hygiene fixes, adopting the shared strict validator `027` introduces rather than patching the legacy gates again."
trigger_phrases:
  - "docs drift p2 batch"
  - "registry roster drift readme"
  - "derive counts from registry"
  - "p2 backlog deep loop"
  - "deep loop 032 docs"
importance_tier: "normal"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/032-docs-drift-and-p2-batch"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the implementation plan from the WS1 phase-tree proposal"
    next_safe_action: "Run T001 and collapse the four merge groups before any edit"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

# Implementation Plan: Batch the P2 Backlog and the Three Doc-Contract P1s

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation, JSON registries and assets, TypeScript (`runtime/lib`), CommonJS scripts |
| **Framework** | vitest via `runtime/vitest.config.ts` for Lane B; a drift check and a link scan for Lane A |
| **Storage** | Documentation, registries, benchmark assets |
| **Testing** | vitest, tsc, the new drift check, a local-link scan |

### Overview
Collapse the four merge groups first so the same fix is not made twice. Then Lane A replaces duplicated facts with links and adds the registry-derived drift check that keeps them from separating again. Lane B applies four small code fixes, adopting `027`'s validator rather than patching the legacy gates locally.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `021`'s hashed-child-manifest boundary has landed, so this child can be scaffolded without widening the parent recursive glob
- [ ] `027` has landed and its shared validator is available
- [ ] `021`, `024`, `026`, `028`, `031` have landed on the shared files
- [ ] The four merge groups collapsed into single work units

### Definition of Done
- [ ] Every duplicated fact stated once and linked elsewhere
- [ ] Drift check fails on a deliberately mismatched roster
- [ ] Lane B adopts the shared validator; digests are locale-independent
- [ ] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass complete
- [ ] `validate.sh --strict` exits 0 for this child
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-source the facts, then check the derivation

### Key Components
- **Authoritative sources**: One document per fact; every other mention becomes a link
- **Registry-derived drift check**: Family, lane, adapter and scenario counts derived from the registry and playbook indices
- **Generated help text**: Help derived from the real command and leaf tables rather than retyped
- **Lane B hygiene**: Locale-independent digests, readonly wave collections, shared validator adoption, snapshot persistence

### Data Flow
Registry and playbook indices -> drift check -> pass or a named mismatch. Authoritative document -> links from every other mention. Command and leaf tables -> generated help text.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This child plans from a deep-review CONDITIONAL verdict, so the fix addendum applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Six READMEs plus one SKILL | Duplicate and stale roster facts | update to links plus one source | Drift check; link scan |
| `mode-registry.json` | The machine source of the rosters | read-only source | Drift check derives from it |
| `verify-iteration.cjs`, `render-command-contract.cjs` | Retyped help text | update to generated | Help output matches the real tables |
| `benchmark/reports/README.md` | Empty index beside existing folders | update plus drift check | Folder-versus-index check |
| `transition-policy-registry.ts` | Locale-dependent digest ordering; owned by `024` | update (Lane B), after `024` | Hostile-locale determinism test |
| `wave-plan.ts` | Mutable-array casts on frozen collections | update (Lane B) | Casts removed; type checks |
| `deep-research-rollback-gate/mode-gate.ts` | Legacy permissiveness; owned by `027` | update (Lane B) by adopting `027`'s validator | Unknown-key and malformed-row rejection |
| `deep-research-auto.yaml` | Convergence without snapshot persistence | update (Lane B) | Persisted snapshots and an accumulating baseline |

Required inventories (run before implementation, record the output):
- Duplicated roster facts: `rg -n "four (families|lanes)|five families|three lanes" .opencode/skills/system-deep-loop --glob "*.md"`.
- Broken local links: a link scan across the touched documents.
- Retyped help text: `rg -n "loop-type|COMMANDS" .opencode/skills/system-deep-loop/runtime/scripts/{verify-iteration,render-command-contract}.cjs`.
- Locale-dependent ordering: `rg -n "localeCompare" .opencode/skills/system-deep-loop/runtime/lib`.

**Algorithm invariant.** A fact that exists in a registry is derived rather than retyped, and a fact stated in more than one document is stated authoritatively in exactly one. Adversarial cases: a roster entry added to the registry with no document update; a report folder with no index entry; a host locale with different collation; an unknown top-level key in gate evidence.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm and collapse
- [ ] T001 classification of all 29 findings at HEAD
- [ ] Collapse the four merge groups into single work units
- [ ] Name the authoritative source for each duplicated fact

### Phase 2: Lane A, single-source the documentation
- [ ] Replace duplicated roster facts with links to one source
- [ ] Correct the claims that contradict implementation
- [ ] Backfill the benchmark report index
- [ ] Generate help text from the real tables

### Phase 3: Lane A, drift checks
- [ ] Derive family, lane, adapter and scenario counts from the registry and playbook indices
- [ ] Add the folder-versus-index check for the report index
- [ ] Run a local-link scan to zero

### Phase 4: Lane B, code hygiene
- [ ] Locale-independent policy digest ordering
- [ ] Readonly wave collections
- [ ] Adopt `027`'s shared strict validator in the legacy gates
- [ ] Persist convergence snapshots

### Phase 5: Delta and gate
- [ ] Re-run typecheck and tests; report the delta against the `021` baseline
- [ ] Verification pass; close the remediation tree
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Drift | Registry-derived counts versus documented rosters | New drift check |
| Links | Local-link scan across touched documents | Link scan |
| Help | Generated help matches the real command and leaf tables | Script run |
| Determinism | Policy digest under a hostile locale | vitest |
| Gate parity | Unknown keys and malformed rows rejected in the legacy gates | vitest |
| Regression | Whole `runtime` suite as a delta against the `021` baseline | vitest, tsc |

### Named verification commands

- `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck`
- `cd .opencode/skills/system-deep-loop/runtime && npm test`
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/032-docs-drift-and-p2-batch --strict`
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation --recursive --strict`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `027` shared strict validator | Internal | Red (not started) | REQ-008 becomes a local patch, which is the outcome this child avoids |
| `024` policy registry | Internal | Red (not started) | REQ-006 conflicts on the same file |
| `021` honest baselines | Internal | Red (not started) | Evidence issued against dishonest counts |
| `031` count reconciliation | Internal | Red (not started) | Runs last; the counts should be settled first |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The drift check produces false failures at a rate that blocks unrelated documentation work.
- **Procedure**: Lane A and Lane B are independent commit sets. Revert the drift check while keeping the single-sourcing, which is the durable half. Re-scope the derivation before re-landing.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm + collapse)
        │
        ├──► Phase 2 (Lane A docs) ──► Phase 3 (Lane A drift checks)
        │                                       │
        └──► Phase 4 (Lane B hygiene) ──────────┤
                                                ▼
                                       Phase 5 (Delta + gate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Confirm + collapse | `021`, `024`, `027`, `031` | 2, 4 |
| 2 Lane A docs | 1 | 3 |
| 3 Lane A drift checks | 2 | 5 |
| 4 Lane B hygiene | 1 | 5 |
| 5 Delta + gate | 3, 4 | Remediation tree closeout |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm + collapse | Medium | 5-8 hours |
| Lane A docs | Medium | 14-22 hours |
| Lane A drift checks | Medium | 8-14 hours |
| Lane B hygiene | Medium | 10-16 hours |
| Delta + gate | Low | 4-6 hours |
| **Total** |  | **41-66 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [ ] Baseline captured for every runner this child touches, at a named SHA
- [ ] Work runs in an isolated git worktree (a concurrent session moved the review target mid-run)
- [ ] Four merge groups collapsed into single work units
- [ ] Authoritative source named for each duplicated fact

### Rollback Procedure
1. Revert the drift-check commit while keeping the single-sourcing edits.
2. Re-scope the derivation.
3. Re-run the link scan to confirm the documentation state is unaffected.
4. Record that the drift-recurrence protection is deferred.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — documentation, assets and small code fixes only.
<!-- /ANCHOR:l2-rollback -->
