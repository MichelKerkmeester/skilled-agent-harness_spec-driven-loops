VERDICT: FIX

- [P1] .skilled/skills/sk-doc/sk-create-skill/ROUTER.md:16 | 3 | The replacement hook drops both claims the old intro made (SKILL.md keeps the short routing prose and the link here; this file holds the declaration a reader parses to decide what loads) and adds a new “instead of the whole folder” claim, so it fails the keep-every-claim rule and departs from the router template’s own intro. | Restore the HEAD text verbatim:
  ```markdown
  The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
  link that points here; this file holds the declaration a reader parses to decide what loads.
  ```

- [P1] .skilled/skills/sk-doc/sk-create-skill/SKILL.md:102 | 8 | The Required Standalone Skill Shape still omits `ROUTER.md`, although `init_skill.py` writes it and strict package validation requires a sibling router. | Insert after line 102:
  ```text
  ├── ROUTER.md                      # sibling machine router
  ```

- [P2] .skilled/skills/sk-doc/sk-create-skill/SKILL.md:202 | 8 | The Parent Hub Shape still omits the hub `README.md`, although `init_skill.py` writes one and the hub README template says every hub has one. | Insert after line 202:
  ```text
  ├── README.md
  ```

- [P1] .skilled/skills/sk-doc/sk-create-skill/SKILL.md:219 | 8 | The two packet branches of the Parent Hub Shape still omit each packet’s own `ROUTER.md`, so a hand-built packet fails the strict sibling-router check. | Insert after line 219:
  ```text
  │   ├── ROUTER.md
  ```
  and after line 224:
  ```text
      ├── ROUTER.md
  ```

- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:209 | 8 | The Layout table still omits the hub `README.md` and both packet `ROUTER.md` files, so it contradicts the required-companion table and the checklist. | Insert these rows immediately after the named rows:
  ```markdown
  | `[parent-skill-name]/README.md` | Hub overview |
  | `[parent-skill-name]/[workflow-packet-a]/ROUTER.md` | Workflow packet router |
  | `[parent-skill-name]/[surface-name]/ROUTER.md` | Surface packet router |
  ```
  Place the first after line 209, the second after line 220 and the third after line 223.

- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:233 | 7 | The `ROUTER.md` bullet still packs the stage-two role, both router states, the promotion rule and the machine-router contents into one block. | Replace line 233 with:
  ```markdown
  - `ROUTER.md` is the stage-two control document.
  - `router_state: active` declares non-empty equal-key `INTENT_SIGNALS`/`RESOURCE_MAP`.
  - `router_state: stage1-only` keeps all stage-two collections empty and delegates to stage one.
  - Promote to `active` only after authoring concrete, resolvable leaf paths, never placeholder intents.
  - Its final `## MACHINE ROUTER` section holds the compiled-routing directive and the fallback checklist, so the hub `SKILL.md` never repeats them.
  ```

- [P2] .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:245 | 1 | Optional Extensions still omits `transport-axis`, although the model table says transport packets are declared through it. | Insert after line 245:
  ```markdown
  - `transport-axis`: declares that the hub includes `packetKind: "transport"` packets.
  ```

- [P1] .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md:232 | 1 | The verification commands still assume the hub root for `README.md`, so the validator cannot find the hub README and the HVR grep checks the wrong file. | Replace line 232 with:
  ```bash
  python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/[hub-name]/README.md --type readme
  ```
  and line 240 with:
  ```bash
  ! rg -n '\x{2014}|\x{3B}' .skilled/skills/[hub-name]/README.md
  ```

- [P1] .skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md:47 | 1 | The command examples still use skill-relative script paths, so they fail from the repository root and contradict the repository-root Key Sources above. | Replace line 47 with:
  ```bash
  .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py <path/to/skill>
  ```
  line 55 with:
  ```bash
  .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py <path/to/skill> --check
  ```
  line 145 with:
  ```bash
  .skilled/skills/sk-doc/shared/scripts/extract_structure.py .skilled/skills/my-skill/SKILL.md
  ```
  and line 157 with:
  ```bash
  .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py <path/to/skill> <output-directory>
  ```

- [P1] .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md:145 | 1 | The example tree still shows `scripts/`, `references/` and `assets/` example files that `init_skill.py` no longer creates, contradicting the revised Script Actions immediately above it. | Replace lines 145-147 with:
  ```text
  # ├── graph-metadata.json and leaf-manifest.config.json
  # ├── leaf-manifest.json and leaf-aliases.json (generated by the class gate)
  # └── benchmark/reports/ and manual-testing-playbook/ (with their indexes)
  ```

- [P1] .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md:139 | 1 | The example passes `--path .skilled/skill`, which creates `.skilled/skill/markdown-optimizer/`, while the comment below promises `.skilled/skills/markdown-optimizer/`. | Replace `--path .skilled/skill` with `--path .skilled/skills`.

- [P1] .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md:47 | 8 | All four example trees still show a skill root with no `ROUTER.md`, although `init_skill.py` writes one and strict package validation fails RS-004 on a root without a sibling router. | Insert `├── ROUTER.md` immediately after each tree’s `├── SKILL.md` row at lines 47, 75, 103 and 126.

- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:81 | 1 | The spec-path removal left a verbless clause: “the metadata JSON unification change set that standard.” | Replace `and the metadata JSON unification change set that standard.` with:
  ```markdown
  and the metadata JSON unification change set established that standard.
  ```
