---
title: "Implementation Plan: Deep-Loop Divergent Convergence Mode"
description: "Planning-only implementation sequence for an opt-in divergent convergence modifier across deep research and deep review. The design preserves mode-local legal-stop semantics, adds a transaction-safe three-seat native Council pivot, and validates all four workflows without changing hub routing identity."
trigger_phrases:
  - "divergent convergence implementation plan"
  - "deep research pivot plan"
  - "deep review scope expansion plan"
  - "divergent council adapter"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/055-deep-loop-divergent-mode"
    last_updated_at: "2026-07-10T09:43:07Z"
    last_updated_by: "opencode"
    recent_action: "Synthesized four context passes and a native three-seat AI Council into the implementation plan"
    next_safe_action: "Review and approve the plan before invoking /speckit:implement"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/055-deep-loop-divergent-mode/ai-council/council-report.md"
      - ".opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
      - ".opencode/commands/deep/assets/deep_review_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-055-deep-loop-divergent-mode"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use a mechanics-only pivot adapter instead of generic Council session orchestration"
      - "Require 3/3 parse-valid seat returns and two-of-three material agreement"
      - "Persist pivot Council artifacts under each loop artifact root"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deep-Loop Divergent Convergence Mode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, TypeScript, CommonJS, YAML workflow contracts, Markdown templates |
| **Framework** | `system-deep-loop` registry hub with command-owned loop workflows and reducer-owned state projections |
| **Storage** | Append-only JSONL, Markdown iteration artifacts, JSON registries/config, coverage-graph SQLite |
| **Testing** | Vitest, Node test scripts, command-contract drift checks, Spec Kit strict validation, manual playbooks |

### Overview

Implement `antiConvergence.convergenceMode: "divergent"` as an additive modifier for existing research and review workflows. Shared runtime code validates and reports the mode, each YAML retains authority over legal-stop eligibility, a new mechanics-only adapter runs one native three-seat Council pivot, and each mode's reducer projects the resulting append-only pivot events into its own strategy, dashboard, registry, prompt, and synthesis vocabulary.

The winning Council strategy scored 92/100 and resolved all architectural questions. It requires a strict return quorum of 3/3 parse-valid seats, normal two-of-three material agreement, deterministic pivot identity and resume, and pivot-scoped artifacts that cannot collide with ordinary packet planning Councils. See `ai-council/council-report.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem and scope are testable in `spec.md`.
- [x] Modifier-only architecture is confirmed; no registry or runtime loop identity change is allowed.
- [x] Four read-only context passes mapped architecture, analogous patterns, dependencies, and tests.
- [x] Native three-seat Council converged with 3/3 agreement and persisted complete artifacts.
- [x] Terminal boundaries, review verdict locks, state authority, and rollback are explicit.

### Definition of Done

- [ ] All four workflow variants implement equivalent divergent behavior while retaining mode-local gates.
- [ ] Existing `default`, `off`, and `sliding-window` decisions match pinned baseline fixtures.
- [ ] Pivot adapter passes strict quorum, recursion, cost, collision, crash/replay, and scope-boundary tests.
- [ ] Research and review reducers replay pivot events idempotently and render their mode-specific expansion maps.
- [ ] Canonical command contracts are regenerated and drift checks pass.
- [ ] Packet docs, packet references, feature catalogs, playbooks, and benchmarks are synchronized.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Additive policy modifier with mode-local legality and shared mechanics.

### Ownership Model

| Owner | Responsibility | Must Not Own |
|-------|----------------|--------------|
| Command presentations and parsers | Expose `--convergence-mode=<enum>` and persist canonical nested config | Convergence scoring or pivot selection |
| `convergence.cjs` | Validate/report the enum and compute unchanged graph convergence | Translate STOP into pivot or infer loop mode |
| Research/review YAML | Apply hard-stop precedence, legal-stop gates, and pivot eligibility | Persist derived strategy/dashboard state directly |
| Divergent pivot adapter | Run transaction-safe native three-seat deliberation and persist pivot-local evidence | Decide research/review eligibility or alter verdicts |
| Research/review reducers | Replay pivot events into mode-local registries, strategies, dashboards, and focus | Dispatch Council or rewrite historical JSONL |
| Synthesis workflows | Render Divergence Map or Dimension Expansion Map | Reclassify review verdicts or mutate implementation |

### Control Flow

```text
read state
  -> terminal-boundary check
  -> unchanged convergence computation
  -> unchanged mode-local legal-stop gates
       -> CONTINUE / STOP_BLOCKED / STUCK_RECOVERY: existing paths
       -> legal STOP + default/sliding-window: existing synthesis path
       -> legal STOP + divergent + eligible origin
            -> PIVOT_PENDING
            -> persist pivot_started
            -> run exactly three native Depth-1 seats
            -> require 3/3 parse-valid returns
            -> require two-of-three material agreement
            -> validate relevance, boundary, and dedup
            -> persist pivot_completed
            -> reducer restores selected focus
            -> next iteration
