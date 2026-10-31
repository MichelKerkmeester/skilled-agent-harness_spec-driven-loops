# Iteration 1 — sk-code: testing the advisor report line by line

## Focus

Test every factual claim in `specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/scratch/sk-code-advisor-report.md` against the sk-code hub, its four mode packets and its hub-root JSON, and record where the report is right, wrong, or silent. Q1 (sk-code share) and Q2 (drift) are the target questions.

## Actions Taken

1. Inventoried the hub: `SKILL.md` 207 lines, `ROUTER.md` 394 lines, `hub-router.json` 83 lines, `mode-registry.json` 130 lines; packets `sk-code-review` 730, `sk-code-quality` 349, `sk-code-skilled` 226, `sk-code-ci` 111.
2. Read the hub `SKILL.md` §2 SMART ROUTING (§§52-139) and `ROUTER.md` §2 Intent Model, §3 Load Tiers, §9 Machine-Readable Router.
3. Read `hub-router.json` whole, and counted `aliases[]` per mode in `mode-registry.json`.
4. Grepped every packet's routing surface (`SMART ROUTING`, `INTENT_SIGNALS`, `RESOURCE_MAP`, `ON_DEMAND_KEYWORDS`, `Keyword triggers`).
5. Confirmed there is no ROUTER.md below hub root: `find .skilled/skills -mindepth 2 -name ROUTER.md` returns only the seven hub-root files.
6. Read the four readability passages the report quotes, verbatim, at their current lines.

## Findings

1. **sk-code restates stage-one mode selection in four live places plus one generated artifact.** The registry is named the source of truth at `SKILL.md:54`; the same selection is re-expressed as Python `route()` at `SKILL.md:76-134`; as weighted classes in `hub-router.json:24-39`; as a 40-line prompt-keyword row in `ROUTER.md:252` (CI_WORKFLOW); and as the compiled projection `.skilled/bin/compiled-route.cjs` invoked at `SKILL.md:56-60`. `mode-registry.json` itself carries only 4 modes, with 83 aliases across them (13 quality, 10 review, 5 skilled, 55 ci). [SOURCE: .skilled/skills/sk-code/SKILL.md:54] [SOURCE: .skilled/skills/sk-code/hub-router.json:21]

2. **ROUTER.md §2 and §9 have drifted in both directions, not one.** The report's claim that §2 lists TESTING (`ROUTER.md:57`) and LANGUAGE_STANDARDS (`ROUTER.md:60`) with "no §9 key" is confirmed: §9 `INTENT_SIGNALS` runs `IMPLEMENTATION, CODE_QUALITY, DEBUGGING, VERIFICATION, HOOKS, CONFIG, JAVASCRIPT, TYPESCRIPT, PYTHON, SHELL, RUST, CI_WORKFLOW` (`ROUTER.md:241-252`). The report missed the converse: five §9 intents — JAVASCRIPT, TYPESCRIPT, PYTHON, SHELL, RUST — have no §2 prose row at all, so the "byte-for-byte source" claim at `ROUTER.md:223` holds for neither direction. [SOURCE: .skilled/skills/sk-code/ROUTER.md:241]

3. **Three docs each claim a different routing authority.** `SKILL.md:54` says "`mode-registry.json` is the single source of truth"; `sk-code-review/SKILL.md:612` says "Keep Section 2 (`SMART ROUTING`) as the authoritative routing source"; `ROUTER.md:223` calls its §9 block "the byte-for-byte source a deterministic router parses". Only the third is measurably true — `parseRouter` reads the §9 block — so the other two are restatements that contradict the parser. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:612] [SOURCE: .skilled/skills/sk-code/ROUTER.md:223]

4. **The CI vocabulary is copied five times with three different sizes.** `hub-router.json:76-78` `code-ci-aliases` (55 keywords), `ROUTER.md:252` CI_WORKFLOW (61 keywords), `sk-code-ci/SKILL.md:62` (12 keywords), `mode-registry.json` `sk-code-ci.aliases` (55), plus the packet's `RESOURCE_MAP` at `sk-code-ci/SKILL.md:65`. The hub-router class and the registry alias list happen to agree today; the ROUTER.md row and the packet row do not, and the packet's own header admits the divergence is deliberate ("Every keyword is multi-word, so a bare 'workflow' never scores this surface", `sk-code-ci/SKILL.md:56`). [SOURCE: .skilled/skills/sk-code/hub-router.json:76] [SOURCE: .skilled/skills/sk-code/sk-code-ci/SKILL.md:62]

5. **The report's own inventory numbers are off and must be corrected before a plan quotes them.** It says `mode-registry.json`, "about 59 aliases"; the actual count is 83. It cites `hub-router.json:77` as a CI-vocabulary copy — line 77 is the `code-ci-aliases` keyword array, so the anchor is right but it is one class, not the class list. The direction of its conclusion survives; its quantities do not. [SOURCE: .skilled/skills/sk-code/mode-registry.json:1] [SOURCE: .skilled/skills/sk-code/hub-router.json:77]

6. **Two packets advertise routing the tooling does not read.** `sk-code-quality/SKILL.md:30` carries a 15-term "Keyword triggers:" line and `sk-code-quality/SKILL.md:154-156` calls the deterministic router-replay "retired", while `sk-code-skilled/SKILL.md:178` documents that same replay as the live leg-1..4 guard. One of the two statements is stale; the guard is the one that runs. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:154] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:178]

7. **Stage-two leaf choice has no runtime script, so the leaf map is model-only.** `compiled-route.cjs` emits packets (`hub-router.json:24-39` `resources: ["<packet>/SKILL.md"]`), and `leaf-manifest.json` is a generated, checked artifact with no router consumer — its readers are tests and the compiler (`compiled-route-admission.cjs`, `parent-skill-check-leaf-manifest.test.cjs`). So D4 (which leaf files) is decided by prose and by each packet's own machine block, never by a resolver. [SOURCE: .skilled/skills/sk-code/hub-router.json:24] [SOURCE: .skilled/skills/sk-code/leaf-manifest.json:1]

8. **Readability: routing precedes instructions and jargon precedes definition.** In `sk-code-review/SKILL.md` the SMART ROUTING section opens at line 49 and the first executable step block opens at line 67; the report's 364-line/50% measurement is consistent with the section boundaries I read. The opening sentence of `sk-code-quality/SKILL.md:15` reads verbatim: "`quality` is the author-side quality gate MODE child of the `sk-code` family. It runs after the acting agent applying `workflow-implement.md` changes the code and before the surface's verification workflow or done-claim." The hub's own opening is a four-metaphor sentence: "One skill, two axes, one shared surface-detection router, and one advisor identity." (`SKILL.md:15`). [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:15] [SOURCE: .skilled/skills/sk-code/SKILL.md:15]

## Questions Answered

- Q2, partly: three concrete drifts are located for sk-code (§2/§9 in both directions, the three-authority conflict, the five CI copies).

## Questions Remaining

- Q1 for sk-doc, sk-design, system-deep-loop (iterations 2-3).
- Q2 for those hubs.
- Q3, Q4, Q5 (per-skill), Q6.

## Next Focus

Iteration 2: sk-doc — its hub `SKILL.md` routing, `ROUTER.md`, `hub-router.json`, `mode-registry.json` and the routing surface of each mode packet; check whether sk-doc's separation rationale (`sk-doc/SKILL.md:65` per the report) holds and whether the same five restatements appear.

## SCOPE VIOLATIONS

None. Every write in this iteration landed under `specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/research/lineages/pi/`.
