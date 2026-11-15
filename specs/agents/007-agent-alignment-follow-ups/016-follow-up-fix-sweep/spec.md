---
title: "Feature Specification: Phase 16: follow-up-fix-sweep"
description: "After 015, several deep-review stop paths still write no terminal gate record or record the wrong stop reason. A gate status of unknown passes, and a fan-out lineage with no registry drops its failed gates. Stale text remains in five docs from children 009 to 014. This phase fixes each item a fresh Fable 5.2 review confirmed and records the operator's three decisions."
trigger_phrases:
  - "follow up fix sweep"
  - "phase 16 follow up fix sweep"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 16: follow-up-fix-sweep

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 16 |
| **Predecessor** | 015-review-verdict-gate-rule |
| **Successor** | None |
| **Handoff Criteria** | Every item in the In Scope list has a shipped fix or a recorded no-fix decision, the runtime suite shows no failure the baseline lacks, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the agent alignment follow-ups. It closes the items 015 left open and the notes that children 008 to 014 owed the operator.

**Scope Boundary**: Fixes only the items a read-only Fable 5.2 review (2026-11-15) confirmed by file and line. Items it judged acknowledge-only stay recorded and unchanged.

**Dependencies**:
- 015's typed `deep_review.terminal_gates_recorded` event, schema and readers (origin/main `91c76c650d`)

**Deliverables**:
- Every stop path that reaches synthesis writes a terminal gate record with its real stop reason
- Stale lines corrected in five docs and two scripts, and two agent rules tightened
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
015 records the required gates only inside `step_handle_convergence` `if_stop`. The auto workflow's three-errors rule and the confirm workflow's two ordinary manual stops (`deep-review-confirm.yaml:1298`, `:1704`) reach synthesis without that record, so those runs keep the P0-only verdict or read an older record. The stop-reason enum has no `error` or `manualStop`, a gate status of `unknown` passes, and `reconstructReviewRegistryFromState` returns null for a lineage whose state log holds a terminal row but no findings (`fanout-merge.cjs:1091`). The merged verdict then misses that lineage's failed gates while its attribution row says FAIL. Earlier children left stale text: the prompt quality card's TEST line, the crosswalk's Codex model and pin wording, a line-number pointer in the debug scaffold, an old agent file name in the council folder layout, and a playbook call that fails on a worktree branch.

### Purpose
Every deep-review run that reaches synthesis gets a verdict from a terminal gate record with its true stop reason, and the docs the earlier children touched say what the files now do.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n 'gate_pre_synthesis' .skilled/commands/deep/assets/deep-review-confirm.yaml | grep on_C
1298:        on_C: { proceed_to: gate_pre_synthesis }
1704:        on_C: { proceed_to: gate_pre_synthesis }
$ rg -n 'consecutive_failures' .skilled/commands/deep/assets/deep-review-auto.yaml
2708:  consecutive_failures: "After 3 consecutive errors, halt loop and enter synthesis with partial findings."
$ sed -n 1091p .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs
  if (openFindings.length === 0 && resolvedFindings.length === 0) return null;
$ sed -n 104p .skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md
TEST: <ran: summary of old vs new on 2-3 inputs | NOT RUN>
$ rg -n 'gpt-5.5' .skilled/bin/agent-mirror-crosswalk.md
158:twelve: `model = "gpt-5.5"` with `model_reasoning_effort`, `high` for most, `low` for `context`
$ sed -n 352p .skilled/skills/system-spec-kit/runtime/cli/spec/scaffold-debug-delegation.sh
SCHEMA SOURCE: .skilled/agents/debug.md (Debug Context Handoff format, lines 60-89)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Widen the terminal record's `stopReason` to `converged`, `maxIterationsReached`, `manualStop` and `error`, refuse a gate status of `unknown`, and pass the real stop reason through both review workflows.
- Write the terminal record on the auto three-errors path and on every confirm manual stop into `gate_pre_synthesis`, setting the reason before the record.
- Keep a fan-out lineage whose state log has a terminal row but no findings, so its failed gates reach the merged verdict.
- Make the orchestrator surface a LOW-confidence @review pass and re-dispatch it once (operator answer Q3: B).
- Correct the stale lines in the quality card, the crosswalk, the debug scaffold and its playbook, the council folder layout, the prerequisites playbook, and limit `DQI=n/a` in the markdown agent to outputs that are not markdown.
- Re-run the SC-002 probe from 014 with a machine-readable stream.
- Let a passing terminal record clear an earlier blocked stop in the typed reducer, so synthesis can start (operator: "Fix open", 2026-11-15).
- Name the council agent `ai-council` in its feature catalog, feature page and playbook; the skill keeps `deep-ai-council` (operator: "Fix open").

