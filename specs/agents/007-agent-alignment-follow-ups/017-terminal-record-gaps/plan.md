---
title: "Implementation Plan: Phase 17: terminal-record-gaps"
description: "Add maxDurationReached to the terminal record's stop reasons, write the record on the duration stop, and send every manual stop through the summary and verdict steps. Prove it with the runtime suite, census, drift and parity checks."
trigger_phrases:
  - "terminal record gaps plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 17: terminal-record-gaps

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, YAML workflow assets |
| **Framework** | The deep-loop runtime and its typed review ledger |
| **Storage** | JSONL state logs and the append-only review ledger |
| **Testing** | Vitest in `.skilled/skills/system-deep-loop/runtime` |

### Overview
Widen the record's stop-reason enum by one value, then change two kinds of jump in `deep-review.yaml`: the duration stop records the gates before it enters synthesis, and the four manual stops enter at `phase_synthesis` instead of the pre-synthesis gate. DeepSeek V4.1 Flash `--thinking max` builds each task in one dispatch; the conductor reads every diff and runs the checks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `(cd .skilled/skills/system-deep-loop/runtime && npm test)` shows no failure `scratch/baseline.txt` lacks, and `npm run typecheck` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Every path into synthesis writes one terminal record, then runs hydrate and derive-verdict. This phase brings the last two kinds of path into that shape.

### Key Components
- **`step_check_max_duration.if_reached`**: the duration stop. It sets `reason` and `stopReason` to `maxDurationReached` and jumps to `phase_synthesis` with no record.
- **The four `on_C` manual stops**: they record the gates, then jump past hydrate and derive-verdict to `gate_pre_synthesis`.
- **`stopReason` enum**: it has no `maxDurationReached`, so the duration stop cannot state why it stopped.

### Data Flow
A stop path runs `record_terminal_gates` with its reason, then enters `phase_synthesis`. `step_fanout_merge` (skipped without fan-out) and `step_hydrate_summary_metrics` bind `failed_required_gate_ids`, and `step_derive_verdict` turns it into the verdict before `gate_pre_synthesis`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Every row comes from the 016 merge-port review (2026-11-15) and was re-read by the conductor.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep-review-ledger-types.ts`, `deep-review-ledger-schema.ts` | Define and validate the terminal record | update | Schema vitest accept case |
| `deep-review.yaml` `step_check_max_duration.if_reached` | Duration stop | update | `rg` shows `run_first: record_terminal_gates` before line 903's jump |
| `deep-review.yaml` `terminal_stop_reason` rule and `when:` text | Stop-reason mapping | update | `rg` on both lines |
| `deep-review.yaml` four `on_C` manual stops | Manual stops into `gate_pre_synthesis` | update | SC-002 grep |
| `deep-review-reducer.ts` terminal case | Outcome after a terminal record | unchanged | A non-converged passing record already gives `active` |
| `compiled/deep-review.contract.markdown` | Digest of the review YAML | regenerate | Drift check `OK` |

Required inventories:
- Same-class producers: `rg -n 'gate_pre_synthesis|phase_synthesis' .skilled/commands/deep/assets/deep-review.yaml` lists every entry into synthesis.
- Consumers of the changed enum: `rg -n 'stopReason' .skilled/skills/system-deep-loop/runtime --glob '*.{ts,cjs}' --glob '!**/node_modules/**'`.
- Algorithm invariant: every run that reaches `gate_pre_synthesis` has written a terminal record at its last stop and run `step_derive_verdict`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phases.

Setup baselines the suite and the census. Implementation changes the schema first, then the workflow. Verification reruns the suite, census, parity, drift and mirror checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Schema accepts `maxDurationReached` | Vitest in `runtime/tests/unit/` |
| Integration | Bookkeeping emission over the YAML, census, contract parity, drift | Existing suites and checkers |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 016's terminal record and reducer on origin/main | Internal | Green | Nothing here applies without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a valid terminal record is refused, or a manual stop no longer reaches the pre-synthesis gate.
- **Procedure**: `git revert <sha>` on the 017 commit; ledgers holding `maxDurationReached` stay readable, since every reader passes the string through.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation, because the baseline must exist first |
| Implementation | Setup | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
