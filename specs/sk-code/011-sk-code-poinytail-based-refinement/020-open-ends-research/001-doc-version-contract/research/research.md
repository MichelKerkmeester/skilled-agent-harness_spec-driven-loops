---
title: "Research: why doc-version verify fails everywhere, and the smallest doc-version contract"
description: "Orchestrator-checked synthesis of a ten-iteration deep-research run on frontmatter-version.mjs: verify fails by construction, the per-doc version carries no durable meaning, and the smallest contract that stays green is the version on SKILL.md alone."
trigger_phrases:
  - "doc version contract research"
  - "frontmatter version verify fails everywhere"
  - "per-doc version removal"
  - "skill edition version contract"
importance_tier: "important"
contextType: "research"
---

# Research: why doc-version verify fails everywhere, and the smallest doc-version contract

`frontmatter-version.mjs verify` exits 1 on every skill because the value it checks cannot stay equal to the value it derives. The rule and the derivation both work as written. The per-doc build count `W` changes with every commit that touches a doc, and writing it is itself such a commit. Nothing runs `verify` or reconciles the values, so stale numbers pile up. The one version that stays green without help is the one on `SKILL.md`. It is a pure function of `SKILL.md` and the changelog filenames, and `verify` over all 57 `SKILL.md` files exits 0 today. The recommendation is to keep that version and drop the per-doc version from child docs.

---

## 1. Executive Summary

- **Cause (Q1).** The fault is neither the rule nor the derivation alone. The rule asserts something that cannot stay true: stored `X.Y.Z.W` equal to a value derived partly from git history (`frontmatter-version.mjs:282`, `frontmatter-versioning.md:98`). No automated surface runs `verify` or `apply`, and the only enforced check is git-free presence and format (`frontmatter-version.mjs:397`). The standard already calls the red `verify` the expected reading (`frontmatter-versioning.md:131`).
- **Scale, measured by the orchestrator.** `verify` exits 1 on 14 of 14 skills with 2,795 mismatches over 2,909 in-scope docs. `gate` exits 0 on 14 of 14 with 7 frontmatter-less skips. In the three skills the packet named, 573 of the 710 mismatches (80.7%) are a stale skill era (`X.Y`), 134 are the build count `W` alone and 3 are a stray `Z`.
- **Meaning (Q2).** For an external author a doc version can mean only the skill edition: the `SKILL.md` version plus the changelog, which ship together in the package (`package_skill.py:943`). `X.Y` can be re-derived from shipped files, `W` cannot be reproduced without this repository's git history, and `Z` is reserved and always 0.
- **Smallest green contract (Q3).** Version on `SKILL.md` only, equal to `max(SKILL.md version, highest changelog/v*.md)`. That path never consults git (`frontmatter-version.mjs:278`). It is green today: `verify` over the 57 `SKILL.md` files exits 0, all anchored as `max(fm,changelog)`.
- **Should it exist (Q4).** Not on child docs. Keep it on `SKILL.md`, where validators already require it (`package_skill.py:56`).
- **Automation inventory (Q5).** No hook, generator or workflow writes a doc version. The post-edit hook runs the format-only `gate` (`post-edit-router.cjs:38`). CI's frontmatter guard does not check `version` at all (`check-skill-doc-frontmatter.sh:7`). Nothing calls `verify`.

---

## 2. Scope and Method

The run read the engine `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs`, the standard `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md`, the packager and validators, the post-edit router, the git hooks and the CI workflows, and it executed `gate` and `verify` across the fleet. Research only: no version, doc or script was changed. Writes stayed under this packet.

---

## 3. Run and Verification Provenance

- Workflow: `/deep:research` auto YAML, executed step by step by the sub-orchestrator. Ten iterations, stop policy `max-iterations`, executor `cli-pi`, model `deepseek-v4.1-flash` over the DevPass route (`llmgateway/deepseek-v4.1-flash`, `--thinking max`) for all ten. DevPass reported no usage limit, so the cline-pass fallback was never used.
- Iteration 10's first dispatch wrote no narrative and failed `verify-iteration.cjs` with `iteration_file_missing`. The workflow's single redispatch succeeded.
- Every iteration passed the mechanical `verify-iteration.cjs` gate. The state log holds 10 `"type":"iteration"` records.
- The orchestrator re-ran the load-bearing measurements itself (Section 13) and corrected four executor claims.

