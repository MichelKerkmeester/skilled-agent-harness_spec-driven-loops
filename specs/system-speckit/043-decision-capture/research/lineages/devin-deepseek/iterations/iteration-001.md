# Iteration 1: Where a decision request should route

## Focus

Gap 1. A natural-language request such as "record my chat reply as a decision" matches no skill. This iteration traces the routing path from SKILL.md frontmatter through the compiled skill graph to the advisor's live signal map, finds the smallest vocabulary addition that makes the request route, checks what the addition could steal, and decides which packet owns the change.

## Actions Taken

1. Read `system-spec-kit`'s `graph-metadata.json` in full: its `intent_signals`, `derived.trigger_phrases`, `derived.key_topics` and `domains`.
2. Read `system-spec-kit/SKILL.md` frontmatter and its SMART ROUTING section, then `ROUTER.md`'s intent list.
3. Traced the advisor's scoring inputs in `skill_advisor.py`: skill record construction, the live source signal map, signal boost matching, phrase-boundary matching, the keyword pass and `PHRASE_INTENT_BOOSTERS`.
4. Read every skill's SKILL.md `description` line to see which skills currently own "decision" vocabulary.
5. Ran the committed trigger index lookup for two phrasings of the request (read-only, `--scoring-only`).
6. Read the routing precedent in `specs/system-skill-advisor/031-routing-and-launcher-hardening/` (spec, plan, implementation summary) for how a "routes to nothing" gap was fixed and where it was filed.

## Findings

1. The skill choice is made by the advisor, which scores four inputs: SKILL.md `description` corpus terms, SKILL.md `keywords` variants, the compiled `skill-graph.json` `signals`, and a live source signal map rebuilt from every skill's `graph-metadata.json` `intent_signals` plus `derived.trigger_phrases`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:257-268]
2. The source signal map is read from the source tree on every load and merged into the compiled graph's signals, so a `graph-metadata.json` edit reaches scoring without a code change; the compiled `skill-graph.json` still has to be re-exported for the graph artifact and its freshness check. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1205-1248] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1389-1391] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1450-1454]
3. Signal matching is phrase-boundary matching, not token overlap: a declared phrase fires only when its normalized form appears in the prompt with word boundaries. A signal such as "record a decision" therefore does not fire on "record my chat reply as a decision", while "as a decision" does. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1672-1679] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:3093-3103]
4. `system-spec-kit`'s metadata carries no operator-decision vocabulary. Its 31 intent signals and 21 derived trigger phrases cover spec folders, saves, continuity, validation, retrieval, template repair, env vars and runtime mirrors, and none names a decision, an answer or a decision record. [SOURCE: .skilled/skills/system-spec-kit/graph-metadata.json:48-80] [SOURCE: .skilled/skills/system-spec-kit/graph-metadata.json:82-104]
5. The committed trigger index returns zero rows for both "record my chat reply as a decision" and "record this as a decision" (exit 0, empty `results`, tokens `record/chat/reply/decision` and `record/decision`). No indexed document declares the phrase either. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs]
6. Only `sk-design` currently carries the word "decision" in a skill description ("the mode that owns the decision"), so the prompt's `decision` token gives sk-design a corpus hit, not system-spec-kit. [SOURCE: .skilled/skills/sk-design/SKILL.md:3]
7. A routing-vocabulary gap of this exact kind has a precedent owner and recipe. Packet 031 fixed "the bare prompt `environment variables` routes to nothing" by adding `environment variables` to `.skilled/skills/system-spec-kit/graph-metadata.json`, re-exporting the skill graph, and proving the route with a short-prompt probe; the packet is filed under `specs/system-skill-advisor/`, not under the skill whose metadata changed. [SOURCE: specs/system-skill-advisor/031-routing-and-launcher-hardening/spec.md:40] [SOURCE: specs/system-skill-advisor/031-routing-and-launcher-hardening/spec.md:73] [SOURCE: specs/system-skill-advisor/031-routing-and-launcher-hardening/implementation-summary.md:81] [SOURCE: specs/system-skill-advisor/031-routing-and-launcher-hardening/plan.md:77]
8. The smallest correct fix is metadata-only: add a short intent-signal set to `system-spec-kit/graph-metadata.json` that includes "as a decision" (the phrase the reported request actually contains), plus "decision record", "operator decision" and "record my answer"; re-export `skill-graph.json`; and add a DECISION intent row to `ROUTER.md` that loads `references/memory/save-workflow.md` and `references/validation/decision-format.md` so the loaded skill knows which references to open. No advisor code change is needed. [SOURCE: .skilled/skills/system-spec-kit/graph-metadata.json:48-80] [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:37-57]

