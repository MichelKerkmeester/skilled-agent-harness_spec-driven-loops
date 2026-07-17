# Iteration 4: Trace the root-path contract across standalone routers, parent hubs, packet routers, and benchmark gold

## Focus

Answer Q2 by tracing the coordinate system taught by `create-skill/assets/skill/skill_smart_router.md`, the emitted parent-hub JSON templates/schema, the live `sk-doc` hub, the packet `SKILL.md` files reached by the six iteration-3 wrong-root rows, and the stored Mode-B evidence. Determine whether one source explicitly causes packet-prefixed/shared-prefixed answers or whether the failures arise at an undefined handoff between coordinate systems.

## Actions Taken

1. Read the canonical state log, reducer-owned strategy, and iteration 3 before investigating; preserved the saturated literal alias-gap direction.
2. Traced the standalone smart-router template from `SKILL_ROOT` discovery through guarded loading and returned `resources` values.
3. Traced the parent-hub router template/schema and the live `sk-doc` hub from hub-root resource addresses to packet `SKILL.md` loading.
4. Joined the six previously classified wrong-root report rows to the packet instructions, current playbook fixtures, and the physical shared changelog asset.

## Findings

### 1. The standalone smart-router contract is unambiguously packet-root-relative

The canonical standalone template defines `SKILL_ROOT` as the directory containing the packet's `SKILL.md`, discovers only `SKILL_ROOT/references` and `SKILL_ROOT/assets`, and converts every discovered file to `doc.relative_to(SKILL_ROOT)`. Its guarded loader and return value preserve those strings unchanged. Therefore a packet router emits `references/README.md` or `assets/agent_template.md`, not `create-agent/references/README.md`. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md:44] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md:45] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md:52] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md:69] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md:73] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md:175]

The live packet routers follow the same pattern. For example, `create-skill` returns paths relative to its own `SKILL_ROOT`, including `references/shared/...`, `references/skill/...`, and `assets/skill/...`; `create-quality-control` and `create-flowchart` likewise relativize to their packet roots. [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:86] [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:105] [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:112] [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:144] [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:160] [SOURCE: .opencode/skills/sk-doc/create-quality-control/SKILL.md:58] [SOURCE: .opencode/skills/sk-doc/create-quality-control/SKILL.md:80] [SOURCE: .opencode/skills/sk-doc/create-flowchart/SKILL.md:67] [SOURCE: .opencode/skills/sk-doc/create-flowchart/SKILL.md:90]

### 2. The parent-hub contract deliberately uses the opposite coordinate system

The emitted parent-hub router template places packet-qualified paths such as `[workflow-packet-a]/SKILL.md` and `[surface-name]/references/[reference].md` in `routerSignals[].resources`. The schema makes the rule explicit twice: `defaultResource` and signal resources are “hub-root-relative, packet-qualified” paths. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:16] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:37] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:53] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:89] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:176]

The live `sk-doc` hub implements that contract: `hub-router.json` names `create-*/SKILL.md`, and the hub resolves each selected registry packet as `f"{entry.packet}/SKILL.md"`. It then returns only the routing outcome; it does not define how a downstream caller should serialize packet-local resource paths into a public `resources` array. [SOURCE: .opencode/skills/sk-doc/hub-router.json:23] [SOURCE: .opencode/skills/sk-doc/hub-router.json:34] [SOURCE: .opencode/skills/sk-doc/SKILL.md:57] [SOURCE: .opencode/skills/sk-doc/SKILL.md:66] [SOURCE: .opencode/skills/sk-doc/SKILL.md:88] [SOURCE: .opencode/skills/sk-doc/SKILL.md:95]

This is the causal ambiguity: the two layers each have a coherent local convention, but no handoff contract distinguishes an internal hub load address (`create-agent/SKILL.md`) from a packet router's caller-visible resource id (`references/README.md`). The parent-hub JSON templates emit only first-layer packet entrypoints, so they neither canonicalize nor validate second-layer leaf paths.

### 3. Four of the six rows are direct manifestations of the undefined handoff

The stored Mode-B responses for `SD-007`, `SD-009`, `SD-003`, and `SD-011` prepend the selected packet name to paths that the packet routers themselves expose without that prefix. The chosen leaves and families show that routing reached the right packet; the model then serialized the leaf using the hub coordinate frame. Exact scorer equality turns each into zero recall. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:189] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:301] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1125] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1648]

| Scenario | Live prefix | Instruction that makes it plausible | Q2 attribution |
|---|---|---|---|
| `SD-007` | `create-quality-control/`, `create-flowchart/` | Hub resources are packet-qualified; both packet routers return packet-local `references/...` paths. | Confirmed handoff ambiguity. |
| `SD-009` | `create-feature-catalog/` | Hub selects `create-feature-catalog/SKILL.md`; packet references are locally addressed. | Confirmed handoff ambiguity. |
| `SD-003` | `create-agent/`, `create-command/` | Ordered multi-packet routing exposes two hub-qualified packet names, while both packets describe local `references/` and `assets/`. | Confirmed handoff ambiguity, amplified by a bundle. |
| `SD-011` | `create-skill/` | The packet explicitly returns `references/shared/...` and `references/skill/...`, but the hub entered through `create-skill/SKILL.md`. | Confirmed handoff ambiguity. |

