---
title: "Deep Review Report — deep-context + deep-loop-runtime utilization (commits 1d54e45..55fd158)"
description: "10-round gpt-5.5-fast-xhigh deep review with adversarial verification; P0/P1/P2 rollup, refuted findings, and strongest-restriction verdict."
---

# Deep Review Report

<!-- ANCHOR:summary -->
## 1. Summary

**Target**: this session's deep-context (4th deep loop) + deep-loop-runtime utilization work — commits `1d54e45..55fd158`, ~28 changed code/contract files.
**Method**: 10 rounds. R1–R8 were read-only `cli-opencode openai/gpt-5.5-fast --variant xhigh` dispatches, one dimension/slice each (orchestrator-writes-state, Gate-3-safe). R9 was orchestrator-driven adversarial verification (direct code/contract inspection refuting or confirming each surviving P0/P1). R10 is this synthesis.

**Verdict (pre-remediation): FAIL.** Strongest-restriction rule — one confirmed P0 (`resolveArtifactRoot('context')`). The P0 is currently *latent* (the deep-context reducer is not wired into the loop) but becomes *live* the instant the reducer is wired, so it gates the headline parity fix.

**Headline finding (P1, architectural)**: the phase-002 reducer `deep-context/scripts/reduce-state.cjs` — which carries the atomic-state / jsonl-repair / post-dispatch-validate robustness that this whole effort added — is **never invoked by the loop YAML**. Both sibling loops wire their reducers (`deep-research` at lines 883/998, `deep-review` at 1077/1287); deep-context does not. The robustness features therefore run only in the standalone/benchmark path, not in the actual loop. The manual playbook's "25/25 PASS" verified the file's *contents* (`node --check` + `rg` for symbols), never its *invocation* — which is why this was missed and why the operator's "automatic utilization?" challenge was well-founded.

<!-- ANCHOR:tally -->
## 2. Finding tally (post-verification)

| Severity | Confirmed | Refuted/Downgraded | Notes |
|---|---|---|---|
| P0 | 1 | 4 (R7) | The 1 is latent-but-blocking; R7's 4 "P0" were host-binding false-positives |
| P1 | 13 | 3 (R7) | Includes the reducer-not-wired headline + 7 R8 doc/code mismatches |
| P2 | ~11 | — | Backlog (documented, not in the P0+hygiene+P1 fix scope) |

Severity counts are post-adversarial-verification (R9), not raw seat output.

<!-- ANCHOR:p0 -->
## 3. Confirmed P0

**P0-1 — `resolveArtifactRoot('context')` throws on child-phase packets.**
`system-spec-kit/shared/review-research-paths.cjs:14-22` — `MODE_CONFIG_FILE`/`MODE_STATE_FILE` have only `research`/`review` keys. `deep-context/scripts/reduce-state.cjs:661` calls `resolveArtifactRoot(resolvedSpecFolder, 'context')`. Root specs early-return before touching those tables (why the original smoke passed); **child-phase specs reach line 244 → `path.join(rootDir, undefined)` → `ERR_INVALID_ARG_TYPE`**. Reproduced in R1 against `134-deep-context-gathering/002-runtime-robustness-parity`.
- Live impact today: zero, because the reducer is not wired into the loop (see P1-1). Becomes loop-breaking the moment P1-1 is fixed.
- Fix: add `context: 'deep-context-config.json'` / `context: 'deep-context-state.jsonl'` to both mode tables (+ JSDoc `@param` union). Purely additive; zero risk to research/review.

<!-- ANCHOR:p1 -->
## 4. Confirmed P1

**P1-1 — phase-002 reducer not wired into the loop (headline).** `deep_start-context-loop_{auto,confirm}.yaml` never invoke `deep-context/scripts/reduce-state.cjs`. Sibling loops do. The loop instead host-writes the registry inline + `step_graph_upsert` (`upsert.cjs`). Result: atomic-state/jsonl-repair/post-dispatch-validate are not auto-utilized by the loop. Fix: add a deterministic `node …/deep-context/scripts/reduce-state.cjs {spec_folder}` refresh step before convergence in both YAMLs (mirror deep-research:883). Coupled with P0-1.

