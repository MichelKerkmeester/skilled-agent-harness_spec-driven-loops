# Review Iteration 003

## Dispatcher

- Mode: review, single iteration, LEAF-only (no sub-agent dispatch)
- Lineage: `vibe-1`, sessionId `fanout-vibe-1-1795511024070-2cuwlj`, generation 1, lineageMode `new`
- Executor: cli-mistral-vibe, model deepseek-flash (in-process; the fan-out lineage is its own executor)
- Dimension: traceability
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change. This iteration addressed the focus directly: it ran each of the goal's seven completion criteria against the shipped files, and it read the advisor 2.0.3.0 changelog's four claims against the hub metadata and the advisor's own scorer.
- Sources read this iteration: `steer.md` (absent, so no lead ruling applies), `review-scope-files.txt`, `goal.md`, `015-fix-follow-up-review-findings/goal.md`, `015-fix-follow-up-review-findings/tasks.md`, `015-fix-follow-up-review-findings/implementation-summary.md`, `002-hub-scaffold/spec.md`, `005-routing-and-surfaces/spec.md`, `006-verification/implementation-summary.md`, `001-research/research/deep-research-state.jsonl`, `001-research/research/research.md`, `.skilled/skills/mcp-tooling/{mode-registry.json,hub-router.json,leaf-manifest.json,SKILL.md,README.md}`, `.skilled/skills/mcp-browser-use/{graph-metadata.json,description.json}`, `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md`, `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/*.md`, `.skilled/skills/system-skill-advisor/changelog/v2.0.3.0.md`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`, `.skilled/commands/doctor/scripts/parent-skill-check.cjs`, `.skilled/bin/skill-advisor.cjs`

## Files Reviewed

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:1-140`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/deep-research-state.jsonl:1`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:1`
- `.skilled/skills/mcp-tooling/mode-registry.json:1`
- `.skilled/skills/mcp-tooling/hub-router.json:1`
- `.skilled/skills/mcp-tooling/leaf-manifest.json:1`
- `.skilled/skills/mcp-tooling/SKILL.md:1`
- `.skilled/skills/mcp-tooling/README.md:1`
- `.skilled/skills/mcp-browser-use/graph-metadata.json:1`
- `.skilled/skills/mcp-browser-use/description.json:1`
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md:1`
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/ambiguous-defer.md:1`
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/aside-browser-automation.md:1`
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/holdout-agentic-browser.md:1`
- `.skilled/skills/system-skill-advisor/changelog/v2.0.3.0.md:1-45`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:110-113`
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. One prior P1 is downgraded this iteration; see the P2 section and the adjudication below.

### P2 Findings

1. **Prior finding R1-P1-001 downgraded from P1 to P2: the doc claim is still wrong, but the routing consequence it predicted does not reproduce** -- `.skilled/skills/mcp-browser-use/ROUTER.md:33` -- Iteration 1 rated this P1 on the reach "a frontend performance prompt lifts the hub in stage one". This iteration ran that reach against the live advisor and it did not reproduce: the prompt `improve the core web vitals of my landing page` returns `sk-code` at confidence 0.9295 with `sk-code-frontend` as the compiled target, not `mcp-browser-use`. The contradiction itself stands -- `graph-metadata.json` `intent_signals` does carry `core web vitals` while `ROUTER.md:33` says the phrase is "not advertised to the advisor" -- so the doc line is still factually wrong and still worth a one-line fix. What does not stand is the severity: the phrase is one of 86 intent signals, it does not win stage one on its own, and no gate reads the claim.
   - Case: a reader trusts `ROUTER.md:33` and concludes the advisor cannot see Core Web Vitals for this hub; the metadata says otherwise, so the reader's model of stage one is wrong even though the routing outcome happens to be right.
   - Finding class: instance-only
   - Scope proof: the live advisor run is the counterevidence, and `rg -n "core web vitals" .skilled/skills/mcp-browser-use` still returns the same two metadata sites plus the one prose claim, so the contradiction is unchanged in scope and only its impact is smaller.
   - Affected surface hints: ["ROUTER.md intent model", "graph-metadata.json intent_signals"]
   - Claim adjudication:
     ```json
     {"type":"claim","claim":"ROUTER.md:33 contradicts graph-metadata.json intent_signals on whether Core Web Vitals is advertised to the advisor, but the predicted routing consequence does not reproduce, so the finding is documentation drift rather than a routing defect.","evidenceRefs":["ROUTER.md:33","graph-metadata.json:1","hub-router.json:118"],"counterevidenceSought":"Ran the advisor on the exact reach the P1 named. `improve the core web vitals of my landing page` returns sk-code at 0.9295 with sk-code-frontend as the compiled target, so the hub does not win stage one.","alternativeExplanation":"The phrase could still tip a near-tie toward the hub on a prompt that also carries a weak browser signal, which would restore a routing consequence without restoring the original reach.","finalSeverity":"P2","confidence":"high","downgradeTrigger":"Raise back to P1 if a prompt is found where core web vitals alone decides a stage-one win for mcp-browser-use."}
     ```

## Traceability Checks

- `spec_code` -- pass. All seven goal completion criteria were checked against the shipped files:
  - Criterion 1: `001-research/research/deep-research-state.jsonl` holds 12 records with `type === "iteration"` (the criterion asks for at least 10), and `001-research/research/research.md` exists at 33,096 bytes.
  - Criterion 2: `.skilled/skills/mcp-browser-use/mode-registry.json` declares exactly three modes (`mcp-chrome-devtools`, `mcp-aside-devtools`, `mcp-bladebro`) and `.skilled/skills/mcp-tooling/mode-registry.json` declares exactly six (`mcp-click-up`, `mcp-figma`, `mcp-refero`, `mcp-mobbin`, `mcp-obsidian`, `mcp-notion`).
  - Criterion 3: `rg -n "mcp-tooling/mcp-chrome-devtools|mcp-tooling/mcp-aside-devtools" .skilled` excluding `changelog` and `benchmark/reports` prints no match, and `rg -q "mcp-chrome-devtools|mcp-aside-devtools"` prints no match in each of `.skilled/skills/mcp-tooling/{mode-registry.json,hub-router.json,leaf-manifest.json,SKILL.md,README.md}`.
  - Criterion 4: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/mcp-browser-use` exits 0 and ends `OK: parent-skill-check -- all hard invariants passed, 0 warnings`, naming the hub as its subject.
  - Criterion 5: one real request per mode returns `mcp-browser-use` from the advisor and that mode from the compiled router -- Chrome DevTools 0.95 to `mcp-chrome-devtools`, Aside 0.9441 to `mcp-aside-devtools`, Bladebro 0.9295 to `mcp-bladebro`.
  - Criterion 6: each of the three modes has `manual-testing-playbook/manual-testing-playbook.md` and recorded runs (Chrome DevTools 3, Aside 7, Bladebro 3), including `mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/`.
  - Criterion 7: not verified by this lineage. `validate.sh --strict --recursive` is a repo-wide write-capable tool and this lineage's write surface forbids running it, so the only support is the phase 015 record at `015-fix-follow-up-review-findings/implementation-summary.md:113`. Recorded as unverified rather than passed.