---

## 4. Research Questions and Answers

| Question | Answer |
|----------|--------|
| Q1: Why does verify fail: the rule, the derivation, or the fact that nothing enforces it? | All three combine. The derivation is faithful, the rule asserts an equality that every commit breaks, and nothing reconciles or gates it. Exit 1 everywhere is the steady state. |
| Q2: What should doc versions mean for an external author? | The skill edition, carried by `SKILL.md` and the changelog. A per-doc `W` or `Z` means nothing outside this repository. |
| Q3: What is the smallest contract that stays green by construction? | Version on `SKILL.md` only, equal to the max of its own value and the highest changelog filename. Git-free, green today. |
| Q4: Should the per-doc version exist at all? | No, not on child docs. Keep it on `SKILL.md`. |
| Q5: Which hooks, generators or CI steps write or check a doc version today, if any? | Writers: none automated; `apply` is operator-run. Checkers: post-edit `gate` (format), packager and `quick_validate.py` (format, command-run), CI coverage guard (ignores `version`). `verify` has no caller. |

---

## 5. Why Verify Fails (Q1)

1. **`W` is a git-history function, so stored and derived cannot stay equal.** Child docs derive `X.Y.0.W` with `W = min(realEditCount(file), 99)` (`frontmatter-version.mjs:282`), counting commits with a nonzero per-file numstat (`frontmatter-version.mjs:70`). Writing `W` changes the count, so one `apply` pass never converges and the standard prescribes a two-pass apply-and-amend ritual (`frontmatter-versioning.md:98`, `frontmatter-versioning.md:106`).
2. **The era segment drifts more than `W` does.** `X.Y` comes from the skill anchor (`frontmatter-version.mjs:187`). When a skill's changelog advances, every child doc is stale until someone re-runs `apply --update`. Measured over sk-code, sk-doc and system-skill-advisor: 573 of 710 mismatches are era drift.
3. **Templates seed the wrong era at birth.** The reference template hands a new doc a literal `version: 1.7.0.0` (`frontmatter-templates.md:476`), whatever the owning skill's anchor is. Several skills show the pattern at scale, for example stored `1.0.0.0` against derived `0.3.0.x` in sk-vision.
4. **Nothing enforces equality, by design.** `gate` checks presence and four-part format only and never reads git (`frontmatter-version.mjs:397`). The standard names `verify` "a reconciliation tool, not a gate" (`frontmatter-versioning.md:131`) and tells authors not to sweep the fleet to quiet it (`frontmatter-versioning.md:135`).

---

## 6. What a Doc Version Should Mean (Q2)

The packager zips every non-hidden file in the skill folder (`package_skill.py:943`) and never the git history. The changelog travels with it. From the outside:

- `X.Y` can be re-derived from `SKILL.md` and `changelog/v*.md` in the zip (`frontmatter-version.mjs:177`).
- `W` needs `git log --follow` over this repository (`frontmatter-version.mjs:75`), so it cannot be reproduced.
- `Z` is "reserved for future granular per-doc bumps; seeded 0" (`frontmatter-versioning.md:50`) and has no producer or consumer.

So the honest meaning is the skill edition, and its carriers already exist. A per-doc copy adds only a value that goes stale. No in-repo source defines "external author". The run used the recipient of the packaged zip as its working definition.

---

## 7. The Smallest Contract That Stays Green (Q3)

**Contract:** `version` lives on `SKILL.md` only, as a four-part value equal to `max(SKILL.md version, highest changelog/v*.md filename)`.

