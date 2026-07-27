# sk-doc Manual Testing Playbook — Compiled Routing Verification

> Manual, exhaustive, per-scenario run + verify pass over every scenario in `.opencode/skills/sk-doc/manual-testing-playbook/`, comparing the compiled resolver (default-on) against the frozen legacy router replay. Read-only; no scenario file, router, manifest, or frozen scorer was modified.

**Captured:** 2026-07-21T13:27:25Z · **Packet:** `015-routing-coverage-activation-verification/013-compiled-coverage-buildout` · **Worktree:** `.worktrees/0089-sk-doc-default-routing-cutover` (branch `sk-doc/0089-default-routing-cutover`)

## Commands used (identical for all 32 runnable scenarios)

```bash
# Compiled (default-on; flag explicitly unset to exercise the real default)
env -u SPECKIT_COMPILED_ROUTING node .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs --hub sk-doc --prompt "<prompt>"

# Legacy (frozen replay)
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs --skill .opencode/skills/sk-doc --task "<prompt>"
```

## Totals

- Scenario IDs enumerated: **34** (32 physical scenario files under the playbook tree + 2 root-index-only phantom IDs)
- **PASS: 32** · **FAIL: 0** · **SKIP: 2**
- All 32 runnable scenarios: compiled action/targets == legacy intents (0 drift), and both equal the scenario's documented expected mode (with the documented FULL_INVENTORY defer exemption for SD-015 — see notes).

## Root-index drift found while enumerating (documentation bugs, not routing bugs)

The root `manual-testing-playbook.md` Scenario Index is stale relative to the actual directory contents:

- **SD-017** — index names `intent-detection/INSTALL-GUIDE.md`; that file does not exist on disk (confirmed via `find`/`ls`/recursive `grep -r SD-017`, which only hits the root index itself). No scenario contract or prompt text exists anywhere to execute. **SKIP.**
- **SD-019** — index names `agent-dispatch/markdown-agent-cli-opencode.md`; that physical file's entire frontmatter/body is SD-020 (DeepSeek v4 Pro direct-API scenario). No separate SD-019 prompt/contract exists in that file or elsewhere in the tree — `grep -r SD-019` only hits the root index plus a "Cross-CLI Variants" cross-reference note inside SD-018/SD-020. **SKIP.**
- The directory also contains **13 undocumented `holdout/` scenarios** (SD-H01..SD-H13, generalization probes with their own `expected_intent`/`expected_resources` frontmatter) and **1 undocumented `compiled-routing/` scenario** (SD-CR-001) that the root index's Scenario Index table does not list at all. These 14 files carry full, runnable scenario contracts, so they are included in this exhaustive run (32 total runnable files). This matches the corpus size the concurrent Lane C harness run discovered independently (see Lane C cross-check below) — both enumerations land on the identical 32-scenario set, which is strong evidence the directory (not the stale index table) is the true contract, exactly as this task's brief states.

## Methodology notes / interpretive calls

- **Agent Dispatch (SD-018, SD-020):** these scenarios' own grading rubric says they "EXECUTE real work" (real `opencode`/`claude` CLI dispatch, real file writes to `/tmp`). This verification pass does **not** execute that real dispatch (out of scope for a read-only routing-parity check, and would violate the read-only/no-commit constraint on this task) — it runs only the two named routing-trace commands against each scenario's literal `Prompt:` text, exactly as done for every routing-trace category. Both resolve to `create-changelog` cleanly.
- **SD-012 (multi-step-dispatch):** the scenario's `expected_workflow_mode` is the arrow-separated sequential narrative `create-skill → create-quality-control → create-changelog`, describing a live 3-turn agent conversation. Its own file supplies only one literal dispatchable string (the "Setup / INPUTS TO ROUTE" block is a single meta-prompt instructing a live assistant to reason across 3 conceptual turns, not 3 separate extractable prompts). Fed that single literal string into both resolvers, the router itself scores all three keyword clusters simultaneously and returns an ordered 3-target bundle in the exact expected order (`create-skill`, `create-quality-control`, `create-changelog`) — compiled and legacy agree exactly, and incidentally the ordered bundle also matches the expected arrow-sequence content. Graded PASS on the achievable single-call parity criterion.
- **SD-015 (max-load / FULL_INVENTORY):** per this task's own note, sk-doc's FULL_INVENTORY is a surface-layer intent that both compiled and legacy correctly **defer** on (`action: defer` / `intents: []`, `deferReason: no-mode-scored`) rather than route — legacy's 116-resource ON_DEMAND list is delivered through a separate fallback path, not the router's target set. Compiled defer == legacy defer, graded PASS, not compared against the giant `expected_workflow_mode` cartesian-bundle string (which enumerates the resource-map contents, not a routable mode).
- **"Detection markers"** are read as the scenario's documented `expected_intent` surface label (e.g. `DOC_QUALITY`, `SKILL_CREATION`) cross-checked against legacy's `surfaceIntents` + `matchedAliases` output — consistent for all 32 scenarios (see table).
- Cross-CLI (SD-010/011/012) and token-cost (SD-013/014/015) scenarios are routing-trace probes per the playbook's own EXECUTION POLICY ("DO NOT execute the work below"); no CLI binary was actually invoked for any scenario in this pass — only the two named deterministic routing tools.