- `checklist_evidence` -- pass. Phase 015 criterion 2's advisor half holds: the advisor 2.0.3.0 changelog's four claims were each checked. `mcp-code-mode` is absent from both `graph-metadata.json` `intent_signals` and `description.json` `keywords`; bare `staging` is absent from both; the four staging phrases the changelog says still route live in the advisor's own `explicit.ts:110-113` at weight 0.65, not in the hub metadata, which is consistent with the changelog's wording. The five probe prompts' behaviour is covered by the advisor suite the changelog reports, which this lineage did not re-run.

## Integration Evidence

- `.skilled/commands/doctor/scripts/parent-skill-check.cjs` -- the checker the goal's criterion 4 names. Its `13a-version` row reads "all JSON routing files carry the SKILL.md version 1.1.3.0" and its `13b-version` row reads "SKILL.md version 1.1.3.0 matches the newest changelog entry". Both pass, which is the counterevidence that keeps finding R1-P2-001 at P2: the gate reads JSON routing files and SKILL.md, never `README.md`.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:110-113` -- the four staging phrases the advisor 2.0.3.0 changelog says still route to the hub. They live in the advisor's explicit lane at 0.65, so the changelog's claim is true through a surface outside the hub's own metadata.
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md` -- the index and the seven `hub-routing/` scenario files agree exactly: both carry `MT-001`, `MT-004`, `MT-007`, `MT-012`, `MT-013`, `MT-H01` and `MT-H04`, with no scenario unindexed and no index entry without a file.

## Edge Cases

- Criterion 7 could not be executed. `validate.sh --strict --recursive` is explicitly outside this lineage's write surface, so the criterion is recorded as unverified rather than passed. This is a coverage limit of the lineage, not a defect in the packet.
- `manual-testing-playbook/hub-routing/ambiguous-defer.md:21` discloses that the advisor gives its prompt to `mcp-code-mode`, so a live session never reaches the hub with it. Recorded as an honest scoping note rather than a finding: the scenario tests the hub on its own, and it says so.
- The advisor 2.0.3.0 changelog carries its own "Known Limitation" section, stating that a task verb still expands to synonyms so a prompt with two generic words can pass the 0.45 lexical anchor. Recorded as disclosed rather than a finding, and it matches the phase 015 goal's own deviation row ("Shared 0.45 lexical anchor left as is").

## Confirmed-Clean Surfaces

- All seven goal completion criteria are supported by shipped evidence except criterion 7, which this lineage could not run.
- The hub's playbook index and its seven scenario files are bidirectionally complete.
- The advisor 2.0.3.0 id-noun change is present in the shipped metadata: `mcp-code-mode` and bare `staging` are gone from both the hub's intent signals and its description keywords.

## Ruled Out

- "The advisor 2.0.3.0 changelog overstates its staging claim": ruled out, the four phrases live in `explicit.ts:110-113`.
- "The hub playbook index is missing a scenario": ruled out, the index and the files carry the same seven MT ids.
- "`mcp-tooling` still carries a browser mode": ruled out, six modes and no browser id in any of its five named files.
- "The Core Web Vitals contradiction is a routing defect": ruled out by the live advisor run, which returns `sk-code` for that prompt.

## Next Focus

- Dimension: maintainability
- Focus area: the hub and mode changelogs, the README and SKILL.md prose, the benchmark report READMEs, and the duplicated install guidance across `INSTALL-GUIDE.md`, `references/` and `scripts/README.md`
- Reason: traceability closed the criteria; the remaining dimension is whether the documentation set is internally consistent and cheap to change
- Rotation status: correctness, security and traceability pass 1 complete, one dimension remains
- Blocked/productive carry-forward: productive -- the version-drift and duplicated-install findings both came from comparing two docs that describe the same thing, so the same comparison is the right method here
- Required evidence: file:line on each duplicated or contradictory statement

Review verdict: CONDITIONAL
