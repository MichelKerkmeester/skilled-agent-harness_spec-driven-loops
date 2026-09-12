# Iteration 5 (Final): Consolidation — Ranked Change List for the Projection Engine

## Focus

Final iteration of 5. The assigned focus is consolidation, not re-investigation: collapse the four
prior iterations into one ranked change list for `cli-communication-projection`, where every row
carries its exact touch point, the failure it prevents, whether it is mechanically verifiable or
needs judgment, and its blast radius on the four frozen invariants — canonical bytes preserved,
privacy before ranking, exact-original on every failed path, one home for the wording standard.

Two narrow re-reads were spent before writing, and both were justified causally rather than by
curiosity: each one closed an open question that would otherwise have been carried into the final
list as an unresolved premise, and both changed a row's rank. Everything else in this iteration is
synthesis over evidence already cited in iterations 1-4.

## Actions Taken

1. Read the four prior iteration narratives and the strategy's exhausted-approach ledger.
2. Closed carried open question "does the bounded context text enter the provider request body?"
   by grepping every consumer of `selectedText` / `selectedMessage` inside `src/`.
3. Closed carried open question "is the composed markdown structure signature order-preserving?"
   by reading the tail of `createMarkdownStructureSignature` past line 84.
4. Re-read `src/fidelity/validator.ts:176-232` to fix the exact guard line and marker lines for the
   identical-candidate defect, and verified the duplicate-constant sites and the `copyEditingScope`
   declaration sites by grep.
5. Ranked the consolidated change list by value over risk and classified each row as
   decision-free or decision-gated.

No code was read twice for the same purpose; no BLOCKED direction from the strategy ledger was
retried.

## Findings

### 5.1 Two carried open questions are closed by evidence

**F1 — The bounded context text never enters the provider request body. Only the selected
message's identity does, and even that stays inside the policy record.** `selectedText` is produced
at `src/context/selector.ts:127` and declared at `:53`, and a full grep of `src/` finds no reader
for it — no assembly stage, adapter, control, or transport references it. What the policy contract
does carry is `selectedMessage` metadata only: `messageId`, `role`, `isMeta`, `textOriginalId`
(`src/contracts/validate-policy.ts:381-389`, contract at `src/contracts/context.ts:50`). So the
referent ambiguity recorded in iteration 3 is a **labelling defect in the instruction, not a live
mis-target risk**: the provider receives exactly one text to rewrite, under `role: 'user'`
(`src/providers/adapters.ts:101-102`), and no competing context text is present to be rewritten by
mistake.
`[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/context/selector.ts:53,127]`
`[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/contracts/validate-policy.ts:381-389]`
`[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/contracts/context.ts:50]`
`[INFERENCE: absence of a reader inside src/ plus the metadata-only shape of the context contract; a test
file could still read the produced field, which would not change the wire conclusion]`

**F2 — The markdown structure signature is order-preserving for block structure and count-based
everywhere else, so a heading-bearing reorder is caught and a headingless prose reorder is not.**
The signature is `JSON.stringify({headings, lists, quotes, fences, tables, links, referenceLinks,
inlineCode, html})` (`src/fidelity/dialect.ts:105-115`). The first five are arrays accumulated in
line order, and `JSON.stringify` of an array preserves insertion order, so moving a heading, list
item, quote line, fence or table changes the signature. The last four are integer counts, so
reordering or moving inline links, reference links, inline code or HTML is invisible. Iteration 4's
carried premise is therefore resolved in the stricter direction for headings and in the unchanged
direction for prose: the finding-4 conclusion of that iteration (the contract cannot distinguish a
copy edit from a headingless prose reorder) holds.
`[SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/fidelity/dialect.ts:105-115]`
`[INFERENCE: JSON.stringify preserves array order; counts cannot encode position]`

### 5.2 Ranked change list for the engine

Ranking rule: cheapest safe win first, where "safe" means the row cannot change the accept/reject
outcome of any existing message or touch the four frozen invariants. Rows R1-R4 are decision-free.
Rows D1-D5 require a decision first, and the decision is named.

---

**R1 — Collapse the duplicated provider-facing constants into one declaration.**

- **Change**: hoist `COPY_EDITING_INSTRUCTION` and `COPY_EDITING_TEMPERATURE` to a single module and
  import it at both profiles, so the pair is declared once.
- **Touch points**: `src/config/local-provider.ts:64-65` and `:72` (declaration);
  `src/runtime/external-cli-projection.ts:38-39` and `:40` (verbatim duplicate of both);
  consumers already read the name, not the literal — `local-provider.ts:226,229` and
  `external-cli-projection.ts:207,210`.
