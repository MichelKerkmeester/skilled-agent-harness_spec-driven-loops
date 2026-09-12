# Iteration 1: clarity.md — eighteen rules classified against the repository communication stack

## Focus

Inventory `context/clarity.md` and classify each of its eighteen rules as covered, partially
covered, or genuinely new against this repository's own communication stack, citing the covering
line. Chosen because clarity's first four rules govern decisions made before any sentence exists,
while the stack's documents begin at the sentence. Per `deep-research-strategy.md` §11 this is
where the coverage question is most likely to return a real gap.

Path note: `context/` abbreviates
`specs/sk-communication/006-sk-communication-clarity/context/`. All other paths are repo-root
relative. `HVR` abbreviates
`.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`.

## Actions Taken

1. Read state: `deep-research-config.json`, `deep-research-state.jsonl` (0 iteration records),
   `deep-research-strategy.md` §11, `findings-registry.json` (empty).
2. Verified the write boundary: packet root is `.../001-research-communication-context/research/`;
   `iterations/` and `deltas/` were empty; no reducer-owned file was scheduled for a write.
3. Read `context/clarity.md` in full (18 rules, lines 37-192).
4. Read every stack surface the strategy's bounded snapshot names: `AGENTS.md` §3 and §8, plus
   §4 and §10 anchors; `REPO RULES.md` §1-§3; `repo-rules/communication.md`;
   `repo-rules/presenting-decisions.md`; `repo-rules/handoff-and-questions.md`;
   `repo-rules/uncertainty-and-honesty.md` (targeted); `.opencode/skills/sk-communication/SKILL.md`;
   `HVR` and its sibling `scope-and-exemptions.md`; `.opencode/commands/rewrite/response.md`.
5. Classified all 18 rules. No web fetches: the strategy's §4 non-goals freeze the vendored
   copies as the input.

## Findings

### F1 — Coverage tally for clarity.md

10 of 18 rules are covered by a named stack line, 3 are partial, 5 are new.
`[SOURCE: context/clarity.md:37-192]` `[SOURCE: repo-rules/communication.md]`
`[SOURCE: HVR]`

### F2 — Classification table

| # | clarity.md rule | Status | Covering line | What remains unnamed |
|---|---|---|---|---|
| 1 | Write for one person you can picture | **NEW** | none (nearest `repo-rules/handoff-and-questions.md:70` models the operator after the request arrives) | Choosing the reader before drafting. `[SOURCE: context/clarity.md:37]` |
| 2 | Know what they bring, and what they need | **NEW** | none (nearest `repo-rules/presenting-decisions.md:89` restates the request, post-arrival) | The knowledge-gap model: known context vs needed context. `[SOURCE: context/clarity.md:47]` |
| 3 | Decide what they take away | PARTIAL | `repo-rules/presenting-decisions.md:52` (verdict first) | The arguable-claim-vs-subject distinction; the decide-before-drafting reading (see F8). `[SOURCE: context/clarity.md:54]` |
| 4 | Say something only you could say | PARTIAL | `HVR:93` (back claims with data or examples) | The borrowability test and the "sourcing problem, not a prose problem" diagnosis; a borrowed fact satisfies `HVR:93`. `[SOURCE: context/clarity.md:64]` |
| 5 | Make every sentence pay | COVERED | `repo-rules/communication.md:150`, `:153-158` | — `[SOURCE: context/clarity.md:73]` |
| 6 | Be specific enough to be wrong | COVERED | `HVR:93`, `HVR:227`; `AGENTS.md:482` ("Never fabricate") | — `[SOURCE: context/clarity.md:83]` |
| 7 | Put someone in the sentence | COVERED | `HVR:58` (active voice), `HVR:63` (direct address "you") | — `[SOURCE: context/clarity.md:95]` |
| 8 | Use the plain word, and break the long sentence | COVERED | `HVR:73`, `HVR:78`; `repo-rules/communication.md:72`, `:90` | The precision carve-out at `communication.md:90` already prevents over-application. `[SOURCE: context/clarity.md:104]` |
| 9 | Cut what does no work, then stop | COVERED | `HVR:101` ("Hedge only when genuine uncertainty exists"); `repo-rules/uncertainty-and-honesty.md:128`, `:143` | — `[SOURCE: context/clarity.md:114]` |
| 10 | Say the relation instead of implying it | **NEW** | none (nearest `repo-rules/communication.md:74` is sentence-internal) | Any requirement for an explicit connector, and the missing-relation test. `[SOURCE: context/clarity.md:123]` |
| 11 | Take a position, and say where it is weak | COVERED | `HVR:326`, `HVR:335`; `repo-rules/presenting-decisions.md:67` | — `[SOURCE: context/clarity.md:133]` |
| 12 | Write the way you would say it | COVERED | `HVR:83` | — `[SOURCE: context/clarity.md:142]` |
| 13 | Do not perform | COVERED | `repo-rules/communication.md:187`; `AGENTS.md:410`; `HVR:88` | — `[SOURCE: context/clarity.md:152]` |
| 14 | Give the first sentence its one job | PARTIAL | bans only: `repo-rules/communication.md:153`, `HVR:174`, `HVR:318` | The positive test (make the reader want the second sentence) and the opening-move list. `[SOURCE: context/clarity.md:158]` |
| 15 | Make each paragraph earn the next | **NEW** | none (nearest `repo-rules/communication.md:76` is a different axis) | In-order progression; the stack instead optimizes local independence. `[SOURCE: context/clarity.md:165]` |
| 16 | Stop where the thought stops | COVERED | `HVR:277`; `repo-rules/communication.md:154`; `repo-rules/handoff-and-questions.md:60` | — `[SOURCE: context/clarity.md:172]` |
| 17 | Rewrite by cutting and reordering | **NEW** | none (`.opencode/commands/rewrite/response.md:17-20` is display-only; `.opencode/skills/sk-communication/SKILL.md:57` bars file editing) | Any editing lane for durable prose. `[SOURCE: context/clarity.md:179]` |
| 18 | Read it aloud | COVERED | `HVR:84` | The every-send cadence is not a repo gate; that narrowness is a strength, not a gap. `[SOURCE: context/clarity.md:189]` |

