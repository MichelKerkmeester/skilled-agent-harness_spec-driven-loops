---
title: "wave1-glm iteration 5 — Angle 10: the state/ledger write path"
loop: deep-review
lane: wave1-glm
session: fanout-wave1-glm-1789465945073-px9i6h
iteration: 5
angle: "Angle 10 — architecture/state and ledger"
dimensions: [security (primary), correctness (secondary)]
verdict: CONDITIONAL
hasAdvisories: true
---

## Dimension / Focus

Security (primary) + correctness (secondary). The fifth and final angle: the state/ledger write path read as ONE system — the append gateway (`mode-append-gateway/append-mode-event.ts` and its CLI), the registered 31-stem ledger schemas, the legacy projections, the mechanical acceptance gate, the event producers on both sides of the stem/inline-legacy divide, and this lane's own 9-row state log as the live specimen. Per the binding pack, this iteration terminates the two carried questions: F003's projection-discriminator question (iteration 1) and F017's enforcement-ownership question (iteration 4).

## Files Reviewed

1. `prompts/iteration-005.md` — the binding pack: route, scope, contracted questions (F003, F017 terminate here)
2. `deep-review-audit-ledger/frames/0000000000000001.frame` — the authorization ceremony: `authorization.decision.recorded`, actor `fanout-effect-writer`, capability `fanout-effect-write`, authority_state `legacy_authoritative`, decision `allow`, fence_token 1, occurred_at 2026-09-15T09:52:29.841Z
3. `deep-review-effect-ledger/frames/0000000000000001.frame` — the effect intent: `deep-loop.effect.intent-recorded`, adapter `fanout-executor-subprocess`, authorization_ref cross-binding the audit record (audit_ledger_id, audit_record_hash, audit_sequence 1, fence_token 1)
4. `.opencode/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` (:204-265, :300-465, :465-469) — the authority read, the cutover binding, the FOUR-branch event acceptance, the research-only legacy upcast, the final throw, the lossy-warning surfacing
5. `.opencode/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts` (:10, :106-149, :223, :247, :254, :288, :457-459) — the six-phase pipeline, the receipt's projectionRefreshed/projectionError, `resolveLegacyStateRelativePath`, "6. Project: refresh legacy projection", Phase 5
6. `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` (:152-153, :193-213, :269-287) — the structural `{leaf}-ledger/frames` check, the not-enforced-until-cutover clause, the gate wiring, the :280 bypass detail
7. `.opencode/commands/deep/assets/deep-review-confirm.yaml` (:99, :1250-1285) — its state_write_protocol, `step_post_iteration_claim_adjudication`'s FLAT `append_jsonl` rows (:1276, :1282), the following reducer step
8. `.opencode/commands/deep/assets/deep-review-auto.yaml` (:100, :1938, :1954, :2189-2250) — the twin protocol clause, the STEM-shaped adjudication, the synthesis report step's 10 mandated sections
9. `.opencode/skills/system-deep-loop/deep-review/references/state/state-jsonl.md` (:30-46, :176-183, :339-345) — the event-record sources, the canonical `synthesis_complete` example, the validation rules
10. the four-variant producer census: `deep-review-auto/confirm` + `deep-research-auto/confirm` (grep: dotted `deep_review.*` = 4 distinct tokens + 1 truncated)
11. `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (producer census: ZERO dotted `deep_review.*` tokens)
12. this lane's `deep-review-state.jsonl` (9 rows — the live specimen: the rich line-1 config, 4 iteration records, 4 adjudication events, zero gateway-born rows)
13. `deep-review-findings-registry.json` (the reducer-owned 18; the `category` fields are empty — the findingClass vocabulary lives in the iteration records, not the registry)
14. `.opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts` (:995 — the closed-shape throw, re-cited from this session's 12:09-12:10Z probes)
15. this lane's `deep-review-strategy.md` (§13 :140-141 — the recorded writer decision and the lock note; §15 :184 — the angle-10 row, pending until this iteration)

## Scorecard

- **evidence: PASS** — every finding cites ≥4 concrete loci; the P1 carries a full 7-field typed packet with counterevidence scans and a downgrade trigger.
- **scope: PASS** — the pack's five mandated targets (the 31-stem vocabulary; the authority/cutover binding; the projection's special-cases and replace semantics; the producers on both sides of the stem/inline-legacy divide; this lane's own state log as the live specimen) all traced at source. The research-variant pair was read at census granularity only (deliberate: its legacy branch is the exemption's beneficiary, recorded under Ruled Out).
- **coverage: PASS** — both primary-dimension questions answered (security: which store is authoritative and how validated; correctness: does the documented write path actually run), and both contracted questions terminated with mechanism evidence.
- **Leaf-contract tool calls: 13** (hard max 13, at the line — 10 evidence/analysis + 3 authoring). The closure operations (state append, acceptance gate, adjudication persistence, reductions, strategy edits, synthesis report, config status, lock release) are workflow-mandated steps, tracked separately.

## Findings by Severity

### P0

None.

### P1

**F019 — the two review variants persist the SAME adjudication event in two dialects, and the shared gateway's legacy-record acceptance covers only the research mode: the confirm variant's own documented mandate fails mechanically**

[SOURCE: .opencode/commands/deep/assets/deep-review-confirm.yaml:1276] and [:1282] — the confirm variant's `step_post_iteration_claim_adjudication` persists its on_pass/on_fail adjudication as FLAT legacy rows: `append_jsonl: '{"type":"event","event":"claim_adjudication","mode":"review","run":{current_iteration},...}'` — no stem, no event_type, no envelope.

[SOURCE: .opencode/commands/deep/assets/deep-review-auto.yaml:1938] and [:1954] — the auto variant persists the SAME event as the dotted-STEM payload `deep_review.claim_adjudication` (passed:true / passed:false) — the form the gateway's stem path admits (append-mode-event.cjs:369-377 → `adapter.prepareEvent`).

[SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:398-408] — the gateway's legacy-record branch is gated `normalizedMode === 'deep-research'`; its own comment: "Non-research modes never enter here, so they keep the original unrecognized-format rejection."

[SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:444-445] — the fall-through: `throw new Error('Unrecognized event format: expected object with stem or event_type')`.

[SOURCE: .opencode/commands/deep/assets/deep-review-confirm.yaml:99] (+ auto:100) — BOTH variants declare `state_write_protocol.applies_to: "every append_to_jsonl and append_jsonl directive in this workflow"`.

[SOURCE: the iteration-4 enforcement-identifier census] — the gateway-invocation census: auto ×12 vs confirm ×2; the adjudication step is among confirm's UNWIRED.

Empirical corroboration: BOTH wave-one lanes converged on direct-written flat rows (this lane's 9-row log; the twin's) — the operative dialect, which the review-mode gateway's acceptance does not admit.

- dimension: correctness (primary); findingClass: `gateway-legacy-acceptance-variant-split`; disposition: finding (active); confidence 0.75.
- impact: a confirm-variant lane that honors its own protocol's transport reading feeds :1276's flat row to the gateway, gets exit 2 (refused), and per the refusal discipline (exit 2 = refuse-and-halt, no direct-write fallback) terminates at its own adjudication step. Additionally the ASYMMETRY itself — the same protocol clause, wired 12× in one variant and 2× in the other, covering different steps — means neither variant satisfies the clause it shares.
- recommendation: one of (a) widen the :398 gate to `deep-review` and provide a review-record upcaster, (b) re-emit confirm:1276/:1282 as the auto:1938 stem form, or (c) amend both `applies_to` clauses to name the steps that actually wire the gateway (five-odd in auto, two in confirm) — today the clause overclaims for both variants.
- Downstream: this TERMINATES F003 (`cross-variant-persistence-mechanism-divergence`, iteration 1) — the "mechanism split" was the mode-gated acceptance all along: auto's stem rides the canonical path, confirm's flat row rides NO gateway path, and the state-log scanner (auto:560) reads the FILE, which is why it only ever matched the flat shape. Recorded as linkage in scopeProof, not a refinement; the registry transition (active → answered) belongs to the synthesis/parent binding.

Typed claim-adjudication packet (all 7 contracted fields):

```json
{
  "findingId": "F019",
  "claim": "The review variant's confirm YAML persists its claim_adjudication event as a flat legacy record (deep-review-confirm.yaml:1276/:1282) while the shared append gateway admits legacy records only in deep-research mode (append-mode-event.cjs:398-408, everything else throwing at :445); a confirm lane discharging the state_write_protocol's 'every directive' mandate (confirm:99) through the gateway therefore exits 2 at its own adjudication step and, under the exit-2-halt discipline, stops there.",
  "evidenceRefs": [
    "deep-review-confirm.yaml:1276",
    "deep-review-confirm.yaml:1282",
    "deep-review-confirm.yaml:99",
    "append-mode-event.cjs:398-408",
    "append-mode-event.cjs:444-445",
    "deep-review-auto.yaml:1938",
    "deep-review-auto.yaml:1954",
    "iteration-004 gateway-invocation census (auto x12 vs confirm x2)",
    "both wave-one lanes' direct-written flat state logs"
  ],
  "counterevidenceSought": "An alternate directive-execution contract defining append_jsonl as direct-write semantics; a logged confirm-variant run whose flat event was admitted by the review-mode gateway; an untraced wrapper that lifts the flat row into a stem before the gateway call.",
  "alternativeExplanation": "The protocol's applies_to is narrative (final-state intent), not transport-binding: the confirm variant's directives are direct writes BY DESIGN, its 2 gateway mentions cover other steps, and both lanes' direct writes are the intended reading — the divergence is then documented-intent vs documented-practice, a consistency debt rather than a mechanical failure.",
  "finalSeverity": "P1",
  "confidence": 0.75,
  "downgradeTrigger": "A confirm-variant directive contract (or a logged confirm-lane gateway admission of a flat event) demonstrating direct-write semantics; the finding then records the 12-vs-2 wiring asymmetry as a P2 documentation debt. No confirm-variant execution record was examined (dead end 3) — a positive one would also refute the mechanical reading."
}
```

### P2

**F020 — 28 of 31 registered stems have no producer, the operative dialect never reaches the ledger, and the cutover cliff is pre-armed**

[SOURCE: the 4-variant + runner producer census, this iteration] — dotted `deep_review.*` emission across all four workflow YAMLs: `migration` ×2, `claim_adjudication` ×2 (the UNREGISTERED variant — the schema'd name is `claim_adjudication_recorded`), `recovery_baseline` ×1, `iteration_error` ×1; the runner (`fanout-run.cjs`): ZERO. Against the 31-stem registered vocabulary: ≥27 stems — the entire dimension_pass / finding / evidence / convergence / run-completed spine — exist only in schema, projection and documentation.

[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts:995] — the closed-shape throw: exact-per-stem fields, 64-hex digests, sha256 payload chaining — the strictness investment guards a four-stem yield.

[SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:152-153, :193-213, :280] — the structural ledger-backing gate roots `{leaf}-ledger/frames` at the run directory and fails `ledger_backing_missing` when a complete iteration lacks ledger frames — but returns **not-enforced** until the mode reaches ledger authority. BOTH wave-one lanes passed 4-5 iterations with NO mode ledger on disk: the exemption, functioning exactly as the clause promises.

[SOURCE: the ceremony frames, this lineage] — `deep-review-audit-ledger/frames/0000000000000001.frame`: `authorization.decision.recorded`, actor `fanout-effect-writer`, decision `allow`, fence_token 1, authority `legacy_authoritative`, occurred_at 2026-09-15T09:52:29.841Z; the effect twin's `authorization_ref` binds that exact audit record. ONE fenced, authorized, chained write — at session spawn +4s. Both ceremony ledgers FROZE there: 4 iterations × 2 lanes of state writes later, still exactly 1 frame each. The security-primary observation: TODAY the AUTHORITATIVE store (`legacy_authoritative`) is the unvalidated one — flat rows, no digest, no chain, no fence — while the strongly-validated one (closed-shape, payloadDigest-chained, fenced) is prefabricated and unemployed.

[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:288, :457-459, :133-149] — the replace semantics: after the fenced append, Phase 5 "refresh the legacy projection" REBUILDS the legacy state file from the ledger (path resolution :223/:247/:254); the durable receipt even distinguishes the ledger-committed/projection-failed divergence (:143-149).

The cliff (dormant, pre-armed): at flip, (a) every legacy iteration — this lane's 9 rows, the twin's — fails `ledger_backing_missing` (:280) unless migrated; (b) the FIRST gateway append triggers the Phase-5 refresh, REPLACING the state file with the projection of the (near-empty) ledger: direct rows not folded from the ledger vanish, including this lane's line-1 config record whose executor/model attribution (cli-pi / glm-5.3-flash) SC-001 needs — the projection's thin `run_initialized` row carries only topic/maxIterations/generation/timestamp.

- dimension: security (primary) + correctness; findingClass: `ledger-authority-cutover-cliff`; disposition: finding (active); confidence 0.8.
- impact: two truths of unequal rigor; the weaker is authoritative by recorded design; the stronger activates through a flip whose write-side trigger was not located this iteration (dead end 1) and, when it fires, silently retro-flags the legacy history and rewrites the state file. Dormant today: 4×2 clean iterations, ZERO corruption warnings in either lane's reductions. Also closes F017: the ceremony answers who authorizes (the runner, ONCE, at dispatch) and the frozen frames prove the advisory runtime is the recorded design (`containmentMode: preserve` default), not a broken promise.
- recommendation: before any flip: (1) a migration emitter folding legacy rows into ledger frames — the registered `deep_review.migration`, itself currently producerless, is the natural vehicle; (2) a divergence rehearsal: run the Phase-5 refresh against a COPY of a legacy state log and diff; (3) amend the :280 detail to distinguish pre-cutover legacy rows from corruption so the retro-flag reads as phase, not failure.

**Resolutions recorded this iteration (linkage, not new findings):**

- **F003 TERMINATED** by F019 — the mechanism split (auto:1938/1954 ledger-stem+gateway vs confirm:1270/1276 flat append; scanner auto:560 naming only the flat shape) = the mode-gated legacy acceptance at :398/:445. Registry state: stays `active` with the answer recorded; formal closure = the parent's binding (REQ-003).
- **F017 TERMINATED** by the ceremony evidence — the ownership question ("who actually enforces the promised chain") = the runner authorizes ONCE at dispatch (fenced, audited, allow — the 1-frame pair) and the runtime thereafter is advisory BY RECORDED DESIGN (the `preserve` default + second-writer latch, iteration 4). Nobody watches after 09:52:29Z; that is the design, now evidence-backed.

## Traceability Checks

- **spec_code: PASS** — all five pack-mandated targets traced at source: the 31-stem vocabulary against its producers (4 dotted emissions, runner zero); the authority/cutover binding (the durable record read at :213-217, the flip machinery :204-206/:302-321, binding fail-closed :309-320); the projection's replace semantics (Phase 5, :288/:457-459, the receipt's divergence mode :133-149); the producers on both sides of the stem/legacy divide (auto-stem :1938 vs confirm-flat :1276); this lane's own 9-row log as the live specimen. Both carried questions (F003, F017) terminated with mechanism evidence. Lane record: partial, pass, partial, pass, **pass**.
- **checklist_evidence: notApplicable** — unchanged: no checklist.md in the target; the parent-REQ rows are assessed at synthesis.
- Overlays: unchanged-pending, assessed at synthesis (deferred-with-loci).
- Summary: required 2, executed 1, pass 1, notApplicable 1, gatingFailures 0.

## Assessment

- **Novelty**: the mode-gateway/ledger/projection triangulation is new evidence — iterations 1-4 saw the persistence mechanisms only through the directive-census (angle 6) and enforcement-identity (angle 9) lenses, never the acceptance branches, the ceremony frames, or the replace path. The producer census (4 dotted emissions against 30 registered, runner zero) and the 1-frame ceremony reading are both first computations. F019 subsumes F003 (linkage, not refinement); F020 closes F017. Neither direction re-enters the swept lists: angle 6 counted the directives, angle 9 counted the identifiers, this iteration read the mechanism beneath both.
- **Timing**: T0 = 1789470656 (pack-005, 11:10:56Z) → T2 = 1789471153 (11:19:13Z) = **497000 ms**.
- **stuck_count**: 0 (2 new findings; ratios 1.00 → 0.38 → 0.19 → 0.11 → **0.10**).
- **Convergence**: newFindingsRatio 2/20 = 0.10; convergenceScore post-reduction = telemetry (convergenceMode off, stopPolicy max-iterations) — the hard stop at 5/5 is policy; the lane proceeds to synthesis. Terminal 9-gate posture recorded in the report's Audit Appendix: convergenceGate no-vote (composite 0.45-weighted coverage-only), dimensionCoverageGate 4/4 with coverage_age 2, p0ResolutionGate 0 active P0, evidenceDensityGate (every active P0/P1 carries file:line), hotspotSaturationGate (no repeated finding), claimAdjudicationGate (last event passed:true), fixCompletenessReplayGate notApplicable (review-only), candidateCoverageGate + graphlessFallbackGate notApplicable (v1-legacy records). No veto; the hard stop stands.
- **hasAdvisories: true** (18 active P2).

## Ruled Out

1. **The gateway's canonical acceptance paths** — the stem path (:369-377 via `adapter.prepareEvent`) and the event_type-envelope path (:378-397 via `prepareEventWrite`) are mode-agnostic and precede the legacy branch; the auto variant's 12 stem-payload invocations are unaffected. F019 is confirm-scoped and latent. [SOURCE: append-mode-event.cjs:369-397,445]
2. **The ceremony ledgers as a corruption source** — 1+1 well-formed frames; the effect frame's authorization_ref cross-binds the audit record (audit_ledger_id, 64-hex audit_record_hash, audit_sequence 1, fence_token 1); no dangling references; the pair answers distinct questions (authorization vs effect intent) exactly as the iteration-4 triptych note predicted. [SOURCE: the two 0000000000000001.frame files]
3. **The projection's special-cased thin rows** — the `run_initialized`→4-field config collapse, the EMIT_ITERATION_ROWS suppression, the event-row rewrites: read this session (11:54-12:02Z) directly from the projection contract; consistent, not re-opened. They become LIVE only through F020's cliff. [SOURCE: runtime/lib/legacy-projections/deep-review-state-contract.ts, the 12:01-12:02Z reads]
4. **The research variant's exposure to F019** — none: the :398-408 comment states research rows keep the upcast; the research variant is the exemption's BENEFICIARY; its other flat emissions, if any, are what the upcast exists for. [SOURCE: append-mode-event.cjs:398-408]
5. **Hidden mechanical coupling enforcing the gateway on this lane's recorded deviation** — the receipt cross-check is OPT-IN (`DEEP_LOOP_VERIFY_GATEWAY_RECEIPT=1`, advisory) and the structural ledger check is not-enforced until cutover; this lane's four prior gate passes with NO ledger on disk are themselves the proof. The deviation (strategy §13 :140) is clause-backed at both ends. [SOURCE: verify-iteration.cjs:269-287]

## Dead Ends

1. **The authority-FLIP trigger's invocation site** — the machinery (AUTHORITY_FLIP_MODE_ORDER, `admitCanonicalWrite`, `resolveCutoverBinding` — :204-206, :302-321) was traced on its READ side only; who WRITES the durable legacy→ledger flip was not located this iteration. F020's WHEN stays unbounded; the flip order is described as "frozen", the write side presumably an administrative path.
2. **One truncated census token** — `deep_review.` ×1 (a partial occurrence in the 4-YAML corpus); not chased; does not affect the 4-stem producer count (all 4 counted from full dotted matches).
3. **No confirm-variant execution record** — WHICH two steps the confirm variant's 2 gateway mentions wire, and whether any confirm-lane run ever exercised its mandated path, was not examined; the ×2/×12 asymmetry stands on the counts alone. Synthesis-or-never.

## SCOPE VIOLATIONS

None. All writes: this narrative, `deltas/iter-005.jsonl`, `logs/iter-005-events.jsonl`, the state-log appends (the lane's recorded legacy-direct writer, strategy §13), the strategy's post-reduce edits, and the synthesis-phase outputs (the report, the synthesis event, the config status) — all within the lineage.

## Recommended Next Focus

None — iteration 5 of 5; the angle program (6-10) is complete and the max-iterations hard stop fires. The lane proceeds to synthesis: 20 active findings (P0 0, P1 2, P2 18), verdict CONDITIONAL, to be bound to the parent phase per REQ-003. The finding IDs are LINEAGE-SCOPED — the parent must namespace them by sessionId (`fanout-wave1-glm-1789465945073-px9i6h`) when merging with the twin lane (SC-001), whose F001-F0nn IDs WILL collide.

Review verdict: CONDITIONAL