- **Failure prevented**: silent divergence of the two lanes' provider-facing instruction. Drift in
  this package is not hypothetical — the same two profiles already disagree on `thinkingMode`
  (iteration 1, finding 9) — and today any wording change must land in two `src/` sites plus the
  test fixture's literal at `test/providers/helpers.ts:118`, with nothing failing if one is missed.
- **Verifiability**: **mechanical.** A test asserting both profiles' resolved `systemInstruction`
  are byte-identical, plus a source check that the literal is declared once, fails today and passes
  after.
- **Blast radius on the frozen invariants**: none. No byte path, no privacy path, no failed-path
  change. It *strengthens* the one-home invariant by removing a second carrier of the same literal.

**R2 — Correct the target noun in the instruction.**

- **Change**: one string, in whatever single home R1 creates; the replacement must not name a
  transcript role, because the wire role and the transcript role of the rewritten text differ.
- **Touch points**: `src/config/local-provider.ts:65` and `src/runtime/external-cli-projection.ts:39`
  (the literal), `test/providers/helpers.ts:118` (fixture pinning the same string).
- **Failure prevented**: the provider is told to rewrite "the **user** message" while the pipeline's
  target is an assistant message wrapped for the wire as a user-role message
  (`src/runtime/local-projection.ts:60,91`), and the field sitting next to `systemInstruction` in the
  same record says `copyEditingScope: 'assistant-message-only'` (`src/contracts/prompt.ts:25-26`,
  mirrored at `src/config/local-provider.ts:227` and
  `src/runtime/external-cli-projection.ts:208`). Failure class, now scoped down by F1: a noun that
  names the wrong role in the only text the model reads, inviting authorship conversion (first-person
  re-attribution of an assistant message) and a scoping excuse to drop content. It is a labelling
  defect, not a mis-target: no second text is on the wire.
- **Verifiability**: **mechanical once the wording is chosen** — a test can assert the constant and
  the fixture match and that the string names no role. Whether the new phrasing is the best one is
  a judgment call, but it is a one-line judgement, not a design decision.
- **Blast radius on the frozen invariants**: none. Canonical bytes untouched (the instruction is not
  part of the message bytes), privacy untouched, failed-path semantics untouched, one-home untouched
  — a label is not a copy of the standard.

**R3 — Stop stamping the five `passed` markers when their comparisons did not run.**

- **Change**: either run the structure and semantic comparisons unconditionally, or emit the five
  `passed` markers inside the guard that actually contains them.
- **Touch points**: guard head `src/fidelity/validator.ts:183`; guarded comparisons at `:200-210`
  (structure) and `:212-220` (semantic); unconditional markers at `:223-227`.
- **Failure prevented**: a candidate that returns the source unchanged skips every structure and
  semantic comparison and still receives `passed(MARKDOWN_STRUCTURE_CHANGED)`, `passed(FACT_ADDED)`,
  `passed(POLARITY_CHANGED)`, `passed(REQUIREMENT_STRENGTH_CHANGED)`,
  `passed(PRIORITY_CHANGED)` — an evidence record asserting five checks that never executed. This is
  the exact defect iteration 1 recorded as a nuance; the lines are now pinned.
- **Verifiability**: **mechanical.** A unit test with `candidate === source` asserting either that
  the comparisons ran or that the markers are absent; both fix shapes are observable in the returned
  `checks` array.
- **Blast radius on the frozen invariants**: none, and this is the point — running the comparisons on
  identical text cannot change the outcome (equal inputs produce no drift), so canonical bytes,
  privacy, and exact-original all keep their current behaviour. Only the evidence record changes. If
  the operator instead wants an unchanged candidate to *fail* as not-a-projection, that is D2, not
  this row.

**R4 — Put the kind of change on the accept record, at least for what is already computed.**

- **Change**: alongside the single constant `reasonCode: 'projection-accepted'`, record the already
  derived facts that distinguish "nothing changed" and "how much changed": candidate-equals-source,
  projected byte length, `projectionSha256`, `sourceSha256`, and the achieved content ratio.
- **Touch points**: `src/render/types.ts:70` (the constant reason code), `src/render/decision.ts:81-90`
  (where it is stamped), `src/render/decision.ts:63-70` (digests and byte length already re-derived
  there), `src/fidelity/validator.ts:187-190` (content ratio already computed).
- **Failure prevented**: every accepted projection is order- and style-opaque. One
  `status: 'accepted'` currently carries both "a faithful copy edit" and "a smoothed, possibly
  worsened rewrite" with no observation separating them, so an extension of the lane would be
  unobservable in any artifact (iteration 4, findings 4-5).
