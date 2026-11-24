# Review Iteration 006

## Dispatcher

- Mode: review, single iteration, LEAF-only (no sub-agent dispatch)
- Lineage: `vibe-1`, sessionId `fanout-vibe-1-1795511024070-2cuwlj`, generation 1, lineageMode `new`
- Executor: cli-mistral-vibe, model deepseek-flash (in-process; the fan-out lineage is its own executor)
- Dimension: traceability, second pass
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change. This iteration addressed the focus by running the four overlay protocols the strategy declares -- `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` and `playbook_capability` -- each as an executed check rather than a prose read, and by testing whether the two routing stages advertise the same vocabulary.
- Sources read this iteration: `steer.md` (absent, so no lead ruling applies), `review-scope-files.txt`, `goal.md`, `.skilled/skills/mcp-browser-use/{SKILL.md,README.md,ROUTER.md,mode-registry.json,hub-router.json,graph-metadata.json,description.json,leaf-manifest.json}`, `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md`, `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/*.md`, `.skilled/skills/mcp-browser-use/mcp-bladebro/{SKILL.md,ROUTER.md,references/cli-reference.md,references/install-and-verify.md,feature-catalog/install-and-health/teardown-and-rollback.md}`, `.skilled/skills/mcp-browser-use/mcp-aside-devtools/manual-testing-playbook/devtools-parity/console-network-capture.md`, `.claude/skills/mcp-browser-use/`, `.claude/skills/mcp-tooling/`

## Files Reviewed

- `.skilled/skills/mcp-browser-use/SKILL.md:1-26`
- `.skilled/skills/mcp-browser-use/README.md:8`
- `.skilled/skills/mcp-browser-use/mode-registry.json:15`
- `.skilled/skills/mcp-browser-use/mode-registry.json:39`
- `.skilled/skills/mcp-browser-use/hub-router.json:1-120`
- `.skilled/skills/mcp-browser-use/graph-metadata.json:1`
- `.skilled/skills/mcp-browser-use/leaf-manifest.json:1`
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md:87-165`
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/holdout-browser-inspect.md:2-5`
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/holdout-agentic-browser.md:2-5`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md:34-52`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md:83`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/manual-testing-playbook/devtools-parity/console-network-capture.md:15-41`
- `.claude/skills/mcp-browser-use/` (312 files, compared against canonical)
- `.claude/skills/mcp-tooling/` (compared against canonical)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

- `spec_code` -- pass. Goal criterion 2 holds: `mode-registry.json` lists three modes and `mcp-tooling` lists six. Goal criterion 3 holds: no browser id residue in the five named `mcp-tooling` files. Goal criterion 4 holds: `parent-skill-check.cjs` exits 0 and names the hub. Goal criterion 6 holds: three playbooks with recorded runs, including the Bladebro macOS live run.
- `checklist_evidence` -- pass. Phase 015 criterion 3's replay half is the one item this lineage cannot execute, because `validate.sh --strict --recursive` is banned by the write surface; it is recorded as unverified rather than passed.
- `skill_agent` -- pass. The hub declares no agent binding and claims none. `mode-registry.json:15` states the contract in the schema itself: "No mode has a dedicated command, so command is null on every entry", and all three entries at `:39`, `:72` and `:110` carry `command: null`. So there is no agent or command surface the hub promises and does not ship.
- `agent_cross_runtime` -- pass. `.claude/skills/mcp-browser-use` and `.claude/skills/mcp-tooling` both exist as runtime mirrors, each carries the same 312 and matching file counts as its canonical tree, and `diff -rq` between canonical and mirror returns no differences for either. The mirror `SKILL.md` and `mode-registry.json` both read `1.1.3.0`, so the mirror is not stale against the canonical version.
- `feature_catalog_code` -- pass. Every Bladebro command the feature catalog names resolves to a documented command: `bladebro doctor` at `mcp-servers/bladebro-cli/README.md:64`, `bladebro stop` at `SKILL.md:178`, `bladebro rb` at `SKILL.md:177`, `bladebro mcp` at `assets/utcp-bladebro-manual.md:39`, `bladebro -u` at `INSTALL-GUIDE.md:24`, `bladebro --rollback` at `references/install-and-verify.md:83`, and `bladebro vision` at `SKILL.md:175`. The five tools the CLI reference declares (`act`, `see`, `state`, `run`, `vision`) are the same five the packet's `mcp-servers/bladebro-cli/README.md:24` names.
- `playbook_capability` -- pass. The hub playbook index carries five `MT-` scenarios and the `hub-routing/` folder carries the same five plus two holdouts, `MT-H01` and `MT-H04`, whose own frontmatter ids match the index links at `manual-testing-playbook.md:152` and `:165`. The Aside parity scenario `ASD-018` is capability-honest: it records that `page.on('console'|'request'|'response')` throws on `1.26.626.1517`, and its own pass/fail line makes a verdict that claims a native console tool or HAR export a FAIL. So the scenario tests a capability the mode has and fails a claim it does not.

## Integration Evidence

