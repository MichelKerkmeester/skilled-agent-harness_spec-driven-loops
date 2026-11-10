### .skilled/skills/sk-doc/sk-create-skill/README.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/README.md:29 | 6 | OVERVIEW opens with `### Why This Skill Exists`, while the skill README template says to start with `### What It Does` and the template scaffold does. | Move lines 29-31 to immediately after line 35.
- [P2] .skilled/skills/sk-doc/sk-create-skill/README.md:57 | 1 | The Quick Start says `init_skill.py` creates `SKILL.md` and two prepared trees, but the starter also writes `ROUTER.md`, so the note hides a required file. | Replace `with \`SKILL.md\` and two prepared trees` with `with \`SKILL.md\`, \`ROUTER.md\` and two prepared trees`.
- [P2] .skilled/skills/sk-doc/sk-create-skill/README.md:71 | 1 | Step 3 shows the packaging command with no expected output, while the README template requires every command to state what success looks like. | Insert after line 71: `Expected: ✅ Successfully packaged <file-count> files to: <output-directory>/<skill-name>.zip`.
- [P1] .skilled/skills/sk-doc/sk-create-skill/README.md:153 | 1 | The Verification table mixes repository-root paths (rows 152 and 156) with skill-relative paths (rows 153-155), so no single working directory runs the table and rows 2-4 fail from the repository root. | Add `Run every command in this table from the repository root.` before line 150, and change the commands at 153-155 to `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py <path>`, `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py <path> --strict` and `python3 .skilled/skills/sk-doc/shared/scripts/extract_structure.py <path/to/SKILL.md>`.
- [P1] .skilled/skills/sk-doc/sk-create-skill/README.md:156 | 1 | The leaf-route replay row says `pass 22`, but the test now reports 26 passing tests, so a reader checking the stated output sees a mismatch. | Replace `pass 22` with `pass 26`.
- [P2] .skilled/skills/sk-doc/sk-create-skill/README.md:170 | 8 | The `references/README.md` row says the route map covers only `skill/` and `parent-skill/`, but that index also covers `shared/`, the group both modes load first. | Replace `Route map into the \`skill/\` and \`parent-skill/\` reference groups` with `Route map into the \`shared/\`, \`skill/\` and \`parent-skill/\` reference groups`.

### .skilled/skills/sk-doc/sk-create-skill/ROUTER.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/ROUTER.md:16 | 3 | The intro points at `SKILL.md` and describes what this file holds; it never tells the reader when to open it or what they get. | Replace lines 16-17 with: `Open this router before loading any skill-local file, so a request reaches the right references and assets instead of the whole folder.`
- [P2] .skilled/skills/sk-doc/sk-create-skill/ROUTER.md:23 | 4 | OVERVIEW presents the request triggers before the router's purpose, which sits at lines 25-27. | Move lines 25-27 to immediately after line 21, before line 23.

### .skilled/skills/sk-doc/sk-create-skill/SKILL.md

- [P1] .skilled/skills/sk-doc/sk-create-skill/SKILL.md:102 | 8 | The Required Standalone Skill Shape omits `ROUTER.md`, although `init_skill.py` writes it and the strict package contract requires a sibling router. | Insert `├── ROUTER.md                      # sibling machine router` after line 102.
- [P1] .skilled/skills/sk-doc/sk-create-skill/SKILL.md:164 | 1 | Step 7 gives each nested packet `SKILL.md`, `README.md` and `changelog/` but omits the packet's own `ROUTER.md`; the shape tree at 219 and 224 omits it too, so a hand-built packet fails the strict sibling-router check. | Replace line 164 with `7. Create each nested packet with \`SKILL.md\`, \`README.md\`, its own \`ROUTER.md\`, and \`changelog/\`.` and insert `│   ├── ROUTER.md` after line 219 and `    ├── ROUTER.md` after line 224.
- [P2] .skilled/skills/sk-doc/sk-create-skill/SKILL.md:202 | 8 | The parent-hub shape omits the hub `README.md`, although `init_skill.py` writes one and the hub README template says every hub has one. | Insert `├── README.md` after line 202.