- The `SKILL.md` branch never calls `realEditCount` (`frontmatter-version.mjs:278`), so no commit can stale it. It goes red only when someone adds a changelog entry above the frontmatter, which is a release event and is the right moment to update it.
- Evidence it holds now: `verify --paths` over the 57 `SKILL.md` files exits 0 and reports `ok=57`. All 57 resolve their anchor as `max(fm,changelog)`.
- Narrowing the in-scope set is enough to change both modes, because `gate` discovers its targets through the same `discoverInScope` (`frontmatter-version.mjs:402`). No separate gate branch edit is needed.

---

## 8. Should the Per-Doc Version Exist (Q4)

No. Its only equality consumer is `verify`, which nothing calls. Its era duplicates what the doc's location already tells a reader. Half of its segments, `Z` and `W`, mean nothing outside the repository. Keep `version` on `SKILL.md`, where `package_skill.py` and `quick_validate.py` require it (`package_skill.py:56`, `quick_validate.py:255`).

**Reversal condition:** if a consumer is ever named that receives a single child doc without its `SKILL.md` and changelog and needs that doc's era, restore an era-only stamp on that doc class alone.

---

## 9. What Writes or Checks a Doc Version Today (Q5)

| Surface | Writes | Checks | Evidence |
|---------|--------|--------|----------|
| `frontmatter-version.mjs apply` | Yes, operator-run | No | `frontmatter-version.mjs:445` |
| Post-edit hook, row 3 | No | Presence and format, per skill | `post-edit-router.cjs:38`, `check-frontmatter-versions.sh:13` |
| `package_skill.py` | No | Presence and format, advisory, hard only under strict | `package_skill.py:672`, `package_skill.py:194` |
| `quick_validate.py` | No | `SKILL.md` presence and format | `quick_validate.py:255` |
| CI `skill-doc-frontmatter.yml` | No | Five fields, not `version` | `check-skill-doc-frontmatter.sh:7` |
| CI `sk-doc-script-tests.yml` | No | Engine fixtures via Python tests only | `run-script-tests.sh:12`, `test_validation_switch.py:183` |
| Git hooks | No | Nothing version-related | no `frontmatter` match in `.opencode/scripts/git-hooks/` |
| `verify` | No | Stored equals derived | no caller anywhere |

The standard says to run the corpus gate "in CI or pre-commit" (`frontmatter-versioning.md:168`). No workflow or git hook does. Only the post-edit hook does.

---

## 10. Packager and Engine Scope Divergence

`package_skill.py` treats `changelog` as a versioned doc class (`package_skill.py:133`), while the engine excludes `changelog` (`frontmatter-version.mjs:52`). Iteration 8 reported all 68 changelog entries in the three named skills carrying a four-part version, so the divergence produces no failure today. Under the recommended contract, changelog entries are the edition record, so the packager's changelog check is the one to keep.

---

## 11. Recommendations

Each row passes `.skilled/repo-rules/prevent-overengineering.md`: it names its move from the reversal-cost order and says what fails at the cheaper move.

