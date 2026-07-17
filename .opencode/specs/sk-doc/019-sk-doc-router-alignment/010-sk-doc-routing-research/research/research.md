---
title: "Deep Research: sk-doc Routing Foundation Diagnosis and Optimization"
description: "Synthesized findings from a 10-iteration deep-research loop diagnosing sk-doc's skill-routing foundation against the Tier-2 gpt-5.6-luna benchmark (20/100, ~19% exact-resource recall), with a dependency-ordered, implementable fix plan."
trigger_phrases:
  - "sk-doc routing research findings"
  - "hub router alias coverage"
  - "leaf resource contract"
  - "skill benchmark wrong path root"
importance_tier: "important"
contextType: "research"
---
# Deep Research: sk-doc Routing Foundation Diagnosis and Optimization

<!-- SPECKIT_TEMPLATE_SOURCE: deep-research-synthesis | v1 -->

## 1. Metadata

| Field | Value |
|-------|-------|
| Session | dr-20260716-052950-sk-doc-routing (generation 1) |
| Iterations | 10 of 10 (stop: maxIterationsReached, stop_policy=max-iterations) |
| Executor | cli-codex / gpt-5.6-sol / reasoning=high / service_tier=fast |
| Spec folder | `.opencode/specs/sk-doc/031-sk-doc-router-alignment/010-sk-doc-routing-research` |
| Benchmark ground truth | `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json` |
| Key questions | 5/5 answered (Q1 i2, Q3 i3, Q2 i4, Q4 i5, Q5 i6; hardened i7–i10) |

## 2. Investigation Report

The research charter asked why sk-doc scored 20/100 with ~19% exact-resource recall on the Tier-2 gpt-5.6-luna skill-benchmark, whether an alleged ~34-alias coverage gap explained it, whether create-skill's routing templates teach the wrong path-root convention, how the scorer actually reads a hub skill, whether the drift guard catches the gap, and what implementable fixes follow. All five questions were answered with file:line evidence; the fix plan is frozen in Sections 8–10.

## 3. Executive Overview

**The headline premise was wrong, and the real defect is different and better-defined.** The "~34 uncovered aliases" figure came from a stale sentence in create-skill canon (`create-skill/references/parent_skill/parent_skills_nested_packets.md:208-209`), not from any benchmark output. The current tree has **113/113 literal alias↔vocabularyClass equality with zero gaps** (iteration 1, exact per-mode comparison). Alias invisibility cannot explain the recall number.

The actual failure is a three-part contract problem, quantified across all 19 benchmark rows (iteration 3):

| First causal loss | Rows | Mechanism |
|---|---|---|
| Wrong path-root normalization | 6 | Model serialized packet-local leaves with hub-coordinate prefixes (`create-*/references/...`); scorer uses exact string equality against root-relative gold |
| Missing expected leaf resource | 6 | Correct packet chosen, wrong/generic leaf returned; sk-doc has no second-layer leaf router or manifest |
| Over-bundled resource set | 5 | One primary (SD-015: 65 routed, 65 wasted) + 4 threshold-pass rows with material D3 efficiency loss |
| No material loss (clean) | 2 | SD-008, SD-012 — become regression fences |

**Root cause of the wrong-root class:** the create-skill authoring stack teaches two coherent but opposite coordinate systems — standalone packet routers emit packet-root-relative leaf IDs (`doc.relative_to(SKILL_ROOT)`), while the parent-hub schema declares "hub-root-relative, packet-qualified" resources — and **no handoff contract defines which coordinate frame the public answer uses** (iteration 4). Four of the six wrong-root rows are confirmed manifestations of this undefined handoff; SD-020 is stale/virtual gold vs real shared topology; SD-016 is provenance-inconclusive (report truncates responses at 300 chars).

**Guard coverage:** `routing-registry-drift-guard` is hardwired to system-deep-loop's own advisor projections and never inspects sk-doc. Generic `parent-skill-check.cjs` covers registry↔router key equality and first-layer existence, but **no current guard checks output namespace semantics, recursive packet-leaf coverage, fixture-to-topology validity, or execution-time provenance** (iteration 5, boundary matrix).

## 4. Core Architecture (as diagnosed)

