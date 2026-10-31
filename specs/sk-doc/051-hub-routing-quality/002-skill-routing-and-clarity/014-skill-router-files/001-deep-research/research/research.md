# Research: Move Every Skill's MACHINE ROUTER into a Sibling ROUTER.md

Two lineages: `luna` (gpt-6-luna, max reasoning, fast tier, cli-codex, three iterations, RQ-1 to RQ-5) and `deepseek` (DeepSeek V4.1 Flash, max reasoning, cli-pi, one iteration, RQ-6). The full lineage syntheses are `lineages/luna/research.md` and `lineages/deepseek/research.md`; the per-skill token table is `lineages/luna/token-savings.csv`.

## 1. Executive Summary

The move is worth doing and is mechanically bounded. The 54 MACHINE ROUTER sections hold 39,159 words, about 89,900 tokens under an O200K-compatible count, and a 23-token pointer per skill leaves about 88,700 tokens out of the initial skill load. No runtime loads a sibling `ROUTER.md` on its own, so SKILL.md keeps an explicit pointer and the agent reads the router only when it selects resources.

Five script readers parse the router out of SKILL.md and must learn the new file, two shape checks forbid a packet `ROUTER.md` (RS-004) and must change first, Hermes copies only SKILL.md and must carry the new file, and the compiled-route source hashes will change by design. The skill advisor needs one real fix: its freshness signature ignores `ROUTER.md`, so a router-only edit would leave a stale graph reporting `live`. No scorer lane reads SKILL.md body text, so routing accuracy is expected to hold, and the frozen baseline can be recaptured to prove it.

## 2. Scope and Method

Source audit, not an implementation test. The luna lineage traced parser call sites, tests, templates, runtime sync manifests, Hermes generation, hub replay inputs and compiled-route provenance; new-information ratios were 1.00, 0.82 and 0.76 and it stopped at the three-iteration cap. The deepseek lineage read the advisor's signature, discovery, graph, embeddings, lanes, hooks and baselines. The coordinator then checked the load-bearing citations against the code.

## 3. Current Shape and Baseline

- 54 skills and modes carry a final `## MACHINE ROUTER` section; the luna count of 57 SKILL.md files includes three template or fixture files with no section.
- Router share: 22% of all SKILL.md words, median 624 words, 59% of system-skill-advisor; five skills sit against the 5,000-word cap: system-spec-kit (5,000 words), sk-design-md-generator (4,998), cli-opencode (4,994), cli-devin (4,988) and mcp-mobbin (4,982).
- Advisor accuracy baseline: 155/195, 49/66 and 19/24. Its evaluator is `system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs`, and `scorer-eval-baseline.json` pins the corpus, holdout and ambiguity sha256 values, so it can be recaptured. The luna lineage could not locate it; the deepseek lineage and the coordinator did.

## 4. RQ-1: Readers of the Machine Router

Direct parsers, each confirmed at the cited lines:

| Reader | Location | Change |
|---|---|---|
| Router replay | `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:365-421` | Reads SKILL.md, falls back only to `references/*.md` and `hub-router.json`; add sibling `ROUTER.md` resolution |
| Router sync | `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:47,194-205` | Uses the replay parser; follows it |
| Dead-route scan | `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py:815-879` | Read declarations from `ROUTER.md`, keep paths rooted at the skill |
| Package check | `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:187-209,791-1010` | Shape, markers, RS-004; move to the new shape |
| Doctor check 12b | `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1850-2170` | Duplicate of the package check; change in step |

Producers and fixtures: the create-skill workflows (`create-skill-auto.yaml`, `create-skill-parent-auto.yaml`), `skill-smart-router.md`, the skill template, and the routing-shape, package and create-skill test suites. Not router readers: `generate-leaf-manifest.cjs` (walks leaf roots), `smart-router-measurement.ts` (reads SMART ROUTING), the compiled registry (hashes source bytes for provenance only).

## 5. RQ-2: How the Seven Runtimes Load a Skill

