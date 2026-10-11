# Iteration 5: Q3 — Smallest Contract Green by Construction

## Focus

Q3: What is the smallest contract that stays green by construction? Selected after resolving a dispatch/state conflict: the dispatch focus text ("Q5 ... to be consolidated") is the stale iteration-1 carry note, while the strategy has Q5 ticked in Section 3 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:67], lists it under answered questions [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:88], and carries a BLOCKED entry for re-running the Q5 inventory [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:144-147]. Iteration 4's own recommendation is Q3, arguing the closed enforcement inventory fixes Q3's constraint set [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-004.md:82]. Chosen: Q3 as the narrower evidence-backed candidate; Q2 and Q4 deferred, with Q2 partially advanced.

## Actions Taken

1. Read state: deep-research-config.json, deep-research-strategy.md, the 8-line state-log projection (4 iteration records + iteration 5 start sentinel), and iterations/iteration-004.md; confirmed iterations/iteration-005.md and deltas/iter-005.jsonl absent (boundary check).
2. Read the versioning standard end to end: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md.
3. Read the engine's derivation, anchor, verify and gate paths: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs (lines 1-400).
4. Searched .skilled/skills/sk-doc and .skilled/skills/system-spec-kit for "external author" / external-consumer terminology, and swept script surfaces for frontmatter consumers. Result: no in-repo definition of "external author" (negative finding recorded for Q2).

## Findings

1. **Doc-version drift reduces to a single segment.** Segments X (major) and Y (minor) are inherited from the owning skill's anchor, which is resolved from SKILL.md frontmatter and changelog/v*.md filenames as a filesystem max — no git [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:63-66] [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:177-190]. Z is seeded 0 by design [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:50]. Only W is git-derived: W = min(realEditCount(file), 99) [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:51] [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:281-282]. Any "stays green" analysis therefore only has to solve for W. (Partially new: the derivation was known from iteration 1; the segment-level reduction is the new frame.)

2. **W cannot stay green by any workflow, only by discipline.** W counts commits whose per-file numstat is nonzero [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:70-101], and writing W is itself such an edit, so one apply pass never converges [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:98-104]. The documented convergent flow is apply -> commit -> apply -> commit --amend [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:106-113]; the ordinary case (apply inside the content commit) avoids the extra commit but still requires every contributor to remember it [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:120-121]. The count reads committed history only (git log --follow), so a dirty tree can verify green and turn stale on the very commit that saves the work. (Partially new: sharpens the documented churn into a mechanism-level statement.)

3. **What can never fail today is the gate, and only the gate.** gate is presence + four-part format, explicitly git-free ("no git, no manifest") [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:397-400], and cannot be made stale by a commit [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:127-129]. verify compares the full stored tuple against the git-derived tuple [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:334]; a fleet-wide verify reports thousands of mismatches on a gate-clean repo and that is documented as the expected reading [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136]. Iterations 2-4 closed the enforcement inventory: every automated surface is presence/format or engine-fixture tests, and verify has no caller [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-004.md:21-29]. (Redundant with prior iterations; restated only as the constraint set Q3 is answered against.)

4. **The smallest contract that stays green by construction (Q3 answer).** Two layers:
   - Strict layer (never fails, minimal meaning): presence + four-part format, i.e. today's gate. Green by construction because it consults only the working tree.
   - Smallest meaningful layer: presence + format + era parity — the child's X.Y must equal its owning skill anchor's X.Y, with Z recorded as 0 and W demoted out of the asserted contract. Every component is git-free: the anchor resolver [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:177-190] and the in-scope walk [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:246-266] are filesystem-only, and the post-edit gate already computes over the same selection [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:384].
   - Why it stays green: no commit can invalidate an assertion that is a pure function of the working tree. An anchor bump stales children until apply rides the bump commit — bounded to human anchor events — whereas W stales on every commit that touches the file.
   - Delta from today's contract: a deletion. W stops being a stored invariant and becomes at most a human-facing informational print. Prevent-overengineering move: delete a derivation from the enforced path rather than add machinery — no new generator, CI job, or reconciliation loop; the existing gate stays the only enforced surface and verify remains descriptive [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:127-136].
   (New.)