## Frozen-file integrity proof

| File | SHA-256 (start) | SHA-256 (end) | Unchanged |
| --- | --- | --- | --- |
| `router-replay.cjs` | `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47` | `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47` | yes |
| `score-skill-benchmark.cjs` | `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c` | `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c` | yes |
| `load-playbook-scenarios.cjs` | `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029` | `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029` | yes |

`DEFAULT_ON_HUBS` re-confirmed at 7 hubs in both resolver copies (authored + promoted), byte-identical (`diff` clean): sk-code, system-deep-loop, mcp-tooling, cli-external-orchestration, sk-prompt, sk-design, sk-doc.

## Cross-check vs Lane C compiled-serving parity (32/0)

An independent, concurrently-running Lane C harness sweep (`.opencode/skills/sk-doc/benchmark/compiled-routing/r3-benchmark-sweep-20260721-131432/hub-reports/sk-doc.md`, not produced by this pass) enumerated the **identical 32-scenario corpus** (same 32 ids, including all 13 holdout + SD-CR-001 + both agent-dispatch scenarios, and likewise excluding SD-017/SD-019) and reported:

- Route gold (hard lane): rows scored **32**, matches **32**, violations **0**
- Compiled routing parity: scored **32**, match **32**, drift **0**, resolver-missing **0**
- Frozen scorer hashes unchanged: **yes**
- Overall verdict: **PASS**, aggregate 98/100 (per-scenario D1-D5 usefulness/quality sub-scores below 100 for a few holdout/full-inventory/multi-step scenarios reflect that harness's own resource-recall tolerance scoring, not routing-parity failures — every row in its own "Compiled routing parity" table reads `status: match`)

This manual pass's 32/32 compiled==legacy parity result (0 drift) corroborates the Lane C 32/0 figure exactly — independently, using the two raw CLI tools directly rather than the orchestrated harness.

## Scenario table

| ID | Category | Prompt (truncated) | Expected mode | Compiled | Legacy | Verdict | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SD-001 | intent_detection | Validate documentation quality for skill X and report which sections fail sk-doc standard… | create-quality-control | create-quality-control | create-quality-control | **PASS** |  |
| SD-002 | intent_detection | Help me create a graph-rag sk-skill with SKILL.md and starter reference scaffolds. | create-skill | create-skill | create-skill | **PASS** |  |
| SD-003 | intent_detection | Author an @analyze agent and paired /create:analyze command using the standard templates. | create-agent+create-command | create-agent+create-command | create-agent+create-command | **PASS** |  |
| SD-004 | resource_loading | Apply HVR voice rules to specs/123-example/implementation-summary.md without changing sem… | create-quality-control | create-quality-control | create-quality-control | **PASS** |  |
| SD-005 | resource_loading | Generate an ASCII deploy-pipeline flowchart covering build, test, staging, prod, and roll… | create-flowchart | create-flowchart | create-flowchart | **PASS** |  |
| SD-006 | resource_loading | Create a README for packages/auth/ covering purpose, install, usage, configuration, and s… | create-readme | create-readme | create-readme | **PASS** |  |
| SD-007 | unknown_fallback | Improve doc quality and add flowcharts for the new feature docs. | create-quality-control+create-flowchart | create-quality-control+create-flowchart | create-quality-control+create-flowchart | **PASS** |  |
| SD-008 | unknown_fallback | Tell me about the weather. | UNKNOWN | UNKNOWN (defer) | UNKNOWN (defer) | **PASS** |  |
| SD-009 | unknown_fallback | Build a feature catalog for the playbook system and document each scenario as a catalog e… | create-feature-catalog+create-manual-testing-playbook | create-feature-catalog+create-manual-testing-playbook | create-feature-catalog+create-manual-testing-playbook | **PASS** |  |
| SD-010 | cross_cli_dispatch | Draft a v2.3.0 changelog with added, changed, fixed, and removed sections. | create-changelog | create-changelog | create-changelog | **PASS** |  |
| SD-011 | cross_cli_dispatch | sk-doc: create a new sk-skill named sk-graph-traversal for graph queries against the spec… | create-skill | create-skill | create-skill | **PASS** |  |
| SD-012 | cross_cli_dispatch | Trace routing for three sequential sk-doc turns: create sk-foo, add validation rules, the… | create-skill → create-quality-control → create-changelog | create-skill+create-quality-control+create-changelog | create-skill+create-quality-control+create-changelog | **PASS** | sequential 3-turn narrative scenario collapsed to one literal prompt string (no per-turn prompts exist in the file's Setup INPUTS block); g… |
| SD-013 | token_cost_baseline | Apply HVR to this sentence: The system was designed by us to be modular. | create-quality-control | create-quality-control | create-quality-control | **PASS** |  |
| SD-014 | token_cost_baseline | Create sk-graph-rag with index/query intents, a SKILL.md scaffold, and a starter referenc… | create-skill | create-skill | create-skill | **PASS** |  |
| SD-015 | token_cost_baseline | Show the full sk-doc toolkit: all templates, frameworks, format guide, references, and as… | create-agent+create-benchmark+create-changelog+create-comma… | UNKNOWN (defer) | UNKNOWN (defer) | **PASS** | FULL_INVENTORY surface-layer intent: both compiled and legacy correctly defer (no routed workflow_mode); resource list comes via legacy's s… |
| SD-016 | intent_detection | Optimize this long SKILL.md for token efficiency and generate an llms.txt summary. | create-quality-control | create-quality-control | create-quality-control | **PASS** |  |
| SD-017 | intent_detection |  | INSTALL_GUIDE | n/a | n/a | **SKIP** | Root index (manual-testing-playbook.md Scenario Index) names file intent-detection/INSTALL-GUIDE.md for SD-017 but that file does not exist… |
| SD-018 | agent_dispatch | Use the @markdown agent to scaffold a v0.1.0 changelog for a stub skill named sk-test-dum… | create-changelog | create-changelog | create-changelog | **PASS** |  |
| SD-019 | agent_dispatch |  | CHANGELOG | n/a | n/a | **SKIP** | Root index names file agent-dispatch/markdown-agent-cli-opencode.md for SD-019, but that physical file's frontmatter/body is entirely SD-02… |
| SD-020 | agent_dispatch | Use the @markdown agent to scaffold a v0.1.0 changelog for a stub skill named sk-test-dum… | create-changelog | create-changelog | create-changelog | **PASS** |  |
| SD-CR-001 | compiled_routing | Help me create a graph-rag sk-skill with SKILL.md and starter reference scaffolds. | create-skill | create-skill | create-skill | **PASS** |  |
| SD-H01 | holdout | I'm packaging a new reusable capability for the assistant and need its main definition fi… | create-skill | create-skill | create-skill | **PASS** |  |
| SD-H02 | holdout | Go through this skill's write-ups and tell me what wouldn't clear our review bar before I… | create-quality-control | create-quality-control | create-quality-control | **PASS** |  |
| SD-H03 | holdout | Draft the front-page overview for this project so a newcomer understands what it does and… | create-readme | create-readme | create-readme | **PASS** |  |
| SD-H04 | holdout | Turn the merged work for v0.4.0 into release notes grouped by what changed. | create-changelog | create-changelog | create-changelog | **PASS** |  |
| SD-H05 | holdout | Sketch the approval process as a text diagram that shows each decision branch and where i… | create-flowchart | create-flowchart | create-flowchart | **PASS** |  |
| SD-H06 | holdout | I keep re-explaining the same steps every time I want you to help draft our release notes… | create-skill | create-skill | create-skill | **PASS** |  |
| SD-H07 | holdout | Before we ship our new changelog-helper skill, can you go through its docs and flag anyth… | create-quality-control | create-quality-control | create-quality-control | **PASS** |  |
| SD-H08 | holdout | Can you write up a clear front-page overview for this project that explains what it actua… | create-readme | create-readme | create-readme | **PASS** |  |
| SD-H09 | holdout | We're about to tag 3.2 — can you go through everything that's changed since the last vers… | create-changelog | create-changelog | create-changelog | **PASS** |  |
| SD-H10 | holdout | Can you lay out our support ticket escalation steps using just text characters — the kind… | create-flowchart | create-flowchart | create-flowchart | **PASS** |  |
| SD-H11 | holdout | Our main setup guide has ballooned into this huge wall of repetitive text and it's eating… | create-quality-control | create-quality-control | create-quality-control | **PASS** |  |
| SD-H12 | holdout | Can you write up clear step-by-step instructions for getting our project running from scr… | create-readme | create-readme | create-readme | **PASS** |  |
| SD-H13 | holdout | Can you go through the payments service and write up everything it can actually do, group… | create-feature-catalog | create-feature-catalog | create-feature-catalog | **PASS** |  |

## FAIL / SKIP detail

- **SD-017** (SKIP): Root index (manual-testing-playbook.md Scenario Index) names file intent-detection/INSTALL-GUIDE.md for SD-017 but that file does not exist on disk (verified via find/ls/grep across the playbook tree). No scenario contract or prompt text exists to execute.
- **SD-019** (SKIP): Root index names file agent-dispatch/markdown-agent-cli-opencode.md for SD-019, but that physical file's frontmatter/body is entirely SD-020 (DeepSeek v4 Pro direct API scenario) with no separate SD-019 prompt/contract present anywhere in the file or elsewhere in the tree (grep for SD-019 only hits the root index and cross-reference notes inside SD-018/SD-020's own 'Cross-CLI Variants' sections).

## Constraints honored

- Read-only + archive-only: no scenario file, `hub-router.json`/`mode-registry.json`, `SKILL.md`, or routing manifest was edited.
- The 3 frozen scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) were never opened for write; SHA-256 unchanged start-to-end.
- `DEFAULT_ON_HUBS` untouched — still the same 7 hubs, both resolver copies byte-identical.
- The 2 pre-existing stray modified files (`mcp-tooling/008-mcp-aside/.../research.md`, `system-deep-loop/032-.../decision-record.md`) were not touched by this pass.
- No commit made.
