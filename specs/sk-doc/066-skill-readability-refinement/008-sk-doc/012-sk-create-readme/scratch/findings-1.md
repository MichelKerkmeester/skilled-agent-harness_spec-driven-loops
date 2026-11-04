### .skilled/skills/sk-doc/sk-create-readme/README.md
- [P2] .skilled/skills/sk-doc/sk-create-readme/README.md:29 | 4 | OVERVIEW opens with `### Why This Skill Exists` before `### What It Does`; `skill-readme-template.md` §2 says "Inside OVERVIEW, start with `### What It Does`. Add up to two optional subsections after it." | Move lines 29-31 to after line 37.
- [P2] .skilled/skills/sk-doc/sk-create-readme/README.md:31 | 7 | The seven-sentence paragraph carries three separate failure modes (no README, memory drift, one template everywhere) plus the skill's answer, so the reader has to unpack it; the packet's own pre-publish check caps paragraphs at 2-4 sentences. | Replace line 31 with:
```
A folder with no README makes every visitor start from zero. They open every file, guess the entry point and wonder what is safe to touch.

Two more failures make the problem worse:

- **A README written from memory.** It drifts fast. Paths get renamed and commands get replaced, so the document quietly starts lying to the next reader.
- **A single template applied everywhere.** It produces the wrong shape: a source-code folder needs topology and boundaries rather than a features list.

create-readme exists to read the real folder first and pick the shape that fits before writing a word.
```
- [P1] .skilled/skills/sk-doc/sk-create-readme/README.md:35 | 8 | The artifact inventory stops at the two README shapes, so the `ARCHITECTURE.md` output that `SKILL.md` §2 and `ROUTER.md` §3 route here is invisible: the shape table has no row for it, the related-documents index omits `assets/architecture-template.md`, and the AT A GLANCE row names only `README.md`. | Change `one of two current-state artifacts` to `one of two current-state README shapes`; change line 23 to `| **Produces** | A \`README.md\` in the target folder, or a skill package's \`ARCHITECTURE.md\` |`; insert after line 44 a blank line and `The packet also writes a skill package's \`ARCHITECTURE.md\` from \`assets/architecture-template.md\`, a system document for a maintainer rather than a third README shape.`; insert after the `readme-code-template.md` row (line 158): `| [\`assets/architecture-template.md\`](./assets/architecture-template.md) | Fillable scaffold for a skill package's \`ARCHITECTURE.md\` |`
- [P2] .skilled/skills/sk-doc/sk-create-readme/README.md:92 | 7 | The lifecycle packs four separate steps into one paragraph, while `SKILL.md` §3 lists the same four as a numbered sequence. | Replace line 92 with:
```
Every run follows one lifecycle no matter which artifact comes out the other end:

1. Read local evidence only: the target folder, nearby documentation, package files, config files and any commands already in use. It never documents a file, command, API or metric it has not confirmed.
2. Route by artifact type and folder purpose to the matching output shape described above.
3. Draft current-state content in the smallest useful shape, copying the matching template as a scaffold and deleting sections that do not earn their place rather than leaving placeholders.
4. Validate the authored markdown and confirm every local link resolves before calling the work done.
```
- [P2] .skilled/skills/sk-doc/sk-create-readme/README.md:102 | 5 | The when-to-use and skip gate sits in §5 after QUICK START and HOW IT WORKS, so a reader learns to skip the skill only after reading how to run it. | Move lines 102-106 to immediately before `### The Two Output Shapes` (line 39); §5 then holds `### Related Skills` only and no H2 number changes.
- [P2] .skilled/skills/sk-doc/sk-create-readme/README.md:143 | 8 | §8 VERIFICATION lists the fleet audit and the naming check but omits the two per-README gates the packet ships, and §9 RELATED DOCUMENTS omits the packet's `manual-testing-playbook/`, so none of the three entry points is discoverable from the README. | Insert after the `Authored name casing` row (line 147): `| Reference integrity | \`python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py <path/to/README.md>\` | \`SUMMARY files=1 pass=1 fail=0\`, every link and path-shaped code span resolves |` and `| Derived counts | \`python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py <path/to/README.md>\` | \`SUMMARY files=1 pass=1 fail=0\`, every count claim is proven by the folder |`; insert after the `scripts/audit_readmes.py` row (line 160): `| [\`manual-testing-playbook/manual-testing-playbook.md\`](./manual-testing-playbook/manual-testing-playbook.md) | Operator playbook: four scenarios across README routing, evidence-first writing and code-folder navigation |`