### 4. `SD-020` is a topology-versus-gold mismatch, not evidence that the template invented `shared/`

The current hub says there are no hub-root `assets/` or `references/` aggregation directories; shared assets live under the `shared/` backbone. The create-changelog packet explicitly names `../shared/assets/changelog_template.md`, and the physical file is `sk-doc/shared/assets/changelog_template.md`. A hub-root serialization of that real file is therefore `shared/assets/changelog_template.md`, exactly what the live model stated. [SOURCE: .opencode/skills/sk-doc/SKILL.md:101] [SOURCE: .opencode/skills/sk-doc/SKILL.md:125] [SOURCE: .opencode/skills/sk-doc/SKILL.md:126] [SOURCE: .opencode/skills/sk-doc/create-changelog/SKILL.md:14] [SOURCE: .opencode/skills/sk-doc/shared/assets/changelog_template.md:1]

The benchmark fixture still expects the legacy/virtual `assets/changelog_template.md` identifier even though that path does not describe the current hub topology. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/agent_dispatch/markdown_agent_cli_claude_code.md:9] [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/agent_dispatch/markdown_agent_cli_claude_code.md:76] This row is a contract-drift failure shared by fixture gold and routing output, not a pure create-skill-template defect.

### 5. `SD-016` cannot currently support the earlier wrong-root attribution

The current `SD-016` fixture expects `create-quality-control/references/optimization.md`, while the retained live response begins with that same packet-qualified path; nevertheless the stored report assigns zero resource recall. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/intent_detection/optimization.md:6] [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/intent_detection/optimization.md:7] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1440]

Because the report does not persist the full normalized stated route or the exact gold snapshot used at execution time, this contradiction cannot be resolved from the retained artifact. The earlier six-row count remains useful as a symptom distribution, but Q2 causality is now: four confirmed coordinate-handoff rows, one shared-topology/gold-drift row, and one provenance-inconsistent row. Calling all six template-caused wrong roots would overstate the evidence.

### 6. The emitted JSON config cannot solve leaf-path discoverability by itself

`parent_skill_hub_router_template.json` and the live `sk-doc/hub-router.json` stop at packet `SKILL.md` resources. They contain no second-layer leaf registry, no output namespace declaration, and no canonicalization rule for paths returned by packet routers. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:33] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:53] [SOURCE: .opencode/skills/sk-doc/hub-router.json:22] [SOURCE: .opencode/skills/sk-doc/hub-router.json:34]

The implementable implication for Q5 is to define two named path types rather than choosing one silently: hub load addresses remain packet-qualified, while benchmark/public leaf ids must be explicitly canonicalized to the chosen output namespace. A second-layer packet resource router or manifest must own the conversion and validate the gold convention.

## Questions Answered

- **Q2:** Answered with a qualified yes. The create-skill authoring stack teaches both packet-root-relative leaf ids and hub-root-relative packet-qualified load addresses, but never specifies their handoff. That ambiguity directly explains four rows. `SD-020` exposes stale/virtual gold against the real shared topology, and `SD-016` has a report-versus-current-fixture provenance contradiction, so neither should be attributed solely to the template.

## Questions Remaining

- **Q4:** Determine whether `routing-registry-drift-guard` checks output namespace/root convention, second-layer leaf coverage, fixture-to-topology validity, or only registry/router projection equality.
- **Q5:** Produce the prioritized fix list with separate controls for path namespace/canonicalization, leaf discoverability, bundle caps, and benchmark provenance snapshots.

## Assessment

- New information ratio: **0.88**.
- Novelty justification: this pass identifies the exact two-coordinate-system handoff, reduces the six-row template-causality claim to four confirmed rows, and finds one topology/gold drift plus one unreconstructable provenance contradiction.
- Status: **complete** for Q2.
- Confidence: high for the template/schema coordinate systems and four direct rows; high for the physical shared asset topology; medium for `SD-016` because the report truncates and omits the execution-time gold snapshot.

## Reflection

- What worked: comparing authored coordinate rules to the model's serialized arrays separated internal load addresses from public leaf identifiers.
- Ruled out: one universal wrong-root rule taught by `skill_smart_router.md`; it consistently teaches packet-local paths, while the parent-hub schema teaches hub-qualified paths.
- Ruled out: treating all six rows as the same defect; `SD-020` and `SD-016` have materially different evidence.

## SCOPE VIOLATIONS

- The workflow normally allows reducer refreshes of strategy, registry, dashboard, and synthesis. This dispatch explicitly makes those files read-only and allows only the iteration narrative, state-log append, and iteration delta; no out-of-scope mutation was attempted.
- Fixing the ambiguous path contracts, fixtures, router JSON, or packet `SKILL.md` files would modify researched paths outside the allowed write fence. Those mutations are deferred as findings; none were executed.

## Next Focus

Answer Q4 by tracing `routing-registry-drift-guard` and adjacent parent-hub validators. Test separately for registry/router key equality, resource existence, output path namespace, second-layer leaf coverage, fixture-to-topology validity, and execution-time provenance capture; name the first missing check at each boundary.
