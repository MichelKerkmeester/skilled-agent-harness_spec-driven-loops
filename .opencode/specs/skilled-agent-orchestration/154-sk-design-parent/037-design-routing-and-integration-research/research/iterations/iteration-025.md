# Iteration 25: BackendKind Tool-Permission Lockstep

## Focus

[D3-A8 / D3] tool-permission correctness across the `reference-base` versus `playwright-extract` `backendKind` split. The previous iteration framed the risk: wrong mode routing is not only a taste miss; it can grant the wrong tool surface. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-024.md:129] The angle bank names the same target as D3-A8. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/angle-bank.json:26]

This pass does not re-cover the D2 command-wrapper over-grant from iteration 17 or the D3 live `ROUTED` declaration from iteration 24. It narrows to the missing lock: when the hub declares `workflowMode`, can enforcement also prove the matching `backendKind` and allowed tool surface?

## Actions Taken

1. Re-read the live `sk-design` hub and registry to verify that `backendKind` is an explicit discriminator, not an inferred label. [SOURCE: .opencode/skills/sk-design/SKILL.md:43] [SOURCE: .opencode/skills/sk-design/SKILL.md:45] [SOURCE: .opencode/skills/sk-design/mode-registry.json:5] [SOURCE: .opencode/skills/sk-design/mode-registry.json:7]
2. Compared the five registry mode rows against their packet frontmatter. The four `reference-base` modes map to read-and-guide packet tool sets; `md-generator` maps to the mutating Playwright extraction packet. [SOURCE: .opencode/skills/sk-design/mode-registry.json:16] [SOURCE: .opencode/skills/sk-design/mode-registry.json:28] [SOURCE: .opencode/skills/sk-design/mode-registry.json:40] [SOURCE: .opencode/skills/sk-design/mode-registry.json:52] [SOURCE: .opencode/skills/sk-design/mode-registry.json:64] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:4] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:4] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:4] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:4] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:4]
3. Checked the parent hub and mode guidance for permission flattening risk. The parent hub grants `Write`, `Edit`, and `Bash`, while the hub prose says per-mode permissions must not be flattened. [SOURCE: .opencode/skills/sk-design/SKILL.md:4] [SOURCE: .opencode/skills/sk-design/SKILL.md:62]
4. Read the live skill-benchmark prompt, parser, evidence builder, and scorer to see whether observed tool calls are compared against backend expectations. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:59] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:66] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:212] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:224] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:209] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:230]

## Findings

### Finding 1: `backendKind` exists, but it is not yet a permission policy

Severity: P1. Label: ENFORCEABLE.

The registry defines `backendKind` as the discriminator between `reference-base` and `playwright-extract`. [SOURCE: .opencode/skills/sk-design/mode-registry.json:5] [SOURCE: .opencode/skills/sk-design/mode-registry.json:7] Four modes carry `backendKind: "reference-base"` and one mode, `md-generator`, carries `backendKind: "playwright-extract"`. [SOURCE: .opencode/skills/sk-design/mode-registry.json:16] [SOURCE: .opencode/skills/sk-design/mode-registry.json:28] [SOURCE: .opencode/skills/sk-design/mode-registry.json:40] [SOURCE: .opencode/skills/sk-design/mode-registry.json:52] [SOURCE: .opencode/skills/sk-design/mode-registry.json:64]

That distinction has real permission meaning. The hub says the four doc-guidance modes are read-and-guide and that `md-generator` is the only mode that runs an extraction pipeline with `Write/Edit/Bash` over Playwright. [SOURCE: .opencode/skills/sk-design/SKILL.md:62] The packet frontmatter matches that split: `interface`, `foundations`, `motion`, and `audit` allow `Read`, `Grep`, `Glob`, and `Task`; `md-generator` allows `Read`, `Write`, `Edit`, `Bash`, `Glob`, and `Grep`. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:4] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:4] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:4] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:4] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:4]

The missing piece is that the registry only records the backend kind; it does not record `allowedTools`, `forbiddenTools`, `mutatesWorkspace`, or a Bash allowlist. The hub currently grants the broad parent tool set, including `Write`, `Edit`, and `Bash`, at its own frontmatter. [SOURCE: .opencode/skills/sk-design/SKILL.md:4] So a live activation of the parent identity cannot by itself prove that a `reference-base` route ran under the narrower packet permission surface.

