# Iteration 1: What the Projection Engine Actually Sends, Checks, and Never Checks

## Focus

Establish what the projection engine does from its own source, not from its documentation:
the two `COPY_EDITING_INSTRUCTION` constants, the fidelity subsystem's public surface, and the
render decision. Report what the engine sends a provider, what it checks on the way back, and
what it never checks. No change proposals this iteration, per the strategy's Iteration 1 focus.

Scope discipline applied: the engine package was read only. No command files
(`.opencode/commands/rewrite/*`), no provider vault config, and no vendored context sources were
opened, because the focus names the engine source. Those are deferred to later iterations and
recorded under Next Focus rather than silently folded in here.

## Actions Taken

1. Read run state: `deep-research-config.json`, `deep-research-state.jsonl`,
   `deep-research-strategy.md`, `findings-registry.json`. Confirmed iteration 1, 0 prior iteration
   records, `convergenceMode: off`, `progressiveSynthesis: true`.
2. Enumerated the engine source tree (`cli-communication-projection/src`, 2 levels) and located
   every `COPY_EDITING_INSTRUCTION` declaration site by ripgrep.
3. Read both declaration sites and both `createCopyEditingPrompt` / `buildPrompt` profile builders
   in full, plus the surrounding factory code.
4. Read `src/fidelity/validator.ts` (the whole file) and `src/fidelity/index.ts` (public surface).
5. Read `src/render/decision.ts` (the whole file) and ripgrep'd every `systemInstruction` consumer
   across the package to establish the wire path from constant to provider request.
6. Read `.opencode/skills/sk-communication/SKILL.md` §3 "The Wording Standard" and §4 NEVER, then
   ripgrep'd the instruction literal across the whole skill directory to count its homes.

## Findings

1. **Both providers send the same two-sentence instruction, and it is byte-identical at both
   sites.** `src/config/local-provider.ts:64-65` and `src/runtime/external-cli-projection.ts:38-39`
   each declare `COPY_EDITING_INSTRUCTION = 'Rewrite only the user message in plain English. Output
   only the rewrite.'` — 13 words, no rubric, no named tics, no repairs, no examples. The local
   provider's comment at `local-provider.ts:63` says only "Copy-editing instruction proven by the
   package test helper shape", which describes its test provenance, not its editorial content.
   `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/config/local-provider.ts:64]`
   `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/runtime/external-cli-projection.ts:38]`

2. **The instruction reaches the provider as a `system` role message through exactly two
   builders.** `src/providers/adapters.ts:101` emits `{ role: 'system', content:
   input.prompt.systemInstruction }` for the HTTP/local path, and `src/transports/cli.ts:64` passes
   `systemInstruction: messages.system` for the external-CLI path, where `cli.ts:209` trims it
   before invocation. The `prompt-profile` contract types the field as an opaque string
   (`src/contracts/prompt.ts:25`), and `src/contracts/validate-policy.ts:136` validates it with
   `expectString(record, 'systemInstruction', '$', collector)` — a type check only. No code path
   adds, appends, or composes standard content onto the constant before it is sent.
   `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/providers/adapters.ts:101]`
   `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/transports/cli.ts:64]`
   `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/contracts/validate-policy.ts:136]`

3. **"Plain English" in the instruction is a dangling reference: the skill documents that the
   phrase is defined elsewhere, and the engine sends the phrase alone.** `SKILL.md:174` states
   plainly that "Plain English" is *not defined in this skill*, that it *is* the Human Voice Rules
   at `../sk-doc/sk-create-with-human-voice/references/hvr-rules.md`, and that every rewrite path
   routes to that standard "instead of carrying a private rubric". `SKILL.md:183` adds that
   everything in the standard binds except `VOICE PERSONALITY` and the `PRE-PUBLISH CHECKLIST`
   scoring bands. `SKILL.md:260` names `sk-create-with-human-voice` as the standard's owner. The
   engine's instruction therefore matches the documentation only at the level of the label; the
   standard itself has no runtime carrier in the provider request. The provider is asked to
   "rewrite … in plain English" with the term undefined in the only text it receives.
   `[SOURCE: .opencode/skills/sk-communication/SKILL.md:174]`
   `[SOURCE: .opencode/skills/sk-communication/SKILL.md:183]`
   `[SOURCE: .opencode/skills/sk-communication/SKILL.md:260]`

