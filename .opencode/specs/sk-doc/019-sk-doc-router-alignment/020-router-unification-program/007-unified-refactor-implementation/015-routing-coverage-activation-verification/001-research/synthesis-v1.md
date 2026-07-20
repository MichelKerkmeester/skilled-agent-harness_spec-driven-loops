---
title: "Research Synthesis v1: Routing Coverage, Activation & Verification"
description: "Ranked, deduplicated synthesis of a 25-iteration deep-research loop (143 findings, 4 models) on fully integrating, enabling-by-default, and verifying the compiled skill-router. Drives the 015 implementation spec: seven-workstream findings, unnamed risks, contradictions, a P0->P4 safety dependency graph, a 002-011 child-spec breakdown, and a reversible build sequence. Every step stays byte-identical to legacy and reversible; the frozen scorer trio is never edited."
trigger_phrases:
  - "compiled routing synthesis"
  - "routing coverage activation verification synthesis"
  - "compiled router default-on findings"
importance_tier: "critical"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Research Synthesis v1 — Routing Coverage, Activation & Verification

> **Provenance.** Synthesized from 25 deep-research iterations (`001-research/research/iterations/iteration-001.md`..`025.md`) and the accumulated `findings-registry.json` (143 structured findings). Four independent models contributed: `gpt-5.6-sol` (high/ultra), `gpt-5.6-terra` (xhigh), `minimax/MiniMax-M3`, `zai-coding-plan/glm-5.2`. 143 raw findings deduplicate to **48 consolidated findings** across 7 workstreams + unnamed risks. Highest-impact `file:line` citations were spot-checked against the real repo this session (see Appendix A). CONFIRMED = re-verified against source this session; INFERRED = agent-reported in the registry, not re-verified.

---

## 1. EXECUTIVE SUMMARY — the 8 highest-impact conclusions

1. **Default-on today is a structural no-op end-to-end, and the reason is worse than "additive metadata."** The advisor attaches `compiledRoute` as an additive sibling field (`advisor-recommend.ts:371`, CONFIRMED) — but the OpenCode plugin bridge then **rebuilds the recommendation list without copying `compiledRoute`** (`mk-skill-advisor-bridge.mjs:539-551`; grep for `compiledRoute` in the bridge returns ZERO hits, CONFIRMED). So even with the flag on and a hub compiled-serving, the compiled decision is destroyed before any agent sees it. **Flipping the default changes zero routing decisions AND surfaces nothing** — the "enable-by-default" goal is unreachable until the consumption path is built. This is the single most important finding; all four models circled it (F-3-3, F-8-1, F-20-1, F-15-1, F-24-1).

2. **The flag cannot even reach the advisor daemon child — two independent strip layers.** `SPECKIT_COMPILED_ROUTING` is absent from BOTH `mk-skill-advisor-launcher.cjs` `CHILD_ENV_ALLOWLIST` (line 99, CONFIRMED) and `mk-skill-advisor-bridge.mjs` `CHILD_ENV_ALLOWLIST` (line 58, CONFIRMED — zero hits). The standard operator path ("put it in `.env`") silently strips the flag from the spawned daemon. A canary is impossible until both allowlists include it (F-5-1, F-8-2, F-14-6, F-20-2 — all four models).

3. **ADR-002's central premise is wrong: `HUB_CHILD` is a runtime engine-dispatch table, not a removable duplicate allowlist.** CONFIRMED at `011-runtime-engine/lib/compiled-route.cjs:23-31,35-62`: `HUB_CHILD` maps each hub to its `006-parent-hub-rollout/00N-*` child, and `loadHubEngine()` `require()`s the engine modules from that path. Deleting it via manifest-derived eligibility (ADR-002) would break engine loading. Eligibility and engine-discovery must be separated before either can be single-sourced (F-5-5, F-16-1, F-6-3).

4. **The runtime reads its resolver, activation state, and compiled engines from inside the mutable spec tree — a self-inflicted drift engine.** CONFIRMED: `bin/compiled-route.cjs:16-21` resolves into `.../011-runtime-engine/lib/resolve.cjs`; `resolve.cjs:19` reads `010-live-activation/activation`; the engine loads from `006-*`. A spec renumber/archive silently reverts the whole fleet to legacy with **no stderr, log, or telemetry** (three nested silent catches: `bin/compiled-route.cjs:36-38`, `resolve.cjs:45-47`, `advisor-recommend.ts:352`, all CONFIRMED). ADR-003 promotion is a hard prerequisite — and it must move the whole closure (resolver + engine loader + activation manifests + per-hub bundles), not just `resolve.cjs` (F-1-7, F-2-4, F-16-2, F-14-4).

5. **There is no per-hub serving-status observability anywhere, and "drifted" is indistinguishable from "broken."** No CLI, MCP tool, plugin, or session surface reads the seven activation manifests (`advisor-status.ts`, `mk-skill-advisor.js:826-861`, `session-bootstrap.ts:399` — all confirmed by agents to lack it). The legacy sentinel collapses four causes (flag-off / missing manifest / legacy authority / engine throw) into one signal (`resolve.cjs:40`). 012 REQ-004 mandates a three-state readout; the benchmark contract needs a fourth ("broken"). This blocks canary, benchmark, and P4 gating (F-3-6, F-8-4, F-10-3, F-12-2, F-13-2, F-25-4).

6. **The flag is bi-state; default-on + kill-switch requires tri-state.** CONFIRMED: `resolve.cjs:22-23` and `advisor-recommend.ts:362` both test `=== '1'`, so unset and `'0'` are identical. Post-P4 needs unset=on / `'1'`=on / `'0'|'false'|'off'`=off, plus a defined invalid-value behavior — changed in both read sites together, with a truth-table test (F-14-3, F-5-2, F-15-3, F-25-5).

7. **The P0->P4 plan is cyclic and its P4 gate can pass empty.** Iterations found P2 parity gates P3 while the Lane C parity harness declares P3 eligibility a prerequisite (`012/plan.md:334-340` vs `014/spec.md:163-169`) — a cycle broken only by moving the read-only eligibility/status interface to P0. Worse, the enumerated P4 gate can pass with zero completed catalogs, playbooks, durable evidence, or LUNA runs, and requires sibling phases 013/014 only to be "available" though both are **Planned/Not-started** (F-15-2, F-15-6, F-22-1, F-22-2, F-25-1).

8. **All four named coverage gaps are real but downstream of the activation foundation.** Catalogs (6 of 7 hubs lack a canonical root catalog), benchmark (Lane C never sets the flag or invokes the front door), playbooks (the scenario loader admits gold-less scenarios; sk-doc scenarios load with null pass-criteria), and durable archiving (reports serialize absolute worktree paths and live only under specs) each need work — but every one of them must cite durable runtime paths and consume the P0 status probe, so they cannot be authored correctly until conclusions 3-5 land. Coverage is a **P3 join gate**, not parallel busywork.

