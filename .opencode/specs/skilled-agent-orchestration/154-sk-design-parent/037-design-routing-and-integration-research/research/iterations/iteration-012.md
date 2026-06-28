# Iteration 12: Interface Sub-Skill Command Visibility

## Focus

[D2-8 / D2] mode-internal sub-skills are invisible at the command layer. This pass narrowed the question to `interface` mode's routed resource lanes: which ones should become command-visible tasks or arguments, and which should remain internal references loaded by the mode router.

This pass did not re-cover D2-6 command-as-user-job framing or D2-7's eight broad task verbs. It applies that threshold inside one current mode: `interface` has an internal router with 11 intent lanes, but `/design:interface` still exposes only a generic mode bridge.

## Actions Taken

1. Reviewed the strategy and iterations 9-11 so this pass stayed on D2-8 rather than prior command grammar, preconditions, or task-verb inventory. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/deep-research-strategy.md:33] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-011.md:102]
2. Read the live `/design:interface` wrapper, `sk-design` hub, and `mode-registry.json` to verify what is currently command-visible. [SOURCE: .opencode/commands/design/interface.md:2] [SOURCE: .opencode/commands/design/interface.md:9] [SOURCE: .opencode/skills/sk-design/SKILL.md:23] [SOURCE: .opencode/skills/sk-design/mode-registry.json:14]
3. Read `design-interface/SKILL.md` with line numbers to verify its internal resource loading table and parseable router. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:69] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:100] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:114]
4. Compared `impeccable-main`'s parent-command plus sub-command model, command metadata, and live-mode action routing as the corpus model for exposing high-value internal references without creating standalone skills. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/CLAUDE.md:5] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:120] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/plugin/skills/impeccable/scripts/command-metadata.json:1] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/live.md:192]

## Findings

### F1 - `/design:interface` hides 11 interface intent lanes behind one generic mode bridge

Evidence:

- `/design:interface` exposes `argument-hint: "<design request>"`, opens as a "Thin bridge", and tells the executor to load and apply the `interface` mode to `$ARGUMENTS`. It does not expose any of the mode's internal task lanes as command syntax, arguments, or chooser text. [SOURCE: .opencode/commands/design/interface.md:2] [SOURCE: .opencode/commands/design/interface.md:3] [SOURCE: .opencode/commands/design/interface.md:9] [SOURCE: .opencode/commands/design/interface.md:19] [SOURCE: .opencode/commands/design/interface.md:24]
- `design-interface` has 11 routed intent/resource lanes in its parseable router: `DESIGN_PRINCIPLES`, `REGISTER_DIALS`, `VARIATION_DIVERSITY`, `UX_QUALITY`, `REAL_UI_LOOP`, `MECHANICAL_PREFLIGHT`, `COPY_MOCK_DATA`, `REDESIGN_INTAKE`, `REAL_SYSTEM_GROUNDING`, `REAL_WORLD_REFERENCE`, and `AESTHETICS`. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:100] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:112]
- The router maps those lanes to concrete references and assets, including variation diversity, quality floor, real UI handoff, mechanical preflight, copy/mock data, redesign intake, design inventory, MCP-backed real-world references, and aesthetics references. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:114] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:125]
- The hub only routes to five modes and intentionally keeps per-mode behavior inside packets. That is correct for advisor identity, but it means the command layer cannot currently address interface sub-jobs directly. [SOURCE: .opencode/skills/sk-design/SKILL.md:23] [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:62] [SOURCE: .opencode/skills/sk-design/mode-registry.json:14]

Buildable recommendation:

- Add a command-facing projection for `interface` tasks, either in sibling `.opencode/skills/sk-design/command-metadata.json` or in a separated `mode-registry.json.commandSurface.tasks` block. Each routed intent key must declare one of: `sibling-command`, `argument-modifier`, `internal-required`, or `hidden-reference`.
- Do not create new `workflowMode` entries for these lanes. Keep `workflowMode: "interface"` as the owner mode and project command tasks onto the existing packet.
- Generate or drift-check `/design:interface` from this metadata so its wrapper can mention the task grammar and defer-to-hub behavior without duplicating the child packet's design logic.

Enforceability:

