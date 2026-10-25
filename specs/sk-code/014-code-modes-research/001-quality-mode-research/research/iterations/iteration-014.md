# Iteration 14: Second-model re-check 4 of 5 — routing replay for ranks 8 and 12

## Focus

Re-check on current disk the two ranked rows whose evidence was documentary only, and open question 4, by running the one instrument the first pass never ran: a compiled-route replay. The prior iteration named this as the next step because "a compiled-route replay for the `yagni` claim" is the only thing "no amount of reading will settle" [SOURCE: research/iterations/iteration-013.md:126] `which no amount of reading will settle`.

Three prompts were replayed against the hub: a lint quality-gate request naming a `.skilled/` file (rank 8's first leg), "simplify this, yagni" (rank 12 and open question 4), and a request to fix a GitHub Actions workflow (rank 8's second leg). The restraint words in stage one's `hub-router.json` were then compared with the CODE_QUALITY keywords in `ROUTER.md`.

This iteration answers no new strategy key question. All five were already ticked. It settles, partially, one of the ten open questions in the synthesis.

**Citation discipline.** Only lines this iteration opened are tagged as file sources. Two facts about files it did not open — the hub's selection contract and the authoring reference's definition of a surface packet — are attributed to the synthesis line that reports them, not to the underlying file.

## Actions Taken

1. Read the synthesis, its ranked rows 8 and 12, its divergence frontier and its open-questions section [SOURCE: research/research.md:202] `a routing canary that replays one real quality request each` [SOURCE: research/research.md:206] `State the restraint step in quality and add the restraint words to the stage-two CODE_QUALITY keywords` [SOURCE: research/research.md:280] `UNKNOWN until a compiled-route replay runs`.
2. Read the prior iteration's recommended next focus and its two surviving scope limits.
3. Ran `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "<prompt>"` three times, once per prompt, capturing stdout and the exit code of each run.
4. Searched `hub-router.json` and `ROUTER.md` together for `yagni`, `restraint`, `"keywords"` and `"classes"`, so the two stages' word lists could be compared in one pass.

## Verdict Summary

| # | Claim under test | Verdict | Basis |
|---|---|---|---|
| 1 | Rank 8, leg A: a quality request naming a `.skilled/` target reaches quality | **CONFIRMED** | The replay returns one `surface-router` target, `sk-code-quality`, exit 0 |
| 2 | Rank 8, leg B: a `.github/workflows/` request reaches the CI surface | **CONFIRMED, and narrower than the row assumes** | The replay returns `sk-code-ci` alone, as an `evidence-base` surface with no workflow-mode primary |
| 3 | Rank 8, leg C: a user-surface fixture | **NOT TESTED** | No user-surface fixture exists in the hub; building one is what the row proposes |
| 4 | Rank 12, stage-one half: restraint words route to quality | **CONFIRMED** | "simplify this, yagni" selects `sk-code-quality`, and the class list carries `quality-restraint` |
| 5 | Rank 12, stage-two half: the machine keyword map lacks restraint words | **CONFIRMED as written; runtime stage-two match NOT TESTED** | The CODE_QUALITY keyword list holds six words, none of them restraint words; `compiled-route` reports no stage-two field |
| 6 | Synthesis: "the two routing stages disagree about restraint words" | **CONFIRMED, with a precision note** | Stage one and `ROUTER.md`'s machine map disagree; `ROUTER.md`'s own prose table agrees with stage one |
| 7 | Synthesis method note: no routing replay was ever run | **REFUTED for the current record** | True when written; a replay has now run, so the sentence is stale as a statement about the packet |
| 8 | Open question 4: does a restraint prompt reach a stage-two intent | **Half CONFIRMED, half NOT TESTED** | Stage one is confirmed by replay; stage two is unobservable through `compiled-route` and remains UNKNOWN at runtime |

## Findings

### Rank 8 — the replay instrument works, and two of its three legs pass

**OBSERVED — a quality request naming a `.skilled/` file selects quality, once, with no surface bundle.** Command output, `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on .skilled/skills/sk-code/sk-code-quality/SKILL.md, lint check"`, exit 0:

```json
{"hubId":"sk-code","action":"route","selectionKind":"single","targets":[{"backendKind":"surface-router","packetId":"sk-code-quality","packetKind":"workflow","skillId":"sk-code","workflowMode":"sk-code-quality"}],"effectivePolicyHash":"1725e25252d5e3182b64a53aeaf200059e614fadf842e0780eb97049c43f3d15","generation":2}
```

The target is a workflow packet, not a surface, even though the named file sits inside a surface's own tree. **DERIVED:** a prompt that names a `.skilled/` path and asks for a quality action is decided by the intent words, not by stack detection on the path. That is the behaviour rank 8's canary would pin, and it is the first runtime evidence for it in this run.

