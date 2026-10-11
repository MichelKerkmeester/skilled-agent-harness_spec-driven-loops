# Iteration 9: In-Process Native Ordering and the Full 217-Row Engine-Level Pass

## Focus

All four tracked strategy questions are resolved (deep-research-strategy.md:63-66); iteration 8's Recommended Next Focus named two measurement-level residuals: (1) the in-process TS scorer's ordering was proxied by the daemon and never measured directly; (2) the full 217-prompt engine-level pass was unmeasured (iteration-008.md:45-46, :95-96). This iteration settles both by executing the scorer directly in-process — without repo test tooling — and replaying the ratchet's exact comparison semantics over the full union.

Interpretation chosen (as iterations 5-8): measure the residual named by the latest iteration's Recommended Next Focus. Deferred: re-opening Q1-Q4 (would repeat resolved evidence).

Out of scope respected: P4, P7 and DOC-331 are evidence only; no fix is proposed (deep-research-config.json:2). No researched file was modified: `git status --porcelain` is byte-identical (shasum `78910d446fda272d290bd19a057cffd51b56e102`) before and after every live run this iteration.

Note: `progressiveSynthesis` is true (deep-research-config.json:15) but `research/research.md` is outside this dispatch's allowed-write list, so synthesis is left to the reducer/synthesis step (same handling as iteration 8).

## Actions Taken

1. Re-read state (config, state log, strategy, iteration-008.md) and verified the write boundary: iteration-009.md and deltas/iter-009.jsonl were absent before writing.
2. Read `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts` end-to-end (:1-365) to fix the replay semantics: corpus assembly (:118-144), the Python-subprocess pattern (:156-189), the native env freeze (:194-198), the native call `scoreAdvisorPrompt(prompt, { workspaceRoot })` (:200-202), and the five ledger rules (:289-362).
3. Made the TS scorer directly runnable with no test tooling: Node v26 with `module.registerHooks` mapping any `.js` specifier that fails to resolve to its `.ts` sibling, relying on Node's built-in type stripping. A first plain `import()` failed `ERR_MODULE_NOT_FOUND` on `lib/scorer/ambiguity.js` (the TS sources import `.js` specifiers); with the hook, `fusion.ts` imported cleanly and one `scoreAdvisorPrompt` call returned a top skill in 75 ms.
4. Replayed the ratchet over the full union (195 labeled + 22 harder rows): all 217 native calls in-process (`scoreAdvisorPrompt`, three env overrides deleted per :194-198) and all 217 local calls in one Python subprocess with the ratchet's exact script and env (`PYTHONDONTWRITEBYTECODE=1`, `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1`, `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`; :156-189), then reproduced the divergence loop (:251-265) and ledger rules (a)/(b)/(c) (:315-362).
5. First full pass crashed before printing (`ReferenceError: divergent is not defined` — a shorthand-variable bug in my reporting block) after the scoring had run; re-ran with the fix. No repo change either time.
6. Probed the one mismatching row live through the daemon surface: `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt 'Run `/deep:research :auto --max-iterations=8` on the routing packet.' --format json` → exit 0, `freshness: live`, top-1 `system-spec-kit` (conf 0.8251), top-2 `system-deep-loop` (0.825), top-3 `command-spec-kit` (0.82), `ambiguous: true`. (A first attempt with `--json '{"prompt":...,"topK":1}'` returned exit 64 three times — `topK` is not in that route's accepted param surface; the working shape is the one recorded in iteration-006.md:16.)
7. Pulled provenance for the mismatch: the ledger entry `rr-iter3-168` (`approvedAt` 2026-09-19, reason recorded, `promptHash` matching today's prompt), `git log` for `fusion.ts` (last change 2026-09-30, `3a4d1a8927`), the ledger fixture (last change 2026-10-10, `479186cfed`, which does not touch `rr-iter3-168`), and the entry's last edit (2026-09-17, `330427cf30`).

## Findings

1. **The in-process TS scorer is directly measurable without repo test tooling, and on every cross-checkable probe it agrees with the daemon's top-1.** A Node resolver hook (`.js` → `.ts` fallback via `module.registerHooks`) made `scoreAdvisorPrompt` runnable in-process; all 217 calls executed in 2,716 ms warm (~12.5 ms/call). On `rr-iter3-061` the in-process top is `system-spec-kit` (the ledgered and daemon first-place skill), on `rr-iter2-022` it is `memory:save` (the daemon's first-place skill in iterations 7-8), and on `rr-iter3-168` it is `system-spec-kit` (the daemon's first-place skill, probed this iteration). Iteration 8's "daemon as proxy" caveat is therefore discharged for every row where both were measured: daemon top-1 == in-process `topSkill`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:200] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-008.md:45] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-007.md:27]