### Out of Scope
- Changing `@debug`'s default - the operator kept fix-by-default (Q2: A) on 2026-11-15.
- OpenCode and Pi on Opus hitting the prompt-improver refusal backstop - the designed behaviour for an ineligible pair.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts` | Modify | Widen `stopReason` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts` | Modify | Widen the enum rule; refuse `unknown` for the terminal stem |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-reducers/deep-review-reducer.ts` | Modify | A passing terminal record resolves the gate obligations and moves the status back to active |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modify | Keep a lineage that has a terminal row |
| `.skilled/commands/deep/assets/deep-review-auto.yaml`, `deep-review-confirm.yaml` | Modify | Stop-reason pass-through and the new record sites |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerate | Source digest |
| `.skilled/agents/orchestrate.md`, `.skilled/agents/markdown.md` and their `.claude` forks | Modify | LOW-confidence handling; the `n/a` limit |
| `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md` | Modify | TEST line |
| `.skilled/bin/agent-mirror-crosswalk.md` | Modify | Codex model, pin wording, `.devin` reach |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/scaffold-debug-delegation.sh` and its playbook page | Modify | Heading pointer; drop the dead folder pointer |
| `.skilled/skills/system-deep-loop/deep-ai-council/references/structure/folder-layout.md` | Modify | Agent file name |
| `deep-ai-council/feature-catalog/`, `deep-ai-council/manual-testing-playbook/` (catalog row, feature page, scenario, index) | Modify | Agent name `ai-council`; search paths |
| `runtime/tests/unit/deep-review-reducers.vitest.ts` | Modify | Passing, max-iterations and failing terminal cases |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/setup-native-module-health-and-mcp-installation.md` | Modify | `SPECIFY_FEATURE` prefix |
| Runtime unit tests for the schema and the merge | Modify | New accept, refuse and merge cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The terminal record accepts `stopReason` `manualStop` and `error`, and refuses a gate whose status is `unknown`. |
| REQ-002 | The auto three-errors path and every confirm manual stop into `gate_pre_synthesis` write the terminal record first, with the real stop reason (operator answer Q1: A). |
| REQ-003 | A fan-out lineage whose state log holds a terminal row with failed gates and no findings makes the merged verdict FAIL. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The orchestrator, on an @review pass with LOW confidence, surfaces the `Not checked:` line and re-dispatches once, and `orchestrate.md` stays at 600 lines or less. |
| REQ-005 | The quality card, crosswalk, debug scaffold and its playbook, council folder layout, prerequisites playbook and markdown agent no longer carry the stale lines named in Measured Behavior and Scope. |
| REQ-006 | The SC-002 probe from 014 is re-run with `--output-format stream-json` and its result is recorded, pass or not. |
| REQ-007 | After a blocked stop, a terminal record with no failed gate lets `synthesis_started` fold without error; the outcome is `converged` only when the stop reason is `converged`, and a failing record stays blocked. |
| REQ-008 | The council feature catalog, feature page and playbook name the agent `ai-council`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `(cd .skilled/skills/system-deep-loop/runtime && npm test)` shows no failure the baseline lacks, and the new schema and merge cases pass.
- **SC-002**: `rg -n 'proceed_to: gate_pre_synthesis|skip_to: gate_pre_synthesis' .skilled/commands/deep/assets/deep-review-confirm.yaml` shows every loop exit carrying `run_first: record_terminal_gates`.
- **SC-003**: `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 and `check-contract-drift.cjs` prints `OK`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 015's typed terminal event | Every fix here extends it | Built on origin/main `91c76c650d` |
| Risk | Widening the enum changes a frozen schema | Med | Consumers pass `stopReason` through as a string (`deep-review-state-contract.ts`, `reduce-state.cjs`); the census and parity suites rerun |
| Risk | `orchestrate.md` is at 599 of 600 lines | Med | Extend the existing @review checklist line instead of adding a line |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A: no runtime path changes its cost; each fix is a branch, a field or a line of text.
<!-- /ANCHOR:nfr -->


---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A lineage with a terminal row and no failed gates: kept, and the merge treats it as passing.
- A terminal record whose only non-pass gate is `unknown`: refused at append time with exit 1, so the workflow halts rather than passing.
- A confirm run that returns to the loop after `gate_pre_synthesis` and stops again: the newest record wins, as in 015.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | About 16 files, small edits each |
| Risk | 9/25 | A schema enum widening; agent text |
| Research | 4/20 | Done by the Fable 5.2 review |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator answered Q1 (record gates with stop reason `error`), Q2 (keep fix-by-default for `@debug`) and Q3 (surface and re-dispatch a LOW-confidence pass) on 2026-11-15.
<!-- /ANCHOR:questions -->

---