**P1-2 — `{spec_path}` unbound in lock acquire.** `deep_start-context-loop_auto.yaml:171` + `_confirm.yaml:162`: `loop-lock.cjs acquire … --packet {spec_path}`; only `spec_folder` exists in-file. Introduced this session. Fix: `{spec_folder}`.

**P1-3 — executor-audit guard env stamped but not enforced.** `deep-loop-runtime/scripts/fanout-run.cjs:452` builds the recursion-stack env via `buildExecutorDispatchEnv` but never calls `validateExecutorDispatchAllowed` (which exists at `executor-audit.ts:404` and is correctly used by the in-process dispatch paths at 587/664) before `spawn` (line 195). Introduced this session. Fix: call `validateExecutorDispatchAllowed` before spawn; reject/log blocked lineages.

**P1-4 — `dependencyCompleteness` collects the wrong edge endpoint.** `coverage-graph-signals.ts` (`computeContextSignalsFromData`) collects `edge.sourceId` for `DEPENDS_ON`/`IMPORTS`, but the authoritative contract (feature_catalog/06) documents `DEPENDS_ON: SYMBOL → DEPENDENCY` (DEPENDENCY is the **target**) and `IMPORTS: FILE → FILE` (never a DEPENDENCY endpoint). A DEPENDENCY node id is essentially never in the source set → `dependencyCompleteness` falsely low → depresses composite score / blocks STOP. `sliceCoverage`'s `sourceId` use is correct (COVERED_BY: SLICE→iteration, SLICE is source) — which is exactly why the bug is subtle. **This is on the LIVE convergence path** (the loop calls `convergence.cjs --loop-type context`). Fix: count `targetId` of `DEPENDS_ON` only; drop IMPORTS.

**P1-5 — `main()` unguarded in deep-improvement reducer.** `deep-improvement/scripts/shared/reduce-state.cjs:1326` is a bare `main();` (no `require.main === module` guard, no exports), unlike the deep-context reducer (guarded at 735, exports at 778). `require()` executes CLI logic + can `process.exit`. Fix: guard + export the API, mirroring deep-context.

**P1-6 — comment-hygiene HARD-BLOCK violations (7, introduced/committed this session).**
- `deep-improvement/scripts/shared/reduce-state.cjs`: `// M-3:` (416), `// P2 (DOCUMENT-ACCEPT, from F-P2-5):` (712), `// F-P1-5:` (900)
- `deep-improvement/scripts/shared/improvement-journal.cjs`: `Research finding (P0)` (18), `per research finding (P0)` (32), `NFR-R01` (159), `REQ-AI-003` (168)
Forbidden ID labels in code comments per the project HARD BLOCK. Fix: keep the durable WHY, strip the perishable IDs.

