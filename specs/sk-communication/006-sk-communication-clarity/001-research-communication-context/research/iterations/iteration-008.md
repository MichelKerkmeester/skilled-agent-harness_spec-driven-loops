# Iteration 8: Should the wording standard split into a document half and a reply half?

## Focus

The dispatch asked one question with three parts: (1) whether `repo-rules/communication.md` already
draws the document-versus-reply line in prose; (2) whether a split would remove `sk-communication`'s
hand-maintained exclusion list or merely move it; (3) one recommendation with its main trade-off,
plus what breaks for the document-side consumers if the file splits.

The consumer enumeration was supplied by the dispatch and was not repeated. This iteration reads only
the boundary prose, the two sections the skill excludes by name, and the pointer contracts of the
document-side consumers.

## Actions Taken

1. Read state: config, state ledger (records 1-7 and 9, no 8), strategy sections 9-11, before choosing focus.
2. Read the boundary prose: `repo-rules/communication.md:105-135`.
3. Read the standard's overview/scope and both named sections: `hvr-rules.md:15-74`, `hvr-rules.md:315-524`.
4. Read the exclusion table and its restatement: `sk-communication/SKILL.md:172-181,231,260`.
5. Read the document-side pointer contracts: mode `SKILL.md`, mode `README.md`, sk-doc `README.md` and `ROUTER.md`, and the two rewrite commands' pointers.
6. All researched files were read only; every write stayed inside the packet.

## Findings

1. **The document-versus-reply line already exists in prose, and it is imperative rather than
descriptive.** `communication.md:119` says of the standard: "Load all of it when writing a
document." `communication.md:121-126` then draws the reply side: "In a reply, take its voice half
and leave its document half. The voice directives, the vocabulary lists and the tell lists apply
to anything a reader reads, and a reply is read. The document-structure sections do not, because a
reply has no headings, no front matter and no publish step. A message that presents the result of
a long run is the case that decides this: it is a reply by delivery and a document by content, and
it takes the voice half like any other reply." The boundary a split would formalize is already
normative, and it is drawn as a semantic half ("voice" versus "document-structure"), not as a file
boundary. [SOURCE: repo-rules/communication.md:116-126]

2. **The `VOICE PERSONALITY` exclusion cannot be removed by file geometry; a split only moves it.**
The exclusion's stated reason is message ownership, not documentness:
`sk-communication/SKILL.md:180` — "A projection carries someone else's message, so a reaction the
original never held is a fidelity failure rather than a voice improvement." Because
`communication.md:121-122` puts the voice directives in the reply half, any document/reply split
places section 5 (`hvr-rules.md:322`) in the reply half, where the projection still needs the
exclusion. Section 5 is also not pure voice: its `Rule Precedence` subsection
(`hvr-rules.md:352-363`) is first-match-wins penalty machinery that a reply does not run, so the
split forces a new intra-section carve-out. The hand-maintained list moves into the reply half and
gains a row. [SOURCE: .opencode/skills/sk-communication/SKILL.md:176-181]
[SOURCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:322-363]
[SOURCE: repo-rules/communication.md:121-122]

3. **The scoring-band exclusion is the one row an extraction could genuinely delete, and a
precedent already exists.** The recorded reason is structural: `sk-communication/SKILL.md:181` —
"Nothing in either lane is a document being published. There is no file, no score and no publish
threshold." The excluded matter is section 9's `Scoring` subsection (`hvr-rules.md:449-463`: the
attention-share table and the 85/70 pass bands). If the publish machinery leaves the file replies
load, the exception becomes a fact rather than a list: a reply consumer never opens the publish
file. The standard has already done this once for the arithmetic — `hvr-rules.md:38` routes the
subtraction to `references/scoring-and-verification.md` section 3.
[SOURCE: .opencode/skills/sk-communication/SKILL.md:181]
[SOURCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:38,449-463]

4. **Existing section boundaries do not match the document/reply line, so a clean two-file split is
not cuttable along sections.** Section 4 counts as document-structure in the prose reading
(`communication.md:123-124`), yet it contains a reply-scoped subsection, `Tables In A Reply`
(`hvr-rules.md:147`). Section 9 is the publish checklist, yet its voice block depends on section 5:
`hvr-rules.md:510-511` requires "Writing has personality, not just correctness (Section 5)" and
"Complexity acknowledged, not flattened into neat categories". Extracting section 9 into a document
half therefore creates a document-to-reply-half dependency; whichever half holds section 5 is
loaded by document consumers anyway. Combined with finding 1, the only split shape consistent with
the prose is a base plus supplement, not two halves: replies take a proper subset while documents
load all of it (`communication.md:119`).
[SOURCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:147,449-511]
[SOURCE: repo-rules/communication.md:119,123-124]

