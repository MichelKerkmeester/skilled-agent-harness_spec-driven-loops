# Iteration 21 — gpt-5.6-sol high — focus: playbooks

The minimal complete playbook expansion is seven hub-local compiled-routing scenarios, not a duplicate of every legacy routing case. The compiled layer is additive metadata over the legacy recommendation (`advisor-recommend.ts:362-371`), while the approved rollout preserves byte-identical decisions and requires staged per-hub verification (`012-default-on-decision/plan.md:57-60`, `:176-179`). Existing single-route, holdout, and disambiguation cases therefore remain behavior-identical.

The seven new scenarios should use each hub’s most discriminating route:

| Hub | New compiled-routing scenario | Existing behavior to reuse |
|---|---|---|
| `sk-code` | `surfaceBundle`: workflow first, OpenCode surface second | Existing single-surface and ambiguity prompts already cover OPENCODE, UNKNOWN, and mixed markers (`sk-code/manual-testing-playbook/manual-testing-playbook.md:184-214`). `surfaceBundle` is unique to this hub (`sk-code/hub-router.json:8-12`). |
| `mcp-tooling` | Explicit Figma + Refero `orderedBundle`, with ambiguous defer as a supplemental variant | The playbook already has six-mode single-route coverage and defer (`mcp-tooling/manual-testing-playbook/manual-testing-playbook.md:21-36`); the bundle is currently only a prose assertion, not a primary scenario (`hub-routing/refero-design-reference.md:30`). |
| `system-deep-loop` | Explicit mode-hint route, with a research + review `orderedBundle` supplemental variant | Individual modes and mode-hint behavior are already represented; the router declares single, ordered-bundle, and defer outcomes (`system-deep-loop/hub-router.json:5-13`) and gives mode hints precedence (`system-deep-loop/SKILL.md:59-76`). |
| `cli-external-orchestration` | Explicit OpenCode + Claude Code multi-executor bundle | Single executor and ambiguous-defer files already exist; multi-executor order is a distinct declared outcome (`cli-external-orchestration/hub-router.json:5-13`, `cli-external-orchestration/SKILL.md:64-66`). |
| `sk-prompt` | Zero-signal/default route to `prompt-improve`, followed by an explicit model route | This is the only hub with a non-null default. Its advertised `orderedBundle` needs a reachability decision because `bundleRules` is empty (`sk-prompt/hub-router.json:5-14`). |
| `sk-design` | The explicit `interface + foundations` UI-build bundle | Individual modes, mode hints, and fallback already have files. The bundle is machine-declared (`sk-design/hub-router.json:17-22`) and documented as an ordered bundle (`sk-design/SKILL.md:188`). |
| `sk-doc` | The explicit `create-skill + create-quality-control` bundle | Existing intent and holdout prompts remain valid. The bundled route is machine-declared but lacks a matching primary playbook scenario (`sk-doc/hub-router.json:14-19`). |

Each new file should have one primary nine-column scenario and use supplemental checks for the variants; the template explicitly permits that structure (`create-manual-testing-playbook/assets/manual-testing-playbook-template.md:388-418`). Its execution matrix should cover default/unset compiled serving, explicit `SPECKIT_COMPILED_ROUTING=0`, drift fallback, and resolver failure while asserting identical targets. Run the primary case with GPT-5.6 LUNA HIGH and record both model and reasoning configuration.

Two previously unnamed gaps matter:

1. The current global evidence contract records advisor top-1, confidence, gap, and status, but not `compiledRoute`, `servingAuthority`, fallback cause, flag state, or manifest identity (`sk-code/manual-testing-playbook/manual-testing-playbook.md:82-90`). A scenario could therefore pass while never exercising compiled routing, even though the advisor exposes the compiled decision (`advisor-recommend.ts:362-371`).
2. The canonical template states that validation does not recurse into per-feature files (`create-manual-testing-playbook/assets/manual-testing-playbook-template.md:448`). Without a dedicated matrix validator, one missing hub scenario or missing authority assertion will not block release.

