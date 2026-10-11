# Iteration 6: Q4 — Should the Per-Doc Version Exist at All?

## Focus

Q4: Should the per-doc version exist at all? — the strategy's Next Focus [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:267] and the dispatch focus. This is the retention-level question behind the topic's final clause. Bounded by iteration 5's recommendation: measure the flagged fleet first (W-only vs anchor drift) and weigh the era tag's reader value against the field's maintenance cost before proposing anything [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-005.md:80]. The answer states its own decision criterion instead of assuming Q2's still-undefined "external author".

## Actions Taken

1. Read state: `deep-research-config.json`, `deep-research-strategy.md`, the 6-line state-log projection (5 iteration records + the iteration-6 start sentinel), `iterations/iteration-005.md` and `iterations/iteration-001.md`; confirmed `iterations/iteration-006.md` and `deltas/iter-006.jsonl` absent (boundary check).
2. Read the versioning standard end to end and the engine's compute/verify/gate paths (`.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:230-438`) to pin the field's stated purpose, the in-scope classes, the gate's presence semantics, and the verify mismatch reasons.
3. Ran iteration 5's recommended measurement — dry-run `verify --skill <name>` for sk-code, sk-doc and system-skill-advisor, classifying every mismatch line into era drift (stored `X.Y` differs from the current anchor), W-only drift (`X.Y` and `Z` equal, build differs), other, and Z-residue (stored `Z` not 0). Result: **sk-code 332** = 306 era + 23 W-only + 3 other (3 Z-residue); **sk-doc 266** = 153 era + 111 W-only + 2 other (3 Z-residue); **system-skill-advisor 115** = 115 era + 0 + 0 (2 Z-residue). **Total 713 = 574 era (80.5%) + 134 W-only (18.8%) + 5 other**; 8 files carry a stale nonzero Z. `verify` reads only; this action wrote nothing.
4. Searched for consumers of a stored doc version: enumerated non-markdown code touching frontmatter in sk-doc (`rg -ln "frontmatter" .skilled/skills/sk-doc`), grep'd `version` across `.skilled/skills/sk-doc/scripts` and `.skilled/skills/system-skill-advisor/runtime/scripts`, and located the validator pair `shared/scripts/quick_validate.py` / `sk-create-skill/scripts/package_skill.py`. Result: no code reads a child doc's stored version value beyond the engine itself; other hits are `schema_version` (graph/DB), CLI `--version`, fixtures and routing keywords.
5. Read the template contract rows a field removal would have to change (`.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:57`, `:124-135`, `:193`).
6. Recorded the iteration through the append gateway (Step 8) and wrote the delta file (Step 9). Skipped `research/research.md`: progressive synthesis is enabled, but the strategy declares that file workflow-owned [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:297] and this dispatch's allowed-write list contains only the iteration narrative and the delta file; synthesis stays with the workflow.

## Findings

