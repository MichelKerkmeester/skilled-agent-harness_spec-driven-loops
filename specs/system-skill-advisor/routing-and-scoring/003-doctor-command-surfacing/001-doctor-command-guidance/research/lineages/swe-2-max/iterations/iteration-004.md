# Iteration 4: Command surface mechanics — how a doctor entry would compete and render

## Focus
How a bridged command competes with skills and renders in the brief: the CommandBridgeProjection shape, the render path for `kind:'command'`, the prompt-gate boundary, the intended home for command-routing metadata, and adjacent retrieval channels (Gate-1 trigger index).

## Actions Taken
- Read `CommandBridgeProjection` and generated entry shape in `projection.ts`; `render.ts` recommendation mapping and brief text; `prompt-policy.ts` `shouldFireAdvisor` gate.
- Read `command-catalog-mirror-check.cjs` header for the documented purpose of `command-metadata.json`.
- Read `system-deep-loop/command-metadata.json` for the full entry schema; re-checked `derive-command-bridges.cjs` field requirements and `bridgeId()` regex.
- Probed the spec-kit trigger index for doctor coverage as a comparison channel.

## Findings
1. `CommandBridgeProjection extends SkillProjection` adds only `inventoryId` and `routingEnabled`; entries carry `kind:'command'`, `id`, `name`, `description`, `keywords`, `domains`, `intentSignals` — a doctor entry is structurally identical to the existing `create:agent`/`command-spec-kit` rows [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:61-63,153-180].
2. The render path already distinguishes commands: `render.ts:170` maps `kind === 'command' ? 'command' : 'skill'` into the scored recommendation, and the brief prints `Advisor: live; use <label> <conf>/<unc> pass.` (or the `ambiguous:` two-candidate form) — a command bridge can be the top label; no renderer change is needed to name one [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:165-180,395-455].
3. The prompt gate does NOT block natural-language doctor intents: `shouldFireAdvisor` declines only empty prompts, an EXACT_SKIP_COMMANDS set loaded from policy config, and short casual acknowledgements — setup/health phrasing reaches the scorer [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:124-165].
4. `command-catalog-mirror-check.cjs` documents the designed ownership path: "the command-metadata.json each hub keeps **so the skill advisor can route to a command it owns**" — the metadata file IS the supported routing surface; doctor commands lack one because the family has no owning skill directory [SOURCE: .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs:7-20].
5. The command-metadata.json schema is richer than needed for keywords alone: `userIntent.ownedSignals` carries natural-language routing phrases ("run a research convergence loop"), `discriminator.preferSiblingWhen` encodes anti-steal disambiguation between siblings, `choreography` lists load order — the vocabulary already exists for "diagnose X" intents [SOURCE: .skilled/skills/system-deep-loop/command-metadata.json].
6. Derivation contract: metadata entries require `command`+`ownerMode`; allow-list entries require `id`+`command`+`skillId`+`ownerMode`+`reason`; `bridgeId()` accepts `/doctor:git` → `command-doctor-git`; per-platform activation lives in `scoring-compatibility.json` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:49-120].
7. The Gate-1 trigger index already surfaces doctor-adjacent DOCS (e.g. `sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md` matched "doctor git setup") — a complementary channel returning files, not command recommendations; it does not fix advisor routing but is a fallback worth noting [SOURCE: lookup-trigger-index.mjs probe output].
8. Design constraint surfaced: `scoring-compatibility.json` holds per-platform keywords/domains/intentSignals — the seam where `_routes.yaml` trigger_phrases would land, while `command-metadata.json`/`allow-list` hold identity (command, skillId, ownerMode) — matching the `skill_agent` tags [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json; derive-command-bridges.cjs:18-40].

## Questions Answered
- Q2 (commands surfaced versus skills; doctor visibility) — fully answered: bridges enter as `kind:'command'` peers through metadata/allow-list → generated table → projection merge; the renderer already labels them; doctor commands appear nowhere because no metadata source names them.

## Questions Remaining
- Q5 design synthesis: which mechanism to recommend, onboarding entry shape, anti-steal calibration, test approach, rejected ideas — one consolidation iteration remains.

## Ruled Out
- "Renderer would need changes to show a command": falsified — `kind:'command'` is a first-class render path.
- "Prompt gate swallows setup questions": falsified — only exact-skip/short-casual prompts are declined.

## Dead Ends
- None.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:55-180
- .skilled/skills/system-skill-advisor/runtime/lib/render.ts:150-200,395-460
- .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:120-165
- .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs:1-60
- .skilled/skills/system-deep-loop/command-metadata.json
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:49-160
- lookup-trigger-index.mjs probes (Gate-1 channel)
- steer.md: absent this iteration

## Assessment
- New information ratio: 0.85 — the render/gate/metadata-schema mechanics are all new; doctor invisibility reconfirmed through the ownership lens.
- Questions addressed: Q2 (now fully), groundwork for Q5.
- Questions answered: "How are commands surfaced to the advisor versus skills, and do doctor commands appear in advisor output at all today?"

## Reflection
- What worked: following `kind:'command'` from projection to render showed the command surface is already first-class — the gap is purely a missing data source, not missing machinery.
- What did not work: nothing notable.
- What I would do differently: none — the evidence chain for the design is complete.

## Recommended Next Focus
Final design consolidation: choose the bridge-source mechanism (extend derive-command-bridges.cjs to read _routes.yaml vs hand-authored metadata vs allow-list), the onboarding-entry answer, anti-steal calibration, the accuracy test plan, and the rejected-ideas list.
