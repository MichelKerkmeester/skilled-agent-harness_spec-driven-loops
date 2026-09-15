---
title: "wave2-glm iteration 001 — Angle 16: confirm-against-auto variant drift, both variant pairs"
loop: review
lane: wave2-glm
session: fanout-wave2-glm-1789475514883-p58bmd
iteration: 1 of 5
angle: 16
dimension_primary: correctness
dimension_secondary: traceability
verdict: CONDITIONAL
---

# Dimension / Focus

**Dimension:** correctness (primary), traceability (secondary).
**Focus (Angle 16):** the confirm-against-auto variant drift — census BOTH variant pairs (the review pair and the research pair) step by step and name every divergence with its consequence. The angle's wording (spec.md:103) lands the research-variant pair, which the precedent lane bound out of its angle-6 scope and the wave-two rewrite restored to the program.

# Files Reviewed

All under the repo root; the four YAMLs (8,630 lines) were read locus-wise — the four-variant step-key census, then twelve targeted divergence loci — not line-by-line:

- `.opencode/commands/deep/assets/deep-review-auto.yaml` (2585 lines; 71 step keys) — the line-1 config literal (:450, :466-467), the step-key census, the reducer/verify wiring (:2176), the unstaged step (:2453)
- `.opencode/commands/deep/assets/deep-review-confirm.yaml` (1765; 60) — the step-key census, the reducer call (:1546), the stage step (:1620)
- `.opencode/commands/deep/assets/deep-research-auto.yaml` (2481; 73) — the step-key census, the config populate + flag-binding comments (:250, :340-352, :544-545), the line-1 literal (:368), the minIterations warning pair (:663, :666), the TWO gateway wiring sites (:574-575 + :637-641, :1707-1708 + :1749-1753), the verify-iteration invocation (:1663), the stage step + second git-add list (:2372-2375, :2474)
- `.opencode/commands/deep/assets/deep-research-confirm.yaml` (1799; 55) — the step-key census, the config populate without binding provenance (:344-368), the line-1 literal (:369), the resource-map references (:176, :353-354, :1342-1360), the ONE gateway wiring site (:1400-1401, :1613-1620), the 7-key synthesis_complete record (:1601-1608), the stage step (:1681-1686)
- `.opencode/commands/deep/review.md` (:78 — the --no-resource-map parse), `.opencode/commands/deep/research.md` (:85, :107 — the same flag parsed there)
- `.opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` (:45, :54-62 — the gateway-only state-write mandate and the OUTPUT CONTRACT)

Pre-iteration setup reads of this session, cited as control evidence where the finding rides them: `runtime/lib/deep-loop/prompt-pack.ts` (the renderer both pairs call), `sk-code/sk-code-review/references/review-core.md` (loaded before final severity calls, per the pack's SHARED DOCTRINE), `deep-review/references/state/state-jsonl.md` (the record + synthesis contracts), `runtime/scripts/append-mode-event.cjs` (:355-484 — the four acceptance branches, the research-only legacy gate at :398-408, the :445 throw), `runtime/scripts/fanout-run.cjs` (:890-1104 — the runner's completion contract), `deep-review/references/convergence/convergence.md` (the gate semantics).

# Scorecard

| Gate | Rating | Basis |
|------|--------|-------|
| evidence | pass | every finding cites file:line observed this session; precedent findings are cited as recorded control evidence and marked as such |
| scope | pass | all cited artifacts are the angle-16 bound scope; zero writes outside the ALLOWED-WRITE set |
| coverage | pass | every angle-16 question received a verdict: the four-variant step census, the line-1 shape quartet, the gateway/verify/reducer/git/provenance mechanisms; negatives recorded below |

# Findings by Severity

## P0

None. Nothing here loses state, destroys data, or breaks a running lane: the severest gap (F001) yields misrecorded or thinner-than-needed state, not lost work — the precedent lane rated its same-class finding P1.

## P1

### F001 — The four variant line-1 config literals are four different record shapes; only review-auto's can agree with its config "from line 1"

`[SOURCE: deep-review-auto.yaml:466-467; deep-research-auto.yaml:368; deep-research-confirm.yaml:369, :344-368; this lineage's own line-1 and the three precedent lanes' line-1 records]`