- `.skilled/skills/mcp-browser-use/hub-router.json:1-120` -- `routerPolicy.discoveryClasses` names `hub-identity` and `generic-browser-automation`, and `discoveryClassesContract` states that no mode's scoring classes reference them, so a prompt matching only discovery vocabulary scores zero modes and defers. `routerSignals` references only the six scoring classes across the three modes. This is the surface that decides whether a stage-one signal can reach a stage-two mode.
- `.skilled/skills/mcp-browser-use/mode-registry.json:15` -- the schema description that carries the `command: null` contract, which is what makes the `skill_agent` protocol checkable rather than a prose claim.
- `.claude/skills/mcp-browser-use/` and `.claude/skills/mcp-tooling/` -- the two runtime mirrors. `diff -rq` against `.skilled/skills/` returns no output for either, so the packaging surface is byte-identical to canonical.
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/holdout-browser-inspect.md:5` and `holdout-agentic-browser.md:5` -- the `id: MT-H01` and `id: MT-H04` frontmatter that the index links at `manual-testing-playbook.md:152` and `:165` resolve to.

## Edge Cases

- The two routing stages do not advertise the same vocabulary, and that is by design rather than drift. `graph-metadata.json` carries 86 `intent_signals`; the router scores 88 keywords across six scoring classes. Six signals exist only on the advisor side (`agentic browser task`, `chrome devtools orchestration`, `browser debugger cli`, `click through the ui`, `click through the page`, `click through the app`) and eight keywords exist only on the router side (`mcp-browser-use`, `mode-registry`, `hub-router`, `browser automation`, `automate the browser`, `web browser`, `chrome-devtools`, `chrome_devtools_live`). Four of the six advisor-only signals were run end to end: `agentic browser task` returns the hub at 0.95 and then defers, and the three `click through the …` prompts return the hub at 0.9306 and then defer. That is the documented discovery path, not a defect -- see Ruled Out.
- `validate.sh --strict --recursive` remains unexecuted. It is goal criterion 7 and phase 015 criterion 3's other half, and the write surface bans it. Recorded as unverified in every iteration that touches it rather than counted as a pass.
- The `leaf-manifest.json` leaf objects do not carry a `path` key, so the earlier "all 17 leaves resolve" check resolved them through the packet field rather than a per-leaf path. The count is 7 Aside, 5 Bladebro and 5 Chrome DevTools, which matches the three packets' leaf sets.

## Confirmed-Clean Surfaces

- Both runtime mirrors are byte-identical to canonical: `diff -rq .skilled/skills/mcp-browser-use .claude/skills/mcp-browser-use` and the same for `mcp-tooling` both return no output, at 312 files each.
- All 29 relative markdown links across the hub `README.md`, `SKILL.md`, `ROUTER.md` and the playbook index resolve on disk. No broken cross-reference.
- The hub declares no agent or command binding and ships none: `command: null` on all three mode entries, stated as the contract in the schema description.
- Every Bladebro command the feature catalog names is documented in the packet, and the five-tool set is stated identically in the CLI reference and the CLI README.
- The playbook index and the `hub-routing/` folder agree on all seven scenario ids, including the two holdouts.
- The Aside parity scenario is capability-honest about the `page.on` gap and fails a verdict that overclaims.

## Ruled Out

- "The six advisor-only intent signals are stage-one/stage-two drift": ruled out. `hub-router.json` `routerPolicy.discoveryClassesContract` states that discovery classes are hub discovery and defer evidence only, and `ROUTER.md:30` says a bare agentic request belongs to neither Aside nor Bladebro. The advisor brings a generic browser request to the hub so the hub can ask which mode the reader means, which is the documented purpose of the `defer` outcome. The four probes that defer are the design working, not failing.
- "The eight router-only keywords are missing from the advisor metadata": ruled out for the same reason in the other direction. `mcp-browser-use`, `mode-registry` and `hub-router` are hub identity, which the canary case `hub-identity-defer` requires to defer; `browser automation`, `automate the browser` and `web browser` are the generic class the hub must not score.
- "The runtime mirrors have drifted from canonical": ruled out, `diff -rq` returns no output for either skill.
- "The hub promises an agent or slash command it does not ship": ruled out, `command: null` on every mode entry and stated as the contract.
- "A feature-catalog claim names a command that does not exist": ruled out for all seven Bladebro commands checked.
- "The playbook index and the scenario files disagree on ids": ruled out, all seven ids match including `MT-H01` and `MT-H04`.
- "The Aside parity scenario overclaims console or network capture": ruled out, the scenario records the `page.on` throw and fails a verdict that claims a native tool or HAR export.
- "The hub README version is consistent with the rest of the metadata": not ruled out -- `README.md:8` still reads `1.1.4.0` against `1.1.3.0` in `SKILL.md`, `hub-router.json`, `mode-registry.json` and `description.json`. This is the carried P2 `R1-P2-001`, re-confirmed active this iteration.

## Next Focus

- Dimension: cross-reference, convergence pass
- Focus area: the two active P1 findings read against each other and against the carried P2 set, plus the one goal criterion this lineage cannot execute
- Reason: every dimension has now been covered twice except maintainability, and the run is at iteration 7 of 7, so the last iteration is the cross-reference pass the strategy reserves for a full rotation
- Rotation status: correctness twice, traceability twice, security once, maintainability once; this is the final iteration before synthesis
- Blocked/productive carry-forward: productive -- executing the check rather than reading the prose found the one new P1 of the run and retired six suspected findings
- Required evidence: for each active finding, whether it is still active at the shipped files, and for criterion 7, the exact reason it cannot be executed inside this lineage

Review verdict: CONDITIONAL
