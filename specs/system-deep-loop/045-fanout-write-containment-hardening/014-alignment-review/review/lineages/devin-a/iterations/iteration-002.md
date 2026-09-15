# Iteration 2: Deep-Loop Command Alignment

## Focus

Lane 4 of the packet spec: the command YAMLs and presentation assets under `.opencode/commands/deep/assets/` and the compiled contracts under `assets/compiled/` against the runtime scripts they invoke and the references they digest.

Files reviewed:
- `.opencode/commands/deep/assets/deep-review-auto.yaml` (state_write_protocol lines 97-135, step_fanout_spawn_cli lines 235-242, header 1-5)
- `.opencode/commands/deep/assets/deep-review-confirm.yaml` (header 1-5, step_fanout_spawn_cli lines 199-206)
- `.opencode/commands/deep/assets/deep-research-auto.yaml` (step_fanout_spawn_cli lines 220-228)
- `.opencode/commands/deep/assets/compiled/deep-review.contract.md` (lines 162, 225, 265, 277, 288)
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (lines 191-205, 727-754, 2910, 3166-3170)
- `.opencode/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` (whole-file scan for projection refresh)
- `.opencode/skills/system-deep-loop/runtime/scripts/append-state-record.cjs` (header)
- `.opencode/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` (lines 98, 101, 113, 139)

## Scorecard

- Dimensions covered: correctness, traceability
- Files reviewed: 8
- New findings: P0=0 P1=2 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.85

## Findings

### P1, Required

- **F003**: Prompt-pack template and workflow YAML contradict each other on the state-log write mechanism, `.opencode/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl:98,101,113,139` vs `.opencode/commands/deep/assets/deep-review-auto.yaml:97-135`. The prompt pack tells the leaf that `deep-review-state.jsonl` is "a read-only projection the gateway refreshes from the ledger" and that "writing `{state_paths_state_log}` directly instead, fails the iteration". The workflow YAML's `state_write_protocol` says the opposite: the gateway "does NOT refresh this mode's legacy state file: no projection contract is registered for this mode", and "the existing direct writes must stay until a projection contract exists for it". `append-mode-event.cjs` contains no state-log/projection-refresh code at all (grep for `deep-review-state`/`state_log` in the script: zero hits outside the header). A leaf following the prompt pack alone would skip the direct write and leave the runner's state-log validation with missing iteration records (or double-write, the exact failure `fanout-run.cjs:727-754` already tolerates: "Two independent executor models recorded every iteration twice, once by writing the state log directly and once through the append gateway"). Dimension: correctness.

- **F005**: The three command YAML fan-out call sites never forward `--convergence-mode` to `fanout-run.cjs`, `.opencode/commands/deep/assets/deep-review-auto.yaml:235-242`, `.opencode/commands/deep/assets/deep-research-auto.yaml:220-228`, `.opencode/commands/deep/assets/deep-review-confirm.yaml:199-206`. The runner reads the flag (`fanout-run.cjs:2910` `normalizeConvergenceMode(args.convergenceMode)`), the compiled contract documents it (`compiled/deep-review.contract.md:265` `--convergence-mode=default|off|sliding-window|divergent -> antiConvergence.convergenceMode = value`), and `fanout-run.cjs:191-205` carries a comment describing this exact gap ("the runner never read the flag, so every lineage silently took the default while the caller believed convergence was disabled") — but the fix landed only on the runner side; no caller passes the flag. Operator-set `convergenceMode=off` is silently dropped in fan-out mode. The confirm variant additionally drops `--convergence-threshold` and `--stop-policy` (only 4 flags passed). Dimension: correctness.

### P2, Suggestion

- **F004**: Duplicated banner comment block at the top of both deep-review workflow YAMLs, `.opencode/commands/deep/assets/deep-review-auto.yaml:1-5` and `.opencode/commands/deep/assets/deep-review-confirm.yaml:1-5` ("DEEP REVIEW: AUTONOMOUS DEEP REVIEW LOOP (AUTO MODE)" + divider appears twice). The deep-research YAMLs do not have this duplication. Cosmetic; suggests an incomplete banner edit. Dimension: maintainability.

## Claim Adjudication

### F003 (P1)