```

### Canonical Configuration

```json
{
  "antiConvergence": {
    "convergenceMode": "divergent",
    "divergent": {
      "maxPivots": 3,
      "maxCouncilSeatOutputs": 9,
      "minRemainingIterations": 1,
      "candidateSimilarityThreshold": 0.85
    }
  }
}
```

Exactly three seats and one in-CLI round are invariants, not operator knobs. Both command surfaces expose `--convergence-mode=default|off|sliding-window|divergent`; all four YAMLs extract the nested value and pass it explicitly to `convergence.cjs`.

### Pivot Transaction

`pivotId` is derived from immutable lineage and trigger data:

```text
pivot-<ordinal>-<sha256(sessionId|generation|loopType|sourceIteration|normalizedTrigger)[0:12]>
```

The ordinal is display-only. The identity hash makes interrupted resumes deterministic and prevents mutable counts from changing identity.

Event vocabulary:

```text
pivot_started
pivot_candidate_rejected
pivot_seat_returned (exactly three)
pivot_deliberation_completed
pivot_selected
pivot_completed
pivot_failed
```

State progression:

```text
LEGAL_STOP -> PIVOT_PENDING -> COUNCIL_RUNNING -> PIVOT_SELECTED
           -> PIVOT_COMPLETED -> CONTINUE
```

This is non-terminal lifecycle state. Do not add a new `stopReason`.

### Pivot Artifact Layout

```text
<artifactRoot>/divergent/pivots/<pivotId>/council/
  config.json
  state.jsonl
  seats/seat-001.md
  seats/seat-002.md
  seats/seat-003.md
  deliberation.md
  report.md