Buildable recommendation: extend the registry or a generated sibling policy file with a `toolSurface` object keyed by `workflowMode`:

```json
{
  "workflowMode": "interface",
  "backendKind": "reference-base",
  "toolSurface": {
    "mutatesWorkspace": false,
    "allowedTools": ["Read", "Grep", "Glob", "Task"],
    "forbiddenTools": ["Write", "Edit", "Bash"],
    "bashAllowlist": []
  }
}
```

For `md-generator`, make the exception explicit:

```json
{
  "workflowMode": "md-generator",
  "backendKind": "playwright-extract",
  "toolSurface": {
    "mutatesWorkspace": true,
    "allowedTools": ["Read", "Write", "Edit", "Bash", "Glob", "Grep"],
    "bashAllowlist": [
      "npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts",
      "npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts",
      "npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts",
      "npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts",
      "npm install",
      "npx playwright install chromium"
    ]
  }
}
```

The `md-generator` allowlist is grounded in its own tool usage guidelines, which name the embedded scripts, setup commands, `Write` output, and `Edit` repair path. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:436] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:438] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:439]

### Finding 2: The route declaration needs `backendKind`, not only `workflowMode`

Severity: P1. Label: ENFORCEABLE for fixture/live transcripts; ADVISORY for open-ended prompt interpretation outside a corpus.

Iteration 24 recommended a machine-readable route declaration before context manifests. That is necessary but incomplete for this angle. A declaration like `workflowMode=interface` proves the selected mode key; it does not directly prove the permission profile that must follow from that key.

Buildable recommendation: upgrade the live route declaration grammar to include the registry-derived backend and tool policy:

```text
ROUTED: skill=sk-design workflowMode=interface backendKind=reference-base routeOutcome=single packet=design-interface mutatesWorkspace=false forbiddenTools=Write,Edit,Bash source=hub-router
```

For extraction:

```text
ROUTED: skill=sk-design workflowMode=md-generator backendKind=playwright-extract routeOutcome=single packet=design-md-generator mutatesWorkspace=true bashPolicy=extractor-allowlist source=hub-router
```

The deterministic checker should validate that:

- `workflowMode` is a current registry key.
- Declared `backendKind` equals `registry[workflowMode].backendKind`.
- Declared `packet` equals `registry[workflowMode].packet`.
- Declared `mutatesWorkspace` and forbidden tools equal the generated tool-surface policy.

This is testable on a static corpus and on live transcripts because the registry is local JSON and the declaration is parseable text/JSON. The remaining advisory part is whether an unconstrained user prompt should have been routed to that mode in the first place; that belongs to hub-router fixture coverage, not permission checking.

### Finding 3: Live benchmark already records tool calls, but does not gate on them

Severity: P1. Label: ENFORCEABLE.

The live executor captures every `tool_use` event into `toolCalls`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:212] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:224] The scorer then exposes those tools in `liveEvidence.toolCalls`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:209] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:214]

But the scoring path uses tool calls only as inspectable evidence. The core scenario score is built from intent/resource recall and over-routing, with no backend/tool policy dimension. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:242] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:247] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:251] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:288] The benchmark docs list the first failing stages as activation, parse, routed-intra, and discovered; no backend/tool stage exists. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/feature_catalog/05--skill-benchmark/scoring-and-funnel.md:37]

Buildable recommendation: add a hard gate before resource/content scoring for parent-hub fixtures:

```json
{
  "expected": {
    "skillId": "sk-design",
    "workflowMode": "interface",
    "backendKind": "reference-base",
    "forbiddenTools": ["Write", "Edit", "Bash"],
    "requiresBackendToolPolicy": true
  }
}
```

The scorer should emit:

- `firstFailingStage: "backend-kind-mismatch"` when declared backend does not match the registry.
- `firstFailingStage: "backend-tool-policy"` when a `reference-base` route uses `Write`, `Edit`, or `Bash`.
- `firstFailingStage: "bash-allowlist"` when a `playwright-extract` route uses Bash outside the extractor allowlist.

