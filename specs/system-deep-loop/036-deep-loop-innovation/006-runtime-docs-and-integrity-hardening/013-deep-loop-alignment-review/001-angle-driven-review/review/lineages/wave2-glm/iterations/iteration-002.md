# Dimension / Focus

**Angle 17 — Ledger stem producers and the cutover cliff** (spec.md:104). Dimensions: **security (primary)**, correctness (secondary). The rationale for security-primary: the ledger/authority stack is the loop's write-integrity and bypass-detection mechanism — append-only frames, the receipt watermark that detects a direct-write bypass, the fail-closed verifier, and two environment-variable escapes; every clause of the continuity promise ("the ledger backs the projection; a bypass fails loudly") is a security claim, and this iteration's job was to find where that promise actually activates. Correctness-secondary: the registration/production/counting consistency of the vocabulary the ledger speaks.

Obligations bound by the angle text: (a) census **every stem against its producers and every producer against its stems, for both modes** — the both-modes requirement is what drove the census to the research schema as well as the review schema; (b) **say what breaks at the cutover** — answered mechanically, not rhetorically, by F007/F008.

Census universe (10 mechanical producer surfaces): the four variant workflows, `fanout-run.cjs` (the detached acceptance authority), `append-mode-event.cjs` (the gateway), BOTH reducers (`runtime/scripts/reduce-state.cjs` for review, `deep-research/scripts/reduce-state.cjs` for research), and `verify-iteration.cjs`. Registered universe: the dotted spellings extracted from BOTH ledger schemas — 32 `deep_review.*` + 29 `deep_research.*` = **61 distinct spellings**. Occurrence semantics: fixed-string occurrence counts (the `claim_adjudication`/`claim_adjudication_recorded` substring caveat noted in F006).

Inherited continuity (from phase_init + iteration 1): wave1-glm's dead end (the authority-flip WRITE side and the unbounded WHEN of the cutover); this lane's F001 downgradeTrigger (the `{AUTO_SESSION_ID}` binding); the "projected-row shape for upcast research records" question; the owner of research-auto:2474's second git-add list.

# Files Reviewed