```

This layout is deliberately separate from `<spec-folder>/ai-council/**`, which remains the ordinary planning Council surface. The new adapter must not call generic root Council writers that overwrite packet-level state/report files.

### Candidate Contract

Every candidate carries an id, title/focus, evidence references, relevance rationale, boundary verdict, stable fingerprint, and seat provenance. Exact hashes and similarity threshold `0.85` reject candidates materially equivalent to the current, saturated, rejected, or previously selected directions.

Research candidate sources: unanswered adjacent questions, contradiction/verification gaps, missing source classes, and alternate evidence methods.

Review candidate sources: unswept dimensions, producer-consumer or boundary paths, negative-test gaps, and traceability gaps. Review candidates cannot authorize fixes, target expansion, file mutation, or verdict changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is an additive feature, not a remediation packet, but the behavior touches shared policy and persistence. The inventory is therefore mandatory.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/commands/deep/{research,review}.md` | Public command wrappers and argument hints | Add convergence-mode syntax | Command help and compiled contract tests |
| `.opencode/commands/deep/assets/deep_{research,review}_presentation.txt` | Setup parsing/default authority | Add enum field and persistence mapping | Presentation parser fixtures |
| Four research/review YAML workflows | Legal-stop policy and orchestration | Add mode propagation and post-gate pivot branch | Four-cell parity matrix |
| `runtime/scripts/convergence.cjs` | Shared graph convergence validator/reporter | Accept/report `divergent`; leave scoring unchanged | Parser and golden decision fixtures |
| New runtime divergent adapter | Council transaction mechanics | Create | Quorum, crash/replay, collision, recursion, budget tests |
| Research/review config templates | Canonical loop configuration | Add nested divergent defaults | Schema and immutable-config tests |
| Research/review reducers | Derived state writers | Reduce pivot events idempotently | Replay and repeat-reduction tests |
| Strategy/dashboard/prompt assets | Operator and iteration context | Add saturated history and frontier | Snapshot/anchor tests |
| Research/review synthesis | Final canonical reports | Add mode-specific expansion maps | Synthesis snapshots |
| Compiled command contracts | Generated command projections | Regenerate only | Contract drift check |
| Packet references/catalog/playbooks/benchmarks | Operator contract and validation | Document and add scenarios | Quick validation and playbook checks |
| `mode-registry.json` | WorkflowMode/runtimeLoopType routing | **Unchanged, non-consumer** | Byte/diff assertion |
| `system-deep-loop/SKILL.md` and `hub-router.json` | Logic-free hub routing | **Unchanged, non-consumer** | Byte/diff assertion |
| Generic AI Council command/orchestrators/root writers | Ordinary planning Councils | **Unchanged, not reused by pivot persistence** | Collision and non-consumer tests |
| Agent definitions and mirrors | Single-iteration leaf contracts | **Unchanged unless output schema evidence proves otherwise** | Mirror parity/diff assertion |

Required invariant: the change may add shared mechanics, but research and review eligibility, candidate generation, verdict semantics, and synthesis vocabulary remain in their owning packets.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Baseline and Contract Lock

- Pin current parser/decision outputs for `default`, `off`, and `sliding-window`.
- Record current auto/confirm asymmetries as explicit rows, then define one target parity contract.
- Freeze byte-unchanged non-consumers: hub, registry, routing identity, generic Council behavior, and existing stop taxonomy.

### Phase 1: Command, Config, and Runtime Propagation

- Add public command/presentation parsing for the four-value enum.
- Persist canonical nested config in research/review auto/confirm initialization and JSONL config records.
- Pass the effective mode explicitly into `convergence.cjs`.
- Extend runtime validation/reporting without changing convergence scoring or decisions.

### Phase 2: Transaction-Safe Pivot Adapter

- Implement stable pivot identity, event validation, transaction stages, strict return quorum, material agreement, recursion guard, cost preflight, and pivot-scoped persistence.
- Implement candidate normalization, evidence/boundary validation, and exact/similarity dedup.
- Keep the adapter mode-agnostic and mechanics-only.

### Phase 3: Research Integration

- Translate eligible research legal STOP origins after all gates.
- Add research candidate generation, event emission, resume logic, reducer projections, strategy/dashboard/prompt sections, and Divergence Map synthesis.
- Preserve novelty, question, blocked-stop, stuck, idea, and negative-knowledge semantics.

### Phase 4: Review Integration

- Apply equivalent translation after review's stronger gates.
- Add review-specific candidate generation, reducer projections, strategy/dashboard/prompt sections, and Dimension Expansion Map synthesis.
- Preserve exact PASS/CONDITIONAL/FAIL mapping, P0/security locks, fixed target authority, and read-only review behavior.

### Phase 5: Generated Surfaces, Documentation, and Verification

- Regenerate compiled command contracts from canonical sources.
- Update references, feature catalogs, playbooks, behavior benchmarks, and package-visible tests.
- Run the full regression and divergent-mode matrix, strict packet validation, and alignment checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Four-value parser, config resolution, pivot id, candidate dedup, quorum/cost/recursion guards | Vitest |
| Integration | Runtime decision envelopes, pivot transaction crash points, council persistence collision, reducer replay | Vitest and Node fixtures |
| Contract | Four YAML variants, presentation/config parity, compiled contract source hashes, stop taxonomy | Existing command-contract and parity suites |
| Regression | `default`, `off`, `sliding-window` research/review decision baselines | Golden fixtures |
| Mode behavior | Research/review x auto/confirm x eligible pivot/hard-stop paths | YAML contract tests and manual playbooks |
| Synthesis | Divergence Map and Dimension Expansion Map snapshots; unchanged review verdict | Snapshot tests |

Minimum matrix:

1. Accept `divergent` from CLI camel/snake and nested config inputs; reject unknown values.
2. Verify one eligible legal STOP becomes exactly one pivot in each of four workflows.
3. Verify max iterations, pause/cancel, manual stop, unrecoverable error, and review security/P0 escalation never dispatch Council.
4. Verify 3/3 return success, 2/3 material agreement, one-seat failure, non-convergence, recursion rejection, and budget rejection.
5. Crash and resume after each pivot event; repeat reducer execution; assert one pivot and stable focus.
6. Run two pivots plus an ordinary packet planning Council; assert no artifact collision.
7. Test exact duplicate, materially equivalent duplicate, boundary escape, and valid novel candidates for both loop families.
8. Assert existing mode outputs and non-consumer files remain unchanged.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing coverage-graph convergence output | Internal | Green | Divergent cannot identify eligible saturation. |
| Append-only research/review JSONL and reducers | Internal | Green | Pivot resume and derived projections are unavailable. |
| Low-level native Council seat mechanics | Internal | Yellow | Existing dispatch is reusable, but pivot adapter must prohibit generic root persistence and external/subprocess routes. |
| Command contract compiler/render drift checks | Internal | Green | Public command projections cannot be regenerated safely. |
| Strict packet validation | Internal | Green | Planning and later closeout cannot be claimed. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Existing convergence modes regress, review locks weaken, a pivot duplicates on resume, Council artifacts overwrite prior state, or candidate selection escapes the charter.
- **Procedure**: Remove divergent command/config exposure and the four YAML adapter calls, restore generated command contracts from canonical non-divergent sources, and leave additive pivot JSONL/artifacts inert. Never rewrite append-only history.
- **Compatibility**: Because the feature is opt-in and additive, stored divergent events can remain readable but ignored after rollback; no backward shim is required unless an active persisted consumer is identified.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 0 Baselines
  -> Phase 1 Propagation
      -> Phase 2 Pivot Adapter
          -> Phase 3 Research Integration
          -> Phase 4 Review Integration
              -> Phase 5 Full Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline and contract lock | None | All implementation phases |
| Command/config/runtime propagation | Baselines | Adapter and mode integrations |
| Pivot adapter | Propagation contract | Research and review integration |
| Research integration | Adapter | Full verification |
| Review integration | Adapter | Full verification |
| Generated surfaces and verification | Research and review | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline and contract lock | Medium | 0.5-1 day |
| Command/config/runtime propagation | Medium | 0.5-1 day |
| Pivot adapter and transaction tests | High | 2-3 days |
| Research integration | High | 1.5-2 days |
| Review integration | High | 1.5-2 days |
| Documentation and full verification | High | 1-2 days |
| **Total** | **High** | **7-11 engineering days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Implementation Checklist

- [ ] Capture golden decisions and compiled command contracts before code changes.
- [ ] Record hashes/diffs for explicit non-consumer files.
- [ ] Verify no existing packet uses an unsupported `divergent` field.

### Rollback Procedure

1. Disable/remove divergent parsing and YAML branches while retaining existing enum behaviors.
2. Remove adapter invocations and rebuild generated command contracts.
3. Run existing-mode golden fixtures, review verdict-lock tests, and strict packet validation.
4. Preserve any written `divergent/pivots/**` evidence and append a rollback event if rollback occurs after a test run.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Additive JSONL/artifact records remain immutable and inert; no destructive data reversal is permitted.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS

- Requirements: `spec.md`
- Tasks: `tasks.md`
- Verification: `checklist.md`
- Evidence synthesis: `research/research.md`
- Council decision: `ai-council/council-report.md`

Implementation is explicitly deferred. Start it only through `/speckit:implement` after plan approval.