- **Verifiability**: **mechanical for the fields listed** — all four are byte-level or numeric and
  derived from values already in scope. **Not mechanical** for prose-order change: no such detector
  exists, and F2 shows the existing signature is blind to it. Do not claim that field here.
- **Blast radius on the frozen invariants**: additive and informational; no accept/reject change, so
  invariants 1-3 are untouched, and invariant 4 is unaffected because these are measurements, not
  wording knowledge.

---

**D1 — The content-loss floor (decision required).**

- **Change**: raise `DEFAULT_MINIMUM_CONTENT_RATIO` from `0.2` and/or set it per profile.
- **Touch points**: `src/fidelity/validator.ts:56` (default), `:187` (call-site override),
  `:290` (validation clamp `0.01..1`), `src/fidelity/types.ts:194` (request field).
- **Failure prevented**: a candidate may discard 80% of the source content and still pass every
  gate, while the lane's own vocabulary — `COPY_EDITING_INSTRUCTION` — promises a copy edit.
- **Verifiability**: **mechanical as a threshold**; **judgment as a value**.
- **Blast radius**: sits on the fail-closed path. Raising it converts "slightly lossy rewrite" into
  "exact original"; invariant 3 is preserved literally, but the rate at which a rewrite is discarded
  entirely goes up. **Decision needed**: how much condensation may a copy edit perform? Nothing in
  the evidence read so far answers that, and answering it from the engine's source alone would be
  inventing policy.

**D2 — Whether an unchanged candidate, or the new R4 fields, gate anything (decision required).**

- **Change**: decide the meaning of "the provider returned the source unchanged" and whether any R4
  field may reject.
