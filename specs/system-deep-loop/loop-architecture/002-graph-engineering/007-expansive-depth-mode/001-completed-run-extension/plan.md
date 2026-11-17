---
title: "Implementation Plan: Completed-Run Extension (--extend=N)"
description: "Promote the reserved completed-continue lineage mode to a live --extend=N flag on both deep loops. A locked pre-classify step mutates the config in place and appends a new run_extended ledger stem, which every schema, reducer, projection and lifecycle filter learns, proven by extended vitest suites and a projection case."
trigger_phrases:
  - "completed run extension plan"
  - "extend=N implementation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Completed-Run Extension (--extend=N)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and CommonJS (Node), YAML workflow assets, Markdown docs |
| **Framework** | system-deep-loop runtime: mode-append gateway, typed ledger schemas, typed reducers, legacy projections |
| **Storage** | Append-only JSONL ledgers and state logs under the packet's `research/` or `review/` folder; JSON config |
| **Testing** | vitest (`.skilled/skills/system-deep-loop/runtime/tests/unit/`, `.skilled/skills/system-spec-kit/runtime/cli/tests/`), the two `check-*.cjs` guard scripts, manual playbook entries |

### Overview
The change adds one opt-in lineage path, `completed-continue`, spelled `--extend=N`, to both `/deep:research` and `/deep:review`. A new step inside the loop lock rewrites the completed config in place and appends a `run_extended` event, so classification lands on `resume` and the loop runs N more iterations in the same session and generation before re-synthesizing. Proof is the extended vitest suites, the two guard scripts and a fixture extension that runs from 7 of 10 to 10 of 10.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Open questions 1 to 4 in `spec.md` §10 answered or their recommended defaults accepted by the operator

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npx vitest run` in `.skilled/skills/system-deep-loop/runtime` and the two named `system-spec-kit` suites exit 0, and `node .skilled/skills/system-deep-loop/runtime/scripts/check-ledger-stem-producers.cjs` and `check-projection-coverage.cjs` exit 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Event-sourced lifecycle branch: a new ledger stem plus an in-place config mutation under the existing lock.

### Key Components
- **Locked pre-classify step (both YAMLs)**: runs after `step_acquire_lock` and before `step_classify_session`; without it the mutation would run before the lock (the existing lifecycle step at `deep-research.yaml:270` is the wrong place) and classification would halt on `complete`.
- **`run_extended` stem (both ledger schemas and types)**: records the prior and new budgets so the extension is replayable; without it the extension is indistinguishable from a plain resume, which is an eliminated alternative.
- **Stem handlers (typed reducers, legacy projections, lifecycle filters, stem-producer tables, upcaster)**: without a projection case the event never reaches the state log.
- **Snapshot step (both YAMLs)**: the protocol requires a synthesis snapshot before any `completed-continue` flow (`loop-protocol.md:562`); without it the re-synthesis overwrites the prior report.

### Data Flow
The command parses `--extend=N` and `--extend-minutes=M`, the workflow takes the lock, and the pre-classify step reads the config and state log, computes `continuedFromRun`, the new `maxIterations` and the new `maxDurationMinutes`, snapshots the prior synthesis, rewrites the config and appends `run_extended` through the gateway. Classification then sees status `initialized` and lands on `resume`, the loop runs until the new cap, and synthesis re-marks the run complete. The reducers fold `run_extended` into the Lifecycle section, and the dashboard can use it as the before/after boundary.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase fixes defect D11 and touches schema boundaries and persistence, so the inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Ledger schemas, types and stem-producer tables (both loops) | Own the closed stem set | update: add `run_extended` | `check-ledger-stem-producers` exits 0; ledger-schema suites pass |
| Typed reducers and legacy projections (both loops) | Consume every stem | update: add a case per switch and projection | compiler (`assertNeverStem`); `check-projection-coverage`; new projection case |
| `reduce-state.cjs` (both) | Filter lifecycle events; review normalizes lineage mode | update: filters and `LIVE_LINEAGE_MODES` | reducer Lifecycle-section parity case |
| `convergence.cjs` | Reads `maxIterations` and counts every iteration row | unchanged: the cap and floor need no change (research §19 item 3) | existing convergence suites pass |
| Docs, agent definitions, command docs, two `system-spec-kit` assertions | Describe the mode as deferred | update | `rg` for the deferred wording; the two suites pass |

Required inventories:
- Same-class producers: `rg -n 'run_resumed' .skilled/skills/system-deep-loop/runtime` lists every place the new stem needs a twin.
- Consumers of changed symbols: `rg -n 'completed-continue|LIVE_LINEAGE_MODES|deferredModes' .skilled --glob '*.ts' --glob '*.cjs' --glob '*.md' --glob '*.yaml' --glob '*.json'`.
- Matrix axes: loop (research, review) by `stopPolicy` (convergence, off, max-iterations) by start time (inside the old budget, after it) by extension count (first, second).
- Algorithm invariant: after an extension, `maxIterations - continuedFromRun == N` and `maxDurationMinutes > elapsedMinutesAtExtension`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the `run_resumed` handlers, traces every `:confirm` branch for status `initialized` and records the answers to the open questions. Implementation adds the `run_extended` stem and its handlers, the locked pre-classify step, the snapshot step, the config and flag changes and the doc wording. Verification runs the extended vitest suites, the two guard scripts and the two `system-spec-kit` suites, and walks the playbook entry.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Ledger-schema and upcast suites; reducer Lifecycle-section parity; `run_extended` projection case; `append-mode-event-legacy-seam`; double-terminal telemetry; the two `system-spec-kit` assertions | vitest |
| Integration | `workflow-restart-lifecycle` and `deep-review-auto-restart-contract` with an extension case; a 7-of-10 plus `--extend=3` cap case; a duration-ceiling case that starts after the old budget; `check-ledger-stem-producers`, `check-projection-coverage` | vitest, `node` guard scripts |
| Manual | A playbook entry per loop: extend a completed fixture run and read the state log, config and snapshot | `/deep:research`, `/deep:review` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None. Slice A depends on no other slice (research §20) and uses only existing runtime pieces: the gateway, the loop lock and vitest. | Internal | Green | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a default run (no `--extend`) changes its state log, dashboard or synthesis, or `check-projection-coverage` fails after the change.
- **Procedure**: revert the phase's commit; ledgers written with `run_extended` stay readable because the stem is additive, and the config of an extended run can be reset by hand to status `complete`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation, because the open-question answers decide the snapshot name and the event choice |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase close |
<!-- /ANCHOR:phase-deps -->

---
