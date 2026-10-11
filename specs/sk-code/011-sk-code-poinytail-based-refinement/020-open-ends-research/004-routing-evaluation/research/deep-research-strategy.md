---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Recommend what a realistic held-out evaluation set and a cross-path parity check should look like for system-skill-advisor, comparing the Python path .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py with the Node path .skilled/bin/skill-advisor.cjs, and how to keep both cheap to run and honest given that the current batteries are 17 prompts plus 5 negatives, ties land at confidence 0.82, and hub admission runs in CI with --warn-only. Read-only research. Out of scope: proposing any fix for probe P4, probe P7 or admission scenario DOC-331, whose fix is in flight elsewhere.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: What should a realistic held-out evaluation set for system-skill-advisor look like: its size, the source of its prompts, its negatives, and how it stays held out from the prompts the scorer is tuned against?
- [x] Q2: What should a cross-path parity check between skill_advisor.py and .skilled/bin/skill-advisor.cjs compare (top skill, ranked list, confidence, abstain), and when should it fail?
- [x] Q3: How do the evaluation set and the parity check stay cheap to run and honest, given ties at confidence 0.82 and hub admission running in CI with --warn-only?
- [x] Q4: Which existing harnesses, fixtures and CI jobs can each recommendation extend in place, so the move stays as low as possible on the prevent-overengineering reversal-cost order?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Changing the advisor, its batteries or CI. This run is read-only; fixes are a later phase.
- Proposing any fix for probe P4, probe P7 or admission scenario DOC-331. Their fix is in flight on another branch, so their current state is moving. They may be cited as evidence of a class of problem, never as a fix target.

---