5. **External-author reading (partial, for Q2).** W depends on this repository's git history [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:70-101] and so is not reproducible by any consumer without it; the externally reproducible component is the skill-era X.Y, inherited from the human-curated anchor [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:44] [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:47-49]. No in-repo source defines "external author" (search of sk-doc and system-spec-kit returned no such term), so Q2's normative answer needs a definition decision this iteration cannot supply. (Partially new.)

## Ruled Out

- **Stored git-derived W with a better reconciliation workflow.** Any commit that changes the file's numstat count makes the stored value stale by definition [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:98-104]; the two-pass amend flow amortizes the ceremony per commit but never removes it [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:106-113].
- **Wiring verify into CI to force fleet reconciliation.** Re-enters the explicitly documented fleet-sweep dead end [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136] and adds a pipeline where the smallest contract calls for a deletion.
- **Re-running the Q5 inventory as fresh ground.** Q5 was consolidated and adversarially re-verified in iterations 3-4; re-running it is BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:144-147].

## Dead Ends

- Git-derived precision as a stored invariant: structurally non-convergent. New elimination candidate for the reducer to promote to strategy "Exhausted Approaches".

## Edge Cases

- Ambiguous input: dispatch focus says Q5, strategy data says Q5 answered and re-run blocked [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:67] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:88] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:144-147], and iteration 4 recommends Q3 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-004.md:82]. Chosen interpretation: Q3, with Q2/Q4 deferred and Q2 partially advanced. Alternatives deferred, not dropped.
- Contradictory evidence: none new this iteration.
- Missing dependencies: no in-repo definition of "external author"; fallback is the segment-semantics reading plus the recorded absence. Limits Q2 to partial.
- Partial success: none.

## Questions Answered

- Q3: What is the smallest contract that stays green by construction? — answered: reduce the stored assertion to git-free components (presence + format, plus era parity if meaning is wanted), demote the git-derived W out of the contract, and keep the existing git-free gate as the only enforced surface. The strict minimum (presence + format) already satisfies "green by construction" today.

## Questions Remaining

- Q2: What should doc versions mean for an external author? (partial: the era-only reading is recorded; blocked on a definition of "external author")
- Q4: Should the per-doc version exist at all? (deferred; bounded by this iteration's contract shape)

## Sources Consulted

- .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md (full read)
- .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs (lines 1-400)
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-004.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deltas/iter-001.jsonl (iteration-1 record: live verify exit 1, 340 mismatches)
- Search surfaces: .skilled/skills/sk-doc/**, .skilled/skills/system-spec-kit/** (external-author terminology); script globs for frontmatter consumers

## Assessment

- New information ratio: 0.6 (1 fully new, 3 partially new, 1 redundant; +0.10 simplicity bonus for collapsing the design space to one segment-level rule)
- Questions addressed: Q3, Q2 (partial)
- Questions answered: Q3

## Reflection

- What worked and why: reducing the contract question to "which segments are git-derived" before proposing anything. That made the answer mechanical — the git-derived segment is the only one that can drift, so the contract has to stop asserting it — and checkable against existing helper functions rather than requiring a new design.
- What did not work and why: the external-author search returned no definition, so one research action produced only a negative finding; still usable for Q2, but it signals Q2 needs a product decision, not more repo evidence.
- What I would do differently: for Q4, first classify the 340/320/115 flagged files [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:245] by mismatch kind (W-only vs anchor drift) using the dry-run compute mode [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:15], which writes nothing by default; that separates "the field is noisy" from "the field is wrong" and is a sharper input than raw flag counts.

## Recommended Next Focus

Q4: Should the per-doc version exist at all? Bounded by this iteration's contract shape: evaluate the era-tag's reader value against the field's maintenance cost, including whether child docs may drop the field while SKILL.md keeps it (validators reject an absent version for skills [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:166-167]). Prevent-overengineering move for that evaluation: classify existing dry-run output (measure) before proposing any tooling change. Q2 remains open with the partial reading recorded.

## SCOPE VIOLATIONS

None. All writes stayed inside the iteration and delta allowed-write paths; the append gateway is the only writer of the state projection.
