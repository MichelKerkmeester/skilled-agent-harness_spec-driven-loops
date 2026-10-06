# Iteration 001 — Deep-Review Lineage swe2-max

- **Iteration:** 1 of 10
- **Dimension:** correctness
- **Focus:** `.skilled/commands/deep/` — deep-loop workflow machinery (highest blast radius in the steer focus area): the v4.0.0.3 ledger-gateway cutover in the four workflow YAMLs and its interaction with the append gateway's input classifier.

## Sources reviewed

- `review/lineages/swe2-max/steer.md` (lead steer, re-read before this iteration)
- `.skilled/commands/deep/assets/deep-review-auto.yaml` — state_write_protocol (L97-117), `append_jsonl` call sites (L332, 341, 625, 641, 784, 1010, 1018, 2370), `if_cli_opencode` dispatch branch (L1299-1461), synthesis `step_convergence_report` drain (L2293-2322)
- `.skilled/commands/deep/assets/deep-review-confirm.yaml` — v4.0.0.2..v4.0.0.3 diff: lock nonce plumbing, `step_create_state_log` gateway conversion, `step_marker_scan` self-match fix (L1091-1113), detached-opencode note (L2005)
- `.skilled/commands/deep/assets/deep-research-auto.yaml` / `deep-research-confirm.yaml` — diff: `pinned_bookkeeping` + `bookkeeping_log` directive introduction, `step_create_state_log` gateway conversion, `min_iterations_guard_already_passed` redefinition
- `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` — `normalizeMode` (L90-95), input classifier (L355-464), exit-code mapping (L512-524)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts` — data/scope rules (L292-321, 408-484, 489-554), `upcasters: []` (L980)
- `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts` — stem→legacy-row projection (L100-258)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-review-reducers/deep-review-reducer.ts` — convergence backbone (L1105-1234)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` — `PINNED_LEGACY_EVENTS` (L45-90)
- `git diff v4.0.0.2..v4.0.0.3` for all four YAMLs (534 insertions across 14 files in `commands/deep/`)

## Findings by severity

### P0 Findings

None.

### P1 Findings

1. **Every review-mode event append is unroutable: the gateway has no legacy-row path for `deep-review`, so all `type:"event"` `append_jsonl` directives exit 1 and write nothing.**

   `state_write_protocol.applies_to` (`deep-review-auto.yaml:100`) routes every `append_jsonl`/`append_to_jsonl` directive through `append-mode-event.cjs --mode review`. The gateway normalizes `review` → `deep-review` (`append-mode-event.cjs:94`), then classifies input shape (L355-464): stem envelopes, `event_type` envelopes, a legacy upcaster gated on `normalizedMode === 'deep-research'` (L396), and a `type === 'iteration'` passthrough gated on `'deep-review'` (L442). A legacy `{"type":"event","event":"graph_convergence",...}` row matches none of these and hits `throw 'Unrecognized event format'` (L463) → `RUNTIME_ERROR` → exit 1 (L523).

   Affected call sites in `deep-review-auto.yaml`: `resumed` (L332), `restarted` (L341), `config_warning` (L625), `graph_convergence` (L641), `blocked_stop` (L784), `userPaused` (L1010), `stuckRecovery` (L1018), `lock_released` (L2370) — plus the same directives in `deep-review-confirm.yaml` (e.g. `graph_convergence` L647, `lock_released` L1893). The review schema registers no upcasters (`deep-review-ledger-schema.ts:980`) and the research `pinned_bookkeeping` escape hatch was never added to the review YAMLs.

   Concrete failure scenario: a `stopPolicy: convergence` run reaches `step_graph_convergence` at iteration 1 closeout; the append exits 1. On a host that treats non-zero directive exit as step failure the loop dies at the first convergence append; on a host that logs and continues, every `graph_convergence` row is silently absent from `deep-review-state.jsonl`, so the legacy reducer's `graphConvergence`/`graphDecision` never populate (defaults per state-format: `graphDecision: null`), `blocked_stop`/`userPaused`/`stuckRecovery` events leave no durable trace, and `resumed`/`restarted` lineage evidence is dropped — while `state_write_protocol` L114-117 asserts these rows are "canonical ledger events like every other record". The research workflows fixed the same class of defect by pinning those rows to `bookkeeping_log`; review workflows got neither pin-list nor stem-form rewrites.

   Claim adjudication: hypothesis confirmed by direct code trace (classifier branches enumerated, exit path read, schema upcast list empty, all 8 call sites enumerated). Counterevidence sought: checked for a review-side `bookkeeping_log`/pinned list (none exists) and for a legacy fallback in the review branch (only `type:'iteration'` is special-cased). Residual uncertainty: host tolerance of exit 1 (halt vs. continue) varies the blast radius between "telemetry loss" and "loop abort"; both outcomes are defects.

2. **Orphaned `deep_review.recovery_baseline` staging in the opencode dispatch branch: the event file is written into a `mktemp` dir that nothing drains.**

   `deep-review-auto.yaml:1299` creates `EVENT_DIR` inside `if_cli_opencode`; the node script writes `01-recovery_baseline.json` (L1401-1411) under the comment "staged as a canonical ledger event for the wrapper below to append" (L1398), then `process.exit(runAuditedExecutorCommand(...))` ends the command — no drain follows (the only drain left in the file belongs to `step_convergence_report` at ~L2309, a different `EVENT_DIR` in a different step). The `deep_review.recovery_baseline` stem is registered (`deep-review-ledger-schema.ts:415-420`) and the projection would carry it, so the row is valid — it is simply never sent.

   This is carried-forward dead staging rather than a clean regression: at v4.0.0.2 the only drain loop sat inside `if_cli_codex`'s command block, where `EVENT_DIR` was never set (each `command:` runs in its own shell), so the old drain was already dead code and the opencode baseline was already orphaned. v4.0.0.3 deleted the dead drain but left the writer, and `deep-review-confirm.yaml:2005` still documents the staging as the detached-opencode recovery mechanism.

   Concrete failure scenario: an opencode dispatch crashes mid-iteration after mutating state; the recovery flow expects a baseline commit in the ledger/state log (the opencode prompt requirement at L1467 says "append the recovery-baseline commit to state_log"), but the only copy sits in an unreferenced `${TMPDIR}/deep-review-baseline.XXXXXX` dir — no recovery anchor is durable, and each opencode dispatch leaks a tempdir.

   Claim adjudication: confirmed by reading both the current file (no drain in the dispatch branch) and `git show v4.0.0.2:...` (drain existed only in the codex branch where `EVENT_DIR` was unset). Downgraded from P1→kept P1 because the contract text asserts a delivered event that never lands — incomplete implementation, not a style nit.

### P2 Findings

1. **`deep-review-confirm.yaml` header contract claims event rows are "canonical ledger events" while they are emitted in legacy shape** (`deep-review-auto.yaml:114-117` names the migration marker, recovery baseline, iteration-error row and claim-adjudication gate row; the directives emit bare `{"type":"event",...}` JSON). Combined with P1-1 this is a doc/code contract mismatch even where behavior is tolerated.

2. **Steer-flagged wording gap (pre-ruled by lead):** `SKILL.md` NEVER rule 6 ("config read-only after init") vs `deep-review-auto.yaml:2322-2325` `step_update_config_status` writing `status: complete`. Logged as a wording ambiguity per steer; behavior is correct (terminal status flip is the workflow's own step).

## Traceability checks

- `spec_code`: `state_write_protocol.applies_to` asserts all append directives route through the gateway; traced each directive's rendered shape against the gateway classifier — mismatch confirmed for all `type:"event"` rows.
- `skill_agent`: leaf-agent contract requires canonical `{"type":"iteration"}` records — verified compatible (gateway L442 passthrough and `iteration_recorded` schema `data.record: 'json'` accept the whole record and project it back unchanged at `deep-review-state-contract.ts:213-222`).
- `checklist_evidence`: steer-required evidence (file:line + failure scenario) present for both findings.
- Verified in-release provenance: P1-1 introduced by the v4.0.0.3 cutover (v4.0.0.2 wrote the state log directly); P1-2 predates the release but sits inside the touched hunk set, so it is reported rather than excluded.

## Edge cases examined

- Exit-code semantics: exit 1 (`RUNTIME_ERROR`) vs exit 2 (refusal) — only exit 2 is a declared halt; exit 1 leaves hosts to decide. Both branches produce missing telemetry; the halt branch additionally kills the run.
- `graphDecision === null` does NOT hard-block the ledger-path stop rule (`deep-review-reducer.ts:1222` only blocks on `'blocked'`), so the canonical reducer degrades gracefully — the durable-loss harm lands on the legacy projection/registry and on lineage telemetry, not on a hidden hard-veto.
- Research mode is not affected: its legacy rows either upcast or are pinned to `bookkeeping_log` by name (`legacy-compatibility.ts:45-90`); verified `pivot_confirm_accepted`/`manualStop`/`dry_run_halt` have no stem and no pin — bookkeeping routing avoids a spurious exit-1, consistent with the new `refusal_handling` text.
- `min_iterations_guard_already_passed` redefinition (`iteration_count - 1 >= effective_min_iterations`) is the necessary arithmetic replacement now that `min_iterations_guard_pass` is never persisted; self-consistent.

## Ruled-out directions

- `step_marker_scan` own-header fix (`deep-review-confirm.yaml:1091-1113`): correct — own canonical header excluded from `nested_marker_pattern`; verified no false-positive remains for review prompts beginning `DEEP-REVIEW`.
- Lock `acquireNonce` plumbing (confirm/auto YAMLs): thread-through is consistent; verified all release call sites pass `--nonce`.
- `step_create_state_log` gateway conversion (both review + research YAMLs): shape matches schema (`target` closed-shape, lineage mode map); empirically reproduced against this lineage's run directory — append succeeded.
- Synthesis closeout drain (`deep-review-auto.yaml:2309+`): drain loop present and correctly exits on non-zero gateway status.

## Next focus

Iteration 2 — correctness on `sk-git` scripts/hooks (release-touched shell machinery; the steer allows expansion beyond `commands/deep` once the high-blast-radius seam is mapped).

Review verdict: CONDITIONAL
