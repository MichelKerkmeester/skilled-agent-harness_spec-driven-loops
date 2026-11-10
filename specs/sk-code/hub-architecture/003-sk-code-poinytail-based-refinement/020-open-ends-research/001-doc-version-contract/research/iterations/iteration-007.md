# Iteration 7: Q2 — What Should Doc Versions Mean for an External Author?

## Focus

Q2: What should doc versions mean for an external author? — the strategy's Next Focus and the last open key question [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:296] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:64]. The gap carried from iterations 5-6 is a definition: no in-repo source defines "external author" (iteration 5's negative search), and iteration 6 recommended answering Q2 by enumerating consumer-visible surfaces rather than re-searching the term [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-006.md:79]. This iteration takes that path: it operationalizes external author as the recipient of the packaged skill artifact — the one surface that leaves this repository without its git history — and reads the version semantics from that vantage. Chosen interpretation: external author = a party who receives `{skill}.zip` or the docs inside it without this repository's history; deferred alternative: a party holding a single extracted doc without its anchor files (this becomes Q2's reversal condition, Finding 7).

## Actions Taken

1. Read state: `deep-research-config.json`, `deep-research-strategy.md`, the state-log projection (6 iteration records + the iteration-7 start sentinel), `iterations/iteration-006.md`, `iterations/iteration-005.md` and `findings-registry.json`; confirmed `iterations/iteration-007.md` and `deltas/iter-007.jsonl` absent (boundary check).
2. Enumerated the distribution surface: read `package_skill.py` around the zip walk, the versioned-doc scope, the version checks, and the strict/advisory partition.
3. Enumerated the two other candidate consumer surfaces per iteration 6's recommendation: the advisor's harvested `skill-graph.json` and the `changelog/v*.md` convention; verified changelog frontmatter coverage (19/19 sk-doc entries carry `version`).
4. Recorded the iteration through the append gateway (Step 8) and wrote the delta file (Step 9). Skipped `research/research.md`: progressive synthesis is enabled, but the strategy declares that file workflow-owned [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:326] and this dispatch's allowed-write list contains only the iteration narrative and the delta file; synthesis stays with the workflow.

## Findings

1. **The packaged artifact is the concrete external surface: it ships every non-hidden working-tree file — changelog included — and never the git history.** `package_skill.py` zips the skill folder into `{skill_name}.zip` [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:937], walking `skill_path.rglob('*')` and adding every file except hidden paths, `__pycache__`, and bytecode [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:943-957]. The packager's versioned doc-class scope includes the `changelog` subtree [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:128-136], so `changelog/v*.md` entries travel inside the zip — e.g. sk-doc's `v2.3.3.0.md` with its 4-part `version` field [SOURCE: .skilled/skills/sk-doc/changelog/v2.3.3.0.md:1-11]. Git history is not a file, so it does not travel. [INFERENCE: from the rglob walk and zip semantics; the archive carries no manifest or git metadata.] New — first iteration to examine the packager.

2. **Package-time version checking is presence + format only, advisory by default and hard-fail only under strict, and it never consults git.** The packager requires `version` in `REQUIRED_FRONTMATTER_FIELDS` [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:56], checks 4-part `X.Y.Z.W` shape [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:334-339], and its resource-frontmatter pass demands a 4-part version on every versioned doc-class file that has frontmatter — frontmatter-less files are skipped, not failed [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:672-688]. Findings are emitted as warnings because the contract is advisory to stay backward-compatible [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:106-110], and `_partition_strict` promotes exactly the version markers to hard errors under strict mode [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:194-201] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:770-774]. No branch of the packager reads git, so it cannot and does not compare a stored value against a derived one — the same shape as every other automated surface (Q5). Partially new — sharpens iteration 5's segment argument with package-side evidence.