- ENFORCEABLE: a static checker can parse `design-interface/SKILL.md`'s `INTENT_SIGNALS` and `RESOURCE_MAP`, then fail if a lane lacks an explicit command-visibility classification.
- ENFORCEABLE: wrapper drift tests can require `/design:interface` to expose the generated task grammar instead of only `<design request>`.
- ADVISORY: deciding whether a lane deserves a sibling command or only an argument remains product/editorial judgment unless backed by fixture frequency.

### F2 - Promote four interface lanes now; leave calibration and critique-against references internal

Evidence:

- `VARIATION_DIVERSITY` is command-worthy: interface already names "give me N variations" and "show me options" as activation triggers, and the mode says multiple directions require the variation diversity reference. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:32] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:76] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:103] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:117]
- `MECHANICAL_PREFLIGHT` is command-worthy: the interface table calls the preflight card non-optional, maps the lane to the card plus mechanical and copy gates, and success criteria require the preflight card to pass. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:74] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:79] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:120] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:256]
- `REDESIGN_INTAKE` is command-worthy: the table gives existing-surface redesign its own lane because preserve/overhaul classification and locked items are materially different from greenfield design. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:81] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:122] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:227]
- `REAL_UI_LOOP` and `sk_code_handoff` are command-worthy as a handoff/build-manifest task: interface maps code-bound UI work to the real UI loop plus the shared handoff envelope, and success criteria require the manifest when handing to `sk-code`. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:78] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:119] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:178] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:258]
- `REGISTER_DIALS` and `AESTHETICS` should not become user-facing chooser commands. The mode says dials are internal calibration and aesthetics cues are critique-against only, never a chooser or preset. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:74] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:83] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:143] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:242]

Buildable recommendation:

- Add these sibling task commands first:
  - `/design:directions <target> --count <n>` -> owner mode `interface`, resource lane `VARIATION_DIVERSITY`, requires subject/audience/page job, returns distinct direction cards or handoff-ready selected direction.
  - `/design:preflight <target>` -> owner mode `interface` with `UX_QUALITY`, `MECHANICAL_PREFLIGHT`, and `COPY_MOCK_DATA`, returns a filled PASS/FAIL preflight card.
  - `/design:redesign <target> [--preserve|--overhaul]` -> owner mode `interface`, resource lane `REDESIGN_INTAKE`, requires existing surface and locked-item policy.
  - `/design:handoff <target>` -> owner mode `interface`, resource lane `REAL_UI_LOOP`, requires selected direction or built surface, returns the shared `sk-code` build manifest.
- Add these as argument modifiers rather than sibling commands:
  - `--ground-system` for `REAL_SYSTEM_GROUNDING`.
  - `--reference mobbin|refero` for `REAL_WORLD_REFERENCE`.
  - `--copy-pass` for `COPY_MOCK_DATA` when not running full preflight.
- Keep these internal:
  - `DESIGN_PRINCIPLES` and `REGISTER_DIALS` as mandatory background.
  - `AESTHETICS` as critique-against reference, not command-visible style selection.

Enforceability:

- ENFORCEABLE: metadata fixtures can assert "give me three directions" routes to `/design:directions`, "run preflight before ship" routes to `/design:preflight`, "redesign checkout but keep the nav/legal copy" routes to `/design:redesign`, and "handoff this chosen direction to code" routes to `/design:handoff`.
- ENFORCEABLE: negative fixtures can assert "pick an aesthetic" does not route to an aesthetics command, and "read the dials" does not expose a dial chooser.
- ADVISORY: whether `COPY_MOCK_DATA` later deserves its own `/design:copy` command depends on usage volume and overlap with `clarify`/UX-writing work.

### F3 - `impeccable-main` supports a parent skill with command-visible tasks, not standalone skill proliferation

Evidence:

- The corpus explicitly says there is one user-invocable `impeccable` skill with 23 commands underneath it, plus one reference file per command. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/CLAUDE.md:5] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/CLAUDE.md:7] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/CLAUDE.md:8]
- It stores command descriptions and argument hints in `scripts/command-metadata.json` and warns not to add standalone skills because menu pollution is real. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/CLAUDE.md:10] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/CLAUDE.md:13]
- The command table exposes user jobs, while routing rules load a command reference when the first word matches or when intent clearly maps to one command. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:120] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:147] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:165] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:166]
- Live mode reuses action-specific references for `bolder`, `quieter`, `distill`, `polish`, `typeset`, `colorize`, `layout`, `adapt`, `animate`, and `delight`, proving that command-visible actions can still be reference-backed sub-flows rather than new skills. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/live.md:192] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/live.md:196] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/live.md:274] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/live.md:285]

