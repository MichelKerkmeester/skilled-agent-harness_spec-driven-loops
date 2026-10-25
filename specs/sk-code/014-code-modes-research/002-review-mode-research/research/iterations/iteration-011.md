# Iteration 011 — Second-Model Re-Check 1 of 5: Hub Routing After the Surface Change

## Focus

Re-check two prior claims against current disk, not against the prior model's summary:

- **I-6** (research synthesis): a review request naming only a workflow path did not bundle the CI surface, while a request naming "GitHub Actions workflow" did. The prior model marked the claim time-bound and asked for a replay after the CI wiring landed.
- **Rank 12**: replay a path-only workflow review request through both routing stages and add a path keyword or rule if CI still does not bundle.
- **I-5**: the review report template allows only `[SKILLED | UNKNOWN]`, while the hub prose says it has exactly two surfaces.

Trigger for the re-check: `git log --oneline -4 -- .skilled/skills/sk-code` shows four commits, including `0781e81da2 fix(sk-code): align the hub docs and routing with its current surfaces`, `028bd0f5cd feat(sk-code): add the read-only CI surface to the sk-code hub`, and `e3beac65f4 refactor(sk-code): remove the Webflow and Obsidian surfaces from the hub`. The probe that produced I-6 predates these commits.

## Actions Taken

1. Read `.skilled/agents/deep-research.md` once as the agent definition, then ran the hub commit history above.
2. Grepped `research/research.md` for I-5, I-6 and rank 12 to capture the exact prior wording rather than a paraphrase.
3. Ran `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt ...` twice: once with `review .github/workflows/ci.yml`, once with `review this GitHub Actions workflow`.
4. Grepped the hub packet for the surface-count sentence, the review report template, the fixtures, and the README claim.
5. Read the CI packet trigger section and the router's CI alias block to locate the mechanism behind the replay result.
6. Grepped the strategy's key-question lines: all ten are already marked `[x]`, so this iteration answers no new key question.
7. Read `deltas/iter-010.jsonl` to match the established delta record shape.

## Findings

### F1 — OBSERVED: the path-only workflow prompt still routes without the CI surface

The replay on current disk reproduces the asymmetry:

```text
review .github/workflows/ci.yml
  selectionKind: "single"
  targets: [sk-code-review]

review this GitHub Actions workflow
  selectionKind: "surfaceBundle"
  targets: [sk-code-review, sk-code-ci]
```

The first output contains no `sk-code-ci` packet. The second bundles it. This is the same behavior iteration 7 observed, now re-observed after `0781e81da2` and `028bd0f5cd`. The router's CI aliases are phrase-based only: `"github actions workflow", "ci workflow", "github actions yaml", ...` [SOURCE: .skilled/skills/sk-code/hub-router.json:77] `"github actions workflow", "ci workflow", "github actions yaml"`. No alias is a path token such as `.github/workflows/`.

### F2 — DERIVED: the miss is structural, not a stale probe

The CI packet says a review of a workflow file is in scope by path: `- The task adds, edits or reviews a file under `.github/workflows/`, `.github/actions/` or `.github/scripts/`.` [SOURCE: .skilled/skills/sk-code/sk-code-ci/SKILL.md:22] `The task adds, edits or reviews a file under`. The router's CI alias block is a separate keyed list of phrases [SOURCE: .skilled/skills/sk-code/hub-router.json:76] `"code-ci-aliases"`, and that list contains no path pattern [SOURCE: .skilled/skills/sk-code/hub-router.json:77] `"github actions workflow", "ci workflow"`. A path-only prompt therefore cannot match the CI alias block unless some other rule maps paths into it. The replay shows no such rule is active. The packet contract and the router vocabulary disagree, and the disagreement survived the routing-alignment commit.

The hub changelog confirms the intended positive case is also phrase-based: `"review the github actions workflow yaml" resolves to `[sk-code-review, sk-code-ci]`` [SOURCE: .skilled/skills/sk-code/changelog/v2.4.0.0.md:24] `"review the github actions workflow yaml" resolves to`. The canary covers a named workflow, not a path-only review, which is why the gap was not caught.

### F3 — OBSERVED: I-5's two anchors are still present, and the CI surface makes the gap concrete

The review report template still offers exactly two values: `**Surface evidence used**: [SKILLED | UNKNOWN]` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:350] `**Surface evidence used**: [SKILLED | UNKNOWN]`. The hub prose still says `The hub has exactly two surfaces` [SOURCE: .skilled/skills/sk-code/SKILL.md:39] `The hub has exactly two surfaces`, but the two are now SKILLED and CI [SOURCE: .skilled/skills/sk-code/SKILL.md:36] `GitHub Actions evidence`. A review that loads CI evidence has no truthful value to report: `SKILLED` is false and `UNKNOWN` discards the evidence it actually used. The fixture reports likewise carry only `UNKNOWN` [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/review-output-fixture/list-shape-valid.md:6] `**Surface evidence used**: UNKNOWN`.

