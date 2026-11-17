---
title: "Implementation Summary: no redispatch of a landed iteration"
description: "Both workflow redispatch rules now skip the second dispatch when verification fails with a reason only a landed iteration can return, and tests pin the reasons, the rule wording and the still-fails end state."
trigger_phrases:
  - "no redispatch landed iteration"
  - "skip redispatch executor missing"
  - "landed iteration still fails"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration"
    last_updated_at: "2026-11-17T22:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Redispatch skip clause in both YAMLs; four suites pass 115; contracts regenerated; playbook DLR-063 and changelog v2.1.5.0 written at integration"
    next_safe_action: "Live walk of DLR-063 where verify returns executor_missing on a landed iteration; then the full runtime suite at the merge gate"
    blockers:
      - "A live run is needed where verify returns executor_missing on a landed iteration (DLR-063 walk)"
    key_files:
      - ".skilled/commands/deep/assets/deep-research.yaml"
      - ".skilled/commands/deep/assets/deep-review.yaml"
      - ".skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-no-redispatch-landed-iteration |
| **Completed** | 2026-11-17, code and tests. The full-suite rerun waits for the merge gate. The changelog entry was written at integration, and the playbook walk waits for a live run (see Known Limitations) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A verify failure with `executor_missing`, `findings_not_enumerated` or `ledger_backing_missing` no longer triggers the workflow's one redispatch. `verify-iteration.cjs` returns those reasons only after the narrative, state record and delta all exist, so the iteration has already landed, and a second leaf would refuse to overwrite it. Both `redispatch_once` rules now carry one shared clause, `Skip this redispatch when the failure reason is executor_missing, findings_not_enumerated or ledger_backing_missing.`, followed by the reason it holds. Both verify-step `command_note` lines name the same three reasons. Every other failure, route-proof included, still gets exactly one redispatch, and both rules still say `Never re-dispatch a given iteration more than once`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/deep/assets/deep-research.yaml` | Modified | Skip clause in `redispatch_once`, and the three reasons named in the verify `command_note` |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modified | The same clause, word for word, and the same `command_note` ending |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`, `deep-review.contract.markdown` | Regenerated | YAML digests refreshed by `compile-command-contracts.cjs --write` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts` | Modified | Two reason-table cases and a YAML-reading assertion over both rules |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-counters-derivation.vitest.ts` | Modified | Landed-then-error fixture for `deriveLoopCounters` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts`, `deep-review-state-reducer.vitest.ts` | Modified | Landed-then-error fixture for each reducer |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Ten one-change DeepSeek V4.1 Flash dispatches on the Mistral Vibe lane (`deepseek-flash`). The order was tests first, then the two rule edits, the two note edits and the three fixtures. Every `export.json` recorded `exit_code` 0 and `outcome` `finished`. The repository's Vibe hooks deny `node` and `vitest` inside the child, so each child made only its edit, and the orchestrator read every diff and ran every check itself. The status of the main checkout was compared before and after each dispatch, and no dispatch wrote outside its allowed path. The reducer end state was read from a native probe of today's code before those fixtures were briefed. The contract regeneration and all suite runs were native. Briefs are in `scratch/dispatch/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| One shared literal clause in both rules | The two rules differ today, so one literal lets one assertion pin both files (goal D1, REQ-002) |
| The three post-delta reasons, not only `executor_missing` | Operator decision ADR-001: all three mean the iteration landed. Phase 006 makes the research `findings_not_enumerated` gate live |
| Route-proof failures keep their redispatch | Operator decision OD-002 and REQ-005. The append-only corrected-record path depends on it |
| The still-fails end state is pinned, not changed | Operator decision OD-002. The error row still supersedes the landed record, so the run counts as a failure, as before |
| `verify-iteration.cjs` is untouched | Goal D1. The gate already tells the cases apart |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Four named suites | Pass | `verify-iteration`, `loop-counters-derivation`, `deep-research-reduce-state` and `deep-review-state-reducer`: 4 files and 115 tests passed. Baseline was 108, and the 7 new cases account for the difference |
| Fail before, pass after | Pass | The YAML assertion printed `2 failed \| 43 passed` on the pre-change YAMLs, failing on the missing literal, and passes after the two rule edits |
| Route-proof path (REQ-005) | Pass | `uses the latest record when an append-only redispatch added a corrected one` passes unchanged inside the four suites |
| Redispatch cap | Pass | `grep -c 'Never re-dispatch a given iteration more than once'` prints 1 for each YAML |
| Contract drift | Pass | `check-contract-drift.cjs` prints `OK commands=2`, and `check-contract-drift.vitest.ts` plus `stop-policy-yaml-parity.vitest.ts` pass 13 of 13 |
| YAML syntax | Pass | Both YAMLs load with a YAML parser |
| Reference docs | Pass | No skill, agent or command doc describes the redispatch rule (`rg -i 'redispatch\|re-dispatch'` over those trees), so none needed an update |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Full runtime suite (T006).** Not rerun in this worktree. It runs in the integration merge gate.
2. **Playbook scenario (T011) and changelog entry (T012).** Both were written at integration: DLR-063 and `changelog/v2.1.5.0.md`. The playbook walk is partly done. It ran the suites and the rule text, not a live dispatch, so T011 stays blocked.
3. **The rule is prose.** The orchestrator model reads the redispatch rule, so the tests pin its wording, not its behavior.
4. **Compiled contracts.** Phases 002 and 012 also edit both YAMLs, so the contracts are regenerated after each merge rather than merged by hand.
<!-- /ANCHOR:limitations -->