**Bottom line for the spec:** the four "coverage gaps" are the visible surface; the load-bearing work is a **P0 activation foundation** (promote the closure, split eligibility from engine-dispatch, ship a status probe, tri-state the flag, un-strip the flag, un-drop the decision). Build that first, and everything downstream becomes buildable and verifiable. Nothing here changes a routing decision; every step stays byte-identical to legacy and reversible.

---

## 2. PER-WORKSTREAM SYNTHESIS

Severity legend: **P0** = blocks a safe default-on / a correctness or safety hole; **P1** = required for a complete, auditable cutover; **P2** = polish/hygiene. "Agreement: N models" flags independent multi-model convergence (higher confidence).

### 2.1 Enable-by-default activation (P0->P4) — the load-bearing workstream

| ID | Consolidated finding | Severity · agreement | Evidence (`file:line`) | Concrete change |
|----|----------------------|----------------------|------------------------|-----------------|
| **CF-ACT-1** | **Compiled decision never reaches the agent.** Advisor attaches `compiledRoute` additively; the plugin bridge rebuilds recommendations without it and the hook renders a brief that discards it. Default-on is a no-op end-to-end. | **P0** · 4 models | `advisor-recommend.ts:371` (CONFIRMED attach); `mk-skill-advisor-bridge.mjs:539-551` (CONFIRMED drop, 0 hits); `subprocess.ts:16`; `mk-skill-advisor.js` hook render | Thread `compiledRoute` (or a top-level `metadata.compiledRouteSummary`) through `buildNativeBrief` AND the CLI brief path; render/consume the 4-action outcome (route/clarify/defer/reject) before system-context injection. Add an e2e bridge+plugin test with a real compiled decision (native + no-dist launcher fallback). |
| **CF-ACT-2** | **Flag stripped by two child-env allowlists.** Launcher and bridge both omit `SPECKIT_COMPILED_ROUTING`; `.env` propagation silently drops it. | **P0** · 4 models | `mk-skill-advisor-launcher.cjs:99` + `:267-286` (CONFIRMED absent); `mk-skill-advisor-bridge.mjs:58` (CONFIRMED absent) | Add `SPECKIT_COMPILED_ROUTING` to BOTH `CHILD_ENV_ALLOWLIST` sets; test unset/`1`/`0` through native + fallback subprocess chains. |
| **CF-ACT-3** | **`HUB_CHILD` is an engine-dispatch table, not a duplicate allowlist** — ADR-002 cannot remove it via manifest eligibility alone. Two allowlists (`COMPILED_ROUTING_HUBS` vs `HUB_CHILD`) also have no cross-check. | **P0** · 2 models | `011-runtime-engine/lib/compiled-route.cjs:23-31,35-62` (CONFIRMED engine-location map + `loadHubEngine`); `advisor-recommend.ts:41-49` (CONFIRMED 7-hub Set) | Separate manifest-derived **eligibility** from **engine discovery**: standardize one stable per-hub engine entrypoint; add a Vitest asserting `sort(COMPILED_ROUTING_HUBS) === sort(keys(HUB_CHILD))`, failing P0 with the diverging hub named. Remove `HUB_CHILD` only after all hubs use the stable entrypoint. |
| **CF-ACT-4** | **Runtime reads resolver/activation/engine from the mutable spec tree; fails silent fleet-wide.** ADR-003 promotion is a prerequisite and is a *closure*, not one file. A handoff reopens "guarded coupling" as an option, contradicting the Accepted ADR-003. | **P0** · 2 models | `bin/compiled-route.cjs:16-21` (CONFIRMED); `resolve.cjs:15-20` (CONFIRMED ACTIVATION_ROOT->010); `012/implementation-summary.md:170` (residual-coupling branch) | Promote resolver + engine loader + activation state + per-hub compiled bundles together to a stable runtime path (e.g. `.opencode/bin/lib/`) so runtime never reads under `.opencode/specs`. Make stable-path promotion **binding**; delete the residual-coupling branch. Emit a stderr breadcrumb in each catch. |
| **CF-ACT-5** | **No per-hub serving-status readout; drifted==broken.** Sentinel collapses four causes; nothing reads the 7 manifests. | **P0** · 3 models | `resolve.cjs:40` (CONFIRMED); `advisor-status.ts` (0 hits `servingAuthority`); `mk-skill-advisor.js:826-861`; `012/tasks.md:86` (T007 open) | Ship `.opencode/bin/compiled-route-status.cjs --hub <id> | --all` (a `--fleet` mode of the front door) emitting a stable JSON contract `{hubId, servingAuthority, shadowOnly, selectedPolicy.generation, effectivePolicyHash, fenceEpoch, manifestFingerprint, causeCode}`. Extend `spec_kit_skill_advisor_status` (prompt-safe, size-capped, no blocking spawn) and `session_bootstrap` to surface it. |
| **CF-ACT-6** | **Bi-state flag can't express default-on + explicit kill-switch; predicate is fleet-global (can't do hub-by-hub).** Invalid-value behavior undefined. | **P0** · 2 models | `resolve.cjs:22-23` (CONFIRMED `=== '1'`); `advisor-recommend.ts:362` (CONFIRMED) | Convert both read sites to tri-state in one change: unset=per-hub-default (post-P4) / `1`=force-on / `0|false|off`=force-legacy; strict unset/0/1/invalid truth-table test with fail-closed diagnostics. Add explicit per-hub `defaultEnabled` cohort state advanced one hub at a time (all 7 manifests are already `servingAuthority: compiled`, so unset=on would light the whole fleet — F-5-3). |
| **CF-ACT-7** | **Phase graph is cyclic; P4 gate can pass empty; P4 depends on Planned siblings; 012 is doc-only but the work is runtime.** | **P0** · 1 model (repeated) | `012/plan.md:334-340,174-178,247-253`; `014/spec.md:163-169`; `013`+`014/implementation-summary.md` (Planned); `012/spec.md:117` | Move the read-only eligibility/status interface to P0 (breaks the cycle); add a **P3 coverage-closure join gate** (validated catalogs + playbooks + Lane C pairs + LUNA evidence + completed 013/014); replace "available" with "implemented-and-verified"; designate scoped implementation children (this is what the 015 tree is for). |
| **CF-ACT-8** | **Rollback & audit integrity holes.** `manifest.serving-prior.json` captured only on first flip; `activate-hub.cjs` has no `--rollback`; fence epoch advances on both flip and rollback (state unreconstructable); audit files overwritten (re-mint history lost). | **P0/P1** · 1 model (glm, concrete) | `flip-serving.cjs:125,105,128`; `activate-hub.cjs:79-92,214,244` (INFERRED — verify before building) | Unconditionally re-save `serving-prior` before each forward flip; add `--rollback` to `activate-hub.cjs` reusing `proveRollback` hash validation; add a `direction` field (or stop advancing fence on rollback); switch audit writes to append-only `flip-history.jsonl`. |
| **CF-ACT-9** | **Non-hub archetype disposition undefined.** ADR-002 claims "scales to any skill with no code edit," but the 4-5 non-hub single-skill routers have no manifest and are ineligible by absence with no stated policy. | **P0** · 2 models | `012/decision-record.md:153-252` (ADR-002 line 235); `012/decision-record.md:182-184`; `013/checklist.md:68` | Add an explicit "non-hub routers are ineligible by design" clause covering `sk-git`, `system-code-graph`, `system-skill-advisor`, `system-spec-kit`, `mcp-code-mode`; add negative fixtures; record legacy/follow-up disposition. |
| CF-ACT-10 | **Drift CI + caches watch the wrong inputs.** `routing-registry-drift.yml` doesn't trigger on manifests/runtime/directives/launcher; advisor cache and engine cache don't invalidate on manifest flip/re-mint; frozen-scorer pin duplicated across 3 callers. | P1 · 2 models | `.github/workflows/routing-registry-drift.yml:9`; `mk-skill-advisor.js:150`; `011-runtime-engine/lib/compiled-route.cjs:33-36`; `activate-hub.cjs:46-49`+`flip-serving.cjs:42-45` | Expand path filters + add a live-hash-vs-minted-digest freshness command; include an effective-serving-state fingerprint in the cache key; extract the 3 scorer digests into one shared `compiled-routing-scorer-pins.json`. |
| CF-ACT-11 | **Session/continuity surfaces don't probe router posture.** `routingRecommendation` is code-search guidance (name collision); resume declares context sufficient before probing serving state; canary profile/owner unnamed. | P1 · 1 model | `session-snapshot.ts:161`; `speckit-resume-auto.yaml:110`; `session-prime.ts:292`; `012/checklist.md:66` | Rename to `codeSearchRecommendation` + add typed `skillRouterStatus`; require a live router-status probe for router-cutover packets before the sufficiency early-exit; name the P2 canary profile/owner/window/thresholds/rollback trigger. |

