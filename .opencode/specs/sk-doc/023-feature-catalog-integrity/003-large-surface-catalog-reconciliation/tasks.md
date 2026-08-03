---
title: "Tasks: large-surface catalog reconciliation"
description: "The two catalog surfaces outside every gate are the two that most need one: system-spec-kit (348 leaves, 94 orphans, eight registered MCP tools with no root mention, two leaves publishing obsolete contracts) and the system-deep-loop nested runtime and benchmark catalogs (75 leaves, whole undocumented typed-spine domains, two stale executor rosters, 22 leaves carrying forbidden packet-history metadata). This phase reconciles both, with the typed-spine rollout state adjudicated externally rather than guessed."
trigger_phrases:
  - "large surface catalog reconciliation task list"
  - "feature catalog integrity task list"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/023-feature-catalog-integrity/003-large-surface-catalog-reconciliation"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the phased task breakdown"
    next_safe_action: "Execute T001 confirm-against-HEAD before further tasks"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Large-Surface Catalog Reconciliation

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Status: Planned. No task is started.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 **Confirm findings against HEAD before any edit.** Complete the missing-tools check across **all 41**
      `TOOL_DEFINITIONS` against the spec-kit root; the synthesis sampled 5 of 8 (`embedder_list`, `embedder_set`,
      `session_bootstrap`, `session_health`, `memory_learned_clear`, all at zero occurrences) and the remaining 3 must
      be confirmed. Re-read `handlers/session-bootstrap.ts` and its schema for the live response envelope (expected:
      `resume` / `health` / `hints` / `nextActions` against a leaf that says `profile` / `graph` /
      `recommendedNextAction`). Re-read `CONTEXT_MODES` in `handlers/memory-context.ts` for the live budgets (expected:
      800 / 3500 / 3000 against a leaf that publishes 800 / 1500 / 2000 / 1200). Re-count
      `rg -l "Source phase" .opencode/skills/system-deep-loop/runtime/feature-catalog/` (expected: 22). Re-derive both
      executor rosters from `executor-config.ts` and `KNOWN_EXECUTORS` in `dispatch-model.cjs`. Re-derive the orphan
      count for `system-spec-kit` (expected: 94 of the repo-wide 104).
- [ ] T002 **Build the typed-spine rollout-state evidence table before any writing.** One row per module in
      `runtime/lib/`: module path, unit tests present, wiring path if any, default-on or default-off, proposed label
      (active / shadow-only / dark-but-implemented / planned), and the evidence for the proposal. Cover at minimum the
      authorized ledger, event envelopes, conditional fan-in, mode contracts, receipts and effect recovery,
      path-coverage termination, shadow parity, rollback drills, and the per-mode typed implementations.
- [ ] T003 [B] **Dispatch the table for adjudication and record the outcome.** The whole lane's correctness depends on
      it, and it is the one place in this track where "the catalog says it ships" could become a false claim about a
      safety-relevant runtime. **OPERATOR-DECISION (Q5)** — the 036 program owner adjudicates; this phase does not.
- [ ] T004 [P] Enumerate the 94 `system-spec-kit` orphans into a classification ledger skeleton (path, classification,
      reason), ready for triage once `001` rules.
- [ ] T005 [P] Confirm `RC-008-02` remains closed at HEAD and record it as do-not-resurrect. It was refuted at
      iteration 9.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lane A — `system-spec-kit`

- [ ] T006 Build the tool-reconciliation generator: read `TOOL_DEFINITIONS`, read the spec-kit root, emit the absent
      set. Commit the generator; the table it emits is downstream. Preferred location is
      `.opencode/skills/sk-doc/shared/scripts/` so `001`'s gate can run it.
- [ ] T007 Close the absent set. Several tools already have leaves the root never links, so link first and author only
      what genuinely has no leaf. Covers `RC-003-01`.
- [ ] T008 Correct the `session_bootstrap` leaf to the live response contract, asserted against the handler and schema
      rather than transcribed. Covers `RC-003-02`.