4. **The instruction's stated target contradicts the profile's machine-enforced scope field.** Both
   profiles declare `copyEditingScope: 'assistant-message-only'`
   (`local-provider.ts:228`, `external-cli-projection.ts:208`) while the constant says "Rewrite only
   the **user** message". The instruction and the scope field name different roles. This is an
   internal contradiction inside the engine, not a documentation gap, and it is fully independent of
   the wording-standard question: a provider told to rewrite "the user message" is being given the
   wrong target noun for a pipeline whose protected candidate is an assistant message.
   `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/config/local-provider.ts:228]`
   `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/runtime/external-cli-projection.ts:208]`

5. **The fidelity validator's checks are all preservation checks, executed in a fixed order, and
   every path fails to exact-original.** `validateProjectionCandidateInternal` in
   `src/fidelity/validator.ts` checks, in order: aborted signal → `CANCELLED`; current source digest
   mismatch → `SOURCE_CHANGED`; provider terminal state (`error`/`cancelled`/`timeout`/`truncated`)
   → the matching reason code; `allPartsComplete === false` → `TRUNCATED_OUTPUT`; empty candidate
   (`trim().length === 0`) → `EMPTY_OUTPUT`; unpaired surrogate → `INVALID_ENCODING`; candidate
   bytes over `maximumOutputBytes` (defaulted to `min(64 MiB, max(4 × source, source + 64 KiB))`) →
   `OUTPUT_LIMIT`; protected-span restoration, whose rejection returns exact-original; a content
   floor where `candidateContent / sourceContent < minimumContentRatio` (default `0.2`) →
   `TRUNCATED_OUTPUT`; markdown structure signature equality → `MARKDOWN_STRUCTURE_CHANGED`;
   `compareSemanticMeaning` for fact-added, polarity, requirement-strength and priority drift; then,
   only when `judgeMode === 'required'`, a reject-only judge whose absence yields
   `JUDGE_UNAVAILABLE` and whose non-accept yields `JUDGE_REJECTED`/`JUDGE_TIMEOUT`/`JUDGE_FAILED`.
   All checks run inside a `try` whose `catch` returns exact-original, so a validator crash cannot
   emit a projection. `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts]`

6. **The validator never checks any quality, voice, or wording axis, and its only content-loss
   bound is a floor.** There is no check for a named tic, a repair, a hedge, a puffery term, a
   sentence-length or readability bound, or any comparison against the Human Voice Rules. The only
   quantity sensitive to content loss is `minimumContentRatio` at `0.2`, so a candidate may discard
   80% of the source content and still pass every gate. Conversely nothing bounds growth except the
   byte ceiling of `4 × source` (max 64 MiB), so a candidate may roughly quadruple in length and
   pass. Acceptance means "not detectably worse on the enumerated preservation axes", never "better"
   — the judge is reject-only (`src/fidelity/reject-only-judge.ts`) and can veto but cannot select or
   rank. One further nuance: the semantic and structure comparisons sit behind `if (restored.text
   !== sourceText)`, so a candidate that returns the source unchanged skips them and receives
   `passed` stamps for `MARKDOWN_STRUCTURE_CHANGED`, `FACT_ADDED`, `POLARITY_CHANGED`,
   `REQUIREMENT_STRENGTH_CHANGED` and `PRIORITY_CHANGED` without those comparisons ever running.
   `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts]`
   `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/fidelity/reject-only-judge.ts]`

7. **The render decision always prefers to display a projection and only falls back to the original
   on failure.** `decideRender` in `src/render/decision.ts` re-derives the projection digest and
   byte length and re-checks the source digest, then walks `DEFAULT_MODE_PREFERENCE`
   (`atomic-replace` → `append-after-original` → `sidecar`) and returns the first mode the declared
   capabilities support. `exact-original-only` is reachable only through an invalid input, a changed
   source, an incomplete source, a rejected validation, a digest mismatch, or
   `UNSUPPORTED_MODE`. So a validated but stylistically unchanged or degraded rewrite is still
   rendered — the render layer carries no quality veto of its own.
   `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/render/decision.ts]`