### 2.2 Benchmark — compiled Lane C

| ID | Consolidated finding | Severity · agreement | Evidence | Concrete change |
|----|----------------------|----------------------|----------|-----------------|
| **CF-BM-1** | **Lane C never exercises the compiled path**, and it fits in 2 non-frozen files. The live executor never sets the flag and scores the model's declared JSON, not a compiled decision. Needs a **two-plane gate**: direct compiled-route CLI parity + a separately recorded LUNA-High routed-subject result. | **P0** · 2 models | `run-skill-benchmark.cjs:219,308,30-37`; `executor-dispatch.cjs:201` (not frozen); `live-executor.cjs:363,19` | Author `compiled-routing-parity.cjs` (sibling) exporting `compiledParity({scenario, legacyObserved, skillRoot, skillId})`; attach `row.compiledParity` after `row.routeGold`; add a BLOCKED-BY-COMPILED-DRIFT branch (exit 3). Frozen trio stays byte-identical. |
| **CF-BM-2** | **Vacuous-parity trap:** `SPECKIT_COMPILED_ROUTING=1` alone is insufficient — `resolve.cjs:41-42` also requires `servingAuthority==='compiled'`, else a legacy sentinel a naive lane reads as "compiled matches legacy." | **P0** · 2 models (glm+refine) | `resolve.cjs:41-42` (CONFIRMED); `compiled-route.cjs:36-39` (CONFIRMED sentinel) | Pre-flight MUST read the hub's `010-live-activation/activation/<hub>/manifest.json` and treat `servingAuthority!=='compiled'` as status `vacuous` (hard fail), never a pass. Consume the shared status probe (CF-ACT-5), not sentinel inference. |
| **CF-BM-3** | **Shape impedance:** compiled emits `targetQualifiedIds`; frozen `evaluateRouteGold` reads `observedResources` surface paths. Direct comparison is vocabulary-incompatible. | **P0** · 2 models | `route-gold.typed.json:1`; `score-skill-benchmark.cjs:903-904`; `router-replay.cjs:235-262` | In `compiled-routing-parity.cjs`, translate `targetQualifiedIds` -> legacy `observedResources` via `leaf-resource-contract.cjs` (same `buildResourceContract` library), then call the frozen evaluator. Add a `qualifiedIdToLeaf` reverse-lookup + a Vitest asserting every `targetQualifiedIds` resolves in `leaf-manifest.json`. |
| **CF-BM-4** | **Verdict enum has no degraded slot; OR-collapse hides 3 states.** Planned OR-combination of `compiledRouting.gate.failed` with `routeGold.gate.failed` collapses compiled-serving-violation / drift-fallback / broken-resolver into one BLOCKED — violating 012 REQ-004. | **P0** · 1 model | `score-skill-benchmark.cjs:1765-1773`; `012/spec.md:198`; `014/spec.md:134-136` | Encode a sub-verdict (`compiled-serving | legacy-fallback-drifted | broken-compiled-path`) the outer switch inspects BEFORE deciding BLOCKED/CONDITIONAL/DEGRADED; Vitest asserting distinct outer verdicts. Assign exactly one blocking drift gate; other consumers report its shared classification. |
| CF-BM-5 | **`isHubTypeSkill` keys route-gold on `hub-router.json` existence, not compiled-eligibility** (manifest + allowlist) — a hub can be route-gold ENFORCED while compiled-parity is structurally N/A. | P1/P2 · 2 models | `run-skill-benchmark.cjs:68-70`; `advisor-recommend.ts:41-49`; `resolve.cjs:42` | Return a status enum `{match|drift|vacuous|n/a|resolver-missing}`; verdict treats only `match` as pass, `n/a` as informational. Add `compiledEligibility` to `routeGold.summary` distinguishing hub-type from compiled-eligible. |
| **CF-BM-6** | **Report is renderer-owned (no template);** parity must render from report JSON. A report with no typed-gold exclusions bypasses renderer provenance validation. | **P0** · 2 models | `build-report.cjs:8,51`; `skill-benchmark-report.md` (no template) | Implement the `compiledRouting` JSON->Markdown block in `build-report.cjs`; require populated parity metadata before archiving P4 evidence; cover with a rendered-report fixture test. Do not hand-author per-run reports. |
| CF-BM-7 | **LUNA-High is process-wide config, not per-scenario;** prior LUNA runs exhausted the 150s ceiling; prior evidence has no gold-bearing holdouts (fitted, not generalization). | P1 · 2 models | `executor-dispatch.cjs:146`; `010-live-activation/real-model/run-log.txt:50`; `tier2-luna-routing-analysis.md:3` | Orchestrator-owned scenario map with `providerModel=openai/gpt-5.6-luna`, `variant=high`; capture stdout/stderr separately; classify transport timeout as SKIP (not PASS/FAIL); reserve >=1 gold-bearing held-out paraphrase per hub with its route kept out of the prompt. |
| CF-BM-8 | **The planned parity CLI flag can't reach the orchestrator** — loop-host and both workflows whitelist only the current option set. | P1 · 1 model | `loop-host.cjs:73`; `deep-skill-benchmark-auto.yaml:30` | Add `--compiled-routing-parity` to loop-host + command I/O + both workflow dispatches, OR drop the flag and record an unconditional resolved `auto` mode in every report. |

