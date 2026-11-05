# Evidence for the spec docs (orchestrator-verified)

Operator request (2026-11-05): "Deprecate sk design fundamentals and upgrade sk code front end with missing useful logic that would get lost if only deprecating without upgrade sk code front end and fix sk design chart and other design modes that have same issue" (issue = a skill references research; a skill only mentions the work it is for). Executor named by operator: DeepSeek v4.1 flash max via llmgateway.

Operator decisions (2026-11-05, structured question):
- Spec folder: new packet specs/sk-design/021-deprecate-fundamentals.
- Workspace: git worktree worktrees/316-deprecate-design-fundamentals.
- Fundamentals folder: remove and unroute (git history keeps it).
- Non-screen guidance (slides, print, document layouts): "Inline into chart/diagram" = copy only the colour and type scales chart and diagram need, drop slides/print. Finding: chart owns a measured type scale (sk-design-chart/references/template-contract.md "The type scale") and diagram owns a 4px grid (sk-design-diagram/SKILL.md:111); neither linked to fundamentals, so nothing was copied and the slides/print guidance was dropped.

Baseline (worktree HEAD 10474a9567, before edits):
- parent-skill-check sk-design: "OK: parent-skill-check — all hard invariants passed, 0 warnings", exit 0.
- parent-skill-check sk-code: same OK line, exit 0.
- compiled-route --hub sk-design "what padding should this card have" -> route single sk-design-fundamentals.
- compiled-route --hub sk-code for five value prompts (padding, type scale, palette, looks wrong, dropdown animation) -> defer, no targets.
- advisor: "what padding should this card have" -> sk-design 0.65.

