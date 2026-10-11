# Iteration 8: Ratchet Matching Semantics and the Path-Semantics Correction That Reconciles the 3 "Uncovered Divergences"

## Focus

All four strategy questions are resolved (deep-research-strategy.md:63-66). The residual named by iteration 7 was measurement-level and explicitly cheap: "Read local-native-divergence-ratchet.vitest.ts's matching logic (id/hash vs values) and reconcile the 3 uncovered divergences (rr-iter2-022, rr-iter3-106, rr-iter3-116)" (iteration-007.md:98). This iteration does exactly that, plus one controlled re-measurement: the ratchet's own in-process Python call and both CLI modes of `skill_advisor.py` on the three rows and their two ledgered neighbors.

Result in one line: the concern dissolves under a path-semantics correction — `skill_advisor.py --force-native` (the battery's "Python path") is a **native-engine client**, not the local Python scorer, so the five CLI-path divergences of iteration 7 are not all ratchet (engine) divergences: the three unledgered rows agree at the engine level (`memory:save` on both sides), the two ledgered rows' local tops and prompt hashes match the ledger exactly, and the surviving unledgered signal is a native-internal **client-order split** (bridge vs daemon over identical candidate values).

Ambiguous input: focus reads "[All tracked questions are resolved]" in both strategy and dispatch; interpretation chosen, as iterations 5-7, is to measure the residual named by the latest iteration's Recommended Next Focus — the narrowest evidence-backed reading. Deferred: re-opening Q1-Q4 (would repeat resolved evidence).

Out of scope respected: P4, P7 and DOC-331 are recorded as evidence only; no fix is proposed (deep-research-config.json:2). No researched file was modified; `git status --porcelain` before and after the live probes is byte-identical (pre-existing `M spec.md` + untracked `research/` only).

## Actions Taken

1. Re-read state (config, state log, strategy, iteration-007.md) and verified the write boundary: iteration-008.md and deltas/iter-008.jsonl were absent before writing; only the two allowed artifacts plus append-gateway writes were created.
2. Read `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts` end-to-end to fix matching semantics: id-keyed ledger lookup (:254, :266, :317, :331, :346), the five fail rules (:289, :303, :315, :329, :343), the Python call signature (:167) and env (:176-179), and the native side's in-process scorer (:200-202).
3. Queried the ledger fixture by jq: 73 entries, schemaVersion 1; of the five row ids only `rr-iter3-061` and `rr-iter3-081` exist; the other three are absent by id, and their prompt hashes (`46cbebba…`, `c0547d1f…`, `e8fdb27b…`) appear zero times in the ledger.
4. Computed the current corpus sha256 for the five prompts and compared with the ledger's recorded `promptHash`: `rr-iter3-061` and `rr-iter3-081` match byte-for-byte.
5. Re-ran the ratchet's exact local Python invocation (importlib + `analyze_prompt(confidence_threshold=0.8, uncertainty_threshold=0.35, confidence_only=False)` under the ratchet's FORCE_LOCAL / no-semantic env, `PYTHONDONTWRITEBYTECODE=1`) on the five rows: `memory:save` 0.95 for the three; `system-deep-loop` 0.91 for rr-iter3-061; `sk-prompt` 0.95 for rr-iter3-081. Five calls ≈ 0.11 s warm.
6. Read `skill_advisor.py`'s flag semantics (:4742-4745, :4865, :4889, :4899) and the native bridge (:700, :713-715), then read the battery's Python mode (:45, :53 and the `--via python` help at :64).
7. Live three-mode probe on rr-iter3-061 (`--force-native` → sk-code 0.8899; `--force-local` → system-deep-loop 0.91; Node CLI → system-spec-kit 0.8364) and a Node CLI probe on rr-iter2-022 (`memory:save` 0.8398 first, `system-spec-kit` 0.9417 second).
8. Re-ran the workflow reference check for the ratchet (`rg` over `.github/workflows`): no workflow invokes it; the parity-family tests workflows do run are the golden-prompt suite (:256), the scorer-eval baseline ratchet (:268), registry-drift suites (:156-159), and the warn-only admission step.
9. Noted for the record: `progressiveSynthesis` is true (deep-research-config.json:15), but `research/research.md` is outside this dispatch's allowed-write list, so it was intentionally not edited; synthesis is left to the reducer/synthesis step.

## Findings

1. **The local-vs-native ratchet matches its ledger strictly by row id and fails closed on five rules; its two sides are in-process scorers, not CLI clients.** Rule (a) fails any current top-1 divergence missing from the ledger (:315-325); rule (b) fails a ledger entry that no longer diverges (:329-338); rule (c) fails a ledgered row whose `promptHash` or `localTop`/`nativeTop` differs from the current output (:343-362, checks at :348, :351, :354); rule (d) duplicate ids (:289-300); rule (e) ledger ids absent from the corpus (:303-311). Divergence detection is the strict top-1 comparison over the union corpus (195 labeled + 22 harder rows, :142-144) between `analyze_prompt(... confidence_only=False)` in one Python subprocess with FORCE_LOCAL/no-semantic env (:167, :176-179) and in-process `scoreAdvisorPrompt` from `fusion.js` (:200-202); abstention is the shared sentinel `none` (:26-29). Python is required by default — a missing interpreter throws rather than skips (:31-34, :220-227), and the comment at :277-279 prices the default 60 s hook timeout as one Python subprocess plus ~215 in-process native calls. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:315] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:343] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:167] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:200]