### 2.3 Playbooks (+ LUNA)

| ID | Consolidated finding | Severity · agreement | Evidence | Concrete change |
|----|----------------------|----------------------|----------|-----------------|
| **CF-PB-1** | **Scenario schema admits gold-less scenarios;** frozen loader accepts id-only; sk-doc scenarios load with null pass-criteria and noncritical status; standard template omits typed manifest gold. | **P0** · 2 models | `load-playbook-scenarios.cjs:526,589-590`; `manual-testing-playbook-snippet-template.md:52` | Add a non-frozen authoring/CI validator requiring `id`, `expected_intent`, `expected_resources`, `expected_workflow_mode`, typed `expected_leaf_resources`, `stage`, and a parseable exact prompt on every compiled-routing scenario; strict topology validation for benchmarked hubs. |
| **CF-PB-2** | **Minimal complete matrix = 7 primary scenarios (one per eligible hub), selected by distinct route shape;** centralize flag/fallback/status mechanics under `system-skill-advisor`; test **serving authority**, not duplicate routing semantics (legacy/holdout/disambiguation are behavior-identical under compiled serving). | **P0** · 2 models | `advisor-recommend.ts:41`; `sk-code/hub-router.json:8`; `system-skill-advisor/manual-testing-playbook.md:17` | One hub-local compiled-routing scenario file per hub (sk-code surfaceBundle; 3 generic ordered bundles; sk-prompt default; sk-design + sk-doc bundle rules), varying default-on / explicit `=0` / drift / resolver-failure; secondary authority checks under Optional Supplemental. |
| **CF-PB-3** | **Evidence contract can pass without proving compiled ran** — records advisor ranking but not `compiledRoute`, serving authority, flag, fallback cause, or manifest identity. | **P0** · 1 model | `sk-code/manual-testing-playbook.md:82` | Add `compiledRoute`, serving-status, flag, fallback-cause, manifest-digest, model, and reasoning-effort fields to global evidence requirements and every new scenario. |
| CF-PB-4 | **Root playbooks are stale/misaligned.** sk-doc root validates the retired flat RESOURCE_MAP; mcp-tooling's Figma+Refero bundle is only prose-supplemental; sk-prompt advertises `orderedBundle` with no bundle rules. | P1 · 1 model | `sk-doc/manual-testing-playbook.md:13`; `mcp-tooling/.../refero-design-reference.md:30`; `sk-prompt/hub-router.json:8` | Realign sk-doc root to `mode-registry.json`/`hub-router.json` before adding its scenario; promote Figma+Refero to a primary row; prove a deterministic sk-prompt dual-intent route or remove `orderedBundle`. |
| CF-PB-5 | **Live Lane C never runs the playbook command/evidence contract** (null pass criteria, noncritical); validator doesn't recurse into per-feature files; verdict enum inconsistent (PASS/FAIL/SKIP vs template PARTIAL/READY). | P1 · 2 models | `load-playbook-scenarios.cjs:589-590`; `create-manual-testing-playbook/...template.md:448,248-269`; `SKILL.md:273-277,350` | Add a non-frozen cutover playbook executor that runs each command sequence and gates on captured signals; a dedicated compiled-routing playbook validator (7 hub IDs, one primary 9-column row/file, all authority-state evidence fields); unify the verdict enum; require every cutover scenario critical + PASS. |

### 2.4 Feature catalogs

| ID | Consolidated finding | Severity · agreement | Evidence | Concrete change |
|----|----------------------|----------------------|----------|-----------------|
| **CF-CAT-1** | **6 of 7 eligible hubs lack a canonical hub-root catalog** — a compiled-routing leaf cannot be added without creating a misleading partial/orphan inventory. | **P0** · 1 model | `advisor-recommend.ts:41-49`; `create-feature-catalog/SKILL.md:211-224` | Either create complete canonical root catalogs for the 6 hubs then add one routing leaf to all 7, OR centralize compiled-routing documentation on the `system-skill-advisor` surface. Never author a single-feature pseudo-catalog. |
| **CF-CAT-2** | **Wording is phase-gated by the authoring current-reality contract:** opt-in/default-off during P0-P3; atomic rewrite to default-on + kill-switch at the SAME P4 stage as the hub's directive. | **P0** · 2 models | `feature-catalog-template.md:30`; `advisor-recommend.ts:362-371` (CONFIRMED still `=== '1'`); `012/plan.md:172-179` | Publish opt-in additive wording pre-cutover; gate default-on + explicit-`=0` wording on the hub passing parity/serving-status/fallback/rollback checks. |
| **CF-CAT-3** | **Feature-flag governance + advisor_recommend entry are the right homes.** `compiledRoute` is an optional field on the advisor_recommend schema; the flag directly gates enrichment. | **P0/P1** · 1 model | `advisor-tool-schemas.ts:221`; `advisor-recommend.ts:362`; `advisor-recommend.md` | Extend the existing `system-spec-kit` feature-flag-governance root+leaf (phased defaults, eligibility, serving status, drift, explicit `=0`); extend `advisor-recommend.md` HOW-IT-WORKS + validation anchors (when `compiledRoute` is attached vs intentionally absent) without creating a new root feature. |
| CF-CAT-4 | **Final catalog source tables can't cite stable paths until the resolver/activation is promoted** (CF-ACT-4). | P0 · 1 model | `create-feature-catalog/SKILL.md:343-351` | Sequence final catalog authoring AFTER resolver promotion + canonical manifest location; cite only durable runtime paths. |
| CF-CAT-5 | **Scope boundaries:** child-mode catalogs must not repeat compiled-router behavior (compiled routing resolves the hub mode before the packet loads); sk-design already owns a manager-shell routing inventory. | P1 · 1 model | `system-deep-loop/SKILL.md:38`; `sk-design/feature-catalog/feature-catalog.md:15` | Add a MANAGER SHELL root + `compiled-routing-and-legacy-fallback.md` leaf to sk-design; exclude mcp-tooling/sk-design/system-deep-loop child-mode catalogs from compiled-router edits. |

### 2.5 Durable archiving

