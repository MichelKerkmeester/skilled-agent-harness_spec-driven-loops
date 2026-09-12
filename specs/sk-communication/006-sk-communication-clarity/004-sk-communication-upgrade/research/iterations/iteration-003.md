# Iteration 3: Instruction referent correction, and what a transform layer can and cannot decide

## Focus

Two questions in the order the dispatch names them.

1. **Correction to carry forward.** Iteration 1, finding 4 read the instruction phrase "the user message" as *contradicting* `copyEditingScope: 'assistant-message-only'`. Re-read `src/providers/adapters.ts` and `src/context/selector.ts` around the cited lines and classify the phrase as contradiction or ambiguity, then name what a provider could plausibly rewrite by mistake.
2. **New question.** Should the engine gain a transform layer of detectors with deterministic repairs? For each of three STYLE.md rules (colon rule, verbless fragments, stacked compression), say whether a deterministic detector plus repair is expressible against a text stream or needs judgment, and place each rule on one side.

Skill root for all relative paths below: `.opencode/skills/sk-communication/cli-communication-projection/`.
Source context root: `specs/sk-communication/006-sk-communication-clarity/context/`.

## Actions Taken

- Re-read `src/providers/adapters.ts:99-104` and `src/context/selector.ts:35-80` at the cited lines.
- Traced the instruction string to both of its definitions and to the prompt contract record that carries it.
- Read `src/fidelity/validator.ts` (all 482 lines) and `src/fidelity/reject-only-judge.ts` (47 lines) to establish what the engine checks on the return path.
- Read `context/claude-style-patch-main/STYLE.md` (94 lines) and classified the colon rule, fragment rule, and stacked-compression rule against mechanical decidability.
- Inspected `src/providers/controls.ts`, `src/contracts/prompt.ts`, `src/contracts/validate-policy.ts:375-390`, `src/runtime/local-projection.ts`, `src/runtime/external-cli-projection.ts` for how the target and the bounded context reach the provider.

## Findings

1. **The phrase is an ambiguity, not a contradiction. Iteration 1 finding 4 is corrected.** Both statements are true of different referents at the same time. The wire request sends the text to rewrite in the `user` role: `src/providers/adapters.ts:101-102` builds `[{role:'system', content: systemInstruction}, {role:'user', content: document.encodedText}]`. Separately, the bounded context selector takes the last non-meta **user** message from the transcript: `src/context/selector.ts:56` ("Select the last non-meta user message…"), implemented at `src/context/selector.ts:70-74`, and the policy contract requires `role: ['user']` with `isMeta === false` for it (`src/contracts/validate-policy.ts:382-387`). Meanwhile the text actually being rewritten was wrapped as a **completed assistant message** upstream (`src/runtime/local-projection.ts:60` "Wrap the target text as one completed assistant message", `:91` `kind: 'assistant-message'`). So "the user message" is wire-role-true and transcript-role-false, and the instruction never says which sense it means. `copyEditingScope: 'assistant-message-only'` (`src/contracts/prompt.ts:26`) sits in the *same* record as `systemInstruction` (`src/contracts/prompt.ts:25`), so the two referents coexist inside one request. [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/providers/adapters.ts:99-104] [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/context/selector.ts:56,70-74] [SOURCE: .opencode/sk-communication/cli-communication-projection/src/contracts/prompt.ts:22-32] [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/runtime/local-projection.ts:60,91] [INFERENCE: contradiction requires both claims to name the same referent; here two distinct referents share one phrase]

2. **The instruction text is defined twice, verbatim.** `COPY_EDITING_INSTRUCTION = 'Rewrite only the user message in plain English. Output only the rewrite.'` appears at `src/config/local-provider.ts:64-65` and again at `src/runtime/external-cli-projection.ts:38-39`, with `COPY_EDITING_TEMPERATURE = 0.2` duplicated alongside it (`src/config/local-provider.ts:72`, `src/runtime/external-cli-projection.ts:40`). Two identical definitions in one package are already the shape the one-home question warns about, before any new wording knowledge is added. [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/config/local-provider.ts:63-72] [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/runtime/external-cli-projection.ts:37-40]

