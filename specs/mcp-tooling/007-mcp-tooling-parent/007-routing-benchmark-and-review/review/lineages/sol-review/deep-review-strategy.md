# Deep Review Strategy — mcp-tooling Hub Routing

## 1. TOPIC

Independent review of the mcp-tooling hub routing surfaces after the six-mode expansion, with special attention to vocabulary collisions, tie-break/defer semantics, registry-router alignment, the Chrome-versus-Aside boundary, and figma-transport routing under the sk-design pairing doctrine.

## 2. REVIEW CHARTER

- Target: `.opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review` (`spec-folder`)
- Execution: autonomous detached lineage, executor `cli-codex`, model `gpt-5.6-sol`
- Artifact root: `.opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/review/lineages/sol-review`
- Findings only: P0/P1/P2; no fixes
- Resource Map Coverage: disabled because `resource-map.md` was absent at initialization

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

## 4. NON-GOALS

- No changes to router, registry, skill, metadata, test corpus, or mode packets.
- No benchmark execution beyond evidence review of the declared routing corpus.
- No structural review of MCP tool implementations except where needed to verify a routing claim.

## 5. STOP CONDITIONS

- Run exactly four iterations. Convergence before iteration 4 is telemetry only.
- Stop after iteration 4 and synthesize, even if active findings remain.

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 3
- P1 (Required): 10
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->

## 7. WHAT WORKED

- Pending first iteration.

## 8. WHAT FAILED

- None yet.

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Advisor-facing description inventory drift: `description.json` names all six modes and all three design transports. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Advisor-facing description inventory drift: `description.json` names all six modes and all three design transports.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Advisor-facing description inventory drift: `description.json` names all six modes and all three design transports.

### Counting any expected-resource subset as a full contract pass: the routing methodology explicitly distinguishes legitimate base gold alignment from genuine extra-resource waste. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Counting any expected-resource subset as a full contract pass: the routing methodology explicitly distinguishes legitimate base gold alignment from genuine extra-resource waste.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting any expected-resource subset as a full contract pass: the routing methodology explicitly distinguishes legitimate base gold alignment from genuine extra-resource waste.

### Direct `Write`/`Edit`/`Task` grant to a transport: ruled out; all three transport registry entries forbid those tools. The Figma issue is the allowed Bash export exception. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Direct `Write`/`Edit`/`Task` grant to a transport: ruled out; all three transport registry entries forbid those tools. The Figma issue is the allowed Bash export exception.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Direct `Write`/`Edit`/`Task` grant to a transport: ruled out; all three transport registry entries forbid those tools. The Figma issue is the allowed Bash export exception.

### General packet-level positive recall failure: bounded to ClickUp and Mobbin holdouts; all 37 non-holdout positive intent expectations and the other eight holdouts select their declared intent. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: General packet-level positive recall failure: bounded to ClickUp and Mobbin holdouts; all 37 non-holdout positive intent expectations and the other eight holdouts select their declared intent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: General packet-level positive recall failure: bounded to ClickUp and Mobbin holdouts; all 37 non-holdout positive intent expectations and the other eight holdouts select their declared intent.

### Missing routed files: ruled out for the 49 replayed cases; every returned resource path exists. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Missing routed files: ruled out for the 49 replayed cases; every returned resource path exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing routed files: ruled out for the 49 replayed cases; every returned resource path exists.

### MT-H01 Chrome-versus-Aside boundary regression: ruled out; “network requests” gives Chrome a positive score while Aside remains zero. [SOURCE: .opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_browser_inspect.md:13] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:111] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: MT-H01 Chrome-versus-Aside boundary regression: ruled out; “network requests” gives Chrome a positive score while Aside remains zero. [SOURCE: .opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_browser_inspect.md:13] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:111]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: MT-H01 Chrome-versus-Aside boundary regression: ruled out; “network requests” gives Chrome a positive score while Aside remains zero. [SOURCE: .opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_browser_inspect.md:13] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:111]

### Refero and Mobbin packet-local doctrine drift: ruled out; both explicitly hand generic design/UI/screen requests to `sk-design` and require design judgment before design-affecting use. [SOURCE: .opencode/skills/mcp-tooling/mcp-refero/SKILL.md:60] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md:63] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Refero and Mobbin packet-local doctrine drift: ruled out; both explicitly hand generic design/UI/screen requests to `sk-design` and require design judgment before design-affecting use. [SOURCE: .opencode/skills/mcp-tooling/mcp-refero/SKILL.md:60] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md:63]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Refero and Mobbin packet-local doctrine drift: ruled out; both explicitly hand generic design/UI/screen requests to `sk-design` and require design judgment before design-affecting use. [SOURCE: .opencode/skills/mcp-tooling/mcp-refero/SKILL.md:60] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md:63]

