# Deep-Review Report — lane wave1-glm (angles 6-10)

Loop: deep-review · Mode: review · Session: `fanout-wave1-glm-1789465945073-px9i6h` · Model: glm-5.3-flash (reasoningEffort max) via the llmgateway on cli-pi · Executed: 2026-09-15, 5 iterations, 11:10-11:30Z (final) · Synthesis: 2026-09-15T11:30:39Z · Stop: maxIterationsReached (5/5, `stopPolicy: max-iterations`, `convergenceMode: off`)

---

## 1. Executive Summary

- **Overall verdict: CONDITIONAL** — 2 active P1 (F001, F019), no active P0.
- **hasAdvisories: true** — 18 active P2 advisories.
- **Active counts: P0 0 · P1 2 · P2 18** (20 active, 0 resolved; 0 corruption warnings across 5 reductions).
- **Review scope**: the fifth of two wave-one lanes — angles 6-10 of the target packet `specs/system-deep-loop/049-deep-loop-alignment-review/001-angle-driven-review`, one angle per iteration: (6) the deep-loop command-YAML pair + presentation against their runtime/prompt packs; (7) the 48-block agent-mirror declaration matrix across `.opencode/.claude/.codex/.pi`; (8) cross-CLI executor parity over 5 surfaces; (9) the containment system (detect→quarantine→remedy→ledger→merge); (10) the state/ledger write path as one system. Every finding cites file:line; the lane's finding IDs are LINEAGE-SCOPED (namespace by sessionId at the SC-001 merge — the twin lane `wave1-deepseek` runs F001-F0nn independently and the IDs collide until namespaced).

## 2. Planning Trigger