3. **What a provider can plausibly rewrite by mistake, stated concretely.** Three mechanisms, all consequences of finding 1. (a) It can rewrite the *context* user message instead of the target, because the only thing distinguishing the target block is that it occupies the user wire role while the true user turn is described as "user message" in the selector and policy layers. (b) It can mis-attribute authorship of the target: the target text reaches the wire under `role: 'user'` with no authorship marker in the body (`src/providers/adapters.ts:102`), so a provider may convert third-person or passive phrasing into first person, which no fidelity check tests for. (c) It can drop content it believes is not "the message", because "only the user message" is a scoping instruction and the model cannot verify which block is in scope. What I could **not** trace in this iteration: whether the bounded context's *text* is ever placed into the wire body — the selection is built (`src/runtime/external-cli-projection.ts:76`, `:184`) and the output type carries `selectedText` (`src/context/selector.ts:53,127`), but the prompt profile record (`src/contracts/prompt.ts:22-32`) has no context-text field and the assembly path I read (`src/providers/controls.ts:30-69`) only sets temperature and thinking controls. If the context text is genuinely absent from the request, mechanism (a) degrades to a labelling risk rather than a live rewrite-target risk. This is the narrowest next evidence needed to close it: grep the target-document assembly for the selected message text, or read the assembler stage that produces `document.encodedText`. [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/providers/controls.ts:30-69] [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/runtime/external-cli-projection.ts:76,184] [INFERENCE: mechanisms follow from the referent overload plus the absence of an authorship marker]

4. **A transform layer is partly expressible, and the split is not the one the rule names suggest.** Against a text stream, with a sentence segmenter and a finite-verb heuristic:

   | Rule (STYLE.md) | Detect | Repair | Verdict |
   |---|---|---|---|
   | Colon before a clause (lines 25-29) | Mechanical: a sentence containing `:` where the right side is not a literal list of ≥3 items | Not mechanical in the rule's own terms: it prescribes rewriting as two sentences *or* a clause joined by because/so/but/and, and the connector choice is semantic | **Detect mechanical; repair judgment** |
   | Verbless fragments as sentences or paragraph openers (line 35) | Mechanical modulo a finite-verb heuristic, including the explicit exception that fragments are fine inside parentheses or after a dash in a sentence | Judgment: the prescribed fix merges the fragment into the sentence it was introducing, which requires choosing the merge target and forming the merged sentence | **Detect heuristic; repair judgment** |
   | Stacked compression (lines 41-43) | Not mechanical. Its three moves are metaphor, verb-into-noun-phrase, and adjacency of two compressed units; adjacency is checkable only if metaphor and nominalization detection are reliable, and nominalization is a suffix/determiner heuristic with false positives ("the connection" is not always a nominalized verb) | Judgment: "never leave a reader inside a metaphor" requires knowing whether a figure is live | **Fully judgment** |
   | Banned lexemes (line 69: "honestly", "load-bearing", "crux") | Mechanical: fixed token list | Mechanical only as deletion/flagging; substitution needs the intended meaning | **Detect mechanical; repair = flag** |
   | "Not X, but Y" antithesis (line 39) | Mechanical as a pattern match | Judgment: contrast only genuinely competing explanations | **Detect mechanical; repair judgment** |

   [SOURCE: specs/sk-communication/006-sk-communication-clarity/context/claude-style-patch-main/STYLE.md:25-29] [SOURCE: specs/sk-communication/006-sk-communication-clarity/context/claude-style-patch-main/STYLE.md:35] [SOURCE: specs/sk-communication/006-sk-communication-clarity/context/claude-style-patch-main/STYLE.md:41-43] [SOURCE: specs/sk-communication/006-sk-communication-clarity/context/claude-style-patch-main/STYLE.md:39,69]

5. **The mechanically decidable set is exactly three detectors, and one of them is only a heuristic.** Cheap, deterministic, and safe to run on any text: colon-before-clause (excluding ≥3-item lists, `STYLE.md:27`), banned-lexeme presence (`STYLE.md:69`), and pattern-shaped "not X but Y" (`STYLE.md:39`). Verbless-fragment detection is deterministic in structure but depends on a finite-verb heuristic and on reading parenthetical and dash context, so it ships with a false-positive budget. Everything else in the three named rules lands on the judgment side. [INFERENCE: derived from the per-rule classification in finding 4]