2. **The full 217-row engine-level pass is real, cheap and batched: ≈3.9 s warm total (2.72 s native in-process + 1.14 s local Python in one subprocess).** That is the whole-union scoring cost of the existing ratchet model — one Python subprocess over all prompts plus all native calls in-process — well inside the ratchet's own 60 s hook-timeout budget, which its comment prices as "one Python subprocess plus ~215 in-process native scoring calls" (:277-279). No new harness is needed for the pass itself; the only thing the current repository lacks is CI wiring (iteration-008.md:35). [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:156] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:277] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1]

3. **Ledger reconciliation at engine level: the union yields exactly 73 divergences (68 labeled + 5 harder) and the ledger is current on 72 of 73 rows — 0 new drift, 0 resolved, 0 orphans, 0 prompt-hash mismatches — with exactly one rule-(c) failure: `rr-iter3-168`.** Its ledgered `nativeTop` is `system-deep-loop`; today's in-process native top is `system-spec-kit` (local top `deep-research` matches the ledger). So a run of the real ratchet today, with unchanged semantics, has one review item: re-approve or investigate that entry before the gate can pass. This is a replay of the gate's semantics, not the vitest run itself (exhausted approach: iteration-008.md:54); see Edge Cases for the transfer caveat. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:343] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json:1]

4. **`rr-iter3-168` is native-engine drift after approval, not a bridge-vs-daemon client split: the live daemon now also returns `system-spec-kit` first.** The entry was approved 2026-09-19 when native routed the `/deep:research` command to its gold hub (`system-deep-loop`, per its recorded reason); `fusion.ts` last changed 2026-09-30 and the fixture's last update (2026-10-10, `479186cfed`) does not touch this entry. Daemon and in-process native now agree on `system-spec-kit`, so the surviving mismatch is against the ledger's recorded history, not between native clients. The recorded reason's premise ("native now routes ... to its gold hub") no longer holds on this row: the gold `system-deep-loop` is now second, 0.0001 confidence behind. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json:1] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-008.md:31]

5. **At the 0.82 floor a top-1 decision can rest on ~1e-4: direct evidence from the probe row.** On `rr-iter3-168` the daemon's margin between first and second is 0.0001 confidence (0.8251 vs 0.825; raw score 0.567677 vs 0.567376, Δ≈0.0003), with a third candidate at 0.82 and `ambiguous: true`. Strict top-1 parity is the right dimension (raw confidence was already ruled out at iteration-006.md:32), but the record should carry the floor/ambiguity diagnostic alongside the top-1, and a ledgered divergence near the floor deserves the ratchet's review semantics rather than a silent re-baseline. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-006.md:32] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-008.md:31]

6. **Cost/honesty synthesis: the engine-level gate already exists and is cheap; its one honest review item today is `rr-iter3-168`; and 43 of the 73 divergences (59%) are local abstention (`none`) against a native route.** Because the majority class is "local declined, native routed", a single agreement-rate number would be dominated by the local scorer's abstention behavior; the count should be reported by class (local-none-vs-native-route / both-sides-nonempty / harder-fixture rows). The measured pass gives the briefing hard numbers: ≈3.9 s warm for the full union, 73/73 ledgered divergences with one stale `nativeTop`, and floor-level margins of ~1e-4 where top-1 flips live. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json:1] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/harder-intent-prompt-corpus.ts:1]

## Ruled Out

- **Treating `rr-iter3-168`'s `nativeTop` mismatch as a bridge-vs-daemon client-order case**: falsified by the live daemon probe — both native clients return `system-spec-kit` first; the mismatch is stale ledger history from before the native engine moved. Candidate for reducer promotion to Ruled Out Directions.
- **Reading iteration 8's "the native in-process side needs test tooling" as a hard limit**: a Node resolver hook (`.js` → `.ts` fallback) made `scoreAdvisorPrompt` directly runnable in-process; the full pass ran without vitest. Candidate for reducer promotion.

## Dead Ends

- None new beyond the ruled-out reading above; no direction was attempted and abandoned without recording why.

## Edge Cases

