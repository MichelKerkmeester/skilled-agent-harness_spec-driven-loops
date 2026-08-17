---
title: "Implementation Plan: Bind Promotion, Rollback and Council Persistence to Authenticated Receipts and Authorized Roots"
description: "Introduce an authenticated append-only acceptance receipt binding evidence digests, paths, target preimage, candidate snapshot, evaluator epoch and approval identity; contain every write boundary rather than only the target; make numeric and parse gates fail closed; and confine council persistence to an authorized root."
trigger_phrases:
  - "improvement promotion authority"
  - "promotion acceptance receipt binding"
  - "council persistence packet root"
  - "stale score authorizes promotion"
  - "deep loop 029 promotion"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/007-improvement-promotion-authority"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Completed phases 2 through 5 and accepted the three implementation ADRs"
    next_safe_action: "Independent verification, commit, main validation"
    blockers:
      - "No independent verifier in this single-actor session"
      - "Sandbox cannot write the shared git index"
      - "Strict validator command-tree environment is incomplete in this worktree"
    key_files:
      - "plan.md"
    completion_pct: 88
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

# Implementation Plan: Bind Promotion, Rollback and Council Persistence to Authenticated Receipts and Authorized Roots

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS scripts (`deep-improvement/scripts`, `deep-ai-council/scripts`, `deep-alignment/scripts`) plus YAML command assets |
| **Framework** | vitest via `deep-improvement/scripts/vitest.config.mjs` and `deep-ai-council/vitest.config.mjs` |
| **Storage** | Acceptance JSON, candidate snapshots, archives, event logs, council packet artifacts |
| **Testing** | vitest (two projects), fixture target trees |

### Overview
Design the acceptance receipt before touching promotion, because everything else binds to it. Capture baselines for both vitest projects first, since a red baseline is known to be possible in this area. Then bind promotion, ship and rollback to the receipt, replace candidate-controlled evaluator identity, contain every write boundary, and confine council persistence.

**Current state (2026-08-15)**: Phases 2-5 are implemented and their affected suites are green. Phase 6 remains partial because the original full improvement-project baseline was not captured, an independent actor has not verified the result, the sandbox cannot create an immutable candidate commit, and strict validation must be repeated from a complete main checkout.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `021`'s hashed-child-manifest boundary has landed, so this child can be scaffolded without widening the parent recursive glob
- [ ] Baselines captured for both the improvement and council vitest projects
- [x] The receipt contents fixed in ADR-001
- [x] The evaluator identity authority chosen

### Definition of Done
- [x] Promotion, ship and rollback bound to the receipt
- [x] Every write boundary contained; council persistence confined to an authorized root
- [x] Non-finite and absent numerics fail closed
- [ ] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass complete
- [ ] `validate.sh --strict` exits 0 for this child
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Authenticated append-only receipt plus containment at every write boundary

### Key Components
- **Acceptance receipt**: An authenticated append-only record binding evidence digests, paths, target preimage, candidate snapshot, evaluator epoch and approval identity
- **Receipt-bound promotion**: Promotion, ship and rollback verify against the receipt rather than against mutable local JSON
- **Authority-supplied evaluator identity**: Evaluator profile and `agentName` from a source the candidate cannot edit
- **Full write containment**: Candidate, archive, acceptance, event log and state paths all contained, not only the target
- **Authorized packet root**: Council persistence confined to a root the caller cannot redirect, with topic IDs validated before any `mkdir`

### Data Flow
Scoring emits evidence -> an operator-authorized issuer creates an authenticated approval receipt with exclusive creation -> promotion verifies candidate, target and input hash -> acceptance creates an authenticated receipt binding the snapshot and preimage -> contained ship copies the snapshot -> rollback verifies the accepted-candidate and backup bindings. Council persistence resolves a configured authorized root, validates the topic ID, and only then creates directories.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This child plans from a deep-review CONDITIONAL verdict, so the fix addendum applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `promote-candidate.cjs` | Trusts score status and thresholds; contains only the target | update | Stale, cross-candidate and cross-target rejection tests; per-boundary containment tests |
| `shared/rollback-candidate.cjs` | Accepts either hash | update | Forged-pair rejection test |
| `agent-improvement/score-candidate.cjs` | Derives evaluator identity from candidate frontmatter | update | Candidate-chosen evaluator ignored |
| `agent-improvement/rollback-candidate.cjs` | Copies any readable file under allowed roots | update | Pre-promotion hash required |
| `model-benchmark/sweep-benchmark.cjs` | Scores raw event JSON when text is absent | update | Unscorable result test |
| `deep-ai-council/scripts/lib/persist-artifacts.cjs` | Resolves the packet root from a caller argument | update | External-root rejection; confined payload output |
| `orchestrate-{topic,session}.cjs` | Inserts topic IDs into paths after a trim check | update | `../` topic ID rejected before `mkdir` |
| `remediate-hook.cjs` | Parses `--confirm` and ignores it | update | Authorization required at both boundaries |
| `deep-model-benchmark-auto.yaml` | Declares `approvals: none` and invokes `--approve` | update | Advisory-only or receipt-bound |

