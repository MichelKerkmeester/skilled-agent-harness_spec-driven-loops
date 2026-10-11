# Iteration 9: Consumer and externality checks — sk-doc Lane A branch, retrieval corpus fixtures, package privatization, full script-caller sweep

## Focus

Complete the consumer map: sk-doc's `sk-create-benchmark` Lane A branch and sk-doc-level indexes; the system-spec-kit retrieval corpus fixtures that enumerate the packet; the full sweep of callers for every Lane A and shared packet script from outside the two improvement modes; distribution/externality evidence (package privatization, published artifacts); dist surfaces; and the remaining cli-external-orchestration playbook surface.

## Actions Taken

1. Swept 19 packet script names across `.skilled` excluding the packet and hub runtime, collecting the outside callers per script.
2. Line-level greps across sk-doc (`mode-registry.json`, `leaf-manifest.json`, `ROUTER.md`, `agent-template.md`, `max-load.md`) and `sk-create-benchmark` (SKILL.md, README.md, playbook, references tree).
3. Checked `.skilled/skills/system-spec-kit/runtime/cli/dist` for mode tokens (negative) and the retrieval fixtures `corpus-manifest.json` / `generation-diagnostics.json`.
4. Read both package manifests (`@spec-kit/system-deep-loop`, `@deep-loop/runtime`) for `private` flags and publish surface.
5. Confirmed the per-runtime task-dispatch dirs (claude/cursor/devin/opencode/pi) carry no mentions.

## Findings

1. **sk-doc's `sk-create-benchmark` packet owns a whole Lane A authoring branch** — `references/agent-improvement/agent-improvement-authoring-guide.md` (DELETE), `manual-testing-playbook/evidence-and-boundaries/prepare-lane-a-inputs.md` (Lane A playbook scenario; DELETE or retarget), with the branch wired through `SKILL.md` (lines 18, 93-94, 150, 478-481, 527, 534, 538, 549, 554), `README.md` (36, 44-45, 100, 126) and the playbook (3, 106: "deep-improvement lane owns scoring and promotion"). Disposition: DELETE the Lane A reference + lane playbook; EDIT the shared SKILL/README/playbook surfaces. [SOURCE: .skilled/skills/sk-doc/sk-create-benchmark/SKILL.md:150]
2. **sk-doc-level indexes carry the mode** — `sk-doc/mode-registry.json:310-311` (keywords "agent-improvement", "Lane A agent-improvement"), `leaf-manifest.json:24` (the authoring-guide leaf), `ROUTER.md:294` (the same leaf in the resource map), `sk-create-agent/assets/agent-template.md:749` (`@deep-improvement` roster row), `manual-testing-playbook/token-cost-baseline/max-load.md:21,162`. Disposition: EDIT all five surfaces (the reference file itself deletes per finding 1). [SOURCE: .skilled/skills/sk-doc/mode-registry.json:310]
3. **The system-spec-kit retrieval corpus fixtures enumerate the lane's files** — `corpus-manifest.json` lists `.skilled/skills/sk-doc/sk-create-benchmark/references/agent-improvement/...` (line 6142) and the packet's `assets/agent-improvement/*` (lines 6910-6911 and following); `generation-diagnostics.json` lists the lane scenario, runtime libraries and more (lines 31498, 32693, 32969-32983). Disposition: EDIT by regeneration (fixtures follow the corpus; regenerate after deletion). [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:6910]
4. **Nothing outside the repository consumes the mode through published packages** — both owning manifests are private: `@spec-kit/system-deep-loop` (`"private": true`) and `@deep-loop/runtime` (`"private": true`, self-contained dependency root). No npm-publishable surface names the mode or the agent; the only cross-repo artifact is the in-repo CI workflow and hooks already inventoried. Boundary: consumption beyond this checkout cannot be observed from inside it. [SOURCE: .skilled/skills/system-deep-loop/package.json:4]
5. **No compiled bundle under `system-spec-kit/runtime/cli/dist` mentions the mode** — a token sweep over dist returns nothing; the mode's compiled-adjacent surfaces are the compiled-routing compiler/fixtures (iteration 5) and the TypeScript lane libraries (iteration 3), not a dist bundle. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/dist]
6. **Full script-caller sweep closes the outside-mode caller list** — outside the packet, commands and both improvement modes, the callers are: the mirror checker (hooks/CI/CROSS-CLI/sk-code checklist/drill, iteration 5); `.skilled/agents/deep-improvement.md` naming Lane A scripts; the Lane A command assets; changelogs (history); and the retrieval fixtures (finding 3). No additional live consumer surfaced for `score-candidate`, `generate-profile`, `scan-integration`, `trade-off-detector`, `check-mirror-drift`, `benchmark-stability`, `candidate-lineage`, `materialize-benchmark-fixtures`, `promote-candidate`, `improvement-journal`, `mutation-coverage`, `fixture-lint`, `check-dispatch-cap`, `extract-deliverable`, `promotion-receipts`, `rubric-guard` or `model-family`. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json:32969]
7. **The cli-opencode multi-agent playbook scenario names the lane among the roster slugs** — `manual-testing-playbook/agent-routing/orchestrate-agent-multi-agent.md` lines 31 and 50 (the multi-agent decomposition scenario text). Disposition: EDIT. [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/orchestrate-agent-multi-agent.md:31]
8. **The per-runtime task-dispatch directories carry no mode mentions** — `.skilled/hooks/task-dispatch/{claude,cursor,devin,opencode,pi}` are clean; the guard logic and fixtures live in `lib/` and the README (iteration 5). [SOURCE: .skilled/hooks/task-dispatch/]
9. **sk-create-benchmark history files** — the packet's changelog v1.0-1.5 files record the Lane A guide's evolution. Disposition: KEEP-AS-HISTORY. [SOURCE: .skilled/skills/sk-doc/sk-create-benchmark/changelog/v1.5.0.0.md]