1. **The measured drift is dominated by the era segment, not by W.** All 713 `verify` mismatches today classify as 574 era drift (stored `X.Y` differs from the owning skill's current anchor; 80.5%), 134 W-only drift (18.8%), 5 other, and 8 files carrying a stale nonzero Z — see Actions §3 for the per-skill split. Verify's reasons are exactly these value inequalities [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:327-339]; the derivation makes `X.Y` a function of the anchor and `W` a function of git history [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:79-86]. [INFERENCE: counts from the iteration-6 dry-run `verify --skill` classification recorded in Actions §3.] This refines iteration 5's frame [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-005.md:18]: W is the segment that *must* drift on every commit, but era is the segment that *has* drifted most in practice — so the field cannot be defended as "only the noisy build count is stale".

2. **No in-repo consumer reads a child document's stored version.** The bounded consumer search (Actions §4, plus the Q5 inventory that iterations 2-4 closed [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-004.md:21-29]) shows the only equality consumer is `verify` itself, which has no caller [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136]; the only enforced assertions are presence and four-part format [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:397-410]; the validators require the field for skills, i.e. `SKILL.md` [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:166-167]. [INFERENCE: consumer-search surfaces and result, Actions §4.] A field whose only reader is the checker that always fails is not carrying information to anyone else.

3. **The field's stated purpose is an era stamp, and the era is redundant inside its own tree.** `Y` "ties the doc to its skill-version era" and is inherited from the anchor [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:79-86]; a child doc lives under the skill whose `SKILL.md`/changelog defines that era [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:61-66], so a consumer browsing the tree already has the era without the field. The standard itself documents that duplicated version state drifts without tooling — a hub's five artifacts may state five different values and every gate still passes [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:170-172]. [INFERENCE: an extracted single-doc consumer is the only scenario where the stamp adds information, and no such consumer is defined (Q2's open definition).]

4. **Two of the four segments assert nothing durable per doc.** `Z` is "Reserved for future granular per-doc bumps; seeded 0" with no producer or consumer [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:50] [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:84]; `W` is repository git history the engine counts per file [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:88-96] [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:70-101]. [INFERENCE: half of the 4-part shape encodes nothing a reader outside the repository can use.]

5. **The cost is structural, and the "enforcement active" rollout did not reduce it.** Anchor bumps stale every child's `X.Y` [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:61-73]; each content commit stales `W` and convergence needs per-doc discipline [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:98-121]; no automated surface reconciles stored against derived [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:127-136]; the rollout states presence/format requirements only [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:162-168]. Measured result: 574 of 713 flags are era staleness — the field's meaningful segment is stale across 80.5% of flagged docs. [INFERENCE: counts, Actions §3.]

6. **Q4 answer: the per-doc version should not exist as an asserted per-doc invariant.** Keep `version` on `SKILL.md` as the anchor of record — it is already load-bearing and required there [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:61-66] [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:166-167]; remove it from child doc classes, or at most retain an era-only child stamp. Decision shapes with costs:
   - **(a) Remove the field from child doc classes** (README, references, assets, feature catalogs, playbooks): deletes an unearned attribute; the enforced contract (presence + format) then applies to `SKILL.md` alone and stays green by construction [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:397-414]. Cost: one-time deletion across the flagged fleet plus the template rows that require the field per class [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:135] [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:193].
   - **(b) Keep an era-only child stamp** (iteration 5's smallest meaningful layer): keeps the era; costs an anchor-bump mint on every child doc and would flag 574 docs today — going green would require the fleet sweep the standard explicitly discourages [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136].
   - **(c) Status quo asserted 4-part:** rejected, non-convergent [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:98-104].
   The reversal condition is explicit: a defined consumer that needs a doc's era after it leaves the skill tree. Prevent-overengineering move: delete the unearned stored attribute (a) rather than instrument its upkeep (b) — no new generator, CI job, or reconciliation loop.

## Ruled Out

- **Status-quo retention of the asserted 4-part per-doc version:** non-convergent by construction — writing `W` changes `W` [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:98-104] — and measured today at 713 mismatches, 80.5% era staleness (Actions §3).
- **Enforced per-doc era parity:** would flag 574 docs today; going green requires the fleet-wide sweep the standard explicitly discourages [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136].

## Dead Ends

- None of iterations 1-5's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:120-212].
- New elimination candidate for the reducer: **"Retain the per-doc field asserting era parity"** — its measured cost equals the discouraged reconciliation [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136].

## Edge Cases

- Ambiguous input: none new — dispatch, strategy Next Focus and the state summary all name Q4 (unlike iteration 5's Q5/Q3 conflict).
- Contradictory evidence: none; one refinement. Iteration 5 framed `W` as the only drift-prone segment [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-005.md:18]; the measurement refines this — `W` is the segment that must drift on every commit, but era drift is the majority of actual flags (574/713). Both statements are recorded; the refinement sharpens rather than contradicts.
- Missing dependencies: Q2's definition of "external author" remains undefined in-repo; Q4's criterion is therefore stated directly (per-doc era identification outside the skill tree). Residual detail for the fix phase: this iteration did not establish `quick_validate.py`/`package_skill.py` behavior for an absent version on a non-`SKILL.md` doc; the standard states the requirement for skills [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:166-167].
- Partial success: none; all actions completed without retries.

## Questions Answered

- Q4: Should the per-doc version exist at all? — **answered: no as an asserted per-doc invariant.** Keep `version` on `SKILL.md` (anchor of record; validators require it [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:61-66] [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:166-167]); remove it from child doc classes, or at most retain an era-only stamp. The only scenario that reverses this is a defined requirement for per-doc era identification outside the skill tree — no in-repo consumer does that (Actions §4), and the era is redundant while the doc stays in its tree [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:79-86] [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:170-172]. Prevent-overengineering move: delete the unearned attribute rather than instrument its upkeep (Finding 6).

## Questions Remaining

- Q2: What should doc versions mean for an external author? (partial: the era-only reading is recorded; the definition of "external author" is still outstanding)

## Sources Consulted

- `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` (full read)
- `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` (lines 230-438)
- `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` (version rows: 57, 124-135, 193)
- `.skilled/skills/sk-doc/shared/scripts/quick_validate.py`; `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` (located; contract cited from the standard §7)
- `specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-005.md`; `iteration-001.md`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md`
- Command outputs: iteration-6 dry-run classification of `verify --skill` for sk-code/sk-doc/system-skill-advisor (counts in Actions §3, Finding 1)

## Assessment

- New information ratio: 0.85 — (3 fully new + 0.5 × 3 partially new) / 6 = 0.75, plus the +0.10 simplicity bonus for collapsing the retention question to one criterion and closing Q4. Fully new: measured drift classification, consumer negative, Q4 retention decision. Partially new: era redundancy, dead capacity, structural cost.
- Questions addressed: Q4
- Questions answered: Q4

## Reflection

- What worked and why: measuring before arguing. Iteration 5 predicted the field was "noisy"; running the classification converted that into a distribution — the era segment, not `W`, is the dominant stale component (574/713) — which flips the intuitive defense of the field ("keep the era, drop the build") into its strongest cost argument. Enumerating code that touches frontmatter at all before reading any of it also kept the consumer search bounded and falsifiable.
- What did not work and why: the first classification attempt was lost to an awk regex error (unescaped `(` in a split pattern) and had to be re-run; the verify pass is slow enough that this wasted a material slice of the iteration. Pre-testing the parser on one captured line would have avoided it.
- What I would do differently: for Q2 (the last open question), bring a concrete consumer-side artifact — e.g. the skill-graph indexer or the surface a package consumer actually sees — rather than searching the repo again for the term "external author"; Q2's remaining gap is a definition, so the evidence should be a named artifact that would display or transport a version.

## Recommended Next Focus

Q2: What should doc versions mean for an external author? Remaining gap is a definition, not repo evidence. Suggested: enumerate consumer-visible surfaces (skill-graph metadata, packaged skill artifacts, changelog) and decide which single artifact a version should travel with; Q4's reversal condition (per-doc era identification outside the skill tree) is the only scenario that would reverse this iteration's retention answer. If Q2 stays blocked, consolidate Q1-Q4 decision inputs into a recommendation list for the packet's fix phase.

## SCOPE VIOLATIONS

None. All writes stayed inside the allowed paths (`iterations/iteration-006.md`, `deltas/iter-006.jsonl`, and the gateway's own writes via a temp event file); every researched file was read-only; no banned operation ran.