| ID | Recommendation | Evidence | Move | Why the cheaper move fails |
|----|----------------|----------|------|----------------------------|
| R1 | Drop the per-doc version from child doc classes and keep `version` on `SKILL.md` only, as the skill edition. Narrow `inScope()` and `classify()` to `SKILL.md`, then delete the stale child `version:` lines in the same commit. | `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:57`, `frontmatter-version.mjs:222`, `frontmatter-version.mjs:282`, `frontmatter-versioning.md:98` | Extend in place | Build nothing fails: `verify` stays red on 14 of 14 skills and 573 of 710 child versions in the three named skills state the wrong era, so the field misleads readers today. Change a value fails: emptying `SCOPE_SUBTREES` at :57 still leaves `README.md` in scope through the branch at :222. |
| R2 | Narrow the packager's `VERSIONED_DOC_SUBTREES` to `changelog` in the same change, so packaging stops demanding a version on child docs. | `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:128`, `package_skill.py:672`, `package_skill.py:200` | Change a value | Build nothing fails: after R1 deletes the child lines, the loop at `package_skill.py:672` warns on every child doc, and strict mode promotes "missing 'version' in frontmatter" to a hard error (`package_skill.py:200`). |
| R3 | Rewrite the standard around the edition contract: delete the child-doc derivation, `W`, `Z` and the two-pass amend ritual; state that `version` means the skill edition; remove the unhonored "Run it in CI or pre-commit" line. | `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:77`, `frontmatter-versioning.md:106`, `frontmatter-versioning.md:168` | Extend in place | Build nothing fails: the standard would keep requiring a version on references, assets, catalogs and playbooks (`frontmatter-versioning.md:23`) that the engine no longer checks, and it would keep claiming CI wiring that does not exist. |
| R4 | Remove `version` from the child-doc rows and child templates of the frontmatter template asset, keeping it on the `SKILL.md` template. | `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:126`, `frontmatter-templates.md:193`, `frontmatter-templates.md:476` | Extend in place | Build nothing fails: the template marks `version` required for references and assets (`frontmatter-templates.md:126`) and seeds a literal `1.7.0.0` (`frontmatter-templates.md:476`), so new docs would keep being born with a version, in the wrong era. |
| R5 | Keep the git-free `gate` as the only enforced check, run by the post-edit hook. Do not wire `verify` into CI, a git hook or pre-commit. | `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:397`, `frontmatter-versioning.md:131`, `post-edit-router.cjs:38` | Build nothing | Not applicable: Build nothing is the cheapest move. `gate` already exits 0 on 14 of 14 skills, and after R1 `verify` is green on `SKILL.md` too. |
| R6 | Narrow the post-edit router's `isVersionedSkillDoc()` to `SKILL.md` in the same change, so its stated mirror of the engine's scope stays true. | `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:127`, `post-edit-router.cjs:131` | Extend in place | Build nothing fails: the docstring at `post-edit-router.cjs:127` promises the match mirrors the engine's `inScope()`. After R1 it would fire the version gate on every child-doc edit for a scope the gate no longer covers, and the comment would be false. |
| R7 | Leave the changelog scope divergence alone: the packager keeps checking changelog versions and the engine keeps excluding them. | `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:133`, `frontmatter-version.mjs:52` | Build nothing | Not applicable: Build nothing is the cheapest move. Changelog entries are the edition record the contract rests on, and no changelog entry fails today. |

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Reconcile the fleet with `apply --update` so `verify` goes quiet | The sweep rewrites every in-scope doc, buries real changes, and is undone by its own commit | `frontmatter-versioning.md:135` | 1, 5 |
| Keep stored git-derived `W` with a better reconcile workflow | Any commit that touches a doc stales `W`; the two-pass amend only amortizes the cost | `frontmatter-versioning.md:98` | 5 |
| Wire `verify` into CI or a git hook | Turns a non-convergent equality into a permanent red gate, which is the discouraged fleet sweep with a pipeline added | `frontmatter-versioning.md:131` | 5 |
| Enforce per-doc era parity (`X.Y` only) | Would flag 573 docs in three skills today; going green needs the same discouraged sweep, and every anchor bump re-stales every child | `frontmatter-version.mjs:187` | 6 |
| Keep the status-quo four-part per-doc version | Non-convergent by construction and measured red on 14 of 14 skills | `frontmatter-version.mjs:282` | 6, 10 |
| Treat `verify` exit 1 as an engine bug | The comparison matches its documented rule and the spot-checked arithmetic holds | `frontmatter-version.mjs:334` | 1 |
| Find an external meaning for `W` or `Z` | `W` needs this repository's history; `Z` has no producer or consumer | `frontmatter-versioning.md:50` | 7 |

---

## Divergence Map

- Saturated directions: the Q5 automation inventory, re-verified in iterations 2 to 4 and closed.
- Pivots taken: none. The run used default convergence with a forced ten-iteration stop policy, so no divergent pivot fired.
- Pivot failures and audited overrides: none.
- Remaining frontier: a live edit probe of the post-edit hook, and the behavior of `quick_validate.py` on a child doc with no version. Neither changes a recommendation.

---

## 12. Open Questions