```json
{
  "findingId": "F003",
  "claim": "The shipped deep-review prompt pack instructs leaves that deep-review-state.jsonl is a gateway-refreshed read-only projection and direct writes fail the iteration, while the workflow YAML's state_write_protocol and the gateway script itself contradict that (no projection refresh exists).",
  "evidenceRefs": [
    ".opencode/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl:98",
    ".opencode/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl:101",
    ".opencode/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl:113",
    ".opencode/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl:139",
    ".opencode/commands/deep/assets/deep-review-auto.yaml:97-135",
    ".opencode/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:6",
    ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:727-754"
  ],
  "counterevidenceSought": "Grepped append-mode-event.cjs for state-log path writes, projection refresh, or deep-review-state references (none found); read the auto and confirm YAML state_write_protocol blocks (both say no projection contract); checked the runner's duplicate-record tolerance comment as live evidence of the double-write failure mode.",
  "alternativeExplanation": "The prompt pack may have been written ahead of a planned projection-contract cutover; but the YAML explicitly says 'It is not yet a live cutover', so the prompt pack describes future state as current — rejected as an explanation for shipping both.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If append-mode-event.cjs gains a projection-refresh contract for review mode AND the prompt pack becomes true (or the YAML's direct-write exemption is removed), downgrade to P2 documentation drift.",
  "transitions": [{"iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery"}]
}
```

### F005 (P1)

```json
{
  "findingId": "F005",
  "claim": "The three deep-loop YAML fan-out call sites do not forward --convergence-mode to fanout-run.cjs, so an operator-set convergence mode is silently dropped in fan-out mode.",
  "evidenceRefs": [
    ".opencode/commands/deep/assets/deep-review-auto.yaml:235-242",
    ".opencode/commands/deep/assets/deep-research-auto.yaml:220-228",
    ".opencode/commands/deep/assets/deep-review-confirm.yaml:199-206",
    ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2910",
    ".opencode/commands/deep/assets/compiled/deep-review.contract.md:265",
    ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:191-205"
  ],
  "counterevidenceSought": "Checked every fanout-run.cjs invocation site in all four deep-* YAMLs (grep fanout-run.cjs): none passes --convergence-mode; verified fanout-run.cjs reads convergenceMode only from args, with no fallback to the fan-out config JSON's antiConvergence block.",
  "alternativeExplanation": "The leaf config could carry convergence mode via the fan-out config JSON — but the runner's buildLoopPrompt injects config.convergenceMode only from options.convergenceMode (fanout-run.cjs:1454-1455), and no per-lineage convergenceMode field exists in config.fanout.executors.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If any YAML call site starts passing --convergence-mode (or the runner reads antiConvergence from the fan-out config JSON), downgrade to P2 stale-doc.",
  "transitions": [{"iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery"}]
}
```

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | prompt-pack-iteration.md.tmpl:101,113 vs deep-review-auto.yaml:97-135 | Shipped command assets contradict each other on the state-write mechanism (F003); documented flag dropped at fan-out call sites (F005) |
| checklist_evidence | notApplicable | hard | - | No checklist.md in target packet |

## Assessment

- New findings ratio: 0.85 (2 P1 + 1 P2; weighted 11 of accumulated 13)
- Dimensions addressed: correctness, traceability
- Novelty justification: first pass over command assets; F003/F005/F004 all first-seen
- Verdict mapping: P1 present (no P0) -> CONDITIONAL

## Ruled Out

- Compiled-contract digest mismatch: compiled/deep-review.contract.md:265 documents `--convergence-mode` and the runner accepts it — the contract is not stale; the call sites are. Not a separate finding.
- Gateway refusal behavior: exit-2 refusal paths exist in append-mode-event.cjs (lines 228-320); the YAML's refusal_handling matches. Only the projection claim is wrong.

## Dead Ends

- Full read of deep-review-auto.yaml beyond line 308 (single-executor branches): deferred — fan-out path is the one exercised by this run and the lane scope; single-executor buildLineageCommand sites (lines 1567, 1657, 1747) do forward convergence-mode per fanout-run.cjs:1523 and are not part of F005.

## Recommended Next Focus

Iteration 3: deep-loop agent alignment — compare `.opencode/agents/deep-research.md`, `deep-review.md`, `deep-improvement.md`, `orchestrate.md` against their `.claude/agents/`, `.codex/agents/`, `.pi/agents/` mirrors, and against the command contracts' agent expectations (tools, permissions, LEAF constraints, route-proof fields).

Review verdict: CONDITIONAL
