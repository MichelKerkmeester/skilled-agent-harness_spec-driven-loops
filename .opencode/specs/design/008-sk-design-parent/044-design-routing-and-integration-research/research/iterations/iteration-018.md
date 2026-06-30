# Iteration 18: Hub-Level Deterministic Router

## Focus

[D3-A1 / D3] The missing hub-level deterministic router: `sk-design` says the hub classifies a prompt to `workflowMode` through `mode-registry.json`, but that hub-to-mode selection is not represented as a replayable machine contract.

This pass did not re-cover D2 command metadata, command descriptions, or wrapper tool policy from iterations 15-17. It focuses on the gap between advisor-to-`sk-design` and mode-packet loading.

## Actions Taken

1. Read the `sk-design` hub, `mode-registry.json`, and shared context-loading contract to separate current prose routing, registry fields, and existing hard gates. [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:47] [SOURCE: .opencode/skills/sk-design/mode-registry.json:4] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:138]
2. Compared the parent hub to a nested mode packet with a parseable router. `design-interface` explicitly defines `DEFAULT_RESOURCE`, `INTENT_SIGNALS`, and `RESOURCE_MAP`, and states that this fenced block drives deterministic routing and the D5 connectivity gate. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:87] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:98] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:100] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:114]
3. Read the existing deep-improvement skill-benchmark router replay and D5 gate, then ran it against the parent `sk-design` hub and the nested `design-interface` packet. The parent returned `parseable:false`; the nested packet returned `parseable:true` with a scored intent and resources. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:10] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:144] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:257] [SOURCE: command output from local router replay, iteration 18]
4. Checked the deep-loop-workflows registry pattern for comparison. It carries richer runtime-dispatch fields and documents a CI drift guard against advisor projection maps, which is the right enforcement shape for registry-to-router parity even though `sk-design` needs design-mode semantics rather than deep-loop semantics. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:4] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:10] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:16]

## Findings

### Finding 1: The `sk-design` hub routing rule is prose, not a replayable router

Severity: P1. Label: ENFORCEABLE on a test corpus; ADVISORY for open-ended live prompts outside the corpus.

The hub says routing is registry-driven, then describes the selection algorithm in prose: classify the request to a `workflowMode`, read `mode-registry.json`, resolve from hint or classified intent, and load the packet. It also says generic "make this look good" defaults to `interface`, with explicit axes for foundations, motion, audit, and md-generator, and paired modes only for separate axes. [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:47] [SOURCE: .opencode/skills/sk-design/SKILL.md:49] [SOURCE: .opencode/skills/sk-design/SKILL.md:56]

That rule is not machine-readable in the same way the nested packet routers are. Running the existing deterministic `router-replay.cjs` against `.opencode/skills/sk-design` returned `parseable:false`, while the same script succeeded against `.opencode/skills/sk-design/design-interface`. The script's own contract is clear: it extracts `INTENT_SIGNALS`, `RESOURCE_MAP`, and `DEFAULT_RESOURCE`, then returns `parseable:false` when those maps are absent. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:12] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:166] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:260] [SOURCE: command output from local router replay, iteration 18]

Buildable recommendation: add a parent-hub router projection, either as `mode-registry.json.router` or a sibling `.opencode/skills/sk-design/hub-router.json` generated from the registry. Minimum fields:

```json
{
  "defaultMode": "interface",
  "modeHintOverrides": true,
  "ambiguityPolicy": "defer-or-bundle",
  "modes": [
    {
      "workflowMode": "motion",
      "packet": "design-motion",
      "keywords": ["motion design", "animate this", "micro-interactions"],
      "requiredSignals": [],
      "deferWhen": ["multiAxisWithoutOrder"]
    }
  ]
}
```

Then add `scripts/design-hub-router-replay.mjs` or extend the Lane C `router-replay.cjs` with a registry-router adapter. Input: `{ prompt, optionalModeHint }`. Output: `{ workflowMode | workflowModes, packet, backendKind, routeTrace, deferReason }`.

### Finding 2: `mode-registry.json` has the mode inventory and aliases, but not the selection policy

Severity: P1. Label: ENFORCEABLE.