**OBSERVED — a CI-workflow request selects the CI surface alone, as read-only evidence.** Command output, same tool, prompt `"fix the GitHub Actions workflow"`, exit 0:

```json
{"hubId":"sk-code","action":"route","selectionKind":"single","targets":[{"backendKind":"evidence-base","packetId":"sk-code-ci","packetKind":"surface","skillId":"sk-code","workflowMode":"sk-code-ci"}],"effectivePolicyHash":"1725e25252d5e3182b64a53aeaf200059e614fadf842e0780eb97049c43f3d15","generation":2}
```

**DERIVED — this is the sharpest new fact of the iteration.** The prompt asks to *fix* a workflow, and the router returns a single target whose `packetKind` is `surface` and whose `backendKind` is `evidence-base`. The synthesis records that a surface packet is read-only reference material [SOURCE: research/research.md:168] `It is read-only reference material for a domain, stack, platform, or runtime.` So a request that must change a file resolves to the one packet kind that cannot change it, with no workflow mode beside it. The hub's stated selection contract is one workflow primary plus optional surface evidence [SOURCE: research/research.md:248] `one workflow mode primary plus zero-or-more surface packets as read-only evidence`. The replay's output satisfies neither half: no primary, one surface. This is the integration gap rank 3 describes, now observed at runtime rather than inferred from prose, and the synthesis already noted that the hub adds the CI surface from prompt words alone [SOURCE: research/research.md:147] `the hub adds the CI surface from prompt words alone`. **Scope limit:** one prompt, no path, and stage two was not exercised. Whether the CI packet carries enough procedural guidance to act as a workflow is a reading question for the next pass, not a fact this iteration established.

**NOT TESTED — the user-surface leg.** Rank 8 calls for a user-surface fixture. None exists, and constructing one would be a write outside this iteration's authority.

### Rank 12 — the disagreement is real, and it is narrower than "two stages"

**OBSERVED — stage one gives restraint words their own class and their own keyword list.** [SOURCE: .skilled/skills/sk-code/hub-router.json:23] `"classes": ["quality-aliases", "quality-gates", "quality-restraint"],` [SOURCE: .skilled/skills/sk-code/hub-router.json:53] `"keywords": ["yagni", "simplest solution", "simplify", "simplification", "over-engineering", "over-engineered", "overengineering", "overengineered", "over-engineering check", "bloat", "bloated", "unnecessary abstraction"]`

**OBSERVED — the replay confirms that class fires.** The `"simplify this, yagni"` run returns the same single `sk-code-quality` target as the lint run, with the same policy hash and generation, exit 0. **DERIVED:** stage one's restraint class is load-bearing, not vestigial. If it were removed the prompt would have no quality signal left, because none of the six words in stage two's CODE_QUALITY list appear in it.

**OBSERVED — stage two's machine map carries none of those words.** [SOURCE: .skilled/skills/sk-code/ROUTER.md:243] `"CODE_QUALITY":       {"weight": 1, "keywords": ["lint", "format", "quality gate", "naming", "standards", "code smell"]},`

**OBSERVED — but `ROUTER.md`'s prose table does carry them, and more of them than the synthesis quoted.** [SOURCE: .skilled/skills/sk-code/ROUTER.md:54] `| CODE_QUALITY | `lint`, `format`, `quality gate`, `p0`, `p1`, `style`, `naming`, `standards`, `restraint`, `yagni`, `simplify`, `simplification`, `over-engineering`, `bloat` |`

**DERIVED — the precision note.** "The two routing stages disagree" is true only if stage two means its machine map. Inside `ROUTER.md` the prose row and the keyword row disagree with each other: eleven terms in the prose row, six in the keyword row, and the restraint terms exist only in the prose. The synthesis sentence already says this correctly, and its own wording is the narrow one [SOURCE: research/research.md:155] `but the machine map does not`. **The defect rank 12 names is therefore a self-inconsistency inside one file as much as a cross-stage mismatch**, which changes the fix: adding the words to `ROUTER.md:243` still leaves the file's two lists out of step unless the prose row is treated as the source of truth.

### Open question 4 — stage one answered, stage two still UNKNOWN at runtime

**OBSERVED — `compiled-route` reports stage one only.** Every output carries `backendKind`, `packetId`, `packetKind`, `workflowMode`, an `effectivePolicyHash` and a `generation`, and no intent, keyword-match, resource or leaf field. **DERIVED:** the tool can confirm which workflow mode wins, and cannot confirm which stage-two intent or resource loads. Open question 4's second half therefore stays UNKNOWN at runtime; the keyword comparison above is the strongest available evidence against a stage-two match, and it is documentary.