The angle-16 question "which shapes exist" has a four-part answer, each part cited:

1. **review-auto:467** persists the rich record: `mode`, `reviewTarget`, `reviewTargetType`, `reviewDimensions`, both resource-map keys, `sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`, `maxIterations`, `convergenceThreshold`, `antiConvergence`, `stopPolicy`, `createdAt`, `specFolder` — 16 keys — and its :466 comment declares the invariant: "Same parsed --no-resource-map flag honored here so config and state_log agree from line 1."
2. **research-auto:368** persists a 12-key record: topic, maxIterations, minIterations, convergenceThreshold, antiConvergence, minIdeaObservations, both resource-map keys, createdAt, specFolder, nextRunAt, remainingDelayMs — and NOTHING of the lineage/mode/stopPolicy/executor vocabulary: no `mode`, no `sessionId`, no `lineageMode`/`generation`/`continuedFromRun`/`parentSessionId`, no `stopPolicy`, no `executor`.
3. **research-confirm:369** persists the THINNEST record, 8 keys: topic, maxIterations, convergenceThreshold, antiConvergence, both resource-map keys, createdAt, specFolder — it additionally drops the four research-specific keys its OWN variant's auto literal declares (`minIterations`, `minIdeaObservations`, `nextRunAt`, `remainingDelayMs` — research-auto:368) although its own config-FILE populate four lines earlier (:344-368) carries `stuckThreshold`, `maxDurationMinutes`, `status`, `executionMode` and the full `lineage.*` block (`lineage.sessionId: "{AUTO_SESSION_ID}"`, :359). Its config file and its state-log line 1 therefore disagree from line 1 by construction.
4. **The detached lanes' actual line-1 records** (wave1-deepseek, wave1-glm, wave2-deepseek, this lane): 19-20 keys — the four YAML literals themselves never emit `topic` or `executor`, yet every detached lane's record (this lineage's included) opens with `topic` and carries the full `executor` attribution, because the SC-001 duty (attribution names kind and model) needs them. The rich line-1s of the precedent lanes are runner-and-lane-supplied, not workflow-emitted: no variant's YAML literal produces the record shape the loop's own machinery and the merged-registry attribution actually consume.

Consequence: the "agree from line 1" invariant is review-auto's private achievement. In a research run (either variant) the state log's first row cannot support the route/lineage/attribution reads the precedent lanes' records demonstrate; in review-confirm the invariant was already found broken (the precedent's F001, P1 — this iteration extends the same defect class to the research pair and shows even the REVIEW pair's literals fall short of the record the lanes actually write). Severity P1 per review-core.md:33 (spec mismatch: the loop's own REQ-001/SC-001-adjacent machinery); the precedent lane rated its same-class finding P1.

**Adjudication packet (typed, per prompt-pack CLAIM ADJUDICATION):**