5. **Recommendation and what breaks.** Recommendation: do not split the standard into document and
reply halves; make the boundary structural only where it is already structural — extract the
publish machinery (section 9's scoring bands, arguably the whole pre-publish checklist) into a
document-only companion, leaving one standard that replies take whole. Main trade-off: the
extraction buys one removed exclusion row and one less drift point, at the cost of a second path
for every document consumer and a scanner-contract check (its expected-section list is unread — see
Edge Cases). The `VOICE PERSONALITY` row survives in every variant. If the file splits anyway, this
is what breaks for the document-side consumers:

- The single-path "referenced, never copied" contract. The mode's rule at
  `sk-create-with-human-voice/SKILL.md:208`: "Copy any part of `references/hvr-rules.md` into
  another file... Reference the path." The dependency table at `SKILL.md:66` marks it
  "ALWAYS | Every invocation", and `README.md:53` records that the scanner reads the same path at
  run time. A split turns the one path into a choice and re-opens the copy question.
- The routing and index surfaces enumerate exactly one path: `sk-doc/README.md:204` ("the writing
  standard all output must pass"), `sk-doc/ROUTER.md:217,349`, mode `SKILL.md:59,244,252`, mode
  `README.md:30,207`.
- The scanner's movement guard. The mode's own test table documents "Fails closed on a moved
  standard ... `parsed too thin`, exit 2" (`README.md:190`) and "Survives renumbering"
  (`README.md:191`). A split that relocates sections between files risks tripping a guard whose
  contract was not read this iteration.

[SOURCE: .opencode/skills/sk-doc/sk-create-with-human-voice/SKILL.md:59,66,208,244,252; README.md:30,53,190-191,207]
[SOURCE: .opencode/skills/sk-doc/README.md:204] [SOURCE: .opencode/skills/sk-doc/ROUTER.md:217,349]

## Ruled Out

- Treating a document/reply file split as the mechanism that deletes the exclusion table: findings 2
  and 3 show one row moves and one row is removable only by extraction, so the table does not
  disappear with the split.
- Re-enumerating the consumers: the dispatch pre-completed the enumeration and it was reused.

## Dead Ends

- "A document/reply split removes the hand-maintained exclusion list" — eliminated. Candidate for
  reducer promotion to the strategy's exhausted list.

## Edge Cases

- Ambiguous input: the dispatch labels this iteration 8 and pre-substitutes the iteration-008 paths,
  while the ledger already holds records 1-7 and 9 (8 records, no 8). Selected interpretation: fill
  the genuine gap at 8 — it is the only path inside the allowed write list, it overwrites nothing,
  and the alternative (renumbering to 10) would escape the pre-substituted paths. Recorded as
  ambiguous-input in the state record.
- Contradictory evidence: none.
- Missing dependency: `hvr_scan.py`'s expected-section list was not read (budget), so the scanner
  risk in finding 5 is a documented uncertainty rather than a confirmed break.
- Partial success: none.

## Questions Answered

Dispatch-scoped (not the five key questions):

1. Yes — `communication.md:116-126` already draws the document/reply line in prose; quoted in finding 1.
2. A split moves the exclusion rather than removing it; only the scoring-band row is removable, and only under an extraction design (findings 2-3).
3. Recommendation given with its trade-off and the document-side break list (finding 5).

## Questions Remaining

- The five key questions stay open as recorded in `strategy.md:34-43`.
- New: does `scripts/hvr_scan.py` hard-require section 9's headings? That decides whether extracting
  the publish machinery is a copy change or a scanner change.

## Sources Consulted

- repo-rules/communication.md:105-135
- .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:15-74,147,315-524
- .opencode/skills/sk-communication/SKILL.md:172-181,231,260
- .opencode/skills/sk-doc/sk-create-with-human-voice/SKILL.md:59,66,208,244,252
- .opencode/skills/sk-doc/sk-create-with-human-voice/README.md:30,53,190-191,207
- .opencode/skills/sk-doc/README.md:204
- .opencode/skills/sk-doc/ROUTER.md:217,349
- .opencode/commands/rewrite/response.md:72,149
- .opencode/commands/rewrite/response-by-external-agent.md:137,249
- state ledger: 8 iteration records (1-7, 9)

## Assessment

- New information ratio: 0.60
- Findings: 5 (1 fully new, 4 partially new)
- Questions addressed: 3 (dispatch-scoped)
- Questions answered: 3 (dispatch-scoped)

## Reflection

- What worked and why: reading the two excluded sections as files rather than trusting their labels.
  The label "scoring bands" resolved to section 9's `Scoring` subsection; the label
  `VOICE PERSONALITY` resolved to a section that also carries penalty-order machinery, which turned
  the exclusion question from a naming question into a boundary question.
- What did not work and why: nothing failed outright. The scanner contract was left unread for
  budget, which caps finding 5 at a risk statement.
- What I would do differently: read `hvr_scan.py`'s expected-section list before endorsing any
  extraction, since the mode's README documents that moving sections fails closed.

## Next Focus

### Recommended Next Focus

Verify `hvr_scan.py`'s expected-section contract against a candidate extraction of section 9; and
carry the standing reducer item — if any split or extraction is adopted, who owns the mode's failure
mode when the standard's sections move.
