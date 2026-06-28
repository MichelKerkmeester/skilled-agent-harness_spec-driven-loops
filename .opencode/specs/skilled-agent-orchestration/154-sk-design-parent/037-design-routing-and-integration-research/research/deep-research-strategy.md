---
title: Deep Research Strategy - sk-design routing + integration enforcement (50 non-converging)
description: Runtime strategy for a 50-iteration non-converging deep-research run that deepens the sk-design family AND designs the enforcement guaranteeing parent->sub-skill routing/utilization, more-specific design commands, the mcp-open-design pairing, and cross-CLI survival. Anti-convergence via a ~57-angle bank + a parallel monitor that injects angles / broadens / switches corpus.
trigger_phrases:
  - "sk-design routing integration research"
  - "design routing enforcement research"
  - "037 design routing research"
importance_tier: normal
contextType: planning
version: 1.0.0.0
---

# Deep Research Strategy - Session Tracking

Runtime strategy for the deep-research session. Tracks progress across 50 iterations.

## 1. OVERVIEW

### Purpose
Persistent brain for a 50-iteration NON-CONVERGING run. It must not converge: each iteration is fed a genuinely fresh angle from the ~57-angle bank (`research/angle-bank.json`). A parallel monitor watches `deep-research-state.jsonl` and, when newInfoRatio falls or an angle exhausts, injects the next angle / broadens / switches the corpus by writing `research/.next-angle`. When the impeccable corpus is mined out, expand to `external/designer-skills-main`.

### Usage
- Per iteration: the GPT-5.5-xhigh (cli-codex) executor reads NEXT FOCUS (the active angle from `.next-angle` or the bank-by-index), researches that ONE angle, verifies every claim against the real on-disk files, and writes iteration evidence + a delta with a newInfoRatio estimate.
- Convergence is a SIGNAL only (logged), never a stop. maxIterations=50 is the only stop.

---

## 2. TOPIC
Improve the `sk-design` design family AND design the enforcement that guarantees: (D1) residual feature/reference/asset craft; (D2) more-specific, more-useful `/design:*` commands; (D3) parent->sub-skill routing + UTILIZATION; (D4) mcp-open-design always loads sk-design + sub-skills; (D5) the guarantee survives cli-opencode/cli-codex/cli-claude-code dispatch; (D6) corpus expansion to designer-skills-main for fresh angles. RESEARCH ONLY — emit a buildable backlog; no live sk-design edits.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1 (D2): How should each `/design:*` command be made specific + useful (real arg grammar, sibling discriminator, example, deliverable shape, mode-vs-task), and should metadata derive from `mode-registry.json`?
- [ ] Q2 (D3): How is parent->sub-skill routing made deterministic + provable (structural -> hub-router-replay over a gold corpus -> content-bound utilization proof), and what is enforceable vs advisory?
- [ ] Q3 (D4): What deny-by-default, content-bound-token mechanism guarantees mcp-open-design always invokes sk-design + sub-skills across MCP/CLI/HTTP/automation surfaces?
- [ ] Q4 (D5): How does the design contract survive into cli-opencode/codex/claude-code children (and the od inner generation agent) — payload-carry + demand-back + parent-side re-validation?
- [ ] Q5 (all): The prioritized, buildable backlog per dimension with each item labeled enforceable vs advisory.

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Editing live sk-design / commands / mcp-open-design / cli-* content this phase. Research only; the build is a later phase.
- Claiming a metaphysical "1000%" runtime guarantee — name what is deterministically enforceable vs intrinsically advisory.
- Letting the loop converge — re-angle/broaden/expand instead.

---

