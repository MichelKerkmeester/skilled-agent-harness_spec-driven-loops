### .skilled/skills/sk-doc/sk-create-changelog/README.md
- [P2] .skilled/skills/sk-doc/sk-create-changelog/README.md:29 | 4 | OVERVIEW opens with `### Why This Skill Exists` before `### What It Does`; `skill-readme-template.md` §2 says "Inside OVERVIEW, start with `### What It Does`. Add up to two optional subsections after it." | move lines 29-31 to after line 35
- [P1] .skilled/skills/sk-doc/sk-create-changelog/README.md:127 | 2 | the pass cell says the validator checks the summary, the spec-folder blockquote, the tier sections and the upgrade guidance; `validate_document.py --type changelog` checks only the frontmatter contract and internal-id/test-count omissions, and a minimal entry with no summary and no Upgrade section returns `✅ VALID` with zero issues | replace line 127 with:
```
| Global format | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <changelog-file> --type changelog` | `✅ VALID`: the required frontmatter keys are present, at least one trigger phrase is declared and a version file names its version in a phrase. The tier sections, the spec-folder line and the upgrade guidance are checked by hand against `SKILL.md` section 9 |
```
- [P2] .skilled/skills/sk-doc/sk-create-changelog/README.md:142 | 8 | RELATED DOCUMENTS omits `ROUTER.md`, a root file of the packet it indexes; the skill-readme scaffold lists `SKILL.md` then `ROUTER.md` first | insert after line 137:
```
| [`ROUTER.md`](./ROUTER.md) | Machine router: intent map, resource map and loading levels |
```

### .skilled/skills/sk-doc/sk-create-changelog/ROUTER.md
- clean

### .skilled/skills/sk-doc/sk-create-changelog/SKILL.md
- [P1] .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:34 | 1 | the When NOT to Use list sends flowcharts to a `create-*` packet, but no `create-flowchart` packet or mode exists; the `sk-doc` hub registers no diagram packet, and diagrams belong to the `sk-design` hub | replace line 34 with:
```
2. A README (`create-readme`), agent, command, benchmark, feature catalog, manual testing playbook or skill. Each has its own `create-*` packet. A flowchart or any other diagram belongs to the `sk-design` hub (`/design:diagram`), which this hub does not register a packet for.
```
- [P2] .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:72 | 2 | the heading repeats the section name as the machine token `(HOW_IT_WORKS)`, which no other SKILL.md uses and no checker reads | replace line 72 with:
```
## 4. HOW IT WORKS: CHANGELOG OUTPUT MODES
```
- [P1] .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:107 | 2 | three adjacent code spans close early, so `{path}` renders outside code while `> Spec folder: ` and ` (Level {N})` render inside it, instead of one literal blockquote | replace line 107 with:
```
4. A spec-folder blockquote, ``> Spec folder: `{path}` (Level {N})``, when the release has a spec folder.
```
- [P2] .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:190 | 5 | the untagged-release skip gate is the sixth item under "Determine version" although it says "first check" and overrides the bump, so a reader calculates and chooses a bump before learning it is not applied | move lines 190-195 to after line 186
- [P2] .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:279 | 6 | the packet-local scope note sits between the pre-write structural checks and the after-writing shared checks, interrupting the validation sequence for a global entry | move line 279 to after line 288

### .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md
- clean

### .skilled/skills/sk-doc/sk-create-changelog/references/README.md
- clean

### .skilled/skills/sk-doc/sk-create-changelog/references/topology-edge-cases.md
- [P2] .skilled/skills/sk-doc/sk-create-changelog/references/topology-edge-cases.md:23 | 4 | OVERVIEW has no When to Use block; the reference skeleton puts Purpose then When to Use ahead of the body content | insert after line 23:
```
**When to Use**:

- Deciding where a new entry belongs, global or packet-local.
- Resolving a hub folder or a phase child to the component it touched.
- Handling back-dating, a source-format conflict or the optional GitHub release.
```
- [P2] .skilled/skills/sk-doc/sk-create-changelog/references/topology-edge-cases.md:41 | 7 | one paragraph packs four placement rules, so the reader has to unpack the global rule, the packet routing, the `skilled` exception and the tie rule from prose | replace line 41 with:
```
- A changelog for the users of a component goes global.
- Spec packets no longer get their own changelog, so a packet's completed work, a phase child included, goes into the global entry for the component it touched.
- The folders under `.skilled/changelog/` are plain component names, except `skilled`, the framework release line, which the workflow writes to only when the operator names it.
- For ties between components, or no match at all, follow the selection rules in SKILL.md section 6 rather than guessing a folder.
```

### .skilled/skills/sk-doc/sk-create-changelog/references/version-bump-rules.md
- [P2] .skilled/skills/sk-doc/sk-create-changelog/references/version-bump-rules.md:23 | 4 | OVERVIEW has no When to Use block; the reference skeleton puts Purpose then When to Use ahead of the body content | insert after line 23:
```
**When to Use**:

- The SKILL.md bump table is not concrete enough for the change in hand.
- A large change risks being called major when it is not breaking.
- You are writing a component's first entry, or extending an open `skilled` release.
```

### .skilled/skills/sk-doc/sk-create-changelog/references/worked-examples.md
- [P2] .skilled/skills/sk-doc/sk-create-changelog/references/worked-examples.md:23 | 4 | OVERVIEW has no When to Use block; the reference skeleton puts Purpose then When to Use ahead of the body content | insert after line 23:
```
**When to Use**:

- Modeling a new global entry on a filled-in example rather than a blank template.
- Checking what the selection rules leave out of a compact entry.
- Seeing how an expanded section reads before writing one.
```