### .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:35 | 4 | OVERVIEW opens with When to Use and never states the template's Purpose, while the asset template requires Purpose before Usage. | Insert `### Purpose` before line 35 and add the sentence `Give one advisor-routable identity to a family of packets while each packet keeps its own contract.`
- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:93 | 8 | The Required Companion Files table omits the hub `README.md`, and Related Resources omits its template, so a hand-built hub has no README row or scaffold link. | Insert a row after line 93 with cells `Hub`, `README.md`, `Yes`, `Human-facing orientation: the pitch, the packet table, the navigation and the validation close`; add `- [\`parent-skill-readme-template.md\`](./parent-skill-readme-template.md) - the human-facing README template for the hub.` after line 318.
- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:116 | 7 | The packet-shape paragraph packs the line budget, router placement, link rule and hub-versus-packet ownership into one block. | Replace line 116 with `Packets inside the hub follow the mode-packet shape. See [\`skill-md-template.md\`](../skill/skill-md-template.md) for the packet \`SKILL.md\` shape and [\`skill-router-template.md\`](../skill/skill-router-template.md) for its router file.`, keeping both template links on line 116, then add the bullets `- A short SMART ROUTING section of 8 to 12 non-blank lines of plain prose.`, `- Its own \`ROUTER.md\` beside its \`SKILL.md\`, holding that packet's machine router.`, `- One relative markdown link from the packet's Section 2 to that file.` and `- The hub root \`ROUTER.md\` owns the hub's stage two; each packet's \`ROUTER.md\` owns the selections that stay inside that packet.`
- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:200 | 8 | The Layout table omits the hub `README.md` and both packet `ROUTER.md` files, so it contradicts the required-companion table and the checklist. | Insert rows after lines 200, 211 and 214 with cells (`[parent-skill-name]/README.md`, `Hub overview`), (`[parent-skill-name]/[workflow-packet-a]/ROUTER.md`, `Workflow packet router`) and (`[parent-skill-name]/[surface-name]/ROUTER.md`, `Surface packet router`).
- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:224 | 7 | The `ROUTER.md` bullet packs the stage-two role, both router states, the promotion rule and the machine-router contents into one block. | Replace line 224 with five bullets: `- \`ROUTER.md\` is the stage-two control document.`, `- \`router_state: active\` declares non-empty equal-key \`INTENT_SIGNALS\`/\`RESOURCE_MAP\`.`, `- \`router_state: stage1-only\` keeps all stage-two collections empty and delegates to stage one.`, `- Promote to \`active\` only after authoring concrete, resolvable leaf paths, never placeholder intents.` and `- Its final \`## MACHINE ROUTER\` section holds the compiled-routing directive and the fallback checklist, so the hub \`SKILL.md\` never repeats them.`
- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:236 | 1 | The Optional Extensions list omits `transport-axis`, although the model table says transport packets are declared through it. | Insert after line 236: `- \`transport-axis\`: declares that the hub includes \`packetKind: "transport"\` packets.`
- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:305 | 1 | The checklist's `ROUTER.md` link resolves from the template folder, not from the hub it describes, so it is a dead link. | Replace `[\`ROUTER.md\`](./ROUTER.md)` on line 305 with the code span `` `ROUTER.md` ``.

### .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md:34 | 6 | OVERVIEW starts with Why This Template Exists, contradicting its own instruction at line 82 to start with `### What It Does` and the scaffold at line 161, which does. | Move lines 34-40 to immediately after line 45, before `### When To Write A Hub README`.
- [P1] .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md:232 | 1 | The verification commands assume the repository root for the validator path but the hub root for `README.md`, so the validator cannot find the hub README and the HVR grep checks the wrong file. | Replace line 232's command with `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/[hub-name]/README.md --type readme` and line 240's command with `! rg -n '\x{2014}|\x{3B}' .skilled/skills/[hub-name]/README.md`.

### .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md:137 | 7 | The `FULL_INVENTORY` bullet packs the trigger, the N-to-1 fan-out resolution and the manifest rule into one block. | Replace line 137 with four bullets: `- \`FULL_INVENTORY\` fires only on an explicit "show the whole toolkit" request.`, `- Two workflow modes that share one packet directory (N-to-1 fan-out) resolve from a packet-qualified raw path to whichever mode is bound first.`, `- The fan-out twin is an exact leaf duplicate.` and `- If a hub must enumerate both twins distinctly, drive that from the manifest, not from raw router strings.`

### .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md

- [P1] .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md:96 | 1 | The `description.json` link resolves only from the template's folder; every generated hub at `.skilled/skills/<hub>/` gets a dead `../../../references/...` link. | Replace line 96 with: `- \`description.json\`: hub-doctor metadata. See \`.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md\` for the class-H fields.`

### .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md

- clean