**INFERRED — a stage-two replay needs a different instrument.** Either `ROUTER.md`'s intent matcher run directly, or the advisor replay the authoring reference pairs with the compiled route, which rank 8 already names as the proof shape [SOURCE: research/research.md:202] `a routing canary that replays one real quality request each`. Naming that instrument is the next step for rank 12, not another reading pass.

### One stale sentence in the synthesis

**OBSERVED — the synthesis states that no replay ran.** [SOURCE: research/research.md:35] `Neither the run nor the synthesis executed a checker, a test, a benchmark or a routing replay`. That was accurate for the first pass. **DERIVED:** after this iteration the packet contains replay output, so the sentence now understates the packet's evidence and should be amended when the synthesis is next rewritten. The divergence frontier already anticipated the gap [SOURCE: research/research.md:270] `What a compiled-route replay loads for a quality prompt` — that frontier item is now half closed.

## Questions Answered

None of the five strategy key questions is newly answered; all five were already ticked. This is a verification pass over claims.

Open question 4 of the synthesis moves from UNKNOWN to half-settled: stage one CONFIRMED, stage two NOT TESTED at runtime.

## Questions Remaining

- Does a stage-two intent match a `yagni` or `simplify` prompt, and which instrument can observe it? The keyword comparison says no; no runtime replay has shown it. (open question 4, stage-two half)
- What does the CI surface do once selected alone? Whether its packet carries procedural guidance that lets an agent fix a workflow, or only reference material, is unread. (new, from the rank 8 leg-B replay)
- Which of `ROUTER.md`'s two CODE_QUALITY lists is authoritative — the prose row at line 54 or the keyword row at line 243? Rank 12's fix depends on the answer.
- Where should the boundary between the quality and review checklists sit? Carried from iterations 5 and 11; untouched here.
- Should the house-style P0 items stay P0 for this repository's own `.js` files? The operator's decision, and rank 1 waits on it.
- Which manifest name and merge rule should a repository without a surface packet use? The operator's decision, and rank 10 waits on it.
- Who consumes the `code-quality/v1` schema id outside this repository? Narrowed in iteration 13; unchanged here.

## Edge Cases

- **Ambiguous input:** none. The focus named the three prompts and the two word lists.
- **Contradictory evidence:** one, between the synthesis's method note and this iteration's evidence. The note says no replay ran; a replay has now run. Recorded as a finding rather than resolved by editing the synthesis, which is outside this iteration's write scope.
- **Missing dependencies:** none. `compiled-route.cjs` exists, exits 0 on all three prompts, and returns a stable `effectivePolicyHash` across them.
- **Partial success:** rank 8's three legs split two tested, one not. Status `complete` is still the honest choice because every claim in scope reached a verdict and the one untested leg is untested by design, not by tool failure.

## Sources Consulted

- `.skilled/bin/compiled-route.cjs` (three invocations, exit 0 each)
- `.skilled/skills/sk-code/hub-router.json:23`, `:53`
- `.skilled/skills/sk-code/ROUTER.md:54`, `:243`
- `research/research.md:35`, `:147`, `:155`, `:168`, `:202`, `:206`, `:248`, `:270`, `:280`
- `research/iterations/iteration-013.md:126`

## Assessment

- New information ratio: 0.55. Three claims were tested at runtime for the first time in the whole run, and one of them produced a fact no iteration had: a workflow-editing prompt resolves to a lone read-only surface. The restraint comparison is confirmatory, and one leg of rank 8 was untested by design.
- Questions addressed: rank 8 (two of three legs), rank 12 (both halves), open question 4 (stage-one half).
- Questions answered: none of the strategy key questions; all were already ticked.

## Reflection

- **What worked and why:** running the instrument instead of reading around it. Every prior iteration had reasoned that a replay was needed; one command turned three documentary claims into observations and surfaced a selection shape — a single `evidence-base` surface — that no document states and that contradicts the hub's stated contract shape.
- **What did not work and why:** the first read of the synthesis was truncated at the ranked table, so the open-questions section had to be read in a second pass. Reading the tail first would have named open question 4 before the replay, and the prompts could have been shaped to test it more directly.
- **What I would do differently:** run the three prompts before reading the synthesis's claim list, so the prompts are designed from the questions rather than retrofitted to them.

## Recommended Next Focus

Second-model re-check 5 of 5: the last untested runtime leg — a stage-two intent replay, using whichever instrument `ROUTER.md`'s matcher exposes, on the same `yagni` prompt. If no such instrument exists, that absence is itself the finding, and rank 12's fix should ship with one. In parallel, read `sk-code-ci/SKILL.md` to answer whether a lone CI surface selection can act on a workflow, which decides whether the rank 8 leg-B observation is a defect or a design.