## Ruled Out

- Searching for a published or externally installed copy of the mode: both manifests are private with no publish path, so there is no package-level external consumer to inventory.

## Dead Ends

- `system-spec-kit/runtime/cli/dist` as a compiled home of the mode (verified empty of matches).

## Edge Cases

- Ambiguous input: "outside this repository consumes the mode" cannot be fully answered from inside the checkout; recorded with the package-privatization evidence and the explicit boundary.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- 19-script sweep across .skilled (caller lists)
- .skilled/skills/sk-doc/mode-registry.json:310-311; leaf-manifest.json:24; ROUTER.md:294; sk-create-agent/assets/agent-template.md:749; manual-testing-playbook/token-cost-baseline/max-load.md:21,162
- .skilled/skills/sk-doc/sk-create-benchmark/SKILL.md:18,93-94,150,478-481,527,534,538,549,554; README.md:36,44-45,100,126; manual-testing-playbook/manual-testing-playbook.md:3,106
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:6142,6910-6911; generation-diagnostics.json:31498,32693,32969-32983
- .skilled/skills/system-spec-kit/runtime/cli/dist (negative)
- .skilled/skills/system-deep-loop/package.json:4; .skilled/skills/system-deep-loop/runtime/package.json:6
- .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/orchestrate-agent-multi-agent.md:31,50
- .skilled/hooks/task-dispatch/ (negative)

## Assessment

- New information ratio: 0.9
- Questions addressed: KQ5 (out-of-mode consumers incl. externality), KQ1 (sk-doc and retrieval-fixture surfaces)
- Questions answered: the externality half of KQ5 is now answered within observable bounds (no published consumer; boundary recorded)

## Reflection

- What worked and why: the per-script caller sweep caught the retrieval fixtures and the sk-doc guide that a mode-token sweep had missed because the fixture JSON keys differ.
- What did not work and why: nothing failed; long single-line JSON fixtures again required max-columns handling.
- What I would do differently: in the final iteration, fold the caller-map and classification into one index table so the synthesis can lift it directly.

## SCOPE VIOLATIONS

- None.

## Recommended Next Focus

Iteration 10: tests, validators and doctor checks covering the touched surfaces — deep-loop runtime vitest suites, system-skill-advisor drift guard + command-bridges guard, hook tests, plugin tests, goldens/fixtures, `git-hooks` tests, `.skilled/bin` compiled-routing tests, doctor checks, and the CI workflows that run them; plus final consolidation of the SHARED-WITH-MODEL-BENCHMARK classification.