## Ruled Out

- **Adding a bare `decision` keyword to `system-spec-kit/SKILL.md`.** It would fire on every prompt that mentions a decision, and `sk-design` already owns "decision tree", "colour decision" and "color decision" signals. The keyword pass weights a single keyword at 1.0 while a three-word signal reaches 1.6, so the broad keyword is both weaker and more likely to steal.
- **Relying on `PHRASE_INTENT_BOOSTERS`.** It is a hard-coded code map; a metadata signal is the smaller change and the one 031 used for the same class of gap.
- **Adding the exact sentence "record my chat reply as a decision" as a signal.** It fixes one phrasing and nothing adjacent, and the phrase-boundary rule would still miss "record this as a decision".
- **A new child under 043.** Parent goal D1 limits every 043 child to the decision-capture pipeline, the writer or the save step; routing metadata is none of those, and 007's Known Limitations already calls the advisor metadata "another artifact".

## Dead Ends

- Searching the trigger index for the phrase: the index is a document-retrieval corpus, not the skill router, so a hit there would not have changed skill selection.
- Looking for a `keywords:` frontmatter field on system-spec-kit's SKILL.md: the file carries an HTML `<!-- Keywords: -->` comment, which the frontmatter parser does not read, so editing that comment changes nothing.

## Edge Cases

- **Ambiguous input:** "record my chat reply as a decision" can mean the save step or the decision-record writer. Chosen interpretation: the request asks for capture, which is the save step's path; deferred alternative is a dedicated command.
- **Contradictory evidence:** 007 says the phrase "routes nowhere", while sk-design's description contains "decision" and could score a low corpus hit. Resolution: no skill clears the routing threshold today; the distinction does not change the fix, and the probe in the owning packet must record the actual top result.
- **Missing dependencies:** none.
- **Partial success:** the collision check is structural only; a live advisor probe was not run because it starts a daemon that writes outside this lineage. Recorded as an open question for the owning packet.

## Sources Consulted

- `.skilled/skills/system-spec-kit/graph-metadata.json`
- `.skilled/skills/system-spec-kit/SKILL.md`
- `.skilled/skills/system-spec-kit/ROUTER.md`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`
- `.skilled/skills/sk-design/SKILL.md`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` (executed twice, read-only)
- `specs/system-skill-advisor/031-routing-and-launcher-hardening/spec.md`
- `specs/system-skill-advisor/031-routing-and-launcher-hardening/plan.md`
- `specs/system-skill-advisor/031-routing-and-launcher-hardening/implementation-summary.md`

## SCOPE VIOLATIONS

- The workflow's `step_preinit_spec_branch` (spec-present branch) would append the research topic to `specs/system-speckit/043-decision-capture/spec.md` under Open Questions. This lineage's write surface is the lineage directory only, so the mutation was not executed. It is recorded here instead; the parent `spec.md` already carries the research context line and the generated findings block from the earlier run.

## Assessment

- New information ratio: 0.88
- Questions addressed: routing surface and smallest vocabulary fix; owning packet.
- Questions answered: both routing key questions.

## Reflection

- What worked and why: reading the scorer's actual inputs rather than the skill docs showed that `graph-metadata.json` is live at scoring time, which turns the fix into a data edit and rules out a code change.
- What did not work and why: assuming a `decision` token would route to system-spec-kit. The only description that carries the word belongs to sk-design, which is exactly the stealing risk the dispatch named.
- What I would do differently: run the collision probe against the full prompt set before proposing the signal list, not after.

## Recommended Next Focus

Gap 2: how the queue, consumed log, nudge counter and orphan scan resolve their paths when `.skilled` is symlinked whole into several projects, and which scoping fix is smallest without breaking existing queues.