The registry is a good identity source: it lists every mode's `workflowMode`, `backendKind`, `packet`, `packetSkillName`, aliases, and `advisorRouting`. [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:16] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/mode-registry.json:22] It also states that the advisor routes the single identity `sk-design`, the hub picks the mode, and the advisor does not read this file at runtime. [SOURCE: .opencode/skills/sk-design/mode-registry.json:4]

What is missing is the policy that turns aliases into a chosen `workflowMode`: weights, default mode, explicit hint behavior, ambiguity threshold, multi-axis pairing, and defer reasons. Those rules exist only in hub prose. [SOURCE: .opencode/skills/sk-design/SKILL.md:49] [SOURCE: .opencode/skills/sk-design/SKILL.md:56] This means aliases can drift from the hub's "smallest useful mode" policy without a deterministic replay failing.

Buildable recommendation: keep the registry as the source of mode identity, but add a parseable selection projection:

- `routerSignals`: weighted keywords or phrase groups per mode, initially derived from `aliases`.
- `routerPolicy.defaultMode`: `interface`.
- `routerPolicy.hintOverride`: named mode hints win unless contradictory.
- `routerPolicy.multiAxis`: return a small ordered bundle or explicit `deferReason`.
- `fixtures`: prompt, optional hint, expected `workflowMode`, expected `packet`, and expected `deferReason` for ambiguous cases.

Add a drift guard that fails when any `mode-registry.json.modes[].workflowMode` lacks a router row, any router row points to a missing packet, or any fixture's expected packet differs from the registry packet.

### Finding 3: Existing skill-benchmark machinery can enforce the hub router once the hub exposes a parseable model

Severity: P2. Label: ENFORCEABLE for static/router replay; ADVISORY for final design quality.

The Lane C benchmark already has the shape needed for this enforcement. Its README says `run-skill-benchmark.cjs` runs D5 connectivity first, loads gold scenarios, dispatches each scenario, aggregates scores, and writes reports. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/README.md:21] It identifies `router-replay.cjs` as Mode A deterministic replay and says it extracts `INTENT_SIGNALS` plus `RESOURCE_MAP` to reproduce substring scoring. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/README.md:22] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/README.md:106]

The hard gate is also already opinionated: an unparseable router is a P0 `router_unparseable` condition, and `gateFailed` is true when a P0 exists or the router is not parseable. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:125] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:128] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:130] The current parent hub would fail that style of check, while mode packets such as `design-interface` can already pass because they carry the parseable router block. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:87] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:114]

Buildable recommendation: do not hand-roll a separate, undocumented test. Add a `classKind: "hub-routing"` or `traceMode: "hub-router"` lane to the skill-benchmark harness so `sk-design` can be scored on:

- advisor-to-hub: prompt wakes `sk-design`.
- hub-to-mode: deterministic replay returns expected `workflowMode` and packet.
- packet-router: selected packet's own `INTENT_SIGNALS`/`RESOURCE_MAP` loads expected resources.
- proof gate: context manifest/proof fields are present for build, audit, or ready claims.

The first three are deterministic on a fixture corpus. The last is deterministic for field presence and tool output, but advisory for whether the resulting design judgment is good.

## Questions Answered

- Q2/D3: Parent-to-sub-skill routing becomes provable by adding a parseable hub-router projection over `mode-registry.json` and replaying prompts to expected `workflowMode`, packet, and defer reason.
- Q5/all: The enforceable part is structural coverage, fixture routing, packet existence, and drift between registry, router projection, and packet paths. The advisory part is open-ended live intent interpretation outside fixtures and the quality of the final design judgment.

## Questions Remaining

- Should the parseable hub router live directly in `mode-registry.json.router`, or should `mode-registry.json` remain identity-only with a generated sibling `hub-router.json`?
- Should multi-axis prompts return an ordered mode bundle, or should the deterministic router fail closed with a `deferReason` unless a command/workflow supplies the order?
- Should the skill-benchmark harness grow a generic registry-router adapter, or should `sk-design` own a local `design-hub-router-replay.mjs` that emits the same observed-result shape?

## Next Focus

Continue D3 with content-bound utilization proof after routing: once the hub picks a mode, what trace proves the selected packet and required shared context were actually loaded before recommendations or ready claims?