### F3 — Rules 1 and 2 are the clearest gap, and it is structural

Both rules govern work before the first sentence: choose a specific reader, then model what that
reader already knows against what they need. Every stack surface that models the reader does so
after the request has arrived. `presenting-decisions.md:89` restates the request; the operator
table at `handoff-and-questions.md:70` classifies actions; `communication.md:63-66` picks a
register for a boundary the reader has already reached. No line asks the writer to choose an
audience or inventory prior knowledge first. This confirms the strategy's hypothesis for rules 1-2
only: rule 3 is partial and rule 4 is half-covered, so the gap is narrower than "the first four".
`[SOURCE: repo-rules/presenting-decisions.md:89]` `[SOURCE: repo-rules/handoff-and-questions.md:70]`
`[SOURCE: repo-rules/communication.md:63-66]`

### F4 — Rule 4 is half-covered: the stack requires specifics, not originality

`HVR:93` asks for data or examples and `HVR:343-349` asks for concrete detail, so the positive half
of "specific observed detail" is covered. What no line carries is the test itself (could this
paragraph appear word-for-word in someone else's piece?) and the diagnosis that a draft failing it
has a sourcing problem rather than a prose problem. A borrowed statistic satisfies every stack rule
so far. `[SOURCE: HVR:93]` `[SOURCE: HVR:343-349]` `[SOURCE: context/clarity.md:64-69]`

### F5 — Rule 10 is new: the stack regulates the sentence, not the link between sentences

The nearest stack line, `communication.md:74`, is about nested qualification hiding an unexamined
claim inside one sentence. Clarity's rule is about two adjacent sentences whose juxtaposition fakes
a logical relation. The requested test ("supply the word: because, although, once, where, so
that") exists nowhere in the stack. `[SOURCE: repo-rules/communication.md:74]`
`[SOURCE: context/clarity.md:123-128]`

### F6 — Rule 15 is new, and it sits on a different axis than the atomic-paragraph rule

`communication.md:76` requires each paragraph to stand alone, so a reader landing mid-reply can
act on it. Clarity requires each paragraph to earn the next, so a reader moving in order is carried
forward. These optimize opposite properties: local independence against sequential dependency.
They are not contradictory, but the stack names only one of the two obligations.
`[SOURCE: repo-rules/communication.md:76]` `[SOURCE: context/clarity.md:165-168]`

### F7 — Rule 17 has no owning surface today, and that is a routing finding, not just a content gap

"Rewriting is cutting and reordering, not smoothing" needs a review-and-edit lane for durable
prose. The repository's nearest assets decline that lane by design: `/rewrite:response` is
display-only ("leaves canonical transcript history and project files unchanged"), and
`sk-communication`'s SKILL.md bars "rewriting durable Markdown or any on-disk file". So even a
decision to adopt rule 17 would need a surface that does not exist yet, which the owning-surface
question must record. `[SOURCE: .opencode/commands/rewrite/response.md:17-20]`
`[SOURCE: .opencode/skills/sk-communication/SKILL.md:57]` `[SOURCE: context/clarity.md:179-182]`

### F8 — Rule 3 carries the one contradiction candidate, and it turns on when the claim is fixed

Clarity says decide the takeaway before drafting and state it near the beginning
(`context/clarity.md:54-55`). `presenting-decisions.md:52-55` agrees on ordering but warns that
front-loading a conclusion in the *reasoning* is how you stop noticing evidence against it. The
disagreement point is exactly whether the claim may be fixed before the evidence is in. Resolution
status: compatible under a domain split (clarity governs authored essays; the presenting rule
governs evidence-bound reports), so it is recorded as a boundary, not an unresolved contradiction.
A naive port of rule 3 into reply guidance without this split would contradict the repo rule.
`[SOURCE: repo-rules/presenting-decisions.md:52-55]`

### F9 — Rule 14 is partial: the stack bans bad openers but never states the positive job

`communication.md:153` bans empty openers, `HVR:174` removes setup language, `HVR:318` bans
meta-commentary. All three say what not to write. Clarity's positive test (the first sentence's
job is to make the reader want the second) and its opening-move inventory (startling fact, number,
claim, question) appear in no stack line. `[SOURCE: repo-rules/communication.md:153]`
`[SOURCE: HVR:174]` `[SOURCE: HVR:318]`

### F10 — The stack splits prose authority in two, and single-surface checks undercount coverage

Seven rules that looked new against `repo-rules/` alone are covered once HVR is read: 6, 7, 9, 11,
12, 13, 16. `communication.md:116-119` delegates the full document standard to HVR and takes only
its voice half for replies. Any later iteration that classifies against `repo-rules/` without HVR
will overstate the gap. `[SOURCE: repo-rules/communication.md:116-126]`

### F11 — Candidate owning surfaces for the five new and three partial rules

- Rules 1-2 (reader model): `presenting-decisions.md`, whose fires-when already covers "answer a
  complex or ambiguous request" (`:36`) and whose §3 ASK step is the natural host. The alternative
  is a new repo rule, justified only if the content would push `communication.md` past the ceiling
  it already hit (`communication.md:49-51`).
- Rule 4 (borrowability): HVR §4/§5, which already owns vague-claim and specificity content
  (`HVR:225-234`, `:343-349`).
- Rules 10 and 15 (sentence links, paragraph progression): `communication.md` §2, but it is at its
  length ceiling, so a split rather than an append.
- Rule 17 (cut and reorder): HVR's pre-publish checklist (`:449-515`) is the closest home; no
  display-only lane can host it.
- Rule 14 (first-sentence job): `communication.md` §6, beside the empty-opener entry.
- Rule 3 (arguable claim): `presenting-decisions.md` §1, as a domain-scoped boundary note.

`[SOURCE: repo-rules/presenting-decisions.md:36]` `[SOURCE: repo-rules/communication.md:49-51]`
`[SOURCE: HVR:225-234]` `[SOURCE: HVR:449-515]`

### F12 — Adjacent boundary, not a contradiction: plain words against reserved exact names

Clarity's "prefer shorter words" rule reads absolute; `communication.md:90-92` reserves exact
names for languages, frameworks, APIs and commands. The stack already carves out the precision
case, so the rules agree once the carve-out is read in. Worth one sentence in any adopted wording
so a future editor does not apply the shorter-word rule to an API name.
`[SOURCE: repo-rules/communication.md:90-92]` `[SOURCE: context/clarity.md:104-107]`

## Ruled Out

- A pre-writing reader-model rule hiding inside `presenting-decisions.md` §3 or
  `handoff-and-questions.md` §2: both act only after the request arrives.
  `[SOURCE: repo-rules/presenting-decisions.md:85-96]` `[SOURCE: repo-rules/handoff-and-questions.md:68-80]`
- Rule 10 as covered by `communication.md:74`: that clause is sentence-internal (nested
  qualification), not about inter-sentence connectors. `[SOURCE: repo-rules/communication.md:74]`
- Rule 15 as covered by the atomic-paragraph rule: atomicity and progression are different axes,
  so the atomic rule cannot count as coverage. `[SOURCE: repo-rules/communication.md:76]`

## Dead Ends

- `sk-communication` as an owning surface for any of the 18 rules. Its SKILL.md defines a
  display-only projection lane that never edits durable prose, so it is eliminated for all 18 at
  once, not per rule. `[SOURCE: .opencode/skills/sk-communication/SKILL.md:18-20]`

## Edge Cases

- Ambiguous input: none. The strategy's §11 focus names the source and the method.
- Contradictory evidence: one candidate (F8, rule 3 against `presenting-decisions.md:52-55`),
  resolved as a domain-scoped boundary rather than an open contradiction. No unresolved conflict.
- Missing dependencies: none. Every planned source existed and was readable.
- Partial success: one write was refused and recovered. The first gateway attempt returned
  `{"ok":false,"phase":"runtime","reason":"Legacy deep-research record refused: stable-identity-missing"}`
  because the record schema the prompt pack renders omits the `runId`/`lineageId` identity pair the
  gateway's legacy upcaster requires. The record was re-emitted with
  `runId = lineageId = research-sk-communication-006-001-20260912T135900Z` (from
  `deep-research-config.json` `lineage.sessionId`) and accepted: exit 0, receipt sequence 1,
  `canonicalEventHash 58d1116b...`, `projectionRefreshed:true`. Delta line 1 was then aligned to the
  accepted record. Status stays `complete`; the refusal cost no evidence. Recommend the workflow add
  the identity pair to the pack's record schema so iterations 2-10 do not repeat the refusal.
  `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:125-135]`

## SCOPE VIOLATIONS

None. Every write stayed inside the allowed list (`research/iterations/iteration-001.md`,
`research/deltas/iter-001.jsonl`, and the gateway's own writes). Note: `progressiveSynthesis` is
`true`, but the prompt pack's allowed-write list excludes `research/research.md` and the strategy
declares it workflow-owned, so it was left untouched for the workflow reducer to refresh.

## Sources Consulted

- `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:37-192`
- `AGENTS.md:140-228` (§3), `:402-410` (§8), `:482` (§10)
- `REPO RULES.md:1-80` (§1-§3)
- `repo-rules/communication.md:1-202`
- `repo-rules/presenting-decisions.md:1-156`
- `repo-rules/handoff-and-questions.md:1-165`
- `repo-rules/uncertainty-and-honesty.md:128`, `:143`
- `.opencode/skills/sk-communication/SKILL.md:1-170`
- `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:54-105`, `:110-350`, `:366-515`
- `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md:1-45`
- `.opencode/commands/rewrite/response.md:1-50`

## Assessment

- New information ratio: 0.36 — 5 of 18 rules are fully new (1, 2, 10, 15, 17) and 3 are partially
  new (3, 4, 14), so `(5 + 0.5 x 3) / 18 = 0.36`.
- Questions addressed: key question 1, 2 and 4 for clarity.md's share; key question 3 touched with
  one candidate resolved by domain split.
- Questions answered: none fully. The coverage question is source-complete only after
  `claude-style-patch-main` and `i-have-adhd-main` are inventoried.

## Reflection

- What worked and why: reading HVR before classifying was decisive. Seven rules (6, 7, 9, 11, 12,
  13, 16) first looked new against the repo rules alone; HVR's voice directives closed them. The
  cause is structural: the stack splits prose authority between reply discipline in `repo-rules/`
  and the writing standard in HVR, so a single-surface read systematically overstates the gap.
- What did not work and why: the first classification pass used `repo-rules/` and `AGENTS.md`
  only, and produced seven false "new" verdicts. The recovery was reading HVR and
  `scope-and-exemptions.md` in full, which is what the strategy's bounded snapshot had listed all
  along. A second assumption failed: the strategy expected the first four rules as a block to be
  the likely gap; the evidence narrows it to rules 1-2 plus a partial on 3 and 4.
- What I would do differently: for each remaining source, read the source and HVR before
  classifying, and treat the stack as two authorities in one pass instead of discovering the
  second mid-iteration.

## Questions Answered

- None fully. Key questions 1, 2 and 4 are answered for clarity.md's share only; key question 3 has
  one candidate resolved as a domain-scoped boundary.
  `[SOURCE: research/deep-research-strategy.md section 3]`

## Questions Remaining

- The other four key questions stay open for the other two sources: covered-vs-new for
  `claude-style-patch-main/STYLE.md` and `i-have-adhd-main`, cross-source contradiction checks,
  final owning-surface assignment, and the ADHD mechanism-half question (session-start hook, runtime
  mirrors, eval harness, release gate).
  `[SOURCE: research/deep-research-strategy.md section 3]`

## Next Focus

Iteration 2 inventories `context/claude-style-patch-main/STYLE.md` and its README, carrying the
cross-source check on reader modelling (clarity rules 1-2).

## Recommended Next Focus

Iteration 2: inventory `context/claude-style-patch-main/STYLE.md` and its README as discrete
recommendations, using the same covered / partial / new classification with cited lines. Carry one
cross-source check from this iteration: if STYLE.md also names audience selection or reader
knowledge modelling (rules 1-2 here), the gap becomes a two-source signal and the owning-surface
recommendation for `presenting-decisions.md` strengthens. Defer `i-have-adhd-main` to iteration 3
per the strategy's ordering.