### .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md
- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:20 | 6 | The overview opens with `### Location & Naming` and puts the create-or-keep decision at 33-46, so a reader meets naming rules before learning whether an asset file is the right vehicle. | Move lines 33-46 (`### When to Create Assets` through `- Part of core instructions (RULES, WORKFLOW sections)`) to immediately after line 18 (`## 1. OVERVIEW`), above line 20.

### .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md
- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md:41 | 1 | The size target contradicts three other statements in the same file: line 119 says "SKILL.md <1000 lines, rest in resources", line 425 says "SKILL.md (800-1000 lines)", and line 981 says "SKILL.md Lines ... 800-1000". Line 41 alone makes SKILL.md itself 800-2000 lines. | Replace line 41 with: `**Target size**: 800-2000 lines total, with SKILL.md under 1000 lines and the rest in bundled resources (<5k words total).`
- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md:145 | 1 | The sample SKILL.md body opens with a live H1, while every sample H2 below it is backslash-escaped (lines 153, 188, 201, 259, 314, 334, 361, 400) so it stays out of the document outline. The H1 alone is not escaped, so the asset renders as two top-level documents. | Change line 145 from `# [Skill Title - Comprehensive Name]` to `\# [Skill Title - Comprehensive Name]`, matching the escaped H2s.

### .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-procedure-template.md
- [P1] .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-procedure-template.md:230 | 1 | The sk-design example is stale and points at a dead path: `sk-design/mode-registry.json` defines four `workflow` modes, not "two workflow modes and one transport packet", there is no `sk-design/shared/procedures/`, and `sk-design/shared/procedure-card-schema.md` does not exist. A reader following this paragraph hits a missing file. | Replace line 230 with: "`sk-design` (`.skilled/skills/sk-design/`) is an illustrative hub-scale example: its current registry has four workflow modes, and the `sk-design-md-generator` packet keeps its procedure cards under `procedures/`. Consult `sk-design/mode-registry.json` before copying this topology. `sk-design/sk-design-md-generator/procedures/` holds the card layout this template generalizes from."
- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-procedure-template.md:24 | 6 | `### Location & Naming` precedes `### When to Create a Procedure Card` (40-51), so the decision to use a card comes after the where-to-put-it detail it governs. | Move lines 40-51 to immediately after line 22 (end of the `What Is a Procedure Card` paragraph), above line 24.

### .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md
- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md:125 | 7 | One sentence carries five separate bans, which a reader must unpack before reaching the checks that enforce them. | Replace line 125 with `The banned forms are:\n- em dashes (U+2014)\n- semicolons (U+003B)\n- Oxford commas (a comma before the final and or or in a list)\n- the hard-blocker words listed below\n- forced three-item groups`
- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md:345 | 1 | The note says a green run does not mean the file passed "the nine checks above", but the checklist at 317-327 has eleven numbered rows. | Replace `nine checks above` with `eleven checks above`.

### .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md
- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:20 | 4 | `## 1. OVERVIEW` contains only `### Location & Naming`. The definition of a reference file and its place in progressive disclosure sit at 202-230, at the end of Section 2 and after the structure guidance that assumes them. | Move lines 202-230 (`### What Are AI Agent Skill Reference Files?` through `Reference files = Level 3...`) to immediately below line 20, above `### Location & Naming`, and delete the `---` now at line 232, since line 200 already closes Section 2.
- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:40 | 2 | The H3 repeats its parent H2's label: `## 2. DOCUMENT STRUCTURE` followed by `### Document Structure: Title and Intro`, a repeated label across heading levels. | Rename line 40 to `### Title and Intro`.
- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:68 | 7 | Three field rules are packed into one parenthetical opened after "routing signal", and the parenthetical switches to new sentences mid-flow ("...content. `importance_tier` defaults..."). | Replace line 68 with `Every reference file carries this full 5-field frontmatter block. The Skill Advisor harvests it as routing signal:\n- 3-8 lowercase multi-word \`trigger_phrases\` drawn from the doc's content\n- \`importance_tier\`, which defaults to \`normal\`, with \`important\` only for formal contract docs\n- \`contextType\`, one of \`planning|research|implementation|general\`\n\nSee [frontmatter-templates.md](../../../sk-create-frontmatter/assets/frontmatter-templates.md) for field rules.`

### .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-router-template.md
- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-router-template.md:37 | 5 | The rule that decides whether the map is named `INTENT_SIGNALS` or `INTENT_MODEL`, and when a map may be omitted, comes after the two TODO instructions (lines 33 and 35) that tell the author to write the map. | Move lines 37-40 to immediately after line 31 (`## 2. INTENT MODEL`), before line 33.