1. `.opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts` (registration/alias objects :240, :452, :510, :548, :885; the 32-spelling extraction)
2. `.opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/` (inventory: `deep-research-ledger-schema.ts`, `deep-research-ledger-types.ts`, `legacy-compatibility.ts`, `index.ts`, `README.md`; the 29-spelling extraction; the schema dir listed, its cautionary `legacy-compatibility.ts` noted unread)
3. `.opencode/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-projections-contract.ts` (:283-294, :450-464 — the consumption arms)
4. `.opencode/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts` (:32 `EMIT_ITERATION_ROWS = true`, :148 the dead suppression guard)
5. `.opencode/skills/system-deep-loop/runtime/lib/legacy-projections/` (full inventory: 17 entries; `shadow-projection-store.ts` determined the sole `legacy-projection-watermarks` reference across the lib; `deep-research-projections-contract.ts` and `deep-research-deltas-contract.ts` present, unread)
6. `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` (:17-56, :150-158, :193-219, :255-300 — the route-proof, the 2b default-ON ledger gate, the 2c opt-in receipt check, `checkLedgerBacking`)
7. `.opencode/skills/system-deep-loop/runtime/scripts/check-direct-append.cjs` (:200-262 — the watermark reader contract: mode, artifactRoot, artifactId, legacyFile, output_digest, output_byte_length, refreshed_at; missing = violation)
8. `.opencode/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` (:27 tsx child, :112-157 the five ledger-schema imports, :207 the research upcast import, :445 the review refusal re-confirmation)
9. `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (acceptance contract :976-1028; zero `verify-iteration`/watermark/ledger references)
10. `.opencode/commands/deep/assets/deep-review-auto.yaml` (verify-iteration invocation :1663; the 4-stem dotted production :1938/:1954 + migration + recovery_baseline + iteration_error)
11. `.opencode/commands/deep/assets/deep-review-confirm.yaml` (zero verify-iteration; one `migration` occurrence)
12. `.opencode/commands/deep/assets/deep-research-auto.yaml` (:332, :477, :1663, :2465-2485; one `deep_research.run_now_restored`)
13. `.opencode/commands/deep/assets/deep-research-confirm.yaml` (:344-375 — step_create_config populate incl. :358, step_create_state_log's :365 nine-key content; :561 warning; zero verify-iteration)
14. `.opencode/commands/deep/review.md`, `.opencode/commands/deep/research.md` (census: zero `verify-iteration`, zero `AUTO_SESSION_ID`, zero references to the three inspection tools)
15. `.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` + `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` (census surfaces: zero dotted-stem contributions)
16. `.opencode/skills/system-deep-loop/deep-review/references/state/` (the four reference docs — state-format.md, state-jsonl.md, state-outputs.md, state-reducer-registry.md — counted: ZERO dotted-stem mentions)

Census mechanics note: the extraction pattern is `deep_[a-z_0-9]+\.[a-z_0-9]+` (an alternation form `deep_(review|research)_…` silently matched nothing — the trailing-underscore variant was wrong; the plain pattern, proven, produced the 61).

# Scorecard

- Iteration 2 of 5. Focus: angle 17. Dimensions: security + correctness. No gating failures.
- Findings: 4 new (P0 0, P1 1, P2 3) → cumulative 9 active (P0 0, P1 2, P2 7); 0 resolved; 0 refined.
- `newFindingsRatio` (count-based, precedent): (4 + 0.5×0) / (5 + 4 + 0) = 0.44.
- **Mechanical gate, measured**: `verify-iteration.cjs --loop-type review --artifact-dir <lineage> --iteration 1 --json` → `{"ok":true,"reason":null,"detail":"iteration 1 complete: narrative + route-proof + delta"}`, exit 0. The 2b ledger-backing gate passed via its `not-enforced` path (no receipt watermark exists) — the direct-writer precedent's compatibility is now a measured fact, not an inference. The gate is read-only (verified: zero `write*Sync` in the verifier and in `check-direct-append.cjs`).
- Convergence telemetry (mode: off — signals are TELEMETRY ONLY, the stop condition is iteration 5 of 5): rollingAvg window (last 2 evidence-bearing iterations) = (1.00 + 0.44)/2 = 0.72 ≥ 0.08 → the rolling signal votes NO-STOP; MAD needs a 3-point window → insufficient; dimension coverage 3/4 (correctness, traceability, security evidenced; maintainability pending angles 18/20) = 0.75, not stable; semanticNovelty: high (4 new, 0 refined, entirely new mechanism loci); compositeStopScore: not emitted (mode off, insufficient signals). minStabilizationPasses: elevated to 2 (security/schema/persistence target); this iteration = stabilization pass 1 of 2.
- Duration: 2026-09-15T13:04:08Z → 13:18:00Z (832,000 ms).

# Findings by Severity

## P0

No P0 findings this iteration.

## P1

### F007 — The ledger-authority flip is emergent, its write side is the gateway's shadow projection store, and enforcement is triple-split: receipt-gated not-enforced, a 1/0/1/0 invocation matrix, and a runner acceptance that never calls the verifier — the containment promise activates for no published mechanical writer (security, cross-consumer)

**Evidence.**
1. `checkLedgerBacking` (`verify-iteration.cjs:202-219`) consults `checkGatewayReceipt` FIRST; without an `ok`/`violation` authority it returns `not-enforced` — by its own comments (:152-153, :200-201) a deliberate no-op "everywhere a mode still runs on the legacy writer". The 2b gate (default ON; `DEEP_LOOP_LEDGER_BACKING_GATE=0` disables) fails a record only when the authority is `ok`/`violation` AND no `<deep-review-ledger>/frames/*.frame` exists.
2. The WRITE side wave1-glm could not locate: `rg -ln "legacy-projection-watermarks"` across `runtime/lib` returns exactly ONE hit — `shadow-projection-store.ts` — which the gateway reaches through its tsx child (`append-mode-event.cjs:27`, the five ledger-schema imports :112-157, the upcast import :207). The flip is therefore not an event, flag, or migration step: it happens when the FIRST receipt+frames pair comes to exist.
3. The frames lookup roots are `[artifactDir, dirname(artifactDir)]/<leaf>-ledger/frames` (:209-211). For a lineage-rooted run the secondary root reaches OUTSIDE the lineage (`…/review/lineages/deep-review-ledger/frames`), and nothing reports WHICH root produced a found (or missed) ledger — a shared, lineage-external, per-artifactId namespace with silent fallback semantics.
4. Invocation matrix (`rg -c "verify-iteration"`, 7 dispatch surfaces): deep-review-auto 1× (:1663), deep-research-auto 1× (:1663), **deep-review-confirm 0×, deep-research-confirm 0×, review.md 0×, research.md 0×, fanout-run.cjs 0×**. The runner — the acceptance authority for detached lanes (fanout-run.cjs:976-1028: it parses the state log, counts iteration files, checks the synthesis stopReason) — never gates. This extends wave1-glm's F018 (which knew only the review pair's 1×/0×) to the full 1/0/1/0 + runner-never matrix, and confirms the spec's own :103 assertion.
5. Both escape switches are documented ONLY in source comments: `DEEP_LOOP_LEDGER_BACKING_GATE=0` (verify-iteration.cjs:269-270, "an emergency escape") silently kills 2b; `DEEP_LOOP_VERIFY_GATEWAY_RECEIPT=1` (:286-292) — documented "advisory only — a warning, never a hard failure" for 2c — ALSO hardens 2b, because `checkLedgerBacking` consults the receipt unconditionally: once a receipt exists and disagrees, `violation` → frames check → `unbacked` → loud failure. The same env var changes 2b's outcome from not-enforced to enforced.
6. The inspection toolchain EXISTS and is unwired: `verify-authority.cjs`, `check-projection-coverage.cjs`, `check-protocol-append-sites.cjs` all ship in `runtime/scripts/`; the reference census (four variant YAMLs, both command markdowns, the runner) returns ZERO occurrences for all three.
7. OPERATIONAL: this lane's iteration-1 legacy-direct record, gated TODAY, passes — `{"ok":true,"detail":"iteration 1 complete: narrative + route-proof + delta"}`, exit 0 — the 2b not-enforced path measured live on the operative precedent.

**Scope proof.** The affected mechanism spans both review variants, both research variants, the gateway, the runner's acceptance path, and the shared watermark/frames namespaces — read at the cited loci plus the 7-surface invocation census; the affected class (bypass detection, append-only integrity, cutover enforcement) is exactly the state_write_protocol's promise, which all four variants declare over "every append_to_jsonl and append_jsonl directive" (the angle-16 wiring counts: 12/2/2/1 sites).

**Affected surfaces:** `verify-iteration.cjs` 2b/2c · `check-direct-append.cjs` watermark contract · `shadow-projection-store.ts` (sole watermark writer) · `fanout-run.cjs:976-1028` acceptance · all four variants' gate steps · `.legacy-projection-watermarks/` + `<deep-review-ledger>/frames/`.

**Claim-adjudication packet (required, P1).**
- **claim**: the ledger-backing containment gate is default-ON yet passes vacuously for every mechanically-produced iteration record, because (a) no published writer produces receipts+frames (the registry speaks 5 of 61 spellings — F006) and (b) the only verifier invocations live in the two AUTO variants, which the detached fanout path never executes.
- **evidenceRefs**: the seven numbered evidence blocks above; the sole-writer rg; the 7-surface invocation census; the measured exit-0.
- **counterevidenceSought**: searched for any mode/flag/step that flips ledger authority (rg `authority|ledgerAuthoritative|ledger_authoritative` across the four scripts: only the 2b comment); searched all four YAMLs for `DEEP_LOOP_*` exports: none; searched the runner for verifier/ledger/watermark references: none; looked for a second watermark writer anywhere in `runtime/lib`: none.
- **alternativeExplanation**: the design may intend a deliberate, operator-executed mid-migration cutover (run the gateway once by hand; the not-enforced comments read that way). That explains the not-enforced default but not the variant-asymmetric invocation, the unwired inspection tools, or the unreported frames-root.
- **finalSeverity**: P1. **confidence**: 0.8.
- **downgradeTrigger**: if the packet's documentation already records the emergent flip, both switches, the runner's intentional exclusion, AND the frames-root scope decision, this collapses to P2 documentation-drift.

**Recommendation.** Publish the authority state machine (which of not-enforced/backed/unbacked applies, and from where); wire `verify-authority.cjs` (or equivalent) into the workflows' gate steps or the runner's acceptance; name both env switches where the packs state the gateway mandate; decide the frames-root question (lineage-internal vs packet-level) BEFORE the flip, and report which root produced a ledger.

## P2

### F006 — The 61-spelling registered ledger vocabulary is 92% authorless: 27 of 31 review-canonical stems AND 28-or-29 of 29 research spellings have no mechanical producer, the reference prose never names the vocabulary, and the "unregistered variant" framing needs one correction (traceability, class-of-bug)

**Evidence.** The 10-surface census over the 61 dotted spellings extracted from BOTH schemas: spoken = `deep_review.claim_adjudication` (2 — review-auto:1938/:1954), `deep_review.migration` (2 — review-auto 1, review-confirm 1), `deep_review.iteration_error` (1 — review-auto), `deep_review.recovery_baseline` (1 — review-auto), `deep_research.run_now_restored` (1 — research-auto). **56 of 61 (92%) are spoken by NO mechanical writer.** The gateway, BOTH reducers, the verifier and the runner contribute ZERO dotted literals — the gateway is vocabulary-generic (it imports the schemas, :112-157). The review-canonical count: 27 of 31 authorless — the 32nd extracted spelling, `deep_review.claim_adjudication` (:452, flat required fields `['runId','sessionId']` at :548), reads as the LEGACY-ALIAS key (cohering with wave1's F019/F020 "unregistered variant" framing and with the research schema's own `legacy-compatibility.ts`), so wave1's wording survives with one clarification: the alias spelling IS schema-present; what nothing speaks is the canonical `claim_adjudication_recorded` (:240, :510, :885). The reverse direction ("every producer against its stems"): the only writers speaking ANY registered vocabulary are deep-review-auto (4 stems), deep-review-confirm (1: migration), deep-research-auto (1: run_now_restored). And the reviewer-facing references (`references/state/*.md`, four docs) carry ZERO dotted-stem mentions — the ledger's vocabulary exists only in TypeScript.

**Consequence.** The registered 31+29-event ledger can never be exercised as published: there is nothing to wire the 52 never-spoken remainders TO (no producer addresses them by name), and the cutover's "what breaks" includes a silently-empty enforcement surface — the verifier can only ever demand frames for events someone happened to speak.

**Affected surfaces:** `deep-review-ledger-schema` (all registrations) · `deep-research-ledger-schema` · `deep-review-projections-contract` consumption arms · the four variants' state_write_protocol · `references/state/*.md`.

**Recommendation.** Add a producer column to each registration (which of the 10 surfaces speaks it, or none); surface the dotted vocabulary in the reviewer-facing references; adopt the corrected counts (27/31 review-canonical, 1/29 research, 56/61 total) at the SC-001 merge; either wire or annotation-retire the 52.

### F008 — The sanctioned future's state-log richness has a registration-bounded ceiling: the projection consumes exactly the registered stems (whose spoken half is 5), EMIT_ITERATION_ROWS is currently true, and the anticipated suppression is a one-constant flip (security, cross-consumer)

**Evidence.** The consumption arms consume registered stems ONLY: `deep-review-projections-contract.ts:283-294` shows the evidence/claim/finding arms (`buildEvidenceRecord`; `buildAdjudicationRecord` for `deep_review.claim_adjudication_recorded`; the `finding_lineage_recorded` arm), :450-464 the same. The state contract's emitter: `EMIT_ITERATION_ROWS = true` (`deep-review-state-contract.ts:32`) — so wave1-F020's "suppression" is ANTICIPATED, not present; the `:148` guard is currently dead code. The gateway refuses review-mode rich records (`append-mode-event.cjs:445`, wave1 F019, re-confirmed on this tree), so the sanctioned review path = stem-shaped closed records whose projection rows carry only the arms' fields. The scissors: producers speak 5 of 61 (F006), the consumer speaks 61, and the mandated rich record sits in NEITHER spoken set's intersection with the arms — a cutover'd review lane loses exactly the attribution wave1 F020 documented, and no enforcement step would notice (F007's not-enforced).

**Affected surfaces:** `deep-review-projections-contract.ts` · `deep-review-state-contract.ts` · any future review lane adopting the gateway path · wave1 F020's collapse documentation.

**Recommendation.** State the sanctioned review-lane record shape (which registered stem + which closed payload) beside the packs' gateway mandate; pin `EMIT_ITERATION_ROWS`'s intended final value in the prose contract (state-format.md) rather than as a const; make the arms' field-loss explicit in the cutover documentation.

### F009 — Three carried questions closed: the {AUTO_SESSION_ID} token is declared twice and bound nowhere (research-auto's literal-fallback guard is dead-on-arrival for token-populated configs); research-auto:2474's second git-add is reference-only appendix; F001's downgradeTrigger adjudicates NOT-collapsed and its 8-key census corrects to nine (correctness, matrix/evidence)

**Evidence.**
1. The token: declared at research-confirm:358 (`lineage.sessionId: "{AUTO_SESSION_ID}"`, inside step_create_config's populate) and at research-auto:332 (`session_id_init: "{AUTO_SESSION_ID}"`); read ONCE at research-auto:477 — `String(config.lineage?.sessionId ?? '{AUTO_SESSION_ID}')` — where a token-populated config yields the truthy 16-char literal, so the `??` fallback can never fire; ZERO occurrences in either command markdown or the runner: the VALUE is defined nowhere. Research-confirm has no read machinery at all (its :561 warning is convergenceMode-only).
2. research-auto:2465-2485: the second git-add list lives in `reference_only_appendix.checkpoint_commit`, whose own note says "Checkpoint commits are intentionally excluded from workflow.steps" — no owning step exists.
3. F001's trigger: **NOT-collapsed** — the token is unbound AND the state-log record drops the lineage block entirely (step_create_state_log's :365 content: nine keys — type, topic, maxIterations, convergenceThreshold, antiConvergence, resource_map_present, resource_map, createdAt, specFolder — no lineage/mode/stopPolicy/executor), so **F001 stands at P1**. Its recorded 8-key count was one short (the `type` key); the substantive divergence is unaffected — the corrected count is nine.

**Affected surfaces:** research-confirm:344-368 · research-auto:332, :477, :2465-2485 · F001 (this lane) · wave1 F019/F020 wording (SC-001 merge).

**Recommendation.** Bind the token (one assignment in the confirm variant's setup, or drop the key); make research-auto:477's fallback also compare the unrendered literal; adopt the nine-key count in the merged F001; note the :2465-2485 appendix's reference-only status at the merge.

# Traceability Checks

- **spec_code — PASS** (gate class: hard). Required: the angle's two census directions + the what-breaks clause. Executed: the both-modes 61-spelling × 10-surface census INCLUDING the reverse producer-coverage matrix (5-stem); the what-breaks answered mechanically (F007: the emergent not-enforced → receipt-gated → unbacked ladder, the 1/0/1/0 + runner-never invocation matrix, the located sole writer; F008: the registration-bounded projection ceiling); the operative precedent MEASURED (iteration-1 gate: exit 0 via 2b not-enforced). Boundary stated: locus-read, not line-read; the research-side canonical/legacy split and the :452-object's exact structural role carry 0.8 confidence (see Dead Ends).
- **checklist_evidence — notApplicable** (gate class: hard). Unchanged from iteration 1: no checklist.md; acceptance-criteria.md remains the single template AC-001 row (Status Unmet); implementation-summary.md remains scaffold (completion_pct 0), so the AC_COVERAGE exemption predicate ("checklist.md exists AND implementation-summary.md in-progress or later") is inactive. No per-iteration checklist rows exist; the protocol is assessed at synthesis.

Summary: required 2, executed 1, pass 1, partial 0, fail 0, blocked 0, notApplicable 1, gatingFailures 0.

# Assessment

**Verdict rationale.** CONDITIONAL: 0 active P0, 2 active P1 (F001 from iteration 1, F007 from this iteration) — the lane continues; convergence is telemetry (mode off); the stop condition remains iteration 5 of 5 with `stopReason: maxIterationsReached`.

**Continuity — the five carried items, adjudicated:**
1. **Wave1's authority-flip dead end — CLOSED.** The WRITE side is `shadow-projection-store.ts` (sole `legacy-projection-watermarks` reference in `runtime/lib`, reached via the gateway's tsx child); the WHEN is emergent — the first receipt+frames existence, not a ceremony. Wave1's "cutover cliff's WHEN stays unbounded" is now bounded: it happens when the FIRST receipt+frames pair exists, and until then every gate is not-enforced.
2. **F001's downgradeTrigger — adjudicated NOT-collapsed** (F009 clause 3): the token is bound nowhere and the state-log record drops the lineage block regardless; F001 stands P1. Its 8-key count self-corrects to nine.
3. **The "projected-row shape for upcast research records" — PARTIAL.** The review-side arms read (F008); the research-side contracts (`deep-research-projections-contract.ts`, `deep-research-deltas-contract.ts`, `legacy-compatibility.ts` — all present in `lib/legacy-projections/`) were NOT read this iteration; the question's research half is tracked for angle 20.
4. **research-auto:2474's owner — CLOSED**: reference-only appendix, no owning step (F009 clause 2).
5. **Wave1's confirm-variant execution archaeology — UNTOUCHED by this angle's evidence** (no confirm-lane run history surfaced); remains tracked for angle 20.

**Premise corrections this iteration owes the parent (for SC-001):** the packet's angle-17 premise "twenty-eight of thirty-one registered stems have no producer" (a) holds only for the review side and only at 27/31 once the 32nd spelling is classified as the legacy-alias key; (b) the research side is 1/29 spoken — 28-or-29 authorless pending the canonical/legacy split; (c) BOTH modes: 56/61 = 92%. The packet UNDERSHOT the cliff. Wave1's F018 invocation asymmetry extends to the 1/0/1/0 + runner-never matrix. Wave1's F019/F020 "unregistered variant" wording survives with the F006 clarification.

**Severity-vocabulary note:** no packet-P3 ratings were made this iteration (all four findings P1/P2), so the documented P3→P2 collapse rule had no occasion to fire; the four-tier-vs-three-tier authority question remains angle 19's.

# Ruled Out

1. **The wave1 28/31 count as 10-surface-stable** — ruled out: at 10 surfaces (adding BOTH reducers) the review-canonical count is 27/31; the 32nd spelling is the legacy-alias key, not a 32nd registration; and the research half (1/29 spoken) was outside the premise entirely. Evidence: the summed census + the reverse matrix, this session.
2. **The research YAMLs' inline event records as speakers of the dotted registry** — ruled out: 29 research spellings, 1 spoken (`run_now_restored`); the inline records speak EVENT-NAME records (the 7-key synthesis_complete :1601-1608, the 4-key blocked_stop) — the dotted-registry↔event-name join lives in the schemas' prepareEvent, which was NOT read (noted, not ruled). Evidence: the summed census + the angle-16 loci.
3. **The runner as a mechanical gate** — ruled out: zero `verify-iteration` occurrences in `fanout-run.cjs`; zero watermark/ledger references; its acceptance (976-1028) parses records and counts files, it never gates. Evidence: the 7-surface invocation census (1/0/1/0,0,0,0) + the measured exit-0 on this lane's unbacked iteration-1 record.
4. **EMIT_ITERATION_ROWS=false as the present state** — ruled out: `deep-review-state-contract.ts:32` = true; the :148 guard is dead code; the suppression wave1 anticipated is a one-constant flip, not the current mechanism. Evidence: :32, :148.

# Dead Ends

1. **The :452-object's structural role** (legacy-alias key vs a 32nd registration) — resolved to 0.8 confidence by structure (:548's flat camelCase required fields, the research schema's parallel `legacy-compatibility.ts`), not by reading the surrounding export; a direct read of the map's enclosing export settles it. This is F006's only confidence deduction and its downgradeTrigger.
2. **The research-side canonical/legacy split** — `deep-research-ledger-schema/legacy-compatibility.ts` and the research projection/deltas contracts exist but were not read; until then the research authorless count is "28-or-29 of 29".
3. **What `shadow-projection-store.ts` writes when invoked** — the store's internals are unread; the WATERMARK CONTRACT is cited from its reader (`check-direct-append.cjs:200-262`: mode, artifactRoot, artifactId, legacyFile, output_digest, output_byte_length, refreshed_at; missing = violation). Whether the writer publishes more (or less) than the reader requires is unverified.
4. **Which of `checkLedgerBacking`'s TWO roots produced any found ledger** — the function reports existence, not provenance (`verify-iteration.cjs:209-215`); latent until any frames exist at all.
5. **The event-name→stem join mechanism** (prepareEvent / the upcast's target spelling) — the acceptance branches were read (iteration-1 era + :207/:445 this iteration) but the mapping TABLE, if any, was not; it decides whether the 52 never-spoken remainders are wireable without schema changes.

# SCOPE VIOLATIONS

None. All writes stayed inside the lineage: `prompts/iteration-002.md`, `iterations/iteration-002.md`, `deltas/iter-002.jsonl`, `logs/iter-002-events.jsonl`, and two appended rows in `deep-review-state.jsonl`; the state log was touched only by the sanctioned lane-direct appends (append-only, `>>`); the verifier run was read-only. No reviewed artifact was modified.

# Recommended Next Focus / Next Dimension

**Angle 18 (spec.md:105) — Agent mirror dialects**, dimensions: traceability (primary) + maintainability. The declared work: the full 12-agent × 4-runtime declaration matrix (wave1 sampled 3-4 agents) — sampling configuration (OpenCode-only), the permission deny half (three translations), the tool lexicon (three dialects, no crosswalk), model attraction (unowned in three trees, pinned in the fourth), the leaf contract disagreement (agent file vs workflow vs state schema) — plus the retried wave1 question of the `.pi` agent body order. Angle-17 hand-offs: the projection contracts' research-side arms (unread) merge naturally into the matrix's state-schema column; the harness-mapping question of dead-end 5 (prepareEvent) is available to whoever next reads the gateway's TS child.

Review verdict: CONDITIONAL