- **Layer 1 (hub):** `sk-doc/hub-router.json` routerSignals/vocabularyClasses + `mode-registry.json` (12 modes, 113 aliases) select a `workflowMode` and packet entrypoint (`create-*/SKILL.md`). This layer is healthy: `parent-hub-vocab-sync` scores 100, zero orphans (packets 007/008 corroborate).
- **Layer 2 (packet leaves):** absent. `router-replay.cjs` probes `shared/references/smart_routing.md` / `references/smart_routing.md` and finds neither, so deterministic replay stops at packet `SKILL.md` resources (`router-replay.cjs:389,396,501`). Gold, however, expects packet-local leaf paths.
- **Scorer:** Mode-B live scoring takes the model's stated `resources`/`assets` arrays unchanged and applies exact `Set.has` equality (`live-executor.cjs:303-320`, `score-skill-benchmark.cjs:65`). The funnel checks D1-intra and D2 only; D3 losses hide inside "passed" rows. All 19 rows are fitted; `generalizationGap` is null. D5=100 is structural only.

## 5. Technical Specifications (settled design decisions)

1. **Canonical public identity = the typed pair `(workflowMode, leafResourceId)`** where `leafResourceId` is packet-root-relative and begins `references/` or `assets/`. Hub load addresses stay hub-root-relative/packet-qualified internally. Conversion boundary: after the packet router returns local resources, before serialization to caller/benchmark; never prepend `modes[].packet`.
2. **Composite uniqueness, not leaf uniqueness:** `references/README.md` legally exists in ten packets; uniqueness is enforced on the pair (iteration 7).
3. **N-to-1 fan-out:** `create-skill` and `create-skill-parent` both resolve to packet `create-skill` but keep distinct public key sets.
4. **Shared aliases are authored, never inferred:** `(create-changelog, assets/changelog_template.md) → shared/assets/changelog_template.md` lives in an authored `leaf-aliases.json`; filesystem discovery cannot infer semantic aliases (no symlinks exist).
5. **Migration: dual-read, single-write, fail closed.** Legacy packet-qualified/shared-prefixed strings are readable only under strict conditions; all new emitters write typed pairs; generic prefix stripping is ruled out.
6. **Frozen contract names:** `resourceContractVersion`, `leaf-aliases.json`, `leaf-manifest.json`, `validate-playbook-topology.cjs` (iteration 10).

## 6. Constraints & Limitations

- The 20/100 report is a historical Mode-B artifact without config fingerprints; it supports the failure profile but cannot attribute it to today's configs. A fresh 19-scenario live run is required after fixes to claim repair.
- Report evidence truncates at 300 response chars (`score-skill-benchmark.cjs:1074-1082`); SD-015's full 65-path bundle and SD-016's contradiction are not reconstructable post-hoc.
- `command-metadata.json` does not exist for sk-doc and **should remain absent** — mode-registry.json already records commands/aliases; adding it creates another unsynchronized projection (iteration 6, finding 5).
- memory_context/memory_save MCP calls timed out throughout this session; sibling packets 001–009 were consulted directly instead.

## 7. Integration Patterns

sk-code validates the two-layer architecture (surface-first, intent-second, exact resource maps, no inventory dumps) but NOT its serialization: sk-code emits hub-qualified strings (`code-webflow/references/...`), which is exactly the ambiguity sk-doc must remove. Reuse the staged-selection structure, not the output string shape (iteration 7, finding 4).

## 8. Implementation Guide — Dependency-Ordered Fix Plan

