# sk-create-changelog changelog digest

Skill path: `.opencode/skills/sk-doc/sk-create-changelog/`
Versions covered: v1.0.0.0 through v1.0.1.2 (all five entries in the mode's `changelog/` folder, fewer than ten exist)
Date range: none. No entry carries a date in its frontmatter or body.

---

## Per version, newest first

### v1.0.1.2

`v1.0.1.2.md` is a README conformance release from the skill-readme refinement packet. The `README.md` was rewritten from a nine-section reference-card deck into a purpose-first narrative on the refined template: a one-line pitch blockquote, an AT A GLANCE table, a problem-first OVERVIEW carrying a Release Record capability layer, then QUICK START, HOW IT WORKS, TROUBLESHOOTING, FAQ, VERIFICATION and RELATED DOCUMENTS. The README version field jumped from `1.0.0.0` to `1.0.1.2` because it had lagged the release track through v1.0.1.1, and the release lands it on a fresh entry above the track head. The prose was cleaned against the Human Voice Rules to zero em dashes, zero semicolons and zero Oxford commas, including removing an Oxford comma from the README frontmatter description. The entry states explicitly that `SKILL.md` stayed at `1.0.1.1`, that no runtime instruction, reference file or command asset moved and that entries v1.0.0.0 through v1.0.1.1 stayed byte-identical. This entry is also the first in the folder to use the richer frontmatter shape with `description`, `trigger_phrases`, `importance_tier` and `contextType`.

### v1.0.1.1

`v1.0.1.1.md` is a one-line stub. It records that source-topology routing resilience was documented, along with the packet's intentional use of flat resources rather than keyed runtime discovery. The entry carries no What Changed, Files Changed or Upgrade sections, so it gives no file-level evidence for either claim.

### v1.0.1.0

`v1.0.1.0.md` is a structural normalization of `SKILL.md` against the canonical section contract shared across the `sk-doc` workflow packets. RENAME: the merged opening heading `WHEN TO USE + SMART_ROUTING` was split into a standalone `WHEN TO USE` section and a standalone `SMART ROUTING` section, because the underscore in the routing token stopped the shared section contract from matching a smart-routing section. The references list was promoted from a subsection of the rules to its own top-level section, an explicit output-mode routing summary was added pointing at the detailed workflow sections and all second-level headings were renumbered contiguously. The entry states no change to inputs, workflow steps or output behavior, and no migration.

### v1.0.0.1

`v1.0.0.1.md` describes the same structural conformance fix as v1.0.1.0 in nearly identical terms: splitting the merged `WHEN TO USE` and `SMART ROUTING` heading whose underscore hid the routing section from the automated section matcher, promoting the reference route-map from a subsection under `RULES` to a top-level `REFERENCES` section and renumbering H2 headings from one. The entry states no workflow behavior changes and no migration. The two entries describe overlapping work at two different points on the version track, which is worth noting when reading the history.

### v1.0.0.0

`v1.0.0.0.md` is the initial release, produced under spec folder `.opencode/specs/skilled-agent-orchestration/125-sk-doc-parent` at Level 3. It introduces the packet as one of what it then called the ten workflow packets in the `sk-doc` parent hub's workflow-only architecture. The packet turns a spec folder, a component hint or recent git history into either a global component changelog at `.opencode/changelog/{component}/v{VERSION}.md` using four-part semantic versioning, or a packet-local nested changelog written through the spec-kit nested generator. It ships an inline seven-step `SKILL.md` workflow (analyze context, resolve output target, determine version, generate content, validate, write, report), topology detection between global and packet-local output, dynamic component discovery under `.opencode/changelog/`, auto/major/minor/patch/build bump detection and compact versus expanded format selection. The release shipped `SKILL.md`, `README.md` and `references/changelog_creation.md`. The entry states explicitly that no `assets/` or `scripts/` ship in the packet and that it reuses the shared template at `../shared/assets/changelog-template.md` and the shared validators under `../shared/scripts/`.

---

## Facts the v4 draft gets wrong or misses

- RENAME: every one of the five entries writes the packet path as `.opencode/skills/sk-doc/create-changelog/` (see the Files Changed tables in `v1.0.0.0.md`, `v1.0.0.1.md` and `v1.0.1.0.md`). The packet now lives at `.opencode/skills/sk-doc/sk-create-changelog/` and its `SKILL.md` `name` field is `sk-create-changelog`. That directory-level `create-*` to `sk-create-*` rename is recorded in no entry, and the draft at line 136 covers only the four `/create` command renames plus the `@create` to `@markdown` agent rename. The packet-directory rename is missing from both records.
- MOVED PATH: `v1.0.0.0.md` states that no `assets/` ship in the packet and that it reuses `../shared/assets/changelog-template.md`. The current `SKILL.md` points at `assets/changelog-template.md` and that local file exists, while `sk-doc/shared/assets/` holds no changelog template. No later entry records the move, and `v1.0.1.2.md` explicitly claims no command asset moved in that release. The draft does not mention the packet's template location at all.
- REMOVED: `v1.0.0.0.md` ships `references/changelog_creation.md` as the supplementary creation reference. That file no longer exists. The current `references/` folder holds `README.md`, `topology-edge-cases.md`, `version-bump-rules.md` and `worked-examples.md`. No entry records the removal or the split, and `v1.0.1.2.md` states no reference file moved in that release.
- The draft never states where a global changelog is written or how it is versioned. `v1.0.0.0.md` is specific: `.opencode/changelog/{component}/v{VERSION}.md` with four-part semantic versioning and auto/major/minor/patch/build bump detection. That directory exists and holds per-component folders, so it is a live user-facing convention the draft omits.
- The draft's line 132 mention of `sk-create-changelog` is only a name in a list of fourteen packets. `v1.0.0.0.md` records the packet's dual output topology, global versus packet-local nested, which is the one behavior a reader needs in order to use it. The draft carries no description of the mode's job beyond the name.
- `v1.0.0.0.md` calls the hub ten workflow packets. The draft line 132 says fourteen. This is history moving, not a draft error. I checked `mode-registry.json` and it declares fourteen real `workflowMode` values, so the draft count is correct.
- `v1.0.1.1.md` is a stub with no Files Changed table, so its two claims about topology routing resilience and flat resources cannot be verified from the entry itself. Flagging it as a weak link in the record rather than as a draft error.

## Current version and identity

The `SKILL.md` frontmatter declares `version: 1.0.1.2`, matching the newest changelog entry. Its `name` is `sk-create-changelog` and its `allowed-tools` are `[Read, Write, Edit, Bash, Grep, Glob]`.

Identity: this is a MODE, not a hub and not standalone. The skill root holds no `mode-registry.json`, no `hub-router.json`, no `graph-metadata.json` and no `description.json`. Its parent `.opencode/skills/sk-doc/` holds all four, and `sk-doc/mode-registry.json` lists `"workflowMode": "sk-create-changelog"` at line 324 with `"packet": "sk-create-changelog"` and `"packetSkillName": "sk-create-changelog"` at lines 342 and 343. So `sk-doc` is the hub and this packet is one of its fourteen routed workflow modes.