`/speckit:plan` **IS required** — 2 active P1 and 18 P2 advisories demand remediation phases under the parent. ThePlanning Packet:

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": 20,
  "remediationWorkstreams": [
    "W1 (P1) confirm-variant gateway/protocol repair: F019 — widen the review-mode legacy acceptance (append-mode-event.cjs:398) OR re-emit confirm:1276/:1282 as the auto:1938 stem OR amend both applies_to clauses; retires F003's mechanism split",
    "W1b (P1) confirm-variant line-1 config repair: F001 — bind the --no-resource-map flag and stopPolicy in the confirm variant, or annotate the hardcode as the confirm-tier contract",
    "W2 (P2) cutover preparation: F020 — the deep_review.migration producer, the Phase-5 divergence rehearsal, the :280 wording; F002 the reducer_artifact_arg binding; F017 the one enforcement-authority statement",
    "W3 (P2) confirm-variant parity: F002, F007, F008, F018",
    "W4 (P2) agent-mirror contract: F009-F013 (one crosswalk, the model-attraction decision, the budget single-sourcing)",
    "W5 (P2) executor-parity mechanization: F014-F016",
    "W6 (P2) comment/provenance hygiene: F004, F005",
    "W7 (P2) severity-vocabulary alignment: F006 (spec.md is the 4-tier outlier)"
  ],
  "specSeed": "under specs/system-deep-loop/049-deep-loop-alignment-review/: a remediation phase binding these 20 findings per REQ-003 (each verified against the tree — all 20 carry file:line — bound to a parent phase or recorded refuted-with-reason); wave-two REQ-002 duty: the angles 11-20 rewritten from THESE findings before wave two launches (candidate rewrites: the research-variant pair; the dispatched-agent runtime layers and the four overlays; the authority-flip write-side; the confirm-variant execution record; angle-8's timeout VALUES and 4 unseen stress trees; angle-9's third validator; angle-7's .pi body order and ai-council permission tail)",
  "planSeed": [
    "1. F019: pick the repair arm (widen :398 | re-emit :1276/:1282 | amend the applies_to clauses) + gate: one confirm-variant rehearsal of its adjudication step through the gateway",
    "2. F020: the legacy→ledger migration emitter + the Phase-5 copy-diverge rehearsal + the :280 wording; bind F002's reducer_artifact_arg",
    "3. F001/F002: the confirm line-1 config bindings or their documented-contract annotations",
    "4. F008/F018: restore-or-annotate the 12 omitted steps; wire (or verbally assign) the verify-iteration gate in :confirm",
    "5. F009-F013: one cross-runtime declaration crosswalk + the model-attraction decision + the budget-profile single source with ONE enforcement point",
    "6. F014-F016: the mechanized 5-surface divergence fixture + the prevents-map/permission-mode reconciliation + allowlist validation dates",
    "7. F004/F005/F006: the comment/provenance hygiene sweep + the severity-vocabulary convergence (amend spec.md:83,135)"
  ],
  "findingClasses": ["gateway-legacy-acceptance-variant-split", "ledger-authority-cutover-cliff", "confirm-variant-config-record-drift", "reducer-artifact-arg-omission", "cross-variant-persistence-mechanism-divergence", "stale-containment-branch-comment", "stale-provenance-line-reference", "severity-scale-vocabulary-mismatch", "cross-variant-git-policy-swap", "confirm-variant-step-omissions", "sampling-config-translation-loss", "permission-deny-translation-dialects", "tool-lexicon-crosswalk-undocumented", "leaf-contract-schema-drift", "model-attraction-unowned", "sandbox-claim-vs-mechanism-asymmetry", "allowlist-rotation-unguarded", "parity-agreement-unmechanized", "containment-promise-chain-divergence", "mechanical-gate-invocation-asymmetry"],
  "affectedSurfacesSeed": [
    ".opencode/commands/deep/assets/ (both deep-review variant YAMLs)",
    ".opencode/skills/system-deep-loop/runtime/ (mode-append-gateway, deep-review-ledger-schema, verify-iteration.cjs, fanout-run.cjs, deep-loop/executor-config.ts, deep-loop/write-containment.ts)",
    ".opencode/agents/ + the .claude/agents, .codex/agents, .pi/agents mirrors",
    "specs/system-deep-loop/049-deep-loop-alignment-review/001-angle-driven-review/spec.md (the severity vocabulary, :83/:135)"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

Unified registry of all 20 active findings. The two this-iteration findings carry the full 12-field treatment; the 18 prior findings are carried in compact recapitulation form — their authoritative 11-field records (evidence, recommendation, disposition, findingClass, scopeProof, affectedSurfaceHints) live verbatim in the iteration records (state-log lines 2, 4, 6, 8, 10) and their deltas; nothing here infers beyond them.

- **F019 (P1, gateway-legacy-acceptance-variant-split)** — *The confirm variant persists its adjudication as a flat legacy record the review-mode gateway refuses: the shared protocol's own mandate fails mechanically.* [SOURCE: deep-review-confirm.yaml:1276, :1282; deep-review-auto.yaml:1938, :1954; append-mode-event.cjs:398-408, :444-445; confirm:99 / auto:100; the ×12-vs-×2 invocation census]. Dimension: correctness. Evidence: the two variants persist the same event in two dialects (auto = the dotted stem the gateway's stem path admits; confirm = a flat row with no stem/envelope) while the gateway's legacy-record branch admits deep-research ONLY — everything else throws `Unrecognized event format` at :445 — and BOTH variants' `state_write_protocol.applies_to` claims EVERY directive while the census wires the gateway 12× in auto against 2× in confirm. Impact: a confirm lane honoring its own transport mandate exits 2 (refuse-and-halt) at its own adjudication step; neither variant satisfies the clause it shares. Fix: widen :398 to deep-review + a review upcaster, OR re-emit :1276/:1282 as the auto:1938 stem, OR amend both applies_to clauses to the steps actually wired. Disposition: finding (active); confidence 0.75; the full 7-field adjudication packet with counterevidence and downgradeTrigger: iterations/iteration-005.md. scopeProof: the review-variant pair only; the research variant holds the legacy branch and is the exemption's beneficiary. affectedSurfaceHints: confirm-variant runs; the review-mode append gateway; both variants' state_write_protocol clauses. Also: terminates F003 (linkage, recorded in this iteration's scopeProof — the registry transition is the parent's).
- **F020 (P2, ledger-authority-cutover-cliff)** — *28 of 31 registered stems have no producer, the operative dialect never reaches the ledger, and the cutover cliff is pre-armed.* [SOURCE: the 4-variant+runner producer census (dotted emissions: migration ×2, claim_adjudication ×2 — the UNREGISTERED variant —, recovery_baseline ×1, iteration_error ×1; runner ZERO); deep-review-ledger-schema.ts:995; verify-iteration.cjs:152-153, :193-213, :280; append-mode-event.ts:288, :457-459, :133-149; this lineage's two 1-frame ceremony ledgers]. Dimension: security (primary) + correctness. Evidence: the 31-stem closed-shape vocabulary (exact-fields, 64-hex digests, sha256 chaining) guards a four-stem yield; the ledger-backing gate returns not-enforced until authority flips — BOTH wave-one lanes passed 4-5 iterations with no mode ledger on disk; the ceremony armed the ledger story exactly once (the audit frame: decision allow, fence_token 1, legacy_authoritative, 2026-09-15T09:52:29.841Z) and froze; the authoritative store is the UNVALIDATED one while the strongly-validated one is unemployed; at flip, (a) every legacy iteration fails ledger_backing_missing unless migrated and (b) the Phase-5 projection refresh REPLACES the state file from the ledger — this lane's line-1 config (the SC-001 attribution) collapses to the thin 4-field projection. Impact: dormant today (4×2 clean iterations, zero corruption warnings); the WHEN bounded by the untraced flip write-side. Fix: the migration emitter (the producerless `deep_review.migration` is the natural vehicle) + the copy-diverge rehearsal + the :280 wording. Disposition: finding (active); confidence 0.8. scopeProof: this lineage's ceremony frames + 9-row log as the live specimen + the gateway/gate/schema sources; also closes F017. affectedSurfaceHints: both lanes' state logs at cutover; the projection phase; the authority-flip activation path.
- F001 (P1, confirm-variant-config-record-drift) — *Confirm variant line-1 config record diverges from auto: flag ignored, stopPolicy dropped, resource_map_present unbound.* [deep-review-confirm.yaml:412, :422 vs auto:454-467]. Dimension: traceability. Impact: the "config and state_log agree from line 1" invariant is auto's declaration, mechanically unbacked in confirm. Fix: bind the parsed flag/stopPolicy or annotate the hardcode as the confirm-tier contract (the presentation's tier-2/3 setup is the recorded downgradeTrigger). Disposition: active.
- F002 (P2, reducer-artifact-arg-omission) — *Confirm reducer invocation drops reducer_artifact_arg; artifact root silently defaults.* [confirm:1546 vs auto:2176]. Dimension: correctness. Impact: latent wrong-root if confirm ever gains an artifact override (zero occurrences of the token in confirm). Fix: port step_bind_reducer_artifact_arg or document the default-only contract. Disposition: active. (Workstream: W2/W3.)
- F003 (P2, cross-variant-persistence-mechanism-divergence) — *Same claim_adjudication event persisted through two mechanisms with different shapes; scanner contract names only the flat-row shape.* [auto:1938/:1539-1540 vs confirm:1270/:1276; scanner auto:560]. Dimension: traceability. **ANSWERED at iteration 5 — see F019; the mechanism split was the mode-gated legacy acceptance.** Closure (bind-or-refute) = the parent's, per REQ-003. Disposition: active (answer recorded).
- F004 (P2, stale-containment-branch-comment) — *Four copy-pasted containment comments: codex residue in three non-codex branches; promised fail-closed resolves to advisory-only at these call sites.* [auto:1515/1565/1655/1745, :1528-1538; the real fail-closed: fanout-run.cjs:2452-2458]. Dimension: correctness. Impact: a reader trusts the comment, not the mechanism — now doubly-arched by F017/F020 (the promised ceremony ran once, at dispatch). Fix: the one authority statement (F017's recommendation) retires these. Disposition: active.
- F005 (P2, stale-provenance-line-reference) — *Stale provenance: auto:454 cites deep-review.md:71 which now renders the table separator.* Dimension: traceability. Impact: a provenance pointer that proves nothing. Fix: re-point or drop. Disposition: active.
- F006 (P2, severity-scale-vocabulary-mismatch) — *Severity-scale mismatch: the target spec promises P0-P3, every governing contract is 3-tier.* [spec.md:83, :135 vs sk-code review-core.md:32-34, :95 + the state schema]. Dimension: traceability. Impact: the lane recorded P0/P1/P2 per the governing contracts; the spec's P3 is orphaned. Fix: amend the spec's wording (the parent's, at the REQ-003 binding). Disposition: active.
- F007 (P2, cross-variant-git-policy-swap) — *Git policy swap at synthesis: auto leaves artifacts unstaged, confirm stages them; the documented invariant is unqualified.* [step_leave_artifacts_unstaged vs step_stage_artifact_dir; confidence 0.6]. Dimension: correctness. Impact: the variants' end-states differ and which is correct is undocumented. (This lane executed the auto/unstaged semantics.) Fix: qualify the invariant or unify. Disposition: active.
- F008 (P2, confirm-variant-step-omissions) — *Confirm step-graph omits 12 auto steps including functional ones, with no in-YAML rationale.* [the census: bind_reducer_artifact_arg, apply_lifecycle_request, detect_resource_map, seed_coverage_graph, enrich_strategy_resource_map, init_complete, apply_divergent_pivot_result, generate_state_summary, marker_scan, resource_map_coverage_gate, leave_artifacts_unstaged, compose_save_payload; +adds only step_stage_artifact_dir]. Dimension: maintainability. Impact: functional gaps (state summary, marker scan, init-complete, the resource-map cluster) while both variants render the SAME prompt pack. Fix: restore-or-annotate. Disposition: active.
- F009 (P2, sampling-config-translation-loss) — *Sampling configuration is .opencode-only; three mirrors substitute either nothing or a different knob.* [temperature 0.1/0.2 vs .codex model_reasoning_effort=high; .claude/.pi unset]. Dimension: maintainability. Impact: the 4-uplet's sampling semantics diverge silently; the dispatch layer centralizes reasoning-effort (executor-config.ts), so this is a residual file-layer gap. Fix: the crosswalk (F011). Disposition: active.
- F010 (P2, permission-deny-translation-dialects) — *Permission deny-half translates three ways: runtime-enforced (.opencode task:deny), prose-remembered (.claude: code.md:40, deep-review.md:80, deep-improvement.md:21), silent (.pi).* Dimension: maintainability. Impact: the deny→absent translation is faithful 12/12 but enforcement differs per runtime. Fix: the crosswalk + a .pi prose trail. Disposition: active.
- F011 (P2, tool-lexicon-crosswalk-undocumented) — *Tool lexicon: three spoken dialects, no documented crosswalk, provenance marking in one of four trees.* [.claude TitleCase CSV + Agent membership; .pi find+ls, no glob ×12; .codex no declaration; `# Converted from` only in .codex; README in 2/4]. Dimension: maintainability. Impact: the required delegation/tool vocabulary has no documented correspondence; the ai-council permission-tail is the recorded UNKNOWN. Fix: one crosswalk doc + the provenance/README decision. Disposition: active.
- F012 (P2, leaf-contract-schema-drift) — *Leaf contract triple-licensed: agent file, workflow, and state schema disagree on budgetProfile/edgeCases.* [deep-review.md:167 (scan 9-11/verify 11-13/adjudicate 8-10) + the :520 JSONL self-certification vs the dispatch pack's flat 9/12/13; neither the state schema nor the mechanical gate checks either]. Dimension: correctness. Impact: 4 statements of the same contract, 0 enforcers. Fix: single-source the budget + ONE enforcement point. Disposition: active.
- F013 (P2, model-attraction-unowned) — *Model attraction structurally unowned: three trees silent, the fourth pins gpt-5.5.* [no model key and no "opus" in .opencode/.claude/.pi agent files; .codex hard-pins; "runs model opus" is the WORKFLOW's dispatch default]. Dimension: maintainability. Impact: model parity holds only on dispatched routes. Fix: add the model key ×3 or document the inheritance. Disposition: active.
- F014 (P2, sandbox-claim-vs-mechanism-asymmetry) — *The sandbox-to-permission-mode compression at the Claude-Code branch dilutes the OS-preventive claim, while the prevents-map credits it.* [executor-config.ts:547-570, :136-137; fanout-run.cjs:3208; the hermes precedent :108-110]. Dimension: correctness. Impact: workspace-write AND danger-full-access both → `force` (3→2) — the same scrutiny the hermes comment applies to `--yolo` would demote the claim (confidence 0.65). Fix: the permission-mode fidelity or the softened prevents-map, with the hermes-precedent scrutiny applied uniformly. Disposition: active.
- F015 (P2, allowlist-rotation-unguarded) — *The enforced model allowlists are hand-maintained, dated-comment rosters with no validation-date protocol.* [cursor additions 2026-08-12/14/15, self-annotated "can silently resolve to a model outside this allowlist", ~30 days stale]. Dimension: security. Impact: enforcement-rot — the allowlist's completeness is asserted, never tested. Fix: a validation test + a dated-validation protocol. Disposition: active.
- F016 (P2, parity-agreement-unmechanized) — *Five-surface kind/flag parity holds, but its only verification is manual (this review).* [7/7 dirs; 14-identical stress files claude≡codex; all-7-kind protocol tokenization; the 14→8 token sprawl fully decomposed]. Dimension: maintainability. Impact: the parity guarantee is point-in-time. Fix: one divergence fixture (the kind/flag matrix vs the 5 surfaces). Disposition: active.
- F017 (P2, containment-promise-chain-divergence) — *The containment promise diverges at three story levels: the comments promise, the inline code advises, the runner preserves.* [auto:1515-1519/:1528-1538; fanout-run.cjs:2984, :3424]. Dimension: correctness. **ANSWERED at iteration 5 — see F020/the ceremony: the ownership = the runner, ONCE, at dispatch; the advisory runtime is the recorded design.** Closure = the parent's. Disposition: active (answer recorded).
- F018 (P2, mechanical-gate-invocation-asymmetry) — *The mechanical post-dispatch gate is promised to both leaves but invoked by neither confirm-variant surface.* [verify-iteration: auto×1/confirm×0; the shared pack's OUTPUT CONTRACT promises it; this lane's 5 iterations each mechanically gated, the confirm-variant equivalent self-certified]. Dimension: traceability. Impact: the validation leg of the confirm-divergence pattern (F008's). Fix: wire the gate in :confirm's post-dispatch OR one sentence in the pack STATE block. Disposition: active.

## 4. Remediation Workstreams

Ordered: P0 first (none), then P1, then the P2 advisories separated.

1. **W1 (P1) — the gateway/protocol repair (F019)**: the three-armed fix (§3); gate = one confirm-variant rehearsal; retires F003.
2. **W1b (P1) — the confirm line-1 config (F001)**: bind-or-annotate; gate = the confirm variant's first state row vs auto:466's invariant.
3. **W2 (P2) — cutover preparation (F020, +F002, +F017's statement)**: the migration emitter, the divergence rehearsal, the :280 wording, the reducer-arg binding, the enforcement-authority statement.
4. **W3 (P2) — confirm-variant parity (F002, F007, F008, F018)**: restore-or-annotate the 12 steps; the git-policy qualifier; the verify-gate wiring.
5. **W4 (P2) — the agent-mirror contracts (F009-F013)**: the crosswalk; the model-attraction decision; the budget single-source.
6. **W5 (P2) — the parity mechanization (F014-F016)**: the divergence fixture; the prevents-map reconciliation; the allowlist validation dates.
7. **W6 (P2) — hygiene (F004, F005)**: the comment/provenance sweep.
8. **W7 (P2) — the severity vocabulary (F006)**: the spec.md amendment.

## 5. Spec Seed

- Bind these 20 findings to a remediation phase under `specs/system-deep-loop/049-deep-loop-alignment-review/` (REQ-003): every finding here is tree-verified with file:line; the binding (or a recorded refutation-with-reason) closes REQ-003 for this lane. **Namespace the IDs by sessionId** (`fanout-wave1-glm-1789465945073-px9i6h`) — the twin lane's IDs collide (SC-001).
- Wave-two REQ-002: rewrite angles 11-20 from THESE findings before wave two launches. Candidate rewrites (the lanes' recorded UNKNOWNS and deferred surfaces, not re-runs): the research-variant pair (deferred since lane iteration 1); the dispatched-agent RUNTIME layers + the four overlays; the authority-flip write-side (this lane's dead end 1); the confirm-variant execution archaeology (dead end 3); the timeoutSeconds VALUES + the 4 unseen stress trees (angle 8); the third validator's call sites (angle 9); the .pi body order + the ai-council permission tail (angle 7).
- D1 note: this lane ran GLM 5.3 Flash at max via the llmgateway on cli-pi, stopPolicy max-iterations, convergence off — the record for the wave-2 lane matching.

## 6. Plan Seed

Starter tasks for `/speckit:plan` (mirrors §2's planSeed; the bindingparent copies these into the remediation phase's plan):

1. F019 — select the repair arm; add the confirm-variant gateway rehearsal as the acceptance test.
2. F020 — implement the legacy→ledger migration emitter; add the Phase-5 copy-diverge rehearsal; amend :280's wording; bind F002's reducer_artifact_arg.
3. F001/F002 — the confirm variant's line-1 bindings or their documented-contract annotations (the presentation's tier-2/3 is the recorded downgradeTrigger).
4. F008/F018 — the 12 steps: restore or annotate, in-YAML; the verify-iteration gate: wire it or assign it in the pack's STATE block.
5. F009-F013 — one cross-runtime declaration crosswalk; the model-attraction decision; the budget-profile single source with ONE enforcement point.
6. F014-F016 — the mechanized 5-surface divergence fixture; the prevents-map/permission-mode reconciliation; the allowlist validation dates.
7. F004/F005/F006 — the comment/provenance hygiene sweep; the spec.md severity-vocabulary amendment.

## 7. Traceability Status

Core protocols first, then overlays.

- **spec_code (core, hard gate)**: 5 records — partial (it 1: 2/4 variant scope), pass (it 2: the 48-block census), partial (it 3: 3 prose layers unread), pass (it 4: 4/5 legs), pass (it 5: 5/5 targets). 3/5 pass; the two partials are documented depth boundaries (scope decisions), not drift — the covered loci all carry file:line; nothinga partial shading hides.
- **checklist_evidence (core, hard gate)**: notApplicable ×5 — the target's acceptance-criteria.md is an unfilled scaffold (no checklist.md; the parent-REQ rows were assessed at synthesis, per the plan).
- **AC_COVERAGE: exempt** — lifecycle-early target: the scaffold's single AC-001 row (Status Unmet, no verification evidence) has no real rows to cover; floor 0/0.
- *Resource Map Coverage Gate: skipped — `resource_map_present` false (no resource-map.md; the coverage gate was skipped at init and recorded in every pack; the reducer's resourceMapPath: null).*
- **Overlay protocols** (each assessed, deferred-with-loci — the full split in §10): skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability.

## 8. Deferred Items

Advisory-only or backlog follow-ups that do not affect this verdict:

1. The continuity save (`generate-context.js`) — PROHIBITED in this lineage by the recorded constraint; DEFERRED to the parent orchestrator (recorded in strategy §13, 2026-09-15T11:30:39Z).
2. The resource-map emission — notApplicable (no resource-map.md exists; the reducer's resourceMapSkipped path; nothing to emit from).
3. The four overlay protocols' full assessment — deferred-with-loci (the dispatched-agent runtime behavior; the research-variant/playbook surfaces); the wave-2 angles are the recorded vehicle.
4. The authority-flip WRITE-side (this iteration's dead end 1) — the cliff's WHEN stays unbounded until traced.
5. The confirm-variant execution archaeology (dead end 3) — which 2 steps its 2 gateway mentions wire; whether any confirm-lane run ever exercised the mandated path.
6. `.executor-state/probe-stem.json` — deliberately RETAINED (not deferred-trash): it is the recorded evidence that the gateway's closed-shape path was tested before the direct-writer decision (strategy §13).
7. The reducer's 10A "Swept: none yet" cosmetic — the reducer does not deduce sweeps (the packs carried them; the recorded deviation); unrepaired by design.

## Dimension Expansion Map

Breadth only — this section cannot alter the Executive Summary verdict, hasAdvisories, the finding registry, or any self-check results.

- Reducer-owned `divergence.saturatedDirections`: none (the strategy's 10A reads "Swept: none yet" — the recorded deviation: each iteration's pack carried the accumulated swept directions; the reducer does not deduce them).
- Completed pivots: none (the lane never pivoted — the 5 angles ran in their fixed, pre-bound order 6→10).
- Failed pivots: none. Audited overrides: none. Council artifact references: none.
- Selected review directions: angles 6-10 as bound (command-YAML parity → agent mirrors → cross-CLI parity → containment → state/ledger).
- Remaining frontier: none — the angle program is complete at 5/5 (the hard stop). The wave-2 frontier = §5's seed.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record).*

(`searchCoverage`, `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof` are all empty/absent — this lane emitted v1-legacy records with no reviewDepthSchemaVersion discriminator, so the v2 gates (candidateCoverageGate, graphlessFallbackGate) are notApplicable. searchDebt empty → no hasSearchDebt flag; the CONDITIONAL verdict stands on the two P1s.)

## 10. Audit Appendix

**Convergence summary.** newFindingsRatio: 1.00 → 0.38 → 0.19 → 0.11 → 0.10. Composite convergenceScore: 0 → 0.62 → 0.81 → 0.89 → 0.90 — telemetry only (`convergenceMode: off`); the STOP is the policy hard stop at 5/5 (`stopReason: maxIterationsReached`), which proceeds without legal-stop veto and preserves the gate evidence: convergenceGate no-vote (weighted 0.45 — coverage-only), dimensionCoverageGate 4/4 (coverage_age 2), p0ResolutionGate 0 active P0, evidenceDensityGate PASS (every active P0/P1 cites concrete file:line — F001: confirm:412/422 vs auto:454-467; F019: 7 loci), hotspotSaturationGate PASS (no repeated finding), claimAdjudicationGate PASS (the final event passed:true, its precedent 4× passed:true; F019's 7-field packet complete), fixCompletenessReplayGate notApplicable (review-only — nothing fixed, per the constraint), candidateCoverageGate + graphlessFallbackGate notApplicable (v1-legacy). 7 PASS / 3 notApplicable; no veto; the hard stop stands. Five reductions, corruptionCount 0, strategyWarning null, zero warningsever.

**Coverage summary.** Dimensions 4/4 — correctness (addressing iterations 1, 3, 4, 5), security (3, 5), traceability (1, 2), maintainability (2, 4). Spec_code: 3 pass / 2 partial (documented boundaries). Both adjudication-... all five claim_adjudication events passed:true (1× substantive: run 1, activeP0P1 1; 4× vacuous-true).

**Ruled-out claims (aggregate).** ~26 directions recorded across the 5 narratives (the enumerated records; this iteration's 5: the gateway's canonical paths, the ceremony ledgers' integrity, the projection's thin rows, the research variant's F019 exposure, the hidden-enforcement coupling). Highlights: no duplicated banner drift (runner-templated); the 4-uplet mirrors are machine-generated (~1-min write windows); the deny→absent translation faithful 12/12; the 14→8 cli-token sprawl fully decomposed; the lock contract complete; the dead branches documented-dead; the ceremony ledgers clean.

**Sources reviewed.** Angle 6: the deep-review command-YAML pair + presentation + their referenced packs/runtime. Angle 7: the 48-block agent×runtime matrix (12 agents × 4 trees) + delegation/tool vocabularies. Angle 8: 5 surfaces (executor-config.ts, the runner's builders, the stress matrices, the 7 cli-*/SKILL.md rosters, the protocol reference trees). Angle 9: the YAML inline-containment blocks, the runner's mode lifecycle, write-containment.ts, the lock contract, the validator-invocation census. Angle 10: the append gateway (CLI+TS), the 31-stem ledger schemas, the legacy projections, the acceptance gate, the 4-variant+runner producer census, the ceremony frames, and this lane's own 9-row state log as the live specimen (15 paths, listed in iterations/iteration-005.md).

**Cross-reference appendix — Core Protocols.**
- spec_code: 3 pass / 2 partial; the deepest-coverage iterations: 2 (the 48-block census), 5 (5/5 targets). Evidence: the narratives' Traceability Checks + the state records' traceabilityChecks.
- checklist_evidence: notApplicable ×5 (scaffold); the parent-REQ assessment = this report's §5.

**Cross-reference appendix — Overlay Protocols.**
- skill_agent: deferred-with-loci — the DISPATCHED-agent execution layer (the "runs model opus" dispatch default, F013's); the declarations covered (angle 7), the runtime behavior not.
- agent_cross_runtime: deferred-with-loci — the declarations' 4-way translation covered (angles 7, 8); the cross-runtime EXECUTION (does a .pi dispatch actually honor the .codex-pinned model?) not.
- feature_catalog_code: deferred-with-loci — the research-variant pair + the feature-catalog surfaces, deferred since the iteration-1 scope decision; the recorded wave-2 vehicle.
- playbook_capability: deferred-with-loci — the playbook surfaces; same deferral.

Machine-owned markers preserved: this report references the reducer-owned registry (`deep-review-findings-registry.json`), dashboard and strategy anchors without mutating them; the state log remains append-only (12 rows at synthesis: 1 config, 5 iterations, 5 adjudications, 1 synthesis event); all artifacts deliberately UNSTAGED (the auto-variant git semantics, F007's recorded end-state).

---

*Lane wave1-glm complete: 5/5 iterations, verdict CONDITIONAL, hasAdvisories, 20 active findings (0/2/18), 0 resolved, 0 corruption. Continuity: deferred to the parent orchestrator. End of report.*