3. **The packager and the engine disagree on scope today: `changelog` is a versioned doc class for the packager but is excluded from the engine's scope.** `VERSIONED_DOC_SUBTREES` includes `references`, `assets`, feature catalogs, playbooks and `changelog` — the comment states the addition is "per the hardening contract" and that `frontmatter-version.mjs` excludes changelog for its own reasons [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:124-136]; the engine's `SCOPE_SUBTREES` is `['references', 'assets', 'feature-catalog', 'manual-testing-playbook']`, with no changelog [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:57]. Two live contracts already treat the same file class differently. New — empirical divergence, recorded for the fix phase.

4. **The era is re-derivable from the package alone; the build count is not.** The anchor resolver that yields `X.Y` reads only the filesystem — SKILL.md frontmatter and the highest `changelog/v*.md` filename, normalized, taking `max` [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:63-65] [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:177-190] — and both artifacts ship in the zip (Finding 1), so an external author can re-derive the era from package contents. `W` counts `git log --follow` numstat hits [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:70-101], which no external party can reproduce without the repository; `Z` is reserved and seeded 0 by design [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:50]. The version tuple splits cleanly from the outside: `X.Y` travels as a derivable fact, `Z` asserts nothing, `W` is dead weight. New — the key synthesis for Q2.

5. **The remaining candidate consumer surface carries no versions at all.** The advisor's harvested `skill-graph.json` holds `schema_version`, `generated_at`, families, adjacency, signals (trigger phrases), conflicts and hub lists — no per-skill or per-doc version data [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json:1]; the advisor's frontmatter guard validates the five-field doc contract, which excludes `version` [SOURCE: .opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh:7-8]. The surface enumeration iteration 6 asked for is now closed: package (versioned, format-checked), changelog (versioned filenames and fields), graph (no versions), hooks/CI (presence/format only, Q5). New.

6. **Q2 answer: for an external author, a doc version can only mean the skill era — and the package already carries it.** The meaningful layer is the skill edition: `SKILL.md`'s version plus the changelog history, the human-curated identity of the release a doc belongs to [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:49] [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:69-70]; the era semantics are exactly what `Y` documents ("ties the doc to its skill-version era") [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:79-86]. A per-doc stored copy adds nothing an external author cannot already derive: `X.Y` is re-derivable from shipped files (Finding 4), `W` is irreproducible, `Z` is reserved. Normative statement: **doc versions are for skill editions; an edition's version carriers are `SKILL.md` and the changelog, which ship together in the package; child docs should not assert an independently checkable version of their own** — consistent with Q4's removal answer (iteration 6) and with iteration 5's era-only stamp as the maximal fallback if a per-doc era marker is ever wanted. Prevent-overengineering move: no new generator or stamp is added; the meaning rides on artifacts that already exist. New — closes Q2.

7. **Reversal condition, stated so the decision stays falsifiable.** If a named external consumer is ever defined that receives a single extracted doc without `SKILL.md`/`changelog` and needs its era, an era-only stamp becomes load-bearing and should be restored on that doc class alone. No such consumer is defined in-repo: iteration 5's term search was negative [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-005.md:29], and the package/changelog/graph surfaces checked here do not read per-doc versions (Findings 4-5). Partially new.

## Ruled Out

- **Re-searching for an in-repo definition of "external author".** Iteration 5's search of sk-doc and system-spec-kit returned no definition [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-005.md:29]; iteration 6 recommended the surface-enumeration path instead [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-006.md:79], and that path closed the question this iteration.
- **An external meaning for `W` or `Z`.** `W` needs repository git history that cannot travel in the package [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:70-101]; `Z` has no producer or consumer by design [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:50].

## Dead Ends

- None of iterations 1-6's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:120-212].
- No new elimination candidate beyond the two above; the divergence in Finding 3 is a fix-phase item, not a dead end.

## Edge Cases