```json
{
  "findingId": "F001",
  "claim": "The four deep-command variant workflows each initialize their state log with a differently-shaped line-1 config record: review-auto:466-467 (16 keys, lineage+stopPolicy, the only variant declaring the agree-from-line-1 invariant), research-auto:368 (12 keys, no lineage/mode/stopPolicy/executor, plus four research-specific keys), research-confirm:369 (8 keys, additionally dropping the four research-specific keys its own auto carries while its own config populate :344-368 carries stuckThreshold/status/executionMode/lineage.*), and review-confirm (the precedent's F001: no stopPolicy, references an unbound resource_map_present). Even review-auto's richest literal lacks the topic and executor keys that all four detached lanes' actual line-1 records (including this lane's) demonstrably carry, so no workflow literal produces the record the merged-registry attribution consumes.",
  "evidenceRefs": [
    "deep-review-auto.yaml:466-467",
    "deep-research-auto.yaml:368",
    "deep-research-confirm.yaml:369",
    "deep-research-confirm.yaml:344-368 (the populate: stuckThreshold, status, executionMode confirm, lineage.sessionId AUTO_SESSION_ID)",
    "deep-research-auto.yaml:340-352 (the same populate WITH the flag-binding provenance comments)",
    "specs/system-deep-loop/049-deep-loop-alignment-review/001-angle-driven-review/review/lineages/wave2-glm/deep-review-state.jsonl:1 (this lane's 20-key record)",
    "the three precedent lanes' line-1 records (state logs, read this session)"
  ],
  "counterevidenceSought": "Searched for any research-confirm binding step that assigns resource_map_present/resource_map_emit or the lineage block before :369 renders: the step-key census shows no step_detect_resource_map in research-confirm; its :344-368 populate declares the config-FILE keys but nothing that binds the STATE-LOG literal's tokens beyond the markdown-level $ARGUMENTS parse. Counterevidence NOT excluded: the {AUTO_SESSION_ID} and the two resource-map tokens might be bound by the research-confirm markdown command's argument parse (research.md:85,107 parses --no-resource-map workflow-wide), which this iteration verified for the FLAG but did not trace for the literal's rendering pipeline.",
  "alternativeExplanation": "The thinner research literals may be deliberate interactive-mode simplifications — the research loop's config-FILE (its template + populate) carries what the reducer needs, and the state-log line-1 may be intentionally topic-anchored with the lineage context supplied later by the resumed/restarted events (research-confirm:312,322) or by the runner in detached mode.",
  "finalSeverity": "P1",
  "confidence": 0.75,
  "downgradeTrigger": "If the {AUTO_SESSION_ID} token's provenance resolves to a binding (or the research variant's convergence/reducer machinery demonstrably never reads lineage fields from the state-log line 1, taking them from the config file instead), the missing-lineage half collapses to documentation drift; the four-shapes fact and the research-confirm four-key self-drop would still stand but at P2."
}
```

**Recommendation:** one of: (a) give both research variants' line-1 literals the lineage/mode/stopPolicy/executor block (research-confirm also restoring its four dropped keys) so the invariant holds in three of four variant pairs; (b) amend review-auto:466's invariant comment to name exactly which variant(s) it governs; (c) have the workflow's create_config step RENDER the state-log line 1 from the same populate it renders the config file from, so one source feeds both.

## P2

### F002 — research-confirm omits 18 steps of its own auto (55 of 73), functional ones included, while both research variants render the same prompt pack

`[SOURCE: the step-key census, this session; deep-research-confirm.yaml:978-979 = deep-research-auto.yaml:1087-1088]`

The step-key diff, research-auto minus research-confirm (18): `step_apply_divergent_pivot_result`, `step_compose_save_payload`, `step_detect_resource_map`, `step_emit_min_iterations_guard_pass`, `step_enrich_strategy_resource_map`, `step_ideas_backlog_lifecycle`, `step_init_complete`, `step_marker_scan`, `step_refresh_lineage_context`, `step_rejected_pattern_cache`, `step_run_now_check`, `step_run_now_restore_check`, `step_telemetry_heartbeat_progress`, `step_telemetry_heartbeat_started`, `step_telemetry_heartbeat_terminal`, `step_validate_post_synthesis_spec_doc`, `step_validate_preinit_spec_doc` — versus the review pair's precedent omission count of 12 (the recorded F008): the research confirm-variant's divergence is LARGER, not inherited. Functional, not cosmetic: without `step_detect_resource_map` the resource-map tokens in its own :353-354/:369 have no in-workflow derivation (see F001); without `step_init_complete` no completion marker; without `step_marker_scan` and `step_compose_save_payload` the state-summary/continuity-payload mechanism its auto runs silently does not; without `step_validate_preinit_spec_doc`/`step_validate_post_synthesis_spec_doc` the spec-doc gates its auto runs never fire; without the telemetry trio and the run_now pair the heartbeat and pause-now checks vanish. Both variants render the SAME prompt pack (same `template_path` + same `prompt-pack.ts#renderPromptPack`), which is the recorded structural precondition for divergence-becomes-defect. Also: research-auto carries the minIterations warning pair (:663 "minIterations missing; using no convergence floor", :666 the clamp) while research-confirm's warning machinery (:561) covers ONLY convergenceMode — its own thin :369 literal interacts with a key it demonstrably needs, silently. No in-YAML rationale marks any of the 18.

**Recommendation:** annotate the 18 (or restore the functional dozen); at minimum, give research-confirm the detect_resource_map + init_complete + marker_scan trio whose absence its own records reference.

