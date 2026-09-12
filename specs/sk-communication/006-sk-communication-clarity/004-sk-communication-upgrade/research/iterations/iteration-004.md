# Iteration 4: Is a plainer re-render still the right lane?

## Focus

Answer the last open key question: given the clarity source's rule 17, is a re-render in plainer
words still the right lane for this engine? The dispatch named three sub-tasks, in order:
(1) establish from `src/render/` what a render decision may do to a message — replace, append,
sidecar, original-only — and whether any of those permits reordering or whether the lane is
structurally limited to substitution; (2) decide from `src/fidelity/protected-spans.ts` whether a
reorder could preserve protected spans at all; (3) give a verdict — keep the smoothing lane, extend
it to cut-and-reorder, or split the two as separate declared operations — naming the trade-off and
what breaks in each case.

Interpretation note: "the lane" resolves to the accepted-projection pipeline (provider instruction
→ fidelity validator → render decision), not to `src/render/` alone, because the dispatch asks what
the lane is limited to *and* whether reorder is admissible under the fidelity contract. The narrower
reading (render only) is answered first and separately, so both referents are covered.

## Actions Taken

1. Read state: strategy (Section 9 exhausted approaches, Section 11 next focus), config
   (`convergenceMode: off`, `progressiveSynthesis: true`, `maxIterations: 5`), confirmed 3 iteration
   records exist and `iterations/iteration-004.md` + `deltas/iter-004.jsonl` do not.
2. Enumerated the `src/render/` public surface (`index.ts` re-exports `decision`, `evidence`,
   `types`; `README.md` present) and read the two content-bearing modules.
3. Read the protected-span restoration contract's order handling and rejection construction.
4. Located the engine's own operation vocabulary (`COPY_EDITING_INSTRUCTION`) at its two sites.
5. Read the fidelity validator's acceptance path around the structure and semantic checks.
6. Narrow reread (reason: settle whether the markdown structure signature is order-sensitive, which
   decides finding 4) — `createMarkdownStructureSignature` construction only; the composed
   signature's tail was not read, and that gap is carried as a stated inference.

## Findings