Buildable recommendation:

- Mirror the corpus architecture: one design family, many command-visible task projections, optional redirect/pin shims later. Do not promote interface lanes into standalone skills.
- Put task metadata next to `sk-design`, not in the command wrappers as hand-authored prose. The metadata should include `command`, `ownerMode`, `intentKeys`, `resourceSources`, `argumentHint`, `requires`, `deferToHubWhen`, `returns`, `proofRequired`, and `fixtures`.
- Keep `/design:interface` as the broad parent-mode command, but let it recommend the more specific task command when a prompt maps cleanly to one.

Enforceability:

- ENFORCEABLE: a command inventory checker can allow only known task projections and reject standalone skill creation for these lanes.
- ENFORCEABLE: a metadata drift checker can compare command wrappers against the metadata descriptions and argument hints.
- ADVISORY: final command names like `directions` versus `variants` are editorial choices, though fixtures can measure miss-rate after choosing.

### F4 - The enforcement gap is not reachability; it is command-surface visibility plus proof of resource use

Evidence:

- `design-interface` already says its machine-parseable router drives deterministic routing and the skill-benchmark D5 connectivity gate. It also claims every on-disk reference and asset appears in at least one `RESOURCE_MAP` entry. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:87] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:89] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:95] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:96]
- Success criteria already require context manifests and proof cards before recommendations and ready claims when child-agent or small-model dispatch occurs. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:257]
- The missing layer is not "can the resource be reached?" It is "can a user or pinned command intentionally invoke the high-value resource lane, and can tests prove that lane was loaded?"

Buildable recommendation:

- Add a `design-command-surface` checker beside the existing skill-benchmark checks. Inputs: `sk-design/mode-registry.json`, the new command metadata, `.opencode/commands/design/*.md`, and each mode packet's parseable router.
- For `interface`, the checker should assert:
  - every `INTENT_SIGNALS` key has a visibility classification;
  - every `sibling-command` has a wrapper, argument hint, owner mode, resources, fixtures, and expected proof card;
  - every `argument-modifier` is accepted by at least one wrapper and mapped to resources;
  - every `internal-required` or `hidden-reference` has a rationale and negative fixture preventing command creep;
  - replay fixtures include a resource-load proof token, not just the selected command.
- Use the same proof vocabulary as `context_loading_contract.md`: expected loaded resources before recommendations and proof-of-application before a ready claim.

Enforceability:

- ENFORCEABLE: static metadata coverage, generated wrapper parity, and fixture replay over a gold prompt corpus are deterministic.
- ENFORCEABLE: proof-card content can be checked for expected resource names for promoted lanes.
- ADVISORY: the runtime choice to take a real-world reference proactively remains taste and context judgment.

## Questions Answered

- Q1: Top interface lanes should be promoted as command-visible task projections or arguments, not new modes and not standalone skills.
- Q1: The first promotion set should be `directions`, `preflight`, `redesign`, and `handoff`; `ground-system`, `reference`, and `copy-pass` should start as arguments/modifiers; dials and aesthetics remain internal.
- Q2/Q5: Reachability is already partly covered by router/resource maps. The new enforceable surface is command visibility plus fixture proof that the promoted command loaded the expected resources.

## Questions Remaining

- Should the command be named `/design:directions` or `/design:variants`, given existing trigger wording says both "variations" and "directions"?
- Should `/design:handoff` exist as its own sibling command, or should it be an output mode of `/design:interface` and `/design:directions` after a direction is chosen?
- Should `COPY_MOCK_DATA` remain folded into `preflight`, or should a future `/design:copy` or `/design:clarify` command own UX-writing and mock-data realism?
- Should command metadata live in `mode-registry.json.commandSurface.tasks` or a sibling `command-metadata.json` that points back to modes and router intent keys?

## Next Focus

Continue D2 with the metadata home and checker shape: define the exact schema for `commandSurface.tasks`, how it binds task commands to existing mode routers, and how the fixture suite proves resource-load utilization without flattening mode internals into the hub.