### .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-scaffold-template.md
- clean

### .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md
- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md:26 | 7 | The Usage paragraph is a single block that runs six separate instructions together: copy the patterns, keep the router rule, own one file per folder, adapt the key, preserve the maps, apply the safeguards, audit the draft. | Replace line 26 with a lead sentence plus six bullets: "Copy the four pseudocode patterns from §2 into the `## MACHINE ROUTER` section of your skill's sibling `ROUTER.md`." then bullets for "That file is the router: ...", "Every skill and every mode packet owns one such file ...", "Adapt the routing key ... per §3 Generalization Guide.", "Preserve your skill's domain-specific `INTENT_MODEL`, `RESOURCE_MAP`, and load levels ...", "Apply the structural safeguards from §4 ...", "Audit your draft against §5 Anti-Patterns before merging." This adds six lines above the `§8` citation now on line 166, whose text and section stay unchanged and whose line callout is rechecked at commit.

### .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-sync-manifest-template.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-sync-manifest-template.md:28 | 7 | The Usage paragraph packs five separate authoring actions into one sentence. | Replace line 28 with:
  ```
  Copy the fillable scaffold in Section 2 into `<runtime-dir>/SYNC.md`, then:

  - Replace every placeholder with facts verified against the actual tree.
  - Remove unused scaffolding.
  - Preserve the nine-section order.
  - Cross-link the new manifest from every sibling runtime's RELATED DOCUMENTS row.
  ```

### .skilled/skills/sk-doc/sk-create-skill/references/README.md

- [P1] .skilled/skills/sk-doc/sk-create-skill/references/README.md:41 | 8 | The index omits two references in the directory it indexes: `shared/advisor-index-handoff.md` and `skill/upgrading-a-skill-to-v4.md`. Neither appears in the REFERENCE MAP or in the Section 3 list. | Insert after line 48: `| **Advisor index handoff**: the shared field vocabulary that create and doctor render after scaffolding or diagnosing a skill root, covering metadata ownership, refresh ownership, the verification-state enum, and branch scope | [advisor-index-handoff.md](shared/advisor-index-handoff.md) | Wiring a create or doctor completion report, or aligning its vocabulary with doctor |`. Insert after line 47: `| **Upgrading a customized skill to v4**: whether a customized \`sk-code\` or \`sk-git\` becomes a parent hub or stays a single skill | [upgrading-a-skill-to-v4.md](skill/upgrading-a-skill-to-v4.md) | Reconciling a customized skill with the v4 parent-hub shape, or keeping it single |`. Add `- [advisor-index-handoff.md](shared/advisor-index-handoff.md) - Shared create/doctor vocabulary for advisor metadata, refresh ownership and verification states` after line 62, and `- [upgrading-a-skill-to-v4.md](skill/upgrading-a-skill-to-v4.md) - Adopter guide for reconciling a customized skill with the v4 parent-hub shape` after line 63.
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/README.md:46 | 1 | The row says `eight recurring defects` and lists eight, but `common-pitfalls.md` has nine: it adds the router placed in `SKILL.md` rather than a sibling `ROUTER.md`. | Replace line 46 with: `| **Common pitfalls**: nine recurring defects (generic/bloated description, oversized SKILL.md, missing resources, unclear triggers, second-person voice, platform assumptions, multiline YAML, misplaced references, and a router in the wrong place) | [common-pitfalls.md](shared/common-pitfalls.md) | A skill does not trigger, bloats context, or fails budget checks; reviewing fresh authored skills |`

### .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md

- [P1] .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md:36 | 1 | The section says the router serves exactly five hubs and the table lists five, but `HUB_CHILD` in `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:30` and `DEFAULT_ON_HUBS` in `resolve.cjs:37` each list seven: `cli-classifier` and `sk-design` are missing. `references/README.md:51` already says seven. | Replace `exactly **five parent hubs**` with `exactly **seven parent hubs**`; insert `| \`cli-classifier\` | \`009-parent-hub-rollout/008-cli-classifier\` |` after the `cli-external-orchestration` row and `| \`sk-design\` | \`009-parent-hub-rollout/009-sk-design\` |` after the `sk-doc` row; replace `the five proven hubs` (line 26) with `the seven proven hubs`, `the five hubs` (line 72) with `the seven hubs`, `a sixth hub` (line 87) with `another hub`, and `the five admitted hubs` (line 105) with `the seven admitted hubs`.
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md:57 | 1 | The compiler line-count range is stale: `cli-external-orchestration` is now 384 lines and `system-deep-loop` 682, not 351 and 698. | Replace `range from 351 (\`cli-external-orchestration\`) to 698 (\`system-deep-loop\`)` with `range from 384 (\`cli-external-orchestration\`) to 682 (\`system-deep-loop\`)`.
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md:17 | 3 | The intro's final sentence is a pointer sentence: `This reference explains what the router actually serves, ...`. | Delete that sentence from `This reference explains` through `working compiled route.` The two remaining sentences still state the router and its cohort, and the `ready` boundary claim survives at lines 106 and 109.