**P1-7 … P1-13 — R8 docs-vs-code mismatches (the docs over-claim what is wired):**
- `feature_catalog/07--runtime-robustness/loop-lock.md:22` — claims heartbeat refresh + cross-session prevention; the loop has acquire/release only, owner defaults to a short-lived pid, and `loop-lock.ts` treats dead pids as stale → advisory, not the mutual-exclusion the doc claims.
- `feature_catalog/07--runtime-robustness/executor-audit.md:3` — claims the dispatch stack is set "for each CLI seat"; the default council dispatcher (`multi-seat-dispatch.cjs`) does not stamp it, and only the `fanout-run.cjs` spawn path does (and even there the guard isn't enforced — P1-3).
- `feature_catalog/06--coverage-graph-schema/context-node-kinds-relations.md:52,53` — `COVERED_BY: SLICE → iteration` and `CONFIRMS: executor seat → …` reference node kinds (`iteration`, `executor/seat`) that don't exist in `VALID_KINDS.context`; edges require both endpoints to be coverage nodes → the documented edges can't be inserted as written.
- `feature_catalog/06--coverage-graph-schema/context-convergence-signals.md:46-49` — `reuseCatalogCoverage` (doc says ≥2 CONFIRMS; code counts ≥1 or `verified===true`), `agreementRate` (doc says relevance-gated denominator; code uses all finding nodes — see also P2), `relevanceFloor` (doc says MIN(relevance); code returns fraction ≥ gate), `dependencyCompleteness` (doc says resolved/expected-from-frontier; code does node-membership — see P1-4).
- `references/convergence.md:51,92` — composite score documented as a STOP gate (code uses it as telemetry; STOP is trace-threshold + host newAgreementEligible ratio); "all thresholds configurable in deep_context_config.json" but `evaluateContext` hardcodes them (0.7/0.6/0.5/0.5/0.7) and the config only carries `convergenceThreshold`/`relevanceGate`/`agreementMin`.

<!-- ANCHOR:refuted -->
## 5. Refuted / downgraded (R9 adversarial-verify)

gpt-5.5-fast (R7) assumed every `{placeholder}` must be declared inline. Verified against the battle-tested deep-research loop, these are the host-driven binding convention, not bugs:
- **`{session_id}`, `{generation}`, `{current_iteration}`, `{NNN}`** — host-bound loop variables; deep-research uses them identically without inline declaration. REFUTED.
- **`model: opus` "hardcoded"** — native seats are intentionally opus; by-model diversity comes from the CLI seat pool (`step_sweep_cli_pool`). deep-research is identical (native opus at 85/171/622, `{config.executor.model}` for CLI seats). REFUTED.
- **`{captured_owner_pid}` "not bound"** — bound via the `on_acquire` prose directive at auto:172 ("Capture ownerPid … reuse it for every release"). Host-driven binding; consistent with the loop model. DOWNGRADED to P2 (the deeper pid-liveness/advisory limitation is real but is the documented best-effort semantics).
- **`{relevance_gate}`/`{agreement_min}`/`{concurrency}` "not declared"** — sourced from `deep_context_config.json` (`relevanceGate: 0.55`, `agreementMin: 2`, `concurrency: 4`) and mapped at auto:250-253. DOWNGRADED to P2 (ensure a preflight step binds them from config).
- **`iter-{current_iteration}` subdirs "never created"** — host `mkdir -p` on write (convention); DOWNGRADED to P2 (add explicit mkdir for parity with deep-research:199).
- **confirm:601 convergence routing** — UNVERIFIED; depends on whether `gate_pre_synthesis` hydrates its own metrics. Left as P2 pending direct check.

<!-- ANCHOR:scope -->
## 6. Pre-existing (not introduced this session)

- `fanout-run.cjs:320` `--dangerously-skip-permissions` for cli-opencode (P1, security) — governed by the cli-opencode RM-8 four-layer mitigation; pre-existing.
- `fanout-run.cjs:397` raw `baseArtifactDir` traversal (P2) — pre-existing.

<!-- ANCHOR:remediation -->
## 7. Remediation plan

**Tier 1 — surgical, in P0+hygiene+P1 scope (apply + re-verify):** P0-1 resolver; P1-6 comment-hygiene ×7; P1-2 `{spec_path}`; P1-4 dependencyCompleteness; P1-5 main() guard; P1-3 executor-audit guard call.
**Tier 2 — parity (the headline; apply with verification):** P1-1 wire `reduce-state.cjs` into both context YAMLs before convergence (coupled with P0-1).
**Tier 3 — doc accuracy (P1-7…P1-13):** temper loop-lock/executor-audit claims; fix schema node-kind doc inconsistencies; align convergence-signal doc formulas to the (fixed) code; temper "configurable thresholds" + composite-score-as-gate.
**Tier 4 — P2 backlog (documented, deferred):** raw-line-prefix redaction ×3; agreementRate relevance-gating (code); shared CJS state-safety adapter; inline atomic dir-fsync; journal blank-line index; loop-lock main() guard; baseArtifactDir constraint; confirm:601 verify; preflight config binding; per-iter mkdir.

<!-- ANCHOR:verification -->
## 8. Verification gate (post-fix)

- `node --check` on every changed `.cjs`.
- `deep-loop-runtime` vitest green (no regression).
- comment-hygiene grep returns zero forbidden-ID comments in the two deep-improvement files.
- `resolveArtifactRoot(childPhase, 'context')` returns a path (no throw).
- `dependencyCompleteness` unit behavior: a DEPENDS_ON edge with a DEPENDENCY target marks that node resolved.
- `validate.sh --strict` PASSED on packet 135.

<!-- ANCHOR:remediation-applied -->
## 9. Remediation applied (post-review)

Per the operator's directive, the confirmed P0 + comment-hygiene + P1s were fixed and re-verified in the same pass.

**Fixed**
- **P0-1** — added `context` keys to `MODE_CONFIG_FILE`/`MODE_STATE_FILE` in `review-research-paths.cjs` (+ JSDoc union). Child-phase `resolveArtifactRoot(…, 'context')` no longer throws.
- **P1-1** — wired `reduce-state.cjs {spec_folder}` into `step_update_registry` in both context YAMLs (replacing the host-inline write), so the phase-002 reducer (atomic-state / jsonl-repair / post-dispatch-validate) is now auto-utilized every iteration, at parity with deep-research/deep-review.
- **P1-2** — `{spec_path}` → `{spec_folder}` in both context-loop lock acquires.
- **P1-3** — `fanout-run.cjs` now enforces the recursion guard before spawn via `detectSameKindFromStack` on the inherited `SPECKIT_CLI_DISPATCH_STACK`. NOTE: the reviewer's literal suggestion (`validateExecutorDispatchAllowed`) was rejected during R9 — its runtime-env layer (`OPENCODE_SESSION_ID`) would false-positive on the legitimate first-level dispatch from an OpenCode-hosted orchestrator. Stack-layer-only is the correct, false-positive-free guard.
- **P1-4** — `dependencyCompleteness` now counts `targetId` of `DEPENDS_ON` (DEPENDENCY is the edge target per contract); IMPORTS dropped (FILE→FILE, no DEPENDENCY endpoint).
- **P1-5** — `deep-improvement/scripts/shared/reduce-state.cjs` `main()` wrapped in `require.main === module` + module API exported.
- **P1-6** — 7 comment-hygiene HARD-BLOCK labels removed across `reduce-state.cjs` (M-3, F-P2-5, F-P1-5) and `improvement-journal.cjs` ((P0)×2, NFR-R01, REQ-AI-003); durable WHY preserved.
- **P1-7…P1-13** — doc accuracy: tempered loop-lock heartbeat over-claim (+ the YAML lock note); corrected executor-audit doc to the real fanout-run enforcement point + stack-only rationale; rewrote 4/5 convergence-signal formulas to match code; corrected `evaluateContext` export naming + composite-score-as-telemetry; corrected the "all thresholds configurable" claim (graph STOP thresholds are hardcoded in `evaluateContext`); reworded COVERED_BY/CONFIRMS relations to be FK-consistent (no non-existent `ITERATION`/`SEAT` node kinds) + added the FK constraint note.

**Re-verification**: deep-loop-runtime vitest 291/291; `node --check` on all 5 changed `.cjs`; comment-hygiene grep clean on both in-scope files; child-phase `reduce-state.cjs` end-to-end (no throw, `stateSafety: "runtime"`); dependencyCompleteness behavioral check (1/0/0); recursion-guard behavioral check (top-level allowed / nested blocked); `validate.sh --strict` PASSED on packet 135.

**Updated verdict: CONDITIONAL-PASS.** The blocking P0 is fixed and all P1s are resolved or made accurate-by-documentation. Residual items are non-blocking backlog.

**Residual backlog (deliberately deferred, not in the P0+hygiene+P1 fix scope)**
- All §7 Tier-4 P2s (raw-line-prefix redaction ×3; agreementRate relevance-gating in code; shared CJS state-safety adapter; inline atomic dir-fsync; journal blank-line index; loop-lock `main()` guard; baseArtifactDir constraint; confirm:601 routing verify; preflight config binding; per-iter mkdir).
- **Schema-vs-relations design follow-up (P1-grade, made safe-by-docs)**: `coverage_edges` enforces FK on both endpoints with `PRAGMA foreign_keys = ON`, but there is no ITERATION/SEAT node kind. COVERED_BY/CONFIRMS must therefore use real-node endpoints + metadata (now documented). A deliberate fix (add node kinds with a SCHEMA_VERSION bump, or move sliceCoverage to node metadata) is deferred — it is a design decision with migration implications, not a surgical defect.
- **Pre-existing comment-hygiene (out of scope)**: `deep-improvement/scripts/shared/{materialize-benchmark-fixtures,promote-candidate,mutation-coverage}.cjs` + two vitest files carry forbidden-ID comments (`F017-*`, `REQ-AI-*`, `M-3`) from earlier packets (017/018/121). Not in this review's changeset; flagged for a separate hygiene-cleanup pass.