Required inventories (run before implementation, record the output):
- Score-check sites: `rg -n "score\.(candidate|target|inputHash)|thresholds" .opencode/skills/system-deep-loop/deep-improvement/scripts`.
- Write boundaries: `rg -n "writeFileSync|copyFileSync|mkdirSync" .opencode/skills/system-deep-loop/deep-improvement/scripts/shared`.
- Path construction from caller input: `rg -n "path.join\(.*(topicId|root|argv)" .opencode/skills/system-deep-loop/deep-ai-council/scripts`.
- Non-finite comparisons: `rg -n "Number\([a-zA-Z.]+ \|\| 0\)" .opencode/skills/system-deep-loop/deep-improvement/scripts`.

**Algorithm invariant.** A promotion, ship or rollback is authorized only by an authenticated receipt that binds this candidate to this target with this evidence, and no write may land outside its authorized root. Adversarial cases: a stale score from an earlier revision; a score for another candidate or target; a hand-edited acceptance JSON with matching hashes; a forged rollback hash pair; candidate frontmatter naming its own evaluator; `--approve` with no operator receipt; a `../` topic ID; a caller-supplied external packet root; a `NaN` score.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm, baseline and design
- [x] T001 classification of all 13 findings at HEAD
- [ ] Capture baselines for both the improvement and council vitest projects
- [x] Fix the receipt contents in ADR-001
- [x] Choose the evaluator identity authority

### Phase 2: Acceptance receipt
- [x] Implement the authenticated append-only acceptance receipt
- [x] Bind promotion to candidate, target and input hash
- [x] Bind ship verification to the receipt rather than the mutable acceptance JSON

### Phase 3: Rollback and evaluator identity
- [x] Rollback accepts only the recorded promoted-candidate hash
- [x] Direct rollback records a pre-promotion hash
- [x] Evaluator identity from the chosen authority; the candidate cannot select it

### Phase 4: Containment and approval
- [x] Contain candidate, archive, acceptance, event log and state write boundaries
- [x] Autonomous mode advisory-only or receipt-bound; flag presence is not approval
- [x] REMEDIATE authorization at both the CLI and module boundary

### Phase 5: Council persistence and parse gates
- [x] Authorized packet root; topic IDs validated before any `mkdir`
- [x] Confine `--memory-save-payload-out`
- [x] Non-finite and absent numerics fail closed
- [x] A text-less event stream is unscorable

### Phase 6: Delta and gate
- [ ] Re-run both vitest projects; report deltas against the captured baselines
- [ ] Independent adversarial verification pass
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Negative | Stale, cross-candidate and cross-target score receipts | vitest (improvement project) |
| Negative | Forged acceptance JSON; forged rollback hash pair | vitest (improvement project) |
| Negative | Candidate-chosen evaluator identity; `--approve` without an operator receipt | vitest (improvement project) |
| Containment | One test per write boundary, against a fixture target tree | vitest (improvement project) |
| Path safety | `../` topic ID; external packet root; payload-out escape | vitest (council project) |
| Fail-closed | `NaN`, `Infinity`, absent numerics; text-less event stream | vitest (improvement project) |
| Regression | Both projects as deltas against their captured baselines | vitest |

### Named verification commands

