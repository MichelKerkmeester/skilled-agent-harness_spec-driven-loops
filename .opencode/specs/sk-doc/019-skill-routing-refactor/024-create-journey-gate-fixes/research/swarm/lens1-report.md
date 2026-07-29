**Findings**
P1 | `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-description-template.json:4` | Misidentifies `description.json` as advisor input | Quote: `"One advisor-facing paragraph..."` Correction: describe it as hub-doctor metadata. The advisor identity input is `graph-metadata.json`; link the canonical contract instead of assigning advisor ownership.

P1 | `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-graph-metadata-template.json:87,97` | Makes doctor-only `description.json` an advisor-derived source | Quote: `"description.json"` appears in both `derived.source_docs` and `derived.key_files`. Correction: remove it from those lists, or explicitly amend the canonical contract. The current template causes the derived pipeline to consume a file the contract says no production consumer reads.

P1 | `.opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md:56` | Calls two files the advisor-routable metadata pair | Quote: “`graph-metadata.json` and `description.json` (the advisor-routable metadata pair)” Correction: only `graph-metadata.json` supplies advisor identity; `description.json` is H-only doctor metadata.

P1 | `.opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md:227-230` | Retains obsolete command-metadata overlay policy | Quote: “A hub MAY carry an optional `command-metadata.json` ... Enforcement is ... pending.” Correction: class H requires this file now, including literal `[]` for no commands; the fleet gate validates its core schema. Replace the restatement with the canonical-contract link.

P1 | `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md:49` | Calls `description.json` advisor-facing | Quote: “`description.json` is the advisor-facing summary.” Correction: it is doctor-only; `graph-metadata.json` is the advisor identity node.

P1 | `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md:20,74-93` | Required hub file list is incomplete | Quote: “Hub tier: `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`.” Correction: class H also requires authored `command-metadata.json` and generated `leaf-manifest.json`; `leaf-aliases.json` is optional/authored only for genuine cross-packet aliases. Prefer linking the canonical matrix.

P1 | `.opencode/skills/sk-doc/create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md:121` | Generated scaffold repeats the wrong consumer | Quote: “`description.json` — advisor-facing hub description.” Correction: “hub-doctor description”; link the root-metadata contract for ownership.

P1 | `.opencode/skills/sk-doc/create-skill/SKILL.md:204-224` | “Required Standalone Skill Shape” omits all required root JSON | Quote: the tree lists `SKILL.md`, resources, playbook, and benchmark only. Correction: class S also requires authored `graph-metadata.json` and `leaf-manifest.config.json`, plus generated `leaf-manifest.json` and `leaf-aliases.json`. Link the matrix rather than maintaining a second shape.

P1 | `.opencode/skills/sk-doc/create-skill/SKILL.md:277-305` | Parent-hub shape contradicts the workflow and contract | Quote: the tree omits `command-metadata.json` and `leaf-manifest.json`. Correction: include both or replace the metadata portion with a link to the canonical class-H matrix.

P1 | `.opencode/skills/sk-doc/create-skill/README.md:74` | Parent initializer output list is incomplete | Quote: “scaffolds the hub root (`SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`)” Correction: include required `command-metadata.json` and generated `leaf-manifest.json`, or link the canonical contract.

P1 | `.opencode/skills/sk-doc/create-skill/README.md:127` | Claims `SKILL.md` is the only required file | Quote: “`SKILL.md` is the only required file.” Correction: `SKILL.md` is the root marker, but every skill root also has class-specific required metadata under the H/S matrix.

P1 | `.opencode/skills/sk-doc/create-skill/references/shared/overview.md:39-56` | Generic anatomy presents an obsolete root shape | Quote: “Every skill consists of a required SKILL.md file and optional ... bundled resources.” Correction: distinguish content resources from required root metadata and link `skill-root-metadata-contract.md`.

P1 | `.opencode/skills/system-skill-advisor/SKILL.md:87,311` | Advertises a manifest-only regeneration path and stale “keep aliases in sync” wording | Quote: “regenerate with `generate-leaf-manifest.cjs --write ...`” and “keep `leaf-aliases.json` in sync.” Correction: prescribe only `ci-skill-root-metadata.cjs --fix`, which regenerates both generated class-S artifacts; do not imply manual synchronization.