## 5. STOP CONDITIONS
- EXACTLY one: 50 iterations completed. Convergence does NOT stop the run.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Should `commandSurface` live directly in `mode-registry.json`, or should `mode-registry.json` stay routing-only with a sibling `command-metadata.json` for usage/examples? (iteration 6)
- Should `/design:interface`'s first example end at a design handoff, or should it explicitly include the `sk-code` continuation pattern because interface work commonly becomes implementation? (iteration 6)
- Should the command wrappers contain the example text directly, or should a generated README/docs page be the primary human-facing surface with wrappers limited to frontmatter? (iteration 6)
- Should `commandSurface.outputContract` live inside `mode-registry.json`, or should command metadata stay separate so the registry remains routing-only? (iteration 8)
- Should wrappers include only the compact `Returns` line while richer expected-output blocks live in generated docs, or should the command files themselves carry both? (iteration 8)
- Should the command return protocol add a machine-readable line such as `DELIVERABLE="<artifact>"` alongside `STATUS=OK`, or is metadata-backed prose enough for enforcement? (iteration 8)
- Should command wrappers carry full `Pitfalls` prose, or only the compact blocking contract while generated docs carry richer teaching examples? (iteration 9)
- Should preconditions and failure modes live in `mode-registry.json` under `commandSurface`, or should a sibling `command-metadata.json` own all command-facing grammar/docs/checker fields? (iteration 9)
- Should under-specified pinned command prompts fail closed with a grouped question, or defer upward to the `sk-design` hub whenever the missing input could imply another mode? (iteration 9)
- Which failure signals deserve a machine-readable line, e.g. `MISSING_INPUT="<target-artifact>"` or `BLOCKED_BY="<playwright-url-unreachable>"`, alongside `STATUS=FAIL`? (iteration 9)
- Should the implementation create one wrapper file per verb under `.opencode/commands/design/`, or should `/design:refine <verb>` exist as a grouped command while the command palette exposes selected pinned shims? (iteration 11)
- Should `polish` be allowed to orchestrate accepted fixes after reporting, or should it stop at a pre-ship design backlog unless the user explicitly asks for implementation? (iteration 11)
- Should task-command metadata live inside `mode-registry.json` under `commandSurface.tasks`, or in a sibling `command-metadata.json` that points back to registry modes? (iteration 11)
- How should the fixture suite adjudicate ambiguous prompts like "make this cleaner", which may map to `quieter`, `distill`, `polish`, or `audit` depending on evidence? (iteration 11)
- Should the command be named `/design:directions` or `/design:variants`, given existing trigger wording says both "variations" and "directions"? (iteration 12)
- Should command metadata live in `mode-registry.json.commandSurface.tasks` or a sibling `command-metadata.json` that points back to modes and router intent keys? (iteration 12)
- Should `/design:handoff` exist as its own sibling command, or should it be an output mode of `/design:interface` and `/design:directions` after a direction is chosen? (iteration 12)
- Should `COPY_MOCK_DATA` remain folded into `preflight`, or should a future `/design:copy` or `/design:clarify` command own UX-writing and mock-data realism? (iteration 12)
- Should there be a first-class `/design` no-argument menu/recommendation surface, or should each pinned command only return `NEXT_OPTIONS`? (iteration 13)
- Should lifecycle metadata live inside `mode-registry.json.commandSurface.pipeline`, or in a sibling `command-metadata.json` that points back to mode keys? (iteration 13)
- What exact proof card links one stage's produced artifact to the next stage's accepted input without turning the handoff into self-attestation? (iteration 13)
- Should `registerPolicy` live inside `mode-registry.json.commandSurface`, or in a sibling `command-metadata.json` that points back to mode keys and task projections? (iteration 14)
- Should ambiguous register resolution fail closed with `STATUS=ASK MISSING_REGISTER`, or should it default to Product when the command is pinned and no surface cue exists? (iteration 14)
- How should fixture replay represent mixed apps where `/marketing` is Brand and `/app/settings` is Product inside the same repo? (iteration 14)
- Should hub frontmatter keywords be generated from `mode-registry.json` plus `command-metadata.json`, or should they remain a broad advisor-only compatibility surface checked only for required inclusions? (iteration 15)
- Which exact fixture runner should own command alias replay: a new `design-command-surface-check.mjs`, or an extension of the deep-improvement skill-benchmark scripts? (iteration 15)
- Should command metadata include generated wrapper body templates, or only frontmatter plus machine-readable fields while the markdown body stays a stable generic bridge? (iteration 15)
- Which fixture runner should own the four-lane command-surface replay: a new `design-command-surface-check.mjs` or the deep-improvement skill-benchmark harness? (iteration 16)
- Should pinned shortcuts be supported for the future `/design:*` family at all, or should the command palette expose direct commands while natural language always starts from the hub? (iteration 16)
- Should `hubKeywordProjection` be generated from command metadata plus registry aliases, or should hub keywords remain a compatibility list with only required-inclusion checks? (iteration 16)
- Should `md-generator` keep raw `Bash`, or should it move to a constrained command-pattern allowlist similar to impeccable-main's script-only grant? (iteration 17)
- Should mutation-free `/design:*` wrappers include `Task` when the command host supports it, or should command wrappers stay stricter than child mode packets and use only `Read`, `Glob`, and `Grep`? (iteration 17)
- Should `toolPolicy` live inside `mode-registry.json.commandSurface` or in a sibling `command-metadata.json` that points back to `workflowMode`? (iteration 17)
- Should the skill-benchmark harness grow a generic registry-router adapter, or should `sk-design` own a local `design-hub-router-replay.mjs` that emits the same observed-result shape? (iteration 18)
- Should multi-axis prompts return an ordered mode bundle, or should the deterministic router fail closed with a `deferReason` unless a command/workflow supplies the order? (iteration 18)
- Should the parseable hub router live directly in `mode-registry.json.router`, or should `mode-registry.json` remain identity-only with a generated sibling `hub-router.json`? (iteration 18)
- Should the benchmark harness score source proof as a new D3-content lane, a D5 hard gate extension, or a separate proof gate that caps READY/adoption claims only? (iteration 19)
- Should content-bound proof live directly in `context_loaded_card.md` and `proof_of_application_card.md`, or should the cards reference a separate `source_proof_card.md` to avoid making the one-screen cards too heavy? (iteration 19)
- Should live executors try to hash `tool_use` read outputs when available, or should they rely on model-emitted `sourceProofs` plus offline verification against the current repo checkout? (iteration 19)
- Should registry aliases be the same strings used for advisor activation, or should aliases split into `wakeAliases` and `modeAliases` to avoid over-triggering the parent skill? (iteration 20)
- Should the benchmark harness own the registry-router adapter generically for parent hubs, or should `sk-design` own a local adapter until another hub needs the same shape? (iteration 20)
- Should `routerPolicy` live directly in `mode-registry.json`, or should the registry stay identity-only and generate a sibling `hub-router.json`? (iteration 20)
- Should `modeBundle` be an ordered list of mode keys only, or should it carry roles such as `primary`, `foundation`, `support`, `validation`, and `handoff`? (iteration 21)
- Should bundle-mismatch become a D1-intra gate in the skill-benchmark harness, or a new hub-routing gate before packet router replay? (iteration 21)
- Should mutually ambiguous prompts like "make this cleaner" defer by default, or should they map to `interface` with an explicit `routeTrace` that marks audit/foundations as rejected alternatives? (iteration 21)
- Should equal-score tie-break order be global, per task type, or stage-specific? A URL extraction task likely wants `md-generator` before foundations, while a UI build wants `interface` plus foundations before motion. (iteration 21)
- Should `mcp-open-design` at rank 3 count as acceptable because it is still below `sk-design`, or should explicit "not Open Design transport" language require it to be absent entirely? (iteration 22)
- How should positive transport prompts be paired: should a prompt like "use Figma to export tokens for this design" expect `mcp-figma` rank 1 plus a required `sk-design` pairing edge, or `sk-design` rank 1 plus `mcp-figma` rank 2? (iteration 22)
- Should `rankBelowSkillIds` live in the existing playbook scenario schema, or in a D3-specific advisor-ranking fixture file that can be reused by other parent/transport families? (iteration 22)
- What should count as the first official uncovered-intent corpus: hub keyword projection, command metadata once generated, or a hand-authored hub-router fixture suite? (iteration 23)
- Should typed alias classes live in `mode-registry.json`, or should `mode-registry.json` stay identity-focused while a sibling `hub-router.json` owns `wakeAliases`, `modeAliases`, `bundleAliases`, and `nonRoutingKeywords`? (iteration 23)
- Should `BLOCKED-BY-REGISTRY` be a new benchmark verdict cap, or should registry failures remain D5 structural findings under the existing `BLOCKED-BY-STRUCTURE` cap? (iteration 23)
- Should a missing declaration cap the existing D1-intra score, or become a separate `D1hubRoute` / `D3-utilization` hard gate before resource recall? (iteration 24)
- Should the route declaration live only in live benchmark prompts, or should every real `sk-design` invocation emit it before context manifests and proof cards? (iteration 24)
- Should `ROUTED` carry only the primary `workflowMode`, or always carry `routeOutcome` plus `workflowModes[]` so bundle expectations are first-class? (iteration 24)
- Should explicit mode hints use `source=mode-hint`, and should contradictory hints produce `routeOutcome=defer` instead of a declared mode? (iteration 24)
- Should the parent `sk-design` hub remove `Write`, `Edit`, and `Bash`, or is the realistic enforcement point the route-bound packet/command surface because current runtimes activate the hub as one skill identity? (iteration 25)
- What exact syntax should represent optional Code Mode reference lookups without confusing them with the Playwright extraction backend? (iteration 25)
- Should `toolSurface` live directly beside `backendKind` in `mode-registry.json`, or should `mode-registry.json` remain identity-only and generate a sibling `tool-policy.json`? (iteration 25)
- Should `Task` be allowed for `reference-base` packets in all command surfaces, or should direct `/design:*` commands use a stricter mutation-free subset when `Task` is unavailable? (iteration 25)
- Should the shared design boundary asset live under `sk-design/shared/`, `sk-prompt-small-model/assets/`, or a CLI-agnostic system-spec-kit reference? (iteration 26)
- Should a missing boundary proof cap the existing D1-intra score or become a separate hard gate before any D1/D2/D3 scoring? (iteration 26)
- Should `cli-codex` and `cli-claude-code` gain design-specific templates directly, or should their generic templates link to one shared boundary asset to avoid drift? (iteration 26)
- Should `provided_context_hash` hash the exact prompt slice, the on-disk file contents, or both? (iteration 26)
- Should the `sk-design` corpus live as legacy public/private fixtures under `deep-improvement/assets/skill_benchmark/fixtures/sk-design/`, or as a parent `sk-design/manual_testing_playbook` consumed by the newer playbook loader? (iteration 27)
- Should bundle order be scored strictly, or should role labels such as `primary`, `support`, `validation`, and `handoff` matter more than array position? (iteration 27)
- Should `hubRoute` be generic for all parent hubs, or first implemented as a `sk-design` adapter until another registry-mode hub exists? (iteration 27)
- Should `defaultApplied:true` ever be legal for bundle routes, or only for single `interface` advice? (iteration 28)
- What ambiguity delta should trigger ask/defer for `sk-design`: a global score delta, mode-pair-specific deltas, or explicit minimal-pair groups only? (iteration 28)
- Should `nearTieOutcome:"ask"` live in `mode-registry.json.routerPolicy`, or should a generated sibling `hub-router.json` own all route policy? (iteration 28)
- Should `hubSkillKeywords` be strict enough to fail missing aliases, or should it only fail missing `advisorWake` terms and report missing aliases as P2? (iteration 29)
- Which registry aliases should be marked `packetIntentRequired`, and which should remain hub-only aliases that route to a mode without forcing packet resource keywords? (iteration 29)
- Should graph metadata be generated from `hub-router.json`, or should it remain checked-in with a drift test? (iteration 29)
- Should each required mode need at least one `loaded-determinative` witness, or should witness count depend on route role such as primary/support/validation? (iteration 30)
- Should `applicationWitnesses` live first in the proof card, in benchmark private gold, or in both with one generated from the other? (iteration 30)
- Should the first implementation use strict structured JSON/regex only, or also add an advisory semantic grader for paraphrased output choices? (iteration 30)
- Should route telemetry be required only in benchmark/live-analysis transcripts first, or should every real `sk-design` invocation emit the route event before context cards? (iteration 31)
- Should proof-card parsing mutate/augment the route event in the scorer, or should the filled proof card itself contain a `ROUTE TRACE` section that `proof_check.py` validates directly? (iteration 31)
- Should `routeTelemetry` live inside a generic parent-hub benchmark adapter, or should `sk-design` own a local adapter until a second hub needs the same fields? (iteration 31)
- What exact Open Design MCP tool-name strings appear in Codex and OpenCode PreToolUse/plugin payloads after live `tools/list` and one dry-run interception? (iteration 32)
- Should the `skDesignGate` token be manually embedded in the Open Design tool input, generated by a helper command, or produced by the future `routeTelemetry`/proof-card parser? (iteration 32)
- Should CLI `od ui respond` be covered by the existing Bash denylist path with command-pattern preconditions, or should all write paths converge through the same guarded MCP proxy? (iteration 32)
- What exact Codex PreToolUse JSON payloads are emitted for Bash commands with env assignments, quoted app paths, multiline commands, and `ELECTRON_RUN_AS_NODE=1` prefixes? (iteration 33)
- Can OpenCode and Claude Code expose an equivalent pre-tool Bash interception path, or do they need the guarded MCP/proxy route for parity? (iteration 33)
- Should `od media generate` require the full interface/foundations bundle, or a media-specific `sk-design` bundle keyed by surface (`image`, `video`, `audio`)? (iteration 33)
- Where should transient gate files live, and how should they expire so stale `sk-design` context cannot be replayed indefinitely? (iteration 33)
- Should pure-transport receipts expire immediately after the current tool result, or can they survive for diagnostic summaries while still being forbidden as design-grounding inputs? (iteration 34)
- Should the first implementation wrap upstream Open Design tools in a local guarded proxy that adds `openDesignUse` and receipts, or should Codex/OpenCode hooks accept sidecar gate metadata attached to otherwise unchanged tool calls? (iteration 34)
- Which read tools should be marked `ambiguous_read` versus `design_feed` by default? `list_projects` is clearly ambiguous; `get_file` and `search_files` may need stricter defaults because they commonly supply grounding material. (iteration 34)
- What exact tool-name strings does Codex emit for Open Design MCP calls in a live payload: bare `start_run`, server-qualified `open-design.start_run`, `mcp__open_design__start_run`, or another form? (iteration 35)
- Where should `skDesignGate` be minted, and how should short-lived gate material expire without being replayable across sessions? (iteration 35)
- OpenCode and Claude Code parity remains unresolved until their equivalent pre-tool interception surface or a guarded MCP proxy is verified. (iteration 35)
- Should the first build support only direct MCP tool calls, or also add the iteration 33 Bash CLI matcher in the same policy change? (iteration 35)
- Which Open Design read tools are eligible for `openDesignExemption` at all? `list_projects` and wiring diagnostics are clear; `get_file`, `search_files`, and design-system reads may need to default to `design_authorized` or block because their output is commonly grounding material. (iteration 36)
- How should an exempt read be upgraded if a later step discovers it actually needs design use: re-read under `skDesignGate`, or allow a hash-bound upgrade event that cites the original output digest? (iteration 36)
- Where should the token minting implementation live first: Codex PreToolUse sidecar metadata, a guarded MCP proxy that wraps Open Design tools, or a shared receipt generator consumed by both? (iteration 36)
- Should `compiledOpenDesignBrief` be minted by a `sk-design` proof-card parser, by a dedicated `openDesignGate mint` helper, or by the guarded MCP proxy itself? (iteration 39)
- Can raw `--skip` ever be allowed for a design-generation form, or should it always require per-question compiled default acceptance? (iteration 39)
- How should compiled payload records avoid caching Open Design source content while still carrying enough digest material to prove lineage? (iteration 39)
- What exact MCP `start_run` input schema is exposed by the live server for `inputs`, `agent`, and `model`? The local docs name the conceptual fields, but final implementation still needs live `tools/list` schema capture. (iteration 39)
- Should `DESIGN_PROOF_TOKEN v1` live as a shared sk-design reference, a mcp-open-design reference, or a system-spec-kit cross-agent boundary reference imported by both? (iteration 40)
- Should the hard token be minted by `sk-design` proof-card parsing, by an `openDesignGate mint` helper, or by the mcp-open-design proxy immediately before dispatch? (iteration 40)
- How should event replay work for cli-claude-code when output is text-only and no machine-readable tool stream is captured? (iteration 40)
- What live MCP schema field can carry the token into `start_run` without leaking Open Design source content into repo artifacts? (iteration 40)
- Should the first implementation use a five-minute TTL by default, matching the existing active-context expiry precedent, or make TTL configurable by tool class? (iteration 42)
- What exact live MCP `start_run` schema field should carry the token without leaking Open Design source content into repo artifacts? (iteration 42)
- Should token minting live in a `sk-design` proof-card parser, an `openDesignGate mint` helper, or the guarded `mcp-open-design` proxy? (iteration 42)
- How should text-only cli-claude-code replay prove a child did not reuse an old token when no structured tool stream is captured? (iteration 42)
- How should a paused/stale automation routine surface the remint requirement back to the operator without losing the captured routine digest and prior run evidence? (iteration 43)
- Where should the canonical automation binding live first: in a shared `DESIGN_PROOF_TOKEN v1` reference imported by both `sk-design` and `mcp-open-design`, or in the guarded Open Design proxy with the cards linking to it? (iteration 43)
- What exact `od automation create` JSON shape is emitted by the live CLI/HTTP surface, and which field can carry the token without embedding Open Design source content? (iteration 43)
- Should recurring design-generation schedules be allowed at all by default, or require explicit per-schedule opt-in with a very small `maxRunsBeforeReview`? (iteration 43)
- Which live MCP `start_run` input schema field can carry structured token metadata without leaking Open Design source content into repo artifacts? (iteration 44)
- How should the in-app Skills UI surface a missing-token refusal so it asks for `sk-design` proof instead of failing opaquely? (iteration 44)
- Does standalone `od --no-open` on `127.0.0.1:7456` expose the same generation boundary and therefore the same validator hook point? (iteration 44)
- What exact upstream daemon service function or route should host the validator for `start_run`, `od run start`, HTTP generation, and in-app Skills? (iteration 44)
- What is the first sk-design command projection set: mode pins only plus a few task verbs, or a fuller task surface modeled after the nine-plugin corpus? (iteration 45)
- Which proof-card fields should count as utilization witnesses for per-step choreography: loaded files, cited source excerpts, output sections, or all three? (iteration 45)
- Should command-count/doc drift cap D2 only, or also cap D3 utilization because a stale command surface cannot be a reliable replay corpus? (iteration 45)
- Should `commandRecipe` live in a sibling `command-metadata.json`, in `mode-registry.json.commandSurface`, or as generated files from a source schema? (iteration 45)
- Should design-adjacent detection be token-list based at first, or should it reuse the `sk-design` mode registry metadata once command-level design surfaces are implemented? (iteration 46)
- How should future `DESIGN_PROOF_TOKEN v1` wording compose with this loading rule without making the CLI contracts prematurely depend on an unbuilt token validator? (iteration 46)
- Should the canonical wording live beside `sk-design/shared/context_loading_contract.md` or in a shared CLI reference under `system-spec-kit/references/cli/`? (iteration 46)
- Should pure transport exemptions require a signed manifest block too, or is an explicit `pure_transport_exemption` line enough for non-design inventory/wiring dispatches? (iteration 47)
- Should `DESIGN_DISPATCH_MANIFEST v1` live directly in `sk-design/shared/context_loading_contract.md`, or in a sibling shared reference imported by both `sk-design` and the CLI skills? (iteration 47)
- Should ambiguous Brand/Product register resolution always ask, or may specific commands declare a default register through future command metadata? (iteration 47)
- Should `OPEN_DESIGN_TRANSPORT_ASSERTION v1` live in `mcp-open-design/references/tool_surface.md`, a new `mcp-open-design/references/cli_child_pairing.md`, or a shared `sk-design`/CLI boundary reference? (iteration 48)
- How should text-only `cli-claude-code` output be replayed if no structured tool stream is captured, especially for `od ui respond` and follow-up-message paths? (iteration 48)
- Should Open Design pure WIRE require a small assertion with `operationClass:pure_transport`, or is a `pure_transport_exemption` line enough? (iteration 48)
- Should `INTERACTION STATE MATRIX`, `READABILITY AND DENSITY PROOF`, and `LOCALE STRESS PROOF` live in `shared/context_loading_contract.md`, separate shared assets, or mode-owned cards imported by the proof card? (iteration 49)
- Should state-machine prompts route to `interface` by default, or should `motion` join whenever state transitions are visible even if no animation is explicitly requested? (iteration 49)
- Should the locale-stress trigger be explicit-only (`global`, `RTL`, `localization`) at first, or should public product surfaces default to a lighter expansion-only check? (iteration 49)
- Should the implementation choose duplicated skill-local `references/design_dispatch_contract.md` files, or relax the shared smart-router guard so a CLI router may load a cross-skill shared reference safely? (iteration 50)
- Should the first `DESIGN` keyword set be hand-authored, or generated from `sk-design/mode-registry.json` plus future command metadata? (iteration 50)
- Should Open Design prompts always route to `DESIGN` first and add transport pairing second, or should they route to a compound `DESIGN_TRANSPORT` intent? (iteration 50)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Should Open Design prompts always route to `DESIGN` first and add transport pairing second, or should they route to a compound `DESIGN_TRANSPORT` intent?

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Fourth research arc for sk-design (after 022/023, 024-027, 028+031-034). This one is broader than corpus-adoption: it covers command design + routing/utilization guarantees + mcp-open-design + cross-CLI enforcement. Fresh-opus planning agents seeded the ~57-angle bank across D1-D5. Prior art for the guarantees: the 029/030 enforcement primitives (`context_loading_contract.md`, `context_loaded_card.md`, `proof_of_application_card.md`) + the deep-improvement skill-benchmark scripts (router-replay.cjs, d5-connectivity.cjs, advisor-probe.cjs). The honest target: make non-utilization loud + blocking, convert self-attestation to content-bound proof, measure residual miss-rate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 50 (the only stop). Convergence: signal only.
- Per-iteration budget: 16 tool calls, 25 minutes.
- research/research.md ownership: workflow-owned canonical synthesis output.
- Executor: cli-codex, model gpt-5.5, reasoning xhigh, service tier fast.
- Angle bank: research/angle-bank.json. Monitor override: research/.next-angle.

