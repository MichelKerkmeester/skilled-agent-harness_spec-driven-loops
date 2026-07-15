# Iteration 005 — Per-mode contract preservation (the 3-tier discriminator)

- **Model**: gpt-5.5-fast xhigh (cli-opencode, read-only)
- **Seat**: 005
- **model_pick**: A

## Analysis

**Recommendation**
Pick **A) ONE-IDENTITY + REGISTRY-DRIVEN**. Keep exactly one advisor-discoverable `graph-metadata.json`, keep each mode packet non-discoverable, and make the advisor load `mode-registry.json` for the mode projection and aliases instead of maintaining parallel Python/TypeScript maps.

**What The Current Contract Actually Preserves**
`deep-loop-workflows` is intentionally a hub, not a flattened mega-skill. The hub says it has “NO per-mode convergence, state, or synthesis logic” and routes by `workflowMode` through `mode-registry.json`; each mode keeps its own packet contract (`.opencode/skills/deep-loop-workflows/SKILL.md:12`). The routing section repeats that `mode-registry.json` is the single source of truth and defines the three discriminator tiers (`.opencode/skills/deep-loop-workflows/SKILL.md:36-41`).

The registry encodes the three-tier discriminator directly:

| Tier | Meaning | Evidence |
| --- | --- | --- |
| `workflowMode` | Public command/advisor/mode key carried by every mode | `.opencode/skills/deep-loop-workflows/mode-registry.json:5-7` |
| `runtimeLoopType` | Runtime convergence key, valid only for graph-backed modes, explicit `null` for improvement/external modes | `.opencode/skills/deep-loop-workflows/mode-registry.json:7` |
| `backendKind` | Backend selector: runtime convergence or improvement host | `.opencode/skills/deep-loop-workflows/mode-registry.json:8` |

A consumer should resolve: alias/command text -> `workflowMode` -> registry mode row -> `packet` -> backend. For graph-backed rows, call `deep-loop-runtime/scripts/convergence.cjs --loop-type <runtimeLoopType>`; for improvement rows, call the improvement loop host using `loopHostMode`. The hub’s routing pseudocode states exactly that (`.opencode/skills/deep-loop-workflows/SKILL.md:43-50`).

The four graph-backed modes are explicit:

| `workflowMode` | `runtimeLoopType` | `backendKind` | `packet` | Evidence |
| --- | --- | --- | --- | --- |
| `context` | `context` | `runtime-loop-type` | `deep-context` | `.opencode/skills/deep-loop-workflows/mode-registry.json:12-19` |
| `research` | `research` | `runtime-loop-type` | `deep-research` | `.opencode/skills/deep-loop-workflows/mode-registry.json:22-29` |
| `review` | `review` | `runtime-loop-type` | `deep-review` | `.opencode/skills/deep-loop-workflows/mode-registry.json:32-39` |
| `ai-council` | `council` | `runtime-loop-type` | `ai-council` | `.opencode/skills/deep-loop-workflows/mode-registry.json:42-49` |

The three improvement lanes all have `runtimeLoopType: null`; this is explicit and should remain non-inferable:

| `workflowMode` | `runtimeLoopType` | `backendKind` | `loopHostMode` | Evidence |
| --- | --- | --- | --- | --- |
| `agent-improvement` | `null` | `improvement-host` | `agent-improvement` | `.opencode/skills/deep-loop-workflows/mode-registry.json:52-61` |
| `model-benchmark` | `null` | `improvement-host` | `model-benchmark` | `.opencode/skills/deep-loop-workflows/mode-registry.json:64-72` |
| `skill-benchmark` | `null` | `improvement-host` | `skill-benchmark` | `.opencode/skills/deep-loop-workflows/mode-registry.json:75-83` |

The runtime enforces the graph-backed loop types independently: `convergence.cjs` accepts only `research`, `review`, `council`, or `context` and rejects anything else (`.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:307-312`). Council gets its own council graph path while non-council modes use the coverage graph modules (`.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:318-321`). Research/context/review then branch into different signal evaluation paths (`.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:366-386`).