PHASE 001 frontend-upgrade (sk-code side)
- New: sk-code/sk-code-frontend/references/web-visual-values.md (566 lines, items V1-V41), web-visual-hierarchy.md (618 lines, items H1-H36+), web-motion-and-interaction.md (authored by DeepSeek dispatch 3).
- Moved: sk-design-fundamentals/assets/tokens.css -> sk-code/sk-code-frontend/assets/tokens.css (git mv), header no longer cites a book.
- Each new file authored by one DeepSeek dispatch (llmgateway/deepseek-v4.1-flash-1017#max, OpenCode v2.2.5), briefs in 001-frontend-upgrade/scratch/task-{1,2,3}.md. Orchestrator verified each: validate_document.py VALID 0 issues; leak grep (fundamentals|sk-design|refactoring|research|specs/|slide|print|em dash) empty; spacing/type/opacity scales byte-exact; diagnosis rows 40/40, review rows 21/21, UX laws 21/21.
- Focus-ring conflict fixed: old guidance said use box-shadow not outline; a shadow vanishes in forced-colors mode (web-accessibility-patterns.md A8). New files link A5/A8 instead.
- Router: sk-code-frontend/ROUTER.md adds intents WEB_VISUAL_VALUES, WEB_VISUAL_HIERARCHY, WEB_MOTION; WEB_A11Y gains six phrases. sk-code/hub-router.json adds vocabulary class code-frontend-visual to sk-code-frontend routerSignals. sk-code/graph-metadata.json intent_signals +88 screen-design phrases moved from sk-design.
- Repointed links: frontend-practice.md (principle 11, section 3), web-markup-and-css.md, figma-to-code.md, sk-code SKILL.md and README.md.
- Versions: sk-code hub 3.10.2.0 -> 3.11.0.0, sk-code-frontend 1.0.4.0 -> 1.1.0.0, changelogs written.

PHASE 002 retire-fundamentals (sk-design side)
- Deleted sk-design/sk-design-fundamentals/ (git rm).
- sk-design mode-registry.json, hub-router.json (defaultMode null, tieBreak, classes design-decisions/design-review removed), ROUTER.md (VALUES/REVIEW intents removed), SKILL.md (three modes), description.json, command-metadata.json, graph-metadata.json (fundamentals and slides/print phrases removed; 219 -> 111 intent_signals; derived summary rewritten), leaf-manifest.json regenerated.
- design agent (.skilled/agents/design.md, .claude/agents/design.md and generated codex/pi/hermes mirrors) decide path points at the sk-code-frontend references.
- Repointed: mcp-figma SKILL.md and three playbook files, md-generator numeric-design-laws.md, root README.md, sk-design benchmark/README.md, sk-doc parent-skills-nested-packets.md, hub playbook prompts (assets-only, ambiguous-multi-intent).
- Compiled routing: bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design registry-compiler.cjs drops VALUES/REVIEW owners; canary-cases.v1.json drops the two fundamentals cases and turns out-of-domain-default into out-of-domain-defer.
- Versions: sk-design hub 2.0.11.0 -> 3.0.0.0 (breaking: a mode removed), mcp-figma 1.2.1.0 -> 1.2.2.0, changelogs written.

PHASE 003 chart-research-cleanup
- sk-design-chart references/color-system.md, catalog.md, template-contract.md and assets/style-reference/evilcharts/origin.md: removed [SOURCE: specs/...research.md] citations, "Phase 13", "this phase", "from the research", "another packet's research context". Every rule they backed is kept and stated on its own.
- Sweep of all sk-design modes found no other research leak; remaining hits are changelog "Spec folder:" lines (changelog format), a dated benchmark run report, and style-library site descriptions that use the word "research" about the sites.
- validate_document.py VALID 0 issues on all four files. Version 0.23.6.0 -> 0.23.7.0, changelog written.

GATE RESULTS: (appended below after the final gate run)
- parent-skill-check sk-design / sk-code / mcp-tooling (hub path passed explicitly, subject line reads the worktree hub): "OK: parent-skill-check — all hard invariants passed, 0 warnings", exit 0 each. sk-design legs: 6b "every registered mode (3) appears in the hub SKILL.md mode table", 10b leaf manifest byte-identical, 13a version 3.0.0.0.
- sk-code drift guards (sk-code-skilled/scripts/run-all-drift-guards.sh): "all 4 guards PASSED, 11 non-blocking warning(s)" (main baseline: same 4 PASSED, 11 warnings). First run failed check 2 (root ROUTER.md RESOURCE_MAP missing the three new frontend intents); fixed by mirroring the intents into sk-code/ROUTER.md.
- compiled-route-sync --check: "all 55 served copies match their authored files"; --verify: "move-simulation OK: all 7 hubs resolve". Manifests reminted for sk-design, sk-code, mcp-tooling and copied to their authored paths under specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/ (same practice as commit a5a25d88ef). compiled-route-status --all: every hub compiled-serving.
- Stage-one replay (skill_advisor.py, cache refreshed): padding -> sk-code 0.63; type scale -> sk-code 0.88; palette -> sk-code 0.88; "why does this screen look wrong" -> sk-code 0.90; dropdown animation -> sk-code 0.82; "looks amateur" -> sk-code 0.90; focus outline removed -> sk-code 0.93; chart -> sk-design 0.89; flowchart -> sk-design 0.82; extract tokens -> sk-design 0.95.
- Stage-two replay (compiled-route --hub sk-code): all eight value/review/motion prompts -> route sk-code-frontend; "fix the failing vitest suite" -> sk-code-skilled (unchanged). sk-design: chart -> sk-design-chart, extract -> sk-design-md-generator, no-signal -> defer.
- ci-router-vocabulary-reach (all 7 hubs): RESULT PASSED, wrong-hub=0 outranked=0 no-reach=0. Declared phrases sk-code 94 -> 172, sk-design 120 -> 84.
- generate-router-intent-signals --check sk-code and sk-design: orphans=0 missing=0, PASSED.
- check-markdown-links: "0 broken markdown links" (14494 links).
- Mirrors: codex sync-agents, pi sync-agents-pi, hermes sync-skills-hermes regenerated, then --check PASS each; runtime-mirrors --check PASS (213 mirrors). Hermes pruned its sk-design-fundamentals copy.
- sk-doc README tests: test_readme_manifest.py and test_readme_verdict_parity.py exit 0 after removing only the three deleted directories / README rows from their fixtures.
- .skilled/bin/tests: 14/14 exit 0, identical to main.
- sk-design-chart check-corpus.cjs RESULT PASSED errors 0; chart tests apply-design-md, corpus-mutations, typo-flags exit 0.
- validate_document.py VALID 0 issues on the three new references, the four chart files and five changelogs.

LATER EDITS (after the first gate pass, all re-verified):
- Phase 001: web-motion-and-interaction.md is 642 lines, items M1-M57, validate_document VALID. Added playbook scenario sk-code-frontend/manual-testing-playbook/frontend-surface/visual-values.md (WEB_VISUAL_VALUES happy path); validate-playbook-package PASS scenarios=3 violations=0; verify-router-sync check 4 PASS. sk-code-frontend README.md and references/frontend-practice.md section 6 now list the three visual topic files. Root sk-code/ROUTER.md mirrors the three new intents (router-sync check 2).
- Phase 002: sk-doc sk-create-skill assets/skill/skill-procedure-template.md and references/skill/examples-and-maintenance.md now say sk-design has three workflow modes. parent-skill-check sk-doc OK, sk-doc route manifest still fresh. Advisor regression suite (skill-advisor-regression-cases.jsonl, inprocess): worktree 42/42 cases pass, top-1 1.0; main baseline 39/42, top-1 0.9189. Both report overall_pass false from the minimum-case-count gate, not from a failing case.