6. **The return path cannot host style enforcement, by construction.** The validator's checks are structural and meaning-preserving, not stylistic: empty output (`src/fidelity/validator.ts:127-129`), unpaired surrogate (`:130-132`), output byte cap (`:134-148`), protected-span restoration (`:150-172`), unexpected refusal (`:183-186`), content ratio against a 0.2 default (`:187-198`), markdown structure signature equality (`:200-210`), semantic comparison for FACT_ADDED / POLARITY_CHANGED / REQUIREMENT_STRENGTH_CHANGED / PRIORITY_CHANGED (`:212-221`, passed markers at `:223-227`), and the optional reject-only judge (`:229-244`). The judge itself can only reject: it accepts when the source has fewer than 6 content tokens or when candidate token coverage reaches 0.5, and returns no style signal at all (`src/fidelity/reject-only-judge.ts:7-8,21-27`). Crucially, every failed check falls back to the **exact original** (`src/fidelity/validator.ts:372-412`), so putting a style rule on this path converts "the rewrite has one colon-hinged sentence" into "discard the rewrite entirely". Style knowledge therefore cannot be a fidelity post-condition without changing fidelity's fail-closed semantics. [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts:127-148,183-244,372-412] [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/fidelity/reject-only-judge.ts:7-8,21-27] [INFERENCE: a style check on a fail-closed acceptance gate trades a style defect for a total loss of the rewrite]

7. **The engine's checks are meaning-preservation checks, and they are orthogonal to the style rules, so the transform layer is additive rather than redundant with fidelity.** `compareSemanticMeaning` covers fact, polarity, requirement strength, and priority preservation (`src/fidelity/semantics.ts:62-95`); nothing in that set detects a colon-hinged sentence, an announcing opener, or a nominalization. A style transform layer would be new capability, not a replacement for an existing check. [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/fidelity/semantics.ts:62-95]

## Ruled Out

- Reading the phrase "the user message" as a plain contradiction of `copyEditingScope`: rejected on the evidence in finding 1 — the two phrases are true of two different referents in the same request, so no contradiction exists to resolve.
- Treating the fidelity validator as the natural home for style post-conditions: rejected in finding 6, because every validator failure discards the rewrite back to the exact original.

## Dead Ends

- Searching for a context-text field in the prompt assembly path (`src/contracts/prompt.ts`, `src/providers/controls.ts`): no such field exists, so the question of whether the context text is transmitted cannot be answered from that surface. The remaining trace must go through the assembler that produces `document.encodedText`. Not a saturated direction — one specific check remains.
- Attempting to adjudicate "stacked compression" mechanically: the rule's own definition (`STYLE.md:41-43`) makes the third move depend on the first two, so a deterministic version is not expressible without solving metaphor and nominalization detection, which are judgment tasks.

## Edge Cases

- Ambiguous input: none. The dispatch named its two questions and its sources directly.
- Contradictory evidence: one instance, resolved in favor of the dispatch's correction — iteration 1 finding 4 versus `src/providers/adapters.ts:101-102` and `src/context/selector.ts:56`. The dispatch's correction is supported; the nuance added here is that the ambiguity is risk-bearing rather than harmless (finding 3).
- Missing dependencies: none. Every named file was present and readable (`src/providers/adapters.ts` 163 lines, `src/context/selector.ts` 354, `src/fidelity/validator.ts` 482, `src/fidelity/reject-only-judge.ts` 47, `STYLE.md` 94).
- Partial success: one sub-question left open by choice of budget rather than by tool failure — whether the bounded context text enters the wire body (finding 3). Recorded as the recommended next focus rather than overclaimed.

## Sources Consulted