| ID | Consolidated finding | Severity · agreement | Evidence | Concrete change |
|----|----------------------|----------------------|----------|-----------------|
| **CF-ARC-1** | **No durable hub-local report path convention; runner overwrites immutable run labels.** Lane C writes only to the caller `--outputs-dir`; a LUNA run pollutes the parity dir or vanishes. | **P0** · 3 models | `run-skill-benchmark.cjs:295-298`; `014/spec.md:79,109-118`; `create-benchmark/SKILL.md:485,494` | Add a "Report Path Convention": `<hub>/benchmark/compiled-routing/<run-label>/{skill-benchmark-report.json,.md}` as the durable sibling of `router-final/`/`live-final/`; fail-closed when a run-label dir/pair already exists; update the 7 hub `benchmark/README.md` index rows. |
| **CF-ARC-2** | **No `serving-snapshot.json` joining manifest+fence+flip+live-hash+flag+parity** into one durable artifact; current per-hub evidence is split across 4 files under the spec tree. | **P0** · 1 model | `010-live-activation/activation/sk-code/{manifest,fence-state,activation-record,serving-flip-record}.json`; `activate-hub.cjs:244`; `flip-serving.cjs:137` | Define+ship `serving-snapshot.json` (hubId, capturedAt, flag, manifest{selectedPolicyHash,generation,fenceEpoch,servingAuthority,shadowOnly}, liveConfigHash, freshness, engineResolverPath, parityBaseline, realModelLast) + a renderer under `create-benchmark`; optionally a session-start `mk-compiled-routing-snapshot.js` plugin. |
| CF-ARC-3 | **Reports serialize an absolute worktree root** (already stale in the shipped sk-code report) — evidence bound to a machine/path that no longer exists. | P1 · 2 models | `sk-code/benchmark/router-final/skill-benchmark-report.json:7-10`; `code-opencode/benchmark/router-mode-a/skill-benchmark-report.json:9`; `score-skill-benchmark.cjs:1797`; `build-report.cjs:53` | Emit repo-relative `rootRel` + immutable source/input digests (orchestrator-owned, not in the frozen scorer); render+validate provenance from JSON; update provenance validation to accept the relative form. |
| **CF-ARC-4** | **Embed parity in the canonical Lane C report pair, not a copied spec-tree artifact; don't repurpose the frozen `baseline` label; archive against the serving 010 manifests, never 006 candidates.** | **P0** · 1 model | `skill-benchmark-storage-guide.md:120-148,89-109`; `resolve.cjs:19-20` (CONFIRMED reads 010) | Add `report.compiledRouting` rendered via `build-report.cjs`; create immutable `router-compiled-parity-baseline`/`-final` siblings leaving `baseline` untouched; generate through the public front door against active 010 manifests. |
| CF-ARC-5 | **Live reports omit exact model/variant/executor** — a `live-gpt-5-6-luna-high/` folder alone can't prove the LUNA-HIGH subject; audit files overwritten lose re-mint history; one report can span serving generations. | P1 · 2 models | `score-skill-benchmark.cjs:1791-1797`; `live-executor.cjs:363,379`; `run-skill-benchmark.cjs:99`+`resolve.cjs:26` | Persist an execution-context block (executor, exact model, variant, CLI version, flag state, runtime digest, manifest digest, scenario IDs, run revision); append-only `flip-history.jsonl`; snapshot + post-verify activation-manifest bytes/digest and abort (not archive) when any serving identity changes mid-run. |

### 2.6 sk-code alignment

| ID | Consolidated finding | Severity · agreement | Evidence | Concrete change |
|----|----------------------|----------------------|----------|-----------------|
| **CF-SC-1** | **The named RESOURCE_MAP equality gate is inert:** `verify_alignment_drift.py` is markdown-blind (TS/JS/Py/Shell/Rust/JSON only), yet `code-opencode/SKILL.md` cites it as enforcing parent-child equality. The real guard (`sk-code-router-sync.vitest.ts`) is two scripts away and uncross-referenced. | **P0** · 2 models | `verify_alignment_drift.py:39-51,457-497,558`; `code-opencode/SKILL.md:45,51`; `alignment-verification-automation.md:48-52` | Either rename the inline claim to name `sk-code-router-sync.vitest.ts` + backlink from `alignment-verification-automation.md §5`, OR extend `verify_alignment_drift.py` with a markdown RESOURCE_MAP parser behind `--check-router` (default off) invoking `router-replay.cjs parseRouter` per SKILL.md — with positive + drift fixtures. |
| **CF-SC-2** | **No typed-pair bridge between compiled `targetQualifiedIds` and surface RESOURCE_MAP paths;** code-opencode RESOURCE_MAP entries aren't packet-qualified vs the populated leaf-manifest. | **P0** · 1 model | `006-*/001-sk-code/compiled/route-gold.typed.json:1`; `code-opencode/SKILL.md:73-156`; `leaf-manifest.json:4-71`; `router-replay.cjs:571-578` | Add `qualifiedIdToLeaf` to `leaf-resource-contract.cjs` (exposed via `selectResourceContract`); add Vitests asserting every `targetQualifiedIds` resolves to a leaf, and every code-opencode RESOURCE_MAP entry matches a manifest leaf after normalization (bidirectional). |
| **CF-SC-3** | **The public front door supplies only prompt text**, but sk-code surfaceBundle routing needs risk-slice/certificate context — so code-opencode can't be proven end-to-end through the current interface. | **P0** · 1 model | `011-runtime-engine/lib/compiled-route.cjs:73` | Extend the runtime request contract with safe composite-routing context; add a LUNA-high case requiring a `surfaceBundle` containing `sk-code:code-opencode`. |
| CF-SC-4 | **Three disjoint drift guards, zero overlap, no orchestrating contract;** the surface names only the first. | P1 · 1 model | `verify_alignment_drift.py:558`; `verify_stack_folders.py:1-47`; `sk-code-router-sync.vitest.ts:1-193` | Add `run-all-drift-guards.sh` invoking all three (non-zero on any failure); reference it from `SKILL.md:163` so the gate lists three concrete commands. |
| **CF-SC-5** | **Create-skill requires shared freshness + data-driven discovery and forbids a local eligibility map** — a single-authority interface is prerequisite to drift-CI, benchmarking, and onboarding. | **P0** · 1 model | `013/spec.md:127,162` | Give ONE 015 child ownership of the code-opencode RESOURCE_MAP + alignment verifier + manifest-input derivation + shared discovery API; require all later children to consume it. |

### 2.7 sk-doc templates

