---
title: "Implementation Plan: Phase 16: follow-up-fix-sweep"
description: "Widen the terminal record's stop reasons, write it on the three-errors and manual-stop paths, refuse an unknown gate status and keep a registry-less lineage in the merge. Then correct the stale doc lines and two agent rules, re-run the SC-002 probe, and prove it with the runtime suite, the census, the drift check and the mirror check."
trigger_phrases:
  - "follow up fix sweep plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 16: follow-up-fix-sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js CommonJS, YAML workflow assets, Markdown |
| **Framework** | The deep-loop runtime and its typed review ledger |
| **Storage** | JSONL state logs and the append-only review ledger |
| **Testing** | Vitest in `.skilled/skills/system-deep-loop/runtime` |

### Overview
The code half extends 015's terminal gate record to the three stop paths that miss it, widens its stop-reason enum, refuses an unknown gate status and keeps a registry-less lineage in the merge. The doc half corrects lines that earlier children left stale and tightens two agent rules. DeepSeek V4.1 Flash builds one task per dispatch, and the conductor reads every diff and runs the suites.
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
Extend the single typed fact from 015. Every stop path that reaches synthesis writes the same terminal record, and every verdict site keeps reading it.

### Key Components
- **`record_terminal_gates`**: the block in `step_handle_convergence` `if_stop`. Without new `run_first` references, the auto three-errors path and the two confirm manual stops reach synthesis with no record.
- **`stopReason` enum**: without `error` and `manualStop`, those paths cannot state why they stopped.
- **`reconstructReviewRegistryFromState`**: without the terminal-row check before its null return, a lineage with failed gates and no findings drops out of the merge.

### Data Flow
A stop path runs `record_terminal_gates` with its stop reason, then reaches synthesis. The gateway validates the record, the projection writes the `terminal_gates` row, and hydrate, `reduce-state.cjs` and `fanout-merge.cjs` read it unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

No `review/review-report.md` Planning Packet exists; every row comes from the 2026-11-15 Fable 5.2 review and was re-read by the conductor.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep-review-ledger-types.ts`, `deep-review-ledger-schema.ts` | Define and validate the terminal record | update | Schema vitest accept and refuse cases |
| `deep-review-auto.yaml` `error_recovery.consecutive_failures`, `terminal_stop_reason` rule | Three-errors path; stop-reason mapping | update | `rg` on both lines |
| `deep-review-confirm.yaml` `on_C` at `gate_pre_iteration`, the post-iteration gate and the pivot | Manual stops into `gate_pre_synthesis` | update | SC-002 grep |
| `deep-review-state-contract.ts`, `reduce-state.cjs` | Pass `stopReason` through as a string | unchanged | Typecheck and suite |
| `fanout-merge.cjs` `reconstructReviewRegistryFromState` | Rebuilds a registry from a lineage log | update | New merge vitest case |
| `deep-review-reducer.ts` terminal case | Outcome and status after a terminal record | update | Reducer vitest terminal cases |
| `compiled/deep-review.contract.markdown` | Digest of the review YAMLs | regenerate | Drift check `OK` |
| `orchestrate.md`, `markdown.md` and forks | Agent rules | update | Mirror check exits 0 |
| Quality card, crosswalk, debug scaffold and playbook, council folder layout, prerequisites playbook | Docs with stale lines | update | `rg` for each stale string exits 1 |

Required inventories:
- Same-class producers: `rg -n 'gate_pre_synthesis|phase_synthesis' .skilled/commands/deep/assets/deep-review-*.yaml` lists every entry into synthesis.
- Consumers of the changed enum: `rg -n 'stopReason' .skilled/skills/system-deep-loop/runtime --glob '*.{ts,cjs}' --glob '!**/node_modules/**'`.
- Algorithm invariant: every run that reaches `step_derive_verdict` has written a terminal record at its last stop.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phases.

Setup baselines the suite and the census. Implementation changes the schema first, then the workflows, the merge and the docs. Verification reruns the suite, census, parity, drift and mirror checks and the SC-002 probe.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Schema enum and unknown refusal, registry-less merge | Vitest in `runtime/tests/unit/` |
| Integration | Bookkeeping emission over both YAMLs, census, contract parity, drift, agent mirrors | Existing suites and checkers |
| Manual | SC-002 probe in a new Claude Code session | `claude -p --output-format stream-json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 015's terminal record on origin/main | Internal | Green | Nothing here applies without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a valid terminal record is refused, or a run that should pass returns FAIL.
- **Procedure**: `git revert <sha>` on the 016 commit; ledgers holding the wider enum values stay readable, since every reader passes the string through.
<!-- /ANCHOR:rollback -->

---


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