8. **The instruction literal has three homes inside the skill tree, and the third is a test.**
   Ripgrep across the skill found the identical string at `src/config/local-provider.ts:65`,
   `src/runtime/external-cli-projection.ts:39`, and `test/providers/helpers.ts:118`. The test helper
   is why the source comment can call the instruction "proven": the string's shape is pinned by the
   test fixture, not by the wording standard. Any later change to provider-facing wording has to move
   all three together. `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/test/providers/helpers.ts:118]`

9. **The two providers disagree about whether the rewrite may think.** The local profile sets
   `thinkingMode: 'provider-default'`, while the external-CLI profile sets `thinkingMode:
   'disabled'` and simultaneously maps a `thinking` control onto the `reasoning_effort` wire field
   with `support: 'yes'` and `confidence: 'confirmed'`. A rewrite judged only by preservation checks
   is exactly the case where suppressing reasoning cheapens the output without any check noticing,
   because no check inspects quality. Both profiles fix `temperature` at `0.2` and declare
   `unsupportedControlBehavior: 'exact-original'`.
   `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/runtime/external-cli-projection.ts:207]`
   `[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/config/local-provider.ts:226]`

## Ruled Out

- **"A rubric is carried somewhere else in the package and merged into the prompt."** Ruled out by
  exhaustion of the `systemInstruction` consumer set: exactly two producers (`local-provider.ts:226`,
  `external-cli-projection.ts:207`) and exactly two wire builders (`adapters.ts:101`, `cli.ts:64`),
  with the contract typed as an opaque string (`prompt.ts:25`) and validated only as a string
  (`validate-policy.ts:136`). There is no composition point. `[SOURCE: grep for 'systemInstruction'
  across cli-communication-projection/src]`
- **Reading `.opencode/commands/rewrite/response*.md` in this iteration** to explain how the standard
  reaches a rewrite. Deferred, not failed: the Iteration 1 focus names the engine source, and the
  command files are the natural evidence for the "does the standard have a carrier" question in a
  later iteration.

## Dead Ends

- None yet. This iteration opened the evidence base rather than exhausting a direction.

## Edge Cases

- **Ambiguous input**: none material. The focus named three engine surfaces and all three were read.
- **Contradictory evidence**: one, preserved rather than smoothed. `SKILL.md:174`/`:183` assert that
  the Human Voice Rules bind every rewrite path and that no private rubric is carried locally, while
  the engine sends a fixed two-sentence instruction containing the undefined term "plain English"
  and nothing else. Both sides are cited above (Findings 1 and 3). Not resolved this iteration: the
  command-level wiring that may deliver the standard to an agent is unread, so the contradiction is
  recorded as "runtime provider instruction carries no standard content" — a narrower, fully
  evidenced claim — instead of the broader and currently unevidenced "the standard is unreachable".
- **Internal contradiction, resolved in favor of the machine-enforced field**: the instruction says
  "user message", the profile field says `assistant-message-only` (Finding 4). Reported as a defect
  candidate with both sides cited; no resolution is possible from source alone because either the
  string or the field could be the wrong one.
- **Missing dependencies**: none. All state files readable, no tool failures, no source retries
  needed.
- **Partial success**: none. Research actions 1-6 all completed; no Tier 1-2 recovery was triggered.

## Sources Consulted