This can be deterministic because the live parser already has `raw.toolCalls`, and Bash inputs are captured with each tool call. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:223] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:224] If the runtime cannot expose tool calls, mark the gate `unscored-runtime-no-tool-trace` rather than passing.

### Finding 4: `reference-base` is not identical to "no external reference lookup"

Severity: P2. Label: ENFORCEABLE for mutating-tool denial; ADVISORY for optional external reference usage.

The permission policy should not overfit `reference-base` to "only local markdown forever." The `interface` packet can optionally sharpen convention-heavy briefs with one Mobbin or Refero reference through Code Mode when a subscription is connected. It explicitly says those are Code Mode manuals, not tools in the skill's own `allowed-tools`, and falls back when Code Mode is unavailable. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:195]

So the D3-A8 policy should separate two concerns:

- `reference-base` forbids workspace mutation and Playwright extraction by default.
- Optional external reference lookup is a separate transport/use-case permission, not evidence that the mode is `playwright-extract`.

Buildable recommendation: model external reference lookup as a separate optional capability, e.g. `optionalExternalLookups: ["mobbin", "refero"]`, while keeping `forbiddenTools: ["Write", "Edit", "Bash"]` for the default packet tool surface. If a future live fixture expects a Mobbin/Refero lookup, it should require explicit transport pairing and proof of one reference read, not relax the Playwright extraction policy.

## Questions Answered

- Q2/D3: Parent-to-sub-skill routing is not enforceable enough if it stops at `workflowMode`. The deterministic route contract must bind `workflowMode -> backendKind -> packet -> toolSurface`, then verify live tool calls against that policy.
- Q5/all: Enforceable pieces are registry policy derivation, route-declaration parsing, backend-kind equality, forbidden-tool checks, Bash allowlist checks, and static packet/frontmatter parity. Advisory pieces are whether an unconstrained natural-language prompt should map to a specific mode and whether optional external reference lookup improves taste.

## Questions Remaining

- Should `toolSurface` live directly beside `backendKind` in `mode-registry.json`, or should `mode-registry.json` remain identity-only and generate a sibling `tool-policy.json`?
- Should the parent `sk-design` hub remove `Write`, `Edit`, and `Bash`, or is the realistic enforcement point the route-bound packet/command surface because current runtimes activate the hub as one skill identity?
- Should `Task` be allowed for `reference-base` packets in all command surfaces, or should direct `/design:*` commands use a stricter mutation-free subset when `Task` is unavailable?
- What exact syntax should represent optional Code Mode reference lookups without confusing them with the Playwright extraction backend?

## Next Focus

D3-A9: turn `backendKind` + `toolSurface` into fixture schema and scorer placement. The next useful pass is not more permission prose; it is where the hard gate should live in skill-benchmark so route declarations, observed tool calls, and registry policy fail before resource recall can mask the problem.

## Sources Consulted

- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/angle-bank.json`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-017.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-024.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/shared/context_loading_contract.md`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- `.opencode/skills/sk-design/design-motion/SKILL.md`
- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/feature_catalog/05--skill-benchmark/scoring-and-funnel.md`

## Assessment

newInfoRatio: 0.60. Novelty is moderate because iteration 17 already found command-surface over-grants and iteration 24 already required a live route token. The new information is the stricter D3 lock: `backendKind` must become a checked permission contract, not only a routing discriminator, and the live benchmark already has enough raw tool-call evidence to enforce it.

Confidence: high for the local registry/frontmatter/tool-call evidence. Medium for the exact policy-file home because that belongs to the implementation design: colocating `toolSurface` with `backendKind` is simpler, while generating a sibling file keeps the registry more identity-focused.

## Reflection

The useful invariant is "route decides backend, backend decides tool surface." Anything weaker lets a route look correct while the runtime still has the wrong powers. The fix is small but load-bearing: make backend/tool mismatch a hard gate before the benchmark starts giving partial credit for resources.

Ruled out: treating `backendKind` as documentation only. It already encodes the difference between local reference-base guidance and the Playwright extraction backend; enforcement should use that distinction directly.