### .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:38 | 1 | The text says `hub-router.json` has four top-level fields, but the JSON block at 40-47 and the five-row table at 50-56 both list five. | Replace `has four top-level fields` with `has five top-level fields`.
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:298 | 1 | The table header says `Problem if omitted`, but every cell below states what the qualified path buys, not what fails when it is omitted. | Replace the header cell `Problem if omitted` with `Why it works`.
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:339 | 7 | The check-12 paragraph packs six rules into one block: gate scope, standalone `router_state`, three standalone-only patterns, and the `ROOT_RESOURCES` rule. | Replace line 339 with:
  ```markdown
  `parent-skill-check` check 12 is the enforcement point for the `ROUTER.md` contract: the shared `root-router-contract.cjs` library validates the state declaration, stage-two map shape, the root `SKILL.md` pointer, legacy coexistence, and typed leaf membership, and every failure reports a stable RRC code. The gate runs for a hub root, a standalone skill root and every mode packet a hub declares, and its messages name the skill it checked.

  A standalone skill or a packet declares `router_state: active`, because `stage1-only` is a hub state with no mode registry to stage against, and it is held to the maps it declares rather than to the hub's pair.

  Three deliberate patterns are open to it and closed to a hub:

  - It may name its intent map `INTENT_MODEL`, or declare both intent names, in which case the two must mirror each other in keys and keywords.
  - It may route by pseudocode alone with no map at all, which suits a skill that loads its whole reference set on any match.
  - Its `RESOURCE_MAP` may omit a key, or map it to an empty list, only when `NO_LOAD_INTENTS` names that key.

  A markdown file at the router's own root, which no leaf manifest lists, is routable when `ROOT_RESOURCES` declares it and a `RESOURCE_MAP` entry references it, because such a file must exist in the router's own folder. [skill-router-template.md](../../assets/skill/skill-router-template.md) is the authored form of this paragraph.
  ```

### .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:95 | 1 | The table says `sk-design` uses `proceduresPath`, but no mode in `sk-design/mode-registry.json` declares it; the hub keeps its card at `sk-design-md-generator/procedures/design-system-extraction.md` without the field. | Replace the `Hubs that use it` cell `sk-design` with `None declared (sk-design keeps its card under \`sk-design-md-generator/procedures/\`)`.
- [P1] .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:198 | 1 | The `sk-design` row says the hub declares transform-verb semantics and calls it the `Transform-verbs example`, but `sk-design/mode-registry.json` has no `extensions` and no `transform` entries at all. The row's snapshot caveat covers mode names, not extensions. | Replace the Transform verbs cell `Declares transform-verb semantics: phrasing decides whether a mode applies a visual move or audits whether it should happen.` with `None.`, and the Notes cell `Transform-verbs example.` with `No-extension workflow-only example.`
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:198 | 9 | The Deprecated modes cell names packet `016`, an ephemeral packet number the reader cannot resolve. | Replace `None; what \`016\` retired stays retired.` with `None; the retired design modes stay retired.`

### .skilled/skills/sk-doc/sk-create-skill/references/shared/advisor-index-handoff.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/advisor-index-handoff.md:23 | 4 | The overview opens with `**Core Principle**` and puts `**When to Use**` second, while the reference template puts When to Use before Core Principle. | Move lines 23-24 to immediately after line 29, before the blockquote at line 30. The overview then opens with When to Use and the core principle follows it; the line count is unchanged, so the §3 citation at line 101 stays on line 101.
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/advisor-index-handoff.md:27 | 1 | The branch-scope pointer says `(§4)`, but §4 is the verification-state vocabulary; branch scope is §6, `BRANCH SCOPE — WHO RENDERS WHAT`. | Replace `(§4)` with `(§6)`.