Claude Code, OpenCode, Cursor and Pi load the selected SKILL.md and read supporting files on demand when the skill points at them; Codex and Devin reach the skills through this repository's sync manifests and AGENTS.md routing. None loads a sibling `ROUTER.md` without being told to. Hermes is the exception that needs code: `sync-skills-hermes.cjs` writes only `SKILL.md` into its generated view (confirmed near line 240), so the generator must carry `ROUTER.md` or rewrite the pointer to the canonical path. Devin's and Hermes's public loader contracts were not confirmed; the repository's provisioning is the evidence.

## 6. RQ-3: What the Agent Needs Versus What Scripts Read

The agent needs the decision rule: which intent loads which resources, when, and what to do on an unclear match. Scripts need the literal grammar: `INTENT_SIGNALS`, `RESOURCE_MAP`, `DEFAULT_RESOURCE`, fence boundaries and path roots. SKILL.md keeps the short Smart Routing prose plus one explicit line, for example "Read ./ROUTER.md before selecting skill-local resources; open only the matched files." Everything else moves to `ROUTER.md`.

## 7. RQ-4: Hubs and the Router Replay Projection

The seven hubs (cli-classifier, cli-external-orchestration, mcp-tooling, sk-code, sk-design, sk-doc, system-deep-loop) already have a root `ROUTER.md`, and their SKILL.md MACHINE ROUTER sections hold no assignment rows. Their moved prose goes into a separate named section of that file; the existing stage-two assignment block stays the only replay source, with no second map. Replay, `leaf-route-replay.cjs`, `root-router-contract.cjs` and the registry compiler read that file; the regression test compares the projected route before and after while letting provenance hashes refresh.

## 8. RQ-5: Migration That Holds the Baseline

Order: freeze the baselines, change the contract and the shared parser, fix Hermes and the advisor freshness, move the hubs, move packets and standalone skills in batches behind a debt ledger, then regenerate and recapture. Compiled-route hashes are byte provenance and must change; route decisions and the replay projection are the invariants. Each batch checks the router file count, duplicate assignments, dead-resource paths, replay output and the per-skill token count.

## 9. RQ-6: Skill Advisor Alignment

- **Freshness (defect):** `runtime/lib/freshness.ts:162-198` hashes only `SKILL.md` and `graph-metadata.json` per skill. Add a `ROUTER.md` probe beside the SKILL.md probe; the `missing` marker keeps today's signature stable for a skill without the file.
- **Duplicate signature:** `.opencode/plugins/system-skill-advisor.js:342-343` repeats the same two probes; it needs the same third probe, and a parity test so the two cannot drift.
- **Watcher:** `runtime/lib/daemon/watcher.ts` has no `ROUTER.md` target, so a router write raises no event; add one.
- **Unaffected:** discovery and parsing (`skill_advisor_runtime.py` reads frontmatter and the keywords comment only), the graph compiler (`graph-metadata.json` only), embeddings (frontmatter description only) and all five scorer lanes (no body-text field).
- **Prose:** the advisor's SKILL.md pointer sentence and the note in `leaf-manifest.config.json` describe the router as part of SKILL.md.
- **Do not** rerun the deprecated derived extractor during the move; it reads the whole body and would shift the derived lane.

## 10. Contract Decision

Both lineages flag the same conflict: RS-004 and the create-skill workflows forbid a mode packet `ROUTER.md`, and the root-router gate only runs for hubs. The operator's direction is every skill, so the decision is: every skill and mode owns a sibling `ROUTER.md`, a hub's moved prose joins its existing root file, RS-004 is reversed, and the root-router gate is widened to standalone skills and packets. This changes the canon and lands before any file moves.

## 11. Recommendations

