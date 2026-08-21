---
title: "Session Handover: Runtime Enablement Blocked on One Chain"
description: "Continuation state for the runtime-enablement packet: five phases blocked behind a single ordered chain whose first link, deleted upcaster coverage, is now restored."
trigger_phrases:
  - "runtime enablement handover"
  - "012 runtime enablement resume"
  - "authority flip blocked"
  - "effect producer missing"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement"
    last_updated_at: "2026-08-21T14:05:00Z"
    last_updated_by: "claude"
    recent_action: "Restored six emptied upcaster suites and repaired their two drifts"
    next_safe_action: "Register the nine genuinely unmapped legacy stems"
    blockers:
      - "No production code writes effect records, so the certificate passes over an empty list"
      - "AuthorityFlipCoordinator has zero production callers; both policies always allow"
      - "The per-mode step reports ok while containing no flip code"
      - "deep-improvement-common has no single spelling the CLI, gateway and manifest agree on"
      - "8 of 8 modes still read legacy_authoritative, so the whole-system gate cannot pass"
    key_files:
      - "handover.md"
      - "002-deep-research-enablement/implementation-summary.md"
      - "003-fleet-enablement/plan.md"
      - "006-enablement-closeout/implementation-summary.md"
    completion_pct: 45
    open_questions:
      - "Where does the effect producer belong, given a ledger append is a record and not an act?"
    answered_questions:
      - "The code constant is authoritative: there are eight modes, not seven or six"
      - "Two of the eleven unmapped rows are normalized before emission and are not stem work"
      - "The coordinator is composed inside this epic rather than assumed wired"
---

# Session Handover: Runtime Enablement Blocked on One Chain

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Use this handover to resume the runtime-enablement packet. It is the first rung of the resume
ladder for this parent; the per-phase `_memory.continuity` blocks are the second.

**Current state:** one phase complete, four blocked, one planned. Every blocked phase waits on the
same ordered chain, described in section 3.2. The chain's first link was cleared this session.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 2026-08-21, worktree `022-012-runtime-enablement-build`
- **To Session:** next continuation on the same worktree
- **Phase Completed:** IMPLEMENTATION — prerequisite only, no numbered phase closed
- **Handover Time:** 2026-08-21T14:05:00Z
- **Recent action**: Restored six emptied upcaster suites and repaired their two drifts

| Phase | Status | % | Waiting on |
|---|---|---|---|
| 001-append-gateway-and-projection | complete | 100 | — |
| 002-deep-research-enablement | blocked | 82 | effect producer, then the flip |
| 003-fleet-enablement | blocked | 70 | coordinator, step, mode-name mismatch |
| 004-legacy-writer-retirement | blocked | 60 | every mode on ledger authority |
| 005-whole-system-gate | blocked | 80 | 004, and 8/8 modes still legacy |
| 006-enablement-closeout | planned | 65 | a runtime that has flipped at least once |
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
| --- | --- | --- |
| The code constant decides the mode count | `AUTHORITY_FLIP_MODE_ORDER` holds eight; the plan said seven and the spec six. Docs disagreed with each other, the constant did not. | Eight modes flip, in the constant's frozen order |
| Compose `AuthorityFlipCoordinator` in production | The plan assumed the pilot had wired it. Counting callers refuted that: its only assembly is a test file. | 003 gains real composition work it did not budget for |
| Build the effect producer inside this epic | Without it the certificate's coverage check runs over an empty list, and an empty list passes every predicate. | 002 cannot close until a real producer exists |
| Retire legacy writers unattended once the gate is green | The operator pre-authorized it rather than gating on a second confirmation. | 004 proceeds without a stop, but only after an independent read |
| Validate the compare-and-swap writer | The recovery path was stricter than the path that writes the record. | Shipped as `09f68833d4` |

### 2.2 Blockers Encountered

**Blockers**: no effect producer; coordinator uncomposed; step performs no flip; mode-name mismatch; all modes still legacy.