### .skilled/skills/sk-doc/sk-create-readme/ROUTER.md
- [P2] .skilled/skills/sk-doc/sk-create-readme/ROUTER.md:23 | 7 | §1 packs three mechanisms into one paragraph: the request triggers, the three artifact templates and the fallback route. | Replace line 23 with:
```
Requests reach this skill when they name a README, a folder readme, a code-folder readme or `/create:readme`, and when they ask for developer orientation on a project, skill, feature, component or source-code directory.

It routes to three artifact templates under `assets/`:

- `readme-template.md` for a general README.
- `readme-code-template.md` for a source-code folder.
- `architecture-template.md` for a skill package's `ARCHITECTURE.md`.

It falls back to `references/README.md` and the `references/readme/` overflow group when the artifact type or folder purpose is unclear.
```
- [P2] .skilled/skills/sk-doc/sk-create-readme/ROUTER.md:43 | 1 | The sentence has no verb and restates the four parts of the section that follows, so it reads as a leftover list fragment at the head of the machine section. | Delete line 43.
- [P2] .skilled/skills/sk-doc/sk-create-readme/ROUTER.md:139 | 6 | The human routing rule, including the skip branch the manual-testing playbooks tell a reader to find in §3, sits after the full Python pseudocode block, so a reader meets the machine projection before the decision it projects. | Move lines 139-149 to immediately before `### Smart Router Pseudocode` (line 62).

### .skilled/skills/sk-doc/sk-create-readme/SKILL.md
- [P2] .skilled/skills/sk-doc/sk-create-readme/SKILL.md:44 | 1 | §2 never names the no-match `UNKNOWN_FALLBACK` outcome, which `skill-md-template.md`'s routing checklist requires of Section 2 and which `ROUTER.md` already implements. | Insert after line 48: `When nothing matches, report \`UNKNOWN_FALLBACK\` with the router's disambiguation checklist instead of guessing.`
- [P2] .skilled/skills/sk-doc/sk-create-readme/SKILL.md:240 | 1 | §8 states its rule groups as plain paragraph labels (`Always:`, `Never:`, `Human Voice Rules apply:`, `Escalate if:`), so they render as ordinary prose instead of the template's `ALWAYS`, `NEVER` and `ESCALATE IF` subsections. | Replace line 240 with `### ALWAYS`, line 252 with `### NEVER`, line 261 with `### HUMAN VOICE RULES` and line 271 with `### ESCALATE IF`.

### .skilled/skills/sk-doc/sk-create-readme/assets/architecture-template.md
- clean

### .skilled/skills/sk-doc/sk-create-readme/assets/readme-code-template.md
- clean

### .skilled/skills/sk-doc/sk-create-readme/assets/readme-template.md
- [P1] .skilled/skills/sk-doc/sk-create-readme/assets/readme-template.md:38 | 1 | The selection decision tree names `readme_code_template.md`, a file that does not exist; the template is `readme-code-template.md`, the name line 30 links and the only code-folder template in `assets/`. | Replace `readme_code_template.md` with `readme-code-template.md`.
- [P2] .skilled/skills/sk-doc/sk-create-readme/assets/readme-template.md:32 | 1 | `when someone can land in the folder and need orientation` does not agree with its subject. | Replace `and need orientation` with `and needs orientation`.

### .skilled/skills/sk-doc/sk-create-readme/references/README.md
- clean

### .skilled/skills/sk-doc/sk-create-readme/references/readme/quality-and-checklist.md
- [P2] .skilled/skills/sk-doc/sk-create-readme/references/readme/quality-and-checklist.md:17 | 3 | The intro runs three sentences and ends with a pure contents pointer (`this file carries the DQI weighting, per-section checks and the full itemized checklist`), which the reference template caps at 1-2 sentences and the intro rule rejects as a pointer. | Replace line 17 with: `Open this before delivering a drafted README, when the structural validator has passed but a command nobody ran or a link that resolves nowhere could still ship. It is overflow detail behind \`SKILL.md\` Section 7 (validation and audit), which lists the short pre-publish checks.`
- [P2] .skilled/skills/sk-doc/sk-create-readme/references/readme/quality-and-checklist.md:23 | 4 | OVERVIEW opens with an unlabeled purpose paragraph, then Core Principle, then When to Use; the reference skeleton puts Purpose then When to Use ahead of any other overview content. | Replace lines 23-30 with:
```
### Purpose

Quality for a README is weighted toward structure and content, then style. Score against the components below, then walk the pre-publish checklist for the sections the README actually includes.

### When to Use

- Scoring a drafted README before delivery
- Confirming an included section meets its quality bar
- Running the final pre-publish pass

### Core Principle

Apply every check only to the sections that fit the README's audience and purpose. Do not force sections a code folder never needed.
```