1. Freeze the advisor baseline, the replay projections and the current source hashes.
2. Reverse RS-004, rewrite RS-005 as "SKILL.md points at its ROUTER.md", and update the templates and create-skill workflows.
3. Build one shared router-file resolver and move replay, sync, the dead-route scan, the package check and doctor 12b onto it.
4. Fix Hermes copying and the advisor freshness, plugin signature and watcher.
5. Move the hubs, then the packets and standalone skills in batches behind a debt ledger.
6. Regenerate every derived file, recapture the baseline and the token table.

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence |
|---|---|---|
| Rely on runtimes to load `ROUTER.md` automatically | No runtime loads a sibling file unless the skill points at it | Runtime sync manifests and loader docs, lineages/luna §6 |
| Keep compiled-route hashes byte-identical | The compiler hashes authored source bytes, which move | registry-compiler.cjs:282-315,419-467 |
| Add a router lane to the advisor scorer | No lane reads router content, and a new lane would change the fusion weights the baseline was captured at | lane-registry.ts:9-15 |
| A second assignment map in hub `ROUTER.md` | Replay must keep one projection source | router-replay-lib.cjs:652-676 |
| Treat the leaf-manifest generator as a router reader | It walks leaf roots and never parses SKILL.md | generate-leaf-manifest.cjs:192-230 |

## Divergence Map

Default convergence mode with no divergent pivots, failures or overrides. Saturated directions: none. Remaining frontier: the exact tokenizer for the final token count, Devin's and Hermes's public loader contracts, and the measured before-and-after baseline capture, which phase 006 runs.

## 12. Open Questions

- The authoritative tokenizer for the final per-skill saving is UNKNOWN; the 88,700 figure is provisional.
- The baseline is expected to hold because no lane reads router content; it is unconfirmed until phase 006 recaptures it.

## 13. Proposed Implementation Phases

- **002 router-file-tooling:** shared resolver; replay, sync, dead-route scan, Hermes generator, advisor freshness, plugin signature and watcher.
- **003 check-and-template-canon:** reverse RS-004, rewrite RS-005, widen the root-router gate, update templates, create-skill workflows and canon docs, add a debt ledger.
- **004 hub-router-merge:** seven hubs move their MACHINE ROUTER prose into a named section of their root `ROUTER.md`.
- **005 packet-and-standalone-migration:** the remaining 47 skills and modes get their own `ROUTER.md`, in batches, emptying the ledger.
- **006 regeneration-and-verification:** regenerate manifests, Hermes copies and hashes; recapture the baseline, the replay projections and the token table.

## 14. Verification Plan

Every SKILL.md points at an existing `ROUTER.md` with one assignment source; the shared resolver, sync, dead-route scan, package check and doctor 12b accept the new shape and reject missing, duplicated or path-escaping routers; a `ROUTER.md`-only edit flips advisor freshness to `stale`; Hermes output carries the router; the recaptured baseline matches 155/195, 49/66 and 19/24; replay projections match; the token table is regenerated.

## 15. Evidence Strength and Limitations

Confirmed by reading the cited source: the five direct readers, RS-004 in `package_skill.py`, the Hermes copy step, the advisor freshness signature, the plugin's duplicate signature and the watcher's targets. Derived: that no scorer lane reads router content, from the lane field lists. Inferred: that the baseline holds. Runtime loading for Devin and Hermes rests on local provisioning, not public contracts.

## 16. Convergence Report

- Stop reason: maxIterationsReached (both lineages ran to their cap)
- Total iterations: 4 (luna 3, deepseek 1)
- Questions answered: 6 / 6
- Remaining questions: tokenizer identity; baseline confirmation in phase 006
- Last iteration summaries: luna 1 readers (1.00); luna 2 runtimes and context (0.82); luna 3 hubs, measurement and contract (0.76); deepseek 1 advisor alignment
- Convergence threshold: 0.05 (telemetry only under the max-iterations stop policy)
- Divergence summary: no divergent pivots recorded

## 17. References

- `lineages/luna/research.md`, `lineages/luna/token-savings.csv`, `lineages/deepseek/research.md`
- `fanout-attribution.md`, `findings-registry.json`, `resource-map.md`
- Source files cited in sections 4 to 9