| Blocker | Status | Resolution/Workaround |
| --- | --- | --- |
| Six upcaster suites emptied by a bulk WIP sync | resolved | Restored verbatim from `aa66365e78`; `20bcddfb3d` |
| Gateway denies without an identity resolver | resolved | Copied the surviving suites' resolver block into all six |
| Three captured-log fixtures unresolvable | resolved | Two repointed after a re-nest; the third never existed and was rehomed |
| Nothing writes effect intent or confirmation records | open | Root blocker. A producer must sit where real external acts happen |
| `AuthorityFlipCoordinator` has no production caller | open | Compose it; give it a policy that can actually deny |
| The per-mode step returns ok without writing a record | open | Make ok-without-a-record impossible; assert on disk, not the report |
| `deep-improvement-common` spelling differs per layer | open | Fix CLI, gateway and projection manifest together; it is third in the order |
| Both authorization policies always return allow | open | `AUTHORIZATION_DENIED` appears zero times in flip tests |

### 2.3 Files Modified

**Key files**: six `*-ledger-schema.vitest.ts` suites, `tests/helpers/legacy-real-log.ts`, `lib/per-mode-authority-flip/authority-registry.ts`, `scripts/enable-modes.cjs`.

| File | Change Summary | Status |
| --- | --- | --- |
| `runtime/tests/unit/*-ledger-schema.vitest.ts` (six) | Restored verbatim, plus the identity resolver each was missing | complete |
| `runtime/tests/helpers/legacy-real-log.ts` | Three fixture paths repointed | complete |
| `runtime/lib/per-mode-authority-flip/authority-registry.ts` | Writer validated on both the write and replay paths | complete |
| `runtime/scripts/enable-modes.cjs` | Never-green gate fixed; empty row set now refused | complete |

### 2.4 Traps & Scar Tissue

| Trap / blast site | Activation condition | Load-bearing or defensive? | How to avoid re-paying it |
| --- | --- | --- | --- |
| `[].every(...)` is true | Any coverage check over a list no producer fills | load-bearing | Refuse on absence; never let an empty list report a clean bill of health |
| Gateway denies with no identity resolver | Building a gateway without `identityResolver` | load-bearing | Optional in the type, mandatory in behaviour. Copy the working block |
| Constructing a ledger creates the directory whose absence is being tested | Building the port before the existence check | load-bearing | Ports must be lazy factories; check both directories before constructing either |
| Full-suite failing set moves under load | Any full run while other applications compete | defensive | Compare failing sets by name and repeat a condition before accusing a change |
| The "append every stem" tests straddle the 30s wall | Running any ledger-schema suite's heaviest test | defensive | Family-wide and load-dependent, not caused by any one change. An untouched sibling failed at 32.6s in one full run, passed in the next, and failed at 42.6s in isolation |
| `npm exec vitest` sits at 0% CPU by design | Checking whether a run is alive | defensive | Measure the fork worker, not the parent |
| A restore trap that uses relative paths | A script that `cd`s before the trap fires | load-bearing | Use absolute paths in `trap ... EXIT INT TERM`, and print restored counts |
| Recorded blockers decay | Acting on a note without re-running it | load-bearing | Three notes were stale this session. Re-measure before building |
| `--event-json` takes a file path | Passing inline JSON to the append CLI | defensive | Write the row to a file first |
| Metadata generators live in the main checkout | Running them from the worktree | defensive | Invoke `scripts/dist/...` from the main checkout, then re-add `level` if dropped |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **File:** `runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts`
- **Next safe action**: Register the nine genuinely unmapped legacy stems
- **Cold-read order**: 1. this handover → 2. `002-deep-research-enablement/implementation-summary.md`
  §6 → 3. `003-fleet-enablement/plan.md` dependency table → 4.
  `002-deep-research-enablement/scratch/directive-census-remeasured.md`
- **Context:** The chain in 3.2 is strictly ordered. Nothing below a link can be proven while that
  link is open, because each one supplies the evidence the next one checks.

### 3.2 Priority Tasks Remaining

The chain. Each link blocks the next.

1. **Directive stems — nine rows.** `migration`, `min_iterations_guard_pass`, `spec_check_result`,
   `spec_mutation`, `spec_mutation_conflict`, `spec_preinit_context_added`,
   `spec_preinit_context_deduped`, `spec_seed_created`, and the `type: spec_mutation` row. The
   census said eleven; two of those are not work, for the reason in section 5.