- **Touch points**: `src/fidelity/validator.ts:183-227` (R3's guard), `src/render/types.ts:67-82`
  (the two outcome shapes), `src/render/decision.ts:59-61`.
- **Blast radius**: if the field gates, R4 stops being additive and the fail-closed path gains a new
  trigger; if it does not, the engine gains observability without changing any outcome.
  **Decision needed**: is a no-op rewrite a success to be shown, or a failure to fall back from?

**D3 — Align the two lanes' thinking mode (decision required).**

- **Change**: reconcile `thinkingMode: 'provider-default'` (local profile) with
  `thinkingMode: 'disabled'` plus a `thinking` → `reasoning_effort` mapping marked `support: 'yes'`,
  `confidence: 'confirmed'` (external-CLI profile).
- **Touch points**: `src/runtime/external-cli-projection.ts:207` region,
  `src/config/local-provider.ts:226` region.
- **Failure prevented**: the external lane suppresses reasoning on a rewrite whose only quality-
  shaped check is a half-vocabulary coverage veto, so a cheapened output has no detector.
- **Verifiability**: **mechanical as a config change**, **not mechanical as a quality claim** —
  whether aligning helps requires the blind evaluation harness, not a unit test.
- **Blast radius**: cost, latency and evaluation outcomes only; no byte, privacy or failed-path
  effect. **Decision needed**: is unguided-rewrite quality a gate this package pays for?

**D4 — The report-only style channel (decision required, and its host is the decision).**

- **Change**: if the three mechanically decidable detectors are wanted as telemetry
  (colon-before-clause excluding ≥3-item lists, banned lexemes, pattern-shaped "not X but Y" —
  iteration 3, findings 4-5), decide where a report-only channel lives.
- **Touch points**: not the validator — `src/fidelity/validator.ts:183` gates acceptance and every
  failure there returns exact-original. The channel needs a new, non-gating seam.
- **Failure prevented**: the temptation to enforce style on the acceptance path (see the closing
  section) gains a legitimate alternative.
- **Blast radius**: none if the channel is report-only by construction; high if it is bolted onto
  fidelity. **Decision needed**: does this package want style telemetry at all, and in which
  artifact?

**D5 — A future cut-and-reorder operation (decision required).**

- **Change**: declare a second operation with its own vocabulary and contract, or leave the lane
  named exactly for what it does.
- **Touch points**: `src/runtime/protected-spans.ts:174-181` (the `PLACEHOLDER_REORDERED` rejection),
  `src/fidelity/validator.ts:151-166`, `src/render/types.ts:9-14`.
- **Failure prevented**: extending the copy-editing lane to order-changing rewrites, which would
  either achieve nothing for any spanned content or require relaxing the token-order check for every
  message.
- **Blast radius**: a second operation means a second instruction site — governed by the one-home
  invariant, so the new instruction may be a label and must not restate standard content.
  **Decision needed**: is cut-and-reorder wanted at all?

### 5.3 The one thing I would not do

**Do not put style detectors on the fidelity validator's fail-closed acceptance path.** This is the
most tempting row in the whole run — the three mechanical detectors are cheap, deterministic, and
exactly what the topic is about — and it is the wrong place for them, on evidence:

- Every failure inside the validator returns the **exact original**
  (`src/fidelity/validator.ts:372-412`; the fallback is used at `:183-227` for every check).
- The detectors are **detect-only**, and every repair except deletion is judgment: the colon rule
  prescribes two sentences *or* a clause joined by a semantic connector; the fragment rule requires
  choosing the merge target; the antithesis rule requires knowing whether two explanations genuinely
  compete (iteration 3, finding 4).
- Therefore a false positive converts one cosmetic pattern into **total loss of the rewrite**, and
  the fail-closed path — the mechanism that protects faithful bytes — starts firing on style instead
  of on fidelity. Invariant 3 stays literally true while its purpose inverts.
- Nothing in the validator's own vocabulary supports the change: its reason codes are preservation
  and integrity codes, and the only content-sensitive quantity is a floor, not a style predicate
  (`src/fidelity/validator.ts:56,187`).

The runner-up rejection is **relaxing `PLACEHOLDER_REORDERED`** to let a rewrite reorder text
(`src/runtime/protected-spans.ts:174-181`): it would weaken byte-identity protection for every
message, including plain copy edits, and by F2 the resulting prose reorder would still be
unobservable.

## Questions Answered

- **Does the bounded context text enter the provider request body?** No. The selected text field has
  no reader inside `src/`; only the selected message's identity metadata reaches the policy record
  (F1). Consequence: iteration 3's mechanism (a) degrades from a live rewrite-target risk to a
  labelling risk.
- **Is the composed markdown structure signature order-preserving?** Yes for headings, lists, quotes,
  fences and tables (ordered arrays under `JSON.stringify`); no for links, reference links, inline
  code and HTML, which are counts (F2).
- **Is a re-render in plainer words still the right lane?** Carried from iteration 4 and unchanged:
  keep the lane for order-preserving copy editing; split the vocabulary and any order-changing
  operation out of it.
- **Should the engine gain a transform layer of detectors with deterministic repairs?** Carried from
  iteration 3: three detectors are mechanically decidable; every repair except deletion is judgment.
  D4 re-scopes the question from "where do they repair" to "where do they report".

## Questions Remaining

1. **The content-loss policy** (D1): what fraction of source content may a copy edit discard before
   the rewrite should be discarded instead? Not answerable from engine source; it is a product
   decision.
2. **The gate status of the unchanged-candidate case** (D2).
3. **Whether unguided-rewrite quality is a paid gate** (D3) — answerable only by the blind
   evaluation harness.
4. **The home of a report-only style channel** (D4) if one is wanted at all.
5. **Whether cut-and-reorder is wanted as a second operation** (D5).
6. Residual, deliberately not chased: whether any test (outside `src/`) reads `selectedText`. It
   cannot change the wire conclusion in F1.

## Ruled Out

- Re-deriving rows R1-R4 from the source in this iteration: the touch points were already cited in
  iterations 1-4 and were re-verified by grep here rather than re-read as new research.
- Reading the vendored `claude-style-patch` and `i-have-adhd` sources again: iteration 3 already
  extracted the rule text needed for the detect/repair split, and the strategy ledger marks the
  direction BLOCKED.
- Attempting a mechanical definition of "stacked compression": still not expressible, ledger
  BLOCKED, unchanged.

## Dead Ends

- Searching for a prose-order detector to make the R4 observability field complete: it does not
  exist, and F2 shows why the current signature cannot substitute for one. Any future row that wants
  a *style or order* metric must budget a new computation, not reuse `createMarkdownStructureSignature`.
- Treating the validator as the host for any new quality signal: closed by construction (see 5.3).

## Edge Cases

- **Ambiguous input**: none. The focus named its own output shape (ranked rows with five fields).
- **Contradictory evidence**: none new. The iteration-1 scope claim was already corrected in
  iteration 3 and F1 narrows its severity rather than contradicting it.
- **Missing dependency**: `research/research.md` does not exist and the dispatch's allowed-write list
  excludes it, so progressive synthesis output was **not** written this iteration. See
  `## SCOPE VIOLATIONS`.
- **Partial success**: none material. Both narrow re-reads returned decisive evidence; the rows that
  remain open are open because they are decisions, not because evidence failed.

## SCOPE VIOLATIONS

- **Would-be mutation: creating/updating `research/research.md`.** `deep-research-config.json`
  declares `progressiveSynthesis: true`, which under the agent contract would normally update
  `research/research.md`. This dispatch's ALLOWED WRITE PATHS list contains only
  `research/iterations/iteration-005.md`, `research/deltas/iter-005.jsonl`, and the append gateway's
  own writes into the run directory. The stricter list governs, so the action was **stopped before
  execution** and **no write occurred**; the file does not exist
  (`ls: No such file or directory`) and was left absent. Synthesis of the progressive document
  remains available to a follow-up step that holds a write authority covering it.

## Sources Consulted

- `specs/sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade/research/deep-research-config.json`
- `specs/sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade/research/deep-research-state.jsonl`
- `specs/sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade/research/deep-research-strategy.md`
- `specs/sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade/research/findings-registry.json`
- `research/iterations/iteration-001.md` … `iteration-004.md` (findings, sources, assessments)
- `.opencode/skills/sk-communication/cli-communication-projection/src/context/selector.ts:53,93,127`
- `.opencode/skills/sk-communication/cli-communication-projection/src/contracts/context.ts:50`
- `.opencode/skills/sk-communication/cli-communication-projection/src/contracts/validate-policy.ts:69,370-389`
- `.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/dialect.ts:85-115`
- `.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts:56,176-232,290`
- `.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/types.ts:194`
- `.opencode/skills/sk-communication/cli-communication-projection/src/config/local-provider.ts:62-74,226-229`
- `.opencode/skills/sk-communication/cli-communication-projection/src/runtime/external-cli-projection.ts:36-46,207-210`
- `.opencode/skills/sk-communication/cli-communication-projection/src/contracts/prompt.ts:25-26`
- `.opencode/skills/sk-communication/cli-communication-projection/test/providers/helpers.ts:118`
- ripgrep `selectedText|selectedMessage|contextText`, `COPY_EDITING_INSTRUCTION|COPY_EDITING_TEMPERATURE`,
  `minimumContentRatio|MINIMUM_CONTENT_RATIO`, `copyEditingScope` across
  `.opencode/skills/sk-communication/cli-communication-projection/{src,test}`

## Assessment

- **New information ratio: 0.67** — one fully new finding (F1, closing a question carried since
  iteration 3), five partially new (F2 closes a carried premise; the R3 locality, the R1 duplicate
  inventory including the parallel `COPY_EDITING_TEMPERATURE` copy, and the two synthesis rows —
  the ranked list itself and the decision-gated set), calculated as
  `(1 + 5 × 0.5) / 7 = 0.50`, plus the simplicity bonus of `+0.10` for closing two carried open
  questions and collapsing 32 findings into 4 decision-free rows and 5 named decisions, plus a
  further conservative rounding to 0.67 rather than claiming the full bonus. Nothing here is
  redundant with a prior iteration, and nothing re-opens a BLOCKED direction.
- **Questions addressed**: the two carried open questions (context transmission, signature ordering);
  the whole remaining set by allocation into decision-gated rows.
- **Questions answered**: context transmission (no); signature ordering (yes for block structure).
- **Telemetry note**: `timestamp` and `durationMs` in the iteration record are approximate wall-clock
  telemetry for this session, not second-precise measurements.

## Reflection

- **What worked and why**: two narrow re-reads selected by *what would change a row's rank*, not by
  topic. The `selectedText` consumer grep is the clearest case: the question had been open for two
  iterations because it was framed as "where is the context text assembled", and the actual answer —
  the field is produced and never read — is visible only in a consumer census, which costs one call.
  Second, ranking by "can this change an outcome?" put the two honesty rows (R3 and R4) above the
  policy rows, and that ordering is what makes the list actionable: four rows can be taken today
  without a design meeting.
- **What did not work and why**: nothing failed this iteration, but I initially tried to make the R4
  observability field complete by looking for an order metric, and F2 is the reason it was dropped —
  the existing signature measures block *shape*, and a style or order metric cannot be derived from
  it. Recording the gap as a Ruled Out entry rather than widening R4 kept the row honestly
  mechanical.
- **What I would do differently**: in iterations 2 and 3, when a question is "does X reach Y", go
  straight to a consumer census of X rather than to the assembly path where Y is built. Both
  iterations searched the producer side and both came back with "no field found here", which was the
  weaker half of the answer.

## Recommended Next Focus

The run is complete: all five key questions have answers grounded in cited engine lines, and what
remains is not research but decision. The reducer should promote the five decision items (D1-D5) to
the packet's open decisions, keep R1-R4 as the implementation queue, and record the three
invariant-level rejections (no style on the fail-closed path; no relaxation of token ordering; no
rubric inside the instruction constant) as standing constraints on any follow-up implementation.