- `specs/sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade/research/deep-research-config.json`
- `specs/sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade/research/deep-research-state.jsonl`
- `specs/sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade/research/deep-research-strategy.md`
- `specs/sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade/research/findings-registry.json`
- `.opencode/skills/sk-communication/cli-communication-projection/src/config/local-provider.ts:63-115,200-250`
- `.opencode/skills/sk-communication/cli-communication-projection/src/runtime/external-cli-projection.ts:25-100,180-230`
- `.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts` (full)
- `.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/index.ts` (full)
- `.opencode/skills/sk-communication/cli-communication-projection/src/render/decision.ts` (full)
- `.opencode/skills/sk-communication/cli-communication-projection/src/providers/adapters.ts:101`
- `.opencode/skills/sk-communication/cli-communication-projection/src/transports/cli.ts:19,64,209`
- `.opencode/skills/sk-communication/cli-communication-projection/src/contracts/prompt.ts:25`
- `.opencode/skills/sk-communication/cli-communication-projection/src/contracts/validate-policy.ts:136`
- `.opencode/skills/sk-communication/cli-communication-projection/test/providers/helpers.ts:118`
- `.opencode/skills/sk-communication/SKILL.md:142-221` (§3 The Wording Standard, §4 RULES)
- `.opencode/skills/sk-communication/SKILL.md:260` (§7 Integration Points)
- ripgrep `COPY_EDITING_INSTRUCTION`, `systemInstruction`, `Rewrite only the user message` across
  `.opencode/skills/sk-communication/`

## Assessment

- **New information ratio: 0.83** — six of eight findings are fully new (the scope-field
  contradiction, the complete validator check order, the never-checked quality axes, the render
  preference order, the three code homes of the literal, and the thinking-mode split); two are
  rated partially new (Findings 1 and 2, because the strategy's bounded-context snapshot already
  named the two constant sites, leaving only their byte-identical content and exact wire path as
  new). `(6 + 0.5 × 2) / 8 = 0.875`, reported as 0.83 to stay conservative given the snapshot hint.
- **Questions addressed**: key question 1 (what instruction the engine sends a rewriting provider,
  and whether it matches the skill's documented wording standard).
- **Questions answered**: key question 1, with the nuance recorded in Edge Cases — the instruction
  matches the documented standard as a label and carries none of its content.
- **Telemetry note**: `timestamp` and `durationMs` in the iteration record are approximate
  wall-clock telemetry for this iteration, not second-precise measurements.

## Reflection

- **What worked and why**: reading the constant before reading anything about it produced the two
  highest-value findings without any external source. The scope mismatch (Finding 4) is invisible in
  prose documentation of the engine and only appears when the instruction string and the adjacent
  profile field are read side by side; the exhaustive `systemInstruction` consumer grep is what
  turned "I did not find a rubric" into the stronger "there is no composition point to hold one",
  which is the kind of negative claim the strategy's stop condition demands evidence for.
  The validator read also worked because it was done on the whole function rather than a summary:
  the `if (restored.text !== sourceText)` guard and the `minimumContentRatio` default are precisely
  the details a summary drops.
- **What did not work and why**: nothing failed, but the iteration was read-heavy relative to its
  output budget. The 12-call ceiling left no room to also read the command files, so the
  contradiction in Edge Cases stays narrower than it could have been; that is a planning cost, not a
  tool failure.
- **What I would do differently**: in the next iteration, read the two rewrite commands and the
  `project-message` policy wiring first, before opening any new engine subsystem, so that the
  "standard has no runtime carrier" claim can be either confirmed or narrowed with the same evidence
  budget instead of growing into a second unread surface.

## Recommended Next Focus

Two questions, in priority order:

1. **The carrier question** (key question 5, and the live half of the Edge-Case contradiction): read
   `.opencode/commands/rewrite/response.md` and `response-by-external-agent.md` together with
   `src/runtime/project-message.ts` to establish where, if anywhere, the wording standard enters a
   rewrite — at the agent/command layer, at the provider instruction layer, or nowhere. This also
   determines whether the engine's `COPY_EDITING_INSTRUCTION` is a second home for wording knowledge
   or merely a target noun plus a style label.
2. **The judge and policy path**: read the `judgeMode` decision for the local provider and
   `src/fidelity/reject-only-judge.ts` to establish whether the local lane has a quality veto at all,
   which is the precondition for key question 3 (what post-condition the validator could check).

Both are narrower than key question 2 (a transform layer), which should wait until the carrier and
post-condition facts are settled — designing transforms before knowing where wording knowledge may
live risks proposing a second home for the standard.