Ranked actions:

1. Add one `compiled-routing/` scenario file and root-index entry to each of the seven hub playbooks. Make each primary scenario exercise the hub-specific route above.
2. Extend every scenario’s evidence contract with flag state, serving authority/status, compiled targets, legacy targets, fallback cause, manifest digest, model, and reasoning effort.
3. Add a validator that requires exactly the seven hub IDs and the four authority-state variants; do not depend on the current non-recursive document validator.
4. Resolve `sk-prompt`’s advertised-but-unmapped ordered-bundle outcome before authoring that case: add a reachable rule and scenario, or remove the dead outcome.
5. Reuse existing single-route, holdout, and defer prompts unchanged; cloning them would increase maintenance without testing new behavior.

===FINDINGS-JSON-START===
[
  {"id":"F-21-1","area":"playbooks","finding":"Legacy route, holdout, and disambiguation cases are behavior-identical under compiled serving, so the new matrix should test serving authority rather than duplicate routing semantics.","evidence":".opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-recommend.ts:362","severity":"P0","actionable":"Add one compiled-routing scenario per eligible hub that compares compiled and legacy targets while varying default-on, explicit =0, drift, and resolver-failure states.","novelty":"new"},
  {"id":"F-21-2","area":"playbooks","finding":"The minimal complete hub matrix is seven primary scenarios selected by distinct route shape: sk-code surfaceBundle, three generic ordered bundles, sk-prompt default routing, and the explicit sk-design and sk-doc bundle rules.","evidence":".opencode/skills/sk-code/hub-router.json:8","severity":"P0","actionable":"Create one hub-local compiled-routing scenario file for each of the seven allowlisted hubs and place secondary authority-state checks under Optional Supplemental Checks.","novelty":"new"},
  {"id":"F-21-3","area":"playbooks","finding":"The current playbook evidence contract can pass without proving that compiled routing ran because it records advisor ranking but not compiledRoute, serving authority, flag state, fallback cause, or manifest identity.","evidence":".opencode/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:82","severity":"P0","actionable":"Add compiledRoute, serving-status, flag, fallback-cause, manifest-digest, model, and reasoning-effort fields to the global evidence requirements and every new scenario.","novelty":"new"},
  {"id":"F-21-4","area":"playbooks","finding":"mcp-tooling's Figma-plus-Refero ordered bundle is only a prose supplemental assertion while its primary corpus consists of single routes and defer, so it cannot provide primary compiled bundle evidence.","evidence":".opencode/skills/mcp-tooling/manual-testing-playbook/hub-routing/refero-design-reference.md:30","severity":"P1","actionable":"Promote the explicit Figma-plus-Refero request into the primary row of the new mcp-tooling compiled-routing scenario and retain ambiguous-defer as a supplemental variant.","novelty":"new"},
  {"id":"F-21-5","area":"unnamed","finding":"sk-prompt advertises orderedBundle while declaring no bundle rules, leaving the branch's reachability undefined and making a required manual scenario impossible to specify deterministically.","evidence":".opencode/skills/sk-prompt/hub-router.json:8","severity":"P1","actionable":"Prove a deterministic dual-intent route and add its rule plus scenario, or remove orderedBundle from the advertised outcomes before cutover.","novelty":"new"},
  {"id":"F-21-6","area":"sk-doc-templates","finding":"The canonical playbook validator does not recurse into per-feature files, so it cannot enforce seven-hub matrix completeness or the compiled-routing evidence fields.","evidence":".opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual-testing-playbook-template.md:448","severity":"P1","actionable":"Add a dedicated compiled-routing playbook validator that requires all seven hub scenario IDs, one primary nine-column row per file, and every authority-state evidence field.","novelty":"new"}
]
===FINDINGS-JSON-END===

