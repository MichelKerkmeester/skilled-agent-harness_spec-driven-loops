# Iteration 2: The Carrier Question and the Judge Path

## Focus

Two questions, in the priority order the dispatch names:

1. **The carrier question** (key question 5, and the live half of the Iteration 1
   contradiction): read `.opencode/commands/rewrite/response.md` and
   `response-by-external-agent.md` together with `src/runtime/project-message.ts` to establish
   where, if anywhere, the wording standard enters a rewrite — at the agent/command layer, at the
   provider instruction layer, or nowhere — and whether the engine's `COPY_EDITING_INSTRUCTION` is
   a second home for wording knowledge or merely a target noun plus a style label.
2. **The judge and policy path**: establish whether the engine lanes have a quality veto at all,
   which is the precondition for key question 3 (what post-condition the validator could check).

Key question 2 (a transform layer) was deliberately **not** opened: designing transforms before the
carrier and post-condition facts are settled risks proposing a second home for the wording standard.
Key question 4 was also not opened; it depends on the lane facts established here.

## Actions Taken

1. Read the run state: `deep-research-config.json`, `deep-research-state.jsonl`,
   `deep-research-strategy.md`, `findings-registry.json`. Confirmed iteration 2, one prior iteration
   record (status `complete`), `convergenceMode: off`, `progressiveSynthesis: true`.
2. Read `.opencode/commands/rewrite/response.md` (150 lines, full).
3. Read `.opencode/commands/rewrite/response-by-external-agent.md` (250 lines, full).
4. Read `src/config/local-provider.ts` (320 lines, full) — the constant, the profile builder, and
   the `judgeMode` decision.
5. Read `src/runtime/external-cli-projection.ts` lines 1-120 — the constant, the judge-mode
   constant, and the `projectMessage` call.
6. Read `src/fidelity/reject-only-judge.ts` (47 lines, full) — the default judge implementation.
7. Read `src/runtime/project-message.ts` (295 lines, full) — the judge wiring and the accept path.
8. Ripgrep of `judgeMode` / `COPY_EDITING_INSTRUCTION` across the package for all call sites.

## Findings