- `.opencode/skills/sk-communication/cli-communication-projection/src/providers/adapters.ts:99-104,106-124`
- `.opencode/skills/sk-communication/cli-communication-projection/src/context/selector.ts:35-80,127`
- `.opencode/skills/sk-communication/cli-communication-projection/src/config/local-provider.ts:55-80`
- `.opencode/skills/sk-communication/cli-communication-projection/src/runtime/external-cli-projection.ts:28-58,76,184,198`
- `.opencode/skills/sk-communication/cli-communication-projection/src/runtime/local-projection.ts:16,60,91,96`
- `.opencode/skills/sk-communication/cli-communication-projection/src/contracts/prompt.ts:11-40`
- `.opencode/skills/sk-communication/cli-communication-projection/src/contracts/validate-policy.ts:375-390`
- `.opencode/skills/sk-communication/cli-communication-projection/src/providers/controls.ts:1-168`
- `.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts:1-482`
- `.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/reject-only-judge.ts:1-47`
- `.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/semantics.ts:62-95`
- `specs/sk-communication/006-sk-communication-clarity/context/claude-style-patch-main/STYLE.md:25-29,35,39,41-43,69`

## Questions Answered

- **Should the engine gain a transform layer of detectors with deterministic repairs, and if so what is each transform in precise terms?** — Answered. Three detectors are mechanically decidable against a text stream (colon before a clause excluding ≥3-item lists, banned lexemes, not-X-but-Y pattern); verbless-fragment detection is a heuristic that must carry the parenthetical and dash exception; stacked compression is fully judgment. Every repair except deletion is judgment-dependent (findings 4 and 5).
- **What instruction does the engine actually send a rewriting provider, and does it match what the skill's own documentation says its wording standard is?** — Answered on the instruction side: the literal string, both definitions, and the wire roles it lands in (findings 1-3). The comparison against the skill's own wording documentation remains open.

## Questions Remaining

1. Does the bounded context text enter the provider request body? Needed to decide whether the referent ambiguity is a live rewrite-target risk or a labelling risk (finding 3).
2. Where may wording knowledge live without giving the standard a second home? Made sharper by finding 2: the instruction text already has two homes inside the package.
3. What mechanically checkable post-condition remains available to the validator, given that style rules cannot sit on the fail-closed acceptance path (finding 6)? The three mechanical detectors are candidates for a report-only channel, but where that channel lives is unanswered.
4. Is a re-render in plainer words still the right lane, given the clarity source's claim that smoothing is not rewriting? Untouched this iteration.

## Assessment

- New information ratio: 0.75
- Questions addressed: the instruction-referent correction (Q1's phrasing component); the transform-layer question in full; the validator post-condition question on its "what can it not check" side
- Questions answered: the transform-layer question (each candidate transform now classified as mechanical detect, heuristic detect, or judgment, with the validator ruled out as the host); the instruction question (literal string, both definitions, and the referent ambiguity resolved)

## Reflection

- What worked and why: reading the two source files at their cited lines settled the correction in one step, because the dispatch's correction was already the right reading and only needed the second referent located — which `src/context/selector.ts:70-74` and the policy contract at `:382-387` supplied. Classifying the style rules side by side in one table worked because it forced the detect/repair distinction into the open, and that distinction is what separates the mechanical three from the judgment rest.
- What did not work and why: I tried to close the context-transmission question inside the prompt-assembly path and hit a dead end, because that path carries only inference controls (`src/providers/controls.ts:44-68`) and the context selection lives in the runtime layer instead. Reading the wrong layer cost one tool call; the right layer is the assembler that produces `document.encodedText`.
- What I would do differently: start from the data flow — target document in, provider request out — rather than from the contract type that looked relevant, and treat fail-closed fallback semantics as a design constraint to check *before* proposing where a new check should live, since that constraint eliminated the validator as host in finding 6 and would have saved a detour.

## Recommended Next Focus

Trace whether the bounded context text enters the provider request body at all, by reading the assembler that produces `document.encodedText` (the code path behind `src/runtime/local-projection.ts:60` and the `context` input at `src/runtime/external-cli-projection.ts:76`). If the context text is transmitted, the ambiguity in finding 1 becomes a live rewrite-target risk and the repair is wording-level (name the target block and its authorship in the instruction). If it is not transmitted, the risk reduces to role labelling. After that, the remaining open question is the one-home rule for wording knowledge: the engine currently holds two verbatim copies of the instruction (finding 2), so the next iteration should establish what the skill's own documentation permits as the single home before proposing where a transform-layer rule set would live.