| ID | Consolidated finding | Severity · agreement | Evidence | Concrete change |
|----|----------------------|----------------------|----------|-----------------|
| **CF-TPL-1** | **P4 lockstep names 7 SKILL.md directives but omits BOTH create-skill parent templates** (active scaffold + copy-from), which still encode literal-`1`/off-by-default wording. | **P0** · 2 models | `013/spec.md:88-100,107,162-168`; `012/plan.md:176` | Add both parent templates to the P4 cutover controller; require normalized parity across both templates + all 7 hub directives + create-skill docs + generated-fixture tests. |
| CF-TPL-2 | **Catalog `trigger_phrases` don't drive advisor routing** — the live harvester scans only `references`/`assets`, excluding feature-catalog dirs. The template claims otherwise. | P1 · 2 models | `doc-frontmatter-harvest.md:20-37`; `doc-frontmatter.ts:146-190` | Either remove the routing-effect claim from the catalog template, OR extend harvesting to feature-catalog leaves with capped scoring + invariance tests. |
| CF-TPL-3 | **Topology validator is quote-intolerant** while the Lane C loader accepts quoted YAML — a copyable-template failure mode. | P1 · 1 model | `validate-playbook-topology.cjs:95` | Make topology parsing quote-tolerant; document one canonical typed-gold serialization; test quoted + unquoted. |
| CF-TPL-4 | **Validation can't prove catalog completeness** and treats off-taxonomy types as warnings; the snippet template claims only 2 valid test types vs 12 canonical. | P1/P2 · 2 models | `validate_document.py:728-736`; `feature-catalog-snippet-template.md:157` | Add a strict package validator (router + 7 hubs, root-leaf bijection, source-path existence, taxonomy); align the template's test-type list with the validator. |
| CF-TPL-5 | **sk-doc separates template-repair vs content-population vs renderer-emission** into different implementation boundaries. | P1 (meta) · 1 model | `create-feature-catalog/SKILL.md:440-441`; `create-benchmark/SKILL.md:454` | Author separate 015 children in order: template-validator alignment -> catalog/playbook population -> benchmark execution-archiving. |

---

## 3. UNNAMED GAPS — new risks beyond the 4 named coverage gaps (ranked)

The four named gaps = catalogs (0/24), benchmark (legacy-only Lane C), playbooks (0/39), durable results (0 outside specs). Genuinely new risks surfaced by the loop, ranked by blast radius:

1. **[P0] End-to-end effectiveness void (CF-ACT-1).** The bridge/hook chain strips `compiledRoute` before any agent boundary. This is *the* new gap: "coverage" is meaningless if the decision never reaches a consumer. CONFIRMED (bridge 0 hits).
2. **[P0] Dual flag-strip (CF-ACT-2).** The flag can't reach the daemon child; a canary is impossible. CONFIRMED (both allowlists).
3. **[P0] Engine-dispatch coupling (CF-ACT-3) + spec-tree closure (CF-ACT-4).** ADR-002/003 rest on a mis-modeled `HUB_CHILD`; the runtime reads mutable spec paths and fails silent. CONFIRMED.
4. **[P0] Observability void (CF-ACT-5) + three nested silent catches.** drifted==broken with no telemetry. CONFIRMED catches.
5. **[P0] Bi-state flag (CF-ACT-6).** Can't express the very default-on/kill-switch the program is named for. CONFIRMED.
6. **[P0] Cyclic phase graph + empty-passable P4 gate (CF-ACT-7).** The plan can "succeed" having proven nothing.
7. **[P0/P1] Rollback & audit integrity (CF-ACT-8).** No scripted `activate --rollback`; stale `serving-prior`; fence can't distinguish cutover from recovery; overwritten audit trail. INFERRED line numbers — verify.
8. **[P0] Non-hub archetype policy undefined (CF-ACT-9).** 4-5 routers ineligible by absence; ADR-002 over-promises.
9. **[P1] LUNA evidence overfit (CF-BM-7).** Prior routing evidence has no gold-bearing holdouts — proves fitted-prompt behavior, not generalization.
10. **[P1] Absolute worktree paths in shipped reports (CF-ARC-3).** Already-stale provenance in committed artifacts. CONFIRMED as a class by the 012 evidence chain.
11. **[P1] `routingRecommendation` field collision (CF-ACT-11).** A cutover-time footgun: an existing field named like router state actually carries code-search guidance.
12. **[P2] Catalog census undercount.** The 24th catalog uses uppercase `FEATURE-CATALOG.md`; lowercase-only discovery undercounts — the true catalog population and the "0/24" baseline are both off-by-case. `mcp-tooling/mcp-click-up/feature-catalog/FEATURE-CATALOG.md:2` (F-1-6).
13. **[P2/doc-integrity] 009-non-hub-rollout Phase Map lists 1 of 4 children** (`005-mcp-code-mode` missing entirely) — a documentation-vs-disk drift that will mislead the non-hub disposition work. `009-non-hub-rollout/spec.md:25-28` (F-8-6). INFERRED — `ls` to confirm.
14. **[P1/self] The 015 research JSONL omits canonical iteration fields** (`type`, `newInfoRatio`, `status`, novelty justification) required by the deep-research executor contract — reducer-side canonicalization needed before automation consumes this lineage. `deep-research-state.jsonl:18` vs `deep-research/SKILL.md:271` (F-22-7).

---

## 4. CONTRADICTIONS & UNCERTAINTIES — what the verifier MUST check

| # | Contradiction / uncertainty | Status | What would confirm |
|---|-----------------------------|--------|--------------------|
| 1 | **ADR-002 "scales to any skill with no code edit per skill" vs `HUB_CHILD` being an engine-dispatch table.** | CONFIRMED contradiction — `HUB_CHILD` engine-loads from `006-*` (I read `compiled-route.cjs:35-62`). ADR-002's premise is wrong as written. | Already confirmed. Verifier: decide whether the manifest carries an engine locator (CF-ACT-3) or `HUB_CHILD` stays as an engine map decoupled from eligibility. |
| 2 | **ADR-003 "promote resolver" (Accepted/recommended) vs a handoff reopening guarded spec-tree coupling.** | Live contradiction in docs — `012/implementation-summary.md:170` (INFERRED, agent-reported). | Read `012/implementation-summary.md:170` + `012/decision-record.md` ADR-003 status; make promotion binding and delete the residual branch. |
| 3 | **Verdict OR-collapse (CF-BM-4).** Claim that 014's planned OR-combine collapses 3 states. | INFERRED from two Planned docs (`014/spec.md:134-136` + `score-skill-benchmark.cjs:1765-1773`); 014 is not built. | Verifier: when building Lane C, assert 3+ distinct sub-verdicts with a regression test before wiring the gate. |
| 4 | **"All 7 manifests already compiled-serving" (F-5-3).** | PARTIAL — sk-code confirmed `servingAuthority: compiled` (via the resolve/manifest chain); other 6 INFERRED. | `cat` all 7 `010-live-activation/activation/<hub>/manifest.json`. Load-bearing: if true, unset=on lights the whole fleet at once, so per-hub cohort state (CF-ACT-6) is mandatory before P4. |
| 5 | **Rollback/audit line citations (CF-ACT-8).** `flip-serving.cjs:125,105,128`; `activate-hub.cjs:79-92,214,244`. | INFERRED (glm-5.2, single model, not re-verified). | Read those ranges before authoring rollback changes; the *mechanism* (serving-prior first-flip-only, no `--rollback`, fence-on-both) is plausible but unverified. |
| 6 | **009 Phase Map 1-of-4 (F-8-6) and catalog uppercase count (F-1-6).** | INFERRED counts. | `ls 009-non-hub-rollout/` and `find . -iname 'feature-catalog.md'` (case-insensitive) to get true counts. |
| 7 | **Line-number drift.** Some raw citations are off by ±2 lines (e.g. the `bin/compiled-route.cjs` catch is `:36-38`, some findings cite `:36-39`). | Minor. | Treat registry `file:line` as ±2; re-anchor on the symbol, not the number, at build time. |