### F003 — The gateway mandate vs the wiring: all four packs mandate gateway-only state writes, no variant wires them all, and the research loop's salvation is the research-only legacy branch

`[SOURCE: state_write_protocol in all four (deep-review-auto.yaml:100 = deep-review-confirm.yaml:99, deep-research-auto.yaml:108-109 = deep-research-confirm.yaml:124-125, applies_to: "every append_to_jsonl and append_jsonl directive in this workflow"); the wiring counts, this session: deep-research-auto.yaml:574-575+:637-641, :1707-1708+:1749-1753; deep-research-confirm.yaml:1400-1401+:1613-1620; the precedent's review counts; append-mode-event.cjs:398-408, :445]`

Both research variants declare the same applies_to-everything clause, and neither wires it: research-auto pushes through the gateway at exactly 2 sites (in-loop :637-641 and synthesis-side :1749-1753, each fail-closed: non-zero exit → exit), research-confirm at exactly 1 (synthesis-side :1613-1620, also fail-closed, with its `rm -rf "$EVENT_DIR"` cleanup), while both carry dozens of inline `append_to_jsonl` emissions (the migration/resumed/restarted, the spec_mutation quartet, the config warnings, the pivot/manualStop/stopRecovery family, graph_convergence, blocked_stop). The precedent's review counts (12×/2×) complete the matrix: no variant satisfies its own applies_to clause. The QUALIFIED difference this iteration adds: the research variant's shortfall is wiring-count only — the research loop's bare records mechanically CAN ride the gateway, because the gateway's legacy-record acceptance is gated to deep-research (append-mode-event.cjs:398-408, "Non-research modes never enter here") and upcasts them; the review variant's confirm-side records cannot (the :445 throw — the precedent's F019, P1). Residual, recorded not resolved: research-confirm's in-loop iteration records therefore travel inline even though its pack (:54-62, "recorded THROUGH THE APPEND GATEWAY — never written to {state_paths_state_log} directly") and its own :124 protocol say otherwise; its single wired site carries only the synthesis-side terminal events — whose 7-key record shape (:1601-1608: type, event, totalIterations, answeredCount, totalQuestions, stopReason, timestamp — no mode, no sessionId, no generation, no verdict, no activeP0/P1/P2, no dimensionCoverage) is the research loop's own dialect, consumed by its own reducer, distinct from the 11-key record the review-side reference documents.

**Recommendation:** either wire the remaining directives or amend all four applies_to clauses to name the steps actually wired (the precedent's recommendation, now with the research counts: 2×/1×); and give the research synthesis_complete's 7-key shape one documenting sentence in the research reference set so the 7-vs-11 key difference reads as dialect, not drift.

### F004 — The in-lineage fanout resource-map emission exists only in the research variant's contract

`[SOURCE: deep-research-confirm.yaml:1342-1360; deep-review-confirm.yaml:1546; deep-review-auto.yaml:2176]`

research-confirm's `step_emit_resource_map` (:1342-1360) is the ONLY narrow-mode emission in the quartet: `reduce-state.cjs {spec_folder} --emit-resource-map --fanout-resource-map-only`, output pinned to `{artifact_dir}/resource-map.md` (:176), with a written guarantee: "Fan-out resource-map emission reads lineage deltas in place and writes only resource-map.md; it never rewrites merged registries, strategy, or dashboard. Single-executor reduction remains unchanged." The review pair instead passes `--emit-resource-map` to the FULL reducer (:2176 with the artifact arg, :1546 without) — no narrow mode exists — so a review-side fanout lane either reruns the full reduce (registry/strategy/dashboard rewritten by the lane, which is what this lane's precedent invocation actually does) or, like the precedent lane's recorded invocation (no flag), ends at the reducer's resourceMapSkipped outcome. Both behaviors work; they are different contracts, and only one of the two loops documents its fanout posture.

**Recommendation:** either port the `--fanout-resource-map-only` narrow mode to the review reducer/variant, or record the review variant's fanout posture (full-rewrite-in-lane, or the skip) in one sentence where the research guarantee lives.

### F005 — The unstaged invariant is review-auto-only; the other three variants stage the artifact dir, by a recorded contract fix — this closes the precedent's 0.6-confidence git-policy question