### .skilled/skills/sk-doc/sk-create-skill/references/shared/common-pitfalls.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/common-pitfalls.md:25 | 4 | The overview places `**Core Principle**` before `**When to Use**`, while the reference template puts When to Use before Core Principle. | Move lines 25-26 to immediately after line 32, before the note blockquote at line 33; the overview then reads purpose paragraph, `**When to Use**`, `**Core Principle**`.

### .skilled/skills/sk-doc/sk-create-skill/references/shared/overview.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/overview.md:103 | 6 | `**Recommended Sections**` (6-8) sits under `### README.md Guidance`, after the README boundaries, although it continues the SKILL.md required-section list (1-5). A reader can misread 6-8 as README sections. | Move lines 103-107 to immediately after line 88, before `### README.md Guidance` at line 89; the list then continues the SKILL.md numbering and the README subsection follows it.

### .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:24 | 4 | The overview puts `**Core Principle**` (24-25) before `**When to Use**` (26-30), while the reference template and its skeleton order Purpose, When to Use, Core Principle. | Swap the two blocks: move lines 26-30 to where line 24 sits and lines 24-25 to where line 26 sat, so the overview reads purpose paragraph, When to Use, Core Principle, then the note at line 31. Both blocks move whole, so line 31 onward, including the citation target at line 101, keeps its number.
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:81 | 9 | The body carries a spec packet path with phase and packet numbers: `sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification`. | Replace `and the standard was set in \`sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification\`.` with `and the metadata JSON unification change set that standard.`
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:137 | 7 | The `quality` block bullet packs nine separate validation rules (key set, row shape, `file` path rule, selector set, per-selector array rule, dot rule, key refusal, finding code, `surface_detection` dependency) into one block. | Replace line 137 with:
  ```markdown
  - **Optional quality block.** `graph-metadata.json` may carry a `quality` object naming the checklists the skill's surface applies. It holds one key, `checklists`, a non-empty array of rows. Each row:
    - names its checklist file in `file`, a relative `.md` path inside the skill root
    - scopes it with at least one selector: `paths`, `extensions` or `contentMarkers`. Every selector present must be a non-empty array of non-blank strings, and an `extensions` entry must start with a dot.
    - carries checklists only, because commands come from the repository's quality config and never from a skill, so any other key at block or row level is refused, `argv`, `command` and `run` included
  - Every broken rule reports one finding under the quality code in the table below, since the quality runner reads these rows for the files that resolve to the skill's surface, and a block the gate let through would otherwise cover no file, or the wrong one, without a word.
  - A block contributes nothing unless the same file also declares a `surface_detection`, because that surface is what resolves a file to these rows.
  ```
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:138 | 7 | The signal-provenance bullet packs six interlocking rules about two lists and their interaction into one block. | Replace line 138 with:
  ```markdown
  - **Optional signal-provenance lists.** `graph-metadata.json` may carry `intent_signals_generated` and `intent_signals_keep`, each an array of non-blank strings.
    - `generate-router-intent-signals.cjs --write` appends every phrase it adds to `intent_signals_generated`, so an entry there that no router declares any more is an orphan: `--check` reports and counts it, and `--write` removes it from both arrays while keeping the order of what stays.
    - A phrase named in `intent_signals_keep` is left in place, which is how a generated phrase survives a router rename.
    - An `intent_signals` entry no router declares is hand-curated: it never appears in `intent_signals_generated`, so it is never an orphan.
    - A phrase a router does declare is recorded on the hub's first `--write`, so a later router rename prunes it unless `intent_signals_keep` pins it.
    - A present list that holds anything but non-blank strings reports one `GRAPH_METADATA_INVALID_SIGNAL_LIST` finding.
  ```
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:175 | 1 | The scaffold location `create-skill/assets/` names no directory in the repo; the skill root is `sk-create-skill`, and the templates live under `sk-create-skill/assets/`. | Replace `` `create-skill/assets/` `` with `` `sk-create-skill/assets/` ``.
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:167 | 1 | The new-hub instruction places the root `ROUTER.md` "outside the JSON matrix below", but the matrix is Section 3, above this section. | Replace `outside the JSON matrix below` with `outside the JSON matrix above`.