- Ambiguous input: "external author" still has no in-repo definition. Selected interpretation: the recipient of the packaged skill zip, the one surface that leaves the repository. Deferred alternative: a party holding a single extracted doc without anchor files — converted into the explicit reversal condition (Finding 7).
- Contradictory evidence: none new. Finding 3 records a live contract divergence (packager scope vs engine scope) rather than a contradiction to resolve here; the fix phase owns which truth prevails.
- Missing dependencies: none — packager, graph and changelog files were all readable.
- Partial success: none; all actions completed without retries.

## Questions Answered

- Q2: What should doc versions mean for an external author? — **answered: at most the skill era, and the edition's carriers already ship in the package.** For an external author the only reproducible version fact is the skill edition (`SKILL.md` version + changelog history); per-doc `X.Y` is re-derivable from shipped files, `W` is unreproducible without git, `Z` asserts nothing (Findings 4, 6). The per-doc field should therefore not carry an independently checkable version; if a per-doc marker is ever wanted, era-only is the maximal honest layer. Prevent-overengineering move: no new generator — the meaning rides on artifacts that already exist.

## Questions Remaining

- None at the key-question level: Q1-Q5 are all resolved (Q1, Q3-Q5 in earlier iterations [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:63-67], Q4 in iteration 6, Q2 here). Iterations 8-10 remain under the max-iterations stop policy; the productive direction is consolidation, not new questions.

## Sources Consulted

- `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` (lines 56, 106-136, 194-201, 326-339, 630-688, 770-774, 937-957)
- `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` (lines 49-50, 63-70, 79-86)
- `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` (lines 57, 70-101, 177-190)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` (line 1)
- `.opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh` (lines 7-8)
- `.skilled/skills/sk-doc/changelog/v2.3.3.0.md` (lines 1-11; 19/19 sk-doc changelog entries carry `version`)
- `specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-005.md`; `iteration-006.md`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md`; `findings-registry.json`
- Command outputs: zip-walk and version-check reads of `package_skill.py`; changelog frontmatter coverage count; skill-graph top-level key read

## Assessment

- New information ratio: 0.96 — (5 fully new + 0.5 × 2 partially new) / 7 = 0.857, plus the +0.10 simplicity bonus for closing the last open question with one external test (does the artifact ship it, and does it need git?). Fully new: packaged-artifact surface, packager/engine scope divergence, era-reproducibility split, graph negative, Q2 answer. Partially new: package check shape, reversal condition.
- Questions addressed: Q2
- Questions answered: Q2

## Reflection

- What worked and why: treating a definition gap as a pointer to shipping surfaces instead of another lexical search. The packager was the highest-yield artifact available — it answers what actually leaves the repository, and its version checks read as a contract statement, not incidental code. Following iteration 6's recommendation turned a stalled normative question into two checkable facts (what ships; what needs git).
- What did not work and why: nothing failed. One self-inflicted inefficiency: the advisor sweep invoked `rg -r` (replace) by mistake, muting matched terms to `n` in the displayed output; the hits were still legible — the graph JSON printed in full — so no re-run was needed, but the flag mix-up cost a read cycle.
- What I would do differently: when a consumer definition is the gap, start from distribution artifacts (what ships, how, with what manifest) rather than from terminology or indexes; the packager answered in one pass what term searches could not answer in two.

## Recommended Next Focus

Consolidation for the fix phase (iterations 8-10 remain; stopPolicy max-iterations). Assemble Q1-Q5 into a single decision record: (a) remove the per-doc version from child doc classes, keep `SKILL.md` as the anchor of record (Q4); (b) demote `W` out of the asserted contract, keep the git-free gate as the only enforced surface (Q3); (c) name the two live contract divergences the fix must resolve — `changelog` in the packager's versioned scope but not the engine's [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:124-136] [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:57], and the advisory-vs-strict mode of the packager's version check [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:106-110]; (d) carry Q2's reversal condition and the era-only fallback into the contract text.

## SCOPE VIOLATIONS

None. All writes stayed inside the allowed paths (`iterations/iteration-007.md`, `deltas/iter-007.jsonl`, and the gateway's own writes via a temp event file); every researched file was read-only; no banned operation ran.