1. **The wording standard enters a rewrite at exactly one kind of site: the executing agent's own
   loaded context. There is no provider-prompt carrier and no restated copy anywhere.** Both commands
   load the standard **by reference** for the in-context (native) lane:
   `/rewrite:response` Step 4 points at `hvr-rules.md` ("the standard itself… This is what 'plain
   English' means in this repository"), `scope-and-exemptions.md` (the scope gate), and
   `SKILL.md` §3; `response-by-external-agent.md` Branch A points at the same three. The NOTES of
   `/rewrite:response` state the rule explicitly: "Standard By Reference: The wording standard is
   the Human Voice Rules in `sk-doc`, read at invocation rather than copied into this file. A change
   to the standard reaches this command with no edit here."
   `[SOURCE: .opencode/commands/rewrite/response.md:71-74,149]`
   `[SOURCE: .opencode/commands/rewrite/response-by-external-agent.md:136-139]`

2. **The engine is reached only from the branches that do *not* carry the standard, and the command
   file documents that asymmetry as a design fact.** `/rewrite:response` never invokes the engine at
   all ("Operates entirely in-context… Uses no local or external LLM providers, CLI dispatches, or
   background services"). In `response-by-external-agent.md`, Branch A (native) is the only branch
   that loads the standard; Branches B (external CLI) and C (local LLM) hand the target to the
   package entrypoints. The command's NOTES say so in one sentence: "The Standard Reaches Branch A
   Only — Branches B and C hand the target to another model under the package's own one-line
   copy-editing instruction, `COPY_EDITING_INSTRUCTION`… An external or local rewrite is therefore
   held to fidelity validation and the exact-original fallback, not to the Human Voice Rules."
   `[SOURCE: .opencode/commands/rewrite/response.md:15-19]`
   `[SOURCE: .opencode/commands/rewrite/response-by-external-agent.md:132-171,249]`

3. **The engine's `COPY_EDITING_INSTRUCTION` is not a second home for wording knowledge. It is a
   target noun, a style label, and an output constraint — no rules, no lists, no repairs.** The
   literal is `'Rewrite only the user message in plain English. Output only the rewrite.'` at both
   declaration sites, and the command file treats it as "a compiled package constant carried in the
   versioned prompt profile, so it is changed under the package gate rather than from a command
   file". The style label "plain English" is a by-name reference to the standard that the *reading
   agent* is expected to have loaded; in Branches B/C no reader with the standard in context exists,
   so the label denotes nothing in the only text the provider receives. The distinction that matters
   for the one-home rule: a label is not a second copy, but it is also not a carrier — the standard
   is *absent* from the provider lane, not duplicated there.
   `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/config/local-provider.ts:63-65]`
   `[SOURCE: .opencode/commands/rewrite/response-by-external-agent.md:249]`

4. **Both lanes run `judgeMode: 'required'`, so both have a veto on the accept path.** The local
   loader hard-codes `judgeMode: 'required'` in `buildLocalProjectionConfig`; the external CLI
   runtime declares `const EXTERNAL_CLI_JUDGE_MODE: JudgeMode = 'required'` with a comment stating
   that a judge rejection or any failure returns the exact original. The shared wiring in
   `projectMessage` constructs the judge only when `judgeMode === 'required'` and passes it into
   `validateProjectionCandidate`; a non-accepted validation returns the byte-exact original.
   `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/config/local-provider.ts:167]`
   `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/runtime/external-cli-projection.ts:42-45]`
   `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/runtime/project-message.ts:192-206]`

5. **The veto is a deterministic in-process token-coverage check, not a model-based quality judge.**
   `createRejectOnlyMeaningJudge()` returns a function that: rejects on abort; accepts unconditionally
   when the source has fewer than 6 distinct content tokens; otherwise computes the fraction of
   source tokens (lowercased words matching `/[a-z0-9_./-]{3,}/gu`) present anywhere in the
   candidate, and accepts at coverage ≥ 0.5, rejects below. It makes no provider call ("which never
   issues a request beyond the local process"), cannot rank variants, and can only add a rejection.
   Consequences: a candidate that drops up to half the source vocabulary passes; token order is
   free, so reordering and padding cost nothing; and short sources (under 6 tokens) skip the veto
   entirely. This is the only quality-shaped check on the accept path — it measures vocabulary
   retention, not voice, readability, hedging, or whether the rewrite is any better than the source.
   `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/fidelity/reject-only-judge.ts:7-47]`

6. **The command contract fixes "assistant message only", which identifies the instruction's
   "user message" noun as the outlier.** `/rewrite:response` Step 4 lists "Assistant-only scope:
   Rewrite only the text of the most recent assistant message. Never a user prompt, never an earlier
   turn", and the engine's profile field independently declares
   `copyEditingScope: 'assistant-message-only'`. The Iteration 1 scope finding therefore has a
   tiebreaker: every layer that states a scope says assistant, and only the compiled instruction
   string says "user". The instruction is wrong with respect to the documented contract (defect
   candidate, not a wording-standard question).
   `[SOURCE: .opencode/commands/rewrite/response.md:76]`
   `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/config/local-provider.ts:227]`

7. **INFERENCE — the carrier asymmetry is structural, and it localizes the clarity source's
   smoothing critique.** Because agent-context rewrites (native) have the standard and
   engine-involved rewrites are exactly the provider branches that lack it, every engine rewrite is
   an unguided re-render: the provider can only smooth toward its own priors and is then checked
   only for preservation and half-vocabulary retention. The clarity source's claim that smoothing
   "polishes away what is worth keeping" therefore applies precisely to the engine lanes, not to
   the native lane, where the standard is in context. Stated as inference because it joins two
   cited facts rather than adding one.
   `[INFERENCE: based on Findings 1, 2 and 5]`

## Questions Answered

None closed this iteration. Key question 1 remains answered from Iteration 1; key question 5 is
substantially advanced by Findings 1-3, and key question 3's precondition is established by
Findings 4-5 (a veto exists, and it is deterministic rather than model-based).

## Questions Remaining

- [ ] What instruction does the engine actually send a rewriting provider, and does it match the
      skill's documented wording standard? (answered in Iteration 1; carried as context only)
- [ ] Should the engine gain a transform layer of detectors with deterministic repairs, and if so
      what is each transform in precise terms? (deferred; now unblocked on the carrier side)
- [ ] What quality post-condition could the fidelity validator check that it does not check today,
      and is that post-condition mechanically checkable? (precondition established; not designed)
- [ ] Is a re-render in plainer words still the right lane, given the clarity source's claim about
      smoothing? (deferred; now has the lane split from Finding 2 and the inference in Finding 7)
- [ ] Where may any new wording knowledge live without giving the standard a second home? (advanced:
      by-reference loading and labels are permitted; restating content is explicitly forbidden in
      command files and would be a second home in the engine constant — the transform-layer
      question remains open)

## Ruled Out

- **Expecting an LLM-based quality judge behind `judgeMode: 'required'`.** Attempted by reading the
  default judge implementation; ruled out — `createRejectOnlyMeaningJudge` is a pure token-coverage
  function with no provider call, so "required judge" does not mean "model quality gate".
  `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/fidelity/reject-only-judge.ts]`
- **Re-reading `validator.ts` to locate the judge call.** Avoided by reading the caller
  (`project-message.ts:192-206`); the call site and the failure path are fully evidenced from the
  caller, preserving read budget.
- **Reading the vendored `claude-style-patch` and `i-have-adhd` sources this iteration.** Deferred
  deliberately: they are the natural evidence for the transform vocabulary (key question 2), which
  was out of this iteration's assigned scope.

## Dead Ends

- None. The assigned focus produced evidence on every sub-question; nothing was exhausted.

## Edge Cases

- **Ambiguous input (resolved, documented):** the reducer-owned strategy lists "Reading
  `.opencode/commands/rewrite/response*.md` in this iteration" under **Exhausted Approaches
  (BLOCKED)**, while the dispatch assigns exactly that read as this iteration's focus. The BLOCKED
  entry conflicts with its own source: the Iteration 1 delta records the direction as "Deferred
  rather than failed… scheduled as the next iteration's first read", and the iteration-001 narrative
  says the same and lists this read under its Recommended Next Focus. The block text is a reducer
  promotion artifact of a deferral, not a failed attempt. Chosen interpretation: dispatch context
  governs (the agent's focus order places explicit dispatch context above strategy prose), while the
  deferral is genuine and sanctioned by the iterations' own records. Deferred alternative: treating
  the BLOCKED entry literally would have left iteration 2 with no viable focus and forced a `stuck`
  report. The conflict is reported so the reducer can correct the promotion.
- **Contradictory evidence (live, preserved):** `SKILL.md:174,183` state that the Human Voice Rules
  bind every rewrite path and that no private rubric is carried locally, while
  `response-by-external-agent.md:249` states that Branches B and C are "held to fidelity validation
  and the exact-original fallback, **not to the Human Voice Rules**". Both sides are cited
  (Findings 1-3). Not resolved: the SKILL.md claim is the skill's contract, the command note is the
  operational description of the engine lanes, and nothing read this iteration reconciles the two.
  Recorded as a graph CONTRADICTS edge for the reducer.
- **Missing dependency (documented):** `research/research.md` was not updated although
  `progressiveSynthesis` is `true`, because the dispatch's allowed-write list omits it (same
  condition as Iteration 1's observation). Progressive synthesis remains with the workflow-owned
  path. No other dependency was missing; all state files were readable.
- **Partial success:** none. All planned reads completed on the first attempt; no Tier 1-2 recovery
  was triggered.

## Sources Consulted

- `specs/sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade/research/deep-research-config.json`
- `specs/sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade/research/deep-research-state.jsonl`
- `specs/sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade/research/deep-research-strategy.md`
- `specs/sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade/research/findings-registry.json`
- `.opencode/commands/rewrite/response.md:9-20,69-78,144-150`
- `.opencode/commands/rewrite/response-by-external-agent.md:7-31,47-54,132-171,242-250`
- `.opencode/skills/sk-communication/cli-communication-projection/src/config/local-provider.ts:63-65,126-174,221-243`
- `.opencode/skills/sk-communication/cli-communication-projection/src/runtime/external-cli-projection.ts:37-45,55-92`
- `.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/reject-only-judge.ts:7-47`
- `.opencode/skills/sk-communication/cli-communication-projection/src/runtime/project-message.ts:105-224`
- ripgrep `judgeMode`, `COPY_EDITING_INSTRUCTION` across `cli-communication-projection/src`
  (also surfaced `src/evaluation/fidelity-veto.ts:39`, which disables the judge for the evaluation
  harness — noted for a later iteration, not used this one)

## Assessment

- **New information ratio: 0.79** — four of seven findings are fully new (Findings 1, 2, 4, 5);
  three are partially new (Finding 3, the label-versus-carrier interpretation of a constant whose
  content Iteration 1 already recorded; Finding 6, the scope tiebreaker for an already-known
  contradiction; Finding 7, synthesis joining cited facts). `(4 + 0.5 × 3) / 7 = 0.786`, reported
  as 0.79. No simplicity bonus is claimed: this iteration adds structure, it does not reduce open
  questions.
- **Questions addressed**: key question 5 (carrier half) and key question 3 (precondition only).
- **Questions answered**: none closed.
- **Telemetry note**: `timestamp` and `durationMs` in the iteration record are notional session
  wall-clock, consistent with the run's session timeline, not second-precise measurements.

## Reflection

- **What worked and why**: reading the command files and the engine constant in the same pass. The
  single highest-value sentence in this iteration, line 249 of
  `response-by-external-agent.md`, states the carrier asymmetry in plain prose, and it is only
  findable by reading the command file end to end; no engine-source read surfaces it. The second
  win was following the judge from its declaration (`judgeMode`) to its construction
  (`project-message.ts:192`) to its implementation (`reject-only-judge.ts`): the name "judge"
  suggested a model call, and the implementation settled the question in one 47-line read.
- **What did not work and why**: two things. First, the assumption embedded in the question "does
  the local lane have a quality veto" — the answer is not yes/no but "it has a coverage veto";
  naming the implementation beat answering the yes/no. Second, the reducer's BLOCKED promotion of a
  deferral cost a documentation detour in Edge Cases; it is recorded there rather than silently
  ignored, but the cleanup belongs to the reducer.
- **What I would do differently**: for the post-condition question (key question 3), start from the
  validator's own deterministic-check pattern — pure functions of source and candidate text — rather
  than searching for a model-based veto. Finding 5 shows the codebase already treats a
  mechanically checkable text predicate as a sufficient gate; a new post-condition should be designed
  in that shape or it will not be checkable at the same seam.

## Recommended Next Focus

1. **Key question 3, now unblocked**: enumerate candidate post-conditions in the shape of the
   existing checks — pure, deterministic predicates over source and candidate — against the named
   failure modes the clarity source identifies (smoothing, hedging, puffery, tic preservation). Each
   candidate needs a concrete measurement and a fail direction; a post-condition that cannot be
   stated as a predicate over the two texts is not implementable at this seam. Also decide whether a
   new predicate belongs in the validator or beside the default judge, given that the judge is the
   only current veto and it is reject-only.
2. **Key question 5's remaining half**: does the one-home rule permit a *detector* — a checkable
   property informed by the standard — without becoming a restatement of it? The transform
   vocabulary question (key question 2) should follow immediately after, because a detector and a
   transform are the same predicate read in two directions (detect, then repair).
3. **Evidence needed for a candidate lane fix**: check whether a dispatched external CLI agent can
   resolve repository files (the `cli-external-orchestration` skills' preload contract) — this
   determines whether the provider lane can ever carry the standard by reference, or whether the
   documented fidelity-only contract of Branch B/C is the only one-home-preserving option.