### Registry-alias/router-vocabulary drift: every registry alias is present in a vocabulary class referenced by its corresponding router signal. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Registry-alias/router-vocabulary drift: every registry alias is present in a vocabulary class referenced by its corresponding router signal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Registry-alias/router-vocabulary drift: every registry alias is present in a vocabulary class referenced by its corresponding router signal.

### Registry/router key-set drift: ruled out; both enumerate the same six workflowMode keys. [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:31] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:24] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Registry/router key-set drift: ruled out; both enumerate the same six workflowMode keys. [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:31] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:24]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Registry/router key-set drift: ruled out; both enumerate the same six workflowMode keys. [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:31] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:24]

### Registry/router mode-key drift: all six keys align bidirectionally. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Registry/router mode-key drift: all six keys align bidirectionally.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Registry/router mode-key drift: all six keys align bidirectionally.

### Treating route telemetry's `deferReason` as an actual defer: the consumer still returns the tied intents and their resources. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating route telemetry's `deferReason` as an actual defer: the consumer still returns the tied intents and their resources.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating route telemetry's `deferReason` as an actual defer: the consumer still returns the tied intents and their resources.

### Treating the baseline's aggregate 95/100 as route correctness: D1 intra is 78/100, and the report explicitly has zero route-gold rows despite observed telemetry. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the baseline's aggregate 95/100 as route correctness: D1 intra is 78/100, and the report explicitly has zero route-gold rows despite observed telemetry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the baseline's aggregate 95/100 as route correctness: D1 intra is 78/100, and the report explicitly has zero route-gold rows despite observed telemetry.

### Treating tieBreak as a single-winner policy: the consumer retains all intents within delta 1; tieBreak does not collapse them. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating tieBreak as a single-winner policy: the consumer retains all intents within delta 1; tieBreak does not collapse them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating tieBreak as a single-winner policy: the consumer retains all intents within delta 1; tieBreak does not collapse them.

### Unparseable packet routers: ruled out; all six expose a parseable deterministic intent/resource map. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Unparseable packet routers: ruled out; all six expose a parseable deterministic intent/resource map.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unparseable packet routers: ruled out; all six expose a parseable deterministic intent/resource map.

<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- None yet.

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Maximum iteration count reached; synthesize the active findings and remediation workstreams without changing reviewed sources. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: hub registry/router/SKILL/description/graph metadata, 13 hub-routing scenarios, and six mode packets' intra-routing recall packs.
- Behavior claims: six hub modes should route predictably; only strong provider- or workflow-specific evidence should resolve collisions; ambiguous requests should defer; figma transport should cooperate with `sk-design` rather than absorb design workflow ownership.
- Reuse and conventions: mode packets define the mode-local workflow vocabulary; hub surfaces must stay bidirectionally aligned with those packets.
- Risk areas: three overlapping design transports (`mcp-figma`, `mcp-mobbin`, `mcp-refero`), `sk-design` pairing, broad browser vocabulary shared by Chrome and Aside, and metadata surfaces that may drift from the router.
- Context gap: the phase spec still narrates a three-mode benchmark while the requested review targets the later six-mode expansion; this will be treated as traceability evidence, not permission to widen implementation scope.
- Resource map: `resource-map.md not present; skipping coverage gate`.

## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | — | Compare routing claims to shipped hub surfaces. |
| `checklist_evidence` | core | pending | — | No checklist exists; assess task/acceptance evidence explicitly. |
| `skill_agent` | overlay | notApplicable | — | Spec-folder target. |
| `agent_cross_runtime` | overlay | notApplicable | — | Spec-folder target. |
| `feature_catalog_code` | overlay | pending | — | Compare registry/router/metadata vocabulary and mode inventory. |
| `playbook_capability` | overlay | pending | — | Compare hub scenarios and per-mode recall packs to routing behavior. |

## 15. FILES UNDER REVIEW

| File or group | Dimensions Reviewed | Last Iteration | Findings | Status |
|---------------|---------------------|----------------|----------|--------|
| `mcp-tooling/mode-registry.json` | — | — | — | pending |
| `mcp-tooling/hub-router.json` | — | — | — | pending |
| `mcp-tooling/SKILL.md` | — | — | — | pending |
| `mcp-tooling/description.json` | — | — | — | pending |
| `mcp-tooling/graph-metadata.json` | — | — | — | pending |
| `mcp-tooling/manual_testing_playbook/hub_routing/` (13 files) | — | — | — | pending |
| six `mcp-*` packet `SKILL.md` files | — | — | — | pending |
| six packet `manual_testing_playbook/intra_routing_recall/` groups | — | — | — | pending |
| phase `spec.md`, `plan.md`, `tasks.md` | — | — | — | pending |

## 16. REVIEW BOUNDARIES

- Max iterations: 4
- Stop policy: max-iterations
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: `sessionId=fanout-sol-review-1784209544620-5f3v0s`, `parentSessionId=null`, `generation=1`, `lineageMode=new`
- Severity threshold: P2
- Started: 2026-07-16T13:48:40Z