- **Who exactly is the "external author"?** UNKNOWN in-repo. The run assumed the package recipient. A named consumer that receives single docs without their skill would trigger the reversal condition in Section 8.
- **What happens to the 7 frontmatter-less in-scope docs?** They are skipped, not failed (`frontmatter-version.mjs:408`). Under R1 only `SKILL.md` stays in scope, so this matters only if a `SKILL.md` ever lacks frontmatter.

---

## 13. Lineage Disagreements and How They Were Settled

One lineage ran, so the disagreements are between iterations and between the executor and the orchestrator's own checks.

| Claim | Status | How it was settled |
|-------|--------|--------------------|
| Iteration 1: the engine is duplicated byte-for-byte under `scripts/` and `shared/scripts/` | **Wrong** | `ls -la` shows `sk-doc/scripts/frontmatter-version.mjs -> ../shared/scripts/frontmatter-version.mjs`. One physical file. Iteration 3 reached the same correction. |
| Iterations 6 and 8: 713 mismatches in the three named skills, 574 of them era drift | **Overstated by 3** | The count included each skill's summary line. Re-counting `^  FAIL ` lines gives 331 + 265 + 114 = 710, of which 573 are era drift, 134 `W` only and 3 `Z` only. |
| Iteration 8: the spec's 340 / 320 / 115 are the files `verify` flags | **Wrong** | They are the in-scope file totals. The flagged counts are 331, 265 and 114. |
| Iteration 10: removing the child version needs the gate's `FAIL:missing` branch at `frontmatter-version.mjs:409` deleted | **Wrong as priced** | `gate` discovers targets through `discoverInScope` (`frontmatter-version.mjs:402`), so narrowing `inScope()` removes child docs from `gate` with no branch change. |
| Iteration 10: 2,798 of 2,909 docs flagged fleet-wide | **Overstated by 3** | The orchestrator's fleet run: 2,795 mismatches over 2,909 docs, `verify` exit 1 on 14 of 14 skills. |

---

## 14. Evidence Limits and Confidence

- Confirmed by the orchestrator with commands: the fleet `gate` and `verify` results, the 573 / 134 / 3 drift split, the `SKILL.md`-only `verify` exit 0, the engine symlink, and the package, validator, router, wrapper, CI and `.gitignore` lines cited above.
- From executor reads, not re-run: the 68 changelog entries carrying a version (iteration 8), and the absence of a `quick_validate.py` or `package_skill.py` caller in hooks and workflows (iteration 3).
- Judgment: that no reader outside the repository needs a per-doc era. What would change it is a named consumer of single extracted docs.
- The `gate` and `verify` results assume the sk-doc validation switch stays off (`validation-switch.cjs:64`). Every run here executed and reported file counts, so it was off.

---

## 15. Proposed Implementation Phases

1. One change set covering R1, R2, R4 and R6: narrow the engine, packager, template and router scope to `SKILL.md`, and delete the child `version:` lines. Verify with `gate` and `verify` on every skill; both should exit 0.
2. R3: rewrite the standard to the edition contract.
3. R5 and R7 need no work.

---

## 16. Convergence Report

- Stop reason: maxIterationsReached (stop policy `max-iterations`; convergence was telemetry only).
- Total iterations: 10.
- Questions answered: 5 / 5. Remaining questions: 0.
- Last 3 iteration summaries: run 8 executed `gate` on the three named skills and confirmed it green; run 9 extended `gate` to all 14 skills; run 10 extended `verify` to all 14 skills and consolidated the decision record.
- Convergence threshold: 0.05.
- Divergence summary: no divergent pivots recorded.

---

## 17. References

- `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs`
- `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md`
- `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`
- `.skilled/skills/sk-doc/shared/scripts/quick_validate.py`
- `.skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh`
- `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs`
- `.github/workflows/skill-doc-frontmatter.yml`, `.github/workflows/sk-doc-script-tests.yml`
- `.skilled/repo-rules/prevent-overengineering.md`
- Iteration narratives: `research/iterations/iteration-001.md` to `iteration-010.md`