1. **The render lane has exactly four modes and every one of them is a presentation choice; the lane
   contains no text-composition step.** The modes are `append-after-original`, `atomic-replace`,
   `exact-original-only`, `sidecar`
   [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/render/types.ts:9-14].
   `RenderDecisionInput` carries `validation`, `currentSourceSha256`, `sourceTerminal`,
   `allPartsComplete`, `capabilities`, `preferredModes` — and **no message text field**
   [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/render/types.ts:49-56].
   A decision is either `{status:'projection', mode: append-after-original|atomic-replace|sidecar,
   projectionText}` or `{status:'exact-original', projectionText: null}`
   [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/render/types.ts:67-82].
   **Does any mode permit reordering?** No — none of the four touches the text. The lane is not merely
   limited to substitution; it is limited to *selection between two already-fixed byte strings* (the
   validated projection or the exact original) plus *placement* (replace, append-after, sidecar).
   Reordering is *unrepresentable* in this module rather than forbidden by it: there is no text
   parameter to reorder with
   [INFERENCE: based on src/render/types.ts:9-14, :49-56, :67-82 and the absence of any text
   parameter in `decideRender`'s input contract].

2. **A reorder could not hide in the render layer, but not because order is checked — because the
   shown text is re-verified against the validated text.** The accepted path encodes
   `validation.projectionText`, requires its byte length to equal `validation.projectionByteLength`,
   its SHA-256 to equal `validation.projectionSha256`, and `exactOriginal.sha256` to equal
   `validation.sourceSha256`; any mismatch returns `INVALID_INPUT` toward the exact original
   [SOURCE: src/render/decision.ts:63-70, :50-52, :177-190]. This is a *self-consistency* check — the
   text displayed is the text the validator accepted — not an order-preservation check
   [INFERENCE: based on src/render/decision.ts:63-70]. The render layer also records only *that* it
   accepted, never *what kind* of change it accepted: `reasonCode: 'projection-accepted'` is a
   single constant for every accepted projection
   [SOURCE: src/render/types.ts:67-73; src/render/decision.ts:81-90].

3. **The only order-specific guarantee in the whole contract is the protected-span token sequence,
   it is position-by-position, and its failure is fail-closed with its own named reason code.** The
   restoration contract states it outright: "Restore exact span bytes only when set, count, order,
   and identity all match"
   [SOURCE: src/fidelity/protected-spans.ts:117]. It builds `expected = document.spans.map(span =>
   span.token)` and `actual` from every token occurrence in the candidate
   [SOURCE: src/fidelity/protected-spans.ts:133-134], rejects duplicates, changed hash segments,
   unexpected tokens and missing tokens ahead of the order test
   [SOURCE: src/fidelity/protected-spans.ts:136-173], and then compares position by position,
   returning `PLACEHOLDER_REORDERED` on the first divergence
   [SOURCE: src/fidelity/protected-spans.ts:174-181]. The token itself embeds the original ordinal —
   `⟦pcp:v1:${namespace}:${index}:${sha12}⟧`
   [SOURCE: src/fidelity/protected-spans.ts:414-415] — so position is part of token identity, not
   merely its order in the array. A rejection is `status: 'rejected'`
   [SOURCE: src/fidelity/protected-spans.ts:424-429], which the validator converts into the
   exact-original outcome carrying the same reason code
   [SOURCE: src/fidelity/validator.ts:151-166]; the render decision then selects
   `exact-original-only` because `validation.status !== 'accepted'`
   [SOURCE: src/render/decision.ts:59-61].

4. **A prose reorder that never moves a spanned segment passes the entire current contract,
   indistinguishably from a copy edit — the engine cannot tell the two operations apart.** After
   protected-span restoration, the remaining structural test is signature equality between
   `createMarkdownStructureSignature(sourceText)` and
   `createMarkdownStructureSignature(restored.text)`, falling back to `MARKDOWN_STRUCTURE_CHANGED`
   on mismatch [SOURCE: src/fidelity/validator.ts:200-210]. The signature is built as per-line
   tokens accumulated in line order — `atx:<level>` and `setext:<level>` headings, `<indent>:<marker>`
   lists, quote depths, fences, tables [SOURCE: src/fidelity/dialect.ts:57-84]. No token carries a
   positional index of its own except list indentation, so a paragraph moved within a section leaves
   the token set unchanged and, in a region with no headings, leaves nothing to compare at all
   [SOURCE: src/fidelity/dialect.ts:57-84; src/fidelity/validator.ts:200-210]. Whether a
   *heading-bearing* move is caught depends on whether the composed signature preserves the arrays'
   order or sorts them — the tail of `createMarkdownStructureSignature` past line 84 was not read
   within budget, and this is carried as an unresolved premise, not a settled fact
   [INFERENCE: line-order accumulation at dialect.ts:57-84 makes an order-preserving join the likely
   composition, but that is unverified; see Questions Remaining]. Either way the conclusion for
   plain prose holds, and the engine today has no observation that separates a copy edit from a prose
   reorder [INFERENCE: absent any prose-order test across src/fidelity/validator.ts:200-227 and
   src/fidelity/protected-spans.ts:174-181].

5. **No order or wording observation survives into either decision record, so even a *detected*
   prose reorder would not be reported as one.** The five style-shape rule ids
   (`MARKDOWN_STRUCTURE_CHANGED`, `FACT_ADDED`, `POLARITY_CHANGED`, `REQUIREMENT_STRENGTH_CHANGED`,
   `PRIORITY_CHANGED`) are pushed as `passed` only *after* the failure points above them have already
   returned [SOURCE: src/fidelity/validator.ts:200-221 versus :223-227], and an accepted projection
   reports the single constant `projection-accepted`
   [SOURCE: src/render/types.ts:70; src/render/decision.ts:84]. This is consistent with the earlier
   finding that the validator's checks are meaning-preservation checks orthogonal to style; the new
   part is that there is no *order* axis either, which makes an accepted projection order-opaque
   [INFERENCE: based on src/fidelity/validator.ts:223-227 and src/render/types.ts:70].

6. **Verdict: split the two as separate declared operations.** Keep the copy-editing lane as it is, do
   not relax the token-order check, and declare cut-and-reorder as a second operation only if it is
   wanted. Three cited reasons:
   (a) The engine's own vocabulary already separates them. Its operation is named *copy editing* at
   both instruction sites — `const COPY_EDITING_INSTRUCTION`
   [SOURCE: src/runtime/external-cli-projection.ts:38; src/config/local-provider.ts:64] — while the
   clarity source reserves "rewriting" for cut-and-reorder and explicitly denies that smoothing
   counts: "Smoothing is not rewriting. Smoothing turns a rough authentic sentence into a bland one
   and polishes away the only interesting thing in your draft"
   [SOURCE: specs/sk-communication/006-sk-communication-clarity/context/clarity.md:179-182]. One lane
   label cannot be true of both operations
   [INFERENCE: based on the two cited sources].
   (b) The two operations carry incompatible guarantees. Copy editing preserves order and is
   checkable by the existing preservation machinery; cut-and-reorder is order-changing, and the only
   order guarantee in the contract rejects a spanned move *outright*
   [SOURCE: src/fidelity/protected-spans.ts:174-181; src/fidelity/validator.ts:151-166]. Sharing one
   `status: 'accepted'` would make one status carry two different byte-identity contracts
   [INFERENCE].
   (c) Finding 4 makes the current single lane actively conceal the gap: because nothing records
   whether prose order changed, an extension of the lane today would be unobservable in any artifact
   [SOURCE: src/fidelity/validator.ts:200-227; src/render/types.ts:70].

   **Main trade-off, and what breaks in each case.**
   - *Keep the smoothing lane as-is.* Nothing mechanical breaks. What breaks is truth in naming: the
     engine returns order-preserving copy editing under a vocabulary whose rule-17 meaning is
     order-changing rewriting, and the bland-ification risk the source names at clarity.md:182 stays
     entirely unchecked, since no wording axis is recorded on the acceptance path
     [SOURCE: specs/sk-communication/006-sk-communication-clarity/context/clarity.md:179-182;
     src/fidelity/validator.ts:223-227].
   - *Extend the same lane to cut-and-reorder.* For any spanned content the extension silently
     achieves nothing: the candidate is rejected at `PLACEHOLDER_REORDERED`
     [SOURCE: src/fidelity/protected-spans.ts:174-181], discarded to the exact original
     [SOURCE: src/fidelity/validator.ts:151-166], and the original is shown
     [SOURCE: src/render/decision.ts:59-61]. To make it achieve anything requires relaxing the
     token-order check, which weakens byte-identity protection for *every* message including plain
     copy edits — and by finding 4 the resulting prose reorder would still be unobservable.
   - *Split into two declared operations.* The cost is a second operation, a second instruction site
     (the one-home constraint already sharpened in earlier iterations still governs where it may
     live), and a second acceptance path. The benefit is that each operation's name and its guarantee
     are both true, and the prose-order question becomes explicit instead of latent.

## Questions Answered

- Is a re-render in plainer words still the right lane, given the clarity source's claim that
  smoothing is not rewriting? Yes as one lane, no as the only lane: the copy-editing lane is the
  correct lane for what the engine does and does it with the right guarantees (findings 1-3); it is
  the wrong name for cut-and-reorder, which is a different operation with a different contract
  (findings 4-6). Answer: keep the lane, split the vocabulary and any future reorder operation out
  of it.
- What is the render decision structurally limited to? Selection between two already-fixed byte
  strings plus placement among replace, append-after, sidecar. Reordering is unrepresentable there,
  not merely disallowed (findings 1-2).
- Could a reorder preserve protected spans? Only if no spanned segment moves. A spanned move changes
  the token sequence and is rejected by name (finding 3).

## Questions Remaining

1. Is the composed markdown structure signature order-preserving (arrays joined in order) or
   order-insensitive (sorted/aggregated)? The tail of `createMarkdownStructureSignature` past
   `src/fidelity/dialect.ts:84` is unread. This decides whether a *heading-bearing* reorder is caught
   by `MARKDOWN_STRUCTURE_CHANGED`; it does not affect the finding-4 conclusion for headingless prose.
   Narrowest next check: read `src/fidelity/dialect.ts:85-120`.
2. Does the bounded context text enter the provider request body? Still open from iteration 3; needed
   to decide whether the referent ambiguity is a live rewrite-target risk.
3. Where may a second operation's instruction live without giving the wording standard a second home,
   given that the instruction literal already has multiple homes?

## Ruled Out

- Reading `.opencode/commands/rewrite/response*.md` to settle whether the *user-facing* command name
  "rewrite" collides with rule 17's meaning: still listed under Exhausted Approaches, so the
  command-name collision is left as an unverified inference rather than verified evidence. The
  collision that *is* verified is internal to the package, between the constant name
  `COPY_EDITING_INSTRUCTION` [SOURCE: src/runtime/external-cli-projection.ts:38;
  src/config/local-provider.ts:64] and rule 17 [SOURCE:
  specs/sk-communication/006-sk-communication-clarity/context/clarity.md:179-182].
- Treating the render layer as the place a reorder would have to be caught: ruled out by finding 1 —
  it has no text parameter, so any reorder must happen upstream of it, at the provider/validator
  boundary.
- Treating `INVALID_INPUT` at the render layer as an order check: ruled out by finding 2 — it compares
  the accepted text against its own recorded hash, so a reordered-but-consistently-hashed projection
  passes it.

## Dead Ends

- Searching `src/` for a semantic-difference module that might hold a prose-order test: the only
  module referencing `semanticDifference` is `src/fidelity/validator.ts` itself, so the comparison
  lives behind `compareSemanticMeaning`, called once at
  [SOURCE: src/fidelity/validator.ts:212-221]. Its rule ids are the five shape rules at
  [SOURCE: src/fidelity/validator.ts:223-227]; none is an order rule. Candidate for reducer promotion
  to Exhausted Approaches only as a *location* claim, not as a saturation of the question.

## Edge Cases

- **Ambiguous input**: none blocking. "The lane" was read at both scopes (render-only and full
  accepted-projection pipeline) and both are answered separately; the full-pipeline reading is the
  one the verdict uses.
- **Contradictory evidence**: none found. The clarity source's claim that smoothing is not rewriting
  [SOURCE: specs/sk-communication/006-sk-communication-clarity/context/clarity.md:179-182] does not
  contradict the engine's behaviour; it contradicts the idea of one shared label for both.
- **Missing dependencies**: the composed signature tail was not read inside the tool budget; fallback
  used was a stated inference plus the narrowest next check (Questions Remaining item 1). Confidence
  impact: bounded to heading-bearing reorders, explicitly not to the prose case.
- **Partial success**: six findings with citations; one premise (signature ordering) rests on
  inference rather than a read line. Status set to `complete` because the dispatched question is
  answered with cited evidence, with the residual named above rather than smoothed over.

## Sources Consulted

- .opencode/skills/sk-communication/cli-communication-projection/src/render/types.ts:9-14, :49-56, :67-82
- .opencode/skills/sk-communication/cli-communication-projection/src/render/decision.ts:40-91, :63-70, :81-90, :177-190
- .opencode/skills/sk-communication/cli-communication-projection/src/render/index.ts:5-7
- .opencode/skills/sk-communication/cli-communication-projection/src/fidelity/protected-spans.ts:117, :133-181, :414-415, :424-429
- .opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts:151-166, :190-227
- .opencode/skills/sk-communication/cli-communication-projection/src/fidelity/dialect.ts:57-84
- .opencode/skills/sk-communication/cli-communication-projection/src/runtime/external-cli-projection.ts:38, :207
- .opencode/skills/sk-communication/cli-communication-projection/src/config/local-provider.ts:64, :226
- specs/sk-communication/006-sk-communication-clarity/context/clarity.md:179-182
- specs/sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade/research/deep-research-strategy.md:87-141 (exhausted approaches)
- specs/sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade/research/findings-registry.json (prior finding labels)

## Assessment

- New information ratio: 0.68 — one fully new finding (4: the contract cannot distinguish a copy
  edit from a prose reorder), four partially new (1, 2, 3, 5 extend the render fallback, validator
  preservation and instruction-site findings with the mode inventory, the byte-identity re-check and
  the named reorder rejection), one synthesis (6: the split verdict) plus the simplicity bonus for
  consolidating a question that stayed open across iterations 2-4.
- Questions addressed: the lane question (answered), the render-limits sub-question (answered), the
  protected-span admissibility sub-question (answered), one residual premise on signature ordering.
- Questions answered: lane question answered as "keep the lane, split the vocabulary".

## Reflection

- What worked and why: reading the *input contract* before the decision logic settled the render
  question in one step, because `RenderDecisionInput` having no text field is the fact that makes
  reordering unrepresentable rather than merely disallowed — the type declares the boundary, the
  function only obeys it. Reading the restoration contract's rejection codes rather than its happy
  path found `PLACEHOLDER_REORDERED`, which is the one place the engine already reasons about order
  and therefore the hinge for the whole verdict.
- What did not work and why: I spent a call looking for a semantic-difference module that might carry
  a prose-order test, and there is no such module — the comparison is a single call inside the
  validator, so the search surface was the wrong shape for the question. The right move was to grep
  for the call site first and the definition second, which is what the narrow reread then did.
- What I would do differently: read `createMarkdownStructureSignature` to its closing line in one
  pass instead of stopping after the construction loop, since the composition decides whether finding
  7.4's heading case is held or open; stopping mid-function converted a one-line read into a carried
  premise.

## Recommended Next Focus

Read `src/fidelity/dialect.ts:85-120` to settle the signature composition and close the last premise
on the heading case, then take the still-open context-transmission question (does the bounded context
text enter the provider request body) since it decides whether the referent ambiguity is a live
rewrite-target risk. If a second operation is wanted, the follow-on question is where its instruction
may live without creating a second home for wording knowledge — the one-home tension was sharpened in
iteration 3 and remains the binding constraint on any split.
