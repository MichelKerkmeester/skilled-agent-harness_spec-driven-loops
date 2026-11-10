# Iteration 5: Angle 5, SK-DOC

## Focus

Inventory the `sk-doc` create modes, their command bindings, naming guard, template/backbone layout and DQI quality gates; fact-check the draft’s doc-authoring section.

## Actions Taken

- Read the state log and strategy before this angle.
- Read `sk-doc` mode-registry and hub-router mappings, the hub skill and selected create-command routers.
- Read the shared validation/quick-reference material and the filesystem naming guard.

## Findings

## INVENTORY

| Surface | Value | Source |
|---|---|---|
| Parent-hub contract | `sk-doc` is a workflow-only parent hub with one advisor identity, a registry-driven mode router and a shared quality-control backbone; it has no surface-axis packet type. | [SOURCE: `.opencode/skills/sk-doc/SKILL.md:15`] [SOURCE: `.opencode/skills/sk-doc/SKILL.md:65`] [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:5`] [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:12`] |
| Registered modes | The live registry contains 14 mode entries: `sk-create-skill`, `sk-create-skill-parent`, `sk-create-readme`, `sk-create-agent`, `sk-create-command`, `sk-create-feature-catalog`, `sk-create-manual-testing-playbook`, `sk-create-benchmark`, `sk-create-changelog`, `sk-create-diff`, `sk-create-frontmatter`, `sk-create-quality-control`, `sk-create-repo-rule`, and `sk-create-with-human-voice`. All use `routingClass: metadata`; create modes use `backendKind: template-scaffold`, while quality-control uses `create-quality-control`. | [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:19`] [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:53`] [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:396`] [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:453`] [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:531`] |
| Command bindings | Dedicated command bindings are `/create:skill`, `/create:skill-parent`, `/create:readme`, `/create:agent`, `/create:command`, `/create:feature-catalog`, `/create:manual-testing-playbook`, `/create:benchmark`, `/create:changelog`, `/create:diff`, `/create:repo-rule`, and `/create:with-human-voice`. `sk-create-frontmatter` and `sk-create-quality-control` have `command: null` and route through hub aliases. | [SOURCE: `.opencode/skills/sk-doc/SKILL.md:25`] [SOURCE: `.opencode/skills/sk-doc/SKILL.md:36`] [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:396`] [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:453`] |
| Command implementation shape | The `/create:*` Markdown files are thin routers to presentation contracts plus `:auto`/`:confirm` workflow YAMLs; the skill and parent-skill routers explicitly keep workflow behavior in YAML. | [SOURCE: `.opencode/commands/create/skill.md:7`] [SOURCE: `.opencode/commands/create/skill.md:20`] [SOURCE: `.opencode/commands/create/skill-parent.md:7`] [SOURCE: `.opencode/commands/create/with-human-voice.md:7`] |
| Shared template/quality backbone | `shared/` owns generic validator scripts, cross-cutting standards/vocabulary and shared assets; packet-local folders keep packet-specific contracts, references, scripts and templates. The root `scripts/` directory is a facade. | [SOURCE: `.opencode/skills/sk-doc/SKILL.md:121`] [SOURCE: `.opencode/skills/sk-doc/SKILL.md:150`] |
| Scaffolding tools | The documented script set includes `init_skill.py` for skill scaffolding, `package_skill.py` for validation/bundling, `quick_validate.py` for fast naming/frontmatter checks, `validate_document.py` for type-specific document validation, `extract_structure.py` for DQI JSON, `frontmatter-version.mjs`, model-reference validation and flowchart validation. | [SOURCE: `.opencode/skills/sk-doc/scripts/README.md:70`] [SOURCE: `.opencode/skills/sk-doc/scripts/README.md:77`] |
| Naming convention guard | `check_no_new_snake_case.py` rejects newly introduced in-scope snake_case names in changed-only or whole-tree modes. It returns 1 for offenders and 2 for a guard error; Python imports, generated/vendored trees, tool-mandated names, test magic and frozen history are explicit exemptions. | [SOURCE: `.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py:8`] [SOURCE: `.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py:13`] [SOURCE: `.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py:349`] [SOURCE: `.opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:19`] |
| DQI quality gate | DQI is deterministic and totals Structure 40, Content 30 and Style 30. Bands are Excellent 90–100, Good 75–89, Acceptable 60–74 and Needs Work below 60. Format validation returns exit 0 when valid and 1 for blocking errors; strict document classes may not have checklist failures. | [SOURCE: `.opencode/skills/sk-doc/shared/scripts/extract_structure.py:899`] [SOURCE: `.opencode/skills/sk-doc/shared/scripts/extract_structure.py:956`] [SOURCE: `.opencode/skills/sk-doc/shared/references/quick-reference.md:66`] [SOURCE: `.opencode/skills/sk-doc/shared/references/quick-reference.md:75`] [SOURCE: `.opencode/skills/sk-doc/shared/references/validation.md:48`] |
| Routing quality gate | The hub requires registry and router resolution, uses a null default mode to defer ambiguous intent, and keeps the root `ROUTER.md` resource map synchronized with `leaf-manifest.json` and `leaf-aliases.json`. | [SOURCE: `.opencode/skills/sk-doc/SKILL.md:101`] [SOURCE: `.opencode/skills/sk-doc/SKILL.md:105`] [SOURCE: `.opencode/skills/sk-doc/SKILL.md:160`] [SOURCE: `.opencode/skills/sk-doc/hub-router.json:4`] |

## DRIFT

| Draft line | Claim | Verdict | Actual state | Severity | One-line correction | Source |
|---|---|---|---|---|---|---|
| 114 | `sk-doc` routes nested packets including `sk-create-diagram`, and each mode is either a workflow or a read-only surface packet. | FALSE | The registry has no `sk-create-diagram`; every `sk-doc` mode is `packetKind: workflow`, with no surface axis. Diagram is a design command/surface. | P0 | Remove `sk-create-diagram` from the `sk-doc` list and describe all current `sk-doc` packets as workflow packets. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:114`] [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:12`] [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:19`] |
| 116 | `/create:skill` and `/create:skill-parent` scaffold router files, packets, README, agent mirrors and a routing-drift check. | TRUE | The two command routers bind to separate YAML workflows, and the parent command’s invariant requires one hub identity and registry-backed nested packets. | P2 | Retain the statement and name the exact workflow YAMLs when documenting operator behavior. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:116`] [SOURCE: `.opencode/commands/create/skill.md:20`] [SOURCE: `.opencode/commands/create/skill-parent.md:20`] |
| 118 | The `/create:*` family is untouched; the quality packet is reached as `/doc:quality` and four create commands were renamed. | STALE | The live registry gives frontmatter and quality-control no dedicated command, and the current docs expose 12 create routers plus design routers; aliases exist in hub-router but the draft’s command count/name story needs exact mapping. | P1 | Replace with the registry’s command column and explicitly distinguish aliases from command front doors. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:118`] [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:396`] [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:453`] [SOURCE: `.opencode/skills/sk-doc/hub-router.json:138`] |
| 126 | `sk-create-diagram` is reachable through `/create:diagram`. | FALSE | No such `sk-doc` mode or `/create:diagram` file exists in the current command tree; the design family owns `/design:diagram`. | P0 | Replace `/create:diagram` with `/design:diagram` and classify it under `sk-design`. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:126`] [SOURCE: `.opencode/commands/design/diagram.md:1`] [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:19`] |
| 133 | Kebab-case is canonical and a guard refuses new snake_case names. | TRUE | The guard exists, returns a failing status for offenders and preserves explicit exemptions for Python/import/tool/history names. | P2 | Retain, but document the exemption boundary instead of calling it a repository-wide zero-snake rule. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:133`] [SOURCE: `.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py:13`] [SOURCE: `.opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:31`] |

## DISAGREEMENTS

The hub `SKILL.md` repeatedly says “fifteen workflow packets” at lines 15, 134 and 177, while the live `modes[]` array has 14 entries; its own list at lines 25–37 also names 14. The changelog independently describes a nonexistent `sk-create-diagram` packet. These are documentation-versus-registry contradictions for the reproduction pass. [SOURCE: `.opencode/skills/sk-doc/SKILL.md:15`] [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:19`] [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:531`]

## CONFIDENCE

Confirmed: mode names, routing class, packet kind, backend kind, dedicated command bindings, null-command modes, router shape, shared quality backbone, script roster, naming guard behavior and DQI bands were opened directly. Inferred: the exact historical “four renamed commands” list in draft line 118 is not reconstructed here; current registry/command paths are authoritative for present operation, while a historical diff is deferred to angle 9.

## Questions Answered

- What does sk-doc ship for create modes, templates and quality gates?

## Questions Remaining

- What do the six CLI executor packets support, and can this lane dispatch recursively?
- Which historical command renames in line 118 are confirmed by v3.6.0.0-to-current evidence?

## Next Focus

CLI-EXTERNAL-ORCHESTRATION: inspect the six executor packets, model/auth/sandbox flags, child-dispatch preamble, self-invocation rules, Pi bridges and fan-out reachability.

## Reflection

The registry is more precise than the narrative: `sk-doc` owns 14 workflow packets, not a diagram packet or a surface-packet axis. The durable quality contract is the shared DQI/validator backbone plus registry/router synchronization, and the naming guard is scope-aware rather than a literal zero-snake rule.