- `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs`
- `npx vitest run --config .opencode/skills/system-deep-loop/deep-ai-council/vitest.config.mjs`
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/007-improvement-promotion-authority --strict`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `021` honest baselines | Internal | Red (not started) | Evidence issued against dishonest counts |
| Improvement vitest project | Internal | Green (config confirmed present) | No baseline possible |
| Council vitest project | Internal | Green (config confirmed present) | No baseline possible |
| Operator answer on the approval model | External | Yellow | REQ-005 defaults to advisory-only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A legitimate promotion is blocked by the receipt binding, or the containment change breaks a lane that legitimately writes outside the previously contained boundary.
- **Procedure**: Receipt binding, containment, evaluator identity and council persistence are separate commits. Revert the one that blocked the legitimate operation and re-run its tests. Reverting the receipt binding re-opens the promotion findings, which must be recorded.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm + baseline + design)
        │
        ▼
Phase 2 (Acceptance receipt) ──► Phase 3 (Rollback + evaluator identity)
        │                                    │
        ▼                                    ▼
Phase 4 (Containment + approval) ──► Phase 5 (Council + parse gates)
                                             │
                                             ▼
                                    Phase 6 (Delta + gate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Confirm + baseline + design | `021` | 2 |
| 2 Acceptance receipt | 1 | 3, 4 |
| 3 Rollback + evaluator identity | 2 | 6 |
| 4 Containment + approval | 2 | 5 |
| 5 Council + parse gates | 4 | 6 |
| 6 Delta + gate | 3, 5 | `014` improvement lanes |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm + baseline + design | High | 8-12 hours |
| Acceptance receipt | High | 16-24 hours |
| Rollback + evaluator identity | High | 10-16 hours |
| Containment + approval | High | 12-18 hours |
| Council + parse gates | Medium | 10-16 hours |
| Delta + gate | Medium | 5-8 hours |
| **Total** |  | **61-94 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [ ] Baseline captured for every runner this child touches, at a named SHA
- [x] Work runs in an isolated git worktree (a concurrent session moved the review target mid-run)
- [ ] Both vitest project baselines captured before any change
- [x] Fixture target trees in place, so no test writes to a real canonical target
- [x] The receipt contents fixed in ADR-001 before implementation

### Rollback Procedure
1. Identify which commit blocked the legitimate operation.
2. Revert that commit; the others stand.
3. Re-run that mechanism's tests.
4. Record which findings re-open.

### Data Reversal
- **Has data migrations?** No — but the acceptance receipt is a new append-only artifact alongside existing acceptance JSON.
- **Reversal procedure**: The receipt is additive. Existing acceptance JSON is not rewritten, so reverting leaves it intact.
<!-- /ANCHOR:l2-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐
│ Receipt design       │
└──────────┬───────────┘
           ▼
┌──────────────────────┐   ┌──────────────────────┐
│ Receipt-bound promote│──►│ Rollback + evaluator │
└──────────┬───────────┘   └──────────────────────┘
           ▼
┌──────────────────────┐   ┌──────────────────────┐
│ Full containment     │──►│ Council + parse gates│
└──────────────────────┘   └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Receipt design | `021` | Fixed receipt contents | Promotion, ship, rollback |
| Receipt-bound promotion | Receipt design | Candidate/target/inputHash-checked promotion | Rollback, containment |
| Rollback + evaluator identity | Receipt-bound promotion | Hash-bound rollback; authority-supplied evaluator | Delta gate |
| Full containment | Receipt-bound promotion | Every write boundary contained | Council + parse gates |
| Council + parse gates | Full containment | Authorized roots; fail-closed numerics | Delta gate |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Fix the receipt contents and capture both baselines** - 8-12 hours - CRITICAL
2. **Implement the authenticated append-only receipt and bind promotion** - 16-24 hours - CRITICAL
3. **Contain every write boundary** - 12-18 hours - CRITICAL
4. **Confine council persistence and close the parse gates** - 10-16 hours - CRITICAL

**Parallel Opportunities**:
- Council persistence (`F-019-*`) is independent of the promotion work and can run in parallel.
- The parse and numeric gates (`F-008-01`, `F-008-02`) are independent of the receipt.
- This child is independent of the ledger children and can run alongside W2.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baselines and design | Both project baselines captured; receipt contents fixed | End of Phase 1 |
| M2 | Receipt binds promotion | Stale, cross-candidate and cross-target receipts rejected | End of Phase 2 |
| M3 | Rollback and identity bound | Only the recorded hash restores; candidate cannot pick its evaluator | End of Phase 3 |
| M4 | Containment and approval | Every write boundary contained; flag presence is not approval | End of Phase 4 |
| M5 | Council confined | `../` topic ID and external root rejected before `mkdir` | End of Phase 5 |
| M6 | Improvement lanes gated | Both project deltas clean; independent pass recorded | End of Phase 6 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | An authenticated append-only acceptance receipt binds every promotion | Accepted |
| ADR-002 | Evaluator identity comes from an authority the candidate does not control | Accepted |
| ADR-003 | Every write boundary is contained, and council persistence is confined to an authorized root | Accepted |

Full context, alternatives, and consequences: `decision-record.md`.
<!-- /ANCHOR:l3-adr-summary -->