2. **Path-semantics correction: `skill_advisor.py --force-native` requires the native advisor and serves its results through a Node bridge — it is not the local Python scorer.** The flag help says "Require native advisor_recommend; exit non-zero if the native path is unavailable" (:4744-4745), versus `--force-local` "Bypass native advisor_recommend and force the local Python scorer path" (:4742-4743); the native branch (:4865) and the NATIVE_CALL_FAILED exit (:4899) confirm it, and the actual scoring is reached via `_run_native_bridge`, which spawns a Node bridge (`node --input-type=module -e …`, :700, :713-715). The probe battery's Python mode invokes exactly this flag and rejects any row whose `source` is not `native` (:45, :53), so every "Python path" measurement in iterations 6-7 was a **native-engine client** measurement. Fresh probe on rr-iter3-061 shows the exact split: `--force-native` → sk-code 0.8899 (`"source": "native"`), `--force-local` → system-deep-loop 0.91 (`"source": "local"`). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4744] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4742] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:700] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py:45]

3. **Reconciliation verdict: on the ratchet's own axes the three "uncovered divergences" are not divergences, and the two ledgered rows are consistent with the ledger today.** The ratchet-exact local call returns `memory:save` 0.95 top-1 on rr-iter2-022, rr-iter3-106 and rr-iter3-116, and the native daemon returns `memory:save` first on rr-iter2-022 (conf 0.8398) — top-1 agreement, so rule (a) would not flag them; iteration 7 recorded the same three as divergent only against the `--force-native` bridge client, which ranks `system-spec-kit` first. For rr-iter3-061 the local side now returns `system-deep-loop` 0.91 — equal to the ledger's `localTop` — and for rr-iter3-081 `sk-prompt` 0.95 — equal to its ledger `localTop`; both corpus prompts hash to the ledger's recorded `promptHash` byte-for-byte (`sha256:813c84a2…`, `sha256:354772e2…`), so rule (c)'s local and hash checks pass. The native column matches the ledger on the daemon surface (rr-iter3-061 native = system-spec-kit, as ledgered). The earlier reading that the ledger is stale on the ratchet's axes is therefore falsified; the remaining unverified link is the in-process TS scorer's own ordering (daemon used as proxy). [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json:1] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-007.md:31]

4. **The surviving unledgered signal is a native-internal client-order split: the bridge and the daemon return the same candidates with the same values in a different order.** On rr-iter3-061 both were probed this iteration: the `--force-native` bridge ranks sk-code (score 0.688099, conf 0.8899) first and system-spec-kit (conf 0.8364) second, while the Node daemon ranks system-spec-kit (conf 0.8364) first and sk-code (score 0.688099, conf 0.8899) second — same candidates, same values, opposite order. On rr-iter2-022 the daemon's first recommendation carries a *lower* confidence than its second (`memory:save` 0.8398 vs `system-spec-kit` 0.9417), and iteration 7 recorded the bridge ranking the higher-confidence row first. No ledger entry describes this client-level divergence, and the ratchet cannot see it by construction (its native side is the in-process scorer, and its matching is id-by-id against engine axes). Recorded as evidence only — no fix proposed for P4/P7/DOC-331. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:713] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-007.md:31]

5. **Design implication for the topic's parity check: "Python vs Node" must declare `skill_advisor.py`'s mode, because the two modes define two different comparison surfaces.** With `--force-native` the check compares two native clients (ordering-sensitive, unledgered, and it includes the bridge-vs-daemon split); with `--force-local` (or the default fallback) it compares the local Python scorer against native, which is exactly the axis the existing ratchet already ledgers with reviewed entries. The ratchet is the cheaper engine-level instrument, but its self-description as "a CI gate" (:31-33) is still not substantiated: no workflow invokes `local-native-divergence-ratchet.vitest.ts`; the workflow that runs parity-family tests runs the golden-prompt suite (:256) and the scorer-eval baseline ratchet (:268), so ledger honesty is not currently enforced. A CLI-level order check would need its own expected-divergence policy, because the engine ledger cannot cover client ordering. [SOURCE: .github/workflows/routing-registry-drift.yml:256] [SOURCE: .github/workflows/routing-registry-drift.yml:268] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:31] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-004.md:24]

6. **Cost anchors for the recommended check: the engine-level gate is cheap, and the client-level probe is the same order.** The ratchet is one Python subprocess plus ~217 in-process native calls inside a 60 s hook timeout (:277-279); the ratchet-exact local batch measured here ran five rows in ≈0.11 s warm, while iteration 7's per-prompt CLI pass cost ~282 ms mean (Node daemon) and ~827 ms mean (Python `--force-native`) per call. So wiring the existing ratchet is approximately one extra test invocation, and a bridge-vs-daemon order check over the union is one additional batched pass — not a per-prompt process fan-out. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:277] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-007.md:35]