### .skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md:25 | 4 | The overview puts `**Core Principle**` (25-26) before `**When to Use**` (27-31), against the template order Purpose, When to Use, Core Principle. | Swap the two blocks: move lines 27-31 above line 25 and lines 25-26 below line 31, so line 32 onward keeps its number.
- [P1] .skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md:33 | 1 | The commands and source labels mix bases, and two of them name files absent from the skill's `scripts/` directory: `quick_validate.py` and `extract_structure.py` live under `sk-doc/shared/scripts/`, so the label at line 34 and the command at line 132 fail as written, while line 93 already uses a repository-root path. | Replace the token `scripts/quick_validate.py` (line 33) with `.skilled/skills/sk-doc/shared/scripts/quick_validate.py`; `scripts/extract_structure.py` (lines 34 and 132) with `.skilled/skills/sk-doc/shared/scripts/extract_structure.py`; `scripts/validate_skill_package.py` (lines 35 and 47) with `.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py`; `scripts/package_skill.py` (lines 36, 55 and 144) with `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`.
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md:52 | 2 | The Package Check section repeats the Completion Gate's Purpose verbatim (`Authoritative pre-completion gate. Run before claiming a skill is done.`), so two different gates claim the same authority. | Replace line 52 with `**Purpose**: The package validator the completion gate delegates to. Run it directly when you want the package checks without the standalone-versus-parent classification.`
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md:82 | 7 | One paragraph carries the block definition, the five markers, the fence-closing rule, the section definition, the heading-alone rule and the stray-block rule. | Replace line 82 with:
  ```markdown
  A machine router **block** is a fenced block, or an unfenced run of lines such as an indented one, that holds one of these markers:
  - `INTENT_SIGNALS =`
  - `RESOURCE_MAP =`
  - `UNKNOWN_FALLBACK_CHECKLIST =`
  - `def discover_markdown_resources`
  - `def _guard_in_skill`

  A fence closes only on a run of the same character at least as long as the one that opened it. A `MACHINE ROUTER` **section** is an H2 heading that matches `## [N. ]MACHINE ROUTER` outside a fence. The heading alone is the finding, with or without a block below it, so a skill that kept only the prose still fails RS-002. A router block with no section around it reports the same code, because it declares routing in the same file.
  ```
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md:84 | 7 | The known-debt paragraph packs eight rules about the debt file into one block. | Replace line 84 with:
  ```markdown
  `--strict` promotes all five to errors. Known debt lives in `.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json`, keyed by the skill's path relative to `.skilled/skills` (for example `sk-code/sk-code-review`).
  - A folder outside that root is never debt.
  - Each entry records `{"lines", "words", "machineBlocks", "codes"}`, and `machineBlocks` counts the RS-002 findings the entry tolerates, one per leftover section or stray block.
  - A listed skill fails when its line count, word count or number of RS-002 findings grows past the record, or when it shows a code the entry does not record.
  - An entry in any other form is ignored.
  - Remove the entry once the skill is migrated.
  - `/create:skill-parent` applies the same rule as `parent-skill-check.cjs` check `12b-routing-shape`.
  ```

### .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md:25 | 4 | The overview puts `**Core Principle**` (25-26) before `**When to Use**` (27-31), against the template order Purpose, When to Use, Core Principle. | Swap the two blocks: move lines 27-31 above line 25 and lines 25-26 below line 31. The swap is line-count neutral, so the `creation-workflow.md:261` callout in `skill-smart-router.md` stays on line 261.
- [P1] .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md:122 | 1 | The doc says `--path` is optional and defaults to the current directory, but `init_skill.py` declares `--path` with `required=True`, so the command exits with an argument error when it is omitted. | Replace line 122 with `**Required flag**: \`--path\` names the parent directory the skill folder is created under. The script exits with an error when it is omitted.`
- [P1] .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md:126 | 1 | Step 3 describes a scaffold the script no longer produces: `init_skill.py` creates no `scripts/`, `references/` or `assets/` example directories and no example files, and it does write `manual-testing-playbook/`, `benchmark/reports/`, `graph-metadata.json` and `leaf-manifest.config.json`, then runs the class gate for the manifest and alias files. | Replace lines 126-128 with `2. Generates SKILL.md template with proper frontmatter and TODO placeholders` / `3. Scaffolds \`manual-testing-playbook/\` and \`benchmark/reports/\` with their indexes` / `4. Writes \`graph-metadata.json\` and \`leaf-manifest.config.json\`, then runs the class gate to generate \`leaf-manifest.json\` and \`leaf-aliases.json\``; replace lines 145-147 with `# ├── graph-metadata.json and leaf-manifest.config.json` / `# ├── leaf-manifest.json and leaf-aliases.json (generated by the class gate)` / `# └── benchmark/reports/ and manual-testing-playbook/ (with their indexes)`. Both edits are line-count neutral.
- [P1] .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md:139 | 1 | The example passes `--path .skilled/skill`, which would create `.skilled/skill/markdown-optimizer/`, while the comment below it promises `.skilled/skills/markdown-optimizer/`. | Replace `--path .skilled/skill` with `--path .skilled/skills`.

