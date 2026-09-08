# sk-create-frontmatter changelog digest

Skill path: `.opencode/skills/sk-doc/sk-create-frontmatter/` (mode of the `sk-doc` hub). Versions covered: v1.0.0.0 only (the changelog directory holds one entry). Date range: none, the entry carries no date in its frontmatter or body.

---

## Per version, newest first

### v1.0.0.0 (`changelog/v1.0.0.0.md`)

The frontmatter contract got an owning mode. Six sibling packets in `sk-doc` all emit frontmatter and all defer to one specification, which previously sat in the hub's shared tier with many readers and no owner. `changelog/v1.0.0.0.md` records that the specification moved into this new packet and every consumer was repointed. MOVED PATH: the eleven-section field reference, the per-class templates, the description budget and the common fixes now live at `assets/frontmatter-templates.md` inside this mode, and the 4-part `X.Y.Z.W` versioning standard (scope, format, changelog-anchored derivation, the numstat gate, the insertion rule) now lives at `references/frontmatter-versioning.md`, both out of the hub's shared tier. Neither document was split. The entry is explicit that the mode owns rules and not enforcement: `frontmatter-version.mjs`, its corpus-gate wrapper and `quick_validate.py` all stay in `shared/scripts/`, because a post-edit hook outside the hub resolves one of them by literal path. The mode was wired through both routing stages, not merely registered: a registry entry, hub vocabulary, router intents, a resource map, leaf-manifest entries and a single-route canary case the coverage guard counts, with the advisor selecting the hub for a frontmatter request at confidence 0.95 and the hub router then selecting this mode. Vocabulary was deliberately qualified so no bare "frontmatter" token was added, because `sk-create-agent` already owns "agent frontmatter" and a bare token would have turned that mode's exclusive route into a bundle. Seventeen candidate keywords were checked for substring collision against both routing surfaces first. An eleven-scenario manual testing playbook ships with the packet, passing the operator-scenario validator with zero violations and, like every other `sk-doc` mode packet, invisible to the benchmark scenario loader. No alias was added, so the hub's alias table is byte-identical to before the move. Old locations survive only in history: a released changelog entry recording where the file sat at v1.8.0.0 keeps its wording, and three dated benchmark report bundles keep theirs. Repointing also fixed a changelog-template link that pointed at a same-directory copy of the field reference that had never existed, taking hub link failures from 113 to 112.

---

## Facts the v4 draft gets wrong or misses

- The draft never mentions the frontmatter contract move out of `sk-doc`'s shared tier into an owning mode, which is the whole content of `changelog/v1.0.0.0.md`. The only two frontmatter mentions in the draft are unrelated: line 70 (trigger-phrase frontmatter feeding the trigger index) and line 463 (the spec-kit shared frontmatter parser that sk-doc imports). Neither covers the contract, the field reference, or the versioning standard.
- Draft line 132 enumerates the `sk-doc` nested packets by name (`sk-create-skill`, `sk-create-readme`, `sk-create-agent`, `sk-create-diff`, `sk-create-changelog`, `sk-create-repo-rule`, `sk-create-quality-control` "and the rest") and omits `sk-create-frontmatter`. Given the mode's own entry describes it as newly created and fully routed, the reader has no way to learn from the draft that the mode exists. The trailing "and the rest" keeps the sentence from being false, so this is a miss rather than an error.
- Draft line 132 also says "fourteen nested `sk-create-*` workflow packets ... twelve of them bound to their own `/create:*` command". Verified against `sk-doc/mode-registry.json`, there are fourteen registry entries but only thirteen distinct packet directories on disk, because `sk-create-skill` appears twice. `sk-create-frontmatter` has no entry in `command-metadata.json`, so it is correctly one of the packets outside the twelve command-bound ones. The count of fourteen is a registry-entry count presented as a packet count.
- No factual contradiction found between the draft and `changelog/v1.0.0.0.md`. Line 463's claim that sk-doc imports the spec-kit shared frontmatter parser concerns parsing code, not the contract, and does not conflict with the entry's note that the validators and versioning engine stay in `shared/scripts/`.

---

## Current version and identity

Version in `SKILL.md` frontmatter: `1.0.0.0`, matching the single changelog entry. Identity: a mode, not a hub and not standalone. The mode root carries no `mode-registry.json` and in fact no root JSON metadata at all. Its parent `.opencode/skills/sk-doc/` carries `mode-registry.json`, `hub-router.json`, `graph-metadata.json` and `description.json`, and lists `"packet": "sk-create-frontmatter"` with `"workflowMode": "sk-create-frontmatter"`, which is the hub-plus-mode shape.