2. **Effect producer.** Nothing writes effect intent or confirmation records. Build it where real
   external actions happen. Wrapping the append CLI would emit a record for no external act, each
   confirmed instantly — perfect coverage attesting to nothing. An absence can be refused; a
   fabrication cannot be told from evidence downstream.
3. **Compose the coordinator, with a policy that can deny.** Both existing policies are
   `evaluate: () => ({verdict: 'allow'})`. Prove a denial leaves the record whole.
4. **Make the step perform the flip.** It reports success while containing no flip code, and the
   false completion persists because resume skips completed modes. Assert on the record on disk.
5. **Flip.** Fix `deep-improvement-common` first — it is third in the frozen order and each layer
   refuses the others' spelling. Capture records byte-for-byte, flip the pilot, then the rest one at
   a time, stopping at the first failure.
6. **Retire legacy writers, then the gate, then closeout.** Only after an independent read confirms
   all eight modes on ledger authority. Early removal strands every agent.

### 3.3 Critical Context to Load

- [ ] Indexed save or continuity target: use `generate-context.js` for indexed saves. Edit
      `_memory.continuity` frontmatter in `implementation-summary.md` for quick continuity updates.
- [ ] Spec file: `spec.md` (root purpose and the phase map)
- [ ] Plan file: `003-fleet-enablement/plan.md` (the dependency table, whose coordinator row was
      corrected from an assumption to a measurement)
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] All in-progress work committed
- [x] Current context saved via `_memory.continuity` in this handover
- [x] No breaking changes left mid-implementation
- [x] Tests re-run from the final state: six restored suites at 109 passed of 110
- [x] Full-suite baseline captured at the pre-restore commit: 16 failed of 192 files, 14 failed of
      4302 tests, 7618s. Six of those sixteen file failures are the emptied suites reporting no test
      suite found, so the restore removes them and adds 109 passing tests
- [x] `validate.sh --strict` green on the parent and all six children: 7 PASSED, 0 FAILED
- [x] This handover document is complete
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

**The packet's dominant defect is a check placed where it cannot observe the property it names.**
Nine or more instances, each found by running code rather than reading it. Treat every green as
guilty until a deliberate perturbation turns it red, and check *why* it went red: a test that fails
at its first assertion has proven nothing about the assertions after it.

**Why coverage came first.** A bulk sync had truncated six upcaster suites from roughly a thousand
lines each to eleven, deleting 7,127 lines the previous commit added as full coverage. The next task
in the chain edits one of the exact modules those suites cover. Registering stems there without
coverage would have produced untested guards in the module this packet's whole failure pattern is
about.

**Two of the eleven unmapped rows are not stem work.** `deep-research-auto.yaml` defines
`step_normalize_pause_events`, which rewrites raw `paused` to `userPaused` and raw `stuck_recovery`
to `stuckRecovery` before emission; the manifest's actual writes use the canonical spellings. Those
two raw names appear only as the input side of a normalization rule and can never reach the ledger.
Registering stems for them would invent vocabulary for events that cannot occur.

**One fixture had never been evaluated.** The review real-log test pointed at a path no commit on
any branch has ever contained, introduced by the same commit that added the helper. There was no
original value to restore. The repo's only 64-record review log would have matched the expected
number while failing the purpose — five of its record kinds are unregistered, so it would report
roughly 34 unknown records against a test whose point is that there are none. It was rehomed to the
same-track log at 41 records instead.

**A delta once accused a change that did nothing.** Identical conditions produced 5 failed and 163
passed on the same five files; the red run was half again slower, with every failure on a
thirty-second or sixty-second wall. Compare failing sets by name, and repeat a condition before
concluding anything.

**Executor notes.** Devin's `run_subagent` returned an exhausted weekly quota; the parent model
itself still runs, so the work was re-dispatched to the same model directly. Executor reports are
not evidence: one claimed all 110 tests passed at exit 0 when an independent re-run showed 109 and
exit 1.
<!-- /ANCHOR:session-notes -->
