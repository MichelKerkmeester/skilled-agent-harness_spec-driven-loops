# sk-create-agent changelog digest

Skill path: `.opencode/skills/sk-doc/sk-create-agent/` (nested mode of the `sk-doc` parent hub). Versions covered: v1.0.0.0 through v1.0.1.2, the full set of released entries. Only four entries exist, so all four are digested here. Date range: none. No entry carries a date field in frontmatter or body.

---

## Per version, newest first

### v1.0.1.2 (`v1.0.1.2.md`)

A README conformance pass from the skill-readme refinement packet, with no change to the authoring workflow itself. It adds an Agent File Capability Layer table to the README OVERVIEW that names what the skill operates on at file level per runtime surface, covering the OpenCode `permission:` schema and the Claude Code `tools:` allow-list plus the update pass. It moves the README version field from `1.0.0.0` to `1.0.1.2` because that field had lagged the release track through v1.0.1.1, clears Human Voice Rule violations in the README body (em dashes, semicolons, Oxford commas, banned words) and removes an Oxford comma from the README frontmatter description. The entry states explicitly that `SKILL.md` stays at `1.0.1.1`, that entries v1.0.0.0 through v1.0.1.1 stay byte-identical and that no runtime instruction, reference file or command asset moved.

### v1.0.1.1 (`v1.0.1.1.md`)

A documentation release covering two things. First, it documents the component-choice routing path so an ambiguous request resolves to a clear owner instead of defaulting to an agent, with the distinguishing signals, the lighter-alternative cues and the decision rule living in `references/agent-vs-skill-vs-command.md`, loaded when a request could plausibly be a skill or a command or mixes responsibilities. Second, it records the packet's deliberate choice of flat `references/` and `assets/` folders rather than keyed `references/<key>/` subdirectories, on the grounds that the resource set is small enough that the flat route map in `references/README.md` reads more clearly than keyed runtime discovery.

### v1.0.1.0 (`v1.0.1.0.md`)

A structural conformance pass on `SKILL.md` with no change to workflow guidance. RENAME: the merged `WHEN TO USE + SMART_ROUTING` heading was split into two discrete H2 sections, `## 1. WHEN TO USE` and `## 2. SMART ROUTING`, because the underscore in the old combined heading meant automated section matching never saw a `SMART ROUTING` heading and reported the required section as missing. Routing-away guidance and the agent-versus-alternative decision rule moved under the new SMART ROUTING section while the applicability list stayed under WHEN TO USE. A `Keyword triggers:` line was added to WHEN TO USE. The former `OVERFLOW REFERENCES` subsection was promoted out of `RULES` into a top-level `## 6. REFERENCES` H2 with every link preserved. A `## 5. SUCCESS CRITERIA` H2 was added summarizing the delivery bar. All H2 headings were renumbered contiguously from 1 to 6, and the entry notes no numeric intra-file cross-references existed so nothing else shifted.

### v1.0.0.0 (`v1.0.0.0.md`)

Initial release of the `create-agent` packet, described there as one of the ten workflow packets in the `sk-doc` parent hub. It scaffolds or updates a single runtime agent markdown file: decide whether the request needs an agent rather than a skill or a command, resolve the active runtime agent directory, author frontmatter with the unified `permission:` object and an authority boundary, write the required workflow and verification sections, then validate before delivery. The shipped package is `SKILL.md` as the primary contract (runtime directory table for `.opencode/agents/` versus `.claude/agents/`, canonical frontmatter shape with `task` gating for orchestration authority, required body shape, the ordered 14-step creation workflow and the validation gate), `references/agent_creation.md` for long-form standards, and `assets/agent-template.md` as the canonical scaffold. The entry records that the packet holds no packet-local `graph-metadata.json`, that the single advisor identity and workflow registry live at the `sk-doc` hub root, and that no `scripts/` folder is present because validation reuses the shared sk-doc validators `validate_document.py` and `extract_structure.py` under `../shared/scripts/`.

---

## Facts the v4 draft gets wrong or misses

- Packet count drift, not a draft error. `v1.0.0.0.md` calls create-agent one of the **ten** workflow packets in `sk-doc`, while the draft at line 132 says fourteen nested `sk-create-*` workflow packets with twelve bound to a `/create:*` command. The draft matches the current `mode-registry.json` (14 modes, 12 with a command), so the changelog figure is the dated one. Worth flagging only so nobody reconciles the draft down to ten.
- The draft's line 132 packet list names `sk-create-agent` but never says what the mode does. Nothing in the draft states the runtime placement decision (`.opencode/agents/` versus `.claude/agents/`), the OpenCode `permission:` object versus the Claude Code `tools:` allow-list split, or the authority boundary requirement, all of which are the substance of `v1.0.0.0.md` and the capability table added in `v1.0.1.2.md`.
- The draft misses the agent-versus-skill-versus-command decision rule documented in `v1.0.1.1.md` and held in `references/agent-vs-skill-vs-command.md`. Given the draft frames sk-doc as the place where component shapes come from (lines 132 and 134), that routing rule is the one reader-facing behavior these entries add and it is absent.
- No BREAKING, REMOVED or moved-path claim in any of the four entries contradicts the draft. The only rename is the internal `SKILL.md` heading split in `v1.0.1.0.md`, which is below the draft's altitude.
- Internal inconsistency in the entries themselves, noted for accuracy rather than as a draft defect: `v1.0.1.2.md` says `SKILL.md` stays at `1.0.1.1` and that the README lands on `1.0.1.2`, but the working tree now has `SKILL.md` at `1.0.1.2` and `README.md` at `1.0.0.13`. Both files moved after the entry was written and no changelog entry covers those moves.

---

## Current version and identity

- `SKILL.md` frontmatter `version: 1.0.1.2` (`.opencode/skills/sk-doc/sk-create-agent/SKILL.md` line 5). `README.md` frontmatter reads `version: 1.0.0.13`, so the two disagree.
- Identity: a **mode**, not a hub and not standalone. There is no `mode-registry.json` and no `graph-metadata.json` at `sk-create-agent/`. The parent `.opencode/skills/sk-doc/mode-registry.json` lists `workflowMode: sk-create-agent` with `packetKind: workflow`, `command: /create:agent` and `advisorRouting.routingClass: metadata`, meaning it reaches the advisor only through the hub's `graph-metadata.json`.