No finding proposes editing the frozen scorer or changing a routing decision; the synthesis rejects any that would. All "parity"/"activation" work stays additive, byte-identical, and reversible by construction.

---

## 5. ENABLE-BY-DEFAULT SAFETY DEPENDENCY GRAPH (P0->P4)

What MUST be true, in order, before the repo default can flip. Each gate is reversible (flag=`0` or byte-identical prior manifest) and re-asserts the frozen-scorer pin + "no routing-decision change" invariant.

```text
                         [ ADR-003 binding: promote resolver+engine+activation+bundles ]  (CF-ACT-4)
                                              |
        +-------------------------------------+-------------------------------------+
        v                                     v                                     v
P0  [ Split eligibility vs        [ Serving-status probe            [ ENV-REFERENCE doc +
     engine-dispatch +             --all + wire advisor_status/       tri-state flag in BOTH
     cross-check test ]            session_bootstrap + stderr ]       read sites ]
     (CF-ACT-3)                    (CF-ACT-5)                         (CF-ACT-6, CF-CAT-3)
        |                                     |                                     |
        +-------------------+-----------------+------------------+------------------+
                            v                                    v
P1  [ Un-strip flag in BOTH child-env allowlists ]   [ Un-drop compiledRoute through bridge+hook ]
     (CF-ACT-2)  --- PREREQ for canary                (CF-ACT-1)  --- PREREQ for effectiveness
                            |                                    |
                            +------------------+-----------------+
                                               v
P1  [ Drift CI watches real inputs ] + [ Lane C compiled-parity harness (offline, verdict sub-state, render-from-JSON) ]
     (CF-ACT-10)                          (CF-BM-1..6)
                                               |
                                               v
P2  [ Named canary profile+owner ] + [ Two-plane LUNA-HIGH acceptance (timeout=SKIP, holdouts) ]
     (CF-ACT-11)                        (CF-BM-7)
                    + [ Durable archiving: report-path convention + serving-snapshot + portable provenance ]
                      (CF-ARC-1..5)
                                               |
                                               v
P3  [ Single manifest-freshness eligibility predicate BOTH consumers derive from (ADR-002, HUB_CHILD-corrected) ]
     + [ Non-hub archetype policy (CF-ACT-9) ]
     + [ COVERAGE-CLOSURE JOIN GATE: 7 catalogs+advisor (CF-CAT-*) · 7-hub playbook matrix (CF-PB-*)
         · Lane C pairs (CF-ARC-4) · LUNA evidence · create-skill ready fixture (CF-SC-5)
         · verify_alignment_drift markdown gate live (CF-SC-1) ]
                                               |
                                               v
P4  [ Staged hub-by-hub default-on: tri-state default + 7 SKILL.md directives + BOTH create-skill
     parent templates in lockstep (CF-TPL-1); per hub: route-gold parity + compiled-serving status
     + clean fallback + unchanged scorer hashes; =0 kill-switch drill + per-hub manifest rollback
     (needs activate --rollback, CF-ACT-8); catalog wording atomic rewrite (CF-CAT-2) ]
```

**Hard invariants at every gate:** frozen scorer SHA-256 unchanged; compiled == legacy on routing fields; rollback named and proven; no runtime read under `.opencode/specs`.

---

## 6. RECOMMENDED 015 CHILD-SPEC BREAKDOWN

`015-routing-coverage-activation-verification/` currently holds only `001-research/`. Author these children (phase-parent trio at 015 root: `spec.md` + `description.json` + `graph-metadata.json`). Order mirrors the P0->P4 DAG; children 006-009 are parallelizable once 002 lands.

| Child | Scope (one line) | Level | Consumes |
|-------|------------------|-------|----------|
| **002-runtime-promotion-and-status-foundation** | ADR-003 promotion of the resolver+engine+activation+bundle closure out of the spec tree; split manifest-eligibility from `HUB_CHILD` engine-dispatch + cross-check test; ship `compiled-route-status.cjs --all` and wire it into `advisor_status`/`session_bootstrap`; document the flag in ENV-REFERENCE; tri-state the flag in both read sites; stderr breadcrumbs. **The P0 foundation every other child depends on.** | **3** | — |
| **003-flag-propagation-and-effective-consumption** | Add `SPECKIT_COMPILED_ROUTING` to both `CHILD_ENV_ALLOWLIST` sets; thread `compiledRoute` (or `metadata.compiledRouteSummary`) through `buildNativeBrief` + CLI brief + hook render; manifest-fingerprint cache invalidation; e2e bridge+plugin tests. **Makes the flag reachable and the decision consumable.** | 3 | 002 |
| **004-benchmark-compiled-lane-c** | `compiled-routing-parity.cjs` sibling + 2 orchestrator hooks; shape bridge (`qualifiedIdToLeaf`); verdict sub-state (no OR-collapse); render-from-JSON block + fixture; frozen-trio SHA-256 pins. | 2 | 002 |
| **005-playbooks-and-luna-acceptance** | 7-hub compiled-routing scenario matrix (serving-authority focus) + evidence fields + strict scenario/topology validator + non-frozen cutover executor; separate two-plane LUNA-HIGH live acceptance stage (timeout=SKIP, gold-bearing holdouts). | 2-3 | 002, 004 |
| **006-feature-catalogs** | 7 hub-root catalogs (or advisor-central) + one routing leaf each; extend feature-flag-governance + advisor_recommend entry; phase-gated wording (opt-in now, default-on at P4); durable source paths only. | 2 | 002 |
| **007-durable-archiving-and-serving-snapshot** | Report-path convention (`<hub>/benchmark/compiled-routing/<run-label>/`); `serving-snapshot.json` schema + renderer; portable repo-relative provenance + digests; append-only `flip-history.jsonl`; overwrite fail-closed. | 2 | 002, 004 |
| **008-sk-code-alignment-and-drift-guards** | Make the RESOURCE_MAP equality gate real (markdown parser behind `--check-router`, or rename+backlink to the vitest); `qualifiedIdToLeaf` bidirectional bijection tests; `run-all-drift-guards.sh`; surfaceBundle e2e context; **owns the single code-opencode alignment authority interface (CF-SC-5).** | 2 | 002 |
| **009-sk-doc-template-alignment** | Test-type taxonomy 2->12; topology quote-tolerance; drop/fix the catalog `trigger_phrases` routing claim; strict package validator (router+7 hub bijection); add BOTH create-skill parent templates to the P4 lockstep set. | 2 | 002 |
| **010-rollback-audit-and-non-hub-policy** | `activate-hub.cjs --rollback`; unconditional `serving-prior` refresh; fence `direction`; append-only audit; explicit non-hub archetype ineligibility policy + negative fixtures; name the P2 canary profile/owner/window/thresholds. | 2 | 002 |
| **011-activation-cutover-p4** | The staged hub-by-hub default-on controller: tri-state default flip + lockstep directives/templates/catalog wording; the P3 coverage-closure join gate; `=0` kill-switch drill; per-hub stop-on-first-failure gate. **Depends on all above.** | 3 | 002-010 |