The prior model's parenthetical "the hub now has a second surface (CI) and lets a user add more" is only partly re-tested. The CI half is CONFIRMED; the "lets a user add more" half is NOT TESTED in this iteration because no user-surface registration path was replayed.

### F4 — DERIVED: rank 12's verification gate is now closed, so its conditional action is live

Rank 12 said: replay after the CI wiring lands, and add a path keyword or rule if CI still does not bundle. The replay has now been run post-change and CI still does not bundle for a path-only request. The "Decision (verify first)" gate is therefore resolved; the remaining action is implementation, not further verification. The compiled router already distinguishes `single` from `surfaceBundle`, so a path-aware alias or pre-rule can reuse the existing selection kind rather than adding a new one. The fix belongs in the router vocabulary (`hub-router.json` CI aliases and the corresponding `ROUTER.md` map), not in the review packet.

### F5 — NOT TESTED: the second routing stage was not independently exercised

Only the compiled routing stage was replayed. The `ROUTER.md` prose map was read for context but not driven with either prompt, so whether that stage independently corrects the path-only miss is UNKNOWN. The compiled output is the bundle decision observed here; a prose-stage correction would have to happen after it, and no evidence of one was gathered.

## Re-Check Verdicts

| Prior claim | Verdict | Basis |
| --- | --- | --- |
| I-5: report template allows only `[SKILLED \| UNKNOWN]` | **CONFIRMED** | Template unchanged at `sk-code-review/SKILL.md:350`; fixtures still use `UNKNOWN`. |
| I-5: hub says it has exactly two surfaces | **CONFIRMED** | `sk-code/SKILL.md:39`; the pair is now SKILLED + CI. |
| I-5: hub "lets a user add more" surfaces | **NOT TESTED** | No user-surface registration path replayed. |
| I-6: path-only workflow review did not bundle CI | **CONFIRMED** | Replay returns `single` / `[sk-code-review]`; no `sk-code-ci`. |
| I-6: named "GitHub Actions workflow" bundled CI | **CONFIRMED** | Replay returns `surfaceBundle` / `[sk-code-review, sk-code-ci]`. |
| I-6: this conflicts with the CI packet's own trigger | **CONFIRMED** | Packet trigger is path-based at `sk-code-ci/SKILL.md:22`; aliases are phrase-only at `hub-router.json:77`. |
| I-6: router changed after the probe, so replay was needed | **CONFIRMED** | Four hub commits predate this replay; behavior survived them. |
| Rank 12: add a path keyword or rule if CI still does not bundle | **CONFIRMED as still needed** | Replay performed; CI still absent; conditional action now live. |
| Prior surface set included Webflow/Obsidian | **SUPERSEDED** | `e3beac65f4` removed both; hub prose now counts SKILLED + CI. Any finding that treats Webflow/Obsidian as live is stale. |

## Questions Answered

None. The strategy already marks all ten key questions `[x]`; this iteration verifies prior findings and closes rank 12's verification gate rather than answering a new key question.

## Questions Remaining

- Does the `ROUTER.md` prose stage independently bundle CI for a path-only workflow prompt? **UNKNOWN** (F5).
- Does the live review runtime load a repository-owned policy file? **UNKNOWN** (carried from iteration 10).
- Can a real user-authored surface mode route into review and exchange evidence or findings? **UNKNOWN** (carried from iteration 9).
- Would replacing the two-value surface label (rank 7) break the report-format consumers named in I-7? **Open**; not re-tested here.
- The dispatch context still carries Q2–Q9 as open while the strategy marks them answered. That reducer/dispatch state discrepancy remains untouched by this iteration.

## Next Focus

Second-model re-check 2 of 5. Highest-value targets: I-7 (status-line and `CODE-REVIEW` consumers, which rank 7 would touch) and I-3 (the quality-gate advisory envelope). Pair that with a `ROUTER.md` stage replay for the path-only prompt so F5's UNKNOWN closes. If the dispatcher prefers to keep the re-check narrow, the single smallest next evidence is one path-only prompt driven through the prose stage and a comparison of its bundle with the compiled result above.

## Reflection

The prior model was right to mark I-6 time-bound rather than false. The behavior it saw before the CI wiring is the same behavior after it, because the wiring added phrase aliases and documentation, not a path rule. The causal chain is: the CI packet's scope is expressed as a path predicate, the router's scope is expressed as a phrase vocabulary, and the two vocabularies were never bridged. The changelog's canary uses the phrase form, so the test suite could not see the path form. I-5 survived for a different reason: the hub prose was updated to the new two-surface pair, but the review output contract was outside that change's scope. Both survivors point to the same integration weakness — the hub's routing and reporting contracts are maintained separately from the packets whose evidence they carry.

**newInfoRatio: 0.30.** The replay confirms rather than discovers. The new content is the alias-vs-trigger mechanism (F2), the closure of rank 12's decision gate (F4), and the explicit NOT TESTED boundary on the prose stage (F5).