`[SOURCE: deep-review-auto.yaml:2453; deep-review-confirm.yaml:1620; deep-research-auto.yaml:2372-2375, :144; deep-research-confirm.yaml:1681-1686]`

The precedent's F007 recorded, at confidence 0.6, that review-auto's `step_leave_artifacts_unstaged` corresponds to review-confirm's `step_stage_artifact_dir` with the confirm step's body unread. This iteration read all four bodies. The full picture: review-auto:2453 = the ONLY unstaged-variant step; review-confirm:1620 stages; research-auto:2372-2375 stages (`git add {state_paths.packet_dir}`) AND research-confirm:1681-1686 stages (`git add {state_paths.artifact_dir}`) — the same tree, because research-auto:144 defines `packet_dir: "{artifact_dir}"`. Both research variants carry the same note: "Skill-owned contract fix (028): without this stage step, operators who do `git add research-report.md` lose the iteration trail (iterations/, deltas/, state.jsonl, strategy, etc.)... Failure is non-fatal — log warning and continue." So the documented unstaged invariant (the precedent's finding) is review-auto's semantics alone; the mechanic the other three variants share (staging the artifact dir, non-fatal, restorable via `git restore --staged`) is itself the recorded contract fix. research-auto additionally runs a second, separate `git add` list (:2474: the iteration pattern, the state log, the strategy, the research output) inside its save-phase verification.

**Recommendation:** qualify the unstaged invariant as review-auto-only in the documentation that states it, and cite the (028) note as the why for the other three — one sentence retires the precedent's confidence-0.6 residue.

# Traceability Checks

| Protocol | Class | Status | Evidence / notes |
|----------|-------|--------|------------------|
| spec_code | hard | pass | Angle 16 (spec.md:103) declares the census of BOTH variant pairs step by step with every divergence's consequence: the four-variant step-key census done (71/60/73/55), both pairs' line-1 literals extracted, and 12 mechanism loci (gateway wiring, verify-iteration, reducer+artifact-arg, resource-map derivation, minIterations warnings, staging, provenance comments, flag parse, pack identity, synthesis-event shape) read and consequence-rated. All 5 findings carry file:line evidence. Boundary: the YAML bodies were locus-read, not line-read; the presentation and compiled/legacy quartets belong to angle 6 / the precedent's catalog angles, not 16. |
| checklist_evidence | hard | notApplicable | Target packet has no checklist.md (packet-root listing) and its acceptance-criteria.md is an unfilled scaffold (read firsthand this session: the single template AC-001 row, Status Unmet, no verification evidence); parent-REQ rows assessed at synthesis. |

Summary: required 2, executed 1, pass 1, partial 0, fail 0, blocked 0, notApplicable 1, gatingFailures 0.

Overlay note: feature_catalog_code is served at the mechanism level (the four reducer/gateway/verify invocations F002-F004 catalogue); playbook_capability not applicable to a YAML-variant surface. No overlay failures.

# Assessment

- **Counts:** 5 findings — P0: 0, P1: 1 (F001), P2: 4 (F002-F005). All new; zero refinements (first iteration, no prior registry in this lane).
- **newFindingsRatio:** 1.00 — (new + 0.5·refined) / (priorOpen + new + refined) = 5/(0+5).durationMs note: 252000 ms measures pack-render (T0≈12:51:10Z) to evidence-close; the detached-inline execution shares one process, so the wall-clock runs shorter than the precedent's 768s dispatched iteration; recorded as approximate.
- **Novelty justification:** the research-variant pair (both YAMLs) was census- and locus-read for the first time in this packet — the precedent lane bound it out of its angle-6 scope, its own report deferred it, and the wave-two rewrite restored it as this lane's angle 16. Within this lane it is the first iteration. Novelty = 1.0.
- **Quality gates:** evidence — every finding cites file:line observed this session; scope — the writes were exactly iterations/iteration-001.md, deltas/iter-001.jsonl, logs/iter-001-events.jsonl, prompts/iteration-001.md, and the sanctioned lane-direct appends to deep-review-state.jsonl (the strategy's recorded legacy-direct writer); coverage — every angle-16 question answered, negatives recorded below.
- **Verdict logic:** no P0 → not FAIL; 1 active P1 → CONDITIONAL (F001). Per the pack's mapping. The 4 P2s ride as advisories.
- **Convergence telemetry (convergenceMode: off):** newFindingsRatio 1.00; coverage 1/4 dimensions, 1/4 primary passes; protocol stability age 0. Telemetry only — the loop continues to the iteration cap.

# Ruled Out

1. **The research-variant YAMLs as byte-copies of the review pair** — answered negative: different step graphs (73/55 vs 71/60), a different event vocabulary (no claim_adjudication at all; a 4-key research blocked_stop; a 7-key synthesis_complete), their own reducer script (`deep-research/scripts/reduce-state.cjs`), their own 4-key gateResults, and the research-only gateway legacy branch. `[SOURCE: the step-key + rg census, this session]`
2. **The 4-variant line-1 records as one canonical shape with cosmetic drift** — answered negative: four shapes, differing in kind (see F001); the precedent lanes' records prove the machinery needs what only review-auto's literal (partially) and the lanes' own records (fully) provide. `[SOURCE: :467, :368, :369; the four published line-1s]`
3. **The research-confirm resource-map references as broken (unrenderable)** — NOT established: the markdown parse (research.md:85,107) binds --no-resource-map workflow-wide, so the tokens are plausibly bound at the markdown layer; what is missing is the in-YAML provenance the research-auto:351-352 comment records. Recorded inside F001's evidence and the downgradeTrigger, not as a separate breakage. `[SOURCE: research.md:85,107; research-confirm:344-368; research-auto:351-352]`
4. **The research pair's blocked_stop 4-key shape as a contract violation** — answered negative: the 9-gate set is documented as the deep_review variants' emission (state-jsonl.md:221 names both review YAMLs); the research variant's 4-key gateResults (convergence, keyQuestionCoverage, evidenceDensity, hotspotSaturation) is its own dialect, consumed by its own reducer. Recorded as dialect, not drift (F003's residual). `[SOURCE: deep-research-confirm.yaml:644; state-jsonl.md:221]`
5. **The review-side --emit-resource-map as unnecessary** — answered: it is IN the YAML (:2176/:1546); the precedent lane's recorded invocation omitted it, which is why its outcome was resourceMapSkipped. Both statements are true of different runners (the YAML's native invocation vs the precedent lane's); the discrepancy belongs to F004's posture question. `[SOURCE: :1546, :2176; the precedent strategy's recorded invocation]`

# Dead Ends

- The provenance of research-confirm's `{AUTO_SESSION_ID}` token (its :359) versus review-auto's `{session_id_init}` was not traced: whether a research-confirm variable block binds it. If unbound, research-confirm's own rendered CONFIG-FILE sessionId is affected, which would strengthen F001 beyond the state-log row. Recorded as F001's downgradeTrigger/UNKNOWN; the tracing exceeds this iteration's locus.
- Which step owns research-auto's second `git add` list (:2474) — the surrounding step's key was not captured in the census. Advisory; the stage-step finding (F005) stands on :2372-2375 alone.

# SCOPE VIOLATIONS

None. All writes this iteration: `iterations/iteration-001.md`, `deltas/iter-001.jsonl`, `logs/iter-001-events.jsonl`, `prompts/iteration-001.md`, and the sanctioned lane-direct appends to `deep-review-state.jsonl` (the strategy's recorded legacy-direct writer). No reviewed file was modified; no repository tooling was executed that writes outside the lineage.

# Recommended Next Focus / Next Dimension

Iteration 2 = **Angle 17 — ledger stem producers and the cutover cliff** (security primary, correctness secondary): census every registered stem against its producers and every producer against its stems, FOR BOTH MODES (the research variant's flat rows riding the :398-408 upcast are the research-mode producer side this lane must trace to their targetStems), and say what breaks at the cutover — including the precedent lane's recorded dead end, the authority-flip WRITE-side, which this lane's angle 17 inherits as its continuity question. Carry-overs: the `{AUTO_SESSION_ID}` provenance (F001's downgradeTrigger — the angle-17 Stem/registry read may settle it); the gateway's projected-row shape for upcast research records (the angle-17 projection leg); the research-AUTO :2474 step owner (trivial, opportunistic).

Review verdict: CONDITIONAL
