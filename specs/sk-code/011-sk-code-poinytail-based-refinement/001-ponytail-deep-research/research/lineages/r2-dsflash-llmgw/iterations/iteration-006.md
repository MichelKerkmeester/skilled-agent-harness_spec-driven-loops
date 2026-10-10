# Iteration 006

## Focus
The sk-code hub core — `SKILL.md`, `ROUTER.md`, `mode-registry.json` and `hub-router.json` — checking what Ponytail's description, activation vocabulary and version discipline teach a registry-driven hub.

## Actions Taken
- Read the hub's `SKILL.md` and both registries in full; swept `ROUTER.md` for the vocabularies under test.
- Counted the restraint vocabulary Ponytail activates on across all four hub files and the compiled-routing canary corpus.
- Read the doctor's parent-skill-check version-parity and changelog-anchor checks after Ponytail's staleness story raised the question.
- Checked the hub's when-not-to-use and inline mode-hint mechanisms against Ponytail's activation practices.

## Findings
1. **Restraint and simplification prompts have no front-door routing vocabulary. NEW.** Ponytail activates on exactly those complaints: "yagni", "simplest solution", "complains about over-engineering or bloat" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:7] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:8]. The sk-code hub owns the doctrine for those intents — `prevent-overengineering.md` and the design-restraint playbook scenarios [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:287] — but none of its lexical surfaces carries the vocabulary: `hub-router.json`'s quality classes list only gate vocabulary [SOURCE: .skilled/skills/sk-code/hub-router.json:52] [SOURCE: .skilled/skills/sk-code/hub-router.json:56], the quality mode's aliases are gate phrases [SOURCE: .skilled/skills/sk-code/mode-registry.json:36], and `description.json`'s keywords contain none of yagni, simplify, over-engineering, bloat, lean or refactor. A "simplify this / is this over-engineered?" request cannot score the quality mode lexically. Priority P1. Target: `hub-router.json`, `mode-registry.json`, `description.json`.
2. **The canary corpus has no restraint or simplification case. NEW.** The compiled-routing canary fixture holds single-mode, ordered-bundle, surface-bundle, ambiguous, zero-signal and certificate cases [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:1], but no prompt carrying restraint vocabulary and no case asserting the quality mode wins it. Fixing finding 1 without a case would leave the new aliases unverified, which is the exact shape round one's routing recommendation took: extend the fixture, do not build a separate check [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md:185]. Priority P2.
3. **Ponytail's agreement-needs-an-outside-reference lesson is already implemented, better than Ponytail states it. ALREADY-ADOPTED.** Ponytail's version guard exists because its manifests went stale together while an agreement test passed [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/check-versions.js:5]; round one carried the lesson as "anchor agreement checks outside the pair" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md:176]. The doctor's parent-skill check already does this: check 13a compares ROUTER.md, description.json, hub-router.json and mode-registry.json against SKILL.md as the declared release authority, and check 13b compares that authority against the newest changelog entry, which is the outside reference [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1694] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1671] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1685]. No action; recorded because round one did not know a counterpart existed.
4. **The hub's activation and disambiguation practices already exceed Ponytail's. ALREADY-ADOPTED.** Ponytail's activation is a session-wide mode switch with levels; the hub instead takes an inline mode hint, routes one advisor identity through a registry and defers ambiguous intents with a named checklist [SOURCE: .skilled/skills/sk-code/SKILL.md:23] [SOURCE: .skilled/skills/sk-code/SKILL.md:77] [SOURCE: .skilled/skills/sk-code/SKILL.md:133]. The when-not-to-use list routes neighboring work away instead of absorbing it [SOURCE: .skilled/skills/sk-code/SKILL.md:42]. No action.

## Questions Answered
- Which Ponytail teachings improve the sk-code hub core (SKILL.md, ROUTER.md, mode-registry.json, hub-router.json) beyond what round one settled?

Two actionable gaps (restraint vocabulary and its missing canary case) plus the verification that the version-anchor lesson is already implemented.

## Questions Remaining
- Which Ponytail teachings improve the sk-code shared layer and the quality and review modes beyond round one's adopted set and defects?
- Which Ponytail teachings improve the per-surface packets beyond round one's cited defects?
- Which original ideas does Ponytail inspire for these targets, and which transfers should be rejected?
- Which round-two findings are NEW, ALREADY-COVERED or ALREADY-ADOPTED, and at what priority?

## Ruled Out
- **Adding a session-global intensity switch to the hub.** Round one rejected it twice and the hub's two-axis contract depends on per-request routing [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md:168].
- **Copying Ponytail's description wholesale into `description.json`.** Its description is long-form activation prose for a standalone skill; the repo's advisor consumes bounded keywords, so the transfer is the missing vocabulary, not the sentence.
- **Building a separate restraint-routing test harness.** The canary fixture already replays compiled routes deterministically; the fix is one case, not a harness.

## Dead Ends
- `ROUTER.md`'s two "lean" hits are unrelated (a script path and a resource name), so stage two has no restraint intent key either; the finding stands for ROUTER.md as a fourth surface.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- .skilled/skills/sk-code/SKILL.md
- .skilled/skills/sk-code/hub-router.json
- .skilled/skills/sk-code/mode-registry.json
- .skilled/skills/sk-code/description.json
- .skilled/skills/sk-code/ROUTER.md (vocabulary sweep)
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json
- .skilled/commands/doctor/scripts/parent-skill-check.cjs
- .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/check-versions.js
- specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md

## Assessment
- New information ratio: 0.62 (2 fully new: findings 1, 2; 1 partially new verification: finding 3; 1 reconfirmation: finding 4)
- Questions addressed: key question 4 (hub core)
- Questions answered: key question 4

## Reflection
- What worked and why: counting exact vocabulary strings rather than reading for intent produced the iteration's main finding; a router is a lexical machine, so the words it contains are the evidence.
- What did not work and why: an early draft proposed adding Ponytail's full activation paragraph to the description; reading `description.json`'s bounded keyword contract showed the repo consumes keywords, not prose, so the proposal narrowed to the missing terms.
- What I would do differently: check the canary corpus first when testing a routing claim; it is a fast, deterministic map of what the router is currently proven to do.

## Recommended Next Focus
The sk-code shared layer and the two workflow modes: `shared/references/*` and `sk-code-quality` / `sk-code-review` packets against Ponytail's review-skill mechanics round one did not already adopt or reject.
