# Iteration 003 — --with-lazy-addons vs the 9-doc lazy lists vs the prose (RQ3)

- Angle: the flag set, the lazy lists (now 9/7/6 across contracts), and every prose surface that describes either — with the specific question whether any doc still states timeline/roadmap are lazy while resource-map/goal stay explicit-option.
- Verdict: the old timeline/roadmap-vs-resource-map/goal split is GONE — root README:160,168,173 now say every other add-on (incl. resource-map.md) is lazy at every level and name the renderer; the flag set is described honestly everywhere it is described. What remains: one scaffold-guide line still calls decision-record "Required Templates" at Level 3 (contradicting both its own section and the manifest — the f-iter009-001 fix left this line), the style guide's lazy enumeration is incomplete, the root README trigger row joins two producers to two outputs, the template guide's scaffold walkthrough still knows nothing of either flag, and the ToC policy guide list disagrees with the rule.
- Findings: 5 (1×P1, 4×P2). Tool calls: 6/12.

## Findings

### f-iter003-001 [P1] — template-guide.md:178 still calls decision-record.md "Required Templates" at Level 3
- THE CLAIM: `references/templates/template-guide.md:178` — "**Required Templates:** Level 2 + `decision-record.md`" (Level 3 section).
- WHAT THE CODE DOES: decision-record.md is in `lazyAddonDocs` at Level 3 (spec-kit-docs.json:1061-1065 positions; the L3 lazy list :1053-1065) and is NOT produced by `create.sh --level 3` (scaffold_contract_docs: required+lifecycle+optionalAC+4-lazy+goal, create.sh:450-475; decision-record is in the 4 only under --with-lazy-addons :399). No rule requires it — the same section's own Enforcement line (:225) says "none. decision-record.md is a lazy add-on at every level".
- VERDICT ON 010: the f-iter009-001 fix corrected :225 but left :178 — a fix that left one document line behind (the exact class round two is mandated to hunt).
- SEVERITY: P1 (misleads maintainers into requiring a doc the scaffolder will never create).
- RECOMMENDATION: fix — "Level 2 file set; decision-record.md stays a lazy add-on".

### f-iter003-002 [P2] — the style guide's lazy enumeration is incomplete and over-broad
- THE CLAIM: `references/templates/template-style-guide.md:42` — "| **Lazy add-ons, every level** | decision-record.md, before-after.md, timeline.md, roadmap.md, goal.md, resource-map.md |"
- WHAT THE CODE DOES: lazyAddonDocs at every numbered level is 9 docs — the 6 listed PLUS handover.md, debug-delegation.md, research/research.md (spec-kit-docs.json:176-184); and at review/research the list is 6 docs that DROP goal.md (:2312-2322, :2430-2440) — so "every level" is false for two of the seven contracts. The style guide's own flat-model note at :45 ("identical at Levels 1, 2, 3 and 3+") is accurate; :42's "every level" is not.
- SEVERITY: P2 (enumeration drift in a maintainer-facing reference; the flat-model fix this row belongs to landed at :45).
- RECOMMENDATION: fix — add the three command/workflow docs (or label the row "author-facing lazy add-ons") and qualify "every level" as the four numbered ones.

### f-iter003-003 [P2] — root README trigger row joins two producers to two outputs
- THE CLAIM: `README.md:184` — "`--with-goal` on `create.sh`, or the inline gate renderer by hand | `goal.md`, `resource-map.md` | `addons/`".
- WHAT THE CODE DOES: `--with-goal` produces ONLY goal.md (create.sh:467-474); resource-map.md is produced only by the manual renderer (name it at README.md:173). Read as a two-by-two, the row says the flag can produce resource-map.md.
- SEVERITY: P2 (ambiguity, not error; the renderer command is correctly named elsewhere in the same file).
- RECOMMENDATION: fix — split into two rows (`--with-goal` → goal.md; renderer by hand → any of the lazy templates, e.g. resource-map.md).

### f-iter003-004 [P2] — the template guide's per-level scaffold walkthrough still knows neither flag
- THE CLAIM: `references/templates/template-guide.md:182-200` — the Level 3 "Scaffold command" (:186-190) and "Optional Templates" (:192-200) blocks.
- WHAT THE CODE DOES: neither block mentions `--with-lazy-addons` or `--with-goal`; "Optional Templates" demonstrates only the manual renderer for research.md.tmpl and resource-map.md.tmpl. Both flags are documented in create.sh help (:285-289), the root README trigger table (:183-184), EXTENSION-GUIDE.md:46-47 and the playbook (:90-95) — but the one reference a user opens to scaffold a level still omits them.
- SEVERITY: P2 (documentation gap in the per-level walkthrough; the round-one f-iter003-001 mandate "document the flag" is satisfied elsewhere, this is the fourth consumer left).
- RECOMMENDATION: document — add the flags to the scaffold blocks (and the resource-map render to Level 3's "Optional Templates", which it already has).

### f-iter003-005 [P2] — the ToC policy guide list and the rule disagree in both directions
- THE CLAIM: `references/templates/template-guide.md:758` — "No ToC heading in non-research spec artifacts (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, `implementation-summary.md`, `handover.md`, `debug-delegation.md`, `resource-map.md`)".
- WHAT THE CODE DOES: `check-toc-policy.sh:25-31` restricts 7 docs — spec, plan, tasks, decision-record, implementation-summary, handover, debug-delegation. acceptance-criteria.md and resource-map.md are NOT restricted (a ToC in them is legal), and neither surface covers timeline/roadmap/goal/before-after (also unchecked by the rule).
- SEVERITY: P2 (guide/rule mismatch; behavior is the rule's, so the guide over-claims for 2 docs and under-specifies for others).
- RECOMMENDATION: fix — make the guide mirror the rule's 7-doc list (or extend the rule and keep the guide the contract).

## What worked
- The flag census over the four doc surfaces (create.sh help, root README, EXTENSION-GUIDE, playbook) plus the template guide made the "documented in 4 places, not the 5th" gap provable without running anything.

## Ruled out (this iteration)
- timestamp-006: any doc still states timeline/roadmap are lazy while resource-map/goal stay explicit-option: RULED OUT — the split is gone; root README:160,168,173 and EXTENSION-GUIDE:46-47 now describe resource-map/goal as lazy by the same token as the other 7 (renderer/flag ownership is the only differentiator).
- template-guide.md:1168 (Level 3 row "decision-record.md and research/research.md stay lazy add-ons") contradicts the manifest: RULED OUT — consistent with lazyAddonDocs.

## Carried questions
- CQ-005: the level table's "Required Files" column lists implementation-summary.md at Level 1 — the manifest is lifecycle-required, not hard-at-create; is any surface claiming it's scaffolded? (verify in 007's version/example angle or live in 004).