P2 | `.opencode/skills/system-skill-advisor/SKILL.md:437` | Purported canonical reference is not a resolvable link | Quote: “canonical doc at `create-skill/references/shared/skill-root-metadata-contract.md`.” Correction: use a Markdown link to `../sk-doc/create-skill/references/shared/skill-root-metadata-contract.md` and link the exact `skill/` templates.

P2 | `.opencode/skills/system-skill-advisor/README.md:165-170` | Related-skills section omits the metadata authority | Quote: “`sk-code`, `sk-doc`, `sk-git`, `mcp-code-mode` | Target skills...” Correction: add a direct link to the create-skill root contract and state that advisor identity comes from `graph-metadata.json`, not `description.json`.

P2 | `.opencode/skills/system-skill-advisor/mcp-server/README.md:318-328` | Runtime package navigation lacks the source-metadata contract | Quote: the `RELATED` list links package internals only. Correction: add the create-skill canonical contract as the authority for files indexed or mutated by this package.

P2 | `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/README.md:13` | Indexing docs name the identity source without linking its authoring contract | Quote: “index `.opencode/skills/*/graph-metadata.json` files.” Correction: identify these as advisor identity inputs and link the canonical contract/template map.

P2 | `.opencode/skills/system-skill-advisor/mcp-server/lib/cross-skill-edges/README.md:18` | Mutation docs do not link the metadata ownership contract | Quote: “apply ... candidates back to `graph-metadata.json`.” Correction: link the canonical contract and clarify that apply mutates only the authored graph edge surface.

P2 | `.opencode/skills/system-skill-advisor/references/graph/propagate-enhances.md:62` | Apply guidance lacks the authoritative schema link | Quote: “`apply` — Writes selected candidates to source `graph-metadata.json` files.” Correction: link the canonical contract and graph-metadata templates rather than leaving file ownership implicit.

P2 | `.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/sync.md:22` | Derived-block maintenance is documented without the root contract | Quote: “writes only the `derived` block of each skill’s `graph-metadata.json`.” Correction: link the canonical contract and explicitly frame this as the bounded generated-block exception inside an otherwise authored identity file.

P2 | `.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/derived-extraction.md:22` | Generated metadata guidance lacks the authoring boundary | Quote: “writes the result into `graph-metadata.json.derived` only.” Correction: link the canonical contract instead of leaving generated-block versus authored-identity ownership unstated.

P2 | `.opencode/skills/sk-doc/create-skill/references/parent-skill/parent-hub-router-schema.md:341-345` | Router schema discusses authored `leaf-aliases.json` but omits the class contract | Quote: related resources list only the parent doctrine and router templates. Correction: add `../shared/skill-root-metadata-contract.md`, which defines H-only authored alias semantics and the complete file matrix.

**Refuted**
REFUTED | `system-skill-advisor` is incorrectly modeled as a hub | It has neither registry nor router, carries `leaf-manifest.config.json`, and the read-only fleet gate classifies it as S.

REFUTED | Current generated aliases or manifest are stale | `ci-skill-root-metadata.cjs --format json` reported `11/11` roots passing, `fixed: 0`, including `system-skill-advisor`.

REFUTED | All `leaf-aliases.json` files should be hand-maintained | The canonical contract and `parent-skill-leaf-aliases-template.json` correctly split behavior: optional/authored for H, required/generated for S.

REFUTED | `command-metadata.json` remains an overlay everywhere | The canonical contract, command template, and create-skill workflow correctly require it for H; the obsolete claim is isolated to `parent-skills-nested-packets.md`.

REFUTED | The advisor reads every hub’s `mode-registry.json` at runtime | `feature-catalog/scorer-fusion/projection.md:26` correctly limits this to generated deep-loop projection and explicitly says the advisor does not read another skill’s registry at runtime.

REFUTED | Watcher and rebuild docs treat `description.json` as an identity source | They consistently watch/rebuild from `SKILL.md`, `graph-metadata.json`, and declared `derived.key_files`; the conflicting inclusion comes from the parent graph template.

REFUTED | Validation guidance lacks the canonical gate | `references/shared/validation-and-packaging.md:66-73` correctly links the contract and prescribes `ci-skill-root-metadata.cjs`/`--fix`.

VERDICT: FINDINGS 22