**Layer A — executable current-sk-doc minimum (iteration 9 supersedes iteration 6's broader draft):**

1. **Contract library:** add `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs` (pure: normalization, composite keys, containment, canonical bytes, digests, alias/collision/reachability validation) + `generate-leaf-manifest.cjs` (`--write`/`--check` CLI). Deterministic byte-stable generation contract per iteration 8 §2.
2. **Hub topology:** `mode-registry.json` gains `resourceContractVersion`; add authored `leaf-aliases.json`; commit generated `leaf-manifest.json`. No parallel leaf map in `hub-router.json`.
3. **Hub enforcement:** extend `.opencode/commands/doctor/scripts/parent-skill-check.cjs` — manifest source validation, byte drift, target/collision, bidirectional selected-map reachability (ordered guard codes per iteration 8 §3).
4. **Fixtures:** migrate all 19 sk-doc scenario frontmatters to typed gold (`expected_workflow_mode` + canonical leaf); add `validate-playbook-topology.cjs` pre-dispatch (schema → manifest resolution → selected-map join; invalid oracle blocks with zero dispatch).
5. **Replay/dispatch:** `router-replay.cjs` + `executor-dispatch.cjs` emit canonical typed pairs, selected-map union cap (`maxWorkflowModes: 2`, no unmapped leaves, full-inventory only by explicit intent), dual-read legacy.
6. **Packet maps:** correct only the nine affected packets (create-quality-control, create-flowchart, create-feature-catalog, create-agent, create-command, create-manual-testing-playbook, create-readme, create-skill, create-changelog). create-benchmark and create-diff have no failing row — untouched.
7. **Scoring/reporting:** scorer taxonomy separates `fixture_schema_error` / `fixture_topology_error` / `fixture_selection_error` / `routing_contract_error` / `routing_miss`; runner snapshots and rechecks topology digests (`topology_changed_during_run` aborts); `build-report.cjs` reports excluded rows; provenance fail-closed.

**Layer B — authoring-doctrine propagation (prevents recurrence, not runtime-critical):**

8. Update `create-skill/assets/skill/skill_smart_router.md`, `assets/parent_skill/parent_skill_hub_router_template.json`, and `references/parent_skill/parent_hub_router_schema.md` to declare the `pathContract` (hubLoadAddress vs leafResourceId, conversion boundary) so newly generated hubs never re-create the handoff ambiguity. Also add the authored second-layer router scaffold (`parent_skill_smart_routing_template.md`) and `shared/references/smart_routing.md` for sk-doc with exact per-intent leaf sets and an explicit full-inventory intent.
9. Fix stale canon: `create-skill/references/parent_skill/parent_skills_nested_packets.md:208-209` (the "~34" sentence) describes a configuration state that no longer exists.

**Gold repairs (after provenance is active):** SD-020 keeps public gold `assets/changelog_template.md` proven via declared alias; SD-016's first gold entry normalizes to `references/optimization.md`. Do not retroactively relabel historical rows.

## 9. Verification Commands

1. `node --check` on every added/changed CJS file
2. `node .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs --check .opencode/skills/sk-doc`
3. `PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-doc`
4. `node --test .opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs`
5. `node --test .opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs`
6. `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-doc-leaf-routing-contract.vitest.ts`
7. `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs --no-coverage` (aggregate regression)
8. Fresh Mode-B live run against all 19 sk-doc fixtures — the only proof of model-facing repair.

## 10. Acceptance Matrix

| Group | Scenarios | Required result | Regression fence |
|---|---|---|---|
| Wrong-root fixed | SD-007, SD-009, SD-003, SD-016, SD-011, SD-020 | Valid observations resolve to expected composite pairs; recall 1 | Prefixes only via declared mode/alias, never generic stripping |
| Missing-leaf fixed | SD-013, SD-005, SD-004, SD-001, SD-010, SD-018 | Expected pair valid, selected, observed | Missing alias/target blocks pre-dispatch |
| Over-bundle fixed | SD-015, SD-014, SD-006, SD-017, SD-002 | Observed = selected-map union; zero unexpected; D3=1 where applicable | Dedupe by composite pair |
| Clean preserved | SD-008, SD-012 | Same scores, zero waste, same first-failing stage | Typed migration cannot reduce score |
| Structural | full run | Fresh D5 = 100, gate open | Never copy the old report value |
| Invalid oracle | synthetic fixtures | Zero dispatch; excluded from all denominators | Separate fixture/topology/selection counts |
| Reproducibility | permuted registry/enumeration | Identical manifest bytes/digest | No timestamps, locale order, absolute paths |

## 11. Eliminated Alternatives

- **Enumerating the ~34 alias gap:** the exact omission set is empty (113/113); premise was stale canon text (i1–i2).
- **Alias invisibility as the recall cause:** Mode-B live scoring never consults hub-route telemetry (all denominators zero in the report) (i2–i3).
- **Creating `command-metadata.json`:** unnecessary projection; keep absent (i6).
- **Packet-qualified public IDs / adopting sk-code's serialization:** preserves the exact ambiguity being fixed (i6–i7).
- **Global `leafResourceId` uniqueness / packet-directory-keyed manifest generation:** collides with 10× duplicate local names and collapses N-to-1 mode fan-out (i7).
- **Inferring shared aliases from symlinks:** no packet symlinks exist (i7).
- **Arbitrary numeric bundle cap:** breaks the legitimate 17-leaf full-inventory scenario; cap = selected-map union (i6).
- **Generated manifest as alias source-of-truth; generation-time-only drift checks; reverse physical-path lookup; catch-all canonicalizer; scoring topology-invalid gold as zero recall** (i8).
- **Copied normalization per caller; second leaf map in hub-router.json; sidecar oracle; independent D5 manifest semantics; edits to unaffected packet routers** (i9).

## 12. Divergence Map

- Completed pivots: 0 | Failed pivots: 0 | Audited overrides: 0 (convergence_mode=default; no divergent pivots ran).
- Saturated directions: literal registry-alias vs vocabularyClass gap enumeration (confirmed twice, 113/113); namespace choice `(workflowMode, leafResourceId)` settled i6, pressure-tested i7; sk-code router comparison completed i7; manifest determinism contract settled i8.
- Remaining frontier: none within scope — remaining work is a separately authorized implementation packet plus the fresh live benchmark run.

## 13. Open Questions

- None blocking. Two operator-policy items deferred to implementation: legacy-read telemetry cutoff for bridge removal, and whether the manifest `--check` runs path-filtered pre-commit or unconditional CI-only (research recommends unconditional CI).
- Historical SD-016 remains provenance-inconclusive by design; it becomes attributable only in future provenance-carrying runs.

## 14. Sources & References

- Live configs: `.opencode/skills/sk-doc/hub-router.json`, `mode-registry.json`, `SKILL.md`, eleven packet `SKILL.md` files, `shared/` backbone.
- Templates/canon: `create-skill/assets/skill/skill_smart_router.md`, `assets/parent_skill/parent_skill_hub_router_template.json`, `references/parent_skill/parent_hub_router_schema.md`, `references/parent_skill/parent_skills_nested_packets.md`.
- Scorer chain: `router-replay.cjs`, `load-playbook-scenarios.cjs`, `live-executor.cjs`, `run-skill-benchmark.cjs`, `score-skill-benchmark.cjs`, `d5-connectivity.cjs`, `parent-hub-vocab-sync.cjs`, `build-report.cjs` (under `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/`).
- Guards: `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`, `.opencode/commands/doctor/scripts/parent-skill-check.cjs`.
- Benchmark artifact: `tier2-sk-doc-luna-opencode.report.json` (068-skill-benchmark-codex-executor).
- Fixtures: `.opencode/skills/sk-doc/manual_testing_playbook/**` (19 scenarios).
- Sibling packets: `031-sk-doc-router-alignment/001–009`.
- Iteration narratives: `research/iterations/iteration-001.md` … `iteration-010.md` (full file:line citations live there).

## 15. Iteration Trail

| Run | Focus | Ratio | Outcome |
|---|---|---|---|
| 1 | Map hub routing surface, enumerate alias gaps | 0.90 | 113/113 equality; no command-metadata.json; ~34 premise falsified |
| 2 | Resolve ~34 provenance; scorer input source | 0.90 | Stale canon sentence; router-replay reads live config; Q1 answered |
| 3 | Full scorer dataflow; 19-row classification | 0.95 | 6/6/5/2 split; exact-equality contract; D3 hidden losses; Q3 answered |
| 4 | Root-path contract in templates | 0.88 | Two-coordinate-system handoff ambiguity; 4 confirmed rows; Q2 answered |
| 5 | Guard boundary trace | 0.86 | Drift guard is deep-loop-only; 4 missing boundaries; Q4 answered |
| 6 | Prioritized fix list | 0.74 | Dependency-ordered plan; Q5 answered |
| 7 | Namespace edge-case hardening | 0.61 | Composite uniqueness; N-to-1 fan-out; migration bridge; D5 baseline run |
| 8 | Manifest reproducibility + fixture attribution | 0.58 | Byte-stable generation contract; ordered guard codes; error taxonomy |
| 9 | Implementability review | 0.44 | One owner + one test layer per guard; smallest safe file set; acceptance matrix |
| 10 | Terminal consistency audit | 0.24 | Six verification commands; tensions reconciled; zero remaining research |

## 16. Convergence Report

- Stop reason: maxIterationsReached (stop_policy=max-iterations; convergence telemetry only)
- Total iterations: 10 | Questions answered: 5 / 5 | Remaining questions: 0
- Last 3 iteration summaries: run 8: manifest contract (0.58); run 9: implementability review (0.44); run 10: terminal audit (0.24)
- Convergence threshold: 0.05 (never reached; ratios declined monotonically from 0.95 to 0.24 — the loop was still yielding hardening value at cutoff)
- Graph convergence: final score 0.353–0.375 range, decision STOP_BLOCKED throughout (source-diversity and evidence-depth guards below graph thresholds; session-scoped subgraph)
- Divergence summary: no divergent pivots recorded

## 17. Next Steps

1. `/speckit:plan` an implementation packet from Section 8's Layer A (smallest safe file set, iteration 9 §3).
2. Implement in the fixed dependency order (contract library → topology artifacts → parent checker → fixtures → replay/dispatch → nine packet maps → scorer/report).
3. Run the six verification gates, then the fresh 19-scenario Mode-B live benchmark and record report/config/topology digests.
4. Propagate Layer B authoring doctrine to create-skill templates before closing the parent alignment program.

## References

- `.opencode/specs/sk-doc/031-sk-doc-router-alignment/010-sk-doc-routing-research/research/resource-map.md`
- Iteration files under `research/iterations/` carry the complete file:line evidence chains.
