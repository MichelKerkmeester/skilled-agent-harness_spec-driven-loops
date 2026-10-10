# Iteration 14: sk-code-opencode fresh pass

## Focus

Part 3, third surface: the OpenCode packet's drift-guard claims against their observed behaviour, the hook reference's paths, the script inventory, and any rename residue. This follows iteration 13's Recommended Next Focus.

## Actions Taken

1. Read the OpenCode `SKILL.md` sections that describe the drift guards and the workflow doctrine.
2. Ran `assets/scripts/verify_router_sync.cjs` and read its PASS lines and exit status.
3. Read the wrapper's header and its leg list; compared both against `scripts/README.md` and `references/shared/alignment-verification-automation.md`.
4. Tested every hook path named in `references/shared/hooks.md` for existence.
5. Verified the packet's SKILL version against its newest changelog entry, and swept the packet for pre-rename names.

## Findings

1. **The OpenCode SKILL credits the wired leg 1a with the orphan coverage that actually belongs to the unwired leg 1b.** `SKILL.md`'s guard paragraph describes leg 1a as "(1) router paths exist on disk, **every routable doc is routed**, and every full path the prose maps name is routed" [SOURCE: .skilled/skills/sk-code/sk-code-opencode/SKILL.md:173], while the guard's own 1a line says only "machine-router paths exist and the prose maps are routed" [observed guard output], and `scripts/README.md` states "Leg 1b, the orphan-doc part of (1), is not run: nine docs have no router naming them" [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/README.md:12]. An operator auditing whether the nine orphans are covered by the running umbrella would read the SKILL and conclude yes; the two files that own the guard say the opposite. Reproducing case: `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs` prints the narrower 1a description, and the README row assigns orphaning to 1b. NEW, P2 (one wording fix; the guard behaviour itself is correct).
2. **Two pre-rename names remain in the OpenCode SKILL.** The surface hands formal findings to `code-review` and author-side gates to `code-quality` [SOURCE: .skilled/skills/sk-code/sk-code-opencode/SKILL.md:24], and a comment names the sibling `code-webflow` map [SOURCE: .skilled/skills/sk-code/sk-code-opencode/SKILL.md:54]. The canonical keys are `sk-code-review`, `sk-code-quality`, `sk-code-webflow`. Reproducing case: `rg -n "code-webflow|code-review|code-quality" .skilled/skills/sk-code/sk-code-opencode/SKILL.md` prints the two rows; the same sweep now has hits in all three surface/mode packets. NEW, P2 (third packet in the same rename-miss family as f-iter006-003 and f-iter012-002).
3. **The guard, the hook paths and the version pairing all check out.** The router-sync guard passes 4/4 with exit 0 [observed]; `references/shared/hooks.md`'s named hook files all exist on disk; `scripts/README.md`'s "Code files | 6" matches the six scripts present; and the packet's SKILL version equals its newest changelog entry (1.1.0.0 across quality, review, webflow, opencode and obsidian pairs checked) [SOURCE: .skilled/skills/sk-code/sk-code-opencode/SKILL.md:5]. ALREADY-ADOPTED, P2, no action.
4. **The workflow-doctrine trio's routing is phase 009's in-flight item, recorded once.** The packet carries the three symlinked `references/workflow-*.md` leaves and its SKILL says the phases use "the split shared, language, hook, and alignment resources above" [SOURCE: .skilled/skills/sk-code/sk-code-opencode/SKILL.md:45], while no RESOURCE_MAP row emits the trio; steer ruling 2 places that routing in phase 009 child 001. IN-FLIGHT, no action.

## Questions Answered

- Part 3's OpenCode leg is mapped: no behavioural guard defect; two documentation drifts filed.

## Questions Remaining

- `sk-code-obsidian`, the hub files, `benchmark/` and the root playbook.

## Ruled Out

- **"File the guard's narrower 1a behaviour as a defect."** The behaviour matches its owners; only the SKILL's description is wrong.
- **"File hooks.md for not mentioning the stdin deadline or Hermes gate."** It documents hook installation tables, not reader internals; no stale claim exists to fix.
- **"File the system-spec-kit pointer as missing."** The pointer resolves at its owning skill; the first existence check used the wrong relative base and was corrected before recording.

## Dead Ends

- The wrapper's three-guard count and the final "all 3 guards PASSED" contract match the script and the README; no drift.
- The OpenCode packet's resource-map paths all resolve; the earlier single "missing" was a checker-path error, not a file.

## Edge Cases

- Ambiguous input: whether the SKILL's leg-1a sentence is a description of the umbrella's coverage rather than the leg's own check. Chosen interpretation: the sentence binds the check to leg 1a by number and parenthetical, and the README reads it the other way; the defect is the ambiguity.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-opencode/SKILL.md`
- `.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh`
- `.skilled/skills/sk-code/sk-code-opencode/scripts/README.md`
- `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs` (run)
- `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/README.md`
- `.skilled/skills/sk-code/sk-code-opencode/references/shared/hooks.md`
- `.skilled/skills/sk-code/sk-code-opencode/references/shared/alignment-verification-automation.md`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.75 (two fully new findings, one ALREADY-ADOPTED verification block, one IN-FLIGHT record).
- Questions addressed: Part 3 OpenCode leg.
- Questions answered: none fully.

## Reflection

- What worked and why: running the guard and comparing its printed PASS line against the SKILL's description. The divergence is one word — "routed" vs "orphans" — and only execution exposes it.
- What did not work and why: the first path sweep reported a missing system-spec-kit file; the relative base was wrong. The corrected check found it. Both the wrong and corrected results are recorded.
- What I would do differently: for parenthetical pointers that name another skill, resolve from the owning skill's root, not the current packet's.

## Recommended Next Focus

`sk-code-obsidian`: its reference inventory, the six orphan docs' content, and how the packet integrates with the hub and the review mode's gaps.