The improvement host is a separate backend, not a runtime loop type. Its valid `--mode` set is `agent-improvement`, `model-benchmark`, and `skill-benchmark` (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/loop-host.cjs:45`). It plans different script invocations per mode (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/loop-host.cjs:190-258`).

**Per-Mode Behavior Is Preserved**
The packets still carry distinct mode contracts:

| Packet | Preserved contract evidence |
| --- | --- |
| `deep-context` | Own `name: deep-context`, own tool list, inward codebase context loop, agreement/convergence language (`.opencode/skills/deep-loop-workflows/deep-context/SKILL.md:1-15`) |
| `deep-research` | Own `name: deep-research`, includes `WebFetch`, has research-specific `newInfoRatio` threshold semantics and warns thresholds are not interchangeable with siblings (`.opencode/skills/deep-loop-workflows/deep-research/SKILL.md:1-37`) |
| `deep-review` | Own `name: deep-review`, no WebFetch comment, code-review/P0-P1-P2 contract, command-owned state machine rules (`.opencode/skills/deep-loop-workflows/deep-review/SKILL.md:1-63`) |
| `ai-council` | Folder is `ai-council` but packet name is `deep-ai-council`; planning-only council, multi-seat artifact persistence, no direct implementation (`.opencode/skills/deep-loop-workflows/ai-council/SKILL.md:1-14`, `.opencode/skills/deep-loop-workflows/ai-council/SKILL.md:64-72`) |
| `deep-improvement` | Own three co-equal lanes and guarded promotion/evaluation contract (`.opencode/skills/deep-loop-workflows/deep-improvement/SKILL.md:1-41`) |

The hub correctly says per-mode behavior is not flattened: packets keep convergence math, state shape, artifacts, and tool-permission guards (`.opencode/skills/deep-loop-workflows/SKILL.md:52`). That is the key parent-skill invariant.

**The Drift Gap Is Real**
The docs claim registry-driven routing, but advisor code does not yet follow it.

Python hardcodes the merged skill and mode map:

- `MERGED_DEEP_SKILL_ID = "deep-loop-workflows"` and `DEEP_ROUTING_MODE_BY_KEY` maps only `deep-review`, `deep-research`, and `deep-ai-council` to modes (`.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2319-2324`).
- `deep_skill_routing_payload()` emits `{skill: deep-loop-workflows, mode: <workflowMode>}` but projects through the hardcoded map (`.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2513-2541`).
- The recommendation blending layer also uses the hardcoded map (`.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2561-2584`).

TypeScript has a parallel hardcoded projection:

- `MERGED_DEEP_SKILL_ID` and `DEEP_MODE_BY_CANONICAL` hardcode `deep-research`, `deep-review`, `deep-ai-council`, and `deep-improvement -> agent-improvement` (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101`).
- `modeForAlias()` and `mergedSkillForAlias()` use that in-memory projection (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:119-129`).

The parity fixtures protect the right observable contract: they assert both the single skill and the concrete mode, not just flat skill equality (`.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:5-10`). Example assertions require `deep-loop-workflows` plus `research` (`.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:62-64`), and council fixtures do the same for `ai-council` (`.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-council.vitest.ts:105-115`). Model A can preserve these tests by changing where the mode map comes from, not the payload shape.

**Identity And Discovery**
The one-identity keystone is structurally sound. The hub root metadata has `skill_id: deep-loop-workflows` and `family: deep-loop` (`.opencode/skills/deep-loop-workflows/graph-metadata.json:2-5`). The skill graph scanner recursively discovers every `graph-metadata.json` (`.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625`). It then requires `skill_id` to equal the containing folder basename and throws otherwise (`.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-658`). It also allows `deep-loop` as a family (`.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:133-140`).

That makes **B) DISCOVERABLE-NESTED** the wrong default. Adding nested `graph-metadata.json` files would make each packet separately advisor-discoverable, and `ai-council` would have a forced identity choice because the folder is `ai-council` while the packet `SKILL.md` name is `deep-ai-council` (`.opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/001-rename-fix-and-shared-decision/decision-record.md:88-98`). The accepted decision says that mismatch is cosmetic under one identity because discovery keys on graph metadata, not packet folder/name (`.opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/001-rename-fix-and-shared-decision/decision-record.md:92-106`).

