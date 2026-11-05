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