> Rationale for the split follows the loop's own guidance: F-22-3 ("one 015 child owns the shared alignment authority" -> 008), F-22-4 ("separate children for template-validator alignment, catalog/playbook population, benchmark execution-archiving" -> 004/006/007/009), and F-25-1 ("designate scoped implementation children for P0-P4" -> 002/003/011). Operators wanting a leaner tree may fold 003 into 002 (both P0 runtime) and 010 into 002/007, yielding a 002-008 seven-child tree; the DAG is unchanged.

---

## 7. IMPLEMENTATION SEQUENCING — ordered, reversible build plan

Each step: build behind the still-off flag; verify byte-identical legacy routing (Lane C legacy replay unchanged); re-hash the frozen trio; `validate.sh --strict` the child; name a rollback. No step changes a routing decision.

1. **002 foundation.** Promote the closure; split eligibility/engine-dispatch; ship the status probe; tri-state the flag; ENV doc.
   *Verify:* spec-tree-move simulation still resolves (no runtime read under `specs/`); `compiled-route-status.cjs --all` emits 7 rows with distinct cause codes; cross-check test `sort(COMPILED_ROUTING_HUBS)===sort(keys(HUB_CHILD))` green; tri-state truth-table (unset/0/1/invalid) test; frozen SHA-256 unchanged; legacy Lane C replay byte-identical. *Rollback:* revert to prior resolver path; flag stays off.
2. **003 propagation + consumption.** Un-strip the flag; un-drop `compiledRoute`.
   *Verify:* child-process probe shows the flag present in the daemon env; e2e bridge test shows `compiledRoute` survives to the injected brief; `=0` propagates and kills; routing decisions still byte-identical (additive only). *Rollback:* remove allowlist entries + brief threading; behavior returns to today's no-op.
3. **004 benchmark Lane C.** Parity harness + verdict sub-state + render-from-JSON + shape bridge.
   *Verify:* `match|drift|vacuous|broken|n/a` fixtures each produce the right sub-verdict; frozen-trio SHA-256 pre==post; rendered-report fixture; D1-D5 legacy scores unchanged (before/after fixture). *Rollback:* the lane is additive; disable the gate, keep the diagnostic.
4. **006 catalogs · 007 archiving · 008 sk-code-align · 009 sk-doc-templates** (parallel, all consume 002).
   *Verify each:* its own validator (strict package validator / topology / drift-guards / provenance) + `validate.sh --strict`; catalogs cite only durable runtime paths; `verify_alignment_drift --check-router` catches a seeded drift fixture. *Rollback:* docs/validators are additive and revertible.
5. **005 playbooks + LUNA acceptance.**
   *Verify:* 7-hub matrix present; each scenario records the full evidence contract; LUNA-HIGH two clean runs per prompt with transport timeout classified SKIP; >=1 gold-bearing holdout per hub routes correctly. *Rollback:* scenarios are additive; the live stage is off by default.
6. **010 rollback-audit + non-hub policy.**
   *Verify:* `activate --rollback` drill restores the byte-identical prior manifest; fence `direction` reconciles cutover vs recovery; non-hub negative fixtures stay legacy; audit append-only. *Rollback:* the new command is opt-in; audit format is additive.
7. **011 P4 cutover** — per hub, stop-on-first-failure, in blast-radius order.
   *Per-hub verify:* route-gold parity (compiled==legacy) + `compiled-serving` status + clean fallback + unchanged scorer hashes + `=0` drill; THEN atomically rewrite that hub's catalog wording to default-on+kill-switch. *Rollback:* set `SPECKIT_COMPILED_ROUTING=0` fleet-wide (instant legacy) and/or restore the hub's prior manifest; stop at the first failed gate.

**Global gates repeated every step:** frozen scorer pin (SHA-256 before/after); compiled==legacy on routing fields; no runtime read under `.opencode/specs`; a named, proven rollback.

---

## Appendix A — Spot-check ledger (verified against the real repo this session)

| Claim | Location | Result |
|-------|----------|--------|
| Flag gate `!== '1' return output` | `advisor-recommend.ts:362` | CONFIRMED |
| Additive attach `{...recommendation, compiledRoute}` (never recomputes skillId) | `advisor-recommend.ts:371` | CONFIRMED |
| Sentinel -> undefined | `advisor-recommend.ts:351` | CONFIRMED |
| `COMPILED_ROUTING_HUBS` = exactly 7 hubs | `advisor-recommend.ts:41-49` | CONFIRMED |
| Resolver resolves into spec tree | `bin/compiled-route.cjs:16-21` | CONFIRMED |
| Silent legacy sentinel, no stderr | `bin/compiled-route.cjs:33-39` | CONFIRMED (catch `:36-38`) |
| Bi-state `flagEnabled() === '1'` | `resolve.cjs:22-23` | CONFIRMED |
| Dual gate flag AND servingAuthority | `resolve.cjs:40-42` | CONFIRMED |
| ACTIVATION_ROOT -> 010-live-activation | `resolve.cjs:19` | CONFIRMED |
| `HUB_CHILD` engine map -> 006-* + `loadHubEngine` requires from it | `011-runtime-engine/lib/compiled-route.cjs:23-31,35-62` | CONFIRMED |
| ENV-REFERENCE has zero `SPECKIT_COMPILED_ROUTING` | `system-spec-kit/.../ENV-REFERENCE.md` | CONFIRMED (0 hits) |
| Launcher `CHILD_ENV_ALLOWLIST` omits the flag | `mk-skill-advisor-launcher.cjs:99,267` | CONFIRMED (0 hits) |
| Bridge omits flag AND drops `compiledRoute` | `mk-skill-advisor-bridge.mjs:58,539-551` | CONFIRMED (0 hits each) |

Everything else in this synthesis is INFERRED from the findings registry (agent-reported, not re-verified this session) and is flagged as such where load-bearing (see §4).