## 14. LEAF STRATEGY TOUCH
- Iteration 11 adds the D2-7 command-granularity answer: high-value verbs should be command-visible task projections over existing `sk-design` modes, not new modes or standalone skills. The eight target verbs clear the first-class threshold, with `delight` constrained by a moment-gated contract.
- Iteration 12 adds the D2-8 interface visibility answer: `interface` has 11 routed intent/resource lanes, but only four should be promoted first as command-visible task projections (`directions`, `preflight`, `redesign`, `handoff`). Grounding/reference/copy lanes start as arguments or modifiers; dials and aesthetics remain internal. The enforceable gap is command visibility plus proof that expected resources loaded, not resource reachability alone.
- Iteration 13 adds the D2-9 pipeline-surface answer: the five checked-in `/design:*` wrappers expose isolated mode bridges, while the mode packets already encode a lifecycle from `md-generator` through foundations, interface, motion, audit, and `sk-code`. The buildable fix is lifecycle metadata plus generated wrapper fields (`Accepts`, `Returns`, `Next`, `Proof`) and confirm-only next-command suggestions, not silent auto-chaining.
- Iteration 14 adds the D2-10 register-pinning answer: Brand-vs-Product register is already a shared first decision and downstream dial gate, but current `/design:*` wrappers cannot pin or prove it at command entry. The buildable fix is `commandSurface.registerPolicy` plus wrapper argument/status fields and Brand/Product replay fixtures, reusing the existing context-loaded and proof-of-application cards.
- Iteration 15 adds the D2-11 metadata-home answer: the live `/design:*` wrappers hand-repeat descriptions and generic argument hints, while aliases and mode-use prose live in `mode-registry.json` and the hub. The buildable fix is a sibling `command-metadata.json` command-surface schema, pointing to registry mode keys, plus a build/checker that validates wrapper frontmatter, aliases, owner modes, return/status fields, and fixture routing.
- Iteration 16 adds the D2-12 trigger-surface answer: current `/design:*` descriptions are not a deterministic auto-trigger surface. Natural-language advisor replay and the registry contract collapse to the `sk-design` hub, while direct commands and future generated pins are separate surfaces. The buildable fix is explicit `descriptionRole` / `autoTriggerEligible` metadata plus four-lane replay: advisor-to-hub, hub-to-mode, direct-command-to-packet, and generated-pin redirect.
- Iteration 17 adds the D2-13 tool-policy answer: the checked-in `/design:*` wrappers over-grant `Write`, `Edit`, and `Bash` to the four read-and-guide modes, while only `md-generator` needs mutating tools. The buildable fix is command-surface `toolPolicy` metadata plus a wrapper checker that fails mutation-free modes when their frontmatter grants `Write`, `Edit`, or `Bash`, with `md-generator` as the explicit artifact-producing exception.
- Iteration 18 adds the D3-A1 hub-router answer: `sk-design` has prose for prompt-to-`workflowMode` routing and mode aliases in `mode-registry.json`, but no parseable parent router; the existing Lane C router replay returns `parseable:false` on the hub while mode packets like `design-interface` replay successfully. The buildable fix is a registry-backed hub-router projection plus fixture replay that emits `workflowMode`, packet, trace, and defer reason before packet-level resource replay.
- Iteration 19 adds the D3-A2 utilization-proof answer: the current context-loaded/proof-of-application cards and `proof_check.py` are deterministic shape gates, but still self-attested because they require file names, proof labels, and READY rather than a file-content hash or checker-verified anchor echo. The buildable fix is a `SOURCE PROOF` schema plus `proof_check.py --require-source-proof` and skill-benchmark `observedContentProofs`/`expectedSourceProofs` lanes that cap READY or benchmark pass claims when proof is path-only.
- Iteration 21 adds the D3-A4 ambiguity answer: the hub needs a three-outcome router contract, not just prose about "smallest useful mode." Weighted mode scoring plus an ambiguity delta should return either a single mode, an ordered mode bundle with roles, or a defer reason. Existing Lane C modePrecision is advisory and single-mode, so bundle correctness needs gated `expectedModeBundle` fixtures before packet-level resource replay.
- Iteration 22 adds the D3-A5 negative-routing answer: deterministic Python advisor replay already ranks `sk-design` first for a taste-heavy prompt while `mcp-open-design` and `mcp-figma` rank below it, matching both transport skills' "transport, not taste" contracts. The buildable fix is `rankBelowSkillIds` plus a gating relative-rank D1-inter scorer, because current skill-benchmark checks only one expected skill rank and cannot express transport-below-taste as a relational invariant.
- Iteration 23 adds the D3-A6 registry-completeness answer: the live `sk-design` registry passes narrow structural audit today (five mode rows, five reachable packets, packet-name parity, zero normalized alias collisions), but the raw hub keyword projection has a 46.5% uncovered rate against registry aliases. The buildable fix is a registry audit before hub-router replay, with typed `wakeAliases` / `modeAliases` / `bundleAliases` / `nonRoutingKeywords`, explicit corpus coverage, and route-manifest validation against registry `workflowMode` keys.
- Iteration 25 adds the D3-A8 backend/tool-surface answer: `backendKind` is a real permission discriminator, not only routing metadata. The buildable fix is route/backend/tool lockstep: `workflowMode` must validate against registry `backendKind`, generated `toolSurface`, observed live `toolCalls`, and a Bash allowlist before resource recall or readiness proof can pass.
- Iteration 26 adds the D3-A9 dispatch-boundary answer: parent-local `sk-design` context does not prove child or small-model utilization. The buildable fix is a design boundary-proof lane tying route declaration, required design-context files, child Context Loaded and Proof Of Application cards, and parent-run validation before delegated output can count as applied.
- Iteration 27 adds the D3-A10 measurement-engine answer: reuse Lane C public/private fixtures and contamination lint, but add hard `hubRoute` gold for `prompt -> expected.workflowMode/routeOutcome/workflowModes` before resource recall or proof cards can score. Existing `modePrecision` is advisory, so the buildable fix is a first-failing `hub-route` scorer lane plus T1/T2/T3 hint-free and adversarial minimal-pair corpus for `sk-design`.
- Iteration 31 adds the D3-A14 routing-observability answer: current hub/benchmark paths do not emit a joined route event, and a read-only local playbook measurement found 55 prompt-bearing scenarios with zero machine-readable route telemetry (`telemetryMissingRate=1.000`). The buildable fix is `routeTelemetry` carrying mode chosen, matched alias, default/defer state, backend/packet, bundle-loaded state, proof verdict, and separate `telemetryMissingRate` from `routeMissRate`.
- Iteration 32 adds the D4-A1 direct-MCP bypass answer: `mcp-open-design` already names a hard `sk-design` precondition and the Open Design tool surface has a concrete mutating/destructive set, but the checked-in Codex PreToolUse guard is Bash-only and explicitly allows non-Bash tools. The buildable fix is a tool-boundary Open Design precondition matcher in the Codex hook/policy, denying `start_run`/create/write/cancel/delete tools unless a content-bound `skDesignGate` token is present and valid; OpenCode needs a verified pre-tool plugin hook or an MCP proxy before parity can be claimed.
- Iteration 38 adds the MON-B3 command-recipe schema answer: `designer-skills-main` command wrappers lower into typed `argumentGrammar`, ordered `choreography[]`, parseable `nextOptions`, and a `commandRecipe` benchmark adapter that caps D2/D3 before resource recall when command utilization is undefined or unproved.
- Iteration 39 adds the D4-A8 inner-generator answer: `start_run --agent` is a child-context boundary, so parent-local `sk-design` loading is insufficient unless the judgment is compiled into the Open Design `start_run` brief and every discovery-form answer. The buildable fix is `compiledOpenDesignBrief` plus `compiledFormAnswers`, with `briefDigest`, `formAnswersDigest`, explicit `innerAgent`/`innerModel`, and run/conversation lineage bound to `skDesignGate` before the daemon receives the payload.
- Iteration 41 adds the MON-B9 conditional-proof-lane answer: `designer-skills-main` contributes residual proof shapes that are not the command choreography from iteration 38 and are not already covered by impeccable's problem/fix or detector machinery. The buildable fix is claim-scoped proof lanes for `OBSERVATION / PROBLEM / FIX`, `DECISION RATIONALE`, `ACCESSIBILITY COVERAGE`, and `NAMING LINT`/`DOC COMPLETENESS`, enforced by proof-card/checker extensions and skill-benchmark fixtures where the schema is deterministic, while aesthetic/rationale quality stays advisory.
- Iteration 42 adds the D4-A11 freshness-binding answer: existing gate/token sketches name mandatory `sk-design`, payload digests, and `expiresAt`, but no TTL or subject-change invalidation policy. The buildable fix is a `DESIGN_PROOF_TOKEN v1.freshness` block with `issuedAt`, `expiresAt`, explicit max age, single-use semantics, canonical `subjectDigest`, brief/form/route/loaded-file/lineage digests, and PreToolUse/proxy denial when any field is stale or mismatched; semantic equivalence outside the canonical subject object remains advisory.
- Iteration 43 adds the D4-A12 automation-schedule answer: `od automation create/run/runs/...` can schedule or fire routines for external agents, so proof cannot be minted only at a later fire. The buildable fix is `DESIGN_PROOF_TOKEN v1.automationBinding` frozen at schedule creation with routine digest, schedule-spec digest, planned mutating tools, canonical subject, compiled brief/form digests, loaded-file digest, recurrence policy, and max-run/max-age review cadence; future fires only replay and revalidate the frozen binding, while semantic drift outside canonical fields stays advisory.
- Iteration 45 adds the MON-B3 D2/D3 command-recipe answer: `designer-skills-main` turns commands into task verbs with typed argument hints, ordered skill choreography, output contracts, and explicit follow-up suggestions. The portable fix is a `commandRecipe` schema plus structural drift checks and utilization-witness replay before D2 command quality or D3 parent-routing proof can pass.