## Questions Answered

- None of the four tracked strategy questions — all were resolved at iterations 1-5 (deep-research-strategy.md:63-66). This iteration settled the iteration-7 residual reconciliation (its Recommended Next Focus item 1) and falsified the "stale ledger" reading on the ratchet's own axes.

## Questions Remaining

- The in-process TS scorer's ordering was not measured (the daemon was used as its proxy); what would settle it: running `local-native-divergence-ratchet.vitest.ts` itself in a normal dev environment, or calling `scoreAdvisorPrompt` in-process, and observing which of rules (a)-(c) fire today.
- The full 217-prompt engine-level pass remains unmeasured; the ratchet-exact local side is cheap to batch (0.11 s / 5 rows warm), the native in-process side needs test tooling.
- (b) CI minutes added by wiring a parity gate — still requires a CI run (out of scope for this read-only packet).
- The client-order divergence class (bridge vs daemon over identical candidate values) has no measured population size; the five iteration-7 rows are its only measured instances.

## Ruled Out

- **Treating iteration 7's five CLI-path divergences as engine (ratchet-axis) divergences**: falsified by the flag semantics (skill_advisor.py:4744-4745) and the fresh probes — the three `memory:save` rows agree at engine level. Candidate for reducer promotion to Ruled Out Directions.
- **Reading `--force-native` as "the local Python scorer"**: the help text says the opposite and the run's own output marks those rows `"source": "native"`.
- **Running the ratchet test itself inside this read-only packet**: repo test tooling was avoided; the ratchet's exact local call plus both CLI surfaces were used instead. The test run is the recommended settlement step for a normal dev environment (next focus).

## Dead Ends

- None new beyond the ruled-out reading above; no direction was attempted and abandoned without recording why.

## Edge Cases

- Ambiguous input: Next Focus unresolved in both strategy and dispatch; interpretation chosen as in iterations 5-7 (measure the named residual), alternatives deferred.
- Contradictory evidence: iteration 7 measured "Python" = sk-code 0.8899 on rr-iter3-061; this iteration's `--force-local` measurement says system-deep-loop 0.91. The conflict was resolved by evidence (the flag's native-required contract; the `source: native` marker), not smoothed over — both numbers are recorded, each under its true path.
- Missing dependencies: the in-process TS scorer is not directly runnable without test tooling; the fallback was the daemon CLI as a native proxy, and every claim resting on that proxy says so.
- Partial success: all actions succeeded; the one unmeasured link (in-process TS order) is stated explicitly, not hidden.

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts
- .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py
- .github/workflows/routing-registry-drift.yml
- specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-config.json
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-strategy.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-state.jsonl
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-007.md

## Assessment

- New information ratio: 0.93
- Justification: 4 of 6 findings fully new (the path-semantics correction; the reconciliation verdict; the client-order split with fresh two-client probes; the parity-surface design synthesis), 1 partially new (the ratchet's matching semantics — iteration 4 had listed the five rules, the id-keyed matching and in-process sides are new), 1 partially new (cost/enforcement anchors refreshed) → (4 + 0.5×2)/6 = 0.83, plus the +0.10 contradiction-resolution bonus for falsifying the iteration-7 "stale ledger" reading.
- Questions addressed: iteration-007.md Recommended Next Focus item 1 (ratchet matching semantics + reconciliation of the 3 rows).
- Questions answered: none of the four tracked; the residual is now reconciled.

## Reflection

- What worked and why: replaying the ratchet's own invocation on the exact rows *before* theorizing about ledger staleness — the local side then matched the ledger, which forced the question "what did iteration 7 actually measure as Python?" and made the flag-contract read the decisive step. Measuring first also produced the ordering evidence (identical candidate values, different orders), which makes the client-level divergence class concrete rather than speculative.
- What did not work and why: iterations 6-7 treated `--force-native` as the Python axis without reading its contract; the battery's own `source == 'native'` guard (advisor-battery.py:53) was visible and should have flagged that both battery modes run the native engine. Root cause: path labels were inherited from the battery's flag names instead of being checked against flag semantics.
- What I would do differently: for any "path" in a comparison, print and record its engine provenance in the same run — the ratchet already enforces this shape (`source: local` vs `source: native`), so misattribution cannot survive the measurement.

## Recommended Next Focus

1. Settlement in a normal dev environment: run `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` (or call `scoreAdvisorPrompt` in-process) to measure the in-process TS side and confirm which of rules (a)-(c) fire today — the one link this read-only iteration proxied via the daemon.
2. If the run extends: batch the ratchet-exact local pass over the full 217-prompt union (warm cost ≈ 0.11 s / 5 rows) and pair it with an in-process native pass to produce the engine-level divergence set, then compare against the 73-entry ledger.
3. In the parity-check recommendation, declare `skill_advisor.py`'s mode explicitly, and keep the bridge-vs-daemon order split in the diagnostic record (top-1 agreement policy), never as a ledgered engine divergence.

## Next Focus

See Recommended Next Focus: settle the in-process native ordering, then the optional batched engine-level pass.