- [ ] T009 Correct the `memory_context` leaf budgets, asserted against `CONTEXT_MODES`. Covers `RC-008-01`.
- [ ] T010 [P] Repair the four template-shape defects: three leaves missing `description`, one leaf carrying
      `KEY BEHAVIORS` where `SOURCE METADATA` belongs. Covers part of `RC-001-06`.
- [ ] T011 [P] Remove packet-history prose from the spec-kit root; source paths only. Covers the rest of `RC-001-06`.
- [ ] T012 [B] Triage all 94 orphans against `001`'s feature-leaf definition: each is either linked from the root as a
      feature or classified as a non-feature with a recorded reason. **Do not bulk-link.** Blind linking would satisfy
      the checker and corrupt the inventory.

### Lane B — `system-deep-loop` nested catalogs

Evidence-table-first. T013 through T016 are independent of the adjudication and run in parallel with T002 and T003.

- [ ] T013 [P] Derive the fan-out executor roster from `executor-config.ts` and replace the retyped list. The leaf
      currently reads "all 3 CLI kinds: `cli-opencode`, `cli-claude-code`, `cli-opencode`" against seven live kinds.
      Covers `RC-004-02`. **OPERATOR-DECISION (Q6)** for the derive-versus-ban policy.
- [ ] T014 [P] Derive the model-benchmark dispatcher roster from `KNOWN_EXECUTORS`; the leaf claims three against five.
      Covers `RC-010-01`.
- [ ] T015 [P] Add the roster test: it fails when a new executor is added without a catalog update. This is what stops
      `RC-004-02` and `RC-010-01` from recurring the next time an executor lands.
- [ ] T016 [P] Remove `Source phase:` metadata from all 22 runtime leaves. Covers `RC-004-04`.
- [ ] T017 [B] **Typed-spine labeling — blocked on T003.** Label every module active, shadow-only,
      dark-but-implemented, or planned, using the adjudicated table only. Anything not wired carries an empty or stub
      SOURCE FILES table rather than ordinary current-state prose. A module whose state came back unknown is labeled
      unresolved, never shipped by default. Covers `RC-004-01`.
- [ ] T018 Document the Lane C benchmark controls with accurate labels: compiled-routing parity, typed
      resource-contract capping, browser and live executor dispatch, multi-probe expansion, parent-hub vocabulary sync.
      Several are default-off, so the dark-labeling rule applies. Covers `RC-010-02`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Run the generator: zero registered MCP tools absent from the spec-kit root, against the T001 baseline of 8.
- [ ] T020 `rg -c "Source phase" .opencode/skills/system-deep-loop/runtime/feature-catalog/` returns 0 files, from 22.
- [ ] T021 Roster test passes and fails correctly: add a synthetic executor and confirm the test fails, then remove it.
- [ ] T022 `session_bootstrap` envelope and `memory_context` budgets assert green against the handler and schema.
- [ ] T023 Label spot-check: a reviewer checks five rollout labels against actual command and YAML wiring, not against
      the evidence table that produced them.
- [ ] T024 Every module labeled dark or shadow-only has an empty or stub SOURCE FILES table.
- [ ] T025 [B] After `001` lands: both packages inside the widened validator, `--strict` clean; spec-kit orphans 94 to
      0-by-ruling with every classification recorded.
- [ ] T026 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh
      .opencode/specs/sk-doc/023-feature-catalog-integrity/003-large-surface-catalog-reconciliation --strict` and
      confirm exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining, or each carries a recorded operator deferral
- [ ] All 9 findings closed or deferred with a reason; `RC-008-02` not reopened
- [ ] Every typed-spine label traces to the adjudicated table, never to an authoring judgment
- [ ] Every one of the 94 orphans carries a recorded classification
- [ ] `checklist.md` fully verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Rulings**: `../001-catalog-enforcement-and-coverage/decision-record.md`
- **Parent**: `sk-doc/023-feature-catalog-integrity`
- **Parallel sibling**: `002-hub-catalog-truth-repair` (disjoint files)
- **Coordination**: `system-deep-loop/036-deep-loop-innovation/032-docs-drift-and-p2-batch` (same facts, different
  files) and `036/019-runtime-code-readmes` (adjacent directory, disjoint files)
<!-- /ANCHOR:cross-refs -->