- Ambiguous input: Next Focus unresolved in both strategy and dispatch; interpretation chosen as in iterations 5-8 (measure the residual named by iteration 8's Recommended Next Focus), alternatives deferred.
- Contradictory evidence: the ledger's `nativeTop` for `rr-iter3-168` (`system-deep-loop`, approved 2026-09-19) contradicts today's native measurement (`system-spec-kit`, in-process and daemon). Both values are preserved with provenance; the conflict is attributed to time (engine changed 2026-09-30 / fixture refresh 2026-10-10 skipped this entry), not smoothed over.
- Missing dependencies: none — the resolver-hook technique replaced the missing test tooling, and `python3` was available.
- Partial success: the first full pass died on a script bug (`ReferenceError`) after scoring but before output; re-ran cleanly. Status remains `complete` because the final pass produced all artifacts; the recovered failure is recorded here and in Reflection.
- Transfer caveat: this is a replay of the ratchet's semantics under Node's built-in type stripping, not the vitest run; if vitest transforms the TS differently for this corpus, the predicted single rule-(c) failure could differ. The settlement step is named in Recommended Next Focus.

## Questions Answered

- None of the four tracked strategy questions — all were resolved at iterations 1-5 (deep-research-strategy.md:63-66). This iteration settled the two residuals named by iteration 8 (iteration-008.md:45-46).

## Questions Remaining

- Confirm the predicted single rule-(c) failure by running `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` in a normal dev environment; also settle the type-stripping-vs-vitest transfer caveat.
- Attribute the `rr-iter3-168` native flip to a specific commit (`3a4d1a8927` 2026-09-30 vs `479186cfed` 2026-10-10) by reading their diffs or scoring the row at both commits.
- The bridge-vs-daemon client-order class (iteration-007.md:31) still has no measured population size; the five iteration-7 rows remain its only instances, and on 061/022/168 the daemon equals in-process.
- (unchanged, out of scope here) CI minutes added by wiring a parity gate — requires a CI run.

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts
- .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl
- .skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/harder-intent-prompt-corpus.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts (imported in-process)
- .skilled/bin/skill-advisor.cjs (live daemon probe, `--help`)
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-006.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-007.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-008.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-strategy.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-config.json
- git provenance: commits `3a4d1a8927` (fusion.ts, 2026-09-30), `479186cfed` (fixture, 2026-10-10), `330427cf30` (entry last edit, 2026-09-17)

## Assessment

- New information ratio: 0.93
- Justification: 4 of 6 findings fully new (in-process ordering measured directly; full-union pass measured with cost; ledger reconciliation result; `rr-iter3-168` drift attribution with daemon agreement), 2 partially new (near-tie evidence — the floor behavior was anticipated, the 1e-4 margin is new; cost/honesty synthesis) → (4 + 0.5×2)/6 = 0.83, plus the +0.10 synthesis bonus for settling both named residuals of iteration 8 and reducing them to one concrete ledger review item.
- Questions addressed: iteration-008.md Recommended Next Focus items 1 and 2.
- Questions answered: none of the four tracked; the two measurement residuals are settled.

## Reflection

- What worked and why: measuring the in-process axis directly instead of accepting the proxy converted the last "unverified link" into numbers, and the daemon probe on the single mismatching row turned an ambiguous result into a clean attribution (engine drift, not client split). Defining the replay to mirror the ratchet's own code (same corpus assembly, same Python text, same env freeze, same comparison loops) is what makes the reconciliation result transferable.
- What did not work and why: (a) the first full pass crashed after scoring on a reporting-block bug (`divergent` shorthand undefined), costing one full pass — an avoidable script error; (b) the first daemon invocation used a param (`topK`) outside that route's accepted surface and exited 64 three times, while the working invocation shape was already recorded in iteration-006.md:16; (c) iteration 8's caution that the in-process side "needs test tooling" was carried as a limit too easily — one resolver hook falsified it.
- What I would do differently: dry-run the reporting/serialization block against synthetic data before paying for an expensive measurement pass, and copy the invocation shape from the last measured run rather than composing one from the framework's generic example.

## Recommended Next Focus

1. Settlement in a normal dev environment: run `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` and confirm the predicted single rule-(c) failure on `rr-iter3-168`; if it passes instead, reconcile the type-stripping-vs-vitest transfer difference first.
2. Attribute the `rr-iter3-168` flip: `git show 3a4d1a8927` / `git show 479186cfed` around routing precedence, or score the row at both commits.
3. If the segment extends: sample the bridge-vs-daemon client-order population, and (unchanged) measure CI minutes only via a real wired run.
4. Feed the measured numbers into the synthesis briefing: full-union engine pass ≈3.9 s warm; 73/73 divergences ledgered with one stale `nativeTop`; 43/73 (59%) local-abstention class; floor-level top-1 margins ~1e-4.

## Next Focus

See Recommended Next Focus — no strategy questions remain; the residual now reduces to one ledger review item (`rr-iter3-168`) plus the vitest confirmation.