**Naming/Docs Drift To Fix**
The registry and current packet files use `deep-context`, `deep-research`, `deep-review`, `deep-improvement`, and `ai-council`, but hub docs still contain stale bare packet path examples:

- Hub `SKILL.md` layout says `context/ research/ review/ ai-council/ improvement/` (`.opencode/skills/deep-loop-workflows/SKILL.md:58-65`).
- Hub references say `context/SKILL.md`, `research/SKILL.md`, `review/SKILL.md`, `improvement/SKILL.md` (`.opencode/skills/deep-loop-workflows/SKILL.md:94-99`).
- README layout repeats bare names (`.opencode/skills/deep-loop-workflows/README.md:17-25`).
- Registry has the corrected packet names (`.opencode/skills/deep-loop-workflows/mode-registry.json:15`, `.opencode/skills/deep-loop-workflows/mode-registry.json:25`, `.opencode/skills/deep-loop-workflows/mode-registry.json:35`, `.opencode/skills/deep-loop-workflows/mode-registry.json:55`, `.opencode/skills/deep-loop-workflows/mode-registry.json:67`, `.opencode/skills/deep-loop-workflows/mode-registry.json:78`, `.opencode/skills/deep-loop-workflows/mode-registry.json:89`).

**Minimal Parent-Skill Mode Contract**
A reusable parent-skill registry should encode only dispatch-critical facts and leave behavior inside each packet.

Required per mode:

| Field | Why |
| --- | --- |
| `workflowMode` | Stable public mode key; never inferred |
| `packet` | On-disk packet folder; validator checks it exists |
| `packetSkillName` | Declared `SKILL.md name`; needed for accepted mismatches like `ai-council` vs `deep-ai-council` |
| `aliases` | Advisor and command alias source; replaces Python/TS mode maps |
| `command` and `agent` | User entrypoint and native executor target |
| `artifactRoot` | Packet-local output/state namespace |
| `backendKind` | Backend selector |
| `runtimeLoopType` | Required string for `runtime-loop-type`, explicit `null` otherwise |
| `loopHostMode` | Required for `improvement-host` |
| `mutationClass` | Required explicit guard, better than optional `mutating`; examples: `read-only`, `add-only`, `mutates`, `external-dry-run-default` |
| `permissionProfile` or `allowedTools` | Machine-checkable summary of the mode’s tool boundary, validated against packet `SKILL.md` frontmatter |

Do not move convergence formulas, state schemas, prompt resources, or synthesis logic into the registry. Those belong in the mode packet. The registry should route; the packet should define behavior.

**Model Choice**
| Model | Verdict | Reason |
| --- | --- | --- |
| A) ONE-IDENTITY + REGISTRY-DRIVEN | Recommended | Preserves one advisor identity, preserves `{skill, mode}` parity fixtures, and closes Python/TS drift by making the registry the projection source. |
| B) DISCOVERABLE-NESTED | Reject | Recursive discovery would turn packets into separate advisor nodes, and `skill_id == folder` would force identity choices that break the accepted one-identity model. |
| C) DERIVED-MODE-HINTS | Reject | It is the current drift gap: docs/registry say one thing while Python and TS hardcode another. |
| D) HYBRID | Not needed now | Only consider a non-`graph-metadata.json` sub-surface later, such as registry-derived benchmark rows or docs; do not make nested packets advisor-discoverable unless the one-identity keystone is intentionally abandoned. |

**Implementation Direction For Registry-Driven Advisor**
Keep the Python scoring weights and lexical patterns in code for now; make only the identity projection registry-driven. In practice: load `mode-registry.json`, build `alias -> workflowMode`, `packetSkillName/legacySkillId -> workflowMode`, and `workflowMode -> mode row`. Then have Python’s `deep_skill_routing_payload()` translate score keys through that loaded map. In TypeScript, replace `DEEP_MODE_BY_CANONICAL` with the same registry-derived map.