### .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md:25 | 4 | The overview puts `**Core Principle**` (25-26) before `**When to Use**` (27-31), against the template order Purpose, When to Use, Core Principle. | Swap the two blocks: move lines 27-31 above line 25 and lines 25-26 below line 31, so line 32 onward keeps its number.
- [P1] .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md:47 | 1 | All four example trees show a skill root with no `ROUTER.md`, although `init_skill.py` writes one and strict package validation fails RS-004 on a root without a sibling router, so a layout copied from these examples fails the gate. | Insert `├── ROUTER.md` immediately after each tree's `├── SKILL.md` row, in the four Directory Structure blocks at lines 47, 75, 103 and 126.
- [P1] .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md:146 | 1 | The `sk-design` precedent is stale twice: its `mode-registry.json` declares four workflow modes and no transport packet, not "two workflow modes and one transport packet", and `sk-design/shared/procedure-card-schema.md` does not exist (that folder holds only `scripts/`); the cards live under `sk-design-md-generator/procedures/`. | Replace line 146 with `**Real-world precedent**: \`sk-design\` is an illustrative hub-scale example. Its current registry has four workflow modes and no transport packet; consult \`sk-design/mode-registry.json\` before copying its procedure-card topology. \`sk-design/sk-design-md-generator/procedures/\` holds the card layout this template generalizes from.`
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md:181 | 7 | One paragraph carries four mechanisms: what `/create:changelog` does, the carrier list, the README and hub-router exceptions, and the hub confirmation command. | Replace line 181 with:
  ```markdown
  Bump with `/create:changelog`. It writes the changelog entry and sets the new version in every carrier the skill root already has:
  - SKILL.md
  - for a hub, description.json, hub-router.json and mode-registry.json

  README.md and a hub ROUTER.md keep their own document versions. For a hub, `node .skilled/commands/doctor/scripts/parent-skill-check.cjs <hub-root>` then confirms every copy matches.
  ```

### .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md:25 | 4 | The overview puts `**Core Principle**` (25-26) between the purpose paragraph and `**When to Use**` (27-32), while the template order is Purpose, When to Use, Core Principle. | Swap the two blocks: move lines 27-32 above line 25 and lines 25-26 below line 32. The swap is line-count neutral, so the `upgrading-a-skill-to-v4.md:65` callout in `parent-skills-nested-packets.md` stays on line 65.
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md:98 | 7 | The section-opening paragraph packs five mechanisms: existing tooling only, the scaffold, the no-overwrite guard, the missing `--convert` flag and why, and the single-skill alternative with its refusal rule. | Replace line 98 with:
  ```markdown
  Use existing tooling only.
  - `/create:skill-parent` is the scaffold.
  - `create` will not write on top of an occupied folder (`requires_existing_skill: false`).
  - There is no in-place `--convert` flag here, because converting a skill into a hub is a scaffold-then-move, not an edit.
  - A single skill does convert through `/doctor:sk-skill convert`, in place when it is an older Skilled skill and as a staged new root when it is a plain one, and that command refuses a hub candidate so a skill that really holds two jobs lands here.
  ```
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md:202 | 7 | The convert-in-place paragraph packs ten mechanisms into one block: the run condition, the command, the plan-and-yes behaviour, the version bump, the approved `allowed-tools` list, the verbatim router move, the Smart Routing link, the eight-phrase staging proof, the body-line proof and the restore-on-diff rule. | Replace line 202 with:
  ```markdown
  **Convert a single skill in place.** When the skill has one job and is still in a plain shape, or its machine router still sits inside `SKILL.md`, run `/doctor:sk-skill convert <name-or-path>`. It prints the plan first and writes only after your yes.
  - It adds the four-part `version`.
  - It writes an `allowed-tools` list only after you approve the list its plan proposes.
  - It moves the machine router section verbatim into the sibling `ROUTER.md` and links to it from Smart Routing.
  - It stages a plain skill under its own name as a new root once you approve at least eight intent phrases, and the workflow proves the reshaped prose kept every original body line.
  - It stops and restores the pre-edit bytes when the parsed router would come out different.

  Run `/doctor:sk-skill check <name-or-path>` first if you want the gap row by row without any write.
  ```