## 5. STOP CONDITIONS
- The run is bound to stop policy max-iterations: all 10 iterations run; convergence is telemetry only.
- Each research question has a path:line-backed answer, or is marked UNKNOWN with what would settle it.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: What should a realistic held-out evaluation set for system-skill-advisor look like: its size, the source of its prompts, its negatives, and how it stays held out from the prompts the scorer is tuned against?
- Q2: What should a cross-path parity check between skill_advisor.py and .skilled/bin/skill-advisor.cjs compare (top skill, ranked list, confidence, abstain), and when should it fail?
- Q3: How do the evaluation set and the parity check stay cheap to run and honest, given ties at confidence 0.82 and hub admission running in CI with --warn-only?
- Q4: Which existing harnesses, fixtures and CI jobs can each recommendation extend in place, so the move stays as low as possible on the prevent-overengineering reversal-cost order?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- following artifact names from the strategy's bounded-context snapshot directly into `runtime/scripts/routing-accuracy` surfaced a complete, internally consistent evaluation stack (corpus, holdout builder, baseline, ratchet) in one pass; the holdout's own provenance design answered most of Q1 without requiring synthesis. (iteration 1)
- symbol-level ripgrep (rg -l on the fixture symbol and on the holdout path) converted every-tuning-surface from prose into a finite consumer list, and opening each consumer's header gave the overlap semantics directly; the two env-freeze sites proved the live override surfaces exist without reading the registry in full. (iteration 2)
- symbol-level consumer scans (rg -l on fixture filenames and symbols) turned the union from prose into a finite consumer list, and reading the enforcement test before the builders showed exactly which structures a check can reuse (normalizeFamily, readJsonl, the single TRAINING_FAMILIES set). Counting rows with rg -c plus an eye pass caught the interface-line artifact (23 matches = 22 rows + 1 interface field). (iteration 3)
- reading all three harnesses in full before synthesizing — the comparison surface (strictly top-1, no confidence value anywhere) is only visible across the full assertion blocks, and each harness contributed one leg of the failure contract. The jq pass over the ledger turned "approved-divergence ledger" from prose into 73 concrete entries with review fields, and the CI grep converted "CI gate" from a claim into a checkable fact. (iteration 4)
- reading the enforcement script's body and exit contract before judging the CI posture — the "always exit 0" clause is only visible in compiled-route-admission.cjs (:19, :104), and without it the workflow line at :180 would look like a gate. Reading the workflow in full also separated the two cost tiers, which is what turned Q3's cost question into a placement answer. The ratchet's hook-timeout comment (:277-279) accidentally priced the harness — one Python subprocess plus ~215 in-process calls — which is the cost asymmetry the recommendation rests on. (iteration 5)
- running both paths on the exact battery probes with per-call timing converted every remaining structural claim into an observed number in about 75s of command wall time. Reading the shim's side-effect surface before executing (skill-advisor.cjs:85-96, :105) is what made the run honest about what it touched, and the 3x replay of the single divergence is what separates "stable, ledger-able" from "flaky". (iteration 6)
- defining the trust predicate **before** reading the numbers (the battery's own `freshness in (live|stale)` rule) is what caught the 34/49 pass as fabricated rather than recording it as a 30%-divergence finding. Reading the shim's socket handling (:86, :91, :105) before running is what made the custom-dir experiment interpretable, and the `--warm-only` probe converted "we could not cold-start a daemon" into a precise fail-closed-vs-silent-degrade contract. (iteration 7)
- replaying the ratchet's own invocation on the exact rows *before* theorizing about ledger staleness — the local side then matched the ledger, which forced the question "what did iteration 7 actually measure as Python?" and made the flag-contract read the decisive step. Measuring first also produced the ordering evidence (identical candidate values, different orders), which makes the client-level divergence class concrete rather than speculative. (iteration 8)
- measuring the in-process axis directly instead of accepting the proxy converted the last "unverified link" into numbers, and the daemon probe on the single mismatching row turned an ambiguous result into a clean attribution (engine drift, not client split). Defining the replay to mirror the ratchet's own code (same corpus assembly, same Python text, same env freeze, same comparison loops) is what makes the reconciliation result transferable. (iteration 9)
- reading the verifier's enumeration and route-proof functions before writing fixed the artifact contract up front; diff-reading the four commits against the entry's exact prompt tokens produced two clean eliminations without any write; and checking the current explicit lane with rg anchored the absence claim in the working tree rather than in history alone. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- an early grep for lane-weight-sweep and golden-prompts references in `runtime/package.json` returned nothing (exit 1) because the accuracy harness is script-driven rather than npm-script-driven; switching to fixture and script filename searches was the productive route. (iteration 1)
- the first find name-pattern pass mixed unrelated patterns and yielded no signal; filename discovery is weaker than usage discovery here because the connective tissue is imports, not names. (iteration 2)
- the repo-root rg scan over the whole worktree hung past its budget; the failure was scope, not pattern, and bounded roots fixed it. wc against assumed fixture paths failed because the three fixtures are not co-located; find-by-name resolved the real locations. (iteration 3)
- nothing failed this iteration; the wrong-directory `ls` was a path mistake, corrected immediately, and did not affect evidence. (iteration 4)
- one `rg` invocation used `-g` without `--` and died on argument parsing; the scope was fine, the shape was not. (iteration 5)
- the very first Python call failed with NATIVE_CALL_FAILED; a one-shot design would have mis-recorded it as a divergence. The root cause was not established — only the symptom and its resolution by retry were measured. (iteration 6)
- the cold-start measurement as framed in iteration 6 assumed the CLI could spawn a daemon; it cannot, so the first experiment produced degraded data. Root cause of the earlier imprecision: iteration 6 observed a warm daemon and inferred the cold path was merely unmeasured, when in fact the cold path is a different engine (local-scorer) rather than a slower daemon. The first pass's invalid data existed for minutes before the envelope check was applied — the lesson is to assert trust as part of the run, not after parsing. (iteration 7)
- iterations 6-7 treated `--force-native` as the Python axis without reading its contract; the battery's own `source == 'native'` guard (advisor-battery.py:53) was visible and should have flagged that both battery modes run the native engine. Root cause: path labels were inherited from the battery's flag names instead of being checked against flag semantics. (iteration 8)
- (a) the first full pass crashed after scoring on a reporting-block bug (`divergent` shorthand undefined), costing one full pass — an avoidable script error; (b) the first daemon invocation used a param (`topK`) outside that route's accepted surface and exited 64 three times, while the working invocation shape was already recorded in iteration-006.md:16; (c) iteration 8's caution that the in-process side "needs test tooling" was carried as a limit too easily — one resolver hook falsified it. (iteration 9)
- the first two consolidation extraction attempts failed on the read tool's annotation prefix (a parsing bug in my helper, not evidence loss); and the attribution cannot be closed by diff-reading alone because several Oct 10-11 native-vocabulary changes remain individually plausible for this row. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Attributing the rr-iter3-168 flip to 4e69fb4d45's removed native phrase boosts**: none of the four removed keys occurs in the entry's prompt, and rg finds none of them in the current explicit lane (exit 1). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Attributing the rr-iter3-168 flip to 4e69fb4d45's removed native phrase boosts**: none of the four removed keys occurs in the entry's prompt, and rg finds none of them in the current explicit lane (exit 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Attributing the rr-iter3-168 flip to 4e69fb4d45's removed native phrase boosts**: none of the four removed keys occurs in the entry's prompt, and rg finds none of them in the current explicit lane (exit 1).

### **Inducing a cold daemon spawn through the CLI**: `warm` is not a command (exit 64) and `--warm-only` fails ENOENT (exit 75) in an empty custom dir; the plain call degrades instead. Daemon lifecycle is launcher-owned, so no CLI-shaped cold-spawn measurement exists. Candidate for reducer promotion to Exhausted Approaches. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Inducing a cold daemon spawn through the CLI**: `warm` is not a command (exit 64) and `--warm-only` fails ENOENT (exit 75) in an empty custom dir; the plain call degrades instead. Daemon lifecycle is launcher-owned, so no CLI-shaped cold-spawn measurement exists. Candidate for reducer promotion to Exhausted Approaches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Inducing a cold daemon spawn through the CLI**: `warm` is not a command (exit 64) and `--warm-only` fails ENOENT (exit 75) in an empty custom dir; the plain call degrades instead. Daemon lifecycle is launcher-owned, so no CLI-shaped cold-spawn measurement exists. Candidate for reducer promotion to Exhausted Approaches.

### **Reading `--force-native` as "the local Python scorer"**: the help text says the opposite and the run's own output marks those rows `"source": "native"`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Reading `--force-native` as "the local Python scorer"**: the help text says the opposite and the run's own output marks those rows `"source": "native"`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `--force-native` as "the local Python scorer"**: the help text says the opposite and the run's own output marks those rows `"source": "native"`.

### **Reading iteration 8's "the native in-process side needs test tooling" as a hard limit**: a Node resolver hook (`.js` → `.ts` fallback) made `scoreAdvisorPrompt` directly runnable in-process; the full pass ran without vitest. Candidate for reducer promotion. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Reading iteration 8's "the native in-process side needs test tooling" as a hard limit**: a Node resolver hook (`.js` → `.ts` fallback) made `scoreAdvisorPrompt` directly runnable in-process; the full pass ran without vitest. Candidate for reducer promotion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading iteration 8's "the native in-process side needs test tooling" as a hard limit**: a Node resolver hook (`.js` → `.ts` fallback) made `scoreAdvisorPrompt` directly runnable in-process; the full pass ran without vitest. Candidate for reducer promotion.

### **Running the ratchet test itself inside this read-only packet**: repo test tooling was avoided; the ratchet's exact local call plus both CLI surfaces were used instead. The test run is the recommended settlement step for a normal dev environment (next focus). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Running the ratchet test itself inside this read-only packet**: repo test tooling was avoided; the ratchet's exact local call plus both CLI surfaces were used instead. The test run is the recommended settlement step for a normal dev environment (next focus).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Running the ratchet test itself inside this read-only packet**: repo test tooling was avoided; the ratchet's exact local call plus both CLI surfaces were used instead. The test run is the recommended settlement step for a normal dev environment (next focus).

### **Treating `rr-iter3-168`'s `nativeTop` mismatch as a bridge-vs-daemon client-order case**: falsified by the live daemon probe — both native clients return `system-spec-kit` first; the mismatch is stale ledger history from before the native engine moved. Candidate for reducer promotion to Ruled Out Directions. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Treating `rr-iter3-168`'s `nativeTop` mismatch as a bridge-vs-daemon client-order case**: falsified by the live daemon probe — both native clients return `system-spec-kit` first; the mismatch is stale ledger history from before the native engine moved. Candidate for reducer promotion to Ruled Out Directions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `rr-iter3-168`'s `nativeTop` mismatch as a bridge-vs-daemon client-order case**: falsified by the live daemon probe — both native clients return `system-spec-kit` first; the mismatch is stale ledger history from before the native engine moved. Candidate for reducer promotion to Ruled Out Directions.

### **Treating iteration 7's five CLI-path divergences as engine (ratchet-axis) divergences**: falsified by the flag semantics (skill_advisor.py:4744-4745) and the fresh probes — the three `memory:save` rows agree at engine level. Candidate for reducer promotion to Ruled Out Directions. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Treating iteration 7's five CLI-path divergences as engine (ratchet-axis) divergences**: falsified by the flag semantics (skill_advisor.py:4744-4745) and the fresh probes — the three `memory:save` rows agree at engine level. Candidate for reducer promotion to Ruled Out Directions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating iteration 7's five CLI-path divergences as engine (ratchet-axis) divergences**: falsified by the flag semantics (skill_advisor.py:4744-4745) and the fresh probes — the three `memory:save` rows agree at engine level. Candidate for reducer promotion to Ruled Out Directions.

### **Treating the rr-iter3-168 native flip as caused by the fusion.ts change 3a4d1a8927**: its complete diff for fusion.ts is section banners plus one import-path change — no scoring semantics. Candidate for reducer promotion to Ruled Out Directions. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Treating the rr-iter3-168 native flip as caused by the fusion.ts change 3a4d1a8927**: its complete diff for fusion.ts is section banners plus one import-path change — no scoring semantics. Candidate for reducer promotion to Ruled Out Directions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the rr-iter3-168 native flip as caused by the fusion.ts change 3a4d1a8927**: its complete diff for fusion.ts is section banners plus one import-path change — no scoring semantics. Candidate for reducer promotion to Ruled Out Directions.

### **Using a custom `SPECKIT_IPC_SOCKET_DIR` as an isolated measurement channel**: every call there silently degrades to the local scorer, so the channel cannot carry trusted parity data. Candidate for reducer promotion (it also generalizes: any CI runner without the live daemon is in this state). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Using a custom `SPECKIT_IPC_SOCKET_DIR` as an isolated measurement channel**: every call there silently degrades to the local scorer, so the channel cannot carry trusted parity data. Candidate for reducer promotion (it also generalizes: any CI runner without the live daemon is in this state).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Using a custom `SPECKIT_IPC_SOCKET_DIR` as an isolated measurement channel**: every call there silently degrades to the local scorer, so the channel cannot carry trusted parity data. Candidate for reducer promotion (it also generalizes: any CI runner without the live daemon is in this state).

### Assuming all three holdout source fixtures co-locate under tests/scorer/fixtures: only harder-intent-prompt-corpus.ts lives there; skill-advisor-regression-cases.jsonl is under runtime/scripts/fixtures and executor-delegation-cases.json under runtime/tests/parity/fixtures. find-by-name, not assumed paths, is the working route. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Assuming all three holdout source fixtures co-locate under tests/scorer/fixtures: only harder-intent-prompt-corpus.ts lives there; skill-advisor-regression-cases.jsonl is under runtime/scripts/fixtures and executor-delegation-cases.json under runtime/tests/parity/fixtures. find-by-name, not assumed paths, is the working route.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming all three holdout source fixtures co-locate under tests/scorer/fixtures: only harder-intent-prompt-corpus.ts lives there; skill-advisor-regression-cases.jsonl is under runtime/scripts/fixtures and executor-delegation-cases.json under runtime/tests/parity/fixtures. find-by-name, not assumed paths, is the working route.

### Comparing raw confidence values or full ranked lists as parity dimensions: no existing harness does it, no cross-implementation calibration exists, lower-rank order is unstable at the 0.82 floors/ties, and the CLI parity already requests topK:1. Candidate for reducer promotion to Ruled Out Directions. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Comparing raw confidence values or full ranked lists as parity dimensions: no existing harness does it, no cross-implementation calibration exists, lower-rank order is unstable at the 0.82 floors/ties, and the CLI parity already requests topK:1. Candidate for reducer promotion to Ruled Out Directions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Comparing raw confidence values or full ranked lists as parity dimensions: no existing harness does it, no cross-implementation calibration exists, lower-rank order is unstable at the 0.82 floors/ties, and the CLI parity already requests topK:1. Candidate for reducer promotion to Ruled Out Directions.

### Comparing raw top-1 confidence values: live measurement adds support to the earlier elimination (iteration-004.md:26) — 2/20 comparable probes drift on confidence while agreeing on top-1. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Comparing raw top-1 confidence values: live measurement adds support to the earlier elimination (iteration-004.md:26) — 2/20 comparable probes drift on confidence while agreeing on top-1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Comparing raw top-1 confidence values: live measurement adds support to the earlier elimination (iteration-004.md:26) — 2/20 comparable probes drift on confidence while agreeing on top-1.

### No other attempted approach failed this iteration; one command ran from the packet directory instead of the repo root and was re-run from the correct root. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No other attempted approach failed this iteration; one command ran from the packet directory instead of the repo root and was re-run from the correct root.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No other attempted approach failed this iteration; one command ran from the packet directory instead of the repo root and was re-run from the correct root.

### No other direction was exhausted this iteration; nothing new for the reducer's Exhausted Approaches beyond the two Ruled Out items above. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: No other direction was exhausted this iteration; nothing new for the reducer's Exhausted Approaches beyond the two Ruled Out items above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No other direction was exhausted this iteration; nothing new for the reducer's Exhausted Approaches beyond the two Ruled Out items above.

### None beyond the two ruled-out attributions above. The remaining attribution gap is a tooling limit (no checkout in a read-only packet), not an attempted-and-abandoned approach. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: None beyond the two ruled-out attributions above. The remaining attribution gap is a tooling limit (no checkout in a read-only packet), not an attempted-and-abandoned approach.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None beyond the two ruled-out attributions above. The remaining attribution gap is a tooling limit (no checkout in a read-only packet), not an attempted-and-abandoned approach.

### None eliminated beyond the ruled-out comparison dimension above. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: None eliminated beyond the ruled-out comparison dimension above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None eliminated beyond the ruled-out comparison dimension above.

### None eliminated beyond the ruled-out enforcement placement above. No direction investigated this iteration was exhausted. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: None eliminated beyond the ruled-out enforcement placement above. No direction investigated this iteration was exhausted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None eliminated beyond the ruled-out enforcement placement above. No direction investigated this iteration was exhausted.

### None new beyond the ruled-out reading above; no direction was attempted and abandoned without recording why. -- BLOCKED (iteration 9, 2 attempts)
- What was tried: None new beyond the ruled-out reading above; no direction was attempted and abandoned without recording why.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new beyond the ruled-out reading above; no direction was attempted and abandoned without recording why.

### None this iteration; no direction was eliminated. No candidates for reducer promotion to Exhausted Approaches. -- BLOCKED (iteration 3, 2 attempts)
- What was tried: None this iteration; no direction was eliminated. No candidates for reducer promotion to Exhausted Approaches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration; no direction was eliminated. No candidates for reducer promotion to Exhausted Approaches.

### Reading `freshness` as a per-call diagnostic on the degraded path — the field does not exist there; absence is the signal, which is exactly why the battery's envelope rule requires it to be present and live/stale. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Reading `freshness` as a per-call diagnostic on the degraded path — the field does not exist there; absence is the signal, which is exactly why the battery's envelope rule requires it to be present and live/stale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `freshness` as a per-call diagnostic on the degraded path — the field does not exist there; absence is the signal, which is exactly why the battery's envelope rule requires it to be present and live/stale.

### Relying on, or nesting the parity gate behind, the existing `--warn-only` admission step: its contract is always exit 0 under the flag (`compiled-route-admission.cjs:19-21`, :104), so a check there can never fail CI. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Relying on, or nesting the parity gate behind, the existing `--warn-only` admission step: its contract is always exit 0 under the flag (`compiled-route-admission.cjs:19-21`, :104), so a check there can never fail CI.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Relying on, or nesting the parity gate behind, the existing `--warn-only` admission step: its contract is always exit 0 under the flag (`compiled-route-admission.cjs:19-21`, :104), so a check there can never fail CI.

### Repo-root symbol scan over the whole worktree as the consumer census: it did not complete inside the first 90-second budget; bounded roots (.skilled/bin, .skilled/skills/system-skill-advisor, the 011 spec packet) returned the complete consumer list instead. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Repo-root symbol scan over the whole worktree as the consumer census: it did not complete inside the first 90-second budget; bounded roots (.skilled/bin, .skilled/skills/system-skill-advisor, the 011 spec packet) returned the complete consumer list instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Repo-root symbol scan over the whole worktree as the consumer census: it did not complete inside the first 90-second budget; bounded roots (.skilled/bin, .skilled/skills/system-skill-advisor, the 011 spec packet) returned the complete consumer list instead.

### Single-shot parity scoring without warm-up or retry: eliminated by the P1 NATIVE_CALL_FAILED observation — three replays of the same prompt succeeded, so a no-retry pass would record false divergences. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Single-shot parity scoring without warm-up or retry: eliminated by the P1 NATIVE_CALL_FAILED observation — three replays of the same prompt succeeded, so a no-retry pass would record false divergences.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Single-shot parity scoring without warm-up or retry: eliminated by the P1 NATIVE_CALL_FAILED observation — three replays of the same prompt succeeded, so a no-retry pass would record false divergences.

### The first `rg` for warn-only used a `-g` glob without the required `--` separator and failed with `rg: -g: No such file or directory`; the corrected bounded search returned the admission line and the workflow reference. No evidence was lost; the failure was command shape, not scope. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The first `rg` for warn-only used a `-g` glob without the required `--` separator and failed with `rg: -g: No such file or directory`; the corrected bounded search returned the admission line and the workflow reference. No evidence was lost; the failure was command shape, not scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The first `rg` for warn-only used a `-g` glob without the required `--` separator and failed with `rg: -g: No such file or directory`; the corrected bounded search returned the admission line and the workflow reference. No evidence was lost; the failure was command shape, not scope.

### The first degraded pass as parity evidence — dead as measurement, recycled as the honesty evidence in Finding 1/2. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The first degraded pass as parity evidence — dead as measurement, recycled as the honesty evidence in Finding 1/2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The first degraded pass as parity evidence — dead as measurement, recycled as the honesty evidence in Finding 1/2.

### Using tests/scorer/fixtures/README.md's one-test-file-consumes-all-fixtures claim (:27) as the consumer map: true only for tests/scorer consumers and stale for tests/parity, where local-native-divergence-ratchet.vitest.ts also imports the harder fixture (:24). The consumer map came from symbol-level ripgrep instead. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Using tests/scorer/fixtures/README.md's one-test-file-consumes-all-fixtures claim (:27) as the consumer map: true only for tests/scorer consumers and stale for tests/parity, where local-native-divergence-ratchet.vitest.ts also imports the harder fixture (:24). The consumer map came from symbol-level ripgrep instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using tests/scorer/fixtures/README.md's one-test-file-consumes-all-fixtures claim (:27) as the consumer map: true only for tests/scorer consumers and stale for tests/parity, where local-native-divergence-ratchet.vitest.ts also imports the harder fixture (:24). The consumer map came from symbol-level ripgrep instead.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- None this iteration; no direction was eliminated. No candidates for reducer promotion to Exhausted Approaches. (iteration 2)
- Using tests/scorer/fixtures/README.md's one-test-file-consumes-all-fixtures claim (:27) as the consumer map: true only for tests/scorer consumers and stale for tests/parity, where local-native-divergence-ratchet.vitest.ts also imports the harder fixture (:24). The consumer map came from symbol-level ripgrep instead. (iteration 2)
- Assuming all three holdout source fixtures co-locate under tests/scorer/fixtures: only harder-intent-prompt-corpus.ts lives there; skill-advisor-regression-cases.jsonl is under runtime/scripts/fixtures and executor-delegation-cases.json under runtime/tests/parity/fixtures. find-by-name, not assumed paths, is the working route. (iteration 3)
- Repo-root symbol scan over the whole worktree as the consumer census: it did not complete inside the first 90-second budget; bounded roots (.skilled/bin, .skilled/skills/system-skill-advisor, the 011 spec packet) returned the complete consumer list instead. (iteration 3)
- Comparing raw confidence values or full ranked lists as parity dimensions: no existing harness does it, no cross-implementation calibration exists, lower-rank order is unstable at the 0.82 floors/ties, and the CLI parity already requests topK:1. Candidate for reducer promotion to Ruled Out Directions. (iteration 4)
- No other attempted approach failed this iteration; one command ran from the packet directory instead of the repo root and was re-run from the correct root. (iteration 4)
- None eliminated beyond the ruled-out comparison dimension above. (iteration 4)
- None eliminated beyond the ruled-out enforcement placement above. No direction investigated this iteration was exhausted. (iteration 5)
- Relying on, or nesting the parity gate behind, the existing `--warn-only` admission step: its contract is always exit 0 under the flag (`compiled-route-admission.cjs:19-21`, :104), so a check there can never fail CI. (iteration 5)
- The first `rg` for warn-only used a `-g` glob without the required `--` separator and failed with `rg: -g: No such file or directory`; the corrected bounded search returned the admission line and the workflow reference. No evidence was lost; the failure was command shape, not scope. (iteration 5)
- Comparing raw top-1 confidence values: live measurement adds support to the earlier elimination (iteration-004.md:26) — 2/20 comparable probes drift on confidence while agreeing on top-1. (iteration 6)
- No other direction was exhausted this iteration; nothing new for the reducer's Exhausted Approaches beyond the two Ruled Out items above. (iteration 6)
- Single-shot parity scoring without warm-up or retry: eliminated by the P1 NATIVE_CALL_FAILED observation — three replays of the same prompt succeeded, so a no-retry pass would record false divergences. (iteration 6)
- **Inducing a cold daemon spawn through the CLI**: `warm` is not a command (exit 64) and `--warm-only` fails ENOENT (exit 75) in an empty custom dir; the plain call degrades instead. Daemon lifecycle is launcher-owned, so no CLI-shaped cold-spawn measurement exists. Candidate for reducer promotion to Exhausted Approaches. (iteration 7)
- **Using a custom `SPECKIT_IPC_SOCKET_DIR` as an isolated measurement channel**: every call there silently degrades to the local scorer, so the channel cannot carry trusted parity data. Candidate for reducer promotion (it also generalizes: any CI runner without the live daemon is in this state). (iteration 7)
- Reading `freshness` as a per-call diagnostic on the degraded path — the field does not exist there; absence is the signal, which is exactly why the battery's envelope rule requires it to be present and live/stale. (iteration 7)
- The first degraded pass as parity evidence — dead as measurement, recycled as the honesty evidence in Finding 1/2. (iteration 7)
- **Reading `--force-native` as "the local Python scorer"**: the help text says the opposite and the run's own output marks those rows `"source": "native"`. (iteration 8)
- **Running the ratchet test itself inside this read-only packet**: repo test tooling was avoided; the ratchet's exact local call plus both CLI surfaces were used instead. The test run is the recommended settlement step for a normal dev environment (next focus). (iteration 8)
- **Treating iteration 7's five CLI-path divergences as engine (ratchet-axis) divergences**: falsified by the flag semantics (skill_advisor.py:4744-4745) and the fresh probes — the three `memory:save` rows agree at engine level. Candidate for reducer promotion to Ruled Out Directions. (iteration 8)
- None new beyond the ruled-out reading above; no direction was attempted and abandoned without recording why. (iteration 8)
- **Reading iteration 8's "the native in-process side needs test tooling" as a hard limit**: a Node resolver hook (`.js` → `.ts` fallback) made `scoreAdvisorPrompt` directly runnable in-process; the full pass ran without vitest. Candidate for reducer promotion. (iteration 9)
- **Treating `rr-iter3-168`'s `nativeTop` mismatch as a bridge-vs-daemon client-order case**: falsified by the live daemon probe — both native clients return `system-spec-kit` first; the mismatch is stale ledger history from before the native engine moved. Candidate for reducer promotion to Ruled Out Directions. (iteration 9)
- **Attributing the rr-iter3-168 flip to 4e69fb4d45's removed native phrase boosts**: none of the four removed keys occurs in the entry's prompt, and rg finds none of them in the current explicit lane (exit 1). (iteration 10)
- **Treating the rr-iter3-168 native flip as caused by the fusion.ts change 3a4d1a8927**: its complete diff for fusion.ts is section banners plus one import-path change — no scoring semantics. Candidate for reducer promotion to Ruled Out Directions. (iteration 10)
- None beyond the two ruled-out attributions above. The remaining attribution gap is a tooling limit (no checkout in a read-only packet), not an attempted-and-abandoned approach. (iteration 10)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Q3: How do the evaluation set and the parity check stay cheap to run and honest, given ties at confidence 0.82 and hub admission running in CI with --warn-only? (iteration 1)
- Q4: Which existing harnesses, fixtures and CI jobs can each recommendation extend in place, so the move stays as low as possible on the prevent-overengineering reversal-cost order? (iteration 1)
- Q2: What should a cross-path parity check between skill_advisor.py and .skilled/bin/skill-advisor.cjs compare (top skill, ranked list, confidence, abstain), and when should it fail? (iteration 1)
- Q4: Which existing harnesses, fixtures and CI jobs can each recommendation extend in place, so the move stays as low as possible on the prevent-overengineering reversal-cost order? (partially constrained: the harnesses already exist; the missing piece is placement.) (iteration 4)
- Q3: How do the evaluation set and the parity check stay cheap to run and honest, given ties at confidence 0.82 and hub admission running in CI with --warn-only? (reframed by Finding 4: the cost question now includes actually running a parity gate in CI.) (iteration 4)
- None of the strategy's four questions remain open (Q1 and Q2 were answered earlier; Q3 and Q4 are answered above). Remaining uncertainty is measurement-level, not question-level: actual CI minutes added by a wired parity gate were not measured, and the frequency of 0.82-floor ties across the corpus was not quantified (both require executing the harnesses, outside this read-only run). (iteration 5)
- None at question level. Remaining measurement gaps, each with what would settle it: (a) cold-daemon Node start cost — settle by measuring a first call with no warm daemon; (b) CI minutes added by wiring a gate — settle by a CI run, out of scope for this read-only packet; (c) the full 217-prompt union's live agreement — settle by a batched pass over the union; this iteration measured the 22-probe battery only. (iteration 6)
- (b) CI minutes added by wiring a parity gate — still requires a CI run (out of scope for this read-only packet); this iteration supplies measured union-sample costs as the input estimate only (Finding 5). (iteration 7)
- The half of the segment worth an explicit note: the 3 uncovered divergences (Finding 3) are identified by row id but their status against the ratchet's actual matching semantics was not read this iteration; the check is cheap and named in Recommended Next Focus. (iteration 7)
- The full 217-prompt union pass remains unmeasured; the 49-prompt stride sample bounds the agreement estimate (~10% divergence budget) but the per-class counts on the full union are unknown. (iteration 7)
- The in-process TS scorer's ordering was not measured (the daemon was used as its proxy); what would settle it: running `local-native-divergence-ratchet.vitest.ts` itself in a normal dev environment, or calling `scoreAdvisorPrompt` in-process, and observing which of rules (a)-(c) fire today. (iteration 8)
- The full 217-prompt engine-level pass remains unmeasured; the ratchet-exact local side is cheap to batch (0.11 s / 5 rows warm), the native in-process side needs test tooling. (iteration 8)
- The client-order divergence class (bridge vs daemon over identical candidate values) has no measured population size; the five iteration-7 rows are its only measured instances. (iteration 8)
- (b) CI minutes added by wiring a parity gate — still requires a CI run (out of scope for this read-only packet). (iteration 8)
- Confirm the predicted single rule-(c) failure by running `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` in a normal dev environment; also settle the type-stripping-vs-vitest transfer caveat. (iteration 9)
- Attribute the `rr-iter3-168` native flip to a specific commit (`3a4d1a8927` 2026-09-30 vs `479186cfed` 2026-10-10) by reading their diffs or scoring the row at both commits. (iteration 9)
- The bridge-vs-daemon client-order class (iteration-007.md:31) still has no measured population size; the five iteration-7 rows remain its only instances, and on 061/022/168 the daemon equals in-process. (iteration 9)
- (unchanged, out of scope here) CI minutes added by wiring a parity gate — requires a CI run. (iteration 9)
- Pin the rr-iter3-168 flip to one commit by per-commit replay (checkout or worktree), now narrowed to the Oct 10-11 native-vocabulary and graph changes (this iteration, Finding 5). (iteration 10)
- The bridge-vs-daemon client-order class (iteration-007.md:31) still has no measured population size; the five iteration-7 rows remain its only measured instances. (iteration 10)
- CI minutes added by wiring a parity gate still require a CI run (out of scope for this read-only packet). (iteration 10)
- The full 217-prompt union pass has now been measured engine-level (iteration 9); what remains is its confirmation through the real ratchet test above. (iteration 10)
- Confirm the predicted single rule-(c) failure by running npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts in a normal dev environment; also settle the type-stripping-vs-vitest transfer caveat (iteration-009.md:95). (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
No handover.md; implementation-summary.md continuity is the scaffold default. Prior work: the epic's advisor phases scored a 17-prompt plus 5-negative probe battery (positives 14/17, negative false positives 0/5 after the name-mention scoring phase), recorded in specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/implementation-summary.md.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py (Python path); .skilled/bin/skill-advisor.cjs (Node shim over the built daemon CLI in runtime/dist); .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts (0.82 floors); .github/workflows/routing-registry-drift.yml (runs compiled-route-admission.cjs --all --warn-only); .skilled/bin/compiled-route-admission.cjs and .skilled/bin/lib/compiled-route-admission.cjs.
- Reuse candidates: the battery scripts live only in spec scratch folders (014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py; 011-round-four-remediation/003-hub-surface-precedence/scratch/advisor-battery.cjs and 008-session-aware-tie-break/scratch/advisor-battery.cjs); runtime/bench and runtime tests in system-skill-advisor; .skilled/bin/tests/compiled-route-admission.test.cjs.
- Integration points: CI workflows under .github/workflows; advisor test suites under .skilled/skills/system-skill-advisor/runtime.
- Constraints and risks: read-only; every recommendation must name its move from .skilled/repo-rules/prevent-overengineering.md and cite path:line; P4, P7 and DOC-331 are out of scope for fixes.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10 (stop policy max-iterations)
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-10-11T16:23:50Z


## Resource Map Status
resource-map.md not present; skipping coverage gate