This is the smallest change that closes drift without rewriting scoring behavior or changing parity output. It also lets the parity fixtures remain exactly aligned with the current contract: `skill` stays `deep-loop-workflows`; `mode` stays `research|review|ai-council` for those tests.

One important guard: `loop-host.cjs` currently falls back unknown modes to `agent-improvement` (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/loop-host.cjs:169-173`). A registry-driven caller should fail closed before invoking the loop host, because a typo in `loopHostMode` must not silently run the wrong improvement lane.

**What To Standardize**
- `sk-doc` parent-skill definition: one discoverable hub, non-discoverable packets, mandatory registry, no per-mode logic in hub, no nested graph metadata, packet behavior stays local.
- `/create:parent-skill` scaffolder: generate hub `SKILL.md`, `README.md`, `mode-registry.json`, root `graph-metadata.json`, packet folders, packet `SKILL.md` stubs, `shared/`, parity fixture skeletons, and validator config.
- `/doctor:parent-skill` validator: check registry JSON, packet dirs, packet `SKILL.md name`, no nested `graph-metadata.json`, runtimeLoopType rules, backendKind required fields, alias uniqueness, command/agent paths, stale bare-path docs, advisor Python/TS parity against registry, and loop-host mode validity.
- Routing/discovery benchmark: dogfood through `deep-improvement` skill-benchmark; fixtures should cover all 7 workflow modes, ambiguous research/review/council prompts, `ai-council` folder/name mismatch, improvement lane aliases, and assertion of `{skill: deep-loop-workflows, mode}`.
- Shared boundary rule: parent-skill `shared/` is valid for packet-shared workflow-layer helpers; `shared/synthesis/resource-map.cjs` is explicitly workflow rendering, not runtime backend plumbing (`.opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs:4-9`).

**Could Not Verify / Contradictions**
I could verify MCP-free runtime direction, but I could not verify the claim that `deep-loop-runtime` has no `system-spec-kit` dependency. Current files contradict that literal claim: runtime graph metadata declares `depends_on: system-spec-kit` with context about imported dependencies (`.opencode/skills/deep-loop-runtime/graph-metadata.json:9-15`), and `convergence.cjs` resolves its TSX loader through `system-spec-kit` paths (`.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:33-43`). The intended boundary may be “no dependency on system-spec-kit MCP deep-loop internals,” which is supported by the runtime rule forbidding imports from the old `system-spec-kit/mcp_server/lib/deep-loop` and coverage-graph locations (`.opencode/skills/deep-loop-runtime/SKILL.md:199-203`).

I did not run tests, by design; this was read-only file research.

===RESEARCH-JSON===
{"angle":"per-mode-contract","recommendation":"Pick model A: keep one advisor identity and make the advisor derive mode projections from mode-registry.json while leaving per-mode behavior inside packets.","model_pick":"A","key_findings":[{"claim":"The registry already encodes the three-tier discriminator workflowMode/runtimeLoopType/backendKind.","evidence":".opencode/skills/deep-loop-workflows/mode-registry.json:5-9","confidence":"high"},{"claim":"All three improvement lanes explicitly set runtimeLoopType to null; runtime-backed modes use context/research/review/council.","evidence":".opencode/skills/deep-loop-workflows/mode-registry.json:52-95","confidence":"high"},{"claim":"Advisor routing still hardcodes mode projection in Python instead of reading the registry.","evidence":".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2319-2324","confidence":"high"},{"claim":"TypeScript also has a hardcoded deep mode map that can drift from the registry.","evidence":".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101","confidence":"high"},{"claim":"The one-identity model is protected by recursive graph-metadata discovery plus skill_id==folder validation, which makes nested discoverable packets the wrong default.","evidence":".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-658","confidence":"high"},{"claim":"Parity fixtures assert both merged skill and concrete mode, so registry-driven routing can preserve the existing observable contract.","evidence":".opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:5-10","confidence":"high"}],"risks":["Hub SKILL.md and README still contain stale bare packet paths while the registry uses deep-prefixed packet folders.","loop-host.cjs silently falls back unknown modes to agent-improvement; registry-driven callers should fail closed before invoking it.","The literal claim that deep-loop-runtime has no system-spec-kit dependency is contradicted by current graph metadata and loader paths; clarify the intended boundary."],"standardize":["sk-doc parent-skill definition: one hub identity, mandatory registry, non-discoverable packets, no hub per-mode logic.","/create:parent-skill scaffolder for hub, registry, root graph metadata, packet stubs, shared/, and parity tests.","/doctor:parent-skill validator for registry completeness, nested graph-metadata absence, packet name/path checks, backendKind/runtimeLoopType rules, alias uniqueness, advisor parity, and stale-path lint.","Routing/discovery benchmark covering all workflow modes and asserting {skill: deep-loop-workflows, mode}."],"open_questions":["Should registry add packetSkillName so accepted folder/name mismatches like ai-council/deep-ai-council are explicit?","Should mutation/tool boundaries be registry fields or derived from packet SKILL.md frontmatter?","Does runtime dependency policy mean no system-spec-kit MCP internals, or literally no system-spec-kit dependency?"]}
===END===

## Structured output

```json
{
  "angle": "per-mode-contract",
  "recommendation": "Pick model A: keep one advisor identity and make the advisor derive mode projections from mode-registry.json while leaving per-mode behavior inside packets.",
  "model_pick": "A",
  "key_findings": [
    {
      "claim": "The registry already encodes the three-tier discriminator workflowMode/runtimeLoopType/backendKind.",
      "evidence": ".opencode/skills/deep-loop-workflows/mode-registry.json:5-9",
      "confidence": "high"
    },
    {
      "claim": "All three improvement lanes explicitly set runtimeLoopType to null; runtime-backed modes use context/research/review/council.",
      "evidence": ".opencode/skills/deep-loop-workflows/mode-registry.json:52-95",
      "confidence": "high"
    },
    {
      "claim": "Advisor routing still hardcodes mode projection in Python instead of reading the registry.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2319-2324",
      "confidence": "high"
    },
    {
      "claim": "TypeScript also has a hardcoded deep mode map that can drift from the registry.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101",
      "confidence": "high"
    },
    {
      "claim": "The one-identity model is protected by recursive graph-metadata discovery plus skill_id==folder validation, which makes nested discoverable packets the wrong default.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-658",
      "confidence": "high"
    },
    {
      "claim": "Parity fixtures assert both merged skill and concrete mode, so registry-driven routing can preserve the existing observable contract.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:5-10",
      "confidence": "high"
    }
  ],
  "risks": [
    "Hub SKILL.md and README still contain stale bare packet paths while the registry uses deep-prefixed packet folders.",
    "loop-host.cjs silently falls back unknown modes to agent-improvement; registry-driven callers should fail closed before invoking it.",
    "The literal claim that deep-loop-runtime has no system-spec-kit dependency is contradicted by current graph metadata and loader paths; clarify the intended boundary."
  ],
  "standardize": [
    "sk-doc parent-skill definition: one hub identity, mandatory registry, non-discoverable packets, no hub per-mode logic.",
    "/create:parent-skill scaffolder for hub, registry, root graph metadata, packet stubs, shared/, and parity tests.",
    "/doctor:parent-skill validator for registry completeness, nested graph-metadata absence, packet name/path checks, backendKind/runtimeLoopType rules, alias uniqueness, advisor parity, and stale-path lint.",
    "Routing/discovery benchmark covering all workflow modes and asserting {skill: deep-loop-workflows, mode}."
  ],
  "open_questions": [
    "Should registry add packetSkillName so accepted folder/name mismatches like ai-council/deep-ai-council are explicit?",
    "Should mutation/tool boundaries be registry fields or derived from packet SKILL.md frontmatter?",
    "Does runtime dependency policy mean no system-spec-kit MCP internals, or literally no system-spec-kit dependency?"
  ]
}
```
